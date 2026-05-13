/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL BUS v1.0
   Event Bus Central — Cognitive Modular Architecture (CMA)
   Canal único de comunicação entre domínios: emit / on / off / once

   POSIÇÃO NO STACK: carregar ANTES de kernel.js no <head>
   <script src="sentinel-bus.js"></script>
   <script src="js_sentinel_kernel.js"></script>
═══════════════════════════════════════════════════════════════════════════ */

const SentinelBus = (() => {

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       REGISTRY INTERNO
       Mapa de canais de evento → array de handlers.
       Nenhum módulo externo acessa _handlers diretamente.
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    const _handlers   = Object.create(null);
    const _history    = [];
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

        /**
         * Modo debug — ativa logs coloridos no console.
         * Desligar em produção: SentinelBus.debug = false;
         */
        debug: true,

        /* ─────────────────────────────────────────────────
           on(event, handler)
           Registra um handler permanente para um evento.
           Retorna uma função de cleanup para desregistrar.

           Exemplo:
             const off = SentinelBus.on('state:change', ({key, val}) => {
                 console.log(key, val);
             });
             off(); // remove o handler
        ───────────────────────────────────────────────── */
        on(event, handler) {
            if (typeof handler !== 'function') {
                console.error(`[BUS] on("${event}"): handler deve ser uma função.`);
                return () => {};
            }
            if (!_handlers[event]) _handlers[event] = [];
            _handlers[event].push(handler);
            _log('on', event, { handlers: _handlers[event].length });
            return () => this.off(event, handler);
        },

        /* ─────────────────────────────────────────────────
           once(event, handler)
           Handler executado uma única vez e auto-removido.

           Exemplo:
             SentinelBus.once('boot:complete', () => {
                 initializeSpatialBoot();
             });
        ───────────────────────────────────────────────── */
        once(event, handler) {
            const wrapper = (payload) => {
                handler(payload);
                this.off(event, wrapper);
            };
            return this.on(event, wrapper);
        },

        /* ─────────────────────────────────────────────────
           off(event, handler)
           Remove um handler específico de um canal.
        ───────────────────────────────────────────────── */
        off(event, handler) {
            if (!_handlers[event]) return;
            _handlers[event] = _handlers[event].filter(h => h !== handler);
            _log('off', event, { handlers: _handlers[event].length });
        },

        /* ─────────────────────────────────────────────────
           emit(event, payload?)
           Dispara um evento para todos os handlers registrados.
           Execução síncrona — handlers são chamados em ordem.

           Exemplo:
             SentinelBus.emit('xr:material', {
                 target:    'mon-0',
                 emissive:  '#FF4B00',
                 intensity: 1.0
             });
        ───────────────────────────────────────────────── */
        emit(event, payload = {}) {
            _log('emit', event, payload);

            /* Armazena no histórico para debug */
            _history.push({ ts: Date.now(), event, payload });
            if (_history.length > MAX_HISTORY) _history.shift();

            const handlers = _handlers[event];
            if (!handlers || handlers.length === 0) return;

            /* Cópia defensiva: evita mutação do array durante iteração */
            [...handlers].forEach(fn => {
                try {
                    fn(payload);
                } catch (err) {
                    console.error(`[BUS] Erro no handler de "${event}":`, err);
                }
            });
        },

        /* ─────────────────────────────────────────────────
           getHistory(filter?)
           Retorna o histórico de eventos emitidos.
           Útil para debug e diagnóstico de sequência de boot.

           Exemplo:
             SentinelBus.getHistory('state:change');
        ───────────────────────────────────────────────── */
        getHistory(filterEvent = null) {
            if (filterEvent) return _history.filter(e => e.event === filterEvent);
            return [..._history];
        },

        /* ─────────────────────────────────────────────────
           getChannels()
           Lista todos os canais com handlers registrados.
        ───────────────────────────────────────────────── */
        getChannels() {
            return Object.entries(_handlers).map(([event, fns]) => ({
                event,
                handlers: fns.length
            }));
        }
    };

})();

/* ═══════════════════════════════════════════════════════════════════════════
   CATÁLOGO DE EVENTOS — CONTRATO DE INTERFACE CMA
   Todos os eventos do sistema documentados aqui.
   Nenhum módulo inventa canais fora deste catálogo.
═══════════════════════════════════════════════════════════════════════════ */

/**
 * DOMÍNIO: CORE / BOOT
 *
 * boot:start           {}
 *   → Disparo do botão master-boot-trigger.
 *
 * boot:complete        {}
 *   → Boot finalizado, overlay purgado, SENTINEL_BOOTED = true.
 *
 * boot:status          { message: string }
 *   → Atualiza a mensagem de status no onboarding overlay.
 */

/**
 * DOMÍNIO: STATE
 *
 * state:change         { key: string, val: any, prev: any }
 *   → Qualquer campo do SYSTEM_STATE foi alterado via StateStore.set().
 *
 * state:restored       { profile: string, snapshot: object }
 *   → Kernel.load() restaurou um snapshot do localStorage.
 */

/**
 * DOMÍNIO: XR / ENGINE-3D
 *
 * xr:material          { target: string, emissive?: string, intensity?: number, opacity?: number }
 *   → Solicita alteração de material em um ghost-window.
 *     target = ID do elemento a-entity (ex: 'mon-0').
 *
 * xr:deepflow          { active: boolean }
 *   → Ativa/desativa o modo Deep Flow visual (emissão verde em todos os monitores).
 *
 * xr:focus-isolate     {}
 *   → Suprime monitores periféricos (todos exceto mon-0).
 *
 * xr:focus-restore     {}
 *   → Restaura opacidade de todos os monitores.
 *
 * xr:proximity-tick    { windows: Array }
 *   → Resultado do loop de proximidade (32ms) para consumidores externos.
 */

/**
 * DOMÍNIO: COGNITION / JARVIS
 *
 * jarvis:transcript    { text: string }
 *   → VoiceListener capturou um transcript de voz.
 *
 * jarvis:intent        { intent: string, value?: string }
 *   → IntentProcessor identificou uma intenção.
 *     intents: 'override' | 'mission' | 'deepflow' | 'focus' | 'navigate' | 'system_state'
 *
 * jarvis:reply         { text: string, source: string }
 *   → JARVIS_AI gerou uma resposta (RAG ou fallback).
 *     source: 'rag' | 'identity' | 'fallback'
 *
 * jarvis:speak         { text: string }
 *   → Solicita síntese de voz (TTS). VoiceCore ouve e executa.
 *
 * jarvis:feedback      { type: 'confirm' | 'warning' | 'mission' | 'hover' }
 *   → Solicita feedback de áudio.
 */

/**
 * DOMÍNIO: MISSION
 *
 * mission:lock         { mission: string }
 *   → Nova missão definida. Persiste no localStorage.
 *
 * mission:restored     { mission: string }
 *   → Missão restaurada do localStorage no boot.
 */

/**
 * DOMÍNIO: UI / HUD
 *
 * ui:nexus-update      { text: string }
 *   → Atualiza o display principal (nexus-display / mon-0).
 *
 * ui:clock-tick        { time: string, elapsed: number }
 *   → Clock ATC — atualiza clock-display (mon-2r).
 *
 * ui:mode              { mode: 'shadow' | 'sleep' | 'focus' | 'override' | 'deepflow', active: boolean }
 *   → Alterna um modo visual no body (class toggle).
 *
 * ui:hud-latency       { value: string }
 *   → Atualiza o display de latência no HUD 2D.
 *
 * ui:hud-battery       { value: string }
 *   → Atualiza o display de bateria no HUD 2D.
 */

/**
 * DOMÍNIO: TELEMETRY
 *
 * telemetry:input      {}
 *   → Qualquer input do usuário (teclado, voz) — reseta idle timer.
 *
 * telemetry:idle       { elapsed: number }
 *   → Sistema entrou em idle (> idleCollapseLimit ms sem input).
 *
 * telemetry:deepflow   { elapsed: number }
 *   → Sistema atingiu estado Deep Flow (> deepFlowThreshold ms).
 */

/* ═══════════════════════════════════════════════════════════════════════════
   EXPOSIÇÃO GLOBAL
   Disponível para todos os módulos como window.SentinelBus
═══════════════════════════════════════════════════════════════════════════ */

window.SentinelBus = SentinelBus;

console.log(
    '%c OMC SENTINEL BUS v1.0 ONLINE ',
    'background:#000;color:#00D4FF;font-weight:bold;'
);

/* ═══════════════════════════════════════════════════════════════════════════
   SENTINEL BUS v1.0
   ROOT AUTHORITY — CANAL ÚNICO DE SOBERANIA
═══════════════════════════════════════════════════════════════════════════ */
