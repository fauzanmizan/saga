// js/miniGames/barterGame.js (MODIFIED)

// == NEW FILE: BarterGame ==
// == TANGGAL: 2025-06-27, 18:45 WITA ==
// == PERIHAL: Ekstraksi Logika Mini-game Bertukar (Barter) ==
// - Berisi logika spesifik untuk mini-game "Bertukar".
// - Diimpor dan dipanggil oleh wandererPageRenderer.js.
// ===========================================

import { UIManager } from '../uiManager.js';
import { getCurrentUser, setCurrentUser } from '../authService.js';
import { updateDocument } '../firebaseService.js';
import { WorldManager } from '../worldManager.js';
import { addToWandererChronicle } from '../chronicleManager.js';
// PERBAIKI JALUR IMPOR INI:
import { TRADABLE_ITEMS_DATA } from '../data/items.js'; // Mengubah dari ../data/core.js menjadi ../data/items.js

let dbInstanceRef;
let saveDBInstanceRef;
let UIManagerRef;
let WorldManagerRef;
let WandererPageRendererRef; // Reference to the renderer if needed to trigger re-renders

export const BarterGame = {
    setDependencies(db, saveDB, uiM, worldM, renderer) {
        dbInstanceRef = db;
        saveDBInstanceRef = saveDB;
        UIManagerRef = uiM;
        WorldManagerRef = worldM;
        WandererPageRendererRef = renderer;
    },

    /**
     * Memulai mini-game "Bertukar" (Barter).
     * Ini adalah placeholder; implementasi penuh akan melibatkan UI perdagangan.
     * @param {object} targetNpc - NPC yang akan diajak bertukar.
     */
    async triggerBarterMiniGame(targetNpc) {
        if (!targetNpc) {
            UIManagerRef.showNotification("Tidak ada NPC untuk diajak bertukar.", 'error', 'bg-red-500');
            return;
        }

        UIManagerRef.showLoading(`Memulai perdagangan dengan ${targetNpc.name}...`);

        console.log(`Starting Barter mini-game with ${targetNpc.name}.`);

        const user = getCurrentUser();
        const userSocial = user.attributes.find(attr => attr.name === 'Social')?.value || 1;
        const userWit = user.attributes.find(attr => attr.name === 'Wit')?.value || 1;

        const successChance = (userSocial + userWit) / 20;
        const success = Math.random() < successChance;

        setTimeout(async () => {
            UIManagerRef.hideLoading();
            if (success) {
                const xpGain = 18;
                const essenceGain = 2;
                const reputationIncrease = 8;

                user.xp += xpGain;
                user.essenceOfWill += essenceGain;

                const itemsToGive = ['rare_material', 'simple_tool'];
                const randomItemToGainId = itemsToGive[Math.floor(Math.random() * itemsToGive.length)];
                const itemQuantity = 1;
                const itemDefinition = TRADABLE_ITEMS_DATA[randomItemToGainId];

                if (itemDefinition) {
                    const existingItem = user.inventory.find(item => item.id === randomItemToGainId);
                    if (existingItem) {
                        existingItem.quantity += itemQuantity;
                    } else {
                        user.inventory.push({ id: randomItemToGainId, quantity: itemQuantity });
                    }
                }

                if (!user.reputation) user.reputation = {};
                user.reputation[targetNpc.id] = (user.reputation[targetNpc.id] || 0) + reputationIncrease;

                setCurrentUser(user);
                await saveDBInstanceRef(true);

                const message = `Anda berhasil bertukar dengan ${targetNpc.name}! Mendapatkan ${xpGain} XP, ${essenceGain} Esensi Niat, ${itemQuantity}x ${itemDefinition?.name || randomItemToGainId}, dan reputasi meningkat.`;
                UIManagerRef.showNotification(message, 'shuffle', 'bg-blue-500');

                addToWandererChronicle({
                    title: `Perdagangan Berhasil dengan ${targetNpc.name}`,
                    description: `Berhasil menyelesaikan transaksi dengan ${targetNpc.name}.`,
                    type: "barter_success",
                    timestamp: new Date().toISOString(),
                    icon: "shuffle"
                });

            } else {
                UIManagerRef.showNotification(`Perdagangan dengan ${targetNpc.name} gagal atau tidak memuaskan.`, 'alert-triangle', 'bg-orange-500');
                addToWandererChronicle({
                    title: `Perdagangan Gagal dengan ${targetNpc.name}`,
                    description: `Transaksi dengan ${targetNpc.name} tidak berhasil.`,
                    type: "barter_failure",
                    timestamp: new Date().toISOString(),
                    icon: "coins"
                });
            }
            if (WandererPageRendererRef && WandererPageRendererRef.renderPlayerStatus) {
                WandererPageRendererRef.renderPlayerStatus();
                WandererPageRendererRef.renderInventoryPage();
                WandererPageRendererRef.renderNpcList(user.currentRegion);
            }
        }, 2000);
    }
};