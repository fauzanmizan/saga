// js/features/wanderer/wandererGameLogic.js

// == MODIFIED BY: Tim 3.C ==
// == TANGGAL: 2025-06-24, 21:39 ==
// == PERIHAL: Implementasi Fase III - Inventaris Penuh & Manajemen Item ==
// - Memastikan _getPlayerTradableItems() dan _getPlayerCraftingMaterials() mengambil properti item lengkap.
// - Memperbarui rendering item di modal mini-game untuk menampilkan properti baru (type, rarity, value with quantity).
// - Memastikan logika konsumsi/perolehan item mini-game menangani kuantitas dan penghapusan item dengan benar.
// - Menghapus duplikasi TRADABLE_ITEMS_DATA lokal dan mengandalkan import dari gameData.js.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 11:15 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Reaktivitas Mini-game terhadap NPC Traits & Gossip/Rumor ==
// - Untuk setiap mini-game Aksi Jalan (Interrogate, Absorb Echo, Challenge, Inspire, Barter, Commission),
//   logika inti gameplay dimodifikasi untuk membaca `npcTarget.personalityTraits` dan `npcTarget.healthState`.
// - Tingkat kesulitan, bonus/penalti, hadiah XP, dan perubahan alignment disesuaikan berdasarkan traits dan healthState NPC.
// - Pesan umpan balik naratif diperbarui untuk mencerminkan pengaruh trait NPC.
// - Fitur "Gossip & Rumor" diimplementasikan untuk Arketipe Juru Kronik saat "Menyelidiki" NPC
//   dengan trait 'curious' atau 'pessimistic', memicu penemuan rumor dari RUMOR_DATA.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:15 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Interaksi & Narasi Mikro NPC (Fase Lanjutan) ==
// - Memastikan setiap mini-game Aksi Jalan (Interrogate, Empathize, Challenge, Inspire, Barter, Commission)
//   menerima dan menggunakan `npcTarget.personalityTraits` untuk memengaruhi logika dan hasil.
// - Menyesuaikan tingkat kesulitan, bonus/penalti, atau umpan balik naratif berdasarkan traits NPC.
// - Implementasi simbolis "Gossip & Rumor" untuk Chronicler saat berinteraksi dengan NPC tertentu.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 18:09 WITA ==
// == PERIHAL: Implementasi Penuh Mini-game Memesan (Kerajinan Kustom) ==
// - Mengimplementasikan logika gameplay penuh untuk mini-game "Memesan".
// - Menambahkan fungsi triggerCommissionMiniGame dan logika terkait.
// - Mencakup rendering pilihan resep, material yang dibutuhkan, dan inventaris pemain untuk material.
// - Mengintegrasikan atribut Focus dan Stamina pemain.
// - Menangani kondisi keberhasilan/kegagalan kerajinan dan pembaruan data pemain (XP, Essence of Will, Chronicle, inventaris, reputasi NPC).
// - Mengintegrasikan skill Sang Juru Karya.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 17:35 WITA ==
// == PERIHAL: Implementasi Penuh Mini-game Bertukar (Perdagangan Unik) ==
// - Mengimplementasikan logika gameplay penuh untuk mini-game "Bertukar".
// - Menambahkan fungsi triggerBarterMiniGame dan logika terkait.
// - Mencakup rendering penawaran NPC, inventaris pemain, dan ringkasan pertukaran.
// - Mengintegrasikan atribut Stamina dan Social pemain.
// - Menangani kondisi keberhasilan/kegagalan dan pembaruan data pemain (XP, Essence of Will, Chronicle, inventaris, reputasi NPC).
// - Mengintegrasikan skill Sang Pengelana.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 17:20 WITA ==
// == PERIHAL: Implementasi Penuh Mini-game Menginspirasi (Fokus Motivasi) ==
// - Mengimplementasikan logika gameplay penuh untuk mini-game "Fokus Motivasi".
// - Menambahkan fungsi triggerInspireMiniGame dan logika terkait.
// - Mencakup visualisasi Bar Kekuatan Niat (canvas), Pilihan Motivasi, dan pesan Umpan Balik Status NPC.
// - Mengintegrasikan atribut Discipline dan Social pemain.
// - Menangani kondisi keberhasilan/kegagalan dan pembaruan data pemain (XP, Essence of Will, Chronicle, status motivasi NPC).
// - Mengintegrasikan skill Sang Penempa Niat (Will-Shaper).
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 17:00 WITA ==
// == PERIHAL: Implementasi Penuh Mini-game Merasakan (Spektrum Emosi) ==
// - Mengimplementasikan logika gameplay penuh untuk mini-game "Spektrum Emosi".
// - Menambahkan fungsi triggerEmpathizeMiniGame dan logika terkait.
// - Mencakup visualisasi Spektrum Emosi (canvas), Penanda Jiwa NPC, Instrumen Nada Jiwa.
// - Mengintegrasikan atribut Social dan Focus pemain.
// - Menangani kondisi keberhasilan/kegagalan dan pembaruan data pemain (XP, Essence of Will, Chronicle, reputasi NPC).
// - Mengintegrasikan skill Sang Empati.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 16:00 WITA ==
// == PERIHAL: Implementasi Penuh Mini-game Menantang (Duel Niat) ==
// - Mengimplementasikan logika gameplay penuh untuk mini-game "Duel Niat".
// - Memindahkan fungsi triggerChallengeMiniGame dari wandererPageRenderer.js ke sini.
// - Mencakup visualisasi Bar Tekad Lawan (canvas), sistem Kartu Strategi, umpan balik duel.
// - Mengintegrasikan konsep "Perisai Resonansi" dan "Simpul Argumen" lawan.
// - Menangani efek skill Sang Penjaga.
// - Mengelola kondisi menang/kalah dan pembaruan data pemain (Essence of Will, Chronicle, XP).
// - Bergantung pada UIManager, AuthService, WorldManager, firebaseService, dan gameData.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-25, 13:11 ==
// == PERIHAL: Integrasi Inventaris & Crafting ke wandererGameLogic.js ==
// - Memperbarui `_getPlayerTradableItems` dan `_getPlayerCraftingMaterials` untuk mengakses item secara lengkap dari `TRADABLE_ITEMS_DATA`.
// - Memperbarui `BarterGame` untuk menampilkan properti item lengkap (rarity, type) dan menyesuaikan logika barter berdasarkan `NPC_PERSONALITY_TRAITS` dan `NPC_HEALTH_STATES`.
// - Memperbarui `CommissionGame` untuk mendukung resep `CRAFTABLE_RECIPES_DATA` yang kompleks dan menggunakan `ITEM_EFFECTS_DATA` serta menyesuaikan logika crafting berdasarkan `NPC_PERSONALITY_TRAITS` dan `NPC_HEALTH_STATES`.
// - Mengimplementasikan efek skill Nomad dan Artisan di mini-game masing-masing.
// - Memastikan penanganan kuantitas item dan penghapusan item dari inventaris saat digunakan/dibuang.
// ===========================================

import { UIManager } from '../../uiManager.js';
import { getCurrentUser, setCurrentUser } from '../../authService.js';
import { updateDocument } from '../../firebaseService.js';
import { WorldManager } from '../../worldManager.js';
import { SKILL_TREE_DATA, GLOBAL_ATTRIBUTES, INTERROGATION_DATA, NPC_PERSONALITY_TRAITS, NPC_HEALTH_STATES, TRADABLE_ITEMS_DATA, ITEM_EFFECTS_DATA } from '../../gameData.js'; // Import TRADABLE_ITEMS_DATA, ITEM_EFFECTS_DATA

let dbInstance;
let saveDBInstance;
let WandererPageRenderer; // Added for rendering page updates

// --- Data Game untuk Duel Niat ---
const MOCK_OPPONENT_DATA = { // This mock data should ideally be replaced by actual NPC data
    name: "Penempa Bayangan",
    willpower: { current: 150, max: 150 },
    weaknesses: ['Fear', 'Doubt', 'Arrogance', 'Impatience', 'Pride'],
    personalityTraits: [] // Ensure personalityTraits is present for mocks if not actual NPC
};

const STRATEGY_CARDS = [
    { id: 'direct_strike', name: 'Serangan Langsung', icon: 'zap', type: 'attack', baseDamage: 20, description: 'Menyebabkan kerusakan langsung pada Tekad lawan.' },
    { id: 'feint_maneuver', name: 'Tipuan Licik', icon: 'shuffle', type: 'attack_with_weakness', baseDamage: 10, targetWeakness: 'Arrogance', description: 'Menyebabkan sedikit kerusakan dan bonus jika lawan Arogan.' },
    { id: 'willpower_drain', name: 'Kuras Tekad', icon: 'droplet', type: 'drain', baseDamage: 15, selfRestore: 5, description: 'Menyebabkan kerusakan dan memulihkan sebagian Tekad Anda.' },
    { id: 'shield_bash', name: 'Hantaman Perisai', icon: 'shield', type: 'attack', baseDamage: 25, selfDamage: 5, description: 'Serangan kuat, tetapi membebani Tekad Anda sendiri.' },
    { id: 'persuasive_argument', text: 'Argumen Persuasif', icon: 'message-circle', type: 'attack_with_weakness', baseDamage: 5, targetWeakness: 'Doubt', description: 'Serangan kecil, sangat efektif jika lawan Penuh Keraguan.' },
    { id: 'defensive_stance', name: 'Sikap Bertahan', icon: 'shield-off', type: 'defense', defenseBoost: 0.2, duration: 1, description: 'Meningkatkan pertahanan Tekad Anda untuk satu putaran.' },
    { id: 'insightful_question', name: 'Pertanyaan Mendalam', icon: 'help-circle', type: 'expose_weakness', description: 'Mengungkap satu kelemahan lawan untuk putaran ini.' },
];

const SENTINEL_SKILL_EFFECTS = {
    'ironblood': { passive: { damageReduction: 0.15 }, description: 'Mengurangi semua kerusakan Tekad yang diterima sebesar 15%.' },
    'second_wind': { active: { willRestore: 40, threshold: 0.25, oncePerDuel: true }, description: 'Ketika Tekad sangat rendah, pulihkan 40 Tekad sekali per duel.' },
    'titans_burden': { passive: { bonusDamageIfHighWill: 0.2 }, description: 'Menyebabkan 20% kerusakan bonus terhadap lawan dengan Tekad di atas 70%.' },
    'steadfast_will': { passive: { willDrainResistance: 0.3 }, description: 'Mengurangi efektivitas serangan penguras Tekad lawan sebesar 30%.' },
    'counter_attack': { active: { chance: 0.3, damage: 15 }, description: 'Memiliki peluang 30% untuk membalas dengan 15 kerusakan Tekad setelah diserang.' },
    'protectors_oath': { active: { chance: 0.2, absorbDamage: 0.5 }, description: 'Memiliki peluang 20% untuk menyerap 50% kerusakan masuk.' },
};

// --- Data Game untuk Merasakan (Empathize) ---
const EMOTION_SPECTRUM_COLORS = {
    negative: '#EF4444', // Red (e.g., Fear, Anger)
    neutral: '#FBBF24',  // Yellow (e.g., Apathy, Calm)
    positive: '#22C55E', // Green (e.g., Joy, Serenity)
};

const SOUL_TONES = [
    { name: 'Nada Rendah', type: 'low', range: [0, 0.33], class: 'tone-low-btn' },
    { name: 'Nada Tengah', type: 'mid', range: [0.33, 0.66], class: 'tone-mid-btn' },
    { name: 'Nada Tinggi', type: 'high', range: [0.66, 1], class: 'tone-high-btn' },
];

const EMPATH_SKILL_EFFECTS = {
    'calming_aura': { passive: { markerSpeedReduction: 0.2 }, description: 'Mengurangi kecepatan fluktuasi penanda jiwa sebesar 20%.' },
    'communal_harmony': { passive: { bonusReputation: 0.10 }, description: 'Meningkatkan reputasi yang diperoleh dari NPC yang diselaraskan sebesar 10%.' },
    'language_of_heart': { active: { revealTrueEmotion: true, oncePerEmpathize: true }, description: 'Mengungkapkan emosi sejati lawan untuk putaran ini.' },
    'echo_healer': { passive: { selfEchoHeal: 5 }, description: 'Setelah berhasil menyelaraskan, pulihkan 5 Echo.' },
    'pure_note': { active: { perfectMatchBonus: 0.10 }, description: 'Meningkatkan bonus attunement jika nada cocok sempurna sebesar 10%.' },
    'inner_sanctuary': { passive: { composureRestoreChance: 0.15 }, description: 'Memiliki peluang 15% untuk memulihkan sedikit komposisi setelah Merasakan.' },
    'song_of_conscience': { active: { alignToIntention: 0.05 }, description: 'Setelah berhasil menyelaraskan, menggeser 5% dari Gema Anda ke Niat.' },
};

// --- Data Game untuk Menginspirasi (Inspire) ---
const MOTIVATION_CHOICES = [
    { id: 'courage', name: 'Keberanian', icon: 'zap', effect: { intentionGain: 20, echoLoss: 5 }, requiredAttr: { name: 'Discipline', level: 5 }, risky: false },
    { id: 'hope', name: 'Harapan', icon: 'sun', effect: { intentionGain: 15, echoLoss: 0 }, requiredAttr: { name: 'Social', level: 5 }, risky: false },
    { id: 'perseverance', name: 'Ketekunan', icon: 'anchor', effect: { intentionGain: 25, echoLoss: 10 }, requiredAttr: { name: 'Focus', level: 5 }, risky: true },
];

const WILL_SHAPER_SKILL_EFFECTS = {
    'clear_vision': { passive: { insightBonus: 0.15 }, description: 'Visi yang Jelas: Meningkatkan peluang keberhasilan inspirasi sebesar 15%.' },
    'no_retreat': { passive: { penaltyReduction: 0.25 }, description: 'Tidak Ada Kata Mundur: Mengurangi penalti Komposur atau Esensi Niat saat gagal sebesar 25%.' },
    'one_for_all': { passive: { essenceOfWillBonus: 0.10 }, description: 'Satu untuk Semua: Meningkatkan Esensi Niat yang diperoleh dari inspirasi yang berhasil sebesar 10%.' },
    'group_tactics': { passive: { groupBonus: 0.10 }, description: 'Taktik Kelompok: Jika ada NPC lain yang dekat (mock), tingkatkan efektivitas inspirasi sebesar 10%.' },
    'born_leader': { passive: { playerIntentionGain: 10 }, description: 'Pemimpin yang Dilahirkan: Setelah berhasil menginspirasi, pemain mendapatkan 10 Niat tambahan.' },
    'forgers_decree': { active: { cost: 30, guaranteedSuccess: true, oncePerInspire: true }, description: 'Dekrit Sang Penempa: Mengonsumsi Esensi Niat untuk menjamin keberhasilan inspirasi atau memberikan dorongan besar.' }
};

// --- Data Game untuk Bertukar (Barter) ---
const NOMAD_SKILL_EFFECTS = {
    'bottomless_pouch': { passive: { capacityBonus: 0.20 }, description: 'Kantung Tanpa Dasar: Meningkatkan kapasitas inventaris efektif sebesar 20% (mock: mengurangi penalti barter).' },
    'realm_explorer': { passive: { rareItemChance: 0.15 }, description: 'Penjelajah Alam: Meningkatkan peluang NPC menawarkan item langka sebesar 15%.' },
    'terrain_adaptation': { passive: { costReduction: 0.10 }, description: 'Adaptasi Medan: Mengurangi biaya item tertentu sebesar 10%.' },
    'traders_tongue': { passive: { valueBonus: 0.25 }, description: 'Lidah Pedagang: Meningkatkan nilai barter barang yang Anda tawarkan sebesar 25%.' },
    'wind_whispers': { active: { revealBestTrade: true, oncePerBarter: true }, description: 'Kabar Angin: Mengungkap item terbaik untuk ditukar oleh NPC.' },
    'network_weaving': { active: { specialTrade: true, cost: 50 }, description: 'Membangun Jaringan Dagang: Memungkinkan perdagangan untuk layanan/informasi unik (sangat mahal).' },
};

// --- Data Game untuk Memesan (Commission) ---
const CRAFTABLE_RECIPES_DATA = [
    {
        id: 'healing_salve',
        name: 'Salep Penyembuh',
        icon: 'cross',
        description: 'Salep umum yang dibuat dari ramuan herbal, untuk menyembuhkan luka ringan.',
        materials: [
            { id: 'jamur_langka', quantity: 2 },
            { id: 'serat_sutra', quantity: 1 }
        ],
        output: { id: 'healing_salve', name: 'Salep Penyembuh', icon: 'cross', type: 'consumable', value: 20, activeEffects: [{ id: 'heal_moderate', value: 50 }] }, // Ensure activeEffects are passed
        baseSuccessChance: 0.7,
        cost: 5
    },
    {
        id: 'rusty_sword_repaired',
        name: 'Pedang Berkarat (Diperbaiki)',
        icon: 'sword',
        description: 'Pedang tua yang sudah berkarat, kini sedikit lebih baik.',
        materials: [
            { id: 'rusty_sword', quantity: 1 },
            { id: 'serat_sutra', quantity: 3 }
        ],
        output: { id: 'rusty_sword', name: 'Pedang Berkarat', icon: 'sword', type: 'equipment', value: 15, durability: 100, activeEffects: [{ id: 'damage_bonus', value: 5, target: 'physical' }] },
        baseSuccessChance: 0.6,
        cost: 8
    },
    {
        id: 'leather_armor_crafted',
        name: 'Armor Kulit',
        icon: 'shirt',
        description: 'Pelindung ringan yang dibuat dari kulit binatang.',
        materials: [
            { id: 'serat_sutra', quantity: 10 },
            { id: 'jamur_langka', quantity: 3 }
        ],
        output: { id: 'leather_armor', name: 'Armor Kulit', icon: 'shirt', type: 'equipment', value: 30, durability: 100, activeEffects: [{ id: 'defense_bonus', value: 8, target: 'physical' }] },
        baseSuccessChance: 0.5,
        cost: 10
    },
    {
        id: 'purification_salve_crafted',
        name: 'Salep Pemurnian',
        icon: 'sparkles',
        description: 'Salep ampuh untuk menyembuhkan penyakit dan korupsi Gema.',
        materials: [
            { id: 'jamur_langka', quantity: 5 },
            { id: 'ancient_rune', quantity: 1 }
        ],
        output: { id: 'purification_salve', name: 'Salep Pemurnian', icon: 'sparkles', type: 'consumable', value: 50, activeEffects: [{ id: 'purify_corruption', value: 1 }] },
        baseSuccessChance: 0.4,
        cost: 20
    },
    {
        id: 'obsidian_pickaxe_crafted',
        name: 'Beliung Obsidian',
        icon: 'pickaxe',
        description: 'Beliung kokoh yang terbuat dari obsidian, efektif untuk menambang mineral keras.',
        materials: [
            { id: 'obsidian', quantity: 5 }, // Assuming obsidian as a material
            { id: 'iron_ore', quantity: 2 } // Assuming iron_ore as a material
        ],
        output: { id: 'obsidian_pickaxe', name: 'Beliung Obsidian', type: 'tool', value: 75, icon: 'pickaxe', rarity: 'uncommon', durability: 150, activeEffects: [{ id: 'mining_speed_bonus', value: 0.2 }] },
        baseSuccessChance: 0.55,
        cost: 15
    },
    {
        id: 'mana_crystal_infused',
        name: 'Kristal Mana Infused',
        icon: 'gem',
        description: 'Kristal mana yang diperkuat dengan energi Intensi.',
        materials: [
            { id: 'mana_crystal', quantity: 3 },
            { id: 'pure_water', quantity: 1 } // Assuming pure_water as a material
        ],
        output: { id: 'mana_crystal', name: 'Kristal Mana', type: 'resource', value: 50, icon: 'gem', rarity: 'rare', durability: null, activeEffects: [{ id: 'essence_restore', value: 25 }] },
        baseSuccessChance: 0.6,
        cost: 10
    }
];

const ARTISAN_SKILL_EFFECTS = {
    'material_efficiency': { passive: { materialCostReduction: 0.20 }, description: 'Efisiensi Material: Mengurangi jumlah material yang dibutuhkan sebesar 20%.' },
    'swift_forging': { passive: { speedBonus: 0.15 }, description: 'Tempaan Cepat: Meningkatkan peluang keberhasilan kerajinan sebesar 15%.' },
    'decomposition': { active: { restoreMaterials: 0.5, oncePerCommission: true }, description: 'Dekomposisi: Jika kerajinan gagal, pulihkan 50% material.' },
    'material_analysis': { passive: { revealOptimalRecipe: true }, description: 'Analisis Material: Mengungkap resep yang memiliki peluang keberhasilan tertinggi dengan material yang dimiliki.' },
    'perfect_resonance': { active: { guaranteedSuccess: true, cost: 40 }, description: 'Resonansi Sempurna: Mengonsumsi Esensi Niat untuk menjamin kerajinan berhasil 100%.' },
};

// Static rumor data for Chronicler's "Gossip & Rumor"
const RUMOR_DATA = {
    'curious': [
        { title: 'Rumor Nexus Baru', text: 'Terdengar bisikan tentang sebuah Nexus tersembunyi yang belum ditemukan di kedalaman Alam Gema. Apa yang menantinya di sana?' },
        { title: 'Kisah Penjelajah Hilang', text: 'Seorang penjelajah ulung, dikabarkan telah menghilang di Hutan Lumina. Apakah Echo atau Intention yang menyelimutinya?' }
    ],
    'pessimistic': [
        { title: 'Ramalan Kemerosotan', text: 'Ada perasaan muram di udara. Beberapa percaya Tenunan Kosmik mulai unravel, menuju kemerosotan tak terhindarkan.' },
        { title: 'Gema Pengkhianatan', text: 'Desas-desus kelam tentang pengkhianatan di antara para Penempa terdengar. Apakah ini akan merobek realitas?' }
    ]
};


export const InterrogateGame = {
    // Game state variables
    _npcTarget: null,
    _gameActive: false,
    _playerComposure: 0,
    _playerMaxComposure: 0,
    _barricadeRunes: [], // Array of rune IDs
    _brokenRunes: [], // Array of broken rune IDs
    _currentArgumentCard: null,
    _logicSkillPenaltyReduction: 0, // From passive_logic skill
    _insightSkillActive: false, // From passive_insight skill
    _revelationUsed: false, // For active_revelation skill
    _gameInterval: null,

    // UI elements
    _modalEl: null,
    _titleEl: null,
    _descEl: null,
    _composureCanvas: null,
    _composureCtx: null,
    _barricadeDisplay: null,
    _argumentCardsContainer: null,
    _interrogateFeedbackMessageEl: null,
    _startBtn: null,
    _closeBtn: null,
    _revelationBtn: null,

    setDependencies(db, saveDB, uiM, worldM, wandererPR) {
        dbInstance = db;
        saveDBInstance = saveDB;
        UIManager = uiM; // Initialize UIManager
        WorldManager = worldM; // Initialize WorldManager
        WandererPageRenderer = wandererPR; // Initialize WandererPageRenderer
        if (typeof window !== 'undefined') {
            window.InterrogateGame = this;
        }
    },

    _initUIElements() {
        this._modalEl = document.getElementById('interrogate-modal');
        this._titleEl = document.getElementById('interrogate-modal-title');
        this._descEl = document.getElementById('interrogate-modal-description');
        this._composureCanvas = document.getElementById('interrogate-composure-canvas');
        this._composureCtx = this._composureCanvas ? this._composureCanvas.getContext('2d') : null;
        this._barricadeDisplay = document.getElementById('mental-barricade-display');
        this._argumentCardsContainer = document.getElementById('argument-cards-container');
        this._interrogateFeedbackMessageEl = document.getElementById('interrogate-feedback-message');
        this._startBtn = document.getElementById('interrogate-start-btn');
        this._closeBtn = document.getElementById('interrogate-close-btn');
        this._revelationBtn = document.getElementById('inquisitor-revelation-btn');


        if (this._composureCanvas) {
            this._composureCanvas.width = this._composureCanvas.offsetWidth;
            this._composureCanvas.height = this._composureCanvas.offsetHeight;
            window.removeEventListener('resize', this._onCanvasResize);
            this._onCanvasResize = () => {
                this._composureCanvas.width = this._composureCanvas.offsetWidth;
                this._composureCanvas.height = this._composureCanvas.offsetHeight;
                this._drawComposureBar();
            };
            window.addEventListener('resize', this._onCanvasResize);
        }
    },

    async triggerInterrogateMiniGame(npcTarget) {
        const user = getCurrentUser();
        // Assuming user.archetype is set at creation/login
        if (user.role !== 'wanderer' || user.archetype !== 'inquisitor') {
            UIManager.showNotification("Hanya Sang Inkuisitor yang dapat Menginterogasi.", 'info', 'info');
            return;
        }

        // Check Essence of Will cost
        const interrogateSkill = SKILL_TREE_DATA.Inquisitor.active_interrogate;
        if (user.essenceOfWill < interrogateSkill.cost) {
            UIManager.showNotification(`Tidak cukup Esensi Niat. Membutuhkan ${interrogateSkill.cost}.`, 'alert-triangle', 'error');
            return;
        }

        this._initUIElements();
        if (!this._modalEl) {
            console.error("Interrogate modal elements not found.");
            return;
        }

        this._npcTarget = npcTarget; // Pass the actual NPC object
        this._gameActive = false;
        this._playerComposure = INTERROGATION_DATA.playerComposureMax;
        this._playerMaxComposure = INTERROGATION_DATA.playerComposureMax;
        this._barricadeRunes = this._generateBarricadeRunes(this._npcTarget); // Generate based on NPC's traits
        this._brokenRunes = [];
        this._revelationUsed = false;

        // Apply passive skills from Inquisitor
        const userSkills = user.unlockedImprints;
        const inquisitorSkills = SKILL_TREE_DATA['Inquisitor'] || {};
        this._logicSkillPenaltyReduction = userSkills.includes(inquisitorSkills.passive_logic?.id) ? inquisitorSkills.passive_logic.penaltyReduction : 0;
        this._insightSkillActive = userSkills.includes(inquisitorSkills.passive_insight?.id);

        this._titleEl.textContent = `Menginterogasi ${this._npcTarget.name}`;
        this._descEl.textContent = `Pecahkan perisai mental ${this._npcTarget.name} dengan argumen tajam.`;
        this._interrogateFeedbackMessageEl.textContent = "Bersiaplah untuk interogasi...";

        this._drawComposureBar();
        this._renderMentalBarricade();
        this._renderArgumentCards(false); // Initially disabled

        UIManager.showModal('interrogate-modal', null, null, false);
        this._startBtn.classList.remove('hidden');
        this._closeBtn.classList.remove('hidden');
        this._revelationBtn.classList.add('hidden'); // Hide revelation button until game starts and skill is usable

        this._startBtn.onclick = () => this._startInterrogation();
        this._closeBtn.onclick = () => this._endInterrogation('aborted');

        // Initial check for active_revelation skill
        if (user.unlockedImprints.includes(inquisitorSkills.active_revelation?.id)) {
            this._revelationBtn.classList.remove('hidden');
            this._revelationBtn.disabled = true; // Disable until game starts
            this._revelationBtn.onclick = () => this._useRevelationSkill();
        }
    },

    _startInterrogation() {
        const user = getCurrentUser();
        const interrogateSkill = SKILL_TREE_DATA.Inquisitor.active_interrogate;

        user.essenceOfWill -= interrogateSkill.cost;
        setCurrentUser(user);
        saveDBInstance(false); // Save initial Essence of Will cost

        this._gameActive = true;
        this._startBtn.classList.add('hidden');
        this._closeBtn.classList.add('hidden');
        this._interrogateFeedbackMessageEl.textContent = "Interogasi Dimulai! Pilih kartu argumen.";
        this._renderArgumentCards(true); // Enable cards

        // Enable Revelation skill button if available and enough essence
        const inquisitorSkills = SKILL_TREE_DATA['Inquisitor'] || {};
        if (user.unlockedImprints.includes(inquisitorSkills.active_revelation?.id)) {
             this._revelationBtn.disabled = user.essenceOfWill < inquisitorSkills.active_revelation.cost;
        }

        // Start passive composure decay (optional, but adds pressure)
        this._gameInterval = setInterval(() => {
            this._playerComposure -= 1; // Lose 1 composure per second
            this._drawComposureBar();
            if (this._playerComposure <= 0) {
                clearInterval(this._gameInterval);
                this._endInterrogation('lose');
            }
        }, 1000);
    },

    _generateBarricadeRunes(npc) {
        // Generate 3-5 random runes for the barricade
        const numRunes = Math.floor(Math.random() * 3) + 3; // 3 to 5 runes
        const allRunes = [...INTERROGATION_DATA.runes];
        const selectedRunes = [];
        for (let i = 0; i < numRunes; i++) {
            const randomIndex = Math.floor(Math.random() * allRunes.length);
            selectedRunes.push(allRunes[randomIndex]);
            allRunes.splice(randomIndex, 1); // Ensure unique runes
        }

        // Adjust runes based on NPC personality traits
        if (npc.personalityTraits && npc.personalityTraits.includes('stoic')) {
            const denialRune = INTERROGATION_DATA.runes.find(r => r.id === 'rune_denial');
            const prideRune = INTERROGATION_DATA.runes.find(r => r.id === 'rune_pride');
            if (denialRune && !selectedRunes.some(r => r.id === denialRune.id)) {
                selectedRunes[Math.floor(Math.random() * selectedRunes.length)] = denialRune;
            } else if (prideRune && !selectedRunes.some(r => r.id === prideRune.id)) {
                selectedRunes[Math.floor(Math.random() * selectedRunes.length)] = prideRune;
            }
        }
        // Example: Cautious NPCs might have more 'Fear' runes but fewer 'Arrogance'
        if (npc.personalityTraits && npc.personalityTraits.includes('cautious')) {
            const fearRune = INTERROGATION_DATA.runes.find(r => r.id === 'rune_fear');
            if (fearRune && !selectedRunes.some(r => r.id === fearRune.id)) {
                selectedRunes[Math.floor(Math.random() * selectedRunes.length)] = fearRune;
            }
        }

        return selectedRunes;
    },

    _drawComposureBar() {
        if (!this._composureCtx || !this._composureCanvas) return;

        const ctx = this._composureCtx;
        const canvas = this._composureCanvas;
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);

        const fillWidth = (this._playerComposure / this._playerMaxComposure) * width;
        let barColor = '#34d399'; // Green
        if (this._playerComposure < this._playerMaxComposure * 0.25) {
            barColor = '#f87171'; // Red
        } else if (this._playerComposure < this._playerMaxComposure * 0.5) {
            barColor = '#facc15'; // Yellow
        }

        ctx.fillStyle = barColor;
        ctx.fillRect(0, 0, fillWidth, height);

        ctx.fillStyle = '#f3f4f6';
        ctx.font = `bold ${height * 0.6}px 'Cormorant Garamond'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Komposur: ${this._playerComposure.toFixed(0)}`, width / 2, height / 2);
    },

    _renderMentalBarricade() {
        if (!this._barricadeDisplay) return;

        const html = this._barricadeRunes.map(rune => `
            <div class="interrogate-rune" data-rune-id="${rune.id}">
                <i data-feather="${rune.icon}" class="w-8 h-8 text-slate-300 mb-1"></i>
                <span class="text-xs text-slate-400">${rune.name}</span>
            </div>
        `).join('');
        UIManager.render(this._barricadeDisplay, html);
        feather.replace();
    },

    _renderArgumentCards(active = false) {
        if (!this._argumentCardsContainer) return;

        const shuffledCards = [...INTERROGATION_DATA.argumentCards].sort(() => 0.5 - Math.random());
        const cardsToRender = shuffledCards.slice(0, 3); // Show 3 random cards

        const html = cardsToRender.map(card => `
            <button class="glass-button interro-card-btn ${card.isRisky ? 'bg-red-700 hover:bg-red-600' : ''} flex flex-col items-center p-3 rounded-lg text-center ${active ? '' : 'opacity-50 cursor-not-allowed'}"
                    data-card-id="${card.id}" ${active ? '' : 'disabled'}>
                <i data-feather="${card.icon}" class="w-6 h-6 mb-1"></i>
                <span class="text-sm font-semibold">${card.text}</span>
            </button>
        `).join('');
        UIManager.render(this._argumentCardsContainer, html);
        feather.replace();

        if (active) {
            this._argumentCardsContainer.querySelectorAll('button').forEach(button => {
                button.onclick = (e) => {
                    const cardId = e.currentTarget.dataset.cardId;
                    const chosenCard = INTERROGATION_DATA.argumentCards.find(c => c.id === cardId);
                    if (chosenCard) {
                        this._handleArgumentCard(chosenCard);
                    }
                };
            });
        }
    },

    async _handleArgumentCard(card) {
        if (!this._gameActive) return;

        let effectiveness = 0; // How much rune is affected
        let composureChange = -5; // Base composure loss for any action
        let feedback = `Anda menggunakan "${card.text}".`;

        const user = getCurrentUser();
        const inquisitorSkills = SKILL_TREE_DATA.Inquisitor || {}; // Ensure Inquisitor skills are accessed correctly
        const npcTraits = this._npcTarget.personalityTraits || [];
        const npcHealthState = this._npcTarget.healthState || 'normal';

        // Determine effectiveness based on card strengths vs rune weaknesses
        let affectedRune = null;
        for (const rune of this._barricadeRunes.filter(r => !this._brokenRunes.includes(r.id))) {
            const hasWeakness = card.strengths.some(strength => rune.weaknesses.includes(strength));
            if (hasWeakness) {
                effectiveness += 0.5; // Base effectiveness for hitting a weakness
                affectedRune = rune;
                feedback += ` Menggoyahkan rune ${rune.name}!`;
                break; // Only one rune affected per card for simplicity
            }
        }

        // Apply 'Insightful Gaze' skill - potentially reveal weakness
        if (this._insightSkillActive && inquisitorSkills.passive_insight && Math.random() < inquisitorSkills.passive_insight.chance) {
            const unbrokenRunes = this._barricadeRunes.filter(r => !this._brokenRunes.includes(r.id));
            if (unbrokenRunes.length > 0) {
                const revealedWeaknessRune = unbrokenRunes[Math.floor(Math.random() * unbrokenRunes.length)];
                feedback += ` Tatapan Tajam mengungkap kelemahan ${revealedWeaknessRune.name}!`;
            }
        }

        // NPC Trait influence
        if (npcTraits.includes('stoic')) {
            effectiveness *= 0.5; // Halve effectiveness
            composureChange -= 10; // More composure loss
            feedback += ` Tekad Stoik ${this._npcTarget.name} membuat ini sulit.`;
        }
        if (npcTraits.includes('cautious')) {
            effectiveness *= 0.7;
            composureChange -= 5;
            feedback += ` Sifat hati-hati ${this._npcTarget.name} menambah perlawanan.`;
        }
        if (npcTraits.includes('curious') && effectiveness > 0 && Math.random() < 0.20) { // 20% chance for curious NPC to reveal gossip
            await InterrogateGame._triggerGossipRumor(user, this._npcTarget);
        }

        // NPC Health State influence
        if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) {
            effectiveness *= 1.2; // Frail NPCs are easier to interrogate
            composureChange += 5; // Less composure loss
            feedback += ` Kondisi lemah ${this._npcTarget.name} membuatnya lebih rentan.`;
        } else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) {
            effectiveness *= 1.5; // Corrupted NPCs are very easy to break
            composureChange += 10;
            feedback += ` Gema yang merasuki ${this._npcTarget.name} membuatnya terbuka.`;
        }


        if (effectiveness > 0 && affectedRune) {
            this._brokenRunes.push(affectedRune.id);
            const runeElement = this._barricadeDisplay.querySelector(`[data-rune-id="${affectedRune.id}"]`);
            if (runeElement) {
                runeElement.classList.add('broken');
            }
            feedback += ` Rune ${affectedRune.name} telah pecah!`;
            composureChange += 10; // Restore some composure for success
        } else {
            feedback += ` Argumen Anda tidak efektif.`;
            // Apply logic skill penalty reduction if active
            if (user.unlockedImprints.includes(inquisitorSkills.passive_logic?.id)) {
                composureChange += (composureChange * this._logicSkillPenaltyReduction); // Reduce negative change (add back)
            }
        }

        this._playerComposure += composureChange;
        this._playerComposure = Math.max(0, Math.min(this._playerMaxComposure, this._playerComposure));

        this._interrogateFeedbackMessageEl.textContent = feedback;
        this._drawComposureBar();

        await this._checkInterrogationEnd();
        if (this._gameActive) {
            this._renderArgumentCards(true);
        }
    },

    async _useRevelationSkill() {
        const user = getCurrentUser();
        const revelationSkill = SKILL_TREE_DATA.Inquisitor.active_revelation;

        if (this._revelationUsed) {
            UIManager.showNotification("Penghakiman Terakhir hanya bisa digunakan sekali per interogasi.", 'info', 'info');
            return;
        }
        if (user.essenceOfWill < revelationSkill.cost) {
            UIManager.showNotification(`Tidak cukup Esensi Niat. Membutuhkan ${revelationSkill.cost}.`, 'alert-triangle', 'error');
            return;
        }
        if (this._barricadeRunes.length === this._brokenRunes.length) {
            UIManager.showNotification("Semua rune sudah pecah!", 'info', 'info');
            return;
        }

        user.essenceOfWill -= revelationSkill.cost;
        setCurrentUser(user);
        await saveDBInstance(false);

        this._revelationUsed = true;
        this._revelationBtn.disabled = true;

        const unbrokenRunes = this._barricadeRunes.filter(r => !this._brokenRunes.includes(r.id));
        let runesBrokenBySkill = 0;
        let feedback = `Anda menggunakan Penghakiman Terakhir! `;

        for (let i = 0; i < revelationSkill.runeBreakCount && unbrokenRunes.length > 0; i++) {
            const runeToBreakIndex = Math.floor(Math.random() * unbrokenRunes.length);
            const brokenRune = unbrokenRunes.splice(runeToBreakIndex, 1)[0];

            this._brokenRunes.push(brokenRune.id);
            const runeElement = this._barricadeDisplay.querySelector(`[data-rune-id="${brokenRune.id}"]`);
            if (runeElement) {
                runeElement.classList.add('broken');
            }
            runesBrokenBySkill++;
            feedback += ` Rune ${brokenRune.name} hancur!`;
        }

        this._interrogateFeedbackMessageEl.textContent = feedback;
        this._playerComposure = Math.min(this._playerMaxComposure, this._playerComposure + (runesBrokenBySkill * 20));
        this._drawComposureBar();
        await this._checkInterrogationEnd();
    },


    async _checkInterrogationEnd() {
        if (this._brokenRunes.length === this._barricadeRunes.length) {
            this._endInterrogation('win');
            return true;
        } else if (this._playerComposure <= 0) {
            this._endInterrogation('lose');
            return true;
        }
        return false;
    },

    async _endInterrogation(result) {
        if (!this._gameActive && result !== 'aborted') return;
        this._gameActive = false;
        clearInterval(this._gameInterval);

        let chronicleEntry = {
            id: Date.now(),
            type: 'interrogation_session',
            title: `Interogasi ${this._npcTarget.name}`,
            timestamp: new Date().toISOString(),
            icon: 'search' // Using 'icon' property for chronicle entries
        };

        const user = getCurrentUser();
        let xpReward = 0;
        let essenceGained = 0;
        let chronicleReflection = '';
        let reputationChange = 0;

        if (result === 'win') {
            xpReward = 200;
            essenceGained = 5;
            reputationChange = 5;
            chronicleReflection = `Anda berhasil menembus perisai mental ${this._npcTarget.name}, mengungkap kebenaran.`;
            this._interrogateFeedbackMessageEl.textContent = `Berhasil! Perisai mental ${this._npcTarget.name} telah pecah.`;
            UIManager.showNotification(`Interogasi Selesai: KEBERHASILAN! (+${xpReward} XP, +${essenceGained} Esensi Niat)`, 'award', 'success');
        } else if (result === 'lose') {
            xpReward = 20;
            essenceGained = -2;
            reputationChange = -2;
            chronicleReflection = `Anda gagal menembus perisai mental ${this._npcTarget.name}. Komposur Anda terkuras.`;
            this._interrogateFeedbackMessageEl.textContent = `Gagal! Komposur Anda terkuras.`;
            UIManager.showNotification(`Interogasi Selesai: KEGAGALAN.`, 'x-circle', 'error');
        } else {
            xpReward = 0;
            essenceGained = 0;
            reputationChange = 0;
            chronicleReflection = `Interogasi ${this._npcTarget.name} dihentikan.`;
            this._interrogateFeedbackMessageEl.textContent = `Interogasi dihentikan.`;
            UIManager.showNotification(`Interogasi dihentikan.`, 'info', 'info');
        }

        user.xp += xpReward;
        user.essenceOfWill += essenceGained;
        user.essenceOfWill = Math.max(0, user.essenceOfWill);

        if (this._npcTarget.reputation !== undefined) {
            // Use WorldManager to record reputation change, it handles updating NPC and saving DB
            WorldManager.recordReputationChange(this._npcTarget.id, reputationChange, "interrogation");
        }

        chronicleEntry.description = chronicleReflection; // Use 'description' for chronicle entry
        user.chronicle.push(chronicleEntry);

        // Check for Chronicler's 'Gossip & Rumor' if applicable (moved from previous scope to dedicated function)
        if (user.archetype === 'chronicler' && result === 'win' && Math.random() < 0.15) { // 15% chance to trigger gossip
            await InterrogateGame._triggerGossipRumor(user, this._npcTarget);
        }

        setCurrentUser(user); // Update current user state
        await saveDBInstance(true); // Save current user state

        setTimeout(() => {
            UIManager.hideModal('interrogate-modal');
            // Re-render relevant UI components after game ends
            if (WandererPageRenderer) {
                 WandererPageRenderer.renderAllWandererComponents('character');
                 WandererPageRenderer.renderChronicle();
            }
        }, 2000);
    }
};

export const ChallengeGame = {
    // Game state variables for Challenge
    _opponent: null,
    _playerWill: { current: 0, max: 0 },
    _gameActive: false,
    _duelRound: 0,
    _playerDefenseBoost: 0,
    _playerHasSecondWind: true,
    _exposedWeakness: null,

    // UI elements for Challenge
    _modalEl: null,
    _titleEl: null,
    _descEl: null,
    _opponentWillCanvas: null,
    _opponentWillCtx: null,
    _strategyCardsContainer: null,
    _duelFeedbackMessageEl: null,
    _startBtn: null,
    _closeBtn: null,

    setDependencies(db, saveDB, uiM, worldM, wandererPR) {
        dbInstance = db;
        saveDBInstance = saveDB;
        UIManager = uiM;
        WorldManager = worldM;
        WandererPageRenderer = wandererPR;
        if (typeof window !== 'undefined') {
            window.ChallengeGame = this;
        }
    },

    _initUIElements() {
        this._modalEl = document.getElementById('challenge-modal');
        this._titleEl = document.getElementById('challenge-modal-title');
        this._descEl = document.getElementById('challenge-modal-description');
        this._opponentWillCanvas = document.getElementById('opponent-will-canvas');
        this._opponentWillCtx = this._opponentWillCanvas ? this._opponentWillCanvas.getContext('2d') : null;
        this._strategyCardsContainer = document.getElementById('strategy-cards-container');
        this._duelFeedbackMessageEl = document.getElementById('duel-feedback-message');
        this._startBtn = document.getElementById('challenge-start-btn');
        this._closeBtn = document.getElementById('challenge-close-btn');

        if (this._opponentWillCanvas) {
            this._opponentWillCanvas.width = this._opponentWillCanvas.offsetWidth;
            this._opponentWillCanvas.height = this._opponentWillCanvas.offsetHeight;
            window.removeEventListener('resize', this._onCanvasResize);
            this._onCanvasResize = () => {
                this._opponentWillCanvas.width = this._opponentWillCanvas.offsetWidth;
                this._opponentWillCanvas.height = this._opponentWillCanvas.offsetHeight;
                this._drawOpponentWillBar();
            };
            window.addEventListener('resize', this._onCanvasResize);
        }
    },

    async triggerChallengeMiniGame(npcTarget) {
        const user = getCurrentUser();
        if (user.role !== 'wanderer' || user.archetype !== 'sentinel') {
            UIManager.showNotification("Hanya Sang Penjaga yang dapat Menantang.", 'info', 'info');
            return;
        }

        this._initUIElements();
        if (!this._modalEl) {
            console.error("Challenge modal elements not found.");
            return;
        }

        this._opponent = { ...npcTarget, willpower: { ...npcTarget.willpower } };
        if (!this._opponent.willpower.current) {
            this._opponent.willpower = { current: 150, max: 150 };
        }
        if (!this._opponent.personalityTraits) {
            this._opponent.personalityTraits = [];
        }


        this._playerWill = { current: user.essenceOfWill, max: user.essenceOfWill };
        this._gameActive = false;
        this._duelRound = 0;
        this._playerDefenseBoost = 0;
        this._playerHasSecondWind = true;
        this._exposedWeakness = null;

        this._titleEl.textContent = `Menantang ${this._opponent.name}`;
        this._descEl.textContent = `Uji tekadmu melawan kekuatan batin ${this._opponent.name}. Tekad Anda: ${this._playerWill.current}.`;
        this._duelFeedbackMessageEl.textContent = "Bersiaplah untuk Duel Niat!";

        this._drawOpponentWillBar();
        this._renderStrategyCards();

        UIManager.showModal('challenge-modal', null, null, false);
        this._startBtn.classList.remove('hidden');
        this._closeBtn.classList.remove('hidden');

        this._startBtn.onclick = () => this._startDuel();
        this._closeBtn.onclick = () => this._endDuel('aborted');
    },

    _startDuel() {
        this._gameActive = true;
        this._duelRound = 1;
        this._startBtn.classList.add('hidden');
        this._closeBtn.classList.add('hidden');
        this._duelFeedbackMessageEl.textContent = "Duel Dimulai! Pilih strategimu.";
        this._renderStrategyCards(true);
    },

    _drawOpponentWillBar() {
        if (!this._opponentWillCtx || !this._opponentWillCanvas) return;

        const ctx = this._opponentWillCtx;
        const canvas = this._opponentWillCanvas;
        const { current, max } = this._opponent.willpower;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const fillWidth = (current / max) * canvas.width;
        let barColor = '#818cf8';
        if (current < max * 0.25) {
            barColor = '#f87171';
        } else if (current < max * 0.5) {
            barColor = '#facc15';
        }

        ctx.fillStyle = barColor;
        ctx.fillRect(0, 0, fillWidth, canvas.height);

        ctx.fillStyle = '#f3f4f6';
        ctx.font = `bold ${canvas.height * 0.6}px 'Cormorant Garamond'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${current}/${max}`, canvas.width / 2, canvas.height / 2);
    },

    _renderStrategyCards(active = false) {
        if (!this._strategyCardsContainer) return;

        const shuffledCards = [...STRATEGY_CARDS].sort(() => 0.5 - Math.random());
        const cardsToRender = shuffledCards.slice(0, 3);

        const html = cardsToRender.map(card => `
            <button class="glass-button primary-button flex flex-col items-center p-3 rounded-lg text-center ${active ? '' : 'opacity-50 cursor-not-allowed'}"
                    data-card-id="${card.id}" ${active ? '' : 'disabled'}>
                <i data-feather="${card.icon}" class="w-6 h-6 mb-2"></i>
                <span class="text-sm font-semibold">${card.name}</span>
                <span class="text-xs text-slate-400 mt-1">${card.description}</span>
            </button>
        `).join('');
        UIManager.render(this._strategyCardsContainer, html);
        feather.replace();

        if (active) {
            this._strategyCardsContainer.querySelectorAll('button').forEach(button => {
                button.onclick = (e) => {
                    const cardId = e.currentTarget.dataset.cardId;
                    const chosenCard = STRATEGY_CARDS.find(c => c.id === cardId);
                    if (chosenCard) {
                        this._playerTurn(chosenCard);
                    }
                };
            });
        }
    },

    async _playerTurn(chosenCard) {
        if (!this._gameActive) return;

        this._duelFeedbackMessageEl.textContent = "";
        let playerDamageDealt = chosenCard.baseDamage;
        let opponentFeedback = `${this._opponent.name} menerima ${playerDamageDealt} kerusakan Tekad.`;

        const user = getCurrentUser();
        const sentinelSkills = SKILL_TREE_DATA.Sentinel || {};
        const npcTraits = this._opponent.personalityTraits || [];
        const npcHealthState = this._opponent.healthState || 'normal';

        if (user.unlockedImprints.includes(sentinelSkills.titans_burden?.id)) {
            const skill = SENTINEL_SKILL_EFFECTS['titans_burden'];
            if (this._opponent.willpower.current / this._opponent.willpower.max > 0.7) {
                playerDamageDealt += playerDamageDealt * skill.passive.bonusDamageIfHighWill;
                opponentFeedback += " Pikulan Sang Raksasa memberikan kerusakan bonus!";
            }
        }

        // NPC Trait influence on player damage
        if (npcTraits.includes('courageous')) {
            playerDamageDealt *= 0.8;
            opponentFeedback += ` Keberanian ${this._opponent.name} sedikit mengurangi dampak seranganmu.`;
        } else if (npcTraits.includes('cautious')) {
            playerDamageDealt *= 1.2;
            opponentFeedback += ` Sifat hati-hati ${this._opponent.name} membuatnya lebih rentan.`;
        }
        if (npcTraits.includes('stoic')) {
            if (chosenCard.type === 'persuasive_argument') {
                playerDamageDealt *= 0.5;
                opponentFeedback += ` Tekad stoik ${this._opponent.name} menepis argumenmu.`;
            }
        }

        // NPC Health State influence
        if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) {
            playerDamageDealt *= 1.2;
            opponentFeedback += ` Kondisi lemah ${this._opponent.name} membuatnya lebih rentan.`;
        } else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) {
            playerDamageDealt *= 1.5;
            opponentFeedback += ` Gema yang merasuki ${this._opponent.name} membuatnya mudah goyah.`;
        }


        if (chosenCard.type === 'expose_weakness' && this._opponent.weaknesses.length > 0) {
            this._exposedWeakness = this._opponent.weaknesses[Math.floor(Math.random() * this._opponent.weaknesses.length)];
            this._duelFeedbackMessageEl.textContent = `Anda menemukan Simpul Argumen: "${this._exposedWeakness}"! Gunakan untuk keuntunganmu.`;
            playerDamageDealt = 0;
        } else if (chosenCard.type === 'attack_with_weakness') {
            if (this._exposedWeakness === chosenCard.targetWeakness || (this._opponent.weaknesses && this._opponent.weaknesses.includes(chosenCard.targetWeakness))) {
                playerDamageDealt *= 1.5;
                opponentFeedback += ` Kelemahan ${chosenCard.targetWeakness} dieksploitasi, kerusakan meningkat!`;
            } else {
                opponentFeedback += ` Serangan tidak mengenai kelemahan utama.`;
            }
        }

        this._opponent.willpower.current -= playerDamageDealt;
        this._opponent.willpower.current = Math.max(0, this._opponent.willpower.current);

        if (chosenCard.selfRestore) {
            this._playerWill.current += chosenCard.selfRestore;
            this._playerWill.current = Math.min(this._playerWill.max, this._playerWill.current);
            opponentFeedback += ` Anda memulihkan ${chosenCard.selfRestore} Tekad.`;
        }
        if (chosenCard.selfDamage) {
            this._playerWill.current -= chosenCard.selfDamage;
            opponentFeedback += ` Anda kehilangan ${chosenCard.selfDamage} Tekad.`;
        }
        if (chosenCard.defenseBoost) {
            this._playerDefenseBoost = chosenCard.defenseBoost;
            this._duelFeedbackMessageEl.textContent += ` Pertahanan Anda meningkat untuk putaran ini.`;
        } else {
            this._playerDefenseBoost = 0;
        }


        this._updateDuelFeedback(opponentFeedback);
        this._drawOpponentWillBar();
        await this._checkDuelEnd();

        if (this._gameActive) {
            this._renderStrategyCards(false);
            setTimeout(() => this._opponentTurn(), 1500);
        }
    },

    async _opponentTurn() {
        if (!this._gameActive) return;

        let baseOpponentDamage = 20 + Math.floor(Math.random() * 10);
        let damageToPlayer = baseOpponentDamage;
        let opponentMoveFeedback = `${this._opponent.name} menyerang! Anda menerima ${baseOpponentDamage} kerusakan Tekad.`;

        const userSkills = getCurrentUser().unlockedImprints;
        const sentinelSkills = SKILL_TREE_DATA.Sentinel || {};
        const npcTraits = this._opponent.personalityTraits || [];
        const npcHealthState = this._opponent.healthState || 'normal';

        if (npcTraits.includes('courageous')) {
            damageToPlayer *= 1.1;
            opponentMoveFeedback += ` Serangan ${this._opponent.name} lebih berani!`;
        } else if (npcTraits.includes('cautious')) {
            damageToPlayer *= 0.8;
            opponentMoveFeedback += ` Serangan ${this._opponent.name} sedikit lebih hati-hati.`;
        }
        if (npcTraits.includes('optimistic')) {
             damageToPlayer *= 0.9;
             opponentMoveFeedback += ` Optimisme ${this._opponent.name} membuat serangannya sedikit kurang agresif.`;
        }
        if (npcTraits.includes('pessimistic')) {
            damageToPlayer *= 1.2;
            opponentMoveFeedback += ` Pesimisme ${this._opponent.name} membuatnya lebih putus asa menyerang!`;
        }

        if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) {
            damageToPlayer *= 0.8;
            opponentMoveFeedback += ` Kondisi lemah ${this._opponent.name} mengurangi kekuatan serangannya.`;
        } else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) {
            damageToPlayer *= 0.6;
            opponentMoveFeedback += ` Gema yang merasuki ${this._opponent.name} melemahkan pukulannya.`;
        }


        if (userSkills.includes(sentinelSkills.ironblood?.id)) {
            const skill = SENTINEL_SKILL_EFFECTS['ironblood'];
            damageToPlayer -= damageToPlayer * skill.passive.damageReduction;
            damageToPlayer = Math.max(0, damageToPlayer);
            opponentMoveFeedback += ` Darah Besi mengurangi kerusakan menjadi ${damageToPlayer.toFixed(0)}.`;
        }

        if (userSkills.includes(sentinelSkills.protectors_oath?.id)) {
            const skill = SENTINEL_SKILL_EFFECTS['protectors_oath'];
            if (Math.random() < skill.active.chance) {
                damageToPlayer -= damageToPlayer * skill.active.absorbDamage;
                damageToPlayer = Math.max(0, damageToPlayer);
                opponentMoveFeedback += ` Sumpah Pelindung menyerap sebagian serangan! Kerusakan akhir ${damageToPlayer.toFixed(0)}.`;
            }
        }

        if (this._playerDefenseBoost > 0) {
            damageToPlayer -= damageToPlayer * this._playerDefenseBoost;
            damageToPlayer = Math.max(0, damageToPlayer);
            opponentMoveFeedback += ` Pertahanan Anda mengurangi kerusakan.`;
            this._playerDefenseBoost = 0;
        }

        this._playerWill.current -= damageToPlayer;
        this._playerWill.current = Math.max(0, this._playerWill.current);

        if (userSkills.includes(sentinelSkills.second_wind?.id) && this._playerHasSecondWind) {
            const skill = SENTINEL_SKILL_EFFECTS['second_wind'];
            if (this._playerWill.current / this._playerWill.max <= skill.active.threshold) {
                this._playerWill.current += skill.active.willRestore;
                this._playerWill.current = Math.min(this._playerWill.max, this._playerWill.current);
                this._playerHasSecondWind = false;
                opponentMoveFeedback += ` Nafas Kedua memulihkan Tekad Anda!`;
            }
        }

        if (userSkills.includes(sentinelSkills.counter_attack?.id)) {
            const skill = SENTINEL_SKILL_EFFECTS['counter_attack'];
            if (Math.random() < skill.active.chance) {
                this._opponent.willpower.current -= skill.active.damage;
                this._opponent.willpower.current = Math.max(0, this._opponent.willpower.current);
                opponentMoveFeedback += ` Anda melakukan serangan balasan, menyebabkan ${skill.active.damage} kerusakan pada ${this._opponent.name}!`;
            }
        }

        this._updateDuelFeedback(opponentMoveFeedback + ` Tekad Anda: ${this._playerWill.current}/${this._playerWill.max}.`);
        this._drawOpponentWillBar();
        await this._checkDuelEnd();

        if (this._gameActive) {
            this._duelRound++;
            setTimeout(() => {
                this._duelFeedbackMessageEl.textContent = `Putaran ${this._duelRound}: Pilih strategimu.`;
                this._renderStrategyCards(true);
            }, 1500);
        }
    },

    _updateDuelFeedback(message) {
        if (this._duelFeedbackMessageEl) {
            this._duelFeedbackMessageEl.textContent = message;
        }
    },

    async _checkDuelEnd() {
        if (this._opponent.willpower.current <= 0) {
            this._endDuel('win');
            return true;
        } else if (this._playerWill.current <= 0) {
            this._endDuel('lose');
            return true;
        }
        return false;
    },

    async _endDuel(result) {
        if (!this._gameActive && result !== 'aborted') return;
        this._gameActive = false;
        clearInterval(this._gameInterval);

        let chronicleEntry = {
            id: Date.now(),
            type: 'duel_niat',
            title: `Duel Niat Melawan ${this._opponent.name}`,
            timestamp: new Date().toISOString(),
            icon: 'sword'
        };

        const user = getCurrentUser();
        let xpReward = 0;
        let essenceGained = 0;
        let chronicleReflection = '';

        if (result === 'win') {
            xpReward = 100 + this._opponent.willpower.max / 2;
            essenceGained = 5;
            chronicleReflection = `Anda telah mengalahkan ${this._opponent.name} dalam Duel Niat, membuktikan kekuatan tekad Anda.`;
            this._updateDuelFeedback(`Kemenangan! Anda mengalahkan ${this._opponent.name} dalam Duel Niat!`);
            UIManager.showNotification(`Duel Niat Selesai: KEMENANGAN! (+${xpReward} XP, +${essenceGained} Esensi Niat)`, 'award', 'success');
        } else if (result === 'lose') {
            xpReward = 20;
            essenceGained = 0;
            chronicleReflection = `Tekad Anda goyah melawan ${this._opponent.name} dalam Duel Niat. Anda harus menjadi lebih kuat.`;
            this._updateDuelFeedback(`Kekalahan! Tekad Anda gagal melawan ${this._opponent.name}.`);
            UIManager.showNotification(`Duel Niat Selesai: KEKALAHAN.`, 'x-circle', 'error');
        } else {
            xpReward = 0;
            essenceGained = 0;
            chronicleReflection = `Duel Niat melawan ${this._opponent.name} dihentikan.`;
            this._updateDuelFeedback(`Duel Niat dihentikan.`);
            UIManager.showNotification(`Duel Niat dihentikan.`, 'info', 'info');
        }

        user.xp += xpReward;
        user.essenceOfWill += essenceGained;
        chronicleEntry.description = chronicleReflection;
        user.chronicle.push(chronicleEntry);

        if (user.archetype === 'chronicler' && result === 'win' && Math.random() < 0.15) {
            await ChallengeGame._triggerGossipRumor(user, this._opponent);
        }

        setCurrentUser(user);
        await saveDBInstance(true);

        setTimeout(() => {
            UIManager.hideModal('challenge-modal');
            if (WandererPageRenderer) {
                 WandererPageRenderer.renderAllWandererComponents('character');
                 WandererPageRenderer.renderChronicle();
            }
        }, 2000);
    },

    // --- Mini-game Merasakan (Empathize) ---
    _empathizeNpc: null,
    _empathizeGameActive: false,
    _emotionSpectrumCanvas: null,
    _emotionSpectrumCtx: null,
    _soulMarkerEl: null,
    _soulTonesInstrumentContainer: null,
    _emotionalFeedbackMessageEl: null,
    _empathizeStartBtn: null,
    _empathizeCloseBtn: null,
    _soulMarkerPosition: 0.5, // 0 to 1, representing position on spectrum
    _soulMarkerDirection: 1, // 1 for right, -1 for left
    _attunementProgress: 0, // How close player is to attuning
    _gameInterval: null, // Interval for soul marker movement
    _perfectMatchBonus: 0, // For 'Pure Note' skill

    setDependencies(db, saveDB, uiM, worldM, wandererPR) {
        dbInstance = db;
        saveDBInstance = saveDB;
        UIManager = uiM;
        WorldManager = worldM;
        WandererPageRenderer = wandererPR;
        if (typeof window !== 'undefined') {
            window.EmpathizeGame = this;
        }
    },

    _initEmpathizeUIElements() {
        this._empathizeModalEl = document.getElementById('empathize-modal');
        this._empathizeTitleEl = document.getElementById('empathize-modal-title');
        this._empathizeDescEl = document.getElementById('empathize-modal-description');
        this._emotionSpectrumCanvas = document.getElementById('emotion-spectrum-canvas');
        this._emotionSpectrumCtx = this._emotionSpectrumCanvas ? this._emotionSpectrumCanvas.getContext('2d') : null;
        this._soulMarkerEl = document.getElementById('soul-marker');
        this._soulTonesInstrumentContainer = document.getElementById('soul-tones-instrument-container');
        this._emotionalFeedbackMessageEl = document.getElementById('emotional-feedback-message');
        this._empathizeStartBtn = document.getElementById('empathize-start-btn');
        this._empathizeCloseBtn = document.getElementById('empathize-close-btn');

        if (this._emotionSpectrumCanvas) {
            this._emotionSpectrumCanvas.width = this._emotionSpectrumCanvas.offsetWidth;
            this._emotionSpectrumCanvas.height = this._emotionSpectrumCanvas.offsetHeight;
            window.removeEventListener('resize', this._onEmpathizeCanvasResize);
            this._onEmpathizeCanvasResize = () => {
                this._emotionSpectrumCanvas.width = this._emotionSpectrumCanvas.offsetWidth;
                this._emotionSpectrumCanvas.height = this._emotionSpectrumCanvas.offsetHeight;
                this._drawEmotionSpectrum();
                this._updateSoulMarkerPosition();
            };
            window.addEventListener('resize', this._onEmpathizeCanvasResize);
        }
    },

    async triggerEmpathizeMiniGame(npcTarget) {
        const user = getCurrentUser();
        if (user.role !== 'wanderer' || user.archetype !== 'empath') {
            UIManager.showNotification("Hanya Sang Empati yang dapat Merasakan.", 'info', 'info');
            return;
        }

        this._initEmpathizeUIElements();
        if (!this._empathizeModalEl) {
            console.error("Empathize modal elements not found.");
            return;
        }

        this._empathizeNpc = npcTarget;
        if (!this._empathizeNpc.personalityTraits) {
            this._empathizeNpc.personalityTraits = [];
        }
        if (!this._empathizeNpc.soulTone) {
            this._empathizeNpc.soulTone = Math.random();
        }

        this._empathizeGameActive = false;
        this._soulMarkerPosition = 0.5;
        this._soulMarkerDirection = Math.random() < 0.5 ? 1 : -1;
        this._attunementProgress = 0;
        this._perfectMatchBonus = 0;

        this._empathizeTitleEl.textContent = `Merasakan ${this._empathizeNpc.name}`;
        this._empathizeDescEl.textContent = `Selami kedalaman nada jiwa ${this._empathizeNpc.name}.`;
        this._emotionalFeedbackMessageEl.textContent = "Bersiaplah untuk Merasakan Jiwa...";

        this._drawEmotionSpectrum();
        this._renderSoulTonesInstrument();
        this._updateSoulMarkerPosition();

        UIManager.showModal('empathize-modal', null, null, false);
        this._empathizeStartBtn.classList.remove('hidden');
        this._empathizeCloseBtn.classList.remove('hidden');

        this._empathizeStartBtn.onclick = () => this._startEmpathizeGame();
        this._empathizeCloseBtn.onclick = () => this._endEmpathizeGame('aborted');
    },

    _startEmpathizeGame() {
        this._empathizeGameActive = true;
        this._empathizeStartBtn.classList.add('hidden');
        this._empathizeCloseBtn.classList.add('hidden');
        this._emotionalFeedbackMessageEl.textContent = "Merasakan Dimulai! Cocokkan nada jiwa.";

        const userSkills = getCurrentUser().unlockedImprints;
        const npcTraits = this._empathizeNpc.personalityTraits || [];
        const npcHealthState = this._empathizeNpc.healthState || 'normal';

        let markerSpeed = 0.005;
        if (userSkills.includes(EMPATH_SKILL_EFFECTS['calming_aura']?.id)) { // Check if skill exists and is unlocked
            markerSpeed *= (1 - EMPATH_SKILL_EFFECTS['calming_aura'].passive.markerSpeedReduction);
        }

        if (npcTraits.includes('stoic')) {
            markerSpeed *= 0.7;
        } else if (npcTraits.includes('gregarious')) {
            markerSpeed *= 1.3;
        } else if (npcTraits.includes('pessimistic')) {
            markerSpeed *= 0.9;
        }

        if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) {
            markerSpeed *= 1.1;
        } else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) {
            markerSpeed *= 1.3;
        }


        if (userSkills.includes(EMPATH_SKILL_EFFECTS['pure_note']?.id)) {
            this._perfectMatchBonus = EMPATH_SKILL_EFFECTS['pure_note'].active.perfectMatchBonus;
        }

        this._gameInterval = setInterval(() => {
            this._soulMarkerPosition += this._soulMarkerDirection * markerSpeed;
            if (this._soulMarkerPosition >= 1 || this._soulMarkerPosition <= 0) {
                this._soulMarkerDirection *= -1;
                this._soulMarkerPosition = Math.max(0, Math.min(1, this._soulMarkerPosition));
            }
            this._updateSoulMarkerPosition();
        }, 20);

        this._soulTonesInstrumentContainer.querySelectorAll('button').forEach(button => {
            button.onclick = (e) => this._handleToneClick(e.currentTarget.dataset.toneType);
        });
    },

    _drawEmotionSpectrum() {
        if (!this._emotionSpectrumCtx || !this._emotionSpectrumCanvas) return;

        const ctx = this._emotionSpectrumCtx;
        const canvas = this._emotionSpectrumCanvas;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, EMOTION_SPECTRUM_COLORS.negative);
        gradient.addColorStop(0.5, EMOTION_SPECTRUM_COLORS.neutral);
        gradient.addColorStop(1, EMOTION_SPECTRUM_COLORS.positive);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#f3f4f6';
        ctx.font = `bold ${canvas.height * 0.3}px 'Cormorant Garamond'`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('NEGATIF', canvas.width * 0.02, canvas.height / 2);

        ctx.textAlign = 'right';
        ctx.fillText('POSITIF', canvas.width * 0.98, canvas.height / 2);
    },

    _updateSoulMarkerPosition() {
        if (!this._soulMarkerEl || !this._emotionSpectrumCanvas) return;
        const canvasWidth = this._emotionSpectrumCanvas.offsetWidth;
        const markerLeft = (this._soulMarkerPosition * canvasWidth) - (this._soulMarkerEl.offsetWidth / 2);
        this._soulMarkerEl.style.left = `${markerLeft}px`;

        if (this._soulMarkerPosition < 0.33) {
            this._soulMarkerEl.style.backgroundColor = EMOTION_SPECTRUM_COLORS.negative;
        } else if (this._soulMarkerPosition < 0.66) {
            this._soulMarkerEl.style.backgroundColor = EMOTION_SPECTRUM_COLORS.neutral;
        } else {
            this._soulMarkerEl.style.backgroundColor = EMOTION_SPECTRUM_COLORS.positive;
        }
    },

    _renderSoulTonesInstrument() {
        if (!this._soulTonesInstrumentContainer) return;
        const html = SOUL_TONES.map(tone => `
            <button class="glass-button px-6 py-3 font-semibold rounded-lg ${tone.class}" data-tone-type="${tone.type}">
                ${tone.name}
            </button>
        `).join('');
        UIManager.render(this._soulTonesInstrumentContainer, html);
        feather.replace();
    },

    async _handleToneClick(clickedToneType) {
        if (!this._empathizeGameActive) return;

        const user = getCurrentUser();
        const currentSocial = user.attributes.find(a => a.name === 'Social').value;
        const currentFocus = user.attributes.find(a => a.name === 'Focus').value;
        const npcTraits = this._empathizeNpc.personalityTraits || [];
        const npcHealthState = this._empathizeNpc.healthState || 'normal';

        let targetTone = null;
        for (const tone of SOUL_TONES) {
            if (this._soulMarkerPosition >= tone.range[0] && this._soulMarkerPosition <= tone.range[1]) {
                targetTone = tone.type;
                break;
            }
        }

        let isMatch = (clickedToneType === targetTone);
        let feedbackMessage = '';
        let attunementChange = 0;

        if (isMatch) {
            attunementChange = 0.15 + (currentFocus * 0.01) + (currentSocial * 0.005);
            feedbackMessage = `Harmoni! Jiwa ${this._empathizeNpc.name} merespons.`;
            if (this._perfectMatchBonus > 0 && Math.abs(this._soulMarkerPosition - (SOUL_TONES.find(t => t.type === clickedToneType).range[0] + SOUL_TONES.find(t => t.type === clickedToneType).range[1]) / 2) < 0.05) {
                attunementChange += this._perfectMatchBonus;
                feedbackMessage += " Nada Sempurna!";
            }
        } else {
            attunementChange = -0.10;
            feedbackMessage = `Disonansi! Jiwa ${this._empathizeNpc.name} menolak.`;
        }

        if (npcTraits.includes('stoic')) {
            attunementChange *= 0.8;
            feedbackMessage += ` Jiwa Stoik menantang harmonisasi.`;
        } else if (npcTraits.includes('gregarious')) {
            attunementChange *= 1.2;
            feedbackMessage += ` Jiwa Ramah lebih terbuka pada harmoni.`;
        } else if (npcTraits.includes('pessimistic')) {
            attunementChange *= 0.9;
            feedbackMessage += ` Jiwa Pesimis mengaburkan nada.`;
        }

        if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) {
            attunementChange *= 1.1;
            feedbackMessage += ` Kondisi lemah ${this._empathizeNpc.name} membuatnya lebih terbuka.`;
        } else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) {
            attunementChange *= 0.7;
            feedbackMessage += ` Gema yang merasuki ${this._empathizeNpc.name} mengganggu harmonisasi.`;
        }


        this._attunementProgress += attunementChange;
        this._attunementProgress = Math.max(0, Math.min(1, this._attunementProgress));

        this._emotionalFeedbackMessageEl.textContent = feedbackMessage;

        const clickedToneRange = SOUL_TONES.find(t => t.type === clickedToneType).range;
        const clickedToneCenter = (clickedToneRange[0] + clickedToneRange.length[1]) / 2; // Fixed: clickedToneRange[1] instead of length
        const pullStrength = 0.05;

        if (this._soulMarkerPosition < clickedToneCenter) {
            this._soulMarkerPosition = Math.min(clickedToneCenter, this._soulMarkerPosition + pullStrength);
        } else if (this._soulMarkerPosition > clickedToneCenter) {
            this._soulMarkerPosition = Math.max(clickedToneCenter, this._soulMarkerPosition - pullStrength);
        }
        this._updateSoulMarkerPosition();

        if (this._attunementProgress >= 1) {
            this._endEmpathizeGame('win');
        } else if (this._attunementProgress <= 0 && this._empathizeGameActive) {
            this._endEmpathizeGame('lose');
        }
    },

    async _endEmpathizeGame(result) {
        if (!this._empathizeGameActive && result !== 'aborted') return;
        this._empathizeGameActive = false;
        clearInterval(this._gameInterval);

        let chronicleEntry = {
            id: Date.now(),
            type: 'empathize_session',
            title: `Sesi Merasakan dengan ${this._empathizeNpc.name}`,
            timestamp: new Date().toISOString(),
            icon: 'heart'
        };

        const user = getCurrentUser();
        const empathSkills = SKILL_TREE_DATA.Empath || {}; // Ensure Empath skills are accessed correctly
        let xpReward = 0;
        let echoChange = 0;
        let intentionChange = 0;
        let reputationChange = 0;
        let chronicleReflection = '';

        if (result === 'win') {
            xpReward = 150;
            reputationChange = 5;
            echoChange = -10;
            intentionChange = 5;
            chronicleReflection = `Anda berhasil menyelaraskan dengan jiwa ${this._empathizeNpc.name}, menemukan kedamaian bersama. Reputasi meningkat.`;

            if (user.unlockedImprints.includes(empathSkills.communal_harmony?.id)) {
                reputationChange += reputationChange * EMPATH_SKILL_EFFECTS['communal_harmony'].passive.bonusReputation;
                xpReward += 50;
                chronicleReflection += " Harmoni Komunal membawa keberkahan. ";
            }
            if (user.unlockedImprints.includes(empathSkills.echo_healer?.id)) {
                echoChange += EMPATH_SKILL_EFFECTS['echo_healer'].passive.selfEchoHeal;
                chronicleReflection += " Gema Penyembuh memulihkan ketenangan Anda. ";
            }
            if (user.unlockedImprints.includes(empathSkills.song_of_conscience?.id)) {
                const alignmentShift = user.alignment.echo * EMPATH_SKILL_EFFECTS['song_of_conscience'].active.alignToIntention;
                echoChange -= alignmentShift;
                intentionChange += alignmentShift;
                chronicleReflection += ` Lagu Hati Nurani menggeser keselarasan Anda.`;
            }
            if (user.unlockedImprints.includes(empathSkills.inner_sanctuary?.id)) {
                if (Math.random() < EMPATH_SKILL_EFFECTS['inner_sanctuary'].passive.composureRestoreChance) {
                    user.xp += 25;
                    chronicleReflection += " Sanctuary Batin Anda pulih. ";
                    UIManager.showNotification("Sanctuary Batin pulih!", 'heart', 'success');
                }
            }


            this._emotionalFeedbackMessageEl.textContent = `Sukses! Anda menyelaraskan dengan ${this._empathizeNpc.name}!`;
            UIManager.showNotification(`Merasakan Selesai: KEBERHASILAN! (+${xpReward} XP, +${reputationChange.toFixed(0)} Reputasi)`, 'award', 'success');

            if (this._empathizeNpc) {
                // Assuming NPC has a 'purified' or 'healed' status based on empathy
                if (this._empathizeNpc.healthState === NPC_HEALTH_STATES.CORRUPTED.id && Math.random() < 0.5) { // 50% chance to purify corrupted NPC
                    this._empathizeNpc.healthState = NPC_HEALTH_STATES.NORMAL.id;
                    this._empathizeNpc.currentHealth = 100;
                    UIManager.showNotification(`${this._empathizeNpc.name} telah dimurnikan!`, 'sparkles', 'success');
                    // Record NPC purification in chronicle
                    addToWandererChronicle(user, {
                        type: CHRONICLE_EVENTS.NPC_PURIFIED.type,
                        title: CHRONICLE_EVENTS.NPC_PURIFIED.title,
                        description: CHRONICLE_EVENTS.NPC_PURIFIED.template.replace('{npcName}', this._empathizeNpc.name).replace('{regionName}', WorldManager.getRegionName(this._empathizeNpc.currentRegion)),
                        timestamp: new Date().toISOString(),
                        icon: CHRONICLE_EVENTS.NPC_PURIFIED.icon
                    });
                }
                // Update NPC motivation or happiness
                if (!this._empathizeNpc.mood) this._empathizeNpc.mood = 50; // Simple mood system
                this._empathizeNpc.mood = Math.min(100, this._empathizeNpc.mood + 20); // Increase mood

                if (dbInstance.npc_souls && dbInstance.npc_souls[this._empathizeNpc.id]) { // Use ID as key
                    dbInstance.npc_souls[this._empathizeNpc.id] = this._empathizeNpc;
                }
            }


            if (user.archetype === 'chronicler' && result === 'win' && Math.random() < 0.15) {
                await EmpathizeGame._triggerGossipRumor(user, this._empathizeNpc);
            }


        } else if (result === 'lose') {
            xpReward = 10;
            echoChange = 15;
            reputationChange = -2;
            chronicleReflection = `Anda gagal menyelaraskan dengan jiwa ${this._empathizeNpc.name}. Disonansi merasuki Anda.`;
            this._emotionalFeedbackMessageEl.textContent = `Gagal! Anda tidak dapat menyelaraskan dengan ${this._empathizeNpc.name}.`;
            UIManager.showNotification(`Merasakan Selesai: KEGAGALAN.`, 'x-circle', 'error');

             if (this._empathizeNpc) {
                if (!this._empathizeNpc.mood) this._empathizeNpc.mood = 50;
                this._empathizeNpc.mood = Math.max(0, this._empathizeNpc.mood - 10); // Decrease mood
                if (dbInstance.npc_souls && dbInstance.npc_souls[this._empathizeNpc.id]) {
                    dbInstance.npc_souls[this._empathizeNpc.id] = this._empathizeNpc;
                }
            }
        } else {
            xpReward = 0;
            echoChange = 0;
            intentionChange = 0;
            reputationChange = 0;
            chronicleReflection = `Sesi Merasakan dengan ${this._empathizeNpc.name} dihentikan.`;
            this._emotionalFeedbackMessageEl.textContent = `Sesi Merasakan dihentikan.`;
            UIManager.showNotification(`Sesi Merasakan dihentikan.`, 'info', 'info');
        }

        user.xp += xpReward;
        user.alignment.echo += echoChange;
        user.alignment.intention += intentionChange;
        user.alignment.echo = Math.max(0, user.alignment.echo);
        user.alignment.intention = Math.max(0, user.alignment.intention);

        // Update NPC reputation (if applicable, using WorldManager)
        if (reputationChange !== 0 && this._empathizeNpc) {
            WorldManager.recordReputationChange(this._empathizeNpc.id, reputationChange, "empathize");
        }

        chronicleEntry.description = chronicleReflection;
        user.chronicle.push(chronicleEntry);

        setCurrentUser(user);
        await saveDBInstance(true);

        setTimeout(() => {
            UIManager.hideModal('empathize-modal');
            if (WandererPageRenderer) {
                 WandererPageRenderer.renderAllWandererComponents('character');
                 WandererPageRenderer.renderChronicle();
            }
        }, 2000);
    }
};

export const InspireGame = {
    _inspireNpc: null,
    _inspireGameActive: false,
    _willInjectionProgress: 0,
    _gameDuration: 10000,
    _gameTimer: null,
    _decreeUsed: false,

    _modalEl: null, _titleEl: null, _descEl: null, _motivationChoicesContainer: null,
    _willInjectionCanvas: null, _willInjectionCtx: null, _npcMotivationFeedbackEl: null,
    _startBtn: null, _closeBtn: null,

    setDependencies(db, saveDB, uiM, worldM, wandererPR) {
        dbInstance = db;
        saveDBInstance = saveDB;
        UIManager = uiM;
        WorldManager = worldM;
        WandererPageRenderer = wandererPR;
        if (typeof window !== 'undefined') {
            window.InspireGame = this;
        }
    },

    _initInspireUIElements() {
        this._modalEl = document.getElementById('inspire-modal');
        this._titleEl = document.getElementById('inspire-modal-title');
        this._descEl = document.getElementById('inspire-modal-description');
        this._motivationChoicesContainer = document.getElementById('motivation-choices-container');
        this._willInjectionCanvas = document.getElementById('will-injection-canvas');
        this._willInjectionCtx = this._willInjectionCanvas ? this._willInjectionCanvas.getContext('2d') : null;
        this._npcMotivationFeedbackEl = document.getElementById('npc-motivation-feedback');
        this._startBtn = document.getElementById('inspire-start-btn');
        this._closeBtn = document.getElementById('inspire-close-btn');

        if (this._willInjectionCanvas) {
            this._willInjectionCanvas.width = this._willInjectionCanvas.offsetWidth;
            this._willInjectionCanvas.height = this._willInjectionCanvas.offsetHeight;
            window.removeEventListener('resize', this._onInspireCanvasResize);
            this._onInspireCanvasResize = () => {
                this._willInjectionCanvas.width = this._willInjectionCanvas.offsetWidth;
                this._willInjectionCanvas.height = this._willInjectionCanvas.offsetHeight;
                this._drawWillInjectionBar();
            };
            window.addEventListener('resize', this._onInspireCanvasResize);
        }
    },

    async triggerInspireMiniGame(npcTarget) {
        const user = getCurrentUser();
        if (user.role !== 'wanderer' || user.archetype !== 'will-shaper') {
            UIManager.showNotification("Hanya Sang Penempa Niat yang dapat Menginspirasi.", 'info', 'info');
            return;
        }

        this._initInspireUIElements();
        if (!this._modalEl) {
            console.error("Inspire modal elements not found.");
            return;
        }

        this._inspireNpc = npcTarget;
        if (!this._inspireNpc.motivationState) {
            this._inspireNpc.motivationState = {
                current: 50,
                target: Math.floor(Math.random() * 50) + 50,
                type: ['courage', 'hope', 'perseverance'][Math.floor(Math.random() * 3)]
            };
        }
        if (!this._inspireNpc.personalityTraits) {
            this._inspireNpc.personalityTraits = [];
        }

        this._willInjectionProgress = 0;
        this._inspireGameActive = false;
        this._decreeUsed = false;

        this._titleEl.textContent = `Menginspirasi ${this._inspireNpc.name}`;
        this._descEl.textContent = `Fokuskan Niatmu untuk membangkitkan motivasi ${this._inspireNpc.name}.`;
        this._npcMotivationFeedbackEl.textContent = "Bersiaplah untuk menginspirasi...";

        this._drawWillInjectionBar();
        this._renderMotivationChoices(false);

        UIManager.showModal('inspire-modal', null, null, false);
        this._startBtn.classList.remove('hidden');
        this._closeBtn.classList.remove('hidden');

        this._startBtn.onclick = () => this._startInspireGame();
        this._closeBtn.onclick = () => this._endInspireGame('aborted');
    },

    _startInspireGame() {
        this._inspireGameActive = true;
        this._startBtn.classList.add('hidden');
        this._closeBtn.classList.add('hidden');
        this._npcMotivationFeedbackEl.textContent = "Inspirasi Dimulai! Pilih jenis motivasi.";
        this._renderMotivationChoices(true);

        this._gameTimer = setTimeout(() => {
            if (this._inspireGameActive) {
                this._endInspireGame(this._willInjectionProgress >= 1 ? 'win' : 'lose');
            }
        }, this._gameDuration);
    },

    _drawWillInjectionBar() {
        if (!this._willInjectionCtx || !this._willInjectionCanvas) return;

        const ctx = this._willInjectionCtx;
        const canvas = this._willInjectionCanvas;
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, width, height);

        const fillWidth = this._willInjectionProgress * width;
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#fde047');
        gradient.addColorStop(1, '#fbbf24');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, fillWidth, height);

        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, width, height);

        ctx.fillStyle = '#111827';
        ctx.font = `bold ${height * 0.6}px 'Cormorant Garamond'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${(this._willInjectionProgress * 100).toFixed(0)}%`, width / 2, height / 2);
    },

    _renderMotivationChoices(active = false) {
        if (!this._motivationChoicesContainer) return;

        const user = getCurrentUser();
        const userDiscipline = user.attributes.find(a => a.name === 'Discipline').value;
        const userSocial = user.attributes.find(a => a.name === 'Social').value;
        const userFocus = user.attributes.find(a => a.name === 'Focus').value;

        const willShaperSkills = SKILL_TREE_DATA['Will-Shaper'] || {};
        const activeForgersDecree = user.unlockedImprints.includes(willShaperSkills.forgers_decree?.id) && !this._decreeUsed;
        const forgersDecreeCost = willShaperSkills.forgers_decree?.cost || 0;

        const html = MOTIVATION_CHOICES.map(choice => {
            const meetsDiscipline = userDiscipline >= (choice.requiredAttr.name === 'Discipline' ? choice.requiredAttr.level : 0);
            const meetsSocial = userSocial >= (choice.requiredAttr.name === 'Social' ? choice.requiredAttr.level : 0);
            const meetsFocus = userFocus >= (choice.requiredAttr.name === 'Focus' ? choice.requiredAttr.level : 0);
            const isUsable = active && meetsDiscipline && meetsSocial && meetsFocus;
            const isDisabled = !isUsable;

            let buttonClass = 'glass-button';
            if (choice.risky) {
                buttonClass += ' bg-red-700 hover:bg-red-600';
            }

            return `
                <button class="${buttonClass} px-6 py-3 font-semibold rounded-lg ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                        data-motivation-id="${choice.id}" ${isDisabled ? 'disabled' : ''}>
                    <i data-feather="${choice.icon}" class="w-5 h-5 mr-2"></i> ${choice.name}
                </button>
            `;
        }).join('');

        let decreeButtonHtml = '';
        if (activeForgersDecree) {
            const hasEnoughEssence = user.essenceOfWill >= forgersDecreeCost;
            decreeButtonHtml = `
                <button class="glass-button primary-button px-6 py-3 font-semibold rounded-lg ${!hasEnoughEssence || !active ? 'opacity-50 cursor-not-allowed' : ''}"
                        data-motivation-id="forgers_decree" ${!hasEnoughEssence || !active ? 'disabled' : ''}>
                    <i data-feather="${willShaperSkills.forgers_decree.icon}" class="w-5 h-5 mr-2"></i> ${willShaperSkills.forgers_decree.name} (${forgersDecreeCost} Esensi Niat)
                </button>
            `;
        }

        UIManager.render(this._motivationChoicesContainer, html + decreeButtonHtml);
        feather.replace();

        if (active) {
            this._motivationChoicesContainer.querySelectorAll('button').forEach(button => {
                if (!button.disabled) {
                    button.onclick = (e) => this._handleMotivationChoice(e.currentTarget.dataset.motivationId);
                }
            });
        }
    },

    async _handleMotivationChoice(choiceId) {
        if (!this._inspireGameActive) return;

        const user = getCurrentUser();
        const willShaperSkills = SKILL_TREE_DATA['Will-Shaper'] || {};
        let feedbackMessage = '';
        let success = false;
        let inspirationAmount = 0;
        const npcTraits = this._inspireNpc.personalityTraits || [];
        const npcHealthState = this._inspireNpc.healthState || 'normal';


        if (choiceId === 'forgers_decree') {
            const decreeSkill = willShaperSkills.forgers_decree;
            if (user.essenceOfWill < decreeSkill.cost) {
                UIManager.showNotification("Tidak cukup Esensi Niat untuk Dekrit Sang Penempa!", 'alert-triangle', 'error');
                return;
            }
            user.essenceOfWill -= decreeSkill.cost;
            this._decreeUsed = true;
            inspirationAmount = 0.5;
            success = true;
            feedbackMessage = "Dekrit Sang Penempa: Niatmu meresap dan menguatkan!";
            UIManager.showNotification(feedbackMessage, 'zap', 'success');
        } else {
            const chosenMotivation = MOTIVATION_CHOICES.find(c => c.id === choiceId);
            if (!chosenMotivation) return;

            let baseChance = 0.6;
            const userDiscipline = user.attributes.find(a => a.name === 'Discipline').value;
            const userSocial = user.attributes.find(a => a.name === 'Social').value;
            baseChance += (userDiscipline * 0.01) + (userSocial * 0.005);

            if (user.unlockedImprints.includes(willShaperSkills.clear_vision?.id)) {
                baseChance += WILL_SHAPER_SKILL_EFFECTS['clear_vision'].passive.insightBonus;
                feedbackMessage += " Visi yang Jelas memandu aksimu! ";
            }
            if (user.unlockedImprints.includes(willShaperSkills.group_tactics?.id)) {
                baseChance += WILL_SHAPER_SKILL_EFFECTS['group_tactics'].passive.groupBonus;
                feedbackMessage += " Taktik Kelompok meningkatkan sinergi! ";
            }

            if (this._inspireNpc.motivationState.type === choiceId) {
                baseChance += 0.15;
                feedbackMessage += " Cocok dengan motivasi inti NPC! ";
            } else {
                baseChance -= 0.05;
            }

            if (npcTraits.includes('optimistic')) {
                baseChance += 0.10;
                feedbackMessage += ` NPC Optimis lebih mudah menerima inspirasi.`;
            } else if (npcTraits.includes('pessimistic')) {
                baseChance -= 0.10;
                feedbackMessage += ` NPC Pesimis menolak inspirasi.`;
            }

            if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) {
                baseChance += 0.05;
                feedbackMessage += ` Kondisi lemah ${this._inspireNpc.name} membuatnya lebih rentan terhadap inspirasi.`;
            } else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) {
                baseChance -= 0.10;
                feedbackMessage += ` Gema yang merasuki ${this._inspireNpc.name} menolak inspirasi positif.`;
            }


            success = Math.random() < baseChance;
            inspirationAmount = success ? 0.15 + (userDiscipline * 0.005) : -0.10;

            if (chosenMotivation.risky) {
                const cost = 5;
                if (user.essenceOfWill < cost) {
                    UIManager.showNotification("Tidak cukup Esensi Niat untuk pilihan berisiko ini!", 'alert-triangle', 'error');
                    return;
                }
                user.essenceOfWill -= cost;
                feedbackMessage += ` Anda mengonsumsi ${cost} Esensi Niat.`;
            }

            if (!success) {
                if (user.unlockedImprints.includes(willShaperSkills.no_retreat?.id)) {
                    inspirationAmount *= (1 - WILL_SHAPER_SKILL_EFFECTS['no_retreat'].passive.penaltyReduction);
                    feedbackMessage += " Tidak Ada Kata Mundur mengurangi penalti Anda! ";
                }
            }
        }

        this._willInjectionProgress += inspirationAmount;
        this._willInjectionProgress = Math.max(0, Math.min(1, this._willInjectionProgress));

        this._npcMotivationFeedbackEl.textContent = feedbackMessage;
        this._drawWillInjectionBar();

        setCurrentUser(user);
        await saveDBInstance(false); // Save Essence of Will cost immediately


        if (this._willInjectionProgress >= 1) {
            this._endInspireGame('win');
        } else if (this._willInjectionProgress <= 0 && this._inspireGameActive) {
            this._endInspireGame('lose');
        } else {
            this._renderMotivationChoices(true);
        }
    },

    async _endInspireGame(result) {
        if (!this._inspireGameActive && result !== 'aborted') return;
        this._inspireGameActive = false;
        clearTimeout(this._gameTimer);

        let chronicleEntry = {
            id: Date.now(),
            type: 'inspire_session',
            title: `Sesi Menginspirasi dengan ${this._inspireNpc.name}`,
            timestamp: new Date().toISOString(),
            icon: 'zap'
        };

        const user = getCurrentUser();
        const willShaperSkills = SKILL_TREE_DATA['Will-Shaper'] || {};
        let xpReward = 0;
        let essenceGained = 0;
        let intentionGainedPlayer = 0;
        let chronicleReflection = '';
        let npcMotivationChange = 0;

        if (result === 'win') {
            xpReward = 150;
            essenceGained = 3;
            intentionGainedPlayer = 10;
            npcMotivationChange = 20;
            chronicleReflection = `Anda berhasil menginspirasi ${this._inspireNpc.name}, mengisi jiwanya dengan Niat dan tujuan.`;

            if (user.unlockedImprints.includes(willShaperSkills.one_for_all?.id)) {
                essenceGained += essenceGained * WILL_SHAPER_SKILL_EFFECTS['one_for_all'].passive.essenceOfWillBonus;
                chronicleReflection += " Satu untuk Semua meningkatkan Esensi Niat Anda! ";
            }
            if (user.unlockedImprints.includes(willShaperSkills.born_leader?.id)) {
                intentionGainedPlayer += WILL_SHAPER_SKILL_EFFECTS['born_leader'].passive.playerIntentionGain;
                chronicleReflection += " Sebagai Pemimpin yang Dilahirkan, Niat Anda sendiri menguat! ";
            }

            this._npcMotivationFeedbackEl.textContent = `Sukses! Anda menginspirasi ${this._inspireNpc.name}!`;
            UIManager.showNotification(`Menginspirasi Selesai: KEBERHASILAN! (+${xpReward} XP, +${essenceGained.toFixed(0)} Esensi Niat)`, 'award', 'success');

            if (this._inspireNpc) {
                this._inspireNpc.isInspired = true;
                this._inspireNpc.inspiredUntil = Date.now() + (60 * 60 * 1000);
                this._inspireNpc.motivationState.current = Math.min(100, this._inspireNpc.motivationState.current + npcMotivationChange);
                if (dbInstance.npc_souls && dbInstance.npc_souls[this._inspireNpc.id]) {
                    dbInstance.npc_souls[this._inspireNpc.id].motivationState = this._inspireNpc.motivationState; // Update motivationState
                    dbInstance.npc_souls[this._inspireNpc.id].isInspired = this._inspireNpc.isInspired;
                    dbInstance.npc_souls[this._inspireNpc.id].inspiredUntil = this._inspireNpc.inspiredUntil;
                }
            }

            if (user.archetype === 'chronicler' && result === 'win' && Math.random() < 0.15) {
                await InspireGame._triggerGossipRumor(user, this._inspireNpc);
            }


        } else if (result === 'lose') {
            xpReward = 10;
            essenceGained = -2;
            intentionGainedPlayer = 0;
            npcMotivationChange = -5;
            chronicleReflection = `Anda gagal menginspirasi ${this._inspireNpc.name}. Usahamu tidak mencapai sasaran.`;

            if (user.unlockedImprints.includes(willShaperSkills.no_retreat?.id)) {
                essenceGained = essenceGained * (1 - WILL_SHAPER_SKILL_EFFECTS['no_retreat'].passive.penaltyReduction);
                essenceGained = Math.round(essenceGained);
                chronicleReflection += " Tidak Ada Kata Mundur mengurangi kerugianmu. ";
            }

            this._npcMotivationFeedbackEl.textContent = `Gagal! Anda tidak dapat menginspirasi ${this._inspireNpc.name}.`;
            UIManager.showNotification(`Menginspirasi Selesai: KEGAGALAN.`, 'x-circle', 'error');

             if (this._inspireNpc) {
                this._inspireNpc.motivationState.current = Math.max(0, this._inspireNpc.motivationState.current + npcMotivationChange);
                if (dbInstance.npc_souls && dbInstance.npc_souls[this._inspireNpc.id]) {
                    dbInstance.npc_souls[this._inspireNpc.id].motivationState = this._inspireNpc.motivationState;
                }
            }
        } else {
            xpReward = 0;
            essenceGained = 0;
            intentionGainedPlayer = 0;
            npcMotivationChange = 0;
            chronicleReflection = `Sesi Menginspirasi dengan ${this._inspireNpc.name} dihentikan.`;
            this._npcMotivationFeedbackEl.textContent = `Sesi Menginspirasi dihentikan.`;
            UIManager.showNotification(`Sesi Menginspirasi dihentikan.`, 'info', 'info');
        }

        user.xp += xpReward;
        user.essenceOfWill += essenceGained;
        user.alignment.intention += intentionGainedPlayer;
        user.essenceOfWill = Math.max(0, user.essenceOfWill);
        user.alignment.intention = Math.max(0, user.alignment.intention);

        chronicleEntry.description = chronicleReflection;
        user.chronicle.push(chronicleEntry);

        setCurrentUser(user);
        await saveDBInstance(true);

        setTimeout(() => {
            UIManager.hideModal('inspire-modal');
            if (WandererPageRenderer) {
                 WandererPageRenderer.renderAllWandererComponents('character');
                 WandererPageRenderer.renderChronicle();
            }
        }, 2000);
    }
};

export const BarterGame = {
    // Game state variables for Barter
    _barterNpc: null,
    _barterGameActive: false,
    _npcOfferings: [],
    _playerInventory: [],
    _playerSelectedItem: null,
    _npcDesiredItem: null,
    _npcOfferItem: null,
    _revealedTrade: false,

    // UI elements for Barter
    _modalEl: null, _titleEl: null, _descEl: null, _npcOfferingsContainer: null,
    _playerInventoryContainer: null, _barterSummaryMessageEl: null,
    _performBarterBtn: null, _closeBtn: null,

    setDependencies(db, saveDB, uiM, worldM, wandererPR) {
        dbInstance = db;
        saveDBInstance = saveDB;
        UIManager = uiM;
        WorldManager = worldM;
        WandererPageRenderer = wandererPR;
        if (typeof window !== 'undefined') {
            window.BarterGame = this;
        }
    },

    _initBarterUIElements() {
        this._modalEl = document.getElementById('barter-modal');
        this._titleEl = document.getElementById('barter-modal-title');
        this._descEl = document.getElementById('barter-modal-description');
        this._npcOfferingsContainer = document.getElementById('npc-offerings-container');
        this._playerInventoryContainer = document.getElementById('player-inventory-for-barter');
        this._barterSummaryMessageEl = document.getElementById('barter-summary-message');
        this._performBarterBtn = document.getElementById('perform-barter-btn');
        this._closeBtn = document.getElementById('barter-close-btn');
    },

    async triggerBarterMiniGame(npcTarget) {
        const user = getCurrentUser();
        if (user.role !== 'wanderer' || user.archetype !== 'nomad') {
            UIManager.showNotification("Hanya Sang Pengelana yang dapat Bertukar.", 'info', 'info');
            return;
        }

        this._initBarterUIElements();
        if (!this._modalEl) {
            console.error("Barter modal elements not found.");
            return;
        }

        this._barterNpc = npcTarget;
        if (!this._barterNpc.personalityTraits) {
            this._barterNpc.personalityTraits = [];
        }

        this._npcOfferings = this._generateNpcOfferings();
        this._npcDesiredItem = this._generateNpcDesiredItem(); 
        this._playerInventory = this._getPlayerTradableItems(user);
        
        this._playerSelectedItem = null;
        this._npcOfferItem = null;
        this._revealedTrade = false;

        this._titleEl.textContent = `Bertukar dengan ${this._barterNpc.name}`;
        this._descEl.textContent = `Pilih barangmu untuk ditukar dengan penawaran ${this._barterNpc.name}.`;
        this._barterSummaryMessageEl.textContent = "Pilih item untuk memulai tawar-menawar.";

        this._renderNpcOfferings();
        this._renderPlayerInventory();
        
        UIManager.showModal('barter-modal', null, null, false);
        this._performBarterBtn.classList.remove('hidden');
        this._closeBtn.classList.remove('hidden');
        this._performBarterBtn.disabled = true;

        this._performBarterBtn.onclick = () => this._performBarter();
        this._closeBtn.onclick = () => this._endBarterGame('aborted');

        this._playerInventoryContainer.onclick = (e) => {
            const itemEl = e.target.closest('.tradable-item');
            if (itemEl) {
                this._handlePlayerItemSelection(itemEl.dataset.itemId);
            }
        };

        const userSkills = user.unlockedImprints;
        const nomadSkills = SKILL_TREE_DATA['Nomad'] || {};
        if (userSkills.includes(nomadSkills.wind_whispers?.id)) {
            this._revealedTrade = true;
            UIManager.showNotification(`Kabar Angin: Anda merasakan apa yang benar-benar diinginkan ${this._barterNpc.name}!`, 'feather', 'success');
            this._updateBarterSummary();
        }
    },

    _generateNpcOfferings() {
        const offerings = [];
        const numOfferings = Math.floor(Math.random() * 2) + 1;
        const availableItems = Object.values(TRADABLE_ITEMS_DATA).filter(item => item.type !== 'quest_item' && item.type !== 'currency');
        const npcHealthState = this._barterNpc.healthState || 'normal';

        const user = getCurrentUser(); // Get user for skills
        const nomadSkills = SKILL_TREE_DATA['Nomad'] || {};
        const realmExplorerActive = user.unlockedImprints.includes(nomadSkills.realm_explorer?.id);

        for (let i = 0; i < numOfferings; i++) {
            let item = null;
            if (realmExplorerActive && Math.random() < NOMAD_SKILL_EFFECTS['realm_explorer'].passive.rareItemChance) {
                const rareItems = availableItems.filter(i => i.rarity === 'rare' || i.rarity === 'epic' || i.rarity === 'legendary');
                if (rareItems.length > 0) {
                    item = { ...rareItems[Math.floor(Math.random() * rareItems.length)], quantity: 1 };
                }
            }
            if (!item) { // If no rare item chosen or no rare items available
                item = { ...availableItems[Math.floor(Math.random() * availableItems.length)], quantity: 1 };
            }
            offerings.push(item);
            // Ensure unique offerings (simple removal for now)
            availableItems.splice(availableItems.findIndex(e => e.id === item.id), 1);
        }

        if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) {
            if (offerings.length > 1 && Math.random() < 0.5) {
                offerings.pop();
            }
        } else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) {
            offerings.forEach(item => item.value = Math.max(1, Math.floor(item.value * 0.5)));
        }

        return offerings;
    },

    _generateNpcDesiredItem() {
        const npcTraits = this._barterNpc.personalityTraits || [];
        const npcHealthState = this._barterNpc.healthState || 'normal';
        let desiredItemCandidates = Object.values(TRADABLE_ITEMS_DATA).filter(item => item.type !== 'quest_item' && item.type !== 'currency');
        let desiredItem = desiredItemCandidates[Math.floor(Math.random() * desiredItemCandidates.length)];

        if (npcTraits.includes('curious')) {
            const infoItems = desiredItemCandidates.filter(item => item.type === 'information');
            if (infoItems.length > 0) {
                desiredItem = infoItems[Math.floor(Math.random() * infoItems.length)];
            }
        } else if (npcTraits.includes('pessimistic')) {
            const resourceItems = desiredItemCandidates.filter(item => item.type === 'material' || item.type === 'consumable');
            if (resourceItems.length > 0) {
                desiredItem = resourceItems[Math.floor(Math.random() * resourceItems.length)];
            }
        }

        if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) {
            const survivalItems = desiredItemCandidates.filter(item => item.id.includes('salve') || item.id.includes('potion') || item.type === 'consumable');
            if (survivalItems.length > 0) {
                desiredItem = survivalItems[Math.floor(Math.random() * survivalItems.length)];
            }
        } else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) {
            const echoItems = desiredItemCandidates.filter(item => item.id === 'echo_shard');
            if (echoItems.length > 0) {
                desiredItem = echoItems[Math.floor(Math.random() * echoItems.length)];
            } else {
                 const rareArtifacts = desiredItemCandidates.filter(item => item.type === 'artifact' && item.rarity === 'rare');
                 if (rareArtifacts.length > 0) {
                     desiredItem = rareArtifacts[Math.floor(Math.random() * rareArtifacts.length)];
                 }
            }
        }

        return desiredItem;
    },

    _getPlayerTradableItems(user) {
        return (user.inventory || []).map(item => ({
            ...item,
            ...TRADABLE_ITEMS_DATA[item.id] // Use TRADABLE_ITEMS_DATA for full item definition
        })).filter(item => item.type !== 'quest_item' && item.type !== 'currency');
    },

    _renderNpcOfferings() {
        if (!this._npcOfferingsContainer) return;
        const html = this._npcOfferings.map(item => `
            <div class="glass-container p-3 rounded-lg text-center flex flex-col items-center justify-center">
                <i data-feather="${item.icon}" class="w-8 h-8 text-slate-400 mb-2"></i>
                <p class="text-sm text-slate-300 font-semibold">${item.name} x${item.quantity}</p>
                <p class="text-xs text-slate-500">${item.description}</p>
                <p class="text-xs text-slate-500 capitalize">Kelangkaan: ${item.rarity}</p>
            </div>
        `).join('');
        UIManager.render(this._npcOfferingsContainer, html);
        feather.replace();
    },

    _renderPlayerInventory() {
        if (!this._playerInventoryContainer) return;
        const html = this._playerInventory.map(item => `
            <div class="glass-container p-3 rounded-lg text-center flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700 tradable-item ${this._playerSelectedItem?.id === item.id ? 'border-brand-color border-2 shadow-lg' : ''}"
                data-item-id="${item.id}" data-item-quantity="${item.quantity}">
                <i data-feather="${item.icon}" class="w-8 h-8 text-yellow-400 mb-2"></i>
                <p class="text-sm text-slate-300 font-semibold">${item.name} x${item.quantity}</p>
                <p class="text-xs text-slate-500 capitalize">Tipe: ${item.type}</p>
                <p class="text-xs text-slate-500 capitalize">Kelangkaan: ${item.rarity}</p>
                <p class="text-xs text-slate-500">Nilai: ${item.value}</p>
            </div>
        `).join('');
        UIManager.render(this._playerInventoryContainer, html);
        feather.replace();

        this._playerInventoryContainer.querySelectorAll('.tradable-item').forEach(el => {
            if (this._playerSelectedItem && el.dataset.itemId === this._playerSelectedItem.id) {
                el.classList.add('border-brand-color', 'border-2', 'shadow-lg');
            } else {
                el.classList.remove('border-brand-color', 'border-2', 'shadow-lg');
            }
        });
    },

    _handlePlayerItemSelection(itemId) {
        const user = getCurrentUser();
        this._playerInventory = this._getPlayerTradableItems(user); 
        
        this._playerSelectedItem = this._playerInventory.find(item => item.id === itemId);
        if (this._playerSelectedItem) {
            this._evaluateBarter();
            this._updateBarterSummary();
            this._performBarterBtn.disabled = false;
        } else {
            this._barterSummaryMessageEl.textContent = "Pilih item yang valid dari inventaris Anda.";
            this._performBarterBtn.disabled = true;
        }
        this._renderPlayerInventory();
    },

    _evaluateBarter() {
        if (!this._playerSelectedItem) {
            this._npcOfferItem = null;
            return;
        }

        const user = getCurrentUser();
        const nomadSkills = SKILL_TREE_DATA['Nomad'] || {};
        let playerItemEffectiveValue = this._playerSelectedItem.value;
        const npcTraits = this._barterNpc.personalityTraits || [];
        const npcHealthState = this._barterNpc.healthState || 'normal';

        if (user.unlockedImprints.includes(nomadSkills.traders_tongue?.id)) {
            playerItemEffectiveValue *= (1 + NOMAD_SKILL_EFFECTS['traders_tongue'].passive.valueBonus);
        }

        if (user.unlockedImprints.includes(nomadSkills.terrain_adaptation?.id) && this._playerSelectedItem.type === 'material') {
            playerItemEffectiveValue *= (1 - NOMAD_SKILL_EFFECTS['terrain_adaptation'].passive.costReduction);
        }

        const npcPrefersPlayerItem = (this._playerSelectedItem.id === this._npcDesiredItem.id);

        if (npcPrefersPlayerItem) {
            const valuableOfferings = [...this._npcOfferings].sort((a,b) => b.value - a.value);
            if (valuableOfferings.length > 0) {
                 this._npcOfferItem = { ...valuableOfferings[0], quantity: 1 };
            } else {
                this._npcOfferItem = null;
            }
           
        } else {
            let potentialOffers = this._npcOfferings.filter(offer => offer.value <= playerItemEffectiveValue * 1.1);

            if (npcTraits.includes('pessimistic')) {
                potentialOffers = potentialOffers.filter(offer => offer.value <= playerItemEffectiveValue * 0.8);
            } else if (npcTraits.includes('gregarious')) {
                potentialOffers = this._npcOfferings.filter(offer => offer.value <= playerItemEffectiveValue * 1.1);
            }

            if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) {
                if (npcPrefersPlayerItem) {
                    potentialOffers = this._npcOfferings;
                } else {
                    potentialOffers = potentialOffers.filter(offer => offer.value <= playerItemEffectiveValue * 1.2);
                }
            } else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) {
                potentialOffers = potentialOffers.filter(offer => offer.value <= playerItemEffectiveValue * 0.6);
            }


            if (potentialOffers.length > 0) {
                this._npcOfferItem = { ...potentialOffers[Math.floor(Math.random() * potentialOffers.length)], quantity: 1 };
            } else {
                this._npcOfferItem = null;
            }
        }
    },

    _updateBarterSummary() {
        if (!this._barterSummaryMessageEl) return;

        if (!this._playerSelectedItem) {
            this._barterSummaryMessageEl.textContent = "Pilih item untuk memulai tawar-menawar.";
            return;
        }

        const user = getCurrentUser();
        const nomadSkills = SKILL_TREE_DATA['Nomad'] || {};

        let summary = `Anda menawarkan ${this._playerSelectedItem.name} (x${this._playerSelectedItem.quantity || 1}).`;

        if (this._npcOfferItem) {
            summary += ` ${this._barterNpc.name} menawarkan ${this._npcOfferItem.name} (x${this._npcOfferItem.quantity || 1}).`;

            let playerValue = this._playerSelectedItem.value;
            let npcValue = this._npcOfferItem.value;

            if (user.unlockedImprints.includes(nomadSkills.traders_tongue?.id)) {
                playerValue *= (1 + NOMAD_SKILL_EFFECTS['traders_tongue'].passive.valueBonus);
            }
            if (user.unlockedImprints.includes(nomadSkills.terrain_adaptation?.id) && this._playerSelectedItem.type === 'material') {
                playerValue *= (1 - NOMAD_SKILL_EFFECTS['terrain_adaptation'].passive.costReduction);
            }

            const difference = npcValue - playerValue;
            let profitability = 'Pertukaran Netral.';
            let textColorClass = 'text-slate-400';

            if (difference > 0.2 * playerValue) {
                profitability = 'Pertukaran Menguntungkan!';
                textColorClass = 'text-emerald-400';
            } else if (difference < -0.2 * playerValue) {
                profitability = 'Pertukaran Tidak Menguntungkan.';
                textColorClass = 'text-red-400';
            }

            summary += ` ${profitability}`;
            this._barterSummaryMessageEl.className = `text-center text-lg mb-8 h-8 ${textColorClass}`;

            if (this._revealedTrade) {
                summary += ` NPC sangat menginginkan ${this._npcDesiredItem.name}.`;
            }

        } else {
            summary += ` ${this._barterNpc.name} tidak memiliki penawaran yang sesuai saat ini.`;
            this._barterSummaryMessageEl.className = 'text-center text-lg mb-8 h-8 text-orange-400';
        }

        this._barterSummaryMessageEl.textContent = summary;
    },

    async _performBarter() {
        if (!this._barterGameActive) return;

        if (!this._playerSelectedItem || !this._npcOfferItem) {
            UIManager.showNotification("Pilih item untuk ditukar dan pastikan NPC memiliki penawaran.", 'alert-triangle', 'error');
            return;
        }

        const user = getCurrentUser();
        const nomadSkills = SKILL_TREE_DATA['Nomad'] || {};

        let isSpecialTrade = false;
        if (user.unlockedImprints.includes(nomadSkills.network_weaving?.id) && this._playerSelectedItem.type === 'information' && this._playerSelectedItem.id.includes('map')) {
            if (user.essenceOfWill >= NOMAD_SKILL_EFFECTS['network_weaving'].active.cost) {
                user.essenceOfWill -= NOMAD_SKILL_EFFECTS['network_weaving'].active.cost;
                isSpecialTrade = true;
            } else {
                UIManager.showNotification("Tidak cukup Esensi Niat untuk Jaringan Dagang ini!", 'alert-triangle', 'error');
                return;
            }
        }

        WorldManager.removeItemFromWandererInventory(user, this._playerSelectedItem.id, 1); // Assuming 1 quantity traded


        WorldManager.addItemToWandererInventory(user, this._npcOfferItem.id, this._npcOfferItem.quantity);

        const npcOfferingIndex = this._npcOfferings.findIndex(item => item.id === this._npcOfferItem.id);
        if (npcOfferingIndex !== -1) {
            this._npcOfferings[npcOfferingIndex].quantity -= 1;
            if (this._npcOfferings[npcOfferingIndex].quantity <= 0) {
                this._npcOfferings.splice(npcOfferingIndex, 1);
            }
        }

        let xpReward = 50;
        let essenceGained = 0;
        let chronicleReflection = '';
        let reputationChange = 3;

        let playerValue = this._playerSelectedItem.value;
        let npcValue = this._npcOfferItem.value;

        if (user.unlockedImprints.includes(nomadSkills.traders_tongue?.id)) {
            playerValue *= (1 + NOMAD_SKILL_EFFECTS['traders_tongue'].passive.valueBonus);
        }
        if (user.unlockedImprints.includes(nomadSkills.terrain_adaptation?.id) && this._playerSelectedItem.type === 'material') {
            playerValue *= (1 - NOMAD_SKILL_EFFECTS['terrain_adaptation'].passive.costReduction);
        }

        const difference = npcValue - playerValue;
        if (difference > 0.2 * playerValue) {
            xpReward += 50;
            essenceGained += 2;
            reputationChange += 2;
            chronicleReflection = `Anda melakukan pertukaran yang sangat menguntungkan dengan ${this._barterNpc.name}!`;
        } else if (difference < -0.2 * playerValue) {
            xpReward = 10;
            essenceGained -= 1;
            reputationChange -= 1;
            chronicleReflection = `Anda melakukan pertukaran yang tidak menguntungkan dengan ${this._barterNpc.name}. Pelajari lebih dalam seni barter.`;
            if (user.unlockedImprints.includes(nomadSkills.bottomless_pouch?.id)) {
                essenceGained = essenceGained * (1 - NOMAD_SKILL_EFFECTS['bottomless_pouch'].passive.capacityBonus);
                essenceGained = Math.round(essenceGained);
                chronicleReflection += " Kantung Tanpa Dasar mengurangi kerugianmu. ";
            }
        } else {
            chronicleReflection = `Anda melakukan pertukaran yang adil dengan ${this._barterNpc.name}.`;
        }

        if (isSpecialTrade) {
            xpReward += 200;
            essenceGained += 5;
            reputationChange += 5;
            chronicleReflection += ` Jaringan Dagang Anda terbuka, mendapatkan keuntungan luar biasa!`;
            UIManager.showNotification("Jaringan Dagang: Perdagangan khusus berhasil!", 'link-2', 'success');
        }

        user.xp += xpReward;
        user.essenceOfWill += essenceGained;
        user.essenceOfWill = Math.max(0, user.essenceOfWill);

        if (this._barterNpc.reputation !== undefined) {
            WorldManager.recordReputationChange(this._barterNpc.id, reputationChange, "barter_trade");
        }
        
        user.chronicle.push({
            id: Date.now(),
            type: 'barter_trade',
            title: `Pertukaran dengan ${this._barterNpc.name}`,
            spoil: `Menukar ${this._playerSelectedItem.name} untuk ${this._npcOfferItem.name}.`,
            description: chronicleReflection,
            timestamp: new Date().toISOString(),
            icon: 'shuffle'
        });

        setCurrentUser(user);
        await saveDBInstance(true);

        UIManager.showNotification(`Pertukaran Selesai! Anda mendapatkan ${this._npcOfferItem.name}!`, 'refresh-cw', 'success');
        this._playerSelectedItem = null;
        this._npcOfferItem = null;
        await this.triggerBarterMiniGame(this._barterNpc);

        if (user.archetype === 'chronicler' && Math.random() < 0.15) {
            await BarterGame._triggerGossipRumor(user, this._barterNpc);
        }
    },

    async _endBarterGame(result) {
        if (!this._barterGameActive && result !== 'aborted' && result !== 'win') return;
        this._barterGameActive = false;
        
        if (this._playerInventoryContainer) {
            this._playerInventoryContainer.onclick = null;
        }

        setTimeout(() => {
            UIManager.hideModal('barter-modal');
            if (WandererPageRenderer) {
                 WandererPageRenderer.renderAllWandererComponents('character');
                 WandererPageRenderer.renderChronicle();
                 WandererPageRenderer.renderInventoryPage();
            }
        }, 100);
    },
};


export const CommissionGame = {
    // Game state variables for Commission
    _commissionNpc: null,
    _commissionGameActive: false,
    _availableRecipes: [],
    _selectedRecipe: null,
    _playerMaterials: [],
    _selectedMaterials: {},
    _commissionCost: 0,
    _decompositionUsed: false,

    // UI elements for Commission
    _modalEl: null, _titleEl: null, _descEl: null, _commissionRecipesContainer: null,
    _requiredMaterialsDisplay: null, _playerMaterialsContainer: null,
    _commissionFeedbackMessageEl: null, _placeCommissionBtn: null, _closeBtn: null,

    setDependencies(db, saveDB, uiM, worldM, wandererPR) {
        dbInstance = db;
        saveDBInstance = saveDB;
        UIManager = uiM;
        WorldManager = worldM;
        WandererPageRenderer = wandererPR;
        if (typeof window !== 'undefined') {
            window.CommissionGame = this;
        }
    },

    _initCommissionUIElements() {
        this._modalEl = document.getElementById('commission-modal');
        this._titleEl = document.getElementById('commission-modal-title');
        this._descEl = document.getElementById('commission-modal-description');
        this._commissionRecipesContainer = document.getElementById('commission-recipes-container');
        this._requiredMaterialsDisplay = document.getElementById('required-materials-display');
        this._playerMaterialsContainer = document.getElementById('player-materials-for-commission');
        this._commissionFeedbackMessageEl = document.getElementById('commission-feedback-message');
        this._placeCommissionBtn = document.getElementById('place-commission-btn');
        this._closeBtn = document.getElementById('commission-close-btn');
    },

    async triggerCommissionMiniGame(npcTarget) {
        const user = getCurrentUser();
        if (user.role !== 'wanderer' || user.archetype !== 'artisan') {
            UIManager.showNotification("Hanya Sang Juru Karya yang dapat Memesan Kerajinan.", 'info', 'info');
            return;
        }

        this._initCommissionUIElements();
        if (!this._modalEl) {
            console.error("Commission modal elements not found.");
            return;
        }

        this._commissionNpc = npcTarget;
        if (!this._commissionNpc.personalityTraits) {
            this._commissionNpc.personalityTraits = [];
        }

        this._availableRecipes = CRAFTABLE_RECIPES_DATA;
        this._playerMaterials = this._getPlayerCraftingMaterials(user);
        this._selectedRecipe = null;
        this._selectedMaterials = {};
        this._decompositionUsed = false;

        this._titleEl.textContent = `Memesan Kerajinan dari ${this._commissionNpc.name}`;
        this._descEl.textContent = `Pilih resep dan sediakan material untuk memesan item unik.`;
        this._commissionFeedbackMessageEl.textContent = "Pilih resep untuk memulai.";

        this._renderCommissionRecipes();
        this._renderPlayerMaterials();
        this._renderRequiredMaterials();

        UIManager.showModal('commission-modal', null, null, false);
        this._placeCommissionBtn.classList.remove('hidden');
        this._closeBtn.classList.remove('hidden');
        this._placeCommissionBtn.disabled = true;

        this._placeCommissionBtn.onclick = () => this._placeCommission();
        this._closeBtn.onclick = () => this._endCommissionGame('aborted');

        this._commissionRecipesContainer.onclick = (e) => {
            const recipeEl = e.target.closest('.commission-recipe-item');
            if (recipeEl) {
                this._handleRecipeSelection(recipeEl.dataset.recipeId);
            }
        };

        this._playerMaterialsContainer.onclick = (e) => {
            const materialEl = e.target.closest('.player-material-item');
            if (materialEl) {
                this._handlePlayerMaterialSelection(materialEl.dataset.materialId);
            }
        };

        const userSkills = user.unlockedImprints;
        const artisanSkills = SKILL_TREE_DATA['Artisan'] || {};
        if (userSkills.includes(artisanSkills.material_analysis?.id)) {
            const optimalRecipe = this._analyzeOptimalRecipe(user.inventory);
            if (optimalRecipe) {
                UIManager.showNotification(`Analisis Material: Resep optimal adalah ${optimalRecipe.name}!`, 'search', 'success');
            }
        }
    },

    _getPlayerCraftingMaterials(user) {
        return (user.inventory || []).map(item => ({
            ...item,
            ...TRADABLE_ITEMS_DATA[item.id]
        })).filter(item => item.type === 'material' || item.type === 'resource'); // Include 'resource' type
    },

    _renderCommissionRecipes() {
        if (!this._commissionRecipesContainer) return;

        const html = this._availableRecipes.map(recipe => {
            const hasAllMaterials = this._checkIfPlayerHasMaterials(recipe);
            const canAffordCost = getCurrentUser().essenceOfWill >= recipe.cost;
            const itemDefinition = TRADABLE_ITEMS_DATA[recipe.output.id] || recipe.output; // Use TRADABLE_ITEMS_DATA for output details

            let recipeClass = 'glass-container p-3 rounded-lg text-center flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700 commission-recipe-item';
            if (this._selectedRecipe?.id === recipe.id) {
                recipeClass += ' border-brand-color border-2 shadow-lg';
            }
            if (!hasAllMaterials || !canAffordCost) {
                recipeClass += ' opacity-50 cursor-not-allowed';
            }

            return `
                <div class="${recipeClass}" data-recipe-id="${recipe.id}">
                    <i data-feather="${itemDefinition.icon}" class="w-8 h-8 text-indigo-400 mb-2"></i>
                    <p class="text-sm text-slate-300 font-semibold">${recipe.name}</p>
                    <p class="text-xs text-slate-500">${recipe.description}</p>
                    ${!hasAllMaterials || !canAffordCost ? '<p class="text-red-400 text-xs mt-2">Material/Biaya Kurang</p>' : ''}
                </div>
            `;
        }).join('');
        UIManager.render(this._commissionRecipesContainer, html);
        feather.replace();
    },

    _checkIfPlayerHasMaterials(recipe) {
        const user = getCurrentUser();
        const artisanSkills = SKILL_TREE_DATA.Artisan || {};
        const materialEfficiencyActive = user.unlockedImprints.includes(artisanSkills.material_efficiency?.id);

        return recipe.materials.every(reqMat => {
            const playerHas = user.inventory.find(invItem => invItem.id === reqMat.id)?.quantity || 0;
            let requiredQuantity = reqMat.quantity;

            if (materialEfficiencyActive) {
                requiredQuantity = Math.ceil(requiredQuantity * (1 - ARTISAN_SKILL_EFFECTS['material_efficiency'].passive.materialCostReduction));
            }
            return playerHas >= requiredQuantity;
        });
    },

    _renderRequiredMaterials() {
        if (!this._requiredMaterialsDisplay) return;

        let html = '<p class="text-slate-500 italic text-sm">Pilih resep untuk melihat material.</p>';
        if (this._selectedRecipe) {
            html = this._selectedRecipe.materials.map(material => {
                const user = getCurrentUser();
                const artisanSkills = SKILL_TREE_DATA.Artisan || {};
                const materialEfficiencyActive = user.unlockedImprints.includes(artisanSkills.material_efficiency?.id);

                const playerHas = user.inventory.find(item => item.id === material.id)?.quantity || 0;
                let requiredQuantity = material.quantity;
                if (materialEfficiencyActive) {
                    requiredQuantity = Math.ceil(requiredQuantity * (1 - ARTISAN_SKILL_EFFECTS['material_efficiency'].passive.materialCostReduction));
                }
                const isFulfilled = playerHas >= requiredQuantity;
                const textColor = isFulfilled ? 'text-emerald-400' : 'text-red-400';
                const itemDefinition = TRADABLE_ITEMS_DATA[material.id] || material; // Use TRADABLE_ITEMS_DATA
                const icon = itemDefinition?.icon || 'help-circle';
                const name = itemDefinition?.name || material.id;

                return `
                    <div class="glass-container p-3 rounded-lg text-center flex flex-col items-center justify-center">
                        <i data-feather="${icon}" class="w-8 h-8 ${textColor} mb-2"></i>
                        <p class="text-sm text-slate-300 font-semibold">${name}</p>
                        <p class="text-xs ${textColor}">Dimiliki: ${playerHas} / Dibutuhkan: ${requiredQuantity}</p>
                    </div>
                `;
            }).join('');

            const userEssence = getCurrentUser().essenceOfWill;
            const hasEnoughEssence = userEssence >= this._selectedRecipe.cost;
            const costTextColor = hasEnoughEssence ? 'text-emerald-400' : 'text-red-400';
            html += `
                <div class="glass-container p-3 rounded-lg text-center flex flex-col items-center justify-center">
                    <i data-feather="hexagon" class="w-8 h-8 text-purple-400 mb-2"></i>
                    <p class="text-sm text-slate-300 font-semibold">Biaya Komisi</p>
                    <p class="text-xs ${costTextColor}">Dimiliki: ${userEssence} / Dibutuhkan: ${this._selectedRecipe.cost} Esensi Niat</p>
                </div>
            `;
        }
        UIManager.render(this._requiredMaterialsDisplay, html);
        feather.replace();
    },

    _renderPlayerMaterials() {
        if (!this._playerMaterialsContainer) return;

        const currentUser = getCurrentUser();
        this._playerMaterials = this._getPlayerCraftingMaterials(currentUser);

        const html = this._playerMaterials.map(item => {
            const isRequiredForRecipe = this._selectedRecipe?.materials.some(mat => mat.id === item.id);
            const highlightClass = (isRequiredForRecipe && item.quantity > 0) ? 'border-brand-color border-2 shadow-lg' : '';

            return `
                <div class="glass-container p-3 rounded-lg text-center flex flex-col items-center justify-center player-material-item ${highlightClass}"
                    data-material-id="${item.id}" data-material-quantity="${item.quantity}">
                    <i data-feather="${item.icon}" class="w-8 h-8 text-yellow-400 mb-2"></i>
                    <p class="text-sm text-slate-300 font-semibold">${item.name}</p>
                    <p class="text-xs text-slate-500">Jumlah: ${item.quantity}</p>
                </div>
            `;
        }).join('');
        UIManager.render(this._playerMaterialsContainer, html);
        feather.replace();
    },

    _handleRecipeSelection(recipeId) {
        this._selectedRecipe = this._availableRecipes.find(r => r.id === recipeId);
        this._renderCommissionRecipes();
        this._renderRequiredMaterials();
        this._renderPlayerMaterials();
        this._updateCommissionFeedback();
        this._placeCommissionBtn.disabled = !this._checkMaterialsAndCost(); // Ensure button state is correct
    },

    _handlePlayerMaterialSelection(materialId) {
        UIManager.showNotification(`Anda memiliki ${this._playerMaterials.find(m => m.id === materialId)?.quantity || 0}x ${TRADABLE_ITEMS_DATA[materialId]?.name || materialId}.`, 'info', 'info');
    },

    _checkMaterialsAndCost() {
        if (!this._selectedRecipe) {
            this._placeCommissionBtn.disabled = true;
            return false;
        }

        const user = getCurrentUser();
        const artisanSkills = SKILL_TREE_DATA.Artisan || {};
        const materialEfficiencyActive = user.unlockedImprints.includes(artisanSkills.material_efficiency?.id);

        let allMaterialsPresent = true;
        this._selectedRecipe.materials.forEach(required => {
            const playerHas = user.inventory.find(item => item.id === required.id)?.quantity || 0;
            let requiredQuantity = required.quantity;
            if (materialEfficiencyActive) {
                requiredQuantity = Math.ceil(requiredQuantity * (1 - ARTISAN_SKILL_EFFECTS['material_efficiency'].passive.materialCostReduction));
            }
            if (playerHas < requiredQuantity) {
                allMaterialsPresent = false;
            }
        });

        let finalCommissionCost = this._selectedRecipe.cost;
        const npcTraits = this._commissionNpc.personalityTraits || [];
        const npcHealthState = this._commissionNpc.healthState || 'normal';
        if (npcTraits.includes('cautious')) finalCommissionCost *= 1.1;
        else if (npcTraits.includes('gregarious')) finalCommissionCost *= 0.9;
        if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) finalCommissionCost *= 1.05;
        else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) finalCommissionCost *= 1.2;

        const hasEnoughEssence = user.essenceOfWill >= finalCommissionCost;

        const canCraft = allMaterialsPresent && hasEnoughEssence;

        if (canCraft) {
            this._commissionFeedbackMessageEl.textContent = "Material Lengkap & Biaya Cukup! Siap Memesan.";
            this._commissionFeedbackMessageEl.className = 'text-center text-lg text-emerald-400 mb-8 h-8';
            this._placeCommissionBtn.disabled = false;
        } else {
            this._commissionFeedbackMessageEl.textContent = "Material Kurang atau Esensi Niat Tidak Cukup.";
            this._commissionFeedbackMessageEl.className = 'text-center text-lg text-red-400 mb-8 h-8';
            this._placeCommissionBtn.disabled = true;
        }
        return canCraft;
    },

    _updateCommissionFeedback() {
        this._checkMaterialsAndCost();
    },

    async _placeCommission() {
        if (!this._commissionGameActive) return;

        if (!this._selectedRecipe || !this._checkMaterialsAndCost()) {
            UIManager.showNotification("Harap pilih resep dan sediakan semua material yang dibutuhkan.", 'alert-triangle', 'error');
            return;
        }

        const user = getCurrentUser();
        const artisanSkills = SKILL_TREE_DATA.Artisan || {};

        let guaranteedSuccess = false;
        let finalCommissionCost = this._selectedRecipe.cost;
        const npcTraits = this._commissionNpc.personalityTraits || [];
        const npcHealthState = this._commissionNpc.healthState || 'normal';
        if (npcTraits.includes('cautious')) finalCommissionCost *= 1.1;
        else if (npcTraits.includes('gregarious')) finalCommissionCost *= 0.9;
        if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) finalCommissionCost *= 1.05;
        else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) finalCommissionCost *= 1.2;

        if (user.unlockedImprints.includes(artisanSkills.perfect_resonance?.id)) {
            if (user.essenceOfWill >= artisanSkills.perfect_resonance.cost) {
                user.essenceOfWill -= artisanSkills.perfect_resonance.cost;
                guaranteedSuccess = true;
                UIManager.showNotification("Resonansi Sempurna: Kerajinan dijamin berhasil!", 'award', 'success');
            } else {
                UIManager.showNotification("Tidak cukup Esensi Niat untuk Resonansi Sempurna!", 'alert-triangle', 'error');
            }
        }

        user.essenceOfWill -= finalCommissionCost;

        this._selectedRecipe.materials.forEach(required => {
            let actualQuantityNeeded = required.quantity;
            if (user.unlockedImprints.includes(artisanSkills.material_efficiency?.id)) {
                actualQuantityNeeded = Math.ceil(actualQuantityNeeded * (1 - ARTISAN_SKILL_EFFECTS['material_efficiency'].passive.materialCostReduction));
            }
            WorldManager.removeItemFromWandererInventory(user, required.id, actualQuantityNeeded);
        });

        let successChance = this._selectedRecipe.baseSuccessChance;
        const userFocus = user.attributes.find(a => a.name === 'Focus').value;
        const userStamina = user.attributes.find(a => a.name === 'Stamina').value;
        successChance += (userFocus * 0.01) + (userStamina * 0.005);

        if (user.unlockedImprints.includes(artisanSkills.swift_forging?.id)) {
            successChance += ARTISAN_SKILL_EFFECTS['swift_forging'].passive.speedBonus;
        }

        if (npcTraits.includes('optimistic')) successChance += 0.05;
        else if (npcTraits.includes('pessimistic')) successChance -= 0.05;
        if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) successChance -= 0.10;
        else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) successChance -= 0.20;


        const success = guaranteedSuccess || Math.random() < successChance;

        let xpReward = 0;
        let essenceGained = 0;
        let chronicleReflection = '';
        let reputationChange = 0;

        if (success) {
            xpReward = 100 + (this._selectedRecipe.output.value / 2);
            essenceGained = 1;
            reputationChange = 5;
            chronicleReflection = `Anda berhasil memesan ${this._selectedRecipe.output.name} dari ${this._commissionNpc.name}!`;
            UIManager.showNotification(`Pemesanan Berhasil! Anda mendapatkan ${this._selectedRecipe.output.name}!`, 'check-circle', 'success');

            WorldManager.addItemToWandererInventory(user, this._selectedRecipe.output.id, 1);
            
        } else {
            xpReward = 20;
            essenceGained = -2;
            reputationChange = -2;
            chronicleReflection = `Pemesanan ${this._selectedRecipe.output.name} gagal. Material mungkin hilang.`;
            UIManager.showNotification(`Pemesanan Gagal. Material hilang.`, 'x-circle', 'error');

            if (user.unlockedImprints.includes(artisanSkills.decomposition?.id) && !this._decompositionUsed) {
                this._decompositionUsed = true;
                this._selectedRecipe.materials.forEach(required => {
                    const materialToRestoreQuantity = Math.ceil(required.quantity * ARTISAN_SKILL_EFFECTS['decomposition'].active.restoreMaterials);
                    WorldManager.addItemToWandererInventory(user, required.id, materialToRestoreQuantity);
                });
                chronicleReflection += ` Dekomposisi memulihkan sebagian materialmu!`;
                UIManager.showNotification("Dekomposisi: Sebagian material dipulihkan!", 'refresh-ccw', 'info');
            }
        }

        user.xp += xpReward;
        user.essenceOfWill += essenceGained;
        user.essenceOfWill = Math.max(0, user.essenceOfWill);

        if (this._commissionNpc.reputation !== undefined) {
            WorldManager.recordReputationChange(this._commissionNpc.id, reputationChange, "commission_craft");
        }
        
        user.chronicle.push({
            id: Date.now(),
            type: 'commission_craft',
            title: `Pemesanan ${this._selectedRecipe.output.name} dari ${this._commissionNpc.name}`,
            spoil: `Hasil: ${success ? 'Berhasil' : 'Gagal'}.`,
            description: chronicleReflection,
            timestamp: new Date().toISOString(),
            icon: 'hammer'
        });

        setCurrentUser(user);
        await saveDBInstance(true);

        this._selectedRecipe = null;
        await this.triggerCommissionMiniGame(this._commissionNpc);

        if (user.archetype === 'chronicler' && Math.random() < 0.15) {
            await CommissionGame._triggerGossipRumor(user, this._commissionNpc);
        }
    },

    async _endCommissionGame(result) {
        if (!this._commissionGameActive && result !== 'aborted') return;
        this._commissionGameActive = false;
        
        if (this._commissionRecipesContainer) {
            this._commissionRecipesContainer.onclick = null;
        }
        if (this._playerMaterialsContainer) {
            this._playerMaterialsContainer.onclick = null;
        }

        setTimeout(() => {
            UIManager.hideModal('commission-modal');
            if (WandererPageRenderer) {
                 WandererPageRenderer.renderAllWandererComponents('character');
                 WandererPageRenderer.renderChronicle();
                 WandererPageRenderer.renderInventoryPage();
            }
        }, 100);
    },

    _analyzeOptimalRecipe(playerInventory) {
        let bestRecipe = null;
        let highestChance = -1;

        this._availableRecipes.forEach(recipe => {
            let playerCanCraft = true;
            let currentRecipeSuccessChance = recipe.baseSuccessChance;

            recipe.materials.forEach(required => {
                const playerHas = playerInventory.find(item => item.id === required.id)?.quantity || 0;
                if (playerHas < required.quantity) {
                    playerCanCraft = false;
                }
            });

            if (!playerCanCraft) {
                return;
            }

            const user = getCurrentUser();
            const artisanSkills = SKILL_TREE_DATA.Artisan || {};
            if (user.unlockedImprints.includes(artisanSkills.swift_forging?.id)) {
                currentRecipeSuccessChance += ARTISAN_SKILL_EFFECTS['swift_forging'].passive.speedBonus;
            }

            const npcTraits = this._commissionNpc.personalityTraits || [];
            const npcHealthState = this._commissionNpc.healthState || 'normal';

            if (npcTraits.includes('optimistic')) currentRecipeSuccessChance += 0.05;
            else if (npcTraits.includes('pessimistic')) currentRecipeSuccessChance -= 0.05;
            if (npcHealthState === NPC_HEALTH_STATES.FRAIL.id) currentRecipeSuccessChance -= 0.10;
            else if (npcHealthState === NPC_HEALTH_STATES.CORRUPTED.id) currentRecipeSuccessChance -= 0.20;


            if (currentRecipeSuccessChance > highestChance) {
                highestChance = currentRecipeSuccessChance;
                bestRecipe = recipe;
            }
        });

        return bestRecipe;
    }
};

// New function for Chronicler's 'Gossip & Rumor'
InterrogateGame._triggerGossipRumor = async (user, npc) => {
    const npcTraits = npc.personalityTraits || [];
    const hasTriggerTrait = npcTraits.includes('curious') || npcTraits.includes('pessimistic');
    
    if (user.archetype === 'chronicler' && hasTriggerTrait) {
        const rumorType = npcTraits.includes('curious') ? 'curious' : 'pessimistic';
        const potentialRumors = RUMOR_DATA[rumorType];
        if (potentialRumors && potentialRumors.length > 0) {
            const chosenRumor = potentialRumors[Math.floor(Math.random() * potentialRumors.length)];
            user.chronicle.push({
                id: Date.now() + Math.random(),
                type: 'gossip_rumor',
                title: `Gaya & Rumor: ${chosenRumor.title}`,
                spoil: chosenRumor.text,
                description: `Melalui interaksi dengan ${npc.name}, Anda menangkap bisikan: "${chosenRumor.text}".`,
                timestamp: new Date().toISOString(),
                icon: 'message-square'
            });
            UIManager.showNotification(`Anda menemukan gosip/rumor: ${chosenRumor.title}!`, 'message-square', 'info'); // Changed type to 'info'
            setCurrentUser(user);
            await saveDBInstance(true); // Save current user state
            if (WandererPageRenderer) {
                WandererPageRenderer.renderChronicle();
            }
        }
    }
};

// Assign _triggerGossipRumor to other mini-games
ChallengeGame._triggerGossipRumor = InterrogateGame._triggerGossipRumor;
InspireGame._triggerGossipRumor = InterrogateGame._triggerGossipRumor;
BarterGame._triggerGossipRumor = InterrogateGame._triggerGossipRumor;
CommissionGame._triggerGossipRumor = InterrogateGame._triggerGossipRumor;

// Add a generic Scrutinize/Investigate action for Chronicler
export const ScrutinizeAction = {
    setDependencies(db, saveDB, uiM, worldM, wandererPR) {
        dbInstance = db;
        saveDBInstance = saveDB;
        UIManager = uiM;
        WorldManager = worldM;
        WandererPageRenderer = wandererPR;
    },
    async triggerScrutinizeMiniGame(npcTarget) {
        const user = getCurrentUser();
        if (user.role !== 'wanderer' || user.archetype !== 'chronicler') {
            UIManager.showNotification("Hanya Sang Juru Kronik yang dapat Menyelidiki.", 'info', 'info');
            return;
        }

        if (!npcTarget) {
            UIManager.showNotification("Tidak ada NPC untuk diselidiki saat ini.", 'info', 'info');
            return;
        }

        UIManager.showLoading(`Menyelidiki ${npcTarget.name}...`);

        let successChance = 0.6;
        if (npcTarget.personalityTraits && npcTarget.personalityTraits.includes('stoic')) {
            successChance -= 0.2;
        } else if (npcTarget.personalityTraits && npcTarget.personalityTraits.includes('gregarious')) {
            successChance += 0.1;
        }

        let xpReward = 50;
        let essenceGain = 1;
        let chronicleReflection = '';

        if (Math.random() < successChance) {
            xpReward = 100;
            essenceGain = 3;
            chronicleReflection = `Anda berhasil mengamati ${npcTarget.name} dan mendapatkan wawasan.`;
            UIManager.showNotification(`Menyelidiki berhasil! (+${xpReward} XP)`, 'check-circle', 'success');
            await InterrogateGame._triggerGossipRumor(user, npcTarget);
        } else {
            xpReward = 20;
            essenceGain = 0;
            chronicleReflection = `Upaya menyelidiki ${npcTarget.name} tidak membuahkan hasil.`;
            UIManager.showNotification(`Menyelidiki gagal.`, 'x-circle', 'error');
        }

        user.xp += xpReward;
        user.essenceOfWill += essenceGain;
        user.chronicle.push({
            id: Date.now(),
            type: 'scrutiny_session',
            title: `Menyelidiki ${npcTarget.name}`,
            spoil: chronicleReflection,
            description: chronicleReflection, // Use description for chronicle
            timestamp: new Date().toISOString(),
            icon: 'book'
        });

        setCurrentUser(user);
        await saveDBInstance(true);
        UIManager.hideLoading();
        if (WandererPageRenderer) {
            WandererPageRenderer.renderAllWandererComponents('character');
            WandererPageRenderer.renderChronicle();
        }
    }
};
