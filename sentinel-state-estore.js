/* MÓDULO INDEPENDENTE: SENTINEL-STATE-Vault.js */
const StateVault = (() => {
    let _state = { /* ... */ };
    
    return {
        set: (path, value) => {
            // Aplica no L1 (Memória)
            _applySync(path, value); 
            
            // Redundância Crítica (L2)
            if(path.startsWith('ops') || path.startsWith('mission')) {
                localStorage.setItem(`SENTINEL_MIRROR_${path}`, JSON.stringify(value));
            }
            
            // Notifica o sistema sem que o Kernel precise intervir
            window.SentinelBus?.emit('state:changed', { path, value });
        },
        
        // Auto-Recuperação (Resiliência)
        recover: () => {
            // Busca no L2 se o L1 estiver vazio no boot
            console.log('[STATE] Iniciando protocolo de recuperação de redundância...');
        }
    };
})();