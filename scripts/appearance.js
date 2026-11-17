/* ==========================================================
   Spotifake | Appearance Mode Manager
   Supports: Light, Dark, System (Time-of-Day Auto), Pure Black (OLED)
   ========================================================== */
(function () {
    "use strict";

    const currentScriptSrc = (document.currentScript && document.currentScript.getAttribute("src")) || "";
    const prefixMatch = currentScriptSrc.match(/^((?:\.\.\/)*)scripts\/appearance\.js(?:[?#].*)?$/i);
    const ROOT_PREFIX = prefixMatch ? prefixMatch[1] : "";
    const ROOT_ASSET_DIRS = /^(photos|PFPs|albumC|SONGS|VID_card|song_pages|pages|styles|scripts)\//i;

    /** Normalize a relative project path back to root-canonical form for portable localStorage persistence. */
    function toCanonicalPath(path) {
        if (!path || /^(?:data:|blob:|https?:|\/|#)/i.test(path)) return path;
        const stripped = String(path).replace(/^(?:\.\.?\/)+/, "");
        return ROOT_ASSET_DIRS.test(stripped) ? stripped : path;
    }

    /** Resolve a root-canonical or relative project path for the current HTML page depth. */
    function resolveAssetPath(path) {
        if (!path || /^(?:data:|blob:|https?:|\/|#)/i.test(path)) return path;
        const stripped = String(path).replace(/^(?:\.\.?\/)+/, "");
        return ROOT_ASSET_DIRS.test(stripped) ? `${ROOT_PREFIX}${stripped}` : path;
    }

    const STORAGE_KEY = "spotifake_appearance_mode";
    const VALID_MODES = new Set(["light", "dark", "system", "pure-black"]);
    const DAY_START_HOUR = 6;   // 6:00 AM -> Light Mode
    const NIGHT_START_HOUR = 18; // 6:00 PM -> Dark Mode
    const META_COLORS = {
        light: "#F3F5FA",
        dark: "#09090E",
        "pure-black": "#000000"
    };

    let autoSwitchTimerId = null;

    function getSavedMode() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return VALID_MODES.has(saved) ? saved : "dark";
        } catch (err) {
            return "dark";
        }
    }

    /** Resolve System mode by local time: Light 06:00–17:59, Dark 18:00–05:59. */
    function getSystemResolved(now = new Date()) {
        const hour = now.getHours();
        return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR ? "light" : "dark";
    }

    function msUntilNextBoundary(now = new Date()) {
        const next = new Date(now.getTime());
        const hour = now.getHours();
        if (hour < DAY_START_HOUR) {
            next.setHours(DAY_START_HOUR, 0, 0, 50);
        } else if (hour < NIGHT_START_HOUR) {
            next.setHours(NIGHT_START_HOUR, 0, 0, 50);
        } else {
            next.setDate(next.getDate() + 1);
            next.setHours(DAY_START_HOUR, 0, 0, 50);
        }
        return Math.max(1000, next.getTime() - now.getTime());
    }

    function scheduleSystemTimer(settingMode) {
        if (autoSwitchTimerId) {
            clearTimeout(autoSwitchTimerId);
            autoSwitchTimerId = null;
        }
        if (settingMode !== "system") return;

        autoSwitchTimerId = setTimeout(() => {
            if (getSavedMode() === "system") {
                applyAppearanceMode("system", false);
            }
        }, msUntilNextBoundary());
    }

    function resolveMode(mode) {
        if (mode === "system") return getSystemResolved();
        return VALID_MODES.has(mode) && mode !== "system" ? mode : "dark";
    }

    function updateMetaThemeColor(resolved) {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute("content", META_COLORS[resolved] || META_COLORS.dark);
        }
    }

    function syncAppearanceUI(settingMode, resolvedMode) {
        const buttons = document.querySelectorAll("[data-appearance-option]");
        buttons.forEach((btn) => {
            const option = btn.getAttribute("data-appearance-option");
            const isActive = option === settingMode;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        const statusEl = document.getElementById("settingAppearanceStatus");
        if (statusEl) {
            if (settingMode === "system") {
                const label = resolvedMode === "light"
                    ? "Light (Daytime 6 AM–6 PM)"
                    : "Dark (Night 6 PM–6 AM)";
                statusEl.textContent = `Auto by time of day (currently ${label})`;
            } else if (settingMode === "pure-black") {
                statusEl.textContent = "True #000000 OLED pitch-black canvas";
            } else if (settingMode === "light") {
                statusEl.textContent = "Crisp Cyber Daylight interface";
            } else {
                statusEl.textContent = "Classic Spotifake Cyber Dark canvas";
            }
        }
    }

    function applyAppearanceMode(mode, persist = true) {
        const settingMode = VALID_MODES.has(mode) ? mode : "dark";
        const resolved = resolveMode(settingMode);

        document.documentElement.setAttribute("data-appearance-setting", settingMode);
        document.documentElement.setAttribute("data-appearance", resolved);
        updateMetaThemeColor(resolved);

        if (persist) {
            try {
                localStorage.setItem(STORAGE_KEY, settingMode);
            } catch (err) {
                /* Ignore storage quota issues */
            }
        }

        scheduleSystemTimer(settingMode);
        syncAppearanceUI(settingMode, resolved);
        window.dispatchEvent(new CustomEvent("spotifake:appearance-change", {
            detail: { setting: settingMode, resolved }
        }));
        return { setting: settingMode, resolved };
    }

    function bindAppearanceButtons() {
        const buttons = document.querySelectorAll("[data-appearance-option]");
        buttons.forEach((btn) => {
            if (btn.dataset.appearanceBound === "1") return;
            btn.dataset.appearanceBound = "1";
            btn.addEventListener("click", () => {
                const mode = btn.getAttribute("data-appearance-option");
                applyAppearanceMode(mode, true);
            });
        });

        const settingMode = getSavedMode();
        syncAppearanceUI(settingMode, resolveMode(settingMode));
    }

    // Apply immediately before first paint to prevent theme flash
    applyAppearanceMode(getSavedMode(), false);

    // Re-evaluate time-of-day when tab becomes active/focused (covers sleep/wake transitions)
    function refreshIfSystemChanged() {
        if (getSavedMode() !== "system") return;
        const currentResolved = document.documentElement.getAttribute("data-appearance");
        const nextResolved = getSystemResolved();
        if (currentResolved !== nextResolved) {
            applyAppearanceMode("system", false);
        } else {
            scheduleSystemTimer("system");
        }
    }

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") refreshIfSystemChanged();
    });
    window.addEventListener("focus", refreshIfSystemChanged);

    // Cross-tab & browser history navigation sync
    window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY) {
            applyAppearanceMode(getSavedMode(), false);
        }
    });
    window.addEventListener("pageshow", () => {
        applyAppearanceMode(getSavedMode(), false);
        bindAppearanceButtons();
    });

    const THEME_SWATCH_DOTS = {
        cyber: "#FFEA00",
        emerald: "#1DB954",
        cyberpunk: "#b5179e",
        crimson: "#ff4d6d",
        "electric-blue": "#38bdf8"
    };

    const upgradedSelects = [];
    let activeOpenDropdown = null;

    function closeAllCustomSelects(exceptCtrl = null) {
        upgradedSelects.forEach((ctrl) => {
            if (ctrl !== exceptCtrl) ctrl.close();
        });
    }

    function upgradeCustomSelect(selectEl) {
        if (!selectEl || selectEl.dataset.spCustomSelect === "1") return null;
        selectEl.dataset.spCustomSelect = "1";

        const isThemeSelect = selectEl.id === "settingTheme";
        const isCompact = selectEl.classList.contains("lib-select") || selectEl.id === "settingCrossfade";

        const wrap = document.createElement("div");
        wrap.className = `sp-custom-select${isCompact ? " is-compact" : ""}`;

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "sp-select-trigger";
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");
        trigger.innerHTML = `
            <span class="sp-select-trigger-label"></span>
            <i class="fa-solid fa-chevron-down sp-select-chevron" aria-hidden="true"></i>
        `;

        const menu = document.createElement("div");
        menu.className = "sp-select-menu";
        menu.setAttribute("role", "listbox");
        menu.hidden = true;

        selectEl.parentNode.insertBefore(wrap, selectEl);
        wrap.appendChild(selectEl);
        wrap.appendChild(trigger);
        document.body.appendChild(menu);

        selectEl.classList.add("sp-native-select-hidden");
        selectEl.tabIndex = -1;
        selectEl.setAttribute("aria-hidden", "true");

        let isOpen = false;
        let closeTimer = null;

        function buildSwatchDot(val) {
            const dot = THEME_SWATCH_DOTS[val];
            return dot ? `<span class="sp-select-swatch" style="background:${dot};"></span>` : "";
        }

        function syncSelectionUI(flashTrigger = false) {
            const opts = [...selectEl.options];
            const selectedOpt = opts.find(o => o.value === selectEl.value) || opts[0];
            const labelSpan = trigger.querySelector(".sp-select-trigger-label");
            if (labelSpan && selectedOpt) {
                const dotHtml = isThemeSelect ? buildSwatchDot(selectedOpt.value) : "";
                labelSpan.innerHTML = `${dotHtml}<span class="sp-select-text"></span>`;
                labelSpan.querySelector(".sp-select-text").textContent = selectedOpt.textContent;
            }

            if (flashTrigger) {
                trigger.classList.remove("is-just-picked");
                void trigger.offsetWidth;
                trigger.classList.add("is-just-picked");
            }

            menu.innerHTML = "";
            opts.forEach((opt) => {
                const isSel = opt.value === (selectedOpt && selectedOpt.value);
                const optBtn = document.createElement("button");
                optBtn.type = "button";
                optBtn.className = `sp-select-option${isSel ? " is-selected" : ""}`;
                optBtn.setAttribute("role", "option");
                optBtn.setAttribute("aria-selected", isSel ? "true" : "false");
                optBtn.dataset.value = opt.value;

                const mainSpan = document.createElement("span");
                mainSpan.className = "sp-select-opt-main";
                if (isThemeSelect) {
                    mainSpan.innerHTML = buildSwatchDot(opt.value);
                }
                const textNode = document.createElement("span");
                textNode.textContent = opt.textContent;
                mainSpan.appendChild(textNode);

                const checkIcon = document.createElement("i");
                checkIcon.className = "fa-solid fa-check sp-select-check";
                checkIcon.setAttribute("aria-hidden", "true");

                optBtn.appendChild(mainSpan);
                optBtn.appendChild(checkIcon);

                optBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const prevVal = selectEl.value;
                    optBtn.classList.add("is-just-clicked");
                    selectEl.value = opt.value;
                    syncSelectionUI(true);
                    if (prevVal !== opt.value) {
                        selectEl.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                    setTimeout(() => close(), 90);
                });

                menu.appendChild(optBtn);
            });
        }

        function positionMenu() {
            const rect = trigger.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const isTabletOrMobile = vw <= 1023;
            const isMobile = vw <= 767;
            const gutter = isMobile ? (vw <= 480 ? 10 : 12) : 8;

            let minW;
            let maxW;
            if (isMobile) {
                maxW = Math.max(120, Math.min(isThemeSelect ? 236 : 188, vw - gutter * 2));
                minW = Math.min(maxW, Math.max(rect.width, isThemeSelect ? Math.min(188, vw - gutter * 2) : 118));
            } else if (isTabletOrMobile) {
                maxW = Math.max(140, Math.min(isThemeSelect ? 276 : 215, vw - gutter * 2));
                minW = Math.min(maxW, Math.max(rect.width, isThemeSelect ? 210 : 140));
            } else {
                minW = Math.max(rect.width, isThemeSelect ? 235 : 155);
                maxW = Math.min(320, vw - 16);
            }

            menu.style.width = isTabletOrMobile ? "max-content" : "";
            menu.style.minWidth = `${minW}px`;
            menu.style.maxWidth = `${maxW}px`;

            const renderedW = isTabletOrMobile
                ? Math.min(maxW, Math.max(minW, menu.offsetWidth || minW))
                : minW;
            const renderedH = Math.min(vh - gutter * 2, menu.offsetHeight || menu.scrollHeight || 220);

            const spaceBelow = vh - rect.bottom - gutter;
            const spaceAbove = rect.top - gutter;
            const openUpwards = spaceBelow < renderedH + 6 && spaceAbove > spaceBelow;
            const alignRight = !isTabletOrMobile || rect.right >= vw / 2;

            menu.style.transformOrigin = `${openUpwards ? "bottom" : "top"} ${alignRight ? "right" : "left"}`;

            let minLeft = gutter;
            let maxLeft = Math.max(gutter, vw - renderedW - gutter);
            if (isTabletOrMobile) {
                const modalRect = trigger.closest(".cyber-modal")?.getBoundingClientRect();
                if (modalRect && modalRect.width - 16 >= renderedW) {
                    minLeft = Math.max(gutter, modalRect.left + 8);
                    maxLeft = Math.min(maxLeft, modalRect.right - renderedW - 8);
                }
            }

            const desiredLeft = alignRight ? (rect.right - renderedW) : rect.left;
            maxLeft = Math.max(minLeft, maxLeft);
            const left = Math.max(minLeft, Math.min(desiredLeft, maxLeft));
            menu.style.left = `${Math.round(left)}px`;

            const desiredTop = openUpwards
                ? (rect.top - renderedH - 6)
                : (rect.bottom + 6);
            const top = Math.max(gutter, Math.min(desiredTop, vh - renderedH - gutter));
            menu.style.top = `${Math.round(top)}px`;
        }

        function open() {
            if (isOpen) return;
            closeAllCustomSelects(ctrl);
            clearTimeout(closeTimer);
            syncSelectionUI(false);
            menu.hidden = false;
            positionMenu();
            void menu.offsetWidth;
            isOpen = true;
            activeOpenDropdown = ctrl;
            trigger.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
            menu.classList.add("is-open");
        }

        function close() {
            if (!isOpen && menu.hidden) return;
            isOpen = false;
            if (activeOpenDropdown === ctrl) activeOpenDropdown = null;
            trigger.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
            menu.classList.remove("is-open");
            clearTimeout(closeTimer);
            closeTimer = setTimeout(() => {
                if (!isOpen) menu.hidden = true;
            }, 190);
        }

        // Intercept programmatic `select.value = "..."` so custom UI sticks to any saved choice
        const valueDescriptor = Object.getOwnPropertyDescriptor(window.HTMLSelectElement?.prototype || {}, "value");
        if (valueDescriptor && valueDescriptor.get && valueDescriptor.set) {
            Object.defineProperty(selectEl, "value", {
                configurable: true,
                get() {
                    return valueDescriptor.get.call(this);
                },
                set(v) {
                    valueDescriptor.set.call(this, v);
                    syncSelectionUI(false);
                }
            });
        }

        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            if (isOpen) close();
            else open();
        });

        trigger.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open();
            } else if (e.key === "Escape") {
                close();
            }
        });

        selectEl.addEventListener("change", () => syncSelectionUI(false));
        syncSelectionUI(false);

        const ctrl = { open, close, sync: () => syncSelectionUI(false), reposition: () => { if (isOpen) positionMenu(); } };
        upgradedSelects.push(ctrl);
        return ctrl;
    }

    function initCustomSelects() {
        document.querySelectorAll("select.setting-select, select.lib-select").forEach(upgradeCustomSelect);
        upgradedSelects.forEach(c => c.sync());
    }

    document.addEventListener("click", (e) => {
        if (activeOpenDropdown && !e.target.closest(".sp-custom-select") && !e.target.closest(".sp-select-menu")) {
            closeAllCustomSelects();
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && activeOpenDropdown) {
            closeAllCustomSelects();
        }
    });
    window.addEventListener("resize", () => {
        if (activeOpenDropdown) activeOpenDropdown.reposition();
    });
    window.addEventListener("orientationchange", () => {
        if (activeOpenDropdown) activeOpenDropdown.reposition();
    });
    document.addEventListener("scroll", (e) => {
        if (activeOpenDropdown && !e.target?.closest?.(".sp-select-menu")) {
            activeOpenDropdown.reposition();
        }
    }, { passive: true, capture: true });
    window.addEventListener("scroll", () => {
        if (activeOpenDropdown) activeOpenDropdown.reposition();
    }, true);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            bindAppearanceButtons();
            initCustomSelects();
            requestAnimationFrame(() => upgradedSelects.forEach(c => c.sync()));
        });
    } else {
        bindAppearanceButtons();
        initCustomSelects();
    }

    window.SpotifakeAppearance = {
        getSetting: getSavedMode,
        getResolved: () => resolveMode(getSavedMode()),
        resolveSystemForDate: getSystemResolved,
        setMode: (mode) => applyAppearanceMode(mode, true),
        syncUI: bindAppearanceButtons,
        syncSelects: () => upgradedSelects.forEach(c => c.sync())
    };

    /* Shared playback continuity across page navigation & reloads */
    const PLAYBACK_STATE_KEY = "spotifake_playback_state";
    let lastPlaybackSaveAt = 0;
    let pendingRestoreGuard = null;

    function readPlaybackState() {
        try {
            const parsed = JSON.parse(localStorage.getItem(PLAYBACK_STATE_KEY) || "null");
            return parsed && parsed.songId ? parsed : null;
        } catch (err) {
            return null;
        }
    }

    function savePlaybackState(getAudio, getSong, force = false) {
        const now = Date.now();
        if (!force && now - lastPlaybackSaveAt < 800) return;
        const audioEl = typeof getAudio === "function" ? getAudio() : null;
        const song = typeof getSong === "function" ? getSong() : null;
        if (!audioEl || !song) return;

        const curTime = Number(audioEl.currentTime) || 0;
        if (pendingRestoreGuard) {
            if (Number(song.id) !== pendingRestoreGuard.songId || now >= pendingRestoreGuard.until) {
                pendingRestoreGuard = null;
            } else if (pendingRestoreGuard.resumeTime > 2 && curTime < 1) {
                // Keep saved non-zero timestamp intact until async seek finishes
                return;
            } else if (Math.abs(curTime - pendingRestoreGuard.resumeTime) <= 1.5) {
                pendingRestoreGuard = null;
            }
        }

        const canvasVideo = document.querySelector("#npvCanvasVideo, .sp-song-canvas-video");
        const canvasTime = canvasVideo && Number.isFinite(canvasVideo.currentTime)
            ? Number(canvasVideo.currentTime)
            : 0;

        lastPlaybackSaveAt = now;
        try {
            localStorage.setItem(PLAYBACK_STATE_KEY, JSON.stringify({
                songId: song.id,
                currentTime: curTime,
                isPlaying: !audioEl.paused && !audioEl.ended,
                canvasTime,
                updatedAt: now
            }));
        } catch (err) {
            /* Ignore storage errors */
        }
    }

    function applyAudioSeekAndResume(audioEl, saved, opts = {}) {
        if (!audioEl || !saved) return;
        const { onResume, onSeekApplied, getAudio } = opts;
        const resumeTime = Math.max(0, Number(saved.currentTime) || 0);
        const wantPlay = Boolean(saved.isPlaying);
        const targetSongId = Number(saved.songId);

        if (resumeTime > 0 && audioEl.preload === "metadata") {
            audioEl.preload = "auto";
        }
        pendingRestoreGuard = resumeTime > 0
            ? { songId: targetSongId, resumeTime, until: Date.now() + 3500 }
            : null;

        let canceled = false;
        let settingTime = false;
        let resumeAttempted = false;
        let userPaused = false;
        const initialSrc = audioEl.currentSrc || audioEl.src || "";

        const activeAudio = () => (typeof getAudio === "function" ? getAudio() : audioEl) || audioEl;

        const cleanupListeners = () => {
            audioEl.removeEventListener("seeking", onExternalSeek);
            audioEl.removeEventListener("pause", onManualPause);
            audioEl.removeEventListener("canplay", ensureSeekPosition);
            audioEl.removeEventListener("playing", onPlayingVerify);
            document.removeEventListener("pointerdown", onUnlockGesture, true);
            document.removeEventListener("keydown", onUnlockGesture, true);
        };

        const onExternalSeek = () => {
            if (!settingTime) {
                canceled = true;
                pendingRestoreGuard = null;
                cleanupListeners();
            }
        };

        const onManualPause = () => {
            if (resumeAttempted) {
                userPaused = true;
                document.removeEventListener("pointerdown", onUnlockGesture, true);
                document.removeEventListener("keydown", onUnlockGesture, true);
            }
        };

        const performSeek = () => {
            const el = activeAudio();
            if (!el || canceled) return false;
            if (initialSrc && (el.currentSrc || el.src) && (el.currentSrc || el.src) !== initialSrc) {
                canceled = true;
                cleanupListeners();
                return false;
            }
            if (resumeTime > 0) {
                const dur = el.duration;
                const target = (Number.isFinite(dur) && dur > 0)
                    ? Math.min(resumeTime, Math.max(0, dur - 0.25))
                    : resumeTime;
                if (target > 0 && Math.abs((Number(el.currentTime) || 0) - target) > 0.4) {
                    settingTime = true;
                    try {
                        el.currentTime = target;
                    } catch (err) {
                        /* Ignore seek errors before buffer is seekable */
                    }
                    settingTime = false;
                }
            }
            el.dispatchEvent(new Event("timeupdate"));
            if (typeof onSeekApplied === "function") onSeekApplied(el);
            return true;
        };

        const ensureSeekPosition = () => {
            if (canceled) return;
            const el = activeAudio();
            if (resumeTime > 1 && Math.abs((Number(el.currentTime) || 0) - resumeTime) > 1.2) {
                performSeek();
            }
        };

        const onPlayingVerify = () => {
            document.removeEventListener("pointerdown", onUnlockGesture, true);
            document.removeEventListener("keydown", onUnlockGesture, true);
            ensureSeekPosition();
            if (Math.abs((Number(activeAudio().currentTime) || 0) - resumeTime) <= 1.5) {
                pendingRestoreGuard = null;
            }
        };

        const onUnlockGesture = (e) => {
            if (canceled || userPaused) {
                cleanupListeners();
                return;
            }
            if (e.target && e.target.closest("a, button, input, select, textarea, [role='button'], .album-art-wrapper, #npvCoverWrap, .song-card, .library-item, .track-row, .lyrics-line")) {
                return;
            }
            document.removeEventListener("pointerdown", onUnlockGesture, true);
            document.removeEventListener("keydown", onUnlockGesture, true);
            const el = activeAudio();
            if (!el || !el.paused) return;
            ensureSeekPosition();
            if (typeof onResume === "function") {
                onResume(true);
            } else {
                el.play().catch(() => {});
            }
        };

        audioEl.addEventListener("seeking", onExternalSeek);
        audioEl.addEventListener("pause", onManualPause);
        audioEl.addEventListener("canplay", ensureSeekPosition, { once: true });
        audioEl.addEventListener("playing", onPlayingVerify, { once: true });

        const applyResume = () => {
            if (!performSeek()) return;
            resumeAttempted = true;
            if (typeof onResume === "function") {
                try {
                    const maybePromise = onResume(wantPlay);
                    if (wantPlay && maybePromise && typeof maybePromise.catch === "function") {
                        maybePromise.catch(() => {
                            if (!canceled && !userPaused) {
                                document.addEventListener("pointerdown", onUnlockGesture, true);
                                document.addEventListener("keydown", onUnlockGesture, true);
                            }
                        });
                    }
                } catch (err) {
                    if (wantPlay && !canceled && !userPaused) {
                        document.addEventListener("pointerdown", onUnlockGesture, true);
                        document.addEventListener("keydown", onUnlockGesture, true);
                    }
                }
            }
            if (wantPlay) {
                setTimeout(() => {
                    const el = activeAudio();
                    if (!canceled && !userPaused && el && el.paused) {
                        ensureSeekPosition();
                        document.addEventListener("pointerdown", onUnlockGesture, true);
                        document.addEventListener("keydown", onUnlockGesture, true);
                    }
                }, 260);
            }
        };

        if (audioEl.readyState >= 1) {
            applyResume();
        } else {
            audioEl.addEventListener("loadedmetadata", applyResume, { once: true });
        }
    }

    function restorePlaybackState(opts) {
        const { list, getAudio, loadAt, onResume } = opts;
        const saved = readPlaybackState();
        if (!saved || !Array.isArray(list)) {
            loadAt(0, false);
            return;
        }
        const idx = list.findIndex(s => Number(s.id) === Number(saved.songId));
        if (idx === -1) {
            loadAt(0, false);
            return;
        }

        loadAt(idx, false);
        const audioEl = typeof getAudio === "function" ? getAudio() : null;
        if (!audioEl) return;

        applyAudioSeekAndResume(audioEl, saved, {
            getAudio,
            onResume
        });
    }

    function restoreCurrentAudioElement(opts) {
        const { songId, getAudio, onResume, onSeekApplied } = opts || {};
        const saved = readPlaybackState();
        if (!saved || Number(saved.songId) !== Number(songId)) return null;
        const audioEl = typeof getAudio === "function" ? getAudio() : null;
        if (!audioEl) return null;

        applyAudioSeekAndResume(audioEl, saved, {
            getAudio,
            onResume,
            onSeekApplied
        });
        return saved;
    }

    function bindPlaybackLifecycle(opts) {
        const { getAudio, getSong, canSave, onPageShow } = opts || {};
        const saveNow = () => {
            if (typeof canSave === "function" && !canSave()) return;
            savePlaybackState(getAudio, getSong, true);
        };

        window.addEventListener("pagehide", saveNow);
        window.addEventListener("beforeunload", saveNow);
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") saveNow();
        });
        // Capture navigation clicks before mobile/desktop browsers tear down active media elements
        document.addEventListener("click", (e) => {
            const link = e.target?.closest("a[href]");
            if (!link || link.target === "_blank") return;
            const href = link.getAttribute("href") || "";
            if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
            saveNow();
        }, true);

        if (typeof onPageShow === "function") {
            window.addEventListener("pageshow", (e) => {
                if (!e.persisted) return;
                const saved = readPlaybackState();
                if (saved) onPageShow(saved);
            });
        }
    }

    function getSongIdByPath(pathname) {
        const lower = String(pathname || "").toLowerCase();
        if (lower.includes("song3_shoulda_never")) return 3;
        const match = CANVAS_TRACKS.find(t => lower.includes(t.slug));
        return match ? match.id : null;
    }

    const CANVAS_TRACKS = [
        { id: 1, slug: "song1_it_depends", file: "Obvious (Official Video).mp4", crop: 1 },
        { id: 2, slug: "song2_with_you", file: "Chris Brown - With You (Official HD Video).mp4", crop: 1.12 },
        { id: 4, slug: "song4_because_of_you", file: "Ne-Yo - Because Of You [Official Video].mp4", crop: 1.38 },
        { id: 5, slug: "song5_miss_independent", file: "Ne-Yo - Miss Independent [Official Video].mp4", crop: 1.38 },
        { id: 6, slug: "song6_sexy_love", file: "Ne-Yo - Sexy Love [Official Video].mp4", crop: 1.38 },
        { id: 7, slug: "song7_so_sick", file: "Ne-Yo - So Sick [Official Video].mp4", crop: 1.38 },
        { id: 8, slug: "song8_love_me_not", file: "Ravyn Lenae - Love Me Not (Official Music Video).mp4", crop: 1 },
        { id: 9, slug: "song9_timeless", file: "The Weeknd, Playboi Carti - Timeless.mp4", crop: 1 },
        { id: 10, slug: "song10_million_dollar_baby", file: "Tommy Richman - MILLION DOLLAR BABY (Official Music Video).mp4", crop: 1 }
    ];

    function setCanvasBaseCrop(videoEl, crop) {
        if (!videoEl) return;
        const val = Math.max(1, Number(crop) || 1);
        videoEl.dataset.baseCrop = String(val);
        videoEl.dataset.cropMeasured = "";
        videoEl.style.setProperty("--canvas-crop", val.toFixed(3));
    }

    function bindCanvasAutoCrop(videoEl) {
        if (!videoEl || videoEl.dataset.autoCropBound) return;
        videoEl.dataset.autoCropBound = "1";
        let probeCanvas = null;
        let lastCheck = 0;

        function sampleFrame() {
            if (!videoEl || videoEl.paused || videoEl.ended || videoEl.readyState < 2 || !videoEl.videoWidth) return;
            const now = Date.now();
            if (videoEl.dataset.cropMeasured === "1" || now - lastCheck < 700) return;
            lastCheck = now;

            try {
                if (!probeCanvas) {
                    probeCanvas = document.createElement("canvas");
                    probeCanvas.width = 72;
                    probeCanvas.height = 72;
                }
                const ctx = probeCanvas.getContext("2d", { willReadFrequently: true });
                if (!ctx) return;
                ctx.drawImage(videoEl, 0, 0, 72, 72);
                const data = ctx.getImageData(0, 0, 72, 72).data;

                const rowBright = (y) => {
                    let sum = 0;
                    for (let x = 8; x < 64; x += 2) {
                        const idx = (y * 72 + x) * 4;
                        sum += data[idx] + data[idx + 1] + data[idx + 2];
                    }
                    return sum / (28 * 3);
                };
                const colBright = (x) => {
                    let sum = 0;
                    for (let y = 8; y < 64; y += 2) {
                        const idx = (y * 72 + x) * 4;
                        sum += data[idx] + data[idx + 1] + data[idx + 2];
                    }
                    return sum / (28 * 3);
                };

                let midSum = 0;
                for (let y = 24; y < 48; y += 2) midSum += rowBright(y);
                if (midSum / 12 < 24) return;

                videoEl.dataset.cropMeasured = "1";

                let top = 0;
                while (top < 20 && rowBright(top) < 16) top++;
                let bot = 0;
                while (bot < 20 && rowBright(71 - bot) < 16) bot++;
                let left = 0;
                while (left < 20 && colBright(left) < 16) left++;
                let right = 0;
                while (right < 20 && colBright(71 - right) < 16) right++;

                const vBar = Math.min(top, bot) / 72;
                const hBar = Math.min(left, right) / 72;

                let vNeed = 1;
                let hNeed = 1;
                if (vBar > 0.03) {
                    vNeed = 1 / Math.max(0.55, 1 - (top + bot) / 72 - 0.03);
                }
                if (hBar > 0.03) {
                    const rect = (videoEl.parentElement || videoEl).getBoundingClientRect();
                    const boxAR = rect.width / Math.max(1, rect.height);
                    const vidAR = videoEl.videoWidth / Math.max(1, videoEl.videoHeight);
                    const renderedScaleX = Math.max(1, vidAR / boxAR);
                    hNeed = 1 / Math.max(0.55, renderedScaleX * (1 - (left + right) / 72 - 0.03));
                }

                const baseCrop = Number(videoEl.dataset.baseCrop) || 1;
                const finalCrop = Math.min(1.62, Math.max(baseCrop, vNeed, hNeed));
                videoEl.style.setProperty("--canvas-crop", finalCrop.toFixed(3));
            } catch (err) {
                videoEl.dataset.cropMeasured = "1";
            }
        }

        videoEl.addEventListener("playing", () => setTimeout(sampleFrame, 120));
        videoEl.addEventListener("timeupdate", sampleFrame);
    }

    window.SpotifakePaths = {
        rootPrefix: ROOT_PREFIX,
        asset: resolveAssetPath,
        toCanonical: toCanonicalPath
    };

    window.SpotifakePlayback = {
        save: savePlaybackState,
        restore: restorePlaybackState,
        read: readPlaybackState,
        restoreCurrentAudio: restoreCurrentAudioElement,
        bindLifecycle: bindPlaybackLifecycle,
        getSongIdByPath
    };

    window.SpotifakeCanvas = {
        tracks: CANVAS_TRACKS,
        byId(songId, prefix = "VID_card/") {
            const match = CANVAS_TRACKS.find(t => t.id === Number(songId));
            return match ? { src: `${prefix}${match.file}`, crop: match.crop } : null;
        },
        byPath(pathname, prefix = "../../VID_card/") {
            const lower = String(pathname || "").toLowerCase();
            const match = CANVAS_TRACKS.find(t => lower.includes(t.slug));
            return match ? { src: `${prefix}${match.file}`, crop: match.crop } : null;
        },
        setBaseCrop: setCanvasBaseCrop,
        bindAutoCrop: bindCanvasAutoCrop
    };
})();
