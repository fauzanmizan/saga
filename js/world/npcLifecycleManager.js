// js/world/npcLifecycleManager.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-26, 8:28 PM WITA ==
// == PERIHAL: Refactoring WorldManager.js - Pemindahan NPCLifecycleManager ==
// - Mengelola penciptaan NPC, siklus hidup (umur, tahap kehidupan).
// - Menangani dinamika kesehatan dan logika mortalitas NPC.
// - Menangani logika kelahiran NPC.
// ===========================================

import {
    NPC_LIFESTAGES, NPC_HEALTH_STATES, NPC_PERSONALITY_TRAITS,
    REGIONS_DATA, NPC_ROLES, FACTIONS_DATA, NEXUS_STATES,
    WHISPER_EVENTS, CHRONICLE_EVENTS, JOURNAL_ENTRY_TEMPLATES, CREATURES_DATA
} from '../gameData.js'; // Adjust path if gameData.js is refactored to data/
import { UIManager } from '../uiManager.js';
import { gameTime } from '../utils.js'; // Assuming gameTime is in utils.js
import { addToWandererChronicle } from '../chronicleManager.js'; // For chronicle entries
import { triggerWhisperEvent } from '../eventManager.js'; // For corrupted NPC whispers

let dbInstance;
let saveDBInstanceRef;

export const npcLifecycleManager = {
    /**
     * Mengatur dependensi untuk modul npcLifecycleManager.
     * @param {object} db - Instans database utama.
     * @param {function} saveDB - Referensi ke fungsi App.saveDB.
     */
    setDependencies(db, saveDB) {
        dbInstance = db;
        saveDBInstanceRef = saveDB;
    },

    /**
     * Mengembalikan definisi tahapan hidup NPC berdasarkan usia.
     * @param {number} age - Usia NPC.
     * @returns {object} Objek definisi tahapan hidup.
     */
    getLifeStageDefinition(age) {
        // [Pindahkan seluruh isi fungsi getLifeStageDefinition dari worldOrchestrator.js ke sini]
        for (const stage of NPC_LIFESTAGES) {
            if (age >= stage.minAge && (stage.maxAge === Infinity || age <= stage.maxAge)) {
                return stage;
            }
        }
        return NPC_LIFESTAGES[NPC_LIFESTAGES.length - 1]; // Fallback
    },

    /**
     * Mengembalikan ID health state berikutnya berdasarkan current health state ID.
     * @param {string} currentHealthStateId - ID health state saat ini.
     * @returns {string|null} ID health state berikutnya atau null jika sudah yang terburuk.
     */
    getNextHealthStateId(currentHealthStateId) {
        // [Pindahkan seluruh isi fungsi getNextHealthStateId dari worldOrchestrator.js ke sini]
        const healthStateOrder = [
            NPC_HEALTH_STATES.VIBRANT.id,
            NPC_HEALTH_STATES.NORMAL.id,
            NPC_HEALTH_STATES.FRAIL.id,
            NPC_HEALTH_STATES.CORRUPTED.id
        ];
        const currentIndex = healthStateOrder.indexOf(currentHealthStateId);
        if (currentIndex < healthStateOrder.length - 1) {
            return healthStateOrder[currentIndex + 1];
        }
        return null;
    },

    /**
     * Mengembalikan ID health state sebelumnya berdasarkan current health state ID.
     * @param {string} currentHealthStateId - ID health state saat ini.
     * @returns {string|null} ID health state sebelumnya atau null jika sudah yang terbaik.
     */
    getPrevHealthStateId(currentHealthStateId) {
        // [Pindahkan seluruh isi fungsi getPrevHealthStateId dari worldOrchestrator.js ke sini]
        const healthStateOrder = [
            NPC_HEALTH_STATES.VIBRANT.id,
            NPC_HEALTH_STATES.NORMAL.id,
            NPC_HEALTH_STATES.FRAIL.id,
            NPC_HEALTH_STATES.CORRUPTED.id
        ];
        const currentIndex = healthStateOrder.indexOf(currentHealthStateId);
        if (currentIndex > 0) {
            return healthStateOrder[currentIndex - 1];
        }
        return null;
    },

    /**
     * Mensimulasikan kemajuan NPC harian (penuaan, perubahan kesehatan, dll.).
     * @param {string} npcId - ID NPC yang akan disimulasikan.
     * @param {function} getCurrentUser - Callback untuk mendapatkan pengguna saat ini.
     * @param {function} getNpcName - Callback untuk mendapatkan nama NPC.
     */
    async simulateNpcDailyProgress(npcId, getCurrentUser, getNpcName) {
        const npc = dbInstance.npc_souls[npcId];
        if (!npc) return false; // Return false if NPC doesn't exist, no changes made

        const now = gameTime.getCurrentDate();
        const lastSimulatedDate = npc.lastSimulatedDate ? new Date(npc.lastSimulatedDate) : null;

        // Simulate only once per day
        if (lastSimulatedDate && lastSimulatedDate.getDate() === now.getDate() &&
            lastSimulatedDate.getMonth() === now.getMonth() &&
            lastSimulatedDate.getFullYear() === now.getFullYear()) {
            return false; // Already simulated for today
        }

        let changesMade = false;

        // --- 0. Inisialisasi Properti NPC (jika belum ada) ---
        if (!npc.healthState) npc.healthState = NPC_HEALTH_STATES.NORMAL.id;
        if (npc.currentHealth === undefined || npc.currentHealth > 100 || npc.currentHealth < 0) npc.currentHealth = 100;
        if (!npc.age) npc.age = Math.floor(Math.random() * 40) + 18;
        if (!npc.lifeStage) npc.lifeStage = this.getLifeStageDefinition(npc.age).stage;
        if (!npc.currentRegion) {
            const regionIds = Object.keys(REGIONS_DATA);
            npc.currentRegion = regionIds[Math.floor(Math.random() * regionIds.length)];
            console.warn(`NPC ${npc.name} tidak memiliki currentRegion. Mengatur ke '${npc.currentRegion}'.`);
        }
        if (!npc.lastWhisperTriggerDate) npc.lastWhisperTriggerDate = new Date(0).toISOString();
        if (!npc.lastHealthStateChangeDate) npc.lastHealthStateChangeDate = now.toISOString();
        if (!npc.relationships) npc.relationships = [];
        if (!npc.role) { // Assign a random role from NPC_ROLES if not set
            const roles = Object.values(NPC_ROLES);
            npc.role = roles[Math.floor(Math.random() * roles.length)].id;
        }
        if (!npc.personalityTraits || npc.personalityTraits.length === 0) {
            const traits = Object.values(NPC_PERSONALITY_TRAITS);
            npc.personalityTraits = [traits[Math.floor(Math.random() * traits.length)].id];
        }
        if (!npc.factionAffiliation) { // Assign faction based on dominant region faction or randomly
            const regionData = REGIONS_DATA[npc.currentRegion];
            if (regionData && regionData.dominantFaction) {
                npc.factionAffiliation = regionData.dominantFaction;
            } else {
                const factions = Object.keys(FACTIONS_DATA);
                npc.factionAffiliation = factions[Math.floor(Math.random() * factions.length)];
            }
        }
        if (npc.influenceScore === undefined) npc.influenceScore = 10;

        const currentRegion = dbInstance.world.regions[npc.currentRegion];
        const nexusStateId = currentRegion?.status || REGIONS_DATA[npc.currentRegion]?.initialNexusState || 'NORMAL';
        const nexusStateDef = NEXUS_STATES[nexusStateId.toUpperCase()];
        const currentHealthStateDef = NPC_HEALTH_STATES[npc.healthState.toUpperCase()];
        const currentLifeStageDef = this.getLifeStageDefinition(npc.age);
        // cosmicEffects are handled by cosmicCycleManager and passed to worldOrchestrator, not directly accessed here

        // --- 1. Age and Life Stage Progression ---
        npc.age += (1 / 365);
        const newLifeStageDef = this.getLifeStageDefinition(npc.age);
        if (newLifeStageDef.stage !== npc.lifeStage) {
            console.log(`[${now.toLocaleDateString()}] ${npc.name} (${npc.id}) transitioned from ${npc.lifeStage} to ${newLifeStageDef.stage} at age ${Math.floor(npc.age)}.`);
            npc.lifeStage = newLifeStageDef.stage;
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.role === 'wanderer') {
                addToWandererChronicle(dbInstance.wanderers[currentUser.name], { // Pass wanderer instance
                    type: 'npc_lifestage_change',
                    title: 'Perubahan Hidup NPC',
                    description: `${npc.name} kini berada pada tahap ${npc.lifeStage}nya.`,
                    timestamp: now.toISOString(),
                    icon: 'baby'
                });
            }
            changesMade = true;
        }

        // --- 2. Health State Dynamics ---
        let effectiveDecayRate = currentHealthStateDef.baseDecayRate;
        let effectiveRegenRate = currentHealthStateDef.baseRegenRate;

        effectiveDecayRate *= nexusStateDef.healthDecayMultiplier;
        effectiveRegenRate *= (1 / nexusStateDef.healthDecayMultiplier);
        effectiveRegenRate *= nexusStateDef.healthGainChance;

        effectiveDecayRate *= (1 - currentLifeStageDef.resilience);
        effectiveRegenRate += currentLifeStageDef.resilience;
        effectiveDecayRate *= (1 + (1 - currentLifeStageDef.environmentalTolerance) * nexusStateDef.healthDecayMultiplier * 0.1);
        effectiveDecayRate += (currentHealthStateDef.echoBias / 1000);
        // effectiveDecayRate *= (cosmicEffects.npcHealthDecayModifier || 1); // cosmicEffects passed from Orchestrator if needed

        npc.currentHealth -= (effectiveDecayRate * 100);
        npc.currentHealth += (effectiveRegenRate * 100);
        npc.currentHealth = Math.max(0, Math.min(100, npc.currentHealth));

        const oldHealthState = npc.healthState;
        const nextHealthStateId = this.getNextHealthStateId(npc.healthState);
        const prevHealthStateId = this.getPrevHealthStateId(npc.healthState);

        if (npc.currentHealth <= 25 && nextHealthStateId && Math.random() < 0.25) {
            npc.healthState = nextHealthStateId;
            console.log(`[${now.toLocaleDateString()}] ${npc.name} health state degraded to ${npc.healthState} due to critically low health.`);
            npc.lastHealthStateChangeDate = now.toISOString();
            changesMade = true;
        } else if (Math.random() < effectiveDecayRate * 2 && nextHealthStateId) {
            npc.healthState = nextHealthStateId;
            console.log(`[${now.toLocaleDateString()}] ${npc.name} health state degraded to ${npc.healthState} due to passive decay.`);
            npc.lastHealthStateChangeDate = now.toISOString();
            changesMade = true;
        }

        if (prevHealthStateId && nexusStateDef.id === NEXUS_STATES.SANCTUM.id) {
            let chanceToImprove = nexusStateDef.healthGainChance;
            if (npc.currentHealth >= 75) chanceToImprove += 0.05;
            if (Math.random() < chanceToImprove) {
                npc.healthState = prevHealthStateId;
                console.log(`[${now.toLocaleDateString()}] ${npc.name} health state improved to ${npc.healthState} in Sanctum.`);
                npc.lastHealthStateChangeDate = now.toISOString();
                changesMade = true;
            }
        }

        // --- NEW: NPC Relationship and Role Evolution ---
        for (const rel of npc.relationships) {
            const relatedNpc = dbInstance.npc_souls[rel.npcId];
            if (relatedNpc && relatedNpc.healthState === 'dead' && !rel.mourned) {
                rel.mourned = true;
                changesMade = true;
            }
        }

        // --- 3. Mortality Logic (Kematian NPC) ---
        let mortalityRisk = currentLifeStageDef.mortalityRiskFactor;
        mortalityRisk *= currentHealthStateDef.mortalityMultiplier;
        mortalityRisk *= nexusStateDef.mortalityModifier;
        if (npc.currentHealth <= 0) mortalityRisk = 1;
        else if (npc.currentHealth <= 10) mortalityRisk *= 5;

        if (Math.random() < mortalityRisk) {
            let deathCauseType = 'natural';
            if (npc.healthState === NPC_HEALTH_STATES.CORRUPTED.id) deathCauseType = 'corruption';
            else if (npc.currentHealth <= 0) deathCauseType = 'starvation_exhaustion';

            const deathEventTemplate = CHRONICLE_EVENTS[`NPC_DEATH_${deathCauseType.toUpperCase()}`] || CHRONICLE_EVENTS.NPC_DEATH_NATURAL;
            const chronicleDescription = deathEventTemplate.template
                .replace('{npcName}', npc.name)
                .replace('{lifeStage}', npc.lifeStage)
                .replace('{healthState}', currentHealthStateDef.description)
                .replace('{regionName}', currentRegion ? currentRegion.name : npc.currentRegion);

            console.log(`[${now.toLocaleDateString()}] ${npc.name} (${npc.id}) has died at age ${Math.floor(npc.age)} due to ${deathCauseType} (${npc.healthState}).`);

            delete dbInstance.npc_souls[npcId]; // Remove NPC by its ID key

            // Trigger journal entry for NPC death (if applicable)
            const journalEntry = JOURNAL_ENTRY_TEMPLATES[`journal_npc_death_${deathCauseType}`];
            const currentUser = getCurrentUser();
            if (journalEntry && currentUser && currentUser.role === 'wanderer') {
                 addToWandererChronicle(dbInstance.wanderers[currentUser.name], {
                    type: journalEntry.category,
                    title: journalEntry.title,
                    description: typeof journalEntry.content === 'function' ? journalEntry.content({ npcName: npc.name, regionName: currentRegion.name, cause: deathCauseType }) : journalEntry.content,
                    timestamp: now.toISOString(),
                    icon: journalEntry.icon
                });
            }

            for (const wandererName in dbInstance.wanderers) {
                const wanderer = dbInstance.wanderers[wandererName];
                if (wanderer.currentRegion === npc.currentRegion) {
                    addToWandererChronicle(wanderer, {
                        type: deathEventTemplate.type,
                        title: `Gema Kematian: ${getNpcName(npc.id)}`,
                        description: chronicleDescription,
                        timestamp: now.toISOString(),
                        icon: 'skull',
                        impact: deathEventTemplate.impact
                    });
                }
            }

            if (currentRegion && deathEventTemplate.impact.regionIntentionChange) {
                currentRegion.currentIntention = Math.max(0, currentRegion.currentIntention + deathEventTemplate.impact.regionIntentionChange);
            }
            if (currentRegion && deathEventTemplate.impact.potentialEchoSpawn && Math.random() < 0.5) {
                currentRegion.currentEcho = Math.min(1000, (currentRegion.currentEcho || 0) + 100); // Scale to 1000
            }

            if (!dbInstance.world.worldObjects) {
                dbInstance.world.worldObjects = [];
            }
            dbInstance.world.worldObjects.push({
                id: `remains_${npc.id}`,
                type: 'npc_remains',
                regionId: npc.currentRegion,
                decayTime: now.getTime() + (7 * 24 * 60 * 60 * 1000),
                associatedNpcId: npc.id,
            });
            changesMade = true;
            return changesMade; // Skip rest of simulation for dead NPC
        }

        // --- 4. Corrupted NPC Trigger Whisper & Environmental Impact ---
        if (npc.healthState === NPC_HEALTH_STATES.CORRUPTED.id) {
            let whisperTriggerChance = currentHealthStateDef.whisperTriggerChance;
            whisperTriggerChance *= nexusStateDef.whisperFrequencyModifier;

            const lastWhisperDate = new Date(npc.lastWhisperTriggerDate);
            const daysSinceLastWhisper = (now - lastWhisperDate) / (1000 * 60 * 60 * 24);

            const potentialWhispers = [WHISPER_EVENTS.CORRUPTED_PRESENCE, WHISPER_EVENTS.CORRUPTED_MALIGNANCY_SPIKE];
            const selectedWhisperDef = potentialWhispers[Math.floor(Math.random() * potentialWhispers.length)];

            if (daysSinceLastWhisper >= (selectedWhisperDef.cooldownDays || 1) && Math.random() < whisperTriggerChance) {
                const newWhisper = { ...selectedWhisperDef };
                newWhisper.id = `whisper_${npc.id}_${Date.now()}`;
                newWhisper.originNpcId = npc.id;
                newWhisper.originRegionId = npc.currentRegion;
                triggerWhisperEvent(newWhisper);
                npc.lastWhisperTriggerDate = now.toISOString();
                changesMade = true;
            }

            if (currentHealthStateDef.environmentalCorruptionImpact > 0 && currentRegion) {
                const corruptionIncrease = currentHealthStateDef.environmentalCorruptionImpact * nexusStateDef.corruptionGrowthFactor;
                currentRegion.currentEcho = Math.min(1000, currentRegion.currentEcho + (corruptionIncrease * 100)); // Scale to 1000
                changesMade = true;
            }
        }

        npc.lastSimulatedDate = now.toISOString();
        changesMade = true;

        return changesMade;
    },

    /**
     * Menghasilkan NPC awal.
     * @param {number} count - Jumlah NPC yang akan dihasilkan.
     * @param {boolean} append - Jika true, tambahkan ke NPC yang sudah ada. Jika false, timpa yang sudah ada.
     */
    async generateInitialNpcs(count = 5, append = false) {
        if (!append && Object.keys(dbInstance.npc_souls || {}).length > 0) {
            console.log("NPC souls already exist, skipping initial generation unless append is true.");
            return;
        }

        UIManager.showLoading(`Menempa ${count} jiwa NPC awal...`);
        const newNpcs = {};
        const allRegionIds = Object.keys(REGIONS_DATA);
        const allRoles = Object.values(NPC_ROLES);
        const allTraits = Object.values(NPC_PERSONALITY_TRAITS);

        for (let i = 0; i < count; i++) {
            const randomName = `JiwaOtonom${Math.floor(Math.random() * 100000) + 1}`;
            const randomRegionId = allRegionIds[Math.floor(Math.random() * allRegionIds.length)];
            const chosenRegionData = REGIONS_DATA[randomRegionId];

            const initialAge = Math.floor(Math.random() * 50) + 1;
            const initialLifeStage = this.getLifeStageDefinition(initialAge).stage;
            const initialHealthState = Math.random() < 0.1 ? NPC_HEALTH_STATES.FRAIL.id : NPC_HEALTH_STATES.NORMAL.id;

            const personalityTraits = [];
            for(let j=0; j<Math.floor(Math.random()*3)+1; j++) {
                personalityTraits.push(allTraits[Math.floor(Math.random() * allTraits.length)].id);
            }

            const chosenRole = allRoles[Math.floor(Math.random() * allRoles.length)];

            let factionAffiliation = chosenRegionData?.dominantFaction || FACTIONS_DATA[Object.keys(FACTIONS_DATA)[Math.floor(Math.random() * Object.keys(FACTIONS_DATA).length)]].id;


            newNpcs[`npc_${randomName.toLowerCase().replace(/\s/g, '-')}_${Math.random().toString(36).substring(2, 5)}`] = {
                id: `npc_${randomName.toLowerCase().replace(/\s/g, '-')}_${Math.random().toString(36).substring(2, 5)}`,
                name: randomName,
                role: chosenRole.id,
                archetype: null,
                mantra: `mantra-${randomName.toLowerCase().replace(/\s/g, '-')}`,
                soulRank: 1,
                title: "Warga",
                xp: 0,
                alignment: {
                    echo: Math.floor(Math.random() * 100),
                    intention: Math.floor(Math.random() * 100)
                },
                consistencyStreak: 0,
                essenceOfWill: 0,
                status: { id: 'neutral', text: 'Balanced', color: 'text-slate-400' },
                focus: { attribute: null, setOn: null },
                unlockedImprints: [],
                divineMandate: null,
                legacyBlessings: [],
                wordsOfPower: [],
                worldMap: {},
                chronicle: [],
                ledger: { transactions: [] },
                lastSimulatedDate: new Date().toISOString(),
                age: initialAge,
                lifeStage: initialLifeStage,
                healthState: initialHealthState,
                currentHealth: 100,
                personalityTraits: [...new Set(personalityTraits)],
                factionAffiliation: factionAffiliation,
                influenceScore: Math.floor(Math.random() * 50) + 10,
                currentRegion: randomRegionId,
                reputation: FACTIONS_DATA[factionAffiliation]?.baseReputation !== undefined ? FACTIONS_DATA[factionAffiliation].baseReputation : 0,
                lastReputationChangeDate: new Date().toISOString(),
                relationships: []
            };
        }
        if (!dbInstance.npc_souls) dbInstance.npc_souls = {};
        Object.assign(dbInstance.npc_souls, newNpcs);

        await saveDBInstanceRef(false);
        UIManager.hideLoading();
        console.log(`${count} NPC souls generated and added.`);
    },

    /**
     * Menangani logika kelahiran NPC.
     * Dipanggil secara periodik oleh WorldOrchestrator.
     * @param {function} getCurrentUser - Callback untuk mendapatkan pengguna saat ini.
     */
    async handleNpcBirth(getCurrentUser) {
        const now = gameTime.getCurrentDate();
        const totalIntentionInSanctums = Object.values(dbInstance.world.regions)
            .filter(r => r.status === 'SANCTUM')
            .reduce((sum, r) => sum + r.currentIntention, 0);

        if (totalIntentionInSanctums > 800 && Object.values(dbInstance.npc_souls).length < 200) {
            let birthChance = 0.05;
            const adultNPCs = Object.values(dbInstance.npc_souls).filter(npc => npc.lifeStage === 'Adult');
            if (adultNPCs.length > 0) {
                const totalFertilityFactor = adultNPCs.reduce((sum, npc) => {
                    const lifeStageData = NPC_LIFESTAGES.find(stage => stage.stage === npc.lifeStage);
                    return sum + (lifeStageData?.fertilityFactor || 0);
                }, 0);
                birthChance += totalFertilityFactor * 0.1;
            }

            if (Math.random() < birthChance) {
                console.log("A new NPC soul is born!");
                await this.generateInitialNpcs(1, true); // Append a new NPC
                const currentUser = getCurrentUser();
                if (currentUser && currentUser.role === 'wanderer') {
                    addToWandererChronicle(dbInstance.wanderers[currentUser.name], {
                        type: CHRONICLE_EVENTS.NEW_NPC_BORN.type,
                        title: CHRONICLE_EVENTS.NEW_NPC_BORN.template,
                        description: CHRONICLE_EVENTS.NEW_NPC_BORN.template.replace('{regionName}', dbInstance.wanderers[currentUser.name].currentRegion),
                        timestamp: now.toISOString(),
                        icon: 'baby'
                    });
                }
                return true; // Changes made
            }
        }
        return false; // No changes
    },
};