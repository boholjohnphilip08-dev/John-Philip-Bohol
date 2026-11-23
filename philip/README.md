# Personal Portfolio

A static, dependency-free portfolio site (HTML + CSS + vanilla JS).

## Run it
Open `index.html` in a browser. To host it, upload the whole folder to any static host
(GitHub Pages, Netlify, Vercel, Render static site).

## Personalise
Almost everything lives in **`js/data.js`**. Search for `⟵ REPLACE`.

| What | Where |
|---|---|
| Name, initials, roles, intro | `js/data.js` → top of file |
| Profile photo | put a square image in `assets/img/`, set `profileImage` |
| CV download | put a PDF in `assets/`, set `cvUrl` (until then the button reads "Request my CV") |
| Email + socials | `email`, `socials` (empty `url` hides a link) |
| About cards | `highlights` |
| Projects | `projects` — set `featured: true` on one; delete the `placeholder: true` slots as you add real work |
| Skills | `skills` |
| Awards / certificates | `awards` — drop scans in `assets/img/certificates/` |
| About paragraphs, section headings, SEO meta | `index.html` |
| Colours, fonts, spacing | tokens at the top of `css/styles.css` |

## Contact form
- **No backend (default):** the form validates input, then opens the visitor's email app
  with the message pre-filled, addressed to `email`.
- **Direct sending:** create a free form at <https://formspree.io>, paste the endpoint into
  `formEndpoint` in `js/data.js`. The form will then POST and show real success/error states.

## Structure
```
index.html
css/styles.css
js/data.js        ← your content
js/main.js        ← rendering + interactions
assets/
  favicon.svg
  img/profile-placeholder.svg
  img/projects/numify.webp       (screenshot of the live site)
  img/projects/numify-og.jpg     (social share preview)
  img/certificates/*.svg         (placeholders)
```
