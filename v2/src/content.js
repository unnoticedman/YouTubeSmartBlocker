const EXTENSION_NAME = 'YouTube ZapAd';
const EXTENSION_VERSION = '1.0.0';

// Variables globales
let adObserver;
let zapButtonInterval;

// Función mejorada para detectar si se está reproduciendo un anuncio
function isAdPlaying() {
    // Buscar elementos específicos de anuncios
    const adBadge = document.querySelector('.ytp-ad-simple-ad-badge');
    const adOverlay = document.querySelector('.ytp-ad-overlay-container');
    const adSkipButton = document.querySelector('.ytp-ad-skip-button');
    const adTextOverlay = document.querySelector('.ytp-ad-text-overlay');
    
    // Verificar si el video actual tiene la clase 'ad-showing' o 'ad-interrupting'
    const videoPlayer = document.querySelector('video');
    const playerAds = document.querySelector('.video-ads');
    const isVideoAd = videoPlayer && (
        videoPlayer.closest('.ad-showing') || 
        videoPlayer.closest('.ad-interrupting') || 
        (playerAds && playerAds.children.length > 0)
    );

    // Verificar la URL del video en busca de parámetros de anuncios
    const videoSrc = videoPlayer ? videoPlayer.src : '';
    const isAdUrl = videoSrc.includes('googlevideo.com/videoplayback') && 
                    (videoSrc.includes('&adformat=') || videoSrc.includes('&ad_type='));

    return !!(adBadge || adOverlay || adSkipButton || adTextOverlay || isVideoAd || isAdUrl);
}

// Función principal para controlar los anuncios
function controlAds() {
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
            video.volume = 1; // O el volumen anterior si lo guardaste
        }
        hideCustomZapButton();
    }
    
    // Ocultar anuncios en la barra lateral
    const adElements = document.querySelectorAll('ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer');
    adElements.forEach(ad => ad.style.display = 'none');
}

// Función para mostrar botón personalizado para zappear
function showCustomZapButton() {
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

// Función para ocultar botón personalizado
function hideCustomZapButton() {
    const customZapButton = document.getElementById('zap-ad-button');
    if (customZapButton) {
        customZapButton.style.display = 'none';
    }
}

// Función para ocultar overlays de anuncios
function hideAdOverlays() {
    const overlays = document.querySelectorAll('.ytp-ad-overlay-container, .ytp-ad-player-overlay');
    overlays.forEach(overlay => overlay.style.display = 'none');
}

// Función para zappear el anuncio
function zapAd() {
    const video = document.querySelector('video');
    const skipButton = document.querySelector('.ytp-ad-skip-button');
    if (skipButton) {
        skipButton.click();
    } else if (video && isAdPlaying()) {
        try {
            if (isFinite(video.duration) && video.duration > 0) {
                video.currentTime = video.duration;
            } else {
                // Si la duración no es válida, intenta avanzar 30 segundos
                video.currentTime = video.currentTime + 30;
            }
        } catch (error) {
            console.error('Error al intentar zappear el anuncio:', error);
        }
    }
}

// Iniciar observación de cambios en el DOM
function startAdObserver() {
    adObserver = new MutationObserver(controlAds);
    adObserver.observe(document.body, { childList: true, subtree: true });
}

// Detener observación de cambios en el DOM
function stopAdObserver() {
    if (adObserver) {
        adObserver.disconnect();
    }
}

// Función para reiniciar el observador
function restartAdObserver() {
    stopAdObserver();
    startAdObserver();
}

// Iniciar intervalo para controlar anuncios
function startAdControlInterval() {
    setInterval(controlAds, 1000);
}

// Iniciar intervalo para forzar el botón de zappear
function startForceZapInterval() {
    zapButtonInterval = setInterval(() => {
        if (isAdPlaying()) {
            zapAd();
        }
    }, 500);
}

// Función para registrar información de la extensión
function logExtensionInfo() {
    console.log(`${EXTENSION_NAME} v${EXTENSION_VERSION} está activo y listo para zappear anuncios.`);
}

// Función de inicialización
function initAdZapper() {
    logExtensionInfo();
    startAdObserver();
    startAdControlInterval();
    startForceZapInterval();
    
    // Reiniciar el observador cada 30 segundos para asegurar que sigue funcionando
    setInterval(restartAdObserver, 30000);
}

// Iniciar el zappeador de anuncios cuando la página se carga completamente
if (document.readyState === 'complete') {
    initAdZapper();
} else {
    window.addEventListener('load', initAdZapper);
}