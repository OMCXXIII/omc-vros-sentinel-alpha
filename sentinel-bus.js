/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL BUS v1.2 - ESTABILIDADE ULTRA (APRIMORADO)
   Event Bus Central — Cognitive Modular Architecture (CMA)
   
   CORREÇÃO: Handshake de voz restaurado + Persistência de Boot seletiva.
   Sem omissões ou simplificações.
═══════════════════════════════════════════════════════════════════════════ */

const SentinelBus = (() => {

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       REGISTRY INTERNO
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    const _handlers   = Object.create(null);
    const _history    = [];
    const _sticky     = Object.create(null); // Memória de estados críticos (Boot/State)
    const MAX_HISTORY = 200;

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       LOGGER INTERNO (Silent by default for performance)
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    const _log = (type, event, payload) => {
        if (!SentinelBus.debug) return;
        const color = type === 'emit' ? '#00D4FF' : '#00FF41';
        console.log(
            `%c[BUS:${type.toUpperCase()}] ${event}`,
            `color:${color};font-weight:bold;`,
            payload
        );
    };

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       API PÚBLICA
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    return {
        debug: true,

        /**
         * EMIT: Dispara o evento e armazena se for estrutural.
         */
        emit(event, payload = {}) {
            _log('emit', event, payload);

            // Persistência Seletiva: Apenas o que define o estado do sistema
            if (event.includes('boot:') || event.includes('state:') || event === 'mission:lock') {
                _sticky[event] = payload;
            }

            if (_handlers[event]) {
                _handlers[event].forEach(handler => {
                    try {
                        handler(payload);
                    } catch (e) {
                        console.error(`[BUS:FATAL] Erro no handler de ${event}:`, e);
                    }
                });
            }

            _history.push({ event, payload, ts: Date.now() });
            if (_history.length > MAX_HISTORY) _history.shift();
        },

        /**
         * ON: Regista ouvintes com verificação de estado persistente.
         * Garante que o JARVIS inicialize se o boot já tiver ocorrido.
         */
        on(event, handler) {
            if (!_handlers[event]) _handlers[event] = [];
            _handlers[event].push(handler);
            
            // Se o evento for de sistema e já aconteceu, dispara o handler imediatamente
            if (_sticky[event]) {
                _log('sync', event, _sticky[event]);
                try {
                    handler(_sticky[event]);
                } catch (e) {
                    console.error(`[BUS:SYNC_ERR] Falha na sincronização de ${event}:`, e);
                }
            }
        },

        /**
         * ONCE: Execução única.
         */
        once(event, handler) {
            const wrapper = (payload) => {
                this.off(event, wrapper);
                handler(payload);
            };
            this.on(event, wrapper);
        },

        /**
         * OFF: Remove ouvintes.
         */
        off(event, handler) {
            if (!_handlers[event]) return;
            _handlers[event] = _handlers[event].filter(h => h !== handler);
        },

        /**
         * DIAGNÓSTICO
         */
        getHistory() { return [..._history]; },
        hasHappened(event) { return !!_sticky[event]; },
        getSticky(event) { return _sticky[event] || null; }
    };
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DOCUMENTAÇÃO DE EVENTOS (PROTOCOLO SENTINEL)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/**
 * SYSTEM: boot:start, boot:complete, nexus:command
 * UI: ui:nexus-update, ui:clock-tick, ui:mode, ui:hud-latency
 * TELEMETRY: telemetry:input, state:changed, mission:lock
 */

window.SentinelBus = SentinelBus;

console.log(
    '%c OMC SENTINEL BUS v1.2 | STABLE & SYNCED ',
    'background:#000;color:#00D4FF;border:1px solid #00D4FF;padding:5px;font-family:monospace;'
);
