# Tanisha Tripathi — Creator Media Kit

A static website (no build step, no dependencies). Open `index.html` to preview.

```
tanisha-media-kit/
├── index.html            page shell
├── css/styles.css        all styling (colours & sizes = variables at the top)
├── js/
│   ├── config.js         ★ all content: stats, reels, brands, rates, cities, photos, contact
│   └── app.js            logic (rendering, carousel, share, copy/mail/print helpers)
└── assets/images/
    ├── hero/             the tilted photos beside the headline
    ├── gallery/          "Style, travel & golden hour" photo wall
    └── reels/            reel cover images
```

## Everyday changes (all in `js/config.js`)

| I want to…                         | Edit                                                        |
|------------------------------------|-------------------------------------------------------------|
| Update followers / views / averages | `CONFIG.numbers` (and `CONFIG.hero.chips` for the 2 floating chips) |
| Add a reel                          | Copy one `{ … }` in `CONFIG.reels`, paste, edit             |
| Change a reel cover                 | Put the new file in `assets/images/reels/`, set `image:` to its path |
| Remove a reel                       | Delete its `{ … }`                                          |
| Add / remove a gallery photo        | Add the file to `assets/images/gallery/`, add / delete its path in `CONFIG.gallery` |
| Change hero photos                  | `CONFIG.hero.photos` (1–5 paths)                            |
| Change rates                        | `CONFIG.rates.items`                                        |
| Change top cities                   | `CONFIG.audience.cities` (add `percent:` for real numbers)  |
| Change brands                       | `CONFIG.brands.names`                                       |
| Email / Instagram                   | `CONFIG.profile`                                            |
| Hide or reorder a section           | `CONFIG.layout`                                             |
| Change colours                      | `:root` variables at the top of `css/styles.css`            |

## Image tips
- Hero / gallery: portrait 3:4, about 900 px wide, JPG, under 200 KB each.
- Reel covers: 9:16 (e.g. 480×850), under 120 KB. Use the original reel cover for the sharpest look.

## Publishing (free)
Drag the whole folder onto **Netlify Drop** (app.netlify.com/drop), or push it to GitHub and enable GitHub Pages / Vercel.
After you have the final address, set `CONFIG.share.url` in `config.js` so "Copy link" and "Share" use it.

## If something looks wrong
Open the browser console (F12). Mistakes in `config.js` are reported there as `[media-kit] …` messages, and a broken section is skipped without breaking the rest of the page.
