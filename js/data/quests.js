// js/data/quests.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-27, 12:37 WITA ==
// == PERIHAL: Refactoring GameData.js - Pemindahan Data Misi ke quests.js ==
// - Menampung semua data statis terkait tipe misi, kondisi gagal, rantai misi, dll.
// ===========================================

/**
 * @typedef {object} QuestReward
 * @property {number | function} [xp] - Jumlah XP yang diberikan. Bisa berupa angka atau fungsi (menerima difficulty).
 * @property {object | function} [item] - Item yang diberikan. { id: string, quantity: number | function }. Kuantitas bisa fungsi. Item ID bisa fungsi.
 * @property {number} [reputationDelta] - Perubahan reputasi dengan NPC pemberi misi.
 * @property {string} [factionId] - ID faksi yang reputasinya dipengaruhi (opsional).
 * @property {number} [factionReputationDelta] - Perubahan reputasi dengan faksi (opsional).
 * @property {string} [wandererTrait] - Trait yang diberikan kepada Wanderer (opsional).
 * @property {number} [essenceGain] - Perolehan Essence.
 */

/**
 * @typedef {object} QuestConditions
 * @property {string} [requiredNpcTrait] - NPC harus memiliki trait ini.
 * @property {number} [minReputationToOffer] - Reputasi minimum Wanderer untuk menerima misi ini.
 * @property {string} [nexusState] - Nexus State wilayah saat misi ditawarkan ('MAELSTROM', 'SANCTUM', 'NORMAL', 'UNSTABLE').
 * @property {string} [timeOfDay] - Waktu dalam game saat misi bisa ditawarkan ('day', 'night', 'any').
 * @property {string} [weather] - Cuaca saat misi bisa ditawarkan (placeholder).
 * @property {string} [regionId] - ID wilayah tempat misi ditawarkan.
 * @property {string} [questPrerequisite] - Quest lain yang harus diselesaikan sebelum ini.
 * @property {number} [playerLevelMin] - Level Wanderer minimum untuk menerima misi.
 * @property {string} [targetLandmarkId] - Misi terkait dengan landmark tertentu.
 */

/**
 * @typedef {object} GenericQuestType
 * @property {string} id - ID unik.
 * @property {string | function} name - Nama misi. Bisa berupa string atau fungsi yang mengembalikan string (menerima generatedDetails).
 * @property {string | function} description - Deskripsi singkat. Bisa berupa string atau fungsi yang mengembalikan string (menerima npc, wanderer, world, questState).
 * @property {string | function} objectiveTemplate - Template string untuk tujuan. Bisa berupa string atau fungsi (menerima generatedDetails).
 * @property {QuestReward} rewardSchema - Objek yang mendefinisikan hadiah.
 * @property {QuestConditions} [conditions] - Kapan misi ini bisa ditawarkan.
 * @property {string[]} [requiredItemTypes] - Tipe item yang relevan untuk misi ini (misal: ['material']).
 * @property {number} [baseDifficulty] - Tingkat kesulitan dasar.
 * @property {'fetch' | 'delivery' | 'hunt' | 'explore' | 'escort' | 'cleanse'} type - Tipe misi.
 * @property {string[]} [targetCreatureTypes] - Tipe makhluk untuk misi 'hunt'.
 * @property {string[]} [targetLandmarkTypes] - Tipe landmark untuk misi 'explore'/'cleanse'.
 */
export const GENERIC_QUEST_TYPES = {
    "fetch_item_basic": {
        id: "fetch_item_basic",
        name: (details) => `Kumpulkan ${details.itemName || 'Item'}`,
        description: (npc, wanderer, world, questState) => `Seorang warga membutuhkan ${questState.quantity} ${questState.itemName} untuk keperluan mendesak.`,
        objectiveTemplate: (questState) => `Kumpulkan ${questState.quantity}x ${questState.itemName}`,
        rewardSchema: {
            xp: (difficulty) => 25 * difficulty,
            item: { id: "gold_coin", quantity: (difficulty) => 5 * difficulty },
            reputationDelta: 5
        },
        conditions: { requiredNpcTrait: "needy" },
        requiredItemTypes: ["material", "consumable"],
        baseDifficulty: 1,
        type: 'fetch'
    },
    "delivery_item_urgent": {
        id: "delivery_item_urgent",
        name: (details) => `Antarkan ${details.itemName || 'Item'} ke ${details.targetNpcName || 'Seseorang'}`,
        description: (npc, wanderer, world, questState) => `Antarkan ${questState.quantity} ${questState.itemName} ke ${questState.targetNpcName || "seseorang"}. Ini sangat penting!`,
        objectiveTemplate: (questState) => `Antarkan ${questState.quantity}x ${questState.itemName} ke ${questState.targetNpcName}`,
        rewardSchema: {
            xp: (difficulty) => 30 * difficulty,
            item: { id: "potion_minor_heal", quantity: 1 },
            reputationDelta: 10
        },
        conditions: { nexusState: "NORMAL" },
        requiredItemTypes: ["tradable"],
        baseDifficulty: 2,
        type: 'delivery'
    },
    "fetch_rare_item": {
        id: "fetch_rare_item",
        name: (details) => `Cari ${details.itemName || 'Item Langka'} yang Hilang`,
        description: (npc, wanderer, world, questState) => `Seorang kolektor mencari ${questState.itemName} langka. Mungkin kau bisa menemukannya?`,
        objectiveTemplate: (questState) => `Temukan ${questState.quantity}x ${questState.itemName} di ${questState.location || 'lokasi yang tidak diketahui'}`,
        rewardSchema: {
            xp: (difficulty) => 50 * difficulty,
            item: { id: "gold_coin", quantity: (difficulty) => 10 * difficulty },
            reputationDelta: 15,
            wandererTrait: "resourceful"
        },
        conditions: { requiredNpcTrait: "collector" },
        requiredItemTypes: ["artifact", "information"],
        baseDifficulty: 3,
        type: 'fetch'
    },
    // NEW Quest Types
    "hunt_creature_basic": {
        id: "hunt_creature_basic",
        name: (details) => `Burulah ${details.quantity} ${details.targetCreatureName}`,
        description: (npc, wanderer, world, questState) => `Makhluk ${questState.targetCreatureName} mengganggu daerah ini. Tolong buru ${questState.quantity} dari mereka.`,
        objectiveTemplate: (questState) => `Buru ${questState.quantity}x ${questState.targetCreatureName}`,
        rewardSchema: {
            xp: (difficulty) => 40 * difficulty,
            item: { id: "gold_coin", quantity: (difficulty) => 8 * difficulty },
            reputationDelta: 8,
            essenceGain: 5
        },
        conditions: { nexusState: "NORMAL", playerLevelMin: 3 },
        targetCreatureTypes: ['wildlife', 'minor_corrupted'],
        baseDifficulty: 2,
        type: 'hunt'
    },
    "explore_landmark_simple": {
        id: "explore_landmark_simple",
        name: (details) => `Jelajahi ${details.targetLandmarkName}`,
        description: (npc, wanderer, world, questState) => `Kami membutuhkan informasi tentang ${questState.targetLandmarkName}. Apakah kau bisa menjelajahinya?`,
        objectiveTemplate: (questState) => `Jelajahi landmark: ${questState.targetLandmarkName}`,
        rewardSchema: {
            xp: (difficulty) => 35 * difficulty,
            item: { id: "ancient_rune", quantity: 1 },
            reputationDelta: 7
        },
        conditions: { requiredNpcTrait: 'explorer', playerLevelMin: 5 },
        targetLandmarkTypes: ['ruins', 'natural'],
        baseDifficulty: 2,
        type: 'explore'
    },
    "cleanse_corrupted_landmark": {
        id: "cleanse_corrupted_landmark",
        name: (details) => `Sucikan ${details.targetLandmarkName}`,
        description: (npc, wanderer, world, questState) => `Energi Gema mencemari ${questState.targetLandmarkName}. Sucikan tempat itu dari korupsi.`,
        objectiveTemplate: (questState) => `Sucikan landmark: ${questState.targetLandmarkName}`,
        rewardSchema: {
            xp: (difficulty) => 75 * difficulty,
            item: { id: "purification_salve", quantity: 1 },
            reputationDelta: 20,
            intentionChange: 10
        },
        conditions: { nexusState: "MAELSTROM", playerLevelMin: 8, targetLandmarkId: '{corrupted_landmark}' },
        targetLandmarkTypes: ['altar', 'dungeon'],
        baseDifficulty: 4,
        type: 'cleanse'
    }
};

/**
 * @typedef {object} QuestObjectiveTemplate
 * @property {string} id - Unique ID of the objective.
 * @property {string} type - Type of objective ('fetch', 'hunt', 'deliver', 'explore', 'cleanse_landmark', 'talk_to_npc', 'craft_item', 'escort_npc', 'defend_location').
 * @property {string | Function} descriptionTemplate - Template description of the objective.
 * @property {string[]} [relatedItemTypes] - Item types that can be target for 'fetch' or 'craft'.
 * @property {string[]} [relatedCreatureTypes] - Creature types that can be target for 'hunt'.
 * @property {string[]} [relatedLandmarkTypes] - Landmark types that can be target for 'explore' or 'cleanse'.
 * @property {string} [targetNpcRole] - Target NPC role for 'talk_to_npc' or 'deliver' or 'escort'.
 */
export const QUEST_OBJECTIVE_TEMPLATES = {
    'collect_material': {
        id: 'collect_material',
        type: 'fetch',
        descriptionTemplate: 'Kumpulkan {quantity}x {itemName} dari {locationType} di {regionName}.',
        relatedItemTypes: ['material', 'resource'],
        locationTypes: ['wild', 'cave', 'forest', 'mine'],
    },
    'hunt_creatures': {
        id: 'hunt_creatures',
        type: 'hunt',
        descriptionTemplate: 'Buru {quantity}x {creatureName} yang berkeliaran di {regionName}.',
        relatedCreatureTypes: ['wildlife', 'corrupted', 'elemental'],
    },
    'deliver_to_npc': {
        id: 'deliver_to_npc',
        type: 'deliver',
        descriptionTemplate: 'Antarkan {itemName} kepada {targetNpcName} di {targetLocation}.',
        relatedItemTypes: ['tradable', 'consumable', 'quest_item'],
        targetNpcRole: 'any',
    },
    'explore_area': {
        id: 'explore_area',
        type: 'explore',
        descriptionTemplate: 'Jelajahi {landmarkName} di {regionName} dan laporkan penemuanmu.',
        relatedLandmarkTypes: ['ruins', 'dungeon', 'natural', 'tower', 'settlement'],
    },
    'cleanse_area': {
        id: 'cleanse_area',
        type: 'cleanse_landmark',
        descriptionTemplate: 'Sucikan {landmarkName} dari korupsi Gema di {regionName}.',
        relatedLandmarkTypes: ['altar', 'dungeon', 'ruins', 'natural'],
    },
    'talk_to_specific_npc': {
        id: 'talk_to_specific_npc',
        type: 'talk_to_npc',
        descriptionTemplate: 'Bicaralah dengan {targetNpcName} di {targetLocation} untuk mendapatkan informasi.',
        targetNpcRole: 'any',
    },
    'craft_item_objective': {
        id: 'craft_item_objective',
        type: 'craft_item',
        descriptionTemplate: 'Buat {quantity}x {itemName} menggunakan material yang kau miliki.',
        relatedItemTypes: ['equipment', 'consumable', 'artifact'],
    },
    'escort_npc_objective': {
        id: 'escort_npc_objective',
        type: 'escort_npc',
        descriptionTemplate: 'Kawali {targetNpcName} dari {startLocation} ke {endLocation}.',
        targetNpcRole: 'any',
    },
    'defend_location_objective': {
        id: 'defend_location_objective',
        type: 'defend_location',
        descriptionTemplate: 'Pertahankan {landmarkName} di {regionName} dari serangan {threatType}.',
        relatedLandmarkTypes: ['town', 'settlement', 'altar'],
        threatTypes: ['bandit_raid', 'echo_assault', 'creature_swarm'],
    }
};


// --- Placeholder for other Quest related data from user prompt ---
// QUEST_FAIL_CONDITIONS - tidak ada di gameData.js yang diberikan sebelumnya.
// QUEST_CHAINS_TEMPLATES - tidak ada di gameData.js yang diberikan sebelumnya.
// WANDERER_REAL_WORLD_ENLIGHTENMENT_QUESTS - tidak ada di gameData.js yang diberikan sebelumnya.