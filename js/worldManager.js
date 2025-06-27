// js/worldManager.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 23:35 ==
// == PERIHAL: Implementasi Fase IV - Evolusi Dunia Lanjutan ==
// - Mengelola siklus kosmik/musiman dan dampaknya.
// - Memperbarui simulasi NPC dengan hubungan dan peran.
// - Mengimplementasikan triggerGlobalWorldEvent untuk konsekuensi event makro.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 20:16 ==
// == PERIHAL: Implementasi Fase III - Misi NPC Generik (Fetch/Delivery) ==
// - Menambahkan fungsi helper getNpcName(npcId).
// - Menambahkan fungsi getRandomLocationInRegion(regionId) (mock).
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 17:40 ==
// == PERIHAL: Implementasi Fase III - Konsekuensi Kesehatan NPC Dinamis ==
// - Memperbarui simulateNpcProgress() untuk mengelola dual layer kesehatan (currentHealth & healthState).
// - Menerapkan pengaruh Nexus State dan Life Stage pada decay/regen kesehatan.
// - Mengimplementasikan transisi healthState berdasarkan currentHealth.
// - Memperkuat logika mortalitas dengan mempertimbangkan currentHealth, healthState, dan LifeStage.
// - Menambahkan logika NPC Corrupted untuk memicu Whisper dan menyebarkan korupsi lingkungan.
// - Memperbarui inisialisasi NPC baru di generateInitialNpcs() dengan currentHealth.
// - Menambahkan fungsi helper getLifeStageDefinition, getNextHealthStateId, getPrevHealthStateId.
// - Memperbarui dokumentasi di header file.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 17:24 ==
// == PERIHAL: Implementasi Fase III - Sistem Reputasi NPC Dinamis ==
// - Di generateInitialNpcs(), menginisialisasi NPC dengan `reputation: 0` dan `lastReputationChangeDate: new Date().toISOString()`.
// - Menambahkan fungsi `recordReputationChange` yang dipanggil oleh mini-game atau event lain untuk mengubah reputasi NPC, meng-clamp nilai, dan mengupdate `lastReputationChangeDate`.
// - Di simulateNpcProgress(), mengimplementasikan logika pemudaran reputasi negatif secara pasif berdasarkan `daysSinceLastChange` dan ambang batas reputasi.
// - Menambahkan fungsi `getNpcAttitudeLevel` untuk mendapatkan objek level reputasi dari NPC_REPUTATION_LEVELS.
// - Memperbarui dokumentasi di header file.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:28 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Konflik & Evolusi Faksi NPC (Client-side) & Dinamika Dunia Makro ==
// - Di simulateNpcProgress(), menambahkan logika agar NPC berkontribusi pada `factionInfluence` di wilayah mereka.
// - Di simulateNpcProgress(), menambahkan logika untuk memicu "Event Perang Wilayah" naratif secara otomatis
//   jika kondisi tertentu (Maelstrom, faksi berlawanan seimbang) terpenuhi.
// - Di updateWorldResonance(), menghitung `dominantFaction` untuk setiap wilayah berdasarkan total `factionInfluence`.
// - Menambahkan placeholder untuk manajemen `resourceMultipliers` atau `globalItemRarity` di `updateWorldResonance`.
// - Memperbarui dokumentasi di header file.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:20 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Konflik & Evolusi Faksi NPC (Client-side) ==
// - Di generateInitialNpcs(), menambahkan properti `factionAffiliation` dan `influenceScore` untuk setiap NPC baru.
// - Di simulateNpcProgress(), menambahkan logika untuk:
//   - NPC berkontribusi pada `factionInfluence` di wilayah mereka.
//   - Menghitung `dominantFaction` untuk setiap wilayah.
//   - Memicu "Event Perang Wilayah" naratif jika kondisi tertentu terpenuhi di wilayah Maelstrom.
// - Menambahkan fungsi `triggerRegionalWar` untuk Forger memicu perang secara manual.
// - Memperbarui dokumentasi di header file.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:15 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Interaksi & Narasi Mikro NPC (Fase Lanjutan) ==
// - Memperbarui generateInitialNpcs() untuk memastikan NPC yang baru dibuat memiliki `personalityTraits` acak.
// - Memastikan `npc.lastSimulatedDate` diperbarui di setiap siklus simulasi.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:05 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Dinamika Populasi NPC & Health State ==
// - Memperbarui simulateNpcProgress() untuk mengelola age, lifeStage, healthState NPC.
// - Menambahkan logika kelahiran dan kematian NPC berdasarkan kondisi dunia (Nexus status, mortalityRiskFactor, fertilityFactor).
// - Memastikan NPC yang mati mencatat "Gema Kematian" di Chronicle Wanderer dan mempengaruhi Nexus.
// - Memperbarui generateInitialNpcs() untuk memberikan properti siklus hidup awal kepada NPC baru.
// - Memastikan semua dependensi dari gameData.js diimpor dan digunakan dengan benar.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2023-06-23 18:32 WITA ==
// == PERIHAL: Implementasi Penuh Peta Dunia Interaktif & Sistem Nexus Dinamis ==
// - Memperkuat logika updateWorldResonance() untuk memastikan perhitungan currentIntention dan currentEcho setiap wilayah db.world.regions diperbarui berdasarkan aksi pemain/NPC.
// - Mengimplementasikan fungsi fortifyNexus(regionId, amount) untuk meningkatkan Intention di Nexus wilayah.
// - Mengimplementasikan fungsi performCleansingRitual(regionId, amount) untuk mengurangi Echo di Nexus wilayah.
// - Menambahkan fungsi renderRegionsStatus() untuk merender status Nexus di Observatorium (Forger Page).
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2023-06-23 13:40 WITA ==
// == PERIHAL: Modul Inti World Manager ==
// - Mengisolasi semua logika yang terkait dengan manajemen dunia.
// - Menyediakan fungsi-fungsi ekspor untuk `simulateNpcProgress`, `generateInitialNpcs`,
//   `updateWorldResonance`, `applyWorldAtmosphere`, dan `updateLoginCanvasAtmosphere`.
// - Bergantung pada UIManager dan firebaseService untuk operasi UI dan database.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-25, 13:07 ==
// == PERIHAL: Integrasi Masif GameData.js ke WorldManager.js ==
// - Menginisialisasi `db.world.regions` dari `REGIONS_DATA`.
// - Menginisialisasi `db.world.factions` dari `FACTIONS_DATA`.
// - Memperbarui `generateInitialNpcs` untuk mengalokasikan NPC ke wilayah dan faksi yang benar, serta memberikan sifat dan peran yang lebih beragam.
// - Memperbarui `simulateNpcProgress` untuk:
//     - Mempertimbangkan efek iklim/medan dari `REGIONS_DATA` pada NPC.
//     - Mengelola `npc.relationships` (placeholder untuk efek, e.g., duka cita).
//     - Memanfaatkan `NPC_ROLES` untuk perilaku dasar NPC (e.g., mobilitas).
// - Mengintegrasikan `CREATURES_DATA` untuk `spawnEnemies` (placeholder).
// - Mengintegrasikan `GLOBAL_LOOT_TABLES` (placeholder untuk sistem loot).
// - Memperbarui `triggerGlobalWorldEvent` untuk mendukung `forgerChoicePrompt` dan konsekuensi yang lebih luas.
// - Memperbarui `getNpcAttitudeLevel`, `getNpcName`, `getFactionName`, `getLandmarkName` untuk menggunakan data yang diperkaya.
// - Mengintegrasikan pemicu `JOURNAL_ENTRY_TEMPLATES` dalam berbagai fungsi.
// ===========================================

import { UIManager } from './uiManager.js';
import { updateDocument } from './firebaseService.js';
import {
    NPC_LIFESTAGES, NPC_HEALTH_STATES, NPC_PERSONALITY_TRAITS,
    NPC_REPUTATION_LEVELS, REPUTATION_CHANGE_MAGNITUDE, NEXUS_STATES,
    WHISPER_EVENTS, CHRONICLE_EVENTS, COSMIC_CYCLES, GLOBAL_WORLD_EVENTS,
    REGIONS_DATA, FACTIONS_DATA, CREATURES_DATA, WORLD_LANDMARKS, // New Imports
    NPC_ROLES, JOURNAL_ENTRY_TEMPLATES, GLOBAL_LOOT_TABLES, ITEM_EFFECTS_DATA // New Imports
} from './gameData.js';
import { gameTime } from './features/utils.js';
import { triggerWhisperEvent } from './eventManager.js';
import { addToWandererChronicle } from './chronicleManager.js';

// Variabel dan fungsi yang terkait dengan manajemen dunia
let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstanceRef; // Renamed to avoid conflict with local function

export const WorldManager = {
    setDependencies(db, DB_DOC_ID, saveDB) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstanceRef = saveDB;
        console.log("WorldManager dependencies set.");

        // NEW: Initialize world data from gameData.js if not already populated
        // This runs once when dependencies are set, usually during app init
        if (!dbInstance.world.regions || Object.keys(dbInstance.world.regions).length === 0) {
            console.log("Initializing regions from REGIONS_DATA.");
            dbInstance.world.regions = JSON.parse(JSON.stringify(REGIONS_DATA)); // Deep copy to prevent mutation of original
            // Initialize currentEcho and currentIntention for new regions
            for (const regionId in dbInstance.world.regions) {
                const region = dbInstance.world.regions[regionId];
                region.currentEcho = 500;    // Default mid-point
                region.currentIntention = 500; // Default mid-point
                region.status = 'NORMAL'; // Default status
            }
        }
        if (!dbInstance.world.factions || Object.keys(dbInstance.world.factions).length === 0) {
            console.log("Initializing factions from FACTIONS_DATA.");
            dbInstance.world.factions = JSON.parse(JSON.stringify(FACTIONS_DATA)); // Deep copy
            // Initialize influence object for each faction
            for (const factionId in dbInstance.world.factions) {
                dbInstance.world.factions[factionId].influence = {};
            }
        }
        if (!dbInstance.world.landmarks || Object.keys(dbInstance.world.landmarks).length === 0) {
            console.log("Initializing landmarks from WORLD_LANDMARKS.");
            dbInstance.world.landmarks = JSON.parse(JSON.stringify(WORLD_LANDMARKS)); // Deep copy
            // Initialize currentStatus for each landmark based on initialStatus
            for (const landmarkId in dbInstance.world.landmarks) {
                const landmark = dbInstance.world.landmarks[landmarkId];
                landmark.currentStatus = landmark.initialStatus;
            }
        }
        if (!dbInstance.world.totalLegacyPoints) dbInstance.world.totalLegacyPoints = 0;
        if (!dbInstance.world.globalEvents) dbInstance.world.globalEvents = [];
        if (!dbInstance.world.notificationLog) dbInstance.world.notificationLog = [];
        if (!dbInstance.world.cosmicCycle) {
            dbInstance.world.cosmicCycle = {
                currentCycleId: COSMIC_CYCLES.ECHOING_SLUMBER.id,
                daysInCycle: 0
            };
        }
    },

    /**
     * Mendapatkan nama NPC berdasarkan ID.
     * @param {string} npcId - ID NPC.
     * @returns {string} Nama NPC atau 'Unknown NPC'.
     */
    getNpcName(npcId) {
        // Asumsi npc_souls diindeks dengan ID
        const npc = Object.values(dbInstance.npc_souls || {}).find(n => n.id === npcId);
        return npc ? npc.name : 'Unknown NPC';
    },

    /**
     * Mendapatkan nama faksi berdasarkan ID.
     * @param {string} factionId - ID Faksi.
     * @returns {string} Nama Faksi atau 'Unknown Faction'.
     */
    getFactionName(factionId) {
        const faction = dbInstance.world.factions[factionId];
        return faction ? faction.name : 'Unknown Faction';
    },

    /**
     * Mendapatkan nama landmark berdasarkan ID.
     * @param {string} landmarkId - ID Landmark.
     * @returns {string} Nama Landmark atau 'Unknown Landmark'.
     */
    getLandmarkName(landmarkId) {
        const landmark = dbInstance.world.landmarks[landmarkId];
        return landmark ? landmark.name : 'Unknown Landmark';
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
     * Menghasilkan lokasi acak di wilayah tertentu (mock).
     * @param {string} regionId - ID wilayah.
     * @returns {string} Deskripsi lokasi.
     */
    getRandomLocationInRegion(regionId) {
        const locations = ['reruntuhan kuno', 'gua tersembunyi', 'pinggir sungai', 'puncak bukit'];
        return locations[Math.floor(Math.random() * locations.length)];
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
     * Mengembalikan objek level reputasi berdasarkan skor reputasi.
     * @param {object} npc - Objek NPC dengan properti reputasi.
     * @param {object} wanderer - Objek Wanderer dengan reputasi terhadap NPC.
     * @returns {object} Objek level reputasi (name, description, threshold).
     */
    getNpcAttitudeLevel(npc, wanderer) {
        const reputationScore = wanderer.reputation[npc.id] || 0;
        const sortedLevels = [...NPC_REPUTATION_LEVELS].sort((a, b) => b.threshold - a.threshold);
        for (const level of sortedLevels) {
            if (reputationScore >= level.threshold) {
                return level.name.toLowerCase().replace(/\s/g, '_'); // Return simplified string
            }
        }
        return 'neutral'; // Fallback
    },

    /**
     * Mencatat perubahan reputasi untuk NPC dan menyimpannya ke Firebase.
     * @param {string} npcId - ID NPC yang reputasinya akan diubah.
     * @param {number} delta - Jumlah perubahan reputasi (positif atau negatif).
     * @param {string} actionType - Tipe aksi yang menyebabkan perubahan (opsional, untuk logging/debugging).
     */
    async recordReputationChange(npcId, delta, actionType = 'dialogue') {
        const wanderer = dbInstance.wanderer; // Asumsi Wanderer yang berinteraksi adalah db.wanderer
        if (!wanderer.reputation) {
            wanderer.reputation = {};
        }
        if (!wanderer.reputation[npcId]) {
            wanderer.reputation[npcId] = 0;
        }

        const oldReputation = wanderer.reputation[npcId];
        let newReputation = oldReputation + delta;

        newReputation = Math.max(-100, Math.min(100, newReputation));

        const oldLevel = WorldManager.getNpcAttitudeLevel({ id: npcId }, { reputation: { [npcId]: oldReputation } }); // Dummy NPC for level check
        const newLevel = WorldManager.getNpcAttitudeLevel({ id: npcId }, { reputation: { [npcId]: newReputation } });

        wanderer.reputation[npcId] = newReputation;

        // Find the NPC in npc_souls and update its lastReputationChangeDate
        const npc = Object.values(dbInstance.npc_souls || {}).find(n => n.id === npcId);
        if (npc) {
            npc.lastReputationChangeDate = gameTime.getCurrentDate().toISOString();
        }

        console.log(`Reputation for ${WorldManager.getNpcName(npcId)} changed by ${delta}. New reputation: ${newReputation} (${newLevel}). Action: ${actionType}`);

        if (newLevel !== oldLevel) {
            UIManager.showNotification(`${WorldManager.getNpcName(npcId)} kini menganggap Anda ${newLevel.replace(/_/g, ' ')}!`, 'users', 'reputation');
        }

        // Save is handled by the main app loop
    },

    /**
     * Mendapatkan definisi Life Stage berdasarkan usia.
     * @param {number} age - Usia NPC.
     * @returns {import('./gameData.js').NpcLifeStage}
     */
    getLifeStageDefinition(age) {
        for (const stage of NPC_LIFESTAGES) {
            if (age >= stage.minAge && (stage.maxAge === Infinity || age <= stage.maxAge)) {
                return stage;
            }
        }
        return NPC_LIFESTAGES[NPC_LIFESTAGES.length - 1];
    },

    /**
     * Mendapatkan definisi Health State berikutnya dalam urutan penurunan.
     * @param {string} currentHealthStateId - ID healthState saat ini.
     * @returns {string|null} ID healthState berikutnya atau null jika sudah yang terburuk.
     */
    getNextHealthStateId(currentHealthStateId) {
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
     * Mendapatkan definisi Health State sebelumnya dalam urutan peningkatan.
     * @param {string} currentHealthStateId - ID healthState saat ini.
     * @returns {string|null} ID healthState sebelumnya atau null jika sudah yang terbaik.
     */
    getPrevHealthStateId(currentHealthStateId) {
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
     * Mengelola transisi siklus kosmik, memperbarui efek global.
     * Dipanggil setiap hari oleh loop game utama.
     */
    advanceCosmicCycle: () => {
        if (!dbInstance.world.cosmicCycle) {
            dbInstance.world.cosmicCycle = {
                currentCycleId: COSMIC_CYCLES.ECHOING_SLUMBER.id,
                daysInCycle: 0
            };
            console.log(`[${gameTime.getCurrentDate().toLocaleDateString()}] Cosmic cycle initialized to ${COSMIC_CYCLES.ECHOING_SLUMBER.name}.`);
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
            addToWandererChronicle(dbInstance.wanderer, { // Pass wanderer instance
                type: 'world_event',
                title: 'Pergeseran Siklus Kosmik',
                description: `Dunia telah memasuki fase ${nextCycle.name}. Udara terasa berbeda...`,
                timestamp: gameTime.getCurrentDate().toISOString(),
                icon: nextCycle.eventIcon || (nextCycle.effects.worldVisualTheme === 'bright' ? 'sparkles' : 'moon')
            });
            console.log(`[${gameTime.getCurrentDate().toLocaleDateString()}] Cosmic cycle transitioned to ${nextCycle.name}.`);
        }
    },

    /**
     * Menerapkan efek siklus kosmik ke mekanisme game yang relevan.
     * @returns {import('./gameData.js').CosmicCycleEffect} Efek siklus saat ini.
     */
    getCurrentCosmicCycleEffects: () => {
        if (!dbInstance.world.cosmicCycle) return {};
        return COSMIC_CYCLES[dbInstance.world.cosmicCycle.currentCycleId]?.effects || {};
    },

    /**
     * Menstimulasi progres harian NPC.
     */
    async simulateNpcProgress() {
        const npcSouls = dbInstance.npc_souls;
        const now = gameTime.getCurrentDate();
        let changesMade = false;

        // Reset faction influence for all regions at the start of simulation
        for (const factionId in dbInstance.world.factions) {
            for (const regionId in dbInstance.world.regions) {
                dbInstance.world.factions[factionId].influence[regionId] = 0;
            }
        }

        for (const npcId in npcSouls) { // Iterate by ID
            const npc = npcSouls[npcId];
            const lastSimulatedDate = npc.lastSimulatedDate ? new Date(npc.lastSimulatedDate) : null;

            // Simulate only once per day
            if (!lastSimulatedDate || lastSimulatedDate.getDate() !== now.getDate() ||
                lastSimulatedDate.getMonth() !== now.getMonth() ||
                lastSimulatedDate.getFullYear() !== now.getFullYear()) {

                // --- 0. Inisialisasi Properti NPC (jika belum ada) ---
                if (!npc.healthState) npc.healthState = NPC_HEALTH_STATES.NORMAL.id;
                if (npc.currentHealth === undefined || npc.currentHealth > 100 || npc.currentHealth < 0) npc.currentHealth = 100;
                if (!npc.age) npc.age = Math.floor(Math.random() * 40) + 18;
                if (!npc.lifeStage) npc.lifeStage = WorldManager.getLifeStageDefinition(npc.age).stage;
                if (!npc.currentRegion) {
                    const regionIds = Object.keys(REGIONS_DATA);
                    npc.currentRegion = regionIds[Math.floor(Math.random() * regionIds.length)]; // Assign random region
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
                if (npc.influenceScore === undefined) npc.influenceScore = 10; // Default influence

                // Ambil definisi saat ini
                const currentRegion = dbInstance.world.regions[npc.currentRegion];
                // Ensure region status is based on REGIONS_DATA initialNexusState if currentRegion.status not yet set
                const nexusStateId = currentRegion?.status || REGIONS_DATA[npc.currentRegion]?.initialNexusState || 'NORMAL';
                const nexusStateDef = NEXUS_STATES[nexusStateId.toUpperCase()];
                const currentHealthStateDef = NPC_HEALTH_STATES[npc.healthState.toUpperCase()];
                const currentLifeStageDef = WorldManager.getLifeStageDefinition(npc.age);
                const cosmicEffects = WorldManager.getCurrentCosmicCycleEffects();

                // --- 1. Age and Life Stage Progression ---
                npc.age += (1 / 365);
                const newLifeStageDef = WorldManager.getLifeStageDefinition(npc.age);
                if (newLifeStageDef.stage !== npc.lifeStage) {
                    console.log(`[${now.toLocaleDateString()}] ${npc.name} (${npc.id}) transitioned from ${npc.lifeStage} to ${newLifeStageDef.stage} at age ${Math.floor(npc.age)}.`);
                    npc.lifeStage = newLifeStageDef.stage;
                    addToWandererChronicle(dbInstance.wanderer, {
                        type: 'npc_lifestage_change',
                        title: 'Perubahan Hidup NPC',
                        description: `${npc.name} kini berada pada tahap ${npc.lifeStage}nya.`,
                        timestamp: now.toISOString(),
                        icon: 'baby'
                    });
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
                effectiveDecayRate *= (cosmicEffects.npcHealthDecayModifier || 1);

                npc.currentHealth -= (effectiveDecayRate * 100);
                npc.currentHealth += (effectiveRegenRate * 100);
                npc.currentHealth = Math.max(0, Math.min(100, npc.currentHealth));

                const healthStateOrder = [
                    NPC_HEALTH_STATES.VIBRANT.id,
                    NPC_HEALTH_STATES.NORMAL.id,
                    NPC_HEALTH_STATES.FRAIL.id,
                    NPC_HEALTH_STATES.CORRUPTED.id
                ];
                const currentIndex = healthStateOrder.indexOf(npc.healthState);

                const oldHealthState = npc.healthState;
                const nextHealthStateId = WorldManager.getNextHealthStateId(npc.healthState);
                const prevHealthStateId = WorldManager.getPrevHealthStateId(npc.healthState);

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
                // Example: NPC reacts to death of a related NPC
                for (const rel of npc.relationships) {
                    const relatedNpc = npcSouls[rel.npcId];
                    if (relatedNpc && relatedNpc.healthState === 'dead' && !rel.mourned) { // Check if 'dead' and not yet mourned
                        // Placeholder: affect mental state, temporary debuff, trigger specific dialogue
                        // npc.mentalState = 'traumatized';
                        // UIManager.showNotification(`${npc.name} berduka atas kematian ${relatedNpc.name}.`, 'frown', 'info', 3000, true);
                        rel.mourned = true; // Mark as mourned to prevent repeated triggers
                        changesMade = true;
                    }
                }

                // Example: Role-based impact (this part would usually be more complex AI)
                // If the NPC is a merchant, they might adjust local prices (placeholder)
                // if (npc.role === NPC_ROLES.MERCHANT.id && currentRegion.market) {
                //     currentRegion.market.priceModifier += NPC_ROLES.MERCHANT.economicImpact.buyPriceModifier;
                //     changesMade = true;
                // }
                // Example: NPC movement based on daily routine (simplified placeholder)
                // const currentRoutineStep = NPC_ROLES[npc.role].typicalDailyRoutine[gameTime.getCurrentDate().getHours() % NPC_ROLES[npc.role].typicalDailyRoutine.length];
                // if (npc.currentActivity !== currentRoutineStep) {
                //    npc.currentActivity = currentRoutineStep;
                //    // Logic to move NPC to relevant location for this activity
                //    changesMade = true;
                // }


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

                    delete npcSouls[npcId]; // Remove NPC by its ID key

                    // Trigger journal entry for NPC death (if applicable)
                    const journalEntry = JOURNAL_ENTRY_TEMPLATES[`journal_npc_death_${deathCauseType}`]; // Assuming templates exist
                    if (journalEntry) {
                         addToWandererChronicle(dbInstance.wanderer, { // Pass the current Wanderer
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
                                title: `Gema Kematian: ${npc.name}`,
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
                    continue;
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
                        triggerWhisperEvent(newWhisper); // Assuming eventManager exists
                        npc.lastWhisperTriggerDate = now.toISOString();
                        changesMade = true;
                    }

                    if (currentHealthStateDef.environmentalCorruptionImpact > 0 && currentRegion) {
                        const corruptionIncrease = currentHealthStateDef.environmentalCorruptionImpact * nexusStateDef.corruptionGrowthFactor;
                        currentRegion.currentEcho = Math.min(1000, currentRegion.currentEcho + (corruptionIncrease * 100)); // Scale to 1000
                        changesMade = true;
                    }
                }

                // --- 5. Faction Influence Contribution ---
                if (npc.factionAffiliation && npc.currentRegion && dbInstance.world.factions[npc.factionAffiliation]) {
                    dbInstance.world.factions[npc.factionAffiliation].influence[npc.currentRegion] =
                        (dbInstance.world.factions[npc.factionAffiliation].influence[npc.currentRegion] || 0) + (npc.influenceScore || 1);
                    changesMade = true;
                }

                // --- 6. Reputation Fading (Passive) ---
                if (npc.reputation !== undefined && npc.reputation < 0) { // Only fade negative reputation
                    const lastChangeDate = new Date(npc.lastReputationChangeDate);
                    const daysSinceLastChange = Math.floor((now - lastChangeDate) / (1000 * 60 * 60 * 24));
                    let reputationGained = 0;
                    let cooldownPeriod = 0;

                    if (npc.reputation >= -25 && npc.reputation < 0) { // Slightly disliked to neutral
                        cooldownPeriod = 3;
                    } else if (npc.reputation >= -50 && npc.reputation < -25) { // Disliked
                        cooldownPeriod = 7;
                    } else { // Hostile
                        cooldownPeriod = 14;
                        // For hostile, also add a small random chance to prevent guaranteed fade
                        if (daysSinceLastChange >= cooldownPeriod && Math.random() < 0.05) {
                            reputationGained = 1; // Only gain 1 at a time for very hostile
                        } else if (daysSinceLastChange < cooldownPeriod) {
                            reputationGained = 0; // No fade if within cooldown
                        }
                    }

                    if (cooldownPeriod > 0 && daysSinceLastChange >= cooldownPeriod && reputationGained === 0) { // If not very hostile and cooldown passed
                         reputationGained = Math.floor(daysSinceLastChange / cooldownPeriod);
                    }

                    if (reputationGained > 0) {
                        const oldRep = npc.reputation;
                        npc.reputation = Math.min(0, npc.reputation + reputationGained); // Cap at 0 (Neutral)
                        if (npc.reputation !== oldRep) { // Only update if actual change occurred
                            npc.lastReputationChangeDate = now.toISOString();
                            changesMade = true;
                        }
                    }
                }

                npc.lastSimulatedDate = now.toISOString();
                changesMade = true;
            }
        }
        
        // 7. NPC Birth Logic (Population Growth)
        const totalIntentionInSanctums = Object.values(dbInstance.world.regions)
            .filter(r => r.status === 'SANCTUM') // Use 'SANCTUM' as per NEXUS_STATES
            .reduce((sum, r) => sum + r.currentIntention, 0);

        if (totalIntentionInSanctums > 800 && Object.values(dbInstance.npc_souls).length < 200) { // Max 200 NPCs
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
                changesMade = true;
                addToWandererChronicle(dbInstance.wanderer, {
                    type: CHRONICLE_EVENTS.NEW_NPC_BORN.type,
                    title: CHRONICLE_EVENTS.NEW_NPC_BORN.template,
                    description: CHRONICLE_EVENTS.NEW_NPC_BORN.template.replace('{regionName}', dbInstance.wanderer.currentRegion),
                    timestamp: now.toISOString(),
                    icon: 'baby'
                });
            }
        }

        // 8. Determine Dominant Factions per region and trigger narrative events
        for (const regionId in dbInstance.world.regions) {
            const region = dbInstance.world.regions[regionId];
            let maxInfluence = 0;
            let dominantFactionId = 'Neutral';

            // Calculate current influence from active NPCs
            for (const factionId in dbInstance.world.factions) {
                const influence = (dbInstance.world.factions[factionId].influence[regionId] || 0);
                if (influence > maxInfluence) {
                    maxInfluence = influence;
                    dominantFactionId = factionId;
                }
            }
            region.dominantFaction = dominantFactionId;

            // Trigger faction war if specific conditions met (e.g., Maelstrom + contested influence)
            if (region.status === 'MAELSTROM' && Math.random() < 0.05) { // 5% chance in Maelstrom
                const factionsInRegion = Object.keys(dbInstance.world.factions).filter(fid => dbInstance.world.factions[fid].influence[regionId] > 0);
                if (factionsInRegion.length >= 2) {
                    const faction1 = factionsInRegion[Math.floor(Math.random() * factionsInRegion.length)];
                    let faction2 = faction1;
                    while (faction2 === faction1) { // Ensure faction2 is different
                        faction2 = factionsInRegion[Math.floor(Math.random() * factionsInRegion.length)];
                    }

                    // Check for rivalry relationship
                    if (FACTIONS_DATA[faction1]?.relationships[faction2] === 'rivalry' ||
                        FACTIONS_DATA[faction2]?.relationships[faction1] === 'rivalry') {
                        // Check if a war between these factions isn't already active
                        const warAlreadyActive = dbInstance.world.globalEvents.some(event =>
                            event.id.startsWith('FACTION_WAR') &&
                            event.options.targetRegionId === regionId &&
                            ((event.options.targetFactionIds[0] === faction1 && event.options.targetFactionIds[1] === faction2) ||
                             (event.options.targetFactionIds[0] === faction2 && event.options.targetFactionIds[1] === faction1))
                        );

                        if (!warAlreadyActive) {
                            console.log(`War Event triggered in ${region.name} between ${faction1} and ${faction2}!`);
                            // Simulate a random winner for now
                            const winningFaction = Math.random() < 0.5 ? faction1 : faction2;
                            await this.triggerGlobalWorldEvent('FACTION_WAR', {
                                targetRegionId: regionId,
                                targetFactionIds: [faction1, faction2],
                                winningFactionId: winningFaction // Pass winner for consequences
                            });
                            changesMade = true;
                        }
                    }
                }
            }
        }

        // 9. Dynamic Resource Multipliers (Placeholder, can be influenced by Forger)
        if (!dbInstance.world.resourceMultipliers) {
            dbInstance.world.resourceMultipliers = {};
            for(const resType of ['material', 'consumable', 'artifact', 'resource']) {
                dbInstance.world.resourceMultipliers[resType] = {};
                for(const regionId in dbInstance.world.regions) {
                    dbInstance.world.resourceMultipliers[resType][regionId] = 1.0;
                }
            }
        }

        // Apply cosmic cycle effects to general resource multipliers (example)
        const currentCosmicEffects = WorldManager.getCurrentCosmicCycleEffects();
        if (currentCosmicEffects.resourceSpawnRateMultiplier) {
            for (const regionId in dbInstance.world.regions) {
                for(const resType in dbInstance.world.resourceMultipliers) {
                    dbInstance.world.resourceMultipliers[resType][regionId] *= currentCosmicEffects.resourceSpawnRateMultiplier;
                    dbInstance.world.resourceMultipliers[resType][regionId] = Math.max(0.5, Math.min(2.0, dbInstance.world.resourceMultipliers[resType][regionId])); // Clamp
                }
            }
            changesMade = true;
        }

        if (changesMade) {
            console.log("NPC progress simulated for today, including births/deaths, faction dynamics, and reputation fading.");
            await saveDBInstanceRef(false); // Save dbInstance, not just part of it
        }
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

            const initialAge = Math.floor(Math.random() * 50) + 1; // Broader age range
            const initialLifeStage = WorldManager.getLifeStageDefinition(initialAge).stage;
            const initialHealthState = Math.random() < 0.1 ? NPC_HEALTH_STATES.FRAIL.id : NPC_HEALTH_STATES.NORMAL.id;

            const personalityTraits = [];
            for(let j=0; j<Math.floor(Math.random()*3)+1; j++) { // 1 to 3 random traits
                personalityTraits.push(allTraits[Math.floor(Math.random() * allTraits.length)].id);
            }

            const chosenRole = allRoles[Math.floor(Math.random() * allRoles.length)];

            // Assign faction: prioritize dominant region faction, else random
            let factionAffiliation = chosenRegionData?.dominantFaction || FACTIONS_DATA[Object.keys(FACTIONS_DATA)[Math.floor(Math.random() * Object.keys(FACTIONS_DATA).length)]].id;


            newNpcs[`npc_${randomName.toLowerCase().replace(/\s/g, '-')}_${Math.random().toString(36).substring(2, 5)}`] = {
                id: `npc_${randomName.toLowerCase().replace(/\s/g, '-')}_${Math.random().toString(36).substring(2, 5)}`,
                name: randomName,
                role: chosenRole.id, // Assigned role
                archetype: null, // NPCs don't have archetypes like Wanderer
                mantra: `mantra-${randomName.toLowerCase().replace(/\s/g, '-')}`,
                soulRank: 1,
                title: "Warga",
                xp: 0,
                alignment: {
                    echo: Math.floor(Math.random() * 100), // 0-100
                    intention: Math.floor(Math.random() * 100) // 0-100
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
                chronicle: [], // NPC has own chronicle
                ledger: { transactions: [] },
                lastSimulatedDate: new Date().toISOString(),
                age: initialAge,
                lifeStage: initialLifeStage,
                healthState: initialHealthState,
                currentHealth: 100,
                personalityTraits: [...new Set(personalityTraits)], // Ensure unique traits
                factionAffiliation: factionAffiliation,
                influenceScore: Math.floor(Math.random() * 50) + 10, // Initial influence score
                currentRegion: randomRegionId,
                reputation: FACTIONS_DATA[factionAffiliation]?.baseReputation !== undefined ? FACTIONS_DATA[factionAffiliation].baseReputation : 0, // Set base reputation
                lastReputationChangeDate: new Date().toISOString(),
                relationships: [] // Initialize empty relationships
            };
        }
        if (!dbInstance.npc_souls) dbInstance.npc_souls = {};
        Object.assign(dbInstance.npc_souls, newNpcs); // Add new NPCs

        await saveDBInstanceRef(false);
        UIManager.hideLoading();
        console.log(`${count} NPC souls generated and added.`);
    },

    /**
     * Memperbarui resonansi dunia dan Nexus regional.
     */
    async updateWorldResonance() {
        // Ensure regions and factions are initialized
        if (!dbInstance.world.regions || Object.keys(dbInstance.world.regions).length === 0) {
            WorldManager.setDependencies(dbInstance, DB_DOC_ID_Instance, saveDBInstanceRef); // Re-initialize if empty
        }
        
        const allSouls = [
            dbInstance.wanderer, // Assuming there's always one Wanderer for now
            ...Object.values(dbInstance.npc_souls || {})
        ];
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
                    globalResonanceStatus = 'Balanced Resonance'; // Explicitly set for clarity
                }
            } else {
                globalResonanceStatus = 'Balanced Resonance'; // If no souls, it's balanced
            }
        }

        if (dbInstance.world.currentResonanceStatus !== globalResonanceStatus) {
            dbInstance.world.currentResonanceStatus = globalResonanceStatus;
            // No direct DB update here, saveDBInstanceRef will handle it later
            console.log(`World Global Resonance Updated to: ${dbInstance.world.currentResonanceStatus}`);
            WorldManager.applyWorldAtmosphere();
        } else {
            WorldManager.applyWorldAtmosphere(); // Still apply atmosphere even if status hasn't changed
        }
        
        for (const regionId in dbInstance.world.regions) {
            const region = dbInstance.world.regions[regionId];
            
            let localIntentionInfluence = 0;
            let localEchoInfluence = 0;

            allSouls.filter(s => s.currentRegion === regionId).forEach(s => {
                localIntentionInfluence += (s.alignment?.intention || 0) * 0.1;
                localEchoInfluence += (s.alignment?.echo || 0) * 0.1;
            });

            // Initialize if undefined
            if (region.currentIntention === undefined) region.currentIntention = 500;
            if (region.currentEcho === undefined) region.currentEcho = 500;

            if (globalResonanceStatus === 'Harmonious Resonance') {
                region.currentIntention = Math.min(1000, region.currentIntention + 20 + localIntentionInfluence);
                region.currentEcho = Math.max(0, region.currentEcho - 10 + localEchoInfluence);
            } else if (globalResonanceStatus === 'Discordant Resonance') {
                region.currentIntention = Math.max(0, region.currentIntention - 20 + localIntentionInfluence);
                region.currentEcho = Math.min(1000, region.currentEcho + 20 + localEchoInfluence);
            } else { // Balanced, tend towards 500
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
                region.status = 'SANCTUM'; // Use actual Nexus state IDs
            } else if (region.currentEcho > region.currentIntention * 1.5) {
                region.status = 'MAELSTROM'; // Use actual Nexus state IDs
            } else {
                region.status = 'NORMAL'; // Use actual Nexus state IDs
            }
        }
        // No direct DB update here, saveDBInstanceRef will handle it later
        WorldManager.renderRegionsStatus(); // Update Forger UI
    },

    // Fungsi untuk menerapkan atmosfer dunia (perubahan visual)
    applyWorldAtmosphere() {
        const body = document.body;
        body.classList.remove('theme-dark', 'theme-bright', 'theme-unstable', 'theme-normal'); // Remove general themes
        body.classList.remove('world-harmonious', 'world-discordant', 'world-balanced'); // Remove resonance themes

        const currentCosmicTheme = WorldManager.getCurrentCosmicCycleEffects().worldVisualTheme || 'normal';
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
        WorldManager.updateResonanceDisplay();
        WorldManager.updateLoginCanvasAtmosphere(resonanceStatus);
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
        const resonanceIconElement = document.querySelector('#world-resonance-display i'); // Changed to i for Lucide

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
            resonanceIconElement.setAttribute('data-feather', iconName); // Set data-feather attribute
            feather.replace(); // Re-render icon
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
        // No direct DB update, saveDBInstanceRef handles it
        WorldManager.updateWorldResonance();
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
        // No direct DB update, saveDBInstanceRef handles it
        WorldManager.updateWorldResonance();
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
            if (region.status === 'SANCTUM') { // Use constant
                statusClass = 'text-emerald-400';
            } else if (region.status === 'MAELSTROM') { // Use constant
                statusClass = 'text-red-400';
            }
            let factionName = region.dominantFaction ? WorldManager.getFactionName(region.dominantFaction) : 'None';

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
        container.innerHTML = html; // Directly set innerHTML
        if (typeof feather !== 'undefined' && feather.replace) { // Ensure icons are rendered
            feather.replace();
        }
    },

    /**
     * Memicu event perang regional secara naratif.
     * @param {string} regionId - ID wilayah tempat perang terjadi.
     * @param {string} winningFactionId - ID faksi pemenang.
     * @param {string} losingFactionId - ID faksi yang kalah.
     * @returns {Promise<void>}
     */
    async triggerRegionalWar(regionId, winningFactionId, losingFactionId) {
        const region = dbInstance.world.regions[regionId];
        if (!region) {
            console.error(`Region ${regionId} not found for war event.`);
            return;
        }

        const event = {
            id: `war_event_${Date.now()}`,
            type: 'regional_war',
            region: region.name,
            winningFaction: WorldManager.getFactionName(winningFactionId),
            losingFaction: WorldManager.getFactionName(losingFactionId),
            timestamp: gameTime.getCurrentDate().toISOString(),
            description: `Sebuah konflik besar meletus di ${region.name} antara ${WorldManager.getFactionName(winningFactionId)} dan ${WorldManager.getFactionName(losingFactionId)}.`
        };
        dbInstance.world.globalEvents.push(event);

        let narrativeDescription = '';
        // Assuming faction types or alignments for Nexus impact
        if (FACTIONS_DATA[winningFactionId]?.type === 'religious' && FACTIONS_DATA[winningFactionId]?.name.includes('Luminous')) {
            region.currentIntention = Math.min(1000, region.currentIntention + 200);
            region.currentEcho = Math.max(0, region.currentEcho - 100);
            narrativeDescription = `Para pejuang ${WorldManager.getFactionName(winningFactionId)} meraih kemenangan gemilang di ${region.name}, mengusir kegelapan Gema dan menegaskan dominasi Niat. Nexus wilayah itu bersinar terang.`;
        } else if (FACTIONS_DATA[winningFactionId]?.type === 'religious' && FACTIONS_DATA[winningFactionId]?.name.includes('Echo')) {
            region.currentEcho = Math.min(1000, region.currentEcho + 200);
            region.currentIntention = Math.max(0, region.currentIntention - 100);
            narrativeDescription = `Faksi ${WorldManager.getFactionName(winningFactionId)} menguasai ${region.name} dalam pertempuran brutal, menyebarkan bayangan Gema dan menenggelamkan harapan. Nexus wilayah itu merana dalam kegelapan.`;
        } else { // Neutral or other faction type wins
            narrativeDescription = `Sebuah pergolakan faksi mengguncang ${region.name}. ${WorldManager.getFactionName(winningFactionId)} berhasil menegaskan kendali.`;
            // Minor impact if neutral faction wins
            region.currentIntention = Math.max(0, region.currentIntention - 50);
            region.currentEcho = Math.max(0, region.currentEcho - 50);
        }
        region.dominantFaction = winningFactionId;

        // Record for all Wanderers
        for (const wandererId in dbInstance.wanderers) {
            addToWandererChronicle(dbInstance.wanderers[wandererId], {
                type: CHRONICLE_EVENTS.FACTION_RELATIONSHIP_CHANGE.type, // Use generic relation change
                title: `Perang Wilayah di ${region.name}`,
                description: narrativeDescription,
                timestamp: gameTime.getCurrentDate().toISOString(),
                icon: 'swords'
            });
        }
        
        UIManager.showNotification(`PERINGATAN: Perang Faksi di ${region.name}! Pemenang: ${WorldManager.getFactionName(winningFactionId)}!`, 'zap', 'error');
        WorldManager.updateWorldResonance();
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

        // Handle Forger Choice Prompt
        if (eventDef.consequences.forgerChoicePrompt) {
            const prompt = eventDef.consequences.forgerChoicePrompt;
            // Replace placeholders in prompt text
            let promptText = prompt.text.replace('{targetRegionName}', options.targetRegionName || 'wilayah yang tidak dikenal');
            
            const modalButtons = prompt.choices.map(choice => ({
                text: choice.text,
                onClick: async () => {
                    UIManager.closeModal();
                    // Apply consequences of the chosen option
                    await WorldManager._applyEventConsequences(choice.consequence, eventId, options);
                }
            }));
            UIManager.showModal(eventDef.name, promptText, modalButtons);
            return; // Exit here, consequences applied after choice
        }

        // If no Forger choice, apply direct consequences
        await WorldManager._applyEventConsequences(eventDef.consequences, eventId, options);
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

        // Apply Consequences
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
                chronicleDescription = chronicleDescription.replace('{targetRegionName}', WorldManager.getRegionName(options.targetRegionId));
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
                if (index === 0) chronicleDescription = chronicleDescription.replace('{faction1Name}', WorldManager.getFactionName(factionId));
                if (index === 1) chronicleDescription = chronicleDescription.replace('{faction2Name}', WorldManager.getFactionName(factionId));
            });
        }

        if (consequences.spawnEnemies && options.targetRegionId) {
            consequences.spawnEnemies.forEach(spawnDef => {
                // Placeholder for spawning logic. Will use CREATURES_DATA.
                const creatureData = CREATURES_DATA[spawnDef.enemyId];
                if (creatureData) {
                    console.log(`Spawning ${spawnDef.quantity}x ${creatureData.name} in ${spawnDef.regionId}.`);
                    // Example: Add to a temporary spawn list for renderer
                    // dbInstance.world.pendingSpawns.push({ ...spawnDef, creatureData: creatureData });
                }
            });
        }

        if (consequences.modifyLandmarks && options.targetRegionId) { // Check if specific landmark in options, otherwise apply to region's landmarks
            consequences.modifyLandmarks.forEach(modDef => {
                const landmarkToModify = modDef.landmarkId ? dbInstance.world.landmarks[modDef.landmarkId] :
                                         (options.targetLandmarkId ? dbInstance.world.landmarks[options.targetLandmarkId] : null);
                
                if (landmarkToModify) {
                    landmarkToModify.currentStatus = modDef.newStatus;
                    landmarkToModify.visualEffect = modDef.visualEffect;
                    console.log(`Landmark ${landmarkToModify.name} transformed to ${modDef.newStatus}.`);
                    chronicleDescription = chronicleDescription.replace('{targetLandmarkName}', landmarkToModify.name);
                    chronicleDescription = chronicleDescription.replace('{newStatusDescription}', modDef.newStatus.replace(/_/g, ' '));

                    // Trigger journal entry if landmark status changes
                    const journalEntry = JOURNAL_ENTRY_TEMPLATES.LANDMARK_STATUS_CHANGE;
                    if (journalEntry) {
                        addToWandererChronicle(dbInstance.wanderer, {
                            type: journalEntry.category,
                            title: journalEntry.title,
                            description: typeof journalEntry.content === 'function' ? journalEntry.content({
                                landmarkName: landmarkToModify.name,
                                regionName: WorldManager.getRegionName(landmarkToModify.regionId),
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
            // Apply resource impact to region's resource multipliers
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

        // Record event in global history/chronicle
        for (const wandererId in dbInstance.wanderers) {
            addToWandererChronicle(dbInstance.wanderers[wandererId], {
                type: GLOBAL_WORLD_EVENTS[eventId].type || 'global_world_event',
                title: chronicleTitle,
                description: chronicleDescription,
                timestamp: gameTime.getCurrentDate().toISOString(),
                icon: GLOBAL_WORLD_EVENTS[eventId].eventIcon
            });
        }
        
        // This save should be handled by the main App loop periodically to avoid excessive writes
        // However, for immediate visual feedback, if a direct impact event, it might be beneficial
        // to manually trigger a save or relevant UI update.
        await saveDBInstanceRef(false); // Request a save from App
        WorldManager.updateWorldResonance(); // Update resonance after Nexus changes
    }
};

// --- Initial Placeholder Data for dbInstance (if not set by main.js) ---
// This block ensures WorldManager functions can be called even if the full App.init hasn't run
// It should typically be removed or adjusted for a production environment
if (typeof dbInstance === 'undefined' || dbInstance === null) {
    console.warn("dbInstance not set in WorldManager, initializing placeholder data for testing WorldManager functions directly.");
    // Initializing dbInstance and its nested properties
    dbInstance = {
        world: {
            regions: JSON.parse(JSON.stringify(REGIONS_DATA)), // Use actual REGIONS_DATA
            factions: JSON.parse(JSON.stringify(FACTIONS_DATA)), // Use actual FACTIONS_DATA
            landmarks: JSON.parse(JSON.stringify(WORLD_LANDMARKS)), // Use actual WORLD_LANDMARKS
            totalLegacyPoints: 0,
            globalEvents: [],
            notificationLog: [],
            cosmicCycle: {
                currentCycleId: COSMIC_CYCLES.ECHOING_SLUMBER.id,
                daysInCycle: 0
            },
            worldObjects: [], // For NPC remains etc.
            resourceMultipliers: {} // For resource impacts
        },
        wanderer: {
            id: 'wanderer_main',
            name: 'Wanderer Utama',
            reputation: {},
            currentRegion: 'TheCentralNexus',
            chronicle: [],
            alignment: { echo: 50, intention: 50 },
            inventory: []
            // ... other wanderer properties needed by functions ...
        },
        npc_souls: {} // Will be populated by generateInitialNpcs
    };

    // Initialize influence for all factions and regions
    for (const factionId in dbInstance.world.factions) {
        dbInstance.world.factions[factionId].influence = {};
        for (const regionId in dbInstance.world.regions) {
            dbInstance.world.factions[factionId].influence[regionId] = 0;
        }
    }
    // Initialize currentStatus for landmarks
    for (const landmarkId in dbInstance.world.landmarks) {
        dbInstance.world.landmarks[landmarkId].currentStatus = dbInstance.world.landmarks[landmarkId].initialStatus;
    }
    // Initialize currentEcho/Intention and status for regions
     for (const regionId in dbInstance.world.regions) {
        const region = dbInstance.world.regions[regionId];
        region.currentEcho = 500;
        region.currentIntention = 500;
        region.status = region.initialNexusState || 'NORMAL';
    }


    DB_DOC_ID_Instance = 'placeholder_doc_id';
    saveDBInstanceRef = async (updateFirebase) => {
        // Mock save function for development/testing
        console.log('WorldManager: Placeholder saveDBInstanceRef called.');
        if (updateFirebase) {
            // Simulate a database update
            // await updateDocument("saga_worlds", DB_DOC_ID_Instance, dbInstance);
        }
    };

    // Mock UIManager, gameTime, etc. if not provided by main.js
    if (typeof UIManager === 'undefined') window.UIManager = { showLoading: console.log, hideLoading: console.log, showError: console.error, showNotification: console.log, closeModal: console.log, showModal: console.log };
    if (typeof gameTime === 'undefined') window.gameTime = { getCurrentDate: () => new Date(), advanceDay: () => { /* no-op */ } };
    if (typeof triggerWhisperEvent === 'undefined') window.triggerWhisperEvent = (whisper) => console.log('Mock Whisper Triggered:', whisper.name);
    if (typeof addToWandererChronicle === 'undefined') window.addToWandererChronicle = (wanderer, entry) => {
        if (!wanderer.chronicle) wanderer.chronicle = [];
        wanderer.chronicle.push(entry);
        console.log('Mock Chronicle Entry Added:', entry.title);
    };
    if (typeof updateDocument === 'undefined') window.updateDocument = async (col, doc, data) => console.log('Mock updateDocument:', col, doc, data);

    // Initial NPC generation for testing purposes if not already done by App.init
    WorldManager.generateInitialNpcs(5, false); // Generate some initial NPCs for testing
}
