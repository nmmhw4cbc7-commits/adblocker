// content.js - cosmetic filtering: hides common ad containers via CSS
// Runs at document_start so styles apply before elements paint.

(async function () {
  const { whitelist = [] } = await chrome.storage.local.get("whitelist");
  const hostname = location.hostname.replace(/^www\./, "");

  const isWhitelisted = whitelist.some((entry) =>
    hostname === entry || hostname.endsWith("." + entry)
  );
  if (isWhitelisted) return;

  const isYouTube = /(^|\.)youtube\.com$/.test(hostname);

  const universalCss = `
    ins.adsbygoogle,
    iframe[src*="doubleclick.net"],
    iframe[src*="googlesyndication.com"],
    iframe[id^="google_ads_iframe"],
    .taboola,
    #taboola-below-article-thumbnails,
    .outbrain,
    .OUTBRAIN
  `;

  const genericCss = `
    [id*="google_ads"],
    [id^="div-gpt-ad"],
    [id*="ad-slot"],
    [id*="ad-wrapper"],
    [id*="ad-banner"],
    [class*="ad-slot"],
    [class*="ad-wrapper"],
    [class*="ad-banner"],
    [class^="ads-"],
    [class*=" ads-"],
    [class*="advertisement"],
    [class*="sponsored-content"]
  `;

  const containerCss = `
    [id*="ad-container"],
    [class*="ad-container"]
  `;

  let css = universalCss;
  if (!isYouTube) {
    css += ",\n" + genericCss + ",\n" + containerCss;
  }

  css += ` {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      width: 0 !important;
    }`;

  const style = document.createElement("style");
  style.id = "simple-adblocker-cosmetic-style";
  style.textContent = css;

  const inject = () => {
    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.documentElement.appendChild(style);
    }
  };

  inject();

  document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("simple-adblocker-cosmetic-style")) {
      inject();
    }
  });
})();
