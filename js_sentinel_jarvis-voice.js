/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL JARVIS-VOICE
   VoiceCore, RAG Engine & Intent Processor
   Fragmento 4/4 — KERNEL v6.0 SOBERANIA OPERATIVA
═══════════════════════════════════════════════════════════════════════════ */

/**
 * 1. SYSTEM PROMPT: PROTOCOLO JARVIS-KERNEL v6.0
 * Diretriz: Atuar como o Kérnel do Sistema Operacional Humano.
 * Foco: Redução de latência, biossíntese de mielina e patches de engenharia.
 */

const VoiceCore = {
    synth: window.speechSynthesis,
    init: function() {
        console.log("[JARVIS] VoiceCore inicializado. Soberania operativa confirmada.");
    },
    speak: function(text) {
        if (this.synth.speaking) this.synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = JARVIS_CONFIG.lang;
        utter.pitch = 0.9;
        utter.rate = 1.0;
        this.synth.speak(utter);
    },
    playFeedback: function(type) {
        // Feedback sonoro mecânico para confirmação de comando
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        if(type === 'confirm') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }
    }
};

/**
 * 2. RAG ENGINE (Local Retrieval Augmented Generation)
 * Mapeamento de termos técnicos dos manuais de Alquimia Sistêmica.
 */
const RAG_ENGINE = {
    keywords: {
        "como você funciona": { patch: "Processo de Mielinização Deliberada para elevar a condução neural a 150m/s.", fonte: "Vol. 1, Aula 5" },
        "por onde começo": { patch: "Execute o Protocolo de 60 segundos agora. Gatilho Inevitável -> Ação Imediata.", fonte: "Vol. 3, Aula 1" },
        "estou travado": { patch: "Reconhecer -> Classificar (Dúvida/Excesso/Medo/Confusão) -> Corrigir em < 60s.", fonte: "Vol. 3, Aula 3" },
        "não tenho vontade": { patch: "Erro [CPF-ESGOT]. Hardware em Modo de Segurança. Reduza o escopo.", fonte: "Vol. 1, Aula 2" },
        "muita coisa hoje": { patch: "Execute Dump de RAM. Transfira processos para o buffer externo.", fonte: "Vol. 2, Aula 5" },
        "como ser produtivo": { patch: "Não busque produtividade, busque cadência. Calibre seu ciclo de clock.", fonte: "Vol. 2, Aula 2" }
    }
};

/**
 * 3. INTENT PROCESSOR (Speech-to-Action)
 * Converte transcrição em manipulação de hardware e interface.
 */
const IntentProcessor = {
    dictionary: {
        navigation: {
            patterns: ["navegar para", "focar", "ir para", "monitor"],
            action: (val) => {
                const map = { "biometria": "1", "arquétipos": "2", "centro": "3", "reator": "3", "mielinização": "4", "soberania": "5" };
                const key = map[val] || val;
                if (typeof navigate === 'function') navigate(key);
            }
        },
        system_states: {
            patterns: ["ativar", "desativar", "modo"],
            action: (val) => {
                if (val.includes("sombra")) toggleShadowMode();
                if (val.includes("repouso") && typeof toggleSleepMode === 'function') toggleSleepMode();
                if (val.includes("terminal")) document.getElementById('cmd-input')?.focus();
            }
        }
    },

    parse: function(transcript) {
        const text = transcript.toLowerCase();
        console.log(`[JARVIS] Analisando Intenção: "${text}"`);

        if (text.includes("override")) {
            executeOverrideProtocol();
            return;
        }

        for (const [category, obj] of Object.entries(this.dictionary)) {
            if (obj.patterns.some(p => text.includes(p))) {
                const target = text.split(" ").pop();
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
 * 4. JARVIS AI & VOICE LISTENER
 * Orquestração de Diálogo e Escuta Ativa.
 */
const JARVIS_AI = {
    async dispatch(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        
        // Verificação de Identidade
        if (lowerPrompt.includes("quem é você")) {
            const reply = `Sou o Sentinel v6.0, motor de execução do SBL. Latência atual: ${SYSTEM_STATE.telemetry.latency}s.`;
            VoiceCore.speak(reply);
            this.updateNexus(reply);
            return;
        }

        // Busca no RAG Local
        for (let key in RAG_ENGINE.keywords) {
            if (lowerPrompt.includes(key)) {
                const item = RAG_ENGINE.keywords[key];
                const reply = `[PATCH]: ${item.patch} (Fonte: ${item.fonte})`;
                VoiceCore.speak(reply);
                this.updateNexus(reply);
                return;
            }
        }

        // Fallback Operacional
        const defaultReply = "Positivo. Diretriz de Soberania confirmada. Execute o Protocolo de 60 segundos agora.";
        VoiceCore.speak(defaultReply);
        this.updateNexus(defaultReply);
    },
    
    updateNexus(text) {
        const nexus = document.getElementById('nexus-display');
        if (nexus) nexus.setAttribute('value', `IA_REPLY:\n${text}`);
    }
};

const VoiceListener = {
    recognition: null,
    isListening: false,

    init: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = JARVIS_CONFIG.lang;
        this.recognition.onstart = () => {
            this.isListening = true;
            document.body.classList.add('jarvis-listening');
        };
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            IntentProcessor.parse(transcript);
        };
        this.recognition.onend = () => {
            this.isListening = false;
            document.body.classList.remove('jarvis-listening');
        };
    },
    start: function() { if (!this.isListening) this.recognition.start(); }
};

/**
 * 5. PROTOCOLO OVERRIDE
 * Hard Reset de Atenção e Purgagem de Distrações.
 */
function executeOverrideProtocol() {
    VoiceCore.speak("Protocolo Override Ativo. Purgando distrações. Inicializando clock.");
    toggleShadowMode();
    SYSTEM_STATE.telemetry.lastInput = Date.now();
    document.body.classList.add('system-glitch');
    
    const mainMonitor = document.getElementById('mon-0');
    if (mainMonitor) {
        mainMonitor.setAttribute('material', 'emissiveIntensity', '0.8');
    }
}

// Inicialização
VoiceCore.init();
VoiceListener.init();
if (typeof updateDynamicFeeds === 'function') updateDynamicFeeds();