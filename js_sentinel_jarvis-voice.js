/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL JARVIS-VOICE
   VoiceCore, RAG Engine & Intent Processor
   Fragmento 4/4 — KERNEL v6.0 SOBERANIA OPERATIVA
   PATCH: SPEECH-TO-ACTION + RAG SYNTHESIS + MISSION LOCK
═══════════════════════════════════════════════════════════════════════════ */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 1. SYSTEM PROMPT: PROTOCOLO JARVIS-KERNEL v6.0
 * Diretriz: Atuar como o Kérnel do Sistema Operacional Humano.
 * Foco:
 * - Redução de latência
 * - Biossíntese de mielina
 * - Deep Flow contínuo
 * - Engenharia comportamental
 * - Speech-to-Action
 * - Soberania Operativa
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const VoiceCore = {

    synth: window.speechSynthesis,

    init: function() {

        console.log(
            "[JARVIS] VoiceCore inicializado. Soberania operativa confirmada."
        );

        this.bootSequence();
    },

    bootSequence: function() {

        setTimeout(() => {

            this.speak(
                "Sentinel operacional. Latência estabilizada. Protocolos de soberania ativos."
            );

        }, 1200);
    },

    speak: function(text) {

        if (!this.synth) return;

        if (this.synth.speaking) {
            this.synth.cancel();
        }

        const utter = new SpeechSynthesisUtterance(text);

        utter.lang  = JARVIS_CONFIG.lang;
        utter.pitch = 0.88;
        utter.rate  = 1.0;
        utter.volume = 1;

        this.synth.speak(utter);
    },

    playFeedback: function(type) {

        const audioCtx =
            new (window.AudioContext || window.webkitAudioContext)();

        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        switch(type) {

            case 'confirm':

                osc.type = 'sine';

                osc.frequency.setValueAtTime(
                    880,
                    audioCtx.currentTime
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.01,
                    audioCtx.currentTime + 0.1
                );

                break;

            case 'warning':

                osc.type = 'square';

                osc.frequency.setValueAtTime(
                    220,
                    audioCtx.currentTime
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.01,
                    audioCtx.currentTime + 0.25
                );

                break;

            case 'mission':

                osc.type = 'triangle';

                osc.frequency.setValueAtTime(
                    1200,
                    audioCtx.currentTime
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.01,
                    audioCtx.currentTime + 0.15
                );

                break;
        }

        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
    }
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 2. RAG ENGINE
 * Local Retrieval Augmented Generation
 * Manuais de Alquimia Sistêmica
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const RAG_ENGINE = {

    keywords: {

        "como você funciona": {
            patch: "Processo de Mielinização Deliberada para elevar a condução neural a 150m/s.",
            fonte: "Vol. 1, Aula 5"
        },

        "por onde começo": {
            patch: "Execute o Protocolo de 60 segundos agora. Gatilho Inevitável -> Ação Imediata.",
            fonte: "Vol. 3, Aula 1"
        },

        "estou travado": {
            patch: "Reconhecer -> Classificar (Dúvida/Excesso/Medo/Confusão) -> Corrigir em < 60s.",
            fonte: "Vol. 3, Aula 3"
        },

        "não tenho vontade": {
            patch: "Erro [CPF-ESGOT]. Hardware em Modo de Segurança. Reduza o escopo.",
            fonte: "Vol. 1, Aula 2"
        },

        "muita coisa hoje": {
            patch: "Execute Dump de RAM. Transfira processos para o buffer externo.",
            fonte: "Vol. 2, Aula 5"
        },

        "como ser produtivo": {
            patch: "Não busque produtividade, busque cadência. Calibre seu ciclo de clock.",
            fonte: "Vol. 2, Aula 2"
        },

        "estou ansioso": {
            patch: "Razão Desafio/Habilidade acima do limite operacional. Reduza escopo imediatamente.",
            fonte: "Vol. 4, Aula 4"
        },

        "não consigo focar": {
            patch: "Ative Focus Clipping. Reduza estímulos periféricos para preservar Buffer de Atenção.",
            fonte: "Vol. 5, Aula 1"
        }
    },

    retrieve: function(prompt) {

        const lower = prompt.toLowerCase();

        for (let key in this.keywords) {

            if (lower.includes(key)) {

                return this.keywords[key];
            }
        }

        return null;
    }
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 3. INTENT PROCESSOR
 * Speech-to-Action Neurooperacional
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const IntentProcessor = {

    dictionary: {

        navigation: {

            patterns: [
                "navegar para",
                "focar",
                "ir para",
                "monitor"
            ],

            action: (val) => {

                const map = {
                    "biometria": "1",
                    "arquétipos": "2",
                    "centro": "3",
                    "reator": "3",
                    "mielinização": "4",
                    "soberania": "5"
                };

                const key = map[val] || val;

                if (typeof navigate === 'function') {
                    navigate(key);
                }
            }
        },

        system_states: {

            patterns: [
                "ativar",
                "desativar",
                "modo"
            ],

            action: (val) => {

                if (val.includes("sombra")) {
                    toggleShadowMode();
                }

                if (
                    val.includes("repouso") &&
                    typeof toggleSleepMode === 'function'
                ) {
                    toggleSleepMode();
                }

                if (val.includes("terminal")) {
                    document.getElementById('cmd-input')?.focus();
                }
            }
        }
    },

    parse: function(transcript) {

        const text = transcript.toLowerCase();

        console.log(
            `[JARVIS] Analisando Intenção: "${text}"`
        );

        SYSTEM_STATE.telemetry.lastInput = Date.now();

        /* OVERRIDE */

        if (
            text.includes("override") ||
            text.includes("omc override")
        ) {

            executeOverrideProtocol();
            return;
        }

        /* MISSION LOCK */

        if (
            text.includes("mission") ||
            text.includes("missão")
        ) {

            const mission =
                transcript
                    .replace(/omc/gi, "")
                    .replace(/mission/gi, "")
                    .replace(/missão/gi, "")
                    .trim();

            executeMissionProtocol(mission);

            return;
        }

        /* DEEP FLOW */

        if (
            text.includes("deep flow") ||
            text.includes("flow")
        ) {

            activateDeepFlowProtocol();

            return;
        }

        /* FOCUS MODE */

        if (
            text.includes("focus") ||
            text.includes("foco")
        ) {

            activateFocusProtocol();

            return;
        }

        for (const [category, obj] of Object.entries(this.dictionary)) {

            if (
                obj.patterns.some(p => text.includes(p))
            ) {

                const target =
                    text.split(" ").pop();

                this.executeAction(category, target);

                return;
            }
        }

        JARVIS_AI.dispatch(text);
    },

    executeAction: function(category, value) {

        if (this.dictionary[category]) {

            this.dictionary[category].action(value);

            VoiceCore.playFeedback('confirm');
        }
    }
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 4. JARVIS AI
 * RAG + Nexus + Diagnóstico Cognitivo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const JARVIS_AI = {

    async dispatch(prompt) {

        const lowerPrompt = prompt.toLowerCase();

        /* IDENTIDADE */

        if (
            lowerPrompt.includes("quem é você")
        ) {

            const reply =
                `Sou o Sentinel v6.0. Motor de execução do SBL. Latência atual: ${SYSTEM_STATE.telemetry.latency}s.`;

            VoiceCore.speak(reply);

            this.updateNexus(reply);

            return;
        }

        /* RAG */

        const ragResult =
            RAG_ENGINE.retrieve(lowerPrompt);

        if (ragResult) {

            const reply =
                `[PATCH]: ${ragResult.patch} | Fonte: ${ragResult.fonte}`;

            VoiceCore.speak(reply);

            this.updateNexus(reply);

            return;
        }

        /* FALLBACK */

        const defaultReply =
            "Positivo. Diretriz de Soberania confirmada. Execute o protocolo de sessenta segundos agora.";

        VoiceCore.speak(defaultReply);

        this.updateNexus(defaultReply);
    },

    updateNexus(text) {

        const nexus =
            document.getElementById('nexus-display');

        if (nexus) {

            nexus.setAttribute(
                'value',
                `IA_REPLY:\n${text}`
            );
        }
    }
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 5. VOICE LISTENER
 * Escuta Ativa Neuroadaptativa
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const VoiceListener = {

    recognition: null,
    isListening: false,

    init: function() {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            console.warn(
                "[JARVIS] SpeechRecognition indisponível."
            );

            return;
        }

        this.recognition =
            new SpeechRecognition();

        this.recognition.lang =
            JARVIS_CONFIG.lang;

        this.recognition.continuous = false;

        this.recognition.interimResults = false;

        this.recognition.onstart = () => {

            this.isListening = true;

            document.body.classList.add(
                'jarvis-listening'
            );

            VoiceCore.playFeedback('confirm');
        };

        this.recognition.onresult = (event) => {

            const transcript =
                event.results[0][0].transcript;

            IntentProcessor.parse(transcript);
        };

        this.recognition.onerror = () => {

            this.isListening = false;

            document.body.classList.remove(
                'jarvis-listening'
            );
        };

        this.recognition.onend = () => {

            this.isListening = false;

            document.body.classList.remove(
                'jarvis-listening'
            );
        };
    },

    start: function() {

        if (!this.isListening) {

            this.recognition.start();
        }
    }
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 6. OVERRIDE PROTOCOL
 * Hard Reset de Atenção
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function executeOverrideProtocol() {

    VoiceCore.speak(
        "Protocolo Override ativo. Purgando distrações."
    );

    VoiceCore.playFeedback('warning');

    toggleShadowMode();

    SYSTEM_STATE.telemetry.lastInput = Date.now();

    SYSTEM_STATE.ops.override = true;

    document.body.classList.add('system-glitch');

    document.body.classList.add('override-active');

    const mainMonitor =
        document.getElementById('mon-0');

    if (mainMonitor) {

        mainMonitor.setAttribute(
            'material',
            'emissiveIntensity',
            '1'
        );

        mainMonitor.setAttribute(
            'material',
            'emissive',
            '#FF4B00'
        );
    }

    isolateAttentionField();
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 7. MISSION LOCK
 * Persistência Cognitiva
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function executeMissionProtocol(mission) {

    if (!mission || mission.length < 2) {

        VoiceCore.speak(
            "Missão inválida."
        );

        return;
    }

    SYSTEM_STATE.ops.mission = mission;

    localStorage.setItem(
        'OMC_MISSION_LOCK',
        mission
    );

    const missionEl =
        document.getElementById('mission-lock');

    if (missionEl) {

        missionEl.innerText =
            `MISSION: ${mission.toUpperCase()}`;
    }

    VoiceCore.playFeedback('mission');

    VoiceCore.speak(
        `Missão fixada. Objetivo principal: ${mission}`
    );
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 8. FOCUS PROTOCOL
 * Proteção do Buffer de Atenção
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function activateFocusProtocol() {

    document.body.classList.add('focus-clipping');

    const windows =
        document.querySelectorAll('.ghost-window');

    windows.forEach((windowEl, index) => {

        if (index > 0) {

            windowEl.style.opacity = '0.05';

            windowEl.style.filter =
                'blur(6px) grayscale(1)';

            windowEl.style.pointerEvents = 'none';
        }
    });

    VoiceCore.speak(
        "Focus Clipping ativado."
    );
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 9. DEEP FLOW PROTOCOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function activateDeepFlowProtocol() {

    SYSTEM_STATE.ops.deepFlow = true;

    document.body.classList.add('ene-active');

    VoiceCore.speak(
        "Deep Flow operacional."
    );

    const monitor =
        document.getElementById('mon-0');

    if (monitor) {

        monitor.setAttribute(
            'material',
            'emissive',
            '#00FF41'
        );

        monitor.setAttribute(
            'material',
            'emissiveIntensity',
            '0.9'
        );
    }
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 10. ATTENTION ISOLATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function isolateAttentionField() {

    const windows =
        document.querySelectorAll('.ghost-window');

    windows.forEach((windowEl, index) => {

        if (index > 0) {

            windowEl.style.opacity = '0.02';

            windowEl.style.filter =
                'blur(10px) grayscale(1)';

            windowEl.style.pointerEvents = 'none';
        }
    });
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 11. RESTORE MISSION LOCK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener('load', () => {

    const savedMission =
        localStorage.getItem('OMC_MISSION_LOCK');

    if (savedMission) {

        SYSTEM_STATE.ops.mission = savedMission;

        const missionEl =
            document.getElementById('mission-lock');

        if (missionEl) {

            missionEl.innerText =
                `MISSION: ${savedMission.toUpperCase()}`;
        }
    }
});

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * INITIALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

VoiceCore.init();

VoiceListener.init();

if (typeof updateDynamicFeeds === 'function') {
    updateDynamicFeeds();
}

/* ═══════════════════════════════════════════════════════════════════════════
   SENTINEL JARVIS-VOICE v6.0
   ROOT AUTHORITY ENABLED
═══════════════════════════════════════════════════════════════════════════ */
