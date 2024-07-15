document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle-button');
    const statusText = document.getElementById('status-text');
  
    toggleButton.addEventListener('click', function() {
      chrome.storage.sync.get('adBlockEnabled', function(data) {
        const adBlockEnabled = !data.adBlockEnabled;
        chrome.storage.sync.set({ adBlockEnabled: adBlockEnabled
        }, function() {
            statusText.textContent = adBlockEnabled ? 'enabled' : 'disabled';
            toggleButton.textContent = adBlockEnabled ? 'Disable Ad Blocker' : 'Enable Ad Blocker';
    
            // Notify background script to update the blocking rules
            chrome.runtime.sendMessage({adBlockEnabled: adBlockEnabled}, function(response) {
              console.log('Ad blocker status updated:', response);
            });
          });
        });
      });
    
      // Initialize the UI with the current status
      chrome.storage.sync.get('adBlockEnabled', function(data) {
        const adBlockEnabled = data.adBlockEnabled !== false;
        statusText.textContent = adBlockEnabled ? 'enabled' : 'disabled';
        toggleButton.textContent = adBlockEnabled ? 'Disable Ad Blocker' : 'Enable Ad Blocker';
      });
    });
      