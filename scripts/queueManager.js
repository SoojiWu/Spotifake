/**
 * Spotifake | Play Queue & Spotify-Style Shuffle Manager
 * Shared across Home.js, library.js, and playlist.js via window.SpotifakeQueue
 */
(function () {
    "use strict";

    const QUEUE_STORAGE_KEY = "spotifake_custom_queue";

    function escapeHtml(str) {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function fisherYates(arr) {
        const copy = arr.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = copy[i];
            copy[i] = copy[j];
            copy[j] = tmp;
        }
        return copy;
    }

    function readStoredQueueIds() {
        try {
            const parsed = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY) || "[]");
            if (!Array.isArray(parsed)) return [];
            const seen = new Set();
            const out = [];
            parsed.forEach(v => {
                const id = Number(v);
                if (Number.isFinite(id) && !seen.has(id)) {
                    seen.add(id);
                    out.push(id);
                }
            });
            return out;
        } catch (err) {
            return [];
        }
    }

    function writeStoredQueueIds(ids) {
        try {
            localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(ids));
        } catch (err) {
            /* Ignore storage quota errors */
        }
    }

    function showFallbackToast(msg) {
        let toast = document.getElementById("spSharedQueueToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "spSharedQueueToast";
            toast.className = "sp-shared-toast";
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add("is-visible");
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(() => {
            toast.classList.remove("is-visible");
        }, 2200);
    }

    function createController(opts) {
        const getSongs = opts.getSongs;
        const getCurrentIndex = opts.getCurrentIndex;
        const loadIndex = opts.loadIndex;
        const getRepeatMode = opts.getRepeatMode;
        const isShuffleEnabled = opts.isShuffleEnabled;
        const setShuffleEnabled = opts.setShuffleEnabled;
        const onStateChange = typeof opts.onStateChange === "function" ? opts.onStateChange : () => {};
        const notify = typeof opts.onToast === "function" ? opts.onToast : showFallbackToast;
        const queueHost = opts.queueHost || null;
        const onQueueOpen = typeof opts.onQueueOpen === "function" ? opts.onQueueOpen : () => {};

        let nextUid = 1;
        let userQueue = readStoredQueueIds().map(songId => ({ uid: nextUid++, songId }));
        let contextLabel = "All Songs";
        let contextSongIds = [];
        let contextOrder = [];
        let contextPointer = 0;
        let playHistory = [];
        let boundQueueBtn = null;
        let boundQueueBtnEl = null;
        let isPickerOpen = false;
        let pickerFilter = "";
        let cleanupQueueSwipe = null;

        function getSongMap() {
            const list = getSongs() || [];
            const map = new Map();
            list.forEach((song, idx) => {
                map.set(Number(song.id), { song, index: idx });
            });
            return map;
        }

        function ensureValidContextIds() {
            const songsList = getSongs() || [];
            const availableSet = new Set(songsList.map(s => Number(s.id)));
            const filtered = contextSongIds.filter(id => availableSet.has(Number(id)));
            if (filtered.length > 0) {
                contextSongIds = filtered;
            } else {
                contextLabel = "All Songs";
                contextSongIds = songsList.map(s => Number(s.id));
            }
            return contextSongIds;
        }

        function getValidUserQueueEntries() {
            const map = getSongMap();
            const out = [];
            userQueue.forEach((entry, rawIdx) => {
                const found = map.get(Number(entry.songId));
                if (found) {
                    out.push({ uid: entry.uid, songId: found.song.id, rawIdx, song: found.song, index: found.index });
                }
            });
            return out;
        }

        function persistQueue() {
            writeStoredQueueIds(userQueue.map(e => e.songId));
            syncUI();
        }

        function buildContextOrder(pinSongId, forceReshuffle = false) {
            const ids = ensureValidContextIds();
            if (ids.length === 0) {
                contextOrder = [];
                contextPointer = 0;
                return;
            }

            const pinId = Number(pinSongId);
            const hasPin = Number.isFinite(pinId) && ids.includes(pinId);

            if (isShuffleEnabled()) {
                const others = hasPin ? ids.filter(id => id !== pinId) : ids.slice();
                const shuffled = fisherYates(others);
                contextOrder = hasPin ? [pinId, ...shuffled] : shuffled;
                contextPointer = 0;
            } else {
                contextOrder = ids.slice();
                contextPointer = hasPin ? Math.max(0, contextOrder.indexOf(pinId)) : 0;
            }

            if (forceReshuffle) {
                syncUI();
            }
        }

        function setContext(label, songIds, pinSongId) {
            const songsList = getSongs() || [];
            const available = new Set(songsList.map(s => Number(s.id)));
            const uniqueValid = [];
            const seen = new Set();
            (Array.isArray(songIds) ? songIds : []).forEach(rawId => {
                const sid = Number(rawId);
                if (available.has(sid) && !seen.has(sid)) {
                    seen.add(sid);
                    uniqueValid.push(sid);
                }
            });

            if (uniqueValid.length > 0) {
                contextLabel = label || "Current Mix";
                contextSongIds = uniqueValid;
            } else {
                contextLabel = "All Songs";
                contextSongIds = songsList.map(s => Number(s.id));
            }

            const current = getCurrentSongObj();
            buildContextOrder(pinSongId != null ? pinSongId : (current && current.id));
            syncUI();
        }

        function getCurrentSongObj() {
            const list = getSongs() || [];
            const idx = getCurrentIndex();
            return list[idx] || list[0] || null;
        }

        function onTrackLoaded(songId, meta = {}) {
            const sid = Number(songId);
            ensureValidContextIds();
            if (!meta.fromUserQueue) {
                if (contextOrder.length !== contextSongIds.length) {
                    buildContextOrder(sid);
                } else {
                    const pos = contextOrder.indexOf(sid);
                    if (pos !== -1) {
                        contextPointer = pos;
                    } else if (!contextSongIds.includes(sid)) {
                        // Track outside custom context: reset back to All Songs smoothly
                        contextLabel = "All Songs";
                        contextSongIds = (getSongs() || []).map(s => Number(s.id));
                        buildContextOrder(sid);
                    }
                }
            }
            syncUI();
        }

        function syncShuffleState(pinSongId) {
            const cur = getCurrentSongObj();
            const targetId = pinSongId != null ? pinSongId : (cur && cur.id);
            buildContextOrder(targetId);
            syncUI();
        }

        function reshuffleUpcoming() {
            const cur = getCurrentSongObj();
            if (!isShuffleEnabled() && typeof setShuffleEnabled === "function") {
                setShuffleEnabled(true);
            }
            buildContextOrder(cur && cur.id, true);
            notify(`Reshuffled "${contextLabel}"`);
        }

        function addToQueue(songId, optsAdd = {}) {
            const map = getSongMap();
            const entry = map.get(Number(songId));
            if (!entry) return false;
            const targetId = entry.song.id;
            const existingIdx = userQueue.findIndex(e => Number(e.songId) === Number(targetId));

            if (existingIdx !== -1) {
                if (optsAdd.playNext && existingIdx !== 0) {
                    const [existing] = userQueue.splice(existingIdx, 1);
                    userQueue.unshift(existing);
                    persistQueue();
                    if (!optsAdd.silent) notify(`Moved "${entry.song.title}" to Play Next`);
                    return true;
                }
                if (!optsAdd.silent) notify(`"${entry.song.title}" is already in queue`);
                return false;
            }

            const item = { uid: nextUid++, songId: targetId };
            if (optsAdd.playNext) {
                userQueue.unshift(item);
            } else {
                userQueue.push(item);
            }
            persistQueue();
            if (!optsAdd.silent) {
                notify(optsAdd.playNext
                    ? `Playing "${entry.song.title}" next`
                    : `Added "${entry.song.title}" to queue`
                );
            }
            return true;
        }

        function removeQueuedByUid(uid) {
            const before = userQueue.length;
            userQueue = userQueue.filter(e => e.uid !== uid);
            if (userQueue.length !== before) {
                persistQueue();
            }
        }

        function moveQueuedByUid(fromUid, toIndex) {
            const fromIdx = userQueue.findIndex(e => e.uid === fromUid);
            if (fromIdx === -1) return;
            const clampedTo = Math.max(0, Math.min(userQueue.length - 1, toIndex));
            if (fromIdx === clampedTo) return;
            const [moved] = userQueue.splice(fromIdx, 1);
            userQueue.splice(clampedTo, 0, moved);
            persistQueue();
        }

        function clearQueue() {
            if (userQueue.length === 0) return;
            userQueue = [];
            persistQueue();
            notify("Cleared custom queue");
        }

        function getUpcomingContextEntries() {
            ensureValidContextIds();
            if (contextOrder.length !== contextSongIds.length) {
                const cur = getCurrentSongObj();
                buildContextOrder(cur && cur.id);
            }
            const map = getSongMap();
            const entries = [];
            for (let i = contextPointer + 1; i < contextOrder.length; i++) {
                const found = map.get(contextOrder[i]);
                if (found) {
                    entries.push({ song: found.song, index: found.index, songId: found.song.id, orderPos: i });
                }
            }
            return entries;
        }

        function getNextPreview() {
            const validQ = getValidUserQueueEntries();
            if (validQ.length > 0) {
                return {
                    song: validQ[0].song,
                    index: validQ[0].index,
                    isQueued: true,
                    contextLabel
                };
            }
            const upcoming = getUpcomingContextEntries();
            if (upcoming.length > 0) {
                return {
                    song: upcoming[0].song,
                    index: upcoming[0].index,
                    isQueued: false,
                    contextLabel
                };
            }
            const map = getSongMap();
            if (contextOrder.length > 0) {
                const first = map.get(contextOrder[0]);
                if (first) {
                    return { song: first.song, index: first.index, isQueued: false, contextLabel };
                }
            }
            const list = getSongs() || [];
            const curIdx = getCurrentIndex();
            const nextIdx = list.length ? (curIdx + 1) % list.length : 0;
            return { song: list[nextIdx], index: nextIdx, isQueued: false, contextLabel };
        }

        function hasAutoNext() {
            if (getValidUserQueueEntries().length > 0) return true;
            if (getRepeatMode() === "all") return (getSongs() || []).length > 0;
            return contextPointer < contextOrder.length - 1;
        }

        function recordHistory() {
            const cur = getCurrentSongObj();
            if (!cur) return;
            const sid = Number(cur.id);
            if (playHistory[playHistory.length - 1] !== sid) {
                playHistory.push(sid);
                if (playHistory.length > 80) playHistory = playHistory.slice(-80);
            }
        }

        function advanceNext(isAutoEnded = false) {
            const map = getSongMap();
            if (map.size === 0) return { ended: true };

            // 1. Custom User Queue always takes priority (like Spotify's "Next in queue")
            const validQ = getValidUserQueueEntries();
            if (validQ.length > 0) {
                const nextEntry = validQ[0];
                recordHistory();
                userQueue.splice(nextEntry.rawIdx, 1);
                persistQueue();
                loadIndex(nextEntry.index, true, { fromUserQueue: true, autoTransition: isAutoEnded });
                return { played: nextEntry.song, fromUserQueue: true };
            }

            // 2. Context Queue (Shuffled bag or Linear order)
            ensureValidContextIds();
            if (contextOrder.length !== contextSongIds.length) {
                const cur = getCurrentSongObj();
                buildContextOrder(cur && cur.id);
            }

            if (contextPointer < contextOrder.length - 1) {
                recordHistory();
                contextPointer++;
                const target = map.get(contextOrder[contextPointer]);
                if (target) {
                    loadIndex(target.index, true, { fromContext: true, autoTransition: isAutoEnded });
                    return { played: target.song };
                }
            }

            const repeat = getRepeatMode();
            if (repeat === "all" || !isAutoEnded) {
                const cur = getCurrentSongObj();
                recordHistory();
                if (isShuffleEnabled() && contextSongIds.length > 1) {
                    // Fresh Spotify shuffle bag ensuring we never immediately repeat the just-finished song
                    const fresh = fisherYates(contextSongIds);
                    if (cur && fresh[0] === Number(cur.id)) {
                        const swapIdx = 1 + Math.floor(Math.random() * (fresh.length - 1));
                        const tmp = fresh[0];
                        fresh[0] = fresh[swapIdx];
                        fresh[swapIdx] = tmp;
                    }
                    contextOrder = fresh;
                    contextPointer = 0;
                } else {
                    contextPointer = 0;
                }
                const target = map.get(contextOrder[contextPointer]);
                if (target) {
                    loadIndex(target.index, true, { fromContext: true, autoTransition: isAutoEnded });
                    return { played: target.song };
                }
            }

            return { ended: true };
        }

        function stepPrevious(currentTimeSec = 0) {
            if (currentTimeSec > 3) {
                return { restart: true };
            }
            const map = getSongMap();
            while (playHistory.length > 0) {
                const prevId = playHistory.pop();
                const found = map.get(prevId);
                if (found) {
                    loadIndex(found.index, true, { isHistoryNav: true });
                    return { played: found.song };
                }
            }

            ensureValidContextIds();
            if (contextOrder.length !== contextSongIds.length) {
                const cur = getCurrentSongObj();
                buildContextOrder(cur && cur.id);
            }

            if (contextPointer > 0) {
                contextPointer--;
                const target = map.get(contextOrder[contextPointer]);
                if (target) {
                    loadIndex(target.index, true, { isHistoryNav: true });
                    return { played: target.song };
                }
            } else if (getRepeatMode() === "all" && contextOrder.length > 0) {
                contextPointer = contextOrder.length - 1;
                const target = map.get(contextOrder[contextPointer]);
                if (target) {
                    loadIndex(target.index, true, { isHistoryNav: true });
                    return { played: target.song };
                }
            }

            return { restart: true };
        }

        function updateQueueButtonBadge() {
            if (!boundQueueBtnEl) return;
            const count = getValidUserQueueEntries().length;
            boundQueueBtnEl.classList.toggle("has-queued-items", count > 0);
            let badge = boundQueueBtnEl.querySelector(".queue-count-badge");
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement("span");
                    badge.className = "queue-count-badge";
                    boundQueueBtnEl.appendChild(badge);
                }
                badge.textContent = count > 9 ? "9+" : String(count);
                boundQueueBtnEl.title = `Queue (${count} queued)`;
            } else {
                if (badge) badge.remove();
                boundQueueBtnEl.title = "Play Queue";
            }
        }

        function bindQueueButton(btnEl) {
            if (!btnEl) return;
            boundQueueBtnEl = btnEl;
            if (btnEl.dataset.queueBound !== "1") {
                btnEl.dataset.queueBound = "1";
                btnEl.addEventListener("click", openQueueModal);
            }
            updateQueueButtonBadge();
        }

        function closeQueueModal() {
            const overlay = document.getElementById("spQueueModalOverlay");
            cleanupQueueSwipe?.();
            cleanupQueueSwipe = null;
            overlay?.querySelector(".sp-queue-modal")?.style.removeProperty("transform");
            overlay?.querySelector(".sp-queue-modal")?.style.removeProperty("transition");
            if (queueHost) {
                queueHost.classList.remove("queue-view-open");
                queueHost.setAttribute("aria-label", "Now Playing View");
                queueHost.querySelectorAll(".sp-npv-header, .sp-npv-scroll").forEach(view => {
                    view.inert = false;
                });
            } else if (overlay) {
                overlay.style.display = "none";
            }
            if (boundQueueBtnEl) {
                boundQueueBtnEl.setAttribute("aria-expanded", "false");
                boundQueueBtnEl.classList.remove("active");
            }
        }

        function bindQueueSwipe(overlay) {
            cleanupQueueSwipe?.();
            if (!queueHost) return;
            const sheet = overlay.querySelector(".sp-queue-modal");
            const header = overlay.querySelector(".sp-queue-modal-header");
            if (!sheet || !header) return;
            const listeners = new AbortController();
            let startY = 0;
            let startX = 0;
            let activePointer = null;
            let distance = 0;

            header.addEventListener("pointerdown", (event) => {
                if (window.innerWidth >= 768 || event.target.closest("button, input")) return;
                activePointer = event.pointerId;
                startX = event.clientX;
                startY = event.clientY;
                distance = 0;
            }, { signal: listeners.signal });

            window.addEventListener("pointermove", (event) => {
                if (event.pointerId !== activePointer) return;
                const dx = event.clientX - startX;
                const dy = event.clientY - startY;
                if (Math.abs(dx) > Math.abs(dy)) return;
                distance = Math.max(0, dy);
                sheet.style.transition = "none";
                sheet.style.transform = `translateY(${distance}px)`;
            }, { passive: true, signal: listeners.signal });

            const endSwipe = (event) => {
                if (event.pointerId !== activePointer) return;
                activePointer = null;
                sheet.style.removeProperty("transition");
                sheet.style.removeProperty("transform");
                if (event.type === "pointerup" && distance > 80) closeQueueModal();
            };
            window.addEventListener("pointerup", endSwipe, { passive: true, signal: listeners.signal });
            window.addEventListener("pointercancel", endSwipe, { passive: true, signal: listeners.signal });
            cleanupQueueSwipe = () => listeners.abort();
        }

        function syncUI() {
            updateQueueButtonBadge();
            onStateChange();
            const overlay = document.getElementById("spQueueModalOverlay");
            if (overlay && (queueHost ? queueHost.classList.contains("queue-view-open") : overlay.style.display === "flex")) {
                renderQueueModalBody(overlay);
            }
        }

        function renderQueueModalBody(overlay) {
            const cur = getCurrentSongObj();
            const validQ = getValidUserQueueEntries();
            const upcoming = getUpcomingContextEntries();
            const shuffled = isShuffleEnabled();
            const songsList = getSongs() || [];

            const nowBox = overlay.querySelector("#spQueueNowPlayingBox");
            if (nowBox && cur) {
                nowBox.innerHTML = `
                    <div class="sp-npv-next-item sp-queue-now-card">
                        <img src="${escapeHtml(cur.cover)}" alt="${escapeHtml(cur.title)}" class="sp-npv-next-thumb">
                        <div class="sp-npv-next-meta">
                            <div class="sp-npv-next-title" style="color:var(--neon-yellow);">${escapeHtml(cur.title)}</div>
                            <div class="sp-npv-next-sub">
                                <span class="sp-npv-explicit-badge">E</span>
                                <span class="sp-npv-next-artist">${escapeHtml(cur.artist)}</span>
                            </div>
                        </div>
                        <span class="sp-queue-source-tag">${escapeHtml(contextLabel)}</span>
                    </div>
                `;
            }

            // Section 2: Next in queue (Customizable User Queue)
            const qHeading = overlay.querySelector("#spQueueCustomCount");
            const clearBtn = overlay.querySelector("#spQueueClearBtn");
            const customListEl = overlay.querySelector("#spQueueCustomList");

            if (qHeading) qHeading.textContent = `Next in queue (${validQ.length})`;
            if (clearBtn) clearBtn.style.display = validQ.length > 0 ? "inline-flex" : "none";

            if (customListEl) {
                customListEl.innerHTML = "";
                if (validQ.length === 0) {
                    const emptyHint = document.createElement("div");
                    emptyHint.className = "sp-queue-empty-box";
                    emptyHint.innerHTML = `
                        <i class="fa-solid fa-bars-staggered"></i>
                        <span>No custom tracks queued yet. Use the <strong>+</strong> button above or the queue icon on any track to build your custom order.</span>
                    `;
                    customListEl.appendChild(emptyHint);
                } else {
                    let draggedUid = null;
                    validQ.forEach((entry, qIdx) => {
                        const row = document.createElement("div");
                        row.className = "sp-queue-row is-custom-row";
                        row.draggable = true;
                        row.dataset.uid = String(entry.uid);
                        row.innerHTML = `
                            <span class="sp-queue-drag-handle" title="Drag to reorder"><i class="fa-solid fa-grip-vertical"></i></span>
                            <div class="sp-npv-next-thumb-wrap sp-queue-play-trigger" title="Play now">
                                <img src="${escapeHtml(entry.song.cover)}" alt="${escapeHtml(entry.song.title)}" class="sp-npv-next-thumb">
                                <span class="sp-npv-next-play-overlay"><i class="fa-solid fa-play"></i></span>
                            </div>
                            <div class="sp-npv-next-meta sp-queue-play-trigger" title="Play now">
                                <div class="sp-npv-next-title">${escapeHtml(entry.song.title)}</div>
                                <div class="sp-npv-next-sub">
                                    <span class="sp-queued-pill">Queued</span>
                                    <span class="sp-npv-next-artist">${escapeHtml(entry.song.artist)}</span>
                                </div>
                            </div>
                            <div class="sp-queue-row-controls">
                                <button type="button" class="sp-queue-ctrl-btn is-danger" data-act="remove" title="Remove from queue" aria-label="Remove ${escapeHtml(entry.song.title)} from queue">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        `;

                        // Drag & Drop Reorder
                        row.addEventListener("dragstart", (e) => {
                            draggedUid = entry.uid;
                            row.classList.add("is-dragging");
                            if (e.dataTransfer) {
                                e.dataTransfer.effectAllowed = "move";
                                e.dataTransfer.setData("text/plain", String(entry.uid));
                            }
                        });
                        row.addEventListener("dragend", () => {
                            row.classList.remove("is-dragging");
                            customListEl.querySelectorAll(".sp-queue-row").forEach(r => r.classList.remove("is-drag-over"));
                        });
                        row.addEventListener("dragover", (e) => {
                            e.preventDefault();
                            if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
                            row.classList.add("is-drag-over");
                        });
                        row.addEventListener("dragleave", () => {
                            row.classList.remove("is-drag-over");
                        });
                        row.addEventListener("drop", (e) => {
                            e.preventDefault();
                            row.classList.remove("is-drag-over");
                            const srcUid = draggedUid || Number(e.dataTransfer?.getData("text/plain"));
                            if (srcUid && srcUid !== entry.uid) {
                                moveQueuedByUid(srcUid, qIdx);
                            }
                        });

                        // Play track now & pop it from queue
                        row.querySelectorAll(".sp-queue-play-trigger").forEach(el => {
                            el.addEventListener("click", () => {
                                recordHistory();
                                removeQueuedByUid(entry.uid);
                                loadIndex(entry.index, true, { fromUserQueue: true });
                            });
                        });

                        row.querySelector('[data-act="remove"]')?.addEventListener("click", (e) => {
                            e.stopPropagation();
                            removeQueuedByUid(entry.uid);
                        });

                        customListEl.appendChild(row);
                    });
                }
            }

            // Quick-add song picker (excludes songs already in custom queue)
            const queuedIds = new Set(validQ.map(e => Number(e.songId)));
            const pickerWrap = overlay.querySelector("#spQueuePickerWrap");
            const pickerToggleBtn = overlay.querySelector("#spQueuePickerToggleBtn");
            if (pickerToggleBtn) {
                pickerToggleBtn.setAttribute("aria-expanded", String(isPickerOpen));
                pickerToggleBtn.title = isPickerOpen ? "Hide add songs" : "Add songs";
            }
            if (pickerWrap) {
                pickerWrap.style.display = isPickerOpen ? "flex" : "none";
                const pickerList = pickerWrap.querySelector("#spQueuePickerList");
                if (isPickerOpen && pickerList) {
                    const term = pickerFilter.trim().toLowerCase();
                    const matches = songsList.filter(s =>
                        !queuedIds.has(Number(s.id)) &&
                        (!term ||
                            s.title.toLowerCase().includes(term) ||
                            s.artist.toLowerCase().includes(term))
                    );
                    pickerList.innerHTML = "";
                    if (matches.length === 0) {
                        const emptyPicker = document.createElement("div");
                        emptyPicker.className = "sp-queue-empty-box";
                        emptyPicker.textContent = term
                            ? "No matching songs available to add."
                            : "All songs are already in your custom queue.";
                        pickerList.appendChild(emptyPicker);
                    } else {
                        matches.forEach(s => {
                            const row = document.createElement("div");
                            row.className = "sp-queue-picker-row";
                            row.innerHTML = `
                                <img src="${escapeHtml(s.cover)}" alt="${escapeHtml(s.title)}">
                                <div class="sp-queue-picker-meta">
                                    <strong>${escapeHtml(s.title)}</strong>
                                    <span>${escapeHtml(s.artist)}</span>
                                </div>
                                <button type="button" class="sp-queue-mini-btn" data-act="next" title="Play right after current song">Play Next</button>
                                <button type="button" class="sp-queue-mini-btn is-primary" data-act="queue" title="Append to custom queue">+ Queue</button>
                            `;
                            row.querySelector('[data-act="next"]')?.addEventListener("click", () => addToQueue(s.id, { playNext: true }));
                            row.querySelector('[data-act="queue"]')?.addEventListener("click", () => addToQueue(s.id));
                            pickerList.appendChild(row);
                        });
                    }
                }
            }

            // Section 3: Next from <Context>
            const contextHeading = overlay.querySelector("#spQueueContextLabel");
            const upcomingListEl = overlay.querySelector("#spQueueUpcomingList");
            const contextSection = overlay.querySelector("#spQueueContextSection");
            if (contextSection) {
                contextSection.hidden = Boolean(queueHost && window.innerWidth < 768 && upcoming.length === 0);
            }
            if (contextHeading) {
                contextHeading.textContent = `Next from: ${contextLabel}${shuffled ? " • Shuffled" : ""}`;
            }
            if (upcomingListEl) {
                upcomingListEl.innerHTML = "";
                if (upcoming.length === 0) {
                    const msg = document.createElement("div");
                    msg.className = "sp-queue-empty-box";
                    msg.textContent = getRepeatMode() === "all"
                        ? "Cycle complete — repeats automatically on next track."
                        : "End of current context.";
                    upcomingListEl.appendChild(msg);
                } else {
                    upcoming.forEach(entry => {
                        const alreadyQueued = queuedIds.has(Number(entry.songId));
                        const item = document.createElement("div");
                        item.className = "sp-queue-row";
                        item.innerHTML = `
                            <div class="sp-npv-next-thumb-wrap sp-queue-play-trigger" title="Play now">
                                <img src="${escapeHtml(entry.song.cover)}" alt="${escapeHtml(entry.song.title)}" class="sp-npv-next-thumb">
                                <span class="sp-npv-next-play-overlay"><i class="fa-solid fa-play"></i></span>
                            </div>
                            <div class="sp-npv-next-meta sp-queue-play-trigger">
                                <div class="sp-npv-next-title">${escapeHtml(entry.song.title)}</div>
                                <div class="sp-npv-next-sub">
                                    <span class="sp-npv-explicit-badge">E</span>
                                    <span class="sp-npv-next-artist">${escapeHtml(entry.song.artist)}</span>
                                </div>
                            </div>
                            ${alreadyQueued
                                ? `<span class="sp-queued-pill">In Queue</span>`
                                : `<button type="button" class="sp-queue-mini-btn" title="Add to Next in queue">+ Queue</button>`}
                        `;
                        item.querySelectorAll(".sp-queue-play-trigger").forEach(el => {
                            el.addEventListener("click", () => {
                                recordHistory();
                                contextPointer = entry.orderPos;
                                loadIndex(entry.index, true, { fromContext: true });
                            });
                        });
                        if (!alreadyQueued) {
                            item.querySelector(".sp-queue-mini-btn")?.addEventListener("click", (e) => {
                                e.stopPropagation();
                                addToQueue(entry.songId);
                            });
                        }
                        upcomingListEl.appendChild(item);
                    });
                }
            }
        }

        function openQueueModal() {
            if (queueHost && queueHost.classList.contains("queue-view-open")) {
                closeQueueModal();
                return;
            }
            // Pull freshest stored custom queue in case another tab/page edited it
            userQueue = readStoredQueueIds().map(songId => ({ uid: nextUid++, songId }));
            if (queueHost && window.innerWidth < 768) {
                isPickerOpen = true;
                pickerFilter = "";
            }

            let overlay = document.getElementById("spQueueModalOverlay");
            if (!overlay) {
                overlay = document.createElement("div");
                overlay.id = "spQueueModalOverlay";
                overlay.className = queueHost ? "sp-queue-side-view" : "sp-profile-details-backdrop";
                (queueHost || document.body).appendChild(overlay);
            }

            overlay.innerHTML = `
                <div class="sp-profile-details-modal sp-queue-modal" role="${queueHost ? "region" : "dialog"}" ${queueHost ? "" : 'aria-modal="true"'} aria-label="Play Queue">
                    <div class="sp-profile-details-header sp-queue-modal-header">
                        <span class="sp-queue-sheet-handle" aria-hidden="true"></span>
                        <div class="sp-queue-title-row">
                            <h2><i class="fa-solid fa-bars-staggered" style="color:var(--neon-yellow);margin-right:8px;"></i>Queue</h2>
                            <button type="button" class="sp-profile-details-close sp-queue-close-mobile" id="spQueueCloseBtn" aria-label="Close">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                    <div class="sp-queue-scroll-body">
                        <div>
                            <div class="sp-queue-section-label is-accent">Now playing</div>
                            <div id="spQueueNowPlayingBox"></div>
                        </div>
                        <div>
                            <div class="sp-queue-section-bar">
                                <span class="sp-queue-section-label" id="spQueueCustomCount">Next in queue (0)</span>
                                <div class="sp-queue-section-actions">
                                    <button type="button" class="sp-queue-mini-btn is-primary" id="spQueuePickerToggleBtn" aria-label="Add songs to queue" aria-expanded="false" title="Add songs">
                                        <i class="fa-solid fa-plus" aria-hidden="true"></i>
                                    </button>
                                    <button type="button" class="sp-queue-mini-btn is-danger" id="spQueueClearBtn">Clear</button>
                                </div>
                            </div>
                            <div class="sp-queue-list" id="spQueueCustomList"></div>
                            <div class="sp-queue-picker-wrap" id="spQueuePickerWrap" style="display:none;">
                                <div class="sp-queue-section-label">Add songs</div>
                                <input type="search" id="spQueuePickerSearch" class="sp-queue-picker-search" placeholder="Search song or artist to add to queue..." value="${escapeHtml(pickerFilter)}">
                                <div class="sp-queue-picker-list" id="spQueuePickerList"></div>
                            </div>
                        </div>
                        <div id="spQueueContextSection">
                            <div class="sp-queue-section-label" id="spQueueContextLabel">Next from: All Songs</div>
                            <div class="sp-queue-list" id="spQueueUpcomingList"></div>
                        </div>
                    </div>
                </div>
            `;

            overlay.querySelector("#spQueueCloseBtn")?.addEventListener("click", () => {
                closeQueueModal();
            });
            overlay.onclick = (e) => {
                if (e.target === overlay && (!queueHost || window.innerWidth < 768)) closeQueueModal();
            };
            bindQueueSwipe(overlay);
            overlay.querySelector("#spQueueClearBtn")?.addEventListener("click", clearQueue);
            overlay.querySelector("#spQueuePickerToggleBtn")?.addEventListener("click", () => {
                isPickerOpen = !isPickerOpen;
                renderQueueModalBody(overlay);
                if (isPickerOpen) {
                    overlay.querySelector("#spQueuePickerSearch")?.focus();
                }
            });
            overlay.querySelector("#spQueuePickerSearch")?.addEventListener("input", (e) => {
                pickerFilter = e.target.value || "";
                renderQueueModalBody(overlay);
            });

            renderQueueModalBody(overlay);
            if (queueHost) {
                onQueueOpen();
                // Establish the hidden starting position before the panel transitions in.
                overlay.getBoundingClientRect();
                queueHost.classList.add("queue-view-open");
                queueHost.setAttribute("aria-label", "Play Queue");
                queueHost.querySelectorAll(".sp-npv-header, .sp-npv-scroll").forEach(view => {
                    view.inert = true;
                });
            } else {
                overlay.style.display = "flex";
            }
            if (boundQueueBtnEl) {
                boundQueueBtnEl.setAttribute("aria-expanded", "true");
                boundQueueBtnEl.classList.add("active");
            }
        }

        // Cross-tab custom queue sync
        window.addEventListener("storage", (e) => {
            if (e.key === QUEUE_STORAGE_KEY) {
                userQueue = readStoredQueueIds().map(songId => ({ uid: nextUid++, songId }));
                syncUI();
            }
        });

        // Initialize default context cleanly
        ensureValidContextIds();
        const initCur = getCurrentSongObj();
        buildContextOrder(initCur && initCur.id);

        return {
            addToQueue,
            playNext: (songId, optsNext = {}) => addToQueue(songId, Object.assign({}, optsNext, { playNext: true })),
            removeQueuedByUid,
            moveQueuedByUid,
            clearQueue,
            setContext,
            syncShuffleState,
            reshuffleUpcoming,
            onTrackLoaded,
            getNextPreview,
            getUpcomingContextEntries,
            getValidUserQueueEntries,
            getContextLabel: () => contextLabel,
            hasAutoNext,
            advanceNext,
            stepPrevious,
            bindQueueButton,
            openQueueModal,
            closeQueueModal,
            syncUI
        };
    }

    window.SpotifakeQueue = {
        createController: createController,
        fisherYates: fisherYates
    };
})();
