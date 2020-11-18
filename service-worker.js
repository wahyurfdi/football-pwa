const CACHE_NAME = "premierleague-v5";
const URL_TO_CACHE = [
	"/",
	"/components/navbar.html",
	"/css/vendor/materialize-icon.css",
	"/css/vendor/materialize.css",
	"/css/vendor/materialize.min.css",
	"/css/custom.css",
	"/js/vendor/idb.js",
	"/js/vendor/materialize.js",
	"/js/vendor/materialize.min.js",
	"/js/api.js",
	"/js/db.js",
	"/js/index.js",
	"/manifest.json",
	"/push.js",
	"/img/background-profile.png",
	"/img/icon-pwa-512.png",
	"/img/icon-pwa-192.png",
	"/img/icon-pwa.png",
	"/img/icon.svg",
	"/img/me.jpg",
	"/img/premier-league-logo.png",
	"/index.html",
	"/pages/schedule.html",
	"/pages/schedule_saved.html",
	"/pages/teams.html",
	"https://fonts.googleapis.com/css2?family=Varela+Round&display=swap",
	"https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2"
];

self.addEventListener("install", function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(URL_TO_CACHE);
		})
	);
});

self.addEventListener("fetch", function (event) {
	var base_url = "https://api.football-data.org/";

	if (event.request.url.indexOf(base_url) > -1) {
		event.respondWith(
			caches.open(CACHE_NAME).then(function (cache) {
				return fetch(event.request).then(function (response) {
					cache.put(event.request.url, response.clone());
					return response;
				});
			})
		);
	} else {
		event.respondWith(
			caches
			.match(event.request, { ignoreSearch: true })
			.then(function (response) {
				return response || fetch(event.request);
			})
		);
	}
});

self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (cacheName != CACHE_NAME) {
						console.log("Serviceworker: cache" + cacheName + " dihapus");
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

self.addEventListener("push", function (event) {
	let body;

	if (event.data) {
		body = event.data.text();
	} else {
		body = "Tidak ada pesan";
	}

	let options = {
		body: body,
		icon: "/img/icon-pwa-192.png",
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		}
	};

	event.waitUntil(
		self.registration.showNotification("Push Notification", options)
	);
});