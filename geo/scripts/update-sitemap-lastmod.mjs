#!/usr/bin/env node
// update-sitemap-lastmod.mjs
//
// Canli sitemap'i indirir (veya yerel bir dosyayi okur), tum <url>
// girdilerinin <lastmod> degerini verilen tarihe ceker; <lastmod> alani
// olmayan girdilere ekler. Sonucu stdout'a yazar.
//
// Gereksinim: Node 18 veya uzeri (global fetch kullanir).
//
// Kullanim (internetin oldugu bir makinede, ornegin kendi Mac'inizde):
//   node update-sitemap-lastmod.mjs                     > sitemap.xml   # bugunun tarihi
//   node update-sitemap-lastmod.mjs 2026-07-06          > sitemap.xml   # verilen tarih
//   node update-sitemap-lastmod.mjs 2026-07-06 ./eski-sitemap.xml > sitemap.xml
//
// Cikan sitemap.xml dosyasini hosting kokune (httpdocs) yukleyin ve
// kaynak repodaki public/sitemap.xml ile de senkronlayin.

import { readFile } from 'node:fs/promises';

if (typeof fetch !== 'function') {
  console.error('Bu script Node 18 veya uzeri gerektirir (global fetch bulunamadi).');
  process.exit(1);
}

const DEFAULT_SOURCE = 'https://sabinamalikova.com/sitemap.xml';

const date = process.argv[2] ?? new Date().toISOString().slice(0, 10);
const source = process.argv[3] ?? DEFAULT_SOURCE;

const parsed = new Date(`${date}T00:00:00Z`);
if (
  !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
  Number.isNaN(parsed.getTime()) ||
  parsed.toISOString().slice(0, 10) !== date
) {
  console.error(`Gecersiz tarih: "${date}" (beklenen bicim: YYYY-MM-DD, gecerli bir takvim gunu)`);
  process.exit(1);
}

let xml;
if (/^https?:\/\//.test(source)) {
  const res = await fetch(source);
  if (!res.ok) {
    console.error(`Sitemap indirilemedi: HTTP ${res.status} (${source})`);
    process.exit(1);
  }
  xml = await res.text();
} else {
  xml = await readFile(source, 'utf8');
}

let updated = 0;
let added = 0;

const result = xml.replace(/<url>([\s\S]*?)<\/url>/g, (_, inner) => {
  if (/<lastmod>/.test(inner)) {
    inner = inner.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${date}</lastmod>`);
    updated++;
  } else {
    inner = inner.replace(/<\/loc>/, `</loc>\n    <lastmod>${date}</lastmod>`);
    added++;
  }
  return `<url>${inner}</url>`;
});

const total = (xml.match(/<url>/g) ?? []).length;
console.error(`Toplam ${total} URL: ${updated} lastmod guncellendi, ${added} lastmod eklendi (tarih: ${date})`);
process.stdout.write(result);
