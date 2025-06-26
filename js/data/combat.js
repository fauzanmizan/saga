// js/data/combat.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-27, 12:41 WITA ==
// == PERIHAL: Refactoring GameData.js - Pemindahan Data Pertempuran ke combat.js ==
// - Menampung semua data statis terkait makhluk dan efek status pertempuran.
// ===========================================

/**
 * @typedef {object} CreatureDrop
 * @property {string} itemId - ID item yang akan dijatuhkan.
 * @property {number} minQuantity - Kuantitas minimum.
 * @property {number} maxQuantity - Kuantitas maksimum.
 * @property {number} dropChance - Peluang drop (0-1).
 */

/**
 * @typedef {object} CreatureData
 * @property {string} id - Unique ID of the creature.
 * @property {string} name - Name of the creature.
 * @property {string} description - Brief description.
 * @property {number} baseHealth - Base health points.
 * @property {number} baseDamage - Base attack damage.
 * @property {string[]} habitatRegions - Regions where this creature typically appears.
 * @property {string[]} types - Creature types ('wildlife', 'corrupted', 'elemental', 'humanoid', 'aberration', 'spirit', 'aquatic', 'flying', 'boss', 'legendary').
 * @property {string[]} vulnerabilities - Weaknesses (e.g., 'fire', 'light', 'sound', 'piercing', 'blunt', 'magic').
 * @property {CreatureDrop[]} lootTable - Items this creature can drop.
 * @property {string} icon - Feather icon name.
 * @property {number} threatLevel - Threat level of the creature (1-5, 5 being most dangerous).
 */
export const CREATURES_DATA = {
    'dire_wolf': {
        id: 'dire_wolf',
        name: 'Serigala Ganas',
        description: 'Serigala besar yang berburu dalam kawanan, sering ditemukan di hutan dan dataran.',
        baseHealth: 50,
        baseDamage: 10,
        habitatRegions: ['TheAzureForest', 'TheLuminousPlains', 'TheWhisperingWoods'],
        types: ['wildlife'],
        vulnerabilities: ['fire', 'blunt'],
        lootTable: [{ itemId: 'serat_sutra', minQuantity: 1, maxQuantity: 3, dropChance: 0.8 }],
        icon: 'paw-print',
        threatLevel: 1
    },
    'echo_wraith': {
        id: 'echo_wraith',
        name: 'Roh Gema',
        description: 'Entitas eterik yang terbentuk dari Gema, menghisap vitalitas korban.',
        baseHealth: 70,
        baseDamage: 15,
        habitatRegions: ['TheWhisperingReaches', 'TheCentralNexus', 'TheAshfallWastes'],
        types: ['corrupted', 'spirit', 'aberration'],
        vulnerabilities: ['light', 'intention', 'magic'],
        lootTable: [{ itemId: 'echo_shard', minQuantity: 1, maxQuantity: 2, dropChance: 0.6 }],
        icon: 'ghost',
        threatLevel: 2
    },
    'sand_scorpion': {
        id: 'sand_scorpion',
        name: 'Kalajengking Pasir',
        description: 'Kalajengking raksasa yang bersembunyi di bawah pasir, dengan sengatan berbisa.',
        baseHealth: 60,
        baseDamage: 12,
        habitatRegions: ['TheCrimsonDesert'],
        types: ['wildlife'],
        vulnerabilities: ['ice', 'piercing'],
        lootTable: [{ itemId: 'venomous_gland', minQuantity: 1, maxQuantity: 1, dropChance: 0.7 }],
        icon: 'spider',
        threatLevel: 1
    },
    'mountain_golem': {
        id: 'mountain_golem',
        name: 'Golem Gunung',
        description: 'Makhluk elemental dari batu dan mineral, penjaga gunung kuno.',
        baseHealth: 150,
        baseDamage: 25,
        habitatRegions: ['TheShatteredPeaks', 'TheSilentCanyon'],
        types: ['elemental'],
        vulnerabilities: ['acid', 'magic'],
        lootTable: [{ itemId: 'rare_minerals', minQuantity: 1, maxQuantity: 5, dropChance: 0.9 }, { itemId: 'golem_parts', minQuantity: 1, maxQuantity: 1, dropChance: 0.5 }],
        icon: 'gem',
        threatLevel: 3
    },
    'abyssal_angler': {
        id: 'abyssal_angler',
        name: 'Angler Abyssal',
        description: 'Ikan predator dari kedalaman laut, menggunakan cahaya untuk memikat mangsa.',
        baseHealth: 90,
        baseDamage: 18,
        habitatRegions: ['TheSunkenCity'],
        types: ['wildlife', 'aquatic'],
        vulnerabilities: ['electricity', 'fire'],
        lootTable: [{ itemId: 'abyssal_pearls', minQuantity: 1, maxQuantity: 1, dropChance: 0.3 }],
        icon: 'fish',
        threatLevel: 2
    },
    'sky_serpent': {
        id: 'sky_serpent',
        name: 'Ular Langit',
        description: 'Makhluk udara raksasa yang meluncur di antara pulau-pulau melayang, dikenal karena bulunya yang langka.',
        baseHealth: 120,
        baseDamage: 20,
        habitatRegions: ['TheFloatingIslands'],
        types: ['wildlife', 'flying'],
        vulnerabilities: ['piercing', 'wind'],
        lootTable: [{ itemId: 'cloud_silk', minQuantity: 1, maxQuantity: 3, dropChance: 0.5 }],
        icon: 'wind',
        threatLevel: 3
    },
    // More NEW Creatures
    'humanoid_bandit': {
        id: 'humanoid_bandit',
        name: 'Bandit',
        description: 'Penjahat jalanan yang menyerang karavan dan penjelajah yang tidak waspada.',
        baseHealth: 40,
        baseDamage: 8,
        habitatRegions: ['TheCrimsonDesert', 'TheShatteredPeaks', 'TheAzureForest'],
        types: ['humanoid'],
        vulnerabilities: ['all'],
        lootTable: [{ itemId: 'gold_coin', minQuantity: 5, maxQuantity: 20, dropChance: 0.9 }],
        icon: 'user-x',
        threatLevel: 1
    },
    'forest_sprite': {
        id: 'forest_sprite',
        name: 'Peri Hutan',
        description: 'Makhluk kecil yang melayani Hutan Azure, bisa ramah atau nakal.',
        baseHealth: 30,
        baseDamage: 5,
        habitatRegions: ['TheAzureForest', 'TheLuminousPlains'],
        types: ['spirit'],
        vulnerabilities: ['iron'],
        lootTable: [{ itemId: 'healing_herbs', minQuantity: 1, maxQuantity: 2, dropChance: 0.7 }],
        icon: 'leaf',
        threatLevel: 1
    },
    'deep_sea_horror': {
        id: 'deep_sea_horror',
        name: 'Horor Laut Dalam',
        description: 'Makhluk mengerikan dari kedalaman, penuh tentakel dan mata gelap.',
        baseHealth: 200,
        baseDamage: 30,
        habitatRegions: ['TheSunkenCity'],
        types: ['aberration', 'aquatic', 'boss'],
        vulnerabilities: ['light', 'magic'],
        lootTable: [{ itemId: 'abyssal_pearls', minQuantity: 2, maxQuantity: 5, dropChance: 0.7 }, { itemId: 'ancient_relics', minQuantity: 1, maxQuantity: 1, dropChance: 0.3 }],
        icon: 'tentacles',
        threatLevel: 5
    },
    'ash_golem': {
        id: 'ash_golem',
        name: 'Golem Abu',
        description: 'Elemental api dan debu yang terbentuk dari abu vulkanik, sangat tahan terhadap panas.',
        baseHealth: 180,
        baseDamage: 28,
        habitatRegions: ['TheAshfallWastes'],
        types: ['elemental'],
        vulnerabilities: ['water', 'ice'],
        lootTable: [{ itemId: 'obsidian', minQuantity: 3, maxQuantity: 7, dropChance: 0.9 }],
        icon: 'flame',
        threatLevel: 4
    },
    'shadow_beast': {
        id: 'shadow_beast',
        name: 'Binatang Bayangan',
        description: 'Makhluk yang menyatu dengan bayangan, sulit dilacak dan sangat mematikan.',
        baseHealth: 100,
        baseDamage: 20,
        habitatRegions: ['TheWhisperingWoods', 'TheWhisperingReaches'],
        types: ['corrupted', 'spirit'],
        vulnerabilities: ['light', 'intention'],
        lootTable: [{ itemId: 'shadow_essence', minQuantity: 1, maxQuantity: 3, dropChance: 0.7 }],
        icon: 'moon',
        threatLevel: 3
    },
    'ice_wyrm': {
        id: 'ice_wyrm',
        name: 'Wyrm Es',
        description: 'Ular naga raksasa yang hidup di es, menyerang dengan napas beku.',
        baseHealth: 180,
        baseDamage: 25,
        habitatRegions: ['TheEternalGlacier'],
        types: ['elemental', 'legendary'],
        vulnerabilities: ['fire', 'blunt'],
        lootTable: [{ itemId: 'ice_crystal', minQuantity: 5, maxQuantity: 10, dropChance: 0.9 }, { itemId: 'frozen_essence', minQuantity: 1, maxQuantity: 2, dropChance: 0.4 }], // Placeholder
        icon: 'snowflake',
        threatLevel: 5
    },
    'polar_bear': {
        id: 'polar_bear',
        name: 'Beruang Kutub',
        description: 'Beruang buas dari tanah beku, sangat agresif jika merasa terancam.',
        baseHealth: 100,
        baseDamage: 18,
        habitatRegions: ['TheEternalGlacier'],
        types: ['wildlife'],
        vulnerabilities: ['piercing'],
        lootTable: [{ itemId: 'pristine_fur', minQuantity: 1, maxQuantity: 3, dropChance: 0.8 }],
        icon: 'bear', // Placeholder
        threatLevel: 2
    },
    'jungle_spider': {
        id: 'jungle_spider',
        name: 'Laba-laba Hutan',
        description: 'Laba-laba raksasa berbisa yang bersembunyi di kanopi hutan lebat.',
        baseHealth: 70,
        baseDamage: 15,
        habitatRegions: ['TheVerdantJungle'],
        types: ['wildlife'],
        vulnerabilities: ['fire'],
        lootTable: [{ itemId: 'venomous_gland', minQuantity: 1, maxQuantity: 1, dropChance: 0.6 }],
        icon: 'spider',
        threatLevel: 2
    },
    'vicious_ape': {
        id: 'vicious_ape',
        name: 'Kera Ganas',
        description: 'Kera besar dan agresif yang mempertahankan wilayah hutan mereka dengan kekuatan brutal.',
        baseHealth: 110,
        baseDamage: 22,
        habitatRegions: ['TheVerdantJungle'],
        types: ['wildlife', 'humanoid'],
        vulnerabilities: ['magic'],
        lootTable: [{ itemId: 'vibrant_fruit', minQuantity: 1, maxQuantity: 3, dropChance: 0.5 }],
        icon: 'hand', // Placeholder
        threatLevel: 3
    }
};

// --- Placeholder for other Combat related data from user prompt ---
// STATUS_EFFECTS_DATA - tidak ada di gameData.js yang diberikan sebelumnya.