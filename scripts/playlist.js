/**
 * Spotifake | Liked Songs Playlist Controller
 * BSIT / IT Extension Project
 * Functional Remove Action & Audio Playback
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    // Audio Player Elements
    const audio = $("#audioPlayer");
    const playButton = $("#play");
    const previousButton = $("#backward");
    const nextButton = $("#forward");
    const shuffleButton = $("#shuffle");
    const repeatButton = $("#repeat");
    const progressBar = $("#progressBar");
    const currentTime = $("#currentTime");
    const duration = $("#duration");
    const volumeBar = $("#volumeBar");
    const muteButton = $("#muteButton");

    // Player Bar Info
    const currentImage = $("#currentSongImage");
    const currentTitle = $("#currentSongTitle");
    const currentArtist = $("#currentSongArtist");
    const playerFavBtn = $("#playerFavBtn");
    const musicVisualizer = $("#musicVisualizer");

    // Playlist Elements
    const playlistTracksList = $("#playlistTracksList");
    const playlistTrackCount = $("#playlistTrackCount");
    const playlistTotalDuration = $("#playlistTotalDuration");
    const playlistPlayAllBtn = $("#playlistPlayAllBtn");
    const playlistPlayIcon = $("#playlistPlayIcon");
    const playlistShuffleBtn = $("#playlistShuffleBtn");
    const playlistSearchInput = $("#playlistSearchInput");
    const restoreSongsBtn = $("#restoreSongsBtn");
    const playlistAlert = $("#playlistAlert");
    const playlistAlertText = $("#playlistAlertText");

    // Profile & Cursor
    const profileBtn = $("#profileBtn");
    const profileTaskbar = $("#profileTaskbar");
    const cursorDot = $("#cursorDot");
    const cursorRing = $("#cursorRing");

    // Master 10 Songs Database (Strictly Songs only, no separate artist albums)
    const MASTER_SONGS = [
        { id: 1, title: "It Depends", artist: "Chris Brown ft. Bryson Tiller", album: "11:11 (Deluxe)", duration: "4:33", durationSec: 273, date: "Nov 2, 2026", cover: "../photos/ItDepends.jpg", src: "../SONGS/Chris Brown - It Depends (Audio) ft. Bryson Tiller.mp3" },
        { id: 2, title: "With You", artist: "Chris Brown", album: "Exclusive", duration: "4:15", durationSec: 255, date: "Nov 2, 2026", cover: "../photos/WithYou.jpg", src: "../SONGS/Chris Brown - With You (Official HD Video).mp3" },
        { id: 3, title: "Shoulda Never", artist: "Kehlani ft. Usher", album: "Crash", duration: "3:06", durationSec: 186, date: "Nov 3, 2026", cover: "../photos/ShouldaNever.jpg", src: "../SONGS/Kehlani - Shoulda Never (feat. Usher) [Official Audio].mp3" },
        { id: 4, title: "Because of You", artist: "Ne-Yo", album: "Because of You", duration: "3:47", durationSec: 227, date: "Nov 4, 2026", cover: "../photos/BecauseofYou.jpg", src: "../SONGS/Ne-Yo - Because Of You (Official Music Video).mp3" },
        { id: 5, title: "Miss Independent", artist: "Ne-Yo", album: "Year of the Gentleman", duration: "3:52", durationSec: 232, date: "Nov 4, 2026", cover: "../photos/MissIndependent.jpg", src: "../SONGS/Ne-Yo - Miss Independent.mp3" },
        { id: 6, title: "Sexy Love", artist: "Ne-Yo", album: "In My Own Words", duration: "3:40", durationSec: 220, date: "Nov 4, 2026", cover: "../photos/SexyLove.jpg", src: "../SONGS/Ne-Yo - Sexy Love [Official Video].mp3" },
        { id: 7, title: "So Sick", artist: "Ne-Yo", album: "In My Own Words", duration: "3:01", durationSec: 181, date: "Nov 5, 2026", cover: "../photos/SoSick.jpg", src: "../SONGS/Ne-Yo - So Sick (Official Music Video).mp3" },
        { id: 8, title: "Love Me Not", artist: "Ravyn Lenae", album: "Bird's Eye", duration: "3:33", durationSec: 213, date: "Nov 5, 2026", cover: "../photos/LoveMeNot.jpg", src: "../SONGS/Ravyn Lenae - Love Me Not (Official Music Video).mp3" },
        { id: 9, title: "Timeless", artist: "The Weeknd ft. Playboi Carti", album: "Hurry Up Tomorrow", duration: "4:16", durationSec: 256, date: "Nov 6, 2026", cover: "../photos/Timeless.jpg", src: "../SONGS/The Weeknd - Timeless with Playboi Carti (Official Music Video).mp3" },
        { id: 10, title: "MILLION DOLLAR BABY", artist: "Tommy Richman", album: "Coyote", duration: "2:46", durationSec: 166, date: "Nov 6, 2026", cover: "../photos/MillionDollarBaby.jpg", src: "../SONGS/Tommy Richman - MILLION DOLLAR BABY (Official Music Video).mp3" }
    ];

    // Read stored playlist songs or initialize with all 10
    function getStoredPlaylist() {
        const stored = localStorage.getItem("spotifake_playlist_song_ids");
        if (stored) {
            try {
                const ids = JSON.parse(stored);
                if (Array.isArray(ids)) {
                    return MASTER_SONGS.filter(s => ids.includes(s.id));
                }
            } catch (e) {
                console.error("Error reading stored playlist:", e);
            }
        }
        return [...MASTER_SONGS];
    }

    let playlistSongs = getStoredPlaylist();
    let currentPlaylistIndex = 0;
    let isShuffle = localStorage.getItem("spotifake_shuffle") === "1";
    let repeatMode = localStorage.getItem("spotifake_repeat") || "off";
    let lastVolume = 0.75;
    const SONG_LYRICS = window.SONG_LYRICS || {};

    function syncShuffleButtonsPl() {
        if (shuffleButton) {
            shuffleButton.classList.toggle("active", isShuffle);
            shuffleButton.setAttribute("aria-pressed", String(isShuffle));
            shuffleButton.title = isShuffle ? "Disable shuffle" : "Enable shuffle";
        }
        if (playlistShuffleBtn) {
            playlistShuffleBtn.classList.toggle("active", isShuffle);
            playlistShuffleBtn.setAttribute("aria-pressed", String(isShuffle));
        }
    }

    function setShuffleModePlState(enabled) {
        isShuffle = Boolean(enabled);
        localStorage.setItem("spotifake_shuffle", isShuffle ? "1" : "0");
        if (queueCtrl) {
            const cur = getCurrentSong();
            queueCtrl.syncShuffleState(cur && cur.id);
        }
        syncShuffleButtonsPl();
    }

    const queueCtrl = window.SpotifakeQueue
        ? window.SpotifakeQueue.createController({
            getSongs: () => playlistSongs,
            getCurrentIndex: () => currentPlaylistIndex,
            loadIndex: (idx, autoplay, meta) => loadTrack(idx, autoplay, meta),
            getRepeatMode: () => repeatMode,
            isShuffleEnabled: () => isShuffle,
            setShuffleEnabled: (val) => setShuffleModePlState(val),
            onToast: (msg) => {
                if (typeof showAlert === "function") showAlert(msg);
            }
        })
        : null;
    if (queueCtrl) queueCtrl.bindQueueButton($("#queueButton"));
    syncShuffleButtonsPl();

    /* Helper: Format Time */
    function formatTime(sec) {
        if (!Number.isFinite(sec) || sec < 0) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${String(s).padStart(2, "0")}`;
    }

    /* Helper: Calculate Total Playlist Duration */
    function calculateTotalDuration() {
        const totalSec = playlistSongs.reduce((acc, cur) => acc + cur.durationSec, 0);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${mins} min ${secs} sec`;
    }

    /* Update Header Stats */
    function updateHeaderStats() {
        if (playlistTrackCount) {
            playlistTrackCount.textContent = `${playlistSongs.length} songs`;
        }
        if (playlistTotalDuration) {
            playlistTotalDuration.textContent = calculateTotalDuration();
        }
    }

    /* Show Temporary Alert Banner */
    let alertTimeout = null;
    function showAlert(msg) {
        if (!playlistAlert || !playlistAlertText) return;
        playlistAlertText.textContent = msg;
        playlistAlert.removeAttribute("hidden");
        clearTimeout(alertTimeout);
        alertTimeout = setTimeout(() => {
            playlistAlert.setAttribute("hidden", "true");
        }, 3000);
    }

    /* Save Playlist IDs to LocalStorage */
    function persistPlaylist() {
        const ids = playlistSongs.map(s => s.id);
        localStorage.setItem("spotifake_playlist_song_ids", JSON.stringify(ids));
        updateHeaderStats();
    }

    /* ==========================================================
       FUNCTIONAL REMOVE ACTION (DELETE FROM PLAYLIST ONLY)
       ========================================================== */
    function removeTrackFromPlaylist(songId, rowEl) {
        const id = Number(songId);
        const songToRemove = playlistSongs.find(s => s.id === id);
        if (!songToRemove) return;

        // Animate row removal smoothly
        if (rowEl) {
            rowEl.classList.add("is-removing");
        }

        setTimeout(() => {
            playlistSongs = playlistSongs.filter(s => s.id !== id);
            persistPlaylist();
            showAlert(`Removed "${songToRemove.title}" from Liked Songs`);

            // If the removed song was playing, advance to next
            if (currentPlaylistIndex >= playlistSongs.length) {
                currentPlaylistIndex = Math.max(0, playlistSongs.length - 1);
            }

            renderPlaylistTable();
        }, 260);
    }

    /* ==========================================================
       RENDER PLAYLIST TABLE
       ========================================================== */
    function renderPlaylistTable() {
        if (!playlistTracksList) return;
        playlistTracksList.replaceChildren();

        const filterQuery = (playlistSearchInput?.value || "").trim().toLowerCase();

        let visibleSongs = playlistSongs;
        if (filterQuery) {
            visibleSongs = playlistSongs.filter(s =>
                s.title.toLowerCase().includes(filterQuery) ||
                s.artist.toLowerCase().includes(filterQuery) ||
                s.album.toLowerCase().includes(filterQuery)
            );
        }

        updateHeaderStats();

        if (playlistSongs.length === 0) {
            playlistTracksList.innerHTML = `
                <div class="playlist-empty-state">
                    <i class="fa-solid fa-heart-crack"></i>
                    <h3>Your Liked Songs Playlist is Empty</h3>
                    <p>You have removed all songs from this playlist. Click the button below to restore all 10 collection songs anytime!</p>
                    <button type="button" class="playlist-restore-btn" id="emptyRestoreBtn">
                        <i class="fa-solid fa-rotate-left"></i> Restore All 10 Songs
                    </button>
                </div>
            `;
            const emptyRestore = $("#emptyRestoreBtn");
            if (emptyRestore) emptyRestore.addEventListener("click", restoreAllSongs);
            return;
        }

        if (visibleSongs.length === 0) {
            playlistTracksList.innerHTML = `
                <div class="playlist-empty-state">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <h3>No Matching Songs Found</h3>
                    <p>No tracks match "${playlistSearchInput.value}". Clear filter to show all songs.</p>
                </div>
            `;
            return;
        }

        visibleSongs.forEach((song, idx) => {
            const row = document.createElement("div");
            const isCurrent = playlistSongs[currentPlaylistIndex]?.id === song.id;
            const isPlaying = isCurrent && !audio.paused;

            row.className = `playlist-track-row ${isCurrent ? "is-current" : ""} ${isPlaying ? "is-playing" : ""}`;
            row.dataset.songId = String(song.id);

            row.innerHTML = `
                <div class="track-col-num">
                    <span class="row-num">${idx + 1}</span>
                    <i class="fa-solid fa-play row-play-icon"></i>
                </div>

                <div class="track-col-title">
                    <img src="${song.cover}" alt="${song.title}" class="track-thumb" loading="lazy">
                    <div class="track-text-wrap">
                        <p class="track-row-title">${song.title}</p>
                        <p class="track-row-artist">${song.artist}</p>
                    </div>
                </div>

                <div class="track-col-album">${song.album}</div>

                <div class="track-col-date">${song.date}</div>

                <div class="track-col-time">${song.duration}</div>

                <!-- Functional Queue & Remove Buttons -->
                <div class="track-col-action">
                    <button type="button" class="btn-queue-track" title="Add &quot;${song.title}&quot; to queue" aria-label="Add ${song.title} to queue">
                        <i class="fa-solid fa-bars-staggered"></i>
                    </button>
                    <button type="button" class="btn-remove-track" title="Remove &quot;${song.title}&quot; from playlist" aria-label="Remove ${song.title}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;

            // Clicking row plays track
            row.addEventListener("click", (e) => {
                if (e.target.closest(".btn-remove-track") || e.target.closest(".btn-queue-track")) return;
                const plIdx = playlistSongs.findIndex(s => s.id === song.id);
                if (plIdx !== -1) {
                    if (queueCtrl) queueCtrl.setContext("Liked Songs", playlistSongs.map(s => s.id), song.id);
                    loadTrack(plIdx, true);
                }
            });

            // Clicking queue button
            const qBtn = row.querySelector(".btn-queue-track");
            if (qBtn) {
                qBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (queueCtrl) queueCtrl.addToQueue(song.id);
                });
            }

            // Clicking remove button
            const removeBtn = row.querySelector(".btn-remove-track");
            if (removeBtn) {
                removeBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    removeTrackFromPlaylist(song.id, row);
                });
            }

            playlistTracksList.appendChild(row);
        });
    }

    /* Restore All Songs */
    function restoreAllSongs() {
        playlistSongs = [...MASTER_SONGS];
        persistPlaylist();
        renderPlaylistTable();
        showAlert("Restored all 10 songs to Liked Songs playlist");
    }

    if (restoreSongsBtn) {
        restoreSongsBtn.addEventListener("click", restoreAllSongs);
    }

    if (playlistSearchInput) {
        playlistSearchInput.addEventListener("input", renderPlaylistTable);
    }

    /* ==========================================================
       AUDIO PLAYBACK CONTROLLER
       ========================================================== */
    function getCurrentSong() {
        return playlistSongs[currentPlaylistIndex] || playlistSongs[0] || MASTER_SONGS[0];
    }

    function updatePlayButton() {
        const isPlaying = !audio.paused && !audio.ended;

        // Update footer play button
        const icon = playButton.querySelector("i");
        if (icon) {
            icon.className = `player-btns fa-solid ${isPlaying ? "fa-circle-pause" : "fa-circle-play"}`;
        }
        playButton.title = isPlaying ? "Pause" : "Play";

        // Update header big play button
        if (playlistPlayIcon) {
            playlistPlayIcon.className = `fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`;
        }

        if (musicVisualizer) musicVisualizer.classList.toggle("is-active", isPlaying);

        // Update rows
        $$(".playlist-track-row").forEach(row => {
            const sid = Number(row.dataset.songId);
            const isThis = playlistSongs[currentPlaylistIndex]?.id === sid;
            row.classList.toggle("is-current", isThis);
            row.classList.toggle("is-playing", isThis && isPlaying);
        });
    }

    function loadTrack(index, autoplay = true, meta = {}) {
        if (playlistSongs.length === 0) return;
        if (index < 0 || index >= playlistSongs.length) index = 0;

        const song = playlistSongs[index];
        const targetAbsSrc = new URL(song.src, window.location.href).href;
        if (!meta.forceReload && index === currentPlaylistIndex && audio.src === targetAbsSrc) {
            if (queueCtrl) queueCtrl.onTrackLoaded(song.id, meta);
            if (audio.ended) {
                audio.currentTime = 0;
            }
            if (autoplay && audio.paused) {
                audio.play().then(updatePlayButton).catch(console.error);
            } else {
                updatePlayButton();
            }
            return;
        }

        currentPlaylistIndex = index;
        if (queueCtrl) queueCtrl.onTrackLoaded(song.id, meta);

        audio.src = song.src;
        currentTitle.textContent = song.title;
        currentArtist.textContent = song.artist;
        currentImage.src = song.cover;

        if (autoplay) {
            audio.play().then(updatePlayButton).catch(console.error);
        } else {
            updatePlayButton();
        }
    }

    function togglePlay() {
        if (playlistSongs.length === 0) return;
        if (audio.paused) {
            audio.play().then(updatePlayButton).catch(console.error);
        } else {
            audio.pause();
            updatePlayButton();
        }
    }

    function nextTrack(isAutoEnded = false) {
        if (playlistSongs.length === 0) return;
        if (queueCtrl) {
            const res = queueCtrl.advanceNext(isAutoEnded);
            if (res && res.ended) {
                audio.pause();
                audio.currentTime = 0;
                updatePlayButton();
            }
            return;
        }
        if (currentPlaylistIndex < playlistSongs.length - 1) {
            loadTrack(currentPlaylistIndex + 1, true);
        } else if (repeatMode === "all" || !isAutoEnded) {
            loadTrack(0, true);
        } else {
            audio.pause();
            audio.currentTime = 0;
            updatePlayButton();
        }
    }

    function previousTrack() {
        if (playlistSongs.length === 0) return;
        if (queueCtrl) {
            const res = queueCtrl.stepPrevious(audio.currentTime);
            if (res && res.restart) {
                audio.currentTime = 0;
            }
            return;
        }
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        if (currentPlaylistIndex > 0) {
            loadTrack(currentPlaylistIndex - 1, true);
        } else if (repeatMode === "all") {
            loadTrack(playlistSongs.length - 1, true);
        } else {
            audio.currentTime = 0;
        }
    }

    playButton.addEventListener("click", togglePlay);
    nextButton.addEventListener("click", () => nextTrack(false));
    previousButton.addEventListener("click", previousTrack);

    if (playlistPlayAllBtn) {
        playlistPlayAllBtn.addEventListener("click", togglePlay);
    }

    // Shuffle & Repeat with Glowing Dot (Spotify-style Fisher-Yates bag)
    function toggleShuffle() {
        setShuffleModePlState(!isShuffle);
    }

    shuffleButton.addEventListener("click", toggleShuffle);
    if (playlistShuffleBtn) {
        playlistShuffleBtn.addEventListener("click", () => {
            if (!isShuffle) {
                setShuffleModePlState(true);
                if (queueCtrl && playlistSongs.length > 0) {
                    const pick = playlistSongs[Math.floor(Math.random() * playlistSongs.length)];
                    queueCtrl.setContext("Liked Songs", playlistSongs.map(s => s.id), pick.id);
                    const pIdx = playlistSongs.findIndex(s => s.id === pick.id);
                    if (pIdx !== -1) loadTrack(pIdx, true);
                }
            } else {
                setShuffleModePlState(false);
            }
        });
    }

    repeatButton.addEventListener("click", () => {
        const modes = ["off", "all", "one"];
        repeatMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
        repeatButton.classList.toggle("active", repeatMode !== "off");
        repeatButton.dataset.mode = repeatMode;
    });

    const savePlPlayback = (force = false) => {
        window.SpotifakePlayback?.save(() => audio, () => playlistSongs[currentPlaylistIndex], force);
    };
    window.SpotifakePlayback?.bindLifecycle?.({
        getAudio: () => audio,
        getSong: () => playlistSongs[currentPlaylistIndex],
        onPageShow: (saved) => {
            const idx = playlistSongs.findIndex(s => Number(s.id) === Number(saved.songId));
            if (idx === -1) return;
            if (idx !== currentPlaylistIndex) loadTrack(idx, false);
            window.SpotifakePlayback.restoreCurrentAudio?.({
                songId: playlistSongs[idx].id,
                getAudio: () => audio,
                onResume: (wasPlaying) => {
                    if (wasPlaying) return audio.play().then(updatePlayButton);
                    if (!audio.paused) audio.pause();
                    updatePlayButton();
                }
            });
        }
    });

    audio.addEventListener("play", () => savePlPlayback(true));
    audio.addEventListener("pause", () => savePlPlayback(true));
    audio.addEventListener("timeupdate", () => {
        const total = audio.duration;
        if (!Number.isFinite(total) || total <= 0) return;
        savePlPlayback(false);
        currentTime.textContent = formatTime(audio.currentTime);
        duration.textContent = formatTime(total);
        const pct = (audio.currentTime / total) * 100;
        progressBar.value = Math.round(pct);
        progressBar.style.background = `linear-gradient(to right, var(--loud-magenta) ${pct}%, #282834 ${pct}%)`;
    });

    audio.addEventListener("ended", () => {
        if (repeatMode === "one") {
            audio.currentTime = 0;
            audio.play().then(updatePlayButton).catch(console.error);
        } else {
            nextTrack(true);
        }
    });

    progressBar.addEventListener("change", () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime = (Number(progressBar.value) / 100) * audio.duration;
        }
    });

    volumeBar.addEventListener("input", () => {
        audio.volume = Number(volumeBar.value);
        audio.muted = false;
        lastVolume = audio.volume;
        const pct = audio.volume * 100;
        volumeBar.style.background = `linear-gradient(to right, var(--loud-magenta) ${pct}%, #282834 ${pct}%)`;
    });

    muteButton.addEventListener("click", () => {
        audio.muted = !audio.muted;
        const icon = muteButton.querySelector("i");
        if (icon) {
            icon.className = audio.muted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
        }
    });

    /* Sync Saved User Profile Name & Avatar */
    function syncPlaylistUserProfileUI() {
        const DEFAULT_AVATAR = "../photos/spotifyICON/lydbayot.jpg";
        let profile = null;
        try {
            profile = JSON.parse(localStorage.getItem("spotifake_user_profile") || "null");
        } catch (e) {
            profile = null;
        }
        const displayName = (profile && profile.name && profile.name.trim()) || "JSON.TTUM";
        const rawAvatar = (profile && profile.avatar) || DEFAULT_AVATAR;
        const avatarSrc = window.SpotifakePaths ? window.SpotifakePaths.asset(rawAvatar) : rawAvatar;

        $$(".profile-name, .taskbar-name, .playlist-author-name").forEach(el => {
            el.textContent = displayName;
        });
        $$(".profile-avatar, .taskbar-avatar, .playlist-author-avatar").forEach(img => {
            img.src = avatarSrc;
            img.alt = `${displayName} Avatar`;
        });
    }
    syncPlaylistUserProfileUI();
    window.addEventListener("pageshow", syncPlaylistUserProfileUI);

    /* Profile Taskbar */
    if (profileBtn && profileTaskbar) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            profileTaskbar.classList.toggle("open");
        });
        document.addEventListener("click", () => profileTaskbar.classList.remove("open"));
    }

    $$(".taskbar-item.logout").forEach(btn => {
        btn.addEventListener("click", () => {
            sessionStorage.removeItem("spotifake-user");
            localStorage.removeItem("spotifake-user");
        });
    });

    $("#taskSettings")?.addEventListener("click", () => $("#modalSettings")?.removeAttribute("hidden"));
    $$("[data-close]").forEach(btn => {
        btn.addEventListener("click", () => {
            const mId = btn.getAttribute("data-close");
            const m = $(`#${mId}`);
            if (m) m.setAttribute("hidden", "true");
        });
    });

    /* Theme Engine & Cursor */
    const themeSelect = $("#settingTheme");
    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("spotifake_theme", theme);
    }
    const savedTheme = localStorage.getItem("spotifake_theme") || "cyber";
    applyTheme(savedTheme);
    if (themeSelect) {
        themeSelect.value = savedTheme;
        themeSelect.addEventListener("change", () => applyTheme(themeSelect.value));
    }

    const cursorToggle = $("#settingCursorToggle");
    function applyCursor(enabled) {
        document.body.classList.toggle("cursor-disabled", !enabled);
        localStorage.setItem("spotifake_cursor", enabled ? "1" : "0");
        document.body.style.cursor = enabled ? "none" : "";
    }
    const savedCursor = localStorage.getItem("spotifake_cursor") !== "0";
    if (cursorToggle) {
        cursorToggle.checked = savedCursor;
        cursorToggle.addEventListener("change", () => applyCursor(cursorToggle.checked));
    }
    applyCursor(savedCursor);

    if (cursorDot && cursorRing) {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
        window.addEventListener("pointermove", (e) => {
            mx = e.clientX; my = e.clientY;
            cursorDot.style.left = `${mx}px`; cursorDot.style.top = `${my}px`;
        });
        function animCursor() {
            rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
            cursorRing.style.left = `${rx}px`; cursorRing.style.top = `${ry}px`;
            requestAnimationFrame(animCursor);
        }
        animCursor();
    }

    // Initialize table & player
    renderPlaylistTable();
    if (window.SpotifakePlayback) {
        window.SpotifakePlayback.restore({
            list: playlistSongs,
            getAudio: () => audio,
            loadAt: loadTrack,
            onResume: (wasPlaying) => {
                if (wasPlaying) audio.play().then(updatePlayButton).catch(() => {});
            }
        });
    } else {
        loadTrack(0, false);
    }
});
