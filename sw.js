const CACHE_VER = 'v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VER).then((cache) => {
      return cache.addAll([
        '/TerrariaHappiness/',
        '/TerrariaHappiness/index.html',
        '/TerrariaHappiness/script.js',
        '/TerrariaHappiness/DragDropTouch.js',
        '/TerrariaHappiness/style.css',
        '/TerrariaHappiness/res/PatrickHand-Regular.ttf',
        '/TerrariaHappiness/res/favicon.png',
        '/TerrariaHappiness/res/minus.png',
        '/TerrariaHappiness/res/plus.png',
        '/TerrariaHappiness/res/NPCs/Angler.png',
        '/TerrariaHappiness/res/NPCs/Arms Dealer.png',
        '/TerrariaHappiness/res/NPCs/Clothier.png',
        '/TerrariaHappiness/res/NPCs/Cyborg.png',
        '/TerrariaHappiness/res/NPCs/Demolitionist.png',
        '/TerrariaHappiness/res/NPCs/Dryad.png',
        '/TerrariaHappiness/res/NPCs/Dye Trader.png',
        '/TerrariaHappiness/res/NPCs/Goblin Tinkerer.png',
        '/TerrariaHappiness/res/NPCs/Golfer.png',
        '/TerrariaHappiness/res/NPCs/Guide.png',
        '/TerrariaHappiness/res/NPCs/Mechanic.png',
        '/TerrariaHappiness/res/NPCs/Merchant.png',
        '/TerrariaHappiness/res/NPCs/Nurse.png',
        '/TerrariaHappiness/res/NPCs/Painter.png',
        '/TerrariaHappiness/res/NPCs/Party Girl.png',
        '/TerrariaHappiness/res/NPCs/Pirate.png',
        '/TerrariaHappiness/res/NPCs/Princess.png',
        '/TerrariaHappiness/res/NPCs/Santa Claus.png',
        '/TerrariaHappiness/res/NPCs/Steampunker.png',
        '/TerrariaHappiness/res/NPCs/Stylist.png',
        '/TerrariaHappiness/res/NPCs/Tavernkeep.png',
        '/TerrariaHappiness/res/NPCs/Tax Collector.png',
        '/TerrariaHappiness/res/NPCs/Truffle.png',
        '/TerrariaHappiness/res/NPCs/Witch Doctor.png',
        '/TerrariaHappiness/res/NPCs/Wizard.png',
        '/TerrariaHappiness/res/NPCs/Zoologist.png',
        '/TerrariaHappiness/res/biomes/Desert.png',
        '/TerrariaHappiness/res/biomes/Forest.png',
        '/TerrariaHappiness/res/biomes/Hallow.png',
        '/TerrariaHappiness/res/biomes/Jungle.png',
        '/TerrariaHappiness/res/biomes/Mushroom.png',
        '/TerrariaHappiness/res/biomes/Ocean.png',
        '/TerrariaHappiness/res/biomes/Snow.png',
        '/TerrariaHappiness/res/biomes/Underground.png'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  var cacheKeeplist = [CACHE_VER];

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
