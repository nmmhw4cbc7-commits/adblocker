// background.js - service worker for Simple AdBlocker

const RULESET_ID = "ruleset_ads";

// Initialize badge and enabled state on install
chrome.runtime.onInstalled.addListener(async () => {
  const { enabled } = await chrome.storage.local.get("enabled");
  if (enabled === undefined) {
    await chrome.storage.local.set({ enabled: true, blockedCount: 0 });
  }
  updateRulesetState();
  updateBadge();
});

chrome.runtime.onStartup.addListener(() => {
  updateRulesetState();
  updateBadge();
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

// Count blocked requests via the matched rules feedback API
if (chrome.declarativeNetRequest.onRuleMatchedDebug) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async () => {
    const { blockedCount } = await chrome.storage.local.get("blockedCount");
    const newCount = (blockedCount || 0) + 1;
    await chrome.storage.local.set({ blockedCount: newCount });
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
});

updateBadge();
