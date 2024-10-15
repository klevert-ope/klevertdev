import { build, files, prerendered, version } from "$service-worker";
import { cacheNames, clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import * as navigationPreload from "workbox-navigation-preload";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

clientsClaim();

navigationPreload.enable();

const navigationCacheName = `${cacheNames.prefix}-navigations-${cacheNames.suffix}`;
const dynamicContentCacheName = `${cacheNames.prefix}-dynamic-content-${cacheNames.suffix}`;

const navigationRoute = new NavigationRoute(new NetworkFirst({
  cacheName: navigationCacheName,
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({
      maxAgeSeconds: 24 * 60 * 60 * 7,
      purgeOnQuotaError: true
    })
  ]
}));

registerRoute(navigationRoute);

const dynamicContentStrategy = new StaleWhileRevalidate({
  cacheName: dynamicContentCacheName,
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({
      maxAgeSeconds: 24 * 60 * 60 * 7,
      purgeOnQuotaError: true
    })
  ]
});

registerRoute(
  ({ url }) => url.pathname.startsWith("/[id]"),
  dynamicContentStrategy
);

const precacheList = [...build, ...files, ...prerendered].map((s) => ({
  url: s,
  revision: version
}));

precacheAndRoute(precacheList);

cleanupOutdatedCaches();
