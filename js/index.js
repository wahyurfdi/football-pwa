document.addEventListener("DOMContentLoaded", () => {

	// NAVIGATION MATERIALCSS
	const elems = document.querySelectorAll(".sidenav");
	const instances = M.Sidenav.init(elems);

	// LOAD NABAR CONTENT
	loadNav();

	function loadNav() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
		  if (this.readyState == 4) {
		    if (this.status != 200) return console.log(this.status);

		    document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
		      elm.innerHTML += xhttp.responseText;
		    });
		  }
		};

		xhttp.open("GET", "/components/navbar.html", true);
		xhttp.send();
	}

	// INSTALL SERVICEWORKER
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", function () {
		  navigator.serviceWorker
		    .register("../service-worker.js")
		    .then(function (registration) {
		      	console.log("ServiceWorker dinstall");
		      	return registration;
		    })
		    .catch(function () {
		      	console.log("ServiceWorker gagal diinstall");
		    });
		});
	} else {
		console.log("Service worker belum didukung browser ini");
	}

	// NOTIFIKASI PERMISSION
	if ("Notification" in window) {
		Notification.requestPermission().then((result) => {
		  if (result === "denied") {
		    console.log("Notifikasi tidak diijinkan");

		    return;
		  } else if (result === "default") {
		    console.log("Dialog notifikasi ditutup");

		    return;
		  }

		  if ("PushManager" in window) {
		    navigator.serviceWorker.getRegistration().then(function (registration) {
		      registration.pushManager
		        .subscribe({
		          userVisibleOnly: true,
		          applicationServerKey: urlBase64ToUint8Array(
		            "BDNRiICdScyfr9ZdxTjrDS9yVlYH4XyiyOJ-yDsWg9AiYjDymH0-iTs0hCJQhjBJwzi_NtDDcR4TYLxehgm6J5c"
		          ),
		        })
		        .then(function (subscribe) {
		          console.log(
		            "Berhasil melakukan subscribe dengan endpoint: ",
		            subscribe.endpoint
		          );
		          console.log(
		            "Berhasil melakukan subscribe dengan p256dh key: ",
		            btoa(
		              String.fromCharCode.apply(
		                null,
		                new Uint8Array(subscribe.getKey("p256dh"))
		              )
		            )
		          );
		          console.log(
		            "Berhasil melakukan subscribe dengan auth key: ",
		            btoa(
		              String.fromCharCode.apply(
		                null,
		                new Uint8Array(subscribe.getKey("auth"))
		              )
		            )
		          );
		        })
		        .catch(function (e) {
		          console.error("Tidak dapat melakukan subscribe ", e.message);
		        });
		    });
		  }
		});
	} else {
		console.log("Browser tidak mendukung notifikasi!");
	}

	function urlBase64ToUint8Array(base64String) {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
		  	outputArray[i] = rawData.charCodeAt(i);
		}

		return outputArray;
	}
});