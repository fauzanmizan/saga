// js/data/metaGame.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-27, 12:50 WITA ==
// == PERIHAL: Refactoring GameData.js - Pemindahan Data Meta-Game ke metaGame.js ==
// - Menampung semua data statis terkait Legacy, potensi, pertumbuhan eksponensial, efek kupu-kupu, dll.
// ===========================================

/**
 * @typedef {object} LegacyCriterion
 * @property {string} id - Unique criterion ID.
 * @property {string} description - Description of the Legacy criterion.
 * @property {number} points - Amount of Legacy Points granted.
 * @property {string} [forgerDecisionId] - Specific Forger decision required to unlock this.
 */
export const LEGACY_CRITERIA = [
    { id: 'soul_rank_milestone_10', description: 'Mencapai Peringkat Jiwa 10.', points: 50 },
    { id: 'soul_rank_milestone_25', description: 'Mencapai Peringkat Jiwa 25.', points: 150 },
    { id: 'soul_rank_milestone_50', description: 'Mencapai Peringkat Jiwa 50.', points: 300 },
    { id: 'intention_dominant_apotheosis', description: 'Mengakhiri Saga dengan Intention dominan (>70%).', points: 100 },
    { id: 'echo_dominant_apotheosis', description: 'Mengakhiri Saga dengan Echo dominan (>70%).', points: 75 },
    { id: 'nexus_sanctum_maintained', description: 'Mempertahankan status Sanctum di Central Nexus selama >30 hari.', points: 120 },
    { id: 'nexus_maelstrom_survived', description: 'Bertahan dari status Maelstrom di Central Nexus selama >30 hari.', points: 80 },
    { id: 'all_main_quests_completed', description: 'Menyelesaikan semua misi utama (placeholder).', points: 250 },
    { id: 'rare_artifact_found', description: 'Menemukan Artefak Langka.', points: 40 },
    { id: 'corrupted_npc_purified', description: 'Memurnikan NPC yang terkontaminasi (placeholder).', points: 60 },
    { id: 'regional_war_won', description: 'Memenangkan perang regional untuk Sentinel (placeholder).', points: 100 },
    { id: 'all_landmarks_discovered', description: 'Menemukan semua landmark di dunia.', points: 500 },
    { id: 'major_faction_allied', description: 'Mencapai status Sekutu dengan faksi besar.', points: 150 },
    { id: 'legendary_creature_defeated', description: 'Mengalahkan makhluk legendaris.', points: 200 },
    // NEW Legacy Criteria for Forger Actions
    { id: 'forger_famine_averted', description: 'Sebagai Forger, mencegah wabah kelaparan di wilayah.', points: 100, forgerDecisionId: 'avert_famine_decision' },
    { id: 'forger_echo_contained', description: 'Sebagai Forger, berhasil menghentikan lonjakan Gema besar.', points: 120, forgerDecisionId: 'contain_echo_spike_decision' },
    { id: 'forger_world_unified', description: 'Sebagai Forger, menyatukan faksi-faksi utama dalam aliansi damai.', points: 300, forgerDecisionId: 'unify_factions_decision' }
];

// --- Placeholder for other Meta-Game related data from user prompt ---
// POTENTIAL_METRICS - tidak ada di gameData.js yang diberikan sebelumnya.
// EXPONENTIAL_GROWTH_MODIFIERS - tidak ada di gameData.js yang diberikan sebelumnya.
// BUTTERFLY_EFFECT_TRIGGERS - tidak ada di gameData.js yang diberikan sebelumnya.
// LAW_OF_ATTRACTION_EFFECTS - tidak ada di gameData.js yang diberikan sebelumnya.
// SYMBOLIC_REAL_WORLD_TRIGGERS - tidak ada di gameData.js yang diberikan sebelumnya.
// REAL_WORLD_IMPACT_MODIFIERS - tidak ada di gameData.js yang diberikan sebelumnya.
// ORACLE_PREDICTION_TYPES - tidak ada di gameData.js yang diberikan sebelumnya.
// FORGER_REAL_WORLD_INSIGHT_COSTS - tidak ada di gameData.js yang diberikan sebelumnya.
// SAGA_BOUNDARY_IMPACTS - tidak ada di gameData.js yang diberikan sebelumnya.
// MULTIVERSE_WILL_DATA - tidak ada di gameData.js yang diberikan sebelumnya.
// COSMIC_CHESS_MOVES - tidak ada di gameData.js yang diberikan sebelumnya.
// REALITY_HYPOTHESIS_DATA - tidak ada di gameData.js yang diberikan sebelumnya.
// ABSOLUTE_INSIGHT_REWARDS - tidak ada di gameData.js yang diberikan sebelumnya.
// FINAL_FORGER_CHOICES - tidak ada di gameData.js yang diberikan sebelumnya.