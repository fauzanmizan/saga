// js/data/npcs.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-27, 03:20 WITA ==
// == PERIHAL: Refactoring GameData.js - Pemindahan Data Faksi ke npcs.js ==
// - Menampung semua data statis terkait NPC, life stages, health states, factions, archetypes, dll.
// - Memindahkan FACTIONS_DATA dari gameData.js.
// ===========================================
// (Catatan perubahan lama lainnya akan tetap di bawah ini)

/**
 * @typedef {object} NpcLifeStage
 * @property {string} stage - Nama tahapan kehidupan.
 * @property {number} minAge - Usia minimum untuk tahapan ini.
 * @property {number} maxAge - Usia maksimum untuk tahapan ini.
 * @property {number} mortalityRiskFactor - Faktor risiko kematian dasar pada tahapan ini.
 * @property {number} fertilityFactor - Faktor kesuburan (relevan untuk simulasi populasi).
 * @property {number} resilience - Bonus/penalti terhadap penurunan kesehatan (0.0 - 1.0).
 * @property {number} diseaseResistance - Resistensi terhadap penyakit/efek status.
 * @property {number} environmentalTolerance - Toleransi terhadap lingkungan yang keras.
 */
export const NPC_LIFESTAGES = [
    { stage: 'Child', minAge: 0, maxAge: 10, mortalityRiskFactor: 0.005, fertilityFactor: 0.00, resilience: 0.15, diseaseResistance: 0.1, environmentalTolerance: 0.1 },
    { stage: 'Adolescent', minAge: 11, maxAge: 18, mortalityRiskFactor: 0.01, fertilityFactor: 0.05, resilience: 0.10, diseaseResistance: 0.05, environmentalTolerance: 0.05 },
    { stage: 'Adult', minAge: 19, maxAge: 60, mortalityRiskFactor: 0.015, fertilityFactor: 0.10, resilience: 0.05, diseaseResistance: 0.02, environmentalTolerance: 0 },
    { stage: 'Elder', minAge: 61, maxAge: 90, mortalityRiskFactor: 0.05, fertilityFactor: 0.02, resilience: -0.05, diseaseResistance: -0.05, environmentalTolerance: -0.05 },
    { stage: 'Venerable', minAge: 91, maxAge: Infinity, mortalityRiskFactor: 0.12, fertilityFactor: 0.00, resilience: -0.10, diseaseResistance: -0.1, environmentalTolerance: -0.1 }
];

/**
 * @typedef {object} NpcHealthState
 * @property {string} id - ID unik status kesehatan.
 * @property {string} description - Deskripsi status kesehatan.
 * @property {number} baseDecayRate - Tingkat penurunan kesehatan dasar harian (0.0 - 1.0) untuk transisi healthState.
 * @property {number} baseRegenRate - Tingkat regenerasi currentHealth dasar harian (0.0 - 1.0).
 * @property {number} echoBias - Seberapa rentan/memicu NPC terhadap Gema (0 - 100).
 * @property {number} mortalityMultiplier - Pengali risiko kematian saat dalam status ini.
 * @property {number} corruptionSpreadChance - Peluang harian untuk memicu event korupsi jika CORRUPTED.
 * @property {number} resistanceBonus - Bonus/penalti resistensi terhadap pengaruh negatif lingkungan.
 */
export const NPC_HEALTH_STATES = {
    VIBRANT: {
        id: 'vibrant',
        description: 'Penuh energi, vitalitas tinggi. Menarik keberuntungan dan ketahanan.',
        baseDecayRate: 0.005, // 0.5% peluang penurunan ke healthState berikutnya
        baseRegenRate: 0.05,  // 5% currentHealth regen per hari
        echoBias: 0,
        mortalityMultiplier: 0.5, // Risiko kematian setengah
        corruptionSpreadChance: 0,
        resistanceBonus: 0.1, // Bonus 10% resistensi
    },
    NORMAL: {
        id: 'normal',
        description: 'Sehat dan stabil. Kondisi umum.',
        baseDecayRate: 0.01, // 1% peluang
        baseRegenRate: 0.03, // 3% currentHealth regen
        echoBias: 0,
        mortalityMultiplier: 1, // Risiko kematian normal
        corruptionSpreadChance: 0,
        resistanceBonus: 0,
    },
    FRAIL: {
        id: 'frail',
        description: 'Kesehatan menurun, rentan terhadap penyakit, Gema, dan kelemahan fisik.',
        baseDecayRate: 0.03, // 3% peluang
        baseRegenRate: 0.01, // 1% currentHealth regen
        echoBias: 10,     // Sedikit menarik Gema
        mortalityMultiplier: 2, // Risiko kematian 2x
        corruptionSpreadChance: 0.01, // 1% peluang menyebarkan korupsi
        resistanceBonus: -0.05, // Penalti 5% resistensi
    },
    CORRUPTED: {
        id: 'corrupted',
        description: 'Terkontaminasi oleh Gema. Penuh penderitaan, memancarkan pengaruh negatif, dan mendekati akhir.',
        baseDecayRate: 0.07, // 7% peluang
        baseRegenRate: 0,    // Tidak ada regenerasi pasif
        echoBias: 30,     // Sangat menarik dan memancarkan Gema
        mortalityMultiplier: 5, // Risiko kematian 5x
        corruptionSpreadChance: 0.08, // 8% peluang menyebarkan korupsi
        resistanceBonus: -0.15, // Penalti 15% resistensi
        // Properti khusus Corrupted
        whisperTriggerChance: 0.05, // Peluang harian memicu Whisper spesifik
        environmentalCorruptionImpact: 0.02 // Seberapa besar mempengaruhi Nexus State di sekitar
    }
};

export const NPC_PERSONALITY_TRAITS = [
    { id: 'optimistic', name: 'Optimis', description: 'Cenderung melihat sisi terang. Memiliki bonus kecil dalam interaksi yang meningkatkan Intention.' },
    { id: 'pessimistic', name: 'Pesimis', description: 'Cenderung melihat sisi gelap. Rentan terhadap Gema, mungkin memicu Whispers lebih sering.' },
    { id: 'stoic', name: 'Stoik', description: 'Sulit digoyahkan secara emosional. Mini-game interogasi lebih menantang.' },
    { id: 'curious', name: 'Kepo', description: 'Haus akan pengetahuan. Lebih mungkin untuk menemukan Glimmers.' },
    { id: 'gregarious', name: 'Suka Berteman', description: 'Senang berinteraksi. Meningkatkan Social XP dari interaksi.' },
    { id: 'solitary', name: 'Penyendiri', description: 'Lebih suka menyendiri. Lebih rentan terhadap Whispers di wilayah dengan Echo tinggi.' },
    { id: 'courageous', name: 'Pemberani', description: 'Tidak gentar menghadapi bahaya. Lebih tahan terhadap efek negatif dari Maelstrom.' },
    { id: 'cautious', name: 'Hati-hati', description: 'Mempertimbangkan risiko. Cenderung menghindari tindakan berisiko dalam encounters.' },
    // NEW Personality Traits
    { id: 'greedy', name: 'Serakah', description: 'Selalu mencari keuntungan pribadi. Menawarkan misi dengan hadiah emas lebih tinggi, tetapi sulit ditawar.' },
    { id: 'generous', name: 'Murah Hati', description: 'Suka memberi. Memberikan diskon atau hadiah kecil secara acak.' },
    { id: 'vengeful', name: 'Pendendam', description: 'Tidak mudah melupakan penghinaan. Reputasi negatif memudar lebih lambat, bisa memicu serangan balasan.' },
    { id: 'loyal', name: 'Setia', description: 'Sangat setia pada faksi atau teman. Reputasi positif lebih sulit turun, bisa ikut bertarung membantu Wanderer.' },
    { id: 'wise', name: 'Bijaksana', description: 'Penuh pengalaman dan pengetahuan. Sering memberikan petunjuk lore atau nasihat.' },
    { id: 'fearful', name: 'Penakut', description: 'Mudah ketakutan. Cenderung melarikan diri dari bahaya, menawarkan misi melarikan diri/perlindungan.' },
    { id: 'mysterious', name: 'Misterius', description: 'Menyimpan rahasia, sulit diprediksi. Dialognya mungkin lebih ambigu atau memicu lore tersembunyi.' },
    { id: 'arrogant', name: 'Sombong', description: 'Memandang rendah orang lain. Reputasi negatif lebih mudah didapat, reputasi positif lebih sulit.' },
    { id: 'empath', name: 'Empati', description: 'Sangat peka terhadap emosi. Lebih mudah dipengaruhi oleh Intention, lebih cepat pulih dari trauma.' },
    { id: 'manipulative', name: 'Manipulatif', description: 'Cenderung memanipulasi situasi untuk keuntungan. Menawarkan misi dengan agenda tersembunyi.' }
];

export const NPC_REPUTATION_LEVELS = [
    { threshold: 90, name: 'Champion/Hero', description: 'Simbol harapan, nama dielu-elukan. Diskon 50%, akses peralatan khusus, pengaruh kebijakan faksi.', dialogueModifier: 'heroic', interactionBonus: { shopDiscount: 0.5, questRewardMultiplier: 1.5 } },
    { threshold: 75, name: 'Close Ally', description: 'Hampir bagian dari faksi, aset berharga. Diskon 40%, akses penuh area faksi, bantuan dalam pertempuran.', dialogueModifier: 'ally', interactionBonus: { shopDiscount: 0.4, questRewardMultiplier: 1.3 } },
    { threshold: 60, name: 'Trusted', description: 'Figur diandalkan, dipercaya dengan rahasia. Diskon 30%, akses area terbatas, penjaga mengabaikan pelanggaran kecil.', dialogueModifier: 'trusted', interactionBonus: { shopDiscount: 0.3, questRewardMultiplier: 1.2 } },
    { threshold: 45, name: 'Very Friendly', description: 'Dianggap teman, senang melihat Anda. Diskon 20%, bantuan dalam pertempuran kecil.', dialogueModifier: 'very_friendly', interactionBonus: { shopDiscount: 0.2, questRewardMultiplier: 1.1 } },
    { threshold: 26, name: 'Pleasant', description: 'Disukai, senang berinteraksi. Diskon 10%, petunjuk berguna, misi bervariasi.', dialogueModifier: 'pleasant', interactionBonus: { shopDiscount: 0.1, questRewardMultiplier: 1.05 } },
    { threshold: 1, name: 'Slightly Favored', description: 'Kesan baik, potensi hubungan lebih baik. Diskon kecil 5%.', dialogueModifier: 'favored', interactionBonus: { shopDiscount: 0.05 } },
    { threshold: 0, name: 'Neutral', description: 'Titik awal, orang asing. Interaksi standar, harga normal.', dialogueModifier: 'neutral', interactionBonus: {} },
    { threshold: -25, name: 'Weighing Options', description: 'Mempertimbangkan kepercayaan setelah tindakan masa lalu yang sedikit negatif. Netral tapi menjaga jarak.', dialogueModifier: 'wary', interactionPenalty: { shopPenalty: 0.1 } },
    { threshold: -45, name: 'Indifferent, but Wary', description: 'Tidak disukai tapi tidak dibenci, hati-hati. Harga naik 50%, misi terbatas.', dialogueModifier: 'indifferent_wary', interactionPenalty: { shopPenalty: 0.25 } },
    { threshold: -60, name: 'Disliked', description: 'Tidak populer, menunjukkan ketidaknyamanan. Beberapa penjual menolak, sulit dapat misi.', dialogueModifier: 'disliked', interactionPenalty: { shopPenalty: 0.5 } },
    { threshold: -75, name: 'Untrustworthy', description: 'Tidak percaya sama sekali, ancaman potensial. Harga naik 100-150%, NPC melaporkan pelanggaran.', dialogueModifier: 'untrustworthy', interactionPenalty: { shopPenalty: 1.0, hostileChance: 0.1 } },
    { threshold: -90, name: 'High-Value Target', description: 'Buronan berbahaya, diserang terorganisir. NPC menyerang kelompok, surat perintah penangkapan.', dialogueModifier: 'high_value_target', interactionPenalty: { shopPenalty: 2.0, hostileChance: 0.5 } },
    { threshold: -100, name: 'Utterly Hunted', description: 'Musuh nomor satu, diburu & dihukum mati. NPC faksi menyerahkan segala sumber daya untuk memburu Anda.', dialogueModifier: 'hunted', interactionPenalty: { shopPenalty: 999, hostileChance: 1.0 } }
];

export const REPUTATION_CHANGE_MAGNITUDE = {
    KEY_ACTION: { min: 20, max: 50 },
    MEDIUM_ACTION: { min: 5, max: 15 },
    SMALL_ACTION: { min: 1, max: 4 }
};

/**
 * @typedef {object} NpcRole
 * @property {string} id - Role ID ('merchant', 'guard', 'elder', 'rebel', 'healer', 'crafter', 'explorer', 'farmer', 'miner', 'scholar', 'spy', 'cultist', 'leader', 'refugee').
 * @property {string} description - Description of the role.
 * @property {string[]} [relatedSkills] - Skills associated with the role.
 * @property {object} [economicImpact] - Placeholder economic impact (e.g., 'merchant' affects prices).
 * @property {string} [socialTier] - Social standing (e.g., 'low', 'middle', 'high').
 * @property {string[]} [typicalDailyRoutine] - Sequence of actions/locations for daily routine simulation.
 */
export const NPC_ROLES = {
    MERCHANT: { id: 'merchant', description: 'Pedagang, membeli dan menjual barang. Menghubungkan ekonomi antar wilayah.', economicImpact: { buyPriceModifier: 0.1, sellPriceModifier: -0.1 }, socialTier: 'middle', typicalDailyRoutine: ['market', 'travel'] },
    GUARD: { id: 'guard', description: 'Pelindung wilayah, menjaga hukum dan ketertiban. Dapat menawarkan misi patroli atau keamanan.', socialTier: 'middle', typicalDailyRoutine: ['patrol', 'guard_post'] },
    ELDER: { id: 'elder', description: 'Sesepuh komunitas, sumber kearifan dan kadang misi. Sering memiliki pengetahuan lore yang dalam.', socialTier: 'high', typicalDailyRoutine: ['community_center', 'meditate'] },
    REBEL: { id: 'rebel', description: 'Pemberontak, menentang kekuasaan atau Gema. Dapat menawarkan misi rahasia atau sabotase.', socialTier: 'low', typicalDailyRoutine: ['hideout', 'scout'] },
    HEALER: { id: 'healer', description: 'Penyembuh, dapat mengobati luka dan penyakit. Penting untuk NPC lain dan Wanderer.', socialTier: 'middle', typicalDailyRoutine: ['clinic', 'gather_herbs'] },
    CRAFTER: { id: 'crafter', description: 'Pengrajin, dapat membuat item baru dari material. Sumber misi pengumpulan material.', socialTier: 'middle', typicalDailyRoutine: ['workshop', 'mine'] },
    EXPLORER: { id: 'explorer', description: 'Penjelajah, sering membawa informasi baru tentang wilayah yang belum dipetakan. Sumber misi eksplorasi.', socialTier: 'low', typicalDailyRoutine: ['explore_wilds', 'report_findings'] },
    FARMER: { id: 'farmer', description: 'Petani, menanam dan memanen hasil bumi. Sering membutuhkan bantuan dengan hama atau menjaga ladang.', socialTier: 'low', typicalDailyRoutine: ['farm', 'market'] },
    MINER: { id: 'miner', description: 'Penambang, menggali mineral dan batu berharga. Sering membutuhkan bantuan keamanan atau penemuan tambang baru.', socialTier: 'low', typicalDailyRoutine: ['mine', 'forge'] },
    SCHOLAR: { id: 'scholar', description: 'Cendekiawan, mengabdikan diri pada pengetahuan dan penelitian. Sumber misi lore atau pemecahan teka-teki.', socialTier: 'high', typicalDailyRoutine: ['library', 'study'] },
    SPY: { id: 'spy', description: 'Mata-mata, mengumpulkan informasi rahasia untuk faksi mereka. Dapat menawarkan misi intelijen atau pengkhianatan.', socialTier: 'covert', typicalDailyRoutine: ['shadows', 'report'] },
    CULTIST: { id: 'cultist', description: 'Anggota sekte yang memuja Gema atau kekuatan terlarang lainnya. Dapat mencoba mengkorupsi Wanderer atau NPC lain.', socialTier: 'outcast', typicalDailyRoutine: ['ritual', 'proselytize'] },
    LEADER: { id: 'leader', description: 'Pemimpin faksi atau komunitas. Memberikan misi penting, memengaruhi politik, atau membutuhkan perlindungan.', socialTier: 'highest', typicalDailyRoutine: ['throne_room', 'council_meeting'] },
    REFUGEE: { id: 'refugee', description: 'Pengungsi dari wilayah yang hancur. Dapat menceritakan kisah tragis atau meminta bantuan untuk mencari tempat baru.', socialTier: 'lowest', typicalDailyRoutine: ['seek_shelter', 'beg'] }
};

export const FACTION_TYPES = ['Neutral', 'SentinelAligned', 'HereticAligned', 'TraderGuild', 'ResistanceCell'];

// --- Placeholder for other NPC related data from user prompt ---
// NPC_RELATIONSHIP_TYPES - tidak ada di gameData.js yang diberikan sebelumnya.
// CONSCIOUSNESS_TYPES - tidak ada di gameData.js yang diberikan sebelumnya.
// NPC_TEMPLATES_CHILD - tidak ada di gameData.js yang diberikan sebelumnya.
// NPC_LEGACY_WISDOM_PROFILES - tidak ada di gameData.js yang diberikan sebelumnya.
// PRESCRIPTIVE_DIALOGUE_SIMULATION_DATA_V2 - tidak ada di gameData.js yang diberikan sebelumnya.
// NPC_ARCHETYPE_PROFILES - tidak ada di gameData.js yang diberikan sebelumnya.
// WANDERER_ARCHETYPE_RESONANCE_RULES - tidak ada di gameData.js yang diberikan sebelumnya.
// ARCHETYPE_TRANSFORMATION_QUESTS - tidak ada di gameData.js yang diberikan sebelumnya.
// NPC_ARCHETYPE_CHALLENGES_V3 - tidak ada di gameData.js yang diberikan sebelumnya.
// ARCHETYPE_CRISIS_TRIGGERS_V3 - tidak ada di gameData.js yang diberikan sebelumnya.
// REAL_WORLD_BEHAVIOR_IMPACT_EXPONENT_V3 - tidak ada di gameData.js yang diberikan sebelumnya.
// ARCHETYPE_MANIFESTATION_EFFECTS_V3 - tidak ada di gameData.js yang diberikan sebelumnya.
// REAL_WORLD_BUFFS_FROM_ARCHETYPE - tidak ada di gameData.js yang diberikan sebelumnya.
// SUBLIMINAL_BEHAVIOR_INJECTION_TEMPLATES - tidak ada di gameData.js yang diberikan sebelumnya.
// GENERATIVE_SIMULATION_PARAMETERS - tidak ada di gameData.js yang diberikan sebelumnya.