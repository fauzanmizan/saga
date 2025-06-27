// js/miniGames/inspireGame.js

// == NEW FILE: InspireGame ==
// == TANGGAL: 2025-06-27, [19:00] WITA ==
// == PERIHAL: Ekstraksi Logika Mini-game Menginspirasi (Inspire) ==
// - Berisi logika spesifik untuk mini-game "Menginspirasi".
// - Diimpor dan dipanggil oleh wandererPageRenderer.js.
// ===========================================

import { UIManager } from '../uiManager.js';
import { getCurrentUser, setCurrentUser } from '../authService.js';
import { updateDocument } from '../firebaseService.js';
import { WorldManager } from '../worldManager.js';
import { addToWandererChronicle } from '../chronicleManager.js';
// Tambahkan import SKILL_TREE_DATA jika skill Inspire dihitung di sini
import { SKILL_TREE_DATA } from '../data/core.js'; // Asumsi SKILL_TREE_DATA ada di core.js

let dbInstanceRef;
let saveDBInstanceRef;
let UIManagerRef;
let WorldManagerRef;
let WandererPageRendererRef; // Reference to the renderer if needed to trigger re-renders

export const InspireGame = {
    setDependencies(db, saveDB, uiM, worldM, renderer) {
        dbInstanceRef = db;
        saveDBInstanceRef = saveDB;
        UIManagerRef = uiM;
        WorldManagerRef = worldM;
        WandererPageRendererRef = renderer;
    },

    /**
     * Memulai mini-game "Menginspirasi" (Inspire).
     * @param {object} targetNpc - NPC yang akan diinspirasi.
     */
    async triggerInspireMiniGame(targetNpc) {
        if (!targetNpc) {
            UIManagerRef.showNotification("Tidak ada NPC untuk diinspirasi.", 'error', 'bg-red-500');
            return;
        }

        UIManagerRef.showLoading(`Menginspirasi ${targetNpc.name}...`);

        // Placeholder for actual Inspire game logic (e.g., a dialogue choice game, persuasion check)
        console.log(`Starting Inspire mini-game with ${targetNpc.name}.`);

        // Simulate game outcome based on player's Social attribute
        const user = getCurrentUser();
        const userSocial = user.attributes.find(attr => attr.name === 'Social')?.value || 1;

        // Jika skill Inspire memiliki level requirement atau efek dari SKILL_TREE_DATA, bisa diakses di sini
        // const inspireSkillData = SKILL_TREE_DATA.Will-Shaper.active_inspire; // Contoh akses skill data
        // const baseCost = inspireSkillData.cost || 4; // Menggunakan biaya dari skill data jika ada

        const successChance = userSocial / 15; // Example calculation
        const success = Math.random() < successChance;

        setTimeout(async () => {
            UIManagerRef.hideLoading();
            if (success) {
                const xpGain = 20;
                const essenceGain = 3;
                const reputationIncrease = 10;

                user.xp += xpGain;
                user.essenceOfWill += essenceGain;

                if (!user.reputation) user.reputation = {};
                user.reputation[targetNpc.id] = (user.reputation[targetNpc.id] || 0) + reputationIncrease;

                setCurrentUser(user);
                await saveDBInstanceRef(true);

                UIManagerRef.showNotification(`Anda berhasil menginspirasi ${targetNpc.name}! Mendapatkan ${xpGain} XP, ${essenceGain} Esensi Niat, dan reputasi meningkat.`, 'zap', 'bg-purple-500');

                addToWandererChronicle({
                    title: `Menginspirasi ${targetNpc.name}`,
                    description: `Berhasil menginspirasi ${targetNpc.name} untuk mengejar tujuan mereka.`,
                    type: "inspire_success",
                    timestamp: new Date().toISOString(),
                    icon: "zap"
                });

            } else {
                UIManagerRef.showNotification(`Gagal menginspirasi ${targetNpc.name}. Kata-kata Anda tidak sampai.`, 'alert-circle', 'bg-orange-500');
                addToWandererChronicle({
                    title: `Gagal Menginspirasi ${targetNpc.name}`,
                    description: `Tidak berhasil menginspirasi ${targetNpc.name}.`,
                    type: "inspire_failure",
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