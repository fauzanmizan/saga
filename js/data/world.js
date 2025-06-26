// js/data/world.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-27, 12:28 WITA ==
// == PERIHAL: Refactoring GameData.js - Pemindahan Data Dunia ke world.js ==
// - Menampung semua data statis terkait dunia, Nexus States, cosmic cycles, landmarks, events, dll.
// ===========================================

/**
 * @typedef {object} NexusState
 * @property {string} id - Unique ID of the Nexus status.
 * @property {string} name - Descriptive name.
 * @property {string} description - Environmental description.
 * @property {number} healthDecayMultiplier - Multiplier for NPC health decayRate.
 * @property {number} healthGainChance - Base chance for NPC healthState improvement in this region.
 * @property {number} corruptionGrowthFactor - How fast corruption spreads in this region.
 * @property {number} mortalityModifier - Multiplier for mortality risk in this region.
 * @property {number} whisperFrequencyModifier - Multiplier for triggered Whisper frequency.
 */
export const NEXUS_STATES = {
    MAELSTROM: {
        id: 'maelstrom',
        name: 'Maelstrom Gema',
        description: 'Energi Gema meluap. Lingkungan tidak stabil dan sangat berbahaya.',
        healthDecayMultiplier: 2.5,
        healthGainChance: 0,
        corruptionGrowthFactor: 2.0,
        mortalityModifier: 2.0,
        whisperFrequencyModifier: 2.0
    },
    UNSTABLE: {
        id: 'unstable',
        name: 'Tidak Stabil',
        description: 'Keseimbangan rapuh. Gema bisa muncul sewaktu-waktu dan kehidupan sulit berkembang.',
        healthDecayMultiplier: 1.5,
        healthGainChance: 0.02,
        corruptionGrowthFactor: 1.2,
        mortalityModifier: 1.2,
        whisperFrequencyModifier: 1.2
    },
    NORMAL: {
        id: 'normal',
        name: 'Normal',
        description: 'Lingkungan seimbang dan stabil. Kehidupan berjalan normal.',
        healthDecayMultiplier: 1.0,
        healthGainChance: 0.05,
        corruptionGrowthFactor: 1.0,
        mortalityModifier: 1.0,
        whisperFrequencyModifier: 1.0
    },
    SANCTUM: {
        id: 'sanctum',
        name: 'Sanctum Cahaya',
        description: 'Sumber energi murni. Lingkungan pulih dan subur, melindungi dari Gema.',
        healthDecayMultiplier: 0.5,
        healthGainChance: 0.20,
        corruptionGrowthFactor: 0.5,
        mortalityModifier: 0.5,
        whisperFrequencyModifier: 0.5
    }
};

/**
 * @typedef {object} CosmicCycleEffect
 * @property {number} [xpGainMultiplier] - Multiplier for XP gained by the Wanderer.
 * @property {number} [essenceGainMultiplier] - Multiplier for Essence gain.
 * @property {number} [combatEncounterRateModifier] - Multiplier for enemy encounter rate.
 * @property {number} [resourceSpawnRateMultiplier] - Multiplier for resource spawn rate.
 * @property {number} [npcHealthDecayModifier] - Multiplier for NPC health decayRate.
 * @property {number} [npcSanityDecayModifier] - Multiplier for NPC sanity decayRate (placeholder).
 * @property {string} [worldVisualTheme] - Global visual theme (e.g., 'dark', 'bright', 'misty').
 */

/**
 * @typedef {object} CosmicCycle
 * @property {string} id - Unique ID for the cycle.
 * @property {string} name - Name of the cycle (e.g., 'Echoing Slumber', 'Vibrant Dawn').
 * @property {string} description - Narrative description of the cycle.
 * @property {number} durationDays - Duration of the cycle in days.
 * @property {CosmicCycleEffect} effects - Gameplay effects during this cycle.
 * @property {string} [eventIcon] - Icon for notifications and log.
 */
export const COSMIC_CYCLES = {
    ECHOING_SLUMBER: {
        id: 'ECHOING_SLUMBER',
        name: 'Bisikan Tidur',
        description: 'Dunia terasa lesu, bisikan Gema lebih sering terdengar. Waktu refleksi dan bahaya tersembunyi.',
        durationDays: 30, // Example: Lasts 30 days
        effects: {
            xpGainMultiplier: 0.8,
            essenceGainMultiplier: 0.9,
            combatEncounterRateModifier: 1.2, // More Echo encounters
            resourceSpawnRateMultiplier: 0.7, // Fewer resources
            npcHealthDecayModifier: 1.1, // NPCs decay slightly faster
            worldVisualTheme: 'dark'
        },
        eventIcon: 'moon'
    },
    VIBRANT_DAWN: {
        id: 'VIBRANT_DAWN',
        name: 'Fajar Bersemangat',
        description: 'Cahaya Intensi memenuhi udara, mendorong pertumbuhan dan pemulihan. Waktu untuk eksplorasi dan pembangunan.',
        durationDays: 30,
        effects: {
            xpGainMultiplier: 1.2,
            essenceGainMultiplier: 1.1,
            combatEncounterRateModifier: 0.8, // Fewer aggressive encounters
            resourceSpawnRateMultiplier: 1.3, // More abundant resources
            npcHealthDecayModifier: 0.9, // NPCs recover health easier
            worldVisualTheme: 'bright'
        },
        eventIcon: 'sun'
    },
    CHAOTIC_FUSE: {
        id: 'CHAOTIC_FUSE',
        name: 'Fusi Kacau',
        description: 'Energi Gema dan Intensi bertabrakan, menciptakan anomali tak terduga. Bahaya besar namun juga peluang unik.',
        durationDays: 15, // Shorter, more intense cycle
        effects: {
            xpGainMultiplier: 1.5, // High risk, high reward
            essenceGainMultiplier: 1.5,
            combatEncounterRateModifier: 1.5, // Very high
            resourceSpawnRateMultiplier: 1.0,
            npcHealthDecayModifier: 1.2,
            npcSanityDecayModifier: 1.5, // NPCs more prone to madness
            worldVisualTheme: 'unstable'
        },
        eventIcon: 'explosion'
    }
};

/**
 * @typedef {object} WorldEventConsequence
 * @property {object} [nexusStateChange] - Perubahan status Nexus wilayah. { regionId: string, newState: string, intensity: number }
 * @property {object[]} [factionReputationChanges] - Perubahan reputasi faksi global. { factionId: string, delta: number }
 * @property {object[]} [spawnEnemies] - Spawn musuh unik. { enemyId: string, quantity: number, regionId: string }
 * @property {object[]} [modifyLandmarks] - Modifikasi landmark. { landmarkId: string, newStatus: string, visualEffect: string }
 * @property {object} [resourceImpact] - Dampak pada sumber daya. { resourceType: string, regionId: string, multiplier: number }
 * @property {number} [totalLegacyGain] - Total poin Legacy yang diberikan kepada Forger.
 * @property {string} [chronicleEntryTitle] - Judul entri kronik global.
 * @property {string} [chronicleEntryDescription] - Deskripsi entri kronik global.
 * @property {string} [chronicleEntryIcon] - Ikon untuk entri kronik.
 * @property {object} [forgerChoicePrompt] - Jika Forger harus membuat pilihan. { id: string, text: string, choices: { id: string, text: string, consequence: object }[] }
 */

/**
 * @typedef {object} GlobalWorldEvent
 * @property {string} id - ID unik event.
 * @property {string} name - Nama event.
 * @property {string} description - Deskripsi naratif event.
 * @property {WorldEventConsequence} consequences - Konsekuensi event pada game state.
 * @property {boolean} [requiresTargetRegion] - Apakah event memerlukan pemilihan wilayah.
 * @property {boolean} [requiresTargetFaction] - Apakah event memerlukan pemilihan faksi.
 * @property {string} [eventIcon] - Ikon untuk notifikasi dan log.
 * @property {string[]} [possibleRegions] - Regions where this event is most likely to occur.
 * @property {string[]} [possibleFactions] - Factions relevant to this event.
 * @property {string[]} [possibleLandmarks] - Landmarks relevant to this event.
 */
export const GLOBAL_WORLD_EVENTS = {
    // === Nexus Manipulation Events ===
    'ECHO_SPIKE': {
        id: 'ECHO_SPIKE',
        name: 'Lonjakan Gema Mendadak',
        description: 'Gelombang Gema tiba-tiba melanda suatu wilayah, mempercepat korupsi.',
        consequences: {
            nexusStateChange: { regionId: '{targetRegionId}', newState: 'MAELSTROM', intensity: 1 },
            spawnEnemies: [{ enemyId: 'echo_horror', quantity: 1, regionId: '{targetRegionId}' }],
            totalLegacyGain: 50,
            chronicleEntryTitle: 'Lonjakan Gema',
            chronicleEntryDescription: 'Gema membanjiri {targetRegionName}, mengubah lanskap dan memunculkan horor.',
            chronicleEntryIcon: 'skull'
        },
        requiresTargetRegion: true,
        eventIcon: 'skull',
        possibleRegions: ['TheCentralNexus', 'TheWhisperingReaches', 'TheAshfallWastes']
    },
    'SANCTUM_BLESSING': {
        id: 'SANCTUM_BLESSING',
        name: 'Berkat Sanctum',
        description: 'Cahaya Intensi melimpah ruah, membersihkan suatu wilayah dan mendorong pemulihan.',
        consequences: {
            nexusStateChange: { regionId: '{targetRegionId}', newState: 'SANCTUM', intensity: 1 },
            resourceImpact: { resourceType: 'material', regionId: '{targetRegionId}', multiplier: 2.0 },
            totalLegacyGain: 75,
            chronicleEntryTitle: 'Berkat Cahaya',
            chronicleEntryDescription: 'Cahaya menyelimuti {targetRegionName}, membawa kesuburan dan harapan.',
            chronicleEntryIcon: 'sparkles'
        },
        requiresTargetRegion: true,
        eventIcon: 'sparkles',
        possibleRegions: ['TheLuminousPlains', 'TheAzureForest']
    },
    // === Faction Interaction Events ===
    'FACTION_WAR': {
        id: 'FACTION_WAR',
        name: 'Perang Faksi',
        description: 'Dua faksi besar terlibat dalam konflik terbuka yang mengubah politik dunia.',
        consequences: {
            factionReputationChanges: [
                { factionId: '{faction1Id}', delta: -20 },
                { factionId: '{faction2Id}', delta: -20 }
            ],
            totalLegacyGain: 100,
            chronicleEntryTitle: 'Api Konflik',
            chronicleEntryDescription: 'Perang pecah antara Faksi {faction1Name} dan {faction2Name}, menumpahkan darah di seluruh negeri.',
            chronicleEntryIcon: 'swords'
        },
        requiresTargetFaction: true,
        eventIcon: 'swords',
        possibleFactions: ['TheArbiters', 'TheEchoCult', 'TheStonekin', 'TheCinderTribes']
    },
    'TRADE_ROUTE_OPENED': {
        id: 'TRADE_ROUTE_OPENED',
        name: 'Jalur Perdagangan Baru',
        description: 'Jalur perdagangan penting dibuka, meningkatkan kemakmuran wilayah terkait.',
        consequences: {
            resourceImpact: { resourceType: 'tradable', regionId: '{targetRegionId}', multiplier: 1.5 },
            factionReputationChanges: [{ factionId: '{targetFactionId}', delta: 10 }],
            totalLegacyGain: 40,
            chronicleEntryTitle: 'Kemakmuran Baru',
            chronicleEntryDescription: 'Jalur perdagangan vital dibuka di {targetRegionName}, membawa kemakmuran baru.',
            chronicleEntryIcon: 'coin'
        },
        requiresTargetRegion: true,
        eventIcon: 'circle-dollar-sign',
        possibleRegions: ['TheCrimsonDesert', 'TheLuminousPlains', 'TheSunkenCity'],
        possibleFactions: ['TraderGuild']
    },
    // === Landmark/Geography Events ===
    'LANDMARK_TRANSFORMATION': {
        id: 'LANDMARK_TRANSFORMATION',
        name: 'Transformasi Landmark',
        description: 'Sebuah landmark kuno berubah secara drastis karena pengaruh Gema atau Intensi.',
        consequences: {
            modifyLandmarks: [{ landmarkId: '{targetLandmarkId}', newStatus: 'corrupted_altar', visualEffect: 'echo_corruption' }],
            spawnEnemies: [{ enemyId: 'guardian_golem', quantity: 1, regionId: '{targetRegionId}' }],
            totalLegacyGain: 60,
            chronicleEntryTitle: 'Landmark Berubah',
            chronicleEntryDescription: 'Landmark {targetLandmarkName} telah bertransformasi, menjadi {newStatusDescription}.',
            chronicleEntryIcon: 'landmark'
        },
        requiresTargetRegion: true,
        eventIcon: 'landmark',
        possibleLandmarks: ['ancient_forge_ruins', 'crystal_shrine', 'sanctum_spire', 'the_singing_crystal']
    },
    // === Major NPC Events ===
    'HERO_EMERGENCE': {
        id: 'HERO_EMERGENCE',
        name: 'Munculnya Pahlawan',
        description: 'Seorang NPC non-Wanderer bangkit sebagai pahlawan, memimpin perlawanan terhadap Gema atau krisis.',
        consequences: {
            totalLegacyGain: 80,
            chronicleEntryTitle: 'Pahlawan Baru',
            chronicleEntryDescription: '{targetNpcName} muncul sebagai pahlawan di {targetRegionName}, membawa harapan.',
            chronicleEntryIcon: 'crown'
        },
        requiresTargetRegion: true,
        eventIcon: 'crown',
        possibleRegions: ['TheLuminousPlains', 'TheAzureForest'],
        possibleFactions: ['TheLuminousGuardians', 'TheForestGuardians']
    },
    'PLAGUE_OUTBREAK': {
        id: 'PLAGUE_OUTBREAK',
        name: 'Wabah Penyakit',
        description: 'Penyakit mematikan menyebar di suatu wilayah, melemahkan NPC dan mengganggu kehidupan.',
        consequences: {
            npcHealthDecayMultiplier: 1.5,
            resourceImpact: { resourceType: 'consumable', regionId: '{targetRegionId}', multiplier: 0.5 },
            totalLegacyGain: 70,
            chronicleEntryTitle: 'Wabah Menyebar',
            chronicleEntryDescription: 'Wabah penyakit melanda {targetRegionName}, membawa penderitaan dan kematian.',
            chronicleEntryIcon: 'biohazard'
        },
        requiresTargetRegion: true,
        eventIcon: 'biohazard',
        possibleRegions: ['TheWhisperingReaches', 'TheSunkenCity', 'TheCrimsonDesert']
    },
    'RESOURCE_BONANZA': {
        id: 'RESOURCE_BONANZA',
        name: 'Ledakan Sumber Daya',
        description: 'Sebuah wilayah mengalami kelimpahan sumber daya yang tak terduga, menarik pedagang dan penjelajah.',
        consequences: {
            resourceImpact: { resourceType: 'all', regionId: '{targetRegionId}', multiplier: 2.5 },
            factionReputationChanges: [{ factionId: 'TraderGuild', delta: 15 }],
            totalLegacyGain: 60,
            chronicleEntryTitle: 'Kelimpahan Tak Terduga',
            chronicleEntryDescription: 'Sumber daya melimpah ruah di {targetRegionName}, membawa kemakmuran.',
            chronicleEntryIcon: 'dollar-sign'
        },
        requiresTargetRegion: true,
        eventIcon: 'dollar-sign',
        possibleRegions: ['TheShatteredPeaks', 'TheAzureForest', 'TheLuminousPlains']
    },
    // NEW Forger-specific World Events with Choices
    'THE_FORGER_INTERVENTION_FATE': {
        id: 'THE_FORGER_INTERVENTION_FATE',
        name: 'Intervensi Takdir Penempa',
        description: 'The Forger memiliki kesempatan untuk campur tangan langsung dalam peristiwa penting yang mempengaruhi Nexus.',
        consequences: {
            forgerChoicePrompt: {
                id: 'intervention_fate_choice',
                text: 'Sebuah anomali Nexus muncul. Sebagai Penempa, apakah Anda akan menguatkan Intensi atau menyebarkan Gema?',
                choices: [
                    {
                        id: 'strengthen_intention',
                        text: 'Kuatkan Intensi',
                        consequence: {
                            nexusStateChange: { regionId: '{targetRegionId}', newState: 'SANCTUM', intensity: 0.5 },
                            totalLegacyGain: 30,
                            chronicleEntryTitle: 'Intensi Dikuatkan',
                            chronicleEntryDescription: 'Forger menguatkan aliran Intensi di {targetRegionName}.',
                            chronicleEntryIcon: 'sparkles'
                        }
                    },
                    {
                        id: 'spread_echo',
                        text: 'Sebarkan Gema',
                        consequence: {
                            nexusStateChange: { regionId: '{targetRegionId}', newState: 'MAELSTROM', intensity: 0.5 },
                            spawnEnemies: [{ enemyId: 'echo_wraith', quantity: 3, regionId: '{targetRegionId}' }],
                            totalLegacyGain: 20,
                            chronicleEntryTitle: 'Gema Disebarkan',
                            chronicleEntryDescription: 'Forger menyebarkan Gema di {targetRegionName}.',
                            chronicleEntryIcon: 'skull'
                        }
                    }
                ]
            }
        },
        requiresTargetRegion: true,
        eventIcon: 'gavel',
        possibleRegions: ['TheCentralNexus', 'TheWhisperingReaches', 'TheLuminousPlains']
    },
    'THE_FORGER_POPULATION_BALANCE': {
        id: 'THE_FORGER_POPULATION_BALANCE',
        name: 'Keseimbangan Populasi Penempa',
        description: 'Forger dapat mempengaruhi demografi suatu wilayah, membantu pertumbuhan atau mengurangi beban populasi.',
        consequences: {
            forgerChoicePrompt: {
                id: 'population_balance_choice',
                text: 'Wilayah {targetRegionName} sedang berjuang. Haruskah Anda mendorong pertumbuhan atau meringankan beban sumber daya?',
                choices: [
                    {
                        id: 'encourage_growth',
                        text: 'Dorong Pertumbuhan',
                        consequence: {
                            totalLegacyGain: 40,
                            chronicleEntryTitle: 'Pertumbuhan Populasi',
                            chronicleEntryDescription: 'Forger mendorong pertumbuhan populasi di {targetRegionName}.',
                            chronicleEntryIcon: 'users'
                        }
                    },
                    {
                        id: 'alleviate_burden',
                        text: 'Meringankan Beban',
                        consequence: {
                            resourceImpact: { resourceType: 'all', regionId: '{targetRegionId}', multiplier: 1.2 },
                            totalLegacyGain: 30,
                            chronicleEntryTitle: 'Beban Meringan',
                            chronicleEntryDescription: 'Forger meringankan beban sumber daya di {targetRegionName}.',
                            chronicleEntryIcon: 'leaf'
                        }
                    }
                ]
            }
        },
        requiresTargetRegion: true,
        eventIcon: 'balance-scale',
        possibleRegions: ['TheLuminousPlains', 'TheCrimsonDesert', 'TheAzureForest']
    }
};

/**
 * @typedef {object} WhisperEventDefinition
 * @property {string} id - Unique Whisper event ID.
 * @property {string} name - Whisper name.
 * @property {string} description - Narrative description of the Whisper.
 * @property {string[]} tags - Relevant tags (e.g., 'corruption', 'mental', 'physical').
 * @property {object} impact - Impact on the Wanderer or environment when encountered.
 * @property {number} [cooldownDays] - Minimum cooldown before the same Whisper can be triggered again by an NPC/area.
 */
export const WHISPER_EVENTS = {
    CORRUPTED_PRESENCE: {
        id: 'CORRUPTED_PRESENCE',
        name: 'Bisikan Korupsi',
        description: 'Anda merasakan gelombang penderitaan dan distorsi yang berasal dari dekat. Udara terasa berat, dan Gema menarik Anda.',
        tags: ['corruption', 'mental', 'proximity'],
        impact: {
            playerSanityDecrease: 5,
            temporaryStatDebuff: { stat: 'courage', value: -10, durationDays: 1 },
            nearbyCreatureAggressionIncrease: 0.1
        },
        cooldownDays: 2
    },
    CORRUPTED_MALIGNANCY_SPIKE: {
        id: 'CORRUPTED_MALIGNANCY_SPIKE',
        name: 'Ledakan Kegelapan',
        description: 'Tiba-tiba, area ini dipenuhi oleh energi Gema yang menyakitkan. Bayangan bergejolak dan wujud-wujud tak jelas melintas.',
        tags: ['corruption', 'ambient', 'danger', 'physical'],
        impact: {
            playerHealthDamage: 10,
            spawnCorruptedCreature: 'minor',
            areaEnvironmentalEffect: 'echo_distortion_vision'
        },
        cooldownDays: 5
    },
    ECHO_OF_REGRET: {
        id: 'ECHO_OF_REGRET',
        name: 'Gema Penyesalan',
        description: 'Anda mendengar bisikan penyesalan yang mendalam dari jiwa yang telah lama hilang. Sebuah beban duka menghampiri Anda.',
        tags: ['grief', 'mental', 'past'],
        impact: {
            playerSanityDecrease: 3,
            temporaryStatDebuff: { stat: 'focus', value: -5, durationDays: 1 }
        },
        cooldownDays: 3
    },
    GLIMMER_OF_HOPE: {
        id: 'GLIMMER_OF_HOPE',
        name: 'Kilasan Harapan',
        description: 'Sebuah cahaya samar menembus kegelapan, memberikan rasa optimisme yang singkat.',
        tags: ['hope', 'mental', 'positive'],
        impact: {
            playerSanityIncrease: 5,
            temporaryStatBuff: { stat: 'intention', value: 10, durationDays: 1 }
        },
        cooldownDays: 4
    },
    WHISPER_OF_MADNESS: {
        id: 'WHISPER_OF_MADNESS',
        name: 'Bisikan Kegilaan',
        description: 'Suara-suara aneh mengalir ke dalam pikiranmu, mengancam kewarasanmu.',
        tags: ['corruption', 'mental', 'madness'],
        impact: {
            playerSanityDecrease: 10,
            temporaryStatDebuff: { stat: 'discipline', value: -15, durationDays: 2 },
            affliction: 'confusion'
        },
        cooldownDays: 7
    },
    WHISPER_OF_POWER: {
        id: 'WHISPER_OF_POWER',
        name: 'Bisikan Kekuatan',
        description: 'Gema menawarkanmu kekuatan terlarang, memanifestasikan ilusi yang menggoda.',
        tags: ['corruption', 'temptation', 'power'],
        impact: {
            playerEchoIncrease: 5,
            temporaryStatBuff: { stat: 'focus', value: 10, durationDays: 1 },
            illusion: 'minor'
        },
        cooldownDays: 5
    },
    WHISPER_OF_ISOLATION: {
        id: 'WHISPER_OF_ISOLATION',
        name: 'Bisikan Keterasingan',
        description: 'Kamu merasa terputus dari dunia, seolah semua koneksi memudar. Sebuah kesendirian yang mendalam melingkupimu.',
        tags: ['mental', 'isolation', 'social'],
        impact: {
            playerSocialAttributeDebuff: { value: -5, durationDays: 1 },
            temporaryReputationPenalty: { value: -2, durationDays: 1 }
        },
        cooldownDays: 5
    },
    WHISPER_OF_GREED: {
        id: 'WHISPER_OF_GREED',
        name: 'Bisikan Keserakahan',
        description: 'Pandanganmu terfokus pada harta, keinginan untuk memiliki melahapmu. Kekayaan dunia memanggil dengan suara busuk.',
        tags: ['temptation', 'item', 'economic'],
        impact: {
            playerAlignmentEchoChange: 2,
            temporaryEconomicDebuff: { value: -0.1, durationDays: 1 }
        },
        cooldownDays: 4
    }
};

/**
 * @typedef {object} ChronicleEventDefinition
 * @property {string} type - Unique entry type for the chronicle.
 * @property {string} template - Template string for the description (e.g., "{npcName} died due to {cause}").
 * @property {string[]} tags - Tags for categorization (e.g., 'death', 'tragedy', 'echo').
 * @property {object} impact - Direct impact on game state when recorded.
 */
export const CHRONICLE_EVENTS = {
    NPC_DEATH_NATURAL: {
        type: 'death_natural',
        template: '{npcName}, seorang {lifeStage} yang {healthState}, telah meninggal secara alami di {regionName}. Sebuah kehidupan telah usai.',
        tags: ['death', 'natural', 'peaceful'],
        impact: { regionIntentionChange: -20, localNPCGrief: true }
    },
    NPC_DEATH_CORRUPTION: {
        type: 'death_corruption',
        template: '{npcName}, seorang {lifeStage} yang terkontaminasi {healthState}, telah menyerah pada Gema di {regionName}. Sebuah jiwa hilang dalam kegelapan.',
        tags: ['death', 'corruption', 'tragedy', 'echo_source'],
        impact: { regionIntentionChange: -75, potentialEchoSpawn: true }
    },
    NPC_DEATH_VIOLENCE: {
        type: 'death_violence',
        template: '{npcName} ditemukan tak bernyawa di {regionName}, korban kekerasan yang brutal. Dunia menjadi sedikit lebih gelap.',
        tags: ['death', 'violence', 'tragedy'],
        impact: { regionIntentionChange: -50, potentialInvestigationQuest: true }
    },
    NPC_DEATH_STARVATION_EXHAUSTION: {
        type: 'death_starvation_exh_austion',
        template: '{npcName}, seorang {lifeStage} yang {healthState}, meninggal karena kelaparan atau kelelahan di {regionName}. Sebuah kehidupan yang keras berakhir.',
        tags: ['death', 'hardship', 'tragedy'],
        impact: { regionIntentionChange: -30 }
    },
    QUEST_COMPLETED_SUCCESS: {
        type: 'quest_completed',
        template: 'Misi "{questName}" berhasil diselesaikan, membawa {rewardDescription}.',
        tags: ['quest', 'success'],
        impact: {}
    },
    QUEST_FAILED: {
        type: 'quest_failed',
        template: 'Misi "{questName}" gagal. Sebuah kesempatan hilang dalam kabut takdir.',
        tags: ['quest', 'failure'],
        impact: {}
    },
    LANDMARK_DISCOVERED: {
        type: 'landmark_discovery',
        template: 'Menemukan {landmarkName}, sebuah situs yang tersembunyi di {regionName}.',
        tags: ['exploration', 'discovery'],
        impact: {}
    },
    LANDMARK_STATUS_CHANGE: {
        type: 'landmark_change',
        template: 'Status {landmarkName} di {regionName} telah berubah menjadi {newStatus}.',
        tags: ['world_change'],
        impact: {}
    },
    ITEM_ACQUIRED_RARE: {
        type: 'item_acquired',
        template: 'Mendapatkan {itemName}, sebuah item langka yang memancarkan aura kuat.',
        tags: ['item', 'rare'],
        impact: {}
    },
    FORGER_EVENT_TRIGGERED: {
        type: 'forger_event',
        template: 'The Forger memicu peristiwa besar: {eventName} di {targetLocation}.',
        tags: ['forger_action', 'world_shaping'],
        impact: {}
    },
    FACTION_RELATIONSHIP_CHANGE: {
        type: 'faction_relation',
        template: 'Hubungan antara {faction1Name} dan {faction2Name} berubah menjadi {newRelationship}.',
        tags: ['political', 'world_change'],
        impact: {}
    },
    NEW_NPC_BORN: {
        type: 'npc_life',
        template: 'Seorang bayi baru lahir di {regionName}. Harapan baru untuk Saga.',
        tags: ['life', 'community'],
        impact: {}
    },
    NPC_PURIFIED: {
        type: 'npc_purified',
        template: '{npcName} telah dimurnikan dari korupsi Gema di {regionName}. Sebuah jiwa diselamatkan.',
        tags: ['healing', 'intention'],
        impact: {}
    }
};

/**
 * @typedef {object} WorldLandmark
 * @property {string} id - Unique landmark ID.
 * @property {string} name - Landmark name.
 * @property {string} regionId - ID of the region where the landmark is located.
 * @property {{x: number, y: number}} coords - Relative coordinates on the region map (0-1).
 * @property {string} initialStatus - Initial status of the landmark ('unknown', 'rumored', 'active', 'corrupted', 'purified', 'ruined').
 * @property {string} [journalEntryId] - ID of the associated journal entry (if discovered).
 * @property {string} [icon] - Icon for map display (feather icon name).
 * @property {string} [type] - Type of landmark (e.g., 'dungeon', 'town', 'altar', 'ruins', 'natural', 'settlement', 'tower', 'portal', 'artifact_site', 'mine').
 */
export const WORLD_LANDMARKS = {
    // === Existing Landmarks (5) ===
    "ancient_forge_ruins": {
        id: "ancient_forge_ruins",
        name: "Reruntuhan Tempaan Kuno",
        regionId: "TheCentralNexus",
        coords: { x: 0.4, y: 0.3 },
        initialStatus: "rumored",
        journalEntryId: "journal_ancient_forge_rumor",
        icon: 'anchor',
        type: 'ruins'
    },
    "whispering_cave": {
        id: "whispering_cave",
        name: "Gua Berbisik",
        regionId: "TheWhisperingReaches",
        coords: { x: 0.7, y: 0.6 },
        initialStatus: "unknown",
        journalEntryId: "journal_whispering_cave_discovery",
        icon: 'cloud-off',
        type: 'dungeon'
    },
    "sunken_library": {
        id: "sunken_library",
        name: "Perpustakaan Tenggelam",
        regionId: "TheLuminousPlains",
        coords: { x: 0.2, y: 0.8 },
        initialStatus: "discovered",
        journalEntryId: "journal_sunken_library_notes",
        icon: 'book',
        type: 'landmark'
    },
    "crystal_shrine": {
        id: "crystal_shrine",
        name: "Kuil Kristal",
        regionId: "TheLuminousPlains",
        coords: { x: 0.5, y: 0.1 },
        initialStatus: "active",
        journalEntryId: "journal_crystal_shrine_lore",
        icon: 'gem',
        type: 'altar'
    },
    "forgotten_outpost": {
        id: "forgotten_outpost",
        name: "Pos Terdepan yang Terlupakan",
        regionId: "TheWhisperingReaches",
        coords: { x: 0.1, y: 0.9 },
        initialStatus: "rumored",
        journalEntryId: "journal_forgotten_outpost",
        icon: 'fortress',
        type: 'settlement'
    },

    // --- NEW: 50 Additional Landmarks ---
    "echoing_chasm": { id: "echoing_chasm", name: "Jurang Bergema", regionId: "TheCentralNexus", coords: { x: 0.65, y: 0.15 }, initialStatus: "unknown", journalEntryId: "journal_echoing_chasm_discovery", icon: 'aperture', type: 'natural' },
    "sanctum_spire": { id: "sanctum_spire", name: "Menara Sanctum", regionId: "TheLuminousPlains", coords: { x: 0.8, y: 0.2 }, initialStatus: "active", journalEntryId: "journal_sanctum_spire_origin", icon: 'church', type: 'altar' },
    "crimson_oasis": { id: "crimson_oasis", name: "Oase Merah Darah", regionId: "TheCrimsonDesert", coords: { x: 0.3, y: 0.7 }, initialStatus: "discovered", journalEntryId: "journal_crimson_oasis_secrets", icon: 'droplet', type: 'settlement' },
    "gloomwood_grove": { id: "gloomwood_grove", name: "Hutan Gelap Gloomwood", regionId: "TheWhisperingReaches", coords: { x: 0.1, y: 0.3 }, initialStatus: "unknown", journalEntryId: "journal_gloomwood_rumors", icon: 'tree-deciduous', type: 'natural' },
    "sky-watcher_observatory": { id: "sky-watcher_observatory", name: "Observatorium Pengamat Langit", regionId: "TheShatteredPeaks", coords: { x: 0.5, y: 0.9 }, initialStatus: "ruined", journalEntryId: "journal_observatory_ruins", icon: 'telescope', type: 'ruins' },
    "azure_falls": { id: "azure_falls", name: "Air Terjun Azure", regionId: "TheAzureForest", coords: { x: 0.6, y: 0.4 }, initialStatus: "discovered", journalEntryId: "journal_azure_falls_beauty", icon: 'water', type: 'natural' },
    "sunken_market": { id: "sunken_market", name: "Pasar Tenggelam", regionId: "TheSunkenCity", coords: { x: 0.4, y: 0.4 }, initialStatus: "rumored", journalEntryId: "journal_sunken_market_bazaar", icon: 'store', type: 'settlement' },
    "cloud-strider_bridge": { id: "cloud-strider_bridge", name: "Jembatan Penjelajah Awan", regionId: "TheFloatingIslands", coords: { x: 0.7, y: 0.3 }, initialStatus: "active", journalEntryId: "journal_cloud_bridge_passage", icon: 'bridge', type: 'landmark' },
    "the_cursed_barrow": { id: "the_cursed_barrow", name: "Gundukan Terkutuk", regionId: "TheWhisperingReaches", coords: { x: 0.25, y: 0.7 }, initialStatus: "corrupted", journalEntryId: "journal_cursed_barrow_secrets", icon: 'skull', type: 'dungeon' },
    "whispering_sands_settlement": { id: "whispering_sands_settlement", name: "Pemukiman Pasir Berbisik", regionId: "TheCrimsonDesert", coords: { x: 0.8, y: 0.1 }, initialStatus: "active", journalEntryId: "journal_whispering_sands_life", icon: 'users', type: 'town' },
    "emerald_grotto": { id: "emerald_grotto", name: "Gua Zamrud", regionId: "TheAzureForest", coords: { x: 0.15, y: 0.85 }, initialStatus: "discovered", journalEntryId: "journal_emerald_grotto_wonders", icon: 'gem', type: 'natural' },
    "ironclad_keep": { id: "ironclad_keep", name: "Benteng Berbaju Besi", regionId: "TheShatteredPeaks", coords: { x: 0.2, y: 0.2 }, initialStatus: "active", journalEntryId: "journal_ironclad_keep_defenses", icon: 'castle', type: 'settlement' },
    "the_singing_crystal": { id: "the_singing_crystal", name: "Kristal Bernyanyi", regionId: "TheLuminousPlains", coords: { x: 0.9, y: 0.6 }, initialStatus: "active", journalEntryId: "journal_singing_crystal_resonance", icon: 'music', type: 'artifact_site' },
    "shadowfen_ruins": { id: "shadowfen_ruins", name: "Reruntuhan Shadowfen", regionId: "TheWhisperingReaches", coords: { x: 0.4, y: 0.45 }, initialStatus: "corrupted", journalEntryId: "journal_shadowfen_despair", icon: 'box', type: 'ruins' },
    "volcanic_vent": { id: "volcanic_vent", name: "Lubang Vulkanik", regionId: "TheCrimsonDesert", coords: { x: 0.55, y: 0.25 }, initialStatus: "active", journalEntryId: "journal_volcanic_vent_heat", icon: 'thermometer', type: 'natural' },
    "ancient_growth_sanctuary": { id: "ancient_growth_sanctuary", name: "Suaka Pertumbuhan Kuno", regionId: "TheAzureForest", coords: { x: 0.7, y: 0.7 }, initialStatus: "purified", journalEntryId: "journal_ancient_growth_renewal", icon: 'leaf', type: 'altar' },
    "summit_of_ascension": { id: "summit_of_ascension", name: "Puncak Kenaikan", regionId: "TheShatteredPeaks", coords: { x: 0.4, y: 0.1 }, initialStatus: "unknown", journalEntryId: "journal_summit_rumors", icon: 'mountain', type: 'natural' },
    "tidepool_caverns": { id: "tidepool_caverns", name: "Gua Kolam Pasang", regionId: "TheSunkenCity", coords: { x: 0.7, y: 0.8 }, initialStatus: "discovered", journalEntryId: "journal_tidepool_secrets", icon: 'fish', type: 'dungeon' },
    "aerie_of_the_winds": { id: "aerie_of_the_winds", name: "Sarang Angin", regionId: "TheFloatingIslands", coords: { x: 0.2, y: 0.5 }, initialStatus: "active", journalEntryId: "journal_aerie_wind_songs", icon: 'wind', type: 'natural' },
    "the_weeping_willows": { id: "the_weeping_willows", name: "Pohon Dedalu Menangis", regionId: "TheCentralNexus", coords: { x: 0.1, y: 0.6 }, initialStatus: "active", journalEntryId: "journal_weeping_willows_grief", icon: 'droplet', type: 'natural' },
    "ghost_light_marsh": { id: "ghost_light_marsh", name: "Rawa Cahaya Hantu", regionId: "TheWhisperingReaches", coords: { x: 0.6, y: 0.8 }, initialStatus: "corrupted", journalEntryId: "journal_ghost_light_mystery", icon: 'flashlight', type: 'natural' },
    "sunstone_mines": { id: "sunstone_mines", name: "Tambang Batu Matahari", regionId: "TheCrimsonDesert", coords: { x: 0.1, y: 0.1 }, initialStatus: "active", journalEntryId: "journal_sunstone_riches", icon: 'axe', type: 'mine' },
    "whisperwind_pass": { id: "whisperwind_pass", name: "Jalur Angin Berbisik", regionId: "TheShatteredPeaks", coords: { x: 0.6, y: 0.3 }, initialStatus: "active", journalEntryId: "journal_whisperwind_passage", icon: 'compass', type: 'landmark' },
    "azure_creek_village": { id: "azure_creek_village", name: "Desa Teluk Azure", regionId: "TheAzureForest", coords: { x: 0.8, y: 0.9 }, initialStatus: "active", journalEntryId: "journal_azure_creek_life", icon: 'home', type: 'town' },
    "coral_spires": { id: "coral_spires", name: "Puncak Karang", regionId: "TheSunkenCity", coords: { x: 0.6, y: 0.2 }, initialStatus: "discovered", journalEntryId: "journal_coral_spires_beauty", icon: 'fish', type: 'natural' },
    "cloud_nexus_platform": { id: "cloud_nexus_platform", name: "Platform Nexus Awan", regionId: "TheFloatingIslands", coords: { x: 0.5, y: 0.5 }, initialStatus: "active", journalEntryId: "journal_cloud_nexus_control", icon: 'cloud', type: 'altar' },
    "the_shattered_library": { id: "the_shattered_library", name: "Perpustakaan Hancur", regionId: "TheCentralNexus", coords: { x: 0.2, y: 0.2 }, initialStatus: "ruined", journalEntryId: "journal_shattered_library_fragments", icon: 'book-open', type: 'ruins' },
    "moonlit_glen": { id: "moonlit_glen", name: "Lembah Cahaya Bulan", regionId: "TheWhisperingReaches", coords: { x: 0.9, y: 0.1 }, initialStatus: "discovered", journalEntryId: "journal_moonlit_glen_peace", icon: 'moon', type: 'natural' },
    "serpent_ridge_pass": { id: "serpent_ridge_pass", name: "Jalur Punggung Ular", regionId: "TheCrimsonDesert", coords: { x: 0.4, y: 0.9 }, initialStatus: "unknown", journalEntryId: "journal_serpent_ridge_challenge", icon: 'mountain', type: 'landmark' },
    "starfall_crater": { id: "starfall_crater", name: "Kawah Hujan Bintang", regionId: "TheShatteredPeaks", coords: { x: 0.7, y: 0.75 }, initialStatus: "active", journalEntryId: "journal_starfall_crater_mystery", icon: 'star', type: 'natural' },
    "grove_of_whispers": { id: "grove_of_whispers", name: "Belukar Bisikan", regionId: "TheAzureForest", coords: { x: 0.3, y: 0.1 }, initialStatus: "corrupted", journalEntryId: "journal_grove_of_whispers_echoes", icon: 'cloud-off', type: 'natural' },
    "deepsea_reactor": { id: "deepsea_reactor", name: "Reaktor Laut Dalam", regionId: "TheSunkenCity", coords: { x: 0.1, y: 0.1 }, initialStatus: "unknown", journalEntryId: "journal_deepsea_reactor_power", icon: 'zap', type: 'ruins' },
    "wind_temple_aerie": { id: "wind_temple_aerie", name: "Kuil Angin Sarang", regionId: "TheFloatingIslands", coords: { x: 0.9, y: 0.9 }, initialStatus: "active", journalEntryId: "journal_wind_temple_rituals", icon: 'wind', type: 'altar' },
    "nexus_gate": { id: "nexus_gate", name: "Gerbang Nexus", regionId: "TheCentralNexus", coords: { x: 0.5, y: 0.5 }, initialStatus: "active", journalEntryId: "journal_nexus_gate_passage", icon: 'portal', type: 'portal' },
    "withered_grove_sanctuary": { id: "withered_grove_sanctuary", name: "Suaka Belukar Layu", regionId: "TheWhisperingReaches", coords: { x: 0.4, y: 0.1 }, initialStatus: "purified", journalEntryId: "journal_withered_grove_renewal", icon: 'leaf', type: 'altar' },
    "shimmering_dunes": { id: "shimmering_dunes", name: "Gundukan Pasir Berkilauan", regionId: "TheCrimsonDesert", coords: { x: 0.7, y: 0.4 }, initialStatus: "discovered", journalEntryId: "journal_shimmering_dunes_secrets", icon: 'sun', type: 'natural' },
    "sky_watch_tower": { id: "sky_watch_tower", name: "Menara Pengawas Langit", regionId: "TheShatteredPeaks", coords: { x: 0.1, y: 0.4 }, initialStatus: "active", journalEntryId: "journal_sky_watch_tower_view", icon: 'eye', type: 'tower' },
    "azurite_mine": { id: "azurite_mine", name: "Tambang Azurite", regionId: "TheAzureForest", coords: { x: 0.45, y: 0.3 }, initialStatus: "active", journalEntryId: "journal_azurite_mine_riches", icon: 'pickaxe', type: 'mine' },
    "lost_leviathan_remains": { id: "lost_leviathan_remains", name: "Sisa Leviathan yang Hilang", regionId: "TheSunkenCity", coords: { x: 0.9, y: 0.5 }, initialStatus: "discovered", journalEntryId: "journal_leviathan_bones", icon: 'bone', type: 'natural' },
    "floating_bazaar": { id: "floating_bazaar", name: "Bazar Melayang", regionId: "TheFloatingIslands", coords: { x: 0.4, y: 0.8 }, initialStatus: "active", journalEntryId: "journal_floating_bazaar_trade", icon: 'shopping-bag', type: 'town' },
    "crypt_of_the_forgotten": { id: "crypt_of_the_forgotten", name: "Kripta yang Terlupakan", regionId: "TheCentralNexus", coords: { x: 0.8, y: 0.7 }, initialStatus: "unknown", journalEntryId: "journal_forgotten_crypt_discovery", icon: 'coffin', type: 'dungeon' },
    "verdant_springs": { id: "verdant_springs", name: "Mata Air Hijau Subur", regionId: "TheLuminousPlains", coords: { x: 0.1, y: 0.4 }, initialStatus: "active", journalEntryId: "journal_verdant_springs_life", icon: 'flower', type: 'natural' },
    "desert_of_whispers": { id: "desert_of_whispers", name: "Gurun Bisikan", regionId: "TheCrimsonDesert", coords: { x: 0.6, y: 0.6 }, initialStatus: "corrupted", journalEntryId: "journal_desert_whispers_lore", icon: 'wind', type: 'natural' },
    "golem_quarry": { id: "golem_quarry", name: "Tambang Golem", regionId: "TheShatteredPeaks", coords: { x: 0.9, y: 0.2 }, initialStatus: "active", journalEntryId: "journal_golem_quarry_activity", icon: 'hammer', type: 'mine' },
    "azure_bay_port": { id: "azure_bay_port", name: "Pelabuhan Teluk Azure", regionId: "TheAzureForest", coords: { x: 0.9, y: 0.1 }, initialStatus: "active", journalEntryId: "journal_azure_bay_trade", icon: 'anchor', type: 'town' },
    "sirens_reef": { id: "sirens_reef", name: "Karang Siren", regionId: "TheSunkenCity", coords: { x: 0.3, y: 0.9 }, initialStatus: "unknown", journalEntryId: "journal_sirens_reef_danger", icon: 'ship', type: 'natural' },
    "celestial_spire_ruins": { id: "celestial_spire_ruins", name: "Reruntuhan Menara Langit", regionId: "TheFloatingIslands", coords: { x: 0.1, y: 0.1 }, initialStatus: "ruined", journalEntryId: "journal_celestial_spire_mystery", icon: 'tower', type: 'ruins' },
    "the_black_lake": { id: "the_black_lake", name: "Danau Hitam", regionId: "TheWhisperingReaches", coords: { x: 0.5, y: 0.5 }, initialStatus: "corrupted", journalEntryId: "journal_black_lake_corruption", icon: 'droplet', type: 'natural' },
    "sunstone_observatory": { id: "sunstone_observatory", name: "Observatorium Batu Matahari", regionId: "TheLuminousPlains", coords: { x: 0.7, y: 0.9 }, initialStatus: "active", journalEntryId: "journal_sunstone_observatory_stars", icon: 'telescope', type: 'landmark' },
    "scorpions_nest": { id: "scorpions_nest", name: "Sarang Kalajengking", regionId: "TheCrimsonDesert", coords: { x: 0.2, y: 0.3 }, initialStatus: "active", journalEntryId: "journal_scorpions_nest_danger", icon: 'spider', type: 'dungeon' },
    "dragons_tooth_peak": { id: "dragons_tooth_peak", name: "Puncak Gigi Naga", regionId: "TheShatteredPeaks", coords: { x: 0.8, y: 0.6 }, initialStatus: "unknown", journalEntryId: "journal_dragons_tooth_legend", icon: 'mountain', type: 'natural' },
    "whispering_pines_sanctuary": { id: "whispering_pines_sanctuary", name: "Suaka Pinus Berbisik", regionId: "TheAzureForest", coords: { x: 0.2, y: 0.5 }, initialStatus: "purified", journalEntryId: "journal_whispering_pines_peace", icon: 'tree-pine', type: 'altar' },
    "abyssal_rift": { id: "abyssal_rift", name: "Celah Abyssal", regionId: "TheSunkenCity", coords: { x: 0.5, y: 0.5 }, initialStatus: "unknown", journalEntryId: "journal_abyssal_rift_depths", icon: 'aperture', type: 'dungeon' },
    "skygazer_temple": { id: "skygazer_temple", name: "Kuil Penjelajah Langit", regionId: "TheFloatingIslands", coords: { x: 0.6, y: 0.2 }, initialStatus: "active", journalEntryId: "journal_skygazer_temple_worship", icon: 'star', type: 'altar' },
    "echo_shattered_village": { id: "echo_shattered_village", name: "Desa Hancur Gema", regionId: "TheCentralNexus", coords: { x: 0.15, y: 0.8 }, initialStatus: "corrupted", journalEntryId: "journal_echo_shattered_village_tragedy", icon: 'home', type: 'ruins' },
    "haven_of_refuge": { id: "haven_of_refuge", name: "Pelabuhan Pengungsian", regionId: "TheLuminousPlains", coords: { x: 0.9, y: 0.4 }, initialStatus: "active", journalEntryId: "journal_haven_of_refuge_hope", icon: 'shelter', type: 'town' },
    "serpent_river_crossing": { id: "serpent_river_crossing", name: "Penyeberangan Sungai Ular", regionId: "TheCrimsonDesert", coords: { x: 0.5, y: 0.05 }, initialStatus: "active", journalEntryId: "journal_serpent_river_passage", icon: 'map', type: 'landmark' },
    "gilded_gorge": { id: "gilded_gorge", name: "Ngarai Berlapis Emas", regionId: "TheShatteredPeaks", coords: { x: 0.3, y: 0.5 }, initialStatus: "discovered", journalEntryId: "journal_gilded_gorge_riches", icon: 'gold', type: 'natural' },
    "ancestral_tree": { id: "ancestral_tree", name: "Pohon Leluhur", regionId: "TheAzureForest", coords: { x: 0.5, y: 0.5 }, initialStatus: "active", journalEntryId: "journal_ancestral_tree_wisdom", icon: 'tree-evergreen', type: 'altar' },
    "sunken_coliseum": { id: "sunken_coliseum", name: "Koloseum Tenggelam", regionId: "TheSunkenCity", coords: { x: 0.75, y: 0.75 }, initialStatus: "rumored", journalEntryId: "journal_sunken_coliseum_arena", icon: 'sword', type: 'dungeon' },
    "drifting_temple": { id: "drifting_temple", name: "Kuil Melayang", regionId: "TheFloatingIslands", coords: { x: 0.3, y: 0.6 }, initialStatus: "active", journalEntryId: "journal_drifting_temple_pilgrimage", icon: 'church', type: 'altar' },
    "the_lost_mine": { id: "the_lost_mine", name: "Tambang yang Hilang", regionId: "TheWhisperingReaches", coords: { x: 0.3, y: 0.8 }, initialStatus: "unknown", journalEntryId: "journal_lost_mine_riches", icon: 'mine', type: 'mine' },
    "serenity_springs": { id: "serenity_springs", name: "Mata Air Ketenangan", regionId: "TheLuminousPlains", coords: { x: 0.6, y: 0.3 }, initialStatus: "purified", journalEntryId: "journal_serenity_springs_healing", icon: 'flower', type: 'natural' },
    "bandit_hideout": { id: "bandit_hideout", name: "Persembunyian Bandit", regionId: "TheCrimsonDesert", coords: { x: 0.85, y: 0.85 }, initialStatus: "active", journalEntryId: "journal_bandit_hideout_bounty", icon: 'crosshairs', type: 'settlement' },
    "echo_scarred_summit": { id: "echo_scarred_summit", name: "Puncak Berparut Gema", regionId: "TheShatteredPeaks", coords: { x: 0.5, y: 0.05 }, initialStatus: "corrupted", journalEntryId: "journal_echo_scarred_summit_warning", icon: 'cloud-off', type: 'natural' },
    "azure_forest_village": { id: "azure_forest_village", name: "Desa Hutan Azure", regionId: "TheAzureForest", coords: { x: 0.7, y: 0.2 }, initialStatus: "active", journalEntryId: "journal_azure_forest_village_life", icon: 'home', type: 'town' },
    "coral_grotto_market": { id: "coral_grotto_market", name: "Pasar Gua Karang", regionId: "TheSunkenCity", coords: { x: 0.2, y: 0.6 }, initialStatus: "active", journalEntryId: "journal_coral_grotto_trade", icon: 'store', type: 'settlement' },
    "ancient_cloud_library": { id: "ancient_cloud_library", name: "Perpustakaan Awan Kuno", regionId: "TheFloatingIslands", coords: { x: 0.8, y: 0.4 }, initialStatus: "unknown", journalEntryId: "journal_ancient_cloud_library_lore", icon: 'book', type: 'ruins' }
};

// --- Placeholder for other World related data from user prompt ---
// WEATHER_DATA - tidak ada di gameData.js yang diberikan sebelumnya.
// REGIONAL_EVENT_TEMPLATES - tidak ada di gameData.js yang diberikan sebelumnya.
// REGION_TERRAIN_TRANSFORMATIONS - tidak ada di gameData.js yang diberikan sebelumnya.
// NATURAL_DISASTER_TEMPLATES - tidak ada di gameData.js yang diberikan sebelumnya.
// WORLD_HAZARDS - tidak ada di gameData.js yang diberikan sebelumnya.
// SAGA_TEMPLATES - tidak ada di gameData.js yang diberikan sebelumnya.
// COSMIC_RESTRUCTURING_COSTS - tidak ada di gameData.js yang diberikan sebelumnya.
// ANOMALY_DATA - tidak ada di gameData.js yang diberikan sebelumnya.
// FUNDAMENTAL_CONSTANTS_DATA - tidak ada di gameData.js yang diberikan sebelumnya.
// REALM_DESIGN_MODULE_TEMPLATES - tidak ada di gameData.js yang diberikan sebelumnya.
// TIME_FLOW_MANIPULATION_PROTOCOLS - tidak ada di gameData.js yang diberikan sebelumnya.
// CAUSALITY_REWIRE_TOOLS - tidak ada di gameData.js yang diberikan sebelumnya.