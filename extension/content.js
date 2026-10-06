// Keep in sync with settings.js (content scripts can't import modules).
const DEFAULTS = { theme: "", branch: "main" };
const cssKey = ({ branch, theme }) => `css:${branch}:${theme}`;

const style = document.createElement("style");
style.id = "zerosum-theme-extension";
document.documentElement.appendChild(style);

// At document_start <head> doesn't exist yet; move the theme after the site's stylesheets once it does.
document.addEventListener("DOMContentLoaded", () => document.documentElement.appendChild(style));

let currentKey = null;

async function apply() {
  const { settings } = await chrome.storage.local.get("settings");
  const current = { ...DEFAULTS, ...settings };
  if (!current.theme) {
    currentKey = null;
    style.textContent = "";
    return;
  }
  currentKey = cssKey(current);
  const { [currentKey]: css = "" } = await chrome.storage.local.get(currentKey);
  style.textContent = css;
}

function refresh() {
  chrome.runtime.sendMessage({ type: "refresh" }).catch(() => {});
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.settings) {
    apply();
    refresh();
  } else if (currentKey && changes[currentKey]) {
    apply();
  }
});

apply();
refresh();
