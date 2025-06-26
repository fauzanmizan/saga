// js/gameData.js

// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-27, 13:00 WITA ==
// == PERIHAL: Refactoring GameData.js - Mengubah menjadi Indeks Parsial ==
// - File ini kini mengimpor dan mengekspor kembali data dari modul-modul data spesifik.
// - Data yang belum direfaktor tetap berada di sini untuk sementara.
// - Memindahkan data inti ke js/data/core.js.
// - Memindahkan data NPC ke js/data/npcs.js.
// - Memindahkan data dunia ke js/data/world.js.
// - Memindahkan data item ke js/data/items.js.
// - Memindahkan data misi ke js/data/quests.js.
// - Memindahkan data dialog ke js/data/dialogues.js.
// - Memindahkan data combat ke js/data/combat.js.
// - Memindahkan data forgerTools ke js/data/forgerTools.js.
// - Memindahkan data metaGame ke js/data/metaGame.js.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 23:35 ==
// == PERIHAL: Implementasi Fase IV - Evolusi Dunia Lanjutan ==
// - Menambahkan COSMIC_CYCLES untuk siklus musiman/kosmik.
// - Memperkaya struktur NPC dengan relationships dan role.
// - Menambahkan definisi GLOBAL_WORLD_EVENTS.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 21:33 ==
// == PERIHAL: Implementasi Fase III - Inventaris Penuh & Manajemen Item ==
// - Memperkaya struktur TRADABLE_ITEMS_DATA dengan properti rarity, durability, activeEffects, dan tipe baru.
// - Menambahkan kategori item type yang lengkap.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 20:16 ==
// == PERIHAL: Implementasi Fase III - Misi NPC Generik (Fetch/Delivery) ==
// - Menambahkan struktur data GENERIC_QUEST_TYPES untuk definisi misi generik.
// - Memperbarui typedefs untuk QuestReward, QuestConditions, GenericQuestType.
// - Menambahkan mock TRADABLE_ITEMS_DATA yang relevan.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 19:40 ==
// == PERIHAL: Implementasi Fase III - Interaksi NPC Mendalam (Sistem Dialog/Pilihan Cabang Sederhana) ==
// - Menambahkan struktur data NPC_DIALOGUES yang kaya dan fleksibel untuk mendukung dialog bercabang.
// - Memperbarui typedefs untuk DialogueChoiceConsequence, DialogueChoiceConditions, DialogueNode.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 17:40 ==
// == PERIHAL: Implementasi Fase III - Konsekuensi Kesehatan NPC Dinamis ==
// - Memperkaya konstanta NPC_HEALTH_STATES, NPC_LIFESTAGES, NEXUS_STATES, WHISPER_EVENTS, CHRONICLE_EVENTS.
// - Menambahkan properti baru untuk mendukung dual layer kesehatan, dampak lingkungan, dan pemicu event.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 17:24 ==
// == PERIHAL: Implementasi Fase III - Sistem Reputasi NPC Dinamis ==
// - Menambahkan konstanta global NPC_REPUTATION_LEVELS untuk mendefinisikan ambang batas dan nama level reputasi NPC.
// - Menambahkan konstanta global REPUTATION_CHANGE_MAGNITUDE untuk mendefinisikan besaran perubahan reputasi berdasarkan jenis aksi.
// - Memperbarui blok komentar untuk mencerminkan tanggal & waktu.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2023-06-23 14:09 WITA ==
// == PERIHAL: Modul Inti Game Data ==
// - Mengisolasi semua data statis yang besar dari main.js.
// - Menyediakan konstanta untuk SKILL_TREE_DATA, GLOBAL_ATTRIBUTES,
//   BIRTH_QUESTIONS, dan INTERROGATION_DATA.
// - Mengekspor semua data ini agar dapat diimpor oleh modul lain yang membutuhkan.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 23:06 WITA ==
// == PERIHAL: Implementasi Fase IV - Narasi Dinamis & Sistem Warisan Awal ==
// - Menambahkan konstanta LEGACY_CRITERIA untuk definisi perolehan Poin Legacy.
// ===========================================
// == MODIFIED BY: Tim 3.C ==
// == TANGGAL: 2025-06-25, 12:21 ==
// == PERIHAL: Implementasi Fase IV - Jurnal & Peta Berpeta Interaktif ==
// - Menambahkan struktur data WORLD_LANDMARKS/POI.
// - Memperkaya struktur TRADABLE_ITEMS_DATA untuk menyertakan item tipe 'information' dengan 'journalEntryId'.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-25, 12:28 ==
// == PERIHAL: Penambahan 50 Landmark/POI baru ke WORLD_LANDMARKS ==
// - Memperkaya detail dunia dengan lokasi-lokasi baru yang variatif.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-25, 12:40 ==
// == PERIHAL: Mendefinisikan struktur REGIONS_DATA dengan detail wilayah yang lengkap ==
// - Menambahkan properti seperti iklim, jenis medan, tingkat ancaman, faksi dominan, dan sumber daya.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-25, 13:00 ==
// == PERIHAL: Pembaruan Masif GameData: Penambahan Faksi, Makhluk, Log Jurnal, Loot, dan Perluasan Event/Item/Quest. ==
// - Menambahkan struktur data FACTIONS_DATA, CREATURES_DATA, JOURNAL_ENTRY_TEMPLATES, GLOBAL_LOOT_TABLES, ITEM_EFFECTS_DATA, QUEST_OBJECTIVE_TEMPLATES.
// - Memperkaya REGIONS_DATA, GLOBAL_WORLD_EVENTS, NPC_PERSONALITY_TRAITS, dan REPUTATION_LEVELS.
// - Memperbarui typedefs untuk konsistensi.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-25, 13:05 ==
// == PERIHAL: Pembaruan Masif GameData: Perluasan Jurnal, Integrasi Forger Lanjut, Peran NPC Beragam. ==
// - Memperluas JOURNAL_ENTRY_TEMPLATES dengan lebih banyak kategori dan pemicu.
// - Menambahkan properti Forger-spesifik ke GLOBAL_WORLD_EVENTS dan LEGACY_CRITERIA.
// - Memperkaya NPC_ROLES dengan peran yang lebih beragam dan detail.
// - Menambahkan data untuk makhluk baru.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-25, 13:06 ==
// == PERIHAL: Konsolidasi dan Finalisasi Data Game ==
// - Memastikan semua struktur data terbaru dan definisi type dikonsolidasikan dengan benar.
// - Menambahkan komentar inline untuk kejelasan jika diperlukan.
// ===========================================

// Impor dan re-export data dari modul-modul baru
export * from './data/core.js';
export * from './data/npcs.js';
export * from './data/world.js';
export * from './data/items.js';
export * from './data/quests.js';
export * from './data/dialogues.js';
export * from './data/combat.js';
export * from './data/forgerTools.js';
export * from './data/metaGame.js';


// Data yang belum direfaktor akan tetap berada di sini untuk sementara
// (Berdasarkan file gameData.js sebelumnya, semua konstanta yang ada telah dipindahkan.
// Jika ada data lain yang belum direfaktor di masa depan, akan ditempatkan di sini.)

// FAKSI_DATA masih di gameData.js untuk saat ini
export const FACTIONS_DATA = {
    'TheArbiters': {
        id: 'TheArbiters',
        name: 'The Arbiters',
        description: 'Penjaga keseimbangan dan kebenaran, berusaha menjaga stabilitas Nexus Pusat. Mereka sering berkonflik dengan kekuatan Gema.',
        type: 'political',
        dominantRegions: ['TheCentralNexus'],
        relationships: { 'TheEchoCult': 'rivalry', 'TheLuminousGuardians': 'alliance', 'TraderGuild': 'neutral', 'TheCinderTribes': 'rivalry' },
        typicalNpcTraits: ['stoic', 'disciplined', 'courageous'],
        notableResources: ['essence_crystal', 'rare_minerals'],
        baseReputation: 20
    },
    'TheEchoCult': {
        id: 'TheEchoCult',
        name: 'The Echo Cult',
        description: 'Kelompok yang menyembah Gema, percaya bahwa kehampaan adalah takdir sejati. Mereka berusaha menyebarkan korupsi. Memusuhi semua yang bukan dari mereka.',
        type: 'religious',
        dominantRegions: ['TheWhisperingReaches', 'TheAshfallWastes'],
        relationships: { 'TheArbiters': 'hostile_by_default', 'TheLuminousGuardians': 'hostile_by_default', 'TraderGuild': 'hostile_by_default' },
        typicalNpcTraits: ['pessimistic', 'fanatical', 'vengeful', 'fearful'],
        notableResources: ['shadow_essence', 'mutated_flora'],
        baseReputation: -50
    },
    'TheLuminousGuardians': {
        id: 'TheLuminousGuardians',
        name: 'The Luminous Guardians',
        description: 'Pelindung cahaya Intensi, mereka berdedikasi untuk memurnikan dunia dari Gema dan membantu mereka yang membutuhkan. Cahaya adalah panduan mereka.',
        type: 'religious',
        dominantRegions: ['TheLuminousPlains', 'TheAzureForest'],
        relationships: { 'TheEchoCult': 'rivalry', 'TheArbiters': 'alliance', 'TheDeepOnes': 'rivalry' },
        typicalNpcTraits: ['optimistic', 'generous', 'courageous', 'loyal'],
        notableResources: ['healing_herbs', 'pure_water'],
        baseReputation: 30
    },
    'TraderGuild': {
        id: 'TraderGuild',
        name: 'Trader Guild',
        description: 'Organisasi pedagang yang bergerak di seluruh dunia, selalu mencari keuntungan dan jalur perdagangan baru. Mereka netral dalam sebagian besar konflik, selama itu tidak mengganggu bisnis.',
        type: 'neutral_trade',
        dominantRegions: ['TheCrimsonDesert', 'TheFloatingIslands'],
        relationships: { 'TheArbiters': 'neutral', 'TheEchoCult': 'neutral', 'TheStonekin': 'neutral' },
        typicalNpcTraits: ['greedy', 'cautious', 'gregarious'],
        notableResources: ['gold_coin', 'rare_tradables'],
        baseReputation: 10
    },
    'TheStonekin': {
        id: 'TheStonekin',
        name: 'The Stonekin',
        description: 'Ras kuno penghuni gunung, kuat dan pantang menyerah. Mereka melindungi tanah pegunungan mereka dari penyusup dan ancaman. Hubungan mereka dengan dunia luar seringkali tegang.',
        type: 'ancient_race',
        dominantRegions: ['TheShatteredPeaks'],
        relationships: { 'TheEchoCult': 'rivalry', 'TraderGuild': 'neutral', 'TheArbiters': 'neutral' },
        typicalNpcTraits: ['stoic', 'loyal', 'courageous', 'solitary'],
        notableResources: ['rare_minerals', 'golem_parts'],
        baseReputation: 0
    },
    'TheDeepOnes': {
        id: 'TheDeepOnes',
        name: 'The Deep Ones',
        description: 'Penghuni kedalaman kota-kota tenggelam, misterius dan sering kali memusuhi permukaan. Mereka menjaga rahasia kuno yang terendam, memandang rendah makhluk daratan.',
        type: 'monster_horde',
        dominantRegions: ['TheSunkenCity'],
        relationships: { 'TheLuminousGuardians': 'hostile_by_default', 'TraderGuild': 'hostile_by_default' },
        typicalNpcTraits: ['solitary', 'vengeful', 'arrogant'],
        notableResources: ['abyssal_pearls', 'ancient_relics'],
        baseReputation: -40
    },
    'TheSkySentinels': {
        id: 'TheSkySentinels',
        name: 'The Sky Sentinels',
        description: 'Penjaga langit dan pulau-pulau melayang, mereka adalah pilot ahli dan pejuang udara yang tak kenal takut. Mereka memantau ancaman dari atas.',
        type: 'political',
        dominantRegions: ['TheFloatingIslands'],
        relationships: { 'TheEchoCult': 'rivalry', 'TheArbiters': 'alliance' },
        typicalNpcTraits: ['courageous', 'disciplined', 'curious'],
        notableResources: ['rare_gems', 'wind_essence'],
        baseReputation: 25
    },
    'TheCinderTribes': {
        id: 'TheCinderTribes',
        name: 'The Cinder Tribes',
        description: 'Suku-suku nomaden yang hidup di tanah vulkanik, beradaptasi dengan lingkungan keras. Terkenal karena keterampilan bertahan hidup dan pertempuran ganas, mereka tidak percaya pada orang luar.',
        type: 'political',
        dominantRegions: ['TheAshfallWastes', 'TheCrimsonDesert'],
        relationships: { 'TheSandWorshippers': 'rivalry', 'TraderGuild': 'neutral' },
        typicalNpcTraits: ['fierce', 'resilient', 'cautious'],
        notableResources: ['obsidian', 'sulfur'],
        baseReputation: -10
    },
    'TheHermits': {
        id: 'TheHermits',
        name: 'The Hermits of Silent Canyon',
        description: 'Kelompok pertapa yang hidup terpencil di Ngarai Senyap, mencari kedamaian dan pengetahuan kuno. Mereka umumnya netral tetapi bisa memberikan wawasan unik bagi mereka yang sabar.',
        type: 'neutral_religious',
        dominantRegions: ['TheSilentCanyon'],
        relationships: {},
        typicalNpcTraits: ['wise', 'solitary', 'stoic'],
        notableResources: ['rare_minerals', 'mystic_herbs'],
        baseReputation: 0
    },
    'TheForestSpirits': {
        id: 'TheForestSpirits',
        name: 'The Forest Spirits',
        description: 'Entitas kuno penjaga hutan, sering tidak terlihat oleh mata manusia. Mereka bereaksi terhadap keseimbangan hutan, bisa menjadi pelindung atau ancaman tergantung pada tindakan Wanderer.',
        type: 'natural_entity',
        dominantRegions: ['TheWhisperingWoods', 'TheAzureForest'],
        relationships: { 'TheLuminousGuardians': 'alliance', 'TheEchoCult': 'rivalry' },
        typicalNpcTraits: ['mysterious', 'vengeful', 'protective'],
        notableResources: ['ancient_wood', 'mystic_herbs'],
        baseReputation: 15
    },
    'TheSandWorshippers': {
        id: 'TheSandWorshippers',
        name: 'The Sand Worshippers',
        description: 'Suku-suku gurun yang memuja entitas kuno di bawah pasir. Mereka gigih dan defensif terhadap wilayah mereka.',
        type: 'religious',
        dominantRegions: ['TheCrimsonDesert'],
        relationships: { 'TraderGuild': 'neutral', 'TheCinderTribes': 'rivalry' },
        typicalNpcTraits: ['loyal', 'courageous', 'fierce'],
        notableResources: ['sunstone', 'desert_minerals'],
        baseReputation: -5
    },
    'TheIceGuardians': {
        id: 'TheIceGuardians',
        name: 'The Ice Guardians',
        description: 'Penjaga gletser abadi, makhluk purba yang beradaptasi dengan dingin ekstrem. Mereka sangat teritorial dan jarang berinteraksi dengan dunia luar.',
        type: 'ancient_race',
        dominantRegions: ['TheEternalGlacier'],
        relationships: { 'TraderGuild': 'neutral' },
        typicalNpcTraits: ['stoic', 'solitary', 'resilient'],
        notableResources: ['ice_crystal', 'frozen_essence'],
        baseReputation: -10
    },
    'TheAncientKeepers': {
        id: 'TheAncientKeepers',
        name: 'The Ancient Keepers',
        description: 'Makhluk-makhluk kuno dan bijaksana yang melindungi hutan belantara. Mereka adalah entitas penjaga yang memastikan keseimbangan alam tetap terjaga.',
        type: 'natural_entity',
        dominantRegions: ['TheVerdantJungle'],
        relationships: { 'TheLuminousGuardians': 'alliance' },
        typicalNpcTraits: ['wise', 'cautious', 'protective'],
        notableResources: ['exotic_flora', 'vibrant_fruit'],
        baseReputation: 20
    }
};

export const REGIONS_DATA = {
    "TheCentralNexus": {
        id: "TheCentralNexus",
        name: "Nexus Pusat yang Berdenyut",
        description: "Jantung dunia, tempat energi Gema dan Intensi saling berkejaran, membentuk lanskap yang selalu berubah dan penuh anomali. Pusat kekuatan spiritual dan geografis.",
        climate: 'temperate',
        terrainType: 'plains',
        threatLevel: 4,
        dominantFaction: 'TheArbiters',
        resources: ['essence_crystal', 'rare_minerals', 'mana_crystal'],
        initialNexusState: 'UNSTABLE',
        regionalQuests: ['quest_central_anomaly', 'quest_nexus_stabilization'],
        regionalEvents: ['ECHO_SPIKE', 'LANDMARK_TRANSFORMATION', 'CHAOTIC_FUSE'],
        spawnableCreatureTypes: ['echo_wraith', 'humanoid_bandit', 'shadow_beast'],
        lootTableId: 'corrupted_area',
        neighboringRegions: ['TheLuminousPlains', 'TheWhisperingReaches', 'TheShatteredPeaks']
    },
    "TheWhisperingReaches": {
        id: "TheWhisperingReaches",
        name: "Jangkauan Berbisik",
        description: "Wilayah yang diselimuti kabut abadi dan bisikan-bisikan dari kehampaan. Pepohonan layu dan tanahnya terasa dingin, penuh dengan reruntuhan dan rahasia yang terkubur.",
        climate: 'humid',
        terrainType: 'swamp',
        threatLevel: 3,
        dominantFaction: 'TheEchoCult',
        resources: ['mutated_flora', 'shadow_essence', 'venomous_gland'],
        initialNexusState: 'MAELSTROM',
        regionalQuests: ['quest_gloomwood_investigation', 'quest_cleanse_barrow'],
        regionalEvents: ['ECHO_SPIKE', 'HERO_EMERGENCE', 'PLAGUE_OUTBREAK'],
        spawnableCreatureTypes: ['echo_wraith', 'dire_wolf_corrupted', 'shadow_beast'],
        lootTableId: 'corrupted_area',
        neighboringRegions: ['TheCentralNexus', 'TheCrimsonDesert', 'TheSilentCanyon']
    },
    "TheLuminousPlains": {
        id: "TheLuminousPlains",
        name: "Dataran Bercahaya",
        description: "Hamparan padang rumput yang diterangi oleh cahaya Intensi, tempat kehidupan berkembang pesat dan aura penyembuhan terasa kuat. Sebuah oase ketenangan di dunia yang bergejolak.",
        climate: 'temperate',
        terrainType: 'plains',
        threatLevel: 1,
        dominantFaction: 'TheLuminousGuardians',
        resources: ['healing_herbs', 'pure_water', 'radiant_dust'],
        initialNexusState: 'SANCTUM',
        regionalQuests: ['quest_crystal_purification', 'quest_lost_pilgrimage'],
        regionalEvents: ['SANCTUM_BLESSING', 'TRADE_ROUTE_OPENED', 'RESOURCE_BONANZA'],
        spawnableCreatureTypes: ['dire_wolf', 'forest_sprite'],
        lootTableId: 'default_wilderness',
        neighboringRegions: ['TheCentralNexus', 'TheAzureForest', 'TheShatteredPeaks']
    },
    "TheShatteredPeaks": {
        id: "TheShatteredPeaks",
        name: "Puncak yang Hancur",
        description: "Pegunungan yang menjulang tinggi, puncaknya hancur oleh kekuatan kuno. Dingin, berbatu, dan sarang makhluk-makhluk tangguh serta mineral langka. Angin dingin berbisik di antara puncaknya.",
        climate: 'sub-zero',
        terrainType: 'mountainous',
        threatLevel: 4,
        dominantFaction: 'TheStonekin',
        resources: ['rare_minerals', 'mountain_flora', 'golem_parts'],
        initialNexusState: 'NORMAL',
        regionalQuests: ['quest_ancient_golem', 'quest_find_lost_climber'],
        regionalEvents: ['LANDMARK_TRANSFORMATION', 'FACTION_WAR', 'RESOURCE_BONANZA'],
        spawnableCreatureTypes: ['mountain_golem', 'ice_wyrm'],
        lootTableId: 'mountain_mines',
        neighboringRegions: ['TheCentralNexus', 'TheLuminousPlains', 'TheCrimsonDesert']
    },
    "TheCrimsonDesert": {
        id: "TheCrimsonDesert",
        name: "Gurun Merah Darah",
        description: "Hamparan pasir merah yang luas dan tidak kenal ampun, disengat oleh matahari terik dan dihuni oleh makhluk-makhluk yang beradaptasi dengan panas ekstrem. Jejak-jejak peradaban kuno terkubur di bawah pasirnya.",
        climate: 'arid',
        terrainType: 'desert',
        threatLevel: 3,
        dominantFaction: 'TheSandWorshippers',
        resources: ['desert_minerals', 'sunstone', 'scorched_hide'],
        initialNexusState: 'NORMAL',
        regionalQuests: ['quest_oasis_defense', 'quest_scavenge_ruins'],
        regionalEvents: ['TRADE_ROUTE_OPENED', 'ECHO_SPIKE', 'PLAGUE_OUTBREAK'],
        spawnableCreatureTypes: ['sand_scorpion', 'fire_elemental'],
        lootTableId: 'desert_ruins',
        neighboringRegions: ['TheWhisperingReaches', 'TheShatteredPeaks', 'TheAshfallWastes']
    },
    "TheAzureForest": {
        id: "TheAzureForest",
        name: "Hutan Azure",
        description: "Hutan lebat dengan kanopi biru kehijauan, penuh dengan kehidupan liar dan jalur rahasia. Udara lembap dan kaya akan aroma bunga, menjadikannya tempat perlindungan bagi banyak makhluk.",
        climate: 'humid',
        terrainType: 'forest',
        threatLevel: 2,
        dominantFaction: 'TheForestGuardians',
        resources: ['wood', 'herbs', 'wild_game', 'silk_fiber'],
        initialNexusState: 'NORMAL',
        regionalQuests: ['quest_poacher_hunt', 'quest_ancient_tree_ritual'],
        regionalEvents: ['SANCTUM_BLESSING', 'RESOURCE_BONANZA'],
        spawnableCreatureTypes: ['dire_wolf', 'forest_sprite'],
        lootTableId: 'default_wilderness',
        neighboringRegions: ['TheLuminousPlains', 'TheSunkenCity', 'TheWhisperingWoods']
    },
    "TheSunkenCity": {
        id: "TheSunkenCity",
        name: "Kota Tenggelam",
        description: "Sisa-sisa peradaban kuno yang kini berada di bawah gelombang, dihuni oleh makhluk-makhluk laut yang aneh dan artefak yang basah. Mistery dan bahaya bersembunyi di kedalamannya.",
        climate: 'aquatic',
        terrainType: 'oceanic',
        threatLevel: 4,
        dominantFaction: 'TheDeepOnes',
        resources: ['sea_minerals', 'ancient_relics', 'abyssal_pearls'],
        initialNexusState: 'UNSTABLE',
        regionalQuests: ['quest_lost_treasures', 'quest_deepsea_expedition'],
        regionalEvents: ['ECHO_SPIKE', 'PLAGUE_OUTBREAK'],
        spawnableCreatureTypes: ['abyssal_angler', 'deep_sea_horror'],
        lootTableId: 'aquatic_depths',
        neighboringRegions: ['TheAzureForest', 'TheFloatingIslands']
    },
    "TheFloatingIslands": {
        id: "TheFloatingIslands",
        name: "Pulau-pulau Melayang",
        description: "Kumpulan pulau-pulau tanah yang mengambang di atas kehampaan, terhubung oleh jembatan kuno dan angin kencang. Pemandangan menakjubkan dan bahaya ketinggian, serta rahasia langit.",
        climate: 'temperate',
        terrainType: 'floating_islands',
        threatLevel: 5,
        dominantFaction: 'TheSkySentinels',
        resources: ['rare_gems', 'wind_essence', 'cloud_silk'],
        initialNexusState: 'NORMAL',
        regionalQuests: ['quest_aerie_defense', 'quest_celestial_alignment'],
        regionalEvents: ['LANDMARK_TRANSFORMATION', 'RESOURCE_BONANZA'],
        spawnableCreatureTypes: ['sky_serpent', 'cloud_elemental'],
        lootTableId: 'floating_sky',
        neighboringRegions: ['TheSunkenCity', 'TheShatteredPeaks']
    },
    "TheAshfallWastes": {
        id: "TheAshfallWastes",
        name: "Limbah Abu Vulkanik",
        description: "Tanah tandus yang tertutup abu dari letusan kuno, penuh dengan celah magma dan makhluk-makhluk yang beradaptasi dengan panas. Udara berat dan berbau belerang.",
        climate: 'volcanic',
        terrainType: 'volcanic',
        threatLevel: 4,
        dominantFaction: 'TheCinderTribes',
        resources: ['obsidian', 'sulfur', 'volcanic_ash'],
        initialNexusState: 'MAELSTROM',
        regionalQuests: ['quest_magma_core', 'quest_ash_mining_expedition'],
        regionalEvents: ['LANDMARK_TRANSFORMATION', 'ECHO_SPIKE', 'PLAGUE_OUTBREAK'],
        spawnableCreatureTypes: ['ash_golem', 'fire_elemental'],
        lootTableId: 'corrupted_area',
        neighboringRegions: ['TheCrimsonDesert', 'TheSilentCanyon']
    },
    "TheSilentCanyon": {
        id: "TheSilentCanyon",
        name: "Ngarai Senyap",
        description: "Ngarai dalam yang sunyi, di mana tidak ada angin yang berbisik dan tidak ada makhluk yang bersuara. Sebuah ketenangan yang menipu, seringkali menjadi tempat persembunyian makhluk-makhluk tersembunyi.",
        climate: 'temperate',
        terrainType: 'mountainous',
        threatLevel: 2,
        dominantFaction: 'TheHermits',
        resources: ['rare_minerals', 'cave_flora'],
        initialNexusState: 'NORMAL',
        regionalQuests: ['quest_canyon_exploration'],
        regionalEvents: ['HERO_EMERGENCE'],
        spawnableCreatureTypes: ['cave_spider', 'gargoyle'],
        lootTableId: 'default_wilderness',
        neighboringRegions: ['TheWhisperingReaches', 'TheAshfallWastes']
    },
    "TheWhisperingWoods": {
        id: "TheWhisperingWoods",
        name: "Hutan Berbisik",
        description: "Hutan kuno yang gelap dan padat, di mana pepohonan tua memiliki cabang yang bengkok dan dedaunan yang selalu bergoyang seolah berbisik. Atmosfernya sering terasa menekan.",
        climate: 'humid',
        terrainType: 'forest',
        threatLevel: 3,
        dominantFaction: 'TheForestSpirits',
        resources: ['ancient_wood', 'mystic_herbs', 'spirit_essence'],
        initialNexusState: 'UNSTABLE',
        regionalQuests: ['quest_spirit_communion'],
        regionalEvents: ['ECHO_SPIKE'],
        spawnableCreatureTypes: ['dire_wolf_corrupted', 'shadow_beast'],
        lootTableId: 'corrupted_area',
        neighboringRegions: ['TheAzureForest', 'TheWhisperingReaches']
    },
    "TheEternalGlacier": {
        id: "TheEternalGlacier",
        name: "Gletser Abadi",
        description: "Hamparan es dan salju yang luas, dingin dan berbahaya. Hanya makhluk paling tangguh yang bertahan di sini, menyimpan rahasia-rahasia yang beku di bawah permukaannya.",
        climate: 'arctic',
        terrainType: 'tundra',
        threatLevel: 5,
        dominantFaction: 'TheIceGuardians',
        resources: ['ice_crystal', 'frozen_essence', 'pristine_fur'],
        initialNexusState: 'NORMAL',
        regionalQuests: ['quest_frozen_relic', 'quest_ice_wyrm_hunt'],
        regionalEvents: ['LANDMARK_TRANSFORMATION', 'RESOURCE_BONANZA'],
        spawnableCreatureTypes: ['ice_wyrm', 'polar_bear'],
        lootTableId: 'default_wilderness',
        neighboringRegions: ['TheShatteredPeaks']
    },
    "TheVerdantJungle": {
        id: "TheVerdantJungle",
        name: "Hutan Belantara Hijau",
        description: "Hutan hujan yang lebat dan panas, penuh dengan kehidupan eksotis dan tumbuhan yang rimbun. Kelembapan tinggi dan bahaya tersembunyi di balik setiap kanopi.",
        climate: 'tropical',
        terrainType: 'jungle',
        threatLevel: 3,
        dominantFaction: 'TheAncientKeepers',
        resources: ['exotic_flora', 'vibrant_fruit', 'rare_wood'],
        initialNexusState: 'SANCTUM',
        regionalQuests: ['quest_jungle_discovery', 'quest_lost_explorer'],
        regionalEvents: ['SANCTUM_BLESSING', 'RESOURCE_BONANZA'],
        spawnableCreatureTypes: ['jungle_spider', 'vicious_ape'],
        lootTableId: 'default_wilderness',
        neighboringRegions: ['TheAzureForest']
    }
};

export const JOURNAL_ENTRY_TEMPLATES = {
    "journal_ancient_forge_rumor": {
        id: "journal_ancient_forge_rumor",
        title: "Rumor Reruntuhan Tempaan Kuno",
        content: "Aku mendengar desas-desus tentang reruntuhan tempaan kuno di {regionName}. Konon, itu adalah tempat para Penempa pertama menciptakan dunia.",
        category: "Landmark",
        icon: 'anchor'
    },
    "journal_whispering_cave_discovery": {
        id: "journal_whispering_cave_discovery",
        title: "Penemuan Gua Berbisik",
        content: "Setelah berhari-hari mencari, aku menemukan Gua Berbisik. Udara di dalamnya terasa dingin, dan bisikan-bisikan samar terdengar dari kedalamannya.",
        category: "Landmark",
        icon: 'cloud-off'
    },
    "journal_sunken_library_notes": {
        id: "journal_sunken_library_notes",
        title: "Catatan Perpustakaan Tenggelam",
        content: (data) => `Perpustakaan ini mungkin tenggelam, tetapi pengetahuannya tetap ada. Aku menemukan beberapa gulungan yang membahas tentang ${data.topic || 'sejarah kuno'} dan rahasia laut dalam.`,
        category: "Landmark",
        icon: 'book'
    },
    "journal_celestial_map_lore": {
        id: "journal_celestial_map_lore",
        title: "Misteri Peta Surgawi",
        content: "Peta surgawi ini menunjukkan lokasi-lokasi yang tidak ada di peta biasa. Ini mungkin menuntuku ke tempat-tempat yang belum terjamah oleh siapapun.",
        category: "Item",
        icon: 'map'
    },
    "journal_tome_of_forgotten_rituals": { // Corrected ID from previous turn to match TRADABLE_ITEMS_DATA
        id: "journal_tome_of_forgotten_rituals",
        title: "Kitab Ritual Terlupakan",
        content: "Kitab ini dipenuhi dengan tulisan tangan kuno tentang ritual yang telah lama dilupakan. Beberapa di antaranya tampak berhubungan dengan Gema, sementara yang lain mungkin memegang kunci kekuatan tersembunyi.",
        category: "Lore",
        icon: 'book-open'
    },
    "journal_echo_horror_encounter": {
        id: "journal_echo_horror_encounter",
        title: "Pertemuan dengan Horor Gema",
        content: (data) => `Aku bertemu dengan makhluk yang mengerikan, Horor Gema, di ${data.regionName}. Bisikannya hampir membuatku gila, tapi aku berhasil selamat.`,
        category: "Creature",
        icon: 'skull'
    },
    "journal_quest_accepted": {
        id: "journal_quest_accepted",
        title: "Misi Baru Diterima",
        content: (data) => `Aku menerima misi baru dari ${data.npcName}: "${data.questName}". Semoga ini membawa tujuan baru bagi perjalananku.`,
        category: "Quest",
        icon: 'clipboard-list'
    },
    "journal_quest_completed": {
        id: "journal_quest_completed",
        title: "Misi Selesai",
        content: (data) => `Misi "${data.questName}" berhasil kuselesaikan. ${data.rewardDescription} diberikan. Aku merasakan arah baru dalam takdirku.`,
        category: "Quest",
        icon: 'check-square'
    },
    "journal_cosmic_cycle_change": {
        id: "journal_cosmic_cycle_change",
        title: (data) => `Pergeseran Siklus Kosmik: ${data.cycleName}`,
        content: (data) => `Dunia telah memasuki fase ${data.cycleName}. ${data.description} Perubahan ini terasa di seluruh alam.`,
        category: "World Event",
        icon: 'globe'
    },
    "journal_plague_outbreak": {
        id: "journal_plague_outbreak",
        title: "Wabah Penyakit",
        content: (data) => `Wabah penyakit melanda ${data.regionName}, membawa penderitaan dan kematian. Udara terasa berat.`,
        category: "World Event",
        icon: 'biohazard'
    },
    "journal_rare_item_found": {
        id: "journal_rare_item_found",
        title: "Item Langka Ditemukan",
        content: (data) => `Aku menemukan ${data.itemName}, sebuah artefak langka yang memancarkan aura ${data.auraType || 'misterius'}.`,
        category: "Item",
        icon: 'sparkles'
    },
    // NEW Journal Entries: More specific categories and content
    "journal_npc_dialogue": {
        id: "journal_npc_dialogue",
        title: (data) => `Berbicara dengan ${data.npcName}`,
        content: (data) => `Aku berinteraksi dengan ${data.npcName} di ${data.regionName}. Kami membicarakan tentang: "${data.topicSummary}".`,
        category: "Character",
        icon: 'message-square'
    },
    "journal_faction_interaction": {
        id: "journal_faction_interaction",
        title: (data) => `Interaksi Faksi: ${data.factionName}`,
        content: (data) => `Aku terlibat dengan faksi ${data.factionName}. Hubunganku dengan mereka sekarang ${data.newReputationLevel}.`,
        category: "Faction",
        icon: 'shield'
    },
    "journal_new_region_discovered": {
        id: "journal_new_region_discovered",
        title: (data) => `Wilayah Baru Ditemukan: ${data.regionName}`,
        content: (data) => `Aku telah menemukan ${data.regionName}, sebuah tanah ${data.terrainType} dengan iklim ${data.climate}. Ancaman di sini terasa ${data.threatLevel}.`,
        category: "Exploration",
        icon: 'map-pin'
    },
    "journal_legacy_earned": {
        id: "journal_legacy_earned",
        title: (data) => `Warisan Terukir: ${data.milestoneName}`,
        content: (data) => `Aku mencapai tonggak penting: "${data.milestoneDescription}". Ini menambahkan ${data.points} poin ke Warisanku.`,
        category: "Legacy",
        icon: 'award'
    },
    "journal_reflection": {
        id: "journal_reflection",
        title: "Refleksi Pribadi",
        content: (data) => data.reflectionText,
        category: "Reflection",
        icon: 'feather'
    }
};

export const FACTIONS_DATA = {
    'TheArbiters': {
        id: 'TheArbiters',
        name: 'The Arbiters',
        description: 'Penjaga keseimbangan dan kebenaran, berusaha menjaga stabilitas Nexus Pusat. Mereka sering berkonflik dengan kekuatan Gema.',
        type: 'political',
        dominantRegions: ['TheCentralNexus'],
        relationships: { 'TheEchoCult': 'rivalry', 'TheLuminousGuardians': 'alliance', 'TraderGuild': 'neutral', 'TheCinderTribes': 'rivalry' },
        typicalNpcTraits: ['stoic', 'disciplined', 'courageous'],
        notableResources: ['essence_crystal', 'rare_minerals'],
        baseReputation: 20
    },
    'TheEchoCult': {
        id: 'TheEchoCult',
        name: 'The Echo Cult',
        description: 'Kelompok yang menyembah Gema, percaya bahwa kehampaan adalah takdir sejati. Mereka berusaha menyebarkan korupsi. Memusuhi semua yang bukan dari mereka.',
        type: 'religious',
        dominantRegions: ['TheWhisperingReaches', 'TheAshfallWastes'],
        relationships: { 'TheArbiters': 'hostile_by_default', 'TheLuminousGuardians': 'hostile_by_default', 'TraderGuild': 'hostile_by_default' },
        typicalNpcTraits: ['pessimistic', 'fanatical', 'vengeful', 'fearful'],
        notableResources: ['shadow_essence', 'mutated_flora'],
        baseReputation: -50
    },
    'TheLuminousGuardians': {
        id: 'TheLuminousGuardians',
        name: 'The Luminous Guardians',
        description: 'Pelindung cahaya Intensi, mereka berdedikasi untuk memurnikan dunia dari Gema dan membantu mereka yang membutuhkan. Cahaya adalah panduan mereka.',
        type: 'religious',
        dominantRegions: ['TheLuminousPlains', 'TheAzureForest'],
        relationships: { 'TheEchoCult': 'rivalry', 'TheArbiters': 'alliance', 'TheDeepOnes': 'rivalry' },
        typicalNpcTraits: ['optimistic', 'generous', 'courageous', 'loyal'],
        notableResources: ['healing_herbs', 'pure_water'],
        baseReputation: 30
    },
    'TraderGuild': {
        id: 'TraderGuild',
        name: 'Trader Guild',
        description: 'Organisasi pedagang yang bergerak di seluruh dunia, selalu mencari keuntungan dan jalur perdagangan baru. Mereka netral dalam sebagian besar konflik, selama itu tidak mengganggu bisnis.',
        type: 'neutral_trade',
        dominantRegions: ['TheCrimsonDesert', 'TheFloatingIslands'],
        relationships: { 'TheArbiters': 'neutral', 'TheEchoCult': 'neutral', 'TheStonekin': 'neutral' },
        typicalNpcTraits: ['greedy', 'cautious', 'gregarious'],
        notableResources: ['gold_coin', 'rare_tradables'],
        baseReputation: 10
    },
    'TheStonekin': {
        id: 'TheStonekin',
        name: 'The Stonekin',
        description: 'Ras kuno penghuni gunung, kuat dan pantang menyerah. Mereka melindungi tanah pegunungan mereka dari penyusup dan ancaman. Hubungan mereka dengan dunia luar seringkali tegang.',
        type: 'ancient_race',
        dominantRegions: ['TheShatteredPeaks'],
        relationships: { 'TheEchoCult': 'rivalry', 'TraderGuild': 'neutral', 'TheArbiters': 'neutral' },
        typicalNpcTraits: ['stoic', 'loyal', 'courageous', 'solitary'],
        notableResources: ['rare_minerals', 'golem_parts'],
        baseReputation: 0
    },
    'TheDeepOnes': {
        id: 'TheDeepOnes',
        name: 'The Deep Ones',
        description: 'Penghuni kedalaman kota-kota tenggelam, misterius dan sering kali memusuhi permukaan. Mereka menjaga rahasia kuno yang terendam, memandang rendah makhluk daratan.',
        type: 'monster_horde',
        dominantRegions: ['TheSunkenCity'],
        relationships: { 'TheLuminousGuardians': 'hostile_by_default', 'TraderGuild': 'hostile_by_default' },
        typicalNpcTraits: ['solitary', 'vengeful', 'arrogant'],
        notableResources: ['abyssal_pearls', 'ancient_relics'],
        baseReputation: -40
    },
    'TheSkySentinels': {
        id: 'TheSkySentinels',
        name: 'The Sky Sentinels',
        description: 'Penjaga langit dan pulau-pulau melayang, mereka adalah pilot ahli dan pejuang udara yang tak kenal takut. Mereka memantau ancaman dari atas.',
        type: 'political',
        dominantRegions: ['TheFloatingIslands'],
        relationships: { 'TheEchoCult': 'rivalry', 'TheArbiters': 'alliance' },
        typicalNpcTraits: ['courageous', 'disciplined', 'curious'],
        notableResources: ['rare_gems', 'wind_essence'],
        baseReputation: 25
    },
    'TheCinderTribes': {
        id: 'TheCinderTribes',
        name: 'The Cinder Tribes',
        description: 'Suku-suku nomaden yang hidup di tanah vulkanik, beradaptasi dengan lingkungan keras. Terkenal karena keterampilan bertahan hidup dan pertempuran ganas, mereka tidak percaya pada orang luar.',
        type: 'political',
        dominantRegions: ['TheAshfallWastes', 'TheCrimsonDesert'],
        relationships: { 'TheSandWorshippers': 'rivalry', 'TraderGuild': 'neutral' },
        typicalNpcTraits: ['fierce', 'resilient', 'cautious'],
        notableResources: ['obsidian', 'sulfur'],
        baseReputation: -10
    },
    'TheHermits': {
        id: 'TheHermits',
        name: 'The Hermits of Silent Canyon',
        description: 'Kelompok pertapa yang hidup terpencil di Ngarai Senyap, mencari kedamaian dan pengetahuan kuno. Mereka umumnya netral tetapi bisa memberikan wawasan unik bagi mereka yang sabar.',
        type: 'neutral_religious',
        dominantRegions: ['TheSilentCanyon'],
        relationships: {},
        typicalNpcTraits: ['wise', 'solitary', 'stoic'],
        notableResources: ['rare_minerals', 'mystic_herbs'],
        baseReputation: 0
    },
    'TheForestSpirits': {
        id: 'TheForestSpirits',
        name: 'The Forest Spirits',
        description: 'Entitas kuno penjaga hutan, sering tidak terlihat oleh mata manusia. Mereka bereaksi terhadap keseimbangan hutan, bisa menjadi pelindung atau ancaman tergantung pada tindakan Wanderer.',
        type: 'natural_entity',
        dominantRegions: ['TheWhisperingWoods', 'TheAzureForest'],
        relationships: { 'TheLuminousGuardians': 'alliance', 'TheEchoCult': 'rivalry' },
        typicalNpcTraits: ['mysterious', 'vengeful', 'protective'],
        notableResources: ['ancient_wood', 'mystic_herbs'],
        baseReputation: 15
    },
    'TheSandWorshippers': {
        id: 'TheSandWorshippers',
        name: 'The Sand Worshippers',
        description: 'Suku-suku gurun yang memuja entitas kuno di bawah pasir. Mereka gigih dan defensif terhadap wilayah mereka.',
        type: 'religious',
        dominantRegions: ['TheCrimsonDesert'],
        relationships: { 'TraderGuild': 'neutral', 'TheCinderTribes': 'rivalry' },
        typicalNpcTraits: ['loyal', 'courageous', 'fierce'],
        notableResources: ['sunstone', 'desert_minerals'],
        baseReputation: -5
    },
    'TheIceGuardians': {
        id: 'TheIceGuardians',
        name: 'The Ice Guardians',
        description: 'Penjaga gletser abadi, makhluk purba yang beradaptasi dengan dingin ekstrem. Mereka sangat teritorial dan jarang berinteraksi dengan dunia luar.',
        type: 'ancient_race',
        dominantRegions: ['TheEternalGlacier'],
        relationships: { 'TraderGuild': 'neutral' },
        typicalNpcTraits: ['stoic', 'solitary', 'resilient'],
        notableResources: ['ice_crystal', 'frozen_essence'],
        baseReputation: -10
    },
    'TheAncientKeepers': {
        id: 'TheAncientKeepers',
        name: 'The Ancient Keepers',
        description: 'Makhluk-makhluk kuno dan bijaksana yang melindungi hutan belantara. Mereka adalah entitas penjaga yang memastikan keseimbangan alam tetap terjaga.',
        type: 'natural_entity',
        dominantRegions: ['TheVerdantJungle'],
        relationships: { 'TheLuminousGuardians': 'alliance' },
        typicalNpcTraits: ['wise', 'cautious', 'protective'],
        notableResources: ['exotic_flora', 'vibrant_fruit'],
        baseReputation: 20
    }
};

export const JOURNAL_ENTRY_TEMPLATES = {
    "journal_ancient_forge_rumor": {
        id: "journal_ancient_forge_rumor",
        title: "Rumor Reruntuhan Tempaan Kuno",
        content: "Aku mendengar desas-desus tentang reruntuhan tempaan kuno di {regionName}. Konon, itu adalah tempat para Penempa pertama menciptakan dunia.",
        category: "Landmark",
        icon: 'anchor'
    },
    "journal_whispering_cave_discovery": {
        id: "journal_whispering_cave_discovery",
        title: "Penemuan Gua Berbisik",
        content: "Setelah berhari-hari mencari, aku menemukan Gua Berbisik. Udara di dalamnya terasa dingin, dan bisikan-bisikan samar terdengar dari kedalamannya.",
        category: "Landmark",
        icon: 'cloud-off'
    },
    "journal_sunken_library_notes": {
        id: "journal_sunken_library_notes",
        title: "Catatan Perpustakaan Tenggelam",
        content: (data) => `Perpustakaan ini mungkin tenggelam, tetapi pengetahuannya tetap ada. Aku menemukan beberapa gulungan yang membahas tentang ${data.topic || 'sejarah kuno'} dan rahasia laut dalam.`,
        category: "Landmark",
        icon: 'book'
    },
    "journal_celestial_map_lore": {
        id: "journal_celestial_map_lore",
        title: "Misteri Peta Surgawi",
        content: "Peta surgawi ini menunjukkan lokasi-lokasi yang tidak ada di peta biasa. Ini mungkin menuntuku ke tempat-tempat yang belum terjamah oleh siapapun.",
        category: "Item",
        icon: 'map'
    },
    "journal_tome_of_forgotten_rituals": { // Corrected ID from previous turn to match TRADABLE_ITEMS_DATA
        id: "journal_tome_of_forgotten_rituals",
        title: "Kitab Ritual Terlupakan",
        content: "Kitab ini dipenuhi dengan tulisan tangan kuno tentang ritual yang telah lama dilupakan. Beberapa di antaranya tampak berhubungan dengan Gema, sementara yang lain mungkin memegang kunci kekuatan tersembunyi.",
        category: "Lore",
        icon: 'book-open'
    },
    "journal_echo_horror_encounter": {
        id: "journal_echo_horror_encounter",
        title: "Pertemuan dengan Horor Gema",
        content: (data) => `Aku bertemu dengan makhluk yang mengerikan, Horor Gema, di ${data.regionName}. Bisikannya hampir membuatku gila, tapi aku berhasil selamat.`,
        category: "Creature",
        icon: 'skull'
    },
    "journal_quest_accepted": {
        id: "journal_quest_accepted",
        title: "Misi Baru Diterima",
        content: (data) => `Aku menerima misi baru dari ${data.npcName}: "${data.questName}". Semoga ini membawa tujuan baru bagi perjalananku.`,
        category: "Quest",
        icon: 'clipboard-list'
    },
    "journal_quest_completed": {
        id: "journal_quest_completed",
        title: "Misi Selesai",
        content: (data) => `Misi "${data.questName}" berhasil kuselesaikan. ${data.rewardDescription} diberikan. Aku merasakan arah baru dalam takdirku.`,
        category: "Quest",
        icon: 'check-square'
    },
    "journal_cosmic_cycle_change": {
        id: "journal_cosmic_cycle_change",
        title: (data) => `Pergeseran Siklus Kosmik: ${data.cycleName}`,
        content: (data) => `Dunia telah memasuki fase ${data.cycleName}. ${data.description} Perubahan ini terasa di seluruh alam.`,
        category: "World Event",
        icon: 'globe'
    },
    "journal_plague_outbreak": {
        id: "journal_plague_outbreak",
        title: "Wabah Penyakit",
        content: (data) => `Wabah penyakit melanda ${data.regionName}, membawa penderitaan dan kematian. Udara terasa berat.`,
        category: "World Event",
        icon: 'biohazard'
    },
    "journal_rare_item_found": {
        id: "journal_rare_item_found",
        title: "Item Langka Ditemukan",
        content: (data) => `Aku menemukan ${data.itemName}, sebuah artefak langka yang memancarkan aura ${data.auraType || 'misterius'}.`,
        category: "Item",
        icon: 'sparkles'
    },
    // NEW Journal Entries: More specific categories and content
    "journal_npc_dialogue": {
        id: "journal_npc_dialogue",
        title: (data) => `Berbicara dengan ${data.npcName}`,
        content: (data) => `Aku berinteraksi dengan ${data.npcName} di ${data.regionName}. Kami membicarakan tentang: "${data.topicSummary}".`,
        category: "Character",
        icon: 'message-square'
    },
    "journal_faction_interaction": {
        id: "journal_faction_interaction",
        title: (data) => `Interaksi Faksi: ${data.factionName}`,
        content: (data) => `Aku terlibat dengan faksi ${data.factionName}. Hubunganku dengan mereka sekarang ${data.newReputationLevel}.`,
        category: "Faction",
        icon: 'shield'
    },
    "journal_new_region_discovered": {
        id: "journal_new_region_discovered",
        title: (data) => `Wilayah Baru Ditemukan: ${data.regionName}`,
        content: (data) => `Aku telah menemukan ${data.regionName}, sebuah tanah ${data.terrainType} dengan iklim ${data.climate}. Ancaman di sini terasa ${data.threatLevel}.`,
        category: "Exploration",
        icon: 'map-pin'
    },
    "journal_legacy_earned": {
        id: "journal_legacy_earned",
        title: (data) => `Warisan Terukir: ${data.milestoneName}`,
        content: (data) => `Aku mencapai tonggak penting: "${data.milestoneDescription}". Ini menambahkan ${data.points} poin ke Warisanku.`,
        category: "Legacy",
        icon: 'award'
    },
    "journal_reflection": {
        id: "journal_reflection",
        title: "Refleksi Pribadi",
        content: (data) => data.reflectionText,
        category: "Reflection",
        icon: 'feather'
    }
};