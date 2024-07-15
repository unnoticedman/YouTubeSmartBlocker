document.addEventListener('DOMContentLoaded', function() {
    var activateSwitch = document.getElementById('activateExtension');

    // Cargar el estado actual
    chrome.storage.sync.get('zapAdEnabled', function(data) {
        activateSwitch.checked = data.zapAdEnabled !== false; // Por defecto activado
    });

    // Manejar cambios en el switch
    activateSwitch.addEventListener('change', function() {
        var isEnabled = this.checked;
        chrome.storage.sync.set({zapAdEnabled: isEnabled}, function() {
            console.log('YouTube ZapAd está ' + (isEnabled ? 'activado' : 'desactivado'));
        });

        // Enviar mensaje a content.js
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: isEnabled ? "enable" : "disable"});
        });
    });
});