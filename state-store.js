/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | STATE STORE v1.0
   Isolamento do SYSTEM_STATE — Fonte Única de Verdade
   Domínio: CORE / DATA

   POSIÇÃO NO STACK: carregar APÓS sentinel-bus.js, ANTES de kernel.js
   <script src="sentinel-bus.js"></script>
   <script src="state-store.js"></script>
   <script src="js_sentinel_kernel.js"></script>

   REGRA ABSOLUTA:
   Nenhum módulo lê ou escreve SYSTEM_STATE diretamente.
   Toda leitura passa por StateStore.get()
   Toda escrita passa por StateStore.set() → emite state:change no Bus
═══════════════════════════════════════════════════════════════════════════ */

const StateStore = (() => {

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       ESTADO INICIAL — estrutura idêntica ao SYSTEM_STATE original
       Modificar aqui para adicionar ou remover campos.
       Nunca modificar via referência direta de fora deste módulo.
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    const _state = {

        /* ── UI STATES ─────────────────────────────────── */
        ui: {
            isSleep:     false,
            isShadow:    false,
            isLocked:    false,
            isFocusMode: false,
            isEmergency: false,
            isListening: false
        },

        /* ── OPERATIVE STATES ──────────────────────────── */
        ops: {
            profile:       'ALPHA',
            buffer:        '',
            battery:       100,
            mission:       'ESTABILIZAR_SOBERANIA_OPERATIVA',
            override:      false,
            deepFlow:      false,
            sovereignTier: 2
        },

        /* ── COGNITIVE TELEMETRY ───────────────────────── */
        telemetry: {
            startTime:         Date.now(),
            lastInput:         Date.now(),
            lastFocusShift:    Date.now(),
            latency:           12,
            mielina:           150,
            focus:             98,
            deepFlowStability: 100,
            cognitiveLoad:     8,
            interruptionRisk:  0,
            pulseSync:         true
        },

        /* ── RECOVERY SNAPSHOT ─────────────────────────── */
        recovery: {
            lastMission:   '',
            lastCommand:   '',
            activeNode:    'mon-0',
            viewportState: 'FOCUS',
            hudLayer:      'ROOT',
            restoredAt:    null
        }
    };

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RESOLUÇÃO DE CHAVES ANINHADAS
       Suporta notação de ponto: 'telemetry.lastInput'
       e acesso duplo: ('telemetry', 'lastInput')
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    function _resolve(path) {
        /* Aceita 'section.field' ou 'section' */
        const parts = path.split('.');
        if (parts.length === 1) {
            /* Seção inteira: 'ui', 'ops', 'telemetry', 'recovery' */
            return { obj: _state, key: parts[0] };
        }
        /* Campo aninhado: 'telemetry.lastInput' */
        const section = _state[parts[0]];
        if (!section) return null;
        return { obj: section, key: parts[1] };
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       API PÚBLICA
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    return {

        /* ─────────────────────────────────────────────────
           get(path)
           Leitura segura — nunca retorna a referência interna.
           Objetos são clonados para evitar mutação externa.

           Exemplos:
             StateStore.get('ops.deepFlow')      → false
             StateStore.get('telemetry')         → { startTime: ..., ... }
             StateStore.get('ui.isShadow')       → false
        ───────────────────────────────────────────────── */
        get(path) {
            const resolved = _resolve(path);
            if (!resolved) return undefined;
            const val = resolved.obj[resolved.key];
            /* Clona objetos para evitar mutação por referência */
            return (val !== null && typeof val === 'object')
                ? { ...val }
                : val;
        },

        /* ─────────────────────────────────────────────────
           set(path, val)
           Escrita mediada — salva o valor e emite state:change.

           O Bus carrega o evento para qualquer módulo interessado.
           Nenhuma lógica de UI ou 3D é chamada diretamente aqui.

           Exemplos:
             StateStore.set('ops.deepFlow', true)
             StateStore.set('telemetry.lastInput', Date.now())
             StateStore.set('ui.isShadow', true)
        ───────────────────────────────────────────────── */
        set(path, val) {
            const resolved = _resolve(path);
            if (!resolved) {
                console.error(`[STATE] Caminho inválido: "${path}"`);
                return;
            }

            const prev = resolved.obj[resolved.key];

            /* Evita emissão desnecessária se o valor não mudou */
            if (prev === val) return;

            resolved.obj[resolved.key] = val;

            /* Emite o evento no Bus — outros módulos reagem */
            if (window.SentinelBus) {
                SentinelBus.emit('state:change', { key: path, val, prev });
            }
        },

        /* ─────────────────────────────────────────────────
           patch(section, partialObj)
           Atualiza múltiplos campos de uma seção de uma vez.
           Emite um state:change por campo alterado.

           Exemplo:
             StateStore.patch('telemetry', {
                 focus:        95,
                 cognitiveLoad: 12,
                 latency:      18
             });
        ───────────────────────────────────────────────── */
        patch(section, partialObj) {
            if (!_state[section]) {
                console.error(`[STATE] Seção inválida: "${section}"`);
                return;
            }
            Object.entries(partialObj).forEach(([field, val]) => {
                this.set(`${section}.${field}`, val);
            });
        },

        /* ─────────────────────────────────────────────────
           restore(snapshot)
           Usado pelo Kernel.load() para restaurar um snapshot.
           Emite state:restored após aplicar todos os campos.

           snapshot = objeto retornado pelo Kernel.load()
        ───────────────────────────────────────────────── */
        restore(snapshot) {
            if (!snapshot) return;

            /* Silencia eventos individuais durante restauração */
            const _silent = window.SentinelBus?.debug;
            if (window.SentinelBus) SentinelBus.debug = false;

            try {
                /* Restaura campos sem emitir state:change por campo */
                if (snapshot.telemetry) {
                    Object.assign(_state.telemetry, {
                        mielina:       snapshot.telemetry.mielina       ?? _state.telemetry.mielina,
                        focus:         snapshot.telemetry.focus         ?? _state.telemetry.focus,
                        latency:       snapshot.telemetry.latency       ?? _state.telemetry.latency,
                        cognitiveLoad: snapshot.telemetry.cognitiveLoad ?? _state.telemetry.cognitiveLoad
                    });
                }
                if (snapshot.mission) {
                    Object.assign(_state.ops, {
                        mission:       snapshot.mission.active          ?? _state.ops.mission,
                        override:      snapshot.mission.override        ?? false,
                        sovereignTier: snapshot.mission.sovereignTier   ?? _state.ops.sovereignTier,
                        deepFlow:      snapshot.telemetry?.deepFlow     ?? false
                    });
                }
                if (snapshot.recovery) {
                    Object.assign(_state.recovery, {
                        lastCommand:   snapshot.recovery.lastCommand    ?? '',
                        activeNode:    snapshot.recovery.activeNode     ?? 'mon-0',
                        viewportState: snapshot.recovery.viewportState  ?? 'FOCUS',
                        hudLayer:      snapshot.recovery.hudLayer       ?? 'ROOT',
                        restoredAt:    Date.now()
                    });
                }
            } finally {
                if (window.SentinelBus) SentinelBus.debug = _silent;
            }

            /* Emite evento único de restauração */
            if (window.SentinelBus) {
                SentinelBus.emit('state:restored', {
                    profile:  snapshot.profile || 'ALPHA',
                    snapshot: snapshot
                });
            }

            console.log(
                '%c[STATE] Snapshot restaurado sem aquecimento cognitivo',
                'color:#00D4FF;font-weight:bold;'
            );
        },

        /* ─────────────────────────────────────────────────
           snapshot()
           Retorna uma cópia profunda do estado atual.
           Usado pelo Kernel.save() para persistir no localStorage.
        ───────────────────────────────────────────────── */
        snapshot() {
            return JSON.parse(JSON.stringify(_state));
        },

        /* ─────────────────────────────────────────────────
           debug()
           Imprime o estado atual no console (formatado).
        ───────────────────────────────────────────────── */
        debug() {
            console.groupCollapsed('%c[STATE] SYSTEM_STATE atual', 'color:#00FF41;font-weight:bold;');
            console.table(this.get('ui'));
            console.table(this.get('ops'));
            console.table(this.get('telemetry'));
            console.table(this.get('recovery'));
            console.groupEnd();
        }
    };

})();

/* ═══════════════════════════════════════════════════════════════════════════
   COMPATIBILIDADE RETROATIVA — SYSTEM_STATE PROXY
   Mantém window.SYSTEM_STATE funcional para código legado (kernel.js,
   engine-xr.js, jarvis-voice.js) durante a migração incremental.

   Remover após migrar todos os módulos para StateStore.get/set.

   Como funciona:
   - Leituras em SYSTEM_STATE.ops.deepFlow → redirecionadas para StateStore
   - Escritas em SYSTEM_STATE.telemetry.lastInput = x → emitem state:change
   - Nenhuma mudança de comportamento visível para código legado
═══════════════════════════════════════════════════════════════════════════ */

function _makeProxy(section) {
    return new Proxy({}, {
        get(_, field) {
            return StateStore.get(`${section}.${field}`);
        },
        set(_, field, val) {
            StateStore.set(`${section}.${field}`, val);
            return true;
        }
    });
}

window.SYSTEM_STATE = {
    ui:        _makeProxy('ui'),
    ops:       _makeProxy('ops'),
    telemetry: _makeProxy('telemetry'),
    recovery:  _makeProxy('recovery')
};

/* ═══════════════════════════════════════════════════════════════════════════
   EXPOSIÇÃO GLOBAL
═══════════════════════════════════════════════════════════════════════════ */

window.StateStore = StateStore;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HANDLERS INTERNOS — reações do store a eventos do Bus
   O StateStore também ouve o Bus para ciclo completo.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

if (window.SentinelBus) {

    /* Qualquer input do usuário → atualiza lastInput */
    SentinelBus.on('telemetry:input', () => {
        StateStore.set('telemetry.lastInput', Date.now());
    });

    /* Boot completo → marca SENTINEL_BOOTED */
    SentinelBus.once('boot:complete', () => {
        window.SENTINEL_BOOTED = true;
        console.log(
            '%c[STATE] SENTINEL_BOOTED = true',
            'color:#00FF41;font-weight:bold;'
        );
    });

    /* Mission lock → persiste no ops */
    SentinelBus.on('mission:lock', ({ mission }) => {
        StateStore.set('ops.mission', mission);
    });

    /* Deep flow ativado → atualiza ops */
    SentinelBus.on('xr:deepflow', ({ active }) => {
        StateStore.set('ops.deepFlow', active);
    });

    /* Override → atualiza ops */
    SentinelBus.on('jarvis:intent', ({ intent }) => {
        if (intent === 'override') {
            StateStore.set('ops.override', true);
        }
    });
}

console.log(
    '%c OMC STATE STORE v1.0 ONLINE ',
    'background:#000;color:#00FF41;font-weight:bold;'
);

/* ═══════════════════════════════════════════════════════════════════════════
   STATE STORE v1.0
   FONTE ÚNICA DE VERDADE — SOBERANIA DO ESTADO
═══════════════════════════════════════════════════════════════════════════ */
