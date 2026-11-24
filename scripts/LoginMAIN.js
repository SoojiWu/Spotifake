/**
 * Spotifake | Welcome, Login & Create Account Controller
 * BSIT / IT Extension Project
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const authCard = document.getElementById("authCard");
    const backToWelcomeBtn = document.getElementById("backToWelcomeBtn");
    const welcomePanel = document.getElementById("welcome-panel");

    const welcomeLoginBtn = document.getElementById("welcomeLoginBtn");
    const welcomeSignupBtn = document.getElementById("welcomeSignupBtn");

    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginMessage = document.getElementById("login-message");
    const signupMessage = document.getElementById("signup-message");
    const loginButton = document.getElementById("enter");
    const signupSubmitBtn = document.getElementById("signupSubmitBtn");

    const goToSignupBtn = document.getElementById("goToSignupBtn");
    const goToLoginBtn = document.getElementById("goToLoginBtn");

    const savedAccountsStrip = document.getElementById("savedAccountsStrip");
    const savedAccountsList = document.getElementById("savedAccountsList");

    const loginLoader = document.getElementById("loginLoader");
    const loaderTitle = document.getElementById("loaderTitle");
    const loaderStatus = document.getElementById("loaderStatus");
    const loaderFill = document.getElementById("loaderFill");
    const loaderPct = document.getElementById("loaderPct");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberInput = document.getElementById("remember-me");

    const signupNameInput = document.getElementById("signup-name");
    const signupEmailInput = document.getElementById("signup-email");
    const signupPasswordInput = document.getElementById("signup-password");
    const signupConfirmInput = document.getElementById("signup-confirm");
    const signupRememberInput = document.getElementById("signup-remember");

    const welcomeKicker = document.getElementById("welcomeKicker");
    const welcomeAccent = document.getElementById("welcomeAccent");
    const welcomeSubtitle = document.getElementById("welcomeSubtitle");
    const logoCircle = document.getElementById("logoCircle");
    const logoAvatarImg = document.getElementById("logoAvatarImg");

    const ACCOUNTS_KEY = "spotifake_accounts";
    const AUTH_INITIALIZED_KEY = "spotifake_auth_initialized";
    const REMEMBERED_EMAIL_KEY = "spotifake_remembered_email";
    const USER_PROFILE_KEY = "spotifake_user_profile";
    const BRAND_EMBLEM_AVATAR = "photos/spotifyICON/spotifake-favicon.svg";
    const GMAIL_REGEX = /^[^\s@]+@gmail\.com$/i;

    const DEMO_VIP_ACCOUNT = {
        id: "vip_json_ttum",
        name: "JSON.TTUM",
        email: "json.ttum@gmail.com",
        password: "cybervip2025",
        avatar: "photos/spotifyICON/lydbayot.jpg",
        banner: null,
        gender: "Male",
        age: "20",
        description: "Cyber VIP Listener • R&B & Neo-Soul Enthusiast",
        bio: "Music hits harder in Deep Cyber Black & Neon Yellow. Late-night TrapSoul, Synth Funk, and 2000s R&B collector.",
        isDemo: true
    };

    let currentView = "welcome";
    let isAuthenticating = false;

    function normalizeEmail(value) {
        return String(value || "").trim().toLowerCase();
    }

    function resolveAsset(path) {
        return window.SpotifakePaths ? window.SpotifakePaths.asset(path) : path;
    }

    function toCanonicalAsset(path) {
        return window.SpotifakePaths ? window.SpotifakePaths.toCanonical(path) : path;
    }

    function loadSavedUserProfile() {
        try {
            const raw = localStorage.getItem(USER_PROFILE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function loadAccounts() {
        try {
            const raw = localStorage.getItem(ACCOUNTS_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed.filter(a => a && a.email) : [];
        } catch (e) {
            return [];
        }
    }

    function saveAccounts(accounts) {
        try {
            localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
            return true;
        } catch (e) {
            try {
                const compact = accounts.map(acc => ({ ...acc, banner: null }));
                localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(compact));
                return true;
            } catch (e2) {
                return false;
            }
        }
    }

    function getDemoAccountWithEdits() {
        const profile = loadSavedUserProfile();
        if (profile && (normalizeEmail(profile.email) === DEMO_VIP_ACCOUNT.email || normalizeEmail(profile.email) === "json.ttum@spotifake.io")) {
            return {
                ...DEMO_VIP_ACCOUNT,
                name: (profile.name && profile.name.trim()) || DEMO_VIP_ACCOUNT.name,
                avatar: profile.avatar ? toCanonicalAsset(profile.avatar) : DEMO_VIP_ACCOUNT.avatar,
                banner: profile.banner ?? DEMO_VIP_ACCOUNT.banner,
                gender: profile.gender || DEMO_VIP_ACCOUNT.gender,
                age: profile.age || DEMO_VIP_ACCOUNT.age,
                description: profile.description || DEMO_VIP_ACCOUNT.description,
                bio: profile.bio || DEMO_VIP_ACCOUNT.bio
            };
        }
        return { ...DEMO_VIP_ACCOUNT };
    }

    function findAccountByEmail(email) {
        const target = normalizeEmail(email);
        if (!target) return null;

        const accounts = loadAccounts();
        const registered = accounts.find(acc => normalizeEmail(acc.email) === target);
        if (registered) return registered;

        if (target === DEMO_VIP_ACCOUNT.email || target === "json.ttum@spotifake.io") {
            return getDemoAccountWithEdits();
        }
        return null;
    }

    /** Reconcile any profile edits made inside Home/Library back into the accounts registry. */
    function syncProfileEditsBackToAccounts() {
        const profile = loadSavedUserProfile();
        if (!profile || !profile.email) return;

        const targetEmail = normalizeEmail(profile.email);
        const accounts = loadAccounts();
        const idx = accounts.findIndex(acc => normalizeEmail(acc.email) === targetEmail);
        if (idx === -1) return;

        accounts[idx] = {
            ...accounts[idx],
            name: (profile.name && profile.name.trim()) || accounts[idx].name,
            avatar: profile.avatar ? toCanonicalAsset(profile.avatar) : accounts[idx].avatar,
            banner: profile.banner ?? accounts[idx].banner,
            gender: profile.gender || accounts[idx].gender,
            age: profile.age ?? accounts[idx].age,
            description: profile.description || accounts[idx].description,
            bio: profile.bio || accounts[idx].bio
        };
        saveAccounts(accounts);
    }

    /** Generate a cyber monogram SVG avatar so new users get a clean personalized icon by default. */
    function createCyberMonogramAvatar(displayName) {
        const cleaned = String(displayName || "").trim();
        const parts = cleaned.split(/[\s._-]+/).filter(Boolean);
        let initials = "SF";
        if (parts.length >= 2) {
            initials = (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (cleaned.length >= 2) {
            initials = cleaned.slice(0, 2).toUpperCase();
        } else if (cleaned.length === 1) {
            initials = cleaned.toUpperCase();
        }
        const safeInitials = initials.replace(/[<>&"']/g, "");
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">` +
            `<defs>` +
            `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">` +
            `<stop offset="0%" stop-color="#221338"/>` +
            `<stop offset="55%" stop-color="#141426"/>` +
            `<stop offset="100%" stop-color="#2a0f24"/>` +
            `</linearGradient>` +
            `<linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">` +
            `<stop offset="0%" stop-color="#FFEA00"/>` +
            `<stop offset="100%" stop-color="#FF007F"/>` +
            `</linearGradient>` +
            `</defs>` +
            `<rect width="128" height="128" rx="64" fill="url(#bg)"/>` +
            `<circle cx="64" cy="64" r="56" fill="none" stroke="url(#fg)" stroke-width="4" opacity="0.72"/>` +
            `<text x="64" y="66" text-anchor="middle" dominant-baseline="central" ` +
            `font-family="Montserrat, Segoe UI, sans-serif" font-size="44" font-weight="900" fill="url(#fg)">${safeInitials}</text>` +
            `</svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function setAvatarVisual(src, altText, titleText, isBrandEmblem = false) {
        if (logoCircle) {
            logoCircle.classList.toggle("is-brand-emblem", isBrandEmblem);
            logoCircle.title = titleText;
        }
        if (logoAvatarImg) {
            logoAvatarImg.src = resolveAsset(src);
            logoAvatarImg.alt = altText;
        }
    }

    function setHeaderText(kicker, accent, subtitle) {
        if (welcomeKicker) welcomeKicker.textContent = kicker;
        if (welcomeAccent) welcomeAccent.textContent = accent;
        if (welcomeSubtitle) welcomeSubtitle.textContent = subtitle;
    }

    function renderSavedAccountsStrip() {
        if (!savedAccountsStrip || !savedAccountsList) return;
        const customAccounts = loadAccounts();

        if (customAccounts.length === 0) {
            savedAccountsStrip.hidden = true;
            savedAccountsList.replaceChildren();
            return;
        }

        const currentEmail = normalizeEmail(emailInput?.value);
        savedAccountsList.replaceChildren();
        customAccounts.forEach((acc) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "saved-account-chip";
            if (normalizeEmail(acc.email) === currentEmail) {
                chip.classList.add("is-selected");
            }

            const img = document.createElement("img");
            img.src = resolveAsset(acc.avatar || BRAND_EMBLEM_AVATAR);
            img.alt = `${acc.name} avatar`;

            const nameSpan = document.createElement("span");
            nameSpan.textContent = acc.name;

            chip.append(img, nameSpan);
            chip.addEventListener("click", () => {
                if (emailInput) emailInput.value = acc.email;
                if (passwordInput) {
                    passwordInput.value = "";
                    passwordInput.focus();
                }
                clearValidationStates();
                syncLoginIdentityFromEmail();
                renderSavedAccountsStrip();
            });

            savedAccountsList.appendChild(chip);
        });

        savedAccountsStrip.hidden = false;
    }

    function syncLoginIdentityFromEmail() {
        if (currentView !== "login") return;
        const matched = findAccountByEmail(emailInput?.value);

        if (matched) {
            setHeaderText(
                "WELKAM BAK",
                matched.name,
                "Your cyber R&B and Neo-Soul sanctuary is ready."
            );
            setAvatarVisual(
                matched.avatar || createCyberMonogramAvatar(matched.name),
                `${matched.name} Spotifake Avatar`,
                `${matched.name} Spotifake Avatar`,
                false
            );
        } else {
            setHeaderText(
                "WELCOME",
                "SPOTIFAKE",
                "Sign in to your existing Spotifake account."
            );
            setAvatarVisual(
                BRAND_EMBLEM_AVATAR,
                "Spotifake Emblem",
                "Welcome to Spotifake",
                true
            );
        }
    }

    function clearValidationStates() {
        if (loginMessage) {
            loginMessage.textContent = "";
            loginMessage.classList.remove("is-success");
        }
        if (signupMessage) {
            signupMessage.textContent = "";
            signupMessage.classList.remove("is-success");
        }
        document.querySelectorAll(".input-shell.is-invalid").forEach(shell => {
            shell.classList.remove("is-invalid");
        });
        goToSignupBtn?.classList.remove("is-highlighted");
        goToLoginBtn?.classList.remove("is-highlighted");
    }

    function flagInvalidInput(inputEl, messageEl, message) {
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.classList.remove("is-success");
        }
        const shell = inputEl?.closest(".input-shell");
        if (shell) {
            shell.classList.remove("is-invalid");
            void shell.offsetWidth;
            shell.classList.add("is-invalid");
        }
        inputEl?.focus();
    }

    function pulseSwitchLink(btn) {
        if (!btn) return;
        btn.classList.remove("is-highlighted");
        void btn.offsetWidth;
        btn.classList.add("is-highlighted");
    }

    function setAuthView(view, opts = {}) {
        const nextView = ["welcome", "login", "signup"].includes(view) ? view : "welcome";
        currentView = nextView;

        if (authCard) authCard.setAttribute("data-auth-view", nextView);
        if (welcomePanel) welcomePanel.hidden = nextView !== "welcome";
        if (loginForm) loginForm.hidden = nextView !== "login";
        if (signupForm) signupForm.hidden = nextView !== "signup";
        if (backToWelcomeBtn) backToWelcomeBtn.hidden = nextView === "welcome";

        clearValidationStates();

        if (nextView === "welcome") {
            setHeaderText(
                "WELCOME",
                "SPOTIFAKE",
                "Your cyber R&B and Neo-Soul sanctuary awaits."
            );
            setAvatarVisual(
                BRAND_EMBLEM_AVATAR,
                "Spotifake Emblem",
                "Welcome to Spotifake",
                true
            );
            document.title = "Spotifake | Welcome";
        } else if (nextView === "login") {
            if (opts.prefillEmail && emailInput) {
                emailInput.value = opts.prefillEmail;
            }
            renderSavedAccountsStrip();
            syncLoginIdentityFromEmail();
            document.title = "Spotifake | Cyber Login";
            if (opts.focus) {
                if (emailInput && !emailInput.value.trim()) {
                    emailInput.focus();
                } else {
                    passwordInput?.focus();
                }
            }
        } else if (nextView === "signup") {
            if (opts.prefillEmail && signupEmailInput && !signupEmailInput.value.trim()) {
                signupEmailInput.value = opts.prefillEmail;
            }
            setHeaderText(
                "CREATE ACCOUNT",
                "SPOTIFAKE",
                "Register your cyber R&B and Neo-Soul profile."
            );
            setAvatarVisual(
                BRAND_EMBLEM_AVATAR,
                "Spotifake Emblem",
                "Spotifake",
                true
            );
            document.title = "Spotifake | Sign Up";
            if (opts.focus) {
                signupNameInput?.focus();
            }
        }
    }

    function launchAuthenticatedSession(account, options = {}) {
        if (isAuthenticating) return;
        isAuthenticating = true;

        const {
            remember = true,
            mode = "login"
        } = options;

        const displayName = (account.name && account.name.trim()) || DEMO_VIP_ACCOUNT.name;
        const normalizedEmail = normalizeEmail(account.email);
        const canonicalAvatar = account.avatar ? toCanonicalAsset(account.avatar) : createCyberMonogramAvatar(displayName);

        if (loginButton) loginButton.disabled = true;
        if (signupSubmitBtn) signupSubmitBtn.disabled = true;

        if (mode === "signup" && signupSubmitBtn) {
            const label = signupSubmitBtn.querySelector("span");
            if (label) label.textContent = "Creating Account…";
        } else if (loginButton) {
            const label = loginButton.querySelector("span");
            if (label) label.textContent = "Authenticating…";
        }

        try {
            localStorage.setItem(AUTH_INITIALIZED_KEY, "1");
            if (remember) {
                localStorage.setItem("spotifake-user", normalizedEmail);
                localStorage.setItem(REMEMBERED_EMAIL_KEY, normalizedEmail);
                sessionStorage.removeItem("spotifake-user");
            } else {
                localStorage.removeItem("spotifake-user");
                localStorage.removeItem(REMEMBERED_EMAIL_KEY);
                sessionStorage.setItem("spotifake-user", normalizedEmail);
            }

            const profilePayload = {
                name: displayName,
                email: normalizedEmail,
                avatar: canonicalAvatar,
                banner: account.banner ?? null,
                gender: account.gender || "Not specified",
                age: account.age || "",
                description: account.description || "Cyber VIP Listener • R&B & Neo-Soul Enthusiast",
                bio: account.bio || "Music hits harder in Deep Cyber Black & Neon Yellow. Late-night TrapSoul, Synth Funk, and 2000s R&B collector."
            };
            localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profilePayload));
        } catch (e) { /* Ignore storage quota errors */ }

        if (loginLoader) {
            document.body.classList.add("is-loading");
            loginLoader.removeAttribute("hidden");

            if (loaderTitle) {
                loaderTitle.textContent = mode === "signup"
                    ? "CREATING SPOTIFAKE ACCOUNT"
                    : "AUTHENTICATING VIP SESSION";
            }

            const stages = mode === "signup"
                ? [
                    { pct: 25, text: `Registering Spotifake profile for ${displayName}...`, delay: 180 },
                    { pct: 55, text: "Setting up your Cyber Audio Cloud Sanctuary...", delay: 620 },
                    { pct: 85, text: "Synchronizing 10 Lossless Tracks & Live Lyrics...", delay: 1080 },
                    { pct: 100, text: `Welcome to Spotifake, ${displayName}! • Launching...`, delay: 1580 }
                ]
                : [
                    { pct: 25, text: `Authenticating VIP session for ${displayName}...`, delay: 200 },
                    { pct: 55, text: "Connecting to Spotifake Cyber Audio Cloud...", delay: 650 },
                    { pct: 85, text: "Synchronizing 10 Lossless Tracks & Live Lyrics...", delay: 1100 },
                    { pct: 100, text: "Access Granted • Launching Spotifake...", delay: 1600 }
                ];

            stages.forEach(stage => {
                setTimeout(() => {
                    if (loaderFill) loaderFill.style.width = `${stage.pct}%`;
                    if (loaderPct) loaderPct.textContent = `${stage.pct}%`;
                    if (loaderStatus) loaderStatus.textContent = stage.text;
                }, stage.delay);
            });

            setTimeout(() => {
                window.location.href = "pages/home.html";
            }, 2100);
        } else {
            window.location.href = "pages/home.html";
        }
    }

    function syncInitialAuthState() {
        const savedTheme = localStorage.getItem("spotifake_theme");
        if (savedTheme) {
            document.documentElement.setAttribute("data-theme", savedTheme);
        }

        isAuthenticating = false;
        document.body.classList.remove("is-loading");
        if (loginLoader) loginLoader.setAttribute("hidden", "");
        if (loginButton) {
            loginButton.disabled = false;
            const label = loginButton.querySelector("span");
            if (label) label.textContent = "Log in to Spotifake";
        }
        if (signupSubmitBtn) {
            signupSubmitBtn.disabled = false;
            const label = signupSubmitBtn.querySelector("span");
            if (label) label.textContent = "Create Account";
        }

        syncProfileEditsBackToAccounts();

        const hasInitialized = localStorage.getItem(AUTH_INITIALIZED_KEY) === "1";
        const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
        const rememberedAccount = hasInitialized && rememberedEmail
            ? findAccountByEmail(rememberedEmail)
            : null;

        // First-time users ALWAYS land on WELCOME SPOTIFAKE.
        if (rememberedAccount) {
            if (emailInput) emailInput.value = rememberedAccount.email;
            if (passwordInput) passwordInput.value = "";
            if (rememberInput) rememberInput.checked = true;
            setAuthView("login");
        } else {
            if (emailInput) emailInput.value = "";
            if (passwordInput) passwordInput.value = "";
            setAuthView("welcome");
        }
    }

    syncInitialAuthState();
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            syncInitialAuthState();
        }
    });

    /* ================= VIEW NAVIGATION ================= */
    welcomeLoginBtn?.addEventListener("click", () => setAuthView("login", { focus: true }));
    welcomeSignupBtn?.addEventListener("click", () => setAuthView("signup", { focus: true }));
    backToWelcomeBtn?.addEventListener("click", () => setAuthView("welcome"));

    goToSignupBtn?.addEventListener("click", () => {
        const typedEmail = emailInput?.value.trim() || "";
        setAuthView("signup", {
            focus: true,
            prefillEmail: GMAIL_REGEX.test(typedEmail) ? typedEmail : ""
        });
    });

    goToLoginBtn?.addEventListener("click", () => {
        const typedEmail = signupEmailInput?.value.trim() || "";
        setAuthView("login", {
            focus: true,
            prefillEmail: GMAIL_REGEX.test(typedEmail) ? typedEmail : ""
        });
    });

    /* ================= LOGIN FORM SUBMISSION ================= */
    loginForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        clearValidationStates();

        const email = emailInput?.value.trim() || "";
        const password = passwordInput?.value || "";
        const remember = Boolean(rememberInput?.checked);

        if (!email) {
            flagInvalidInput(emailInput, loginMessage, "Please enter your @gmail.com email address.");
            return;
        }

        if (!GMAIL_REGEX.test(email)) {
            flagInvalidInput(emailInput, loginMessage, "Please enter a valid @gmail.com email address.");
            return;
        }

        if (!password) {
            flagInvalidInput(passwordInput, loginMessage, "Please enter your password.");
            return;
        }

        const matchedAccount = findAccountByEmail(email);
        if (!matchedAccount) {
            flagInvalidInput(
                emailInput,
                loginMessage,
                "No account found for that email. Sign up below to create one!"
            );
            pulseSwitchLink(goToSignupBtn);
            return;
        }

        if (matchedAccount.password !== password) {
            flagInvalidInput(
                passwordInput,
                loginMessage,
                "Incorrect password. Please try again."
            );
            return;
        }

        launchAuthenticatedSession(matchedAccount, { remember, mode: "login" });
    });

    /* ================= CREATE ACCOUNT FORM SUBMISSION ================= */
    signupForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        clearValidationStates();

        const displayName = (signupNameInput?.value || "").trim();
        const email = (signupEmailInput?.value || "").trim();
        const password = signupPasswordInput?.value || "";
        const confirm = signupConfirmInput?.value || "";
        const remember = Boolean(signupRememberInput?.checked);

        if (displayName.length < 2) {
            flagInvalidInput(signupNameInput, signupMessage, "Display name must be at least 2 characters.");
            return;
        }

        if (!email || !GMAIL_REGEX.test(email)) {
            flagInvalidInput(signupEmailInput, signupMessage, "Please enter a valid @gmail.com email address.");
            return;
        }

        if (findAccountByEmail(email)) {
            flagInvalidInput(
                signupEmailInput,
                signupMessage,
                "That email is already registered. Log in below!"
            );
            pulseSwitchLink(goToLoginBtn);
            return;
        }

        if (password.length < 6) {
            flagInvalidInput(signupPasswordInput, signupMessage, "Password must be at least 6 characters.");
            return;
        }

        if (password !== confirm) {
            flagInvalidInput(signupConfirmInput, signupMessage, "Passwords do not match.");
            return;
        }

        const newAccount = {
            id: `acc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            name: displayName,
            email: normalizeEmail(email),
            password,
            avatar: createCyberMonogramAvatar(displayName),
            banner: null,
            gender: "Not specified",
            age: "",
            description: "Cyber VIP Listener • R&B & Neo-Soul Enthusiast",
            bio: "Music hits harder in Deep Cyber Black & Neon Yellow. Late-night TrapSoul, Synth Funk, and 2000s R&B collector.",
            createdAt: Date.now()
        };

        const accounts = loadAccounts();
        accounts.push(newAccount);
        saveAccounts(accounts);

        if (signupMessage) {
            signupMessage.textContent = `Account created! Welcome, ${displayName}.`;
            signupMessage.classList.add("is-success");
        }

        launchAuthenticatedSession(newAccount, { remember, mode: "signup" });
    });

    /* ================= PASSWORD VISIBILITY TOGGLES ================= */
    function bindPasswordToggle(inputEl, buttonEl) {
        if (!inputEl || !buttonEl) return;
        buttonEl.addEventListener("click", () => {
            const reveal = inputEl.type === "password";
            inputEl.type = reveal ? "text" : "password";
            buttonEl.setAttribute("aria-pressed", String(reveal));
            buttonEl.setAttribute("aria-label", reveal ? "Hide password" : "Show password");
            buttonEl.title = reveal ? "Hide password" : "Show password";
            const icon = buttonEl.querySelector("i");
            if (icon) {
                icon.className = `fa-regular ${reveal ? "fa-eye-slash" : "fa-eye"}`;
            }
        });
    }

    bindPasswordToggle(passwordInput, document.getElementById("togglePasswordBtn"));
    bindPasswordToggle(signupPasswordInput, document.getElementById("toggleSignupPasswordBtn"));
    bindPasswordToggle(signupConfirmInput, document.getElementById("toggleSignupConfirmBtn"));

    /* ================= DEVICE PROFILE (MOBILE / SMALL TABLET / LOW-END) ================= */
    const coarsePointer = window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const netConn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = Boolean(netConn && netConn.saveData);
    const slowNetwork = Boolean(netConn && (netConn.effectiveType === "slow-2g" || netConn.effectiveType === "2g"));
    const deviceMem = Number(navigator.deviceMemory) || 0;
    const cpuCores = Number(navigator.hardwareConcurrency) || 0;
    let forcedUltraLite = false;

    function computeBgProfile() {
        const w = window.innerWidth || document.documentElement.clientWidth || 1024;
        const h = window.innerHeight || document.documentElement.clientHeight || 768;
        const shortSide = Math.min(w, h);
        const isMobile = w <= 767;
        const isSmallTablet = !isMobile && (w <= 1023 || (coarsePointer && w <= 1180 && shortSide <= 820));
        const isLowEndHardware =
            saveData ||
            slowNetwork ||
            (deviceMem > 0 && deviceMem <= 2) ||
            (deviceMem > 0 && deviceMem <= 4 && cpuCores > 0 && cpuCores <= 4) ||
            ((isMobile || isSmallTablet) && ((deviceMem > 0 && deviceMem <= 4) || (cpuCores > 0 && cpuCores <= 4)));
        const isLiteBg = isMobile || isSmallTablet || isLowEndHardware;
        const isUltraLiteBg =
            forcedUltraLite ||
            saveData ||
            slowNetwork ||
            (deviceMem > 0 && deviceMem <= 2) ||
            ((isMobile || isSmallTablet) && ((deviceMem > 0 && deviceMem <= 3) || (cpuCores > 0 && cpuCores <= 4)));

        return { w, h, isMobile, isSmallTablet, isLowEndHardware, isLiteBg, isUltraLiteBg };
    }

    let bgProfile = computeBgProfile();
    function applyBgProfileClasses() {
        document.documentElement.classList.toggle("login-bg-lite", bgProfile.isLiteBg);
        document.documentElement.classList.toggle("login-bg-ultra-lite", bgProfile.isUltraLiteBg);
    }
    applyBgProfileClasses();

    /* ================= INPUT REACTIVITY & LIVE IDENTITY PREVIEW ================= */
    const allAuthInputs = [
        emailInput,
        passwordInput,
        signupNameInput,
        signupEmailInput,
        signupPasswordInput,
        signupConfirmInput
    ].filter(Boolean);

    let typingPulseTimer = null;
    allAuthInputs.forEach(inp => {
        inp.addEventListener("input", () => {
            clearValidationStates();
            if (bgProfile.isLiteBg) return;
            document.body.classList.add("is-typing");
            clearTimeout(typingPulseTimer);
            typingPulseTimer = setTimeout(() => {
                document.body.classList.remove("is-typing");
            }, 450);
        });
    });

    emailInput?.addEventListener("input", () => {
        syncLoginIdentityFromEmail();
        renderSavedAccountsStrip();
    });

    /* ================= INTERACTIVE SPOTLIGHT, 3D CARD TILT & EQ (DESKTOP ONLY) ================= */
    const bgStage = document.querySelector(".cyber-bg-stage");
    const loginCard = document.querySelector(".login-container");
    const eqBars = [...document.querySelectorAll(".bg-full-eq .eq-b")];

    if (!bgProfile.isLiteBg && bgStage && finePointer && !reducedMotion) {
        let rafPending = false;
        let pointerClientX = window.innerWidth / 2;
        let pointerClientY = window.innerHeight / 2;

        window.addEventListener("pointermove", (e) => {
            if (bgProfile.isLiteBg) return;
            pointerClientX = e.clientX;
            pointerClientY = e.clientY;
            if (rafPending) return;
            rafPending = true;
            requestAnimationFrame(() => {
                if (bgProfile.isLiteBg) {
                    rafPending = false;
                    return;
                }
                const vw = Math.max(window.innerWidth, 1);
                const vh = Math.max(window.innerHeight, 1);
                const normX = pointerClientX / vw;
                const normY = pointerClientY / vh;

                bgStage.style.setProperty("--bg-mx", `${(normX * 100).toFixed(2)}%`);
                bgStage.style.setProperty("--bg-my", `${(normY * 100).toFixed(2)}%`);
                bgStage.style.setProperty("--px", `${((normX - 0.5) * -20).toFixed(1)}px`);
                bgStage.style.setProperty("--py", `${((normY - 0.5) * -14).toFixed(1)}px`);

                if (loginCard) {
                    const rect = loginCard.getBoundingClientRect();
                    const cx = ((pointerClientX - rect.left) / Math.max(rect.width, 1)) * 100;
                    const cy = ((pointerClientY - rect.top) / Math.max(rect.height, 1)) * 100;
                    const tiltY = ((normX - 0.5) * 6.5).toFixed(2);
                    const tiltX = ((0.5 - normY) * 5.5).toFixed(2);
                    loginCard.style.setProperty("--card-mx", `${cx.toFixed(1)}%`);
                    loginCard.style.setProperty("--card-my", `${cy.toFixed(1)}%`);
                    loginCard.style.setProperty("--tilt-x", `${tiltX}deg`);
                    loginCard.style.setProperty("--tilt-y", `${tiltY}deg`);
                }

                if (eqBars.length > 0) {
                    const total = eqBars.length;
                    eqBars.forEach((bar, idx) => {
                        const barPos = (idx + 0.5) / total;
                        const dist = Math.abs(barPos - normX);
                        const boost = Math.max(0, 1 - dist * 5.5);
                        bar.style.setProperty("--eq-boost", boost.toFixed(2));
                    });
                }

                rafPending = false;
            });
        }, { passive: true });

        document.addEventListener("mouseleave", () => {
            if (loginCard) {
                loginCard.style.setProperty("--tilt-x", "0deg");
                loginCard.style.setProperty("--tilt-y", "0deg");
            }
        });
    }

    /* ================= INTERACTIVE HARMONIC STRINGS & DUST CANVAS ================= */
    const fxCanvas = document.getElementById("loginFxCanvas");
    if (fxCanvas && !reducedMotion) {
        const ctx = fxCanvas.getContext("2d");
        if (ctx) {
            let cw = 0;
            let ch = 0;
            let mx = -9999;
            let my = -9999;
            let prevMy = -9999;
            let cursorSpeed = 0;
            let time = 0;
            let rafId = null;
            let isInputFocusedOnMobile = false;
            let isLightTheme = document.documentElement.getAttribute("data-appearance") === "light";

            // Cached resources for lite mode (zero per-frame gradient/string allocations)
            let liteGoldGrad = null;
            let liteMagentaGrad = null;
            let liteRibbonLeftStyle = "";
            let liteRibbonRightStyle = "";
            let liteParticleGoldStyle = "";
            let liteParticleMagentaStyle = "";
            let liteSegments = bgProfile.isMobile ? 20 : 24;
            let liteEdgeSoft = null;
            let liteXTable = null;

            function buildLiteLookupTables() {
                liteSegments = bgProfile.isMobile ? 20 : 24;
                liteEdgeSoft = new Float32Array(liteSegments + 1);
                liteXTable = new Float32Array(liteSegments + 1);
                for (let step = 0; step <= liteSegments; step++) {
                    const nx = step / liteSegments;
                    liteEdgeSoft[step] = 0.45 + 0.55 * Math.sin(nx * Math.PI);
                    liteXTable[step] = nx * cw;
                }
            }

            function rebuildLitePalette() {
                if (cw <= 0) return;
                const baseAlpha = isLightTheme ? 0.14 : 0.16;
                const edgeAlpha = (baseAlpha * 0.35).toFixed(3);
                const mainAlpha = baseAlpha.toFixed(3);
                const midAlpha = (baseAlpha * 0.94).toFixed(3);

                liteGoldGrad = ctx.createLinearGradient(0, 0, cw, 0);
                liteGoldGrad.addColorStop(0, isLightTheme ? `rgba(180, 83, 9, ${edgeAlpha})` : `rgba(255, 234, 0, ${edgeAlpha})`);
                liteGoldGrad.addColorStop(0.24, isLightTheme ? `rgba(180, 83, 9, ${mainAlpha})` : `rgba(255, 234, 0, ${mainAlpha})`);
                liteGoldGrad.addColorStop(0.5, isLightTheme ? `rgba(190, 24, 93, ${midAlpha})` : `rgba(255, 130, 175, ${midAlpha})`);
                liteGoldGrad.addColorStop(0.76, isLightTheme ? `rgba(180, 83, 9, ${mainAlpha})` : `rgba(255, 234, 0, ${mainAlpha})`);
                liteGoldGrad.addColorStop(1, isLightTheme ? `rgba(180, 83, 9, ${edgeAlpha})` : `rgba(255, 234, 0, ${edgeAlpha})`);

                liteMagentaGrad = ctx.createLinearGradient(0, 0, cw, 0);
                liteMagentaGrad.addColorStop(0, isLightTheme ? `rgba(190, 24, 93, ${edgeAlpha})` : `rgba(255, 0, 127, ${edgeAlpha})`);
                liteMagentaGrad.addColorStop(0.24, isLightTheme ? `rgba(190, 24, 93, ${mainAlpha})` : `rgba(255, 0, 127, ${mainAlpha})`);
                liteMagentaGrad.addColorStop(0.5, isLightTheme ? `rgba(180, 83, 9, ${midAlpha})` : `rgba(255, 224, 102, ${midAlpha})`);
                liteMagentaGrad.addColorStop(0.76, isLightTheme ? `rgba(190, 24, 93, ${mainAlpha})` : `rgba(255, 0, 127, ${mainAlpha})`);
                liteMagentaGrad.addColorStop(1, isLightTheme ? `rgba(190, 24, 93, ${edgeAlpha})` : `rgba(255, 0, 127, ${edgeAlpha})`);

                liteRibbonLeftStyle = isLightTheme ? "rgba(180, 83, 9, 0.11)" : "rgba(255, 234, 0, 0.1)";
                liteRibbonRightStyle = isLightTheme ? "rgba(190, 24, 93, 0.11)" : "rgba(255, 0, 127, 0.1)";
                liteParticleGoldStyle = isLightTheme ? "rgba(180, 83, 9, 0.34)" : "rgba(255, 234, 0, 0.36)";
                liteParticleMagentaStyle = isLightTheme ? "rgba(190, 24, 93, 0.34)" : "rgba(255, 0, 127, 0.36)";
            }

            const stringCount = bgProfile.isLiteBg
                ? (bgProfile.isMobile ? 4 : 5)
                : (window.innerWidth < 640 ? 6 : 9);
            const strings = Array.from({ length: stringCount }, (_, i) => ({
                ratioY: 0.14 + (i / Math.max(1, stringCount - 1)) * 0.62,
                amp: 0,
                vel: 0,
                pluckX: 0.5,
                phase: i * 0.95,
                cycles: 1.55 + (i % 3) * 0.55,
                driftAmp: 22 + (i % 4) * 7.5,
                driftSpeed: (i % 2 === 0 ? 1 : -1) * (0.018 + (i % 4) * 0.005),
                isGold: i % 2 === 0,
                glow: 0
            }));

            const resizeCanvas = (force = false) => {
                const nextProfile = computeBgProfile();
                const nextW = nextProfile.w;
                const nextH = nextProfile.h;

                // Mobile virtual keyboard safeguard: skip canvas reallocation on vertical-only keyboard resize
                if (!force && nextProfile.isLiteBg && isInputFocusedOnMobile && cw > 0 && Math.abs(nextW - cw) < 4) {
                    return;
                }

                bgProfile = nextProfile;
                applyBgProfileClasses();

                const dpr = bgProfile.isLiteBg ? 1 : Math.min(window.devicePixelRatio || 1, 2);
                cw = nextW;
                ch = nextH;
                fxCanvas.width = Math.max(1, Math.floor(cw * dpr));
                fxCanvas.height = Math.max(1, Math.floor(ch * dpr));
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

                if (bgProfile.isLiteBg) {
                    buildLiteLookupTables();
                    rebuildLitePalette();
                }
            };
            resizeCanvas(true);

            let resizeDebounceTimer = null;
            window.addEventListener("resize", () => {
                if (!bgProfile.isLiteBg) {
                    resizeCanvas();
                    return;
                }
                clearTimeout(resizeDebounceTimer);
                resizeDebounceTimer = setTimeout(() => {
                    resizeCanvas();
                    if (bgProfile.isUltraLiteBg) {
                        renderLiteFrame(0);
                    } else {
                        ensureRunning();
                    }
                }, 180);
            }, { passive: true });

            window.addEventListener("orientationchange", () => {
                clearTimeout(resizeDebounceTimer);
                resizeDebounceTimer = setTimeout(() => {
                    resizeCanvas(true);
                    if (bgProfile.isUltraLiteBg) {
                        renderLiteFrame(0);
                    } else {
                        ensureRunning();
                    }
                }, 220);
            }, { passive: true });

            if (!bgProfile.isLiteBg && finePointer) {
                window.addEventListener("pointermove", (e) => {
                    if (bgProfile.isLiteBg) return;
                    const nextX = e.clientX;
                    const nextY = e.clientY;
                    cursorSpeed = Math.min(36, Math.hypot(nextX - mx, nextY - my));

                    if (prevMy > -9000) {
                        const pluckNormX = Math.min(0.92, Math.max(0.08, nextX / Math.max(cw, 1)));
                        strings.forEach((s) => {
                            const sy = s.ratioY * ch;
                            const crossed = (prevMy <= sy && nextY >= sy) || (prevMy >= sy && nextY <= sy);
                            const grazed = Math.abs(nextY - sy) < 10 && cursorSpeed > 6;
                            if (crossed || grazed) {
                                const dir = nextY >= prevMy ? 1 : -1;
                                const impulse = Math.min(28, Math.max(9, cursorSpeed * 0.85)) * dir;
                                s.vel += impulse * 0.45;
                                s.amp = Math.max(-32, Math.min(32, s.amp + impulse * 0.35));
                                s.pluckX = pluckNormX;
                                s.glow = 1;
                            }
                        });
                    }

                    mx = nextX;
                    my = nextY;
                    prevMy = nextY;
                }, { passive: true });
            }

            if (!bgProfile.isLiteBg) {
                allAuthInputs.forEach((inp) => {
                    inp.addEventListener("input", () => {
                        if (bgProfile.isLiteBg) return;
                        const s = strings[Math.floor(Math.random() * strings.length)];
                        if (s) {
                            s.vel += (Math.random() > 0.5 ? 1 : -1) * 5.5;
                            s.pluckX = 0.25 + Math.random() * 0.5;
                            s.glow = Math.max(s.glow, 0.55);
                        }
                    });
                });
            }

            // Pause canvas rAF on mobile while virtual keyboard is focused so typing stays 100% responsive
            allAuthInputs.forEach((inp) => {
                inp.addEventListener("focus", () => {
                    if (bgProfile.isMobile || bgProfile.isSmallTablet) {
                        isInputFocusedOnMobile = true;
                        if (bgProfile.isMobile && rafId !== null) {
                            cancelAnimationFrame(rafId);
                            rafId = null;
                        }
                    }
                });
                inp.addEventListener("blur", () => {
                    isInputFocusedOnMobile = false;
                    if (!bgProfile.isUltraLiteBg) {
                        ensureRunning();
                    }
                });
            });

            const count = bgProfile.isLiteBg
                ? (bgProfile.isMobile ? 10 : 16)
                : (window.innerWidth < 640 ? 18 : 34);
            const particles = Array.from({ length: count }, (_, i) => ({
                x: Math.random() * cw,
                y: Math.random() * ch,
                r: 1.0 + Math.random() * 1.7,
                vy: -(0.16 + Math.random() * 0.32),
                vx: (Math.random() - 0.5) * 0.2,
                phase: Math.random() * Math.PI * 2,
                gold: i % 2 === 0
            }));

            function drawStringArtRibbonsDesktop(isLight) {
                const ribbonLines = window.innerWidth < 640 ? 6 : 11;
                const swayX = mx > -9000 ? ((mx / Math.max(cw, 1)) - 0.5) * 28 : 0;
                const swayY = my > -9000 ? ((my / Math.max(ch, 1)) - 0.5) * 22 : 0;

                ctx.lineWidth = 0.85;
                for (let side = -1; side <= 1; side += 2) {
                    const isLeft = side === -1;
                    for (let i = 0; i < ribbonLines; i++) {
                        const t = i / Math.max(1, ribbonLines - 1);
                        const startX = isLeft ? -20 : cw + 20;
                        const startY = ch * (0.08 + t * 0.72);
                        const endX = isLeft ? cw * (0.12 + t * 0.28) : cw * (0.88 - t * 0.28);
                        const endY = ch * (0.94 - t * 0.14);
                        const ctrlX = (startX + endX) * 0.5 + side * (55 + Math.sin(time * 0.9 + i * 0.35) * 18) + swayX * 0.6;
                        const ctrlY = ch * (0.28 + t * 0.25) + Math.cos(time * 0.75 + i * 0.4) * 14 + swayY * 0.6;

                        const alpha = (isLight ? 0.09 : 0.085) + (1 - Math.abs(t - 0.5) * 2) * 0.045;
                        ctx.strokeStyle = isLeft
                            ? (isLight ? `rgba(180, 83, 9, ${alpha.toFixed(3)})` : `rgba(255, 234, 0, ${alpha.toFixed(3)})`)
                            : (isLight ? `rgba(190, 24, 93, ${alpha.toFixed(3)})` : `rgba(255, 0, 127, ${alpha.toFixed(3)})`);

                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
                        ctx.stroke();
                    }
                }
            }

            function drawHarmonicStringsDesktop(isLight) {
                const segments = 64;
                for (let i = 0; i < strings.length; i++) {
                    const s = strings[i];
                    s.phase += s.driftSpeed;

                    const springForce = -0.14 * s.amp;
                    s.vel = (s.vel + springForce) * 0.92;
                    s.amp += s.vel;
                    s.glow *= 0.96;

                    const baseY = s.ratioY * ch;
                    const grad = ctx.createLinearGradient(0, baseY, cw, baseY);
                    const baseAlpha = (isLight ? 0.14 : 0.16) + s.glow * 0.22;
                    const edgeAlpha = (baseAlpha * 0.35).toFixed(3);

                    if (s.isGold) {
                        grad.addColorStop(0, isLight ? `rgba(180, 83, 9, ${edgeAlpha})` : `rgba(255, 234, 0, ${edgeAlpha})`);
                        grad.addColorStop(0.24, isLight ? `rgba(180, 83, 9, ${baseAlpha.toFixed(3)})` : `rgba(255, 234, 0, ${baseAlpha.toFixed(3)})`);
                        grad.addColorStop(0.5, isLight ? `rgba(190, 24, 93, ${(baseAlpha * 0.92).toFixed(3)})` : `rgba(255, 130, 175, ${(baseAlpha * 0.95).toFixed(3)})`);
                        grad.addColorStop(0.76, isLight ? `rgba(180, 83, 9, ${baseAlpha.toFixed(3)})` : `rgba(255, 234, 0, ${baseAlpha.toFixed(3)})`);
                        grad.addColorStop(1, isLight ? `rgba(180, 83, 9, ${edgeAlpha})` : `rgba(255, 234, 0, ${edgeAlpha})`);
                    } else {
                        grad.addColorStop(0, isLight ? `rgba(190, 24, 93, ${edgeAlpha})` : `rgba(255, 0, 127, ${edgeAlpha})`);
                        grad.addColorStop(0.24, isLight ? `rgba(190, 24, 93, ${baseAlpha.toFixed(3)})` : `rgba(255, 0, 127, ${baseAlpha.toFixed(3)})`);
                        grad.addColorStop(0.5, isLight ? `rgba(180, 83, 9, ${(baseAlpha * 0.92).toFixed(3)})` : `rgba(255, 224, 102, ${(baseAlpha * 0.95).toFixed(3)})`);
                        grad.addColorStop(0.76, isLight ? `rgba(190, 24, 93, ${baseAlpha.toFixed(3)})` : `rgba(255, 0, 127, ${baseAlpha.toFixed(3)})`);
                        grad.addColorStop(1, isLight ? `rgba(190, 24, 93, ${edgeAlpha})` : `rgba(255, 0, 127, ${edgeAlpha})`);
                    }

                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1.15 + s.glow * 1.25;
                    ctx.beginPath();

                    let prevX = 0;
                    let prevY = baseY;
                    for (let step = 0; step <= segments; step++) {
                        const nx = step / segments;
                        const x = nx * cw;
                        const edgeSoft = 0.45 + 0.55 * Math.sin(nx * Math.PI);
                        const pluckFocus = Math.exp(-Math.pow((nx - s.pluckX) * 3.1, 2));
                        const wavePrimary = Math.sin(nx * Math.PI * 2 * s.cycles + s.phase) * s.driftAmp;
                        const waveHarmonic = Math.sin(nx * Math.PI * 2 * (s.cycles + 0.85) - s.phase * 0.72) * (s.driftAmp * 0.36);
                        const vib = s.amp * Math.sin(nx * Math.PI * (2 + (i % 2)) + time * 14) * (0.35 + 0.65 * pluckFocus);
                        const y = baseY + (wavePrimary + waveHarmonic + vib) * edgeSoft;

                        if (step === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            const midX = (prevX + x) * 0.5;
                            const midY = (prevY + y) * 0.5;
                            ctx.quadraticCurveTo(prevX, prevY, midX, midY);
                        }
                        prevX = x;
                        prevY = y;
                    }
                    ctx.lineTo(prevX, prevY);
                    ctx.stroke();
                }
            }

            /* Optimized batched zero-allocation renderer for mobile, small tablets & low-end devices */
            function renderLiteFrame(stepScale) {
                if (cw <= 0 || ch <= 0) return;
                if (!liteGoldGrad || !liteEdgeSoft) {
                    buildLiteLookupTables();
                    rebuildLitePalette();
                }

                time += 0.016 * stepScale;
                ctx.clearRect(0, 0, cw, ch);

                // 1. Batched string-art ribbons (2 stroke calls total instead of 12–22)
                const ribbonLines = bgProfile.isMobile ? 4 : 6;
                const invRibbons = 1 / Math.max(1, ribbonLines - 1);
                ctx.lineWidth = 0.85;

                for (let side = -1; side <= 1; side += 2) {
                    const isLeft = side === -1;
                    ctx.strokeStyle = isLeft ? liteRibbonLeftStyle : liteRibbonRightStyle;
                    ctx.beginPath();
                    for (let i = 0; i < ribbonLines; i++) {
                        const t = i * invRibbons;
                        const startX = isLeft ? -20 : cw + 20;
                        const startY = ch * (0.08 + t * 0.72);
                        const endX = isLeft ? cw * (0.12 + t * 0.28) : cw * (0.88 - t * 0.28);
                        const endY = ch * (0.94 - t * 0.14);
                        const ctrlX = (startX + endX) * 0.5 + side * (55 + Math.sin(time * 0.9 + i * 0.35) * 16);
                        const ctrlY = ch * (0.28 + t * 0.25) + Math.cos(time * 0.75 + i * 0.4) * 12;
                        ctx.moveTo(startX, startY);
                        ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
                    }
                    ctx.stroke();
                }

                // 2. Cached-gradient harmonic strings (0 gradient allocations, precomputed edge & x tables)
                ctx.lineWidth = 1.15;
                const maxStrings = bgProfile.isMobile ? Math.min(4, strings.length) : Math.min(5, strings.length);
                const segs = liteSegments;
                const invSegs = 1 / segs;

                for (let i = 0; i < maxStrings; i++) {
                    const s = strings[i];
                    s.phase += s.driftSpeed * stepScale;
                    const baseY = s.ratioY * ch;
                    const primaryFreq = Math.PI * 2 * s.cycles;
                    const harmFreq = Math.PI * 2 * (s.cycles + 0.85);
                    const harmAmp = s.driftAmp * 0.36;

                    ctx.strokeStyle = s.isGold ? liteGoldGrad : liteMagentaGrad;
                    ctx.beginPath();

                    let prevX = 0;
                    let prevY = baseY;
                    for (let step = 0; step <= segs; step++) {
                        const nx = step * invSegs;
                        const x = liteXTable[step];
                        const y = baseY + (
                            Math.sin(nx * primaryFreq + s.phase) * s.driftAmp +
                            Math.sin(nx * harmFreq - s.phase * 0.72) * harmAmp
                        ) * liteEdgeSoft[step];

                        if (step === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.quadraticCurveTo(prevX, prevY, (prevX + x) * 0.5, (prevY + y) * 0.5);
                        }
                        prevX = x;
                        prevY = y;
                    }
                    ctx.lineTo(prevX, prevY);
                    ctx.stroke();
                }

                // 3. Batched dust particles (2 fill calls total instead of 18–34)
                const maxParticles = bgProfile.isMobile ? Math.min(10, particles.length) : Math.min(16, particles.length);
                for (let i = 0; i < maxParticles; i++) {
                    const p = particles[i];
                    if (stepScale > 0) {
                        p.phase += 0.015 * stepScale;
                        p.x += (p.vx + Math.sin(p.phase) * 0.14) * stepScale;
                        p.y += p.vy * stepScale;
                        if (p.y < -12) {
                            p.y = ch + 12;
                            p.x = Math.random() * cw;
                        }
                        if (p.x < -12) p.x = cw + 12;
                        else if (p.x > cw + 12) p.x = -12;
                    }
                }

                ctx.fillStyle = liteParticleGoldStyle;
                ctx.beginPath();
                for (let i = 0; i < maxParticles; i += 2) {
                    const p = particles[i];
                    ctx.moveTo(p.x + p.r, p.y);
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                }
                ctx.fill();

                ctx.fillStyle = liteParticleMagentaStyle;
                ctx.beginPath();
                for (let i = 1; i < maxParticles; i += 2) {
                    const p = particles[i];
                    ctx.moveTo(p.x + p.r, p.y);
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                }
                ctx.fill();
            }

            let lastRafTs = 0;
            let lastLiteDrawTs = 0;
            const bootTs = performance.now();
            let jankSamples = 0;
            let jankDeltaSum = 0;

            function renderFx(now) {
                rafId = null;
                if (document.hidden || document.body.classList.contains("is-loading")) return;

                if (bgProfile.isLiteBg) {
                    if (bgProfile.isUltraLiteBg) {
                        renderLiteFrame(0);
                        return;
                    }
                    if (bgProfile.isMobile && isInputFocusedOnMobile) {
                        return;
                    }

                    // Automatic FPS watchdog (only on mobile/small-tablet/low-end):
                    // if real compositor cadence lags below ~14 FPS after warmup, drop to crisp static ultra-lite
                    if (lastRafTs > 0 && now - bootTs > 700) {
                        const rafDelta = now - lastRafTs;
                        if (rafDelta > 0 && rafDelta < 350) {
                            jankDeltaSum += rafDelta;
                            jankSamples++;
                            if (jankSamples >= 18) {
                                const avgRafMs = jankDeltaSum / jankSamples;
                                if (avgRafMs > 68) {
                                    forcedUltraLite = true;
                                    bgProfile = computeBgProfile();
                                    applyBgProfileClasses();
                                    renderLiteFrame(0);
                                    return;
                                }
                                jankSamples = 0;
                                jankDeltaSum = 0;
                            }
                        }
                    }
                    lastRafTs = now;

                    // Cap lite canvas to smooth delta-timed 30 FPS (prevents 90Hz/120Hz mobile GPU burn)
                    if (lastLiteDrawTs === 0 || now - lastLiteDrawTs >= 32) {
                        const dtMs = lastLiteDrawTs > 0 ? Math.min(64, now - lastLiteDrawTs) : 33.3;
                        lastLiteDrawTs = now;
                        renderLiteFrame(dtMs / 16.67);
                    }

                    rafId = requestAnimationFrame(renderFx);
                    return;
                }

                // Original untouched Desktop rendering path
                time += 0.016;
                cursorSpeed *= 0.85;
                ctx.clearRect(0, 0, cw, ch);

                drawStringArtRibbonsDesktop(isLightTheme);
                drawHarmonicStringsDesktop(isLightTheme);

                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    p.phase += 0.015;
                    p.x += p.vx + Math.sin(p.phase) * 0.14;
                    p.y += p.vy;

                    const dxm = p.x - mx;
                    const dym = p.y - my;
                    const dm = Math.hypot(dxm, dym);
                    if (dm > 0 && dm < 110) {
                        const push = ((110 - dm) / 110) * 0.9;
                        p.x += (dxm / dm) * push;
                        p.y += (dym / dm) * push;
                    }

                    if (p.y < -12) {
                        p.y = ch + 12;
                        p.x = Math.random() * cw;
                    }
                    if (p.x < -12) p.x = cw + 12;
                    if (p.x > cw + 12) p.x = -12;

                    ctx.fillStyle = p.gold
                        ? (isLightTheme ? "rgba(180, 83, 9, 0.34)" : "rgba(255, 234, 0, 0.36)")
                        : (isLightTheme ? "rgba(190, 24, 93, 0.34)" : "rgba(255, 0, 127, 0.36)");
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                }

                rafId = requestAnimationFrame(renderFx);
            }

            function ensureRunning() {
                if (document.hidden || document.body.classList.contains("is-loading")) return;
                if (bgProfile.isLiteBg && bgProfile.isUltraLiteBg) {
                    renderLiteFrame(0);
                    return;
                }
                if (bgProfile.isMobile && isInputFocusedOnMobile) return;
                if (rafId === null) {
                    lastRafTs = 0;
                    lastLiteDrawTs = 0;
                    jankSamples = 0;
                    jankDeltaSum = 0;
                    rafId = requestAnimationFrame(renderFx);
                }
            }

            // Keep cached theme flag synced without reading DOM every frame
            const syncCanvasTheme = () => {
                isLightTheme = document.documentElement.getAttribute("data-appearance") === "light";
                if (bgProfile.isLiteBg) {
                    rebuildLitePalette();
                    if (bgProfile.isUltraLiteBg) {
                        renderLiteFrame(0);
                    }
                }
            };
            window.addEventListener("spotifake:appearance-change", syncCanvasTheme);
            window.addEventListener("pageshow", () => {
                syncCanvasTheme();
                ensureRunning();
            });

            // Pause background cleanly when tab is hidden
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    if (rafId !== null) {
                        cancelAnimationFrame(rafId);
                        rafId = null;
                    }
                    if (bgProfile.isLiteBg) {
                        document.body.classList.add("bg-is-paused");
                    }
                } else {
                    document.body.classList.remove("bg-is-paused");
                    ensureRunning();
                }
            });

            ensureRunning();
        }
    }
});
