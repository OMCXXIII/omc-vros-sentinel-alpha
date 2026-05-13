/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL JARVIS-VOICE v6.1
   VoiceCore, RAG Engine & Intent Processor
   Fragmento 4/4 — KERNEL v6.0 SOBERANIA OPERATIVA
   PATCH: SPEECH-TO-ACTION + RAG SYNTHESIS + MISSION LOCK

   REFATORAÇÃO CMA v1.0:
   - Domínio: COGNITION + MODULES
   - Todas as chamadas diretas a DOM 3D (a-entity material) substituídas
     por eventos no SentinelBus → engine-xr.js é o único consumidor de XR
   - Todas as escritas diretas em SYSTEM_STATE substituídas por
     SentinelBus.emit() → StateStore reage via handler no state-store.js
   - VoiceCore e VoiceListener gerenciam seu próprio ciclo de vida (init)
     acionado por boot:complete no Bus (elimina dependência de kernel.js)
   - Lógica visual de ghost-window (opacity, filter via .style) movida para
     eventos xr:focus-isolate / xr:focus-restore → engine-xr.js aplica
═══════════════════════════════════════════════════════════════════════════ */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GUARD — garante que o Bus está disponível
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

if (!window.SentinelBus) {
    console.error('[JARVIS] SentinelBus não encontrado. Carregue sentinel-bus.js antes de jarvis-voice.js.');
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. VOICE CORE
   Domínio: MODULES / TTS Driver
   Responsabilidade: síntese de voz e feedback de áudio.
   Não conhece SYSTEM_STATE, DOM 3D ou outros módulos de Cognição.
═══════════════════════════════════════════════════════════════════════════ */

const VoiceCore = {

    synth: window.speechSynthesis,

    init: function () {
        console.log('[JARVIS] VoiceCore inicializado. Soberania operativa confirmada.');
        this.bootSequence();
    },

    bootSequence: function () {
        setTimeout(() => {
            this.speak('Sentinel operacional. Latência estabilizada. Protocolos de soberania ativos.');
        }, 1200);
    },

    /* ─────────────────────────────────────────────────
       speak(text)
       Lê o texto via Web Speech API TTS.
       Ouve também o evento jarvis:speak do Bus para
       que qualquer módulo possa solicitar fala sem
       importar VoiceCore diretamente.
    ───────────────────────────────────────────────── */
    speak: function (text) {
        if (!this.synth) return;
        if (this.synth.speaking) this.synth.cancel();

        const utter    = new SpeechSynthesisUtterance(text);
        utter.lang     = JARVIS_CONFIG.lang;
        utter.pitch    = 0.88;
        utter.rate     = 1.0;
        utter.volume   = 1;

        this.synth.speak(utter);
    },

    /* ─────────────────────────────────────────────────
       playFeedback(type)
       Tones procedurais via Web Audio API.
       Tipos: 'confirm' | 'warning' | 'mission' | 'hover'
    ───────────────────────────────────────────────── */
    playFeedback: function (type) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc      = audioCtx.createOscillator();
        const gain     = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        switch (type) {
            case 'confirm':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                break;
            case 'warning':
                osc.type = 'square';
                osc.frequency.setValueAtTime(220, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
                break;
            case 'mission':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                break;
            default:
                gain.gain.setValueAtTime(0, audioCtx.currentTime);
        }

        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
    }
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VoiceCore ouve o Bus — qualquer módulo pode solicitar
   fala ou feedback sem conhecer VoiceCore diretamente.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

if (window.SentinelBus) {
    SentinelBus.on('jarvis:speak',    ({ text }) => VoiceCore.speak(text));
    SentinelBus.on('jarvis:feedback', ({ type }) => VoiceCore.playFeedback(type));
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. RAG ENGINE
   Domínio: COGNITION / Knowledge Base
   Responsabilidade: recuperação local de patches cognitivos.
   Sem dependências externas — função pura de lookup.
═══════════════════════════════════════════════════════════════════════════ */

const RAG_ENGINE = {

    keywords: {
        'como você funciona': {
            patch: 'Processo de Mielinização Deliberada para elevar a condução neural a 150m/s.',
            fonte: 'Vol. 1, Aula 5'
        },
        'por onde começo': {
            patch: 'Execute o Protocolo de 60 segundos agora. Gatilho Inevitável -> Ação Imediata.',
            fonte: 'Vol. 3, Aula 1'
        },
        'estou travado': {
            patch: 'Reconhecer -> Classificar (Dúvida/Excesso/Medo/Confusão) -> Corrigir em < 60s.',
            fonte: 'Vol. 3, Aula 3'
        },
        'não tenho vontade': {
            patch: 'Erro [CPF-ESGOT]. Hardware em Modo de Segurança. Reduza o escopo.',
            fonte: 'Vol. 1, Aula 2'
        },
        'muita coisa hoje': {
            patch: 'Execute Dump de RAM. Transfira processos para o buffer externo.',
            fonte: 'Vol. 2, Aula 5'
        },
        'como ser produtivo': {
            patch: 'Não busque produtividade, busque cadência. Calibre seu ciclo de clock.',
            fonte: 'Vol. 2, Aula 2'
        },
        'estou ansioso': {
            patch: 'Razão Desafio/Habilidade acima do limite operacional. Reduza escopo imediatamente.',
            fonte: 'Vol. 4, Aula 4'
        },
        'não consigo focar': {
            patch: 'Ative Focus Clipping. Reduza estímulos periféricos para preservar Buffer de Atenção.',
            fonte: 'Vol. 5, Aula 1'
        }
    },

    retrieve: function (prompt) {
        const lower = prompt.toLowerCase();
        for (const key in this.keywords) {
            if (lower.includes(key)) return this.keywords[key];
        }
        return null;
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   3. INTENT PROCESSOR
   Domínio: COGNITION / Speech-to-Action
   Responsabilidade: classificar intenções e emitir eventos no Bus.
   NÃO chama DOM 3D, NÃO escreve em SYSTEM_STATE diretamente.
   Emite jarvis:intent → outros domínios reagem.
═══════════════════════════════════════════════════════════════════════════ */

const IntentProcessor = {

    dictionary: {

        navigation: {
            patterns: ['navegar para', 'focar', 'ir para', 'monitor'],
            action: (val) => {
                const map = {
                    'biometria':    '1',
                    'arquétipos':   '2',
                    'centro':       '3',
                    'reator':       '3',
                    'mielinização': '4',
                    'soberania':    '5'
                };
                const key = map[val] || val;
                SentinelBus.emit('jarvis:intent', { intent: 'navigate', value: key });
            }
        },

        system_states: {
            patterns: ['ativar', 'desativar', 'modo'],
            action: (val) => {
                if (val.includes('sombra')) {
                    SentinelBus.emit('jarvis:intent', { intent: 'system_state', value: 'shadow' });
                }
                if (val.includes('repouso')) {
                    SentinelBus.emit('jarvis:intent', { intent: 'system_state', value: 'sleep' });
                }
                if (val.includes('terminal')) {
                    /* Terminal focus é UI pura — evento direto de UI */
                    SentinelBus.emit('ui:mode', { mode: 'terminal-focus', active: true });
                }
            }
        }
    },

    parse: function (transcript) {
        const text = transcript.toLowerCase();
        console.log(`[JARVIS] Analisando Intenção: "${text}"`);

        /* Registra input no Bus — StateStore reage via telemetry:input */
        SentinelBus.emit('telemetry:input', {});

        /* OVERRIDE */
        if (text.includes('override') || text.includes('omc override')) {
            SentinelBus.emit('jarvis:intent', { intent: 'override' });
            return;
        }

        /* MISSION LOCK */
        if (text.includes('mission') || text.includes('missão')) {
            const mission = transcript
                .replace(/omc/gi,     '')
                .replace(/mission/gi, '')
                .replace(/missão/gi,  '')
                .trim();
            SentinelBus.emit('jarvis:intent', { intent: 'mission', value: mission });
            return;
        }

        /* DEEP FLOW */
        if (text.includes('deep flow') || text.includes('flow')) {
            SentinelBus.emit('jarvis:intent', { intent: 'deepflow' });
            return;
        }

        /* FOCUS MODE */
        if (text.includes('focus') || text.includes('foco')) {
            SentinelBus.emit('jarvis:intent', { intent: 'focus' });
            return;
        }

        /* DICTIONARY DISPATCH */
        for (const [category, obj] of Object.entries(this.dictionary)) {
            if (obj.patterns.some(p => text.includes(p))) {
                const target = text.split(' ').pop();
                obj.action(target);
                SentinelBus.emit('jarvis:feedback', { type: 'confirm' });
                return;
            }
        }

        /* FALLBACK → JARVIS AI */
        SentinelBus.emit('jarvis:transcript', { text: transcript });
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   4. JARVIS AI
   Domínio: COGNITION / AI Dispatch
   Responsabilidade: RAG + fallback. Emite jarvis:reply → UI e Voice reagem.
   NÃO acessa DOM diretamente — emite eventos.
═══════════════════════════════════════════════════════════════════════════ */

const JARVIS_AI = {

    async dispatch(prompt) {
        const lower = prompt.toLowerCase();

        /* IDENTIDADE */
        if (lower.includes('quem é você')) {
            const latency = window.StateStore
                ? StateStore.get('telemetry.latency')
                : (window.SYSTEM_STATE?.telemetry?.latency ?? '?');

            const reply = `Sou o Sentinel v6.0. Motor de execução do SBL. Latência atual: ${latency}s.`;
            SentinelBus.emit('jarvis:reply', { text: reply, source: 'identity' });
            return;
        }

        /* RAG */
        const ragResult = RAG_ENGINE.retrieve(lower);
        if (ragResult) {
            const reply = `[PATCH]: ${ragResult.patch} | Fonte: ${ragResult.fonte}`;
            SentinelBus.emit('jarvis:reply', { text: reply, source: 'rag' });
            return;
        }

        /* FALLBACK */
        const defaultReply = 'Positivo. Diretriz de Soberania confirmada. Execute o protocolo de sessenta segundos agora.';
        SentinelBus.emit('jarvis:reply', { text: defaultReply, source: 'fallback' });
    }
};

/* ─────────────────────────────────────────────────
   JARVIS AI ouve jarvis:transcript (do IntentProcessor)
   e jarvis:reply propaga para VoiceCore e nexus-display.
───────────────────────────────────────────────── */

if (window.SentinelBus) {
    SentinelBus.on('jarvis:transcript', ({ text }) => {
        JARVIS_AI.dispatch(text);
    });

    SentinelBus.on('jarvis:reply', ({ text }) => {
        /* Fala via VoiceCore */
        VoiceCore.speak(text);
        /* Atualiza display principal via evento UI */
        SentinelBus.emit('ui:nexus-update', { text: `IA_REPLY:\n${text}` });
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. VOICE LISTENER
   Domínio: MODULES / STT Driver
   Responsabilidade: captura de voz e entrega de transcript ao Bus.
   Gerencia seu próprio ciclo de vida — init acionado por boot:complete.
═══════════════════════════════════════════════════════════════════════════ */

const VoiceListener = {

    recognition: null,
    isListening:  false,

    init: function () {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('[JARVIS] SpeechRecognition indisponível neste browser.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang           = JARVIS_CONFIG.lang;
        this.recognition.continuous     = false;
        this.recognition.interimResults = false;

        this.recognition.onstart = () => {
            this.isListening = true;
            document.body.classList.add('jarvis-listening');
            SentinelBus.emit('jarvis:feedback', { type: 'confirm' });
            /* Atualiza estado de escuta via Bus */
            SentinelBus.emit('state:change', { key: 'ui.isListening', val: true, prev: false });
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            /* Entrega o transcript ao IntentProcessor via parse direto
               (são do mesmo domínio COGNITION — chamada interna válida) */
            IntentProcessor.parse(transcript);
        };

        this.recognition.onerror = (event) => {
            console.warn(`[JARVIS] Erro de reconhecimento: ${event.error}`);
            this._cleanup();
        };

        this.recognition.onend = () => {
            this._cleanup();
        };
    },

    _cleanup: function () {
        this.isListening = false;
        document.body.classList.remove('jarvis-listening');
        SentinelBus.emit('state:change', { key: 'ui.isListening', val: false, prev: true });
    },

    start: function () {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        } else if (!this.recognition) {
            console.warn('[JARVIS] VoiceListener não inicializado.');
        }
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   6. PROTOCOLO HANDLERS — reações a jarvis:intent
   Domínio: COGNITION / Protocol Executor
   Cada handler emite eventos no Bus em vez de operar diretamente
   no DOM 3D ou no SYSTEM_STATE.
═══════════════════════════════════════════════════════════════════════════ */

if (window.SentinelBus) {

    /* ── OVERRIDE ──────────────────────────────────────────────────────── */
    SentinelBus.on('jarvis:intent', ({ intent }) => {
        if (intent !== 'override') return;

        SentinelBus.emit('jarvis:speak',    { text: 'Protocolo Override ativo. Purgando distrações.' });
        SentinelBus.emit('jarvis:feedback', { type: 'warning' });

        /* Estado operacional */
        SentinelBus.emit('state:change', { key: 'ops.override', val: true, prev: false });

        /* Visual no body */
        SentinelBus.emit('ui:mode', { mode: 'system-glitch',  active: true });
        SentinelBus.emit('ui:mode', { mode: 'override-active', active: true });

        /* Material XR — engine-xr.js aplica */
        SentinelBus.emit('xr:material', {
            target:    'mon-0',
            emissive:  '#FF4B00',
            intensity: 1.0
        });

        /* Isolamento de atenção — engine-xr.js suprime periféricos */
        SentinelBus.emit('xr:focus-isolate', { opacity: 0.02, blur: 10 });
    });

    /* ── MISSION LOCK ──────────────────────────────────────────────────── */
    SentinelBus.on('jarvis:intent', ({ intent, value }) => {
        if (intent !== 'mission') return;

        if (!value || value.length < 2) {
            SentinelBus.emit('jarvis:speak', { text: 'Missão inválida.' });
            return;
        }

        /* Persiste e notifica via Bus — StateStore e UI reagem */
        SentinelBus.emit('mission:lock', { mission: value });
        SentinelBus.emit('jarvis:feedback', { type: 'mission' });
        SentinelBus.emit('jarvis:speak',    { text: `Missão fixada. Objetivo principal: ${value}` });
    });

    /* ── DEEP FLOW ─────────────────────────────────────────────────────── */
    SentinelBus.on('jarvis:intent', ({ intent }) => {
        if (intent !== 'deepflow') return;

        SentinelBus.emit('xr:deepflow', { active: true });
        SentinelBus.emit('ui:mode',     { mode: 'ene-active', active: true });
        SentinelBus.emit('jarvis:speak', { text: 'Deep Flow operacional.' });
    });

    /* ── FOCUS PROTOCOL ────────────────────────────────────────────────── */
    SentinelBus.on('jarvis:intent', ({ intent }) => {
        if (intent !== 'focus') return;

        SentinelBus.emit('ui:mode',          { mode: 'focus-clipping', active: true });
        SentinelBus.emit('xr:focus-isolate', { opacity: 0.05, blur: 6 });
        SentinelBus.emit('jarvis:speak',     { text: 'Focus Clipping ativado.' });
    });

    /* ── NAVIGATE ──────────────────────────────────────────────────────── */
    SentinelBus.on('jarvis:intent', ({ intent, value }) => {
        if (intent !== 'navigate') return;
        /* navigate() pode continuar sendo chamado diretamente por enquanto
           — é uma função de UI sem acoplamento de estado */
        if (typeof navigate === 'function') navigate(value);
    });

    /* ── SYSTEM STATE (shadow / sleep) ────────────────────────────────── */
    SentinelBus.on('jarvis:intent', ({ intent, value }) => {
        if (intent !== 'system_state') return;
        if (value === 'shadow' && typeof toggleShadowMode === 'function') toggleShadowMode();
        if (value === 'sleep'  && typeof toggleSleepMode  === 'function') toggleSleepMode();
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. MISSION LOCK — PERSISTÊNCIA NO localStorage
   StateStore.on(mission:lock) já persiste em ops.mission.
   Este handler complementa: escreve no localStorage e atualiza o DOM 2D.
═══════════════════════════════════════════════════════════════════════════ */

if (window.SentinelBus) {
    SentinelBus.on('mission:lock', ({ mission }) => {
        localStorage.setItem('OMC_MISSION_LOCK', mission);

        const missionEl = document.getElementById('mission-lock');
        if (missionEl) missionEl.innerText = `MISSION: ${mission.toUpperCase()}`;
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. BOOT — CICLO DE VIDA AUTÔNOMO
   VoiceCore e VoiceListener se inicializam ao receber boot:complete.
   Elimina a dependência de kernel.js chamar VoiceCore.init() externamente.
═══════════════════════════════════════════════════════════════════════════ */

if (window.SentinelBus) {
    SentinelBus.once('boot:complete', () => {
        VoiceCore.init();
        VoiceListener.init();
        console.log('[JARVIS] Módulos de voz inicializados via boot:complete.');
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   9. RESTORE MISSION LOCK
   Restaura missão do localStorage na carga da página.
   Emite mission:lock → StateStore e UI reagem uniformemente.
═══════════════════════════════════════════════════════════════════════════ */

window.addEventListener('load', () => {
    const savedMission = localStorage.getItem('OMC_MISSION_LOCK');
    if (savedMission) {
        SentinelBus.emit('mission:lock', { mission: savedMission });
        SentinelBus.emit('mission:restored', { mission: savedMission });
    }
});

/* ═══════════════════════════════════════════════════════════════════════════
   SENTINEL JARVIS-VOICE v6.1
   DOMÍNIO: COGNITION + MODULES
   CANAL: SentinelBus — zero acoplamento direto com ENGINE-XR ou STATE
═══════════════════════════════════════════════════════════════════════════ */
