/**
 * Spotifake | Custom Album Manager Utility
 * Shared album CRUD, modal wiring, and tab-specific Create button visibility
 * Used by both Home.js and library.js via window.AlbumManager
 */
(function () {
    "use strict";

    const STORAGE_KEY = "spotifake_custom_albums";
    const FALLBACK_COVER = "../photos/ItDepends.jpg";

    function loadAlbums() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            if (!Array.isArray(parsed)) return [];
            const resolve = window.SpotifakePaths ? window.SpotifakePaths.asset : (p) => p;
            return parsed.map(alb => alb && alb.cover ? { ...alb, cover: resolve(alb.cover) } : alb);
        } catch (err) {
            return [];
        }
    }

    function saveAlbums(albums) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
        } catch (err) {
            /* Ignore storage quota errors */
        }
    }

    function getDefaultCreatorName() {
        try {
            const p = JSON.parse(localStorage.getItem("spotifake_user_profile") || "null");
            return (p && p.name && p.name.trim()) || "JSON.TTUM";
        } catch (err) {
            return "JSON.TTUM";
        }
    }

    function buildTrackEntries(masterSongs, songIds, fallbackArtist) {
        if (!Array.isArray(songIds) || songIds.length === 0) return [];
        return songIds
            .map((id, idx) => {
                const match = masterSongs.find(s => Number(s.id) === Number(id));
                if (!match) return null;
                return {
                    num: idx + 1,
                    title: match.title,
                    artists: [match.artist || fallbackArtist || "Spotifake Artist"],
                    duration: "3:45",
                    songId: match.id
                };
            })
            .filter(Boolean);
    }

    function createAlbum(opts) {
        const albums = loadAlbums();
        const masterSongs = Array.isArray(opts.masterSongs) ? opts.masterSongs : [];
        const songIds = Array.isArray(opts.songIds) ? opts.songIds.map(Number) : [];
        const firstSong = masterSongs.find(s => Number(s.id) === Number(songIds[0]));
        const artistName = (opts.artistName || "").trim() || getDefaultCreatorName();
        const year = (opts.year || "").trim() || String(new Date().getFullYear());

        const newAlbum = {
            id: "custom-alb-" + Date.now(),
            title: (opts.title || "Untitled Album").trim(),
            artistName: artistName,
            creator: artistName,
            year: year,
            label: "Spotifake Custom Release",
            type: "album",
            kind: "album",
            cover: opts.imageData || (firstSong && firstSong.cover) || FALLBACK_COVER,
            songIds: songIds,
            songs: songIds,
            fullTracklist: buildTrackEntries(masterSongs, songIds, artistName),
            isCustomAlbum: true
        };

        albums.unshift(newAlbum);
        saveAlbums(albums);
        return newAlbum;
    }

    function deleteAlbum(albumId) {
        const updated = loadAlbums().filter(a => a.id !== albumId);
        saveAlbums(updated);
        return updated;
    }

    function syncLibraryTabActions(opts) {
        const tab = (opts && opts.tab) || "playlists";
        const createPlaylistBtn = opts && opts.createPlaylistBtn;
        const createAlbumBtn = opts && opts.createAlbumBtn;

        if (createPlaylistBtn) {
            createPlaylistBtn.hidden = tab !== "playlists";
        }
        if (createAlbumBtn) {
            createAlbumBtn.hidden = tab !== "albums";
        }
    }

    function renderTrackCheckboxes(container, masterSongs) {
        if (!container) return;
        container.replaceChildren();
        masterSongs.forEach(song => {
            const label = document.createElement("label");
            label.className = "alb-track-pick-row";
            label.innerHTML = `
                <input type="checkbox" class="alb-track-checkbox" value="${song.id}">
                <img src="${song.cover}" alt="${song.title}">
                <span class="alb-track-pick-meta">
                    <strong>${song.title}</strong>
                    <small>${song.artist}</small>
                </span>
            `;
            container.appendChild(label);
        });
    }

    function wireCreateModal(opts) {
        const modal = document.getElementById("createAlbumModal");
        const nameInput = document.getElementById("albName");
        const artistInput = document.getElementById("albArtist");
        const yearInput = document.getElementById("albYear");
        const imgInput = document.getElementById("albImg");
        const trackListBox = document.getElementById("albTrackCheckboxes");
        const createBtn = document.getElementById("albCreateBtn");
        const cancelBtn = document.getElementById("albCancelBtn");
        const masterSongs = (opts && Array.isArray(opts.songs)) ? opts.songs : [];

        function openModal() {
            if (!modal) return;
            if (nameInput) nameInput.value = "";
            if (artistInput) {
                artistInput.value = typeof opts?.getDefaultArtist === "function"
                    ? opts.getDefaultArtist()
                    : getDefaultCreatorName();
            }
            if (yearInput) yearInput.value = String(new Date().getFullYear());
            if (imgInput) imgInput.value = "";
            renderTrackCheckboxes(trackListBox, masterSongs);
            modal.style.display = "flex";
            setTimeout(() => nameInput?.focus(), 50);
        }

        function closeModal() {
            if (modal) modal.style.display = "none";
        }

        if (opts && opts.triggerButtons) {
            opts.triggerButtons.forEach(btn => {
                if (!btn || btn.dataset.albBound === "1") return;
                btn.dataset.albBound = "1";
                btn.addEventListener("click", openModal);
            });
        }

        if (cancelBtn && cancelBtn.dataset.albBound !== "1") {
            cancelBtn.dataset.albBound = "1";
            cancelBtn.addEventListener("click", closeModal);
        }

        if (modal && modal.dataset.albBackdropBound !== "1") {
            modal.dataset.albBackdropBound = "1";
            modal.addEventListener("click", (e) => {
                if (e.target === modal) closeModal();
            });
        }

        if (createBtn && createBtn.dataset.albBound !== "1") {
            createBtn.dataset.albBound = "1";
            createBtn.addEventListener("click", () => {
                const title = nameInput ? nameInput.value.trim() : "";
                if (!title) {
                    if (typeof opts?.onError === "function") {
                        opts.onError("Please enter an album title!");
                    }
                    nameInput?.focus();
                    return;
                }

                const artistName = artistInput ? artistInput.value.trim() : "";
                const year = yearInput ? yearInput.value.trim() : String(new Date().getFullYear());
                const selectedIds = trackListBox
                    ? [...trackListBox.querySelectorAll(".alb-track-checkbox:checked")].map(cb => Number(cb.value))
                    : [];
                const imgFile = imgInput && imgInput.files && imgInput.files[0] ? imgInput.files[0] : null;

                function finishCreate(imageDataUrl) {
                    const album = createAlbum({
                        title,
                        artistName,
                        year,
                        songIds: selectedIds,
                        imageData: imageDataUrl,
                        masterSongs
                    });
                    closeModal();
                    if (typeof opts?.onCreated === "function") {
                        opts.onCreated(album);
                    }
                }

                if (imgFile) {
                    const reader = new FileReader();
                    reader.onload = (ev) => finishCreate(ev.target.result);
                    reader.readAsDataURL(imgFile);
                } else {
                    finishCreate(null);
                }
            });
        }

        return { open: openModal, close: closeModal };
    }

    const SPOTIFY_ALBUM_URLS = {
        "alb-breezy": "https://open.spotify.com/album/5kfM4GlfOj2PdcvcRglN86",
        "alb-exclusive": "https://open.spotify.com/album/2NC8QmrFfN8ojgxzamiM4b",
        "alb-crash": "https://open.spotify.com/album/2MRNLEYm9SB0HBrJEU8L32",
        "alb-because": "https://open.spotify.com/album/52q9xNv8COtSU9phlbO5sg",
        "alb-year": "https://open.spotify.com/album/1nv3KEXZPmcwOXMoLTs1vn",
        "alb-words": "https://open.spotify.com/album/6SUV4nzZobjuioos5VDUl7",
        "alb-bird": "https://open.spotify.com/album/1uE3dRPe3SrGdNhd1nWlSa",
        "alb-hurry": "https://open.spotify.com/album/3OxfaVgvTxUTy7276t7SPU",
        "alb-coyote": "https://open.spotify.com/album/7c60QdnpXI2efwnUaIzQSu"
    };

    const SPOTIFY_ALBUM_URLS_BY_TITLE = {
        "breezy": SPOTIFY_ALBUM_URLS["alb-breezy"],
        "exclusive": SPOTIFY_ALBUM_URLS["alb-exclusive"],
        "crash": SPOTIFY_ALBUM_URLS["alb-crash"],
        "because of you": SPOTIFY_ALBUM_URLS["alb-because"],
        "year of the gentleman": SPOTIFY_ALBUM_URLS["alb-year"],
        "in my own words": SPOTIFY_ALBUM_URLS["alb-words"],
        "bird's eye": SPOTIFY_ALBUM_URLS["alb-bird"],
        "hurry up tomorrow": SPOTIFY_ALBUM_URLS["alb-hurry"],
        "coyote": SPOTIFY_ALBUM_URLS["alb-coyote"]
    };

    function escapeHtml(str) {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    /** Resolve the official Spotify album URL for a catalog album (empty for user-created albums). */
    function getSpotifyUrl(album) {
        if (!album) return "";
        if (album.spotifyUrl) return album.spotifyUrl;
        if (album.isCustomAlbum) return "";
        if (album.id && SPOTIFY_ALBUM_URLS[album.id]) return SPOTIFY_ALBUM_URLS[album.id];
        const key = String(album.title || "").trim().toLowerCase();
        return SPOTIFY_ALBUM_URLS_BY_TITLE[key] || "";
    }

    /** Build an inline pill badge marking tracks not playable locally as Spotify-only. */
    function createSpotifyOnlyBadge() {
        const badge = document.createElement("span");
        badge.className = "sp-spotify-only-badge";
        badge.title = "This song is available only on Spotify";
        badge.innerHTML = `<i class="fa-brands fa-spotify"></i> Available only in Spotify`;
        return badge;
    }

    /** Build an external action link element for the track row Actions column. */
    function createSpotifyRowLink(spotifyUrl) {
        const link = document.createElement("a");
        link.className = "sp-spotify-row-link";
        link.href = spotifyUrl || "https://open.spotify.com";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.title = "Listen to this track on Spotify";
        link.innerHTML = `<i class="fa-brands fa-spotify"></i> Spotify`;
        link.addEventListener("click", (e) => e.stopPropagation());
        return link;
    }

    /** Build the highlighted Spotify Album Link box rendered on album detail pages. */
    function createSpotifyAlbumBox(album) {
        const url = getSpotifyUrl(album);
        if (!url) return null;

        const safeUrl = escapeHtml(url);
        const safeTitle = escapeHtml(album.title || "Album");
        const safeArtist = escapeHtml(album.artistName || "");

        const box = document.createElement("div");
        box.className = "sp-album-spotify-box";
        box.innerHTML = `
            <div class="sp-spotify-box-head">
                <div class="sp-spotify-box-icon" aria-hidden="true">
                    <i class="fa-brands fa-spotify"></i>
                </div>
                <div class="sp-spotify-box-copy">
                    <div class="sp-spotify-box-title">Official Album on Spotify — ${safeTitle}${safeArtist ? ` • ${safeArtist}` : ""}</div>
                    <div class="sp-spotify-box-sub">Songs labeled <strong>Available only in Spotify</strong> can be streamed in full on Spotify.</div>
                </div>
            </div>
            <a class="sp-spotify-url-box" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
                <span class="sp-spotify-url-label"><i class="fa-solid fa-link"></i></span>
                <span class="sp-spotify-url-text">${safeUrl}</span>
                <span class="sp-spotify-open-cta">Open in Spotify <i class="fa-solid fa-arrow-up-right-from-square"></i></span>
            </a>
        `;
        return box;
    }

    window.AlbumManager = {
        SPOTIFY_ALBUM_URLS: SPOTIFY_ALBUM_URLS,
        load: loadAlbums,
        save: saveAlbums,
        create: createAlbum,
        delete: deleteAlbum,
        buildTrackEntries: buildTrackEntries,
        syncLibraryTabActions: syncLibraryTabActions,
        wireCreateModal: wireCreateModal,
        getSpotifyUrl: getSpotifyUrl,
        createSpotifyOnlyBadge: createSpotifyOnlyBadge,
        createSpotifyRowLink: createSpotifyRowLink,
        createSpotifyAlbumBox: createSpotifyAlbumBox
    };
})();
