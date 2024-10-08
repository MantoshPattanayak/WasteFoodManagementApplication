// service-worker.js

self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    self.skipWaiting(); // Activates the service worker as soon as it's installed
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated!!');
    return self.clients.claim();
});

// Fetch event listener in the service worker
// self.addEventListener('fetch', (event) => {
//     if (event.request.url.includes('viewFoodDonationList')) {
//         event.respondWith(
//             fetch(event.request)
//                 .then((response) => {
//                     if (!response || response.status !== 200) {
//                         return new Response('Error occurred', { status: 404 });
//                     }
//                     return response;
//                 })
//                 .catch((error) => {
//                     console.error('Fetch failed:', error);
//                     return new Response('Network error occurred', { status: 500 });
//                 })
//         );
//     }
// });

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
            icon: 'icon.png', // Specify your icon path here
        });
    }
});