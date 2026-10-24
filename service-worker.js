
const CACHE_NAME = "caca-ao-tesouro-v1";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon.svg"
];

self.addEventListener("install", (evento) => {
    evento.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ARQUIVOS);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
    evento.waitUntil(
        caches.keys().then((nomes) => {
            return Promise.all(
                nomes
                    .filter((nome) => nome !== CACHE_NAME)
                    .map((nome) => caches.delete(nome))
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
    if (evento.request.method !== "GET") {
        return;
    }

    const url = new URL(evento.request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    evento.respondWith(
        caches.match(evento.request).then((respostaCache) => {
            if (respostaCache) {
                return respostaCache;
            }

            return fetch(evento.request);
        })
    );
});
