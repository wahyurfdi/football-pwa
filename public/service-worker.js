importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

workbox.precaching.precacheAndRoute([
    { url: "/components/navbar.html", 				revision: "1" },
    { url: "/css/vendor/materialize-icon.css", 		revision: "1" },
    { url: "/css/vendor/materialize.css", 			revision: "1" },
    { url: "/css/vendor/materialize.min.css", 		revision: "1" },
    { url: "/css/custom.css", 						revision: "1" },
    { url: "/js/vendor/idb.js", 					revision: "1" },
    { url: "/js/vendor/materialize.js", 			revision: "1" },
    { url: "/js/vendor/materialize.min.js", 		revision: "1" },
    { url: "/js/api.js", 							revision: "2" },
    { url: "/js/db.js", 							revision: "1" },
    { url: "/js/index.js", 							revision: "1" },
    { url: "/manifest.json", 						revision: "1" },
    { url: "/push.js", 								revision: "1" },
    { url: "/img/background-profile.png", 			revision: "1" },
    { url: "/img/icon-pwa-512.png", 				revision: "1" },
    { url: "/img/icon-pwa-192.png", 				revision: "1" },
    { url: "/img/icon-pwa.png", 					revision: "1" },
    { url: "/img/icon.svg", 						revision: "1" },
    { url: "/img/me.jpg", 							revision: "1" },
    { url: "/img/premier-league-logo.png", 			revision: "1" },
    { url: "/", 									revision: "1" },
    { url: "/index.html", 							revision: "1" },
    { url: "/pages/schedule.html", 					revision: "1" },
    { url: "/pages/schedule_saved.html", 			revision: "1" },
    { url: "/pages/teams.html", 					revision: "3" },
    { url: "/pages/teams_detail.html", 				revision: "1" }
]);

workbox.routing.registerRoute(
	"https://fonts.googleapis.com/css2?family=Varela+Round&display=swap",
	workbox.strategies.cacheFirst({
		cacheName: "google-font-webfonts",
		plugins: [
			new workbox.cacheableResponse.Plugin({
				statuses: [0, 200]
			}),
			new workbox.expiration.Plugin({
				maxAgeSeconds: 60 * 60 * 24 * 365,
				maxEntries: 30
			})
		]
	})
);

workbox.routing.registerRoute(
	"https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
	workbox.strategies.cacheFirst({
		cacheName: "materialize-icon"
	})
);

workbox.routing.registerRoute(
	/^https:\/\/api\.football-data\.org\/v2/,
	workbox.strategies.staleWhileRevalidate({
		cacheName: "api-football"
	})
);

workbox.routing.registerRoute(
	new RegExp("/schedule.html"),
	workbox.strategies.networkFirst({
		cacheName: "dynamic-page-schedule"
	})
);

workbox.routing.registerRoute(
	new RegExp("/teams_detail.html"),
	workbox.strategies.networkFirst({
		cacheName: "dynamic-page-team-detail"
	})
);

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