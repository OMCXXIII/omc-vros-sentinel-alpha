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
        ui: { isSleep: false, isShadow: false, isLocked: false, isFocusMode: false, isEmergency: false, isListening: false },
        ops: { profile: 'ALPHA', buffer: '', deepFlow: false, override: false, mission: 'IDLE', latency: '0ms' },
        telemetry: { startTime: Date.now(), lastInput: Date.now(), cycles: 0, neuroSync: 100 }
    };

    return {
        get: (path) => path.split('.').reduce((obj, key) => obj && obj[key], _state),
        set: (path, value) => {
            const keys = path.split('.');
            const lastKey = keys.pop();
            const target = keys.reduce((obj, key) => obj[key], _state);
            
            if (target[lastKey] !== value) {
                target[lastKey] = value;
                // Propagação Atômica: Todo SET gera um evento automático no BUS
                if (window.SentinelBus) {
                    window.SentinelBus.emit(`state:update:${path}`, { value });
                }
            }
        },
        // Snapshot para reconstrução de sessão pós-falha (Engenharia de Resiliência)
        getRaw: () => JSON.parse(JSON.stringify(_state))
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
    _executionCycle: null,

    init: function() {
        console.info('[KERNEL] Iniciando Protocolos de Soberania...');
        
        // Ativação da Retina Visual
        window.SENTINEL_BOOTED = true;
        document.body.classList.add('sentinel-active');
        
        this.bindGlobalEvents();
        this.startNeuralWatchdog();
        
        if (window.SentinelBus) {
            window.SentinelBus.emit('boot:complete', { 
                timestamp: Date.now(),
                state: StateStore.getRaw()
            });
        }
    },

    // Monitor de Fadiga e Latência do Sistema
    startNeuralWatchdog: function() {
        const _monitor = () => {
            const now = Date.now();
            const idleTime = now - StateStore.get('telemetry.lastInput');
            
            // Lógica de Escalonamento de Energia
            if (idleTime > 60000) { // 60s Idle
                if (!document.body.classList.contains('system-idle-60')) {
                    document.body.classList.add('system-idle-60');
                    StateStore.set('ops.override', true);
                    window.SentinelBus?.emit('ui:mode', { mode: 'sleep', active: true });
                }
            } else {
                document.body.classList.remove('system-idle-60');
                StateStore.set('ops.override', false);
            }
            
            requestAnimationFrame(_monitor);
        };
        _monitor();
    }
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SECTION 04: EXECUTION GATEWAY
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener('load', () => {
    window.SYSTEM_STATE = StateStore;
    SentinelKernel.init();

    const updateUI = () => {
        const clockEl = document.getElementById('clock-display');
        if (clockEl && window.SENTINEL_BOOTED) {
            const now = new Date();
            const ts = now.toTimeString().slice(0, 8);
            const elapsed = Math.floor((Date.now() - StateStore.get('telemetry.startTime')) / 1000);
            
            // Emissão de Telemetria para outros módulos (Engine-XR / Jarvis)
            window.SentinelBus?.emit('ui:clock-tick', { time: ts, elapsed });

            // Polimorfismo de Renderização (2D vs 3D)
            const content = `CLOCK_ATC\n${ts}\nSessão: ${elapsed}s`;
            if (clockEl.tagName.toLowerCase().startsWith('a-')) {
                clockEl.setAttribute('value', content);
            } else {
                clockEl.innerText = content;
            }
        }
        requestAnimationFrame(updateUI);
    };
    updateUI();
});

console.log('%c OMC UNIFIED CORE v6.0 ONLINE ', 'background:#000;color:#00D4FF;font-weight:bold;');
