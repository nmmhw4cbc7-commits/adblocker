# 🍋 Lime Adblocker

**A lightweight, fast and simple ad blocker for Google Chrome.**

Lime Adblocker removes unwanted advertisements and common trackers while keeping the browsing experience clean and fast.

> 🚧 Lime Adblocker is an independent project and is currently under active development.

---

## ✨ Features

* 🚫 **Block advertisements** — blocks requests to known advertising domains
* 🧹 **Hide ads on websites** — removes common advertising elements from webpages
* ⚡ **Lightweight** — built with native Chrome APIs
* 📊 **Block counter** — see how many requests have been blocked
* 🔘 **One-click toggle** — enable or disable blocking whenever you want
* 🔄 **Reset counter** — reset your blocked request statistics
* 🔒 **No account required**
* 🌐 **Works across websites**

---

## 🧠 How it works

Lime Adblocker uses two layers to block unwanted content.

### 1. Network blocking

Lime uses Chrome's `declarativeNetRequest` API to block matching network requests.

Instead of downloading an advertisement and hiding it afterwards, matching requests can be blocked before the resource is loaded.

This helps reduce unnecessary network traffic and page resources.

### 2. Cosmetic filtering

Some advertisements cannot easily be blocked at the network level.

For those cases, Lime injects CSS through a content script to hide common advertising elements directly on the page.

This includes things such as:

* Advertisement containers
* Banner advertisements
* Sponsored elements
* Common advertising iframes
* Selected third-party ad platforms

---

## 🛠️ Built with

| Technology                | Purpose                    |
| ------------------------- | -------------------------- |
| **JavaScript**            | Extension logic            |
| **HTML**                  | Popup interface            |
| **CSS**                   | Popup styling              |
| **Chrome Manifest V3**    | Browser extension platform |
| **declarativeNetRequest** | Network-level blocking     |

No frameworks or build tools are required.

---

## 📦 Installation

### Install manually

Lime Adblocker can currently be installed as an unpacked Chrome extension.

**1. Clone the repository**

```bash
git clone https://github.com/nmmhw4cbc7-commits/adblocker.git
```

**2. Open Chrome**

Go to:

```text
chrome://extensions
```

**3. Enable Developer mode**

Enable **Developer mode** in the top-right corner.

**4. Load the extension**

Click **Load unpacked** and select the cloned Lime Adblocker directory.

That's it. 🍋

---

## 🚀 Usage

After installing Lime Adblocker, pin the extension to your Chrome toolbar.

Click the Lime icon to open the popup.

From there you can:

**Protection**

Toggle ad blocking on or off.

**Blocked requests**

View the current number of blocked requests.

**Reset**

Reset the blocked request counter.

---

## 📁 Project structure

```text
adblocker/
│
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── background.js
├── content.js
├── index.html
├── manifest.json
├── popup.css
├── popup.html
├── popup.js
└── rules.json
```

### `manifest.json`

The main configuration file for the Chrome extension.

It defines the extension metadata, permissions, popup, service worker and filtering rules.

### `background.js`

The extension's background service worker.

It handles extension state, blocking functionality, request statistics and communication with the popup.

### `content.js`

Runs on webpages and handles cosmetic filtering.

It can hide advertising elements that are not blocked by the network rules.

### `rules.json`

Contains the network filtering rules used by Chrome's `declarativeNetRequest` API.

### `popup.html`

Defines the structure of the extension popup.

### `popup.js`

Controls the popup functionality, including the protection toggle and blocked-request counter.

### `popup.css`

Contains the styling for the extension popup.

---

## 🔐 Permissions

Lime Adblocker uses Chrome permissions required for its functionality.

| Permission                      | Why it is needed                |
| ------------------------------- | ------------------------------- |
| `declarativeNetRequest`         | Block matching network requests |
| `declarativeNetRequestFeedback` | Detect matching blocking rules  |
| `storage`                       | Store settings and statistics   |
| `tabs`                          | Access required tab information |
| `<all_urls>`                    | Apply filtering across websites |

Lime does not require an external account or backend server to perform its core blocking functionality.

---

## ⚠️ Limitations

No ad blocker can guarantee that every advertisement will be blocked.

Websites can:

* Change advertising domains
* Serve ads from their own domains
* Dynamically generate advertising elements
* Use anti-adblock mechanisms
* Change their HTML structure

Lime's filtering rules can therefore be expanded and improved over time.

---

## 🧑‍💻 Development

Lime Adblocker does not currently require a build process.

Simply edit the source files and reload the extension.

After making changes, open:

```text
chrome://extensions
```

Find **Lime Adblocker** and click **Reload**.

### Adding filtering rules

Network filtering rules can be added or modified in:

```text
rules.json
```

After changing the rules, reload the extension in Chrome.

---

## 🌐 Website

Visit the Lime Adblocker website:

**https://adblocker-lime.vercel.app/**

---

## 🗺️ Roadmap

Possible future improvements include:

* [ ] Improved filtering rules
* [ ] More advanced cosmetic filtering
* [ ] Whitelist support
* [ ] Per-site settings
* [ ] Improved statistics
* [ ] Dark mode
* [ ] Firefox support
* [ ] Microsoft Edge support
* [ ] Chrome Web Store release

---

## 🤝 Contributing

Contributions, suggestions and bug reports are welcome.

If you find an advertisement that Lime does not block, feel free to open an issue with:

1. The website where the advertisement appears
2. A short description of the advertisement
3. Any relevant details that could help reproduce the issue

---

## 📄 License

No open-source license has currently been specified for Lime Adblocker.

If you plan to allow others to freely use, modify and redistribute the project, consider adding a license such as the **MIT License**.

---

<div align="center">

### 🍋 Lime Adblocker

**A cleaner web, one request at a time.**

</div>
