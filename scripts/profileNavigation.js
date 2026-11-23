// Show a finished destination behind the mobile drawer as it closes.
(() => {
    const key = "spotifake_profile_navigation";
    let pending;
    try {
        pending = JSON.parse(sessionStorage.getItem(key) || "null");
        sessionStorage.removeItem(key);
    } catch {
        return;
    }
    if (!pending || pending.url !== location.href || Date.now() - pending.time > 10000 ||
        !window.matchMedia("(max-width: 767px)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // This runs in the head, before the unfinished destination can paint.
    document.documentElement.classList.add("profile-transition-preparing");
    document.addEventListener("DOMContentLoaded", () => {
        const drawer = document.createElement("div");
        drawer.className = "profile-taskbar profile-transition-drawer open";
        drawer.setAttribute("aria-hidden", "true");
        drawer.inert = true;
        drawer.innerHTML = pending.html;
        drawer.querySelector("#taskProfile")?.classList.add("profile-transition-profile-item");
        drawer.querySelectorAll("[id]").forEach(element => element.removeAttribute("id"));
        document.body.classList.add("mobile-profile-transition");
        document.body.append(drawer);

        let started = false;
        const readyFallback = setTimeout(start, 3000);
        window.addEventListener("spotifake:mobile-page-ready", start, { once: true });
        function start() {
            if (started) return;
            started = true;
            clearTimeout(readyFallback);
            document.documentElement.classList.remove("profile-transition-preparing");
            requestAnimationFrame(() => requestAnimationFrame(() => {
                let finishFallback;
                const finish = () => {
                    drawer.removeEventListener("transitionend", onTransitionEnd);
                    clearTimeout(finishFallback);
                    drawer.remove();
                    document.body.classList.remove("profile-navigation-closing");
                };
                const onTransitionEnd = event => {
                    if (event.target === drawer && event.propertyName === "transform") finish();
                };
                drawer.addEventListener("transitionend", onTransitionEnd);
                finishFallback = setTimeout(finish, 850);
                document.body.classList.add("profile-navigation-closing");
                document.body.classList.remove("mobile-profile-transition");
                drawer.classList.remove("open");
            }));
        }
    }, { once: true });
})();
