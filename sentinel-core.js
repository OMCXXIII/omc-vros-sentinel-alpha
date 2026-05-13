/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL CORE — UNIFIED AUTHORITY v6.6
   Soberania Operativa: ISOLAMENTO DE KERNEL + EXPOSIÇÃO STATESTORE
   Domínio: CORE / ABSOLUTE
═══════════════════════════════════════════════════════════════════════════ */

const StateStore = (() => {
    const MIRROR_KEY = 'SENTINEL_STATE_MIRROR';
    
    let _state = {
        ui: { isSleep: false, isShadow: false, isLocked: false, isFocusMode: false, isEmergency: false, isListening: false },
        ops: { profile: 'ALPHA', buffer: '', deepFlow: false, override: false, mission: 'IDLE', latency: '0.0ms' },
        telemetry: { startTime: Date.now(), lastInput: Date.now(), cycles: 0, neuroSync: 100 }
    };

    const _hydrate = () => {
        try {
            const backup = localStorage.getItem(MIRROR_KEY);
            if (backup) {
                const parsed = JSON.parse(backup);
                _state = { ..._state, ...parsed };
            }
        } catch (e) { console.warn('[CORE] Falha na hidratação de redundância.'); }
    };

    _hydrate();

    return {
        get: (path) => {
            return path.split('.').reduce((obj, key) => obj?.[key], _state);
        },
        set: (path, value) => {
            const keys = path.split('.');
            let last = _state;
            for (let i = 0; i < keys.length - 1; i++) {
                last = last[keys[i]];
            }
            last[keys[keys.length - 1]] = value;
            
            // Persistência Seletiva (L2)
            if(path.startsWith('ops') || path.startsWith('mission')) {
                localStorage.setItem(MIRROR_KEY, JSON.stringify(_state));
            }
            
            window.SentinelBus?.emit('state:changed', { path, value });
        },
        all: () => ({ ..._state })
    };
})();

// Exposição Global conforme esperado pelos módulos (engine-xr, jarvis, etc)
window.StateStore = StateStore;
window.SYSTEM_STATE = StateStore; // Legado/Redundância

const SentinelKernel = (() => {
    const init = () => {
        console.log('%c[KERNEL] Iniciando Soberania Operativa...', 'color: #7F00FF; font-weight: bold;');
        _bindEvents();
        _startHeartbeat();
        
        // Timeout de segurança para garantir o boot se o A-Frame demorar
        setTimeout(() => {
            if (!window.SENTINEL_BOOTED) {
                window.SENTINEL_BOOTED = true;
                window.SentinelBus?.emit('boot:complete');
            }
        }, 2000);
    };

    const _bindEvents = () => {
        if (!window.SentinelBus) return;

        // PONTE DE DADOS: Nexus -> DOM (A-Frame)
        window.SentinelBus.on('ui:nexus-update', (data) => {
            const display = document.getElementById('nexus-display');
            if (display) {
                display.setAttribute('value', data.string || data);
            }
        });

        window.SentinelBus.on('telemetry:input', () => {
            StateStore.set('telemetry.lastInput', Date.now());
        });
    };

    const _startHeartbeat = () => {
        setInterval(() => {
            const cycles = StateStore.get('telemetry.cycles') || 0;
            StateStore.set('telemetry.cycles', cycles + 1);
            
            if (window.SENTINEL_BOOTED) {
                const now = new Date();
                const ts = now.toTimeString().slice(0, 8);
                const elapsed = Math.floor((Date.now() - StateStore.get('telemetry.startTime')) / 1000);
                
                window.SentinelBus?.emit('ui:clock-tick', { time: ts, elapsed: elapsed });
            }
        }, 1000);
    };

    return { init };
})();

window.addEventListener('load', () => {
    SentinelKernel.init();
});
