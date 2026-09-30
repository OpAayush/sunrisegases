// Ping IndexNow (Bing, Yandex, etc.) with every URL in the built sitemap. Run after deploy.
import { readFileSync } from 'node:fs';
const KEY = '981882b5bcd524d6102160ac3044bcb9';
const HOST = 'sunrisegases.com';
const xml = readFileSync(new URL('../dist/client/sitemap.xml', import.meta.url), 'utf8');
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log('IndexNow', res.status, urlList.length, 'URLs');
