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
   GUARD — Configuração e Barramento
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

if (!window.SentinelBus) {
    console.error('[JARVIS] SentinelBus não encontrado. Carregue sentinel-bus.js antes de jarvis-voice.js.');
}

// Fallback de segurança para configurações de voz
const JARVIS_CONFIG = window.JARVIS_CONFIG || { lang: 'pt-BR', neuralSampleRate: 32 };

/* ═══════════════════════════════════════════════════════════════════════════
   1. VOICE CORE
   Domínio: MODULES / TTS Driver
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

    speak: function (text) {
        if (!this.synth) return;
        
        // Cancela falas anteriores para evitar sobreposição em comandos rápidos
        if (this.synth.speaking) this.synth.cancel();

        const utter    = new SpeechSynthesisUtterance(text);
        utter.lang     = JARVIS_CONFIG.lang;
        utter.pitch    = 0.88;
        utter.rate     = 1.0;
        utter.volume   = 1;

        this.synth.speak(utter);
    },

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

if (window.SentinelBus) {
    SentinelBus.on('jarvis:speak',    ({ text }) => VoiceCore.speak(text));
    SentinelBus.on('jarvis:feedback', ({ type }) => VoiceCore.playFeedback(type));
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. RAG ENGINE
   Domínio: COGNITION / Knowledge Base
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
        'produtividade': {
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
═══════════════════════════════════════════════════════════════════════════ */

const IntentProcessor = {

    dictionary: {
        navigation: {
            patterns: ['navegar para', 'focar', 'ir para', 'monitor'],
            action: (text) => {
                const map = {
                    'biometria':    '1',
                    'arquétipos':   '2',
                    'centro':       '3',
                    'reator':       '3',
                    'mielinização': '4',
                    'soberania':    '5'
                };
                // Busca se algum dos destinos está presente na frase
                let key = null;
                for (let target in map) {
                    if (text.includes(target)) {
                        key = map[target];
                        break;
                    }
                }
                if (!key) key = text.split(' ').pop(); // Fallback palavra final
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
                    SentinelBus.emit('ui:mode', { mode: 'terminal-focus', active: true });
                }
            }
        }
    },

    parse: function (transcript) {
        const text = transcript.toLowerCase();
        console.log(`[JARVIS] Analisando Intenção: "${text}"`);

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
                obj.action(text);
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
═══════════════════════════════════════════════════════════════════════════ */

const JARVIS_AI = {

    async dispatch(prompt) {
        const lower = prompt.toLowerCase();

        /* IDENTIDADE */
        if (lower.includes('quem é você')) {
            const latency = window.StateStore
                ? StateStore.get('ops.latency')
                : (window.SYSTEM_STATE?.ops?.latency ?? '?');

            const reply = `Sou o Sentinel v6.0. Motor de execução do SBL. Latência atual: ${latency}.`;
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

if (window.SentinelBus) {
    SentinelBus.on('jarvis:transcript', ({ text }) => {
        JARVIS_AI.dispatch(text);
    });

    SentinelBus.on('jarvis:reply', ({ text }) => {
        VoiceCore.speak(text);
        SentinelBus.emit('ui:nexus-update', { text: `IA_REPLY:\n${text}` });
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. VOICE LISTENER
   Domínio: MODULES / STT Driver
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
        this.recognition.continuous      = false;
        this.recognition.interimResults = false;

        this.recognition.onstart = () => {
            this.isListening = true;
            document.body.classList.add('jarvis-listening');
            SentinelBus.emit('jarvis:feedback', { type: 'confirm' });
            SentinelBus.emit('state:change', { key: 'ui.isListening', val: true, prev: false });
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
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
   6. PROTOCOLO HANDLERS
═══════════════════════════════════════════════════════════════════════════ */

if (window.SentinelBus) {

    SentinelBus.on('jarvis:intent', ({ intent, value }) => {
        
        /* OVERRIDE */
        if (intent === 'override') {
            SentinelBus.emit('jarvis:speak',    { text: 'Protocolo Override ativo. Purgando distrações.' });
            SentinelBus.emit('jarvis:feedback', { type: 'warning' });
            SentinelBus.emit('state:change',    { key: 'ops.override', val: true, prev: false });
            SentinelBus.emit('ui:mode',         { mode: 'system-glitch',   active: true });
            SentinelBus.emit('ui:mode',         { mode: 'override-active', active: true });
            SentinelBus.emit('xr:material',     { target: 'mon-0', emissive: '#FF4B00', intensity: 1.0 });
            SentinelBus.emit('xr:focus-isolate', { opacity: 0.02, blur: 10 });
        }

        /* MISSION LOCK */
        if (intent === 'mission') {
            if (!value || value.length < 2) {
                SentinelBus.emit('jarvis:speak', { text: 'Missão inválida.' });
                return;
            }
            SentinelBus.emit('mission:lock',     { mission: value });
            SentinelBus.emit('jarvis:feedback', { type: 'mission' });
            SentinelBus.emit('jarvis:speak',    { text: `Missão fixada. Objetivo principal: ${value}` });
        }

        /* DEEP FLOW */
        if (intent === 'deepflow') {
            SentinelBus.emit('xr:deepflow', { active: true });
            SentinelBus.emit('ui:mode',     { mode: 'ene-active', active: true });
            SentinelBus.emit('jarvis:speak', { text: 'Deep Flow operacional.' });
        }

        /* FOCUS PROTOCOL */
        if (intent === 'focus') {
            SentinelBus.emit('ui:mode',          { mode: 'focus-clipping', active: true });
            SentinelBus.emit('xr:focus-isolate', { opacity: 0.05, blur: 6 });
            SentinelBus.emit('jarvis:speak',     { text: 'Focus Clipping ativado.' });
        }

        /* NAVIGATE */
        if (intent === 'navigate') {
            if (typeof navigate === 'function') navigate(value);
        }

        /* SYSTEM STATE */
        if (intent === 'system_state') {
            if (value === 'shadow' && typeof toggleShadowMode === 'function') toggleShadowMode();
            if (value === 'sleep'  && typeof toggleSleepMode  === 'function') toggleSleepMode();
        }
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. MISSION LOCK — PERSISTÊNCIA
═══════════════════════════════════════════════════════════════════════════ */

if (window.SentinelBus) {
    SentinelBus.on('mission:lock', ({ mission }) => {
        localStorage.setItem('OMC_MISSION_LOCK', mission);
        const missionEl = document.getElementById('mission-lock');
        if (missionEl) missionEl.textContent = `MISSION: ${mission.toUpperCase()}`;
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. BOOT — CICLO DE VIDA
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
═══════════════════════════════════════════════════════════════════════════ */

window.addEventListener('load', () => {
    const savedMission = localStorage.getItem('OMC_MISSION_LOCK');
    if (savedMission && window.SentinelBus) {
        SentinelBus.emit('mission:lock', { mission: savedMission });
        SentinelBus.emit('mission:restored', { mission: savedMission });
    }
});

/* ═══════════════════════════════════════════════════════════════════════════
   SENTINEL JARVIS-VOICE v6.1 | DOMÍNIO: COGNITION + MODULES
═══════════════════════════════════════════════════════════════════════════ */
