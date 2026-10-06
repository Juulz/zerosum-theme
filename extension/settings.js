export const DEFAULTS = { theme: "", branch: "main" };

export async function getSettings() {
  const { settings } = await chrome.storage.local.get("settings");
  return { ...DEFAULTS, ...settings };
}

export const cssKey = ({ branch, theme }) => `css:${branch}:${theme}`;
