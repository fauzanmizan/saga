// js/data/items.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-27, 12:35 WITA ==
// == PERIHAL: Refactoring GameData.js - Pemindahan Data Item ke items.js ==
// - Menampung semua data statis terkait item, resep, efek, loot tables, dll.
// ===========================================

/**
 * @typedef {object} ItemEffect
 * @property {string} id - Unique ID of the effect (e.g., 'heal_minor', 'purify_corruption').
 * @property {number} [value] - Value of the effect (e.g., amount of HP restored).
 * @property {number} [duration] - Duration of the effect in days/turns.
 * @property {string} [targetStat] - Target statistic for the effect (e.g., 'physical', 'mental', 'echo', 'intention').
 * @property {string} [effectType] - Type of effect ('buff', 'debuff', 'healing', 'status').
 */

/**
 * @typedef {Object.<string, ItemEffect>} ItemEffectsDataMap - Map of effect IDs to their definitions.
 */
export const ITEM_EFFECTS_DATA = {
    'heal_minor': { id: 'heal_minor', description: 'Memulihkan sedikit kesehatan fisik.', effectType: 'healing', targetStat: 'currentHealth' },
    'heal_moderate': { id: 'heal_moderate', description: 'Memulihkan kesehatan fisik secara moderat.', effectType: 'healing', targetStat: 'currentHealth' },
    'purify_corruption': { id: 'purify_corruption', description: 'Mengurangi tingkat korupsi Gema pada NPC atau Wanderer.', effectType: 'status', targetStat: 'corruptionLevel' },
    'xp_bonus': { id: 'xp_bonus', description: 'Meningkatkan perolehan XP untuk waktu singkat.', effectType: 'buff', targetStat: 'xp_gain' },
    'damage_bonus': { id: 'damage_bonus', description: 'Meningkatkan kerusakan serangan fisik.', effectType: 'buff', targetStat: 'physicalDamage' },
    'defense_bonus': { id: 'defense_bonus', description: 'Meningkatkan pertahanan fisik.', effectType: 'buff', targetStat: 'physicalDefense' },
    'echo_increase_passive': { id: 'echo_increase_passive', description: 'Meningkatkan Echo secara pasif saat dipegang.', effectType: 'status', targetStat: 'echo' },
    'sanity_restore_minor': { id: 'sanity_restore_minor', description: 'Memulihkan sedikit kewarasan mental.', effectType: 'healing', targetStat: 'sanity' },
    'courage_buff': { id: 'courage_buff', description: 'Meningkatkan keberanian, membuat Wanderer lebih tahan terhadap efek takut.', effectType: 'buff', targetStat: 'courage' },
    'stealth_boost': { id: 'stealth_boost', description: 'Meningkatkan kemampuan menyelinap.', effectType: 'buff', targetStat: 'stealth' },
    'resistance_echo': { id: 'resistance_echo', description: 'Meningkatkan resistensi terhadap pengaruh Gema.', effectType: 'buff', targetStat: 'echoResistance' },
    'vulnerability_echo': { id: 'vulnerability_echo', description: 'Meningkatkan kerentanan terhadap pengaruh Gema.', effectType: 'debuff', targetStat: 'echoResistance' },
    'mining_speed_bonus': { id: 'mining_speed_bonus', description: 'Meningkatkan kecepatan menambang sumber daya.', effectType: 'buff', targetStat: 'miningSpeed' },
    'essence_restore': { id: 'essence_restore', description: 'Memulihkan sejumlah Esensi Niat.', effectType: 'healing', targetStat: 'essenceOfWill' },
    'energy_restore_minor': { id: 'energy_restore_minor', description: 'Memulihkan sejumlah energi stamina.', effectType: 'healing', targetStat: 'stamina' }
};


/**
 * @typedef {object} TradableItem
 * @property {string} id - Unique item ID.
 * @property {string} name - Item name.
 * @property {string} description - Item description.
 * @property {'currency'|'material'|'consumable'|'artifact'|'information'|'quest_item'|'equipment'|'tool'|'resource'} type - Item type.
 * @property {number} value - Base value of the item in currency.
 * @property {string} icon - Icon name (e.g., Feather icon name).
 * @property {'common'|'uncommon'|'rare'|'epic'|'legendary'} rarity - Item rarity.
 * @property {number|null} durability - Item durability (for equipment, tools), null if not applicable.
 * @property {object[]} activeEffects - Array of active effects provided by the item. References ItemEffect.
 * @property {string} [journalEntryId] - ID of the associated journal entry (if item is of type 'information').
 */

export const TRADABLE_ITEMS_DATA = {
    "jamur_langka": {
        id: "jamur_langka",
        name: "Jamur Langka",
        description: "Jamur yang sulit ditemukan, memiliki khasiat tertentu. Warnanya agak keunguan.",
        type: "material",
        value: 10,
        icon: 'feather',
        rarity: 'uncommon',
        durability: null,
        activeEffects: []
    },
    "serat_sutra": {
        id: "serat_sutra",
        name: "Serat Sutra",
        description: "Serat halus dan kuat, digunakan untuk membuat pakaian mahal atau jaring.",
        type: "material",
        value: 20,
        icon: 'package',
        rarity: 'common',
        durability: null,
        activeEffects: []
    },
    "gold_coin": {
        id: "gold_coin",
        name: "Koin Emas",
        description: "Mata uang standar dunia Singular Saga.",
        type: "currency",
        value: 1,
        icon: 'circle-dollar-sign',
        rarity: 'common',
        durability: null,
        activeEffects: []
    },
    "potion_minor_heal": {
        id: "potion_minor_heal",
        name: "Ramuan Penyembuh Minor",
        description: "Memulihkan sedikit kesehatan, rasanya seperti jahe.",
        type: "consumable",
        value: 15,
        icon: 'droplet',
        rarity: 'common',
        durability: null,
        activeEffects: [{ id: 'heal_minor', value: 20 }]
    },
    "purification_salve": {
        id: "purification_salve",
        name: "Salep Pemurnian",
        description: "Salep ampuh yang dibuat dari kristal murni untuk menyembuhkan penyakit dan korupsi Gema.",
        type: "consumable",
        value: 50,
        icon: 'sparkles',
        rarity: 'rare',
        durability: null,
        activeEffects: [{ id: 'purify_corruption', value: 1 }]
    },
    "healing_salve": {
        id: "healing_salve",
        name: "Salep Penyembuh",
        description: "Salep umum yang dibuat dari ramuan herbal, untuk menyembuhkan luka ringan.",
        type: "consumable",
        value: 20,
        icon: 'cross',
        rarity: 'uncommon',
        durability: null,
        activeEffects: [{ id: 'heal_moderate', value: 50 }]
    },
    "ancient_rune": {
        id: 'ancient_rune',
        name: 'Rune Kuno',
        description: 'Simbol kuno dengan potensi tersembunyi, memancarkan aura kuno. Artefak kecil yang terasa hangat.',
        type: 'artifact',
        value: 50,
        icon: 'gem',
        rarity: 'rare',
        durability: null,
        activeEffects: [{ id: 'xp_bonus', value: 5 }]
    },
    "celestial_map": {
        id: 'celestial_map',
        name: 'Peta Surgawi',
        description: 'Peta ke lokasi yang tidak diketahui, terbuat dari bahan yang bukan dari dunia ini. Mengandung informasi penting.',
        type: 'information',
        value: 75,
        icon: 'map',
        rarity: 'epic',
        durability: null,
        activeEffects: [],
        journalEntryId: "journal_celestial_map_lore"
    },
    "rusty_sword": {
        id: 'rusty_sword',
        name: 'Pedang Berkarat',
        description: 'Pedang tua yang sudah berkarat, tidak terlalu berguna dalam pertempuran serius. Terasa berat dan tumpul.',
        type: 'equipment',
        value: 5,
        icon: 'sword',
        rarity: 'common',
        durability: 100,
        activeEffects: [{ id: 'damage_bonus', value: 1, target: 'physical' }]
    },
    "leather_armor": {
        id: 'leather_armor',
        name: 'Armor Kulit',
        description: 'Pelindung ringan yang terbuat dari kulit binatang. Memberikan perlindungan dasar.',
        type: 'equipment',
        value: 30,
        icon: 'shirt',
        rarity: 'uncommon',
        durability: 100,
        activeEffects: [{ id: 'defense_bonus', value: 5, target: 'physical' }]
    },
    "echo_shard": {
        id: 'echo_shard',
        name: 'Pecahan Gema',
        description: 'Fragmen gelap yang memancarkan energi Gema. Terasa dingin saat disentuh dan kadang berbisik.',
        type: 'artifact',
        value: 25,
        icon: 'sparkles',
        rarity: 'uncommon',
        durability: null,
        activeEffects: [{ id: 'echo_increase_passive', value: 1 }]
    },
    "quest_macguffin": {
        id: 'quest_macguffin',
        name: 'MacGuffin Misi',
        description: 'Item misterius yang dicari seseorang. Memiliki pola aneh yang berubah.',
        type: 'quest_item',
        value: 0,
        icon: 'key',
        rarity: 'legendary',
        durability: null,
        activeEffects: []
    },
    "ancient_tablet": {
        id: "ancient_tablet",
        name: "Tablet Kuno",
        description: "Tablet yang menceritakan legenda Forgotten Forgers. Mengandung lore.",
        type: "information",
        value: 100,
        icon: 'clipboard',
        rarity: 'rare',
        durability: null,
        activeEffects: [],
        journalEntryId: "journal_ancient_tablet_lore"
    },
    "obsidian_pickaxe": {
        id: "obsidian_pickaxe",
        name: "Beliung Obsidian",
        description: "Beliung kokoh yang terbuat dari obsidian, efektif untuk menambang mineral keras.",
        type: "tool",
        value: 75,
        icon: 'pickaxe',
        rarity: 'uncommon',
        durability: 150,
        activeEffects: [{ id: 'mining_speed_bonus', value: 0.2 }]
    },
    "mana_crystal": {
        id: "mana_crystal",
        name: "Kristal Mana",
        description: "Kristal kecil yang memancarkan energi magis. Dapat memulihkan esensi.",
        type: "resource",
        value: 30,
        icon: 'gem',
        rarity: 'common',
        durability: null,
        activeEffects: [{ id: 'essence_restore', value: 10 }]
    },
    "venomous_gland": {
        id: "venomous_gland",
        name: "Kelenjar Berbisa",
        description: "Kelenjar beracun dari makhluk berbahaya. Dapat digunakan untuk membuat racun.",
        type: "material",
        value: 40,
        icon: 'droplet',
        rarity: 'uncommon',
        durability: null,
        activeEffects: []
    },
    "tome_of_forgotten_rituals": {
        id: "tome_of_forgotten_rituals",
        name: "Kitab Ritual Terlupakan",
        description: "Buku tua yang berisi ritual-ritual kuno, beberapa mungkin berbahaya.",
        type: "information",
        value: 200,
        icon: 'book-open',
        rarity: 'epic',
        durability: null,
        activeEffects: [],
        journalEntryId: "journal_tome_forgotten_rituals"
    },
    "ice_crystal": {
        id: "ice_crystal",
        name: "Kristal Es",
        description: "Kristal yang terbentuk di gletser abadi, sangat dingin dan memancarkan energi es.",
        type: "resource",
        value: 35,
        icon: 'snowflake',
        rarity: 'uncommon',
        durability: null,
        activeEffects: []
    },
    "pristine_fur": {
        id: "pristine_fur",
        name: "Bulu Murni",
        description: "Bulu tebal dari hewan-hewan kutub, sangat baik untuk pakaian hangat.",
        type: "material",
        value: 25,
        icon: 'wind',
        rarity: 'common',
        durability: null,
        activeEffects: []
    },
    "exotic_flora": {
        id: "exotic_flora",
        name: "Flora Eksotis",
        description: "Tumbuhan aneh dari hutan hujan, dengan warna-warni yang memukau dan potensi yang tidak diketahui.",
        type: "resource",
        value: 45,
        icon: 'flower',
        rarity: 'uncommon',
        durability: null,
        activeEffects: []
    },
    "vibrant_fruit": {
        id: "vibrant_fruit",
        name: "Buah Bersemangat",
        description: "Buah-buahan cerah dari hutan, memulihkan energi dan vitalitas.",
        type: "consumable",
        value: 18,
        icon: 'apple',
        rarity: 'common',
        durability: null,
        activeEffects: [{ id: 'heal_minor', value: 15 }, { id: 'energy_restore_minor', value: 10 }]
    }
};

/**
 * @typedef {object} LootTableEntry
 * @property {string} itemId - ID item yang akan dijatuhkan.
 * @property {number} minQuantity - Kuantitas minimum.
 * @property {number} maxQuantity - Kuantitas maksimum.
 * @property {number} dropChance - Peluang drop (0-1).
 */

/**
 * @typedef {object} GlobalLootTable
 * @property {LootTableEntry[]} common - Item umum.
 * @property {LootTableEntry[]} uncommon - Item tidak umum.
 * @property {LootTableEntry[]} rare - Item langka.
 * @property {LootTableEntry[]} epic - Item epik.
 * @property {LootTableEntry[]} legendary - Item legendaris.
 */
export const GLOBAL_LOOT_TABLES = {
    'default_wilderness': {
        common: [
            { itemId: 'jamur_langka', minQuantity: 1, maxQuantity: 2, dropChance: 0.7 },
            { itemId: 'serat_sutra', minQuantity: 1, maxQuantity: 1, dropChance: 0.6 }
        ],
        uncommon: [
            { itemId: 'potion_minor_heal', minQuantity: 1, maxQuantity: 1, dropChance: 0.2 },
            { itemId: 'leather_armor', minQuantity: 1, maxQuantity: 1, dropChance: 0.05 }
        ],
        rare: [
            { itemId: 'ancient_rune', minQuantity: 1, maxQuantity: 1, dropChance: 0.01 }
        ],
        epic: [],
        legendary: []
    },
    'corrupted_area': {
        common: [
            { itemId: 'echo_shard', minQuantity: 1, maxQuantity: 3, dropChance: 0.8 },
            { itemId: 'mutated_flora', minQuantity: 1, maxQuantity: 2, dropChance: 0.7 }
        ],
        uncommon: [
            { itemId: 'venomous_gland', minQuantity: 1, maxQuantity: 1, dropChance: 0.3 },
            { itemId: 'rusty_sword', minQuantity: 1, maxQuantity: 1, dropChance: 0.1 }
        ],
        rare: [
            { itemId: 'purification_salve', minQuantity: 1, maxQuantity: 1, dropChance: 0.05 },
            { itemId: 'tome_of_forgotten_rituals', minQuantity: 1, maxQuantity: 1, dropChance: 0.01 }
        ],
        epic: [{ itemId: 'celestial_map', minQuantity: 1, maxQuantity: 1, dropChance: 0.005 }],
        legendary: []
    },
    'desert_ruins': {
        common: [{ itemId: 'gold_coin', minQuantity: 5, maxQuantity: 15, dropChance: 1.0 }],
        uncommon: [{ itemId: 'desert_minerals', minQuantity: 1, maxQuantity: 3, dropChance: 0.4 }],
        rare: [{ itemId: 'ancient_tablet', minQuantity: 1, maxQuantity: 1, dropChance: 0.08 }],
        epic: [],
        legendary: []
    },
    'mountain_mines': {
        common: [{ itemId: 'iron_ore', minQuantity: 2, maxQuantity: 5, dropChance: 1.0 }],
        uncommon: [{ itemId: 'mana_crystal', minQuantity: 1, maxQuantity: 1, dropChance: 0.3 }],
        rare: [{ itemId: 'obsidian_pickaxe', minQuantity: 1, maxQuantity: 1, dropChance: 0.02 }],
        epic: [],
        legendary: []
    },
    'aquatic_depths': {
        common: [{ itemId: 'sea_minerals', minQuantity: 1, maxQuantity: 3, dropChance: 0.8 }],
        uncommon: [{ itemId: 'abyssal_pearls', minQuantity: 1, maxQuantity: 1, dropChance: 0.2 }],
        rare: [{ itemId: 'ancient_relics', minQuantity: 1, maxQuantity: 1, dropChance: 0.03 }],
        epic: [],
        legendary: []
    },
    'floating_sky': {
        common: [{ itemId: 'wind_essence', minQuantity: 1, maxQuantity: 2, dropChance: 0.7 }],
        uncommon: [{ itemId: 'cloud_silk', minQuantity: 1, maxQuantity: 1, dropChance: 0.25 }],
        rare: [{ itemId: 'rare_gems', minQuantity: 1, maxQuantity: 1, dropChance: 0.05 }],
        epic: [],
        legendary: []
    }
};

// --- Placeholder for other Item related data from user prompt ---
// CRAFTABLE_RECIPES_DATA - data ini ada di wandererGameLogic.js dan akan diatur di sana jika dipindahkan.
// SEED_DATA - tidak ada di gameData.js yang diberikan sebelumnya.
// LEGENDARY_ARTIFACTS_DATA - tidak ada di gameData.js yang diberikan sebelumnya.