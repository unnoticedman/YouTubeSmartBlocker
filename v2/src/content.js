const EXTENSION_NAME = 'YouTube ZapAd';
const EXTENSION_VERSION = '1.0.0';

let isZapAdEnabled = true;
let adObserver;
let zapButtonInterval;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "disable") {
        isZapAdEnabled = false;
        stopAllZapFunctions();
    } else if (request.action === "enable") {
        isZapAdEnabled = true;
        initAdZapper();
    }
});

function stopAllZapFunctions() {
    stopAdObserver();
    clearInterval(zapButtonInterval);
    hideCustomZapButton();
    // Detener cualquier otra función que esté corriendo
}

function isAdPlaying() {
    if (!isZapAdEnabled) return false;
    
    const adBadge = document.querySelector('.ytp-ad-simple-ad-badge');
    const adOverlay = document.querySelector('.ytp-ad-overlay-container');
    const adSkipButton = document.querySelector('.ytp-ad-skip-button');
    const adTextOverlay = document.querySelector('.ytp-ad-text-overlay');
    
    const videoPlayer = document.querySelector('video');
    const playerAds = document.querySelector('.video-ads');
    const isVideoAd = videoPlayer && (
        videoPlayer.closest('.ad-showing') || 
        videoPlayer.closest('.ad-interrupting') || 
        (playerAds && playerAds.children.length > 0)
    );

    const videoSrc = videoPlayer ? videoPlayer.src : '';
    const isAdUrl = videoSrc.includes('googlevideo.com/videoplayback') && 
                    (videoSrc.includes('&adformat=') || videoSrc.includes('&ad_type='));

    return !!(adBadge || adOverlay || adSkipButton || adTextOverlay || isVideoAd || isAdUrl);
}

function controlAds() {
    if (!isZapAdEnabled) return;

    const video = document.querySelector('video');
    
    if (isAdPlaying()) {
        console.log('Anuncio detectado');
        if (video) {
            video.muted = true;
            video.volume = 0;
        }
        showCustomZapButton();
        hideAdOverlays();
    } else {
        if (video && video.muted) {
            video.muted = false;
            video.volume = 1;
        }
        hideCustomZapButton();
    }
    
    const adElements = document.querySelectorAll('ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer');
    adElements.forEach(ad => ad.style.display = 'none');
}

function showCustomZapButton() {
    if (!isZapAdEnabled) return;

    let customZapButton = document.getElementById('zap-ad-button');
    if (!customZapButton) {
        customZapButton = document.createElement('button');
        customZapButton.id = 'zap-ad-button';
        customZapButton.innerText = '⚡ Zap Ad';
        customZapButton.style.position = 'fixed';
        customZapButton.style.bottom = '70px';
        customZapButton.style.right = '20px';
        customZapButton.style.zIndex = '9999';
        customZapButton.style.padding = '10px 15px';
        customZapButton.style.backgroundColor = '#4CAF50';
        customZapButton.style.color = 'white';
        customZapButton.style.border = 'none';
        customZapButton.style.borderRadius = '25px';
        customZapButton.style.cursor = 'pointer';
        customZapButton.style.fontFamily = 'Arial, sans-serif';
        customZapButton.style.fontSize = '16px';
        customZapButton.style.fontWeight = 'bold';
        customZapButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        customZapButton.style.transition = 'all 0.3s ease';
        customZapButton.onclick = zapAd;
        document.body.appendChild(customZapButton);
    }
    customZapButton.style.display = 'block';
}

function hideCustomZapButton() {
    const customZapButton = document.getElementById('zap-ad-button');
    if (customZapButton) {
        customZapButton.style.display = 'none';
    }
}

function hideAdOverlays() {
    if (!isZapAdEnabled) return;

    const overlays = document.querySelectorAll('.ytp-ad-overlay-container, .ytp-ad-player-overlay');
    overlays.forEach(overlay => overlay.style.display = 'none');
}

function zapAd() {
    if (!isZapAdEnabled) return;

    const video = document.querySelector('video');
    const skipButton = document.querySelector('.ytp-ad-skip-button');
    if (skipButton) {
        skipButton.click();
    } else if (video && isAdPlaying()) {
        try {
            if (isFinite(video.duration) && video.duration > 0) {
                video.currentTime = video.duration;
            } else {
                video.currentTime = video.currentTime + 30;
            }
        } catch (error) {
            console.error('Error al intentar zappear el anuncio:', error);
        }
    }
}

function startAdObserver() {
    adObserver = new MutationObserver(controlAds);
    adObserver.observe(document.body, { childList: true, subtree: true });
}

function stopAdObserver() {
    if (adObserver) {
        adObserver.disconnect();
    }
}

function restartAdObserver() {
    stopAdObserver();
    startAdObserver();
}

function startAdControlInterval() {
    setInterval(controlAds, 1000);
}

function startForceZapInterval() {
    zapButtonInterval = setInterval(() => {
        if (isZapAdEnabled && isAdPlaying()) {
            zapAd();
        }
    }, 500);
}

function logExtensionInfo() {
    console.log(`${EXTENSION_NAME} v${EXTENSION_VERSION} está activo y listo para zappear anuncios.`);
}

function simulateUserActivity() {
    if (!isZapAdEnabled) return;

    const video = document.querySelector('video');
    if (video) {
        const event = new MouseEvent('mousemove', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'clientX': Math.floor(Math.random() * window.innerWidth),
            'clientY': Math.floor(Math.random() * window.innerHeight)
        });
        document.dispatchEvent(event);

        const progressBar = document.querySelector('.ytp-progress-bar');
        if (progressBar) {
            progressBar.dispatchEvent(new MouseEvent('mouseover', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            }));
        }

        console.log('Actividad de usuario simulada');
    }
}

function startActivitySimulation() {
    setInterval(simulateUserActivity, 300000);
}

function initAdZapper() {
    if (!isZapAdEnabled) return;

    logExtensionInfo();
    startAdObserver();
    startAdControlInterval();
    startForceZapInterval();
    startActivitySimulation();
    
    setInterval(restartAdObserver, 30000);
}

if (document.readyState === 'complete') {
    initAdZapper();
} else {
    window.addEventListener('load', initAdZapper);
}