# Notes

## Magic CSS quirks

- Bump `$css-version` (top of `rules.scss`) on every edit with `npm run bump`.
  The badge in the bottom-left corner shows the version that's live. If it
  doesn't update, close and reopen the editor, or reload the page.
- Magic CSS uses an old Sass. Write colors in the comma form,
  `rgba(0, 0, 0, 0.1)`, not `rgb(0 0 0 / 0.1)`. `npm run build` fails on the
  space-separated form.
- The build checks with current Dart Sass, which accepts more than Magic CSS
  does. A file that builds can still fail in Magic CSS, so check the badge after
  pasting.

## Beating the site's Tailwind styles

- The site uses Tailwind layers. Its `!important` classes (e.g.
  `hover:!bg-primary/10`) beat the theme's `!important`. Work around them with
  `background-image` (e.g. `linear-gradient($c, $c)`) or `box-shadow` fills.
- Plain (non-`!important`) site classes lose to any theme rule.
- Translucent site backgrounds (`bg-primary/5`, the 50% table-row mix) show the
  panel color behind them. Use opaque colors when the result looks washed out.

## How the files fit together

- `themes/<name>.scss`: color variables only.
- `rules.scss`: every selector, using only theme variables. The build rejects
  literal colors (`#fff`, `hsl(...)`, `rgba(...)`) here, so new colors go in the
  themes.
- `dist/<name>.scss`: generated. One theme plus `rules.scss` in a single file,
  ready to paste. Never edit it by hand.

`npm run build` regenerates `dist/` and compiles each file. The GitHub workflow
runs the same build on every change and commits `dist/` if it changed.

## Editing the rules or a theme

1. Edit `rules.scss` or `themes/<name>.scss`.
2. `npm run bump`
3. `npm run build`
4. Paste `dist/<name>.scss` into Magic CSS and check the badge.
5. Commit, including `dist/`.

Run `npm install` once first.

## Making a new theme

1. Copy `themes/terracotta.scss` to `themes/<new-name>.scss`.
2. Change the color values. Keep every variable name: `rules.scss` uses all of
   them, and the build fails with `Undefined variable` if one is missing.
3. `npm run build`. That creates `dist/<new-name>.scss` to paste.

When you add a rule that needs a new color, add the variable to every theme.
