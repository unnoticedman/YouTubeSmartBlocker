(function() {
  const logData = [];

  function logInfo(message, details = {}) {
    const timestamp = new Date().toISOString();
    logData.push({ timestamp, message, details });
    console.log(`[LOG] ${timestamp}: ${message}`, details);
  }

  function saveLogData() {
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    logInfo("Log data saved to file");
  }

  function logNetworkRequests() {
    const originalFetch = window.fetch;
    window.fetch = function() {
      const url = arguments[0];
      logInfo(`[Network] Fetch request to: ${url}`);
      return originalFetch.apply(this, arguments);
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      this.addEventListener('load', function() {
        logInfo(`[Network] XMLHttpRequest to: ${url} with status: ${this.status}`);
      });
      originalXHROpen.apply(this, arguments);
    };
  }

  function logDOMMutations() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const targetDetails = mutation.target.outerHTML ? mutation.target.outerHTML.slice(0, 100) : mutation.target.nodeName;
        logInfo(`[DOM] Mutation observed: ${mutation.type} at ${targetDetails}`, {
          type: mutation.type,
          target: mutation.target.nodeName,
          attributeName: mutation.attributeName,
          addedNodes: Array.from(mutation.addedNodes).map(node => node.nodeName),
          removedNodes: Array.from(mutation.removedNodes).map(node => node.nodeName)
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }

  function addSaveLogButton() {
    const button = document.createElement('button');
    button.textContent = 'Save Log Data';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 10000;
    button.onclick = saveLogData;
    document.body.appendChild(button);
  }

  logNetworkRequests();
  logDOMMutations();
  addSaveLogButton();
})();
