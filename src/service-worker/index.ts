/// <reference types="@sveltejs/kit" />
import { build, files, version } from "$service-worker";

interface ExtendableEvent extends Event {
  clientId: string;
  request: Request;
  respondsWith: string;
  result: Response | undefined;
  source: ServiceWorker | string;

  waitUntil(promise: Promise<void>): void;

  respondWith(response: Response | Promise<Response>): void;
}

const CACHE_PREFIX = "cache";
const CACHE_VERSION = version;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const ASSETS: string[] = [...build, ...files];

self.addEventListener<any>("install", (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(ASSETS);
    })(),
  );
});

self.addEventListener<any>("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    })(),
  );
});

self.addEventListener<any>("fetch", (event: ExtendableEvent) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        return cachedResponse;
      }

      if (shouldCache(event.request)) {
        try {
          const response = await fetch(event.request);
          if (response.status === 200) {
            await cache.put(event.request, response.clone());
          }
          return response;
        } catch (err) {
          return (
            (await cache.match(event.request)) ??
            (await cache.match("/offline.html")) ??
            new Response("Error", { status: 500 })
          );
        }
      }

      return fetch(event.request);
    })(),
  );
});

function shouldCache(request: Request) {
  return (
    request.method === "GET" && request.url.includes("https://klevertopee.com/")
  );
}
