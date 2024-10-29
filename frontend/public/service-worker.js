// service-worker.js
let cachedData = "appV1";
self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    // self.skipWaiting(); // Activates the service worker as soon as it's installed
    event.waitUntil(
        caches.open(cachedData)
        .then((cache) => {
            cache.addAll([
                '/index.html',
                '/',
                '/assets/react-dom-BsKPv0mT.js',
                '/assets/index-_-maVoVq.js',
                '/@react-oauth-edsVJGFr.js',
                '/assets/@fortawesome-Com2JvGT.js ',
            ])
        })
    )
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated!!');
    return self.clients.claim();
});

// Fetch event listener in the service worker
self.addEventListener('fetch', (event) => {
    if(!navigator.onLine) {
        if(event.request.url.includes('/assets/index-_-maVoVq.js') || event.request.url.includes('/assets/react-dom-BsKPv0mT.js')) {
            event.waitUntil(
                self.registration.showNotification('Internet', {
                    body: "internet not working",
                })
            )
        }

        event.respondWith(
            caches.match(event.request)
            .then((res) => {
                if(res) {
                    return res;
                }
                let requestUrl = event.request.clone();
                fetch(requestUrl);
            })
        )
    }
});

// Optionally, you can listen for messages from the main app
// self.addEventListener('message', (event) => {
//     console.log('Received message from main app:', event.data);

//     // You can trigger push notifications here based on the data received
//     if (event.data.type === 'NOTIFICATIONS') {
//         // Display notification logic
//         if (Notification.permission === 'granted') {
//             self.registration.showNotification("Notification", {
//                 body: event.data.data,
//                 icon: '/icons/notification-icon.png',
//                 tag: 'notification-tag'
//             });
//         }
//         else {
//             console.log('Notification permission not granted.');
//         }
//     }
// });

self.addEventListener('message', (event) => {
    if (event.data.type === 'NOTIFICATIONS') {
        const notificationData = event.data.data;
        // Display notification
        self.registration.showNotification('New Notification', {
            body: notificationData,
            tag: `notification-${event.data.id}`,
            data: { url: event.data.url },  // Extra data can be passed here
            actions: [
                { action: 'open', title: 'Open App' }
            ]
        });
    }
});