/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL KERNEL
   Gestão de Estado, Persistência e Boot
   Fragmento 1/4 — ESTABILIZAÇÃO DE SINAL DE CLOCK
═══════════════════════════════════════════════════════════════════════════ */

const SYSTEM_STATE = {
    ui: {
        isSleep:  false,
        isShadow: false,
        isLocked: false
    },
    ops: {
        profile: 'ALPHA',
        buffer:  "",
        battery: 100
    },
    telemetry: {
        startTime: Date.now(),
        lastInput: Date.now(),
        latency:   12,
        mielina:   150
    }
};

const JARVIS_CONFIG = {
    apiEndpoint:      "",
    autoSaveInterval: 300000,
    voiceSensitivity: 0.8,
    lang:             'pt-BR'
};

const Kernel = {
    save: (profile, data) => {
        const payload = {
            data,
            timestamp: Date.now(),
            mielina: SYSTEM_STATE.telemetry.mielina
        };
        localStorage.setItem(`OMC_VR_OS_${profile}`, JSON.stringify(payload));
        console.log(`[KERNEL] Snapshot salvo: ${profile}`);
    },
    load: (profile) => {
        const raw = localStorage.getItem(`OMC_VR_OS_${profile}`);
        return raw ? JSON.parse(raw).data : "";
    }
};

/**
 * Ajuste de Sincronia: O sistema agora detecta se o relógio é um elemento 3D (A-Frame)
 * ou um elemento HUD 2D (HTML) para evitar erros de atribuição.
 */
function updateSessionClock() {
    const now = new Date();
    const clock = document.getElementById('session-clock');
    if (clock) {
        const timeStr = now.toLocaleTimeString('pt-BR', { hour12: false });
        // Se for componente A-Frame usa setAttribute, se for HTML usa innerText
        if (clock.tagName.toLowerCase().startsWith('a-')) {
            clock.setAttribute('value', timeStr);
        } else {
            clock.innerText = timeStr;
        }
    }
    setTimeout(updateSessionClock, 1000);
}

window.addEventListener('load', () => {
    console.log('%c OMC VR-OS | KERNEL v6.0 SENTINEL ', 'background:#000;color:#00D4FF;font-weight:bold;');
    
    // Recuperação de Buffer de Memória
    SYSTEM_STATE.ops.buffer = Kernel.load('ALPHA');
    if (typeof _flushBuffer === 'function') _flushBuffer();
    
    // Otimização de Hardware: Custo Metabólico Zero
    const scene = document.querySelector('a-scene');
    if (scene) {
        if (window.IS_MOBILE) {
            scene.setAttribute('renderer', 'precision: low; antialias: false; alpha: false; powerPreference: low-power');
        } else {
            scene.setAttribute('renderer', 'precision: high; antialias: true; powerPreference: high-performance');
        }
    }
    
    // Inicialização de Protocolos
    if (typeof VoiceCore !== 'undefined') VoiceCore.init();
    updateSessionClock();
    if (typeof updateDynamicFeeds === 'function') updateDynamicFeeds();

    // Loop de Telemetria e Proximidade Quântica
    let lastProx = 0;
    const PROX_INTERVAL = window.IS_MOBILE ? 100 : 16;
    
    function proximityLoop(ts) {
        if (ts - lastProx >= PROX_INTERVAL) {
            if (typeof updateQuantumProximity === 'function') updateQuantumProximity();
            lastProx = ts;
        }
        requestAnimationFrame(proximityLoop);
    }
    
    requestAnimationFrame(proximityLoop);
    if (typeof updateBioStatus === 'function') updateBioStatus();
});

/**
 * Interface de Comando de Voz: Unificada para evitar múltiplas instâncias
 * Gatilho: Tecla 'J' (Protocolo JARVIS)
 */
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'j') {
        if (typeof VoiceListener !== 'undefined') {
            VoiceListener.start();
            
            // Feedback Visual no Nexus Display (Camada Espacial)
            const nexus = document.getElementById('nexus-display');
            if (nexus) {
                nexus.setAttribute('value', 'STATUS: ESCUTA_ATIVA\nAGUARDANDO_INSTRUÇÃO...');
            }
            
            // Atualiza o timestamp de última atividade para evitar Alerta de Latência
            SYSTEM_STATE.telemetry.lastInput = Date.now();
        } else {
            console.warn('[KERNEL] VoiceListener não detectado no barramento.');
        }
    }
});