let webPush = require("web-push");

const vapidKeys = {
  publicKey: "BDNRiICdScyfr9ZdxTjrDS9yVlYH4XyiyOJ-yDsWg9AiYjDymH0-iTs0hCJQhjBJwzi_NtDDcR4TYLxehgm6J5c",
  privateKey: "1TKREEwgACY5cNObgdeP3Kkpby58watgPG21simh-Pk"
};

webPush.setVapidDetails(
  "mailto:whyyou200028@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let pushSubscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/cRkhv2Jrfug:APA91bFhuuzJEzZ8otXrbmNaKwVtreK9lrfWUPlxfEOsdxOsjf0H3pyw-FvLgUyJg-bSJlZmM9lAlRy_TdqwLgu4X9fNTnoQ5VtzCz-a0bJmldyMWFgUCJlPBtx5f_CEbA_oOE91N5_l",
  keys: {
    p256dh: "BOo8vaWyquoNHDRRlJKysLtuarG+/2ed3dAQcIbO/NYkeoDZZt+qtiH2NMTAY6SktWSRAjRrme9y5L0kd6onmjA=",
    auth: "ypeussTFDeETcFIqDjXqUA==",
  },
};

let payload = "Hai! Selamat Berlangganan di Aplikasi ini";

let options = {
  gcmAPIKey: "159941098727",
  TTL: 60,
};

webPush.sendNotification(pushSubscription, payload, options);
