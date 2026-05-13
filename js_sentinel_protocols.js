/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL PROTOCOLS v6.1
   Gestão de Telemetria, Clock ATC e Handshake de Dados
   Fragmento 3/4 — SOBERANIA OPERATIVA
   ---------------------------------------------------------------------------
   AJUSTE: Sincronização com Sequência de Boot (Quadro 4)
═══════════════════════════════════════════════════════════════════════════ */

const SentinelProtocols = (() => {
    
    // Cache de elementos do HUD para performance
    let clockDisplay = null;
    let latencyDisplay = null;

    const init = () => {
        clockDisplay = document.getElementById('clock-display');
        latencyDisplay = document.getElementById('latency-value');

        console.log('[PROTOCOLS] Handshake de Telemetria pronto.');
        _bindEvents();
    };

    const _bindEvents = () => {
        if (!window.SentinelBus) return;

        /**
         * AÇÃO CRÍTICA 4: Sincronização de Telemetria
         * O relógio só começa a renderizar quando a Engine-XR libera o SENTINEL_BOOTED
         */
        window.SentinelBus.on('ui:clock-tick', (data) => {
            if (!window.SENTINEL_BOOTED || !clockDisplay) return;

            // Renderização no Display ATC (mon-2r)
            if (clockDisplay.tagName.toLowerCase().startsWith('a-')) {
                clockDisplay.setAttribute('value', `CLOCK_ATC\n${data.time}\nSESSÃO: ${data.elapsed}s`);
            } else {
                clockDisplay.textContent = `${data.time} | ${data.elapsed}s`;
            }
        });

        // Monitoramento de Latência do Nexus
        window.SentinelBus.on('ui:hud-latency', (data) => {
            if (latencyDisplay) {
                latencyDisplay.textContent = data.value;
            }
        });
    };

    return { init };
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BOOT SEQUENCE INTEGRATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
if (window.SentinelBus) {
    // Protocols inicializa no momento do boot para aguardar os ticks
    window.SentinelBus.once('boot:complete', () => {
        SentinelProtocols.init();
        console.log('%c[PROTOCOLS] Sequência 4: Ouvintes de telemetria ativos.', 'color: #00FF41;');
    });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   INTERFACE DE COMANDO (PROTOCOLO CMD)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
document.addEventListener('keydown', (e) => {
    const cmdInput = document.querySelector('.cmd-input');
    if (!cmdInput || document.activeElement !== cmdInput) return;

    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        if (command && window.SentinelBus) {
            window.SentinelBus.emit('nexus:command', { raw: command });
            cmdInput.value = ''; // Clear buffer
        }
    }
});

// Exportação para o Escopo Global
window.SentinelProtocols = SentinelProtocols;
