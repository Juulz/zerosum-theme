# zerosum-theme

Custom CSS themes for ZeroSum by Juulz. 
Apply them with the ZeroSum Themes Chrome extension in [`extension/`](extension), or by pasting a file from
[`dist/`](dist) into [Magic CSS](https://github.com/webextensions/live-css-editor) in SCSS mode.

## Chrome (ONLY)

No other browser is supported or planned.

The extension (see below) will never be published in the Play store and therefore needs to have Developer mode turned on to work. If you don't want to use the extension, install [Magic CSS](https://github.com/webextensions/live-css-editor), navigate to my.zerosumapp.com (or use the Chrome PWA) and paste one of the *.scss [`dist/`](dist) files into Magic's SCSS tab.

## Chrome Developer Extension

The extension downloads `dist/<theme>.css` from this repo on GitHub and applies it to my.zerosumapp.com, including the installed desktop app (PWA). 
It keeps the last copy it downloaded, so the theme shows instantly and still works offline.

### Install it once:

1. Get the `extension` folder: on [GitHub](https://github.com/Juulz/zerosum-theme), click on `<> Code`, then Download ZIP, then unzip.
2. Open `chrome://extensions`, turn on Developer mode (top right), click Load unpacked, and pick the `extension` folder in the extracted files. It should be at `zerosum-theme-main` > `zerosum-theme-main` > `extension` .
4. The settings page opens. Pick a theme.
5. Turn Magic CSS and any other Custom CSS extension off for ZeroSum so the two don't both apply.

To open the settings later, click the extension's icon in a normal Chrome window and choose Options, 
or go to `chrome://extensions` > ZeroSum Themes > Details > Extension options. 
Changes apply to open ZeroSum windows right away.

**NOTE: ** Themes are either light or dark and the appropriate mode needs to be chosen in Zerosum Appearance. You can choose light or dark after you choose the theme if you like.

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
