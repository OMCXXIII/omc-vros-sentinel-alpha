/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL CORE — SOBERANIA OPERATIVA v6.0
   CSS SENTINEL CORE | Zero Latency Neuroadaptive Layer
   Arquitetura Cognitiva Imersiva + ENE (Estado Natural de Execução)
   Fragmento 1/3 — CORE FOUNDATION UPGRADE
═══════════════════════════════════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;500;700;900&display=swap');

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT TOKENS | CAMADAS DE PROCESSAMENTO NEURAL
═══════════════════════════════════════════════════════════════════════════ */

:root {

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       SINAIS PRIMÁRIOS
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    --cyan:                 #00D4FF;
    --cyan-dim:             rgba(0, 212, 255, 0.65);
    --cyan-soft:            rgba(0, 212, 255, 0.12);
    --cyan-border:          rgba(0, 212, 255, 0.25);

    --green-flow:           #00FF41;
    --green-flow-dim:       rgba(0, 255, 65, 0.65);
    --green-flow-soft:      rgba(0, 255, 65, 0.10);
    --green-flow-border:    rgba(0, 255, 65, 0.25);

    --alert:                #FF4B00;
    --alert-dim:            rgba(255, 75, 0, 0.70);
    --warning:              #FFC400;

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       GLOW SYSTEM
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    --cyan-glow:
        0 0 12px rgba(0, 212, 255, 0.50),
        0 0 30px rgba(0, 212, 255, 0.20),
        0 0 60px rgba(0, 212, 255, 0.08);

    --green-flow-glow:
        0 0 10px rgba(0, 255, 65, 0.60),
        0 0 25px rgba(0, 255, 65, 0.25),
        0 0 50px rgba(0, 255, 65, 0.10);

    --alert-glow:
        0 0 14px rgba(255, 75, 0, 0.55),
        0 0 35px rgba(255, 75, 0, 0.18);

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       NEURAL BACKGROUNDS
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    --bg-void:              #000000;
    --bg-core:              #010409;
    --bg-panel:             rgba(0, 10, 20, 0.72);
    --bg-panel-heavy:       rgba(0, 5, 10, 0.92);
    --bg-neural:            radial-gradient(circle at center, rgba(0,255,65,0.05), transparent 65%);

    --glass-light:          rgba(255,255,255,0.03);
    --glass-border:         rgba(255,255,255,0.04);

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       ESPAÇO Z | PROCESSAMENTO COGNITIVO EM CAMADAS
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    /* Camada 0 — FOCO IMEDIATO */
    --z-focus-distance:     translateZ(0.5m);
    --z-focus-scale:        1;
    --z-focus-opacity:      1;

    /* Camada 1 — CONTEXTO OPERACIONAL */
    --z-context-distance:   translateZ(1.5m);
    --z-context-scale:      0.96;
    --z-context-opacity:    0.78;

    /* Camada 2 — SOBERANIA SISTÊMICA */
    --z-sovereign-distance: translateZ(3m);
    --z-sovereign-scale:    0.92;
    --z-sovereign-opacity:  0.55;

    /* Elevação Visual */
    --elevation-focus:      0 0 40px rgba(0,255,65,0.12);
    --elevation-context:    0 0 25px rgba(0,212,255,0.10);
    --elevation-sovereign:  0 0 80px rgba(0,0,0,0.90);

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       TIPOGRAFIA
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    --font-mono:            'Share Tech Mono', monospace;
    --font-display:         'Orbitron', sans-serif;

    --text-xs:              clamp(0.68rem, 0.7vw, 0.75rem);
    --text-sm:              clamp(0.78rem, 0.9vw, 0.9rem);
    --text-md:              clamp(1rem, 1.2vw, 1.15rem);
    --text-lg:              clamp(1.3rem, 2vw, 2rem);
    --text-xl:              clamp(2rem, 4vw, 4rem);

    --tracking-wide:        0.12em;
    --tracking-ultra:       0.24em;

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       TIMING + RESPOSTA NEURAL
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    --ease-out-expo:        cubic-bezier(0.19, 1, 0.22, 1);
    --ease-neural:          cubic-bezier(0.16, 1, 0.30, 1);

    --transition-fast:      0.18s var(--ease-neural);
    --transition-med:       0.45s var(--ease-out-expo);
    --transition-slow:      1.2s var(--ease-out-expo);

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       SISTEMA DE ISOLAMENTO OPERACIONAL
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    --contain-layout:       layout;
    --contain-paint:        paint;
    --contain-strict:       strict;

    --gpu-transform:        translate3d(0,0,0);

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       SENTINEL GRID
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    --grid-line:            rgba(0,212,255,0.05);
    --grid-flow:            rgba(0,255,65,0.03);

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       ENE | ESTADO NATURAL DE EXECUÇÃO
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    --ene-intensity:        1;
    --ene-pulse-speed:      4s;
    --ene-signal-opacity:   0.75;

    color-scheme: dark;
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESET | SOBERANIA ABSOLUTA DE RENDERIZAÇÃO
═══════════════════════════════════════════════════════════════════════════ */

*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    text-rendering: optimizeLegibility;

    cursor: crosshair !important;

    contain: var(--contain-layout) var(--contain-paint);

    backface-visibility: hidden;
    transform-style: preserve-3d;
}

html {
    width: 100%;
    height: 100%;

    background: var(--bg-void);

    overflow: hidden;

    scroll-behavior: smooth;

    perspective: 1800px;

    isolation: isolate;
}

body {
    position: relative;

    width: 100vw;
    height: 100vh;

    overflow: hidden;

    background:
        linear-gradient(to bottom, rgba(0,0,0,0.96), rgba(0,3,8,0.98)),
        radial-gradient(circle at top center, rgba(0,212,255,0.08), transparent 55%),
        radial-gradient(circle at bottom center, rgba(0,255,65,0.04), transparent 65%),
        var(--bg-core);

    color: var(--cyan);

    font-family: var(--font-mono);

    letter-spacing: 0.03em;

    transform: var(--gpu-transform);

    isolation: isolate;

    will-change: transform, opacity;
}

body::before {
    content: '';

    position: fixed;
    inset: 0;

    background:
        linear-gradient(var(--grid-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);

    background-size: 60px 60px;

    opacity: 0.12;

    pointer-events: none;

    z-index: -3;
}

body::after {
    content: '';

    position: fixed;
    inset: 0;

    background:
        radial-gradient(circle at center, rgba(0,255,65,0.06), transparent 55%);

    mix-blend-mode: screen;

    opacity: calc(var(--ene-signal-opacity) * 0.7);

    animation: enePulse var(--ene-pulse-speed) infinite ease-in-out;

    pointer-events: none;

    z-index: -2;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ENE | ESTADO NATURAL DE EXECUÇÃO
═══════════════════════════════════════════════════════════════════════════ */

body.ene-active {
    color: var(--green-flow);
}

body.ene-active * {
    border-color: var(--green-flow-border) !important;
}

body.ene-active .signal,
body.ene-active .status,
body.ene-active .hud-active {
    color: var(--green-flow);
    text-shadow: var(--green-flow-glow);
}

body.ene-active .panel,
body.ene-active .glass-card,
body.ene-active .hud-box {
    box-shadow:
        inset 0 0 0 1px rgba(0,255,65,0.12),
        var(--green-flow-glow);
}

/* ═══════════════════════════════════════════════════════════════════════════
   CAMADAS DE PROCESSAMENTO NEURAL
═══════════════════════════════════════════════════════════════════════════ */

.layer-focus {
    transform: var(--z-focus-distance) scale(var(--z-focus-scale));
    opacity: var(--z-focus-opacity);
    z-index: 300;
    box-shadow: var(--elevation-focus);
}

.layer-context {
    transform: var(--z-context-distance) scale(var(--z-context-scale));
    opacity: var(--z-context-opacity);
    z-index: 200;
    box-shadow: var(--elevation-context);
}

.layer-sovereign {
    transform: var(--z-sovereign-distance) scale(var(--z-sovereign-scale));
    opacity: var(--z-sovereign-opacity);
    z-index: 100;
    box-shadow: var(--elevation-sovereign);
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLASS SYSTEM | CYBER GLASS
═══════════════════════════════════════════════════════════════════════════ */

.glass-panel,
.glass-card,
.panel,
.hud-box {
    position: relative;

    background:
        linear-gradient(
            145deg,
            rgba(255,255,255,0.03),
            rgba(255,255,255,0.01)
        ),
        var(--bg-panel);

    border: 1px solid var(--cyan-border);

    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);

    overflow: hidden;

    isolation: isolate;

    transition:
        transform var(--transition-med),
        opacity var(--transition-med),
        border-color var(--transition-fast),
        box-shadow var(--transition-fast);
}

.glass-panel::before,
.glass-card::before,
.panel::before,
.hud-box::before {
    content: '';

    position: absolute;
    inset: 0;

    background:
        linear-gradient(
            135deg,
            rgba(255,255,255,0.08),
            transparent 35%
        );

    opacity: 0.6;

    pointer-events: none;
}

.glass-panel:hover,
.glass-card:hover,
.panel:hover,
.hud-box:hover {
    border-color: rgba(0,255,65,0.35);

    box-shadow:
        inset 0 0 0 1px rgba(0,255,65,0.08),
        0 0 25px rgba(0,255,65,0.12),
        0 0 80px rgba(0,212,255,0.05);

    transform: translateY(-2px);
}

/* ═══════════════════════════════════════════════════════════════════════════
   TIPOGRAFIA OPERACIONAL
═══════════════════════════════════════════════════════════════════════════ */

h1,
h2,
h3,
h4,
.hud-title,
.display-title {
    font-family: var(--font-display);

    text-transform: uppercase;

    letter-spacing: var(--tracking-ultra);

    font-weight: 700;

    text-shadow: var(--cyan-glow);
}

h1,
.display-title {
    font-size: var(--text-xl);
}

h2 {
    font-size: var(--text-lg);
}

p,
span,
label,
small,
li {
    font-size: var(--text-sm);

    line-height: 1.7;
}

/* ═══════════════════════════════════════════════════════════════════════════
   HUD SIGNALS
═══════════════════════════════════════════════════════════════════════════ */

.signal {
    position: relative;

    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    color: var(--cyan);

    text-shadow: var(--cyan-glow-sm);
}

.signal::before {
    content: '';

    width: 8px;
    height: 8px;

    border-radius: 50%;

    background: var(--green-flow);

    box-shadow: var(--green-flow-glow);

    animation: signalPulse 2s infinite ease-in-out;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLLBAR SYSTEM
═══════════════════════════════════════════════════════════════════════════ */

::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, var(--cyan), var(--green-flow));

    border-radius: 999px;

    box-shadow: var(--cyan-glow);
}

::-webkit-scrollbar-thumb:hover {
    background: var(--green-flow);

    box-shadow: var(--green-flow-glow);
}

/* ═══════════════════════════════════════════════════════════════════════════
   INPUTS | ZERO IMPEDANCE INTERFACE
═══════════════════════════════════════════════════════════════════════════ */

input,
textarea,
select,
button {
    border: none;
    outline: none;

    font-family: inherit;

    background: transparent;

    color: inherit;

    transform: translateZ(0);
}

button {
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    gap: 0.6rem;

    padding: 0.85rem 1.2rem;

    border: 1px solid var(--cyan-border);

    background:
        linear-gradient(
            145deg,
            rgba(0,212,255,0.08),
            rgba(0,255,65,0.04)
        );

    color: var(--cyan);

    text-transform: uppercase;

    letter-spacing: var(--tracking-wide);

    transition:
        transform var(--transition-fast),
        border-color var(--transition-fast),
        box-shadow var(--transition-fast),
        color var(--transition-fast);
}

button:hover {
    color: var(--green-flow);

    border-color: var(--green-flow-border);

    box-shadow: var(--green-flow-glow);

    transform: translateY(-1px);
}

button:active {
    transform: scale(0.985);
}

/* ═══════════════════════════════════════════════════════════════════════════
   OVERLAY SYSTEM
═══════════════════════════════════════════════════════════════════════════ */

#onboarding-overlay,
.overlay-system,
.system-overlay {
    position: fixed;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    background:
        rgba(0,0,0,0.92);

    backdrop-filter: blur(20px);

    z-index: 99999;

    isolation: isolate;
}

.overlay-inner {
    width: min(780px, 92vw);

    padding: 3rem;

    border: 1px solid var(--cyan-border);

    background: var(--bg-panel-heavy);

    box-shadow:
        0 0 50px rgba(0,212,255,0.12),
        inset 0 0 0 1px rgba(255,255,255,0.02);
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE ISOLATION LAYER
═══════════════════════════════════════════════════════════════════════════ */

[data-mobile="true"] body {
    overflow-y: auto;
    overflow-x: hidden;
}

[data-mobile="true"] #onboarding-overlay h1 {
    font-size: clamp(1.4rem, 5vw, 2rem);
}

[data-mobile="true"] .overlay-inner {
    width: 92%;
    padding: 2rem 1.4rem;
}

[data-mobile="true"] .glass-panel,
[data-mobile="true"] .glass-card {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

/* ═══════════════════════════════════════════════════════════════════════════
   PERFORMANCE LOCK
═══════════════════════════════════════════════════════════════════════════ */

.gpu-accelerated,
.neural-render,
.sentinel-node {
    will-change: transform, opacity;

    transform: translate3d(0,0,0);
}

.low-power-mode * {
    animation: none !important;
    transition: none !important;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATIONS
═══════════════════════════════════════════════════════════════════════════ */

@keyframes signalPulse {
    0%,
    100% {
        opacity: 0.5;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.35);
    }
}

@keyframes enePulse {
    0%,
    100% {
        opacity: 0.25;
        transform: scale(1);
    }

    50% {
        opacity: 0.55;
        transform: scale(1.03);
    }
}

@keyframes neuralSweep {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL FX v6.0
   Shader Engine + Tactical Feedback System
   Fragmento 2/3 — BLINDAGEM SENSORIAL E ENCLAUSURAMENTO
═══════════════════════════════════════════════════════════════════════════ */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VAZIO SISTÊMICO | VIGNETTE FIREWALL
   Redução de ruído periférico e foco neural.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

body::before {
    content: '';

    position: fixed;
    inset: 0;

    width: 100%;
    height: 100%;

    background:
        radial-gradient(
            circle at center,
            transparent 18%,
            rgba(0,0,0,0.12) 38%,
            rgba(0,0,0,0.94) 100%
        );

    backdrop-filter: blur(10px);

    mix-blend-mode: multiply;

    opacity: 0.92;

    pointer-events: none;

    z-index: 999;

    isolation: isolate;

    transition:
        opacity var(--transition-slow),
        backdrop-filter var(--transition-med);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SCANLINE TÁTICA
   Root Authority + Neural Sweep
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.overlay-scan-line {
    position: absolute;

    top: -20%;
    left: 0;

    width: 100%;
    height: 2px;

    background:
        linear-gradient(
            90deg,
            transparent,
            var(--cyan),
            transparent
        );

    box-shadow:
        var(--cyan-glow),
        0 0 40px rgba(0,212,255,0.08);

    opacity: 0.22;

    z-index: 1000;

    will-change: transform;

    animation: scanlineSweep 3s linear infinite;
}

@keyframes scanlineSweep {
    0% {
        transform: translateY(-15vh);
    }

    100% {
        transform: translateY(120vh);
    }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GLITCH REATIVO | COLAPSO INTERRUPTOR
   Disparo sensorial em >60s de inatividade.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

@keyframes reactiveJitter {

    0% {
        transform: translate(0,0) skew(0deg);
        filter: hue-rotate(0deg) contrast(1);
        opacity: 1;
    }

    10% {
        transform: translate(-4px, 2px) skew(-1deg);
        filter: contrast(1.8);
    }

    20% {
        transform: translate(4px, -2px) skew(1deg);
        filter: hue-rotate(120deg);
    }

    30% {
        transform: translate(-2px, -3px);
        opacity: 0.75;
    }

    40% {
        transform: translate(2px, 3px);
        filter: blur(1px);
    }

    50% {
        transform: translate(-5px, 1px);
    }

    60% {
        transform: translate(3px,-2px);
        filter: brightness(1.8);
    }

    100% {
        transform: translate(0,0);
        filter: hue-rotate(0deg) contrast(1);
        opacity: 1;
    }
}

/* GLITCH ALERT */

.system-idle-60,
.latency-critical,
.glitch-alert {
    color: var(--alert) !important;

    border-color: rgba(255,75,0,0.45) !important;

    text-shadow:
        0 0 12px rgba(255,75,0,0.65),
        0 0 35px rgba(255,75,0,0.25);

    animation: reactiveJitter 0.08s infinite;
}

.system-idle-60 .overlay-scan-line,
.glitch-alert .overlay-scan-line {
    background:
        linear-gradient(
            90deg,
            transparent,
            var(--alert),
            transparent
        );

    opacity: 0.75;

    animation-duration: 0.45s;
}

.system-glitch {
    position: relative;

    background: rgba(255,75,0,0.04) !important;

    isolation: isolate;

    animation: reactiveJitter 0.12s steps(2) infinite;
}

.system-glitch::before {
    content: '';

    position: absolute;
    inset: 0;

    background:
        repeating-linear-gradient(
            180deg,
            rgba(255,75,0,0.08) 0px,
            rgba(255,75,0,0.08) 2px,
            transparent 2px,
            transparent 4px
        );

    mix-blend-mode: screen;

    pointer-events: none;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DISSOLUÇÃO DE PARTÍCULAS
   Dopamina Técnica + Fechamento Zeigarnik
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

@keyframes particleDissolve {

    0% {
        opacity: 1;
        filter: blur(0px) brightness(1);
        transform: scale(1) translateZ(0);
        clip-path: inset(0 0 0 0);
    }

    35% {
        opacity: 0.95;
        filter: blur(2px) brightness(1.4);
        transform: scale(1.03);
    }

    70% {
        opacity: 0.55;
        filter: blur(10px) brightness(1.8);
        transform: scale(1.08);
    }

    100% {
        opacity: 0;
        filter: blur(22px) brightness(2.4);
        transform: scale(1.18);
        clip-path: inset(12% 12% 12% 12%);
    }
}

.synthesize-mission,
.task-complete,
.dopamine-feedback {
    animation:
        particleDissolve 0.9s forwards var(--ease-out-expo);

    will-change: transform, opacity, filter;
}

.task-complete::after,
.dopamine-feedback::after {
    content: 'ENE ACHIEVED';

    position: absolute;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    color: var(--green-flow);

    font-family: var(--font-display);

    letter-spacing: var(--tracking-ultra);

    text-shadow: var(--green-flow-glow);

    opacity: 0;

    animation: enePulse 1.2s ease-out forwards;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CYBER GLASS | DENSIDADE HOLOGRÁFICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-glass {
    position: relative;

    background:
        linear-gradient(
            145deg,
            rgba(255,255,255,0.04),
            rgba(255,255,255,0.01)
        ),
        var(--bg-panel);

    backdrop-filter: blur(16px) saturate(190%);
    -webkit-backdrop-filter: blur(16px) saturate(190%);

    border: 1px solid var(--cyan-border);

    box-shadow:
        inset 0 0 24px rgba(0,212,255,0.08),
        0 0 40px rgba(0,0,0,0.45);

    opacity: 0.16;

    transform: translateZ(0);

    transition:
        opacity var(--transition-med),
        transform var(--transition-med),
        border-color var(--transition-fast),
        box-shadow var(--transition-fast);
}

.cyber-glass:hover,
.focus-active,
.neural-focus {
    opacity: 0.96;

    transform:
        translateZ(20px)
        scale(1.01);

    border-color: var(--green-flow);

    box-shadow:
        inset 0 0 30px rgba(0,255,65,0.08),
        0 0 35px rgba(0,255,65,0.12),
        0 0 90px rgba(0,212,255,0.08);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SAFETY MODE | FOCUS CLIPPING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.safety-mode .ghost-window:not(#mon-0) {
    opacity: 0.04 !important;

    filter:
        grayscale(1)
        blur(6px)
        brightness(0.5);

    transform: scale(0.96);

    pointer-events: none;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VANGUARD MODE | SOBERANIA VISUAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.vanguard-mode {
    cursor: none;
}

.vanguard-mode body::before {
    background:
        radial-gradient(
            circle,
            transparent 14%,
            rgba(0,0,0,1) 90%
        );

    backdrop-filter: blur(18px);
}

.vanguard-mode .overlay-scan-line {
    animation-duration: 0.45s;
    opacity: 0.72;
}

.vanguard-mode .cyber-glass {
    opacity: 1;

    box-shadow:
        inset 0 0 40px rgba(0,255,65,0.12),
        0 0 120px rgba(0,212,255,0.10);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   JARVIS SENSING | ESCUTA OPERACIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.jarvis-listening .overlay-inner {
    border-color: var(--green-flow);

    box-shadow:
        0 0 25px rgba(0,255,65,0.25),
        0 0 80px rgba(0,212,255,0.08);

    animation: pulseListening 1.5s infinite;
}

@keyframes pulseListening {

    0% {
        box-shadow:
            0 0 10px rgba(0,255,65,0.12);
    }

    50% {
        box-shadow:
            0 0 40px rgba(0,255,65,0.28),
            0 0 80px rgba(0,212,255,0.12);
    }

    100% {
        box-shadow:
            0 0 10px rgba(0,255,65,0.12);
    }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ESTADOS AUXILIARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.fade-out {
    opacity: 0;

    pointer-events: none;

    transition: opacity 1.5s var(--ease-out-expo);
}

.hidden {
    display: none !important;
}

/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL HUD v6.0
   Interface Operativa + Root Authority Layer
   Fragmento 3/3 — HUD NEUROOPERACIONAL
═══════════════════════════════════════════════════════════════════════════ */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ONBOARDING OVERLAY | ROOT INITIALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

#onboarding-overlay {
    position: fixed;
    inset: 0;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    background:
        radial-gradient(circle at center, rgba(0,26,51,0.95) 0%, #000 100%),
        linear-gradient(to bottom, rgba(0,212,255,0.04), transparent);

    backdrop-filter: blur(20px);

    isolation: isolate;

    z-index: 99999;

    transition:
        opacity var(--transition-slow),
        backdrop-filter var(--transition-med);
}

#onboarding-overlay::before {
    content: '';

    position: absolute;
    inset: 0;

    background:
        repeating-linear-gradient(
            180deg,
            rgba(255,255,255,0.015) 0px,
            rgba(255,255,255,0.015) 1px,
            transparent 1px,
            transparent 3px
        );

    mix-blend-mode: soft-light;

    opacity: 0.45;

    pointer-events: none;
}

.overlay-inner {
    position: relative;

    width: min(680px, 92vw);

    padding: 3rem;

    text-align: center;

    border: 1px solid var(--cyan-border);

    background:
        linear-gradient(
            145deg,
            rgba(255,255,255,0.03),
            rgba(255,255,255,0.01)
        ),
        var(--bg-panel-heavy);

    backdrop-filter: blur(16px) saturate(180%);

    overflow: hidden;

    isolation: isolate;

    box-shadow:
        0 0 40px rgba(0,212,255,0.12),
        inset 0 0 0 1px rgba(255,255,255,0.02);
}

.overlay-inner::before {
    content: '';

    position: absolute;
    inset: 0;

    background:
        linear-gradient(
            135deg,
            rgba(0,255,65,0.06),
            transparent 30%
        );

    pointer-events: none;
}

#onboarding-overlay h1 {
    position: relative;

    font-family: var(--font-display);

    font-size: clamp(2rem, 4vw, 4rem);

    margin-bottom: 1rem;

    letter-spacing: 0.28em;

    text-transform: uppercase;

    color: var(--cyan);

    text-shadow:
        var(--cyan-glow),
        0 0 60px rgba(0,212,255,0.10);
}

#onboarding-overlay p {
    position: relative;

    font-size: var(--text-sm);

    line-height: 1.8;

    margin-bottom: 2rem;

    color: var(--cyan-dim);

    text-transform: uppercase;

    letter-spacing: var(--tracking-wide);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ROOT BOOT BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.boot-btn {
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    gap: 0.8rem;

    padding: 1rem 3rem;

    background:
        linear-gradient(
            145deg,
            rgba(0,212,255,0.06),
            rgba(0,255,65,0.03)
        );

    border: 1px solid var(--cyan);

    color: var(--cyan);

    font-family: var(--font-display);

    font-size: 1rem;

    letter-spacing: 0.24em;

    text-transform: uppercase;

    overflow: hidden;

    transition:
        transform var(--transition-fast),
        color var(--transition-fast),
        box-shadow var(--transition-fast),
        border-color var(--transition-fast);
}

.boot-btn::before {
    content: '';

    position: absolute;
    top: 0;
    left: -100%;

    width: 100%;
    height: 100%;

    background:
        linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.18),
            transparent
        );

    animation: neuralSweep 3s linear infinite;
}

.boot-btn:hover {
    color: var(--green-flow);

    border-color: var(--green-flow);

    box-shadow:
        var(--green-flow-glow),
        0 0 80px rgba(0,212,255,0.08);

    transform: translateY(-2px);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HUD 2D | ROOT AUTHORITY INTERFACE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

#hud-2d {
    position: fixed;
    inset: 0;

    width: 100%;
    height: 100%;

    padding: 20px;

    pointer-events: none;

    isolation: isolate;

    z-index: 100;

    overflow: hidden;
}

/* Scanlines Procedurais */

#hud-2d::before {
    content: '';

    position: absolute;
    inset: 0;

    background:
        repeating-linear-gradient(
            180deg,
            rgba(255,255,255,0.018) 0px,
            rgba(255,255,255,0.018) 1px,
            transparent 1px,
            transparent 4px
        );

    opacity: 0.28;

    mix-blend-mode: soft-light;

    pointer-events: none;

    animation: scanlineSweep 6s linear infinite;
}

#hud-2d::after {
    content: '';

    position: absolute;
    inset: 0;

    background:
        radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.88) 100%);

    opacity: 0.35;

    pointer-events: none;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HUD CORNERS | MILITARY TERMINAL SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.hud-corner {
    position: absolute;

    min-width: 220px;

    padding: 16px;

    border: 1px solid var(--cyan-border);

    background:
        linear-gradient(
            145deg,
            rgba(255,255,255,0.03),
            rgba(255,255,255,0.01)
        ),
        var(--bg-panel);

    backdrop-filter: blur(14px) saturate(160%);

    box-shadow:
        inset 0 0 18px rgba(0,212,255,0.05),
        0 0 25px rgba(0,0,0,0.35);

    pointer-events: auto;

    isolation: isolate;

    overflow: hidden;

    transition:
        transform var(--transition-med),
        border-color var(--transition-fast),
        opacity var(--transition-fast);
}

.hud-corner::before {
    content: '';

    position: absolute;
    inset: 0;

    background:
        linear-gradient(
            135deg,
            rgba(0,255,65,0.04),
            transparent 35%
        );

    opacity: 0.55;

    pointer-events: none;
}

.hud-corner:hover {
    border-color: rgba(0,255,65,0.28);

    transform: translateY(-2px);

    box-shadow:
        0 0 35px rgba(0,255,65,0.08),
        inset 0 0 20px rgba(0,255,65,0.04);
}

.top-left {
    top: 20px;
    left: 20px;

    border-left: 4px solid var(--green-flow);
}

.top-right {
    top: 20px;
    right: 20px;

    border-right: 4px solid var(--cyan);

    text-align: right;
}

.bottom-left {
    bottom: 20px;
    left: 20px;

    width: 320px;

    border-bottom: 4px solid var(--green-flow);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STATUS SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.status-label {
    margin-bottom: 4px;

    font-size: 10px;

    letter-spacing: 0.18em;

    text-transform: uppercase;

    color: var(--cyan-dim);
}

.status-value {
    font-family: var(--font-display);

    font-size: 18px;

    letter-spacing: 0.12em;

    color: var(--cyan);

    text-shadow: var(--cyan-glow-sm);
}

.status-value.signal-live {
    color: var(--green-flow);

    text-shadow: var(--green-flow-glow);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TERMINAL BUFFER | ROOT TERMINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.terminal-buffer {
    position: relative;

    height: 140px;

    overflow-y: auto;

    padding-right: 4px;

    font-size: 12px;

    line-height: 1.6;

    color: var(--cyan-dim);

    isolation: isolate;
}

.terminal-buffer::before {
    content: '';

    position: absolute;
    inset: 0;

    background:
        repeating-linear-gradient(
            180deg,
            rgba(0,255,65,0.015) 0px,
            rgba(0,255,65,0.015) 1px,
            transparent 1px,
            transparent 3px
        );

    pointer-events: none;
}

.cmd-input {
    width: 100%;

    border: none;
    outline: none;

    background: transparent;

    color: var(--green-flow);

    font-family: var(--font-mono);

    letter-spacing: 0.08em;

    text-shadow: var(--green-flow-glow);
}

.cmd-input::placeholder {
    color: rgba(0,255,65,0.35);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MODO SOMBRA | FOCUS CLIPPING
   Isolamento Pulvinar do Tálamo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.shadow-mode #hud-2d::after {
    background:
        radial-gradient(
            circle at center,
            transparent 8%,
            rgba(0,0,0,0.96) 90%
        );

    opacity: 1;

    backdrop-filter: blur(12px);
}

.shadow-mode .hud-corner:not(.focus-node) {
    opacity: 0.08 !important;

    filter:
        grayscale(1)
        blur(6px)
        brightness(0.4);

    transform: scale(0.96);

    pointer-events: none;
}

.shadow-mode .focus-node {
    opacity: 1;

    border-color: var(--green-flow);

    box-shadow:
        0 0 35px rgba(0,255,65,0.16),
        0 0 120px rgba(0,212,255,0.06);

    z-index: 999;
}

/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL KERNEL v6.0
   Cognitive Runtime + Sovereignty Layer
   Fragmento 4/4 — ESTABILIZAÇÃO DE SINAL DE CLOCK
═══════════════════════════════════════════════════════════════════════════ */

