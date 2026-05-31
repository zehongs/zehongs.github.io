# Zehong Shen's Homepage

Personal homepage for Zehong Shen, hosted with GitHub Pages.

## Structure

- `index.html` loads the static page shell and shared sections.
- `pages/` contains the profile and publication section markup.
- `publication/papers/index.json` controls publication order.
- `publication/papers/<slug>/paper.json` stores each publication entry.
- `images/` and `publication/slides/` contain media used by the site.

## Local Preview

Serve the repository root with any static HTTP server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
