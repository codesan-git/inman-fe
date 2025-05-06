import { precacheAndRoute } from 'workbox-precaching'

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

// self.__WB_MANIFEST is injected by workbox
precacheAndRoute(self.__WB_MANIFEST)
