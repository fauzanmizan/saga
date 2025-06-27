// js/miniGames/empathizeGame.js

// == NEW FILE: EmpathizeGame ==
// == TANGGAL: 2025-06-27, [Current Time] WITA ==
// == PERIHAL: Ekstraksi Logika Mini-game Merasakan (Empathize) ==
// - Berisi logika spesifik untuk mini-game "Merasakan".
// - Diimpor dan dipanggil oleh wandererPageRenderer.js.
// ===========================================

import { UIManager } from '../uiManager.js';
import { getCurrentUser, setCurrentUser } from '../authService.js';
import { updateDocument } from '../firebaseService.js';
import { WorldManager } from '../worldManager.js';
import { addToWandererChronicle } from '../chronicleManager.js';
// Add any other specific imports needed for EmpathizeGame (e.g., specific data for emotional spectrum)

let dbInstanceRef;
let saveDBInstanceRef;
let UIManagerRef;
let WorldManagerRef;
let WandererPageRendererRef; // Reference to the renderer if needed to trigger re-renders

export const EmpathizeGame = {
    setDependencies(db, saveDB, uiM, worldM, renderer) {
        dbInstanceRef = db;
        saveDBInstanceRef = saveDB;
        UIManagerRef = uiM;
        WorldManagerRef = worldM;
        WandererPageRendererRef = renderer;
    },

    /**
     * Memulai mini-game "Merasakan" (Empathize).
     * @param {object} targetNpc - NPC yang jiwanya akan dirasakan.
     */
    async triggerEmpathizeMiniGame(targetNpc) {
        if (!targetNpc) {
            UIManagerRef.showNotification("Tidak ada NPC untuk dirasakan jiwanya.", 'error', 'bg-red-500');
            return;
        }

        UIManagerRef.showLoading(`Merasakan jiwa ${targetNpc.name}...`);

        // Placeholder for actual Empathize game UI/logic (e.g., a canvas game)
        console.log(`Starting Empathize mini-game with ${targetNpc.name}.`);

        // Simulate game outcome based on player's Focus and Social attributes
        const user = getCurrentUser();
        const userFocus = user.attributes.find(attr => attr.name === 'Focus')?.value || 1;
        const userSocial = user.attributes.find(attr => attr.name === 'Social')?.value || 1;

        const successChance = (userFocus + userSocial) / 20; // Example calculation
        const success = Math.random() < successChance;

        setTimeout(async () => {
            UIManagerRef.hideLoading();
            if (success) {
                const xpGain = 15;
                const essenceGain = 1;
                const reputationIncrease = 7;

                user.xp += xpGain;
                user.essenceOfWill += essenceGain;

                if (!user.reputation) user.reputation = {};
                user.reputation[targetNpc.id] = (user.reputation[targetNpc.id] || 0) + reputationIncrease;

                setCurrentUser(user);
                await saveDBInstanceRef(true);

                UIManagerRef.showNotification(`Anda berhasil merasakan jiwa ${targetNpc.name}! Mendapatkan ${xpGain} XP, ${essenceGain} Esensi Niat, dan reputasi meningkat.`, 'heart', 'bg-green-500');

                addToWandererChronicle({
                    title: `Empati dengan ${targetNpc.name}`,
                    description: `Berhasil merasakan spektrum emosi ${targetNpc.name} dan memahami pengalaman mereka.`,
                    type: "empathize_success",
                    timestamp: new Date().toISOString(),
                    icon: "heart"
                });

            } else {
                UIManagerRef.showNotification(`Gagal merasakan jiwa ${targetNpc.name}. Jiwanya terlalu rumit atau Anda kurang fokus.`, 'alert-circle', 'bg-orange-500');
                addToWandererChronicle({
                    title: `Gagal Empati dengan ${targetNpc.name}`,
                    description: `Tidak berhasil merasakan spektrum emosi ${targetNpc.name}.`,
                    type: "empathize_failure",
                    timestamp: new Date().toISOString(),
                    icon: "frown"
                });
            }
            if (WandererPageRendererRef && WandererPageRendererRef.renderPlayerStatus) {
                WandererPageRendererRef.renderPlayerStatus(); // Re-render player status after changes
                WandererPageRendererRef.renderNpcList(user.currentRegion); // Re-render NPC list to show reputation change
            }
        }, 2000); // Simulate game duration
    }
};