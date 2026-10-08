# zerosum-theme

Custom CSS themes for ZeroSum by Juulz. Apply them with the ZeroSum Themes
Chrome extension in [`extension/`](extension), or by pasting a file from
[`dist/`](dist) into [Magic CSS](https://github.com/webextensions/live-css-editor)
in SCSS mode.

## The Chrome extension

The extension downloads `dist/<theme>.css` from this repo on GitHub and applies
it to my.zerosumapp.com, including the installed desktop app (PWA). It keeps the
last copy it downloaded, so the theme shows instantly and still works offline.

### Install it once:

1. Get the `extension` folder: on GitHub, Code > Download ZIP, then unzip.
2. Open `chrome://extensions`, turn on Developer mode (top right), click Load
   unpacked, and pick the `extension` folder.
3. The settings page opens. Pick a theme.
4. Turn Magic CSS off for ZeroSum so the two don't both apply.

To open the settings later, click the extension's icon in a normal Chrome
window and choose Options, or go to `chrome://extensions` > ZeroSum Themes > Details > Extension
options. Changes apply to open ZeroSum windows right away.

- **Merged changes** show up on the next page load, but GitHub caches files for
  up to 5 minutes. Check the version badge.
- **Previewing a pull request:** put its branch name in the Branch box, check the
  result, then click Use main once it's merged.
- **Updating the extension itself** (only when `extension/` changes): download
  and unzip again over the same folder, then click the reload icon on the
  extension's card in `chrome://extensions`.

To change a theme, describe it in a Cursor chat on this repo and review the
pull request it opens; see [NOTES.md](NOTES.md) for that workflow, the
extension, editing by hand, and making a new theme. Agent conventions are in
[AGENTS.md](AGENTS.md).
