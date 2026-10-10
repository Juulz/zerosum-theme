# Notes

## Magic CSS quirks

- Bump `$css-version` (top of `rules.scss`) on every edit with `npm run bump`.
  The badge in the bottom-left corner shows the version that's live. If it
  doesn't update, close and reopen the editor, or reload the page.
- Edits pushed without a bump (e.g. made on GitHub) get a letter added by the
  build workflow: `10.06.26.5` becomes `10.06.26.5a`, then `5b`. The next
  `npm run bump` moves on to `10.06.26.6`.
- Magic CSS uses an old Sass. Write colors in the comma form,
  `rgba(0, 0, 0, 0.1)`, not `rgb(0 0 0 / 0.1)`. `npm run build` fails on the
  space-separated form.
- Don't put an interpolated selector list (e.g. `#{$rolling-number-digits}`) in
  the same nested selector as `&,`. Magic CSS's Sass drops the parent from it,
  so `span` alone ends up styled site-wide. Give it its own nested block.
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
- `dist/<name>.css` and `dist/themes.json`: generated. The compiled CSS and the
  theme list that the Chrome extension downloads.
- `extension/`: the ZeroSum Themes Chrome extension (see below).

`npm run build` regenerates `dist/` and compiles each file. The GitHub workflow
runs the same build on every change and commits `dist/` if it changed.

## The Chrome extension

The extension downloads `dist/<theme>.css` from this repo on GitHub and applies
it to my.zerosumapp.com, including the installed desktop app (PWA). It keeps the
last copy it downloaded, so the theme shows instantly and still works offline.

Install it once:

1. Get the `extension` folder: on GitHub, Code > Download ZIP, then unzip.
2. Open `chrome://extensions`, turn on Developer mode (top right), click Load
   unpacked, and pick the `extension` folder.
3. The settings page opens. Pick a theme.
4. Turn Magic CSS off for ZeroSum so the two don't both apply.

To open the settings later, click the extension's icon in a normal Chrome
window, or go to `chrome://extensions` > ZeroSum Themes > Details > Extension
options. Changes apply to open ZeroSum windows right away.

- **Merged changes** show up on the next page load, but GitHub caches files for
  up to 5 minutes. Check the version badge.
- **Previewing a pull request:** put its branch name in the Branch box, check the
  result, then click Use main once it's merged.
- **Updating the extension itself** (only when `extension/` changes): download
  and unzip again over the same folder, then click the reload icon on the
  extension's card in `chrome://extensions`.

## Working with an agent

1. Start a Cursor chat on this repo. Describe the change and paste the HTML of
   the element (in the browser: right-click it, Inspect, then right-click the
   element in DevTools and choose Copy > Copy outerHTML). Say which state it is
   in (hover, selected, pressed) if that matters.
2. The agent edits `rules.scss` and/or the themes, bumps `$css-version`,
   rebuilds `dist/`, and opens a pull request. The description says which file
   to paste and the new version.
3. Optionally preview it: put the pull request's branch name in the extension's
   Branch box.
4. Review the pull request on GitHub and click Merge.
5. With the extension, reload ZeroSum (switch the Branch box back to `main` if
   you previewed). With Magic CSS, copy `dist/<theme>.scss` from GitHub (open
   the file, then the Copy raw file button) and paste it. Either way, check
   that the badge shows the new version.

If it doesn't look right, reply in the same chat with what you see. The agent
updates the same pull request.

## Editing by hand

On GitHub, just edit and commit the file; the workflow adds a version letter
and rebuilds `dist/` within a minute. Locally:

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
