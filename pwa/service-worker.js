const cacheName = "fokus-cache-v1"; // É uma boa prática versionar o nome do cache
const preCache = [
  "./", // Adiciona a raiz para garantir que a página principal funcione
  "./index.html",
  "./styles.css",
  "./script.js",
  "./script-crud.js",
  "./imagens/logo.png",
  "./imagens/foco.png",
  "./imagens/descanso-curto.png",
  "./imagens/descanso-longo.png",
  "./imagens/play_arrow.png",
  "./imagens/pause.png",
  "./sons/luna-rise-part-one.mp3",
  "./sons/beep.mp3",
  "./sons/play.wav",
  "./sons/pause.mp3",
];

// 1. Instalação do Service Worker e Cache dos arquivos
self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalando...");
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("Service Worker: Adicionando arquivos ao cache");
      return cache.addAll(preCache);
    })
  );
  self.skipWaiting();
});

// 2. Ativação do Service Worker e Limpeza de caches antigos
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Ativando...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== cacheName) {
            console.log("Service Worker: Limpando cache antigo:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// 3. Interceptação de requisições para servir do cache (estratégia Cache First)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se o recurso estiver no cache, retorna do cache.
      // Senão, faz a requisição à rede.
      return response || fetch(event.request);
    })
  );
});