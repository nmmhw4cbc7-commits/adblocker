const toggle = document.getElementById("toggleEnabled");
const statusLabel = document.getElementById("statusLabel");
const blockedCountEl = document.getElementById("blockedCount");
const resetBtn = document.getElementById("resetBtn");

async function render() {
  const { enabled, blockedCount } = await chrome.storage.local.get([
    "enabled",
    "blockedCount"
  ]);
  toggle.checked = enabled !== false;
  statusLabel.textContent = toggle.checked
    ? "Protection is on"
    : "Protection is off";
  blockedCountEl.textContent = blockedCount || 0;
}

toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  statusLabel.textContent = enabled ? "Protection is on" : "Protection is off";
  chrome.runtime.sendMessage({ type: "TOGGLE_ENABLED", enabled });
});

resetBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "RESET_COUNT" }, () => {
    blockedCountEl.textContent = "0";
  });
});

document.addEventListener("DOMContentLoaded", render);
