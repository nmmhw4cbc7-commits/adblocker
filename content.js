// content.js - cosmetic filtering: hides common ad containers via CSS
// Runs at document_start so styles apply before elements paint.

(function () {
  const css = `
    [id*="google_ads"],
    [id^="div-gpt-ad"],
    [id*="ad-container"],
    [id*="ad-slot"],
    [id*="ad-wrapper"],
    [id*="ad-banner"],
    [class*="ad-container"],
    [class*="ad-slot"],
    [class*="ad-wrapper"],
    [class*="ad-banner"],
    [class^="ads-"],
    [class*=" ads-"],
    [class*="advertisement"],
    [class*="sponsored-content"],
    ins.adsbygoogle,
    iframe[src*="doubleclick.net"],
    iframe[src*="googlesyndication.com"],
    iframe[id^="google_ads_iframe"],
    .taboola,
    #taboola-below-article-thumbnails,
    .outbrain,
    .OUTBRAIN {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      width: 0 !important;
    }
  `;

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

  // Re-apply in case the <head> gets replaced by the page's own scripts
  document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("simple-adblocker-cosmetic-style")) {
      inject();
    }
  });
})();
