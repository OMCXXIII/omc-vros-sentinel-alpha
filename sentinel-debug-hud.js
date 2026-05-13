/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL DEBUG-HUD v1.0
   Monitoramento de Telemetria e Fluxo de Dados em Tempo Real
═══════════════════════════════════════════════════════════════════════════ */

(function() {
    const createDebugOverlay = () => {
        const overlay = document.createElement('div');
        overlay.id = 'sentinel-debug-hud';
        overlay.style = `
            position: fixed; top: 10px; right: 10px; width: 280px;
            background: rgba(0, 8, 12, 0.85); border: 1px solid var(--cyan-border, #00D4FF);
            color: #00D4FF; font-family: 'Share Tech Mono', monospace; font-size: 10px;
            padding: 10px; z-index: 10000; pointer-events: none;
            backdrop-filter: blur(5px); box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
        `;
        
        overlay.innerHTML = `
            <div style="border-bottom: 1px solid #00D4FF; padding-bottom: 5px; margin-bottom: 5px; font-weight: bold;">
                DEBUG_AUTHORITY_v1.0
            </div>
            <div id="debug-state-monitor">STATE: AGUARDANDO...</div>
            <div style="margin-top: 10px; border-top: 1px solid rgba(0,212,255,0.2); padding-top: 5px;">
                LAST_BUS_EVENT:
                <div id="debug-bus-monitor" style="color: #00FF41;">[IDLE]</div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    };

    window.addEventListener('load', () => {
        const hud = createDebugOverlay();
        const stateMon = document.getElementById('debug-state-monitor');
        const busMon = document.getElementById('debug-bus-monitor');

        if (window.SentinelBus) {
            // Monitorar todos os eventos do Bus
            const originalEmit = window.SentinelBus.emit;
            window.SentinelBus.emit = function(event, payload) {
                busMon.textContent = `> ${event}`;
                return originalEmit.apply(this, arguments);
            };

            // Monitorar mudanças no State
            window.SentinelBus.on('state:changed', (data) => {
                const state = window.StateStore?.all();
                stateMon.innerHTML = `
                    LATENCY: ${state.ops.latency}<br>
                    MISSION: ${state.ops.mission}<br>
                    CYCLES:  ${state.telemetry.cycles}<br>
                    PATH_UP: ${data.path}
                `;
            });
        }
    });
})();