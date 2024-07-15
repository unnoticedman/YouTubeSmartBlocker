chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    return { cancel: true };
  },
  { urls: ["*://*.googlevideo.com/*ad*", "*://*.google.com/*ad*", "*://*.doubleclick.net/*"] },
  ["blocking"]
);
