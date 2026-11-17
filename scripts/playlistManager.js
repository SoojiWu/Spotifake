/**
 * Spotifake | Playlist Manager Utility
 * Provides global functions for playlist CRUD operations.
 * Used by both Home.js and library.js via window.PlaylistManager
 */
(function () {
    "use strict";

    const STORAGE_KEY = "spotifake_custom_playlists";

    function loadPlaylists() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            if (!Array.isArray(parsed)) return [];
            const resolve = window.SpotifakePaths ? window.SpotifakePaths.asset : (p) => p;
            return parsed.map(pl => pl && pl.cover ? { ...pl, cover: resolve(pl.cover) } : pl);
        } catch (e) {
            return [];
        }
    }

    function savePlaylists(pls) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pls));
    }

    function getCreatorName() {
        try {
            const p = JSON.parse(localStorage.getItem("spotifake_user_profile") || "null");
            return (p && p.name && p.name.trim()) || "JSON.TTUM";
        } catch (e) {
            return "JSON.TTUM";
        }
    }

    function createPlaylist(opts) {
        const pls = loadPlaylists();
        const id = "custom-" + Date.now();
        pls.unshift({
            id: id,
            title: opts.title || "New Playlist",
            creator: getCreatorName(),
            type: "playlist",
            cover: opts.imageData || null,
            desc: opts.description || "",
            songs: []
        });
        savePlaylists(pls);
        return id;
    }

    function addSongToPlaylist(playlistId, songId) {
        const pls = loadPlaylists();
        const pl = pls.find(function (p) { return p.id === playlistId; });
        if (pl) {
            if (!pl.songs) pl.songs = [];
            if (!pl.songs.includes(songId)) {
                pl.songs.push(songId);
                savePlaylists(pls);
                return true;
            }
        }
        return false;
    }

    function removeSongFromPlaylist(playlistId, songId) {
        const pls = loadPlaylists();
        const pl = pls.find(function (p) { return p.id === playlistId; });
        if (pl && pl.songs) {
            pl.songs = pl.songs.filter(function (id) { return id !== songId; });
            savePlaylists(pls);
            return true;
        }
        return false;
    }

    function deletePlaylist(playlistId) {
        let pls = loadPlaylists();
        pls = pls.filter(function (p) { return p.id !== playlistId; });
        savePlaylists(pls);
    }

    function updatePlaylistCover(playlistId, imageData) {
        const pls = loadPlaylists();
        const pl = pls.find(function (p) { return p.id === playlistId; });
        if (pl) {
            pl.cover = imageData;
            savePlaylists(pls);
        }
    }

    // Expose globally
    window.PlaylistManager = {
        load: loadPlaylists,
        save: savePlaylists,
        create: createPlaylist,
        addSong: addSongToPlaylist,
        removeSong: removeSongFromPlaylist,
        delete: deletePlaylist,
        updateCover: updatePlaylistCover
    };
})();
