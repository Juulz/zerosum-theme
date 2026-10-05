# zerosum-theme

Custom CSS theme for ZeroSum by Juulz, applied with the
[Magic CSS](https://github.com/webextensions/live-css-editor) browser extension.

The source is [`src/zerosum.scss`](src/zerosum.scss). Paste the whole file into
Magic CSS with the Sass (SCSS) mode turned on.

## Workflow

1. Edit `src/zerosum.scss`.
2. Run `npm run bump` to bump `$css-version` (format `MM.DD.YY.N`; `N` resets
   to 1 on a new day).
3. Run `npm run check` to lint and compile.
4. Paste the file into Magic CSS. The badge in the bottom-left corner shows
   the version that's live. If it doesn't update, close and reopen the editor
   or reload the page.
5. Commit.

Run `npm install` once first. CI runs `npm run check` on every push and PR.

## Scripts

| Command         | What it does                                                    |
| --------------- | --------------------------------------------------------------- |
| `npm run check` | Lints for Magic CSS gotchas, then compiles to `dist/zerosum.css` |
| `npm run build` | Compiles only                                                   |
| `npm run bump`  | Bumps `$css-version`                                            |

The compile uses current Dart Sass, which is more forgiving than the old Sass
inside Magic CSS. The lint covers the one known incompatibility: colors must use
the comma form, `rgba(0, 0, 0, 0.1)`, not `rgb(0 0 0 / 0.1)`.

## Notes on the site's CSS

- The site uses Tailwind layers. Its `!important` classes (e.g.
  `hover:!bg-primary/10`) beat the theme's `!important`, so override them with
  `background-image` or `box-shadow` fills instead.
- Plain (non-`!important`) site classes lose to any theme rule.
- Translucent site backgrounds (`bg-primary/5`, the 50% table-row mix) show the
  panel color behind them. Use opaque colors when the result looks washed out.
