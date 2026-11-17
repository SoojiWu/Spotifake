/**
 * Spotifake | Gallery Picture Picker
 * Opens Chromium's File System Access picker in "pictures" (and remembers the
 * Spotifake Gallery folder handle across sessions via IndexedDB) whenever any
 * image <input type="file"> is opened.
 */
(function () {
    "use strict";

    if (typeof window.showOpenFilePicker !== "function") return;

    const DB_NAME = "spotifake_gallery_picker";
    const STORE_NAME = "handles";
    const HANDLE_KEY = "last_image_handle";
    let cachedHandle = null;

    function openDb() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                reject(new Error("IndexedDB unavailable"));
                return;
            }
            const req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = () => {
                if (!req.result.objectStoreNames.contains(STORE_NAME)) {
                    req.result.createObjectStore(STORE_NAME);
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function preloadSavedHandle() {
        try {
            const db = await openDb();
            await new Promise((resolve) => {
                const tx = db.transaction(STORE_NAME, "readonly");
                const req = tx.objectStore(STORE_NAME).get(HANDLE_KEY);
                req.onsuccess = () => {
                    cachedHandle = req.result || null;
                    resolve();
                };
                req.onerror = () => resolve();
            });
        } catch (err) {
            cachedHandle = null;
        }
    }

    async function saveHandle(handle) {
        cachedHandle = handle;
        try {
            const db = await openDb();
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).put(handle, HANDLE_KEY);
        } catch (err) {
            /* Ignore persistence failure */
        }
    }

    preloadSavedHandle();

    function isImageFileInput(el) {
        return (
            el instanceof HTMLInputElement &&
            el.type === "file" &&
            !el.multiple &&
            (el.accept || "").toLowerCase().includes("image")
        );
    }

    async function openWithGalleryPicker(input) {
        try {
            const [handle] = await window.showOpenFilePicker({
                id: "spotifake-gallery",
                startIn: cachedHandle || "pictures",
                multiple: false,
                types: [
                    {
                        description: "Images",
                        accept: {
                            "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".bmp", ".svg"]
                        }
                    }
                ]
            });

            if (!handle) return;
            saveHandle(handle);

            const file = await handle.getFile();
            const dt = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;
            input.dispatchEvent(new Event("change", { bubbles: true }));
        } catch (err) {
            if (err && err.name === "AbortError") return;
            // Fallback to native <input type="file"> if picker blocked or cached handle stale
            cachedHandle = null;
            input.dataset.spNativeFallback = "1";
            HTMLInputElement.prototype.click.call(input);
        }
    }

    document.addEventListener("click", (e) => {
        const input = e.target;
        if (!isImageFileInput(input)) return;
        if (input.dataset.spNativeFallback === "1") {
            delete input.dataset.spNativeFallback;
            return;
        }
        e.preventDefault();
        openWithGalleryPicker(input);
    }, true);
})();
