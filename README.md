# Kiran Karnati · portfolio

Static site, three files, no build step. Facts match resume v4 (14 Oct 2026).

| File | What |
|---|---|
| `index.html` | The page. Edit copy here. |
| `styles.css` | Layout, the CSS books, motion, responsive rules. |
| `main.js` | Reveal-on-scroll, tab tracking, book tilt, copy-email. The page works with it disabled. |
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

- A new case study = copy one `<article class="chapter">` block, one `.vol` item in the sidebar, and one `.card` in "More from this shelf". Book colours are the `.book-N` / `.mini-N` variables in `styles.css`.
- Keep numbers in sync with the resume. If it isn't on the resume, it doesn't go on the site.
