/**
 * Spotifake | Login Controller with Unique Cyber Loading Screen Animation
 * BSIT / IT Extension Project
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginMessage = document.getElementById("login-message");
    const loginButton = document.getElementById("enter");
    const loginLoader = document.getElementById("loginLoader");
    const loaderStatus = document.getElementById("loaderStatus");
    const loaderFill = document.getElementById("loaderFill");
    const loaderPct = document.getElementById("loaderPct");
    const emailInput = document.getElementById("email");
    const welcomeNameSpan = document.querySelector(".welcome-header h1 span");
    const logoCircle = document.querySelector(".logo-circle");
    const logoAvatarImg = document.querySelector(".logo-circle img");

    const DEFAULT_USER_NAME = "JSON.TTUM";
    const DEFAULT_AVATAR = "photos/spotifyICON/lydbayot.jpg";

    function loadSavedUserProfile() {
        try {
            const raw = localStorage.getItem("spotifake_user_profile");
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function syncLoginProfileUI() {
        const savedTheme = localStorage.getItem("spotifake_theme");
        if (savedTheme) {
            document.documentElement.setAttribute("data-theme", savedTheme);
        }

        const profile = loadSavedUserProfile();
        const displayName = (profile && profile.name && profile.name.trim()) || DEFAULT_USER_NAME;
        const rawAvatar = (profile && profile.avatar) || DEFAULT_AVATAR;
        const avatarSrc = window.SpotifakePaths ? window.SpotifakePaths.asset(rawAvatar) : rawAvatar;
        const savedEmail = localStorage.getItem("spotifake-user") || (profile && profile.email);

        if (welcomeNameSpan) welcomeNameSpan.textContent = displayName;
        if (logoCircle) logoCircle.title = `${displayName} Spotifake Avatar`;
        if (logoAvatarImg) {
            logoAvatarImg.src = avatarSrc;
            logoAvatarImg.alt = `${displayName} Spotifake VIP Avatar`;
        }
        if (emailInput && savedEmail) {
            emailInput.value = savedEmail === "json.ttum@spotifake.io"
                ? "json.ttum@gmail.com"
                : savedEmail;
        }

        return { displayName, avatarSrc, profile };
    }

    syncLoginProfileUI();
    window.addEventListener("pageshow", syncLoginProfileUI);

    if (!loginForm) return;

    const GMAIL_REGEX = /^[^\s@]+@gmail\.com$/i;

    function clearLoginValidationState() {
        if (loginMessage) loginMessage.textContent = "";
        emailInput?.closest(".input-shell")?.classList.remove("is-invalid");
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = emailInput?.value.trim();
        const password = document.getElementById("password")?.value;
        const remember = document.getElementById("remember-me")?.checked;

        clearLoginValidationState();

        if (!email || !password) {
            if (loginMessage) loginMessage.textContent = "Please provide both email and password.";
            return;
        }

        if (!GMAIL_REGEX.test(email)) {
            if (loginMessage) loginMessage.textContent = "Please enter a valid @gmail.com email address.";
            const emailShell = emailInput?.closest(".input-shell");
            if (emailShell) {
                emailShell.classList.remove("is-invalid");
                void emailShell.offsetWidth;
                emailShell.classList.add("is-invalid");
            }
            emailInput?.focus();
            return;
        }

        // Disable button during loading
        if (loginButton) {
            loginButton.disabled = true;
            const label = loginButton.querySelector("span");
            if (label) label.textContent = "Authenticating…";
        }

        // Save session & preserve user's saved profile/name
        if (remember) {
            localStorage.setItem("spotifake-user", email);
        } else {
            localStorage.removeItem("spotifake-user");
            sessionStorage.setItem("spotifake-user", email);
        }

        const existingProfile = loadSavedUserProfile() || {};
        const currentDisplayName = (existingProfile.name && existingProfile.name.trim()) || DEFAULT_USER_NAME;
        try {
            localStorage.setItem("spotifake_user_profile", JSON.stringify({
                ...existingProfile,
                name: currentDisplayName,
                email: email
            }));
        } catch (e) { /* Ignore quota errors on login sync */ }

        // Trigger the Unique Cyber Loading Screen Animation
        if (loginLoader) {
            document.body.classList.add("is-loading");
            loginLoader.removeAttribute("hidden");

            const stages = [
                { pct: 25, text: `Authenticating VIP session for ${currentDisplayName}...`, delay: 200 },
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

            // Redirect after loading completion
            setTimeout(() => {
                window.location.href = "pages/home.html";
            }, 2100);
        } else {
            window.location.href = "pages/home.html";
        }
    });

    // Password visibility toggle
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("togglePasswordBtn");
    if (passwordInput && togglePasswordBtn) {
        togglePasswordBtn.addEventListener("click", () => {
            const reveal = passwordInput.type === "password";
            passwordInput.type = reveal ? "text" : "password";
            togglePasswordBtn.setAttribute("aria-pressed", String(reveal));
            togglePasswordBtn.setAttribute("aria-label", reveal ? "Hide password" : "Show password");
            togglePasswordBtn.title = reveal ? "Hide password" : "Show password";
            const icon = togglePasswordBtn.querySelector("i");
            if (icon) {
                icon.className = `fa-regular ${reveal ? "fa-eye-slash" : "fa-eye"}`;
            }
        });
    }

    // Typing reactivity on header waveform & equalizer
    let typingPulseTimer = null;
    [emailInput, passwordInput].forEach(inp => {
        inp?.addEventListener("input", () => {
            clearLoginValidationState();
            document.body.classList.add("is-typing");
            clearTimeout(typingPulseTimer);
            typingPulseTimer = setTimeout(() => {
                document.body.classList.remove("is-typing");
            }, 450);
        });
    });

    // Subtle interactive spotlight, 3D card tilt, parallax badges, and reactive EQ
    const bgStage = document.querySelector(".cyber-bg-stage");
    const loginCard = document.querySelector(".login-container");
    const eqBars = [...document.querySelectorAll(".bg-full-eq .eq-b")];
    const finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (bgStage && finePointer && !reducedMotion) {
        let rafPending = false;
        let pointerClientX = window.innerWidth / 2;
        let pointerClientY = window.innerHeight / 2;

        window.addEventListener("pointermove", (e) => {
            pointerClientX = e.clientX;
            pointerClientY = e.clientY;
            if (rafPending) return;
            rafPending = true;
            requestAnimationFrame(() => {
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

    // Interactive harmonic strings, string-art ribbons & ambient dust canvas
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

            const stringCount = window.innerWidth < 640 ? 6 : 9;
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

            const resizeCanvas = () => {
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                cw = window.innerWidth;
                ch = window.innerHeight;
                fxCanvas.width = Math.floor(cw * dpr);
                fxCanvas.height = Math.floor(ch * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            };
            resizeCanvas();
            window.addEventListener("resize", resizeCanvas, { passive: true });

            if (finePointer) {
                window.addEventListener("pointermove", (e) => {
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

            // Typing triggers subtle harmonic micro-plucks
            [emailInput, passwordInput].forEach((inp) => {
                inp?.addEventListener("input", () => {
                    const s = strings[Math.floor(Math.random() * strings.length)];
                    if (s) {
                        s.vel += (Math.random() > 0.5 ? 1 : -1) * 5.5;
                        s.pluckX = 0.25 + Math.random() * 0.5;
                        s.glow = Math.max(s.glow, 0.55);
                    }
                });
            });

            const count = window.innerWidth < 640 ? 18 : 34;
            const particles = Array.from({ length: count }, (_, i) => ({
                x: Math.random() * cw,
                y: Math.random() * ch,
                r: 1.0 + Math.random() * 1.7,
                vy: -(0.16 + Math.random() * 0.32),
                vx: (Math.random() - 0.5) * 0.2,
                phase: Math.random() * Math.PI * 2,
                gold: i % 2 === 0
            }));

            function drawStringArtRibbons(isLight) {
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

            function drawHarmonicStrings(isLight) {
                const segments = 64;
                for (let i = 0; i < strings.length; i++) {
                    const s = strings[i];
                    s.phase += s.driftSpeed;

                    // Spring-damper wave physics
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

            function renderFx() {
                if (document.body.classList.contains("is-loading")) return;
                time += 0.016;
                cursorSpeed *= 0.85;
                ctx.clearRect(0, 0, cw, ch);

                const isLight = document.documentElement.getAttribute("data-appearance") === "light";
                drawStringArtRibbons(isLight);
                drawHarmonicStrings(isLight);

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
                        ? (isLight ? "rgba(180, 83, 9, 0.34)" : "rgba(255, 234, 0, 0.36)")
                        : (isLight ? "rgba(190, 24, 93, 0.34)" : "rgba(255, 0, 127, 0.36)");
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                }

                requestAnimationFrame(renderFx);
            }
            requestAnimationFrame(renderFx);
        }
    }
});
