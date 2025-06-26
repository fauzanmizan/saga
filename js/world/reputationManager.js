// js/world/reputationManager.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-26, 8:28 PM WITA ==
// == PERIHAL: Refactoring WorldManager.js - Pemindahan ReputationManager ==
// - Mengelola perubahan reputasi NPC (recordReputationChange).
// - Menangani pemudaran pasif dan getter untuk level reputasi.
// ===========================================

import { REPUTATION_CHANGE_MAGNITUDE, NPC_REPUTATION_LEVELS } from '../gameData.js'; // Adjust path if gameData.js is refactored to data/
import { UIManager } from '../uiManager.js'; // For notifications
import { gameTime } from '../utils.js'; // For timestamp
import { getCurrentUser } from '../authService.js'; // To get current player
// import { journalManager } from '../journalManager.js'; // Assuming journalManager is a separate module

let dbInstance;
let saveDBInstanceRef;

export const reputationManager = {
    /**
     * Mengatur dependensi untuk modul reputationManager.
     * @param {object} db - Instans database utama.
     * @param {function} saveDB - Referensi ke fungsi App.saveDB.
     */
    setDependencies(db, saveDB) {
        dbInstance = db;
        saveDBInstanceRef = saveDB;
    },

    /**
     * Mendapatkan level sikap NPC berdasarkan skor reputasi.
     * @param {number} reputationScore - Skor reputasi NPC.
     * @returns {string} Level sikap (misal: 'hostile', 'neutral', 'friendly').
     */
    getNpcAttitudeLevel(reputationScore) {
        // [Pindahkan seluruh isi fungsi getNpcAttitudeLevel dari worldOrchestrator.js ke sini]
        // The original getNpcAttitudeLevel in worldOrchestrator.js used `npc` and `wanderer` objects.
        // It's more appropriate for a `reputationManager` to take just the score, and possibly definitions.
        // Reconstructing based on the prompt's example:
        const sortedLevels = [...NPC_REPUTATION_LEVELS].sort((a, b) => b.threshold - a.threshold);
        for (const level of sortedLevels) {
            if (reputationScore >= level.threshold) {
                return level.name.toLowerCase().replace(/\s/g, '_'); // Return simplified string
            }
        }
        return 'neutral'; // Fallback
    },

    /**
     * Mencatat perubahan reputasi untuk NPC target.
     * @param {string} npcId - ID NPC yang reputasinya akan diubah.
     * @param {number} delta - Jumlah perubahan reputasi (positif atau negatif).
     * @param {string} actionType - Tipe aksi yang menyebabkan perubahan (opsional, untuk logging/debugging).
     * @param {function} getNpcName - Callback to get NPC name for notifications.
     */
    async recordReputationChange(npcId, delta, actionType = 'dialogue', getNpcName) {
        const currentUser = getCurrentUser(); // Get the current active user
        if (!currentUser || currentUser.role !== 'wanderer') {
            console.warn("recordReputationChange called without an active Wanderer user.");
            return;
        }

        const wanderer = dbInstance.wanderers[currentUser.name]; // Get the full Wanderer object from dbInstance
        if (!wanderer) {
            console.error(`Wanderer ${currentUser.name} not found in dbInstance.wanderers.`);
            return;
        }

        if (!wanderer.reputation) {
            wanderer.reputation = {};
        }
        if (!wanderer.reputation[npcId]) {
            wanderer.reputation[npcId] = 0;
        }

        const oldReputation = wanderer.reputation[npcId];
        let newReputation = oldReputation + delta;

        newReputation = Math.max(-100, Math.min(100, newReputation));

        // Create dummy objects for level checking to avoid circular dependency if getNpcAttitudeLevel requires full NPC
        const oldLevel = this.getNpcAttitudeLevel(oldReputation);
        const newLevel = this.getNpcAttitudeLevel(newReputation);

        wanderer.reputation[npcId] = newReputation;

        // Find the NPC in npc_souls and update its lastReputationChangeDate
        const npc = dbInstance.npc_souls[npcId];
        if (npc) {
            npc.lastReputationChangeDate = gameTime.getCurrentDate().toISOString();
        }

        console.log(`Reputation for ${getNpcName(npcId)} changed by ${delta}. New reputation: ${newReputation} (${newLevel}). Action: ${actionType}`);

        if (newLevel !== oldLevel) {
            UIManager.showNotification(`${getNpcName(npcId)} kini menganggap Anda ${newLevel.replace(/_/g, ' ')}!`, 'users', 'reputation');
        }
        // saveDBInstanceRef will be called by WorldOrchestrator's daily update
        // or by other features directly triggering this.
    },

    /**
     * Menangani pemudaran reputasi NPC secara pasif.
     * @param {string} npcId - ID NPC yang reputasinya akan dipudarkan.
     * @returns {boolean} True jika ada perubahan, false jika tidak.
     */
    dailyReputationDecay(npcId) {
        const npc = dbInstance.npc_souls[npcId];
        if (!npc || npc.reputation === undefined) return false;

        const now = gameTime.getCurrentDate();
        const lastChangeDate = npc.lastReputationChangeDate ? new Date(npc.lastReputationChangeDate) : new Date(0);
        const daysSinceLastChange = Math.floor((now - lastChangeDate) / (1000 * 60 * 60 * 24));

        let changesMade = false;

        // --- Reputation Fading (Passive) ---
        // This logic is for an NPC's own internal "reputation score" that passively fades.
        if (npc.reputation < 0) { // Only fade negative reputation
            let reputationGained = 0;
            let cooldownPeriod = 0;

            if (npc.reputation >= -25) {
                cooldownPeriod = 3;
            } else if (npc.reputation >= -50) {
                cooldownPeriod = 7;
            } else { // Hostile
                cooldownPeriod = 14;
                if (daysSinceLastChange >= cooldownPeriod && Math.random() < 0.05) {
                    reputationGained = 1;
                } else if (daysSinceLastChange < cooldownPeriod) {
                    reputationGained = 0;
                }
            }

            if (cooldownPeriod > 0 && daysSinceLastChange >= cooldownPeriod && reputationGained === 0) {
                 reputationGained = Math.floor(daysSinceLastChange / cooldownPeriod);
            }

            if (reputationGained > 0) {
                const oldRep = npc.reputation;
                npc.reputation = Math.min(0, npc.reputation + reputationGained);
                if (npc.reputation !== oldRep) {
                    npc.lastReputationChangeDate = now.toISOString();
                    changesMade = true;
                }
            }
        }
        return changesMade;
    }
};