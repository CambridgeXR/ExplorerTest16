const CACHE_NAME = 'vr-explorer-v1.2'; // Incremented version

// **IMPORTANT:** Update these paths to match your GitHub repo
const REPO_PATH = '/ExplorerTest16/';
const ASSETS_TO_CACHE = [
    REPO_PATH,
    REPO_PATH + 'index.html',
    REPO_PATH + 'style.css',
    REPO_PATH + 'video-data.js',
    REPO_PATH + 'manifest.json',
    'https://aframe.io/releases/1.5.0/aframe.min.js',
    'https://unpkg.com/aframe-simple-slider@1.1.0/dist/aframe-simple-slider.min.js' // UPDATED
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(err => console.error('Service Worker: Cache open failed', err))
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch Event - Serve from cache if available
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // If we have a match in the cache, return it
                if (response) {
                    return response;
                }
                // Otherwise, fetch from the network
                return fetch(event.request);
            })
    );
});
