/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL ENGINE-XR
   Renderização A-Frame e Interação 3D
   Fragmento 2/4
═══════════════════════════════════════════════════════════════════════════ */

AFRAME.registerComponent('ghost-window', {
    schema: { title: {type: 'string', default: 'WINDOW'} },
    init: function () {
        this.el.addEventListener('mouseenter', () => {
            this.el.setAttribute('animation__scale', 'property: scale; to: 1.05 1.05 1.05; dur: 200');
            if (typeof VoiceCore !== 'undefined') VoiceCore.playFeedback('hover');
        });
        this.el.addEventListener('mouseleave', () => {
            this.el.setAttribute('animation__scale', 'property: scale; to: 1 1 1; dur: 200');
        });
    }
});

function bootSystem() {
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.style.display = 'none', 1500);
    }
    if (typeof VoiceCore !== 'undefined') {
        VoiceCore.speak("Sistema Sentinel Ativo. Soberania operativa confirmada.");
    }
}

function updateQuantumProximity() {
    const cam = document.getElementById('main-camera');
    const windows = document.querySelectorAll('.ghost-window');
    if (!cam) return;
    
    const camPos = cam.object3D.position;
    windows.forEach(win => {
        const winPos = win.object3D.position;
        const dist = camPos.distanceTo(winPos);
        const opacity = Math.max(0.3, 1 - (dist / 10));
        win.setAttribute('material', 'opacity', opacity);
    });
}

function _flushBuffer() {
    const displays = document.querySelectorAll('.ghost-window a-text');
    displays.forEach(d => {
        if (d.id === 'main-display') d.setAttribute('value', SYSTEM_STATE.ops.buffer || "AGUARDANDO INPUT...");
    });
}
