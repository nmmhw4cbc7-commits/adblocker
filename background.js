// background.js - service worker for Simple AdBlocker

const RULESET_ID = "ruleset_ads";
const WL_RULE_BASE = 20000;

const ALL_RESOURCE_TYPES = [
  "script", "image", "xmlhttprequest", "sub_frame",
  "media", "stylesheet", "font", "other"
];

async function syncWhitelistRules(whitelist) {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const oldIds = existing
    .filter((r) => r.id >= WL_RULE_BASE)
    .map((r) => r.id);

  const newRules = whitelist.map((domain, i) => ({
    id: WL_RULE_BASE + i,
    priority: 2,
    action: { type: "allow" },
    condition: {
      initiatorDomains: [domain],
      resourceTypes: ALL_RESOURCE_TYPES
    }
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldIds,
    addRules: newRules
  });
}

// Initialize badge and enabled state on install
chrome.runtime.onInstalled.addListener(async () => {
  const { enabled, whitelist } = await chrome.storage.local.get(["enabled", "whitelist"]);
  if (enabled === undefined) {
    await chrome.storage.local.set({ enabled: true, blockedCount: 0, whitelist: [] });
  }
  updateRulesetState();
  updateBadge();
  if (whitelist && whitelist.length) {
    await syncWhitelistRules(whitelist);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  updateRulesetState();
  updateBadge();
  const { whitelist = [] } = await chrome.storage.local.get("whitelist");
  if (whitelist.length) {
    await syncWhitelistRules(whitelist);
  }
});

async function updateRulesetState() {
  const { enabled } = await chrome.storage.local.get("enabled");
  if (enabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [RULESET_ID]
    });
  } else {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: [RULESET_ID]
    });
  }
}

async function updateBadge() {
  const { enabled, blockedCount } = await chrome.storage.local.get([
    "enabled",
    "blockedCount"
  ]);
  if (!enabled) {
    chrome.action.setBadgeText({ text: "OFF" });
    chrome.action.setBadgeBackgroundColor({ color: "#888888" });
    return;
  }
  const count = blockedCount || 0;
  chrome.action.setBadgeText({ text: count > 999 ? "999+" : String(count) });
  chrome.action.setBadgeBackgroundColor({ color: "#d93025" });
}

// Count blocked requests and log history via the matched rules feedback API
const MAX_HISTORY = 200;

if (chrome.declarativeNetRequest.onRuleMatchedDebug) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async (info) => {
    const { blockedCount, history = [] } = await chrome.storage.local.get(["blockedCount", "history"]);
    const newCount = (blockedCount || 0) + 1;

    const entry = {
      url: info.request?.url || "",
      initiator: info.request?.initiator || "",
      type: info.request?.type || "",
      timestamp: Date.now()
    };
    history.unshift(entry);
    if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;

    await chrome.storage.local.set({ blockedCount: newCount, history });
    updateBadge();
  });
}

// Listen for popup toggle messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TOGGLE_ENABLED") {
    chrome.storage.local.set({ enabled: message.enabled }).then(async () => {
      await updateRulesetState();
      await updateBadge();
      sendResponse({ success: true });
    });
    return true; // async response
  }
  if (message.type === "RESET_COUNT") {
    chrome.storage.local.set({ blockedCount: 0 }).then(() => {
      updateBadge();
      sendResponse({ success: true });
    });
    return true;
  }
  if (message.type === "UPDATE_WHITELIST") {
    syncWhitelistRules(message.whitelist || []).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
  if (message.type === "GET_HISTORY") {
    chrome.storage.local.get("history").then(({ history = [] }) => {
      sendResponse({ history });
    });
    return true;
  }
  if (message.type === "CLEAR_HISTORY") {
    chrome.storage.local.set({ history: [] }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

updateBadge();
