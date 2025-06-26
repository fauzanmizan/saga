// js/data/dialogues.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-27, 12:40 WITA ==
// == PERIHAL: Refactoring GameData.js - Pemindahan Data Dialog ke dialogues.js ==
// - Menampung semua data statis terkait dialog NPC, rumor, respons event, fate decisions, dll.
// ===========================================

/**
 * @typedef {object} DialogueChoiceConsequence
 * @property {number} [reputationDelta] - Perubahan reputasi NPC terhadap Wanderer.
 * @property {number} [echoChange] - Perubahan Echo Wanderer.
 * @property {number} [intentionChange] - Perubahan Intention Wanderer.
 * @property {string} [nextDialogueId] - ID dialog berikutnya jika pilihan ini mengarah ke percabangan.
 * @property {string | Function} [triggerQuestId] - ID quest yang akan dipicu (placeholder). Bisa berupa string atau fungsi yang mengembalikan string.
 * @property {boolean} [endsDialogue] - True jika pilihan ini mengakhiri dialog.
 * @property {object} [itemReward] - Item yang didapatkan Wanderer. { itemId: string, quantity: number }
 * @property {string | Function} [chronicleEntry] - Teks entri Chronicle yang unik untuk pilihan ini. Bisa berupa string atau fungsi yang mengembalikan string.
 * @property {object} [setNpcState] - Mengubah properti spesifik NPC. Contoh: { isScared: true, knowsSecret: 'EchoChamber' }
 * @property {object} [setWandererState] - Mengubah properti spesifik Wanderer. Contoh: { hasLearnedSpell: 'MinorHeal' }
 * @property {object} [triggerWorldEvent] - Memicu event dunia global. Contoh: { eventId: 'MarauderRaid', region: 'nearby' }
 * @property {string} [triggerMiniGame] - Memicu mini-game tertentu (e.g., 'BarterGame', 'InterrogationGame', 'CommissionGame').
 * @property {string} [triggerJournalEntry] - ID entri jurnal yang akan dipicu.
 */

/**
 * @typedef {object} DialogueChoiceConditions
 * @property {number} [minReputation] - Reputasi minimum Wanderer untuk melihat pilihan ini.
 * @property {number} [maxReputation] - Reputasi maksimum Wanderer untuk melihat pilihan ini.
 * @property {string} [requiredNpcTrait] - NPC harus memiliki trait ini.
 * @property {string} [forbiddenNpcTrait] - NPC tidak boleh memiliki trait ini.
 * @property {string} [requiredNpcHealthState] - NPC harus dalam healthState ini.
 * @property {string} [forbiddenNpcHealthState] - NPC tidak boleh dalam healthState ini.
 * @property {string} [requiredWandererTrait] - Wanderer harus memiliki trait ini.
 * @property {string} [forbiddenWandererTrait] - Wanderer tidak boleh memiliki trait ini.
 * @property {string} [requiredItem] - Wanderer harus memiliki item ini di inventarisnya.
 * @property {object} [isQuestActive] - Jika quest dengan ID tertentu aktif. { questId: string, status: boolean }
 * @property {object} [hasNpcState] - Jika NPC memiliki state tertentu. { stateKey: string, stateValue: any }
 * @property {boolean} [isDayTime] - Jika waktu saat ini siang hari (true) atau malam (false).
 * @property {string} [nexusStateIs] - Jika Nexus State wilayah adalah X (MAELSTROM, SANCTUM, NORMAL, UNSTABLE).
 * @property {number} [playerEchoLevelMin] - Level Echo Wanderer minimum.
 * @property {number} [playerIntentionLevelMin] - Level Intention Wanderer minimum.
 * @property {number} [playerLevelMin] - Level Wanderer minimum.
 * @property {boolean} [isNpcMerchant] - Jika NPC adalah pedagang.
 * @property {boolean} [isNpcCrafter] - Jika NPC adalah pengrajin.
 * @property {object} [hasDiscoveredLandmark] - Jika Wanderer telah menemukan landmark tertentu. { landmarkId: string }
 * @property {object} [factionReputationMin] - Reputasi minimum dengan faksi tertentu. { factionId: string, minRep: number }
 */

/**
 * @typedef {object} DialogueChoice
 * @property {string} text - Teks pilihan yang akan ditampilkan kepada Wanderer.
 * @property {DialogueChoiceConsequence} consequence - Objek yang mendefinisikan dampak pilihan.
 * @property {DialogueChoiceConditions} [conditions] - Objek kondisi untuk menampilkan pilihan ini.
 */

/**
 * @typedef {object} DialogueNode
 * @property {string} id - ID unik untuk dialog ini.
 * @property {string | Function} text - Teks dialog yang diucapkan NPC. Bisa berupa string atau fungsi yang mengembalikan string. Fungsi ini menerima (npc, wanderer, world, currentDialogueState) sebagai argumen.
 * @property {DialogueChoice[]} choices - Sebuah array pilihan yang tersedia untuk Wanderer.
 * @property {DialogueChoiceConditions} [conditions] - Objek kondisi untuk memilih dialog ini sebagai dialog awal.
 * @property {string} [defaultNextDialogueId] - ID dialog berikutnya jika tidak ada pilihan spesifik yang mengarah ke dialog lain.
 * @property {number} [priority] - Prioritas untuk pemilihan dialog awal (lebih tinggi = lebih mungkin dipilih).
 */

/**
 * @typedef {Object.<string, DialogueNode>} NpcDialogueMap - Peta dari ID dialog ke DialogueNode.
 */
export const NPC_DIALOGUES = {
    // --- Dialog Pemicu Awal (berdasarkan Konteks) ---
    "intro_greeting_by_reputation": {
        id: "intro_greeting_by_reputation",
        text: (npc, wanderer, world) => {
            // Asumsi NPC_REPUTATION_LEVELS, REGIONS_DATA ada di lingkup import atau di-pass
            // atau dari file data terpisah
            // Untuk saat ini, asumsikan ketersediaan NPC_REPUTATION_LEVELS dan REGIONS_DATA dari import.
            const NPC_REPUTATION_LEVELS_MOCK = [ // Mock jika belum tersedia dari import
                { threshold: 75, name: 'Close Ally' },
                { threshold: 30, name: 'Very Friendly' },
                { threshold: -29, name: 'Neutral' },
                { threshold: -75, name: 'Untrustworthy' },
                { threshold: -100, name: 'Utterly Hunted' }
            ];
            const NPC_REPUTATION_LEVELS_DATA = globalThis.NPC_REPUTATION_LEVELS || NPC_REPUTATION_LEVELS_MOCK; // Menggunakan globalThis atau mock
            const rep = wanderer.reputation[npc.id] || 0;
            const npcRepLevel = NPC_REPUTATION_LEVELS_DATA.find(level => rep >= level.threshold) || NPC_REPUTATION_LEVELS_DATA[2]; // Default to Neutral if not found

            if (npcRepLevel.threshold >= 75) return `Ah, pahlawan ${wanderer.name}! Selalu senang melihat Anda. Ada apa gerangan?`;
            if (npcRepLevel.threshold >= 30) return `Halo, ${wanderer.name}. Senang bertemu Anda. Apa yang membawa Anda ke sini?`;
            if (npcRepLevel.threshold >= -29) return `Salam, Wanderer. Ada urusan?`;
            if (npcRepLevel.threshold >= -75) return `Apa yang kau inginkan? Jangan mendekat.`;
            return `PERGI! Aku tidak sudi bicara denganmu, pengganggu!`;
        },
        choices: [
            {
                text: "Tanyakan tentang kondisi wilayah.",
                consequence: { nextDialogueId: "region_status_dynamic" }
            },
            {
                text: "Tawarkan bantuan.",
                consequence: { nextDialogueId: "offer_help_dynamic", reputationDelta: 3 }
            },
            {
                text: "Ancam NPC.",
                consequence: { reputationDelta: -15, echoChange: 5, endsDialogue: true },
                conditions: { minReputation: -50 }
            },
            {
                text: "Saya ingin berdagang.",
                consequence: { triggerMiniGame: "BarterGame", endsDialogue: true },
                conditions: { isNpcMerchant: true, minReputation: 0 }
            },
            {
                text: "Saya ingin memesan sesuatu.",
                consequence: { triggerMiniGame: "CommissionGame", endsDialogue: true },
                conditions: { isNpcCrafter: true, minReputation: 0 }
            }
        ],
        priority: 10
    },

    // --- Dialog yang Bereaksi terhadap Status Dunia/NPC ---
    "region_status_dynamic": {
        id: "region_status_dynamic",
        text: (npc, wanderer, world) => {
            // Asumsi NEXUS_STATES dan REGIONS_DATA ada di lingkup import atau di-pass
            // atau dari file data terpisah
            const NEXUS_STATES_MOCK = { // Mock jika belum tersedia dari import
                MAELSTROM: { id: 'maelstrom' },
                SANCTUM: { id: 'sanctum' },
                UNSTABLE: { id: 'unstable' }
            };
            const NEXUS_STATES_DATA = globalThis.NEXUS_STATES || NEXUS_STATES_MOCK;

            const region = world.regions[npc.currentRegion];
            let status = `Desa kami baik-baik saja, sejauh ini.`;
            if (region.initialNexusState === NEXUS_STATES_DATA.MAELSTROM.id || (region.currentEcho && region.currentEcho > 60)) {
                status = `Gema semakin kuat di sini, Wanderer. Kami hidup dalam ketakutan. Beberapa warga sudah... berubah.`;
                // Example of dynamically fetching info (WorldManager.getRecentCorruptedNpcName needs to exist)
                // status += ` Aku dengar ${WorldManager.getRecentCorruptedNpcName(npc.currentRegion) || 'seseorang'} baru saja menyerah pada kegelapan.`;
            } else if (region.initialNexusState === NEXUS_STATES_DATA.SANCTUM.id || (region.currentIntention && region.currentIntention > 60)) {
                status = `Syukurlah, berkat Cahaya, wilayah kami semakin pulih. Udara terasa lebih ringan.`;
                status += ` Lihatlah, bunga-bunga mistis bermekaran di tepi sungai!`;
            } else if (region.initialNexusState === NEXUS_STATES_DATA.UNSTABLE.id) {
                status = `Ada ketegangan di udara, seolah dunia itu sendiri berbisik. Kita harus tetap waspada.`;
            }
            return status + ` Apa yang bisa kuceritakan lagi?`;
        },
        choices: [
            { text: "Tanyakan tentang Gema.", consequence: { nextDialogueId: "echo_discussion" }, conditions: { nexusStateIs: 'MAELSTROM' } },
            { text: "Tanyakan tentang Cahaya.", consequence: { nextDialogueId: "sanctum_discussion" }, conditions: { nexusStateIs: 'SANCTUM' } },
            { text: "Adakah misi untukku?", consequence: { nextDialogueId: "ask_for_quest_dynamic" } },
            { text: "Terima kasih, itu saja.", consequence: { endsDialogue: true } }
        ]
    },

    // --- Dynamic Quest Dialogue based on Reputation ---
    "ask_for_quest_dynamic": {
        id: "ask_for_quest_dynamic",
        text: (npc, wanderer, world) => {
            const rep = wanderer.reputation[npc.id] || 0;
            if (rep >= 45) {
                return "Tentu saja! Kami selalu butuh bantuan. Ada masalah serigala di hutan, atau mungkin kau bisa mengantar pasokan ke desa tetangga?";
            } else if (rep >= 0) {
                return "Pekerjaan? Mungkin ada. Para pengumpul kami kesulitan mencari jamur tertentu di rawa. Kamu tertarik?";
            } else {
                return "Aku tidak punya urusan denganmu. Carilah masalahmu sendiri.";
            }
        },
        choices: [
            {
                text: "Aku akan membantu masalah serigala.",
                consequence: {
                    reputationDelta: 10,
                    triggerQuestId: "hunt_creature_basic",
                    endsDialogue: true,
                    chronicleEntry: (npc, choiceData) => `${npc.name} memberikanmu misi perburuan serigala.`
                },
                conditions: { minReputation: 45 }
            },
            {
                text: "Aku bisa mencari jamur di rawa.",
                consequence: {
                    reputationDelta: 5,
                    triggerQuestId: "fetch_item_basic",
                    endsDialogue: true,
                    chronicleEntry: (npc, choiceData) => `${npc.name} meminta tolong mencari jamur langka.`
                },
                conditions: { minReputation: 0 }
            },
            {
                text: "Mungkin lain kali.",
                consequence: { endsDialogue: true, reputationDelta: -2 },
                conditions: { maxReputation: 44 }
            },
            {
                text: "Aku tidak tertarik dengan pekerjaan kotor.",
                consequence: { reputationDelta: -5, endsDialogue: true },
                conditions: { minReputation: 0, maxReputation: 44 }
            }
        ]
    },

    // --- Dialog yang Disesuaikan oleh HealthState NPC ---
    "npc_corrupted_dialogue_layered": {
        id: "npc_corrupted_dialogue_layered",
        text: (npc, wanderer) => {
            // Asumsi NPC_HEALTH_STATES ada di lingkup import atau di-pass
            const NPC_HEALTH_STATES_MOCK = { // Mock jika belum tersedia dari import
                CORRUPTED: { id: 'corrupted' }
            };
            const NPC_HEALTH_STATES_DATA = globalThis.NPC_HEALTH_STATES || NPC_HEALTH_STATES_MOCK;

            let baseText = "Ugh... Gema... tak pernah berhenti berbisik...";
            if (npc.currentHealth < 20) {
                baseText += ` Nafasnya... semakin berat.`;
            }
            if (wanderer.alignment.echo > 70) {
                baseText += ` Aku merasakan Gema yang kuat dalam dirimu... kita... sama.`;
            } else if (wanderer.alignment.intention > 70) {
                baseText += ` Cahayamu... menyilaukan... Menjauhlah!`;
            }
            return baseText;
        },
        choices: [
            {
                text: "Apa yang Gema inginkan?",
                consequence: { echoChange: 10, nextDialogueId: "corrupted_despair_echo" }
            },
            {
                text: "Aku bisa membantumu.",
                consequence: {
                    intentionChange: 5,
                    reputationDelta: 10,
                    nextDialogueId: "offer_cure_corrupted"
                },
                conditions: { requiredItem: 'purification_salve', playerIntentionLevelMin: 50 }
            },
            {
                text: "Ini menyedihkan. Aku akan mengakhiri penderitaanmu.",
                consequence: {
                    endsDialogue: true,
                    chronicleEntry: (npc, choiceData) => `${npc.name} yang korup mencoba kau bunuh. Sebuah pilihan yang sulit.`
                },
                conditions: { playerIntentionLevelMin: 30 }
            }
        ],
        conditions: { requiredNpcHealthState: 'corrupted' },
        priority: 100
    },

    // --- Dialog dengan Pilihan yang Membutuhkan Item/Skill ---
    "healing_dialogue": {
        id: "healing_dialogue",
        text: (npc) => {
            // Asumsi NPC_HEALTH_STATES ada di lingkup import atau di-pass
            const NPC_HEALTH_STATES_MOCK = { // Mock jika belum tersedia dari import
                FRAIL: { id: 'frail' },
                CORRUPTED: { id: 'corrupted' }
            };
            const NPC_HEALTH_STATES_DATA = globalThis.NPC_HEALTH_STATES || NPC_HEALTH_STATES_MOCK;

            if (npc.healthState === NPC_HEALTH_STATES_DATA.FRAIL.id || npc.healthState === NPC_HEALTH_STATES_DATA.CORRUPTED.id) {
                return `Oh, aku merasa sangat lemah... bisakah kau... bantu?`;
            }
            return `Kesehatanku baik, terima kasih.`;
        },
        choices: [
            {
                text: "Gunakan Salve Penyembuh.",
                consequence: {
                    reputationDelta: 20,
                    nextDialogueId: "healing_success",
                    setNpcState: { healthState: 'normal', currentHealth: 80 }
                },
                conditions: { requiredItem: 'healing_salve', requiredNpcHealthState: 'frail' }
            },
            {
                text: "Coba tenangkan pikirannya dengan cerita.",
                consequence: {
                    reputationDelta: 10,
                    echoChange: -5,
                    nextDialogueId: "calming_attempt"
                },
                conditions: { requiredWandererTrait: 'empath', requiredNpcHealthState: 'corrupted' }
            },
            {
                text: "Aku tidak bisa berbuat apa-apa.",
                consequence: { endsDialogue: true, reputationDelta: -5 }
            }
        ],
        conditions: { or: [{ hasNpcState: { healthState: 'frail' } }, { hasNpcState: { healthState: 'corrupted' } }] }
    },

    // --- Contoh Dialog yang Memutar Balik atau Berulang ---
    "begging_for_help": {
        id: "begging_for_help",
        text: (npc, wanderer, world, currentDialogueState) => {
            const childName = currentDialogueState.childName || "Anakku";
            const dangerousArea = currentDialogueState.dangerousArea || "hutan utara";
            return `Tolong, Wanderer! ${childName} hilang di ${dangerousArea}! Aku sangat khawatir! Maukah kau mencarinya?`;
        },
        choices: [
            {
                text: "Aku akan mencari anakmu.",
                consequence: {
                    triggerQuestId: "find_lost_child",
                    reputationDelta: 25,
                    setNpcState: { isDistraught: false, hasGivenQuest: true },
                    endsDialogue: true
                }
            },
            {
                text: "Aku tidak bisa membantumu sekarang.",
                consequence: {
                    reputationDelta: -10,
                    nextDialogueId: "begging_for_help"
                }
            }
        ],
        conditions: { hasNpcState: { isDistraught: true, hasGivenQuest: false } }
    },
    "corrupted_despair_echo": {
        id: "corrupted_despair_echo",
        text: "Ia menginginkan... segalanya. Segalanya akan menyatu dalam kehampaan yang indah... Jangan melawan... itu sia-sia...",
        choices: [
            {
                text: "Apa yang Gema inginkan?",
                consequence: {
                    echoChange: 10,
                    nextDialogueId: "corrupted_weakness_hint"
                }
            },
            {
                text: "Aku tak tahan lagi, aku harus pergi.",
                consequence: {
                    endsDialogue: true
                }
            }
        ]
    },
    "corrupted_weakness_hint": {
        id: "corrupted_weakness_hint",
        text: "Untuk menghentikannya... butuh Cahaya... Cahaya yang murni... Ugh... Jangan percaya bisikan itu... (NPC terbatuk darah Gema)",
        choices: [
            {
                text: "Terima kasih atas informasinya.",
                consequence: {
                    endsDialogue: true,
                    reputationDelta: 5,
                    chronicleEntry: (npc, choiceData) => `${npc.name} yang terkontaminasi memberimu petunjuk tentang kelemahan Gema.`
                }
            }
        ]
    },
    "village_status_good": {
        id: "village_status_good",
        text: "Desa kami baik-baik saja, berkat kerja keras semua orang. Beberapa hari lalu kami menemukan gua baru!",
        choices: [
            {
                text: "Ceritakan lebih banyak tentang gua itu.",
                consequence: {
                    reputationDelta: 3,
                    nextDialogueId: "cave_details"
                }
            },
            {
                text: "Baguslah kalau begitu. Sampai jumpa.",
                consequence: { endsDialogue: true }
            }
        ]
    },
    "cave_details": {
        id: "cave_details",
        text: "Gua itu... ada sesuatu yang aneh di dalamnya. Kami mendengar bisikan dari sana. Ada yang bilang itu Gema...",
        choices: [
            {
                text: "Apa yang bisa kulakukan?",
                consequence: {
                    reputationDelta: 5,
                    nextDialogueId: "offer_help_echo_cave",
                    echoChange: -1
                }
            },
            {
                text: "Aku tidak mau terlibat dengan Gema.",
                consequence: { endsDialogue: true }
            }
        ]
    },
    "offer_help_echo_cave": {
        id: "offer_help_echo_cave",
        text: "Jika kamu bersedia membantu, carilah batu aneh di dalam gua. Konon, itu menenangkan Gema.",
        choices: [
            {
                text: "Aku akan mencari batu itu.",
                consequence: {
                    reputationDelta: 15,
                    triggerQuestId: "fetch_rare_item",
                    endsDialogue: true,
                    chronicleEntry: (npc, choiceData) => `${npc.name} memintamu untuk mencari batu penenang Gema di gua misterius.`
                }
            }
        ]
    },
    "echo_discussion": {
        id: "echo_discussion",
        text: "Gema... itu adalah bisikan dari kehampaan. Ia merangkak ke dalam jiwa dan mengubah mereka. Sulit melawannya...",
        choices: [
            { text: "Bagaimana melindungiku dari Gema?", consequence: { nextDialogueId: "echo_protection_hint" } },
            { text: "Apakah ada yang bisa kuperbuat untuk menenangkannya?", consequence: { nextDialogueId: "echo_healing_hint" } },
            { text: "Aku harus pergi.", consequence: { endsDialogue: true } }
        ]
    },
    "sanctum_discussion": {
        id: "sanctum_discussion",
        text: "Cahaya... itu adalah berkah dari Sang Penempa. Ia memurnikan jiwa dan mengusir Gema. Kita harus menjaganya.",
        choices: [
            { text: "Bagaimana aku bisa membantu menjaganya?", consequence: { nextDialogueId: "sanctum_guarding_hint" } },
            { text: "Apa manfaat Cahaya bagiku?", consequence: { nextDialogueId: "sanctum_benefits" } },
            { text: "Terima kasih atas informasinya.", consequence: { endsDialogue: true } }
        ]
    },
    "echo_protection_hint": {
        id: "echo_protection_hint",
        text: "Jaga Niatmu tetap kuat, Wanderer. Hanya Niat yang bisa menjadi perisai sejati melawan bisikan Gema.",
        choices: [
            { text: "Aku mengerti.", consequence: { endsDialogue: true } }
        ]
    },
    "echo_healing_hint": {
        id: "echo_healing_hint",
        text: "Beberapa jiwa berkata bahwa kristal murni dari Sanctum bisa menenangkan Gema. Tapi jangan lengah...",
        choices: [
            { text: "Aku akan mengingatnya.", consequence: { endsDialogue: true } }
        ]
    },
    "sanctum_guarding_hint": {
        id: "sanctum_guarding_hint",
        text: "Lindungi Nexus dari bisikan Gema, bersihkan korupsi. Itu adalah cara terbaik menjaga Cahaya tetap bersinar.",
        choices: [
            { text: "Aku akan berusaha.", consequence: { endsDialogue: true } }
        ]
    },
    "sanctum_benefits": {
        id: "sanctum_benefits",
        text: "Di Sanctum, jiwamu terasa lebih ringan, dan luka-luka cepat pulih. Energi Niat di sini akan membimbingmu.",
        choices: [
            { text: "Kedengarannya bagus.", consequence: { endsDialogue: true } }
        ]
    },
    // NEW Dynamic Dialogue based on current World State / NPC roles / relationships
    "gossip_dynamic": {
        id: "gossip_dynamic",
        text: (npc, wanderer, world) => {
            // Asumsi COSMIC_CYCLES, REGIONS_DATA, GLOBAL_WORLD_EVENTS, FACTIONS_DATA ada di lingkup import atau di-pass
            const COSMIC_CYCLES_MOCK = { ECHOING_SLUMBER: { id: 'ECHOING_SLUMBER' } }; // Mock
            const COSMIC_CYCLES_DATA = globalThis.COSMIC_CYCLES || COSMIC_CYCLES_MOCK;
            const FACTIONS_DATA_MOCK = { TheArbiters: { name: 'Arbiters' } }; // Mock
            const FACTIONS_DATA_DATA = globalThis.FACTIONS_DATA || FACTIONS_DATA_MOCK;

            const currentCosmicCycle = world.cosmicCycle ? COSMIC_CYCLES_DATA[world.cosmicCycle.currentCycleId] : null;
            const region = world.regions[npc.currentRegion];
            let gossipText = "Aku dengar ini itu di sekitar sini...";
            if (currentCosmicCycle && currentCosmicCycle.id === COSMIC_CYCLES_DATA.ECHOING_SLUMBER.id) {
                gossipText += ` Malam-malam terasa lebih panjang dan dingin akhir-akhir ini. Aku khawatir...`;
            }
            if (region && region.threatLevel >= 4) {
                gossipText += ` Makhluk-makhluk di luar sana semakin agresif. Kau harus berhati-hati.`;
            }
            // If there's a recent global event, NPC might comment on it
            if (world.globalEvents && world.globalEvents.length > 0) {
                const latestEvent = world.globalEvents[world.globalEvents.length - 1]; // Assuming latest is last
                // Ensure WorldManager.getFactionName is defined or mock it for this context
                const getFactionNameMock = (factionId) => {
                    const faction = FACTIONS_DATA_DATA[factionId];
                    return faction ? faction.name : factionId;
                };
                if (latestEvent.eventId === 'FACTION_WAR') {
                    gossipText += ` Kudengar Faksi ${getFactionNameMock(latestEvent.options.targetFactionIds[0])} sedang berperang dengan ${getFactionNameMock(latestEvent.options.targetFactionIds[1])} di utara.`;
                }
            }
            return gossipText;
        },
        choices: [
            { text: "Ceritakan lebih banyak.", consequence: { nextDialogueId: "gossip_specific_topic" } },
            { text: "Itu semua omong kosong.", consequence: { endsDialogue: true, reputationDelta: -5 } }
        ],
        conditions: { requiredNpcTrait: 'gregarious', minReputation: 5 }
    },
    "gossip_specific_topic": {
        id: "gossip_specific_topic",
        text: "Hmm, topik apa yang ingin kau ketahui? Lore lama? Rumor baru? Atau tentang seseorang?",
        choices: [
            { text: "Tentang lore lama.", consequence: { nextDialogueId: "lore_rumors" } },
            { text: "Tentang rumor di desa.", consequence: { nextDialogueId: "local_rumors" } },
            { text: "Aku hanya ingin mendengarkanmu.", consequence: { endsDialogue: true, reputationDelta: 2 } }
        ]
    },
    "lore_rumors": {
        id: "lore_rumors",
        text: "Ada yang bilang, reruntuhan tua di {randomRuinsLandmark} menyimpan rahasia para Penempa pertama. Tapi hati-hati, tempat itu sudah lama ditinggalkan.",
        choices: [
            { text: "Terima kasih atas petunjuknya.", consequence: { endsDialogue: true, triggerJournalEntry: "journal_rumor_ancient_ruins" } }
        ]
    },
    "local_rumors": {
        id: "local_rumors",
        text: "Kau tahu, {randomLazyNpc} di pasar itu selalu mengeluh tentang kerja keras, tapi dia adalah salah satu yang terkaya di desa. Mencurigakan, bukan?",
        choices: [
            { text: "Memang mencurigakan.", consequence: { endsDialogue: true, chronicleEntry: (npc, choiceData) => `Mendengar rumor mencurigakan tentang ${choiceData.targetNpcName || 'seseorang'}.` } }
        ]
    },
    "offer_commission": {
        id: "offer_commission",
        text: (npc, wanderer) => {
            return `Selamat datang, Wanderer. Aku bisa membuatkanmu sesuatu jika kau membawa bahan yang tepat. Atau, apakah kau punya material yang ingin kau jual?`;
        },
        choices: [
            {
                text: "Saya ingin memesan sesuatu.",
                consequence: { triggerMiniGame: "CommissionGame", endsDialogue: true }
            },
            {
                text: "Saya ingin menjual material.",
                consequence: { triggerMiniGame: "BarterGame", endsDialogue: true }
            },
            { text: "Tidak sekarang.", consequence: { endsDialogue: true } }
        ],
        conditions: { or: [{ requiredNpcTrait: 'crafter' }, { isNpcCrafter: true }] }
    }
};

// --- Placeholder for other Dialogue related data from user prompt ---
// RUMOR_TEMPLATES - data ini ada di wandererGameLogic.js sebagai RUMOR_DATA dan perlu dipindahkan secara terpisah jika diinginkan.
// GLOBAL_EVENT_RESPONSES - tidak ada di gameData.js yang diberikan sebelumnya.
// FATE_DECISIONS - tidak ada di gameData.js yang diberikan sebelumnya.
// WANDERER_REAL_WORLD_JOURNAL_PROMPTS - tidak ada di gameData.js yang diberikan sebelumnya.
// EMOTIONAL_ARCHETYPE_MAPPINGS - tidak ada di gameData.js yang diberikan sebelumnya.
// JOURNAL_EMOTIONAL_PROMPT_TRIGGERS - tidak ada di gameData.js yang diberikan sebelumnya.
// NARRATIVE_RESONANCE_TEMPLATES - tidak ada di gameData.js yang diberikan sebelumnya.