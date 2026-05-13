/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL CORE — UNIFIED AUTHORITY v6.5 (REFACTORED)
   Soberania Operativa: ISOLAMENTO DE KERNEL + REDUNDÂNCIA STATEVAULT
   Arquitetura: Cognitive Modular Architecture (CMA)
   Domínio: CORE / ABSOLUTE
═══════════════════════════════════════════════════════════════════════════ */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SECTION 01: STATEVAULT (Redundância em Camadas)
 * L1: Memória (Velocidade) | L2: LocalStorage (Persistência)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const StateVault = (() => {
    const MIRROR_KEY = 'SENTINEL_STATE_MIRROR';
    
    // Estado Inicial / Fallback
    let _state = {
        ui: { isSleep: false, isShadow: false, isLocked: false, isFocusMode: false, isEmergency: false, isListening: false },
        ops: { profile: 'ALPHA', buffer: '', deepFlow: false, override: false, mission: 'IDLE', latency: '0ms' },
        telemetry: { startTime: Date.now(), lastInput: Date.now(), cycles: 0, neuroSync: 100 }
    };

    // Protocolo de Recuperação L2 -> L1
    const _hydrate = () => {
        try {
            const backup = localStorage.getItem(MIRROR_KEY);
            if (backup) {
                const parsed = JSON.parse(backup);
                _state = { ..._state, ...parsed };
                console.log('%c[VAULT] L2 Mirror Restored.', 'color: #00FF41;');
            }
        } catch (e) {
            console.warn('[VAULT] Erro na hidratação de dados. Usando estado virgem.');
        }
    };

    _hydrate();

    return {
        get: (path) => path.split('.').reduce((obj, key) => obj && obj[key], _state),
        set: (path, value) => {
            const keys = path.split('.');
            const lastKey = keys.pop();
            const target = keys.reduce((obj, key) => obj[key], _state);
            
            if (target && lastKey in target) {
                target[lastKey] = value;
                
                // Redundância Seletiva (Apenas dados críticos para L2)
                if (path.includes('ops') || path.includes('mission')) {
                    localStorage.setItem(MIRROR_KEY, JSON.stringify(_state));
                }

                // Desacoplamento via Bus
                window.SentinelBus?.emit('state:updated', { path, value });
            }
        }
    };
})();

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SECTION 02: SENTINEL KERNEL (The Watchdog)
 * Isolado de dados, focado apenas em Ciclo de Vida e Saúde do Sistema.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SentinelKernel = {
    init: function() {
        console.log('%c[KERNEL] Inicializando Watchdog de Soberania...', 'color: #00D4FF;');
        this._setupListeners();
        this._startHeartbeat();
    },

    _setupListeners: function() {
        // O Kernel apenas ouve ordens de alto nível
        window.SentinelBus?.on('system:reboot', () => window.location.reload());
        
        window.SentinelBus?.on('telemetry:input', () => {
            StateVault.set('telemetry.lastInput', Date.now());
        });
    },

    _startHeartbeat: function() {
        // Monitor de Latência e Ciclos (Estética da Eficiência)
        setInterval(() => {
            const cycles = StateVault.get('telemetry.cycles') || 0;
            StateVault.set('telemetry.cycles', cycles + 1);
            
            // Check de Integridade
            if (!window.SENTINEL_BOOTED) {
                console.debug('[KERNEL] Aguardando sinal de BOOT_COMPLETE...');
            }
        }, 5000);
    }
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SECTION 03: EXECUTION GATEWAY
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
window.addEventListener('load', () => {
    // Injeção de Dependência
    window.SYSTEM_STATE = StateVault;
    
    // Boot do Kernel Isolado
    SentinelKernel.init();

    // Loop de Telemetria (Renderização Desacoplada)
    const updateUI = () => {
        if (window.SENTINEL_BOOTED) {
            const now = new Date();
            const ts = now.toTimeString().slice(0, 8);
            const elapsed = Math.floor((Date.now() - StateVault.get('telemetry.startTime')) / 1000);
            
            window.SentinelBus?.emit('ui:clock-tick', { time: ts, elapsed });
        }
        requestAnimationFrame(updateUI);
    };
    updateUI();
});
