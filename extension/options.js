import { cssKey, getSettings } from "./settings.js";

const themeSelect = document.getElementById("theme");
const branchInput = document.getElementById("branch");
const resetBranch = document.getElementById("reset-branch");
const updateButton = document.getElementById("update");
const statusLine = document.getElementById("status");
const windowsLine = document.getElementById("windows");

let themeNames = {};

function setStatus(text, kind = "") {
  statusLine.textContent = text;
  statusLine.className = kind;
}

function setWindows(text, kind = "") {
  windowsLine.textContent = text;
  windowsLine.className = kind;
}

async function send(message) {
  const reply = await chrome.runtime.sendMessage(message).catch(() => null);
  return reply || { ok: false, error: "the extension didn't respond. Reload this page." };
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

async function renderWindows(settings, retried = false) {
  if (!settings.theme) {
    setWindows("");
    return;
  }
  const result = await send({ type: "tabs" });
  if (!result.ok) {
    setWindows("");
    return;
  }
  const key = cssKey(settings);
  const showing = result.replies.filter((r) => r.key === key && r.version).length;
  if (result.open === 0) {
    setWindows("No ZeroSum window is open.");
  } else if (showing === result.open) {
    setWindows(`Applied in ${plural(showing, "open ZeroSum window")}.`, "ok");
  } else if (!retried) {
    setTimeout(() => renderWindows(settings, true), 700);
  } else {
    setWindows(`${showing} of ${plural(result.open, "open ZeroSum window")} show it. Reload ZeroSum (Ctrl+R) to apply it.`, "error");
  }
}

function timeAgo(ms) {
  const minutes = Math.round((Date.now() - ms) / 60000);
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  return new Date(ms).toLocaleString();
}

async function renderStatus() {
  const settings = await getSettings();
  if (!settings.theme) {
    setStatus("No theme applied.");
    setWindows("");
    return;
  }
  const key = cssKey(settings);
  const { [key]: css, status } = await chrome.storage.local.get([key, "status"]);
  const name = themeNames[settings.theme] || settings.theme;
  const version = css && css.match(/content:\s*"CSS ([^"]+)"/);
  const showing = css ? `${name}${version ? ` (CSS ${version[1]})` : ""} is downloaded.` : `${name} isn't downloaded yet.`;
  if (status && !status.ok) {
    setStatus(`${showing} Update failed: ${status.error}`, "error");
  } else if (status) {
    setStatus(`${showing} Checked ${timeAgo(status.at)}.`, css ? "ok" : "");
  } else {
    setStatus(showing);
  }
  await renderWindows(settings);
}

async function loadThemes(branch, selected) {
  const result = await send({ type: "themes", branch });
  themeSelect.length = 1;
  themeNames = {};
  if (!result.ok) {
    setStatus(`Couldn't load the theme list: ${result.error}`, "error");
  }
  for (const theme of result.themes || []) {
    themeNames[theme.id] = theme.name;
    themeSelect.add(new Option(theme.name, theme.id));
  }
  if (selected && !(selected in themeNames)) {
    themeSelect.add(new Option(`${selected} (not on this branch)`, selected));
  }
  themeSelect.value = selected;
  if (result.ok) await renderStatus();
}

async function save(changes) {
  const settings = { ...(await getSettings()), ...changes };
  await chrome.storage.local.set({ settings });
  return settings;
}

async function update() {
  updateButton.disabled = true;
  setStatus("Checking for updates…");
  await send({ type: "refresh" });
  await renderStatus();
  updateButton.disabled = false;
}

themeSelect.addEventListener("change", async () => {
  await save({ theme: themeSelect.value });
  await update();
});

async function changeBranch(branch) {
  branchInput.value = branch;
  const settings = await save({ branch });
  await loadThemes(branch, settings.theme);
  if (settings.theme) await update();
}

branchInput.addEventListener("change", () => changeBranch(branchInput.value.trim() || "main"));
resetBranch.addEventListener("click", () => changeBranch("main"));
updateButton.addEventListener("click", update);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.status) renderStatus();
});

const initial = await getSettings();
branchInput.value = initial.branch;
await loadThemes(initial.branch, initial.theme);
