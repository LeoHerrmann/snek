self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("v1").then((cache) => {
            return cache.addAll([
                ".",
                "static/styles.css",
                "static/fontello/css/fontello.css",
                "static/jquery-3.4.1.min.js",
                "static/script.js",
                "static/PressStart2P.ttf",
                "static/fontello/font/fontello.woff2?84098909",
                "static/manifest.json",
                "static/icon_512.png"
            ]);
        })
    );
});



self.addEventListener("fetch", (event) => {
    if (event.request.url.indexOf("topten") == -1 && event.request.url.indexOf("enterLeaderboard") == -1) {
        event.respondWith(
            caches.match(event.request)
        );
    }

    else {
        event.respondWith(
            fetch(event.request)
        );
    }
});
