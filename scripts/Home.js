/**
 * Spotifake | Interactive Engine
 * BSIT / IT Extension Project
 * Deep Cyber Black & Neon Yellow / Hot Magenta Theme
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

    // Player Bar Info Elements
    const currentImage = $("#currentSongImage");
    const currentTitle = $("#currentSongTitle");
    const currentArtist = $("#currentSongArtist");
    const playerFavBtn = $("#playerFavBtn");
    const musicVisualizer = $("#musicVisualizer");

    // Search and Grid Elements
    const searchInput = $("#searchInput");
    const searchForm = $("#searchForm");
    const clearSearch = $("#clearSearch");
    const searchStatus = $("#searchStatus");
    const cards = $$(".music-card");
    const resultCounter = $("#resultCounter");
    const filterPills = $$(".filter-pill");

    // Sidebar & 3-Column Elements
    const sidebarSongList = $("#sidebarSongList");
    const artistDetailPanel = $("#artistDetailPanel");
    const closeArtistPanel = $("#closeArtistPanel");
    const artistCoverImg = $("#artistCoverImg");
    const artistBadgeTag = $("#artistBadgeTag");
    const artistTrackTitle = $("#artistTrackTitle");
    const artistNameHeading = $("#artistNameHeading");
    const artistBioText = $("#artistBioText");
    const artistSongStoryText = $("#artistSongStoryText");
    const artistNotableList = $("#artistNotableList");
    const artistPlayNowBtn = $("#artistPlayNowBtn");
    const artistDedicatedPageLink = $("#artistDedicatedPageLink");

    // Profile Task Bar & Modals
    const profileBtn = $("#profileBtn");
    const profileTaskbar = $("#profileTaskbar");
    const recentsCount = $("#recentsCount");
    const statFavoritesCount = $("#statFavoritesCount");
    const statPlaysCount = $("#statPlaysCount");

    // Hero & Featured Spotlight Deck Elements
    const heroGreeting = $("#heroGreeting");
    const greetingIcon = $("#greetingIcon");
    const spotlightDeckWrap = $("#spotlightDeckWrap");

    // Custom Cursor
    const cursorDot = $("#cursorDot");
    const cursorRing = $("#cursorRing");

    // Inject Add-to-Playlist button styles
    const atpStyle = document.createElement("style");
    atpStyle.textContent = `
.card-add-to-playlist-btn {
    background: transparent;
    border: 1.5px solid var(--neon-yellow, #FFEA00);
    color: var(--neon-yellow, #FFEA00);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: all 0.2s;
    margin-right: 6px;
}
.card-add-to-playlist-btn:hover {
    background: var(--neon-yellow, #FFEA00);
    color: #09090E;
    transform: scale(1.15);
}
`;
    document.head.appendChild(atpStyle);

    /* ==========================================================
       1. Master Songs & Metadata Database
       ========================================================== */
    const songs = [
        {
            id: 1,
            title: "It Depends",
            artist: "Chris Brown ft. Bryson Tiller",
            src: "../SONGS/Chris Brown - It Depends (Audio) ft. Bryson Tiller.mp3",
            cover: "../photos/ItDepends.jpg",
            description: "A smooth collaboration with a modern R&B sound.",
            pageUrl: "../song_pages/song1_it_depends/it_depends.html",
            genre: "Contemporary R&B • 2024"
        },
        {
            id: 2,
            title: "With You",
            artist: "Chris Brown",
            src: "../SONGS/Chris Brown - With You (Official HD Video).mp3",
            cover: "../photos/WithYou.jpg",
            description: "A melodic R&B song about devotion and connection.",
            pageUrl: "../song_pages/song2_with_you/with_you.html",
            genre: "Pop / R&B Classic • 2007"
        },
        {
            id: 3,
            title: "Shoulda Never",
            artist: "Kehlani ft. Usher",
            src: "../SONGS/Kehlani - Shoulda Never (feat. Usher) [Official Audio].mp3",
            cover: "../photos/ShouldaNever.jpg",
            description: "An emotional, soulful collaboration.",
            pageUrl: "../song_pages/song3_shoulda_never/shoulda_never.html",
            genre: "Neo-Soul / R&B • 2024"
        },
        {
            id: 4,
            title: "Because of You",
            artist: "Ne-Yo",
            src: "../SONGS/Ne-Yo - Because Of You (Official Music Video).mp3",
            cover: "../photos/BecauseofYou.jpg",
            description: "An upbeat R&B track with an iconic groove.",
            pageUrl: "../song_pages/song4_because_of_you/because_of_you.html",
            genre: "Dance-Pop / R&B • 2007"
        },
        {
            id: 5,
            title: "Miss Independent",
            artist: "Ne-Yo",
            src: "../SONGS/Ne-Yo - Miss Independent.mp3",
            cover: "../photos/MissIndependent.jpg",
            description: "An anthem celebrating strong, independent women.",
            pageUrl: "../song_pages/song5_miss_independent/miss_independent.html",
            genre: "R&B / Soul • 2008"
        },
        {
            id: 6,
            title: "Sexy Love",
            artist: "Ne-Yo",
            src: "../SONGS/Ne-Yo - Sexy Love [Official Video].mp3",
            cover: "../photos/SexyLove.jpg",
            description: "A smooth, acoustic-laden R&B favorite.",
            pageUrl: "../song_pages/song6_sexy_love/sexy_love.html",
            genre: "Romantic R&B • 2006"
        },
        {
            id: 7,
            title: "So Sick",
            artist: "Ne-Yo",
            src: "../SONGS/Ne-Yo - So Sick (Official Music Video).mp3",
            cover: "../photos/SoSick.jpg",
            description: "A timeless heartbreak ballad known worldwide.",
            pageUrl: "../song_pages/song7_so_sick/so_sick.html",
            genre: "Acoustic R&B Ballad • 2006"
        },
        {
            id: 8,
            title: "Love Me Not",
            artist: "Ravyn Lenae",
            src: "../SONGS/Ravyn Lenae - Love Me Not (Official Music Video).mp3",
            cover: "../photos/LoveMeNot.jpg",
            description: "An atmospheric track with ethereal harmonies.",
            pageUrl: "../song_pages/song8_love_me_not/love_me_not.html",
            genre: "Alternative R&B / Indie • 2024"
        },
        {
            id: 9,
            title: "Timeless",
            artist: "The Weeknd ft. Playboi Carti",
            src: "../SONGS/The Weeknd - Timeless with Playboi Carti (Official Music Video).mp3",
            cover: "../photos/Timeless.jpg",
            description: "A genre-bending collaboration with dark synth energy.",
            pageUrl: "../song_pages/song9_timeless/timeless.html",
            genre: "Synthwave / Trap R&B • 2024"
        },
        {
            id: 10,
            title: "MILLION DOLLAR BABY",
            artist: "Tommy Richman",
            src: "../SONGS/Tommy Richman - MILLION DOLLAR BABY (Official Music Video).mp3",
            cover: "../photos/MillionDollarBaby.jpg",
            description: "A high-octane track with an infectious 80s funk groove.",
            pageUrl: "../song_pages/song10_million_dollar_baby/million_dollar_baby.html",
            genre: "Funk / Neo-Soul / Rap • 2024"
        }
    ];

    /* ==========================================================
        2. Rich Artist & Song Backstory Database (for 3rd Column)
       ========================================================== */
    const ARTIST_DETAILS = {
        1: {
            artistBio: "Chris Brown is a multi-platinum Grammy-winning R&B superstar known for explosive stage performances and vocal dexterity. Bryson Tiller is an acclaimed singer-songwriter who pioneered the modern 'TrapSoul' sound.",
            songStory: "'It Depends' brings together Brown and Tiller in a nocturnal, moody atmosphere, dissecting complicated late-night relationships with infectious vocal harmonies.",
            notableSongs: ["Under the Influence", "Loyal", "No Guidance", "Exchange", "Don't"],
            genre: "Contemporary R&B / TrapSoul"
        },
        2: {
            artistBio: "Chris Brown broke into international superstardom at age 16 with a clean, passionate tenor voice. Over two decades, he has produced dozens of Billboard chart-topping hits.",
            songStory: "Written by Johntá Austin and produced by Stargate, 'With You' features an iconic acoustic guitar riff and became one of the biggest romantic anthems of the 2000s.",
            notableSongs: ["With You", "Forever", "Yo (Excuse Me Miss)", "Kiss Kiss", "Deuces"],
            genre: "Pop / R&B Classic"
        },
        3: {
            artistBio: "Kehlani is an acclaimed Oakland-born singer renowned for vulnerable lyricism and raw vocal presence. Usher is a legendary 8-time Grammy-winning icon regarded as the King of Modern R&B.",
            songStory: "'Shoulda Never' is a centerpiece on Kehlani's 2024 album 'Crash', capturing the irresistible tension of returning to an ex despite knowing better.",
            notableSongs: ["Gangsta", "Nights Like This", "Toxic", "Yeah! (Usher)", "Burn (Usher)", "Confessions (Usher)"],
            genre: "Neo-Soul / Collaborative R&B"
        },
        4: {
            artistBio: "Ne-Yo (Shaffer Chimere Smith) is a 3-time Grammy winner celebrated as one of the most prolific singers and songwriters in pop/R&B history, having penned historic tracks for Rihanna and Beyoncé.",
            songStory: "Released in 2007 as the title track of his second album, 'Because of You' fuses upbeat Michael Jackson-inspired disco-funk rhythms with smooth contemporary vocals.",
            notableSongs: ["Because Of You", "Closer", "Mad", "Let Me Love You (Writer)", "Irreplaceable (Writer)"],
            genre: "Dance-Pop / R&B"
        },
        5: {
            artistBio: "Ne-Yo's masterful songwriting earned him two Grammys in 2009 for 'Miss Independent' (Best R&B Song & Best Male R&B Vocal Performance).",
            songStory: "The song celebrates empowered, hardworking women who build their own success and demand respect, remaining an evergreen feminist pop/R&B anthem.",
            notableSongs: ["Miss Independent", "So Sick", "One in a Million", "She Knows", "Time of Our Lives"],
            genre: "R&B / Soul"
        },
        6: {
            artistBio: "Known for his gentleman persona and signature fedora, Ne-Yo's warm tone and melodic hooks shaped the sound of 2000s radio.",
            songStory: "Produced by Stargate, 'Sexy Love' uses crisp acoustic chords and heartfelt falsetto to express unconditional affection for a partner.",
            notableSongs: ["Sexy Love", "Stay", "When You're Mad", "Part of the List", "Go On Girl"],
            genre: "Romantic Acoustic R&B"
        },
        7: {
            artistBio: "The track that launched Ne-Yo into global stardom, topping the US Billboard Hot 100 and charts worldwide in 2006.",
            songStory: "Written from personal experience after a painful breakup, 'So Sick' expresses the frustration of hearing sorrowful love songs everywhere you turn.",
            notableSongs: ["So Sick", "Because Of You", "Miss Independent", "Sexy Love", "Mad"],
            genre: "Acoustic R&B Ballad"
        },
        8: {
            artistBio: "Ravyn Lenae is a Chicago-born singer-songwriter praised by critics for her luminous four-octave soprano and experimental approach to classic soul music.",
            songStory: "'Love Me Not' is an intoxicating exploration of mixed signals and emotional push-and-pull, featured as a standout on her 2024 album 'Bird's Eye'.",
            notableSongs: ["Love Me Not", "Sticky", "Venom", "One Wish", "Skin Tight (ft. Steve Lacy)"],
            genre: "Alternative R&B / Indie Pop"
        },
        9: {
            artistBio: "The Weeknd (Abel Tesfaye) is the most streamed artist globally, famous for dark cinematic soundscapes. Playboi Carti is an avant-garde rap icon pioneering the Opium movement.",
            songStory: "Produced by Pharrell Williams and Mike Dean, 'Timeless' blends nostalgic 2000s Neptunes percussion with hypnotic trap synthesizers.",
            notableSongs: ["Blinding Lights", "Starboy", "The Hills", "Save Your Tears", "Magnolia (Carti)", "Fein (Carti)"],
            genre: "Synthwave / Dark Trap R&B"
        },
        10: {
            artistBio: "Tommy Richman is a Virginia-raised vocalist and producer who achieved independent viral breakthrough status in 2024 with his vintage falsetto and raw energy.",
            songStory: "'MILLION DOLLAR BABY' skyrocketed to #2 on the Billboard Hot 100, celebrated for its gritty live-recorded bassline and energetic 1980s funk groove.",
            notableSongs: ["MILLION DOLLAR BABY", "DEVIL IS A LIE", "WHITNEY", "THOUGHT YOU WERE THE ONE"],
            genre: "Funk / Neo-Soul / Viral Hip-Hop"
        }
    };

    /* ==========================================================
       3. Synchronized Spotify Lyrics Database
       ========================================================== */
    const SONG_LYRICS = window.SONG_LYRICS || (typeof window !== "undefined" && window.SONG_LYRICS) || {};

    /* ==========================================================
       4. State Variables
       ========================================================== */
    let currentIndex = 0;
    let isShuffle = localStorage.getItem("spotifake_shuffle") === "1";
    let repeatMode = localStorage.getItem("spotifake_repeat") || "off"; // off, all, one
    let masterVolume = Number(localStorage.getItem("spotifake_volume") ?? 0.75);
    if (!Number.isFinite(masterVolume) || masterVolume < 0 || masterVolume > 1) masterVolume = 0.75;
    let lastVolume = masterVolume > 0 ? masterVolume : 0.75;
    let isMasterMuted = localStorage.getItem("spotifake_muted") === "1";
    const savedCrossfadeSetting = localStorage.getItem("spotifake_crossfade");
    let crossfadeSeconds = savedCrossfadeSetting !== null ? Math.max(0, Number(savedCrossfadeSetting) || 0) : 4;
    let crossfadeRafId = null;
    let activeFadeState = null;
    let autoCrossfadeTriggered = false;
    let seekOnRelease = false;
    let recentlyPlayed = JSON.parse(localStorage.getItem("spotifake_recents") || "[]");
    let favorites = new Set(JSON.parse(localStorage.getItem("spotifake_favorites") || "[]"));

    deckA.volume = isMasterMuted ? 0 : masterVolume;
    deckA.muted = isMasterMuted;
    deckB.volume = 0;
    deckB.muted = isMasterMuted;

    function setShuffleModeState(enabled, silent = false) {
        isShuffle = Boolean(enabled);
        localStorage.setItem("spotifake_shuffle", isShuffle ? "1" : "0");
        if (queueCtrl) {
            const cur = getCurrentSong();
            queueCtrl.syncShuffleState(cur && cur.id);
        }
        syncShuffleRepeatButtonsUI();
        renderNpvCreditsAndQueue(currentNpvSongId);
        if (!silent) {
            showToast(isShuffle ? "Shuffle on" : "Shuffle off");
        }
    }

    const queueCtrl = window.SpotifakeQueue
        ? window.SpotifakeQueue.createController({
            getSongs: () => songs,
            getCurrentIndex: () => currentIndex,
            loadIndex: (idx, autoplay, meta) => loadTrack(idx, autoplay, meta),
            getRepeatMode: () => repeatMode,
            isShuffleEnabled: () => isShuffle,
            setShuffleEnabled: (val, silent) => setShuffleModeState(val, silent),
            queueHost: artistDetailPanel,
            onQueueOpen: () => {
                if (isLyricsFullscreen) exitLyricsFullscreen();
                openArtistPanel();
            },
            onToast: (msg) => showToast(msg),
            onStateChange: () => {
                if (typeof renderNpvCreditsAndQueue === "function" && typeof currentNpvSongId !== "undefined") {
                    renderNpvCreditsAndQueue(currentNpvSongId);
                }
            }
        })
        : null;
    if (queueCtrl) queueCtrl.bindQueueButton($("#queueButton"));

    /* ==========================================================
       5. Helpers
       ========================================================== */
    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, "0")}`;
    }

    function getCurrentSong() {
        return songs[currentIndex] || songs[0];
    }

    /* ==========================================================
       6. Dynamic Greeting (Hero Welcome Banner)
       ========================================================== */
    function getSavedDisplayName() {
        try {
            const storedProfile = JSON.parse(localStorage.getItem("spotifake_user_profile") || "null");
            return (storedProfile && storedProfile.name && storedProfile.name.trim()) || "JSON.TTUM";
        } catch (e) {
            return "JSON.TTUM";
        }
    }

    function updateGreeting() {
        const hour = new Date().getHours();
        const displayUserName = getSavedDisplayName();
        let greetingText = `Good evening, ${displayUserName}`;
        let icon = "🌙";

        if (hour >= 5 && hour < 12) {
            greetingText = `Good morning, ${displayUserName}`;
            icon = "☀️";
        } else if (hour >= 12 && hour < 18) {
            greetingText = `Good afternoon, ${displayUserName}`;
            icon = "🌤️";
        }

        if (heroGreeting) heroGreeting.textContent = greetingText;
        if (greetingIcon) greetingIcon.textContent = icon;
    }

    /* ==========================================================
       7. Custom Cyber Cursor System
       ========================================================== */
    function initCustomCursor() {
        if (!cursorDot || !cursorRing) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        const updateCursorPos = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        };
        window.addEventListener("pointermove", updateCursorPos);
        window.addEventListener("mousemove", updateCursorPos);

        // Smooth follow animation
        function renderCursor() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(renderCursor);
        }
        renderCursor();

        // Hover effect over clickable items
        const hoverTargets = "button, a, input, .music-card, .sidebar-song-item, .filter-pill, .lyrics-line";
        document.addEventListener("mouseover", (e) => {
            if (e.target.closest(hoverTargets)) {
                document.body.classList.add("cursor-hover");
            }
        });

        document.addEventListener("mouseout", (e) => {
            if (e.target.closest(hoverTargets)) {
                document.body.classList.remove("cursor-hover");
            }
        });
    }

    /* ==========================================================
       8. Favorites System (Heart Buttons)
       ========================================================== */
    function toggleFavorite(songId, event) {
        if (event) event.stopPropagation();

        const id = Number(songId);
        if (favorites.has(id)) {
            favorites.delete(id);
        } else {
            favorites.add(id);
        }

        localStorage.setItem("spotifake_favorites", JSON.stringify([...favorites]));
        updateFavoritesUI();
    }

    function updateFavoritesUI() {
        // Update all card hearts
        cards.forEach((card) => {
            const id = Number(card.dataset.songId);
            const heartBtn = card.querySelector(".card-heart-btn");
            const heartIcon = heartBtn?.querySelector("i");
            const isFav = favorites.has(id);

            if (heartBtn) {
                heartBtn.classList.toggle("is-favorite", isFav);
                heartBtn.setAttribute("aria-pressed", String(isFav));
                heartBtn.title = isFav ? "Remove from Favorites" : "Add to Favorites";
            }

            if (heartIcon) {
                heartIcon.className = isFav ? "fa-solid fa-heart" : "fa-regular fa-heart";
            }
        });

        // Update player bar heart
        const currentSong = getCurrentSong();
        if (playerFavBtn && currentSong) {
            const isFav = favorites.has(currentSong.id);
            playerFavBtn.classList.toggle("is-favorite", isFav);
            const icon = playerFavBtn.querySelector("i");
            if (icon) {
                icon.className = isFav ? "fa-solid fa-heart" : "fa-regular fa-heart";
            }
        }

        // Update stat in profile modal
        if (statFavoritesCount) {
            statFavoritesCount.textContent = favorites.size;
        }

        // Update Now Playing sidebar (+) / Checkmark icon
        const npvAddLikedBtn = $("#npvAddLikedBtn");
        const npvAddLikedIcon = $("#npvAddLikedIcon");
        if (npvAddLikedBtn && npvAddLikedIcon) {
            const isFavNpv = favorites.has(currentNpvSongId || (currentSong && currentSong.id));
            npvAddLikedBtn.classList.toggle("is-saved", isFavNpv);
            npvAddLikedIcon.className = isFavNpv ? "fa-solid fa-circle-check" : "fa-solid fa-circle-plus";
        }

        syncCenterLyricsSaveButton();
    }

    /* ==========================================================
       9. Sidebar Songs List (Replaces Podcasts)
       ========================================================== */
    // Spotify Sidebar Library items matching authentic screenshot
    // Data structures for sidebar categories
    const SIDEBAR_DATA = {
        playlists: [
            { id: "liked", title: "Liked Songs", subtitle: `Playlist • ${getSavedDisplayName()}`, isLiked: true, pinned: true }
        ],
        albums: [
            {
                id: "alb-breezy",
                title: "Breezy",
                subtitle: "Album • Chris Brown",
                artistName: "Chris Brown",
                year: "2022",
                label: "Chris Brown Entertainment / RCA Records",
                cover: "../albumC/sbreezy.png",
                trackId: 1,
                songIds: [1, 2],
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
                id: "alb-exclusive",
                title: "Exclusive",
                subtitle: "Album • Chris Brown",
                artistName: "Chris Brown",
                year: "2007",
                label: "Jive Records",
                cover: "../albumC/exclusive.png",
                trackId: 2,
                songIds: [2, 1],
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
                id: "alb-crash",
                title: "CRASH",
                subtitle: "Album • Kehlani",
                artistName: "Kehlani",
                year: "2024",
                label: "Atlantic Recording Corporation",
                cover: "../photos/ShouldaNever.jpg",
                trackId: 3,
                songIds: [3],
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
                id: "alb-because",
                title: "Because of You",
                subtitle: "Album • Ne-Yo",
                artistName: "Ne-Yo",
                year: "2007",
                label: "Def Jam Recordings",
                cover: "../photos/BecauseofYou.jpg",
                trackId: 4,
                songIds: [4, 5, 6, 7],
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
                id: "alb-year",
                title: "Year of the Gentleman",
                subtitle: "Album • Ne-Yo",
                artistName: "Ne-Yo",
                year: "2008",
                label: "Def Jam Recordings",
                cover: "../albumC/Ne-yo.png",
                trackId: 5,
                songIds: [5, 4, 6, 7],
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
                id: "alb-words",
                title: "In My Own Words",
                subtitle: "Album • Ne-Yo",
                artistName: "Ne-Yo",
                year: "2006",
                label: "Def Jam Recordings",
                cover: "../photos/SexyLove.jpg",
                trackId: 6,
                songIds: [6, 7, 4, 5],
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
                id: "alb-bird",
                title: "Bird's Eye",
                subtitle: "Album • Ravyn Lenae",
                artistName: "Ravyn Lenae",
                year: "2024",
                label: "Atlantic Recording Corporation",
                cover: "../photos/LoveMeNot.jpg",
                trackId: 8,
                songIds: [8],
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
                id: "alb-hurry",
                title: "Hurry Up Tomorrow",
                subtitle: "Album • The Weeknd",
                artistName: "The Weeknd",
                year: "2024",
                label: "XO / Republic Records",
                cover: "../albumC/theweeknd.png",
                trackId: 9,
                songIds: [9],
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
                id: "alb-coyote",
                title: "COYOTE",
                subtitle: "Album • Tommy Richman",
                artistName: "Tommy Richman",
                year: "2024",
                label: "ISO Supremacy / PULSE Records",
                cover: "../albumC/MillionDollah.png",
                trackId: 10,
                songIds: [10],
                fullTracklist: [
                    { num: 1, title: "ELEPHANT IN THE ROOM", artists: ["Tommy Richman"], duration: "2:44", refIndex: 9 },
                    { num: 2, title: "WHITNEY", artists: ["Tommy Richman"], duration: "2:52", refIndex: 9 },
                    { num: 3, title: "MILLION DOLLAR BABY", artists: ["Tommy Richman"], duration: "2:35", songId: 10 },
                    { num: 4, title: "DEVIL IS A LIE", artists: ["Tommy Richman"], duration: "2:11", refIndex: 9 },
                    { num: 5, title: "THOUGHT YOU WERE THE ONE", artists: ["Tommy Richman"], duration: "3:01", refIndex: 9 },
                    { num: 6, title: "LETTERMAN", artists: ["Tommy Richman"], duration: "2:58", refIndex: 9 }
                ]
            }
        ],
        artists: [
            { id: "art-cb", title: "Chris Brown", subtitle: "Artist • 2 Songs in Collection", cover: "../PFPs/ChrisBrownz.jpg", trackId: 1, artistName: "Chris Brown" },
            { id: "art-bt", title: "Bryson Tiller", subtitle: "Artist • TrapSoul Pioneer", cover: "../PFPs/BrysonTiller.jpg", trackId: 1, artistName: "Bryson Tiller" },
            { id: "art-keh", title: "Kehlani", subtitle: "Artist • Contemporary Soul", cover: "../PFPs/Kehlani.jpg", trackId: 3, artistName: "Kehlani" },
            { id: "art-ush", title: "Usher", subtitle: "Artist • 8-Time Grammy Winner", cover: "../PFPs/Usher.jpg", trackId: 3, artistName: "Usher" },
            { id: "art-neyo", title: "Ne-Yo", subtitle: "Artist • 4 Songs in Collection", cover: "../PFPs/Ne-yo.jpg", trackId: 4, artistName: "Ne-Yo" },
            { id: "art-rl", title: "Ravyn Lenae", subtitle: "Artist • Alternative Neo-Soul", cover: "../PFPs/RavynLenae.jpg", trackId: 8, artistName: "Ravyn Lenae" },
            { id: "art-tw", title: "The Weeknd", subtitle: "Artist • #1 Global Streamed", cover: "../PFPs/TheWeeknd.jpg", trackId: 9, artistName: "The Weeknd" },
            { id: "art-pc", title: "Playboi Carti", subtitle: "Artist • Opium Pioneer", cover: "../PFPs/Playboi.jpg", trackId: 9, artistName: "Playboi Carti" },
            { id: "art-tr", title: "Tommy Richman", subtitle: "Artist • Billboard Viral Hit", cover: "../PFPs/TommyRichman.jpg", trackId: 10, artistName: "Tommy Richman" }
        ]
    };

    const TRACK_DURATIONS = {
        1: "3:48", 2: "4:12", 3: "3:19", 4: "4:26", 5: "3:52",
        6: "3:40", 7: "3:27", 8: "3:33", 9: "4:16", 10: "2:35"
    };

    /* Real artist profiles: profile pictures (PFPs/) + official external links */
    const ARTIST_PROFILES = {
        "Chris Brown": {
            pfp: "../PFPs/ChrisBrownz.jpg", genre: "Contemporary R&B / Pop", listeners: "54,820,410",
            bio: "Chris Brown is a multi-platinum, Grammy-winning R&B superstar from Tappahannock, Virginia, famous for explosive dance performances and smooth vocals since his 2005 self-titled debut.",
            notable: ["Under the Influence", "Loyal", "No Guidance", "With You", "Forever"],
            handles: { instagram: "@chrisbrownofficial", facebook: "Chris Brown", spotify: "Chris Brown on Spotify" },
            links: {
                instagram: "https://www.instagram.com/chrisbrownofficial/",
                facebook: "https://www.facebook.com/chrisbrown",
                spotify: "https://open.spotify.com/artist/7bXgB6jMjp9ATFy66eO08Z"
            }
        },
        "Bryson Tiller": {
            pfp: "../PFPs/BrysonTiller.jpg", genre: "TrapSoul / R&B", listeners: "24,190,800",
            bio: "Bryson Tiller is a Louisville, Kentucky singer-songwriter who pioneered the 'TrapSoul' sound, blending moody trap production with heartfelt 90s R&B melodies.",
            notable: ["Don't", "Exchange", "Sorry Not Sorry", "Right My Wrongs", "It Depends"],
            handles: { instagram: "@brysontiller", facebook: "Bryson Tiller", spotify: "Bryson Tiller on Spotify" },
            links: {
                instagram: "https://www.instagram.com/brysontiller/",
                facebook: "https://www.facebook.com/brysontiller",
                spotify: "https://open.spotify.com/artist/2EMAnMvWE2eb56ToJVfCWs"
            }
        },
        "Kehlani": {
            pfp: "../PFPs/Kehlani.jpg", genre: "Contemporary R&B / Neo-Soul", listeners: "19,640,220",
            bio: "Kehlani is an Oakland-born, two-time Grammy-nominated singer-songwriter celebrated for vulnerable lyricism and silky vocals across 'SweetSexySavage', 'It Was Good Until It Wasn't', and 'Crash'.",
            notable: ["Gangsta", "Nights Like This", "Honey", "Toxic", "After Hours"],
            handles: { instagram: "@kehlani", facebook: "Kehlani", spotify: "Kehlani on Spotify" },
            links: {
                instagram: "https://www.instagram.com/kehlani/",
                facebook: "https://www.facebook.com/kehlani",
                spotify: "https://open.spotify.com/artist/0cGUm45nv7Z6M6qdXYQGTX"
            }
        },
        "Usher": {
            pfp: "../PFPs/Usher.jpg", genre: "R&B Icon / Pop", listeners: "38,410,950",
            bio: "Usher Raymond IV is an 8-time Grammy winner widely hailed as the King of R&B, with over 100 million records sold, landmark albums like 'Confessions', and an iconic Super Bowl LVIII halftime show.",
            notable: ["Yeah!", "Burn", "Confessions Part II", "U Got It Bad", "My Boo"],
            handles: { instagram: "@usher", facebook: "Usher", spotify: "Usher on Spotify" },
            links: {
                instagram: "https://www.instagram.com/usher/",
                facebook: "https://www.facebook.com/usher",
                spotify: "https://open.spotify.com/artist/23zg3TcAtWQy7J6upgbUnj"
            }
        },
        "Ne-Yo": {
            pfp: "../PFPs/Ne-yo.jpg", genre: "R&B / Pop Songwriter", listeners: "32,750,300",
            bio: "Ne-Yo is a 3-time Grammy winner and one of the most prolific songwriters in modern pop and R&B, penning historic hits for Rihanna and Beyoncé alongside his own chart-topping catalog.",
            notable: ["So Sick", "Because of You", "Miss Independent", "Sexy Love", "Closer"],
            handles: { instagram: "@neyo", facebook: "NE-YO", spotify: "Ne-Yo on Spotify" },
            links: {
                instagram: "https://www.instagram.com/neyo/",
                facebook: "https://www.facebook.com/neyo",
                spotify: "https://open.spotify.com/artist/21E3waRsmPlU7jZsS13rcj"
            }
        },
        "Ravyn Lenae": {
            pfp: "../PFPs/RavynLenae.jpg", genre: "Alternative R&B / Neo-Soul", listeners: "14,920,110",
            bio: "Ravyn Lenae is a Chicago-born singer-songwriter praised for her luminous soprano and experimental take on classic soul, breaking through globally with 'Love Me Not' from 'Bird's Eye'.",
            notable: ["Love Me Not", "Sticky", "Venom", "One Wish", "Skin Tight"],
            handles: { instagram: "@ravynlenae", facebook: "Ravyn Lenae", spotify: "Ravyn Lenae on Spotify" },
            links: {
                instagram: "https://www.instagram.com/ravynlenae/",
                facebook: "https://www.facebook.com/ravynlenae",
                spotify: "https://open.spotify.com/artist/5RTLRtXjbXI2lSXc6jxlAz"
            }
        },
        "The Weeknd": {
            pfp: "../PFPs/TheWeeknd.jpg", genre: "Synth-Pop / Dark R&B", listeners: "118,640,000",
            bio: "The Weeknd (Abel Tesfaye) is a Toronto-born global superstar and the #1 most-streamed artist on Spotify, renowned for dark cinematic synthscapes and record-breaking anthems.",
            notable: ["Blinding Lights", "Starboy", "The Hills", "Save Your Tears", "Die For You"],
            handles: { instagram: "@theweeknd", facebook: "The Weeknd", spotify: "The Weeknd on Spotify" },
            links: {
                instagram: "https://www.instagram.com/theweeknd/",
                facebook: "https://www.facebook.com/theweeknd",
                spotify: "https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ"
            }
        },
        "Playboi Carti": {
            pfp: "../PFPs/Playboi.jpg", genre: "Experimental Trap / Rage", listeners: "51,280,600",
            bio: "Playboi Carti is an Atlanta rapper and founder of the Opium label, an avant-garde icon behind 'Die Lit' and 'Whole Lotta Red' who reshaped modern rage and trap production.",
            notable: ["Magnolia", "Sky", "Shoota", "FE!N", "Timeless"],
            handles: { instagram: "@playboicarti", facebook: "Playboi Carti", spotify: "Playboi Carti on Spotify" },
            links: {
                instagram: "https://www.instagram.com/playboicarti/",
                facebook: "https://www.facebook.com/PlayboiCarti/",
                spotify: "https://open.spotify.com/artist/699OTQXzgjhIYAHMy9RyPD"
            }
        },
        "Tommy Richman": {
            pfp: "../PFPs/TommyRichman.jpg", genre: "Funk / Alternative R&B", listeners: "29,870,400",
            bio: "Tommy Richman is a Virginia-raised singer and producer whose falsetto-driven viral hit 'MILLION DOLLAR BABY' debuted at #2 on the Billboard Hot 100 in 2024.",
            notable: ["MILLION DOLLAR BABY", "DEVIL IS A LIE", "WHITNEY", "THOUGHT YOU WERE THE ONE"],
            handles: { instagram: "@tommyrichmann", facebook: "Tommy Richman", spotify: "Tommy Richman on Spotify" },
            links: {
                instagram: "https://www.instagram.com/tommyrichmann/",
                facebook: "https://www.facebook.com/tommyrichmann/",
                spotify: "https://open.spotify.com/artist/1WaFQSHVGZQJTbf0BdxdNo"
            }
        }
    };

    /* Split "A ft. B" / "A with B" into individual artist names */
    function splitArtists(artistString) {
        return String(artistString || "")
            .split(/\s+ft\.\s+|\s+feat\.\s+|\s+with\s+|\s*&\s*|\s*,\s*/i)
            .map(n => n.trim())
            .filter(Boolean);
    }

    function getSongsByArtist(name) {
        return songs.filter(s => splitArtists(s.artist).includes(name));
    }

    function getAlbumsForArtist(name) {
        const artistSongIds = new Set(getSongsByArtist(name).map(s => s.id));
        return SIDEBAR_DATA.albums.filter(a => a.artistName === name || a.songIds.some(id => artistSongIds.has(id)));
    }

    function findAlbumForSong(songId) {
        return SIDEBAR_DATA.albums.find(a => a.songIds.includes(songId)) || SIDEBAR_DATA.albums[0];
    }

    let activeSidebarTab = "playlists";
    let sidebarSortOrder = "recents";
    let sidebarViewMode = "list";
    let activeSidebarItemId = null;

    /** Keeps pinned/liked playlists first while sorting remaining items case-insensitively. */
    function sortKeepingPinnedFirst(list, field) {
        list.sort((a, b) => {
            const aPinned = Boolean(a.pinned || a.isLiked);
            const bPinned = Boolean(b.pinned || b.isLiked);
            if (aPinned !== bPinned) return aPinned ? -1 : 1;
            return String(a[field] || "").localeCompare(String(b[field] || ""), undefined, { sensitivity: "base" });
        });
    }

    function setupSidebarSongs() {
        if (!sidebarSongList) return;
        sidebarSongList.replaceChildren();
        sidebarSongList.dataset.view = sidebarViewMode;

        let itemsToRender = [];

        if (activeSidebarTab === "playlists") {
            itemsToRender = [
                {
                    ...SIDEBAR_DATA.playlists[0],
                    subtitle: `Playlist • ${favorites.size} liked song${favorites.size !== 1 ? 's' : ''}`
                }
            ];
            const customPls = JSON.parse(localStorage.getItem("spotifake_custom_playlists") || "[]");
            customPls.forEach(pl => {
                itemsToRender.push({
                    id: pl.id,
                    title: pl.title,
                    subtitle: `Playlist • ${pl.songs ? pl.songs.length : 0} song${(pl.songs && pl.songs.length !== 1) ? 's' : ''}`,
                    cover: pl.cover || null,
                    creator: pl.creator || "",
                    isCustom: true,
                    customData: pl
                });
            });
        } else if (activeSidebarTab === "albums") {
            itemsToRender = getAllAlbums().map(alb => ({
                ...alb,
                creator: alb.artistName || alb.creator || "",
                subtitle: `Album • ${alb.artistName}`
            }));
        } else if (activeSidebarTab === "artists") {
            itemsToRender = SIDEBAR_DATA.artists.map(art => ({
                ...art,
                creator: art.artistName || art.title,
                subtitle: `Artist • ${(ARTIST_PROFILES[art.artistName] && ARTIST_PROFILES[art.artistName].genre) || "Verified Artist"}`
            }));
        }

        // Keep pinned items first while applying the selected library sort.
        if (sidebarSortOrder === "az") {
            sortKeepingPinnedFirst(itemsToRender, "title");
        } else if (sidebarSortOrder === "creator") {
            sortKeepingPinnedFirst(itemsToRender, "creator");
        } else if (sidebarSortOrder === "recently-added") {
            const addedAt = item => Number(String(item.id || "").match(/(\d{10,})$/)?.[1] || 0);
            itemsToRender.sort((a, b) => {
                const aPinned = Boolean(a.pinned || a.isLiked);
                const bPinned = Boolean(b.pinned || b.isLiked);
                if (aPinned !== bPinned) return aPinned ? -1 : 1;
                return addedAt(b) - addedAt(a);
            });
        }

        const sidebarQuery = $("#sidebarLibrarySearch")?.value.trim().toLowerCase();
        if (sidebarQuery) {
            itemsToRender = itemsToRender.filter(item =>
                item.title.toLowerCase().includes(sidebarQuery) ||
                (item.subtitle || "").toLowerCase().includes(sidebarQuery)
            );
            if (itemsToRender.length === 0) {
                const empty = document.createElement("li");
                empty.className = "sidebar-search-empty";
                empty.textContent = "No results found";
                sidebarSongList.appendChild(empty);
                return;
            }
        }

        itemsToRender.forEach(item => {
            const li = document.createElement("li");
            const isItemActive = activeSidebarItemId === item.id;
            li.className = `sidebar-song-item ${item.pinned ? "pinned-item" : ""} ${isItemActive ? "active" : ""}`;
            li.dataset.tab = activeSidebarTab;
            li.dataset.itemId = item.id;
            li.setAttribute("role", "button");
            li.setAttribute("tabindex", "0");
            li.setAttribute("aria-label", [item.title, item.subtitle].filter(Boolean).join(", "));

            const pinBadge = item.pinned ? '<span class="sidebar-pin-badge"><i class="fa-solid fa-thumbtack"></i></span> ' : '';
            const imgClass = activeSidebarTab === "artists" ? "sidebar-artist-avatar" : "sidebar-song-cover";

            if (item.isLiked) {
                li.innerHTML = `
                    <div class="sidebar-liked-cover"><i class="fa-solid fa-heart" style="color:#fff;"></i></div>
                    <div class="sidebar-song-info">
                        <p class="sidebar-song-title">Liked Songs</p>
                        <p class="sidebar-song-artist">${pinBadge}${item.subtitle}</p>
                    </div>
                `;
                li.addEventListener("click", () => {
                    activeSidebarItemId = item.id;
                    setupSidebarSongs();
                    displayPlaylistInView("liked");
                });
            } else if (item.isCustom) {
                const thumbHtml = item.cover
                    ? `<img src="${item.cover}" alt="${item.title}" class="${imgClass}">`
                    : `<div class="sidebar-liked-cover" style="background:linear-gradient(135deg,#450af5,#8e8ee5);"><i class="fa-solid fa-music" style="color:#fff;"></i></div>`;
                li.innerHTML = `
                    ${thumbHtml}
                    <div class="sidebar-song-info">
                        <p class="sidebar-song-title">${item.title}</p>
                        <p class="sidebar-song-artist">${pinBadge}${item.subtitle}</p>
                    </div>
                    <button type="button" class="sp-icon-btn sidebar-pl-play-btn" title="Play ${item.title}" style="margin-left:auto;width:28px;height:28px;font-size:11px;">
                        <i class="fa-solid fa-play"></i>
                    </button>
                `;
                li.querySelector(".sidebar-pl-play-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    activeSidebarItemId = item.id;
                    setupSidebarSongs();
                    displayPlaylistInView(item.id);
                    const plSongs = (item.customData && item.customData.songs) || [];
                    if (plSongs.length > 0) {
                        const sIdx = songs.findIndex(s => s.id === plSongs[0]);
                        if (sIdx !== -1) {
                            loadTrack(sIdx, true);
                            syncEntityViewPlayingState();
                        }
                    } else {
                        showToast(`"${item.title}" is empty — click "+ Add Songs" to add tracks!`);
                    }
                });
                li.addEventListener("click", () => {
                    activeSidebarItemId = item.id;
                    setupSidebarSongs();
                    displayPlaylistInView(item.id);
                });
            } else if (activeSidebarTab === "artists") {
                // Artist row in sidebar: circular PFP + Name/Genre + View & Share buttons (no play icon)
                li.innerHTML = `
                    <img src="${item.cover}" alt="${item.title}" class="${imgClass}">
                    <div class="sidebar-song-info">
                        <p class="sidebar-song-title">${item.title}</p>
                        <p class="sidebar-song-artist">${pinBadge}${item.subtitle}</p>
                    </div>
                    <div class="sidebar-item-quick-actions" style="display:flex;gap:4px;margin-left:auto;">
                        <button type="button" class="sp-icon-btn sidebar-artist-view-btn" title="View ${item.title}'s Profile" style="width:26px;height:26px;font-size:11px;">
                            <i class="fa-solid fa-user"></i>
                        </button>
                        <button type="button" class="sp-icon-btn sidebar-artist-share-btn" title="Share ${item.title}'s Info" style="width:26px;height:26px;font-size:11px;">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                    </div>
                `;
                li.querySelector(".sidebar-artist-view-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    activeSidebarItemId = item.id;
                    setupSidebarSongs();
                    displayArtistInView(item.artistName);
                });
                li.querySelector(".sidebar-artist-share-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    shareArtistInfo(item.artistName);
                });
                li.addEventListener("click", () => {
                    activeSidebarItemId = item.id;
                    setupSidebarSongs();
                    displayArtistInView(item.artistName);
                });
            } else if (activeSidebarTab === "albums") {
                // Album row in sidebar: cover + Album title/artist + quick play button + opens Spotify Album View
                li.innerHTML = `
                    <img src="${item.cover}" alt="${item.title}" class="${imgClass}">
                    <div class="sidebar-song-info">
                        <p class="sidebar-song-title">${item.title}</p>
                        <p class="sidebar-song-artist">${pinBadge}${item.subtitle}</p>
                    </div>
                    <button type="button" class="sp-icon-btn sidebar-album-play-btn" title="Play ${item.title}" style="margin-left:auto;width:28px;height:28px;font-size:11px;">
                        <i class="fa-solid fa-play"></i>
                    </button>
                `;
                li.querySelector(".sidebar-album-play-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    activeSidebarItemId = item.id;
                    setupSidebarSongs();
                    displayAlbumInView(item);
                    const firstId = item.songIds && item.songIds[0];
                    const sIdx = firstId != null ? songs.findIndex(s => s.id === firstId) : -1;
                    if (sIdx !== -1) {
                        loadTrack(sIdx, true);
                        syncEntityViewPlayingState();
                    } else {
                        showToast(`"${item.title}" has no songs yet!`);
                    }
                });
                li.addEventListener("click", () => {
                    activeSidebarItemId = item.id;
                    setupSidebarSongs();
                    displayAlbumInView(item);
                });
            } else {
                li.innerHTML = `
                    <img src="${item.cover}" alt="${item.title}" class="${imgClass}">
                    <div class="sidebar-song-info">
                        <p class="sidebar-song-title">${item.title}</p>
                        <p class="sidebar-song-artist">${pinBadge}${item.subtitle}</p>
                    </div>
                `;
                li.addEventListener("click", () => {
                    if (item.isCustom) {
                        if (item.customData && item.customData.songs && item.customData.songs.length > 0) {
                            const firstSongId = item.customData.songs[0];
                            const sIdx = songs.findIndex(s => s.id === firstSongId);
                            if (sIdx !== -1) {
                                loadTrack(sIdx, true);
                                updateArtistDetails(songs[sIdx].id);
                            }
                        } else {
                            showToast(`"${item.title}" is empty. Add songs to it using the + button!`);
                        }
                    } else if (item.trackId) {
                        const sIdx = songs.findIndex(s => s.id === item.trackId);
                        if (sIdx !== -1) {
                            loadTrack(sIdx, true);
                            updateArtistDetails(item.trackId);
                            openArtistPanel();
                        }
                    }
                });
            }

            sidebarSongList.appendChild(li);
        });
    }

    function updateSidebarActiveState() {
        const items = $$(".sidebar-song-item.song-track-item");
        items.forEach((item, index) => {
            const isActive = index === currentIndex;
            const isPlaying = isActive && !audio.paused;

            item.classList.toggle("active", isActive);
            const icon = item.querySelector(".sidebar-song-action");
            if (icon) {
                icon.className = `sidebar-song-action fa-solid ${isPlaying ? "fa-volume-high" : isActive ? "fa-pause" : "fa-play"}`;
            }
        });
    }

    /* ==========================================================
       10. Right Column: Spotify Now Playing View (3-Column View)
       ========================================================== */
    const SONG_CREDITS_DB = {
        1: [
            { name: "Chris Brown", role: "Main Artist • Composer • Lyricist", canFollow: true, artistName: "Chris Brown" },
            { name: "Bryson Tiller", role: "Featured Artist • Composer • Lyricist", canFollow: true, artistName: "Bryson Tiller" },
            { name: "RiotUSA", role: "Producer", canFollow: false },
            { name: "Patrizio 'Teezio' Pigliapoco", role: "Mixing & Mastering Engineer", canFollow: false }
        ],
        2: [
            { name: "Chris Brown", role: "Main Artist • Vocalist", canFollow: true, artistName: "Chris Brown" },
            { name: "Stargate (Tor Erik Hermansen & Mikkel S. Eriksen)", role: "Producer • Composer", canFollow: false },
            { name: "Johntá Austin", role: "Songwriter • Lyricist", canFollow: false },
            { name: "Phil Tan", role: "Mixing & Mastering Engineer", canFollow: false }
        ],
        3: [
            { name: "Kehlani", role: "Main Artist • Composer • Lyricist", canFollow: true, artistName: "Kehlani" },
            { name: "Usher", role: "Featured Artist • Vocalist", canFollow: true, artistName: "Usher" },
            { name: "Khris Riddick-Tynes", role: "Producer", canFollow: false },
            { name: "Jaycen Joshua", role: "Mastering Engineer", canFollow: false }
        ],
        4: [
            { name: "Ne-Yo", role: "Main Artist • Composer • Lyricist", canFollow: true, artistName: "Ne-Yo" },
            { name: "Stargate", role: "Producer • Arranger", canFollow: false },
            { name: "Herb Powers Jr.", role: "Mastering Engineer", canFollow: false }
        ],
        5: [
            { name: "Ne-Yo", role: "Main Artist • Composer • Lyricist", canFollow: true, artistName: "Ne-Yo" },
            { name: "Stargate", role: "Producer", canFollow: false },
            { name: "Phil Tan", role: "Mixing & Mastering Engineer", canFollow: false }
        ],
        6: [
            { name: "Ne-Yo", role: "Main Artist • Composer • Lyricist", canFollow: true, artistName: "Ne-Yo" },
            { name: "Stargate", role: "Producer", canFollow: false },
            { name: "Herb Powers Jr.", role: "Mastering Engineer", canFollow: false }
        ],
        7: [
            { name: "Ne-Yo", role: "Main Artist • Composer • Lyricist", canFollow: true, artistName: "Ne-Yo" },
            { name: "Stargate", role: "Producer • Composer", canFollow: false },
            { name: "Herb Powers Jr.", role: "Mastering Engineer", canFollow: false }
        ],
        8: [
            { name: "Ravyn Lenae", role: "Main Artist • Composer • Lyricist", canFollow: true, artistName: "Ravyn Lenae" },
            { name: "Dahi", role: "Producer", canFollow: false },
            { name: "Ruairi O'Flaherty", role: "Mastering Engineer", canFollow: false }
        ],
        9: [
            { name: "The Weeknd", role: "Main Artist • Composer • Lyricist", canFollow: true, artistName: "The Weeknd" },
            { name: "Playboi Carti", role: "Featured Artist • Lyricist", canFollow: true, artistName: "Playboi Carti" },
            { name: "Pharrell Williams & Mike Dean", role: "Producer", canFollow: false },
            { name: "Mike Dean", role: "Mastering Engineer", canFollow: false }
        ],
        10: [
            { name: "Tommy Richman", role: "Main Artist • Composer • Lyricist", canFollow: true, artistName: "Tommy Richman" },
            { name: "Max Vossberg, Jonah Roy & Kavi", role: "Producer", canFollow: false },
            { name: "Mark Santangelo", role: "Mastering Engineer", canFollow: false }
        ]
    };

    let currentNpvSongId = 1;

    function getNextQueueSongIndex() {
        if (queueCtrl) {
            const preview = queueCtrl.getNextPreview();
            if (preview && typeof preview.index === "number") return preview.index;
        }
        return (currentIndex + 1) % songs.length;
    }

    let activeCenterLyricIndex = -1;
    let isLyricsFullscreen = false;
    let lyricsFsIdleTimer = null;
    let lyricsFsScrollHideTimer = null;
    let isLyricsFsPointerDown = false;
    let isDraggingFsScrollbar = false;
    let fsScrollDragStartY = 0;
    let fsScrollDragStartTop = 0;
    const LYRICS_FS_IDLE_MS = 2500;
    const LYRICS_FS_SCROLL_HIDE_MS = 900;
    const LYRICS_FS_EDGE_PX = 68;

    function clearLyricsFsIdleTimer() {
        if (lyricsFsIdleTimer) {
            clearTimeout(lyricsFsIdleTimer);
            lyricsFsIdleTimer = null;
        }
    }

    function clearLyricsFsScrollTimer() {
        if (lyricsFsScrollHideTimer) {
            clearTimeout(lyricsFsScrollHideTimer);
            lyricsFsScrollHideTimer = null;
        }
    }

    function updateLyricsFsScrollbarThumb() {
        const scrollBox = $("#spLyricsStageScroll");
        const track = $("#spLyricsFsScrollbar");
        const thumb = $("#spLyricsFsThumb");
        if (!scrollBox || !track || !thumb) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollBox;
        if (scrollHeight <= clientHeight + 2) {
            track.classList.add("is-empty");
            return;
        }
        track.classList.remove("is-empty");

        const trackPad = 6; // top + bottom 3px padding
        const usableTrack = Math.max(40, track.clientHeight - trackPad);
        const thumbHeight = Math.max(38, Math.round((clientHeight / scrollHeight) * usableTrack));
        const maxScroll = Math.max(1, scrollHeight - clientHeight);
        const maxTop = Math.max(0, usableTrack - thumbHeight);
        const thumbTop = Math.min(maxTop, Math.max(0, (scrollTop / maxScroll) * maxTop));

        thumb.style.height = `${thumbHeight}px`;
        thumb.style.transform = `translateY(${thumbTop}px)`;
    }

    function showLyricsFsScrollbar() {
        if (!isLyricsFullscreen) return;
        clearLyricsFsScrollTimer();
        updateLyricsFsScrollbarThumb();
        document.body.classList.add("sp-lyrics-fs-scroll-peek");
    }

    function scheduleLyricsFsScrollbarHide() {
        clearLyricsFsScrollTimer();
        if (isDraggingFsScrollbar) return;
        lyricsFsScrollHideTimer = setTimeout(() => {
            if (!isDraggingFsScrollbar) {
                document.body.classList.remove("sp-lyrics-fs-scroll-peek");
            }
        }, LYRICS_FS_SCROLL_HIDE_MS);
    }

    function scheduleLyricsFsIdle() {
        clearLyricsFsIdleTimer();
        if (!isLyricsFullscreen || isLyricsFsPointerDown || isDraggingFsScrollbar) return;
        lyricsFsIdleTimer = setTimeout(() => {
            if (isLyricsFullscreen && !isLyricsFsPointerDown && !isDraggingFsScrollbar) {
                document.body.classList.add("sp-lyrics-fs-idle");
                document.body.classList.remove("sp-lyrics-fs-scroll-peek");
            }
        }, LYRICS_FS_IDLE_MS);
    }

    function wakeLyricsFullscreenControls() {
        if (!isLyricsFullscreen) return;
        document.body.classList.remove("sp-lyrics-fs-idle");
        scheduleLyricsFsIdle();
    }

    function syncFullscreenLyricsButtons() {
        const stageBtn = $("#spLyricsFullscreenBtn");
        if (stageBtn) {
            stageBtn.classList.toggle("is-active", isLyricsFullscreen);
            stageBtn.setAttribute("aria-pressed", String(isLyricsFullscreen));
            stageBtn.title = isLyricsFullscreen ? "Exit fullscreen lyrics" : "Fullscreen lyrics";
            stageBtn.innerHTML = isLyricsFullscreen
                ? `<i class="fa-solid fa-compress"></i> Exit fullscreen`
                : `<i class="fa-solid fa-expand"></i> Fullscreen`;
        }

        const playerBtn = $("#playerLyricsFullscreenBtn");
        if (playerBtn) {
            playerBtn.classList.toggle("active", isLyricsFullscreen);
            playerBtn.setAttribute("aria-pressed", String(isLyricsFullscreen));
            playerBtn.title = isLyricsFullscreen ? "Exit fullscreen lyrics" : "Fullscreen lyrics";
            const icon = playerBtn.querySelector("i");
            if (icon) {
                icon.className = `fa-solid ${isLyricsFullscreen ? "fa-compress" : "fa-expand"}`;
            }
            const label = playerBtn.querySelector(".player-extra-label");
            if (label) label.textContent = isLyricsFullscreen ? "Exit" : "Fullscreen";
        }
    }

    function enterLyricsFullscreen() {
        if (!isCenterLyricsViewOpen()) {
            displayLyricsPreviewView(getCurrentSong()?.id);
        }
        isLyricsFullscreen = true;
        document.body.classList.add("sp-lyrics-fullscreen");
        document.body.classList.remove("sp-lyrics-fs-idle", "sp-lyrics-fs-scroll-peek");
        syncFullscreenLyricsButtons();
        scheduleLyricsFsIdle();

        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }

        requestAnimationFrame(() => {
            syncCenterLyricsView(audio.currentTime || 0, true);
            updateLyricsFsScrollbarThumb();
        });
    }

    function exitLyricsFullscreen(skipNativeExit = false) {
        if (!isLyricsFullscreen && !document.body.classList.contains("sp-lyrics-fullscreen")) {
            return;
        }
        isLyricsFullscreen = false;
        isLyricsFsPointerDown = false;
        isDraggingFsScrollbar = false;
        clearLyricsFsIdleTimer();
        clearLyricsFsScrollTimer();
        // Keep the player visible when the fullscreen-only animation rule is removed.
        const playerBar = $(".player-bar");
        if (playerBar) playerBar.style.animation = "none";
        document.body.classList.remove("sp-lyrics-fullscreen", "sp-lyrics-fs-idle", "sp-lyrics-fs-scroll-peek");
        syncFullscreenLyricsButtons();

        if (!skipNativeExit && document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        }

        requestAnimationFrame(() => {
            syncCenterLyricsView(audio.currentTime || 0, true);
        });
    }

    function toggleLyricsFullscreen() {
        if (isLyricsFullscreen) {
            exitLyricsFullscreen();
        } else {
            enterLyricsFullscreen();
        }
    }

    $("#playerLyricsFullscreenBtn")?.addEventListener("click", toggleLyricsFullscreen);

    const handleLyricsFsPointerMove = (e) => {
        if (!isLyricsFullscreen) return;
        wakeLyricsFullscreenControls();

        if (isDraggingFsScrollbar) {
            const scrollBox = $("#spLyricsStageScroll");
            const fsTrack = $("#spLyricsFsScrollbar");
            const fsThumb = $("#spLyricsFsThumb");
            if (scrollBox && fsTrack && fsThumb) {
                const usableTrack = Math.max(1, fsTrack.clientHeight - 6 - fsThumb.offsetHeight);
                const maxScroll = Math.max(1, scrollBox.scrollHeight - scrollBox.clientHeight);
                const deltaY = e.clientY - fsScrollDragStartY;
                scrollBox.scrollTop = fsScrollDragStartTop + (deltaY / usableTrack) * maxScroll;
            }
        }

        const nearRightEdge = typeof e.clientX === "number" && e.clientX >= window.innerWidth - LYRICS_FS_EDGE_PX;
        const onScrollbar = e.target?.closest?.("#spLyricsFsScrollbar");
        if (nearRightEdge || onScrollbar || isDraggingFsScrollbar) {
            showLyricsFsScrollbar();
        } else {
            scheduleLyricsFsScrollbarHide();
        }
    };

    window.addEventListener("pointermove", handleLyricsFsPointerMove, { passive: true });
    window.addEventListener("mousemove", handleLyricsFsPointerMove, { passive: true });

    ["mousedown", "touchstart", "wheel"].forEach(evt => {
        window.addEventListener(evt, () => {
            if (isLyricsFullscreen) wakeLyricsFullscreenControls();
        }, { passive: true });
    });

    window.addEventListener("pointerdown", () => {
        if (isLyricsFullscreen) {
            isLyricsFsPointerDown = true;
            wakeLyricsFullscreenControls();
        }
    }, { passive: true });

    ["pointerup", "pointercancel"].forEach(evt => {
        window.addEventListener(evt, () => {
            if (isLyricsFsPointerDown || isDraggingFsScrollbar) {
                isLyricsFsPointerDown = false;
                isDraggingFsScrollbar = false;
                document.body.classList.remove("sp-lyrics-fs-dragging");
                if (isLyricsFullscreen) {
                    scheduleLyricsFsIdle();
                    scheduleLyricsFsScrollbarHide();
                }
            }
        }, { passive: true });
    });

    window.addEventListener("resize", () => {
        if (isLyricsFullscreen) updateLyricsFsScrollbarThumb();
    }, { passive: true });

    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement && isLyricsFullscreen) {
            exitLyricsFullscreen(true);
        }
    });

    function isCenterLyricsViewOpen() {
        return Boolean(
            homeAlbumArtistView &&
            homeAlbumArtistView.style.display !== "none" &&
            homeAlbumArtistView.dataset.activeView === "lyrics"
        );
    }

    function syncLyricsPreviewToggleLabel() {
        const pill = $("#npvShowLyricsPreviewBtn");
        if (pill) {
            pill.textContent = isCenterLyricsViewOpen() ? "Show less" : "Show lyrics";
        }
    }

    function updateNpvLyricsPreview(time = audio.currentTime || 0) {
        const previewBox = $("#npvLyricsPreviewLines");
        if (!previewBox) return;

        const lines = SONG_LYRICS[currentNpvSongId] || [];
        if (lines.length === 0) {
            previewBox.innerHTML = `<p class="npv-lyric-line active">No synchronized lyrics available for this song</p>`;
            return;
        }

        const usesMmss = lines.some(item => Number(item.time) >= 300);
        let activeIdx = 0;
        for (let i = 0; i < lines.length; i++) {
            const sec = parseLyricTimeValue(lines[i].time, usesMmss);
            if (time >= sec) activeIdx = i;
            else break;
        }

        // Prefer showing vocal lines instead of just the intro tag when paused at 0:00
        let startIdx = activeIdx;
        if (time < 0.5 && lines.length > 1 && String(lines[0].text).includes("♪")) {
            startIdx = 1;
        } else if (activeIdx > 0 && activeIdx < lines.length - 1) {
            startIdx = activeIdx;
        }

        const slice = lines.slice(startIdx, startIdx + 3);
        previewBox.innerHTML = slice.map((l, i) => `
            <p class="npv-lyric-line ${i === 0 ? "active" : ""}">${l.text}</p>
        `).join("");
    }

    function syncCenterLyricsView(time = audio.currentTime || 0, forceScroll = false) {
        if (!isCenterLyricsViewOpen()) return;
        const song = getCurrentSong();
        if (!song || Number(homeAlbumArtistView.dataset.lyricsSongId) !== Number(song.id)) return;

        const scrollBox = $("#spLyricsStageScroll");
        const lines = SONG_LYRICS[song.id] || [];
        const lineBtns = scrollBox ? [...scrollBox.querySelectorAll(".sp-stage-lyric-line")] : [];
        if (lines.length === 0 || lineBtns.length === 0) return;

        const usesMmss = lines.some(item => Number(item.time) >= 300);
        let activeIdx = -1;
        for (let i = 0; i < lines.length; i++) {
            const sec = parseLyricTimeValue(lines[i].time, usesMmss);
            if (time >= sec) activeIdx = i;
            else break;
        }

        if (activeIdx === activeCenterLyricIndex && !forceScroll) return;
        activeCenterLyricIndex = activeIdx;

        lineBtns.forEach((btn, idx) => {
            btn.classList.toggle("is-active", idx === activeIdx);
            btn.classList.toggle("is-past", activeIdx !== -1 && idx < activeIdx);
            if (idx === activeIdx && scrollBox) {
                const lineTopInScrollBox = scrollBox.scrollTop + btn.getBoundingClientRect().top - scrollBox.getBoundingClientRect().top;
                const targetTop = lineTopInScrollBox - (scrollBox.clientHeight / 2) + (btn.clientHeight / 2);
                scrollBox.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
            }
        });
    }

    function syncCenterLyricsPlayButton() {
        const button = $("#spLyricsPlayBtn");
        if (!button) return;
        const playing = !audio.paused;
        button.innerHTML = `<i class="fa-solid fa-${playing ? "pause" : "play"}"></i>`;
        button.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${getCurrentSong()?.title || "song"}`);
    }

    function syncCenterLyricsSaveButton() {
        const button = $("#spLyricsSaveBtn");
        if (!button) return;
        const songId = Number(homeAlbumArtistView?.dataset.lyricsSongId);
        const saved = favorites.has(songId);
        button.classList.toggle("is-saved", saved);
        button.setAttribute("aria-pressed", String(saved));
        button.setAttribute("aria-label", saved ? "Remove from Liked Songs" : "Add to Liked Songs");
        button.title = saved ? "Remove from Liked Songs" : "Add to Liked Songs";
        button.innerHTML = `<i class="fa-solid fa-${saved ? "check" : "plus"}"></i>`;
    }

    audio.addEventListener("play", syncCenterLyricsPlayButton);
    audio.addEventListener("pause", syncCenterLyricsPlayButton);

    function displayLyricsPreviewView(songId) {
        const targetId = Number(songId) || getCurrentSong().id;
        const sIdx = songs.findIndex(x => x.id === targetId);
        if (sIdx !== -1 && sIdx !== currentIndex) {
            loadTrack(sIdx, true);
        }
        const song = songs.find(x => x.id === targetId) || getCurrentSong();
        if (!song || !homeAlbumArtistView) return;

        showEntityPageView(true);
        homeAlbumArtistView.dataset.activeView = "lyrics";
        homeAlbumArtistView.dataset.lyricsSongId = String(song.id);
        activeCenterLyricIndex = -1;
        syncLyricsPreviewToggleLabel();

        const lines = SONG_LYRICS[song.id] || [];
        const usesMmss = lines.some(item => Number(item.time) >= 300);
        const primaryArtist = song.artist.split(/\s+ft\.|,/i)[0].trim();
        const artistPhoto = ARTIST_PROFILES[primaryArtist]?.pfp || song.cover;

        homeAlbumArtistView.innerHTML = `
            <div class="sp-back-bar">
                <button type="button" class="sp-back-btn" id="spLyricsBackBtn">
                    <i class="fa-solid fa-arrow-left"></i> Back
                </button>
            </div>
            <section class="sp-lyrics-stage">
                <div class="sp-lyrics-stage-header" style="--lyrics-cover: url('${song.cover}')">
                    <div class="sp-lyrics-stage-track">
                        <img src="${song.cover}" alt="${song.title}">
                        <div class="sp-lyrics-stage-copy">
                            <span class="sp-lyrics-stage-type">Song</span>
                            <h2>${song.title}</h2>
                            <div class="sp-lyrics-stage-artist">
                                <img src="${artistPhoto}" alt="${primaryArtist}">
                                <p>${song.artist}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sp-lyrics-stage-actions">
                    <button type="button" class="sp-lyrics-stage-play" id="spLyricsPlayBtn" aria-label="Play ${song.title}" title="Play or pause">
                        <i class="fa-solid fa-play"></i>
                    </button>
                    <button type="button" class="sp-lyrics-stage-save" id="spLyricsSaveBtn" aria-label="Add to Liked Songs" aria-pressed="false" title="Add to Liked Songs">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                <div class="sp-lyrics-stage-body">
                    <div class="sp-lyrics-stage-main">
                        <h3>Lyrics</h3>
                        <div class="sp-lyrics-stage-scroll" id="spLyricsStageScroll"></div>
                    </div>
                </div>
                <div class="sp-lyrics-fs-scrollbar" id="spLyricsFsScrollbar" aria-hidden="true">
                    <div class="sp-lyrics-fs-thumb" id="spLyricsFsThumb"></div>
                </div>
            </section>
        `;

        const scrollBox = homeAlbumArtistView.querySelector("#spLyricsStageScroll");
        const fsTrack = homeAlbumArtistView.querySelector("#spLyricsFsScrollbar");
        const fsThumb = homeAlbumArtistView.querySelector("#spLyricsFsThumb");
        if (lines.length === 0) {
            scrollBox.innerHTML = `<p style="color:rgba(255,255,255,0.7);font-size:15px;">No synchronized lyrics available for this song.</p>`;
        } else {
            lines.forEach((line) => {
                const sec = parseLyricTimeValue(line.time, usesMmss);
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "sp-stage-lyric-line";
                btn.textContent = line.text;
                btn.title = `Jump to ${formatTime(sec)}`;
                btn.addEventListener("click", () => {
                    audio.currentTime = sec;
                    if (audio.paused) playTrack();
                    activeCenterLyricIndex = -1;
                    syncCenterLyricsView(sec, true);
                    updateNpvLyricsPreview(sec);
                });
                scrollBox.appendChild(btn);
            });
        }

        scrollBox?.addEventListener("scroll", updateLyricsFsScrollbarThumb, { passive: true });
        if (fsTrack && fsThumb && scrollBox) {
            fsThumb.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                e.stopPropagation();
                isDraggingFsScrollbar = true;
                isLyricsFsPointerDown = true;
                fsScrollDragStartY = e.clientY;
                fsScrollDragStartTop = scrollBox.scrollTop;
                document.body.classList.add("sp-lyrics-fs-dragging");
                showLyricsFsScrollbar();
            });

            fsTrack.addEventListener("pointerdown", (e) => {
                if (e.target === fsThumb) return;
                e.preventDefault();
                const rect = fsTrack.getBoundingClientRect();
                const ratio = Math.min(1, Math.max(0, (e.clientY - rect.top) / Math.max(1, rect.height)));
                const maxScroll = Math.max(0, scrollBox.scrollHeight - scrollBox.clientHeight);
                scrollBox.scrollTo({ top: ratio * maxScroll, behavior: "smooth" });
                showLyricsFsScrollbar();
            });
        }

        homeAlbumArtistView.querySelector("#spLyricsBackBtn")?.addEventListener("click", () => {
            if (previousCenterView === "library") showFullLibraryView();
            else showHomeDashboardView();
        });
        homeAlbumArtistView.querySelector("#spLyricsPlayBtn")?.addEventListener("click", () => playButton?.click());
        homeAlbumArtistView.querySelector("#spLyricsSaveBtn")?.addEventListener("click", () => {
            toggleFavorite(song.id);
            setupSidebarSongs();
            showToast(favorites.has(song.id) ? "Added to Liked Songs" : "Removed from Liked Songs");
        });
        syncCenterLyricsPlayButton();
        syncCenterLyricsSaveButton();
        syncFullscreenLyricsButtons();

        syncCenterLyricsView(audio.currentTime || 0, true);
        requestAnimationFrame(updateLyricsFsScrollbarThumb);
    }

    artistDedicatedPageLink?.addEventListener("click", event => {
        event.preventDefault();
        displayLyricsPreviewView(currentNpvSongId);
    });

    function renderNpvCreditsAndQueue(songId) {
        const id = Number(songId) || getCurrentSong().id;
        const song = songs.find(s => s.id === id) || getCurrentSong();

        // 1. Render Credits Card
        const creditsListEl = $("#npvCreditsList");
        if (creditsListEl) {
            const credits = SONG_CREDITS_DB[id] || SONG_CREDITS_DB[1];
            creditsListEl.innerHTML = "";
            credits.slice(0, 3).forEach(cred => {
                const row = document.createElement("div");
                row.className = "sp-npv-credit-row";

                const info = document.createElement("div");
                info.className = "sp-npv-credit-info";

                if (cred.canFollow && cred.artistName) {
                    const nameBtn = document.createElement("button");
                    nameBtn.type = "button";
                    nameBtn.className = "sp-npv-credit-name-link";
                    nameBtn.textContent = cred.name;
                    nameBtn.title = `Open ${cred.name}'s Artist Profile`;
                    nameBtn.addEventListener("click", () => displayArtistInView(cred.artistName));
                    info.appendChild(nameBtn);
                } else {
                    const nameSpan = document.createElement("div");
                    nameSpan.className = "sp-npv-credit-name";
                    nameSpan.textContent = cred.name;
                    info.appendChild(nameSpan);
                }

                const roleDiv = document.createElement("div");
                roleDiv.className = "sp-npv-credit-role";
                roleDiv.textContent = cred.role;
                info.appendChild(roleDiv);

                row.appendChild(info);

                if (cred.canFollow && cred.artistName) {
                    const isFollowing = followedArtists.has(cred.artistName);
                    const fBtn = document.createElement("button");
                    fBtn.type = "button";
                    fBtn.className = `sp-npv-follow-btn ${isFollowing ? "is-following" : ""}`;
                    fBtn.textContent = isFollowing ? "Following" : "Follow";
                    fBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        toggleFollowArtist(cred.artistName);
                    });
                    row.appendChild(fBtn);
                }

                creditsListEl.appendChild(row);
            });
        }

        // 2. Render Next in Queue Card
        const nextQueueEl = $("#npvNextQueueItem");
        if (nextQueueEl) {
            const preview = queueCtrl ? queueCtrl.getNextPreview() : null;
            const nextIdx = preview ? preview.index : getNextQueueSongIndex();
            const nextSong = (preview && preview.song) || songs[nextIdx] || songs[0];
            const isQueued = Boolean(preview && preview.isQueued);
            nextQueueEl.innerHTML = `
                <div class="sp-npv-next-thumb-wrap">
                    <img src="${nextSong.cover}" alt="${nextSong.title}" class="sp-npv-next-thumb">
                    <span class="sp-npv-next-play-overlay"><i class="fa-solid fa-play"></i></span>
                </div>
                <div class="sp-npv-next-meta">
                    <div class="sp-npv-next-title">${nextSong.title}</div>
                    <div class="sp-npv-next-sub">
                        ${isQueued ? `<span class="sp-queued-pill">Queued</span>` : `<span class="sp-npv-explicit-badge" title="Explicit">E</span>`}
                        <span class="sp-npv-next-artist">${nextSong.artist}</span>
                    </div>
                </div>
            `;
            nextQueueEl.onclick = () => {
                if (queueCtrl) queueCtrl.advanceNext(false);
                else loadTrack(nextIdx, true);
            };
            nextQueueEl.onkeydown = (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (queueCtrl) queueCtrl.advanceNext(false);
                    else loadTrack(nextIdx, true);
                }
            };
        }
    }

    function toggleFollowArtist(artistName) {
        if (!artistName) return;
        if (followedArtists.has(artistName)) {
            followedArtists.delete(artistName);
            showToast(`Unfollowed ${artistName}`);
        } else {
            followedArtists.add(artistName);
            showToast(`Following ${artistName}`);
        }
        localStorage.setItem("spotifake_followed_artists", JSON.stringify([...followedArtists]));
        updateArtistDetails(currentNpvSongId);
        if (typeof renderFollowingSection === "function" && followingSection && !followingSection.hidden) {
            renderFollowingSection();
        }
    }

    function openCreditsModal(songId) {
        const id = Number(songId) || currentNpvSongId;
        const song = songs.find(s => s.id === id) || getCurrentSong();
        const album = findAlbumForSong(id);
        const credits = SONG_CREDITS_DB[id] || SONG_CREDITS_DB[1];

        let overlay = $("#spCreditsModalOverlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "spCreditsModalOverlay";
            overlay.className = "sp-profile-details-backdrop";
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <div class="sp-profile-details-modal" role="dialog" aria-modal="true" aria-label="Song Credits" style="max-width:480px;">
                <div class="sp-profile-details-header">
                    <h2>Credits</h2>
                    <button type="button" class="sp-profile-details-close" id="spCreditsCloseBtn" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div style="display:flex;align-items:center;gap:14px;padding-bottom:16px;margin-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <img src="${song.cover}" alt="${song.title}" style="width:56px;height:56px;border-radius:10px;object-fit:cover;border:1px solid rgba(255,0,127,0.35);">
                    <div>
                        <div style="font-size:16px;font-weight:900;color:#fff;">${song.title}</div>
                        <div style="font-size:12.5px;font-weight:700;color:var(--neon-yellow);margin-top:2px;">${album.title} • ${album.year}</div>
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:14px;">
                    ${credits.map(c => `
                        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
                            <div>
                                <div style="font-size:14px;font-weight:800;color:#fff;">${c.name}</div>
                                <div style="font-size:12px;font-weight:600;color:#9e9eae;margin-top:2px;">${c.role}</div>
                            </div>
                        </div>
                    `).join("")}
                    <div style="margin-top:6px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);font-size:11.5px;color:#9e9eae;">
                        <strong style="color:var(--loud-magenta);">Source / Label:</strong> ${album.label || "Spotifake Cyber Records"}
                    </div>
                </div>
            </div>
        `;
        overlay.style.display = "flex";
        overlay.querySelector("#spCreditsCloseBtn")?.addEventListener("click", () => { overlay.style.display = "none"; });
        overlay.onclick = (e) => { if (e.target === overlay) overlay.style.display = "none"; };
    }

    function openQueueDrawerModal() {
        if (queueCtrl) queueCtrl.openQueueModal();
    }

    const npvCanvasVideo = $("#npvCanvasVideo");

    function setCanvasActive(active) {
        if (npvCanvasVideo) npvCanvasVideo.classList.toggle("is-visible", Boolean(active));
        if (artistDetailPanel) artistDetailPanel.classList.toggle("has-canvas", Boolean(active));
    }

    if (npvCanvasVideo) {
        npvCanvasVideo.muted = true;
        npvCanvasVideo.defaultMuted = true;
        npvCanvasVideo.volume = 0;
        npvCanvasVideo.loop = true;
        npvCanvasVideo.addEventListener("error", () => {
            setCanvasActive(false);
        });
        window.SpotifakeCanvas?.bindAutoCrop(npvCanvasVideo);
    }

    /**
     * Plays a muted, independently looping Spotify-style Canvas video for the
     * active track as a half-card backdrop while music is playing.
     */
    function syncNpvCanvasVideo(songId, shouldPlay) {
        if (!npvCanvasVideo) return;
        npvCanvasVideo.muted = true;
        npvCanvasVideo.defaultMuted = true;
        npvCanvasVideo.volume = 0;
        npvCanvasVideo.loop = true;

        const entry = window.SpotifakeCanvas?.byId(songId, "../VID_card/") || null;
        if (!entry) {
            setCanvasActive(false);
            npvCanvasVideo.pause();
            if (npvCanvasVideo.dataset.canvasSrc) {
                delete npvCanvasVideo.dataset.canvasSrc;
                npvCanvasVideo.removeAttribute("src");
                npvCanvasVideo.load();
            }
            return;
        }

        if (npvCanvasVideo.dataset.canvasSrc !== entry.src) {
            setCanvasActive(false);
            window.SpotifakeCanvas?.setBaseCrop(npvCanvasVideo, entry.crop);
            npvCanvasVideo.dataset.canvasSrc = entry.src;
            npvCanvasVideo.src = entry.src;
            npvCanvasVideo.load();
        }

        if (shouldPlay) {
            npvCanvasVideo.play().then(() => {
                if (npvCanvasVideo.dataset.canvasSrc === entry.src && !audio.paused && !audio.ended) {
                    setCanvasActive(true);
                } else if (audio.paused || audio.ended) {
                    setCanvasActive(false);
                    npvCanvasVideo.pause();
                }
            }).catch(() => {
                setCanvasActive(false);
            });
        } else {
            setCanvasActive(false);
            npvCanvasVideo.pause();
        }
    }

    function updateArtistDetails(songId) {
        const id = Number(songId) || getCurrentSong().id;
        currentNpvSongId = id;
        const song = songs.find(s => s.id === id) || songs[0];
        const details = ARTIST_DETAILS[id] || ARTIST_DETAILS[1];
        const album = findAlbumForSong(id);
        const primaryArtistName = splitArtists(song.artist)[0] || song.artist;
        const artistProfile = ARTIST_PROFILES[primaryArtistName] || ARTIST_PROFILES["Chris Brown"];

        // 1. Top Header Context Title (Album Name — clicks open Album View)
        const panelSongNameHeader = $("#panelSongNameHeader");
        if (panelSongNameHeader) {
            panelSongNameHeader.textContent = `${album.title} - ${song.title}`;
            panelSongNameHeader.onclick = () => displayAlbumInView(album);
        }

        // 2. Cover Art, Spotify Canvas Video & Genre Pill
        if (artistCoverImg) artistCoverImg.src = song.cover;
        if (artistBadgeTag) artistBadgeTag.textContent = details.genre;
        syncNpvCanvasVideo(id, !audio.paused && !audio.ended && getCurrentSong()?.id === id);

        // 3. Track Title & Clickable Artist Names
        if (artistTrackTitle) {
            artistTrackTitle.textContent = song.title;
            artistTrackTitle.style.cursor = "pointer";
            artistTrackTitle.onclick = () => displayAlbumInView(album);
        }
        if (artistNameHeading) {
            artistNameHeading.innerHTML = "";
            const names = splitArtists(song.artist);
            names.forEach((n, idx) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "sp-inline-link sp-npv-artist-sublink";
                btn.textContent = n;
                btn.title = `Open ${n}'s Artist Profile`;
                btn.addEventListener("click", () => displayArtistInView(n));
                artistNameHeading.appendChild(btn);
                if (idx < names.length - 1) {
                    artistNameHeading.appendChild(document.createTextNode(", "));
                }
            });
        }

        // 4. Sync Plus / Checkmark Liked Button next to track title
        const npvAddLikedBtn = $("#npvAddLikedBtn");
        const npvAddLikedIcon = $("#npvAddLikedIcon");
        const isFav = favorites.has(id);
        if (npvAddLikedBtn && npvAddLikedIcon) {
            npvAddLikedBtn.classList.toggle("is-saved", isFav);
            npvAddLikedIcon.className = isFav ? "fa-solid fa-circle-check" : "fa-solid fa-circle-plus";
            npvAddLikedBtn.title = isFav ? "Saved to Liked Songs (Click to add to playlist or toggle)" : "Add to Liked Songs";
        }

        // 5. Update Lyrics Preview Card
        updateNpvLyricsPreview(song.id === getCurrentSong().id ? (audio.currentTime || 0) : 0);

        // 6. About the Artist Card (Photo, Verified Name, Monthly Listeners, Follow Button, Bio)
        const npvArtistPhoto = $("#npvArtistPhoto");
        const npvArtistPhotoWrap = $("#npvArtistPhotoWrap");
        const npvArtistNameText = $("#npvArtistNameText");
        const npvArtistNameBtn = $("#npvArtistNameBtn");
        const npvArtistListeners = $("#npvArtistListeners");
        const npvArtistFollowBtn = $("#npvArtistFollowBtn");

        if (npvArtistPhoto) {
            npvArtistPhoto.src = artistProfile.pfp || song.cover;
            npvArtistPhoto.alt = primaryArtistName;
        }
        if (npvArtistPhotoWrap) {
            npvArtistPhotoWrap.onclick = () => displayArtistInView(primaryArtistName);
        }
        if (npvArtistNameText) npvArtistNameText.textContent = primaryArtistName;
        if (npvArtistNameBtn) {
            npvArtistNameBtn.onclick = () => displayArtistInView(primaryArtistName);
        }
        if (npvArtistListeners) {
            npvArtistListeners.textContent = `${artistProfile.listeners} monthly listeners`;
        }
        if (npvArtistFollowBtn) {
            const isFollowing = followedArtists.has(primaryArtistName);
            npvArtistFollowBtn.classList.toggle("is-following", isFollowing);
            npvArtistFollowBtn.textContent = isFollowing ? "Following" : "Follow";
            npvArtistFollowBtn.onclick = (e) => {
                e.stopPropagation();
                toggleFollowArtist(primaryArtistName);
            };
        }

        if (artistBioText) artistBioText.textContent = details.artistBio;
        if (artistSongStoryText) artistSongStoryText.textContent = details.songStory;

        // 7. Credits & Next in Queue Cards
        renderNpvCreditsAndQueue(id);

        if (artistDedicatedPageLink) {
            artistDedicatedPageLink.href = song.pageUrl;
        }

        panelViewMode = "song";
    }

    /* ==========================================================
       10b. Spotify-Style Album View & Artist Profile View
       Renders inside #homeAlbumArtistView without interrupting audio.
       Official Profiles & Socials are placed on the Artist Profile.
       ========================================================== */
    let panelViewMode = "song";
    const homeDashboardView = $("#homeDashboardView");
    const homeSearchView = $("#homeSearchView");
    const homeLibraryView = $("#homeLibraryView");
    const homeLibraryExpansionLayer = $("#homeLibraryExpansionLayer");
    const homeLibraryOriginalParent = homeLibraryView?.parentElement;
    const homeAlbumArtistView = $("#homeAlbumArtistView");
    const activeFilterBanner = $("#activeFilterBanner");
    const activeFilterText = $("#activeFilterText");
    const activeFilterIcon = $("#activeFilterIcon");
    const clearActiveFilterBtn = $("#clearActiveFilterBtn");
    let followedArtists = new Set(JSON.parse(localStorage.getItem("spotifake_followed_artists") || "[]"));
    let savedAlbums = new Set(JSON.parse(localStorage.getItem("spotifake_saved_albums") || "[]"));
    let previousCenterView = "dashboard"; // "dashboard" | "library"
    let libraryOverlayAnimation;

    function restoreCenteredModal() {
        const panel = homeAlbumArtistView?.querySelector(".sp-centered-modal-panel");
        if (!panel) return;
        const overlay = document.getElementById(panel.dataset.modalOverlay);
        panel.classList.remove("sp-centered-modal-panel");
        delete panel.dataset.modalOverlay;
        overlay?.appendChild(panel);
    }

    function resetLibraryOverlay() {
        libraryOverlayAnimation?.cancel();
        libraryOverlayAnimation = null;
        if (homeLibraryView) homeLibraryView.style.width = "";
        $(".main")?.classList.remove("library-overlay-opening", "library-overlay-open", "library-overlay-closing");
        $("#sidebarExpandBtn")?.setAttribute("aria-expanded", "false");
        const expandedSortMenu = $("#homeLibSortMenu");
        if (expandedSortMenu) expandedSortMenu.hidden = true;
        $("#homeLibSortBtn")?.setAttribute("aria-expanded", "false");
        if (homeLibraryView?.parentElement === homeLibraryExpansionLayer) {
            homeLibraryOriginalParent?.appendChild(homeLibraryView);
        }
        if (homeLibraryExpansionLayer) {
            homeLibraryExpansionLayer.hidden = true;
            homeLibraryExpansionLayer.setAttribute("aria-hidden", "true");
        }
    }

    function setNavActive(which) {
        const navHome = $("#navHomeBtn");
        const navLib = $("#navLibraryBtn");
        if (navHome) navHome.classList.toggle("active", which === "home");
        if (navLib) navLib.classList.toggle("active", which === "library");
    }

    function showEntityPageView(keepFullscreen = false, accountView = false) {
        restoreCenteredModal();
        resetLibraryOverlay();
        if (!accountView && document.body.classList.contains("mobile-account-page")) {
            document.body.classList.remove("mobile-account-page");
            if (new URLSearchParams(location.search).get("view") === "account") {
                history.pushState(null, "", "home.html");
            }
        }
        if (!keepFullscreen) {
            exitLyricsFullscreen();
            if (window.innerWidth < 1024) closeArtistPanelDrawer();
        }
        if (homeLibraryView && homeLibraryView.style.display === "block") {
            previousCenterView = "library";
        } else if (homeDashboardView && homeDashboardView.style.display !== "none") {
            previousCenterView = "dashboard";
        }
        if (homeDashboardView) homeDashboardView.style.display = "none";
        if (homeSearchView) homeSearchView.style.display = "none";
        if (homeLibraryView) homeLibraryView.style.display = "none";
        if (homeAlbumArtistView) {
            homeAlbumArtistView.dataset.activeView = "";
            homeAlbumArtistView.style.display = "block";
        }
        syncLyricsPreviewToggleLabel();
        const mainArea = $(".main-right-part");
        if (mainArea) mainArea.scrollTop = 0;
    }

    function showFullLibraryView(e) {
        if (e) e.preventDefault();
        restoreCenteredModal();
        const expandFromSidebar = e?.currentTarget?.id === "sidebarExpandBtn" && window.innerWidth >= 1024;
        if (!expandFromSidebar) resetLibraryOverlay();
        exitLyricsFullscreen();
        if (!homeLibraryView || !homeDashboardView) return;
        homeDashboardView.style.display = "none";
        if (homeSearchView) homeSearchView.style.display = "none";
        if (homeAlbumArtistView) {
            homeAlbumArtistView.dataset.activeView = "";
            homeAlbumArtistView.style.display = "none";
        }
        homeLibraryView.style.display = "block";
        setNavActive("library");
        syncLyricsPreviewToggleLabel();
        if (expandFromSidebar) {
            const selectedTab = $("#homeLibTabs .lib-cat-pill.active");
            const matchingTab = $(`#homeLibTabs .lib-cat-pill[data-tab="${activeSidebarTab}"]`);
            if (matchingTab && matchingTab !== selectedTab) {
                selectedTab?.classList.remove("active");
                selectedTab?.setAttribute("aria-selected", "false");
                matchingTab.classList.add("active");
                matchingTab.setAttribute("aria-selected", "true");
            }
            const sidebarQuery = $("#sidebarLibrarySearch")?.value || "";
            const expandedSearch = $("#homeLibFilterInput");
            if (expandedSearch) expandedSearch.value = sidebarQuery;
        }
        // Widen a sidebar list into its corresponding cover grid, then restore
        // the untouched sidebar mode when the overlay closes.
        const expandedMode = sidebarViewMode === "list" ? "grid"
            : sidebarViewMode === "compact" ? "compact-grid" : sidebarViewMode;
        setHomeLibLayout(expandFromSidebar ? expandedMode : sidebarViewMode);
        syncLibrarySortControls();
        renderHomeLibrary();
        const mainArea = $(".main-right-part");
        if (mainArea) mainArea.scrollTop = 0;
        if (expandFromSidebar) {
            const mainLayout = $(".main");
            if (homeDashboardView) homeDashboardView.style.display = "";
            homeLibraryExpansionLayer?.appendChild(homeLibraryView);
            if (homeLibraryExpansionLayer) {
                homeLibraryExpansionLayer.hidden = false;
                homeLibraryExpansionLayer.setAttribute("aria-hidden", "false");
            }
            mainLayout?.classList.remove("library-overlay-closing");
            mainLayout?.classList.add("library-overlay-opening");
            const expandedSearchBox = $("#homeLibraryView .lib-search-box");
            const sidebarSearchBox = $(".library-panel .lib-search-wrap");
            if (expandedSearchBox && sidebarSearchBox) {
                expandedSearchBox.style.transition = "none";
                const expandedSearchLeft = expandedSearchBox.getBoundingClientRect().left;
                const sidebarSearchLeft = sidebarSearchBox.getBoundingClientRect().left;
                expandedSearchBox.style.setProperty("--library-search-start-x", `${sidebarSearchLeft - expandedSearchLeft}px`);
                expandedSearchBox.getBoundingClientRect();
                expandedSearchBox.style.transition = "";
            }
            $("#sidebarExpandBtn")?.setAttribute("aria-expanded", "true");
            requestAnimationFrame(() => requestAnimationFrame(() => {
                if (mainLayout?.classList.contains("library-overlay-opening")) {
                    mainLayout.classList.add("library-overlay-open");
                }
            }));
        }
    }

    function showHomeDashboardView(e) {
        if (e) e.preventDefault();
        restoreCenteredModal();
        resetLibraryOverlay();
        exitLyricsFullscreen();
        if (!homeLibraryView || !homeDashboardView) return;
        homeLibraryView.style.display = "none";
        if (homeSearchView) homeSearchView.style.display = "none";
        if (homeAlbumArtistView) {
            homeAlbumArtistView.dataset.activeView = "";
            homeAlbumArtistView.style.display = "none";
        }
        homeDashboardView.style.display = "";
        setNavActive("home");
        syncLyricsPreviewToggleLabel();
    }

    function showMobileSearchView(e) {
        if (e) e.preventDefault();
        restoreCenteredModal();
        resetLibraryOverlay();
        exitLyricsFullscreen();
        if (!homeSearchView) return;
        if (homeDashboardView) homeDashboardView.style.display = "none";
        if (homeLibraryView) homeLibraryView.style.display = "none";
        if (homeAlbumArtistView) {
            homeAlbumArtistView.dataset.activeView = "";
            homeAlbumArtistView.style.display = "none";
        }
        homeSearchView.style.display = "block";
        syncLyricsPreviewToggleLabel();
        renderMobileDiscoverRow();
        const mainArea = $(".main-right-part");
        if (mainArea) mainArea.scrollTop = 0;
    }

    function goToHomeUndisturbed(e) {
        if (e) e.preventDefault();
        closeMobileCreateSheet();
        showHomeDashboardView(e);
        if (window.innerWidth < 1024) closeArtistPanelDrawer();
        clearActiveFilter();
        const allPill = $(".filter-pill[data-category='all']");
        if (allPill) allPill.click();
        syncMobileFilterPills("all");
        setActiveMobileNav($("#mobileHomeBtn"));
        window.scrollTo({ top: 0, behavior: "smooth" });
        const mainArea = $(".main-right-part");
        if (mainArea) mainArea.scrollTo({ top: 0, behavior: "smooth" });
    }

    ["#sidebarExpandBtn", "#navLibraryBtn", "#mobileLibraryBtn"].forEach(sel => {
        const el = $(sel);
        if (el) el.addEventListener("click", showFullLibraryView);
    });
    $("#homeLibCollapseBtn")?.addEventListener("click", () => {
        const mainLayout = $(".main");
        if (!mainLayout?.classList.contains("library-overlay-opening") || mainLayout.classList.contains("library-overlay-closing")) return;
        const expandedWidth = homeLibraryExpansionLayer.getBoundingClientRect().width;
        const sidebarWidth = $(".library-panel").getBoundingClientRect().width;
        homeLibraryView.style.width = `${homeLibraryView.getBoundingClientRect().width}px`;
        mainLayout.classList.add("library-overlay-closing");
        let finished = false;
        const finishCollapse = () => {
            if (finished) return;
            finished = true;
            if (mainLayout.classList.contains("library-overlay-closing")) showHomeDashboardView();
        };
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            requestAnimationFrame(finishCollapse);
        } else {
            libraryOverlayAnimation = homeLibraryExpansionLayer.animate([
                { width: `${expandedWidth}px`, opacity: 1, offset: 0 },
                { width: `${expandedWidth + (sidebarWidth - expandedWidth) * 0.65}px`, opacity: 1, offset: 0.65 },
                { width: `${sidebarWidth}px`, opacity: 0, offset: 1 }
            ], {
                duration: 520,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "forwards"
            });
            libraryOverlayAnimation.onfinish = finishCollapse;
        }
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && $(".main")?.classList.contains("library-overlay-open")) {
            $("#homeLibCollapseBtn")?.click();
        }
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth < 1024 && $(".main")?.classList.contains("library-overlay-opening")) {
            resetLibraryOverlay();
            showFullLibraryView();
        }
    });
    $("#navHomeBtn")?.addEventListener("click", goToHomeUndisturbed);
    document.querySelectorAll('a.logo[href="home.html"]').forEach(el => {
        el.addEventListener("click", goToHomeUndisturbed);
    });

    function applySongIdFilter(songIds, label, iconClass) {
        showHomeDashboardView();
        cards.forEach((card, index) => {
            const song = songs[index];
            const visible = song && songIds.includes(song.id);
            card.hidden = !visible;
            card.style.display = visible ? "flex" : "none";
        });
        if (resultCounter) resultCounter.textContent = `Showing ${songIds.length} of ${songs.length} songs`;
        if (searchStatus) searchStatus.hidden = true;
        if (activeFilterBanner) {
            activeFilterBanner.style.display = "flex";
            if (activeFilterText) activeFilterText.textContent = label;
            if (activeFilterIcon) activeFilterIcon.className = iconClass;
        }
    }

    function clearActiveFilter() {
        if (activeFilterBanner) activeFilterBanner.style.display = "none";
        if (searchInput) searchInput.value = "";
        filterMedia();
    }

    if (clearActiveFilterBtn) {
        clearActiveFilterBtn.addEventListener("click", clearActiveFilter);
    }

    /* Build a Spotify-style interactive tracklist table for Album or Artist views */
    function buildSpotifyTracklist(trackList, options = {}) {
        const table = document.createElement("div");
        table.className = "sp-tracklist";

        const header = document.createElement("div");
        header.className = "sp-tracklist-header";
        header.innerHTML = `
            <span>#</span>
            <span>Title</span>
            <span class="sp-track-album-col">${options.thirdColLabel || "Album"}</span>
            <span>Actions</span>
            <span style="text-align:right;"><i class="fa-regular fa-clock"></i></span>
        `;
        table.appendChild(header);

        const currentSong = getCurrentSong();

        trackList.forEach((song, idx) => {
            const row = document.createElement("div");
            const isCurrent = currentSong && currentSong.id === song.id;
            row.className = `sp-track-row${isCurrent ? " is-playing" : ""}`;
            row.dataset.songId = String(song.id);

            const albumObj = findAlbumForSong(song.id);
            const isFav = favorites.has(song.id);
            const dur = TRACK_DURATIONS[song.id] || "3:45";

            row.innerHTML = `
                <div class="sp-track-num">${isCurrent && !audio.paused ? '<i class="fa-solid fa-volume-high"></i>' : idx + 1}</div>
                <div class="sp-track-main">
                    ${options.hideThumb ? "" : `<img src="${song.cover}" alt="${song.title}" class="sp-track-thumb">`}
                    <div class="sp-track-titles">
                        <span class="sp-track-title">${song.title}</span>
                        <div class="sp-track-sub"></div>
                    </div>
                </div>
                <div class="sp-track-album-col"></div>
                <div class="sp-track-actions">
                    <button type="button" class="sp-icon-btn sp-row-fav-btn${isFav ? " is-fav" : ""}" title="${isFav ? "Remove from Liked Songs" : "Save to Liked Songs"}">
                        <i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>
                    <button type="button" class="sp-icon-btn sp-row-add-btn" title="Add to Playlist">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                    <button type="button" class="sp-icon-btn sp-row-queue-btn" title="Add to queue">
                        <i class="fa-solid fa-bars-staggered"></i>
                    </button>
                </div>
                <div class="sp-track-duration">${dur}</div>
            `;

            // Artist links inside subtitle
            const subWrap = row.querySelector(".sp-track-sub");
            const artistNames = splitArtists(song.artist);
            artistNames.forEach((aName, aIdx) => {
                const aBtn = document.createElement("button");
                aBtn.type = "button";
                aBtn.className = "sp-inline-link";
                aBtn.textContent = aName;
                aBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    displayArtistInView(aName);
                });
                subWrap.appendChild(aBtn);
                if (aIdx < artistNames.length - 1) {
                    subWrap.appendChild(document.createTextNode(", "));
                }
            });

            // Album column clickable link
            const albCol = row.querySelector(".sp-track-album-col");
            if (albCol && albumObj) {
                const albBtn = document.createElement("button");
                albBtn.type = "button";
                albBtn.className = "sp-inline-link";
                albBtn.textContent = albumObj.title;
                albBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    displayAlbumInView(albumObj);
                });
                albCol.appendChild(albBtn);
            }

            // Like button
            const favBtn = row.querySelector(".sp-row-fav-btn");
            favBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleFavorite(song.id, e);
                const nowFav = favorites.has(song.id);
                favBtn.classList.toggle("is-fav", nowFav);
                favBtn.innerHTML = `<i class="${nowFav ? "fa-solid" : "fa-regular"} fa-heart"></i>`;
            });

            // Add to playlist button
            const addBtn = row.querySelector(".sp-row-add-btn");
            addBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                openAddToPlaylistModal(song.id);
            });

            // Add to queue button
            const queueRowBtn = row.querySelector(".sp-row-queue-btn");
            queueRowBtn?.addEventListener("click", (e) => {
                e.stopPropagation();
                if (queueCtrl) queueCtrl.addToQueue(song.id);
            });

            // Row click plays the song immediately
            row.addEventListener("click", () => {
                if (queueCtrl && options.contextLabel && Array.isArray(options.contextSongs)) {
                    queueCtrl.setContext(options.contextLabel, options.contextSongs.map(s => s.id), song.id);
                }
                const sIdx = songs.findIndex(s => s.id === song.id);
                if (sIdx !== -1) {
                    loadTrack(sIdx, true);
                    syncEntityViewPlayingState();
                }
            });

            table.appendChild(row);
        });

        return table;
    }

    function syncEntityViewPlayingState() {
        if (!homeAlbumArtistView || homeAlbumArtistView.style.display === "none") return;
        const currentSong = getCurrentSong();
        const rows = homeAlbumArtistView.querySelectorAll(".sp-track-row");
        rows.forEach((row, idx) => {
            const rowSongId = Number(row.dataset.songId);
            const isCurrent = currentSong && currentSong.id === rowSongId;
            row.classList.toggle("is-playing", isCurrent);
            const numCell = row.querySelector(".sp-track-num");
            if (numCell) {
                numCell.innerHTML = isCurrent && !audio.paused
                    ? '<i class="fa-solid fa-volume-high"></i>'
                    : String(idx + 1);
            }
        });
    }

    /* ==========================================================
       SPOTIFY-STYLE ARTIST PROFILE VIEW
       Includes Hero PFP, Verified Badge, Play/Follow,
       Official Profiles & Socials (Instagram, Facebook, Spotify),
       Popular Tracks, Discography Albums, and About Card.
       ========================================================== */
    /* Share Artist Info Modal & Clipboard/Web-Share helper */
    function shareArtistInfo(artistName) {
        const profile = ARTIST_PROFILES[artistName];
        if (!profile) return;
        const artistSongs = getSongsByArtist(artistName);
        const shareText = [
            `🎤 Artist: ${artistName} (Verified Artist)`,
            `🎵 Genre: ${profile.genre}`,
            `🎧 Monthly Listeners: ${profile.listeners || "35,000,000"}`,
            `📖 About: ${profile.bio}`,
            `🔥 Notable Hits: ${profile.notable.join(", ")}`,
            `📀 In Collection: ${artistSongs.map(s => `"${s.title}"`).join(", ")}`,
            `🔗 Spotify Profile: ${profile.links.spotify}`,
            `📸 Instagram: ${profile.links.instagram}`,
            `📘 Facebook: ${profile.links.facebook}`
        ].join("\n");

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText).catch(() => {});
        }

        const existing = document.getElementById("shareArtistModal");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.id = "shareArtistModal";
        modal.className = "modal-backdrop";
        modal.style.cssText = "display:flex;position:fixed;inset:0;background:rgba(0,0,0,0.78);justify-content:center;align-items:center;z-index:2500;padding:16px;";
        modal.innerHTML = `
            <div style="background:#0e0e18;border:2px solid var(--neon-yellow);border-radius:14px;padding:22px;max-width:440px;width:100%;color:#fff;font-family:Montserrat,sans-serif;box-shadow:0 12px 36px rgba(0,0,0,0.7);">
                <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
                    <img src="${profile.pfp}" alt="${artistName}" style="width:58px;height:58px;border-radius:50%;object-fit:cover;border:2px solid var(--neon-yellow);">
                    <div>
                        <h3 style="margin:0;color:var(--neon-yellow);font-size:18px;font-weight:900;"><i class="fa-solid fa-share-nodes"></i> Share ${artistName}</h3>
                        <p style="margin:2px 0 0 0;font-size:12px;color:#aaa;">${profile.genre} • ${profile.listeners} monthly listeners</p>
                    </div>
                </div>
                <textarea id="shareArtistTextarea" readonly style="width:100%;height:145px;background:#151524;border:1px solid rgba(255,255,255,0.16);border-radius:8px;color:#e6e6f0;padding:10px;font-size:12px;line-height:1.5;resize:none;font-family:inherit;">${shareText}</textarea>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;justify-content:flex-end;">
                    <button type="button" id="copyArtistShareBtn" class="sp-primary-action-btn" style="padding:8px 16px;font-size:12px;">
                        <i class="fa-solid fa-copy"></i> Copy Artist Info
                    </button>
                    <a href="${profile.links.spotify}" target="_blank" rel="noopener noreferrer" class="sp-secondary-btn" style="text-decoration:none;padding:8px 14px;font-size:12px;">
                        <i class="fa-brands fa-spotify"></i> Open Spotify
                    </a>
                    <button type="button" id="closeArtistShareBtn" class="sp-secondary-btn" style="padding:8px 14px;font-size:12px;">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        showToast(`Copied ${artistName}'s info to clipboard!`);

        modal.querySelector("#copyArtistShareBtn")?.addEventListener("click", () => {
            const ta = modal.querySelector("#shareArtistTextarea");
            if (ta) {
                ta.select();
                document.execCommand("copy");
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareText).catch(() => {});
            }
            showToast(`Copied ${artistName}'s artist info!`);
        });
        modal.querySelector("#closeArtistShareBtn")?.addEventListener("click", () => modal.remove());
        modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
    }

    function displayArtistInView(artistName) {
        const profile = ARTIST_PROFILES[artistName];
        const artistSongs = getSongsByArtist(artistName);
        if (!profile || !homeAlbumArtistView) return;

        showEntityPageView();
        homeAlbumArtistView.replaceChildren();

        const isFollowing = followedArtists.has(artistName);
        const artistAlbums = getAlbumsForArtist(artistName);

        // Back bar
        const backBar = document.createElement("div");
        backBar.className = "sp-back-bar";
        backBar.innerHTML = `
            <button type="button" class="sp-back-btn" id="spBackHomeBtn">
                <i class="fa-solid fa-arrow-left"></i> Back to Home
            </button>
            ${previousCenterView === "library" ? `
            <button type="button" class="sp-back-btn" id="spBackLibBtn">
                <i class="fa-solid fa-lines-leaning"></i> Back to Library
            </button>` : ""}
        `;
        homeAlbumArtistView.appendChild(backBar);
        backBar.querySelector("#spBackHomeBtn")?.addEventListener("click", showHomeDashboardView);
        backBar.querySelector("#spBackLibBtn")?.addEventListener("click", showFullLibraryView);

        // Artist Hero Header
        const hero = document.createElement("section");
        hero.className = "sp-hero";
        hero.innerHTML = `
            <img src="${profile.pfp}" alt="${artistName}" class="sp-hero-cover is-artist-avatar">
            <div class="sp-hero-info">
                <span class="sp-verified-badge"><i class="fa-solid fa-circle-check"></i> Verified Artist</span>
                <h1 class="sp-hero-title">${artistName}</h1>
                <div class="sp-hero-meta">
                    <span>${profile.listeners || "35,000,000"} monthly listeners</span>
                    <span>•</span>
                    <span>${profile.genre}</span>
                    <span>•</span>
                    <span>${artistSongs.length} song${artistSongs.length !== 1 ? "s" : ""} in your library</span>
                </div>
            </div>
        `;
        homeAlbumArtistView.appendChild(hero);

        // Action Bar — only the Follow button
        const actionBar = document.createElement("div");
        actionBar.className = "sp-action-bar";
        actionBar.innerHTML = `
            <button type="button" class="sp-secondary-btn${isFollowing ? " is-active" : ""}" id="spArtistFollowBtn">
                <i class="fa-solid ${isFollowing ? "fa-check" : "fa-user-plus"}"></i>
                <span>${isFollowing ? "Following" : "Follow"}</span>
            </button>
        `;
        homeAlbumArtistView.appendChild(actionBar);

        const followBtn = actionBar.querySelector("#spArtistFollowBtn");
        followBtn.addEventListener("click", () => {
            if (followedArtists.has(artistName)) {
                followedArtists.delete(artistName);
                showToast(`Unfollowed ${artistName}`);
            } else {
                followedArtists.add(artistName);
                showToast(`Following ${artistName}`);
            }
            localStorage.setItem("spotifake_followed_artists", JSON.stringify([...followedArtists]));
            const nowFollowing = followedArtists.has(artistName);
            followBtn.classList.toggle("is-active", nowFollowing);
            followBtn.innerHTML = `<i class="fa-solid ${nowFollowing ? "fa-check" : "fa-user-plus"}"></i><span>${nowFollowing ? "Following" : "Follow"}</span>`;
        });

        // Official Profiles & Socials Section (exclusively on Artist Profile)
        const socialsCard = document.createElement("section");
        socialsCard.className = "sp-profile-socials-card";
        socialsCard.innerHTML = `
            <h3 class="sp-section-heading" style="margin:0;"><i class="fa-solid fa-share-nodes"></i> Official Profiles &amp; Socials</h3>
            <p style="font-size:12px;color:var(--text-muted);margin:4px 0 0 0;">Visit ${artistName}'s verified social media and artist pages (opens in a new tab):</p>
            <div class="sp-profile-socials-grid">
                <a href="${profile.links.instagram}" target="_blank" rel="noopener noreferrer" class="sp-social-link-card instagram">
                    <i class="fa-brands fa-instagram platform-icon"></i>
                    <div class="social-meta">
                        <span class="social-platform-name">Instagram</span>
                        <span class="social-handle">${(profile.handles && profile.handles.instagram) || "@" + artistName.toLowerCase().replace(/\s+/g, "")}</span>
                    </div>
                    <i class="fa-solid fa-arrow-up-right-from-square" style="margin-left:auto;font-size:12px;opacity:0.75;"></i>
                </a>
                <a href="${profile.links.facebook}" target="_blank" rel="noopener noreferrer" class="sp-social-link-card facebook">
                    <i class="fa-brands fa-facebook platform-icon"></i>
                    <div class="social-meta">
                        <span class="social-platform-name">Facebook</span>
                        <span class="social-handle">${(profile.handles && profile.handles.facebook) || artistName}</span>
                    </div>
                    <i class="fa-solid fa-arrow-up-right-from-square" style="margin-left:auto;font-size:12px;opacity:0.75;"></i>
                </a>
                <a href="${profile.links.spotify}" target="_blank" rel="noopener noreferrer" class="sp-social-link-card spotify">
                    <i class="fa-brands fa-spotify platform-icon"></i>
                    <div class="social-meta">
                        <span class="social-platform-name">Spotify Artist Profile</span>
                        <span class="social-handle">${(profile.handles && profile.handles.spotify) || "Verified Artist Page"}</span>
                    </div>
                    <i class="fa-solid fa-arrow-up-right-from-square" style="margin-left:auto;font-size:12px;opacity:0.75;"></i>
                </a>
            </div>
        `;
        homeAlbumArtistView.appendChild(socialsCard);

        // Popular Tracks Section
        const popHeading = document.createElement("h2");
        popHeading.className = "sp-section-heading";
        popHeading.innerHTML = `<i class="fa-solid fa-fire"></i> Popular Tracks`;
        homeAlbumArtistView.appendChild(popHeading);

        homeAlbumArtistView.appendChild(buildSpotifyTracklist(artistSongs, { thirdColLabel: "Album", contextLabel: artistName, contextSongs: artistSongs }));

        // Discography / Albums Section
        if (artistAlbums.length > 0) {
            const discHeading = document.createElement("h2");
            discHeading.className = "sp-section-heading";
            discHeading.innerHTML = `<i class="fa-solid fa-compact-disc"></i> Discography &amp; Albums`;
            homeAlbumArtistView.appendChild(discHeading);

            const discGrid = document.createElement("div");
            discGrid.className = "sp-discography-grid";
            artistAlbums.forEach(alb => {
                const card = document.createElement("article");
                card.className = "sp-Entity-card";
                card.innerHTML = `
                    <img src="${alb.cover}" alt="${alb.title}">
                    <h4>${alb.title}</h4>
                    <p>${alb.year || "2024"} • Album</p>
                `;
                card.addEventListener("click", () => displayAlbumInView(alb));
                discGrid.appendChild(card);
            });
            homeAlbumArtistView.appendChild(discGrid);
        }

        // About the Artist Section
        const aboutHeading = document.createElement("h2");
        aboutHeading.className = "sp-section-heading";
        aboutHeading.innerHTML = `<i class="fa-solid fa-user-astronaut"></i> About ${artistName}`;
        homeAlbumArtistView.appendChild(aboutHeading);

        const aboutCard = document.createElement("div");
        aboutCard.className = "sp-artist-about-card";
        aboutCard.innerHTML = `
            <img src="${profile.pfp}" alt="${artistName}">
            <div>
                <h3 style="margin:0 0 6px 0;color:#fff;font-size:18px;font-weight:900;">${artistName}</h3>
                <p style="margin:0 0 10px 0;color:#d0d0e0;font-size:13px;line-height:1.6;">${profile.bio}</p>
                <div style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.6px;">Notable Career Hits</div>
                <div class="sp-notable-pills">
                    ${profile.notable.map(n => `<span class="sp-notable-pill">${n}</span>`).join("")}
                </div>
            </div>
        `;
        homeAlbumArtistView.appendChild(aboutCard);
    }

    /* ==========================================================
       SPOTIFY-STYLE ALBUM VIEW
       Functions like a real Spotify album page:
       Album Hero Cover, clickable Artist PFP chip, Release Year,
       Play Album, Shuffle Album, Save Album, numbered Tracklist,
       and "More by [Artist]" section.
       ========================================================== */
    function displayAlbumInView(album) {
        if (!album || !homeAlbumArtistView) return;
        const songIds = Array.isArray(album.songIds) ? album.songIds : (Array.isArray(album.songs) ? album.songs : []);
        const albumSongs = songs.filter(s => songIds.includes(s.id));

        showEntityPageView();
        homeAlbumArtistView.replaceChildren();

        const artistProfile = ARTIST_PROFILES[album.artistName];
        const isSaved = savedAlbums.has(album.id);

        // Back bar
        const backBar = document.createElement("div");
        backBar.className = "sp-back-bar";
        backBar.innerHTML = `
            <button type="button" class="sp-back-btn" id="spAlbumBackHomeBtn">
                <i class="fa-solid fa-arrow-left"></i> Back to Home
            </button>
            ${previousCenterView === "library" ? `
            <button type="button" class="sp-back-btn" id="spAlbumBackLibBtn">
                <i class="fa-solid fa-lines-leaning"></i> Back to Library
            </button>` : ""}
        `;
        homeAlbumArtistView.appendChild(backBar);
        backBar.querySelector("#spAlbumBackHomeBtn")?.addEventListener("click", showHomeDashboardView);
        backBar.querySelector("#spAlbumBackLibBtn")?.addEventListener("click", showFullLibraryView);

        const fullTracks = Array.isArray(album.fullTracklist) && album.fullTracklist.length > 0
            ? album.fullTracklist
            : albumSongs.map((s, i) => ({
                num: i + 1,
                title: s.title,
                artists: splitArtists(s.artist),
                duration: TRACK_DURATIONS[s.id] || "3:45",
                songId: s.id
            }));

        // Album Hero Header
        const hero = document.createElement("section");
        hero.className = "sp-hero sp-album-hero";
        hero.innerHTML = `
            <img src="${album.cover}" alt="${album.title}" class="sp-hero-cover">
            <div class="sp-hero-info">
                <span class="sp-verified-badge"><i class="fa-solid fa-compact-disc"></i> Album</span>
                <h1 class="sp-hero-title">${album.title}</h1>
                <div class="sp-hero-meta">
                    <button type="button" class="sp-meta-artist-chip" id="spAlbumArtistChip" title="View ${album.artistName}'s Profile">
                        <img src="${artistProfile ? artistProfile.pfp : album.cover}" alt="${album.artistName}">
                        <span>${album.artistName}</span>
                    </button>
                    <span>•</span>
                    <span>${album.year || "2024"}</span>
                    <span>•</span>
                    <span>${fullTracks.length} songs</span>
                </div>
            </div>
        `;
        homeAlbumArtistView.appendChild(hero);

        hero.querySelector("#spAlbumArtistChip")?.addEventListener("click", () => {
            displayArtistInView(album.artistName);
        });

        // Album Action Bar (Play Album, Shuffle Album, Save Album to Library)
        const actionBar = document.createElement("div");
        actionBar.className = "sp-action-bar sp-album-action-bar";
        actionBar.innerHTML = `
            <button type="button" class="sp-big-play-btn" id="spAlbumPlayBtn" title="Play ${album.title}">
                <i class="fa-solid fa-play"></i>
            </button>
            <button type="button" class="sp-secondary-btn" id="spAlbumShuffleBtn" title="Shuffle album" aria-label="Shuffle album">
                <i class="fa-solid fa-shuffle" aria-hidden="true"></i><span>Shuffle Album</span>
            </button>
            <button type="button" class="sp-secondary-btn${isSaved ? " is-active" : ""}" id="spAlbumSaveBtn" title="${isSaved ? "Remove album from library" : "Save album to library"}" aria-label="${isSaved ? "Remove album from library" : "Save album to library"}" aria-pressed="${isSaved}">
                <i class="${isSaved ? "fa-solid" : "fa-regular"} fa-heart" aria-hidden="true"></i>
                <span>${isSaved ? "Saved in Library" : "Save Album"}</span>
            </button>
            <button type="button" class="sp-secondary-btn" id="spAlbumOpenArtistBtn" title="View artist profile" aria-label="View artist profile">
                <i class="fa-solid fa-user" aria-hidden="true"></i><span>View Artist Profile</span>
            </button>
            ${album.isCustomAlbum ? `
            <button type="button" class="sp-secondary-btn" id="spAlbumDeleteBtn" title="Delete album" aria-label="Delete album" style="border-color:rgba(229,62,62,0.55);color:#f87171;">
                <i class="fa-solid fa-trash-can" aria-hidden="true"></i><span>Delete Album</span>
            </button>` : ""}
        `;
        homeAlbumArtistView.appendChild(actionBar);

        actionBar.querySelector("#spAlbumPlayBtn").addEventListener("click", () => {
            if (albumSongs.length === 0) {
                showToast(`"${album.title}" has no tracks yet!`);
                return;
            }
            if (queueCtrl) queueCtrl.setContext(album.title, albumSongs.map(s => s.id), albumSongs[0].id);
            const sIdx = songs.findIndex(s => s.id === albumSongs[0].id);
            if (sIdx !== -1) {
                loadTrack(sIdx, true);
                syncEntityViewPlayingState();
            }
        });

        actionBar.querySelector("#spAlbumShuffleBtn").addEventListener("click", () => {
            if (albumSongs.length === 0) {
                showToast(`"${album.title}" has no tracks yet!`);
                return;
            }
            const pick = albumSongs[Math.floor(Math.random() * albumSongs.length)];
            if (queueCtrl) queueCtrl.setContext(album.title, albumSongs.map(s => s.id), pick.id);
            setShuffleModeState(true, true);
            const sIdx = songs.findIndex(s => s.id === pick.id);
            if (sIdx !== -1) {
                loadTrack(sIdx, true);
                syncEntityViewPlayingState();
                showToast(`Shuffling ${album.title}`);
            }
        });

        actionBar.querySelector("#spAlbumDeleteBtn")?.addEventListener("click", () => {
            if (window.AlbumManager) {
                window.AlbumManager.delete(album.id);
                setupSidebarSongs();
                showFullLibraryView();
                $("#homeLibTabs .lib-cat-pill[data-tab='albums']")?.click();
                showToast(`Deleted album "${album.title}"`);
            }
        });

        const saveBtn = actionBar.querySelector("#spAlbumSaveBtn");
        saveBtn.addEventListener("click", () => {
            if (savedAlbums.has(album.id)) {
                savedAlbums.delete(album.id);
                showToast(`Removed "${album.title}" from Saved Albums`);
            } else {
                savedAlbums.add(album.id);
                showToast(`Saved "${album.title}" to your Library`);
            }
            localStorage.setItem("spotifake_saved_albums", JSON.stringify([...savedAlbums]));
            const nowSaved = savedAlbums.has(album.id);
            saveBtn.classList.toggle("is-active", nowSaved);
            saveBtn.setAttribute("aria-pressed", String(nowSaved));
            saveBtn.setAttribute("aria-label", nowSaved ? "Remove album from library" : "Save album to library");
            saveBtn.title = nowSaved ? "Remove album from library" : "Save album to library";
            saveBtn.innerHTML = `<i class="${nowSaved ? "fa-solid" : "fa-regular"} fa-heart" aria-hidden="true"></i><span>${nowSaved ? "Saved in Library" : "Save Album"}</span>`;
        });

        actionBar.querySelector("#spAlbumOpenArtistBtn").addEventListener("click", () => {
            displayArtistInView(album.artistName);
        });

        const albumSpotifyUrl = window.AlbumManager ? window.AlbumManager.getSpotifyUrl(album) : "";
        const spotifyBox = window.AlbumManager ? window.AlbumManager.createSpotifyAlbumBox(album) : null;
        if (spotifyBox) {
            homeAlbumArtistView.appendChild(spotifyBox);
        }

        // Build Full Spotify-style Multi-Track Album Tracklist Table
        const albumTable = document.createElement("div");
        albumTable.className = "sp-tracklist sp-album-tracklist";
        albumTable.innerHTML = `
            <div class="sp-tracklist-header">
                <span>#</span>
                <span>Title</span>
                <span class="sp-track-album-col">Album</span>
                <span>Actions</span>
                <span style="text-align:right;"><i class="fa-regular fa-clock"></i></span>
            </div>
        `;

        const currentSong = getCurrentSong();
        if (fullTracks.length === 0) {
            const emptyRow = document.createElement("div");
            emptyRow.style.cssText = "padding:24px;text-align:center;color:var(--text-muted);font-size:13px;";
            emptyRow.textContent = "No tracks added to this album yet.";
            albumTable.appendChild(emptyRow);
        }
        fullTracks.forEach((tr, idx) => {
            const isSpotifyOnly = !tr.songId;
            const mappedSongId = tr.songId || null;
            const isCurrent = !isSpotifyOnly && currentSong && currentSong.id === mappedSongId;
            const isFav = !isSpotifyOnly && favorites.has(mappedSongId);

            const row = document.createElement("div");
            row.className = `sp-track-row${isCurrent ? " is-playing" : ""}${isSpotifyOnly ? " is-spotify-only" : ""}`;
            if (tr.songId) row.dataset.songId = String(tr.songId);

            row.innerHTML = `
                <div class="sp-track-num">${isCurrent && !audio.paused ? '<i class="fa-solid fa-volume-high"></i>' : (tr.num || idx + 1)}</div>
                <div class="sp-track-main">
                    <div class="sp-track-titles">
                        <div class="sp-track-title-line">
                            <span class="sp-track-title">${tr.title}</span>
                        </div>
                        <div class="sp-track-sub"></div>
                    </div>
                </div>
                <div class="sp-track-album-col">${album.title}</div>
                <div class="sp-track-actions">
                    ${isSpotifyOnly ? "" : `
                    <button type="button" class="sp-icon-btn sp-row-fav-btn${isFav ? " is-fav" : ""}" title="${isFav ? "Remove from Liked Songs" : "Save to Liked Songs"}">
                        <i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>
                    <button type="button" class="sp-icon-btn sp-row-add-btn" title="Add to Playlist">
                        <i class="fa-solid fa-plus"></i>
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
            }

            const subWrap = row.querySelector(".sp-track-sub");
            (tr.artists || [album.artistName]).forEach((aName, aIdx, arr) => {
                const aBtn = document.createElement("button");
                aBtn.type = "button";
                aBtn.className = "sp-inline-link";
                aBtn.textContent = aName;
                aBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (ARTIST_PROFILES[aName]) displayArtistInView(aName);
                });
                subWrap.appendChild(aBtn);
                if (aIdx < arr.length - 1) subWrap.appendChild(document.createTextNode(", "));
            });

            if (!isSpotifyOnly) {
                row.querySelector(".sp-row-fav-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    toggleFavorite(mappedSongId, e);
                    const nowFav = favorites.has(mappedSongId);
                    const favBtn = row.querySelector(".sp-row-fav-btn");
                    if (favBtn) {
                        favBtn.classList.toggle("is-fav", nowFav);
                        favBtn.innerHTML = `<i class="${nowFav ? "fa-solid" : "fa-regular"} fa-heart"></i>`;
                    }
                });

                row.querySelector(".sp-row-add-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    openAddToPlaylistModal(mappedSongId);
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
                    showToast(`"${tr.title}" is available only in Spotify — opening album on Spotify`);
                    return;
                }
                if (queueCtrl) queueCtrl.setContext(album.title, albumSongs.map(s => s.id), tr.songId);
                const targetIdx = songs.findIndex(s => s.id === tr.songId);
                if (targetIdx !== -1) {
                    loadTrack(targetIdx, true);
                    syncEntityViewPlayingState();
                }
            });

            albumTable.appendChild(row);
        });

        homeAlbumArtistView.appendChild(albumTable);

        // Release Footer Metadata
        const metaFoot = document.createElement("div");
        metaFoot.style.cssText = "margin-top:16px;font-size:11px;color:var(--text-muted);line-height:1.6;";
        metaFoot.innerHTML = `
            <div>Released ${album.year || "2024"} • ${album.label || "Spotifake Records"}</div>
            <div>℗ ${album.year || "2024"} ${album.artistName}. All rights reserved.</div>
        `;
        homeAlbumArtistView.appendChild(metaFoot);

        // More by this Artist section
        const moreAlbums = getAlbumsForArtist(album.artistName).filter(a => a.id !== album.id);
        if (moreAlbums.length > 0) {
            const moreHeading = document.createElement("h2");
            moreHeading.className = "sp-section-heading";
            moreHeading.innerHTML = `<i class="fa-solid fa-compact-disc"></i> More by ${album.artistName}`;
            homeAlbumArtistView.appendChild(moreHeading);

            const moreGrid = document.createElement("div");
            moreGrid.className = "sp-discography-grid";
            moreAlbums.forEach(alb => {
                const card = document.createElement("article");
                card.className = "sp-Entity-card";
                card.innerHTML = `
                    <img src="${alb.cover}" alt="${alb.title}">
                    <h4>${alb.title}</h4>
                    <p>${alb.year || "2024"} • Album</p>
                `;
                card.addEventListener("click", () => displayAlbumInView(alb));
                moreGrid.appendChild(card);
            });
            homeAlbumArtistView.appendChild(moreGrid);
        }
    }

    /* ==========================================================
       SPOTIFY-STYLE PLAYLIST VIEW & PLAYLIST MODALS
       Supports custom playlists (with uploaded or default profile)
       and Liked Songs, in both the Library view and Left Sidebar.
       ========================================================== */
    let currentOpenPlaylistId = null;
    let pendingHomeDeletePlaylistId = null;
    let editingHomePlaylistId = null;
    let managingHomePlaylistId = null;

    function getCustomPlaylistsFromStorage() {
        return JSON.parse(localStorage.getItem("spotifake_custom_playlists") || "[]");
    }

    function getCustomAlbumsFromStorage() {
        return window.AlbumManager ? window.AlbumManager.load() : [];
    }

    function getAllAlbums() {
        return [...getCustomAlbumsFromStorage(), ...SIDEBAR_DATA.albums];
    }

    function saveCustomPlaylistsToStorage(list) {
        localStorage.setItem("spotifake_custom_playlists", JSON.stringify(list));
    }

    function refreshAllPlaylistViews() {
        setupSidebarSongs();
        renderMobileQuickPicks();
        if (homeLibraryView && homeLibraryView.style.display === "block") {
            renderHomeLibrary();
        }
        if (currentOpenPlaylistId && homeAlbumArtistView && homeAlbumArtistView.style.display === "block") {
            displayPlaylistInView(currentOpenPlaylistId);
        }
    }

    function renderMobileQuickPicks() {
        const grid = $("#mobileQuickPicksGrid");
        if (!grid) return;
        grid.replaceChildren();

        const currentSong = getCurrentSong();
        const customPls = getCustomPlaylistsFromStorage();
        const allAlbums = getAllAlbums();

        const tiles = [
            { kind: "liked", title: "Liked Songs" },
            ...customPls.slice(0, 3).map(pl => ({ kind: "playlist", id: pl.id, title: pl.title, cover: pl.cover }))
        ];

        for (const alb of allAlbums) {
            if (tiles.length >= 6) break;
            tiles.push({ kind: "album", album: alb, title: alb.title, cover: alb.cover });
        }

        tiles.forEach(item => {
            const btn = document.createElement("button");
            btn.type = "button";
            const isNowPlaying = item.kind === "album" && currentSong && Array.isArray(item.album.songIds) && item.album.songIds.includes(currentSong.id);
            btn.className = `sp-quick-pick-tile${isNowPlaying ? " is-playing" : ""}`;

            if (item.kind === "liked") {
                btn.innerHTML = `<span class="sp-quick-pick-thumb liked-grad"><i class="fa-solid fa-heart"></i></span><span class="sp-quick-pick-title">${item.title}</span>`;
                btn.addEventListener("click", () => {
                    displayPlaylistInView("liked");
                    setActiveMobileNav?.($("#mobileFavBtn"));
                });
            } else if (item.kind === "playlist") {
                const thumbHtml = item.cover
                    ? `<img src="${item.cover}" alt="${item.title}" class="sp-quick-pick-thumb">`
                    : `<span class="sp-quick-pick-thumb pl-grad"><i class="fa-solid fa-music"></i></span>`;
                btn.innerHTML = `${thumbHtml}<span class="sp-quick-pick-title">${item.title}</span>`;
                btn.addEventListener("click", () => displayPlaylistInView(item.id));
            } else {
                btn.innerHTML = `<img src="${item.cover}" alt="${item.title}" class="sp-quick-pick-thumb"><span class="sp-quick-pick-title">${item.title}</span>`;
                btn.addEventListener("click", () => displayAlbumInView(item.album));
            }
            grid.appendChild(btn);
        });
    }

    function displayPlaylistInView(playlistId) {
        if (!homeAlbumArtistView) return;
        currentOpenPlaylistId = playlistId;

        const isLikedPl = playlistId === "liked";
        const customPls = getCustomPlaylistsFromStorage();
        const pl = isLikedPl
            ? {
                id: "liked",
                title: "Liked Songs",
                desc: "All the tracks you have hearted across Spotifake.",
                cover: null,
                isLiked: true,
                songs: [...favorites]
            }
            : customPls.find(p => p.id === playlistId);

        if (!pl) return;

        showEntityPageView();
        homeAlbumArtistView.replaceChildren();

        const plSongs = (pl.songs || [])
            .map(id => songs.find(s => Number(s.id) === Number(id)))
            .filter(Boolean);

        // Back bar
        const backBar = document.createElement("div");
        backBar.className = "sp-back-bar";
        backBar.innerHTML = `
            <button type="button" class="sp-back-btn" id="spPlBackHomeBtn">
                <i class="fa-solid fa-arrow-left"></i> Back to Home
            </button>
            <button type="button" class="sp-back-btn" id="spPlBackLibBtn">
                <i class="fa-solid fa-lines-leaning"></i> Your Library
            </button>
        `;
        homeAlbumArtistView.appendChild(backBar);
        backBar.querySelector("#spPlBackHomeBtn")?.addEventListener("click", () => {
            currentOpenPlaylistId = null;
            showHomeDashboardView();
        });
        backBar.querySelector("#spPlBackLibBtn")?.addEventListener("click", () => {
            currentOpenPlaylistId = null;
            showFullLibraryView();
        });

        // Playlist Hero Header (Uploaded profile picture OR default gradient profile)
        const hero = document.createElement("section");
        hero.className = "sp-hero";
        const coverHtml = isLikedPl
            ? `<div class="sp-hero-cover" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#FF007F,#7928CA);font-size:64px;color:#fff;"><i class="fa-solid fa-heart"></i></div>`
            : pl.cover
                ? `<img src="${pl.cover}" alt="${pl.title}" class="sp-hero-cover" id="spPlHeroCover" title="Click to change playlist profile picture" style="cursor:pointer;">`
                : `<div class="sp-hero-cover" id="spPlHeroCover" title="Click to add a playlist profile picture" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#450af5,#8e8ee5);font-size:54px;color:#fff;cursor:pointer;">
                       <i class="fa-solid fa-music"></i>
                       <span style="font-size:11px;font-weight:800;letter-spacing:0.4px;opacity:0.9;">DEFAULT PROFILE</span>
                   </div>`;

        hero.innerHTML = `
            ${coverHtml}
            <div class="sp-hero-info">
                <span class="sp-verified-badge"><i class="fa-solid ${isLikedPl ? "fa-heart" : "fa-list-music fa-music"}"></i> ${isLikedPl ? "Pinned Playlist" : "Custom Playlist"}</span>
                <h1 class="sp-hero-title">${pl.title}</h1>
                <p style="margin:2px 0 4px 0;font-size:13px;color:#d0d0e0;max-width:620px;">${pl.desc || "Custom user playlist"}</p>
                <div class="sp-hero-meta">
                    <span style="color:var(--neon-yellow);font-weight:800;">${getSavedDisplayName()}</span>
                    <span>•</span>
                    <span>${plSongs.length} song${plSongs.length !== 1 ? "s" : ""}</span>
                </div>
            </div>
        `;
        homeAlbumArtistView.appendChild(hero);

        if (!isLikedPl) {
            hero.querySelector("#spPlHeroCover")?.addEventListener("click", () => openHomeEditPlaylistModal(pl.id));
        }

        // Action Bar
        const actionBar = document.createElement("div");
        actionBar.className = "sp-action-bar";
        actionBar.innerHTML = `
            <button type="button" class="sp-big-play-btn" id="spPlPlayBtn" title="Play ${pl.title}">
                <i class="fa-solid fa-play"></i>
            </button>
            <button type="button" class="sp-secondary-btn" id="spPlShuffleBtn">
                <i class="fa-solid fa-shuffle"></i> Shuffle
            </button>
            ${!isLikedPl ? `
                <button type="button" class="sp-primary-action-btn" id="spPlAddSongsBtn">
                    <i class="fa-solid fa-plus"></i> Add / Manage Songs
                </button>
                <button type="button" class="sp-secondary-btn" id="spPlEditProfileBtn">
                    <i class="fa-solid fa-pen-to-square"></i> Edit Profile &amp; Photo
                </button>
                <button type="button" class="sp-secondary-btn" id="spPlDeleteBtn" style="border-color:rgba(255,51,102,0.5);color:#ff4d6d;">
                    <i class="fa-solid fa-trash-can"></i> Delete
                </button>
            ` : ""}
        `;
        homeAlbumArtistView.appendChild(actionBar);

        actionBar.querySelector("#spPlPlayBtn")?.addEventListener("click", () => {
            if (plSongs.length === 0) {
                showToast(`"${pl.title}" has no songs yet — click "+ Add / Manage Songs" to add tracks!`);
                return;
            }
            if (queueCtrl) queueCtrl.setContext(pl.title, plSongs.map(s => s.id), plSongs[0].id);
            const sIdx = songs.findIndex(s => s.id === plSongs[0].id);
            if (sIdx !== -1) {
                loadTrack(sIdx, true);
                syncEntityViewPlayingState();
            }
        });

        actionBar.querySelector("#spPlShuffleBtn")?.addEventListener("click", () => {
            if (plSongs.length === 0) {
                showToast(`"${pl.title}" has no songs yet!`);
                return;
            }
            const pick = plSongs[Math.floor(Math.random() * plSongs.length)];
            if (queueCtrl) queueCtrl.setContext(pl.title, plSongs.map(s => s.id), pick.id);
            setShuffleModeState(true, true);
            const sIdx = songs.findIndex(s => s.id === pick.id);
            if (sIdx !== -1) {
                loadTrack(sIdx, true);
                syncEntityViewPlayingState();
                showToast(`Shuffling ${pl.title}`);
            }
        });

        actionBar.querySelector("#spPlAddSongsBtn")?.addEventListener("click", () => openHomeAddSongsModal(pl.id));
        actionBar.querySelector("#spPlEditProfileBtn")?.addEventListener("click", () => openHomeEditPlaylistModal(pl.id));
        actionBar.querySelector("#spPlDeleteBtn")?.addEventListener("click", () => openHomeDeletePlaylistModal(pl.id));

        // Songs in this Playlist
        if (plSongs.length === 0) {
            const emptyBox = document.createElement("div");
            emptyBox.style.cssText = "background:#11111b;border:1px dashed var(--border-cyber);border-radius:12px;padding:42px 20px;text-align:center;";
            emptyBox.innerHTML = `
                <i class="fa-solid fa-compact-disc" style="font-size:40px;color:var(--neon-yellow);margin-bottom:12px;display:block;"></i>
                <h3 style="margin:0 0 6px 0;color:#fff;font-size:18px;font-weight:900;">This playlist is empty</h3>
                <p style="margin:0 0 16px 0;color:var(--text-muted);font-size:13px;">Add songs from your collection to start listening.</p>
                ${!isLikedPl
                    ? `<button type="button" class="sp-primary-action-btn" id="spEmptyAddSongsBtn"><i class="fa-solid fa-plus"></i> Add Songs to "${pl.title}"</button>`
                    : `<button type="button" class="sp-primary-action-btn" id="spEmptyBrowseHomeBtn"><i class="fa-solid fa-heart"></i> Browse Songs on Home</button>`}
            `;
            homeAlbumArtistView.appendChild(emptyBox);
            emptyBox.querySelector("#spEmptyAddSongsBtn")?.addEventListener("click", () => openHomeAddSongsModal(pl.id));
            emptyBox.querySelector("#spEmptyBrowseHomeBtn")?.addEventListener("click", showHomeDashboardView);
        } else {
            const table = buildSpotifyTracklist(plSongs, { thirdColLabel: "Album", contextLabel: pl.title, contextSongs: plSongs });
            // Add a Remove-from-Playlist button on each row for custom playlists
            if (!isLikedPl) {
                const rows = table.querySelectorAll(".sp-track-row");
                rows.forEach(row => {
                    const rSongId = Number(row.dataset.songId);
                    const actionsCell = row.querySelector(".sp-track-actions");
                    if (actionsCell) {
                        const remBtn = document.createElement("button");
                        remBtn.type = "button";
                        remBtn.className = "sp-icon-btn";
                        remBtn.title = "Remove from this playlist";
                        remBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                        remBtn.addEventListener("click", (e) => {
                            e.stopPropagation();
                            const allPls = getCustomPlaylistsFromStorage();
                            const target = allPls.find(p => p.id === pl.id);
                            if (target && Array.isArray(target.songs)) {
                                target.songs = target.songs.filter(id => Number(id) !== rSongId);
                                saveCustomPlaylistsToStorage(allPls);
                                showToast("Removed song from playlist");
                                refreshAllPlaylistViews();
                            }
                        });
                        actionsCell.appendChild(remBtn);
                    }
                });
            }
            homeAlbumArtistView.appendChild(table);
        }
    }

    /* ==========================================================
       Create / Edit / Delete / Manage Songs Modals in Home.js
       ========================================================== */
    const createPlaylistModal = $("#createPlaylistModal");
    const plCreateBtn = $("#plCreateBtn");
    const plCancelBtn = $("#plCancelBtn");

    function openHomeCreatePlaylistModal() {
        if (!createPlaylistModal) return;
        const nameInput = $("#plName");
        const descInput = $("#plDesc");
        const imgInput = $("#plImg");
        if (nameInput) nameInput.value = "";
        if (descInput) descInput.value = "";
        if (imgInput) imgInput.value = "";
        createPlaylistModal.style.display = "flex";
        setTimeout(() => nameInput?.focus(), 50);
    }

    $("#homeLibCreatePlaylistBtn")?.addEventListener("click", openHomeCreatePlaylistModal);
    $("#sidebarCreatePlaylistBtn")?.addEventListener("click", () => {
        if (activeSidebarTab === "albums" && homeAlbumModalApi) {
            homeAlbumModalApi.open();
        } else {
            openHomeCreatePlaylistModal();
        }
    });

    const homeAlbumModalApi = window.AlbumManager
        ? window.AlbumManager.wireCreateModal({
            songs,
            triggerButtons: [$("#homeLibCreateAlbumBtn")],
            getDefaultArtist: getSavedDisplayName,
            onError: showToast,
            onCreated: (newAlbum) => {
                activeSidebarTab = "albums";
                activeSidebarItemId = newAlbum.id;
                $$(".lib-tab").forEach(t => {
                    const isAlb = t.dataset.libTab === "albums";
                    t.classList.toggle("active", isAlb);
                    t.setAttribute("aria-selected", String(isAlb));
                });
                setupSidebarSongs();
                if (homeLibraryView && homeLibraryView.style.display === "block") {
                    renderHomeLibrary();
                } else {
                    displayAlbumInView(newAlbum);
                }
                showToast(`Created album "${newAlbum.title}"!`);
            }
        })
        : null;

    plCancelBtn?.addEventListener("click", () => {
        if (createPlaylistModal) createPlaylistModal.style.display = "none";
    });
    createPlaylistModal?.addEventListener("click", (e) => {
        if (e.target === createPlaylistModal) createPlaylistModal.style.display = "none";
    });

    plCreateBtn?.addEventListener("click", () => {
        const nameInput = $("#plName");
        const descInput = $("#plDesc");
        const imgInput = $("#plImg");
        const name = nameInput ? nameInput.value.trim() : "";
        const desc = descInput ? descInput.value.trim() : "";
        if (!name) {
            showToast("Please enter a playlist name!");
            nameInput?.focus();
            return;
        }
        const imgFile = imgInput && imgInput.files && imgInput.files[0] ? imgInput.files[0] : null;

        function finalizeCreate(imageDataUrl) {
            const allPls = getCustomPlaylistsFromStorage();
            const newPl = {
                id: "custom-" + Date.now(),
                title: name,
                creator: getSavedDisplayName(),
                type: "playlist",
                cover: imageDataUrl || null, // null uses default gradient music profile
                desc: desc || "Custom user playlist",
                songs: []
            };
            allPls.unshift(newPl);
            saveCustomPlaylistsToStorage(allPls);
            if (createPlaylistModal) createPlaylistModal.style.display = "none";
            activeSidebarTab = "playlists";
            activeSidebarItemId = newPl.id;
            $$(".lib-tab").forEach(t => {
                const isPl = t.dataset.libTab === "playlists";
                t.classList.toggle("active", isPl);
                t.setAttribute("aria-selected", String(isPl));
            });
            refreshAllPlaylistViews();
            displayPlaylistInView(newPl.id);
            showToast(`Created playlist "${name}"!`);
        }

        if (imgFile) {
            const reader = new FileReader();
            reader.onload = (ev) => finalizeCreate(ev.target.result);
            reader.readAsDataURL(imgFile);
        } else {
            finalizeCreate(null);
        }
    });

    // Edit Playlist Profile Modal
    const editPlaylistModal = $("#editPlaylistModal");
    const editPlName = $("#editPlName");
    const editPlDesc = $("#editPlDesc");
    const editPlImg = $("#editPlImg");
    const editPlSaveBtn = $("#editPlSaveBtn");
    const editPlCancelBtn = $("#editPlCancelBtn");

    function openHomeEditPlaylistModal(playlistId) {
        const allPls = getCustomPlaylistsFromStorage();
        const pl = allPls.find(p => p.id === playlistId);
        if (!pl || !editPlaylistModal) return;
        editingHomePlaylistId = playlistId;
        if (editPlName) editPlName.value = pl.title || "";
        if (editPlDesc) editPlDesc.value = pl.desc || "";
        if (editPlImg) editPlImg.value = "";
        editPlaylistModal.style.display = "flex";
    }

    editPlCancelBtn?.addEventListener("click", () => {
        editingHomePlaylistId = null;
        if (editPlaylistModal) editPlaylistModal.style.display = "none";
    });
    editPlaylistModal?.addEventListener("click", (e) => {
        if (e.target === editPlaylistModal) editPlaylistModal.style.display = "none";
    });

    editPlSaveBtn?.addEventListener("click", () => {
        if (!editingHomePlaylistId) return;
        const allPls = getCustomPlaylistsFromStorage();
        const pl = allPls.find(p => p.id === editingHomePlaylistId);
        if (!pl) return;

        const newName = editPlName ? editPlName.value.trim() : "";
        const newDesc = editPlDesc ? editPlDesc.value.trim() : "";
        if (newName) pl.title = newName;
        pl.desc = newDesc || "Custom user playlist";

        const file = editPlImg && editPlImg.files && editPlImg.files[0] ? editPlImg.files[0] : null;
        function finalizeEdit(newCoverUrl) {
            if (newCoverUrl !== undefined) pl.cover = newCoverUrl;
            saveCustomPlaylistsToStorage(allPls);
            editingHomePlaylistId = null;
            if (editPlaylistModal) editPlaylistModal.style.display = "none";
            refreshAllPlaylistViews();
            showToast(`Updated playlist "${pl.title}"!`);
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => finalizeEdit(ev.target.result);
            reader.readAsDataURL(file);
        } else {
            finalizeEdit(undefined);
        }
    });

    // Delete Playlist Modal
    const deleteConfirmModal = $("#deleteConfirmModal");
    const delConfirmBtn = $("#delConfirmBtn");
    const delCancelBtn = $("#delCancelBtn");

    function openHomeDeletePlaylistModal(playlistId) {
        pendingHomeDeletePlaylistId = playlistId;
        if (deleteConfirmModal) deleteConfirmModal.style.display = "flex";
    }

    delCancelBtn?.addEventListener("click", () => {
        pendingHomeDeletePlaylistId = null;
        if (deleteConfirmModal) deleteConfirmModal.style.display = "none";
    });
    deleteConfirmModal?.addEventListener("click", (e) => {
        if (e.target === deleteConfirmModal) deleteConfirmModal.style.display = "none";
    });

    delConfirmBtn?.addEventListener("click", () => {
        if (pendingHomeDeletePlaylistId) {
            const deletedId = pendingHomeDeletePlaylistId;
            const allPls = getCustomPlaylistsFromStorage().filter(p => p.id !== deletedId);
            saveCustomPlaylistsToStorage(allPls);
            pendingHomeDeletePlaylistId = null;
            if (currentOpenPlaylistId === deletedId) {
                currentOpenPlaylistId = null;
                showFullLibraryView();
            }
            refreshAllPlaylistViews();
            showToast("Deleted playlist");
        }
        if (deleteConfirmModal) deleteConfirmModal.style.display = "none";
    });

    // Manage / Add Songs to Playlist Modal
    const addSongsModal = $("#addSongsModal");
    const addSongsPlTitle = $("#addSongsPlTitle");
    const addSongsList = $("#addSongsList");
    const addSongsCloseBtn = $("#addSongsCloseBtn");

    function openHomeAddSongsModal(playlistId) {
        const allPls = getCustomPlaylistsFromStorage();
        const pl = allPls.find(p => p.id === playlistId);
        if (!pl || !addSongsModal || !addSongsList) return;
        managingHomePlaylistId = playlistId;
        if (addSongsPlTitle) addSongsPlTitle.textContent = pl.title;
        if (!Array.isArray(pl.songs)) pl.songs = [];
        addSongsList.replaceChildren();

        songs.forEach(s => {
            const row = document.createElement("div");
            row.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;background:#161622;border-radius:8px;border:1px solid rgba(255,255,255,0.08);";
            const inPl = pl.songs.includes(s.id);
            row.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;min-width:0;">
                    <img src="${s.cover}" alt="${s.title}" style="width:38px;height:38px;border-radius:6px;object-fit:cover;">
                    <div style="min-width:0;">
                        <div style="font-size:13px;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.title}</div>
                        <div style="font-size:11px;color:#aaa;">${s.artist}</div>
                    </div>
                </div>
                <button type="button" class="toggle-song-pl-btn" style="padding:6px 12px;border-radius:999px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${inPl ? "#FF007F" : "#FFEA00"};color:${inPl ? "#fff" : "#09090E"};">
                    ${inPl ? "Added ✓" : "+ Add"}
                </button>
            `;
            const btn = row.querySelector(".toggle-song-pl-btn");
            btn.addEventListener("click", () => {
                const freshList = getCustomPlaylistsFromStorage();
                const target = freshList.find(p => p.id === playlistId);
                if (!target) return;
                if (!Array.isArray(target.songs)) target.songs = [];
                const idx = target.songs.indexOf(s.id);
                if (idx === -1) {
                    target.songs.push(s.id);
                    btn.textContent = "Added ✓";
                    btn.style.background = "#FF007F";
                    btn.style.color = "#fff";
                } else {
                    target.songs.splice(idx, 1);
                    btn.textContent = "+ Add";
                    btn.style.background = "#FFEA00";
                    btn.style.color = "#09090E";
                }
                saveCustomPlaylistsToStorage(freshList);
                refreshAllPlaylistViews();
            });
            addSongsList.appendChild(row);
        });

        addSongsModal.style.display = "flex";
    }

    addSongsCloseBtn?.addEventListener("click", () => {
        managingHomePlaylistId = null;
        if (addSongsModal) addSongsModal.style.display = "none";
    });
    addSongsModal?.addEventListener("click", (e) => {
        if (e.target === addSongsModal) addSongsModal.style.display = "none";
    });

    function getHomeLibraryItems(tab) {
        const customPls = JSON.parse(localStorage.getItem("spotifake_custom_playlists") || "[]");
        const playlists = [
            { kind: "playlist", id: "liked", title: "Liked Songs", creator: `${favorites.size} liked song${favorites.size !== 1 ? "s" : ""}`, isLiked: true, pinned: true },
            ...customPls.map(pl => ({
                kind: "playlist", id: pl.id, title: pl.title, cover: pl.cover, desc: pl.desc, isCustom: true,
                songs: pl.songs || [],
                creator: `${(pl.songs || []).length} song${(pl.songs || []).length !== 1 ? "s" : ""}`
            }))
        ];
        const albums = getAllAlbums().map(a => ({ kind: "album", ...a, creator: a.artistName }));
        const artists = SIDEBAR_DATA.artists.map(a => ({
            kind: "artist",
            ...a,
            creator: (ARTIST_PROFILES[a.artistName] && ARTIST_PROFILES[a.artistName].genre) || "Verified Artist"
        }));
        const recentIds = [...recentlyPlayed].reverse();
        const recents = recentIds
            .map(id => songs.find(s => s.id === id))
            .filter(Boolean)
            .map(s => ({ kind: "song", id: `song-${s.id}`, songId: s.id, title: s.title, creator: s.artist, cover: s.cover }));

        if (tab === "playlists") return playlists;
        if (tab === "albums") return albums;
        if (tab === "artists") return artists;
        if (tab === "recents") return recents;
        return [...playlists, ...albums, ...artists];
    }

    function renderHomeLibrary() {
        const container = $("#homeLibItemsContainer");
        if (!container) return;
        container.replaceChildren();

        const activeTabEl = $("#homeLibTabs .lib-cat-pill.active");
        const tab = activeTabEl ? activeTabEl.dataset.tab : "playlists";
        if (window.AlbumManager) {
            window.AlbumManager.syncLibraryTabActions({
                tab,
                createPlaylistBtn: $("#homeLibCreatePlaylistBtn"),
                createAlbumBtn: $("#homeLibCreateAlbumBtn")
            });
        }
        const filterInput = $("#homeLibFilterInput");
        const query = filterInput ? filterInput.value.trim().toLowerCase() : "";
        const sortBy = sidebarSortOrder;

        let items = getHomeLibraryItems(tab);
        if (query) {
            items = items.filter(i => i.title.toLowerCase().includes(query) || (i.creator || "").toLowerCase().includes(query));
        }
        if (sortBy === "az" || sortBy === "creator") {
            sortKeepingPinnedFirst(items, sortBy === "az" ? "title" : "creator");
        } else if (sortBy === "recently-added") {
            const addedAt = item => Number(String(item.id || "").match(/(\d{10,})$/)?.[1] || 0);
            items.sort((a, b) => {
                const aPinned = Boolean(a.pinned || a.isLiked);
                const bPinned = Boolean(b.pinned || b.isLiked);
                if (aPinned !== bPinned) return aPinned ? -1 : 1;
                return addedAt(b) - addedAt(a);
            });
        }

        const total = $("#homeLibTotalCount");
        if (total) total.textContent = `${items.length} ${items.length === 1 ? "item" : "items"}`;

        if (items.length === 0) {
            container.innerHTML = `
                <div style="grid-column:1 / -1;text-align:center;padding:48px 20px;color:var(--loud-magenta);">
                    <i class="fa-solid fa-compact-disc" style="font-size:38px;margin-bottom:12px;display:block;"></i>
                    <p style="font-size:16px;font-weight:800;">${tab === "recents" ? "Nothing played yet — start a song!" : "No items found in your library."}</p>
                </div>`;
            return;
        }

        items.forEach(item => {
            const card = document.createElement("article");
            card.className = `lib-card${item.isLiked ? " is-liked" : ""}`;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");

            const typeLabel = { playlist: "Playlist", album: "Album", artist: "Artist", song: "Song" }[item.kind];
            const pinHtml = item.pinned ? '<span class="lib-pin-tag"><i class="fa-solid fa-thumbtack"></i></span> ' : "";
            const imgStyle = item.kind === "artist" ? ' style="border-radius:50%;"' : "";

            let thumb;
            if (item.isLiked) {
                thumb = `<div class="lib-card-liked-bg"><i class="fa-solid fa-heart"></i></div>`;
            } else if (item.isCustom && !item.cover) {
                thumb = `<div class="lib-card-liked-bg" style="background:linear-gradient(135deg,#450af5,#8e8ee5);"><i class="fa-solid fa-music"></i></div>`;
            } else {
                thumb = `<img src="${item.cover || "../photos/ItDepends.jpg"}" alt="${item.title}" loading="lazy"${imgStyle}>`;
            }

            const descHtml = item.isCustom && item.desc
                ? `<p class="lib-card-desc" style="font-size:12px;color:#aaa;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${item.desc}">"${item.desc}"</p>`
                : "";

            // For Artists: NO hover play button — instead show View & Share buttons
            const playBtnHtml = item.kind === "artist"
                ? ""
                : `<button type="button" class="lib-card-play-btn" aria-label="Play ${item.title}"><i class="fa-solid fa-circle-play"></i></button>`;

            const artistActionsHtml = item.kind === "artist"
                ? `<div class="lib-artist-card-actions">
                       <button type="button" class="lib-artist-view-btn" title="View ${item.title}'s Profile"><i class="fa-solid fa-user"></i> View</button>
                       <button type="button" class="lib-artist-share-btn" title="Share ${item.title}'s Info"><i class="fa-solid fa-share-nodes"></i> Share</button>
                   </div>`
                : "";

            const customPlActionsHtml = item.isCustom
                ? `<button type="button" class="lib-delete-custom-btn" title="Delete playlist"><i class="fa-solid fa-trash-can"></i></button>
                   <button type="button" class="lib-edit-custom-btn" title="Edit Profile Picture & Description"><i class="fa-solid fa-pen-to-square"></i></button>`
                : (item.isCustomAlbum
                    ? `<button type="button" class="lib-delete-custom-btn lib-delete-custom-album-btn" title="Delete album"><i class="fa-solid fa-trash-can"></i></button>`
                    : "");
            const manageSongsBtnHtml = item.isCustom
                ? `<button type="button" class="lib-manage-songs-btn"><i class="fa-solid fa-music"></i> Manage Songs</button>`
                : "";

            card.innerHTML = `
                <div class="lib-card-thumb-wrap">
                    ${thumb}
                    ${playBtnHtml}
                </div>
                <div class="lib-card-info">
                    <h3 class="lib-card-title">${item.title}</h3>
                    <p class="lib-card-meta">${pinHtml}${typeLabel} • ${item.creator || "Spotifake"}</p>
                    ${descHtml}
                    ${manageSongsBtnHtml}
                    ${artistActionsHtml}
                </div>
                ${customPlActionsHtml}`;

            if (item.isCustom) {
                card.querySelector(".lib-delete-custom-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    openHomeDeletePlaylistModal(item.id);
                });
                card.querySelector(".lib-edit-custom-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    openHomeEditPlaylistModal(item.id);
                });
                card.querySelector(".lib-manage-songs-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    openHomeAddSongsModal(item.id);
                });
            }

            if (item.isCustomAlbum) {
                card.querySelector(".lib-delete-custom-album-btn")?.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (window.AlbumManager) {
                        window.AlbumManager.delete(item.id);
                        setupSidebarSongs();
                        renderHomeLibrary();
                        showToast(`Deleted album "${item.title}"`);
                    }
                });
            }

            const playBtn = card.querySelector(".lib-card-play-btn");
            if (playBtn) {
                playBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    let songId = null;
                    if (item.kind === "song") songId = item.songId;
                    else if (item.kind === "album") {
                        const albIds = item.songIds || item.songs || [];
                        songId = albIds[0];
                        if (songId == null) {
                            displayAlbumInView(item);
                            showToast(`"${item.title}" has no tracks yet!`);
                            return;
                        }
                    }
                    else if (item.isLiked) songId = [...favorites][0];
                    else if (item.isCustom) songId = item.songs[0];

                    if (songId == null) {
                        displayPlaylistInView(item.id);
                        showToast(`"${item.title}" is empty — add songs inside!`);
                        return;
                    }
                    const idx = songs.findIndex(s => s.id === songId);
                    if (idx !== -1) loadTrack(idx, true);
                });
            }

            const viewBtn = card.querySelector(".lib-artist-view-btn");
            if (viewBtn) {
                viewBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    displayArtistInView(item.artistName);
                });
            }

            const shareBtn = card.querySelector(".lib-artist-share-btn");
            if (shareBtn) {
                shareBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    shareArtistInfo(item.artistName);
                });
            }

            // Card click: open the item's view (does NOT interrupt current music)
            card.addEventListener("click", () => {
                if (item.kind === "artist") displayArtistInView(item.artistName);
                else if (item.kind === "album") displayAlbumInView(item);
                else if (item.kind === "song") {
                    const sIdx = songs.findIndex(s => s.id === item.songId);
                    if (sIdx !== -1) loadTrack(sIdx, true);
                    updateArtistDetails(item.songId);
                    openArtistPanel();
                } else if (item.isLiked) {
                    displayPlaylistInView("liked");
                } else if (item.isCustom) {
                    displayPlaylistInView(item.id);
                }
            });
            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
            });

            container.appendChild(card);
        });
    }

    // Embedded library controls
    const homeLibTabs = $$("#homeLibTabs .lib-cat-pill");
    homeLibTabs.forEach(pill => {
        pill.addEventListener("click", () => {
            homeLibTabs.forEach(p => { p.classList.remove("active"); p.setAttribute("aria-selected", "false"); });
            pill.classList.add("active");
            pill.setAttribute("aria-selected", "true");
            if (pill.dataset.tab !== "recents") {
                const sidebarTab = $(`.lib-tab[data-lib-tab="${pill.dataset.tab}"]`);
                if (sidebarTab && !sidebarTab.classList.contains("active")) sidebarTab.click();
            }
            renderHomeLibrary();
        });
    });
    $("#homeLibFilterInput")?.addEventListener("input", renderHomeLibrary);
    function setHomeLibLayout(mode) {
        const container = $("#homeLibItemsContainer");
        if (!container) return;
        container.dataset.view = mode;
        container.classList.toggle("list-view", mode === "list" || mode === "compact");
    }
    setHomeLibLayout(sidebarViewMode);
    $("#mobileLibSearchToggleBtn")?.addEventListener("click", () => {
        const searchBox = $("#homeLibraryView .lib-search-box");
        const filterInp = $("#homeLibFilterInput");
        if (searchBox) {
            const isOpen = searchBox.classList.toggle("is-open");
            if (isOpen) filterInp?.focus();
        }
    });

    const minimizeArtistPanel = $("#minimizeArtistPanel");
    const restoreArtistPanelBtn = $("#restoreArtistPanelBtn");
    const mobileTrackInfoBtn = $("#mobileTrackInfoBtn");

    function openArtistPanel() {
        if (artistDetailPanel) {
            artistDetailPanel.classList.add("drawer-open");
            artistDetailPanel.classList.remove("is-collapsed");
        }
        const mainContainer = $(".main");
        if (mainContainer) {
            mainContainer.classList.remove("panel-collapsed");
        }
        if (mobileTrackInfoBtn) {
            mobileTrackInfoBtn.classList.add("active");
        }
    }

    function closeArtistPanelDrawer() {
        if (artistDetailPanel) {
            artistDetailPanel.classList.remove("drawer-open");
            artistDetailPanel.classList.add("is-collapsed");
        }
        const mainContainer = $(".main");
        if (mainContainer) {
            mainContainer.classList.add("panel-collapsed");
        }
        if (mobileTrackInfoBtn) {
            mobileTrackInfoBtn.classList.remove("active");
        }
    }

    // Tapping or swiping UP on the bottom player bar opens Now Playing on Mobile & Tablet
    const playerBarEl = $(".player-bar");
    const nowBarCover = $(".now-playing-cover-wrap");
    const nowBarInfo = $(".now-playing-info");
    [nowBarCover, nowBarInfo].forEach(el => {
        if (!el) return;
        el.addEventListener("click", () => {
            const currentSong = getCurrentSong();
            if (currentSong) updateArtistDetails(currentSong.id);
            if (window.innerWidth < 1024) {
                const isOpen = artistDetailPanel && artistDetailPanel.classList.contains("drawer-open");
                if (isOpen) {
                    closeArtistPanelDrawer();
                } else {
                    openArtistPanel();
                }
            } else {
                openArtistPanel();
            }
        });
    });

    if (playerBarEl && artistDetailPanel) {
        let pbStartX = 0;
        let pbStartY = 0;
        let pbLastDy = 0;
        let pbSwipeActive = false;

        playerBarEl.addEventListener("pointerdown", (e) => {
            if (window.innerWidth >= 1024) return;
            if (e.target.closest("input, button, a")) return;
            pbStartX = e.clientX;
            pbStartY = e.clientY;
            pbLastDy = 0;
            pbSwipeActive = true;
        }, { passive: true });

        window.addEventListener("pointermove", (e) => {
            if (!pbSwipeActive || window.innerWidth >= 1024) return;
            const dy = e.clientY - pbStartY;
            const dx = e.clientX - pbStartX;
            if (dy < -10 && Math.abs(dy) > Math.abs(dx)) {
                pbLastDy = dy;
                const sheetH = Math.max(artistDetailPanel.offsetHeight || window.innerHeight, 300);
                const yPx = Math.max(0, sheetH + dy);
                artistDetailPanel.style.setProperty("transition", "none", "important");
                artistDetailPanel.style.setProperty("transform", `translateY(${yPx}px)`, "important");
            }
        }, { passive: true });

        ["pointerup", "pointercancel"].forEach((evt) => {
            window.addEventListener(evt, () => {
                if (!pbSwipeActive) return;
                pbSwipeActive = false;
                artistDetailPanel.style.removeProperty("transition");
                artistDetailPanel.style.removeProperty("transform");
                if (window.innerWidth < 1024 && pbLastDy < -38) {
                    const currentSong = getCurrentSong();
                    if (currentSong) updateArtistDetails(currentSong.id);
                    openArtistPanel();
                }
            }, { passive: true });
        });

        // Swipe DOWN on Now Playing sheet (when at top or on header) to collapse back to play bar
        const npvScroll = $("#artistPanelContent");
        let npvStartX = 0;
        let npvStartY = 0;
        let npvLastDy = 0;
        let npvSwipeActive = false;

        artistDetailPanel.addEventListener("pointerdown", (e) => {
            if (window.innerWidth >= 1024 || !artistDetailPanel.classList.contains("drawer-open")) return;
            if (artistDetailPanel.classList.contains("queue-view-open")) return;
            if (e.target.closest("input, button, a")) return;
            const onHeader = Boolean(e.target.closest(".sp-npv-header"));
            const atTop = !npvScroll || npvScroll.scrollTop <= 2;
            if (!onHeader && !atTop) return;
            npvStartX = e.clientX;
            npvStartY = e.clientY;
            npvLastDy = 0;
            npvSwipeActive = true;
        }, { passive: true });

        window.addEventListener("pointermove", (e) => {
            if (!npvSwipeActive || window.innerWidth >= 1024) return;
            const dy = e.clientY - npvStartY;
            const dx = e.clientX - npvStartX;
            if (dy > 10 && Math.abs(dy) > Math.abs(dx)) {
                npvLastDy = dy;
                artistDetailPanel.style.setProperty("transition", "none", "important");
                artistDetailPanel.style.setProperty("transform", `translateY(${dy}px)`, "important");
            }
        }, { passive: true });

        ["pointerup", "pointercancel"].forEach((evt) => {
            window.addEventListener(evt, () => {
                if (!npvSwipeActive) return;
                npvSwipeActive = false;
                artistDetailPanel.style.removeProperty("transition");
                artistDetailPanel.style.removeProperty("transform");
                if (window.innerWidth < 1024 && npvLastDy > 60) {
                    closeArtistPanelDrawer();
                }
            }, { passive: true });
        });
    }

    if (closeArtistPanel) {
        closeArtistPanel.addEventListener("click", closeArtistPanelDrawer);
    }

    if (minimizeArtistPanel) {
        minimizeArtistPanel.addEventListener("click", (e) => {
            e.stopPropagation();
            closeArtistPanelDrawer();
        });
    }

    if (restoreArtistPanelBtn) {
        restoreArtistPanelBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openArtistPanel();
        });
    }

    if (artistDetailPanel) {
        artistDetailPanel.addEventListener("click", (e) => {
            if (window.innerWidth < 1024) return;
            if ((e.target === artistDetailPanel || e.target.closest(".sp-npv-minimized-rail")) &&
                (artistDetailPanel.classList.contains("is-collapsed") || $(".main")?.classList.contains("panel-collapsed"))) {
                openArtistPanel();
            }
        });
    }

    // Wire Spotify Now Playing View interactive buttons & menus
    const npvMoreBtn = $("#npvMoreBtn");
    const npvMoreMenu = $("#npvMoreMenu");
    const npvExpandBtn = $("#npvExpandBtn");
    const npvCoverWrap = $("#npvCoverWrap");
    const npvShareBtn = $("#npvShareBtn");
    const npvAddLikedBtn = $("#npvAddLikedBtn");
    const npvLyricsCard = $("#npvLyricsCard");
    const npvShowLyricsPreviewBtn = $("#npvShowLyricsPreviewBtn");
    const npvShowAllCreditsBtn = $("#npvShowAllCreditsBtn");
    const npvOpenQueueBtn = $("#npvOpenQueueBtn");

    function toggleCenterLyricsFromPreview() {
        if (isCenterLyricsViewOpen()) {
            if (previousCenterView === "library") showFullLibraryView();
            else showHomeDashboardView();
            return;
        }
        if (window.innerWidth < 1024) closeArtistPanelDrawer();
        displayLyricsPreviewView(currentNpvSongId);
    }

    if (npvLyricsCard) {
        npvLyricsCard.addEventListener("click", toggleCenterLyricsFromPreview);
        npvLyricsCard.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCenterLyricsFromPreview();
            }
        });
    }

    if (npvShowLyricsPreviewBtn) {
        npvShowLyricsPreviewBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleCenterLyricsFromPreview();
        });
    }

    function shareTrackById(songId) {
        const s = songs.find(x => x.id === Number(songId)) || getCurrentSong();
        const url = new URL(s.pageUrl, window.location.href).href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(`${s.title} — ${s.artist} (${url})`).catch(() => {});
        }
        showToast(`Link copied for "${s.title}"!`);
    }

    if (npvMoreBtn && npvMoreMenu) {
        npvMoreBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isHidden = npvMoreMenu.hasAttribute("hidden");
            if (isHidden) {
                npvMoreMenu.removeAttribute("hidden");
                npvMoreBtn.setAttribute("aria-expanded", "true");
            } else {
                npvMoreMenu.setAttribute("hidden", "");
                npvMoreBtn.setAttribute("aria-expanded", "false");
            }
        });
        document.addEventListener("click", (e) => {
            if (!npvMoreMenu.hasAttribute("hidden") && !e.target.closest(".sp-npv-dots-wrap")) {
                npvMoreMenu.setAttribute("hidden", "");
                npvMoreBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    $("#npvMenuAddPlaylist")?.addEventListener("click", () => {
        npvMoreMenu?.setAttribute("hidden", "");
        openAddToPlaylistModal(currentNpvSongId);
    });
    $("#npvMenuToggleFav")?.addEventListener("click", () => {
        npvMoreMenu?.setAttribute("hidden", "");
        toggleFavorite(currentNpvSongId);
    });
    $("#npvMenuGoAlbum")?.addEventListener("click", () => {
        npvMoreMenu?.setAttribute("hidden", "");
        if (window.innerWidth < 1024) closeArtistPanelDrawer();
        displayAlbumInView(findAlbumForSong(currentNpvSongId));
    });
    $("#npvMenuGoArtist")?.addEventListener("click", () => {
        npvMoreMenu?.setAttribute("hidden", "");
        if (window.innerWidth < 1024) closeArtistPanelDrawer();
        const s = songs.find(x => x.id === currentNpvSongId) || getCurrentSong();
        displayArtistInView(splitArtists(s.artist)[0] || s.artist);
    });
    $("#npvMenuShowCredits")?.addEventListener("click", () => {
        npvMoreMenu?.setAttribute("hidden", "");
        openCreditsModal(currentNpvSongId);
    });
    $("#npvMenuShare")?.addEventListener("click", () => {
        npvMoreMenu?.setAttribute("hidden", "");
        shareTrackById(currentNpvSongId);
    });

    if (npvExpandBtn) {
        npvExpandBtn.addEventListener("click", () => {
            if (window.innerWidth < 1024) closeArtistPanelDrawer();
            displayLyricsPreviewView(currentNpvSongId);
        });
    }

    window.SpotifakePlayback?.bindLifecycle?.({
        getAudio: () => audio,
        getSong: getCurrentSong,
        onPageShow: (saved) => {
            const idx = songs.findIndex(s => Number(s.id) === Number(saved.songId));
            if (idx === -1) return;
            if (idx !== currentIndex) loadTrack(idx, false);
            window.SpotifakePlayback.restoreCurrentAudio?.({
                songId: songs[idx].id,
                getAudio: () => audio,
                onResume: (wasPlaying) => {
                    if (wasPlaying) return playTrack();
                    if (!audio.paused) pauseTrack();
                    updateProgress();
                    updatePlayButton();
                },
                onSeekApplied: () => updateProgress()
            });
        }
    });

    if (npvCoverWrap) {
        npvCoverWrap.addEventListener("click", () => {
            const sIdx = songs.findIndex(x => x.id === currentNpvSongId);
            if (sIdx !== -1) {
                if (sIdx === currentIndex && audio.src) {
                    togglePlay();
                } else {
                    handleCardPlay(sIdx);
                }
            }
        });
    }

    if (npvShareBtn) {
        npvShareBtn.addEventListener("click", () => shareTrackById(currentNpvSongId));
    }

    if (npvAddLikedBtn) {
        npvAddLikedBtn.addEventListener("click", (e) => {
            toggleFavorite(currentNpvSongId, e);
            const isNowFav = favorites.has(currentNpvSongId);
            showToast(isNowFav ? "Added to Liked Songs" : "Removed from Liked Songs");
        });
    }

    if (npvShowAllCreditsBtn) {
        npvShowAllCreditsBtn.addEventListener("click", () => openCreditsModal(currentNpvSongId));
    }

    if (npvOpenQueueBtn) {
        npvOpenQueueBtn.addEventListener("click", openQueueDrawerModal);
    }

    // Spotify Mobile & Tablet Now Playing Transport Deck (#npvMobileTransport)
    const npvSeekSlider = $("#npvSeekSlider");
    const npvCurrentTime = $("#npvCurrentTime");
    const npvDuration = $("#npvDuration");
    const npvShuffleBtn = $("#npvShuffleBtn");
    const npvPrevBtn = $("#npvPrevBtn");
    const npvPlayBtn = $("#npvPlayBtn");
    const npvPlayIcon = $("#npvPlayIcon");
    const npvNextBtn = $("#npvNextBtn");
    const npvRepeatBtn = $("#npvRepeatBtn");
    const npvMuteBtn = $("#npvMuteBtn");
    const npvMuteIcon = $("#npvMuteIcon");
    const npvVolumeSlider = $("#npvVolumeSlider");
    const npvQuickQueueBtn = $("#npvQuickQueueBtn");

    npvPlayBtn?.addEventListener("click", () => {
        const sIdx = songs.findIndex(x => x.id === currentNpvSongId);
        if (sIdx !== -1 && sIdx !== currentIndex) {
            loadTrack(sIdx, true);
        } else {
            togglePlay();
        }
    });
    npvPrevBtn?.addEventListener("click", () => previousTrack());
    npvNextBtn?.addEventListener("click", () => nextTrack(false));
    npvShuffleBtn?.addEventListener("click", () => shuffleButton?.click());
    npvRepeatBtn?.addEventListener("click", () => repeatButton?.click());
    npvMuteBtn?.addEventListener("click", () => muteButton?.click());
    npvQuickQueueBtn?.addEventListener("click", openQueueDrawerModal);

    if (npvSeekSlider) {
        npvSeekSlider.addEventListener("input", () => {
            seekOnRelease = true;
            const total = audio.duration;
            if (Number.isFinite(total) && total > 0) {
                const pct = Number(npvSeekSlider.value);
                const target = (pct / 100) * total;
                if (npvCurrentTime) npvCurrentTime.textContent = formatTime(target);
                currentTime.textContent = formatTime(target);
                npvSeekSlider.style.background = `linear-gradient(to right, var(--loud-magenta) ${pct}%, #282834 ${pct}%)`;
                progressBar.value = pct;
                progressBar.style.background = `linear-gradient(to right, var(--loud-magenta) ${pct}%, #282834 ${pct}%)`;
            }
        });
        const finishNpvSeek = () => {
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                audio.currentTime = (Number(npvSeekSlider.value) / 100) * audio.duration;
            }
            seekOnRelease = false;
            updateProgress();
        };
        npvSeekSlider.addEventListener("change", finishNpvSeek);
        npvSeekSlider.addEventListener("pointerup", finishNpvSeek);
    }

    if (npvVolumeSlider) {
        npvVolumeSlider.addEventListener("input", () => {
            masterVolume = Number(npvVolumeSlider.value);
            isMasterMuted = false;
            if (masterVolume > 0) lastVolume = masterVolume;
            localStorage.setItem("spotifake_volume", String(masterVolume));
            localStorage.setItem("spotifake_muted", "0");
            if (!activeFadeState) {
                audio.volume = masterVolume;
                audio.muted = false;
            }
            updateVolumeUI();
        });
    }

    function handleCardPlay(index) {
        const song = songs[index];
        if (queueCtrl && song) {
            queueCtrl.setContext("All Songs", songs.map(s => s.id), song.id);
        }
        if (index === currentIndex && audio.src) {
            if (!audio.paused && !audio.ended) {
                pauseTrack();
                return false;
            } else {
                if (audio.ended) audio.currentTime = 0;
                playTrack();
            }
        } else {
            loadTrack(index, true);
        }
        return true;
    }

    function updateCardStates() {
        cards.forEach((card, index) => {
            const isCurrent = index === currentIndex;
            const isPlaying = isCurrent && !audio.paused;

            if (isPlaying) {
                card.classList.add("has-entered");
                card.style.animationDelay = "";
            }
            card.classList.toggle("is-current", isCurrent);
            card.classList.toggle("is-playing", isPlaying);

            const icon = card.querySelector(".playMusic");
            if (icon) {
                icon.className = `playMusic fa-solid ${isPlaying ? "fa-circle-pause" : "fa-circle-play"}`;
            }
        });
    }
    /* ==========================================================
        11. Media Cards Setup & Hover Interactions
        ========================================================== */
    function setupCards() {
        cards.forEach((card, index) => {
            const song = songs[index];
            card.dataset.songId = String(song.id);

            // Staggered Building Block entrance animation delay (clears permanently once entered)
            card.style.animationDelay = `${0.3 + index * 0.05}s`;
            const onEnterAnimEnd = (e) => {
                if (e.target === card && e.animationName === "cyberBlockPop") {
                    card.classList.add("has-entered");
                    card.style.animationDelay = "";
                    card.removeEventListener("animationend", onEnterAnimEnd);
                }
            };
            card.addEventListener("animationend", onEnterAnimEnd);

            const image = card.querySelector("img");
            const title = card.querySelector(".img-title");
            const description = card.querySelector(".img-description");
            const playBtn = card.querySelector(".music-play-btn");
            const heartBtn = card.querySelector(".card-heart-btn");

            if (image) {
                image.src = song.cover;
                image.alt = `${song.title} cover art`;
            }
            if (title) title.textContent = song.title;
            if (description) description.textContent = song.artist;
            if (playBtn) {
                playBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    card.classList.add("has-entered");
                    card.style.animationDelay = "";
                    if (handleCardPlay(index)) displayLyricsPreviewView(song.id);
                });
            }
            if (heartBtn) {
                heartBtn.addEventListener("click", (e) => {
                    toggleFavorite(song.id, e);
                });
            }
            // Add "Add to Playlist" & "Add to Queue" buttons
            const actionsLeft = document.createElement("div");
            actionsLeft.className = "card-actions-left";

            const addToPlBtn = document.createElement("button");
            addToPlBtn.className = "card-add-to-playlist-btn";
            addToPlBtn.type = "button";
            addToPlBtn.title = "Add to Playlist";
            addToPlBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
            addToPlBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                openAddToPlaylistModal(song.id);
            });

            const addToQBtn = document.createElement("button");
            addToQBtn.className = "card-add-to-queue-btn";
            addToQBtn.type = "button";
            addToQBtn.title = "Add to Queue";
            addToQBtn.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
            addToQBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (queueCtrl) queueCtrl.addToQueue(song.id);
            });

            actionsLeft.appendChild(addToPlBtn);
            actionsLeft.appendChild(addToQBtn);
            const actionsDiv = card.querySelector(".card-actions");
            if (actionsDiv) actionsDiv.prepend(actionsLeft);
            card.addEventListener("click", (e) => {
                if (e.target.closest("button") || e.target.closest("a")) return;
                card.classList.add("has-entered");
                card.style.animationDelay = "";
                if (handleCardPlay(index)) {
                    updateArtistDetails(song.id);
                    displayLyricsPreviewView(song.id);
                }
            });
        });
    }

    /* ==========================================================
       12. Audio Playback Core Engine
       ========================================================== */
    function updateNowPlaying() {
        const song = getCurrentSong();
        if (!song) return;

        currentTitle.textContent = song.title;
        currentArtist.textContent = song.artist;
        currentImage.src = song.cover;
        currentImage.alt = `${song.title} cover art`;

        updateFavoritesUI();
        updateArtistDetails(song.id);
        syncEntityViewPlayingState();
        if (isCenterLyricsViewOpen()) {
            displayLyricsPreviewView(song.id);
        }
    }

    function updatePlayButton() {
        const isPlaying = !audio.paused && !audio.ended;

        const icon = playButton.querySelector("i");
        if (icon) {
            icon.className = `player-btns fa-solid ${isPlaying ? "fa-circle-pause" : "fa-circle-play"}`;
        }
        playButton.title = isPlaying ? "Pause" : "Play";

        if (npvPlayIcon) {
            npvPlayIcon.className = `fa-solid ${isPlaying ? "fa-circle-pause" : "fa-circle-play"}`;
        }
        if (npvPlayBtn) {
            npvPlayBtn.title = isPlaying ? "Pause" : "Play";
        }

        if (musicVisualizer) {
            musicVisualizer.classList.toggle("is-active", isPlaying);
        }

        updateCardStates();
        updateSidebarActiveState();
        syncEntityViewPlayingState();
        renderMobileQuickPicks();
        if (followingSection && !followingSection.hidden) renderFollowingSection();
    }

    function syncShuffleRepeatButtonsUI() {
        if (shuffleButton) {
            shuffleButton.classList.toggle("active", isShuffle);
            shuffleButton.setAttribute("aria-pressed", String(isShuffle));
            shuffleButton.title = isShuffle ? "Disable shuffle" : "Enable shuffle";
        }
        if (npvShuffleBtn) {
            npvShuffleBtn.classList.toggle("active", isShuffle);
            npvShuffleBtn.setAttribute("aria-pressed", String(isShuffle));
            npvShuffleBtn.title = isShuffle ? "Disable shuffle" : "Enable shuffle";
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
        if (npvRepeatBtn) {
            npvRepeatBtn.classList.toggle("active", repeatMode !== "off");
            npvRepeatBtn.setAttribute("aria-pressed", String(repeatMode !== "off"));
            npvRepeatBtn.dataset.mode = repeatMode;
            let badge = npvRepeatBtn.querySelector(".repeat-one-badge");
            if (repeatMode === "one") {
                if (!badge) {
                    badge = document.createElement("span");
                    badge.className = "repeat-one-badge";
                    badge.textContent = "1";
                    npvRepeatBtn.appendChild(badge);
                }
                badge.style.display = "flex";
            } else if (badge) {
                badge.style.display = "none";
            }
        }
    }

    function stopActiveCrossfade(finalizeInDeck = true) {
        if (crossfadeRafId) {
            cancelAnimationFrame(crossfadeRafId);
            crossfadeRafId = null;
        }
        if (activeFadeState) {
            const { outDeck, inDeck } = activeFadeState;
            if (outDeck && outDeck !== audio) {
                outDeck.pause();
                try { outDeck.currentTime = 0; } catch (e) {}
                outDeck.volume = 0;
            }
            if (finalizeInDeck && inDeck) {
                inDeck.muted = isMasterMuted;
                inDeck.volume = isMasterMuted ? 0 : masterVolume;
            }
            activeFadeState = null;
        }
    }

    function runCrossfadeAnimation(outDeck, inDeck, durationSec) {
        const startTime = performance.now();
        const durationMs = Math.max(400, durationSec * 1000);
        const remainingSec = Number.isFinite(outDeck.duration) ? Math.max(0.35, outDeck.duration - outDeck.currentTime) : durationSec;
        const outDurationMs = Math.max(350, Math.min(durationMs, remainingSec * 1000));
        const outStartRatio = masterVolume > 0 ? Math.min(1, Math.max(0.15, outDeck.volume / masterVolume)) : 1;

        activeFadeState = { outDeck, inDeck, startTime, durationMs };

        function step(now) {
            if (!activeFadeState || activeFadeState.inDeck !== inDeck) return;

            const elapsed = now - startTime;
            const inProgress = Math.min(1, elapsed / durationMs);
            const outProgress = Math.min(1, elapsed / outDurationMs);
            const targetVol = isMasterMuted ? 0 : masterVolume;

            // Equal-power sine/cosine curve prevents volume dips during overlap
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
                try { outDeck.currentTime = 0; } catch (e) {}
                outDeck.volume = 0;
            }

            if (inProgress < 1) {
                crossfadeRafId = requestAnimationFrame(step);
            } else {
                crossfadeRafId = null;
                activeFadeState = null;
                if (!outDeck.paused) {
                    outDeck.pause();
                    try { outDeck.currentTime = 0; } catch (e) {}
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

        const targetSong = songs[index];
        const targetAbsSrc = new URL(targetSong.src, window.location.href).href;
        if (!meta.forceReload && index === currentIndex && audio.src === targetAbsSrc) {
            autoCrossfadeTriggered = false;
            if (queueCtrl) queueCtrl.onTrackLoaded(targetSong.id, meta);
            if (audio.ended) {
                audio.currentTime = 0;
            }
            if (!activeFadeState) {
                audio.muted = isMasterMuted;
                audio.volume = isMasterMuted ? 0 : masterVolume;
            }
            updateNowPlaying();
            updatePlayButton();
            syncNpvCanvasVideo(targetSong.id, Boolean(autoplay || (!audio.paused && !audio.ended)));
            if (autoplay && audio.paused) {
                playTrack();
            }
            return;
        }
        const canCrossfade =
            meta.autoTransition === true &&
            autoplay &&
            crossfadeSeconds > 0 &&
            !audio.paused &&
            !audio.ended &&
            Boolean(audio.src) &&
            audio.src !== targetAbsSrc;

        autoCrossfadeTriggered = false;
        currentIndex = index;
        if (queueCtrl) queueCtrl.onTrackLoaded(targetSong.id, meta);

        if (canCrossfade) {
            // Stop any older lingering fade on the idle deck while keeping active audio playing
            stopActiveCrossfade(false);

            const outgoingDeck = audio;
            const incomingDeck = outgoingDeck === deckA ? deckB : deckA;
            audio = incomingDeck;

            incomingDeck.pause();
            incomingDeck.src = targetSong.src;
            incomingDeck.muted = isMasterMuted;
            incomingDeck.volume = 0;
            incomingDeck.load();

            progressBar.value = 0;
            progressBar.style.background = `linear-gradient(to right, var(--loud-magenta) 0%, #282834 0%)`;
            currentTime.textContent = "0:00";
            duration.textContent = "0:00";

            updateNowPlaying();
            updatePlayButton();
            addRecentlyPlayed(targetSong.id);

            playTrack().then(() => {
                if (audio === incomingDeck && !incomingDeck.paused) {
                    runCrossfadeAnimation(outgoingDeck, incomingDeck, crossfadeSeconds);
                } else {
                    outgoingDeck.pause();
                    try { outgoingDeck.currentTime = 0; } catch (e) {}
                    incomingDeck.volume = isMasterMuted ? 0 : masterVolume;
                }
            });
            return;
        }

        stopActiveCrossfade(true);
        audio.pause();
        audio.src = targetSong.src;
        audio.muted = isMasterMuted;
        audio.volume = isMasterMuted ? 0 : masterVolume;
        audio.load();

        progressBar.value = 0;
        progressBar.style.background = `linear-gradient(to right, var(--loud-magenta) 0%, #282834 0%)`;
        currentTime.textContent = "0:00";
        duration.textContent = "0:00";

        updateNowPlaying();
        updatePlayButton();

        // Record into Recents
        addRecentlyPlayed(targetSong.id);

        if (autoplay) {
            playTrack();
        }
    }

    async function playTrack() {
        try {
            if (!activeFadeState) {
                audio.muted = isMasterMuted;
                audio.volume = isMasterMuted ? 0 : masterVolume;
            }
            await audio.play();
            updatePlayButton();
        } catch (error) {
            console.error("Playback failed:", error);
            currentArtist.textContent = "Audio unavailable or blocked by browser.";
            updatePlayButton();
        }
    }

    function pauseTrack() {
        stopActiveCrossfade(true);
        deckA.pause();
        deckB.pause();
        updatePlayButton();
    }

    function togglePlay() {
        if (audio.paused) {
            playTrack();
        } else {
            pauseTrack();
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
            loadTrack(currentIndex + 1, true, { autoTransition: isAutoEnded });
        } else if (repeatMode === "all" || !isAutoEnded) {
            loadTrack(0, true, { autoTransition: isAutoEnded });
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
    previousButton.addEventListener("click", previousTrack);
    nextButton.addEventListener("click", () => nextTrack(false));

    syncShuffleRepeatButtonsUI();

    shuffleButton.addEventListener("click", () => {
        setShuffleModeState(!isShuffle);
    });

    repeatButton.addEventListener("click", () => {
        const modes = ["off", "all", "one"];
        repeatMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
        localStorage.setItem("spotifake_repeat", repeatMode);
        syncShuffleRepeatButtonsUI();

        const modeMessages = {
            off: "Repeat off",
            all: "Repeat all",
            one: "Repeat current track"
        };
        showToast(modeMessages[repeatMode]);
    });

    if (playerFavBtn) {
        playerFavBtn.addEventListener("click", () => {
            const currentSong = getCurrentSong();
            if (currentSong) toggleFavorite(currentSong.id);
        });
    }

    let spotlightTrackIndex = 8; // Default to Song 9: Timeless
    let isDeckShuffling = false;
    let deckCards = [];

    function updateSpotlightCardContent(cardEl, songIdx) {
        if (!cardEl || !songs.length) return;
        const len = songs.length;
        const normalizedIdx = ((songIdx % len) + len) % len;
        const track = songs[normalizedIdx];
        if (!track) return;
        cardEl.dataset.songIdx = String(normalizedIdx);
        const coverEl = cardEl.querySelector(".spotlight-cover-fade");
        const titleEl = cardEl.querySelector(".spotlight-card-title");
        const artistEl = cardEl.querySelector(".spotlight-card-artist");
        if (coverEl) coverEl.style.backgroundImage = `url('${track.cover}')`;
        if (titleEl) titleEl.textContent = track.title;
        if (artistEl) artistEl.textContent = track.artist;
    }

    const spotlightMobileQuery = window.matchMedia("(max-width: 1023px)");
    const spotlightPhoneQuery = window.matchMedia("(max-width: 767px)");
    let spotlightScrollRaf = null;
    let isSpotlightLoopJumping = false;
    let isSpotlightTouching = false;

    function syncSpotlightDots(activeIdx) {
        const dotsWrap = $("#spotlightDots");
        if (!dotsWrap) return;
        const dots = [...dotsWrap.querySelectorAll(".spotlight-dot")];
        if (!dots.length) return;
        const activeDot = ((activeIdx % dots.length) + dots.length) % dots.length;
        dots.forEach((dot, i) => {
            const active = i === activeDot;
            dot.classList.toggle("is-active", active);
            dot.setAttribute("aria-current", active ? "true" : "false");
        });
    }

    function createSpotlightCardEl(songIdx) {
        const card = document.createElement("div");
        card.className = "featured-spotlight";
        card.innerHTML = `
            <div class="spotlight-cover-fade"></div>
            <div class="spotlight-info">
                <div class="spotlight-badge"><i class="fa-solid fa-fire"></i> FEATURED TRACK</div>
                <h3 class="spotlight-card-title"></h3>
                <p class="spotlight-card-artist"></p>
                <div class="spotlight-actions">
                    <button type="button" class="spotlight-play-btn" aria-label="Play featured track">
                        <i class="fa-solid fa-play"></i> Play Now
                    </button>
                </div>
            </div>
        `;
        updateSpotlightCardContent(card, songIdx);

        const playBtn = card.querySelector(".spotlight-play-btn");
        if (playBtn) {
            playBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const idxToPlay = Number(card.dataset.songIdx ?? spotlightTrackIndex);
                loadTrack(idxToPlay, true);
                displayLyricsPreviewView(songs[idxToPlay]?.id);
            });
        }
        return card;
    }

    function updateMobileSpotlightCenter() {
        if (!spotlightDeckWrap || !spotlightMobileQuery.matches) return;
        const cards = [...spotlightDeckWrap.querySelectorAll(".featured-spotlight")];
        if (!cards.length) return;

        // Pure layout coordinates (immune to transform feedback) + smooth scale-only growth/shrink
        const wrapCenter = spotlightDeckWrap.scrollLeft + spotlightDeckWrap.clientWidth / 2;
        let closest = null;
        let minDist = Infinity;

        cards.forEach((c) => {
            const unit = Math.max(c.offsetWidth, 1);
            const cCenter = c.offsetLeft + unit / 2;
            const dist = Math.abs(cCenter - wrapCenter);
            if (dist < minDist) {
                minDist = dist;
                closest = c;
            }

            const falloff = Math.min(1, dist / (unit * 1.05));
            const scale = 1.06 - falloff * 0.22; // grows to 1.06 in center, shrinks to 0.84 on sides
            const opacity = 1 - falloff * 0.44;

            c.style.transform = `scale(${scale.toFixed(3)})`;
            c.style.opacity = opacity.toFixed(3);
            c.style.zIndex = String(Math.max(1, Math.round(10 - falloff * 6)));
        });

        cards.forEach((c) => c.classList.toggle("is-center", c === closest));
        if (closest) {
            spotlightTrackIndex = Number(closest.dataset.songIdx ?? 0);
            syncSpotlightDots(spotlightTrackIndex);
        }
    }

    function checkMobileSpotlightLoop() {
        if (!spotlightDeckWrap || !spotlightMobileQuery.matches || isSpotlightLoopJumping || isSpotlightTouching) return;
        const total = songs.length;
        if (!total) return;
        const cards = [...spotlightDeckWrap.querySelectorAll(".featured-spotlight")];
        if (cards.length < total * 3) return;

        const firstMain = cards[total];
        const firstRightClone = cards[total * 2];
        const setWidth = firstRightClone.offsetLeft - firstMain.offsetLeft;
        const stride = setWidth / total;
        if (setWidth <= 0 || stride <= 0) return;

        const wrapCenterOffset = (spotlightDeckWrap.clientWidth - firstMain.offsetWidth) / 2;
        const minCenterLeft = firstMain.offsetLeft - wrapCenterOffset;
        const maxCenterLeft = firstRightClone.offsetLeft - wrapCenterOffset;
        const cur = spotlightDeckWrap.scrollLeft;

        // Only normalize once well past the boundary (1+ card into clone set) so active swipes never jump
        let nextLeft = null;
        if (cur < minCenterLeft - stride * 0.5) {
            nextLeft = cur + setWidth;
        } else if (cur > maxCenterLeft - stride * 0.5) {
            nextLeft = cur - setWidth;
        }

        if (nextLeft !== null) {
            isSpotlightLoopJumping = true;
            spotlightDeckWrap.style.scrollSnapType = "none";
            spotlightDeckWrap.style.scrollBehavior = "auto";
            spotlightDeckWrap.scrollLeft = nextLeft;
            updateMobileSpotlightCenter();
            requestAnimationFrame(() => {
                spotlightDeckWrap.style.scrollSnapType = "";
                spotlightDeckWrap.style.scrollBehavior = "";
                isSpotlightLoopJumping = false;
            });
        }
    }

    function initSpotlightDeck() {
        if (!spotlightDeckWrap || !songs.length) return;
        spotlightDeckWrap.innerHTML = "";
        deckCards = [];

        if (spotlightMobileQuery.matches) {
            // Mobile & Tablet: 3x looped horizontal side-scroll carousel
            const total = songs.length;
            for (let copy = 0; copy < 3; copy++) {
                for (let i = 0; i < total; i++) {
                    const card = createSpotlightCardEl(i);
                    card.addEventListener("click", (e) => {
                        if (e.target.closest(".spotlight-play-btn")) return;
                        card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                    });
                    spotlightDeckWrap.appendChild(card);
                    deckCards.push(card);
                }
            }

            requestAnimationFrame(() => {
                const targetCard = deckCards[total + (spotlightTrackIndex % total)];
                if (targetCard) {
                    const targetLeft = targetCard.offsetLeft - (spotlightDeckWrap.clientWidth - targetCard.offsetWidth) / 2;
                    spotlightDeckWrap.scrollLeft = Math.max(0, targetLeft);
                }
                updateMobileSpotlightCenter();
            });

            // Mobile-only pagination dots in bottom middle
            let dotsWrap = $("#spotlightDots");
            if (!dotsWrap && spotlightDeckWrap.parentNode) {
                dotsWrap = document.createElement("div");
                dotsWrap.id = "spotlightDots";
                dotsWrap.className = "spotlight-dots";
                dotsWrap.setAttribute("aria-label", "Featured track pagination");
                spotlightDeckWrap.parentNode.insertBefore(dotsWrap, spotlightDeckWrap.nextSibling);
            }
            if (dotsWrap) {
                dotsWrap.innerHTML = "";
                if (spotlightPhoneQuery.matches) {
                    for (let i = 0; i < 3; i++) {
                        const dot = document.createElement("button");
                        dot.type = "button";
                        dot.className = "spotlight-dot";
                        dot.setAttribute("aria-label", `Spotlight indicator ${i + 1}`);
                        dot.addEventListener("click", () => {
                            const cur = spotlightTrackIndex % total;
                            const step = i - (cur % 3);
                            const nextIdx = ((cur + step) % total + total) % total;
                            const targetCard = deckCards[total + nextIdx];
                            if (targetCard) {
                                targetCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                            }
                        });
                        dotsWrap.appendChild(dot);
                    }
                    syncSpotlightDots(spotlightTrackIndex % total);
                }
            }
            return;
        }

        const existingDots = $("#spotlightDots");
        if (existingDots) existingDots.innerHTML = "";

        for (let slot = 0; slot < 4; slot++) {
            const card = createSpotlightCardEl(spotlightTrackIndex + slot);
            card.dataset.slot = String(slot);
            card.style.transform = "";
            card.style.opacity = "";
            card.style.filter = "";
            card.style.zIndex = "";
            spotlightDeckWrap.appendChild(card);
            deckCards.push(card);
        }
    }

    function shuffleNextSpotlightCard() {
        if (!songs.length || deckCards.length < 4) return;

        // If the user clicks rapidly while a card is already mid-tuck, finish its reset cleanly first
        deckCards.forEach(c => c.classList.remove("is-tucking-to-back"));

        const frontCard = deckCards.find(c => c.dataset.slot === "0");
        const slot1Card = deckCards.find(c => c.dataset.slot === "1");
        const slot2Card = deckCards.find(c => c.dataset.slot === "2");
        const slot3Card = deckCards.find(c => c.dataset.slot === "3");

        if (!frontCard || !slot1Card || !slot2Card || !slot3Card) {
            isDeckShuffling = false;
            return;
        }

        // Advance active song index
        spotlightTrackIndex = (spotlightTrackIndex + 1) % songs.length;

        // Force layout reflow so rapid consecutive clicks trigger a fresh, silky animation
        void frontCard.offsetWidth;

        // Smoothly step cards 1, 2, 3 forward to 0, 1, 2 immediately
        slot1Card.dataset.slot = "0";
        slot2Card.dataset.slot = "1";
        slot3Card.dataset.slot = "2";

        // Animate the old front card sliding out left and tucking behind into slot 3
        frontCard.classList.add("is-tucking-to-back");
        frontCard.dataset.slot = "3";

        // Preload the new 4th song into the tucking card once it passes behind the stack
        setTimeout(() => {
            updateSpotlightCardContent(frontCard, spotlightTrackIndex + 3);
        }, 300);

        setTimeout(() => {
            frontCard.classList.remove("is-tucking-to-back");
            isDeckShuffling = false;
        }, 640);
    }

    initSpotlightDeck();

    if (spotlightDeckWrap) {
        let spotlightScrollEndTimer = null;

        spotlightDeckWrap.addEventListener("pointerdown", () => {
            isSpotlightTouching = true;
            clearTimeout(spotlightScrollEndTimer);
        }, { passive: true });

        ["pointerup", "pointercancel", "touchend"].forEach((evt) => {
            window.addEventListener(evt, () => {
                if (isSpotlightTouching) {
                    isSpotlightTouching = false;
                    clearTimeout(spotlightScrollEndTimer);
                    spotlightScrollEndTimer = setTimeout(checkMobileSpotlightLoop, 160);
                }
            }, { passive: true });
        });

        spotlightDeckWrap.addEventListener("click", (e) => {
            if (spotlightMobileQuery.matches) return;
            if (e.target.closest(".spotlight-play-btn")) return;
            shuffleNextSpotlightCard();
        });

        spotlightDeckWrap.addEventListener("scroll", () => {
            if (!spotlightMobileQuery.matches || isSpotlightLoopJumping) return;
            if (!spotlightScrollRaf) {
                spotlightScrollRaf = requestAnimationFrame(() => {
                    spotlightScrollRaf = null;
                    updateMobileSpotlightCenter();
                });
            }
            clearTimeout(spotlightScrollEndTimer);
            spotlightScrollEndTimer = setTimeout(checkMobileSpotlightLoop, 160);
        }, { passive: true });
    }

    spotlightMobileQuery.addEventListener("change", initSpotlightDeck);
    spotlightPhoneQuery.addEventListener("change", initSpotlightDeck);

    /* ==========================================================
       13. Audio Events & Progress Seeking (Dual-Deck Aware)
       ========================================================== */
    const savePlaybackState = (force = false) => {
        window.SpotifakePlayback?.save(() => audio, getCurrentSong, force);
    };

    window.addEventListener("pagehide", () => savePlaybackState(true));
    window.addEventListener("beforeunload", () => savePlaybackState(true));

    function bindDeckEvents(deck) {
        deck.addEventListener("play", () => {
            if (deck === audio) {
                updatePlayButton();
                savePlaybackState(true);
                syncNpvCanvasVideo(getCurrentSong()?.id, true);
            }
        });
        deck.addEventListener("pause", () => {
            if (deck === audio) {
                updatePlayButton();
                savePlaybackState(true);
                syncNpvCanvasVideo(getCurrentSong()?.id, false);
            }
        });

        deck.addEventListener("loadedmetadata", () => {
            if (deck !== audio) return;
            duration.textContent = formatTime(audio.duration);
            updateProgress();
        });

        deck.addEventListener("timeupdate", () => {
            if (deck !== audio) return;
            updateProgress();
            savePlaybackState(false);
            if (currentNpvSongId === getCurrentSong().id) {
                updateNpvLyricsPreview(audio.currentTime);
            }
            syncCenterLyricsView(audio.currentTime);

            // Trigger smooth automatic crossfade near the end of the current track
            if (
                crossfadeSeconds > 0 &&
                repeatMode !== "one" &&
                !autoCrossfadeTriggered &&
                !audio.paused &&
                !audio.ended &&
                Number.isFinite(audio.duration) &&
                audio.duration > crossfadeSeconds + 1.5
            ) {
                const remaining = audio.duration - audio.currentTime;
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
                playTrack();
            } else {
                nextTrack(true);
            }
        });
    }

    bindDeckEvents(deckA);
    bindDeckEvents(deckB);

    function updateProgress() {
        const total = audio.duration;
        if (!Number.isFinite(total) || total <= 0) return;

        const curFmt = formatTime(audio.currentTime);
        const totFmt = formatTime(total);
        currentTime.textContent = curFmt;
        duration.textContent = totFmt;
        if (npvCurrentTime) npvCurrentTime.textContent = curFmt;
        if (npvDuration) npvDuration.textContent = totFmt;

        if (!seekOnRelease) {
            const pct = (audio.currentTime / total) * 100;
            const roundedPct = Math.round(pct);
            progressBar.value = roundedPct;
            progressBar.style.background = `linear-gradient(to right, var(--loud-magenta) ${pct}%, #282834 ${pct}%)`;
            if (npvSeekSlider) {
                npvSeekSlider.value = roundedPct;
                npvSeekSlider.style.background = `linear-gradient(to right, var(--loud-magenta) ${pct}%, #282834 ${pct}%)`;
            }
        }
    }

    function seekToPosition() {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime = (Number(progressBar.value) / 100) * audio.duration;
        }
        seekOnRelease = false;
        updateProgress();
    }

    progressBar.addEventListener("input", () => {
        seekOnRelease = true;
        const total = audio.duration;
        if (Number.isFinite(total) && total > 0) {
            const target = (Number(progressBar.value) / 100) * total;
            currentTime.textContent = formatTime(target);
            const pct = progressBar.value;
            progressBar.style.background = `linear-gradient(to right, var(--loud-magenta) ${pct}%, #282834 ${pct}%)`;
        }
    });

    progressBar.addEventListener("change", seekToPosition);
    progressBar.addEventListener("pointerup", seekToPosition);

    /* ==========================================================
       14. Volume Controls
       ========================================================== */
    function updateVolumeUI() {
        const isMuted = isMasterMuted || masterVolume === 0;
        const icon = muteButton.querySelector("i");
        const iconClass = isMuted
            ? "fa-solid fa-volume-xmark"
            : masterVolume < 0.5
                ? "fa-solid fa-volume-low"
                : "fa-solid fa-volume-high";

        if (icon) {
            icon.className = iconClass;
        }
        if (npvMuteIcon) {
            npvMuteIcon.className = iconClass;
        }

        const pct = isMuted ? 0 : masterVolume * 100;
        volumeBar.value = isMuted ? 0 : masterVolume;
        volumeBar.style.background = `linear-gradient(to right, var(--loud-magenta) ${pct}%, #282834 ${pct}%)`;
        if (npvVolumeSlider) {
            npvVolumeSlider.value = isMuted ? 0 : masterVolume;
            npvVolumeSlider.style.background = `linear-gradient(to right, var(--loud-magenta) ${pct}%, #282834 ${pct}%)`;
        }
    }

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
        updateVolumeUI();
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
        updateVolumeUI();
    });

    updateVolumeUI();

    /* ==========================================================
       15. Spotify Synchronized Lyrics with Line Skipping
       ========================================================== */
    function parseLyricTimeValue(rawTime, useMmssFormat) {
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

    /* ==========================================================
       16. User Profile State, Spotify Account/Profile Page & Task Bar
       ========================================================== */
    const DEFAULT_USER_AVATAR = "../photos/spotifyICON/lydbayot.jpg";
    const DEFAULT_USER_PROFILE = {
        name: "JSON.TTUM",
        avatar: DEFAULT_USER_AVATAR,
        banner: null,
        gender: "Male",
        age: "20",
        description: "Cyber VIP Listener • R&B & Neo-Soul Enthusiast",
        bio: "Music hits harder in Deep Cyber Black & Neon Yellow. Late-night TrapSoul, Synth Funk, and 2000s R&B collector."
    };
    let userProfile = Object.assign(
        {},
        DEFAULT_USER_PROFILE,
        JSON.parse(localStorage.getItem("spotifake_user_profile") || "{}")
    );

    function saveUserProfileToStorage() {
        try {
            localStorage.setItem("spotifake_user_profile", JSON.stringify(userProfile));
        } catch (err) {
            // If a large uploaded banner/avatar exceeds localStorage quota, ensure name & text fields still save
            try {
                const compactProfile = { ...userProfile, banner: null };
                localStorage.setItem("spotifake_user_profile", JSON.stringify(compactProfile));
            } catch (err2) {
                try {
                    const minimalProfile = { ...userProfile, banner: null, avatar: DEFAULT_USER_AVATAR };
                    localStorage.setItem("spotifake_user_profile", JSON.stringify(minimalProfile));
                } catch (ignored) {}
            }
        }
        syncUserProfileHeaderUI();
        updateGreeting();
        if (typeof refreshAllPlaylistViews === "function") refreshAllPlaylistViews();
    }

    function syncUserProfileHeaderUI() {
        const displayName = (userProfile.name && userProfile.name.trim()) || "JSON.TTUM";
        const rawAvatar = userProfile.avatar || DEFAULT_USER_AVATAR;
        const avatarSrc = window.SpotifakePaths ? window.SpotifakePaths.asset(rawAvatar) : rawAvatar;
        const displayEmail = userProfile.email || localStorage.getItem("spotifake-user") || sessionStorage.getItem("spotifake-user") || "json.ttum@spotifake.io";

        $$(".profile-name, .taskbar-name, #modalAccount .modal-user-card h4, #modalProfile .modal-profile-header h2").forEach(el => {
            el.textContent = displayName;
        });
        $$("#modalAccount .modal-user-email").forEach(el => {
            el.textContent = displayEmail;
        });
        $$(".profile-avatar, .taskbar-avatar, .modal-user-avatar, .profile-big-avatar, .sp-mob-avatar-btn img").forEach(img => {
            img.src = avatarSrc;
            img.alt = `${displayName} Avatar`;
        });
    }

    function bindSafeBackdropClose(backdropEl, onClose) {
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

    syncUserProfileHeaderUI();

    /* Show the profile card in the center column on desktop. */
    function openFinalProfileCardModal(inCenter = false) {
        let existing = document.getElementById("spFinalProfileCardBackdrop");
        if (existing) existing.remove();

        // Refresh from localStorage in case updated across tabs
        userProfile = Object.assign(
            {},
            DEFAULT_USER_PROFILE,
            JSON.parse(localStorage.getItem("spotifake_user_profile") || "{}")
        );

        const rawAvatar = userProfile.avatar || DEFAULT_USER_AVATAR;
        const avatarSrc = window.SpotifakePaths ? window.SpotifakePaths.asset(rawAvatar) : rawAvatar;
        const bannerSrc = userProfile.banner || null;
        const customPls = getCustomPlaylistsFromStorage();
        const totalPlaylists = 1 + customPls.length;
        const favCount = favorites.size;
        const playsCount = recentlyPlayed.length;

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
                        <img src="${avatarSrc}" alt="${userProfile.name}">
                    </div>
                </div>

                <div class="sp-final-card-body">
                    <div class="sp-final-name-row">
                        <h2 class="sp-final-name">${userProfile.name || "JSON.TTUM"}</h2>
                        <span class="sp-final-vip-badge"><i class="fa-solid fa-bolt"></i> Cyber VIP</span>
                    </div>
                    <p class="sp-final-description">${userProfile.description || DEFAULT_USER_PROFILE.description}</p>

                    <div class="sp-final-meta-badges">
                        <div class="sp-final-meta-pill">
                            <i class="fa-solid fa-venus-mars"></i>
                            <div>
                                <span class="meta-label">Gender</span>
                                <span class="meta-val">${userProfile.gender || "Not specified"}</span>
                            </div>
                        </div>
                        <div class="sp-final-meta-pill">
                            <i class="fa-solid fa-cake-candles"></i>
                            <div>
                                <span class="meta-label">Age</span>
                                <span class="meta-val">${userProfile.age ? `${userProfile.age} yrs old` : "Not specified"}</span>
                            </div>
                        </div>
                    </div>

                    <div class="sp-final-bio-box">
                        <div class="sp-final-bio-label"><i class="fa-solid fa-address-card"></i> Bio & About Me</div>
                        <p class="sp-final-bio-text">${userProfile.bio || DEFAULT_USER_PROFILE.bio}</p>
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

        if (inCenter && window.innerWidth >= 1024 && homeAlbumArtistView) {
            showEntityPageView(false, true);
            homeAlbumArtistView.replaceChildren();
            const page = createCenteredProfilePage("Profile", "fa-id-card");
            page.classList.add("sp-center-profile-content");
            const card = backdrop.querySelector(".sp-final-profile-card");
            card.querySelector("#spFinalCloseBtn")?.remove();
            page.append(...card.children);
            homeAlbumArtistView.appendChild(page);
            homeAlbumArtistView.dataset.activeView = "profile";
            return;
        }

        backdrop.querySelector("#spFinalCloseBtn")?.addEventListener("click", () => backdrop.remove());
        bindSafeBackdropClose(backdrop, () => backdrop.remove());
        document.body.appendChild(backdrop);
    }

    /* Open Spotify-style "Profile details" Edit Modal (from Account -> Edit profile) */
    function openUserEditProfileModal() {
        let backdrop = document.getElementById("spProfileDetailsBackdrop");
        if (backdrop) return;

        const rawAvatar = userProfile.avatar || DEFAULT_USER_AVATAR;
        let pendingAvatar = window.SpotifakePaths ? window.SpotifakePaths.asset(rawAvatar) : rawAvatar;
        let pendingBanner = userProfile.banner;

        backdrop = document.createElement("div");
        backdrop.id = "spProfileDetailsBackdrop";
        backdrop.className = "sp-profile-details-backdrop open";
        backdrop.innerHTML = `
            <div class="sp-profile-details-modal" role="dialog" aria-modal="true" aria-labelledby="spProfileDetailsTitle" style="max-width:560px;">
                <div class="sp-profile-details-header">
                    <h2 id="spProfileDetailsTitle">Profile details</h2>
                    <button type="button" class="sp-profile-details-close" id="spProfileDetailsCloseBtn" aria-label="Close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="sp-profile-details-body" style="align-items:flex-start;">
                    <div class="sp-profile-details-avatar-picker" id="spAvatarPickerTrigger" title="Click to upload or change profile photo">
                        <img src="${pendingAvatar || DEFAULT_USER_AVATAR}" alt="Profile Photo" id="spAvatarPickerPreview">
                        <div class="picker-overlay">
                            <i class="fa-solid fa-pen"></i>
                            <span>Choose photo</span>
                        </div>
                        <input type="file" id="spAvatarFileInput" accept="image/*" style="display:none;">
                    </div>
                    <div class="sp-profile-details-fields">
                        <input type="text" class="sp-profile-details-input" id="spProfileNameInput" value="${userProfile.name || "JSON.TTUM"}" placeholder="Display name" maxlength="40">
                        <div class="sp-final-form-row-2">
                            <select class="sp-profile-details-input" id="spProfileGenderInput" style="padding:10px 12px;">
                                ${["Male", "Female", "Non-Binary", "Prefer not to say"].map(g =>
                                    `<option value="${g}" ${userProfile.gender === g ? "selected" : ""}>${g}</option>`
                                ).join("")}
                            </select>
                            <input type="number" class="sp-profile-details-input" id="spProfileAgeInput" value="${userProfile.age || "20"}" min="1" max="120" placeholder="Age" style="padding:10px 12px;">
                        </div>
                        <input type="text" class="sp-profile-details-input" id="spProfileDescInput" value="${userProfile.description || DEFAULT_USER_PROFILE.description}" placeholder="Description / Tagline" maxlength="90" style="padding:10px 12px;">
                        <textarea class="sp-profile-details-input" id="spProfileBioInput" placeholder="Bio / About you..." maxlength="280" rows="3" style="resize:vertical;padding:10px 12px;">${userProfile.bio || DEFAULT_USER_PROFILE.bio}</textarea>
                        <div class="sp-profile-banner-picker-box" id="spBannerPickerTrigger" style="${pendingBanner ? `background-image:url('${pendingBanner}');` : ""}" title="Click to upload or change profile banner">
                            <span><i class="fa-solid fa-image"></i> ${pendingBanner ? "Change Banner Image" : "Add Profile Banner"}</span>
                            <input type="file" id="spBannerFileInput" accept="image/*" style="display:none;">
                        </div>
                    </div>
                </div>
                <div class="sp-profile-details-actions">
                    <button type="button" class="sp-profile-details-save-btn" id="spProfileDetailsSaveBtn">Save</button>
                </div>
                <p class="sp-profile-details-disclaimer">
                    By proceeding, you agree to give Spotifake access to the image you choose to upload. Please make sure you have the right to upload the image.
                </p>
            </div>
        `;
        document.body.appendChild(backdrop);

        const scrollY = window.scrollY;
        const body = document.body;
        const previousBodyStyle = {
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            width: body.style.width,
            overflow: body.style.overflow
        };
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";

        function closeProfileDetailsModal() {
            if (!backdrop.isConnected) return;
            backdrop.remove();
            Object.assign(body.style, previousBodyStyle);
            const previousScrollBehavior = document.documentElement.style.scrollBehavior;
            document.documentElement.style.scrollBehavior = "auto";
            window.scrollTo(0, scrollY);
            document.documentElement.style.scrollBehavior = previousScrollBehavior;
        }

        const avatarTrigger = backdrop.querySelector("#spAvatarPickerTrigger");
        const avatarInput = backdrop.querySelector("#spAvatarFileInput");
        const avatarPreview = backdrop.querySelector("#spAvatarPickerPreview");
        const bannerTrigger = backdrop.querySelector("#spBannerPickerTrigger");
        const bannerInput = backdrop.querySelector("#spBannerFileInput");
        const nameInput = backdrop.querySelector("#spProfileNameInput");
        const genderInput = backdrop.querySelector("#spProfileGenderInput");
        const ageInput = backdrop.querySelector("#spProfileAgeInput");
        const descInput = backdrop.querySelector("#spProfileDescInput");
        const bioInput = backdrop.querySelector("#spProfileBioInput");

        avatarTrigger?.addEventListener("click", (e) => {
            if (e.target !== avatarInput) avatarInput.click();
        });
        avatarInput?.addEventListener("change", () => {
            const file = avatarInput.files && avatarInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                pendingAvatar = ev.target.result;
                if (avatarPreview) avatarPreview.src = pendingAvatar;
            };
            reader.readAsDataURL(file);
        });

        bannerTrigger?.addEventListener("click", (e) => {
            if (e.target !== bannerInput) bannerInput.click();
        });
        bannerInput?.addEventListener("change", () => {
            const file = bannerInput.files && bannerInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                pendingBanner = ev.target.result;
                bannerTrigger.style.backgroundImage = `url('${pendingBanner}')`;
                const span = bannerTrigger.querySelector("span");
                if (span) span.innerHTML = `<i class="fa-solid fa-image"></i> Change Banner Image`;
            };
            reader.readAsDataURL(file);
        });

        backdrop.querySelector("#spProfileDetailsCloseBtn")?.addEventListener("click", closeProfileDetailsModal);
        bindSafeBackdropClose(backdrop, closeProfileDetailsModal);

        backdrop.querySelector("#spProfileDetailsSaveBtn")?.addEventListener("click", () => {
            userProfile.name = (nameInput?.value || "").trim() || "JSON.TTUM";
            userProfile.gender = genderInput?.value || "Not specified";
            userProfile.age = (ageInput?.value || "").trim() || "20";
            userProfile.description = (descInput?.value || "").trim() || DEFAULT_USER_PROFILE.description;
            userProfile.bio = (bioInput?.value || "").trim() || DEFAULT_USER_PROFILE.bio;
            userProfile.avatar = pendingAvatar || DEFAULT_USER_AVATAR;
            userProfile.banner = pendingBanner || null;
            saveUserProfileToStorage();
            closeProfileDetailsModal();
            displayUserProfileInView();
            showToast("Profile updated!");
        });
    }

    /* Share User Profile Modal & Clipboard Helper */
    function shareUserProfileInfo() {
        const customPls = getCustomPlaylistsFromStorage();
        const totalPlaylists = 1 + customPls.length;
        const followingCount = followedArtists.size || 9;
        const topArtistNames = Object.keys(ARTIST_PROFILES).slice(0, 5);
        const shareText = [
            `👤 Spotifake Profile: ${userProfile.name || "JSON.TTUM"}`,
            `🎵 ${totalPlaylists} Public Playlist${totalPlaylists !== 1 ? "s" : ""} • ${followingCount} Following`,
            `🔥 Top Artists This Month: ${topArtistNames.join(", ")}`,
            `🔗 Link: ${window.location.origin}${window.location.pathname}#profile-${encodeURIComponent(userProfile.name || "JSON.TTUM")}`
        ].join("\n");

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText).catch(() => {});
        }
        showToast(`Copied ${userProfile.name}'s profile link & info to clipboard!`);
    }

    /* Render Spotify-Style User Account / Profile Page in #homeAlbumArtistView */
    let showAllTopArtistsInProfile = false;

    function displayUserProfileInView() {
        if (!homeAlbumArtistView) return;
        showEntityPageView(false, true);
        homeAlbumArtistView.replaceChildren();

        const customPls = getCustomPlaylistsFromStorage();
        const publicPlaylistCount = 1 + customPls.length;
        const followingCount = followedArtists.size > 0 ? followedArtists.size : 9;
        const allArtists = SIDEBAR_DATA.artists;
        const visibleArtists = showAllTopArtistsInProfile ? allArtists : allArtists.slice(0, 5);

        // Back bar
        const backBar = document.createElement("div");
        backBar.className = "sp-back-bar";
        backBar.innerHTML = `
            <button type="button" class="sp-back-btn" id="spUserBackHomeBtn" aria-label="Back">
                <i class="fa-solid fa-arrow-left"></i><span class="sp-account-back-label"> Back to Home</span>
            </button>
            <h2 class="sp-account-mobile-title">Account</h2>
            <span class="sp-account-header-spacer" aria-hidden="true"></span>
        `;
        homeAlbumArtistView.appendChild(backBar);
        backBar.querySelector("#spUserBackHomeBtn")?.addEventListener("click", () => {
            const params = new URLSearchParams(location.search);
            if (window.matchMedia("(max-width: 767px)").matches && params.get("view") === "account") {
                const from = params.get("from");
                returnFromMobileProfilePage(["home.html", "library.html", "playlist.html"].includes(from) ? from : "home.html");
            } else {
                showHomeDashboardView();
            }
        });

        // Hero Banner (with customizable banner & circular PFP)
        const hero = document.createElement("section");
        hero.className = `sp-user-profile-hero${userProfile.banner ? " has-custom-banner" : ""}`;
        if (userProfile.banner) {
            hero.style.backgroundImage = `url('${userProfile.banner}')`;
        }

        const avatarResolved = userProfile.avatar
            ? (window.SpotifakePaths ? window.SpotifakePaths.asset(userProfile.avatar) : userProfile.avatar)
            : "";
        const avatarHtml = avatarResolved
            ? `<img src="${avatarResolved}" alt="${userProfile.name}">`
            : `<div class="sp-user-avatar-default"><i class="fa-regular fa-user"></i></div>`;

        hero.innerHTML = `
            <button type="button" class="sp-user-banner-edit-pill" id="spUserEditBannerBtn" title="Add or change profile banner">
                <i class="fa-solid fa-camera"></i> ${userProfile.banner ? "Edit banner" : "Add banner"}
            </button>
            <div class="sp-user-avatar-wrap" id="spUserAvatarClickWrap" title="Click to edit profile picture">
                ${avatarHtml}
                <div class="sp-user-avatar-overlay">
                    <i class="fa-solid fa-pen"></i>
                    <span>Choose photo</span>
                </div>
            </div>
            <div class="sp-user-hero-text">
                <span class="sp-user-hero-label">Profile</span>
                <h1 class="sp-user-hero-name" id="spUserHeroNameHeading" title="Click to edit profile">${userProfile.name || "JSON.TTUM"}</h1>
                <div class="sp-user-hero-stats">
                    ${publicPlaylistCount} Public Playlist${publicPlaylistCount !== 1 ? "s" : ""} • <strong>${followingCount} Following</strong>
                </div>
            </div>
        `;
        homeAlbumArtistView.appendChild(hero);

        hero.querySelector("#spUserAvatarClickWrap")?.addEventListener("click", openUserEditProfileModal);
        hero.querySelector("#spUserHeroNameHeading")?.addEventListener("click", openUserEditProfileModal);
        hero.querySelector("#spUserEditBannerBtn")?.addEventListener("click", openUserEditProfileModal);

        // Action Bar: ONLY the 3 dots (...) button (NO settings gear icon)
        const dotsBar = document.createElement("div");
        dotsBar.className = "sp-user-dots-bar";
        dotsBar.innerHTML = `
            <button type="button" class="sp-user-dots-btn" id="spUserDotsBtn" aria-label="More options for ${userProfile.name}" title="More options">
                <i class="fa-solid fa-ellipsis"></i>
            </button>
            <div class="sp-user-dots-menu" id="spUserDotsMenu" role="menu">
                <button type="button" class="sp-user-dots-item" id="spDotsEditProfileBtn" role="menuitem">
                    <i class="fa-solid fa-pen"></i>
                    <span>Edit profile</span>
                </button>
                <button type="button" class="sp-user-dots-item" id="spDotsShareProfileBtn" role="menuitem">
                    <i class="fa-solid fa-arrow-up-from-bracket"></i>
                    <span>Share profile</span>
                </button>
            </div>
        `;
        homeAlbumArtistView.appendChild(dotsBar);

        const dotsBtn = dotsBar.querySelector("#spUserDotsBtn");
        const dotsMenu = dotsBar.querySelector("#spUserDotsMenu");

        dotsBtn?.addEventListener("click", (e) => {
            e.stopPropagation();
            dotsMenu?.classList.toggle("open");
        });

        dotsBar.querySelector("#spDotsEditProfileBtn")?.addEventListener("click", (e) => {
            e.stopPropagation();
            dotsMenu?.classList.remove("open");
            openUserEditProfileModal();
        });

        dotsBar.querySelector("#spDotsShareProfileBtn")?.addEventListener("click", (e) => {
            e.stopPropagation();
            dotsMenu?.classList.remove("open");
            shareUserProfileInfo();
        });

        document.addEventListener("click", (e) => {
            if (dotsMenu && !dotsBar.contains(e.target)) {
                dotsMenu.classList.remove("open");
            }
        }, { once: false });

        // Top artists this month section
        const topHeader = document.createElement("div");
        topHeader.className = "sp-user-top-header";
        topHeader.innerHTML = `
            <div>
                <h2>Top artists this month</h2>
                <p>Only visible to you</p>
            </div>
            <button type="button" class="sp-user-show-all-btn" id="spUserShowAllArtistsBtn">
                ${showAllTopArtistsInProfile ? "Show less" : "Show all"}
            </button>
        `;
        homeAlbumArtistView.appendChild(topHeader);

        topHeader.querySelector("#spUserShowAllArtistsBtn")?.addEventListener("click", () => {
            showAllTopArtistsInProfile = !showAllTopArtistsInProfile;
            displayUserProfileInView();
        });

        const artistsGrid = document.createElement("div");
        artistsGrid.className = "sp-user-top-artists-grid";
        visibleArtists.forEach(art => {
            const card = document.createElement("article");
            card.className = "sp-user-artist-circle-card";
            card.innerHTML = `
                <img src="${art.cover}" alt="${art.artistName}">
                <h4>${art.artistName}</h4>
                <span>Artist</span>
            `;
            card.addEventListener("click", () => displayArtistInView(art.artistName));
            artistsGrid.appendChild(card);
        });
        homeAlbumArtistView.appendChild(artistsGrid);
    }

    if (profileBtn && profileTaskbar) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = profileTaskbar.classList.toggle("open");
            profileBtn.setAttribute("aria-expanded", String(isOpen));
        });

        document.addEventListener("click", (e) => {
            if (
                !profileBtn.contains(e.target) &&
                !profileTaskbar.contains(e.target) &&
                !e.target.closest("#mobileProfileTrigger, [data-open-profile-menu]")
            ) {
                profileTaskbar.classList.remove("open");
                profileBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    function createCenteredProfilePage(title, icon) {
        const page = document.createElement("section");
        page.className = "sp-center-profile-page";
        const header = document.createElement("header");
        header.className = "sp-center-profile-header";
        header.innerHTML = `
            <button type="button" class="sp-back-btn"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to Home</button>
            <h1><i class="fa-solid ${icon}" aria-hidden="true"></i> ${title}</h1>
        `;
        header.querySelector(".sp-back-btn")?.addEventListener("click", () => showHomeDashboardView());
        page.appendChild(header);
        return page;
    }

    function showCenteredProfileModal(modalId, title, icon) {
        const overlay = document.getElementById(modalId);
        const panel = overlay?.querySelector(".cyber-modal");
        if (!panel || !homeAlbumArtistView) return;
        showEntityPageView(false, true);
        homeAlbumArtistView.replaceChildren();
        const page = createCenteredProfilePage(title, icon);
        panel.dataset.modalOverlay = modalId;
        panel.classList.add("sp-centered-modal-panel");
        page.appendChild(panel);
        homeAlbumArtistView.appendChild(page);
        homeAlbumArtistView.dataset.activeView = modalId === "modalRecents" ? "recents" : "settings";
        if (modalId === "modalRecents") renderRecentsList();
    }

    // Account opens the Spotify-style User Account page
    const taskAccountBtn = $("#taskAccount");
    if (taskAccountBtn) {
        taskAccountBtn.addEventListener("click", () => {
            if (profileTaskbar) profileTaskbar.classList.remove("open");
            if (profileBtn) profileBtn.setAttribute("aria-expanded", "false");
            displayUserProfileInView();
        });
    }

    // Profile opens in the center column on desktop.
    const taskProfileBtn = $("#taskProfile");
    if (taskProfileBtn) {
        taskProfileBtn.addEventListener("click", () => {
            if (profileTaskbar) profileTaskbar.classList.remove("open");
            if (profileBtn) profileBtn.setAttribute("aria-expanded", "false");
            openFinalProfileCardModal(window.innerWidth >= 1024);
        });
    }

    // Recents and Settings use the center column on desktop.
    const modalMap = {
        taskRecents: { modalId: "modalRecents", title: "Recents", icon: "fa-clock-rotate-left" },
        taskSettings: { modalId: "modalSettings", title: "Settings", icon: "fa-gear" }
    };

    Object.entries(modalMap).forEach(([btnId, { modalId, title, icon }]) => {
        const btn = $(`#${btnId}`);
        const modal = $(`#${modalId}`);

        if (btn && modal) {
            btn.addEventListener("click", () => {
                profileTaskbar.classList.remove("open");
                profileBtn.setAttribute("aria-expanded", "false");
                if (window.innerWidth >= 1024) showCenteredProfileModal(modalId, title, icon);
                else openModal(modalId);
            });
        }
    });

    function openModal(modalId) {
        const modal = $(`#${modalId}`);
        if (!modal) return;
        modal.removeAttribute("hidden");
        document.body.style.overflow = "hidden";

        if (modalId === "modalRecents") renderRecentsList();
        if (modalId === "modalProfile") updateProfileStats();
    }

    function closeModal(modalId) {
        const modal = $(`#${modalId}`);
        if (!modal) return;
        if (homeAlbumArtistView?.querySelector(`.sp-centered-modal-panel[data-modal-overlay="${modalId}"]`)) {
            showHomeDashboardView();
            return;
        }
        modal.setAttribute("hidden", "true");
        document.body.style.overflow = "";
    }

    $$("[data-close]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-close");
            closeModal(modalId);
        });
    });

    $$(".cyber-modal-overlay").forEach((overlay) => {
        bindSafeBackdropClose(overlay, () => {
            overlay.setAttribute("hidden", "true");
            document.body.style.overflow = "";
        });
    });

    // Preserve the saved profile so the login page can greet the current user.
    const taskLogout = $("#taskLogout");
    if (taskLogout) {
        taskLogout.addEventListener("click", () => {
            sessionStorage.removeItem("spotifake-user");
            localStorage.removeItem("spotifake-user");
            window.location.href = "../index.html";
        });
    }

    // Recently Played Logic
    function addRecentlyPlayed(songId) {
        const id = Number(songId);
        recentlyPlayed = recentlyPlayed.filter(itemId => itemId !== id);
        recentlyPlayed.unshift(id);
        if (recentlyPlayed.length > 20) recentlyPlayed.pop();

        localStorage.setItem("spotifake_recents", JSON.stringify(recentlyPlayed));
        if (recentsCount) recentsCount.textContent = recentlyPlayed.length;
    }

    function renderRecentsList() {
        const container = $("#recentsListContainer");
        if (!container) return;
        container.replaceChildren();

        if (recentlyPlayed.length === 0) {
            container.innerHTML = '<li class="empty-recents">No songs played yet. Start listening!</li>';
            return;
        }

        recentlyPlayed.forEach(id => {
            const song = songs.find(s => s.id === id);
            if (!song) return;

            const li = document.createElement("li");
            li.className = "recents-item";
            li.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div>
                    <p class="recents-item-title">${song.title}</p>
                    <p class="recents-item-artist">${song.artist}</p>
                </div>
                <i class="fa-solid fa-play" style="margin-left: auto; color: var(--neon-yellow);"></i>
            `;

            li.addEventListener("click", () => {
                const sIdx = songs.findIndex(s => s.id === id);
                if (sIdx !== -1) {
                    loadTrack(sIdx, true);
                    closeModal("modalRecents");
                }
            });

            container.appendChild(li);
        });
    }

    const clearRecentsBtn = $("#clearRecentsBtn");
    if (clearRecentsBtn) {
        clearRecentsBtn.addEventListener("click", () => {
            recentlyPlayed = [];
            localStorage.removeItem("spotifake_recents");
            if (recentsCount) recentsCount.textContent = "0";
            renderRecentsList();
        });
    }

    function updateProfileStats() {
        if (statFavoritesCount) statFavoritesCount.textContent = favorites.size;
        if (statPlaysCount) statPlaysCount.textContent = recentlyPlayed.length;
    }

    /* ==========================================================
       17. Live Search & Category Filtering
       ========================================================== */
    const podcastSection = $("#podcastSection");
    const podcastGrid = $("#podcastGrid");
    const followingSection = $("#followingSection");
    const followingFeedGrid = $("#followingFeedGrid");
    const songGrid = $("#songGrid");
    const musicSection = $(".music-section");
    const mobileMusicPillGroup = $("#mobileMusicPillGroup");
    const desktopMusicPillGroup = $("#desktopMusicPillGroup");

    // Featured Podcast episodes featuring each song
    const PODCAST_EPISODES = [
        { songId: 1, show: "R&B Rewind", episode: "Chris Brown & Bryson Tiller: The TrapSoul Chemistry", host: "DJ Marcus", cover: "../photos/ItDepends.jpg", desc: "Deep dive into the smooth nocturnal sound of 'It Depends' and how Brown & Tiller redefine modern R&B collaboration." },
        { songId: 2, show: "2000s Pop Vault", episode: "With You: The Anthem of a Generation", host: "Lisa Chen", cover: "../photos/WithYou.jpg", desc: "Breaking down the acoustic guitar riff and passionate vocals that made 'With You' one of Chris Brown's signature love songs." },
        { songId: 3, show: "Neo-Soul Sessions", episode: "Kehlani x Usher: When Icons Collide", host: "DJ Flow", cover: "../photos/ShouldaNever.jpg", desc: "Exploring the raw emotional tension of 'Shoulda Never' — Kehlani and Usher's unforgettable 2024 duet." },
        { songId: 4, show: "Grammy Gold", episode: "Ne-Yo's Because of You: The Song That Defined 2007", host: "Tony Rivers", cover: "../photos/BecauseofYou.jpg", desc: "An in-depth analysis of how 'Because of You' fused disco-funk rhythms with Ne-Yo's signature vocal style." },
        { songId: 5, show: "Feminist Anthems", episode: "Miss Independent: 15 Years of Empowerment", host: "Alicia Bowe", cover: "../photos/MissIndependent.jpg", desc: "Celebrating Ne-Yo's Grammy-winning tribute to powerful, independent women that still resonates today." },
        { songId: 6, show: "Acoustic R&B", episode: "Sexy Love: Ne-Yo's Most Intimate Track", host: "Marcus Bell", cover: "../photos/SexyLove.jpg", desc: "How 'Sexy Love' used acoustic guitar and heartfelt falsetto to create one of the decade's most romantic R&B hits." },
        { songId: 7, show: "Heartbreak Hour", episode: "So Sick: The Breakup Song That Hit #1 Worldwide", host: "Sia Kimura", cover: "../photos/SoSick.jpg", desc: "Ne-Yo's debut smash 'So Sick' — the story behind the song that made everyone feel seen after a breakup." },
        { songId: 8, show: "Alt R&B Radar", episode: "Ravyn Lenae's Love Me Not: Chicago's Finest Goes Viral", host: "DJ Nova", cover: "../photos/LoveMeNot.jpg", desc: "Ravyn Lenae's atmospheric neo-soul masterpiece 'Love Me Not' and its rise from underground to mainstream acclaim." },
        { songId: 9, show: "Synthwave Chronicles", episode: "Timeless: Pharrell + Weeknd = Pure Nostalgia", host: "Alex Nova", cover: "../photos/Timeless.jpg", desc: "Breaking down how 'Timeless' by The Weeknd & Playboi Carti channels early 2000s Neptunes energy into a modern anthem." },
        { songId: 10, show: "Viral Hits Decoded", episode: "Million Dollar Baby: How Tommy Richman Went Platinum Overnight", host: "KC Williams", cover: "../photos/MillionDollarBaby.jpg", desc: "The story of Tommy Richman's independent breakout — the vintage 80s funk groove that took over TikTok and Billboard." }
    ];

    function renderPodcasts() {
        if (!podcastGrid) return;
        podcastGrid.replaceChildren();
        PODCAST_EPISODES.forEach(ep => {
            const song = songs.find(s => s.id === ep.songId);
            const card = document.createElement("article");
            card.className = "podcast-card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", `Play ${ep.episode}`);
            card.innerHTML = `
                <img src="${ep.cover}" alt="${ep.episode}" class="podcast-cover" loading="lazy">
                <div class="podcast-info">
                    <p class="podcast-episode-label"><i class="fa-solid fa-podcast"></i> ${ep.show}</p>
                    <p class="podcast-title">${ep.episode}</p>
                    <p class="podcast-desc">${ep.desc}</p>
                    <button class="podcast-play-btn" type="button">
                        <i class="fa-solid fa-play"></i> Play "${song ? song.title : ''}"
                    </button>
                </div>
            `;
            const playBtn = card.querySelector(".podcast-play-btn");
            if (playBtn && song) {
                const idx = songs.findIndex(s => s.id === song.id);
                playBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    loadTrack(idx, true);
                });
            }
            card.addEventListener("click", (e) => {
                if (e.target.closest("button")) return;
                if (song) loadTrack(songs.findIndex(s => s.id === song.id), true);
            });
            podcastGrid.appendChild(card);
        });
    }

    function renderFollowingSection() {
        if (!followingFeedGrid) return;
        followingFeedGrid.replaceChildren();

        const followedNames = Object.keys(ARTIST_PROFILES).filter(name => followedArtists.has(name));
        const unfollowedNames = Object.keys(ARTIST_PROFILES).filter(name => !followedArtists.has(name));
        const currentSong = getCurrentSong();

        function createDiscoverArtistChip(name) {
            const prof = ARTIST_PROFILES[name];
            const artistSongs = getSongsByArtist(name);
            const chip = document.createElement("div");
            chip.className = "sp-discover-artist-chip";
            chip.setAttribute("role", "button");
            chip.tabIndex = 0;
            chip.title = `Open ${name}'s Profile`;
            chip.innerHTML = `
                <img src="${prof.pfp}" alt="${name}">
                <div class="sp-discover-artist-chip-info">
                    <strong>${name}</strong>
                    <small style="display:block;font-size:10px;color:var(--text-muted);">${artistSongs.length} song${artistSongs.length !== 1 ? "s" : ""}</small>
                    <button type="button">+ Follow</button>
                </div>
            `;
            chip.querySelector("button").addEventListener("click", (e) => {
                e.stopPropagation();
                followedArtists.add(name);
                localStorage.setItem("spotifake_followed_artists", JSON.stringify([...followedArtists]));
                showToast(`Following ${name}`);
                updateArtistDetails(currentNpvSongId);
                renderFollowingSection();
            });
            chip.addEventListener("click", () => displayArtistInView(name));
            chip.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    displayArtistInView(name);
                }
            });
            return chip;
        }

        if (followedNames.length === 0) {
            const emptyBox = document.createElement("div");
            emptyBox.className = "sp-following-discover-box";
            emptyBox.innerHTML = `
                <h3><i class="fa-solid fa-user-plus"></i> No Followed Artists Yet</h3>
                <p>Follow artists below to see all of their tracks collected here in your Following feed.</p>
                <div class="sp-discover-artists-grid" id="followingEmptyDiscoverGrid"></div>
            `;
            const dGrid = emptyBox.querySelector("#followingEmptyDiscoverGrid");
            unfollowedNames.forEach(name => dGrid.appendChild(createDiscoverArtistChip(name)));
            followingFeedGrid.appendChild(emptyBox);
            return;
        }

        followedNames.forEach(artistName => {
            const prof = ARTIST_PROFILES[artistName];
            const artistSongs = getSongsByArtist(artistName);
            const card = document.createElement("article");
            card.className = "sp-following-artist-card";
            card.innerHTML = `
                <div class="sp-following-card-head">
                    <div class="sp-following-artist-ident" title="Open ${artistName}'s Profile">
                        <img src="${prof.pfp}" alt="${artistName}">
                        <div class="sp-following-artist-meta">
                            <h3>${artistName}</h3>
                            <span>${prof.genre} • ${artistSongs.length} song${artistSongs.length !== 1 ? "s" : ""}</span>
                        </div>
                    </div>
                    <div class="sp-following-head-actions">
                        <button type="button" class="sp-follow-toggle-btn is-following">Following ✓</button>
                    </div>
                </div>
                <div class="sp-following-songs-list"></div>
            `;

            card.querySelector(".sp-following-artist-ident").addEventListener("click", () => {
                displayArtistInView(artistName);
            });

            card.querySelector(".sp-follow-toggle-btn").addEventListener("click", () => {
                followedArtists.delete(artistName);
                localStorage.setItem("spotifake_followed_artists", JSON.stringify([...followedArtists]));
                showToast(`Unfollowed ${artistName}`);
                updateArtistDetails(currentNpvSongId);
                renderFollowingSection();
            });

            const listEl = card.querySelector(".sp-following-songs-list");
            artistSongs.forEach(s => {
                const sIdx = songs.findIndex(x => x.id === s.id);
                const isPlayingRow = currentSong && currentSong.id === s.id && !audio.paused;
                const albumObj = findAlbumForSong(s.id);
                const row = document.createElement("div");
                row.className = `sp-following-song-row${isPlayingRow ? " is-playing" : ""}`;
                row.innerHTML = `
                    <img src="${s.cover}" alt="${s.title}">
                    <div class="sp-following-song-info">
                        <strong>${s.title}</strong>
                        <small>${s.artist}${albumObj ? " • " + albumObj.title : ""}</small>
                    </div>
                    <div class="sp-following-row-actions">
                        <button type="button" class="sp-icon-btn sp-fl-add-btn" title="Add to Playlist">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <button type="button" class="sp-following-play-circle" title="Play ${s.title}">
                            <i class="fa-solid ${isPlayingRow ? "fa-pause" : "fa-play"}"></i>
                        </button>
                    </div>
                `;
                row.querySelector(".sp-fl-add-btn").addEventListener("click", (e) => {
                    e.stopPropagation();
                    openAddToPlaylistModal(s.id);
                });
                row.addEventListener("click", () => {
                    if (sIdx !== -1) {
                        handleCardPlay(sIdx);
                        renderFollowingSection();
                    }
                });
                listEl.appendChild(row);
            });

            followingFeedGrid.appendChild(card);
        });

        if (unfollowedNames.length > 0) {
            const moreBox = document.createElement("div");
            moreBox.className = "sp-following-discover-box";
            moreBox.innerHTML = `
                <h3>More Artists to Follow</h3>
                <p>Discover more artists in Spotifake and add their music to this feed.</p>
                <div class="sp-discover-artists-grid" id="followingMoreDiscoverGrid"></div>
            `;
            const mGrid = moreBox.querySelector("#followingMoreDiscoverGrid");
            unfollowedNames.forEach(name => mGrid.appendChild(createDiscoverArtistChip(name)));
            followingFeedGrid.appendChild(moreBox);
        }
    }

    function filterMedia() {
        const query = searchInput.value.trim().toLowerCase();
        const activePill = $(".filter-pill.active");
        const category = activePill ? activePill.dataset.category : "all";

        const isMusicExpanded = category === "music" || category === "following";
        mobileMusicPillGroup?.classList.toggle("is-expanded", isMusicExpanded);
        desktopMusicPillGroup?.classList.toggle("is-expanded", isMusicExpanded);

        const showPodcasts = category === "podcasts";
        const showFollowing = category === "following";

        if (clearSearch) {
            clearSearch.hidden = query.length === 0;
        }

        if (podcastSection) podcastSection.hidden = !showPodcasts;
        if (followingSection) followingSection.hidden = !showFollowing;
        if (musicSection) musicSection.style.display = (showPodcasts || showFollowing) ? "none" : "";

        if (showPodcasts) {
            renderPodcasts();
            if (resultCounter) resultCounter.textContent = `Showing 10 featured podcast episodes`;
            if (searchStatus) searchStatus.hidden = true;
            return;
        }

        if (showFollowing) {
            renderFollowingSection();
            if (resultCounter) resultCounter.textContent = `Following ${followedArtists.size} artist${followedArtists.size !== 1 ? "s" : ""}`;
            if (searchStatus) searchStatus.hidden = true;
            return;
        }

        let visibleCount = 0;

        // Check for exact song title match first for strict single-song isolation
        const exactMatchIndex = query ? songs.findIndex(s => s.title.toLowerCase() === query) : -1;

        cards.forEach((card, index) => {
            const song = songs[index];
            let matchesQuery = false;
            if (!query) {
                matchesQuery = true;
            } else if (exactMatchIndex !== -1) {
                matchesQuery = (index === exactMatchIndex);
            } else {
                matchesQuery = song.title.toLowerCase().includes(query) ||
                    song.artist.toLowerCase().includes(query);
            }

            const isVisible = matchesQuery;
            card.hidden = !isVisible;
            card.style.display = isVisible ? "flex" : "none";
            if (isVisible) visibleCount++;
        });

        if (resultCounter) {
            resultCounter.textContent = `Showing ${visibleCount} of ${songs.length} songs`;
        }

        if (searchStatus) {
            if (visibleCount === 0) {
                searchStatus.hidden = false;
                searchStatus.textContent = `No tracks found matching "${searchInput.value}".`;
            } else {
                searchStatus.hidden = true;
            }
        }
    }

    searchInput.addEventListener("input", filterMedia);

    if (clearSearch) {
        clearSearch.addEventListener("click", () => {
            searchInput.value = "";
            filterMedia();
            searchInput.focus();
        });
    }

    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            filterMedia();
        });
    }

    filterPills.forEach((pill) => {
        pill.addEventListener("click", () => {
            filterPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            filterMedia();
        });
    });

    /* ==========================================================
       18. Keyboard Shortcuts & Spotify Phone UI Navigation
       ========================================================== */
    const mobileNavItems = $$(".mobile-bottom-nav .mobile-nav-item");
    const mobileCreateBtn = $("#mobileCreateBtn");
    const mobileCreateIcon = $("#mobileCreateIcon");
    const mobileCreateBackdrop = $("#mobileCreateBackdrop");
    const mobileCreateSheet = $("#mobileCreateSheet");

    function setActiveMobileNav(activeEl) {
        mobileNavItems.forEach(item => {
            if (item !== mobileCreateBtn) {
                item.classList.toggle("active", item === activeEl);
            }
        });
    }

    function openMobileCreateSheet() {
        if (!mobileCreateSheet || !mobileCreateBackdrop) return;
        mobileCreateBackdrop.removeAttribute("hidden");
        mobileCreateSheet.removeAttribute("hidden");
        mobileCreateBtn?.classList.add("sheet-open");
        mobileCreateBtn?.setAttribute("aria-expanded", "true");
        if (mobileCreateIcon) mobileCreateIcon.className = "fa-solid fa-xmark";
    }

    function closeMobileCreateSheet() {
        mobileCreateBackdrop?.setAttribute("hidden", "");
        mobileCreateSheet?.setAttribute("hidden", "");
        mobileCreateBtn?.classList.remove("sheet-open");
        mobileCreateBtn?.setAttribute("aria-expanded", "false");
        if (mobileCreateIcon) mobileCreateIcon.className = "fa-solid fa-plus";
    }

    function toggleMobileCreateSheet() {
        const isOpen = mobileCreateSheet && !mobileCreateSheet.hasAttribute("hidden");
        if (isOpen) closeMobileCreateSheet();
        else openMobileCreateSheet();
    }

    mobileCreateBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMobileCreateSheet();
    });
    mobileCreateBackdrop?.addEventListener("click", closeMobileCreateSheet);

    // Create Sheet Actions — Strictly Playlist Features Only
    $("#sheetCreatePlaylistAction")?.addEventListener("click", () => {
        closeMobileCreateSheet();
        openHomeCreatePlaylistModal();
    });
    $("#sheetAddCurrentSongAction")?.addEventListener("click", () => {
        closeMobileCreateSheet();
        const currentSong = getCurrentSong();
        if (currentSong) openAddToPlaylistModal(currentSong.id);
    });
    $("#sheetOpenLikedAction")?.addEventListener("click", () => {
        closeMobileCreateSheet();
        closeArtistPanelDrawer();
        displayPlaylistInView("liked");
        setActiveMobileNav($("#mobileFavBtn"));
    });
    $("#sheetManagePlaylistsAction")?.addEventListener("click", () => {
        closeMobileCreateSheet();
        closeArtistPanelDrawer();
        showFullLibraryView();
        const plPill = $("#homeLibTabs .lib-cat-pill[data-tab='playlists']");
        plPill?.click();
        setActiveMobileNav($("#mobileLibraryBtn"));
    });

    // Mobile Home Top Pills & Profile Taskbar Triggers
    const mobFilterPills = $$("#mobileHomeTopStrip .sp-mob-pill");
    function syncMobileFilterPills(category) {
        const expanded = category === "music" || category === "following";
        mobileMusicPillGroup?.classList.toggle("is-expanded", expanded);
        desktopMusicPillGroup?.classList.toggle("is-expanded", expanded);
        mobFilterPills.forEach(p => {
            const match = p.dataset.mobCat === category;
            p.classList.toggle("active", match);
            p.setAttribute("aria-selected", String(match));
        });
    }

    mobFilterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            const cat = pill.dataset.mobCat || "all";
            syncMobileFilterPills(cat);
            const targetPill = $(`.category-filters .filter-pill[data-category='${cat}']`);
            if (targetPill) targetPill.click();
        });
    });

    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            syncMobileFilterPills(pill.dataset.category || "all");
        });
    });

    $$("#mobileProfileTrigger, [data-open-profile-menu]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeMobileCreateSheet();
            if (profileTaskbar) {
                const open = profileTaskbar.classList.toggle("open");
                profileBtn?.setAttribute("aria-expanded", String(open));
            }
        });
    });

    // Spotify Phone Search View Logic (#homeSearchView)
    const mobilePageSearchInput = $("#mobilePageSearchInput");
    const mobilePageClearSearch = $("#mobilePageClearSearch");
    const mobileBrowseAllWrap = $("#mobileBrowseAllWrap");
    const mobileSearchResults = $("#mobileSearchResults");

    function renderMobileDiscoverRow() {
        const row = $("#mobileDiscoverRow");
        const prevBtn = $("#mobileDiscoverPrev");
        const nextBtn = $("#mobileDiscoverNext");
        if (!row) return;
        row.replaceChildren();
        const discoverMeta = [
            { songId: 9, tag: "#trapsoul" },
            { songId: 8, tag: "#poprnb" },
            { songId: 10, tag: "#darksynth" },
            { songId: 1, tag: "#rnbvibes" },
            { songId: 5, tag: "#neo2000s" },
            { songId: 2, tag: "#classic" },
            { songId: 3, tag: "#midnightrnb" },
            { songId: 6, tag: "#slowjam" }
        ];

        row._suppressClick = false;

        discoverMeta.forEach(entry => {
            const s = songs.find(x => x.id === entry.songId);
            if (!s) return;
            const card = document.createElement("button");
            card.type = "button";
            card.className = "sp-discover-card";
            card.innerHTML = `
                <img src="${s.cover}" alt="${s.title}" loading="lazy" draggable="false">
                <div class="sp-discover-overlay">
                    <span class="sp-discover-tag">${entry.tag}</span>
                    <span class="sp-discover-title">${s.title}</span>
                </div>
            `;
            card.addEventListener("click", (e) => {
                if (row._suppressClick) {
                    e.preventDefault();
                    return;
                }
                const idx = songs.findIndex(x => x.id === s.id);
                if (idx !== -1) loadTrack(idx, true);
            });
            row.appendChild(card);
        });

        const updateNavButtons = () => {
            if (!prevBtn || !nextBtn) return;
            prevBtn.disabled = row.scrollLeft <= 2;
            nextBtn.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;
        };

        if (!row.dataset.scrollBound) {
            row.dataset.scrollBound = "1";

            let isPointerDown = false;
            let startX = 0;
            let startScrollLeft = 0;
            let hasDragged = false;

            row.addEventListener("pointerdown", (e) => {
                if (e.pointerType !== "mouse" || e.button !== 0) return;
                isPointerDown = true;
                hasDragged = false;
                row._suppressClick = false;
                startX = e.clientX;
                startScrollLeft = row.scrollLeft;
                row.classList.add("is-dragging");
            });

            window.addEventListener("pointermove", (e) => {
                if (!isPointerDown) return;
                const dx = e.clientX - startX;
                if (Math.abs(dx) > 5) {
                    hasDragged = true;
                    row._suppressClick = true;
                }
                if (hasDragged) {
                    row.scrollLeft = startScrollLeft - dx;
                }
            });

            const endDrag = () => {
                if (!isPointerDown) return;
                isPointerDown = false;
                row.classList.remove("is-dragging");
                if (hasDragged) {
                    setTimeout(() => { row._suppressClick = false; }, 60);
                }
            };

            window.addEventListener("pointerup", endDrag);
            window.addEventListener("pointercancel", endDrag);

            row.addEventListener("wheel", (e) => {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    row.scrollLeft += e.deltaY;
                    e.preventDefault();
                }
            }, { passive: false });

            row.addEventListener("scroll", updateNavButtons, { passive: true });
            prevBtn?.addEventListener("click", () => row.scrollBy({ left: -240, behavior: "smooth" }));
            nextBtn?.addEventListener("click", () => row.scrollBy({ left: 240, behavior: "smooth" }));
        }

        requestAnimationFrame(updateNavButtons);
    }

    function updateMobileSearchResults() {
        if (!mobilePageSearchInput || !mobileSearchResults || !mobileBrowseAllWrap) return;
        const q = mobilePageSearchInput.value.trim().toLowerCase();
        if (mobilePageClearSearch) mobilePageClearSearch.hidden = q.length === 0;

        if (!q) {
            mobileBrowseAllWrap.style.display = "block";
            mobileSearchResults.style.display = "none";
            mobileSearchResults.replaceChildren();
            return;
        }

        mobileBrowseAllWrap.style.display = "none";
        mobileSearchResults.style.display = "flex";
        mobileSearchResults.replaceChildren();

        const matchedSongs = songs.filter(s =>
            s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
        );
        const matchedPlaylists = getCustomPlaylistsFromStorage().filter(p =>
            p.title.toLowerCase().includes(q)
        );
        const matchedArtists = SIDEBAR_DATA.artists.filter(a =>
            a.artistName.toLowerCase().includes(q)
        );

        if (matchedSongs.length === 0 && matchedPlaylists.length === 0 && matchedArtists.length === 0) {
            mobileSearchResults.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:28px 12px;font-size:13px;">No results found for "${mobilePageSearchInput.value}"</p>`;
            return;
        }

        matchedSongs.forEach(s => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "sp-search-res-row";
            btn.innerHTML = `
                <img src="${s.cover}" alt="${s.title}">
                <div class="sp-search-res-meta">
                    <strong>${s.title}</strong>
                    <span>Song • ${s.artist}</span>
                </div>
                <i class="fa-solid fa-play" style="color:var(--neon-yellow);font-size:13px;"></i>
            `;
            btn.addEventListener("click", () => {
                const idx = songs.findIndex(x => x.id === s.id);
                if (idx !== -1) loadTrack(idx, true);
            });
            mobileSearchResults.appendChild(btn);
        });

        matchedArtists.forEach(a => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "sp-search-res-row is-artist";
            btn.innerHTML = `
                <img src="${a.cover}" alt="${a.artistName}">
                <div class="sp-search-res-meta">
                    <strong>${a.artistName}</strong>
                    <span>Artist</span>
                </div>
                <i class="fa-solid fa-chevron-right" style="color:var(--text-muted);font-size:12px;"></i>
            `;
            btn.addEventListener("click", () => displayArtistInView(a.artistName));
            mobileSearchResults.appendChild(btn);
        });

        matchedPlaylists.forEach(pl => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "sp-search-res-row";
            btn.innerHTML = `
                <img src="${pl.cover || "../photos/ItDepends.jpg"}" alt="${pl.title}">
                <div class="sp-search-res-meta">
                    <strong>${pl.title}</strong>
                    <span>Playlist • ${(pl.songs || []).length} songs</span>
                </div>
                <i class="fa-solid fa-chevron-right" style="color:var(--text-muted);font-size:12px;"></i>
            `;
            btn.addEventListener("click", () => displayPlaylistInView(pl.id));
            mobileSearchResults.appendChild(btn);
        });
    }

    mobilePageSearchInput?.addEventListener("input", updateMobileSearchResults);
    mobilePageClearSearch?.addEventListener("click", () => {
        if (mobilePageSearchInput) {
            mobilePageSearchInput.value = "";
            updateMobileSearchResults();
            mobilePageSearchInput.focus();
        }
    });

    $$("#mobileBrowseGrid .sp-browse-card").forEach(card => {
        card.addEventListener("click", () => {
            const kind = card.dataset.browse;
            closeArtistPanelDrawer();
            if (kind === "all") {
                showHomeDashboardView();
                clearActiveFilter();
                $(".filter-pill[data-category='all']")?.click();
                setActiveMobileNav($("#mobileHomeBtn"));
            } else if (kind === "liked") {
                displayPlaylistInView("liked");
                setActiveMobileNav($("#mobileFavBtn"));
            } else if (kind === "podcasts") {
                showHomeDashboardView();
                $(".filter-pill[data-category='podcasts']")?.click();
                setActiveMobileNav($("#mobileHomeBtn"));
            } else if (kind === "rnb") {
                applySongIdFilter([1, 2, 3, 8, 9, 10], "Contemporary R&B & TrapSoul", "fa-solid fa-bolt");
                setActiveMobileNav($("#mobileHomeBtn"));
            } else if (kind === "classics") {
                applySongIdFilter([4, 5, 6, 7], "2000s Soul Classics — Ne-Yo", "fa-solid fa-compact-disc");
                setActiveMobileNav($("#mobileHomeBtn"));
            } else if (kind === "playlists") {
                showFullLibraryView();
                $("#homeLibTabs .lib-cat-pill[data-tab='playlists']")?.click();
                setActiveMobileNav($("#mobileLibraryBtn"));
            }
        });
    });

    $("#mobileHomeBtn")?.addEventListener("click", goToHomeUndisturbed);

    $("#mobileSearchBtn")?.addEventListener("click", (e) => {
        closeMobileCreateSheet();
        showMobileSearchView(e);
        closeArtistPanelDrawer();
        setActiveMobileNav(e.currentTarget);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    $("#mobileLibraryBtn")?.addEventListener("click", (e) => {
        closeMobileCreateSheet();
        showFullLibraryView(e);
        closeArtistPanelDrawer();
        setActiveMobileNav(e.currentTarget);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    $("#mobileFavBtn")?.addEventListener("click", (e) => {
        closeMobileCreateSheet();
        closeArtistPanelDrawer();
        displayPlaylistInView("liked");
        setActiveMobileNav(e.currentTarget);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.addEventListener("keydown", (e) => {
        if (isLyricsFullscreen) wakeLyricsFullscreenControls();
        if (e.key === "Escape") {
            if (isLyricsFullscreen) {
                exitLyricsFullscreen();
                return;
            }
            closeArtistPanelDrawer();
            closeMobileCreateSheet();
            $$(".cyber-modal-overlay").forEach(m => m.setAttribute("hidden", "true"));
            document.getElementById("spFinalProfileCardBackdrop")?.remove();
            document.getElementById("spProfileDetailsBackdrop")?.remove();
            if (profileTaskbar) profileTaskbar.classList.remove("open");
            return;
        }

        const typing = e.target.matches("input, textarea, select");
        if (e.code === "Space" && !typing) {
            e.preventDefault();
            togglePlay();
        }
    });

    /* ==========================================================
       19. Initialize App
       ========================================================== */
    initCustomCursor();
    updateGreeting();
    setupCards();
    setupSidebarSongs();
    renderMobileQuickPicks();
    updateFavoritesUI();
    if (window.SpotifakePlayback) {
        window.SpotifakePlayback.restore({
            list: songs,
            getAudio: () => audio,
            loadAt: loadTrack,
            onResume: (wasPlaying) => {
                updateProgress();
                if (wasPlaying) playTrack();
            }
        });
    } else {
        loadTrack(0, false);
    }
    updateArtistDetails(getCurrentSong()?.id || 1);
    updateVolumeUI();

    if (recentsCount) recentsCount.textContent = recentlyPlayed.length;

    /* ==========================================================
       20. Theme Switcher System
       ========================================================== */
    const THEMES = {
        cyber: { name: "\u26A1 Cyber Yellow & Magenta", swatches: ["#09090E", "#FFEA00", "#FF007F"] },
        emerald: { name: "\uD83C\uDFB5 Classic Spotify Emerald", swatches: ["#121212", "#1DB954", "#1ED760"] },
        cyberpunk: { name: "\uD83D\uDC9C Cyberpunk Violet", swatches: ["#0d0814", "#00f5d4", "#b5179e"] },
        crimson: { name: "\uD83D\uDD34 Blood Moon Crimson", swatches: ["#0e0608", "#ff4d6d", "#ff0054"] },
        "electric-blue": { name: "\uD83D\uDD35 Midnight Electric Blue", swatches: ["#080d1a", "#38bdf8", "#818cf8"] }
    };

    const themeSelect = $("#settingTheme");
    const themePreviewName = $("#themePreviewName");
    const themeSwatchRow = $("#themeSwatchRow");

    function applyTheme(themeName) {
        document.documentElement.setAttribute("data-theme", themeName);
        localStorage.setItem("spotifake_theme", themeName);
        const themeData = THEMES[themeName];
        if (!themeData) return;
        const resolvedAppearance = document.documentElement.getAttribute("data-appearance") || "dark";
        const baseSwatch = resolvedAppearance === "light"
            ? "#F3F5FA"
            : (resolvedAppearance === "pure-black" ? "#000000" : themeData.swatches[0]);
        const swatches = [baseSwatch, themeData.swatches[1], themeData.swatches[2]];
        if (themePreviewName) themePreviewName.textContent = themeData.name;
        if (themeSwatchRow) {
            themeSwatchRow.innerHTML = swatches.map(c =>
                '<span class="swatch" style="background:' + c + ';" title="' + c + '"></span>'
            ).join("");
        }
    }

    const savedTheme = localStorage.getItem("spotifake_theme") || "cyber";
    applyTheme(savedTheme);
    if (themeSelect) themeSelect.value = savedTheme;

    if (themeSelect) {
        themeSelect.addEventListener("change", () => {
            applyTheme(themeSelect.value);
        });
    }

    window.addEventListener("spotifake:appearance-change", () => {
        applyTheme(localStorage.getItem("spotifake_theme") || "cyber");
    });

    /* ==========================================================
       21. Custom Cursor Toggle (Settings)
       ========================================================== */
    const cursorToggle = $("#settingCursorToggle");

    function applyCursorSetting(enabled) {
        document.body.classList.toggle("cursor-disabled", !enabled);
        localStorage.setItem("spotifake_cursor", enabled ? "1" : "0");
        if (enabled) {
            document.body.style.cursor = "none";
        } else {
            document.body.style.cursor = "";
        }
    }

    const savedCursor = localStorage.getItem("spotifake_cursor");
    const cursorEnabled = savedCursor !== "0";
    if (cursorToggle) cursorToggle.checked = cursorEnabled;
    applyCursorSetting(cursorEnabled);

    if (cursorToggle) {
        cursorToggle.addEventListener("change", () => {
            applyCursorSetting(cursorToggle.checked);
        });
    }

    /* ==========================================================
       21b. Hide Home Hero Banner Toggle (Phones Only - Settings)
       ========================================================== */
    const hideMobileHeroToggle = $("#settingHideMobileHeroToggle");

    function applyHideMobileHeroSetting(hideOnPhone) {
        document.body.classList.toggle("hide-mobile-hero", !!hideOnPhone);
        localStorage.setItem("spotifake_hide_mobile_hero", hideOnPhone ? "1" : "0");
    }

    function syncHideMobileHeroFromStorage() {
        const hideOnPhone = localStorage.getItem("spotifake_hide_mobile_hero") === "1";
        if (hideMobileHeroToggle) hideMobileHeroToggle.checked = hideOnPhone;
        applyHideMobileHeroSetting(hideOnPhone);
    }

    syncHideMobileHeroFromStorage();
    window.addEventListener("pageshow", syncHideMobileHeroFromStorage);

    if (hideMobileHeroToggle) {
        hideMobileHeroToggle.addEventListener("change", () => {
            applyHideMobileHeroSetting(hideMobileHeroToggle.checked);
        });
    }

    /* ==========================================================
       21c. Audio Crossfade Selector (Settings)
       ========================================================== */
    const crossfadeSelect = $("#settingCrossfade");

    function applyCrossfadeSetting(seconds, showFeedback = false) {
        const parsed = Math.max(0, Number(seconds) || 0);
        crossfadeSeconds = parsed;
        localStorage.setItem("spotifake_crossfade", String(parsed));
        if (crossfadeSelect) crossfadeSelect.value = String(parsed);
        if (parsed === 0) stopActiveCrossfade(true);
        if (showFeedback) {
            showToast(parsed > 0 ? `Audio Crossfade: ${parsed}s` : "Audio Crossfade: Off");
        }
    }

    applyCrossfadeSetting(crossfadeSeconds, false);
    window.addEventListener("pageshow", () => {
        const s = localStorage.getItem("spotifake_crossfade");
        if (s !== null) applyCrossfadeSetting(Number(s), false);
    });

    if (crossfadeSelect) {
        crossfadeSelect.addEventListener("change", () => {
            applyCrossfadeSetting(crossfadeSelect.value, true);
        });
    }

    /* ==========================================================
   22. Sidebar Library Tabs, Recents Sort & Minimize
   ========================================================== */
    const libTabs = $$(".lib-tab");
    const libSortBtn = $("#libSortBtn");
    const libSortMenu = $("#libSortMenu");
    const homeLibSortBtn = $("#homeLibSortBtn");
    const homeLibSortMenu = $("#homeLibSortMenu");
    const sidebarLibrarySearch = $("#sidebarLibrarySearch");
    const sidebarMinimizeBtn = $("#sidebarMinimizeBtn");
    const libraryPanel = $(".library-panel");
    const mainContainer = $(".main");

    // Minimize / Collapse button ("Your Library" trigger with slide-in icon)
    let userDesktopSidebarCollapsed = false;
    let userDesktopPanelCollapsed = false;
    let currentBreakpointMode = "";

    if (sidebarMinimizeBtn && libraryPanel) {
        let iconHideTimer;
        sidebarMinimizeBtn.addEventListener("mouseenter", () => {
            clearTimeout(iconHideTimer);
            sidebarMinimizeBtn.classList.remove("hover-linger");
        });
        sidebarMinimizeBtn.addEventListener("mouseleave", () => {
            if (libraryPanel.classList.contains("collapsed")) return;
            sidebarMinimizeBtn.classList.add("hover-linger");
            clearTimeout(iconHideTimer);
            iconHideTimer = setTimeout(() => {
                sidebarMinimizeBtn.classList.remove("hover-linger");
            }, 3000);
        });
        sidebarMinimizeBtn.addEventListener("click", () => {
            clearTimeout(iconHideTimer);
            sidebarMinimizeBtn.classList.remove("hover-linger");
            const isCollapsed = libraryPanel.classList.toggle("collapsed");
            if (mainContainer) mainContainer.classList.toggle("sidebar-collapsed", isCollapsed);
            if (window.innerWidth >= 1024) {
                userDesktopSidebarCollapsed = isCollapsed;
            }
        });
    }

    function syncResponsiveBreakpoints() {
        const w = window.innerWidth;
        const mode = w >= 1024 ? "desktop" : (w >= 768 ? "tablet" : "mobile");
        if (mode === currentBreakpointMode) return;
        currentBreakpointMode = mode;

        const minPanelIcon = minimizeArtistPanel?.querySelector("i");
        if (minPanelIcon) {
            minPanelIcon.className = mode === "mobile"
                ? "fa-solid fa-chevron-down"
                : "fa-solid fa-table-columns";
        }

        if (mode === "desktop") {
            // Desktop (>= 1024px): Full 3-column view (Sidebar, Main Content, Track Info)
            if (libraryPanel) libraryPanel.classList.toggle("collapsed", userDesktopSidebarCollapsed);
            if (mainContainer) mainContainer.classList.toggle("sidebar-collapsed", userDesktopSidebarCollapsed);
            if (userDesktopPanelCollapsed) {
                closeArtistPanelDrawer();
            } else {
                openArtistPanel();
            }
        } else if (mode === "tablet") {
            // Tablet (768px - 1023px): Icon-only collapsible sidebar by default; Track Info collapsed into rail
            if (libraryPanel) libraryPanel.classList.add("collapsed");
            if (mainContainer) mainContainer.classList.add("sidebar-collapsed");
            closeArtistPanelDrawer();
        } else {
            // Mobile (< 768px): Bottom nav bar + floating mini-player; close Track Info drawer initially
            closeArtistPanelDrawer();
        }
    }

    syncResponsiveBreakpoints();
    window.addEventListener("resize", syncResponsiveBreakpoints);

    // Playlists, Albums, Artists Tabs
    libTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            libTabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
            activeSidebarTab = tab.dataset.libTab || "playlists";
            const sideCreateBtn = $("#sidebarCreatePlaylistBtn");
            if (sideCreateBtn) {
                const isAlb = activeSidebarTab === "albums";
                sideCreateBtn.title = isAlb ? "Create a new album" : "Create a new playlist";
                sideCreateBtn.setAttribute("aria-label", isAlb ? "Create album" : "Create playlist");
            }
            setupSidebarSongs();
        });
    });

    sidebarLibrarySearch?.addEventListener("input", () => {
        sidebarLibrarySearch.closest(".lib-search-wrap")?.classList.toggle("expanded", Boolean(sidebarLibrarySearch.value.trim()));
        setupSidebarSongs();
    });

    const sortLabels = {
        recents: "Recents",
        "recently-added": "Recently Added",
        az: "Alphabetical",
        creator: "Creator"
    };
    const viewIcons = {
        compact: "fa-bars",
        list: "fa-list-ul",
        "compact-grid": "fa-grip",
        grid: "fa-table-cells-large"
    };
    const syncLibrarySortControls = () => {
        ["#libSortLabel", "#homeLibSortLabel"].forEach(selector => {
            const label = $(selector);
            if (label) label.textContent = sortLabels[sidebarSortOrder];
        });
        const sidebarIcon = $("#libSortViewIcon");
        const expandedIcon = $("#homeLibSortViewIcon");
        const expandedMode = $("#homeLibItemsContainer")?.dataset.view || sidebarViewMode;
        if (sidebarIcon) sidebarIcon.className = `fa-solid ${viewIcons[sidebarViewMode]}`;
        if (expandedIcon) expandedIcon.className = `fa-solid ${viewIcons[expandedMode]}`;
        [[libSortMenu, sidebarViewMode], [homeLibSortMenu, expandedMode]].forEach(([menu, mode]) => {
            menu?.querySelectorAll("[data-sidebar-sort]").forEach(button => {
                const selected = button.dataset.sidebarSort === sidebarSortOrder;
                button.classList.toggle("selected", selected);
                button.setAttribute("aria-pressed", String(selected));
            });
            menu?.querySelectorAll("[data-sidebar-view]").forEach(button => {
                const selected = button.dataset.sidebarView === mode;
                button.classList.toggle("selected", selected);
                button.setAttribute("aria-pressed", String(selected));
            });
        });
    };
    const closeLibrarySortMenu = (menu, trigger) => {
        if (menu) menu.hidden = true;
        trigger?.setAttribute("aria-expanded", "false");
    };
    [[libSortBtn, libSortMenu], [homeLibSortBtn, homeLibSortMenu]].forEach(([trigger, menu]) => {
        trigger?.addEventListener("click", () => {
            if (!menu) return;
            menu.hidden = !menu.hidden;
            trigger.setAttribute("aria-expanded", String(!menu.hidden));
        });
        menu?.addEventListener("click", event => {
            const sortButton = event.target.closest("[data-sidebar-sort]");
            const viewButton = event.target.closest("[data-sidebar-view]");
            if (sortButton) sidebarSortOrder = sortButton.dataset.sidebarSort;
            if (viewButton) {
                if (menu === libSortMenu) sidebarViewMode = viewButton.dataset.sidebarView;
                else setHomeLibLayout(viewButton.dataset.sidebarView);
            }
            if (sortButton || viewButton) {
                setupSidebarSongs();
                renderHomeLibrary();
                syncLibrarySortControls();
            }
        });
    });
    document.addEventListener("click", event => {
        if (!libSortMenu?.hidden && !event.target.closest(".lib-search-row")) closeLibrarySortMenu(libSortMenu, libSortBtn);
        if (!homeLibSortMenu?.hidden && !event.target.closest(".lib-expanded-sort")) closeLibrarySortMenu(homeLibSortMenu, homeLibSortBtn);
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            [[libSortMenu, libSortBtn], [homeLibSortMenu, homeLibSortBtn]].forEach(([menu, trigger]) => {
                if (menu && !menu.hidden) {
                    closeLibrarySortMenu(menu, trigger);
                    trigger?.focus();
                }
            });
        }
    });
    syncLibrarySortControls();

    /* ==========================================================
       Add to Playlist Modal System
       ========================================================== */
    function openAddToPlaylistModal(songId) {
        // Remove existing modal if any
        const existing = document.getElementById("addToPlaylistModal");
        if (existing) existing.remove();

        const customPlaylists = JSON.parse(localStorage.getItem("spotifake_custom_playlists") || "[]");
        const song = songs.find(s => s.id === songId);
        if (!song) return;

        let playlistOptions = '<li class="atp-item atp-liked" data-target="liked"><i class="fa-solid fa-heart" style="color:var(--loud-magenta);"></i> Liked Songs</li>';
        customPlaylists.forEach(pl => {
            playlistOptions += `<li class="atp-item" data-target="${pl.id}"><i class="fa-solid fa-music" style="color:var(--neon-yellow);"></i> ${pl.title} <span style="margin-left:auto;font-size:11px;color:#aaa;">${(pl.songs || []).length} songs</span></li>`;
        });
        playlistOptions += `<li class="atp-item atp-create-new" data-target="__create__" style="border-top:1px solid rgba(255,255,255,0.1);margin-top:6px;padding-top:10px;color:var(--neon-yellow);font-weight:800;"><i class="fa-solid fa-plus"></i> Create New Playlist</li>`;

        const modalHTML = `
        <div class="modal-backdrop" id="addToPlaylistModal" style="display:flex;position:fixed;inset:0;background:rgba(0,0,0,0.7);justify-content:center;align-items:center;z-index:2000;">
            <div style="background:#0d0d14;border:2px solid #FF007F;border-radius:12px;padding:1.5rem;max-width:340px;width:90%;color:#fff;font-family:Montserrat,sans-serif;">
                <h3 style="color:#FFEA00;margin:0 0 0.5rem 0;font-size:1.1rem;">Add "${song.title}" to...</h3>
                <ul style="list-style:none;padding:0;margin:0.5rem 0;max-height:300px;overflow-y:auto;" id="atpList">
                    ${playlistOptions}
                </ul>
                <div style="display:flex;justify-content:flex-end;margin-top:1rem;">
                    <button id="atpCancelBtn" style="background:#333;border:none;color:#fff;padding:0.4rem 1rem;border-radius:6px;cursor:pointer;font-weight:bold;">Cancel</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML("beforeend", modalHTML);

        const modal = document.getElementById("addToPlaylistModal");
        document.getElementById("atpCancelBtn").addEventListener("click", () => modal.remove());
        modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });

        document.querySelectorAll(".atp-item").forEach(item => {
            item.style.cssText += "padding:10px 12px;cursor:pointer;border-radius:6px;margin:4px 0;display:flex;align-items:center;gap:8px;transition:background 0.2s;";
            item.addEventListener("mouseenter", () => { item.style.background = "#1a1a2e"; });
            item.addEventListener("mouseleave", () => { item.style.background = "transparent"; });
            item.addEventListener("click", () => {
                const target = item.dataset.target;
                if (target === "__create__") {
                    modal.remove();
                    openHomeCreatePlaylistModal();
                    return;
                }
                if (target === "liked") {
                    if (!favorites.has(songId)) {
                        favorites.add(songId);
                        localStorage.setItem("spotifake_favorites", JSON.stringify([...favorites]));
                        updateFavoritesUI();
                    }
                    refreshAllPlaylistViews();
                    showToast(`Added "${song.title}" to Liked Songs`);
                } else {
                    const playlists = JSON.parse(localStorage.getItem("spotifake_custom_playlists") || "[]");
                    const pl = playlists.find(p => p.id === target);
                    if (pl) {
                        if (!pl.songs) pl.songs = [];
                        if (!pl.songs.includes(songId)) {
                            pl.songs.push(songId);
                            localStorage.setItem("spotifake_custom_playlists", JSON.stringify(playlists));
                            refreshAllPlaylistViews();
                            showToast(`Added "${song.title}" to "${pl.title}"`);
                        } else {
                            showToast(`"${song.title}" is already in "${pl.title}"`);
                        }
                    }
                }
                modal.remove();
            });
        });
    }

    function showToast(message) {
        const existing = document.querySelector(".spotifake-toast");
        if (existing) existing.remove();

        const toast = document.createElement("div");
        toast.className = "spotifake-toast";
        toast.textContent = message;
        toast.style.cssText = "position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#FFEA00;color:#09090E;padding:10px 20px;border-radius:8px;font-weight:bold;font-size:14px;z-index:3000;font-family:Montserrat,sans-serif;box-shadow:0 4px 12px rgba(255,234,0,0.3);transition:opacity 0.3s;";
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 2500);
    }

    // Return to Home without reloading the document that owns the playing audio.
    let mobileProfileHistoryEntry = false;
    function returnFromMobileProfilePage(returnPage) {
        if (returnPage !== "home.html") {
            location.href = returnPage;
            return;
        }
        if (mobileProfileHistoryEntry) {
            mobileProfileHistoryEntry = false;
            history.back();
            return;
        }
        if (new URLSearchParams(location.search).has("view")) {
            history.replaceState(null, "", "home.html");
        }
        document.body.classList.remove("mobile-account-page");
        ["modalRecents", "modalSettings"].forEach(id => document.getElementById(id)?.setAttribute("hidden", ""));
        document.body.style.overflow = "";
        showHomeDashboardView();
    }

    // On phones, reuse the already loaded views so menu taps reveal a ready page.
    function showMobileProfilePage(view, from) {
        if (!window.matchMedia("(max-width: 767px)").matches) return;
        if (view === "account") {
            document.body.classList.add("mobile-account-page");
            displayUserProfileInView();
        } else if (view === "recents" || view === "settings") {
            const modalId = view === "recents" ? "modalRecents" : "modalSettings";
            const page = document.getElementById(modalId);
            if (page) {
                page.classList.add("mobile-subpage");
                page.removeAttribute("role");
                page.removeAttribute("aria-modal");
                page.querySelector(".cyber-modal-header h3").textContent = view === "recents" ? "Recents" : "Settings";
                page.querySelector(".modal-close")?.setAttribute("aria-label", "Back");
                const returnPage = ["home.html", "library.html", "playlist.html"].includes(from) ? from : "home.html";
                if (!page.dataset.mobileBackReady) {
                    page.dataset.mobileBackReady = "true";
                    page.querySelectorAll("[data-close]").forEach(button => {
                        button.addEventListener("click", event => {
                            event.preventDefault();
                            event.stopImmediatePropagation();
                            returnFromMobileProfilePage(returnPage);
                        }, true);
                    });
                }
                openModal(modalId);
            }
        }
    }

    window.openMobileProfilePage = view => {
        if (!["account", "recents", "settings"].includes(view) ||
            !window.matchMedia("(max-width: 767px)").matches) return false;
        history.pushState(null, "", `home.html?view=${view}&from=home.html`);
        mobileProfileHistoryEntry = true;
        showMobileProfilePage(view, "home.html");
        return true;
    };

    window.addEventListener("popstate", () => {
        if (!window.matchMedia("(max-width: 767px)").matches) return;
        const params = new URLSearchParams(location.search);
        const view = params.get("view");
        if (["account", "recents", "settings"].includes(view)) {
            showMobileProfilePage(view, params.get("from"));
        } else {
            mobileProfileHistoryEntry = false;
            document.body.classList.remove("mobile-account-page");
            closeModal("modalRecents");
            closeModal("modalSettings");
            showHomeDashboardView();
        }
    });

    const mobilePageParams = new URLSearchParams(location.search);
    showMobileProfilePage(mobilePageParams.get("view"), mobilePageParams.get("from"));
    window.dispatchEvent(new Event("spotifake:mobile-page-ready"));

    const nowPlayingHeader = document.querySelector(".sp-npv-header");
    if (nowPlayingHeader) {
        let hideHeaderControlsTimer;
        nowPlayingHeader.addEventListener("mouseenter", () => {
            clearTimeout(hideHeaderControlsTimer);
            nowPlayingHeader.classList.add("is-revealed");
        });
        nowPlayingHeader.addEventListener("mouseleave", () => {
            clearTimeout(hideHeaderControlsTimer);
            hideHeaderControlsTimer = setTimeout(() => {
                nowPlayingHeader.classList.remove("is-revealed");
            }, 2000);
        });
    }

    // Float the desktop scrollbar thumbs over each pane, without a visible track.
    [
        [".sidebar-song-list", ".library-panel"],
        [".main-right-part", ".main"],
        [".sp-npv-scroll", ".artist-detail-panel"]
    ].forEach(([scrollerSelector, hostSelector]) => {
        const scroller = document.querySelector(scrollerSelector);
        const host = document.querySelector(hostSelector);
        if (!scroller || !host) return;
        const hoverTarget = scrollerSelector === ".main-right-part" ? scroller : host;

        const rail = document.createElement("div");
        const thumb = document.createElement("div");
        rail.className = "sp-overlay-scrollbar";
        thumb.className = "sp-overlay-scrollbar-thumb";
        rail.setAttribute("aria-hidden", "true");
        rail.appendChild(thumb);
        host.appendChild(rail);
        scroller.classList.add("sp-overlay-scroll");

        let frame = 0;
        let thumbHeight = 0;
        let trackHeight = 0;
        let hideTimer;
        let isDragging = false;
        const update = () => {
            frame = 0;
            const scrollerRect = scroller.getBoundingClientRect();
            const hostRect = host.getBoundingClientRect();
            const maxScroll = scroller.scrollHeight - scroller.clientHeight;
            const desktop = window.innerWidth >= 1024;
            if (!desktop || maxScroll <= 1 || scrollerRect.height <= 0) {
                rail.style.display = "none";
                rail.classList.remove("is-visible");
                return;
            }

            rail.style.display = "block";
            if (hoverTarget.matches(":hover") || isDragging) rail.classList.add("is-visible");
            trackHeight = scrollerRect.height;
            thumbHeight = Math.max(32, trackHeight * scroller.clientHeight / scroller.scrollHeight);
            if (hostSelector === ".artist-detail-panel") {
                rail.style.left = "";
                rail.style.right = "2px";
            } else {
                rail.style.right = "";
                rail.style.left = `${scrollerRect.right - hostRect.left - 10}px`;
            }
            rail.style.top = `${scrollerRect.top - hostRect.top}px`;
            rail.style.height = `${trackHeight}px`;
            thumb.style.height = `${thumbHeight}px`;
            thumb.style.transform = `translateY(${scroller.scrollTop / maxScroll * (trackHeight - thumbHeight)}px)`;
        };
        const scheduleUpdate = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };

        thumb.addEventListener("pointerdown", event => {
            if (event.button !== 0) return;
            event.preventDefault();
            isDragging = true;
            clearTimeout(hideTimer);
            thumb.setPointerCapture(event.pointerId);
            const startY = event.clientY;
            const startScroll = scroller.scrollTop;
            const move = moveEvent => {
                const maxScroll = scroller.scrollHeight - scroller.clientHeight;
                const travel = trackHeight - thumbHeight;
                if (travel > 0) scroller.scrollTop = startScroll +
                    (moveEvent.clientY - startY) * maxScroll / travel;
            };
            const stop = () => {
                isDragging = false;
                thumb.removeEventListener("pointermove", move);
                thumb.removeEventListener("pointerup", stop);
                thumb.removeEventListener("pointercancel", stop);
                if (!hoverTarget.matches(":hover")) rail.classList.remove("is-visible");
            };
            thumb.addEventListener("pointermove", move);
            thumb.addEventListener("pointerup", stop);
            thumb.addEventListener("pointercancel", stop);
        });

        hoverTarget.addEventListener("mouseenter", () => {
            clearTimeout(hideTimer);
            scheduleUpdate();
        });
        hoverTarget.addEventListener("mouseleave", () => {
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                if (!isDragging) rail.classList.remove("is-visible");
            }, 1000);
        });
        scroller.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);
        new ResizeObserver(scheduleUpdate).observe(scroller);
        new MutationObserver(scheduleUpdate).observe(scroller, { childList: true, subtree: true });
        scheduleUpdate();
    });

});
