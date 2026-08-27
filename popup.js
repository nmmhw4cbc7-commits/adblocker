const toggle = document.getElementById("toggleEnabled");
const statusLabel = document.getElementById("statusLabel");
const blockedCountEl = document.getElementById("blockedCount");
const resetBtn = document.getElementById("resetBtn");
const whitelistInput = document.getElementById("whitelistInput");
const whitelistAddBtn = document.getElementById("whitelistAddBtn");
const whitelistList = document.getElementById("whitelistList");
const historyToggle = document.getElementById("historyToggle");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

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

historyToggle.addEventListener("click", async () => {
  const isHidden = historyPanel.classList.toggle("hidden");
  if (!isHidden) await renderHistory();
});

clearHistoryBtn.addEventListener("click", async () => {
  chrome.runtime.sendMessage({ type: "CLEAR_HISTORY" }, () => {
    historyList.innerHTML = '<li class="history-empty">No blocked ads yet.</li>';
  });
});

async function renderHistory() {
  const { history = [] } = await chrome.runtime.sendMessage({ type: "GET_HISTORY" });
  historyList.innerHTML = "";
  if (!history.length) {
    historyList.innerHTML = '<li class="history-empty">No blocked ads yet.</li>';
    return;
  }
  for (const entry of history) {
    const li = document.createElement("li");
    const urlSpan = document.createElement("span");
    urlSpan.className = "history-url";
    urlSpan.textContent = entry.url || entry.initiator || "unknown";
    const metaSpan = document.createElement("span");
    metaSpan.className = "history-meta";
    const date = new Date(entry.timestamp);
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    metaSpan.textContent = (entry.type ? entry.type + " \u00b7 " : "") + timeStr;
    li.appendChild(urlSpan);
    li.appendChild(metaSpan);
    historyList.appendChild(li);
  }
}

document.addEventListener("DOMContentLoaded", render);
