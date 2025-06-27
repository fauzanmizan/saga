// js/miniGames/challengeGame.js

// == NEW FILE: ChallengeGame ==
// == TANGGAL: 2025-06-27, [Current Time] WITA ==
// == PERIHAL: Ekstraksi Logika Mini-game Menantang (Challenge) ==
// - Berisi logika spesifik untuk mini-game "Menantang".
// - Diimpor dan dipanggil oleh wandererPageRenderer.js.
// ===========================================

import { UIManager } from '../uiManager.js';
import { getCurrentUser, setCurrentUser } from '../authService.js';
import { updateDocument } from '../firebaseService.js';
import { WorldManager } from '../worldManager.js';
import { addToWandererChronicle } from '../chronicleManager.js';

let dbInstanceRef;
let saveDBInstanceRef;
let UIManagerRef;
let WorldManagerRef;
let WandererPageRendererRef; // Reference to the renderer if needed to trigger re-renders

export const ChallengeGame = {
    setDependencies(db, saveDB, uiM, worldM, renderer) {
        dbInstanceRef = db;
        saveDBInstanceRef = saveDB;
        UIManagerRef = uiM;
        WorldManagerRef = worldM;
        WandererPageRendererRef = renderer;
    },

    /**
     * Memulai mini-game "Menantang" (Challenge).
     * Ini adalah placeholder; implementasi penuh akan melibatkan UI duel atau tes.
     * @param {object} targetNpc - NPC yang akan ditantang (opsional, tergantung desain game).
     */
    async triggerChallengeMiniGame(targetNpc) {
        if (!targetNpc) {
            UIManagerRef.showNotification("Tidak ada lawan untuk ditantang.", 'error', 'bg-red-500');
            return;
        }

        UIManagerRef.showLoading(`Menantang ${targetNpc.name} dalam Duel Niat...`);

        // Placeholder for actual game logic
        console.log(`Starting Challenge mini-game with ${targetNpc.name}.`);

        // Simulate game outcome based on player's Might and Resilience attributes
        const user = getCurrentUser();
        const userMight = user.attributes.find(attr => attr.name === 'Might')?.value || 1;
        const userResilience = user.attributes.find(attr => attr.name === 'Resilience')?.value || 1;

        const successChance = (userMight + userResilience) / 25; // Example calculation
        const success = Math.random() < successChance;

        setTimeout(async () => {
            UIManagerRef.hideLoading();
            if (success) {
                const xpGain = 25;
                const essenceGain = 5;
                const reputationIncrease = 15;

                user.xp += xpGain;
                user.essenceOfWill += essenceGain;

                if (!user.reputation) user.reputation = {};
                user.reputation[targetNpc.id] = (user.reputation[targetNpc.id] || 0) + reputationIncrease;

                setCurrentUser(user);
                await saveDBInstanceRef(true);

                UIManagerRef.showNotification(`Anda berhasil menantang dan mengalahkan ${targetNpc.name}! Mendapatkan ${xpGain} XP, ${essenceGain} Esensi Niat, dan reputasi meningkat tajam.`, 'sword', 'bg-red-700');

                addToWandererChronicle({
                    title: `Duel Niat dengan ${targetNpc.name}`,
                    description: `Berhasil menantang ${targetNpc.name} dan membuktikan niat Anda.`,
                    type: "challenge_success",
                    timestamp: new Date().toISOString(),
                    icon: "sword"
                });

            } else {
                UIManagerRef.showNotification(`Anda gagal mengalahkan ${targetNpc.name} dalam Duel Niat.`, 'shield-off', 'bg-gray-500');
                addToWandererChronicle({
                    title: `Gagal Duel Niat dengan ${targetNpc.name}`,
                    description: `Tidak berhasil menantang ${targetNpc.name}.`,
                    type: "challenge_failure",
                    timestamp: new Date().toISOString(),
                    icon: "flag"
                });
            }
            if (WandererPageRendererRef && WandererPageRendererRef.renderPlayerStatus) {
                WandererPageRendererRef.renderPlayerStatus(); // Re-render player status after changes
                WandererPageRendererRef.renderNpcList(user.currentRegion); // Re-render NPC list to show reputation change
            }
        }, 2000); // Simulate game duration
    }
};