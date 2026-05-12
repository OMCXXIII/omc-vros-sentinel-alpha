/* ═══════════════════════════════════════════════════════════════════════════
   OMC VR-OS | SENTINEL PROTOCOLS v6.0
   Sincronização de Mielina e Gestão de Estresse Oxidativo
   Fragmento 3/4 — MOTOR DE BIOFEEDBACK ATIVO
═══════════════════════════════════════════════════════════════════════════ */

/**
 * PROTOCOLO ANTI-TRAVAMENTO (Regra dos 60s)
 * Age sobre o Ciclo-Colap interrompendo a Inércia via Choque Sensorial.
 */
function checkLatency() {
    const idleTime = (Date.now() - SYSTEM_STATE.telemetry.lastInput) / 1000;
    const latencyEl = document.getElementById('latency-value');
    const mainMonitor = document.getElementById('mon-0');

    if (latencyEl) {
        latencyEl.innerText = `${idleTime.toFixed(1)}s`;
        
        // GATILHO DE ALTA IMPEDÂNCIA: Se latência > 60s
        if (idleTime > 60) {
            latencyEl.classList.add('latency-critical');
            document.body.classList.add('system-glitch'); // Trigger de tremor holográfico
            
            // Reação Visual: Transição para Laranja Emergência (Alerta de Fadiga de Decisão)
            if (mainMonitor) {
                mainMonitor.setAttribute('material', 'emissive', '#FF4B00');
                mainMonitor.setAttribute('material', 'emissiveIntensity', '0.5');
            }

            // JARVIS: Diagnóstico de 3 Passos (Biofeedback Vocal)
            if (Math.floor(idleTime) % 30 === 0) {
                const diagnosis = ["DÚVIDA", "EXCESSO", "MEDO", "CONFUSÃO"];
                const randomBug = diagnosis[Math.floor(Math.random() * diagnosis.length)];
                if (typeof VoiceCore !== 'undefined') {
                    VoiceCore.speak(`Alerta de Latência. Detectado: ${randomBug}. Aplique o Patch de correção agora.`);
                }
            }
        } else {
            // SINAL DE ESTABILIDADE: Retorno ao Cyan Operacional
            latencyEl.classList.remove('latency-critical');
            document.body.classList.remove('system-glitch');
            if (mainMonitor) {
                mainMonitor.setAttribute('material', 'emissive', '#00D4FF');
                mainMonitor.setAttribute('material', 'emissiveIntensity', '0.1');
            }
        }
    }
    SYSTEM_STATE.telemetry.latency = idleTime;
    setTimeout(checkLatency, 1000);
}

/**
 * TELEMETRIA DE MIELINIZAÇÃO (Velocidade de Condução Saltatória)
 * Converte Continuidade em Performance Cognitiva.
 */
function updateMielinaProgress() {
    // Aumento de 0.1 m/s por ciclo de baixa latência (Maestria Técnica)
    if (SYSTEM_STATE.telemetry.latency < 5) {
        SYSTEM_STATE.telemetry.mielina = Math.min(150, SYSTEM_STATE.telemetry.mielina + 0.1);
    } else {
        // Redução drástica por interrupção (Dissipação de Sinal)
        SYSTEM_STATE.telemetry.mielina = Math.max(0.5, SYSTEM_STATE.telemetry.mielina - 0.5);
    }
    
    const mielinaEl = document.getElementById('mielina-value');
    if (mielinaEl) {
        mielinaEl.innerText = `${SYSTEM_STATE.telemetry.mielina.toFixed(1)} m/s`;
    }

    // TRIGGER: MODO DE SEGURANÇA (Baixa Mielina = Risco de Burnout/Erro)
    if (SYSTEM_STATE.telemetry.mielina < 10) {
        document.body.classList.add('safety-mode');
        if (typeof _hudFlash === 'function') {
            _hudFlash('hud-status', 'MODO DE SEGURANÇA ATIVO: SINAL FRACO', '#FF0000', 2000);
        }
    } else {
        document.body.classList.remove('safety-mode');
    }
}

/**
 * GESTÃO DE BATERIA DO CPF (Córtex Pré-Frontal)
 * Simula o consumo de glicose por microdecisões.
 */
function updateBioStatus() {
    // Redução passiva baseada na carga de trabalho e latência acumulada
    if (SYSTEM_STATE.telemetry.latency > 10) {
        SYSTEM_STATE.ops.battery = Math.max(0, SYSTEM_STATE.ops.battery - 0.05);
    }

    const batteryEl = document.getElementById('battery-value');
    if (batteryEl) {
        batteryEl.innerText = `${Math.floor(SYSTEM_STATE.ops.battery)}%`;
        
        // Alerta Crítico: Redistribuição de Carga
        if (SYSTEM_STATE.ops.battery < 20 && Math.floor(SYSTEM_STATE.ops.battery) % 5 === 0) {
            if (typeof VoiceCore !== 'undefined') {
                VoiceCore.speak("Bateria do C P F em nível crítico. Execute o Patch REDISTRIB-01 ou realize um Dump de Memória.");
            }
        }
    }
}

/**
 * PROTOCOLO SHADOW (Soberania de Foco)
 */
function toggleShadowMode() {
    SYSTEM_STATE.ui.isShadow = !SYSTEM_STATE.ui.isShadow;
    const scene = document.querySelector('a-scene');
    if (scene) {
        if (SYSTEM_STATE.ui.isShadow) {
            scene.setAttribute('background', 'color: #000');
            console.log("[PROTOCOLO] Shadow Mode: ON - Focus Clipping Ativado.");
        } else {
            scene.setAttribute('background', 'color: #00050a');
        }
    }
}

// Inicialização dos Loops de Biofeedback
setInterval(updateMielinaProgress, 1000);
setInterval(updateBioStatus, 5000);
setTimeout(checkLatency, 2000);