# Agent instructions

This repo holds custom CSS themes for the ZeroSum budgeting site, applied with
the Magic CSS browser extension. Read [NOTES.md](NOTES.md) first: it covers the
file layout, Magic CSS quirks, and how the site's Tailwind styles behave.

## Handling a change request

The user describes a change and usually pastes the HTML of the element.

1. Pick selectors from the pasted HTML. Prefer stable hooks (`data-*`,
   `role`, `aria-label`, `mantine-*` classes) over layout utility classes.
   Tailwind classes with special characters need attribute selectors
   (`[class*="bg-primary/5"]`) or escaping (`.bg-muted\/40`).
2. Edit `rules.scss`. Put each rule in the section it belongs to. Reuse
   selectors from the dictionary at the top; add one there if it's used more
   than once.
3. Never write a literal color in `rules.scss`. Add a variable to **every**
   file in `themes/` (same name, same section), then use it.
4. If the site's own `!important` Tailwind class wins, don't stack more
   `!important`; use the `background-image` / `box-shadow` workarounds in
   NOTES.md.
5. Use comma-separated colors (`rgba(0, 0, 0, 0.1)`). Magic CSS's Sass is old
 (libsass 3.6). If you change nesting or interpolated selectors, compile with
 it too (see NOTES.md) and check its selectors match `dist/<theme>.css`.
6. `npm install` (once), `npm run bump`, then `npm run build`. Fix anything it
   reports. Never edit `dist/` by hand.
7. Commit the source changes and the rebuilt `dist/`, push, and open a pull
   request. In the description, list what changed in plain language, the
   new `$css-version`, which `dist/<theme>.scss` file to paste, and the branch
 name to preview in the Chrome extension.

The build workflow may push a "Rebuild dist/" commit to the branch if `dist/`
was stale, or a "Bump $css-version" commit adding a letter if a push changed
sources without bumping; pull before pushing again.

Bump the version once per pull request revision the user will paste. If you
push a fix to an open pull request after feedback, bump again.

Don't change unrelated rules or reformat existing ones; the user reviews
the diff.
