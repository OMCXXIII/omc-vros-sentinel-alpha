/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL ENGINE-XR v6.0
   Renderização Neuroadaptativa + Cyber-Glass Engine
   Fragmento 2/4 — SOBERANIA OPERATIVA
═══════════════════════════════════════════════════════════════════════════ */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * GHOST WINDOW COMPONENT
 * Cyber-Glass + Spatial Focus System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

AFRAME.registerComponent('ghost-window', {

    schema: {
        title: {
            type: 'string',
            default: 'WINDOW'
        }
    },

    init: function () {

        const el = this.el;

        /* MATERIAL CYBER-GLASS */

        el.setAttribute('material', {
            color: '#021018',
            metalness: 0.9,
            roughness: 0.1,
            opacity: 0.22,
            transparent: true,
            emissive: '#00D4FF',
            emissiveIntensity: 0.08
        });

        /* ENTRADA CINEMATOGRÁFICA */

        el.object3D.scale.set(0.001, 0.001, 0.001);

        const originalPos = {
            x: el.object3D.position.x,
            y: el.object3D.position.y,
            z: el.object3D.position.z
        };

        el.object3D.position.z += 4;

        setTimeout(() => {

            el.setAttribute(
                'animation__boot_scale',
                `
                property: scale;
                to: 1 1 1;
                dur: 1400;
                easing: easeOutExpo;
                `
            );

            el.setAttribute(
                'animation__boot_position',
                `
                property: position;
                to: ${originalPos.x} ${originalPos.y} ${originalPos.z};
                dur: 1600;
                easing: easeOutExpo;
                `
            );

            el.setAttribute(
                'animation__boot_opacity',
                `
                property: material.opacity;
                to: 0.22;
                dur: 1800;
                easing: easeOutExpo;
                `
            );

        }, Math.random() * 700);

        /* HOVER NEUROFEEDBACK */

        el.addEventListener('mouseenter', () => {

            el.setAttribute(
                'animation__scale',
                `
                property: scale;
                to: 1.05 1.05 1.05;
                dur: 180;
                easing: easeOutExpo;
                `
            );

            el.setAttribute(
                'material',
                'emissiveIntensity',
                '0.25'
            );

            el.setAttribute(
                'material',
                'opacity',
                '0.92'
            );

            if (typeof VoiceCore !== 'undefined') {

                VoiceCore.playFeedback('hover');
            }

            document.body.classList.add('focus-engaged');
        });

        el.addEventListener('mouseleave', () => {

            el.setAttribute(
                'animation__scale',
                `
                property: scale;
                to: 1 1 1;
                dur: 220;
                easing: easeOutExpo;
                `
            );

            el.setAttribute(
                'material',
                'emissiveIntensity',
                '0.08'
            );

            el.setAttribute(
                'material',
                'opacity',
                '0.22'
            );

            document.body.classList.remove('focus-engaged');
        });
    }
});

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * BOOT SYSTEM
 * Ritual de Prontidão Neural
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function bootSystem() {

    const overlay =
        document.getElementById('onboarding-overlay');

    if (overlay) {

        overlay.classList.add('fade-out');

        setTimeout(() => {

            overlay.style.display = 'none';

        }, 1500);
    }

    document.body.classList.add('boot-sequence');

    /* ESCANEAMENTO INICIAL */

    const scene =
        document.querySelector('a-scene');

    if (scene) {

        scene.setAttribute(
            'fog',
            `
            type: exponential;
            color: #000000;
            density: 0.02;
            `
        );
    }

    /* INICIALIZAÇÃO JARVIS */

    if (typeof VoiceCore !== 'undefined') {

        VoiceCore.speak(
            "Sistema Sentinel ativo. Soberania operativa confirmada."
        );
    }

    /* CARREGAMENTO CINEMÁTICO */

    initializeSpatialBoot();

    /* CLOCK OPERACIONAL */

    SYSTEM_STATE.telemetry.lastInput =
        Date.now();

    console.log(
        '[ENGINE-XR] Boot Sequence Inicializada.'
    );
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SPATIAL BOOT SEQUENCE
 * Materialização progressiva dos módulos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function initializeSpatialBoot() {

    const windows =
        document.querySelectorAll('.ghost-window');

    windows.forEach((win, index) => {

        setTimeout(() => {

            win.setAttribute(
                'animation__spawn',
                `
                property: material.opacity;
                from: 0;
                to: 0.22;
                dur: 1200;
                easing: easeOutExpo;
                `
            );

            win.setAttribute(
                'animation__float',
                `
                property: position;
                dir: alternate;
                dur: 4000;
                loop: true;
                easing: easeInOutSine;
                to:
                ${win.object3D.position.x}
                ${win.object3D.position.y + 0.03}
                ${win.object3D.position.z}
                `
            );

        }, index * 180);
    });
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * QUANTUM PROXIMITY ENGINE
 * Spatial Attention Rendering
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function updateQuantumProximity() {

    const cam =
        document.getElementById('main-camera');

    const windows =
        document.querySelectorAll('.ghost-window');

    if (!cam) return;

    const camPos =
        cam.object3D.position;

    windows.forEach(win => {

        const winPos =
            win.object3D.position;

        const dist =
            camPos.distanceTo(winPos);

        /* OPACIDADE DINÂMICA */

        const opacity =
            Math.max(0.08, 1 - (dist / 10));

        /* EMISSÃO DINÂMICA */

        const emissive =
            Math.max(0.05, 0.6 - (dist / 12));

        /* ESCALA PERCEPTIVA */

        const scaleBoost =
            Math.max(1, 1.12 - (dist / 20));

        win.setAttribute(
            'material',
            'opacity',
            opacity
        );

        win.setAttribute(
            'material',
            'emissiveIntensity',
            emissive
        );

        win.object3D.scale.set(
            scaleBoost,
            scaleBoost,
            scaleBoost
        );

        /* MODO SHADOW */

        if (
            SYSTEM_STATE?.ui?.isShadow &&
            !win.classList.contains('focus-node')
        ) {

            win.setAttribute(
                'material',
                'opacity',
                '0.03'
            );

            win.setAttribute(
                'material',
                'emissiveIntensity',
                '0.01'
            );
        }

        /* DEEP FLOW */

        if (
            SYSTEM_STATE?.ops?.deepFlow
        ) {

            win.setAttribute(
                'material',
                'emissive',
                '#00FF41'
            );
        }
    });
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * BUFFER SYNTHESIS
 * Nexus Display Sync
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function _flushBuffer() {

    const displays =
        document.querySelectorAll(
            '.ghost-window a-text'
        );

    displays.forEach(d => {

        if (d.id === 'main-display') {

            d.setAttribute(
                'value',
                SYSTEM_STATE.ops.buffer ||
                "AGUARDANDO INPUT..."
            );
        }
    });
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FOCUS ISOLATION ENGINE
 * Supressão Periférica Dinâmica
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function isolatePeripheralWindows() {

    const windows =
        document.querySelectorAll('.ghost-window');

    windows.forEach((win, index) => {

        if (index > 0) {

            win.setAttribute(
                'material',
                'opacity',
                '0.05'
            );

            win.setAttribute(
                'material',
                'emissiveIntensity',
                '0.01'
            );
        }
    });
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * DEEP FLOW VISUAL STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function activateDeepFlowVisuals() {

    document.body.classList.add(
        'deepflow-visual'
    );

    const scene =
        document.querySelector('a-scene');

    if (scene) {

        scene.setAttribute(
            'background',
            'color',
            '#000000'
        );
    }

    const windows =
        document.querySelectorAll('.ghost-window');

    windows.forEach(win => {

        win.setAttribute(
            'material',
            'emissive',
            '#00FF41'
        );

        win.setAttribute(
            'material',
            'emissiveIntensity',
            '0.18'
        );
    });
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * XR TELEMETRY LOOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

setInterval(() => {

    updateQuantumProximity();

}, window.IS_MOBILE ? 120 : 32);

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * XR ROOT AUTHORITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener('load', () => {

    console.log(
        '%c OMC ENGINE-XR v6.0 ONLINE ',
        'background:#000;color:#00D4FF;font-weight:bold;'
    );

    initializeSpatialBoot();
});

/* ═══════════════════════════════════════════════════════════════════════════
   SENTINEL ENGINE-XR v6.0
   ROOT AUTHORITY ENABLED
═══════════════════════════════════════════════════════════════════════════ */
