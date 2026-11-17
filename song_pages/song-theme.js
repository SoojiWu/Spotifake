(function () {
    "use strict";

    function syncMainTheme() {
        try {
            const theme = localStorage.getItem("spotifake_theme") || "cyber";
            document.documentElement.setAttribute("data-theme", theme);
        } catch (err) {
            document.documentElement.setAttribute("data-theme", "cyber");
        }
    }

    function initSongPageCanvas() {
        const entry = window.SpotifakeCanvas?.byPath(window.location.pathname, "../../VID_card/") || null;
        const playerCard = document.querySelector(".player-card");
        const audio = document.getElementById("audioPlayer");
        if (!entry || !playerCard || !audio) return;
        if (playerCard.querySelector(".sp-song-canvas-stage")) return;

        const stage = document.createElement("div");
        stage.className = "sp-song-canvas-stage";
        stage.setAttribute("aria-hidden", "true");

        const video = document.createElement("video");
        video.className = "sp-song-canvas-video";
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
        video.loop = true;
        video.playsInline = true;
        video.preload = "metadata";
        window.SpotifakeCanvas?.setBaseCrop(video, entry.crop);
        window.SpotifakeCanvas?.bindAutoCrop(video);
        video.src = entry.src;

        stage.appendChild(video);
        playerCard.prepend(stage);

        function setCanvasState(active) {
            video.classList.toggle("is-visible", Boolean(active));
            playerCard.classList.toggle("has-canvas", Boolean(active));
        }

        function syncSongPageCanvas(shouldPlay) {
            video.muted = true;
            video.defaultMuted = true;
            video.volume = 0;
            video.loop = true;

            if (shouldPlay) {
                video.play().then(() => {
                    if (!audio.paused && !audio.ended) {
                        setCanvasState(true);
                    } else {
                        setCanvasState(false);
                        video.pause();
                    }
                }).catch(() => {
                    setCanvasState(false);
                });
            } else {
                setCanvasState(false);
                video.pause();
            }
        }

        video.addEventListener("error", () => {
            setCanvasState(false);
        });

        audio.addEventListener("play", () => syncSongPageCanvas(true));
        audio.addEventListener("pause", () => syncSongPageCanvas(false));
        audio.addEventListener("ended", () => syncSongPageCanvas(false));

        const albumArtWrapper = playerCard.querySelector(".album-art-wrapper");
        const playBtn = document.getElementById("playBtn");
        if (albumArtWrapper && !albumArtWrapper.dataset.canvasBound) {
            albumArtWrapper.dataset.canvasBound = "1";
            albumArtWrapper.title = "Click to play/pause";
            albumArtWrapper.addEventListener("click", () => {
                if (playBtn) {
                    playBtn.click();
                } else if (audio.paused) {
                    audio.play().catch(() => {});
                } else {
                    audio.pause();
                }
            });
        }

        if (!audio.paused && !audio.ended) {
            syncSongPageCanvas(true);
        }
    }

    function initSongPagePlaybackContinuity() {
        const pageSongId = window.SpotifakePlayback?.getSongIdByPath?.(window.location.pathname) || null;
        const audio = document.getElementById("audioPlayer");
        if (!pageSongId || !audio) return;

        syncSongPageVolume(audio);

        if (audio.dataset.continuityBound) return;
        audio.dataset.continuityBound = "1";

        let hasPlaybackActivity = false;
        const getSongObj = () => ({ id: pageSongId });
        const canPersistPage = () => {
            if (hasPlaybackActivity || !audio.paused || (Number(audio.currentTime) || 0) > 0) {
                return true;
            }
            const cur = window.SpotifakePlayback?.read?.();
            return Boolean(cur && Number(cur.songId) === pageSongId);
        };

        const saveSongPagePlayback = (force = false) => {
            if (!canPersistPage()) return;
            window.SpotifakePlayback?.save(() => audio, getSongObj, force);
        };

        audio.addEventListener("play", () => {
            hasPlaybackActivity = true;
            saveSongPagePlayback(true);
        });
        audio.addEventListener("pause", () => {
            hasPlaybackActivity = true;
            saveSongPagePlayback(true);
        });
        audio.addEventListener("seeked", () => {
            hasPlaybackActivity = true;
            saveSongPagePlayback(true);
        });
        audio.addEventListener("timeupdate", () => {
            if (!audio.paused || hasPlaybackActivity) {
                saveSongPagePlayback(false);
            }
        });

        const restoreFromStorage = () => {
            if (!window.SpotifakePlayback?.restoreCurrentAudio) return;
            const restored = window.SpotifakePlayback.restoreCurrentAudio({
                songId: pageSongId,
                getAudio: () => audio,
                onResume: (wasPlaying) => {
                    if (wasPlaying) return audio.play();
                    if (!audio.paused) audio.pause();
                }
            });
            if (restored) {
                hasPlaybackActivity = true;
                applySavedCanvasTime(restored.canvasTime);
            }
        };

        window.SpotifakePlayback?.bindLifecycle?.({
            getAudio: () => audio,
            getSong: getSongObj,
            canSave: canPersistPage,
            onPageShow: () => restoreFromStorage()
        });

        // Run after the song page script registers its audio/lyrics listeners in DOMContentLoaded
        setTimeout(restoreFromStorage, 0);
    }

    function syncSongPageVolume(audio) {
        if (!audio) return;
        const volumeBar = document.getElementById("volumeBar");
        const muteBtn = document.getElementById("muteBtn");
        try {
            const rawVol = localStorage.getItem("spotifake_volume");
            if (rawVol !== null) {
                const parsed = Number(rawVol);
                if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) {
                    audio.volume = parsed;
                }
            }
            const rawMuted = localStorage.getItem("spotifake_muted");
            if (rawMuted !== null) {
                audio.muted = rawMuted === "1";
            }
            if (volumeBar) {
                volumeBar.value = String(audio.muted ? 0 : audio.volume);
            }
        } catch (err) {
            /* Ignore storage errors */
        }

        if (volumeBar && !volumeBar.dataset.volSyncBound) {
            volumeBar.dataset.volSyncBound = "1";
            volumeBar.addEventListener("input", () => {
                setTimeout(() => {
                    try {
                        localStorage.setItem("spotifake_volume", String(audio.volume));
                        localStorage.setItem("spotifake_muted", audio.muted ? "1" : "0");
                    } catch (err) {}
                }, 0);
            });
        }
        if (muteBtn && !muteBtn.dataset.volSyncBound) {
            muteBtn.dataset.volSyncBound = "1";
            muteBtn.addEventListener("click", () => {
                setTimeout(() => {
                    try {
                        if (!audio.muted) localStorage.setItem("spotifake_volume", String(audio.volume));
                        localStorage.setItem("spotifake_muted", audio.muted ? "1" : "0");
                    } catch (err) {}
                }, 0);
            });
        }
    }

    function applySavedCanvasTime(canvasTime) {
        const target = Number(canvasTime);
        if (!Number.isFinite(target) || target <= 0) return;
        const video = document.querySelector(".sp-song-canvas-video");
        if (!video) return;
        const seekCanvas = () => {
            if (Number.isFinite(video.duration) && video.duration > 0.2) {
                try {
                    video.currentTime = target % video.duration;
                } catch (err) {}
            }
        };
        if (video.readyState >= 1) {
            seekCanvas();
        } else {
            video.addEventListener("loadedmetadata", seekCanvas, { once: true });
        }
    }

    function initSongPageFeatures() {
        initSongPageCanvas();
        initSongPagePlaybackContinuity();
    }

    syncMainTheme();

    window.addEventListener("storage", function (e) {
        if (e.key === "spotifake_theme") syncMainTheme();
    });
    window.addEventListener("pageshow", syncMainTheme);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSongPageFeatures);
    } else {
        initSongPageFeatures();
    }
})();
