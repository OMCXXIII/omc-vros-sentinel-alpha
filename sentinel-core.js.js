/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL CORE — UNIFIED AUTHORITY v6.0
   Fusão Crítica: STATE-STORE + KERNEL + SOBERANIA OPERATIVA
   Arquitetura: Cognitive Modular Architecture (CMA)
   Domínio: CORE / ABSOLUTE
═══════════════════════════════════════════════════════════════════════════ */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SECTION 01: STATE STORE (Fonte Única de Verdade)
 * Regra: Leitura via StateStore.get(), Escrita via StateStore.set()
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const StateStore = (() => {
    const _state = {
        ui: {
            isSleep:     false,
            isShadow:    false,
            isLocked:    false,
            isFocusMode: false,
            isEmergency: false,
            isListening: false
        },
        ops: {
            profile:       'ALPHA',
            buffer:        '',
            deepFlow:      false,
            override:      false,
            mission:       'IDLE',
            latency:       '0ms'
        },
        telemetry: {
            startTime:     Date.now(),
            lastInput:     Date.now(),
            cycles:        0,
            neuroSync:     100
        }
    };

    return {
        get: (path) => {
            return path.split('.').reduce((obj, key) => obj && obj[key], _state);
        },
        set: (path, value) => {
            const parts = path.split('.');
            const last  = parts.pop();
            const target = parts.reduce((obj, key) => obj[key], _state);
            
            if (target && target[last] !== value) {
                target[last] = value;
                if (window.SentinelBus) {
                    window.SentinelBus.emit('state:change', { path, value });
                }
                return true;
            }
            return false;
        },
        raw: () => JSON.parse(JSON.stringify(_state))
    };
})();

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SECTION 02: KERNEL CONFIGURATIONS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const JARVIS_CONFIG = {
    idleCollapseLimit: 30000, 
    deepFlowThreshold: 300000, 
    neuralSampleRate: 1000,
    voiceEnabled: true
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SECTION 03: CORE PROTOCOLS (Lifecycle)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SentinelKernel = {
    init: function() {
        console.log('%c[KERNEL] Iniciando protocolos de soberania...', 'color:#00D4FF;font-weight:bold;');
        this.bindEvents();
        this.startTelemetry();
    },

    bindEvents: function() {
        if (!window.SentinelBus) return;

        // Listener de Input Global
        window.addEventListener('keydown', (e) => {
            StateStore.set('telemetry.lastInput', Date.now());
            if (window.SentinelBus) window.SentinelBus.emit('telemetry:input', { key: e.key });

            if (e.key.toLowerCase() === 'j') {
                this.activateVoiceInterface();
            }
        });

        // Handlers de Estado via Bus
        window.SentinelBus.on('mission:lock', ({ mission }) => {
            StateStore.set('ops.mission', mission);
            localStorage.setItem('OMC_MISSION_LOCK', mission);
        });

        window.SentinelBus.once('boot:complete', () => {
            window.SENTINEL_BOOTED = true;
            console.log('%c[SYSTEM] Soberania confirmada. Boot concluído.', 'color:#00FF41;');
        });
    },

    activateVoiceInterface: function() {
        if (typeof VoiceListener !== 'undefined') {
            VoiceListener.start();
            StateStore.set('ui.isListening', true);
            const nexus = document.getElementById('nexus-display');
            if (nexus) nexus.setAttribute('value', 'STATUS: ESCUTA_ATIVA\nAGUARDANDO_INSTRUÇÃO...');
        } else {
            console.warn('[KERNEL] VoiceListener não detectado no barramento.');
        }
    },

    startTelemetry: function() {
        // Ciclo de Telemetria e Deep Flow
        setInterval(() => {
            const now = Date.now();
            const elapsed = now - StateStore.get('telemetry.startTime');
            const idleTime = now - StateStore.get('telemetry.lastInput');

            // Atualiza Ciclos
            const currentCycles = StateStore.get('telemetry.cycles');
            StateStore.set('telemetry.cycles', currentCycles + 1);

            // Detecção de Deep Flow
            const inDeepFlow = elapsed > JARVIS_CONFIG.deepFlowThreshold;
            if (inDeepFlow !== StateStore.get('ops.deepFlow')) {
                StateStore.set('ops.deepFlow', inDeepFlow);
                if (window.SentinelBus) window.SentinelBus.emit('xr:deepflow', { active: inDeepFlow });
            }

            // Sistema Idle (Override de Proteção)
            if (idleTime > JARVIS_CONFIG.idleCollapseLimit) {
                if (!document.body.classList.contains('system-idle-60')) {
                    document.body.classList.add('system-idle-60');
                    StateStore.set('ops.override', true);
                    if (window.SentinelBus) window.SentinelBus.emit('telemetry:idle', { elapsed: idleTime });
                }
            } else {
                if (document.body.classList.contains('system-idle-60')) {
                    document.body.classList.remove('system-idle-60');
                    StateStore.set('ops.override', false);
                }
            }
        }, JARVIS_CONFIG.neuralSampleRate);
    }
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SECTION 04: EXECUTION GATEWAY
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener('load', () => {
    // Injeção de Segurança
    window.SYSTEM_STATE = StateStore; 
    
    SentinelKernel.init();

    // Sincronização com o Monitor de Clock ATC
    setInterval(() => {
        const clockEl = document.getElementById('clock-display');
        if (!clockEl || !window.SENTINEL_BOOTED) return;
        
        const now = new Date();
        const ts = now.toTimeString().slice(0, 8);
        const elapsed = Math.floor((Date.now() - StateStore.get('telemetry.startTime')) / 1000);
        
        if (window.SentinelBus) {
            window.SentinelBus.emit('ui:clock-tick', { time: ts, elapsed: elapsed });
        }
        clockEl.setAttribute('value', `CLOCK_ATC\n${ts}\nSessão: ${elapsed}s`);
    }, 1000);
});

console.log('%c OMC UNIFIED CORE v6.0 ONLINE ', 'background:#000;color:#00D4FF;font-weight:bold;');