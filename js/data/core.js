// js/data/core.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-27, 12:16 WITA ==
// == PERIHAL: Refactoring GameData.js - Pemindahan Data Inti ke core.js ==
// - Menampung data inti game seperti skill tree, global attributes, birth questions, dan interrogation data.
// ===========================================

export const SKILL_TREE_DATA = {
    "Discipline": {
        5: { id: 'imprint_discipline_5', name: 'Focus Mantle', description: 'Increases Focus attribute gain by 10%.', icon: 'eye' },
        10: { id: 'imprint_discipline_10', name: 'Iron Will', description: 'Grants +5 to Composure in mental duels.', icon: 'shield' },
        20: { id: 'imprint_discipline_20', name: 'Inner Sanctum', description: 'Reduces Echo gain from negative choices by 15%.', icon: 'anchor' }
    },
    "Stamina": {
        5: { id: 'imprint_stamina_5', name: 'Resilient Form', description: 'Increases maximum HP by 10.', icon: 'heart' },
        10: { id: 'imprint_stamina_10', name: 'Unwavering Stride', description: 'Increases movement speed on world map by 5%.', icon: 'feather' },
        20: { id: 'imprint_stamina_20', name: 'Eternal Vigor', description: 'Reduces passive Composure decay by 10%.', icon: 'activity' }
    },
    "Knowledge": {
        5: { id: 'imprint_knowledge_5', name: 'Glimmer of Truth', description: 'Provides a hint towards a hidden secret in encounters (5% chance).', icon: 'lightbulb' },
        10: { id: 'imprint_knowledge_10', name: 'Ancient Lore', description: 'Unlocks access to deeper historical chronicles.', icon: 'book' },
        20: { id: 'imprint_knowledge_20', name: 'Cosmic Insight', description: 'Increases the effectiveness of "Absorb Echo" skill by 10%.', icon: 'aperture' }
    },
    "Social": {
        5: { id: 'imprint_social_5', name: 'Empathic Resonance', description: 'Improves success chance of social interactions by 5%.', icon: 'users' },
        10: { id: 'imprint_social_10', name: 'Charismatic Aura', description: 'Reduces the cost of persuasion attempts by 10%.', icon: 'smile' },
        20: { id: 'imprint_social_20', name: 'Nexus Weaver', description: 'Gain 5% more Intention from positive social interactions.', icon: 'share-2' }
    },
    "Focus": {
        5: { id: 'imprint_focus_5', name: 'Mind Clarity', description: 'Increases chance to critically succeed on mental tasks by 3%.', icon: 'target' },
        10: { id: 'imprint_focus_10', name: 'Undisturbed Flow', description: 'Passive XP gain from focused activities is increased by 15%.', icon: 'zap' },
        20: { id: 'imprint_focus_20', name: 'Singular Purpose', description: 'Doubles the bonus from your currently focused attribute.', icon: 'crosshair' }
    },
    // Archetype-specific skills
    "Inquisitor": {
        active_interrogate: {
            id: 'skill_inquisitor_interrogate',
            name: 'Menginterogasi',
            description: 'Memulai mini-game interogasi untuk memecahkan perisai mental target.',
            icon: 'search',
            cost: 5 // Essence of Will cost
        },
        passive_insight: {
            id: 'skill_inquisitor_insight',
            name: 'Tatapan Tajam',
            level: 5, // Requires Knowledge Level 5
            description: 'Ketika interogasi berlangsung, ada 15% kesempatan untuk mengungkap kelemahan tersembunyi target.',
            icon: 'eye',
            chance: 0.15 // 15% chance
        },
        passive_logic: {
            id: 'skill_inquisitor_logic',
            name: 'Logika Tanpa Celah',
            level: 10, // Requires Knowledge Level 10
            description: 'Penalti Komposur akibat argumen yang tidak efektif berkurang 25%.',
            icon: 'cpu',
            penaltyReduction: 0.25 // Reduces composure penalty by 25%
        },
        active_revelation: {
            id: 'skill_inquisitor_revelation',
            name: 'Penghakiman Terakhir',
            level: 15, // Requires Focus Level 15
            description: 'Mengonsumsi sejumlah besar Esensi Niat untuk secara paksa memecahkan satu hingga dua rune terkuat lawan.',
            icon: 'award',
            cost: 20, // Essence of Will cost
            runeBreakCount: 1 // Breaks up to 1 rune (can be configured to 2 for higher level)
        }
    },
    "Echo-Scribe": {
        active_absorb_echo: {
            id: 'skill_echoscribe_absorb',
            name: 'Menyerap Gema',
            description: 'Memulai mini-game harmonisasi gema untuk mendapatkan wawasan dari realitas.',
            icon: 'feather',
            cost: 3 // Essence of Will cost
        }
    },
    "Sentinel": {
        active_challenge: {
            id: 'skill_sentinel_challenge',
            name: 'Menantang',
            description: 'Memulai duel niat untuk menguji kekuatan tekad lawan.',
            icon: 'sword',
            cost: 5 // Essence of Will cost
        },
        ironblood: { passive: { damageReduction: 0.15 }, description: 'Darah Besi: Mengurangi semua kerusakan Tekad yang diterima sebesar 15%.' },
        second_wind: { active: { willRestore: 40, threshold: 0.25, oncePerDuel: true }, description: 'Nafas Kedua: Ketika Tekad sangat rendah, pulihkan 40 Tekad sekali per duel.' },
        titans_burden: { passive: { bonusDamageIfHighWill: 0.2 }, description: 'Pikulan Sang Raksasa: Menyebabkan 20% kerusakan bonus terhadap lawan dengan Tekad di atas 70%.' },
        steadfast_will: { passive: { willDrainResistance: 0.3 }, description: 'Tekad Teguh: Mengurangi efektivitas serangan penguras Tekad lawan sebesar 30%.' },
        counter_attack: { active: { chance: 0.3, damage: 15 }, description: 'Serangan Balasan: Memiliki peluang 30% untuk membalas dengan 15 kerusakan Tekad setelah diserang.' },
        protectors_oath: { active: { chance: 0.2, absorbDamage: 0.5 }, description: 'Sumpah Pelindung: Memiliki peluang 20% untuk menyerap 50% kerusakan masuk.' },
    },
    "Empath": {
        active_empathize: {
            id: 'skill_empath_empathize',
            name: 'Merasakan',
            description: 'Memulai mini-game harmonisasi emosi untuk memahami dan memengaruhi jiwa NPC.',
            icon: 'heart',
            cost: 3 // Essence of Will cost
        },
        calming_aura: { passive: { markerSpeedReduction: 0.2 }, description: 'Aura Menenangkan: Mengurangi kecepatan fluktuasi penanda jiwa sebesar 20%.' },
        communal_harmony: { passive: { bonusReputation: 0.10 }, description: 'Harmoni Komunal: Meningkatkan reputasi yang diperoleh dari NPC yang diselaraskan sebesar 10%.' },
        language_of_heart: { active: { revealTrueEmotion: true, oncePerEmpathize: true }, description: 'Bahasa Hati: Mengungkapkan emosi sejati lawan untuk putaran ini.' },
        echo_healer: { passive: { selfEchoHeal: 5 }, description: 'Penyembuh Gema: Setelah berhasil menyelaraskan, pulihkan 5 Echo.' },
        pure_note: { active: { perfectMatchBonus: 0.10 }, description: 'Nada Murni: Meningkatkan bonus attunement jika nada cocok sempurna sebesar 10%.' },
        inner_sanctuary: { passive: { composureRestoreChance: 0.15 }, description: 'Sanctuary Batin: Memiliki peluang 15% untuk memulihkan sedikit komposisi setelah Merasakan.' },
        song_of_conscience: { active: { alignToIntention: 0.05 }, description: 'Lagu Hati Nurani: Setelah berhasil menyelaraskan, menggeser 5% dari Gema Anda ke Niat.' },
    },
    "Will-Shaper": {
        active_inspire: {
            id: 'skill_willshaper_inspire',
            name: 'Menginspirasi',
            description: 'Memulai mini-game fokus motivasi untuk mengisi jiwa NPC dengan Niat dan tujuan.',
            icon: 'zap',
            cost: 4 // Essence of Will cost
        },
        clear_vision: { passive: { insightBonus: 0.15 }, description: 'Visi yang Jelas: Meningkatkan peluang keberhasilan inspirasi sebesar 15%.' },
        no_retreat: { passive: { penaltyReduction: 0.25 }, description: 'Tidak Ada Kata Mundur: Mengurangi penalti Komposur atau Esensi Niat saat gagal sebesar 25%.' },
        one_for_all: { passive: { essenceOfWillBonus: 0.10 }, description: 'Satu untuk Semua: Meningkatkan Esensi Niat yang diperoleh dari inspirasi yang berhasil sebesar 10%.' },
        group_tactics: { passive: { groupBonus: 0.10 }, description: 'Taktik Kelompok: Jika ada NPC lain yang dekat (mock), tingkatkan efektivitas inspirasi sebesar 10%.' },
        born_leader: { passive: { playerIntentionGain: 10 }, description: 'Pemimpin yang Dilahirkan: Setelah berhasil menginspirasi, pemain mendapatkan 10 Niat tambahan.' },
        forgers_decree: { active: { cost: 30, guaranteedSuccess: true, oncePerInspire: true }, description: 'Dekrit Sang Penempa: Mengonsumsi Esensi Niat untuk menjamin keberhasilan inspirasi atau memberikan dorongan besar.' }
    },
    "Nomad": {
        active_barter: {
            id: 'skill_nomad_barter',
            name: 'Bertukar',
            description: 'Memulai mini-game perdagangan unik untuk mendapatkan barang dari NPC.',
            icon: 'shuffle',
            cost: 2 // Essence of Will cost
        },
        bottomless_pouch: { passive: { capacityBonus: 0.20 }, description: 'Kantung Tanpa Dasar: Meningkatkan kapasitas inventaris efektif sebesar 20% (mock: mengurangi penalti barter).' },
        realm_explorer: { passive: { rareItemChance: 0.15 }, description: 'Penjelajah Alam: Meningkatkan peluang NPC menawarkan item langka sebesar 15%.' },
        terrain_adaptation: { passive: { costReduction: 0.10 }, description: 'Adaptasi Medan: Mengurangi biaya item tertentu sebesar 10%.' },
        traders_tongue: { passive: { valueBonus: 0.25 }, description: 'Lidah Pedagang: Meningkatkan nilai barter barang yang Anda tawarkan sebesar 25%.' },
        wind_whispers: { active: { revealBestTrade: true, oncePerBarter: true }, description: 'Kabar Angin: Mengungkap item terbaik untuk ditukar oleh NPC.' },
        network_weaving: { active: { specialTrade: true, cost: 50 }, description: 'Membangun Jaringan Dagang: Memungkinkan perdagangan untuk layanan/informasi unik (sangat mahal).' },
    },
    "Chronicler": {
        active_scrutinize: {
            id: 'skill_chronicler_scrutinize',
            name: 'Menyelidiki',
            description: 'Mengamati NPC untuk mengungkap rumor atau wawasan tersembunyi.',
            icon: 'book',
            cost: 2 // Essence of Will cost
        },
    },
    "Artisan": {
        active_commission: {
            id: 'skill_artisan_commission',
            name: 'Memesan',
            description: 'Memulai mini-game kerajinan kustom untuk membuat item dari material.',
            icon: 'hammer',
            cost: 4 // Essence of Will cost
        },
        material_efficiency: { passive: { materialCostReduction: 0.20 }, description: 'Efisiensi Material: Mengurangi jumlah material yang dibutuhkan sebesar 20%.' },
        swift_forging: { passive: { speedBonus: 0.15 }, description: 'Tempaan Cepat: Meningkatkan peluang keberhasilan kerajinan sebesar 15%.' },
        decomposition: { active: { restoreMaterials: 0.5, oncePerCommission: true }, description: 'Dekomposisi: Jika kerajinan gagal, pulihkan 50% material.' },
        material_analysis: { passive: { revealOptimalRecipe: true }, description: 'Analisis Material: Mengungkap resep yang memiliki peluang keberhasilan tertinggi dengan material yang dimiliki.' },
        perfect_resonance: { active: { guaranteedSuccess: true, cost: 40 }, description: 'Resonansi Sempurna: Mengonsumsi Esensi Niat untuk menjamin kerajinan berhasil 100%.' },
    }
};

export const GLOBAL_ATTRIBUTES = ["Discipline", "Stamina", "Knowledge", "Social", "Focus"];

export const BIRTH_QUESTIONS = [
    {
        question: "Dalam kegelapan yang tak terbatas, apa yang paling kau rindukan?",
        choices: [
            { text: "Cahaya pengetahuan.", alignmentEffect: { intention: 10, knowledge_xp: 3 } },
            { text: "Kehangatan koneksi.", alignmentEffect: { intention: 10, social_xp: 3 } },
            { text: "Ketegasan tujuan.", alignmentEffect: { intention: 10, discipline_xp: 3 } }
        ]
    },
    {
        question: "Ketika dihadapkan pada ketidakpastian, apa reaksi pertamamu?",
        choices: [
            { text: "Menganalisis setiap kemungkinan.", alignmentEffect: { echo: 5, knowledge_xp: 2 } },
            { text: "Mencari dukungan dari orang lain.", alignmentEffect: { echo: 5, social_xp: 2 } },
            { text: "Menyiapkan diri untuk yang terburuk.", alignmentEffect: { echo: 5, stamina_xp: 2 } }
        ]
    },
    {
        question: "Bagaimana kau mendefinisikan kekuatan sejati?",
        choices: [
            { text: "Kemampuan untuk menginspirasi orang lain.", alignmentEffect: { intention: 15, social_xp: 4 } },
            { text: "Ketahanan dalam menghadapi kesulitan.", alignmentEffect: { intention: 15, stamina_xp: 4 } },
            { text: "Penguasaan diri yang tak tergoyahkan.", alignmentEffect: { intention: 15, discipline_xp: 4 } }
        ]
    },
    {
        question: "Jika kau harus kehilangan salah satu, mana yang akan kau pilih?",
        choices: [
            { text: "Kemampuan untuk beradaptasi (Stamina).", alignmentEffect: { echo: 10, stamina_xp: -5 } },
            { text: "Kemampuan untuk fokus (Focus).", alignmentEffect: { echo: 10, focus_xp: -5 } },
            { text: "Kemampuan untuk belajar (Knowledge).", alignmentEffect: { echo: 10, knowledge_xp: -5 } }
        ]
    }
];

export const INTERROGATION_DATA = {
    playerComposureMax: 100, // Maximum composure for the player during interrogation
    runes: [
        { id: 'rune_fear', name: 'Fear', icon: 'aperture', weaknesses: ['courage', 'logic'] },
        { id: 'rune_denial', name: 'Denial', icon: 'shield-off', weaknesses: ['evidence', 'truth'] },
        { id: 'rune_arrogance', name: 'Arrogance', icon: 'frown', weaknesses: ['humility', 'consequences'] },
        { id: 'rune_ignorance', name: 'Ignorance', icon: 'book-open', weaknesses: ['knowledge', 'revelation'] },
        { id: 'rune_guilt', name: 'Guilt', icon: 'archive', weaknesses: ['absolution', 'forgiveness'] },
        { id: 'rune_pride', name: 'Pride', icon: 'feather', weaknesses: ['humiliation', 'exposure'] }
    ],
    argumentCards: [
        { id: 'card_logic', text: 'Logika Dingin', icon: 'cpu', strengths: ['logic', 'knowledge'], isRisky: false },
        { id: 'card_empathy', text: 'Empati Mendalam', icon: 'heart', strengths: ['absolution', 'forgiveness'], isRisky: false },
        { id: 'card_revelation', text: 'Pernyataan Mengejutkan', icon: 'alert-triangle', strengths: ['truth', 'exposure'], isRisky: true },
        { id: 'card_evidence', text: 'Bukti Tak Terbantahkan', icon: 'file-text', strengths: ['evidence', 'consequences'], isRisky: false },
        { id: 'card_bluff', text: 'Gertakan Mental', icon: 'shuffle', strengths: ['fear', 'humiliation'], isRisky: true },
        { id: 'card_comfort', text: 'Kata-kata Penghiburan', icon: 'smile', strengths: ['humility', 'courage'], isRisky: false }
    ],
    // Contoh placeholder untuk logic generateContent - ini akan menjadi method dalam implementasi game, bukan data statis
    // generateContent: (npc) => {
    //     // Contoh placeholder untuk logic generateContent
    //     return {
    //         question: `Apa rahasia terdalam ${npc.name}?`,
    //         correctAnswer: "rahasia" // Contoh jawaban
    //     };
    // }
};

// SKILLS_DATA tidak ada sebagai konstanta terpisah di gameData.js yang diberikan sebelumnya.
// Data skill khusus arketipe terintegrasi langsung ke SKILL_TREE_DATA.
// Jika di masa depan ada kebutuhan untuk SKILLS_DATA global terpisah, bisa ditambahkan di sini.
export const SKILLS_DATA = {
    // "STRATEGY_CARDS" dari wandererGameLogic.js bisa masuk ke sini jika dianggap data inti skill
    STRATEGY_CARDS: [
        { id: 'direct_strike', name: 'Serangan Langsung', icon: 'zap', type: 'attack', baseDamage: 20, description: 'Menyebabkan kerusakan langsung pada Tekad lawan.' },
        { id: 'feint_maneuver', name: 'Tipuan Licik', icon: 'shuffle', type: 'attack_with_weakness', baseDamage: 10, targetWeakness: 'Arrogance', description: 'Menyebabkan sedikit kerusakan dan bonus jika lawan Arogan.' },
        { id: 'willpower_drain', name: 'Kuras Tekad', icon: 'droplet', type: 'drain', baseDamage: 15, selfRestore: 5, description: 'Menyebabkan kerusakan dan memulihkan sebagian Tekad Anda.' },
        { id: 'shield_bash', name: 'Hantaman Perisai', icon: 'shield', type: 'attack', baseDamage: 25, selfDamage: 5, description: 'Serangan kuat, tetapi membebani Tekad Anda sendiri.' },
        { id: 'persuasive_argument', text: 'Argumen Persuasif', icon: 'message-circle', type: 'attack_with_weakness', baseDamage: 5, targetWeakness: 'Doubt', description: 'Serangan kecil, sangat efektif jika lawan Penuh Keraguan.' },
        { id: 'defensive_stance', name: 'Sikap Bertahan', icon: 'shield-off', type: 'defense', defenseBoost: 0.2, duration: 1, description: 'Meningkatkan pertahanan Tekad Anda untuk satu putaran.' },
        { id: 'insightful_question', name: 'Pertanyaan Mendalam', icon: 'help-circle', type: 'expose_weakness', description: 'Mengungkap satu kelemahan lawan untuk putaran ini.' },
    ],
    // "EMOTION_SPECTRUM_COLORS" dari wandererGameLogic.js jika dianggap inti
    EMOTION_SPECTRUM_COLORS: {
        negative: '#EF4444', // Red (e.g., Fear, Anger)
        neutral: '#FBBF24',  // Yellow (e.g., Apathy, Calm)
        positive: '#22C55E', // Green (e.g., Joy, Serenity)
    },
    // "SOUL_TONES" dari wandererGameLogic.js jika dianggap inti
    SOUL_TONES: [
        { name: 'Nada Rendah', type: 'low', range: [0, 0.33], class: 'tone-low-btn' },
        { name: 'Nada Tengah', type: 'mid', range: [0.33, 0.66], class: 'tone-mid-btn' },
        { name: 'Nada Tinggi', type: 'high', range: [0.66, 1], class: 'tone-high-btn' },
    ],
    // "MOTIVATION_CHOICES" dari wandererGameLogic.js jika dianggap inti
    MOTIVATION_CHOICES: [
        { id: 'courage', name: 'Keberanian', icon: 'zap', effect: { intentionGain: 20, echoLoss: 5 }, requiredAttr: { name: 'Discipline', level: 5 }, risky: false },
        { id: 'hope', name: 'Harapan', icon: 'sun', effect: { intentionGain: 15, echoLoss: 0 }, requiredAttr: { name: 'Social', level: 5 }, risky: false },
        { id: 'perseverance', name: 'Ketekunan', icon: 'anchor', effect: { intentionGain: 25, echoLoss: 10 }, requiredAttr: { name: 'Focus', level: 5 }, risky: true },
    ],
};

// Data yang dianggap inti dan tidak spesifik ke kategori lain:
// STAGE_DEFINITIONS - ini bisa menjadi bagian dari ini jika dianggap meta untuk tahapan (tidak spesifik NPC saja)
// MISC_GAME_CONSTANTS (misal: MAX_LEVEL, STARTING_GOLD) - jika ada
// INITIAL_WANDERER_TEMPLATE_FRAGMENT - jika ada fragmen default yang sangat inti

// Untuk saat ini, data seperti NPC_LIFESTAGES, NPC_HEALTH_STATES, NPC_REPUTATION_LEVELS, NEXUS_STATES
// FACTION_TYPES, CHRONICLE_EVENTS, COSMIC_CYCLES, GLOBAL_WORLD_EVENTS, REGIONS_DATA,
// CREATURES_DATA, WORLD_LANDMARKS, NPC_ROLES, JOURNAL_ENTRY_TEMPLATES, GLOBAL_LOOT_TABLES, ITEM_EFFECTS_DATA, TRADABLE_ITEMS_DATA
// masih dianggap spesifik untuk manajemen dunia, NPC, atau item, dan akan tetap di gameData.js
// atau dipindahkan ke file data yang lebih spesifik seperti js/data/npcs.js, js/data/world.js, dll.
// Sesuai dengan instruksi "Semua data lain yang dianggap "inti" dan tidak spesifik untuk NPC, dunia, item, atau kategori yang lebih spesifik."