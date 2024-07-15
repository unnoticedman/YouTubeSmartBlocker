chrome.action.onClicked.addListener((tab) => {
    if (tab.url.includes("youtube.com")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          console.log("YouTube Ad Controller activado");
        }
      });
    }
  });