document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("profileTaskbar");
    const profileBtn = document.getElementById("profileBtn");
    if (!menu || !profileBtn) return;

    const originalParent = menu.parentNode;
    const nextSibling = menu.nextSibling;
    const mobileView = window.matchMedia("(max-width: 767px)");
    const profileHeader = menu.querySelector(".taskbar-header");
    const triggers = [profileBtn, ...document.querySelectorAll("#mobileProfileTrigger, [data-open-profile-menu]")];
    const backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "profile-drawer-backdrop";
    backdrop.setAttribute("aria-label", "Close profile menu");
    backdrop.hidden = true;
    document.body.append(backdrop);

    let lastTrigger = profileBtn;
    let wasOpen = false;
    let navigationPending = false;

    function closeMenu(restoreFocus = false) {
        menu.classList.remove("open");
        if (restoreFocus) lastTrigger?.focus({ preventScroll: true });
    }

    function navigateWithDrawer(url) {
        if (navigationPending) return;
        navigationPending = true;
        if (mobileView.matches && menu.classList.contains("open") &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            try {
                sessionStorage.setItem("spotifake_profile_navigation", JSON.stringify({
                    url: new URL(url, location.href).href,
                    html: menu.innerHTML,
                    time: Date.now()
                }));
            } catch { /* Navigation still works if storage is unavailable. */ }
        }
        location.href = url;
    }

    function closeOverReadyPage() {
        const beginClosing = () => {
            document.body.classList.add("profile-navigation-closing");
            let fallback;
            const finish = () => {
                menu.removeEventListener("transitionend", onTransitionEnd);
                clearTimeout(fallback);
                document.body.classList.remove("profile-navigation-closing");
                navigationPending = false;
            };
            const onTransitionEnd = event => {
                if (event.target === menu && event.propertyName === "transform" &&
                    !menu.classList.contains("open") && event.elapsedTime >= 0.65) finish();
            };
            menu.addEventListener("transitionend", onTransitionEnd);
            fallback = setTimeout(finish, 850);
            closeMenu();
        };

        // Hidden modal pages need one painted frame at the drawer offset to slide in.
        if (document.querySelector(".mobile-subpage:not([hidden])")) {
            requestAnimationFrame(() => requestAnimationFrame(beginClosing));
        } else {
            beginClosing();
        }
    }

    function syncDrawer() {
        const mobile = mobileView.matches;
        if (profileHeader) {
            if (mobile) {
                profileHeader.setAttribute("role", "button");
                profileHeader.setAttribute("tabindex", "0");
                profileHeader.setAttribute("aria-label", "View profile");
            } else {
                profileHeader.removeAttribute("role");
                profileHeader.removeAttribute("tabindex");
                profileHeader.removeAttribute("aria-label");
            }
        }
        if (mobile && menu.parentNode !== document.body) {
            document.body.append(menu);
        } else if (!mobile && menu.parentNode !== originalParent) {
            originalParent.insertBefore(menu, nextSibling);
        }

        const open = mobile && menu.classList.contains("open");
        document.body.classList.toggle("mobile-profile-open", open);
        backdrop.hidden = !open;
        triggers.forEach(trigger => trigger.setAttribute("aria-expanded", String(menu.classList.contains("open"))));
        if (open && !wasOpen) menu.querySelector(".taskbar-item")?.focus({ preventScroll: true });
        wasOpen = open;
    }

    triggers.forEach(trigger => trigger.addEventListener("click", () => {
        lastTrigger = trigger;
    }, true));
    function openProfilePage() {
        if (!mobileView.matches) return;
        const source = location.pathname.split("/").pop();
        const from = ["home.html", "library.html", "playlist.html"].includes(source) ? source : "home.html";
        navigateWithDrawer(`profile.html?from=${encodeURIComponent(from)}`);
    }
    profileHeader?.addEventListener("click", openProfilePage);
    profileHeader?.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProfilePage();
        }
    });
    [["taskAccount", "account"], ["taskRecents", "recents"], ["taskSettings", "settings"]].forEach(([id, view]) => {
        document.getElementById(id)?.addEventListener("click", event => {
            if (!mobileView.matches) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            if (navigationPending) return;
            const source = location.pathname.split("/").pop();
            const from = ["home.html", "library.html", "playlist.html"].includes(source) ? source : "home.html";
            if (from === "home.html" && window.openMobileProfilePage?.(view)) {
                navigationPending = true;
                closeOverReadyPage();
                return;
            }
            navigateWithDrawer(`home.html?view=${view}&from=${encodeURIComponent(from)}`);
        }, true);
    });
    backdrop.addEventListener("click", () => closeMenu(true));
    menu.addEventListener("click", event => {
        if (event.target.closest(".taskbar-item")) closeMenu();
        event.stopPropagation();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && mobileView.matches && menu.classList.contains("open")) {
            closeMenu(true);
        }
    });
    mobileView.addEventListener("change", () => {
        closeMenu();
        syncDrawer();
    });
    window.addEventListener("pageshow", event => {
        if (event.persisted) navigationPending = false;
    });
    new MutationObserver(syncDrawer).observe(menu, { attributes: true, attributeFilter: ["class"] });
    syncDrawer();
});
