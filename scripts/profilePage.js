document.addEventListener("DOMContentLoaded", () => {
    const defaults = {
        name: "JSON.TTUM",
        avatar: "../photos/spotifyICON/lydbayot.jpg",
        banner: null,
        gender: "Male",
        age: "20",
        description: "Cyber VIP Listener • R&B & Neo-Soul Enthusiast",
        bio: "Music hits harder in Deep Cyber Black & Neon Yellow. Late-night TrapSoul, Synth Funk, and 2000s R&B collector."
    };

    function readJson(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
        } catch {
            return fallback;
        }
    }

    const saved = readJson("spotifake_user_profile", {});
    const profile = { ...defaults, ...(saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {}) };
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };
    const count = key => {
        const items = readJson(key, []);
        return Array.isArray(items) ? items.length : 0;
    };

    const from = new URLSearchParams(location.search).get("from");
    document.getElementById("profileBack").href = ["home.html", "library.html", "playlist.html"].includes(from) ? from : "home.html";

    const name = String(profile.name || defaults.name).trim() || defaults.name;
    setText("profileName", name);
    setText("profileDescription", profile.description || defaults.description);
    setText("profileGender", profile.gender || "Not specified");
    setText("profileAge", profile.age ? `${profile.age} yrs old` : "Not specified");
    setText("profileBio", profile.bio || defaults.bio);
    setText("profileLikes", count("spotifake_favorites"));
    setText("profilePlaylists", 1 + count("spotifake_custom_playlists"));
    setText("profileRecents", count("spotifake_recents"));

    const avatar = document.getElementById("profileAvatar");
    const rawAvatar = profile.avatar || defaults.avatar;
    avatar.src = window.SpotifakePaths ? window.SpotifakePaths.asset(rawAvatar) : rawAvatar;
    avatar.alt = `${name} avatar`;
    avatar.addEventListener("error", () => {
        if (!avatar.src.endsWith("lydbayot.jpg")) avatar.src = defaults.avatar;
    });

    if (profile.banner) {
        document.getElementById("profileBanner").style.backgroundImage = `url(${JSON.stringify(profile.banner)})`;
    }

    const cursorEnabled = localStorage.getItem("spotifake_cursor") !== "0";
    document.body.classList.toggle("cursor-disabled", !cursorEnabled);
    if (cursorEnabled && window.matchMedia("(pointer: fine)").matches) {
        const dot = document.getElementById("cursorDot");
        const ring = document.getElementById("cursorRing");
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let ringX = x;
        let ringY = y;
        window.addEventListener("pointermove", event => {
            x = event.clientX;
            y = event.clientY;
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;
            document.body.classList.toggle("cursor-hover", Boolean(event.target.closest("a, button")));
        });
        function followCursor() {
            ringX += (x - ringX) * 0.18;
            ringY += (y - ringY) * 0.18;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;
            requestAnimationFrame(followCursor);
        }
        followCursor();
    }
    window.dispatchEvent(new Event("spotifake:mobile-page-ready"));
});
