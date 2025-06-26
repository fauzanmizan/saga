// js/world/worldOrchestrator.js
// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-26, 09:02 PM WITA ==
// == PERIHAL: Refactoring WorldManager.js - Integrasi Modul Manajer Baru ==
// - Mengintegrasikan npcLifecycleManager, reputationManager, factionDynamicsManager, cosmicCycleManager.
// - Memindahkan logika terkait dari dailyWorldUpdate ke modul-modul spesifik.
// - Memastikan dependency injection yang tepat ke modul-modul manajer.
// ===========================================

// Import dependensi global
import { UIManager } from '../uiManager.js';
import { gameTime } from '../utils.js'; // Assuming gameTime is in utils.js
import { getCurrentUser } from '../authService.js'; // To access current user from dbInstance.wanderers
import { updateDocument, getDocument, setDocument } from '../firebaseService.js'; // Using firebaseService for now
import {
    NPC_HEALTH_STATES, GLOBAL_WORLD_EVENTS,
    REGIONS_DATA, CREATURES_DATA, JOURNAL_ENTRY_TEMPLATES, // Data still used directly by orchestrator
} from '../gameData.js'; // All gameData from existing file

// Import modul state manager (dari bagian 1)
import { coreStateManager } from './coreStateManager.js';

// Import modul-modul manajer baru
import { npcLifecycleManager } from './npcLifecycleManager.js';
import { reputationManager } from './reputationManager.js';
import { factionDynamicsManager } from './factionDynamicsManager.js';
import { cosmicCycleManager } from './cosmicCycleManager.js';

let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstanceRef;

export const worldOrchestrator = {
    /**
     * Mengatur dependensi untuk modul worldOrchestrator.
     * @param {object} db - Instans database utama.
     * @param {string} docId - ID dokumen database utama.
     * @param {function} saveDB - Referensi ke fungsi App.saveDB.
     */
    setDependencies(db, docId, saveDB) {
        dbInstance = db;
        DB_DOC_ID_Instance = docId;
        saveDBInstanceRef = saveDB; // Correctly passing saveDB from App

        // Inisialisasi modul manajer, passing necessary dependencies
        coreStateManager.setDependencies(db, docId);
        npcLifecycleManager.setDependencies(db, saveDB);
        reputationManager.setDependencies(db, saveDB);
        factionDynamicsManager.setDependencies(db, saveDB);
        cosmicCycleManager.setDependencies(db, saveDB);

        // Initial setup for world data from gameData.js if not already populated
        coreStateManager._initializeMissingWorldProperties();
        console.log("WorldOrchestrator dependencies set, and coreStateManager initialized.");
    },

    /**
     * Mendapatkan nama NPC berdasarkan ID.
     * @param {string} npcId - ID NPC.
     * @returns {string} Nama NPC atau 'Unknown NPC'.
     */
    getNpcName(npcId) {
        const npc = dbInstance.npc_souls[npcId];
        return npc ? npc.name : 'Unknown NPC';
    },

    /**
     * Mengembalikan nama NPC yang baru saja dikorup di wilayah tertentu (mock).
     * @param {string} regionId - ID wilayah.
     * @returns {string} Nama NPC yang korup baru-baru ini.
     */
    getRecentCorruptedNpcName(regionId) {
        const corruptedNpcs = Object.values(dbInstance.npc_souls || {}).filter(npc => npc.currentRegion === regionId && npc.healthState === NPC_HEALTH_STATES.CORRUPTED.id);
        if (corruptedNpcs.length > 0) {
            return corruptedNpcs[Math.floor(Math.random() * corruptedNpcs.length)].name;
        }
        return 'seseorang';
    },

    /**
     * Mengembalikan nama masalah yang sedang dihadapi wilayah (mock).
     * @param {string} regionId - ID wilayah.
     * @returns {object | null} Objek masalah { id: string, description: string }.
     */
    getRegionProblem(regionId) {
        const problems = [
            { id: 'wolf_infestation', description: 'serigala di hutan' },
            { id: 'food_shortage', description: 'kekurangan makanan' },
            { id: 'echo_spikes', description: 'lonjakan Gema' }
        ];
        if (Math.random() < 0.5) return problems[Math.floor(Math.random() * problems.length)];
        return null;
    },

    /**
     * Mengembalikan nama NPC acak dengan trait tertentu di wilayah (mock).
     * @param {string} traitId - ID trait.
     * @param {string} regionId - ID wilayah.
     * @returns {string} Nama NPC.
     */
    getNpcNameWithRandomTrait(traitId, regionId) {
        const potentialNpcs = Object.values(dbInstance.npc_souls || {}).filter(npc => npc.currentRegion === regionId && npc.personalityTraits.includes(traitId));
        if (potentialNpcs.length > 0) {
            return potentialNpcs[Math.floor(Math.random() * potentialNpcs.length)].name;
        }
        return 'NPC pemalas';
    },

    /**
     * Menghasilkan ID quest baru berdasarkan masalah wilayah (mock).
     * @param {string} regionId - ID wilayah.
     * @param {string} problemType - Tipe masalah.
     * @returns {string} ID quest yang tergenerasi.
     */
    generateQuestForProblem(regionId, problemType) {
        return `quest_generated_${problemType}_${Date.now()}`;
    },

    /**
     * Memperbarui resonansi dunia dan Nexus regional.
     */
    async updateWorldResonance() {
        const allSouls = [
            getCurrentUser(),
            ...Object.values(dbInstance.npc_souls || {})
        ].filter(s => s !== null);

        let globalResonanceStatus = 'Balanced Resonance';

        if (allSouls.length === 0) {
            dbInstance.world.currentResonanceStatus = 'Balanced Resonance';
        } else {
            const totalIntention = allSouls.reduce((sum, s) => sum + (s.alignment?.intention || 0), 0);
            const totalEcho = allSouls.reduce((sum, s) => sum + (s.alignment?.echo || 0), 0);
            const combinedTotal = totalIntention + totalEcho;

            if (combinedTotal > 0) {
                const averageIntentionRatio = totalIntention / combinedTotal;

                if (averageIntentionRatio >= 0.7) {
                    globalResonanceStatus = 'Harmonious Resonance';
                } else if (averageIntentionRatio <= 0.3) {
                    globalResonanceStatus = 'Discordant Resonance';
                } else {
                    globalResonanceStatus = 'Balanced Resonance';
                }
            } else {
                globalResonanceStatus = 'Balanced Resonance';
            }
        }

        if (dbInstance.world.currentResonanceStatus !== globalResonanceStatus) {
            dbInstance.world.currentResonanceStatus = globalResonanceStatus;
            console.log(`World Global Resonance Updated to: ${dbInstance.world.currentResonanceStatus}`);
            this.applyWorldAtmosphere();
        } else {
            this.applyWorldAtmosphere();
        }

        for (const regionId in dbInstance.world.regions) {
            const region = dbInstance.world.regions[regionId];

            let localIntentionInfluence = 0;
            let localEchoInfluence = 0;

            allSouls.filter(s => s.currentRegion === regionId).forEach(s => {
                localIntentionInfluence += (s.alignment?.intention || 0) * 0.1;
                localEchoInfluence += (s.alignment?.echo || 0) * 0.1;
            });

            if (region.currentIntention === undefined) region.currentIntention = 500;
            if (region.currentEcho === undefined) region.currentEcho = 500;

            if (globalResonanceStatus === 'Harmonious Resonance') {
                region.currentIntention = Math.min(1000, region.currentIntention + 20 + localIntentionInfluence);
                region.currentEcho = Math.max(0, region.currentEcho - 10 + localEchoInfluence);
            } else if (globalResonanceStatus === 'Discordant Resonance') {
                region.currentIntention = Math.max(0, region.currentIntention - 20 + localIntentionInfluence);
                region.currentEcho = Math.min(1000, region.currentEcho + 20 + localEchoInfluence);
            } else {
                if (region.currentIntention > 500) {
                    region.currentIntention = Math.max(500, region.currentIntention - 10);
                } else if (region.currentIntention < 500) {
                    region.currentIntention = Math.min(500, region.currentIntention + 10);
                }
                if (region.currentEcho > 500) {
                    region.currentEcho = Math.max(500, region.currentEcho - 10);
                } else if (region.currentEcho < 500) {
                    region.currentEcho = Math.min(500, region.currentEcho + 10);
                }
                region.currentIntention += localIntentionInfluence;
                region.currentEcho += localEchoInfluence;
            }

            region.currentIntention = Math.max(0, Math.min(1000, region.currentIntention));
            region.currentEcho = Math.max(0, Math.min(1000, region.currentEcho));

            if (region.currentIntention > region.currentEcho * 1.5) {
                region.status = 'SANCTUM';
            } else if (region.currentEcho > region.currentIntention * 1.5) {
                region.status = 'MAELSTROM';
            } else {
                region.status = 'NORMAL';
            }
        }
        this.renderRegionsStatus();
    },

    // Fungsi untuk menerapkan atmosfer dunia (perubahan visual)
    applyWorldAtmosphere() {
        const body = document.body;
        body.classList.remove('theme-dark', 'theme-bright', 'theme-unstable', 'theme-normal');
        body.classList.remove('world-harmonious', 'world-discordant', 'world-balanced');

        const currentCosmicTheme = cosmicCycleManager.getCurrentCosmicCycleEffects().worldVisualTheme || 'normal';
        if (currentCosmicTheme === 'dark') body.classList.add('theme-dark');
        else if (currentCosmicTheme === 'bright') body.classList.add('theme-bright');
        else if (currentCosmicTheme === 'unstable') body.classList.add('theme-unstable');
        else body.classList.add('theme-normal');

        const resonanceStatus = dbInstance.world.currentResonanceStatus;
        if (resonanceStatus === 'Harmonious Resonance') {
            body.classList.add('world-harmonious');
        } else if (resonanceStatus === 'Discordant Resonance') {
            body.classList.add('world-discordant');
        } else {
            body.classList.add('world-balanced');
        }
        this.updateResonanceDisplay();
        this.updateLoginCanvasAtmosphere(resonanceStatus);
    },

    // Update Login Canvas Background berdasarkan World Resonance
    updateLoginCanvasAtmosphere(resonanceStatus) {
        const backgroundCanvas = document.getElementById('background-canvas');
        if (backgroundCanvas && window.particles) {
            let colorBase = [129, 140, 248];
            let velocityFactor = 0.5;

            if (resonanceStatus === 'Harmonious Resonance') {
                colorBase = [129, 140, 248];
                velocityFactor = 0.5;
            } else if (resonanceStatus === 'Discordant Resonance') {
                colorBase = [248, 113, 113];
                velocityFactor = 1.5;
            } else {
                colorBase = [148, 163, 184];
                velocityFactor = 0.8;
            }

            window.particles.forEach(p => {
                p.color = `rgba(${colorBase[0]}, ${colorBase[1]}, ${colorBase[2]}, ${Math.random() * 0.5 + 0.1})`;
                p.velocity.x = (Math.random() - 0.5) * velocityFactor;
                p.velocity.y = (Math.random() - 0.5) * velocityFactor;
            });
        }
    },

    // Fungsi untuk memperbarui tampilan resonansi dunia di UI Wanderer
    updateResonanceDisplay() {
        const resonanceTextElement = document.getElementById('resonance-status-text');
        const resonanceIconElement = document.querySelector('#world-resonance-display i');

        const sanctuaryWorldResonanceText = document.getElementById('sanctuary-world-resonance-text');

        const statusText = dbInstance.world.currentResonanceStatus;
        let colorClass = 'text-slate-400';
        let iconName = 'globe';

        if (statusText === 'Harmonious Resonance') {
            colorClass = 'text-emerald-400';
            iconName = 'sun';
        } else if (statusText === 'Discordant Resonance') {
            colorClass = 'text-red-400';
            iconName = 'alert-triangle';
        }

        if (resonanceTextElement) {
            resonanceTextElement.textContent = statusText;
            resonanceTextElement.classList.remove('text-emerald-400', 'text-red-400', 'text-slate-400');
            resonanceTextElement.classList.add(colorClass);
        }
        if (resonanceIconElement) {
            resonanceIconElement.setAttribute('data-feather', iconName);
        }

        if (sanctuaryWorldResonanceText) {
            sanctuaryWorldResonanceText.textContent = `Status Resonansi Dunia: ${statusText}`;
            sanctuaryWorldResonanceText.classList.remove('text-emerald-400', 'text-red-400', 'text-slate-400');
            sanctuaryWorldResonanceText.classList.add(colorClass);
        }
    },

    /**
     * Memperkuat Nexus di wilayah tertentu, meningkatkan Intention.
     * Dipanggil dari tombol "Fortify" di peta.
     * @param {string} regionId - ID wilayah yang akan diperkuat.
     * @param {number} amount - Jumlah Intention yang akan ditambahkan.
     */
    async fortifyNexus(regionId, amount) {
        if (!dbInstance.world.regions[regionId]) {
            console.error(`Region ${regionId} not found.`);
            return;
        }
        const region = dbInstance.world.regions[regionId];
        region.currentIntention = Math.min(1000, region.currentIntention + amount);
        this.updateWorldResonance();
    },

    /**
     * Melakukan Ritual Pembersihan di wilayah tertentu, mengurangi Echo.
     * Dipanggil dari tombol "Cleansing" di peta.
     * @param {string} regionId - ID wilayah tempat ritual akan dilakukan.
     * @param {number} amount - Jumlah Echo yang akan dikurangi.
     * @returns {Promise<void>}
     */
    async performCleansingRitual(regionId, amount) {
        if (!dbInstance.world.regions[regionId]) {
            console.error(`Region ${regionId} not found.`);
            return;
        }
        const region = dbInstance.world.regions[regionId];
        region.currentEcho = Math.max(0, region.currentEcho - amount);
        this.updateWorldResonance();
    },

    /**
     * Merender status Nexus dari semua wilayah untuk halaman Forger (Observatory).
     */
    renderRegionsStatus() {
        const container = document.getElementById('regions-status-list');
        if (!container) return;

        const regions = dbInstance.world.regions || {};
        const html = Object.keys(regions).map(regionId => {
            const region = regions[regionId];
            let statusClass = 'text-slate-400';
            if (region.status === 'SANCTUM') {
                statusClass = 'text-emerald-400';
            } else if (region.status === 'MAELSTROM') {
                statusClass = 'text-red-400';
            }
            // Use factionDynamicsManager to get faction name
            let factionName = region.dominantFaction ? factionDynamicsManager.getFactionName(region.dominantFaction) : 'None';

            return `
                <div class="glass-card p-4 rounded-lg flex flex-col mb-2 items-start justify-between animate-fade-in-up">
                    <h5 class="font-bold text-white text-lg">${region.name}</h5>
                    <p class="text-sm ${statusClass} mt-1">Status: ${region.status.replace(/_/g, ' ')}</p>
                    <p class="text-xs text-slate-500">Faksi Dominan: ${factionName}</p>
                    <div class="text-right w-full mt-2">
                        <p class="text-slate-300 text-sm">Intention: ${region.currentIntention.toFixed(0)}</p>
                        <p class="text-slate-300 text-sm">Echo: ${region.currentEcho.toFixed(0)}</p>
                    </div>
                </div>
            `;
        }).join('');
        container.innerHTML = html;
        if (typeof feather !== 'undefined' && feather.replace) {
            feather.replace();
        }
    },

    /**
     * Memicu event dunia global dan menerapkan konsekuensinya.
     * Dapat dipanggil oleh sistem game atau oleh The Forger.
     * @param {string} eventId - ID dari event dunia global dari GLOBAL_WORLD_EVENTS.
     * @param {object} [options={}] - Opsi untuk event (misalnya, targetRegionId, targetFactionIds).
     */
    async triggerGlobalWorldEvent(eventId, options = {}) {
        const eventDef = GLOBAL_WORLD_EVENTS[eventId];
        if (!eventDef) {
            console.error(`Global World Event '${eventId}' not found.`);
            UIManager.showNotification(`Gagal memicu event: '${eventId}' tidak ditemukan.`, 'alert-triangle', 'error', 3000, false);
            return;
        }

        if (eventDef.consequences.forgerChoicePrompt) {
            const prompt = eventDef.consequences.forgerChoicePrompt;
            let promptText = prompt.text.replace('{targetRegionName}', options.targetRegionName || 'wilayah yang tidak dikenal');

            const modalButtons = prompt.choices.map(choice => ({
                text: choice.text,
                onClick: async () => {
                    UIManager.closeModal();
                    await this._applyEventConsequences(choice.consequence, eventId, options);
                }
            }));
            UIManager.showModal(eventDef.name, promptText, modalButtons);
            return;
        }

        await this._applyEventConsequences(eventDef.consequences, eventId, options);
    },

    /**
     * Internal helper to apply event consequences.
     * @param {object} consequences - The consequences object to apply.
     * @param {string} eventId - The ID of the event for logging.
     * @param {object} options - Options passed to the event.
     */
    async _applyEventConsequences(consequences, eventId, options) {
        console.log(`[${gameTime.getCurrentDate().toLocaleDateString()}] Memicu Event Dunia Global: ${GLOBAL_WORLD_EVENTS[eventId].name}`);
        UIManager.showNotification(`${GLOBAL_WORLD_EVENTS[eventId].name}!`, GLOBAL_WORLD_EVENTS[eventId].eventIcon, 'world_event', 8000, true);

        let chronicleDescription = GLOBAL_WORLD_EVENTS[eventId].chronicleEntryDescription;
        let chronicleTitle = GLOBAL_WORLD_EVENTS[eventId].chronicleEntryTitle;

        if (consequences.nexusStateChange && options.targetRegionId) {
            const targetRegion = dbInstance.world.regions[options.targetRegionId];
            if (targetRegion) {
                targetRegion.status = consequences.nexusStateChange.newState;
                if (consequences.nexusStateChange.intensity) {
                    if (consequences.nexusStateChange.newState === 'MAELSTROM') {
                        targetRegion.currentEcho = Math.min(1000, (targetRegion.currentEcho || 0) + (consequences.nexusStateChange.intensity * 200));
                    } else if (consequences.nexusStateChange.newState === 'SANCTUM') {
                        targetRegion.currentIntention = Math.min(1000, (targetRegion.currentIntention || 0) + (consequences.nexusStateChange.intensity * 200));
                    }
                }
                console.log(`Region ${targetRegion.name} Nexus State changed to ${targetRegion.status}.`);
                chronicleDescription = chronicleDescription.replace('{targetRegionName}', targetRegion.name);
            }
        }

        if (consequences.factionReputationChanges && options.targetFactionIds) {
            options.targetFactionIds.forEach((factionId, index) => {
                const delta = consequences.factionReputationChanges[index]?.delta || 0;
                if (dbInstance.world.factions[factionId]) {
                    dbInstance.world.factions[factionId].reputation = (dbInstance.world.factions[factionId].reputation || 0) + delta;
                    dbInstance.world.factions[factionId].reputation = Math.max(-100, Math.min(100, dbInstance.world.factions[factionId].reputation));
                }
                console.log(`Faction ${factionId} reputation changed by ${delta}.`);
                if (index === 0) chronicleDescription = chronicleDescription.replace('{faction1Name}', factionDynamicsManager.getFactionName(factionId));
                if (index === 1) chronicleDescription = chronicleDescription.replace('{faction2Name}', factionDynamicsManager.getFactionName(factionId));
            });
        }

        if (consequences.spawnEnemies && options.targetRegionId) {
            consequences.spawnEnemies.forEach(spawnDef => {
                const creatureData = CREATURES_DATA[spawnDef.enemyId];
                if (creatureData) {
                    console.log(`Spawning ${spawnDef.quantity}x ${creatureData.name} in ${spawnDef.regionId}.`);
                }
            });
        }

        if (consequences.modifyLandmarks) {
            consequences.modifyLandmarks.forEach(modDef => {
                const landmarkToModify = modDef.landmarkId ? dbInstance.world.landmarks[modDef.landmarkId] :
                                         (options.targetLandmarkId ? dbInstance.world.landmarks[options.targetLandmarkId] : null);

                if (landmarkToModify) {
                    landmarkToModify.currentStatus = modDef.newStatus;
                    landmarkToModify.visualEffect = modDef.visualEffect;
                    console.log(`Landmark ${landmarkToModify.name} transformed to ${modDef.newStatus}.`);
                    chronicleDescription = chronicleDescription.replace('{targetLandmarkName}', landmarkToModify.name);
                    chronicleDescription = chronicleDescription.replace('{newStatusDescription}', modDef.newStatus.replace(/_/g, ' '));

                    const journalEntry = JOURNAL_ENTRY_TEMPLATES.LANDMARK_STATUS_CHANGE;
                    const currentUser = getCurrentUser();
                    if (journalEntry && currentUser && currentUser.role === 'wanderer') {
                        addToWandererChronicle(dbInstance.wanderers[currentUser.name], {
                            type: journalEntry.category,
                            title: journalEntry.title,
                            description: typeof journalEntry.content === 'function' ? journalEntry.content({
                                landmarkName: landmarkToModify.name,
                                regionName: dbInstance.world.regions[landmarkToModify.regionId]?.name || landmarkToModify.regionId,
                                newStatus: modDef.newStatus
                            }) : journalEntry.content,
                            timestamp: gameTime.getCurrentDate().toISOString(),
                            icon: journalEntry.icon
                        });
                    }
                }
            });
        }

        if (consequences.resourceImpact && options.targetRegionId) {
            const targetRegion = dbInstance.world.regions[options.targetRegionId];
            if (targetRegion && consequences.resourceImpact.resourceType) {
                const resType = consequences.resourceImpact.resourceType;
                const multiplier = consequences.resourceImpact.multiplier;
                if (!dbInstance.world.resourceMultipliers[resType]) {
                    dbInstance.world.resourceMultipliers[resType] = {};
                }
                dbInstance.world.resourceMultipliers[resType][options.targetRegionId] = multiplier;
                console.log(`Resource type '${resType}' in ${targetRegion.name} impacted by multiplier ${multiplier}.`);
            }
        }

        if (consequences.totalLegacyGain) {
            dbInstance.world.totalLegacyPoints = (dbInstance.world.totalLegacyPoints || 0) + consequences.totalLegacyGain;
            console.log(`Total Legacy Points increased by ${consequences.totalLegacyGain}. New Total: ${dbInstance.world.totalLegacyPoints}`);
        }

        const currentUser = getCurrentUser();
        if (currentUser && currentUser.role === 'wanderer') {
             addToWandererChronicle(dbInstance.wanderers[currentUser.name], {
                type: GLOBAL_WORLD_EVENTS[eventId].type || 'global_world_event',
                title: chronicleTitle,
                description: chronicleDescription,
                timestamp: gameTime.getCurrentDate().toISOString(),
                icon: GLOBAL_WORLD_EVENTS[eventId].eventIcon
            });
        }

        await saveDBInstanceRef(false);
        this.updateWorldResonance();
    },

    /**
     * Orchestrates the daily update of the world simulation.
     */
    async dailyWorldUpdate() {
        console.log(`\n--- Memulai Pembaruan Dunia Harian (WorldOrchestrator): ${gameTime.getCurrentDate().toLocaleDateString()} ---`);
        let changesMade = false;

        // Perbarui siklus kosmik
        if (cosmicCycleManager.advanceCosmicCycle(this.applyWorldAtmosphere.bind(this))) {
            changesMade = true;
        }

        // Mensimulasikan kemajuan NPC (usia, kesehatan, dll.) dan pemudaran reputasi
        for (const npcId in dbInstance.npc_souls) {
            if (await npcLifecycleManager.simulateNpcDailyProgress(npcId, getCurrentUser, this.getNpcName.bind(this))) {
                changesMade = true;
            }
            if (reputationManager.dailyReputationDecay(npcId)) {
                changesMade = true;
            }
        }

        // Handle NPC Births
        if (await npcLifecycleManager.handleNpcBirth(getCurrentUser)) {
             changesMade = true;
        }

        // Update faction dynamics (influence, dominant factions, trigger wars)
        if (await factionDynamicsManager.updateFactionDynamics(this.triggerGlobalWorldEvent.bind(this), getCurrentUser)) {
            changesMade = true;
        }

        // Update world resonance after all individual changes
        await this.updateWorldResonance();

        console.log(`--- Pembaruan Dunia Harian Selesai ---`);
        if (changesMade) {
            await saveDBInstanceRef(false); // Only save if changes were made by sub-managers or orchestrator itself
        }
    },

    // Functions that are still exposed directly via WorldManager proxy
    generateInitialNpcs: async (count, append) => npcLifecycleManager.generateInitialNpcs(count, append),
    getNpcAttitudeLevel: (reputationScore) => reputationManager.getNpcAttitudeLevel(reputationScore),
    recordReputationChange: (npcId, delta, actionType) => reputationManager.recordReputationChange(npcId, delta, actionType, worldOrchestrator.getNpcName.bind(worldOrchestrator)),
    getFactionName: (factionId) => factionDynamicsManager.getFactionName(factionId),
    getCurrentCosmicCycleEffects: () => cosmicCycleManager.getCurrentCosmicCycleEffects(),

    getRandomLocationInRegion: (regionId) => {
        // Placeholder: Logic untuk mendapatkan lokasi acak di region
        return { x: Math.random(), y: Math.random() };
    },
    // The following were initially re-exported by WorldManager in the previous step,
    // they remain directly in worldOrchestrator for now
    // (as they are not part of the new specific managers)
    // and will continue to be re-exported by worldManager.js proxy.
    // getRecentCorruptedNpcName, getRegionProblem, getNpcNameWithRandomTrait, generateQuestForProblem
    // renderRegionsStatus, fortifyNexus, performCleansingRitual, triggerGlobalWorldEvent, _applyEventConsequences
    // getLandmarkName, getLifeStageDefinition, getNextHealthStateId, getPrevHealthStateId, advanceCosmicCycle, simulateNpcProgress, applyWorldAtmosphere, updateLoginCanvasAtmosphere, updateResonanceDisplay
    // triggerRegionalWar (this is now internal to factionDynamicsManager)
};