# "Longevity <Şehir>" Google Sıralama Planı — 2026-07-18

Soru: "longevity ankara" (ve istanbul/frankfurt/london) aramasında
sabinamalikova.com neden görünmüyor, nasıl görünür yapılır?

Analiz: 6 ajanlı canlı denetim (4 şehir sayfası on-page + SERP analizi,
teknik indeksleme denetimi, sentez). Tüm bulgular canlı siteden ve gerçek
arama sonuçlarından alındı.

## Teşhis (özet)

Şehir sayfaları canlı, SSR'lı ve içerik olarak fena değil (~600 kelime,
Service/FAQPage/ProfessionalService JSON-LD). Ama:

1. **İçeriğin tamamı `<noscript>` içinde.** Google noscript içeriğini
   sıralamada büyük ölçüde yok sayar; ham HTML gövdesi bunun dışında boş bir
   `<div id="root">`. Yani sayfanın H1'i ve 600 kelimesi Google'ın birincil
   indeksleme yoluna görünmüyor.
2. **Hydration başlıkları eziyor (React SeoHead bug'ı).** JS yüklendikten
   sonra react-helmet title'ı jenerik "Longevity by Design — Locations &
   Topics" ile değiştiriyor; üstelik canonical TÜM /longevity/* sayfalarında
   sabit kodlanmış `/longevity/ankara`'yı gösteriyor — 12 sayfalık küme
   birbiriyle çelişen canonical sinyali yayıyor.
3. **Şehir sayfaları yetim.** Ana sayfa saf SPA: crawler'ın gördüğü HTML'de
   SIFIR `<a href>` var. Şehir sayfalarına crawler-görünür hiçbir iç link
   yok; yalnızca sitemap'ten biliniyorlar. Link eşitliği (PageRank) akmıyor.
4. **www / non-www kopyası.** `https://www.sabinamalikova.com/...` 301 olmadan
   200 dönüyor; Google SERP'te www ana sayfayı gösterirken canonical'lar
   non-www diyor — bölünmüş host sinyali.
5. **Sahte hreflang.** Ham HTML'de x-default ana sayfayı gösteriyor (yanlış
   hedef); hydration sonrası en/tr/de/ru/ar alternatifleri AYNI URL'yi
   gösteriyor (anlamsız).
6. **Dil boşluğu.** Ankara/İstanbul için Türkçe, Frankfurt için Almanca
   içerik yok (İngilizce-only, `lang=en`).
7. **SSR cache yarışı (tek gözlem).** /longevity/ankara bir kez İstanbul
   sayfasının gövdesini döndürdü (title + canonical + x-ssr-type: istanbul).
   12 tekrar denemede tekrarlamadı ama Googlebot'a bir kez böyle dönerse
   sayfa İstanbul'a canonicalize olur — ssr.php cache anahtarı incelenmeli.
8. **Bayat deploy her şeyi katmerliyor.** Canlı site hâlâ 2026-07-02 build'i.

**Kanıt — içerik yeterli, sorun yapısal:** Ankara sayfası Bing/DuckDuckGo
indeksinde "longevity ankara" için 1. sırada. Google boşluğu editoryal değil;
render, iç link, host ve otorite kaynaklı.

**Intent gerçeği:** "longevity istanbul/london/frankfurt" SERP'leri klinik /
medikal turizm / biohacking sonuçlarıyla dolu; bu baş terimler kısa vadede
kazanılamaz. Baş terim yalnızca Ankara'da zayıf (en kazanılabilir). Diğer
şehirler "longevity interior design <city>", "longevity clinic design" ve
yerel dil varyantlarıyla kazanılır.

## P0 — Hemen (bu hafta)

1. **Bekleyen build'i DEPLOY et.** ssr.php tense fix, guardrails, Link header
   hepsi kaynak repoda ama canlıda yok. `npm run build` + deploy, sonra
   `geo/README.md` doğrulama komutları.
2. **Şehir sayfası gövdesini `<noscript>`'ten çıkar** (`public/ssr.php`):
   içeriği `<div id="root">` içine/öncesine gerçek HTML olarak bas; React
   hydrate etsin ya da değiştirsin. Tek başına en yüksek etkili düzeltme.
3. **SeoHead hydration bug'ını düzelt:** longevity-lp route'una şehrin kendi
   metaTitle/metaDescription'ını geçir; canonical'ı sabit '/longevity/ankara'
   yerine `window.location.pathname`'den türet.
4. **SSR gövdesine crawler-görünür iç linkler ekle:** /methodology,
   /methodology/evidence, /news/longevity-by-design, /longevity/clinic-design,
   /contact + kardeş şehirler (açıklayıcı anchor: "longevity interior design
   in Istanbul").
5. **index.html'e statik footer/nav bloğu ekle:** 10 şehir + 3 konu sayfasına
   anahtar kelimeli anchor'larla link — yetimlik biter.
6. **www → non-www 301 yönlendirmesi** (hosting/Cloudflare kuralı).
7. **Ankara dışındaki 3 sayfanın title'ını değiştir:** "Interior Design" öne,
   "Longevity <City>" title'da kalsın (aşağıdaki spesifikasyonlar). Ankara baş
   terimi hedeflemeye devam etsin.
8. **Intent köprüsü bölümü** (İstanbul/London/Frankfurt): "Looking for a
   longevity clinic in <city>? We design them." → /longevity/clinic-design.
9. **Deploy sonrası:** sitemap lastmod güncelle (`geo/scripts/...mjs`),
   sources.json yükle, geo/snippets bloklarını uygula, sonra **Google Search
   Console'da 4 şehir URL'si için indeksleme talebi** aç ve Coverage
   durumlarını kaydet.
10. **Düzeltilmiş OpenPR bültenini yayınla** (taslak hazır) ve eski 26 Mayıs
    bülteni için düzeltme/kaldırma talebi ilet.

## P1 — Yapısal (2-6 hafta)

- **Türkçe içerik + gerçek hreflang:** /tr/longevity/ankara ve
  /tr/longevity/istanbul gerçek Türkçe sayfalar ("longevity mimari ankara",
  "sağlıklı ev tasarımı" — rekabet sıfıra yakın). SeoHead.tsx:322-328 sahte
  hreflang'i kaldır (kısa vadede yalnız x-default).
- **Google Business Profile:** Ankara HQ (NeXT Level, Çankaya) — kategori
  "Interior Designer", web sitesi alanı /longevity/ankara'ya; Londra ofisi
  (71-75 Shelton Street) için ikinci kayıt. "longevity ankara" SERP'inde
  lokal pack'e girmenin tek yolu.
- **Schema yükseltmeleri:** methodology TechArticle'a citation/isBasedOn;
  şehir sayfalarına areaServed (ilçeler) + sameAs (Wikidata Q139913205,
  ORCID); Ankara'ya geçmiş-Event, Frankfurt'a gelecek-Event schema.
- **/longevity hub sayfası:** 13 sayfalık kümenin ebeveyni yok; ana nav'dan
  linkli bir hub oluştur.
- **Mevcut basından backlink:** Longevity Show organizatöründen konuşmacı
  profili linki (/longevity/ankara + Frankfurt); WorldHealth forum thread'ine
  EIN bülteni linkiyle yanıt; NatLawReview kopyası zaten 3 dofollow link
  veriyor.
- **Blog ↔ şehir sayfası çapraz linkleme** + vaka çalışması /project/
  sayfalarına bağlantı.
- **Outcome etiket kalıbını** 4 şehir sayfasında da sabitle (medikal-komşu
  SERP'lerde E-E-A-T koruması).

## P2 — Uzun vade

- 3 amiral vaka sayfası (240 m² Ankara konutu, Dripfy Clinic İstanbul,
  LR Rooms Frankfurt) — fotoğraf, plan, post-occupancy grafikleri.
- Frankfurt keynote (4-5 Eylül 2026) etrafında ikinci basın dalgası +
  keynote videosu (VideoObject).
- /de/longevity/frankfurt Almanca içerik ("Innenarchitekt Frankfurt gesundes
  Wohnen", "zirkadiane Beleuchtung").
- Pillar başına derin makale (CLCI/BCS/IAQM/AHR) EN+TR — konu ağacı.
- Tasarım/longevity medyasına outreach (Dezeen, Wallpaper*, Arkitera, AD
  Germany) — Londra/İstanbul baş terimleri için kalıcı otorite.
- Üç aylık GSC incelemesi: önce modifiye terimlerde 1. sayfa, sonra baş
  terime yeniden optimizasyon.

## Şehir Bazlı İçerik Spesifikasyonları

### Ankara (baş terimi hedefle — en kazanılabilir)

- **Title:** `Longevity Ankara | Longevity by Design HQ — Sabina Malikova Design Office`
- **TR Title (gelecek /tr sayfası):** `Longevity Ankara | Uzun Yaşam İçin İç Mimarlık — Sabina Malikova (Çankaya)`
- **H1:** `Longevity Ankara: Headquarters of the Longevity by Design Interior-Architecture Methodology`
- **Bölümler:** intent ayrıştırıcı giriş (klinik değil, yaşadığınız odalar);
  HQ + GBP haritası + hizmet ilçeleri (Çankaya, GOP, Oran, İncek, Beytepe,
  Bilkent); Ankara ışık/iklim bağlamı (karasal iklim, kış güneş açısı, ısınma
  kaynaklı PM2.5 → CLCI/IAQM kalibrasyonu); 240 m² konut vakası (+38% uyku,
  −29% stres, −50% alerji — etiketli) + /project linki; 13 Haziran keynote
  bölümü (geçmiş-Event schema, EIN bülteni dış doğrulama linki); 4 pillar
  özeti + methodology linkleri; klinik tasarımı intent köprüsü; SSS (+3 yeni:
  "Ankara'da longevity iç mimarlık ne demek?" vb.); kardeş şehir linkleri;
  entity footer (Bilkent BFA 2013, Wikidata, ORCID).
- **Hedef sorgular:** longevity ankara · longevity design ankara · longevity
  interior architecture ankara · wellness interior design ankara · longevity
  mimari ankara · uzun yaşam tasarımı ankara · sağlıklı ev tasarımı ankara ·
  çankaya iç mimar · sirkadiyen aydınlatma ankara

### İstanbul (modifiye terimler)

- **Title:** `Longevity Interior Design Istanbul — Measured Outcomes | Sabina Malikova`
- **H1:** `Longevity Interior Design in Istanbul: Measured Health Outcomes, Not Wellness Styling`
- **Bölümler:** intent kabul eden giriş (klinikler aramanın yarısı — biz o
  klinikleri TASARLIYORUZ); Dripfy Clinic vakası (+42% hasta memnuniyeti,
  %68 tekrar hasta — studio project data); Beyoğlu 80 m² loft retrofiti
  (REM 18→25%, PSS-10 24→13, astım semptomları giderildi); İstanbul yapı
  stoğu bağlamı (derin planlı eski daireler, trafik gürültüsü vs 55 dB AHR,
  nem/hava kalitesi vs IAQM); retrofit süreci; klinik+otel işletmecileri
  bölümü; pillar + evidence linkleri; SSS (ilçeler: Beyoğlu, Nişantaşı,
  Kadıköy, Bebek, Levent); çapraz linkler.
- **Hedef sorgular:** longevity interior design istanbul · longevity clinic
  design istanbul · wellness interior design istanbul · longevity iç
  mimarlık istanbul · longevity klinik tasarımı istanbul · sağlıklı ev
  tasarımı istanbul · beyoğlu daire yenileme iç mimar

### Frankfurt (modifiye + Almanca; keynote varlığını kullan)

- **Title:** `Longevity Frankfurt: Interior Design & Longevity Show Keynote | Sabina Malikova`
- **H1:** `Longevity Frankfurt: Interiors Engineered for Healthspan — Delivered, Not Promised`
- **Bölümler:** LR Rooms Frankfurt vakası (tamamlanmış longevity hospitality
  işi — Rhein-Main için kanıt); 4-5 Eylül keynote bölümü (gelecek-Event
  schema); Almanca içerik yolu (P2: /de sayfası); klinik tasarım köprüsü
  (Frankfurt SERP'inde sıralanan klinikler = potansiyel B2B müşteri);
  pillar + evidence; SSS; çapraz linkler.
- **Hedef sorgular:** longevity interior design frankfurt · longevity
  innenarchitektur frankfurt · gesundes wohnen innenarchitekt frankfurt ·
  wellness interior design frankfurt · longevity clinic interior design

### Londra (modifiye terimler; ofis adresi + GBP)

- **Title:** `Longevity Interior Design London | Sabina Malikova Design Office`
- **H1:** `Longevity Interior Design in London: Healthspan-Engineered Homes and Clinics`
- **Bölümler:** Covent Garden ofisi (71-75 Shelton Street) + Londra GBP;
  Londra bağlamı (düşük kış ışığı → CLCI, dönem daireleri retrofiti, şehir
  gürültüsü → AHR); klinik tasarımı köprüsü (Harley Street longevity klinik
  kümesi = B2B hedef); vaka verileri + etiket; pillar + evidence; SSS;
  çapraz linkler.
- **Hedef sorgular:** longevity interior design london · wellness interior
  design london · longevity clinic interior design london · healthy home
  interior design london · circadian lighting design london

## Görev Dağılımı

| Nerede | İşler |
|---|---|
| Kaynak repo (yerel Mac) | P0 2-5, 7-8; P1 hreflang/Türkçe sayfalar, schema, hub, çapraz linkler; şehir içerik güncellemeleri |
| Hosting/Cloudflare | Deploy; www→non-www 301; sitemap/sources.json/snippet yüklemeleri |
| Google hesapları | GSC indeksleme talepleri + Coverage takibi; GBP Ankara + Londra kayıtları |
| Basın/dış kaynak | OpenPR düzeltmesi; Longevity Show konuşmacı profili linki; WorldHealth forum yanıtı |

Not: ssr.php cache yarışı (madde 7) deploy'dan önce kaynak repoda
incelenmeli — şehir sayfaları arası içerik karışması Googlebot'a bir kez
bile yansırsa canonical zehirlenmesi yaratır.
