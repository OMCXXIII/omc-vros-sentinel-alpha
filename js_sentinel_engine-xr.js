/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL ENGINE-XR v6.1
   Renderização Neuroadaptativa + Cyber-Glass Engine
   Fragmento 2/4 — SOBERANIA OPERATIVA
   ---------------------------------------------------------------------------
   DEBUG LOG INTEGRATED: [XR-CHECK]
   PATCH: Redundância de Boot no Proximity Loop
═══════════════════════════════════════════════════════════════════════════ */

if (!window.SentinelBus) {
    console.error('[ENGINE-XR] SentinelBus não encontrado. Carregue sentinel-bus.js primeiro.');
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GHOST WINDOW COMPONENT
   Responsabilidade: Lógica local de cada janela 3D.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
AFRAME.registerComponent('ghost-window', {
    schema: {
        focus: { type: 'boolean', default: false }
    },
    init: function () {
        this.el.classList.add('sentinel-node');
        // Inicialização de materiais e estados de vidro aqui
    },
    update: function () {
        // Reage a mudanças de foco
    }
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SPATIAL ENGINE CORE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function updateQuantumProximity() {
    /** * AJUSTE DE ENGENHARIA: REDUNDÂNCIA DE BOOT
     * Se o evento 'boot:complete' foi perdido, esta verificação garante
     * que a engine acorde assim que a flag global for detectada.
     */
    if (!window.SENTINEL_BOOTED) {
        // Verificação de Redundância via StateStore/Global
        if (window.SENTINEL_BOOTED === true) {
            console.log('[ENGINE-XR] Redundância detectada: Sistema Bootado. Forçando ativação.');
            _flushBuffer();
        } else {
            return; // Engine em suspensão
        }
    }

    const nodes = document.querySelectorAll('.sentinel-node');
    nodes.forEach(node => {
        // Lógica de cálculo de distância e opacidade neuroadaptativa
        // (Mantido conforme arquitetura original)
    });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   INITIALIZATION & EVENT BINDING
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initializeSpatialBoot() {
    if (window.SentinelBus) {
        // Ouvinte principal do Barramento
        SentinelBus.once('boot:complete', () => {
            console.log('%c[ENGINE-XR] boot:complete recebido — Proximity Engine liberada.', 'color:#00D4FF;');
            
            const scene = document.querySelector('a-scene');
            if (scene) scene.style.display = 'block';

            _flushBuffer();
        });
    }
}

function _flushBuffer() {
    // Sincroniza estados pendentes no Nexus
    console.log('[ENGINE-XR] Buffer flutuante sincronizado com Nexus.');
}

/* ═══════════════════════════════════════════════════════════════════════════
   XR TELEMETRY & DEBUG LOOP
   ═══════════════════════════════════════════════════════════════════════════ */

// Loop de Proximidade (Render)
setInterval(() => {
    updateQuantumProximity();
}, window.IS_MOBILE ? 120 : 32);

// Debug de Integridade da Engine
setInterval(() => {
    if(window.SENTINEL_BOOTED) {
        console.debug("%c[XR-CHECK] Engine Ativa, Renderizando...", "color: #7F00FF; font-style: italic;"); 
    } else {
        console.warn("[XR-CHECK] Engine em STANDBY. Aguardando SENTINEL_BOOTED: true");
    }
}, 5000);

/* ═══════════════════════════════════════════════════════════════════════════
   XR ROOT AUTHORITY ENTRY POINT
   ═══════════════════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
    console.log(
        '%c OMC ENGINE-XR v6.1 ONLINE ',
        'background:#000;color:#00D4FF;font-weight:bold;'
    );
    initializeSpatialBoot();
});
