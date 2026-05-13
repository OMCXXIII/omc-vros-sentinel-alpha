/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL ENGINE-XR v6.1
   Renderização Neuroadaptativa + Cyber-Glass Engine
   Fragmento 2/4 — SOBERANIA OPERATIVA

   REFATORAÇÃO CMA v1.0:
   - Domínio: ENGINES / XR Render
   - Engine-XR é a ÚNICA autoridade sobre materiais, escala e posição 3D
   - Recebe comandos via SentinelBus (xr:material, xr:deepflow,
     xr:focus-isolate, xr:focus-restore, ui:nexus-update, ui:clock-tick)
   - Não chama funções de outros módulos diretamente
   - SYSTEM_STATE lido exclusivamente via StateStore.get() durante o
     loop de proximidade — nunca via referência global direta
   - ghost-window component mantém glassmorphism intacto:
     hover, escala e opacidade base não são tocados pela refatoração
═══════════════════════════════════════════════════════════════════════════ */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GUARD — garante que o Bus está disponível
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

if (!window.SentinelBus) {
    console.error('[ENGINE-XR] SentinelBus não encontrado. Carregue sentinel-bus.js primeiro.');
}

/* ═══════════════════════════════════════════════════════════════════════════
   GHOST WINDOW COMPONENT
   Cyber-Glass + Spatial Focus System
   Responsabilidade: lógica local de cada janela 3D.
   Glassmorphism, animação de entrada e hover são autocontidos aqui.
   NÃO acessa Bus, StateStore ou outros módulos — componente puro A-Frame.
═══════════════════════════════════════════════════════════════════════════ */

AFRAME.registerComponent('ghost-window', {

    schema: {
        title: { type: 'string', default: 'WINDOW' }
    },

    init: function () {
        const el = this.el;

        /* ── MATERIAL CYBER-GLASS ─────────────────────────────────────── */
        el.setAttribute('material', {
            color:             '#021018',
            metalness:         0.9,
            roughness:         0.1,
            opacity:           0.22,
            transparent:       true,
            emissive:          '#00D4FF',
            emissiveIntensity: 0.08
        });

        /* ── ENTRADA CINEMATOGRÁFICA ──────────────────────────────────── */
        el.object3D.scale.set(0.001, 0.001, 0.001);

        const originalPos = {
            x: el.object3D.position.x,
            y: el.object3D.position.y,
            z: el.object3D.position.z
        };

        el.object3D.position.z += 4;

        setTimeout(() => {
            el.setAttribute('animation__boot_scale', `
                property: scale;
                to: 1 1 1;
                dur: 1400;
                easing: easeOutExpo;
            `);
            el.setAttribute('animation__boot_position', `
                property: position;
                to: ${originalPos.x} ${originalPos.y} ${originalPos.z};
                dur: 1600;
                easing: easeOutExpo;
            `);
            el.setAttribute('animation__boot_opacity', `
                property: material.opacity;
                to: 0.22;
                dur: 1800;
                easing: easeOutExpo;
            `);
        }, Math.random() * 700);

        /* ── HOVER NEUROFEEDBACK ──────────────────────────────────────── */
        el.addEventListener('mouseenter', () => {
            el.setAttribute('animation__scale', `
                property: scale;
                to: 1.05 1.05 1.05;
                dur: 180;
                easing: easeOutExpo;
            `);
            el.setAttribute('material', 'emissiveIntensity', '0.25');
            el.setAttribute('material', 'opacity', '0.92');

            /* Solicita feedback de áudio via Bus — não chama VoiceCore diretamente */
            if (window.SentinelBus) {
                SentinelBus.emit('jarvis:feedback', { type: 'hover' });
            }

            document.body.classList.add('focus-engaged');
        });

        el.addEventListener('mouseleave', () => {
            el.setAttribute('animation__scale', `
                property: scale;
                to: 1 1 1;
                dur: 220;
                easing: easeOutExpo;
            `);
            el.setAttribute('material', 'emissiveIntensity', '0.08');
            el.setAttribute('material', 'opacity', '0.22');
            document.body.classList.remove('focus-engaged');
        });
    }
});

/* ═══════════════════════════════════════════════════════════════════════════
   BOOT SYSTEM
   Ritual de Prontidão Neural
   Emite boot:complete no Bus após inicializar a cena.
   Outros módulos (jarvis-voice, kernel) reagem via once('boot:complete').
═══════════════════════════════════════════════════════════════════════════ */

function bootSystem() {

    /* ── OVERLAY ─────────────────────────────────────────────────────── */
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
        overlay.classList.add('fade-out');
        setTimeout(() => { overlay.style.display = 'none'; }, 1500);
    }

    document.body.classList.add('boot-sequence');

    /* ── NÉVOA INICIAL ───────────────────────────────────────────────── */
    const scene = document.querySelector('a-scene');
    if (scene) {
        scene.setAttribute('fog', `
            type: exponential;
            color: #000000;
            density: 0.02;
        `);
    }

    /* ── VOZ DE BOOT — via Bus, não chamada direta ───────────────────── */
    SentinelBus.emit('jarvis:speak', {
        text: 'Sistema Sentinel ativo. Soberania operativa confirmada.'
    });

    /* ── MATERIALIZAÇÃO ESPACIAL ─────────────────────────────────────── */
    initializeSpatialBoot();

    /* ── SINALIZA BOOT COMPLETO ──────────────────────────────────────── */
    SentinelBus.emit('boot:complete', {});

    console.log('[ENGINE-XR] Boot Sequence Inicializada.');
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPATIAL BOOT SEQUENCE
   Materialização progressiva dos módulos
═══════════════════════════════════════════════════════════════════════════ */

function initializeSpatialBoot() {
    const windows = document.querySelectorAll('.ghost-window');

    windows.forEach((win, index) => {
        setTimeout(() => {
            win.setAttribute('animation__spawn', `
                property: material.opacity;
                from: 0;
                to: 0.22;
                dur: 1200;
                easing: easeOutExpo;
            `);
            win.setAttribute('animation__float', `
                property: position;
                dir: alternate;
                dur: 4000;
                loop: true;
                easing: easeInOutSine;
                to: ${win.object3D.position.x} ${win.object3D.position.y + 0.03} ${win.object3D.position.z}
            `);
        }, index * 180);
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   QUANTUM PROXIMITY ENGINE
   Spatial Attention Rendering — loop de 32ms
   Lê estado via StateStore.get() — nunca via SYSTEM_STATE direto.
   A única função que toca material 3D de forma contínua.
═══════════════════════════════════════════════════════════════════════════ */

function updateQuantumProximity() {
    const cam = document.getElementById('main-camera');
    if (!cam) return;

    const camPos   = cam.object3D.position;
    const windows  = document.querySelectorAll('.ghost-window');

    /* Lê estados via StateStore quando disponível, fallback para proxy legado */
    const isShadow = window.StateStore
        ? StateStore.get('ui.isShadow')
        : window.SYSTEM_STATE?.ui?.isShadow;

    const isDeepFlow = window.StateStore
        ? StateStore.get('ops.deepFlow')
        : window.SYSTEM_STATE?.ops?.deepFlow;

    windows.forEach(win => {
        const winPos = win.object3D.position;
        const dist   = camPos.distanceTo(winPos);

        /* ── OPACIDADE DINÂMICA ───────────────────────────────────────── */
        const opacity    = Math.max(0.08, 1 - (dist / 10));
        /* ── EMISSÃO DINÂMICA ────────────────────────────────────────── */
        const emissive   = Math.max(0.05, 0.6 - (dist / 12));
        /* ── ESCALA PERCEPTIVA ───────────────────────────────────────── */
        const scaleBoost = Math.max(1, 1.12 - (dist / 20));

        win.setAttribute('material', 'opacity',           opacity);
        win.setAttribute('material', 'emissiveIntensity', emissive);

        /* FIX #B — só manipula escala após boot completar.
           Evita sobrescrever a animação de entrada 0.001→1. */
        if (window.SENTINEL_BOOTED) {
            win.object3D.scale.set(scaleBoost, scaleBoost, scaleBoost);
        }

        /* ── MODO SHADOW ─────────────────────────────────────────────── */
        if (isShadow && !win.classList.contains('focus-node')) {
            win.setAttribute('material', 'opacity',           '0.03');
            win.setAttribute('material', 'emissiveIntensity', '0.01');
        }

        /* ── DEEP FLOW — cor verde em todos os monitores ─────────────── */
        if (isDeepFlow) {
            win.setAttribute('material', 'emissive', '#00FF41');
        }
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUFFER SYNTHESIS
   Nexus Display Sync — ouve ui:nexus-update do Bus
═══════════════════════════════════════════════════════════════════════════ */

function _flushBuffer() {
    const buffer = window.StateStore
        ? StateStore.get('ops.buffer')
        : window.SYSTEM_STATE?.ops?.buffer;

    const nexus = document.getElementById('nexus-display');
    if (nexus) {
        nexus.setAttribute('value', buffer || 'AGUARDANDO INPUT...');
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEEP FLOW VISUAL STATE
   Chamado via xr:deepflow do Bus — não mais direto de jarvis-voice.js
═══════════════════════════════════════════════════════════════════════════ */

function activateDeepFlowVisuals() {
    document.body.classList.add('deepflow-visual');

    const scene = document.querySelector('a-scene');
    if (scene) scene.setAttribute('background', 'color', '#000000');

    document.querySelectorAll('.ghost-window').forEach(win => {
        win.setAttribute('material', 'emissive',          '#00FF41');
        win.setAttribute('material', 'emissiveIntensity', '0.18');
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUS HANDLERS — ENGINE-XR como autoridade única de renderização XR
   Todos os comandos de material e foco chegam aqui via eventos.
   Nenhum outro módulo chama setAttribute('material') diretamente.
═══════════════════════════════════════════════════════════════════════════ */

if (window.SentinelBus) {

    /* ── xr:material ─────────────────────────────────────────────────────
       Altera material de um monitor específico por ID.
       Payload: { target, emissive?, intensity?, opacity?, color? }
    ───────────────────────────────────────────────────────────────────── */
    SentinelBus.on('xr:material', ({ target, emissive, intensity, opacity, color }) => {
        const el = document.getElementById(target);
        if (!el) {
            console.warn(`[ENGINE-XR] xr:material: elemento "${target}" não encontrado.`);
            return;
        }
        if (emissive   !== undefined) el.setAttribute('material', 'emissive',          emissive);
        if (intensity  !== undefined) el.setAttribute('material', 'emissiveIntensity', String(intensity));
        if (opacity    !== undefined) el.setAttribute('material', 'opacity',           String(opacity));
        if (color      !== undefined) el.setAttribute('material', 'color',             color);
    });

    /* ── xr:deepflow ─────────────────────────────────────────────────────
       Ativa/desativa o visual Deep Flow em todos os monitores.
       Payload: { active: boolean }
    ───────────────────────────────────────────────────────────────────── */
    SentinelBus.on('xr:deepflow', ({ active }) => {
        if (active) {
            activateDeepFlowVisuals();
        } else {
            /* Restaura emissão padrão cyan */
            document.querySelectorAll('.ghost-window').forEach(win => {
                win.setAttribute('material', 'emissive',          '#00D4FF');
                win.setAttribute('material', 'emissiveIntensity', '0.08');
            });
            document.body.classList.remove('deepflow-visual');
        }
    });

    /* ── xr:focus-isolate ────────────────────────────────────────────────
       Suprime monitores periféricos (todos exceto mon-0 / index 0).
       Payload: { opacity?: number, blur?: number }
       Consolida: isolatePeripheralWindows() + isolateAttentionField()
    ───────────────────────────────────────────────────────────────────── */
    SentinelBus.on('xr:focus-isolate', ({ opacity = 0.05, blur = 6 }) => {
        document.querySelectorAll('.ghost-window').forEach((win, index) => {
            if (index > 0) {
                /* Material 3D */
                win.setAttribute('material', 'opacity',           String(opacity));
                win.setAttribute('material', 'emissiveIntensity', '0.01');
                /* CSS para efeito de desfoque (2D overlay) */
                win.style.opacity       = String(opacity);
                win.style.filter        = `blur(${blur}px) grayscale(1)`;
                win.style.pointerEvents = 'none';
            }
        });
    });

    /* ── xr:focus-restore ────────────────────────────────────────────────
       Restaura todos os monitores ao estado padrão.
    ───────────────────────────────────────────────────────────────────── */
    SentinelBus.on('xr:focus-restore', () => {
        document.querySelectorAll('.ghost-window').forEach(win => {
            win.setAttribute('material', 'opacity',           '0.22');
            win.setAttribute('material', 'emissiveIntensity', '0.08');
            win.style.opacity       = '';
            win.style.filter        = '';
            win.style.pointerEvents = '';
        });
    });

    /* ── ui:nexus-update ─────────────────────────────────────────────────
       Atualiza o display principal (nexus-display / mon-0).
       Payload: { text: string }
       Handler único — elimina JARVIS_AI.updateNexus() como função isolada.
    ───────────────────────────────────────────────────────────────────── */
    SentinelBus.on('ui:nexus-update', ({ text }) => {
        const nexus = document.getElementById('nexus-display');
        if (nexus) nexus.setAttribute('value', text);
    });

    /* ── ui:mode ─────────────────────────────────────────────────────────
       Alterna classes no document.body.
       Payload: { mode: string, active: boolean }
    ───────────────────────────────────────────────────────────────────── */
    SentinelBus.on('ui:mode', ({ mode, active }) => {
        document.body.classList.toggle(mode, active);
    });

    /* ── ui:clock-tick ───────────────────────────────────────────────────
       Atualiza clock-display no mon-2r.
       Payload: { time: string, elapsed: number }
    ───────────────────────────────────────────────────────────────────── */
    SentinelBus.on('ui:clock-tick', ({ time, elapsed }) => {
        const clockEl = document.getElementById('clock-display');
        if (clockEl && window.SENTINEL_BOOTED) {
            clockEl.setAttribute('value', `CLOCK_ATC\n${time}\nSessão: ${elapsed}s`);
        }
    });

    /* ── boot:complete ───────────────────────────────────────────────────
       Sinaliza que o spatial boot terminou — libera o loop de proximidade.
       SENTINEL_BOOTED é setado no state-store.js ao receber este evento.
    ───────────────────────────────────────────────────────────────────── */
    SentinelBus.once('boot:complete', () => {
        console.log('[ENGINE-XR] boot:complete recebido — Proximity Engine liberada.');
        /* _flushBuffer sincroniza o nexus com o estado restaurado do snapshot */
        _flushBuffer();
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   XR TELEMETRY LOOP
   Mantido como setInterval para compatibilidade com A-Frame.
   kernel.js também roda requestAnimationFrame para o mesmo — ambos
   são aceitos; o rAF do kernel terá prioridade em alta performance.
═══════════════════════════════════════════════════════════════════════════ */

setInterval(() => {
    updateQuantumProximity();
}, window.IS_MOBILE ? 120 : 32);

/* ═══════════════════════════════════════════════════════════════════════════
   XR ROOT AUTHORITY
═══════════════════════════════════════════════════════════════════════════ */

window.addEventListener('load', () => {
    console.log(
        '%c OMC ENGINE-XR v6.1 ONLINE ',
        'background:#000;color:#00D4FF;font-weight:bold;'
    );
    initializeSpatialBoot();
});

/* ═══════════════════════════════════════════════════════════════════════════
   SENTINEL ENGINE-XR v6.1
   DOMÍNIO: ENGINES / XR Render
   AUTORIDADE ÚNICA SOBRE MATERIAIS, ESCALA E POSIÇÃO 3D
   CANAL: SentinelBus — zero acoplamento com COGNITION ou STATE
═══════════════════════════════════════════════════════════════════════════ */
