const toggle = document.getElementById("toggleEnabled");
const statusLabel = document.getElementById("statusLabel");
const blockedCountEl = document.getElementById("blockedCount");
const resetBtn = document.getElementById("resetBtn");
const whitelistInput = document.getElementById("whitelistInput");
const whitelistAddBtn = document.getElementById("whitelistAddBtn");
const whitelistList = document.getElementById("whitelistList");

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
  await renderWhitelist();
}

async function renderWhitelist() {
  const { whitelist = [] } = await chrome.storage.local.get("whitelist");
  whitelistList.innerHTML = "";
  for (const domain of whitelist) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = domain;
    const btn = document.createElement("button");
    btn.className = "remove-btn";
    btn.textContent = "\u00d7";
    btn.addEventListener("click", async () => {
      const { whitelist: wl = [] } = await chrome.storage.local.get("whitelist");
      const updated = wl.filter((d) => d !== domain);
      await chrome.storage.local.set({ whitelist: updated });
      chrome.runtime.sendMessage({ type: "UPDATE_WHITELIST", whitelist: updated });
      await renderWhitelist();
    });
    li.appendChild(span);
    li.appendChild(btn);
    whitelistList.appendChild(li);
  }
}

async function addWhitelistDomain() {
  const raw = whitelistInput.value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!raw) return;
  const { whitelist: wl = [] } = await chrome.storage.local.get("whitelist");
  if (wl.includes(raw)) return;
  wl.push(raw);
  await chrome.storage.local.set({ whitelist: wl });
  chrome.runtime.sendMessage({ type: "UPDATE_WHITELIST", whitelist: wl });
  whitelistInput.value = "";
  await renderWhitelist();
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

whitelistAddBtn.addEventListener("click", addWhitelistDomain);
whitelistInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addWhitelistDomain();
});

document.addEventListener("DOMContentLoaded", render);
