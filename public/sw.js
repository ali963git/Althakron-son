self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: '🕌 موعد الصلاة', body: event.data.text() };
    }
  }

  const title = data.title || '🕌 تذكير بموعد الصلاة';
  const options = {
    body: data.body || 'حان الآن موعد الصلاة المبارك، تقبل الله منكم صالح الأعمال.',
    icon: data.icon || '/icon.png',
    badge: data.badge || '/badge.png',
    vibrate: data.vibrate || [200, 100, 200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open_app', title: 'فتح التطبيق 🕌' },
      { action: 'close', title: 'إغلاق ❌' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if ('focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
