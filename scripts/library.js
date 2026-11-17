/**
 * Spotifake | Dedicated Library Controller
 * BSIT / IT Extension Project
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    // Audio Player Elements (Dual-Deck Crossfade Engine)
    const deckA = $("#audioPlayer");
    const deckB = new Audio();
    deckB.preload = "auto";
    let audio = deckA;
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

    // Library UI Elements
    const libItemsContainer = $("#libItemsContainer");
    const libTotalCount = $("#libTotalCount");
    const libFilterInput = $("#libFilterInput");
    const libGlobalSearch = $("#libGlobalSearch");
    const libSortSelect = $("#libSortSelect");
    const viewGridBtn = $("#viewGridBtn");
    const viewListBtn = $("#viewListBtn");
    const libCategoryTabs = $$(".lib-cat-pill");

    // Profile Taskbar
    const profileBtn = $("#profileBtn");
    const profileTaskbar = $("#profileTaskbar");

    // Custom Cursor
    const cursorDot = $("#cursorDot");
    const cursorRing = $("#cursorRing");

    // Master 10 Songs Database
    const songs = [
        { id: 1, title: "It Depends", artist: "Chris Brown ft. Bryson Tiller", src: "../SONGS/Chris Brown - It Depends (Audio) ft. Bryson Tiller.mp3", cover: "../photos/ItDepends.jpg", type: "song", album: "Breezy" },
        { id: 2, title: "With You", artist: "Chris Brown", src: "../SONGS/Chris Brown - With You (Official HD Video).mp3", cover: "../photos/WithYou.jpg", type: "song", album: "Exclusive" },
        { id: 3, title: "Shoulda Never", artist: "Kehlani ft. Usher", src: "../SONGS/Kehlani - Shoulda Never (feat. Usher) [Official Audio].mp3", cover: "../photos/ShouldaNever.jpg", type: "song", album: "CRASH" },
        { id: 4, title: "Because of You", artist: "Ne-Yo", src: "../SONGS/Ne-Yo - Because Of You (Official Music Video).mp3", cover: "../photos/BecauseofYou.jpg", type: "song", album: "Because of You" },
        { id: 5, title: "Miss Independent", artist: "Ne-Yo", src: "../SONGS/Ne-Yo - Miss Independent.mp3", cover: "../photos/MissIndependent.jpg", type: "song", album: "Year of the Gentleman" },
        { id: 6, title: "Sexy Love", artist: "Ne-Yo", src: "../SONGS/Ne-Yo - Sexy Love [Official Video].mp3", cover: "../photos/SexyLove.jpg", type: "song", album: "In My Own Words" },
        { id: 7, title: "So Sick", artist: "Ne-Yo", src: "../SONGS/Ne-Yo - So Sick (Official Music Video).mp3", cover: "../photos/SoSick.jpg", type: "song", album: "In My Own Words" },
        { id: 8, title: "Love Me Not", artist: "Ravyn Lenae", src: "../SONGS/Ravyn Lenae - Love Me Not (Official Music Video).mp3", cover: "../photos/LoveMeNot.jpg", type: "song", album: "Bird's Eye" },
        { id: 9, title: "Timeless", artist: "The Weeknd ft. Playboi Carti", src: "../SONGS/The Weeknd - Timeless with Playboi Carti (Official Music Video).mp3", cover: "../photos/Timeless.jpg", type: "song", album: "Hurry Up Tomorrow" },
        { id: 10, title: "MILLION DOLLAR BABY", artist: "Tommy Richman", src: "../SONGS/Tommy Richman - MILLION DOLLAR BABY (Official Music Video).mp3", cover: "../photos/MillionDollarBaby.jpg", type: "song", album: "COYOTE" }
    ];

    function getSavedLibUserName() {
        try {
            const p = JSON.parse(localStorage.getItem("spotifake_user_profile") || "null");
            return (p && p.name && p.name.trim()) || "JSON.TTUM";
        } catch (e) {
            return "JSON.TTUM";
        }
    }

    // Playlists: Liked Songs base playlist
    const basePlaylists = [
        { id: "p-liked", title: "Liked Songs", creator: getSavedLibUserName(), type: "playlist", isLiked: true, pinned: true }
    ];

    // Official Spotify-Style Multi-Track Albums
    const baseAlbums = [
        {
            id: "alb-breezy", title: "Breezy", creator: "Chris Brown", artistName: "Chris Brown", year: "2022", label: "Chris Brown Entertainment / RCA Records", type: "album", cover: "../albumC/sbreezy.png", songs: [1, 2],
            fullTracklist: [
                { num: 1, title: "It Depends (feat. Bryson Tiller)", artists: ["Chris Brown", "Bryson Tiller"], duration: "3:48", songId: 1 },
                { num: 2, title: "With You", artists: ["Chris Brown"], duration: "4:12", songId: 2 },
                { num: 3, title: "Under The Influence", artists: ["Chris Brown"], duration: "3:04", refIndex: 0 },
                { num: 4, title: "Call Me Every Day (feat. WizKid)", artists: ["Chris Brown"], duration: "2:26", refIndex: 0 },
                { num: 5, title: "Warm Embrace", artists: ["Chris Brown"], duration: "3:19", refIndex: 1 },
                { num: 6, title: "WE (Warm Embrace)", artists: ["Chris Brown"], duration: "3:44", refIndex: 1 },
                { num: 7, title: "No Guidance", artists: ["Chris Brown"], duration: "4:20", refIndex: 0 }
            ]
        },
        {
            id: "alb-exclusive", title: "Exclusive", creator: "Chris Brown", artistName: "Chris Brown", year: "2007", label: "Jive Records", type: "album", cover: "../albumC/exclusive.png", songs: [2, 1],
            fullTracklist: [
                { num: 1, title: "With You", artists: ["Chris Brown"], duration: "4:12", songId: 2 },
                { num: 2, title: "It Depends (feat. Bryson Tiller)", artists: ["Chris Brown", "Bryson Tiller"], duration: "3:48", songId: 1 },
                { num: 3, title: "Forever", artists: ["Chris Brown"], duration: "4:38", refIndex: 1 },
                { num: 4, title: "Kiss Kiss (feat. T-Pain)", artists: ["Chris Brown"], duration: "4:11", refIndex: 1 },
                { num: 5, title: "Take You Down", artists: ["Chris Brown"], duration: "4:05", refIndex: 1 },
                { num: 6, title: "Superhuman", artists: ["Chris Brown", "Kehlani"], duration: "3:39", refIndex: 1 }
            ]
        },
        {
            id: "alb-crash", title: "CRASH", creator: "Kehlani", artistName: "Kehlani", year: "2024", label: "Atlantic Recording Corporation", type: "album", cover: "../photos/ShouldaNever.jpg", songs: [3],
            fullTracklist: [
                { num: 1, title: "GrooveTheory", artists: ["Kehlani"], duration: "4:04", refIndex: 2 },
                { num: 2, title: "Next 2 U", artists: ["Kehlani"], duration: "2:41", refIndex: 2 },
                { num: 3, title: "After Hours", artists: ["Kehlani"], duration: "3:22", refIndex: 2 },
                { num: 4, title: "Shoulda Never (feat. Usher)", artists: ["Kehlani", "Usher"], duration: "3:19", songId: 3 },
                { num: 5, title: "Crash", artists: ["Kehlani"], duration: "2:36", refIndex: 2 },
                { num: 6, title: "8", artists: ["Kehlani"], duration: "2:30", refIndex: 2 },
                { num: 7, title: "Sucia", artists: ["Kehlani"], duration: "4:21", refIndex: 2 },
                { num: 8, title: "Better Not", artists: ["Kehlani"], duration: "2:44", refIndex: 2 }
            ]
        },
        {
            id: "alb-because", title: "Because of You", creator: "Ne-Yo", artistName: "Ne-Yo", year: "2007", label: "Def Jam Recordings", type: "album", cover: "../photos/BecauseofYou.jpg", songs: [4, 5, 6, 7],
            fullTracklist: [
                { num: 1, title: "Because of You", artists: ["Ne-Yo"], duration: "4:26", songId: 4 },
                { num: 2, title: "Crazy (feat. JAY-Z)", artists: ["Ne-Yo"], duration: "4:21", refIndex: 3 },
                { num: 3, title: "Can We Chill", artists: ["Ne-Yo"], duration: "4:24", refIndex: 3 },
                { num: 4, title: "Do You", artists: ["Ne-Yo"], duration: "3:48", refIndex: 3 },
                { num: 5, title: "Miss Independent", artists: ["Ne-Yo"], duration: "3:52", songId: 5 },
                { num: 6, title: "Sexy Love", artists: ["Ne-Yo"], duration: "3:40", songId: 6 },
                { num: 7, title: "So Sick", artists: ["Ne-Yo"], duration: "3:27", songId: 7 }
            ]
        },
        {
            id: "alb-year", title: "Year of the Gentleman", creator: "Ne-Yo", artistName: "Ne-Yo", year: "2008", label: "Def Jam Recordings", type: "album", cover: "../albumC/Ne-yo.png", songs: [5, 4, 6, 7],
            fullTracklist: [
                { num: 1, title: "Closer", artists: ["Ne-Yo"], duration: "3:54", refIndex: 4 },
                { num: 2, title: "Nobody", artists: ["Ne-Yo"], duration: "3:07", refIndex: 4 },
                { num: 3, title: "Miss Independent", artists: ["Ne-Yo"], duration: "3:52", songId: 5 },
                { num: 4, title: "Mad", artists: ["Ne-Yo"], duration: "4:15", refIndex: 4 },
                { num: 5, title: "Because of You", artists: ["Ne-Yo"], duration: "4:26", songId: 4 },
                { num: 6, title: "So Sick", artists: ["Ne-Yo"], duration: "3:27", songId: 7 },
                { num: 7, title: "Part of the List", artists: ["Ne-Yo"], duration: "4:10", refIndex: 4 }
            ]
        },
        {
            id: "alb-words", title: "In My Own Words", creator: "Ne-Yo", artistName: "Ne-Yo", year: "2006", label: "Def Jam Recordings", type: "album", cover: "../photos/SexyLove.jpg", songs: [6, 7, 4, 5],
            fullTracklist: [
                { num: 1, title: "Stay", artists: ["Ne-Yo"], duration: "3:52", refIndex: 5 },
                { num: 2, title: "So Sick", artists: ["Ne-Yo"], duration: "3:27", songId: 7 },
                { num: 3, title: "When You're Mad", artists: ["Ne-Yo"], duration: "3:42", refIndex: 6 },
                { num: 4, title: "Sexy Love", artists: ["Ne-Yo"], duration: "3:40", songId: 6 },
                { num: 5, title: "Because of You", artists: ["Ne-Yo"], duration: "4:26", songId: 4 },
                { num: 6, title: "Miss Independent", artists: ["Ne-Yo"], duration: "3:52", songId: 5 },
                { num: 7, title: "Mirror", artists: ["Ne-Yo"], duration: "3:48", refIndex: 5 }
            ]
        },
        {
            id: "alb-bird", title: "Bird's Eye", creator: "Ravyn Lenae", artistName: "Ravyn Lenae", year: "2024", label: "Atlantic Recording Corporation", type: "album", cover: "../photos/LoveMeNot.jpg", songs: [8],
            fullTracklist: [
                { num: 1, title: "Genius", artists: ["Ravyn Lenae"], duration: "2:52", refIndex: 7 },
                { num: 2, title: "Bad Idea", artists: ["Ravyn Lenae"], duration: "2:35", refIndex: 7 },
                { num: 3, title: "One Wish (feat. Childish Gambino)", artists: ["Ravyn Lenae"], duration: "3:15", refIndex: 7 },
                { num: 4, title: "Dream Girl (feat. Ty Dolla $ign)", artists: ["Ravyn Lenae"], duration: "3:39", refIndex: 7 },
                { num: 5, title: "Love Me Not", artists: ["Ravyn Lenae"], duration: "3:33", songId: 8 },
                { num: 6, title: "Love Is Blind", artists: ["Ravyn Lenae"], duration: "3:18", refIndex: 7 },
                { num: 7, title: "Days", artists: ["Ravyn Lenae"], duration: "4:02", refIndex: 7 }
            ]
        },
        {
            id: "alb-hurry", title: "Hurry Up Tomorrow", creator: "The Weeknd", artistName: "The Weeknd", year: "2024", label: "XO / Republic Records", type: "album", cover: "../albumC/theweeknd.png", songs: [9],
            fullTracklist: [
                { num: 1, title: "Wake Me Up", artists: ["The Weeknd"], duration: "4:08", refIndex: 8 },
                { num: 2, title: "Dancing In The Flames", artists: ["The Weeknd"], duration: "3:40", refIndex: 8 },
                { num: 3, title: "Timeless (with Playboi Carti)", artists: ["The Weeknd", "Playboi Carti"], duration: "4:16", songId: 9 },
                { num: 4, title: "São Paulo", artists: ["The Weeknd"], duration: "5:02", refIndex: 8 },
                { num: 5, title: "Open Hearts", artists: ["The Weeknd"], duration: "3:29", refIndex: 8 },
                { num: 6, title: "Runaway", artists: ["The Weeknd"], duration: "3:14", refIndex: 8 },
                { num: 7, title: "Hurry Up Tomorrow", artists: ["The Weeknd"], duration: "4:45", refIndex: 8 }
            ]
        },
        {
            id: "alb-coyote", title: "COYOTE", creator: "Tommy Richman", artistName: "Tommy Richman", year: "2024", label: "ISO Supremacy / PULSE Records", type: "album", cover: "../albumC/MillionDollah.png", songs: [10],
            fullTracklist: [
                { num: 1, title: "ELEPHANT IN THE ROOM", artists: ["Tommy Richman"], duration: "2:44", refIndex: 9 },
                { num: 2, title: "WHITNEY", artists: ["Tommy Richman"], duration: "2:52", refIndex: 9 },
                { num: 3, title: "MILLION DOLLAR BABY", artists: ["Tommy Richman"], duration: "2:35", songId: 10 },
                { num: 4, title: "DEVIL IS A LIE", artists: ["Tommy Richman"], duration: "2:11", refIndex: 9 },
                { num: 5, title: "THOUGHT YOU WERE THE ONE", artists: ["Tommy Richman"], duration: "3:01", refIndex: 9 },
                { num: 6, title: "LETTERMAN", artists: ["Tommy Richman"], duration: "2:58", refIndex: 9 }
            ]
        }
    ];

    // Artists derived from songs (with real PFPs)
    const ARTIST_PFPS = {
        "Chris Brown": "../PFPs/ChrisBrownz.jpg",
        "Bryson Tiller": "../PFPs/BrysonTiller.jpg",
        "Kehlani": "../PFPs/Kehlani.jpg",
        "Usher": "../PFPs/Usher.jpg",
        "Ne-Yo": "../PFPs/Ne-yo.jpg",
        "Ravyn Lenae": "../PFPs/RavynLenae.jpg",
        "The Weeknd": "../PFPs/TheWeeknd.jpg",
        "Playboi Carti": "../PFPs/Playboi.jpg",
        "Tommy Richman": "../PFPs/TommyRichman.jpg"
    };
    const artistMap = {};
    songs.forEach(s => {
        const names = s.artist.split(/\s+ft\.\s+|\s+with\s+/i);
        names.forEach(name => {
            const trimmed = name.trim();
            if (!artistMap[trimmed]) {
                artistMap[trimmed] = { id: "art-" + trimmed.replace(/\s+/g, '-').toLowerCase(), title: trimmed, type: "artist", cover: ARTIST_PFPS[trimmed] || s.cover, songs: [] };
            }
            artistMap[trimmed].songs.push(s.id);
        });
    });
    const baseArtists = Object.values(artistMap);

    // Load custom playlists from localStorage
    let customPlaylists = JSON.parse(localStorage.getItem("spotifake_custom_playlists") || "[]");

    // Recently played
    let recentlyPlayed = JSON.parse(localStorage.getItem("spotifake_recents") || "[]");

    let currentIndex = 0;
    let isShuffle = localStorage.getItem("spotifake_shuffle") === "1";
    let repeatMode = localStorage.getItem("spotifake_repeat") || "off";
    let masterVolume = Number(localStorage.getItem("spotifake_volume") ?? 0.75);
    if (!Number.isFinite(masterVolume) || masterVolume < 0 || masterVolume > 1) masterVolume = 0.75;
    let lastVolume = masterVolume > 0 ? masterVolume : 0.75;
    let isMasterMuted = localStorage.getItem("spotifake_muted") === "1";
    const savedCrossfadeLib = localStorage.getItem("spotifake_crossfade");
    let crossfadeSeconds = savedCrossfadeLib !== null ? Math.max(0, Number(savedCrossfadeLib) || 0) : 4;
    let crossfadeRafId = null;
    let activeFadeState = null;
    let autoCrossfadeTriggered = false;
    let favorites = new Set(JSON.parse(localStorage.getItem("spotifake_favorites") || "[]"));

    deckA.volume = isMasterMuted ? 0 : masterVolume;
    deckA.muted = isMasterMuted;
    deckB.volume = 0;
    deckB.muted = isMasterMuted;
    const SONG_LYRICS = window.SONG_LYRICS || {};

    function setShuffleModeLibState(enabled) {
        isShuffle = Boolean(enabled);
        localStorage.setItem("spotifake_shuffle", isShuffle ? "1" : "0");
        if (queueCtrl) {
            const cur = getCurrentSong();
            queueCtrl.syncShuffleState(cur && cur.id);
        }
        syncShuffleRepeatLibUI();
    }

    const queueCtrl = window.SpotifakeQueue
        ? window.SpotifakeQueue.createController({
            getSongs: () => songs,
            getCurrentIndex: () => currentIndex,
            loadIndex: (idx, autoplay, meta) => loadTrack(idx, autoplay, meta),
            getRepeatMode: () => repeatMode,
            isShuffleEnabled: () => isShuffle,
            setShuffleEnabled: (val) => setShuffleModeLibState(val)
        })
        : null;
    if (queueCtrl) queueCtrl.bindQueueButton($("#queueButton"));

    // Variable to track which playlist to delete or edit
    let pendingDeletePlaylistId = null;
    let editingPlaylistId = null;
    let managingPlaylistId = null;

    /* Helper: Format Time */
    function formatTime(sec) {
        if (!Number.isFinite(sec) || sec < 0) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${String(s).padStart(2, "0")}`;
    }

    /* Build Combined Library Items */
    function getAllLibraryItems() {
        const items = [];
        // Playlists
        basePlaylists.forEach(p => items.push({ ...p, kind: "playlist" }));
        customPlaylists.forEach(p => items.push({ ...p, kind: "playlist", type: "playlist", isCustom: true }));
        // Albums (custom created albums first, then catalog albums)
        const customAlbums = window.AlbumManager ? window.AlbumManager.load() : [];
        customAlbums.forEach(a => items.push({ ...a, kind: "album", type: "album", isCustomAlbum: true }));
        baseAlbums.forEach(a => items.push({ ...a, kind: "album" }));
        // Artists
        baseArtists.forEach(a => items.push({ ...a, kind: "artist" }));
        // Songs
        songs.forEach(s => items.push({
            id: `song-${s.id}`, songId: s.id, title: s.title, creator: s.artist,
            type: "song", cover: s.cover, src: s.src, kind: "song"
        }));
        return items;
    }

    /* Render Library Items */
    function renderLibrary() {
        if (!libItemsContainer) return;
        libItemsContainer.replaceChildren();

        const query = (libFilterInput?.value || libGlobalSearch?.value || "").trim().toLowerCase();
        const activeTabEl = $(".lib-cat-pill.active");
        const activeTab = activeTabEl ? activeTabEl.dataset.tab : "playlists";
        const sortBy = libSortSelect ? libSortSelect.value : "recents";

        if (window.AlbumManager) {
            window.AlbumManager.syncLibraryTabActions({
                tab: activeTab,
                createPlaylistBtn: $("#openCreateModalBtn"),
                createAlbumBtn: $("#openCreateAlbumBtn")
            });
        }

        let items = getAllLibraryItems();

        // Filter by tab
        if (activeTab === "playlists") {
            items = items.filter(i => i.type === "playlist");
        } else if (activeTab === "albums") {
            items = items.filter(i => i.type === "album");
        } else if (activeTab === "artists") {
            items = items.filter(i => i.type === "artist");
        } else if (activeTab === "recents") {
            // Show recently played songs (most recent first)
            const recentIds = [...recentlyPlayed].reverse();
            if (recentIds.length > 0) {
                items = songs.filter(s => recentIds.includes(s.id)).map(s => ({
                    id: `song-${s.id}`, songId: s.id, title: s.title, creator: s.artist,
                    type: "song", cover: s.cover, src: s.src, kind: "song"
                }));
                items.sort((a, b) => recentIds.indexOf(a.songId) - recentIds.indexOf(b.songId));
            } else {
                // If nothing played yet in history, show all 10 collection tracks
                items = songs.map(s => ({
                    id: `song-${s.id}`, songId: s.id, title: s.title, creator: s.artist,
                    type: "song", cover: s.cover, src: s.src, kind: "song"
                }));
            }
        } else if (activeTab === "podcasts") {
            items = items.filter(i => i.type === "podcast");
        }

        // Filter by search query
        if (query) {
            items = items.filter(i =>
                i.title.toLowerCase().includes(query) ||
                (i.creator && i.creator.toLowerCase().includes(query))
            );
        }

        // Sort items (keep pinned Liked Songs first)
        if (sortBy === "az" || sortBy === "creator") {
            items.sort((a, b) => {
                const aPinned = Boolean(a.pinned || a.isLiked);
                const bPinned = Boolean(b.pinned || b.isLiked);
                if (aPinned !== bPinned) return aPinned ? -1 : 1;
                if (sortBy === "az") {
                    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
                }
                return (a.creator || "").localeCompare(b.creator || "", undefined, { sensitivity: "base" });
            });
        }

        if (libTotalCount) libTotalCount.textContent = `${items.length} ${items.length === 1 ? "item" : "items"}`;

        if (items.length === 0) {
            libItemsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--loud-magenta);">
                    <i class="fa-solid fa-compact-disc" style="font-size: 38px; margin-bottom: 12px; display: block;"></i>
                    <p style="font-size: 16px; font-weight: 800;">No items found in your library.</p>
                </div>
            `;
            return;
        }

        items.forEach(item => {
            const card = document.createElement("article");
            card.className = "lib-card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");

            const pinHtml = item.pinned ? '<span class="lib-pin-tag"><i class="fa-solid fa-thumbtack"></i></span>' : '';
            const typeLabel = item.type === "album" ? "Album" : item.type === "song" ? "Song" : item.type === "artist" ? "Artist" : "Playlist";

            const ARTIST_LINKS = {
                "Chris Brown": { genre: "Contemporary R&B / Pop", spotify: "https://open.spotify.com/artist/7bXgB6jMjp9ATFy66eO08Z", instagram: "https://www.instagram.com/chrisbrownofficial/", facebook: "https://www.facebook.com/chrisbrown" },
                "Bryson Tiller": { genre: "TrapSoul / R&B", spotify: "https://open.spotify.com/artist/2EMAnMvWE2eb56ToJVfCWs", instagram: "https://www.instagram.com/brysontiller/", facebook: "https://www.facebook.com/brysontiller" },
                "Kehlani": { genre: "Contemporary R&B / Neo-Soul", spotify: "https://open.spotify.com/artist/0cGUm45nv7Z6M6qdXYQGTX", instagram: "https://www.instagram.com/kehlani/", facebook: "https://www.facebook.com/kehlani" },
                "Usher": { genre: "R&B Icon / Pop", spotify: "https://open.spotify.com/artist/23zg3TcAtWQy7J6upgbUnj", instagram: "https://www.instagram.com/usher/", facebook: "https://www.facebook.com/usher" },
                "Ne-Yo": { genre: "R&B / Pop Songwriter", spotify: "https://open.spotify.com/artist/21E3waRsmPlU7jZsS13rcj", instagram: "https://www.instagram.com/neyo/", facebook: "https://www.facebook.com/neyo" },
                "Ravyn Lenae": { genre: "Alternative R&B / Neo-Soul", spotify: "https://open.spotify.com/artist/5RTLRtXjbXI2lSXc6jxlAz", instagram: "https://www.instagram.com/ravynlenae/", facebook: "https://www.facebook.com/ravynlenae" },
                "The Weeknd": { genre: "Synth-Pop / Dark R&B", spotify: "https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ", instagram: "https://www.instagram.com/theweeknd/", facebook: "https://www.facebook.com/theweeknd" },
                "Playboi Carti": { genre: "Experimental Trap / Rage", spotify: "https://open.spotify.com/artist/699OTQXzgjhIYAHMy9RyPD", instagram: "https://www.instagram.com/playboicarti/", facebook: "https://www.facebook.com/PlayboiCarti/" },
                "Tommy Richman": { genre: "Funk / Alternative R&B", spotify: "https://open.spotify.com/artist/1WaFQSHVGZQJTbf0BdxdNo", instagram: "https://www.instagram.com/tommyrichmann/", facebook: "https://www.facebook.com/tommyrichmann/" }
            };

            let thumbHtml = "";
            if (item.isLiked) {
                thumbHtml = `<div class="lib-card-thumb-wrap"><div class="lib-card-liked-bg"><i class="fa-solid fa-heart"></i></div><button class="lib-card-play-btn"><i class="fa-solid fa-circle-play"></i></button></div>`;
            } else if (item.isCustom && !item.cover) {
                thumbHtml = `
                    <div class="lib-card-thumb-wrap">
                        <div class="lib-card-liked-bg" style="background: linear-gradient(135deg, #450af5, #8e8ee5);"><i class="fa-solid fa-music"></i></div>
                        <button class="lib-card-play-btn"><i class="fa-solid fa-circle-play"></i></button>
                    </div>
                `;
            } else if (item.type === "artist") {
                // Artist card: NO play button on hover
                thumbHtml = `
                    <div class="lib-card-thumb-wrap">
                        <img src="${item.cover || '../photos/ItDepends.jpg'}" alt="${item.title}" loading="lazy" style="border-radius:50%;">
                    </div>
                `;
            } else {
                thumbHtml = `
                    <div class="lib-card-thumb-wrap">
                        <img src="${item.cover || '../photos/ItDepends.jpg'}" alt="${item.title}" loading="lazy">
                        <button class="lib-card-play-btn"><i class="fa-solid fa-circle-play"></i></button>
                    </div>
                `;
            }

            // Action buttons for custom playlists (Delete + Edit Profile Picture/Text)
            let customActionsHtml = "";
            let customDescHtml = "";
            let manageSongsBtnHtml = "";
            let artistCardBtnsHtml = "";

            if (item.type === "artist") {
                artistCardBtnsHtml = `
                    <div class="lib-artist-card-actions">
                        <button type="button" class="lib-artist-view-btn" title="Open ${item.title}'s Profile"><i class="fa-solid fa-user"></i> View</button>
                        <button type="button" class="lib-artist-share-btn" title="Share ${item.title}'s Info"><i class="fa-solid fa-share-nodes"></i> Share</button>
                    </div>
                `;
            }

            if (item.isCustom === true) {
                customActionsHtml = `
                    <button type="button" class="lib-delete-custom-btn" title="Delete playlist" aria-label="Delete playlist">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    <button type="button" class="lib-edit-custom-btn" title="Edit Profile Picture & Description" aria-label="Edit playlist">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                `;
                if (item.desc) {
                    customDescHtml = `<p class="lib-card-desc" style="font-size:12px;color:#aaa;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${item.desc}">"${item.desc}"</p>`;
                }
                manageSongsBtnHtml = `<button type="button" class="lib-manage-songs-btn"><i class="fa-solid fa-music"></i> Manage Songs</button>`;
            } else if (item.isCustomAlbum === true) {
                customActionsHtml = `
                    <button type="button" class="lib-delete-custom-btn lib-delete-custom-album-btn" title="Delete album" aria-label="Delete album">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;
            }

            // Build meta line
            let metaText = `${pinHtml} ${typeLabel} • ${item.creator || (ARTIST_LINKS[item.title] && ARTIST_LINKS[item.title].genre) || 'Verified Artist'}`;
            if (item.isCustom && item.songs) {
                metaText = `${pinHtml} ${typeLabel} • ${item.songs.length} song${item.songs.length !== 1 ? 's' : ''}`;
            }

            card.innerHTML = `
                ${thumbHtml}
                <div class="lib-card-info">
                    <h3 class="lib-card-title">${item.title}</h3>
                    <p class="lib-card-meta">${metaText}</p>
                    ${customDescHtml}
                    ${manageSongsBtnHtml}
                    ${artistCardBtnsHtml}
                </div>
                ${customActionsHtml}
            `;

            const playBtn = card.querySelector(".lib-card-play-btn");
            if (playBtn) {
                playBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (item.songId) {
                        const idx = songs.findIndex(s => s.id === item.songId);
                        if (idx !== -1) loadTrack(idx, true);
                    } else if (item.type === "album") {
                        const albIds = item.songs || item.songIds || [];
                        if (albIds.length > 0) {
                            const idx = songs.findIndex(s => s.id === albIds[0]);
                            if (idx !== -1) loadTrack(idx, true);
                        } else {
                            openLibAlbumView(item);
                        }
                    } else if (item.isLiked) {
                        const favId = [...favorites][0];
                        if (favId) {
                            const idx = songs.findIndex(s => s.id === favId);
                            if (idx !== -1) loadTrack(idx, true);
                        } else {
                            openLibPlaylistView("p-liked");
                        }
                    } else if (item.isCustom) {
                        if (item.songs && item.songs.length > 0) {
                            const idx = songs.findIndex(s => s.id === item.songs[0]);
                            if (idx !== -1) loadTrack(idx, true);
                        } else {
                            openLibPlaylistView(item.id);
                        }
                    }
                });
            }

            if (item.type === "artist") {
                const viewBtn = card.querySelector(".lib-artist-view-btn");
                if (viewBtn) {
                    viewBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        openLibArtistView(item.title);
                    });
                }
                const shareBtn = card.querySelector(".lib-artist-share-btn");
                if (shareBtn) {
                    shareBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        const aInfo = ARTIST_LINKS[item.title] || {};
                        const shareText = `🎤 Artist: ${item.title}\n🎵 Genre: ${aInfo.genre || "R&B"}\n🔗 Spotify: ${aInfo.spotify || ""}\n📸 Instagram: ${aInfo.instagram || ""}\n📘 Facebook: ${aInfo.facebook || ""}`;
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(shareText).catch(() => { });
                        }
                        alert(`Copied ${item.title}'s artist info to clipboard!\n\n${shareText}`);
                    });
                }
            }

            // Custom playlist button handlers
            if (item.isCustom === true) {
                const delBtn = card.querySelector(".lib-delete-custom-btn");
                if (delBtn) {
                    delBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        pendingDeletePlaylistId = item.id;
                        const deleteModal = $("#deleteConfirmModal");
                        if (deleteModal) deleteModal.style.display = "flex";
                    });
                }

                const editBtn = card.querySelector(".lib-edit-custom-btn");
                if (editBtn) {
                    editBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        openEditPlaylistModal(item.id);
                    });
                }

                const manageBtn = card.querySelector(".lib-manage-songs-btn");
                if (manageBtn) {
                    manageBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        openAddSongsModal(item.id);
                    });
                }
            }

            if (item.isCustomAlbum === true) {
                card.querySelector(".lib-delete-custom-album-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (window.AlbumManager) {
                        window.AlbumManager.delete(item.id);
                        renderLibrary();
                    }
                });
            }

            // Clicking card interaction: Opens full Spotify Album / Artist / Playlist view!
            card.addEventListener("click", (e) => {
                if (e.target.closest("button") || e.target.closest("a")) return;

                if (item.type === "album") {
                    openLibAlbumView(item);
                } else if (item.type === "artist") {
                    openLibArtistView(item.title);
                } else if (item.isLiked) {
                    openLibPlaylistView("p-liked");
                } else if (item.isCustom) {
                    openLibPlaylistView(item.id);
                } else if (item.songId) {
                    const idx = songs.findIndex(s => s.id === item.songId);
                    if (idx !== -1) loadTrack(idx, true);
                }
            });

            libItemsContainer.appendChild(card);
        });
    }

    /* ==========================================================
       Spotify-Style Album, Artist & Playlist Detail Views in library.html
       ========================================================== */
    const libMainContentSection = $("#libMainContentSection");
    const libEntityView = $("#libEntityView");
    let savedAlbumsLib = new Set(JSON.parse(localStorage.getItem("spotifake_saved_albums") || "[]"));
    let followedArtistsLib = new Set(JSON.parse(localStorage.getItem("spotifake_followed_artists") || "[]"));

    function showLibGridView() {
        if (libEntityView) libEntityView.style.display = "none";
        if (libMainContentSection) libMainContentSection.style.display = "";
        renderLibrary();
    }

    function showLibEntitySection() {
        if (libMainContentSection) libMainContentSection.style.display = "none";
        if (libEntityView) {
            libEntityView.style.display = "block";
            libEntityView.replaceChildren();
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function openLibAlbumView(album) {
        if (!album || !libEntityView) return;
        showLibEntitySection();

        const albSongIds = Array.isArray(album.songs) ? album.songs : (Array.isArray(album.songIds) ? album.songIds : []);
        const fullTracks = Array.isArray(album.fullTracklist) && album.fullTracklist.length > 0
            ? album.fullTracklist
            : (window.AlbumManager ? window.AlbumManager.buildTrackEntries(songs, albSongIds, album.artistName) : []);
        const isSaved = savedAlbumsLib.has(album.id);
        const artistPfp = ARTIST_PFPS[album.artistName] || album.cover;

        libEntityView.innerHTML = `
            <div class="sp-back-bar">
                <button type="button" class="sp-back-btn" id="libAlbumBackBtn">
                    <i class="fa-solid fa-arrow-left"></i> Back to Library
                </button>
            </div>
            <section class="sp-hero">
                <img src="${album.cover}" alt="${album.title}" class="sp-hero-cover">
                <div class="sp-hero-info">
                    <span class="sp-verified-badge"><i class="fa-solid fa-compact-disc"></i> Album</span>
                    <h1 class="sp-hero-title">${album.title}</h1>
                    <div class="sp-hero-meta">
                        <button type="button" class="sp-meta-artist-chip" id="libAlbumArtistChip">
                            <img src="${artistPfp}" alt="${album.artistName}">
                            <span>${album.artistName}</span>
                        </button>
                        <span>•</span>
                        <span>${album.year || "2024"}</span>
                        <span>•</span>
                        <span>${fullTracks.length} songs</span>
                    </div>
                </div>
            </section>
            <div class="sp-action-bar">
                <button type="button" class="sp-big-play-btn" id="libAlbumPlayBtn" title="Play ${album.title}">
                    <i class="fa-solid fa-play"></i>
                </button>
                <button type="button" class="sp-secondary-btn" id="libAlbumShuffleBtn">
                    <i class="fa-solid fa-shuffle"></i> Shuffle Album
                </button>
                <button type="button" class="sp-secondary-btn${isSaved ? " is-active" : ""}" id="libAlbumSaveBtn">
                    <i class="${isSaved ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    <span>${isSaved ? "Saved in Library" : "Save Album"}</span>
                </button>
            </div>
            <div class="sp-tracklist" id="libAlbumTracklist">
                <div class="sp-tracklist-header">
                    <span>#</span>
                    <span>Title</span>
                    <span class="sp-track-album-col">Album</span>
                    <span>Actions</span>
                    <span style="text-align:right;"><i class="fa-regular fa-clock"></i></span>
                </div>
            </div>
            <div style="margin-top:16px;font-size:11px;color:var(--text-muted);line-height:1.6;">
                <div>Released ${album.year || "2024"} • ${album.label || "Spotifake Records"}</div>
                <div>℗ ${album.year || "2024"} ${album.artistName}. All rights reserved.</div>
            </div>
        `;

        libEntityView.querySelector("#libAlbumBackBtn")?.addEventListener("click", showLibGridView);
        libEntityView.querySelector("#libAlbumArtistChip")?.addEventListener("click", () => openLibArtistView(album.artistName));

        libEntityView.querySelector("#libAlbumPlayBtn")?.addEventListener("click", () => {
            if (albSongIds.length === 0) {
                alert(`"${album.title}" has no tracks yet!`);
                return;
            }
            const firstId = albSongIds[0];
            if (queueCtrl) queueCtrl.setContext(album.title, albSongIds, firstId);
            const idx = songs.findIndex(s => s.id === firstId);
            if (idx !== -1) loadTrack(idx, true);
        });

        libEntityView.querySelector("#libAlbumShuffleBtn")?.addEventListener("click", () => {
            if (albSongIds.length === 0) {
                alert(`"${album.title}" has no tracks yet!`);
                return;
            }
            const pickId = albSongIds[Math.floor(Math.random() * albSongIds.length)];
            if (queueCtrl) queueCtrl.setContext(album.title, albSongIds, pickId);
            setShuffleModeLibState(true);
            const idx = songs.findIndex(s => s.id === pickId);
            if (idx !== -1) loadTrack(idx, true);
        });

        const saveBtn = libEntityView.querySelector("#libAlbumSaveBtn");
        saveBtn?.addEventListener("click", () => {
            if (savedAlbumsLib.has(album.id)) savedAlbumsLib.delete(album.id);
            else savedAlbumsLib.add(album.id);
            localStorage.setItem("spotifake_saved_albums", JSON.stringify([...savedAlbumsLib]));
            const nowSaved = savedAlbumsLib.has(album.id);
            saveBtn.classList.toggle("is-active", nowSaved);
            saveBtn.innerHTML = `<i class="${nowSaved ? "fa-solid" : "fa-regular"} fa-heart"></i><span>${nowSaved ? "Saved in Library" : "Save Album"}</span>`;
        });

        const tracklistEl = libEntityView.querySelector("#libAlbumTracklist");
        const albumSpotifyUrl = window.AlbumManager ? window.AlbumManager.getSpotifyUrl(album) : "";
        const spotifyBox = window.AlbumManager ? window.AlbumManager.createSpotifyAlbumBox(album) : null;
        if (spotifyBox && tracklistEl && tracklistEl.parentNode) {
            tracklistEl.parentNode.insertBefore(spotifyBox, tracklistEl);
        }

        fullTracks.forEach((tr, idx) => {
            const isSpotifyOnly = !tr.songId;
            const mappedSongId = tr.songId || null;
            const isFav = !isSpotifyOnly && favorites.has(mappedSongId);
            const row = document.createElement("div");
            row.className = `sp-track-row${isSpotifyOnly ? " is-spotify-only" : ""}`;
            row.innerHTML = `
                <div class="sp-track-num">${tr.num || idx + 1}</div>
                <div class="sp-track-main">
                    <div class="sp-track-titles">
                        <div class="sp-track-title-line">
                            <span class="sp-track-title">${tr.title}</span>
                        </div>
                        <div class="sp-track-sub">${(tr.artists || [album.artistName]).join(", ")}</div>
                    </div>
                </div>
                <div class="sp-track-album-col">${album.title}</div>
                <div class="sp-track-actions">
                    ${isSpotifyOnly ? "" : `
                    <button type="button" class="sp-icon-btn sp-row-fav-btn${isFav ? " is-fav" : ""}" title="${isFav ? "Remove from Liked Songs" : "Save to Liked Songs"}">
                        <i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>
                    <button type="button" class="sp-icon-btn sp-row-queue-btn" title="Add to queue">
                        <i class="fa-solid fa-bars-staggered"></i>
                    </button>`}
                </div>
                <div class="sp-track-duration">${tr.duration || "3:30"}</div>
            `;
            if (isSpotifyOnly) {
                const titleLine = row.querySelector(".sp-track-title-line");
                if (titleLine && window.AlbumManager) {
                    titleLine.appendChild(window.AlbumManager.createSpotifyOnlyBadge());
                }
                const actionsWrap = row.querySelector(".sp-track-actions");
                if (actionsWrap && window.AlbumManager && albumSpotifyUrl) {
                    actionsWrap.appendChild(window.AlbumManager.createSpotifyRowLink(albumSpotifyUrl));
                }
            } else {
                row.querySelector(".sp-row-fav-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (favorites.has(mappedSongId)) favorites.delete(mappedSongId);
                    else favorites.add(mappedSongId);
                    localStorage.setItem("spotifake_favorites", JSON.stringify([...favorites]));
                    updateFavoritesUI();
                    const nowFav = favorites.has(mappedSongId);
                    const btn = row.querySelector(".sp-row-fav-btn");
                    if (btn) {
                        btn.classList.toggle("is-fav", nowFav);
                        btn.innerHTML = `<i class="${nowFav ? "fa-solid" : "fa-regular"} fa-heart"></i>`;
                    }
                });
                row.querySelector(".sp-row-queue-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (queueCtrl && mappedSongId != null) queueCtrl.addToQueue(mappedSongId);
                });
            }
            row.addEventListener("click", () => {
                if (isSpotifyOnly) {
                    if (albumSpotifyUrl) {
                        window.open(albumSpotifyUrl, "_blank", "noopener,noreferrer");
                    }
                    return;
                }
                if (queueCtrl) queueCtrl.setContext(album.title, albSongIds, tr.songId);
                const targetIdx = songs.findIndex(s => s.id === tr.songId);
                if (targetIdx !== -1) {
                    loadTrack(targetIdx, true);
                }
            });
            tracklistEl.appendChild(row);
        });
    }

    function openLibArtistView(artistName) {
        if (!artistName || !libEntityView) return;
        showLibEntitySection();

        const pfp = ARTIST_PFPS[artistName] || "../PFPs/ChrisBrownz.jpg";
        const isFollowing = followedArtistsLib.has(artistName);
        const artistSongs = songs.filter(s => s.artist.toLowerCase().includes(artistName.toLowerCase()));
        const artistAlbums = baseAlbums.filter(a => a.artistName === artistName);

        libEntityView.innerHTML = `
            <div class="sp-back-bar">
                <button type="button" class="sp-back-btn" id="libArtistBackBtn">
                    <i class="fa-solid fa-arrow-left"></i> Back to Library
                </button>
            </div>
            <section class="sp-hero">
                <img src="${pfp}" alt="${artistName}" class="sp-hero-cover is-artist-avatar">
                <div class="sp-hero-info">
                    <span class="sp-verified-badge"><i class="fa-solid fa-circle-check"></i> Verified Artist</span>
                    <h1 class="sp-hero-title">${artistName}</h1>
                    <div class="sp-hero-meta">
                        <span>${artistSongs.length} song${artistSongs.length !== 1 ? "s" : ""} in your library</span>
                    </div>
                </div>
            </section>
            <div class="sp-action-bar">
                <button type="button" class="sp-secondary-btn${isFollowing ? " is-active" : ""}" id="libArtistFollowBtn">
                    <i class="fa-solid ${isFollowing ? "fa-user-check" : "fa-user-plus"}"></i>
                    <span>${isFollowing ? "Following" : "Follow"}</span>
                </button>
            </div>
            <h2 class="sp-section-heading"><i class="fa-solid fa-fire"></i> Popular</h2>
            <div class="sp-tracklist" id="libArtistTracks"></div>
            ${artistAlbums.length > 0 ? `<h2 class="sp-section-heading"><i class="fa-solid fa-compact-disc"></i> Discography &amp; Albums</h2><div class="sp-discography-grid" id="libArtistDiscog"></div>` : ""}
        `;

        libEntityView.querySelector("#libArtistBackBtn")?.addEventListener("click", showLibGridView);

        const followBtn = libEntityView.querySelector("#libArtistFollowBtn");
        followBtn?.addEventListener("click", () => {
            if (followedArtistsLib.has(artistName)) followedArtistsLib.delete(artistName);
            else followedArtistsLib.add(artistName);
            localStorage.setItem("spotifake_followed_artists", JSON.stringify([...followedArtistsLib]));
            const nowFollowing = followedArtistsLib.has(artistName);
            followBtn.classList.toggle("is-active", nowFollowing);
            followBtn.innerHTML = `<i class="fa-solid ${nowFollowing ? "fa-user-check" : "fa-user-plus"}"></i><span>${nowFollowing ? "Following" : "Follow"}</span>`;
        });

        const tracksWrap = libEntityView.querySelector("#libArtistTracks");
        artistSongs.forEach((s, idx) => {
            const row = document.createElement("div");
            row.className = "sp-track-row";
            row.innerHTML = `
                <div class="sp-track-num">${idx + 1}</div>
                <div class="sp-track-main">
                    <img src="${s.cover}" alt="${s.title}" class="sp-track-thumb">
                    <div class="sp-track-titles">
                        <span class="sp-track-title">${s.title}</span>
                        <div class="sp-track-sub">${s.artist}</div>
                    </div>
                </div>
                <div class="sp-track-album-col">${s.album}</div>
                <div class="sp-track-actions"></div>
                <div class="sp-track-duration">3:45</div>
            `;
            row.addEventListener("click", () => {
                const sIdx = songs.findIndex(x => x.id === s.id);
                if (sIdx !== -1) loadTrack(sIdx, true);
            });
            tracksWrap.appendChild(row);
        });

        const discogWrap = libEntityView.querySelector("#libArtistDiscog");
        if (discogWrap) {
            artistAlbums.forEach(alb => {
                const c = document.createElement("article");
                c.className = "sp-Entity-card";
                c.innerHTML = `<img src="${alb.cover}" alt="${alb.title}"><h4>${alb.title}</h4><p>${alb.year || "2024"} • Album</p>`;
                c.addEventListener("click", () => openLibAlbumView(alb));
                discogWrap.appendChild(c);
            });
        }
    }

    function openLibPlaylistView(playlistId) {
        if (!libEntityView) return;
        showLibEntitySection();

        const isLiked = playlistId === "p-liked" || playlistId === "liked";
        const pl = isLiked
            ? { id: "p-liked", title: "Liked Songs", desc: "All the tracks you have hearted across Spotifake.", songs: [...favorites], isLiked: true }
            : customPlaylists.find(p => p.id === playlistId);
        if (!pl) { showLibGridView(); return; }

        const plSongs = (pl.songs || []).map(id => songs.find(s => Number(s.id) === Number(id))).filter(Boolean);
        const coverHtml = isLiked
            ? `<div class="sp-hero-cover" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#FF007F,#7928CA);font-size:64px;color:#fff;"><i class="fa-solid fa-heart"></i></div>`
            : pl.cover
                ? `<img src="${pl.cover}" alt="${pl.title}" class="sp-hero-cover">`
                : `<div class="sp-hero-cover" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#450af5,#8e8ee5);font-size:54px;color:#fff;"><i class="fa-solid fa-music"></i></div>`;

        libEntityView.innerHTML = `
            <div class="sp-back-bar">
                <button type="button" class="sp-back-btn" id="libPlBackBtn">
                    <i class="fa-solid fa-arrow-left"></i> Back to Library
                </button>
            </div>
            <section class="sp-hero">
                ${coverHtml}
                <div class="sp-hero-info">
                    <span class="sp-verified-badge"><i class="fa-solid fa-music"></i> ${isLiked ? "Pinned Playlist" : "Custom Playlist"}</span>
                    <h1 class="sp-hero-title">${pl.title}</h1>
                    <p style="margin:2px 0 4px 0;font-size:13px;color:#d0d0e0;">${pl.desc || "Custom user playlist"}</p>
                    <div class="sp-hero-meta">
                        <span style="color:var(--neon-yellow);font-weight:800;">${getSavedLibUserName()}</span>
                        <span>•</span>
                        <span>${plSongs.length} song${plSongs.length !== 1 ? "s" : ""}</span>
                    </div>
                </div>
            </section>
            <div class="sp-action-bar">
                <button type="button" class="sp-big-play-btn" id="libPlPlayBtn"><i class="fa-solid fa-play"></i></button>
                ${!isLiked ? `<button type="button" class="sp-primary-action-btn" id="libPlAddSongsBtn"><i class="fa-solid fa-plus"></i> Add Songs</button>` : ""}
            </div>
            <div class="sp-tracklist" id="libPlTracklist"></div>
        `;

        libEntityView.querySelector("#libPlBackBtn")?.addEventListener("click", showLibGridView);
        libEntityView.querySelector("#libPlPlayBtn")?.addEventListener("click", () => {
            if (plSongs.length > 0) {
                const sIdx = songs.findIndex(s => s.id === plSongs[0].id);
                if (sIdx !== -1) loadTrack(sIdx, true);
            }
        });
        libEntityView.querySelector("#libPlAddSongsBtn")?.addEventListener("click", () => openAddSongsModal(pl.id));

        const tracklistEl = libEntityView.querySelector("#libPlTracklist");
        if (plSongs.length === 0) {
            tracklistEl.innerHTML = `<div style="padding:32px;text-align:center;color:var(--text-muted);">No songs in this playlist yet.</div>`;
        } else {
            plSongs.forEach((s, idx) => {
                const row = document.createElement("div");
                row.className = "sp-track-row";
                row.innerHTML = `
                    <div class="sp-track-num">${idx + 1}</div>
                    <div class="sp-track-main">
                        <img src="${s.cover}" alt="${s.title}" class="sp-track-thumb">
                        <div class="sp-track-titles">
                            <span class="sp-track-title">${s.title}</span>
                            <div class="sp-track-sub">${s.artist}</div>
                        </div>
                    </div>
                    <div class="sp-track-album-col">${s.album}</div>
                    <div class="sp-track-actions"></div>
                    <div class="sp-track-duration">3:45</div>
                `;
                row.addEventListener("click", () => {
                    const sIdx = songs.findIndex(x => x.id === s.id);
                    if (sIdx !== -1) loadTrack(sIdx, true);
                });
                tracklistEl.appendChild(row);
            });
        }
    }

    /* Category Pill Filter Events */
    libCategoryTabs.forEach(pill => {
        pill.addEventListener("click", () => {
            if (libEntityView) libEntityView.style.display = "none";
            if (libMainContentSection) libMainContentSection.style.display = "";
            libCategoryTabs.forEach(p => { p.classList.remove("active"); p.setAttribute("aria-selected", "false"); });
            pill.classList.add("active");
            pill.setAttribute("aria-selected", "true");
            renderLibrary();
        });
    });

    /* Live Search Input */
    if (libFilterInput) {
        libFilterInput.addEventListener("input", renderLibrary);
    }
    if (libGlobalSearch) {
        libGlobalSearch.addEventListener("input", () => {
            if (libFilterInput) libFilterInput.value = libGlobalSearch.value;
            renderLibrary();
        });
    }

    /* Sort Select */
    if (libSortSelect) {
        libSortSelect.addEventListener("change", renderLibrary);
    }

    /* Grid vs List View */
    if (viewGridBtn && viewListBtn) {
        viewGridBtn.addEventListener("click", () => {
            viewGridBtn.classList.add("active");
            viewListBtn.classList.remove("active");
            libItemsContainer.classList.remove("list-view");
        });

        viewListBtn.addEventListener("click", () => {
            viewListBtn.classList.add("active");
            viewGridBtn.classList.remove("active");
            libItemsContainer.classList.add("list-view");
        });
    }

    /* ==========================================================
       Audio Player Engine
       ========================================================== */
    function getCurrentSong() {
        return songs[currentIndex] || songs[0];
    }

    function updatePlayButton() {
        const isPlaying = !audio.paused && !audio.ended;
        const icon = playButton.querySelector("i");
        if (icon) {
            icon.className = `player-btns fa-solid ${isPlaying ? "fa-circle-pause" : "fa-circle-play"}`;
        }
        playButton.title = isPlaying ? "Pause" : "Play";
        if (musicVisualizer) musicVisualizer.classList.toggle("is-active", isPlaying);
    }

    function syncShuffleRepeatLibUI() {
        if (shuffleButton) {
            shuffleButton.classList.toggle("active", isShuffle);
            shuffleButton.setAttribute("aria-pressed", String(isShuffle));
            shuffleButton.title = isShuffle ? "Disable shuffle" : "Enable shuffle";
        }
        if (repeatButton) {
            repeatButton.classList.toggle("active", repeatMode !== "off");
            repeatButton.setAttribute("aria-pressed", String(repeatMode !== "off"));
            repeatButton.dataset.mode = repeatMode;
            repeatButton.style.position = "relative";

            let badge = repeatButton.querySelector(".repeat-one-badge");
            if (repeatMode === "one") {
                if (!badge) {
                    badge = document.createElement("span");
                    badge.className = "repeat-one-badge";
                    badge.textContent = "1";
                    repeatButton.appendChild(badge);
                }
                badge.style.display = "flex";
            } else if (badge) {
                badge.style.display = "none";
            }

            repeatButton.title = {
                off: "Enable repeat",
                all: "Enable repeat one",
                one: "Disable repeat"
            }[repeatMode] || "Repeat";
        }
    }

    function stopActiveCrossfadeLib(finalizeInDeck = true) {
        if (crossfadeRafId) {
            cancelAnimationFrame(crossfadeRafId);
            crossfadeRafId = null;
        }
        if (activeFadeState) {
            const { outDeck, inDeck } = activeFadeState;
            if (outDeck && outDeck !== audio) {
                outDeck.pause();
                try { outDeck.currentTime = 0; } catch (e) { }
                outDeck.volume = 0;
            }
            if (finalizeInDeck && inDeck) {
                inDeck.muted = isMasterMuted;
                inDeck.volume = isMasterMuted ? 0 : masterVolume;
            }
            activeFadeState = null;
        }
    }

    function runCrossfadeLib(outDeck, inDeck, durationSec) {
        const startTime = performance.now();
        const durationMs = Math.max(400, durationSec * 1000);
        const remainingSec = Number.isFinite(outDeck.duration) ? Math.max(0.35, outDeck.duration - outDeck.currentTime) : durationSec;
        const outDurationMs = Math.max(350, Math.min(durationMs, remainingSec * 1000));
        const outStartRatio = masterVolume > 0 ? Math.min(1, Math.max(0.15, outDeck.volume / masterVolume)) : 1;

        activeFadeState = { outDeck, inDeck };

        function step(now) {
            if (!activeFadeState || activeFadeState.inDeck !== inDeck) return;
            const elapsed = now - startTime;
            const inProgress = Math.min(1, elapsed / durationMs);
            const outProgress = Math.min(1, elapsed / outDurationMs);
            const targetVol = isMasterMuted ? 0 : masterVolume;

            const outGain = Math.cos(outProgress * Math.PI * 0.5) * targetVol * outStartRatio;
            const inGain = Math.sin(inProgress * Math.PI * 0.5) * targetVol;

            if (!outDeck.paused && !outDeck.ended) {
                outDeck.muted = isMasterMuted;
                outDeck.volume = Math.max(0, Math.min(1, outGain));
            }
            inDeck.muted = isMasterMuted;
            inDeck.volume = Math.max(0, Math.min(1, inGain));

            if (outProgress >= 1 && !outDeck.paused) {
                outDeck.pause();
                try { outDeck.currentTime = 0; } catch (e) { }
                outDeck.volume = 0;
            }

            if (inProgress < 1) {
                crossfadeRafId = requestAnimationFrame(step);
            } else {
                crossfadeRafId = null;
                activeFadeState = null;
                if (!outDeck.paused) {
                    outDeck.pause();
                    try { outDeck.currentTime = 0; } catch (e) { }
                    outDeck.volume = 0;
                }
                inDeck.muted = isMasterMuted;
                inDeck.volume = isMasterMuted ? 0 : masterVolume;
            }
        }
        crossfadeRafId = requestAnimationFrame(step);
    }

    function loadTrack(index, autoplay = true, meta = {}) {
        if (index < 0 || index >= songs.length) return;
        const song = songs[index];
        const targetAbsSrc = new URL(song.src, window.location.href).href;
        if (!meta.forceReload && index === currentIndex && audio.src === targetAbsSrc) {
            autoCrossfadeTriggered = false;
            if (queueCtrl) queueCtrl.onTrackLoaded(song.id, meta);
            if (audio.ended) {
                audio.currentTime = 0;
            }
            if (!activeFadeState) {
                audio.muted = isMasterMuted;
                audio.volume = isMasterMuted ? 0 : masterVolume;
            }
            updateFavoritesUI();
            if (autoplay && audio.paused) {
                audio.play().then(updatePlayButton).catch(console.error);
            } else {
                updatePlayButton();
            }
            return;
        }
        const canCrossfade =
            autoplay &&
            crossfadeSeconds > 0 &&
            !audio.paused &&
            !audio.ended &&
            Boolean(audio.src) &&
            audio.src !== targetAbsSrc;

        autoCrossfadeTriggered = false;
        currentIndex = index;
        if (queueCtrl) queueCtrl.onTrackLoaded(song.id, meta);

        // Track recently played
        if (!recentlyPlayed.includes(song.id)) {
            recentlyPlayed.push(song.id);
        } else {
            recentlyPlayed = recentlyPlayed.filter(id => id !== song.id);
            recentlyPlayed.push(song.id);
        }
        if (recentlyPlayed.length > 50) recentlyPlayed = recentlyPlayed.slice(-50);
        localStorage.setItem("spotifake_recents", JSON.stringify(recentlyPlayed));

        if (canCrossfade) {
            stopActiveCrossfadeLib(false);
            const outgoingDeck = audio;
            const incomingDeck = outgoingDeck === deckA ? deckB : deckA;
            audio = incomingDeck;

            incomingDeck.pause();
            incomingDeck.src = song.src;
            incomingDeck.muted = isMasterMuted;
            incomingDeck.volume = 0;
            incomingDeck.load();

            currentTitle.textContent = song.title;
            currentArtist.textContent = song.artist;
            currentImage.src = song.cover;
            updateFavoritesUI();

            incomingDeck.play().then(() => {
                updatePlayButton();
                if (audio === incomingDeck && !incomingDeck.paused) {
                    runCrossfadeLib(outgoingDeck, incomingDeck, crossfadeSeconds);
                } else {
                    outgoingDeck.pause();
                    try { outgoingDeck.currentTime = 0; } catch (e) { }
                    incomingDeck.volume = isMasterMuted ? 0 : masterVolume;
                }
            }).catch(console.error);
            return;
        }

        stopActiveCrossfadeLib(true);
        audio.pause();
        audio.src = song.src;
        audio.muted = isMasterMuted;
        audio.volume = isMasterMuted ? 0 : masterVolume;
        currentTitle.textContent = song.title;
        currentArtist.textContent = song.artist;
        currentImage.src = song.cover;

        updateFavoritesUI();

        if (autoplay) {
            audio.play().then(updatePlayButton).catch(console.error);
        } else {
            updatePlayButton();
        }
    }

    function togglePlay() {
        if (audio.paused) {
            if (!activeFadeState) {
                audio.muted = isMasterMuted;
                audio.volume = isMasterMuted ? 0 : masterVolume;
            }
            audio.play().then(updatePlayButton).catch(console.error);
        } else {
            stopActiveCrossfadeLib(true);
            deckA.pause();
            deckB.pause();
            updatePlayButton();
        }
    }

    function nextTrack(isAutoEnded = false) {
        if (queueCtrl) {
            const res = queueCtrl.advanceNext(isAutoEnded);
            if (res && res.ended) {
                audio.pause();
                audio.currentTime = 0;
                updatePlayButton();
            }
            return;
        }
        if (currentIndex < songs.length - 1) {
            loadTrack(currentIndex + 1, true);
        } else if (repeatMode === "all" || !isAutoEnded) {
            loadTrack(0, true);
        } else {
            audio.pause();
            audio.currentTime = 0;
            updatePlayButton();
        }
    }

    function previousTrack() {
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
        if (currentIndex > 0) {
            loadTrack(currentIndex - 1, true);
        } else if (repeatMode === "all") {
            loadTrack(songs.length - 1, true);
        } else {
            audio.currentTime = 0;
        }
    }

    playButton.addEventListener("click", togglePlay);
    nextButton.addEventListener("click", () => nextTrack(false));
    previousButton.addEventListener("click", previousTrack);

    syncShuffleRepeatLibUI();

    // Shuffle & Repeat with Glowing Dot (Spotify-style Fisher-Yates bag)
    shuffleButton.addEventListener("click", () => {
        setShuffleModeLibState(!isShuffle);
    });

    repeatButton.addEventListener("click", () => {
        const modes = ["off", "all", "one"];
        repeatMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
        localStorage.setItem("spotifake_repeat", repeatMode);
        syncShuffleRepeatLibUI();
    });

    const saveLibPlayback = (force = false) => {
        window.SpotifakePlayback?.save(() => audio, () => songs[currentIndex], force);
    };
    window.SpotifakePlayback?.bindLifecycle?.({
        getAudio: () => audio,
        getSong: () => songs[currentIndex],
        onPageShow: (saved) => {
            const idx = songs.findIndex(s => Number(s.id) === Number(saved.songId));
            if (idx === -1) return;
            if (idx !== currentIndex) loadTrack(idx, false);
            window.SpotifakePlayback.restoreCurrentAudio?.({
                songId: songs[idx].id,
                getAudio: () => audio,
                onResume: (wasPlaying) => {
                    if (wasPlaying) return audio.play().then(updatePlayButton);
                    if (!audio.paused) audio.pause();
                    updatePlayButton();
                }
            });
        }
    });

    function bindDeckEventsLib(deck) {
        deck.addEventListener("play", () => { if (deck === audio) saveLibPlayback(true); });
        deck.addEventListener("pause", () => { if (deck === audio) saveLibPlayback(true); });
        deck.addEventListener("timeupdate", () => {
            if (deck !== audio) return;
            const total = audio.duration;
            if (!Number.isFinite(total) || total <= 0) return;
            saveLibPlayback(false);
            currentTime.textContent = formatTime(audio.currentTime);
            duration.textContent = formatTime(total);
            const pct = (audio.currentTime / total) * 100;
            progressBar.value = Math.round(pct);
            progressBar.style.background = `linear-gradient(to right, var(--loud-magenta) ${pct}%, #282834 ${pct}%)`;

            if (
                crossfadeSeconds > 0 &&
                repeatMode !== "one" &&
                !autoCrossfadeTriggered &&
                !audio.paused &&
                !audio.ended &&
                total > crossfadeSeconds + 1.5
            ) {
                const remaining = total - audio.currentTime;
                if (remaining > 0.2 && remaining <= crossfadeSeconds) {
                    const hasNext = queueCtrl
                        ? queueCtrl.hasAutoNext()
                        : (repeatMode === "all" || currentIndex < songs.length - 1);
                    if (hasNext) {
                        autoCrossfadeTriggered = true;
                        nextTrack(true);
                    }
                }
            }
        });

        deck.addEventListener("ended", () => {
            if (deck !== audio) {
                deck.volume = 0;
                return;
            }
            if (repeatMode === "one") {
                audio.currentTime = 0;
                audio.play().then(updatePlayButton).catch(console.error);
            } else {
                nextTrack(true);
            }
        });
    }

    bindDeckEventsLib(deckA);
    bindDeckEventsLib(deckB);

    progressBar.addEventListener("change", () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime = (Number(progressBar.value) / 100) * audio.duration;
        }
    });

    // Volume
    function syncVolumeUILib() {
        const isMuted = isMasterMuted || masterVolume === 0;
        const pct = isMuted ? 0 : masterVolume * 100;
        volumeBar.value = isMuted ? 0 : masterVolume;
        volumeBar.style.background = `linear-gradient(to right, var(--loud-magenta) ${pct}%, #282834 ${pct}%)`;
        const icon = muteButton.querySelector("i");
        if (icon) {
            icon.className = isMuted
                ? "fa-solid fa-volume-xmark"
                : masterVolume < 0.5
                    ? "fa-solid fa-volume-low"
                    : "fa-solid fa-volume-high";
        }
    }
    syncVolumeUILib();

    volumeBar.addEventListener("input", () => {
        masterVolume = Number(volumeBar.value);
        isMasterMuted = false;
        if (masterVolume > 0) lastVolume = masterVolume;
        localStorage.setItem("spotifake_volume", String(masterVolume));
        localStorage.setItem("spotifake_muted", "0");
        if (!activeFadeState) {
            audio.volume = masterVolume;
            audio.muted = false;
        }
        syncVolumeUILib();
    });

    muteButton.addEventListener("click", () => {
        if (isMasterMuted || masterVolume === 0) {
            isMasterMuted = false;
            masterVolume = lastVolume || 0.75;
        } else {
            lastVolume = masterVolume;
            isMasterMuted = true;
        }
        localStorage.setItem("spotifake_volume", String(masterVolume));
        localStorage.setItem("spotifake_muted", isMasterMuted ? "1" : "0");
        if (!activeFadeState) {
            audio.muted = isMasterMuted;
            audio.volume = isMasterMuted ? 0 : masterVolume;
        }
        syncVolumeUILib();
    });

    /* Favorites System */
    function updateFavoritesUI() {
        const song = getCurrentSong();
        if (playerFavBtn && song) {
            const isFav = favorites.has(song.id);
            playerFavBtn.classList.toggle("is-favorite", isFav);
            const icon = playerFavBtn.querySelector("i");
            if (icon) icon.className = isFav ? "fa-solid fa-heart" : "fa-regular fa-heart";
        }
    }

    if (playerFavBtn) {
        playerFavBtn.addEventListener("click", () => {
            const song = getCurrentSong();
            if (!song) return;
            if (favorites.has(song.id)) {
                favorites.delete(song.id);
            } else {
                favorites.add(song.id);
            }
            localStorage.setItem("spotifake_favorites", JSON.stringify([...favorites]));
            updateFavoritesUI();
        });
    }

    /* Create Playlist Modal */
    const openCreateModalBtn = $("#openCreateModalBtn");
    const createPlaylistModal = $("#createPlaylistModal");
    const plCreateBtn = $("#plCreateBtn");
    const plCancelBtn = $("#plCancelBtn");

    if (openCreateModalBtn && createPlaylistModal) {
        openCreateModalBtn.addEventListener("click", () => {
            createPlaylistModal.style.display = "flex";
        });
    }

    if (plCancelBtn && createPlaylistModal) {
        plCancelBtn.addEventListener("click", () => {
            createPlaylistModal.style.display = "none";
        });
    }

    if (plCreateBtn && createPlaylistModal) {
        plCreateBtn.addEventListener("click", () => {
            const nameInput = $("#plName");
            const descInput = $("#plDesc");
            const imgInput = $("#plImg");
            const name = nameInput ? nameInput.value.trim() : "";
            const desc = descInput ? descInput.value.trim() : "";
            if (!name) return;

            const imgFile = imgInput && imgInput.files && imgInput.files[0] ? imgInput.files[0] : null;

            function createAndSave(imageDataURL) {
                const newPl = {
                    id: "custom-" + Date.now(),
                    title: name,
                    creator: getSavedLibUserName(),
                    type: "playlist",
                    cover: imageDataURL || null,
                    desc: desc || "Custom user playlist",
                    songs: []
                };

                customPlaylists.unshift(newPl);
                localStorage.setItem("spotifake_custom_playlists", JSON.stringify(customPlaylists));

                createPlaylistModal.style.display = "none";
                if (nameInput) nameInput.value = "";
                if (descInput) descInput.value = "";
                if (imgInput) imgInput.value = "";
                renderLibrary();
            }

            if (imgFile) {
                const reader = new FileReader();
                reader.onload = function (ev) {
                    createAndSave(ev.target.result);
                };
                reader.readAsDataURL(imgFile);
            } else {
                createAndSave(null);
            }
        });
    }

    /* Create Album Modal */
    if (window.AlbumManager) {
        window.AlbumManager.wireCreateModal({
            songs,
            triggerButtons: [$("#openCreateAlbumBtn")],
            getDefaultArtist: getSavedLibUserName,
            onError: (msg) => alert(msg),
            onCreated: () => {
                renderLibrary();
            }
        });
    }

    /* Delete Playlist Confirmation Modal */
    const deleteConfirmModal = $("#deleteConfirmModal");
    const delConfirmBtn = $("#delConfirmBtn");
    const delCancelBtn = $("#delCancelBtn");

    if (delConfirmBtn && deleteConfirmModal) {
        delConfirmBtn.addEventListener("click", () => {
            if (pendingDeletePlaylistId) {
                customPlaylists = customPlaylists.filter(p => p.id !== pendingDeletePlaylistId);
                localStorage.setItem("spotifake_custom_playlists", JSON.stringify(customPlaylists));
                pendingDeletePlaylistId = null;
            }
            deleteConfirmModal.style.display = "none";
            renderLibrary();
        });
    }

    if (delCancelBtn && deleteConfirmModal) {
        delCancelBtn.addEventListener("click", () => {
            pendingDeletePlaylistId = null;
            deleteConfirmModal.style.display = "none";
        });
    }

    /* ==========================================================
       Edit Playlist Profile Modal (Picture & Text)
       ========================================================== */
    const editPlaylistModal = $("#editPlaylistModal");
    const editPlName = $("#editPlName");
    const editPlDesc = $("#editPlDesc");
    const editPlImg = $("#editPlImg");
    const editPlSaveBtn = $("#editPlSaveBtn");
    const editPlCancelBtn = $("#editPlCancelBtn");

    function openEditPlaylistModal(playlistId) {
        const pl = customPlaylists.find(p => p.id === playlistId);
        if (!pl || !editPlaylistModal) return;
        editingPlaylistId = playlistId;
        if (editPlName) editPlName.value = pl.title || "";
        if (editPlDesc) editPlDesc.value = pl.desc || "";
        if (editPlImg) editPlImg.value = "";
        editPlaylistModal.style.display = "flex";
    }

    if (editPlCancelBtn && editPlaylistModal) {
        editPlCancelBtn.addEventListener("click", () => {
            editingPlaylistId = null;
            editPlaylistModal.style.display = "none";
        });
    }

    if (editPlSaveBtn && editPlaylistModal) {
        editPlSaveBtn.addEventListener("click", () => {
            if (!editingPlaylistId) return;
            const pl = customPlaylists.find(p => p.id === editingPlaylistId);
            if (!pl) return;

            const newTitle = editPlName ? editPlName.value.trim() : "";
            const newDesc = editPlDesc ? editPlDesc.value.trim() : "";
            const imgFile = editPlImg && editPlImg.files && editPlImg.files[0] ? editPlImg.files[0] : null;

            if (newTitle) pl.title = newTitle;
            pl.desc = newDesc;

            function finishSave() {
                localStorage.setItem("spotifake_custom_playlists", JSON.stringify(customPlaylists));
                editPlaylistModal.style.display = "none";
                editingPlaylistId = null;
                renderLibrary();
            }

            if (imgFile) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    pl.cover = ev.target.result;
                    finishSave();
                };
                reader.readAsDataURL(imgFile);
            } else {
                finishSave();
            }
        });
    }

    /* ==========================================================
       Add / Manage Songs in Playlist Modal
       ========================================================== */
    const addSongsModal = $("#addSongsModal");
    const addSongsList = $("#addSongsList");
    const addSongsPlTitle = $("#addSongsPlTitle");
    const addSongsCloseBtn = $("#addSongsCloseBtn");

    function openAddSongsModal(playlistId) {
        const pl = customPlaylists.find(p => p.id === playlistId);
        if (!pl || !addSongsModal) return;
        managingPlaylistId = playlistId;
        if (addSongsPlTitle) addSongsPlTitle.textContent = pl.title;
        if (!pl.songs) pl.songs = [];

        renderAddSongsList(pl);
        addSongsModal.style.display = "flex";
    }

    function renderAddSongsList(pl) {
        if (!addSongsList) return;
        addSongsList.replaceChildren();

        songs.forEach(song => {
            const isAdded = pl.songs && pl.songs.includes(song.id);
            const row = document.createElement("div");
            row.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#181824;border-radius:8px;gap:10px;";

            row.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;overflow:hidden;">
                    <img src="${song.cover}" alt="${song.title}" style="width:38px;height:38px;border-radius:6px;object-fit:cover;flex-shrink:0;">
                    <div style="overflow:hidden;">
                        <p style="font-size:13px;font-weight:700;color:#fff;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${song.title}</p>
                        <p style="font-size:11px;color:#aaa;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${song.artist}</p>
                    </div>
                </div>
                <button type="button" class="toggle-song-btn" style="border:none;padding:5px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;flex-shrink:0;background:${isAdded ? '#FF007F' : '#FFEA00'};color:${isAdded ? '#fff' : '#09090E'};">
                    ${isAdded ? '✓ Added' : '+ Add'}
                </button>
            `;

            const btn = row.querySelector(".toggle-song-btn");
            btn.addEventListener("click", () => {
                if (!pl.songs) pl.songs = [];
                if (pl.songs.includes(song.id)) {
                    pl.songs = pl.songs.filter(id => id !== song.id);
                    btn.textContent = "+ Add";
                    btn.style.background = "#FFEA00";
                    btn.style.color = "#09090E";
                } else {
                    pl.songs.push(song.id);
                    btn.textContent = "✓ Added";
                    btn.style.background = "#FF007F";
                    btn.style.color = "#fff";
                }
                localStorage.setItem("spotifake_custom_playlists", JSON.stringify(customPlaylists));
            });

            addSongsList.appendChild(row);
        });
    }

    if (addSongsCloseBtn && addSongsModal) {
        addSongsCloseBtn.addEventListener("click", () => {
            managingPlaylistId = null;
            addSongsModal.style.display = "none";
            renderLibrary();
        });
    }

    /* Profile Taskbar & Spotify-Style Account/Profile View */
    const DEFAULT_USER_AVATAR_LIB = "../photos/spotifyICON/lydbayot.jpg";
    const DEFAULT_USER_PROFILE_LIB = {
        name: "JSON.TTUM",
        avatar: DEFAULT_USER_AVATAR_LIB,
        banner: null,
        gender: "Male",
        age: "20",
        description: "Cyber VIP Listener • R&B & Neo-Soul Enthusiast",
        bio: "Music hits harder in Deep Cyber Black & Neon Yellow. Late-night TrapSoul, Synth Funk, and 2000s R&B collector."
    };
    let userProfileLib = Object.assign(
        {},
        DEFAULT_USER_PROFILE_LIB,
        JSON.parse(localStorage.getItem("spotifake_user_profile") || "{}")
    );

    function syncUserHeaderLib() {
        const displayName = (userProfileLib.name && userProfileLib.name.trim()) || "JSON.TTUM";
        const rawAvatar = userProfileLib.avatar || DEFAULT_USER_AVATAR_LIB;
        const avatarSrc = window.SpotifakePaths ? window.SpotifakePaths.asset(rawAvatar) : rawAvatar;
        if (basePlaylists[0]) basePlaylists[0].creator = displayName;
        $$(".profile-name, .taskbar-name").forEach(el => { el.textContent = displayName; });
        $$(".profile-avatar, .taskbar-avatar, .sp-mob-avatar-btn img").forEach(img => {
            img.src = avatarSrc;
            img.alt = `${displayName} Avatar`;
        });
    }
    syncUserHeaderLib();

    function bindSafeBackdropCloseLib(backdropEl, onClose) {
        if (!backdropEl) return;
        let pointerStartedOnBackdrop = false;
        backdropEl.addEventListener("pointerdown", (e) => {
            pointerStartedOnBackdrop = (e.target === backdropEl);
        });
        backdropEl.addEventListener("click", (e) => {
            if (pointerStartedOnBackdrop && e.target === backdropEl) {
                onClose();
            }
            pointerStartedOnBackdrop = false;
        });
    }

    function openLibFinalProfileCardModal() {
        let existing = document.getElementById("spFinalProfileCardBackdrop");
        if (existing) existing.remove();

        userProfileLib = Object.assign(
            {},
            DEFAULT_USER_PROFILE_LIB,
            JSON.parse(localStorage.getItem("spotifake_user_profile") || "{}")
        );

        const rawAvatar = userProfileLib.avatar || DEFAULT_USER_AVATAR_LIB;
        const avatarSrc = window.SpotifakePaths ? window.SpotifakePaths.asset(rawAvatar) : rawAvatar;
        const bannerSrc = userProfileLib.banner || null;
        const totalPlaylists = 1 + customPlaylists.length;
        const favCount = JSON.parse(localStorage.getItem("spotifake_favorites") || "[]").length;
        const playsCount = JSON.parse(localStorage.getItem("spotifake_recents") || "[]").length;

        const backdrop = document.createElement("div");
        backdrop.id = "spFinalProfileCardBackdrop";
        backdrop.className = "sp-final-profile-backdrop";
        backdrop.innerHTML = `
            <div class="sp-final-profile-card" role="dialog" aria-modal="true" aria-label="User Profile Card">
                <div class="sp-final-card-banner" style="${bannerSrc ? `background-image:url('${bannerSrc}');` : ""}">
                    <div class="sp-final-banner-actions">
                        <button type="button" class="sp-final-close-btn" id="spFinalCloseBtn" aria-label="Close Profile Card">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <div class="sp-final-card-identity">
                    <div class="sp-final-avatar-wrap" style="cursor:default;">
                        <img src="${avatarSrc}" alt="${userProfileLib.name}">
                    </div>
                </div>

                <div class="sp-final-card-body">
                    <div class="sp-final-name-row">
                        <h2 class="sp-final-name">${userProfileLib.name || "JSON.TTUM"}</h2>
                        <span class="sp-final-vip-badge"><i class="fa-solid fa-bolt"></i> Cyber VIP</span>
                    </div>
                    <p class="sp-final-description">${userProfileLib.description || DEFAULT_USER_PROFILE_LIB.description}</p>

                    <div class="sp-final-meta-badges">
                        <div class="sp-final-meta-pill">
                            <i class="fa-solid fa-venus-mars"></i>
                            <div>
                                <span class="meta-label">Gender</span>
                                <span class="meta-val">${userProfileLib.gender || "Not specified"}</span>
                            </div>
                        </div>
                        <div class="sp-final-meta-pill">
                            <i class="fa-solid fa-cake-candles"></i>
                            <div>
                                <span class="meta-label">Age</span>
                                <span class="meta-val">${userProfileLib.age ? `${userProfileLib.age} yrs old` : "Not specified"}</span>
                            </div>
                        </div>
                    </div>

                    <div class="sp-final-bio-box">
                        <div class="sp-final-bio-label"><i class="fa-solid fa-address-card"></i> Bio & About Me</div>
                        <p class="sp-final-bio-text">${userProfileLib.bio || DEFAULT_USER_PROFILE_LIB.bio}</p>
                    </div>

                    <div class="sp-final-stats-row">
                        <div class="sp-final-stat-item">
                            <strong>${favCount}</strong>
                            <span>Liked Songs</span>
                        </div>
                        <div class="sp-final-stat-item">
                            <strong>${totalPlaylists}</strong>
                            <span>Playlists</span>
                        </div>
                        <div class="sp-final-stat-item">
                            <strong>${playsCount}</strong>
                            <span>Recent Plays</span>
                        </div>
                    </div>

                    <div class="favorite-genres" style="margin-top:4px;">
                        <h5 style="margin:0 0 8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#9e9eae;">Top Genres</h5>
                        <div class="genre-tags">
                            <span class="gtag">Contemporary R&B</span>
                            <span class="gtag">TrapSoul</span>
                            <span class="gtag">Synth Funk</span>
                            <span class="gtag">Classic 2000s R&B</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        backdrop.querySelector("#spFinalCloseBtn")?.addEventListener("click", () => backdrop.remove());
        bindSafeBackdropCloseLib(backdrop, () => backdrop.remove());
        document.body.appendChild(backdrop);
    }

    function openLibEditProfileModal() {
        let backdrop = document.getElementById("spProfileDetailsBackdrop");
        if (backdrop) backdrop.remove();

        const rawAvatar = userProfileLib.avatar || DEFAULT_USER_AVATAR_LIB;
        let pendingAvatar = window.SpotifakePaths ? window.SpotifakePaths.asset(rawAvatar) : rawAvatar;
        let pendingBanner = userProfileLib.banner;

        backdrop = document.createElement("div");
        backdrop.id = "spProfileDetailsBackdrop";
        backdrop.className = "sp-profile-details-backdrop open";
        backdrop.innerHTML = `
            <div class="sp-profile-details-modal" role="dialog" aria-modal="true" style="max-width:560px;">
                <div class="sp-profile-details-header">
                    <h2>Profile details</h2>
                    <button type="button" class="sp-profile-details-close" id="spLibProfileCloseBtn"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="sp-profile-details-body" style="align-items:flex-start;">
                    <div class="sp-profile-details-avatar-picker" id="spLibAvatarPicker">
                        <img src="${pendingAvatar || DEFAULT_USER_AVATAR_LIB}" alt="Profile Photo" id="spLibAvatarPreview">
                        <div class="picker-overlay"><i class="fa-solid fa-pen"></i><span>Choose photo</span></div>
                        <input type="file" id="spLibAvatarFileInput" accept="image/*" style="display:none;">
                    </div>
                    <div class="sp-profile-details-fields">
                        <input type="text" class="sp-profile-details-input" id="spLibProfileNameInput" value="${userProfileLib.name || "JSON.TTUM"}" placeholder="Display name" maxlength="40">
                        <div class="sp-final-form-row-2">
                            <select class="sp-profile-details-input" id="spLibProfileGenderInput" style="padding:10px 12px;">
                                ${["Male", "Female", "Non-Binary", "Prefer not to say"].map(g =>
            `<option value="${g}" ${userProfileLib.gender === g ? "selected" : ""}>${g}</option>`
        ).join("")}
                            </select>
                            <input type="number" class="sp-profile-details-input" id="spLibProfileAgeInput" value="${userProfileLib.age || "20"}" min="1" max="120" placeholder="Age" style="padding:10px 12px;">
                        </div>
                        <input type="text" class="sp-profile-details-input" id="spLibProfileDescInput" value="${userProfileLib.description || DEFAULT_USER_PROFILE_LIB.description}" placeholder="Description / Tagline" maxlength="90" style="padding:10px 12px;">
                        <textarea class="sp-profile-details-input" id="spLibProfileBioInput" placeholder="Bio / About you..." maxlength="280" rows="3" style="resize:vertical;padding:10px 12px;">${userProfileLib.bio || DEFAULT_USER_PROFILE_LIB.bio}</textarea>
                        <div class="sp-profile-banner-picker-box" id="spLibBannerPicker" style="${pendingBanner ? `background-image:url('${pendingBanner}');` : ""}">
                            <span><i class="fa-solid fa-image"></i> ${pendingBanner ? "Change Banner Image" : "Add Profile Banner"}</span>
                            <input type="file" id="spLibBannerFileInput" accept="image/*" style="display:none;">
                        </div>
                    </div>
                </div>
                <div class="sp-profile-details-actions">
                    <button type="button" class="sp-profile-details-save-btn" id="spLibProfileSaveBtn">Save</button>
                </div>
                <p class="sp-profile-details-disclaimer">
                    By proceeding, you agree to give Spotifake access to the image you choose to upload. Please make sure you have the right to upload the image.
                </p>
            </div>
        `;
        document.body.appendChild(backdrop);

        const avatarPicker = backdrop.querySelector("#spLibAvatarPicker");
        const avatarInput = backdrop.querySelector("#spLibAvatarFileInput");
        const avatarPreview = backdrop.querySelector("#spLibAvatarPreview");
        const bannerPicker = backdrop.querySelector("#spLibBannerPicker");
        const bannerInput = backdrop.querySelector("#spLibBannerFileInput");
        const nameInput = backdrop.querySelector("#spLibProfileNameInput");
        const genderInput = backdrop.querySelector("#spLibProfileGenderInput");
        const ageInput = backdrop.querySelector("#spLibProfileAgeInput");
        const descInput = backdrop.querySelector("#spLibProfileDescInput");
        const bioInput = backdrop.querySelector("#spLibProfileBioInput");

        avatarPicker?.addEventListener("click", (e) => { if (e.target !== avatarInput) avatarInput.click(); });
        avatarInput?.addEventListener("change", () => {
            const f = avatarInput.files && avatarInput.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = (ev) => { pendingAvatar = ev.target.result; if (avatarPreview) avatarPreview.src = pendingAvatar; };
            r.readAsDataURL(f);
        });

        bannerPicker?.addEventListener("click", (e) => { if (e.target !== bannerInput) bannerInput.click(); });
        bannerInput?.addEventListener("change", () => {
            const f = bannerInput.files && bannerInput.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = (ev) => {
                pendingBanner = ev.target.result;
                bannerPicker.style.backgroundImage = `url('${pendingBanner}')`;
                const s = bannerPicker.querySelector("span");
                if (s) s.innerHTML = `<i class="fa-solid fa-image"></i> Change Banner Image`;
            };
            r.readAsDataURL(f);
        });

        backdrop.querySelector("#spLibProfileCloseBtn")?.addEventListener("click", () => backdrop.remove());
        bindSafeBackdropCloseLib(backdrop, () => backdrop.remove());
        backdrop.querySelector("#spLibProfileSaveBtn")?.addEventListener("click", () => {
            userProfileLib.name = (nameInput?.value || "").trim() || "JSON.TTUM";
            userProfileLib.gender = genderInput?.value || "Not specified";
            userProfileLib.age = (ageInput?.value || "").trim() || "20";
            userProfileLib.description = (descInput?.value || "").trim() || DEFAULT_USER_PROFILE_LIB.description;
            userProfileLib.bio = (bioInput?.value || "").trim() || DEFAULT_USER_PROFILE_LIB.bio;
            userProfileLib.avatar = pendingAvatar || DEFAULT_USER_AVATAR_LIB;
            userProfileLib.banner = pendingBanner || null;
            try {
                localStorage.setItem("spotifake_user_profile", JSON.stringify(userProfileLib));
            } catch (err) {
                try {
                    localStorage.setItem("spotifake_user_profile", JSON.stringify({ ...userProfileLib, banner: null }));
                } catch (err2) {
                    try {
                        localStorage.setItem("spotifake_user_profile", JSON.stringify({ ...userProfileLib, banner: null, avatar: DEFAULT_USER_AVATAR_LIB }));
                    } catch (ignored) { }
                }
            }
            syncUserHeaderLib();
            if (typeof renderLibrary === "function") renderLibrary();
            backdrop.remove();
            openLibUserProfileView();
        });
    }

    function openLibUserProfileView() {
        if (!libEntityView) return;
        showLibEntitySection();

        const publicPlaylistCount = 1 + customPlaylists.length;
        const followingCount = followedArtistsLib.size > 0 ? followedArtistsLib.size : 9;
        const topArtists = baseArtists.slice(0, 5);

        libEntityView.innerHTML = `
            <div class="sp-back-bar">
                <button type="button" class="sp-back-btn" id="libUserBackBtn">
                    <i class="fa-solid fa-arrow-left"></i> Back to Library
                </button>
            </div>
            <section class="sp-user-profile-hero${userProfileLib.banner ? " has-custom-banner" : ""}" style="${userProfileLib.banner ? `background-image:url('${userProfileLib.banner}');` : ""}">
                <button type="button" class="sp-user-banner-edit-pill" id="libUserEditBannerBtn">
                    <i class="fa-solid fa-camera"></i> ${userProfileLib.banner ? "Edit banner" : "Add banner"}
                </button>
                <div class="sp-user-avatar-wrap" id="libUserAvatarWrap" title="Click to edit profile photo">
                    <img src="${window.SpotifakePaths ? window.SpotifakePaths.asset(userProfileLib.avatar || DEFAULT_USER_AVATAR_LIB) : (userProfileLib.avatar || DEFAULT_USER_AVATAR_LIB)}" alt="${userProfileLib.name}">
                    <div class="sp-user-avatar-overlay">
                        <i class="fa-solid fa-pen"></i>
                        <span>Choose photo</span>
                    </div>
                </div>
                <div class="sp-user-hero-text">
                    <span class="sp-user-hero-label">Profile</span>
                    <h1 class="sp-user-hero-name" id="libUserHeroName">${userProfileLib.name || "JSON.TTUM"}</h1>
                    <div class="sp-user-hero-stats">
                        ${publicPlaylistCount} Public Playlist${publicPlaylistCount !== 1 ? "s" : ""} • <strong>${followingCount} Following</strong>
                    </div>
                </div>
            </section>
            <div class="sp-user-dots-bar" id="libUserDotsBar">
                <button type="button" class="sp-user-dots-btn" id="libUserDotsBtn" title="More options">
                    <i class="fa-solid fa-ellipsis"></i>
                </button>
                <div class="sp-user-dots-menu" id="libUserDotsMenu">
                    <button type="button" class="sp-user-dots-item" id="libDotsEditBtn">
                        <i class="fa-solid fa-pen"></i><span>Edit profile</span>
                    </button>
                    <button type="button" class="sp-user-dots-item" id="libDotsShareBtn">
                        <i class="fa-solid fa-arrow-up-from-bracket"></i><span>Share profile</span>
                    </button>
                </div>
            </div>
            <div class="sp-user-top-header">
                <div>
                    <h2>Top artists this month</h2>
                    <p>Only visible to you</p>
                </div>
            </div>
            <div class="sp-user-top-artists-grid" id="libUserTopArtistsGrid"></div>
        `;

        libEntityView.querySelector("#libUserBackBtn")?.addEventListener("click", showLibGridView);
        libEntityView.querySelector("#libUserAvatarWrap")?.addEventListener("click", openLibEditProfileModal);
        libEntityView.querySelector("#libUserHeroName")?.addEventListener("click", openLibEditProfileModal);
        libEntityView.querySelector("#libUserEditBannerBtn")?.addEventListener("click", openLibEditProfileModal);

        const dotsBtn = libEntityView.querySelector("#libUserDotsBtn");
        const dotsMenu = libEntityView.querySelector("#libUserDotsMenu");
        dotsBtn?.addEventListener("click", (e) => {
            e.stopPropagation();
            dotsMenu?.classList.toggle("open");
        });
        libEntityView.querySelector("#libDotsEditBtn")?.addEventListener("click", (e) => {
            e.stopPropagation();
            dotsMenu?.classList.remove("open");
            openLibEditProfileModal();
        });
        libEntityView.querySelector("#libDotsShareBtn")?.addEventListener("click", (e) => {
            e.stopPropagation();
            dotsMenu?.classList.remove("open");
            const shareText = `👤 Spotifake Profile: ${userProfileLib.name || "JSON.TTUM"}\n🎵 ${publicPlaylistCount} Public Playlists • ${followingCount} Following`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareText).catch(() => { });
            }
            alert(`Copied ${userProfileLib.name}'s profile link & info to clipboard!\n\n${shareText}`);
        });

        const grid = libEntityView.querySelector("#libUserTopArtistsGrid");
        topArtists.forEach(art => {
            const card = document.createElement("article");
            card.className = "sp-user-artist-circle-card";
            card.innerHTML = `<img src="${art.cover}" alt="${art.title}"><h4>${art.title}</h4><span>Artist</span>`;
            card.addEventListener("click", () => openLibArtistView(art.title));
            grid?.appendChild(card);
        });
    }

    if (profileBtn && profileTaskbar) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            profileTaskbar.classList.toggle("open");
        });
        document.addEventListener("click", () => profileTaskbar.classList.remove("open"));
    }

    $("#taskAccount")?.addEventListener("click", () => {
        profileTaskbar?.classList.remove("open");
        openLibUserProfileView();
    });

    $("#taskProfile")?.addEventListener("click", () => {
        profileTaskbar?.classList.remove("open");
        openLibFinalProfileCardModal(false);
    });

    $("#taskLogout")?.addEventListener("click", () => {
        sessionStorage.removeItem("spotifake-user");
        window.location.href = "../LoginMAIN.html";
    });
    $("#taskSettings")?.addEventListener("click", () => $("#modalSettings")?.removeAttribute("hidden"));

    /* Theme Engine & Custom Cursor in Library */
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

    const hideMobileHeroToggle = $("#settingHideMobileHeroToggle");
    function applyHideMobileHeroLib(hideOnPhone) {
        localStorage.setItem("spotifake_hide_mobile_hero", hideOnPhone ? "1" : "0");
    }
    if (hideMobileHeroToggle) {
        hideMobileHeroToggle.checked = localStorage.getItem("spotifake_hide_mobile_hero") === "1";
        hideMobileHeroToggle.addEventListener("change", () => applyHideMobileHeroLib(hideMobileHeroToggle.checked));
    }

    const crossfadeSelectLib = $("#settingCrossfade");
    function applyCrossfadeSettingLib(seconds) {
        const parsed = Math.max(0, Number(seconds) || 0);
        crossfadeSeconds = parsed;
        localStorage.setItem("spotifake_crossfade", String(parsed));
        if (crossfadeSelectLib) crossfadeSelectLib.value = String(parsed);
        if (parsed === 0) stopActiveCrossfadeLib(true);
    }
    applyCrossfadeSettingLib(crossfadeSeconds);
    if (crossfadeSelectLib) {
        crossfadeSelectLib.addEventListener("change", () => applyCrossfadeSettingLib(crossfadeSelectLib.value));
    }

    // Custom Cursor follower
    if (cursorDot && cursorRing) {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
        const updateCursorPosLib = (e) => {
            mx = e.clientX; my = e.clientY;
            cursorDot.style.left = `${mx}px`; cursorDot.style.top = `${my}px`;
        };
        window.addEventListener("pointermove", updateCursorPosLib);
        window.addEventListener("mousemove", updateCursorPosLib);
        function animCursor() {
            rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
            cursorRing.style.left = `${rx}px`; cursorRing.style.top = `${ry}px`;
            requestAnimationFrame(animCursor);
        }
        animCursor();
    }

    // Initialize Library & Audio
    renderLibrary();
    if (window.SpotifakePlayback) {
        window.SpotifakePlayback.restore({
            list: songs,
            getAudio: () => audio,
            loadAt: loadTrack,
            onResume: (wasPlaying) => {
                if (wasPlaying) return audio.play().then(updatePlayButton);
                updatePlayButton();
            }
        });
    } else {
        loadTrack(0, false);
    }
});
