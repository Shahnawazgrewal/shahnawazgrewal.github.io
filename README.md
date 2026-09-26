# shahnawazgrewal.github.io

Academic homepage of **Shah Nawaz** — Assistant Professor, Institute of Computational
Perception (Multimedia Mining and Search group), Johannes Kepler University Linz.

Live at <https://shahnawazgrewal.github.io/>.

Plain static HTML/CSS/JS. No build step, no Jekyll, no dependencies — GitHub Pages
serves the files exactly as they are committed.

---

## Adding a publication

**Everything lives in [`publications.bib`](publications.bib). That is the only file you edit.**

1. Copy the BibTeX from Google Scholar, the ACM DL, IEEE Xplore or DBLP.
2. Paste it anywhere in `publications.bib`. Order does not matter — the site sorts by
   year, newest first, and groups by year on the publications page.
3. `git commit && git push`. The change is live within a minute.

Both the **Selected publications** list on the home page and the full, filterable list
on `publications.html` are rendered from that one file at page load, so you never
maintain the same paper twice.

### Fields the site understands

Standard BibTeX fields (`author`, `title`, `booktitle`, `journal`, `year`, `volume`,
`number`, `pages`) work as usual. On top of those:

| Field | Effect |
|---|---|
| `venue` | Short name shown in the badge, e.g. `ICASSP`. Falls back to `booktitle`/`journal`. |
| `type` | `conference`, `journal` or `workshop` — drives the badge colour and the filter chips. Guessed if omitted. |
| `selected` | `{true}` puts the paper in the **Selected publications** (spotlight) list on the home page. |
| `note` | One-line contribution statement. Shown only where the host element sets `data-notes="true"`. |
| `award` | Rendered as a ★ line, e.g. `{Honourable Mention, CVPR MULA Workshop}`. |
| `figure` | Teaser image, e.g. `{images/papers/key.webp}`. 21 of 28 papers have one, cropped from their own arXiv PDFs; the rest fall back to a typographic venue plate — see [`images/papers/README.md`](images/papers/README.md). |
| `pdf`, `url`, `doi`, `arxiv`, `code`, `project`, `video`, `slides`, `data` | Each becomes a small link button under the entry. `doi` and `arxiv` accept either a bare identifier or a full URL. |

Author names matching `Shah Nawaz` are bolded automatically. `Last, First` and
`First Last` orderings both work, and common LaTeX accents (`\"o`, `\'e`, `\ss`) are
converted to Unicode.

### Example

```bibtex
@inproceedings{nawaz2027flag,
  author    = {Shah Nawaz and Marta Moscati and Markus Schedl},
  title     = {FLAG 2027: Face-Voice Association across Languages and Gender},
  booktitle = {IEEE International Conference on Acoustics, Speech and Signal Processing},
  venue     = {ICASSP},
  year      = {2027},
  type      = {conference},
  selected  = {true},
  note      = {Principal investigator and lead organiser.},
  pdf       = {https://arxiv.org/pdf/2609.01234},
  code      = {https://github.com/shahnawazgrewal/flag2027},
  project   = {https://fame2027.github.io}
}
```

---

## Editing the rest of the site

| File | Contents |
|---|---|
| `index.html` | Bio, research themes, selected publications, experience, education, funding |
| `publications.html` | Full publication list (search box + type filters) |
| `research.html` | Research themes in prose |
| `challenges.html` | FAME 2024 / FAME 2026 / FLAG 2027 challenge series |
| `teaching.html` | Teaching portfolio and the 14 supervised projects |
| `service.html` | Area Chair / reviewing, invited talks, awards, references |
| `images/logos/` | Institution marks used by the experience/education rows — see [`images/logos/SOURCES.md`](images/logos/SOURCES.md) |
| `images/papers/` | Optional paper teaser figures — see [`images/papers/README.md`](images/papers/README.md) |
| `assets/css/style.css` | All styling, typography and the dark theme |
| `assets/js/publications.js` | BibTeX parser + renderer |
| `assets/js/site.js` | Theme toggle and nav highlighting |
| `legacy/` | The previous version of the site, kept for reference |

The nav bar is duplicated in each page's `<header>`; adding a page means adding one
`<a>` to each of the six files.

## Typography

Reading text — bio, headings, paper titles, role titles — is set in **Source Serif 4**.
UI chrome — nav, venue badges, author lines, dates, tags, filter chips, footer — is
set in **Inter**. Both load from Google Fonts.

The pairing is defined by two CSS custom properties at the top of
`assets/css/style.css`:

```css
--serif: "Source Serif 4", ...;   /* reading text */
--sans:  "Inter", ...;            /* UI chrome */
```

To try another pairing, change those two lines and the Google Fonts `<link>` in each
page's `<head>`. Alternatives that suit an academic page:

| Reading | UI | Character |
|---|---|---|
| Spectral | IBM Plex Sans | more technical |
| Newsreader | Inter | more editorial |
| Libre Baskerville | Libre Franklin | classic university press |

## Publication layout

Each publication list picks its layout from a `data-layout` attribute on the host
element:

```html
<div data-publications data-mode="selected" data-layout="teaser"></div>
<div data-publications data-mode="full"    data-layout="teaser"></div>
```

- `teaser` (current) — a figure per paper, falling back to a venue plate.
- `badge` — venue chip in a narrow left column; more compact.

## Local preview

`publications.bib` is loaded with `fetch()`, which browsers block on `file://` URLs.
Serve the folder over HTTP instead:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```
