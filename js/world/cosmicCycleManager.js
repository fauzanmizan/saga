// js/world/cosmicCycleManager.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-26, 8:28 PM WITA ==
// == PERIHAL: Refactoring WorldManager.js - Pemindahan CosmicCycleManager ==
// - Mengelola advanceCosmicCycle() dan getCurrentCosmicCycleEffects().
// - Menangani efek gameplay dari siklus kosmik.
// ===========================================

import { COSMIC_CYCLES, CHRONICLE_EVENTS } from '../gameData.js'; // Adjust path if gameData.js is refactored to data/
import { UIManager } from '../uiManager.js';
import { gameTime } from '../utils.js'; // Assuming gameTime is in utils.js
import { getCurrentUser } from '../authService.js'; // For current user context
import { addToWandererChronicle } from '../chronicleManager.js'; // For chronicle entries

let dbInstance;
let saveDBInstanceRef;

export const cosmicCycleManager = {
    /**
     * Mengatur dependensi untuk modul cosmicCycleManager.
     * @param {object} db - Instans database utama.
     * @param {function} saveDB - Referensi ke fungsi App.saveDB.
     */
    setDependencies(db, saveDB) {
        dbInstance = db;
        saveDBInstanceRef = saveDB;
    },

    /**
     * Mendapatkan efek dari siklus kosmik saat ini.
     * @returns {object} Objek efek dari siklus saat ini.
     */
    getCurrentCosmicCycleEffects() {
        // [Pindahkan seluruh isi fungsi getCurrentCosmicCycleEffects dari worldOrchestrator.js ke sini]
        if (!dbInstance.world.cosmicCycle) return {};
        return COSMIC_CYCLES[dbInstance.world.cosmicCycle.currentCycleId]?.effects || {};
    },

    /**
     * Memajukan siklus kosmik ke fase berikutnya.
     * @param {function} applyWorldAtmosphereCallback - Callback to update world atmosphere.
     * @returns {boolean} True if cosmic cycle changed, false otherwise.
     */
    advanceCosmicCycle(applyWorldAtmosphereCallback) {
        let changesMade = false;
        if (!dbInstance.world.cosmicCycle) {
            dbInstance.world.cosmicCycle = {
                currentCycleId: COSMIC_CYCLES.ECHOING_SLUMBER.id,
                daysInCycle: 0
            };
            console.log(`[${gameTime.getCurrentDate().toLocaleDateString()}] Cosmic cycle initialized to ${COSMIC_CYCLES.ECHOING_SLUMBER.name}.`);
            changesMade = true;
        }

        let currentCycle = COSMIC_CYCLES[dbInstance.world.cosmicCycle.currentCycleId];
        dbInstance.world.cosmicCycle.daysInCycle++;

        if (dbInstance.world.cosmicCycle.daysInCycle >= currentCycle.durationDays) {
            const cycleKeys = Object.keys(COSMIC_CYCLES);
            const currentIndex = cycleKeys.indexOf(currentCycle.id);
            const nextCycleKey = cycleKeys[(currentIndex + 1) % cycleKeys.length];
            const nextCycle = COSMIC_CYCLES[nextCycleKey];

            dbInstance.world.cosmicCycle.currentCycleId = nextCycle.id;
            dbInstance.world.cosmicCycle.daysInCycle = 0;

            UIManager.showNotification(`Dunia memasuki ${nextCycle.name}!`, nextCycle.eventIcon || (nextCycle.effects.worldVisualTheme === 'bright' ? 'sparkles' : 'moon'), 'world_event', 6000);
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.role === 'wanderer') {
                addToWandererChronicle(dbInstance.wanderers[currentUser.name], { // Pass wanderer instance
                    type: 'world_event',
                    title: 'Pergeseran Siklus Kosmik',
                    description: `Dunia telah memasuki fase ${nextCycle.name}. Udara terasa berbeda...`,
                    timestamp: gameTime.getCurrentDate().toISOString(),
                    icon: nextCycle.eventIcon || (nextCycle.effects.worldVisualTheme === 'bright' ? 'sparkles' : 'moon')
                });
            }
            console.log(`[${gameTime.getCurrentDate().toLocaleDateString()}] Cosmic cycle transitioned to ${nextCycle.name}.`);
            if (applyWorldAtmosphereCallback) {
                applyWorldAtmosphereCallback(); // Update UI immediately
            }
            changesMade = true;
        }
        return changesMade;
    },
};