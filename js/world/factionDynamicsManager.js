// js/world/factionDynamicsManager.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-26, 8:28 PM WITA ==
// == PERIHAL: Refactoring WorldManager.js - Pemindahan FactionDynamicsManager ==
// - Mengelola perhitungan pengaruh faksi dan faksi dominan.
// - Menangani pemicuan event perang regional (jika ada logic yang sudah ada).
// ===========================================

import { FACTION_TYPES, FACTIONS_DATA, REGIONS_DATA } from '../gameData.js'; // Adjust path if gameData.js is refactored to data/
import { UIManager } from '../uiManager.js';
import { gameTime } from '../utils.js'; // For timestamp
import { addToWandererChronicle } from '../chronicleManager.js'; // For chronicle entries
// import { triggerGlobalWorldEvent } from './worldOrchestrator.js'; // This would be a circular dependency, so worldOrchestrator passes it

let dbInstance;
let saveDBInstanceRef;

export const factionDynamicsManager = {
    /**
     * Mengatur dependensi untuk modul factionDynamicsManager.
     * @param {object} db - Instans database utama.
     * @param {function} saveDB - Referensi ke fungsi App.saveDB.
     */
    setDependencies(db, saveDB) {
        dbInstance = db;
        saveDBInstanceRef = saveDB;
    },

    /**
     * Mendapatkan nama faksi berdasarkan ID faksi.
     * @param {string} factionId - ID faksi.
     * @returns {string} Nama faksi.
     */
    getFactionName(factionId) {
        // [Pindahkan seluruh isi fungsi getFactionName dari worldOrchestrator.js ke sini]
        const faction = dbInstance.world.factions[factionId];
        return faction ? faction.name : 'Unknown Faction';
    },

    /**
     * Menghitung dan menetapkan faksi dominan untuk setiap wilayah.
     * Juga memicu event perang regional jika kondisi terpenuhi.
     * @param {function} triggerGlobalWorldEventCallback - Callback to trigger global events.
     * @param {function} getCurrentUser - Callback to get current user.
     */
    async updateFactionDynamics(triggerGlobalWorldEventCallback, getCurrentUser) {
        let changesMade = false;

        // Reset faction influence for all regions at the start of simulation
        for (const factionId in dbInstance.world.factions) {
            for (const regionId in dbInstance.world.regions) {
                dbInstance.world.factions[factionId].influence[regionId] = 0;
            }
        }

        // --- Faction Influence Contribution (moved from simulateNpcProgress) ---
        for (const npcId in dbInstance.npc_souls) {
            const npc = dbInstance.npc_souls[npcId];
            if (npc.factionAffiliation && npc.currentRegion && dbInstance.world.factions[npc.factionAffiliation]) {
                dbInstance.world.factions[npc.factionAffiliation].influence[npc.currentRegion] =
                    (dbInstance.world.factions[npc.factionAffiliation].influence[npc.currentRegion] || 0) + (npc.influenceScore || 1);
                changesMade = true;
            }
        }

        // Determine Dominant Factions per region and trigger narrative events
        for (const regionId in dbInstance.world.regions) {
            const region = dbInstance.world.regions[regionId];
            let maxInfluence = 0;
            let dominantFactionId = 'Neutral';

            for (const factionId in dbInstance.world.factions) {
                const influence = (dbInstance.world.factions[factionId].influence[regionId] || 0);
                if (influence > maxInfluence) {
                    maxInfluence = influence;
                    dominantFactionId = factionId;
                }
            }
            if (region.dominantFaction !== dominantFactionId) {
                region.dominantFaction = dominantFactionId;
                changesMade = true;
            }


            if (region.status === 'MAELSTROM' && Math.random() < 0.05) {
                const factionsInRegion = Object.keys(dbInstance.world.factions).filter(fid => dbInstance.world.factions[fid].influence[regionId] > 0);
                if (factionsInRegion.length >= 2) {
                    const faction1 = factionsInRegion[Math.floor(Math.random() * factionsInRegion.length)];
                    let faction2 = faction1;
                    while (faction2 === faction1) {
                        faction2 = factionsInRegion[Math.floor(Math.random() * factionsInRegion.length)];
                    }

                    if (FACTIONS_DATA[faction1]?.relationships[faction2] === 'rivalry' ||
                        FACTIONS_DATA[faction2]?.relationships[faction1] === 'rivalry') {
                        const warAlreadyActive = dbInstance.world.globalEvents.some(event =>
                            event.id.startsWith('FACTION_WAR') &&
                            event.options.targetRegionId === regionId &&
                            ((event.options.targetFactionIds[0] === faction1 && event.options.targetFactionIds[1] === faction2) ||
                             (event.options.targetFactionIds[0] === faction2 && event.options.targetFactionIds[1] === faction1))
                        );

                        if (!warAlreadyActive) {
                            console.log(`War Event triggered in ${region.name} between ${faction1} and ${faction2}!`);
                            const winningFaction = Math.random() < 0.5 ? faction1 : faction2;
                            await this.triggerRegionalWar(regionId, winningFaction, faction1 === winningFaction ? faction2 : faction1, triggerGlobalWorldEventCallback, getCurrentUser);
                            changesMade = true;
                        }
                    }
                }
            }
        }
        return changesMade;
    },

    /**
     * Memicu event perang regional secara naratif.
     * @param {string} regionId - ID wilayah tempat perang terjadi.
     * @param {string} winningFactionId - ID faksi pemenang.
     * @param {string} losingFactionId - ID faksi yang kalah.
     * @param {function} triggerGlobalWorldEventCallback - Callback to trigger global events.
     * @param {function} getCurrentUser - Callback to get current user.
     * @returns {Promise<void>}
     */
    async triggerRegionalWar(regionId, winningFactionId, losingFactionId, triggerGlobalWorldEventCallback, getCurrentUser) {
        const region = dbInstance.world.regions[regionId];
        if (!region) {
            console.error(`Region ${regionId} not found for war event.`);
            return;
        }

        // Instead of recreating the event manually, call the global event trigger
        await triggerGlobalWorldEventCallback('FACTION_WAR', {
            targetRegionId: regionId,
            targetFactionIds: [winningFactionId, losingFactionId],
            winningFactionId: winningFactionId // Pass winning faction for specific consequences
        });

        const now = gameTime.getCurrentDate();
        let narrativeDescription = '';
        if (FACTIONS_DATA[winningFactionId]?.type === 'religious' && FACTIONS_DATA[winningFactionId]?.name.includes('Luminous')) {
            narrativeDescription = `Para pejuang ${this.getFactionName(winningFactionId)} meraih kemenangan gemilang di ${region.name}, mengusir kegelapan Gema dan menegaskan dominasi Niat. Nexus wilayah itu bersinar terang.`;
        } else if (FACTIONS_DATA[winningFactionId]?.type === 'religious' && FACTIONS_DATA[winningFactionId]?.name.includes('Echo')) {
            narrativeDescription = `Faksi ${this.getFactionName(winningFactionId)} menguasai ${region.name} dalam pertempuran brutal, menyebarkan bayangan Gema dan menenggelamkan harapan. Nexus wilayah itu merana dalam kegelapan.`;
        } else {
            narrativeDescription = `Sebuah pergolakan faksi mengguncang ${region.name}. ${this.getFactionName(winningFactionId)} berhasil menegaskan kendali.`;
        }

        // Apply direct region alignment changes based on war outcome, which were previously in worldOrchestrator
        // This logic is now handled by _applyEventConsequences when FACTION_WAR event is triggered
        // But for narrative cohesion and immediate effect, if it's not handled there, it could be here.
        // For now, I assume _applyEventConsequences handles it fully.

        region.dominantFaction = winningFactionId;

        for (const wandererId in dbInstance.wanderers) {
            const wanderer = dbInstance.wanderers[wandererId];
            addToWandererChronicle(wanderer, {
                type: 'faction_relationship_change',
                title: `Perang Wilayah di ${region.name}`,
                description: narrativeDescription,
                timestamp: now.toISOString(),
                icon: 'swords'
            });
        }

        UIManager.showNotification(`PERINGATAN: Perang Faksi di ${region.name}! Pemenang: ${this.getFactionName(winningFactionId)}!`, 'zap', 'error');
        // Resonance update will be handled after global event application
    }
};