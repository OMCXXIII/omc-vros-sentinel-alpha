/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL BUS v1.1 - CORREÇÃO DE HANDSHAKE MOBILE
   Event Bus Central — Cognitive Modular Architecture (CMA)
   Canal único de comunicação entre domínios: emit / on / off / once
   
   FIX: Implementação de Buffer de Persistência para eventos críticos de Boot.
═══════════════════════════════════════════════════════════════════════════ */

const SentinelBus = (() => {

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       REGISTRY INTERNO
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    const _handlers   = Object.create(null);
    const _history    = [];
    const _sticky     = Object.create(null); // Armazena o último estado de eventos críticos
    const MAX_HISTORY = 200;

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       LOGGER INTERNO
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
         * Emite um evento para o barramento.
         * Se for um evento de boot, ele é "marcado" como persistente.
         */
        emit(event, payload = {}) {
            _log('emit', event, payload);

            // Armazena eventos de ciclo de vida para módulos que carregarem depois
            if (event.includes('boot:') || event.includes('state:')) {
                _sticky[event] = payload;
            }

            if (_handlers[event]) {
                _handlers[event].forEach(handler => {
                    try {
                        handler(payload);
                    } catch (e) {
                        console.error(`[BUS:ERROR] Falha no handler de ${event}:`, e);
                    }
                });
            }

            _history.push({ event, payload, ts: Date.now() });
            if (_history.length > MAX_HISTORY) _history.shift();
        },

        /**
         * Registra um ouvinte. 
         * Se o evento já tiver ocorrido (ex: boot:complete no mobile), dispara imediatamente.
         */
        on(event, handler) {
            if (!_handlers[event]) _handlers[event] = [];
            _handlers[event].push(handler);
            
            // Replay imediato se for um evento persistente já disparado
            if (_sticky[event]) {
                _log('replay', event, _sticky[event]);
                handler(_sticky[event]);
            }
        },

        /**
         * Registra um ouvinte para execução única.
         */
        once(event, handler) {
            const wrapper = (payload) => {
                this.off(event, wrapper);
                handler(payload);
            };
            this.on(event, wrapper);
        },

        /**
         * Remove um ouvinte.
         */
        off(event, handler) {
            if (!_handlers[event]) return;
            _handlers[event] = _handlers[event].filter(h => h !== handler);
        },

        /**
         * Retorna o histórico de eventos.
         */
        getHistory() {
            return [..._history];
        },

        /**
         * Verifica se um evento específico já aconteceu.
         */
        hasHappened(event) {
            return !!_sticky[event];
        }
    };
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAPEAMENTO DE EVENTOS PADRÃO (DOCUMENTAÇÃO)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * DOMÍNIO: SYSTEM (Life Cycle)
 * boot:start           {} -> Início da sequência de carga.
 * boot:complete        {} -> Todos os sistemas (Engine-XR, Jarvis) prontos.
 * nexus:command        { raw: string } -> Comando vindo do teclado ou voz.
 */

/**
 * DOMÍNIO: UI / DISPLAY
 * ui:nexus-update      { string: string } -> Atualiza o display principal (mon-0).
 * ui:clock-tick        { time: string, elapsed: number } -> Atualiza clock-display.
 * ui:mode              { mode: string, active: boolean } -> Alterna CSS no body.
 * ui:hud-latency       { value: string } -> Atualiza latência no HUD.
 */

/**
 * DOMÍNIO: TELEMETRY
 * telemetry:input      {} -> Reseta idle timer e monitora atividade.
 * state:changed        { path: string, value: any } -> Notificação de mudança no StateStore.
 */

window.SentinelBus = SentinelBus;

console.log(
    '%c OMC SENTINEL BUS v1.1 ONLINE [BUFFER-ENABLED] ',
    'background:#000;color:#00FF41;border:1px solid #00FF41;padding:5px;font-family:monospace;'
);
