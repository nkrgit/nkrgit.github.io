# Kiran Karnati · portfolio

Static site, three files, no build step. Facts match resume v4 (14 Oct 2026). Look: a lunar mission board (black, white, one orange), with a draggable case-study carousel over a CSS-built moonscape.

| File | What |
|---|---|
| `index.html` | The page. Edit copy here. |
| `styles.css` | The moonscape (stars, orbits, moon, ground), carousel, mission briefs, responsive rules. |
| `main.js` | Carousel controls and mouse drag, reveal-on-scroll, nav tracking, copy-email. With it disabled the carousel is still a native swipe strip. |
| `assets/Naga_Kiran_Reddy_Resume.docx` | Resume v4. Replace with a PDF export of the same file and update the two `assets/…` links in `index.html`. |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is. |

## Publish on GitHub Pages (about 5 minutes)

1. On GitHub, create a **public** repository named exactly `nkrgit.github.io`.
2. In this folder:
   ```
   git init -b main
   git add -A
   git commit -m "Portfolio v1"
   git remote add origin https://github.com/nkrgit/nkrgit.github.io.git
   git push -u origin main
   ```
3. Repository → Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`. The site is live at **https://nkrgit.github.io/** within a couple of minutes.

To use a different repo name (e.g. `portfolio`), the URL becomes `https://nkrgit.github.io/portfolio/`; change the `canonical` and `og:url` tags in `index.html` to match.

## Before you push

- [ ] Export resume v4 to PDF (WPS: File → Export to PDF) as `assets/Naga_Kiran_Reddy_Resume.pdf`, and point both resume links at it. The resume carries your phone number; the page itself doesn't.
- [ ] Optional: add `assets/og.png` (1200×630) for link previews, or delete the `og:image` tag.
- [ ] Update your GitHub profile bio (it still says "Grad student") and pin this repo.

## Editing

- A new case study = one `<li class="slide">` in the carousel, one `.thumb` link, and one `<article class="chapter">` block. Keep the slide count in sync with the thumbnails.
- Keep numbers in sync with the resume. If it isn't on the resume, it doesn't go on the site.
