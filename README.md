# Seedling Kenya 🌱

A professional, robust single-page website for selling **apple, avocado and passion
fruit seedlings** in Kenya. Built with vanilla HTML/CSS/JS — no frameworks, no build
step — so it's fast, portable, and deployable anywhere (GitHub Pages, Cloudflare
Workers, any static host).

## ✨ Features

- **Avocado time-lapse video intro** — the site opens with a fullscreen growing
  avocado time-lapse before revealing the page (skip with Esc/click).
- **Three product cards with real photos** — Apple, Avocado and Passion Fruit
  seedlings with photos, features and per-product WhatsApp order buttons.
- **Light background wallpaper** — a soft multi-tone gradient backdrop across the
  page, with the dark animated video intro on top.
- **WhatsApp-first sales flow** — every CTA deep-links to
  [`wa.me/254711177839`](https://wa.me/254711177839) with pre-filled messages.
- Scroll-reveal animations, animated counters, sticky nav, mobile drawer menu.
- Responsive down to small phones; `prefers-reduced-motion` respected (video is
  hidden and the intro skipped instantly for reduced-motion users).
- Floating WhatsApp button with pulse.

## 🚀 Quick start

```bash
# serve locally
python3 -m http.server 8000     # then open http://localhost:8000

# or with node
npx serve .
```

## ☁️ Deploy to Cloudflare Workers

**Option A — Static assets (recommended):** upload the folder (including `assets/`)
via *Workers & Pages → Create → Upload assets*, or:

```bash
npx wrangler deploy
```

**Option B — Single-file worker:** bundle everything (text **and** binary assets —
video + photos, base64-encoded) into `worker.js` and paste it into the Workers
dashboard:

```bash
node build-worker.mjs
```

## 📁 Structure

```
index.html          Site markup (video intro, hero, products, why, how, faq, contact, footer)
styles.css          All styling incl. intro video, wallpaper, responsive rules
script.js           Intro timing, scroll reveal, counters, mobile nav
worker.js           Cloudflare Worker (serves static files / single-file bundle)
build-worker.mjs    Bundles site + assets into worker.js for single-file deploy
assets/
  avocado-timelapse.mp4   Intro video (10s, web-optimized)
  poster.jpg              Video poster frame
  apple.webp              Apple seedling photo
  avocado.webp            Avocado seedling photo
  passion.webp            Passion fruit photo
```

## 🛒 Contact

- **WhatsApp / Call:** [+254 711 177 839](https://wa.me/254711177839)
- **Nairobi, Kenya**

---

© Seedling Kenya. All rights reserved.
