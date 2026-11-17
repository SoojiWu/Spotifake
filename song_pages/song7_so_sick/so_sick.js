"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const SONG_ID = 7;
    const audio = document.getElementById("audioPlayer");
    const playBtn = document.getElementById("playBtn");
    const playIcon = document.getElementById("playIcon");
    const progressBar = document.getElementById("progressBar");
    const currentTimeLabel = document.getElementById("currentTime");
    const durationLabel = document.getElementById("duration");
    const volumeBar = document.getElementById("volumeBar");
    const muteBtn = document.getElementById("muteBtn");
    const volumeIcon = document.getElementById("volumeIcon");
    const autoScrollToggle = document.getElementById("autoScrollToggle");
    const prevLyricBtn = document.getElementById("prevLyricBtn");
    const nextLyricBtn = document.getElementById("nextLyricBtn");
    const skipTopBtn = document.getElementById("skipTopBtn");
    const lyricsBox = document.getElementById("lyricsBox");
    const playbackSpeedBtn = document.getElementById("playbackSpeedBtn");
    const speedLabel = document.getElementById("speedLabel");
    const songFavBtn = document.getElementById("songFavBtn");
    const favIcon = document.getElementById("favIcon");
    const songVisualizer = document.getElementById("songVisualizer");

    let isAutoScroll = localStorage.getItem("spotifake_autoscroll") !== "false";
    let currentLineIndex = -1;
    let lastVolume = 0.75;
    let isSeeking = false;
    let currentSpeedIdx = 1;
    const speeds = [0.75, 1.0, 1.25, 1.5];

    // Inherit Theme from localStorage
    const savedTheme = localStorage.getItem("spotifake_theme") || "cyber";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Parse timestamp value (supports raw seconds, "M:SS" strings, or MMSS numbers like 101 -> 61s when applicable)
    function parseLyricTimestamp(rawTime, useMmssFormat) {
        if (typeof rawTime === "string") {
            const trimmed = rawTime.trim();
            if (trimmed.includes(":")) {
                const parts = trimmed.split(":");
                return (Number(parts[0]) || 0) * 60 + (Number(parts[1]) || 0);
            }
            rawTime = Number(trimmed);
        }
        const num = Number(rawTime);
        if (!Number.isFinite(num) || num < 0) return 0;
        if (useMmssFormat && num >= 100) {
            const mins = Math.floor(num / 100);
            const secs = num - (mins * 100);
            return mins * 60 + secs;
        }
        return num;
    }

    // Format seconds to M:SS
    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${String(s).padStart(2, "0")}`;
    }

    // Dynamically populate #lyricsBox from lyricsData.js if available
    const customLyricsData = (window.CURRENT_SONG_LYRICS && Array.isArray(window.CURRENT_SONG_LYRICS))
        ? window.CURRENT_SONG_LYRICS
        : (window.SONG_LYRICS && Array.isArray(window.SONG_LYRICS[SONG_ID]) ? window.SONG_LYRICS[SONG_ID] : null);

    if (lyricsBox && customLyricsData && customLyricsData.length > 0) {
        const usesMmss = customLyricsData.some(item => Number(item.time) >= 300);
        lyricsBox.replaceChildren();
        customLyricsData.forEach((line, idx) => {
            const sec = parseLyricTimestamp(line.time, usesMmss);
            const p = document.createElement("p");
            p.className = "lyrics-line upcoming";
            p.dataset.time = String(sec);
            p.dataset.rawTime = String(line.time);
            p.dataset.index = String(idx);
            p.tabIndex = 0;
            p.setAttribute("role", "button");
            p.setAttribute("aria-label", `Skip to ${formatTime(sec)}: ${line.text}`);
            p.textContent = line.text;
            lyricsBox.appendChild(p);
        });
    }

    const lyricLines = [...document.querySelectorAll(".lyrics-line")];

    // Helper: Smoothly center a lyric element inside #lyricsBox using exact bounding rects
    function scrollToLyricElement(lineEl, smooth = true) {
        if (!lyricsBox || !lineEl) return;
        const boxRect = lyricsBox.getBoundingClientRect();
        const lineRect = lineEl.getBoundingClientRect();
        const relativeTop = (lineRect.top - boxRect.top) + lyricsBox.scrollTop;
        const targetScroll = relativeTop - (lyricsBox.clientHeight / 2) + (lineEl.clientHeight / 2);
        lyricsBox.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: smooth ? "smooth" : "auto"
        });
    }

    // Play / Pause toggle
    function togglePlay() {
        if (audio.paused) {
            audio.play().then(() => updatePlayState(true)).catch(console.error);
        } else {
            audio.pause();
            updatePlayState(false);
        }
    }

    function updatePlayState(isPlaying) {
        if (playIcon) {
            playIcon.className = isPlaying ? "fa-solid fa-circle-pause" : "fa-solid fa-circle-play";
        }
        if (playBtn) playBtn.title = isPlaying ? "Pause" : "Play";

        // Animate visualizer bars
        if (songVisualizer) {
            const bars = songVisualizer.querySelectorAll(".vbar");
            bars.forEach((b, i) => {
                b.style.animation = isPlaying ? `vbarBounce ${0.45 + (i % 3) * 0.15}s infinite alternate ease-in-out` : "none";
            });
        }
    }

    if (playBtn) playBtn.addEventListener("click", togglePlay);

    // Audio progress update
    audio.addEventListener("timeupdate", () => {
        const total = audio.duration;
        if (Number.isFinite(total) && total > 0) {
            currentTimeLabel.textContent = formatTime(audio.currentTime);
            durationLabel.textContent = formatTime(total);

            if (!isSeeking && progressBar) {
                const pct = (audio.currentTime / total) * 100;
                progressBar.value = Math.round(pct);
                progressBar.style.background = `linear-gradient(to right, var(--primary, #FFEA00) ${pct}%, #333 ${pct}%)`;
            }
        }

        syncLyrics(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", () => {
        if (durationLabel) durationLabel.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("play", () => updatePlayState(true));
    audio.addEventListener("pause", () => updatePlayState(false));

    // Seekbar interactions
    if (progressBar) {
        progressBar.addEventListener("input", () => {
            isSeeking = true;
            const total = audio.duration;
            if (Number.isFinite(total) && total > 0) {
                const targetSec = (Number(progressBar.value) / 100) * total;
                currentTimeLabel.textContent = formatTime(targetSec);
                syncLyrics(targetSec, true);
            }
        });

        progressBar.addEventListener("change", () => {
            const total = audio.duration;
            if (Number.isFinite(total) && total > 0) {
                audio.currentTime = (Number(progressBar.value) / 100) * total;
                syncLyrics(audio.currentTime, true);
            }
            isSeeking = false;
        });
    }

    // Volume controls
    if (volumeBar) {
        volumeBar.addEventListener("input", () => {
            audio.volume = Number(volumeBar.value);
            audio.muted = false;
            if (audio.volume > 0) lastVolume = audio.volume;
            updateVolumeUI();
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener("click", () => {
            if (audio.muted || audio.volume === 0) {
                audio.muted = false;
                audio.volume = lastVolume || 0.75;
            } else {
                lastVolume = audio.volume;
                audio.muted = true;
            }
            if (volumeBar) volumeBar.value = audio.muted ? 0 : audio.volume;
            updateVolumeUI();
        });
    }

    function updateVolumeUI() {
        if (!volumeIcon || !volumeBar) return;
        const isMuted = audio.muted || audio.volume === 0;
        volumeIcon.className = isMuted ? "fa-solid fa-volume-xmark" : (audio.volume < 0.5 ? "fa-solid fa-volume-low" : "fa-solid fa-volume-high");
        const pct = (audio.muted ? 0 : audio.volume) * 100;
        volumeBar.style.background = `linear-gradient(to right, var(--primary, #FFEA00) ${pct}%, #333 ${pct}%)`;
    }
    updateVolumeUI();

    // Auto-Scroll toggle UI & behavior
    function updateAutoScrollUI() {
        if (!autoScrollToggle) return;
        autoScrollToggle.classList.toggle("active", isAutoScroll);
        autoScrollToggle.setAttribute("aria-pressed", String(isAutoScroll));
        const span = autoScrollToggle.querySelector("span");
        if (span) span.textContent = isAutoScroll ? "Auto-Scroll On" : "Auto-Scroll Off";
    }
    updateAutoScrollUI();

    if (autoScrollToggle) {
        autoScrollToggle.addEventListener("click", () => {
            isAutoScroll = !isAutoScroll;
            localStorage.setItem("spotifake_autoscroll", String(isAutoScroll));
            updateAutoScrollUI();

            // Immediately center the active line when turned on
            if (isAutoScroll) {
                const targetIdx = currentLineIndex >= 0 ? currentLineIndex : 0;
                if (lyricLines[targetIdx]) {
                    scrollToLyricElement(lyricLines[targetIdx], true);
                }
            }
        });
    }

    // SPOTIFY SYNCHRONIZED LYRICS: Container-bounded smooth centering
    function syncLyrics(time, forceScroll = false) {
        if (lyricLines.length === 0) return;

        let activeIdx = -1;
        for (let i = 0; i < lyricLines.length; i++) {
            const lineTime = Number(lyricLines[i].dataset.time);
            if (time >= lineTime) {
                activeIdx = i;
            } else {
                break;
            }
        }

        if (activeIdx === currentLineIndex && !forceScroll) return;
        currentLineIndex = activeIdx;

        lyricLines.forEach((lineEl, idx) => {
            if (idx === activeIdx) {
                lineEl.classList.add("active", "current");
                lineEl.classList.remove("past", "upcoming");
                lineEl.setAttribute("aria-current", "true");

                if (isAutoScroll) {
                    scrollToLyricElement(lineEl, true);
                }
            } else if (idx < activeIdx) {
                lineEl.classList.add("past");
                lineEl.classList.remove("active", "current", "upcoming");
                lineEl.removeAttribute("aria-current");
            } else {
                lineEl.classList.add("upcoming");
                lineEl.classList.remove("active", "current", "past");
                lineEl.removeAttribute("aria-current");
            }
        });
    }

    // Skip to lyric line by index
    function skipToLine(index) {
        if (lyricLines.length === 0) return;
        if (index < 0) index = 0;
        if (index >= lyricLines.length) index = lyricLines.length - 1;

        const targetTime = Number(lyricLines[index].dataset.time);
        audio.currentTime = targetTime;
        if (audio.paused) {
            audio.play().then(() => updatePlayState(true)).catch(console.error);
        }

        currentLineIndex = -1;
        syncLyrics(targetTime, true);
        scrollToLyricElement(lyricLines[index], true);
    }

    // Click on any lyric line to skip
    lyricLines.forEach((lineEl, index) => {
        lineEl.addEventListener("click", () => skipToLine(index));
        lineEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                skipToLine(index);
            }
        });
    });

    // Prev / Next Line buttons
    if (prevLyricBtn) {
        prevLyricBtn.addEventListener("click", () => {
            const target = currentLineIndex > 0 ? currentLineIndex - 1 : 0;
            skipToLine(target);
        });
    }

    if (nextLyricBtn) {
        nextLyricBtn.addEventListener("click", () => {
            const target = currentLineIndex < lyricLines.length - 1 ? currentLineIndex + 1 : currentLineIndex;
            skipToLine(target);
        });
    }

    if (skipTopBtn) {
        skipTopBtn.addEventListener("click", () => {
            skipToLine(0);
            if (lyricsBox) lyricsBox.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Playback Speed Toggle
    if (playbackSpeedBtn) {
        playbackSpeedBtn.addEventListener("click", () => {
            currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
            const newSpeed = speeds[currentSpeedIdx];
            audio.playbackRate = newSpeed;
            if (speedLabel) speedLabel.textContent = `${newSpeed}x`;
        });
    }

    // Favorite System Sync
    let favorites = new Set(JSON.parse(localStorage.getItem("spotifake_favorites") || "[]"));
    function updateFavUI() {
        if (!songFavBtn || !favIcon) return;
        const isFav = favorites.has(SONG_ID);
        favIcon.className = isFav ? "fa-solid fa-heart" : "fa-regular fa-heart";
        songFavBtn.classList.toggle("active", isFav);
        songFavBtn.style.color = isFav ? "var(--loud-accent, #FF007F)" : "";
        songFavBtn.style.borderColor = isFav ? "var(--loud-accent, #FF007F)" : "";
        const span = songFavBtn.querySelector("span");
        if (span) span.textContent = isFav ? "Favorited" : "Favorite";
    }
    updateFavUI();

    if (songFavBtn) {
        songFavBtn.addEventListener("click", () => {
            if (favorites.has(SONG_ID)) {
                favorites.delete(SONG_ID);
            } else {
                favorites.add(SONG_ID);
            }
            localStorage.setItem("spotifake_favorites", JSON.stringify([...favorites]));
            updateFavUI();
        });
    }

    // Highlight initial line at 0:00 on load
    syncLyrics(0, false);

    // Keyboard Shortcuts
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && !e.target.matches("input, textarea, button, [role='button']")) {
            e.preventDefault();
            togglePlay();
        } else if (e.code === "ArrowLeft" && e.ctrlKey) {
            audio.currentTime = Math.max(0, audio.currentTime - 5);
        } else if (e.code === "ArrowRight" && e.ctrlKey) {
            audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
        }
    });
});
