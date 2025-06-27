// js/miniGames/commissionGame.js

// == NEW FILE: CommissionGame ==
// == TANGGAL: 2025-06-27, [19:00] WITA ==
// == PERIHAL: Ekstraksi Logika Mini-game Memesan (Commission) ==
// - Berisi logika spesifik untuk mini-game "Memesan".
// - Diimpor dan dipanggil oleh wandererPageRenderer.js.
// ===========================================

import { UIManager } from '../uiManager.js';
import { getCurrentUser, setCurrentUser } from '../authService.js';
import { updateDocument } from '../firebaseService.js';
import { WorldManager } from '../worldManager.js';
import { addToWandererChronicle } from '../chronicleManager.js';
// PERBAIKI JALUR IMPOR INI:
import { TRADABLE_ITEMS_DATA } from '../data/items.js'; // Mengubah dari ../data/core.js menjadi ../data/items.js

let dbInstanceRef;
let saveDBInstanceRef;
let UIManagerRef;
let WorldManagerRef;
let WandererPageRendererRef; // Reference to the renderer if needed to trigger re-renders

export const CommissionGame = {
    setDependencies(db, saveDB, uiM, worldM, renderer) {
        dbInstanceRef = db;
        saveDBInstanceRef = saveDB;
        UIManagerRef = uiM;
        WorldManagerRef = worldM;
        WandererPageRendererRef = renderer;
    },

    /**
     * Memulai mini-game "Memesan" (Commission).
     * Ini adalah placeholder; implementasi penuh akan melibatkan UI game.
     * @param {object} targetNpc - NPC yang akan dikomisi (opsional, tergantung desain game).
     */
    async triggerCommissionMiniGame(targetNpc) {
        UIManagerRef.showLoading('Mempersiapkan Mini-game Memesan...');

        // Placeholder for actual game logic
        console.log(`Memulai mini-game Memesan dengan ${targetNpc ? targetNpc.name : 'tanpa target NPC'}!`);

        // Simulate game outcome
        const success = Math.random() > 0.3; // 70% success rate for demonstration

        setTimeout(async () => {
            UIManagerRef.hideLoading();
            if (success) {
                const user = getCurrentUser();
                const xpGain = 20;
                const essenceGain = 2;
                user.xp += xpGain;
                user.essenceOfWill += essenceGain;

                // Add a random item as reward (example: simple material)
                const itemId = 'basic_material'; // Assuming this ID exists in TRADABLE_ITEMS_DATA
                const itemQuantity = 1;
                const itemDefinition = TRADABLE_ITEMS_DATA[itemId]; //

                if (itemDefinition) {
                    const existingItem = user.inventory.find(item => item.id === itemId);
                    if (existingItem) {
                        existingItem.quantity += itemQuantity;
                    } else {
                        user.inventory.push({ id: itemId, quantity: itemQuantity });
                    }
                }

                setCurrentUser(user);
                await saveDBInstanceRef(true);

                const message = `Anda berhasil memesan sesuatu! Mendapatkan ${xpGain} XP, ${essenceGain} Esensi Niat, dan ${itemQuantity}x ${itemDefinition?.name || itemId}.`;
                UIManagerRef.showNotification(message, 'check-circle', 'bg-green-500');

                // Update NPC reputation
                if (targetNpc) {
                    const reputationIncrease = 5;
                    if (!user.reputation) user.reputation = {};
                    user.reputation[targetNpc.id] = (user.reputation[targetNpc.id] || 0) + reputationIncrease;
                    setCurrentUser(user);
                    await saveDBInstanceRef(true);
                    UIManagerRef.showNotification(`Reputasi dengan ${targetNpc.name} meningkat!`, 'star', 'bg-yellow-500');
                }

                // Add chronicle entry
                addToWandererChronicle({
                    title: "Pemesanan Selesai",
                    description: `Berhasil memesan item/jasa. Mendapatkan hadiah.`,
                    type: "commission_success",
                    timestamp: new Date().toISOString(),
                    icon: "hammer"
                });

            } else {
                UIManagerRef.showNotification("Pemesanan gagal atau tidak berhasil memenuhi ekspektasi.", 'alert-triangle', 'bg-red-500');
                addToWandererChronicle({
                    title: "Pemesanan Gagal",
                    description: `Pemesanan item/jasa tidak berhasil.`,
                    type: "commission_failure",
                    timestamp: new Date().toISOString(),
                    icon: "tool"
                });
            }
            if (WandererPageRendererRef && WandererPageRendererRef.renderPlayerStatus) {
                WandererPageRendererRef.renderPlayerStatus(); // Re-render player status after changes
                WandererPageRendererRef.renderInventoryPage(); // Re-render inventory
            }
        }, 2000); // Simulate network delay or game duration
    }
};