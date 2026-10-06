import { cssKey, getSettings } from "./settings.js";

const REPO = "https://raw.githubusercontent.com/Juulz/zerosum-theme";

async function fetchFromRepo(branch, path) {
  const ref = branch.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(`${REPO}/${ref}/${path}`, { cache: "no-cache" });
  if (!res.ok) {
    throw new Error(res.status === 404 ? `${path} not found on branch "${branch}"` : `GitHub returned ${res.status}`);
  }
  return res;
}

// Downloads the selected theme's CSS into storage; the content script applies it from there.
async function refresh() {
  const settings = await getSettings();
  if (!settings.theme) return { ok: true };
  try {
    const res = await fetchFromRepo(settings.branch, `dist/${settings.theme}.css`);
    const css = await res.text();
    const key = cssKey(settings);
    const { [key]: cached } = await chrome.storage.local.get(key);
    if (cached !== css) await chrome.storage.local.set({ [key]: css });
    await chrome.storage.local.set({ status: { ok: true, at: Date.now() } });
    return { ok: true };
  } catch (err) {
    await chrome.storage.local.set({ status: { ok: false, at: Date.now(), error: err.message } });
    return { ok: false, error: err.message };
  }
}

async function listThemes(branch) {
  try {
    const res = await fetchFromRepo(branch, "dist/themes.json");
    return { ok: true, themes: await res.json() };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

const SITE = "https://my.zerosum.com/*";

const injectInto = (tabId) =>
  chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] }).catch(() => {});

// Chrome only runs content scripts in pages loaded after install, so already-open
// ZeroSum windows get the script injected; one that still doesn't answer is injected again.
async function checkOpenTabs() {
  const tabs = await chrome.tabs.query({ url: SITE });
  const replies = await Promise.all(
    tabs.map(async (tab) => {
      try {
        return await chrome.tabs.sendMessage(tab.id, { type: "ping" });
      } catch {
        await injectInto(tab.id);
        return null;
      }
    }),
  );
  return { ok: true, open: tabs.length, replies: replies.filter(Boolean) };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "refresh") refresh().then(sendResponse);
  else if (message.type === "themes") listThemes(message.branch).then(sendResponse);
  else if (message.type === "tabs") checkOpenTabs().then(sendResponse);
  else return false;
  return true;
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  const tabs = await chrome.tabs.query({ url: SITE });
  await Promise.all(tabs.map((tab) => injectInto(tab.id)));
  if (reason === "install") chrome.runtime.openOptionsPage();
});
