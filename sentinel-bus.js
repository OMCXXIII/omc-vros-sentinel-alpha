/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL BUS CORE v2.0 - COGNITIVE RUNTIME INFRASTRUCTURE
   Eixo de Sincronização Neuroadaptativa & XR-Safe Dispatcher
   ---------------------------------------------------------------------------
   AUTORIDADE: Arquitetura Cognitiva Modular (CMA)
   ESTABILIDADE: Ultra (Watchdog & Queue Enabled)
   COMPATIBILIDADE: 100% Legado (v1.x)
═══════════════════════════════════════════════════════════════════════════ */

const SentinelBus = (() => {

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       REGISTRY & INTERNAL STATE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    const _handlers = Object.create(null);
    const _history = [];
    const _sticky = Object.create(null);
    const _queue = [];
    const _activeEvents = new Set(); // Loop Protection
    
    // Telemetria Interna
    const _metrics = {
        emitsPerSec: 0,
        activeHandlers: 0,
        avgLatency: 0,
        droppedEvents: 0,
        stormDetected: false,
        lastFrameTime: performance.now()
    };

    // Configurações de Engenharia
    const CONFIG = {
        MAX_HISTORY: 200,
        STORM_THRESHOLD: 50, // Emits por frame
        LATENCY_CRITICAL: 16.6, // ms (alvo 60fps)
        RECURSION_LIMIT: 5
    };

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       INTERNAL UTILITIES
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    
    const _log = (type, event, payload, priority = 'NORMAL') => {
        if (!SentinelBus.debug) return;
        const colors = {
            emit: '#00D4FF',
            sync: '#00FF41',
            warn: '#FFD700',
            error: '#FF003C',
            xr: '#7F00FF'
        };
        console.log(
            `%c[BUS:${type.toUpperCase()}]%c[${priority}] %c${event}`,
            `color:${colors[type] || '#FFF'};font-weight:bold;`,
            `color:#888;font-size:9px;`,
            `color:#DDD;`,
            payload
        );
    };

    /**
     * Watchdog: Monitora performance de handlers individuais
     */
    const _watchdog = (event, handler, payload) => {
        const start = performance.now();
        try {
            handler(payload);
        } catch (e) {
            SentinelBus.emit('system:fault', { event, error: e.message, stack: e.stack });
            console.error(`[BUS:FATAL] Erro no módulo em ${event}:`, e);
        }
        const duration = performance.now() - start;
        if (duration > CONFIG.LATENCY_CRITICAL) {
            console.warn(`[BUS:STALL] Handler lento detectado em: ${event} (${duration.toFixed(2)}ms)`);
        }
    };

    /**
     * Dispatcher: Processa a fila de eventos respeitando frames XR
     */
    const _dispatch = () => {
        if (_queue.length === 0) return;

        // Priorização: Move CRITICAL e HIGH para o topo da fila
        _queue.sort((a, b) => (b.priority === 'CRITICAL' ? 1 : 0) - (a.priority === 'CRITICAL' ? 1 : 0));

        const frameStart = performance.now();
        
        while (_queue.length > 0) {
            // Se o processamento exceder o tempo de frame (para evitar freeze no XR)
            if (performance.now() - frameStart > 8) { // 8ms max per frame task
                requestAnimationFrame(_dispatch);
                break;
            }

            const { event, payload, priority } = _queue.shift();
            
            // Loop Protection: Prevenção de recursão infinita
            if (_activeEvents.has(event)) {
                _metrics.droppedEvents++;
                continue;
            }

            _activeEvents.add(event);

            // Wildcard Support (ui:*, state:*, xr:*)
            const targetHandlers = [];
            if (_handlers[event]) targetHandlers.push(..._handlers[event]);
            
            // Processamento de Wildcards
            Object.keys(_handlers).forEach(key => {
                if (key.endsWith(':*') && event.startsWith(key.split(':')[0])) {
                    targetHandlers.push(..._handlers[key]);
                }
            });

            targetHandlers.forEach(handler => _watchdog(event, handler, payload));
            
            _activeEvents.delete(event);
        }
    };

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       PUBLIC API CORE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    return {
        debug: true,

        /**
         * EMIT: Agora com suporte a prioridade e Queue System
         */
        emit(event, payload = {}, priority = 'NORMAL') {
            _log('emit', event, payload, priority);

            // Persistência Seletiva (Sticky State) - Compatibilidade Legada
            if (event.includes('boot:') || event.includes('state:') || event === 'mission:lock') {
                _sticky[event] = payload;
            }

            // Adiciona à fila de processamento assíncrono (Async Safe Mode)
            _queue.push({ event, payload, priority });
            
            // Histórico para Replay
            _history.push({ event, payload, priority, ts: Date.now() });
            if (_history.length > CONFIG.MAX_HISTORY) _history.shift();

            // Gatilho do Dispatcher (Frame-Safe)
            if (priority === 'CRITICAL') {
                _dispatch(); // Dispatch imediato para eventos críticos
            } else {
                queueMicrotask(_dispatch);
            }
        },

        /**
         * ON: Registro de ouvintes com Auto-Sync de Sticky State
         */
        on(event, handler) {
            if (!_handlers[event]) {
                _handlers[event] = [];
                _metrics.activeHandlers++;
            }
            _handlers[event].push(handler);

            // Handshake Tardio: Se o evento já aconteceu, sincroniza imediatamente
            if (_sticky[event]) {
                _log('sync', event, _sticky[event]);
                _watchdog(event, handler, _sticky[event]);
            }
        },

        /**
         * ONCE: Execução única persistente
         */
        once(event, handler) {
            const wrapper = (payload) => {
                this.off(event, wrapper);
                handler(payload);
            };
            this.on(event, wrapper);
        },

        /**
         * OFF: Unsubscribe seguro para prevenir Memory Leaks
         */
        off(event, handler) {
            if (!_handlers[event]) return;
            _handlers[event] = _handlers[event].filter(h => h !== handler);
            if (_handlers[event].length === 0) {
                delete _handlers[event];
                _metrics.activeHandlers--;
            }
        },

        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           DOMAIN ISOLATION & EXTENSIONS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

        // Helper para emite em domínios específicos
        xr(event, payload) { this.emit(`xr:${event}`, payload, 'HIGH'); },
        ui(event, payload) { this.emit(`ui:${event}`, payload, 'NORMAL'); },
        state(path, value) { this.emit(`state:changed`, { path, value }, 'HIGH'); },

        // Replay System: Reconstitui eventos passados
        replay(filter = null) {
            const targets = filter ? _history.filter(h => h.event.includes(filter)) : _history;
            targets.forEach(h => this.emit(h.event, h.payload, 'LOW'));
        },

        // Diagnóstico e Telemetria
        getMetrics() {
            return {
                ..._metrics,
                queueSize: _queue.length,
                stickyKeys: Object.keys(_sticky),
                uptime: performance.now()
            };
        },

        hasHappened(event) { return !!_sticky[event]; },
        getSticky(event) { return _sticky[event] || null; },
        getHistory() { return [..._history]; }
    };
})();

// Exposição Global Protegida
if (!window.SentinelBus) {
    window.SentinelBus = SentinelBus;
}

console.log(
    '%c OMC SENTINEL BUS v2.0 | COGNITIVE RUNTIME READY ',
    'background:#000;color:#00D4FF;border:1px solid #00D4FF;padding:5px;font-family:monospace;font-weight:bold;'
);
