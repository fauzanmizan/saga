// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:28 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Konflik & Evolusi Faksi NPC (Client-side) & Dinamika Dunia Makro ==
// - Di renderWandererList(), menampilkan `factionAffiliation` untuk setiap Pengembara dan NPC.
// - Di renderRegionsStatus(), menampilkan `dominantFaction` dan menerapkan kelas CSS.
// - Di getHtml(), menambahkan bagian "Peta Pengaruh Faksi" yang merender faksi-faksi utama dan total pengaruhnya.
// - Memperbarui `renderNpcDetailForForger()` untuk menampilkan `factionAffiliation` dan `influenceScore` NPC.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:20 WITA ==
// == PERIHAL: Modul Renderer untuk Halaman Observatorium Kosmik (Forger) ==
// - Di renderRegionsStatus(), menampilkan `dominantFaction` dan menerapkan kelas CSS.
// - Di getObservatoryHtml(), menambahkan bagian "Peta Pengaruh Faksi".
// - Memastikan `renderNpcDetailForForger` dapat dipanggil dari sini saat mengklik NPC.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 00:22 WITA ==
// == PERIHAL: Modul Renderer untuk Halaman Observatorium Kosmik (Forger) ==
// - Berisi semua logika rendering dan event listener untuk Papan Peringkat Jiwa dan Status Nexus Wilayah.
// - Diimpor dan dipanggil oleh forgerPageRenderer.js.
// ===========================================

import { UIManager } from '../../../uiManager.js';

let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstance;
let WorldManagerInstance;
let NPC_PERSONALITY_TRAITS_Instance;
let NPC_HEALTH_STATES_Instance;
let NPC_LIFESTAGES_Instance;
let FACTION_TYPES_Instance;

export const ForgerObservatoryRenderer = {
    setDependencies(db, DB_DOC_ID, saveDB, worldManager, npcPersonalityTraits, npcHealthStates, npcLifeStages, factionTypes) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstance = saveDB;
        WorldManagerInstance = worldManager;
        NPC_PERSONALITY_TRAITS_Instance = npcPersonalityTraits;
        NPC_HEALTH_STATES_Instance = npcHealthStates;
        NPC_LIFESTAGES_Instance = npcLifeStages;
        FACTION_TYPES_Instance = factionTypes;
    },

    getHtml() {
        // Prepare Faction Influence data
        const factionInfluenceHtml = FACTION_TYPES_Instance.map(factionId => {
            const faction = dbInstance.world.factions[factionId];
            if (!faction) return ''; // Skip if faction data is missing

            const totalInfluence = Object.values(faction.influence).reduce((sum, val) => sum + val, 0);

            return `
                <tr class="glass-table-row">
                    <td class="p-4 text-slate-300 font-semibold">${faction.name}</td>
                    <td class="p-4 text-slate-300">${faction.alignmentBias.charAt(0).toUpperCase() + faction.alignmentBias.slice(1)}</td>
                    <td class="p-4 text-slate-300">${totalInfluence.toFixed(0)}</td>
                </tr>
            `;
        }).join('');

        return `
            <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6">Papan Peringkat Jiwa</h3>

                <div class="mb-4 flex flex-wrap items-center space-x-4">
                    <span class="text-slate-400 text-sm mb-2 md:mb-0">Urutkan berdasarkan:</span>
                    <select id="sort-souls-by" class="glass-input p-2 rounded mb-2 md:mb-0">
                        <option value="soulRank">Peringkat Jiwa</option>
                        <option value="intention">Intention (Alignment)</option>
                        <option value="consistencyStreak">Consistency Streak</option>
                        <option value="xp">Total XP</option>
                        <option value="age">Usia (NPC)</option>
                        <option value="reputation">Reputasi (NPC)</option>
                    </select>
                    <button id="refresh-souls-list" class="glass-button min-w-max"><i data-feather="refresh-cw" class="w-4 h-4 mr-2"></i> Segarkan</button>
                </div>

                <div class="overflow-x-auto glass-table-container">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="glass-table-header">
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Nama Abadi</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Peringkat Jiwa</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Intention</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Streak</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Tipe</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Usia / Tahap Hidup</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Kesehatan</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Faksi</th>
                            </tr>
                        </thead>
                        <tbody id="wanderer-list-body"></tbody>
                    </table>
                </div>
                <h4 class="text-xl font-serif text-white tracking-wider mt-12 mb-4 border-b border-border-color pb-2">Status Nexus Wilayah</h4>
                <div id="regions-status-list" class="space-y-4">
                </div>

                <h4 class="text-xl font-serif text-white tracking-wider mt-12 mb-4 border-b border-border-color pb-2">Peta Pengaruh Faksi</h4>
                <div class="overflow-x-auto glass-table-container">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="glass-table-header">
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Faksi</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Bias Aligment</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Pengaruh Dunia</th>
                            </tr>
                        </thead>
                        <tbody id="faction-influence-body">
                            ${factionInfluenceHtml}
                        </tbody>
                    </table>
                </div>
            </div>`;
    },

    setupPage() {
        this.renderWandererList();

        const sortSelect = document.getElementById('sort-souls-by');
        const refreshButton = document.getElementById('refresh-souls-list');

        if (sortSelect) {
            sortSelect.onchange = (e) => {
                this.renderWandererList(e.target.value);
            };
        }
        if (refreshButton) {
            refreshButton.onclick = async () => {
                UIManager.showLoading("Memperbarui papan peringkat...");
                await WorldManagerInstance.simulateNpcProgress();
                await WorldManagerInstance.updateWorldResonance();
                this.renderWandererList(sortSelect ? sortSelect.value : 'soulRank');
                UIManager.hideLoading();
                UIManager.showNotification('Papan peringkat diperbarui!', 'check', 'bg-gradient-to-r from-blue-400 to-indigo-400');
            };
        }
        this.renderFactionInfluence();
    },

    renderWandererList(sortBy = 'soulRank') {
        const tbody = document.getElementById('wanderer-list-body');
        const allSouls = [
            ...Object.values(dbInstance.wanderers),
            ...Object.values(dbInstance.npc_souls || {})
        ];

        if (allSouls.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="p-4 text-center text-slate-500">Belum ada jiwa yang menyerahkan diri pada takdir.</td></tr>`;
            return;
        }

        allSouls.sort((a, b) => {
            if (sortBy === 'soulRank') {
                return b.soulRank - a.soulRank;
            } else if (sortBy === 'intention') {
                return b.alignment.intention - a.alignment.intention;
            } else if (sortBy === 'consistencyStreak') {
                return b.consistencyStreak - a.consistencyStreak;
            } else if (sortBy === 'xp') {
                return b.xp - a.xp;
            } else if (sortBy === 'age') { // Sort by age for NPCs
                return (a.age || 0) - (b.age || 0);
            } else if (sortBy === 'reputation') { // Sort by reputation for NPCs
                return (b.reputation || 0) - (a.reputation || 0);
            }
            return 0;
        });

        const rowsHtml = allSouls
            .map(s => {
                const lifeStage = s.lifeStage ? NPC_LIFESTAGES_Instance.find(ls => ls.stage === s.lifeStage)?.stage || s.lifeStage : 'N/A';
                const healthState = s.healthState ? NPC_HEALTH_STATES_Instance[s.healthState.toUpperCase()]?.description || s.healthState : 'N/A';
                const factionName = s.factionAffiliation || 'N/A';
                const traits = s.personalityTraits?.map(traitId => {
                    const trait = NPC_PERSONALITY_TRAITS_Instance.find(t => t.id === traitId);
                    return trait ? trait.name : traitId;
                }).join(', ') || 'None';

                return `
                    <tr class="glass-table-row transition-colors cursor-pointer animate-fade-in-up" data-soul-name="${s.name}" data-soul-type="${s.role}">
                        <td class="p-4 font-bold text-lg text-slate-100">${s.name}</td>
                        <td class="p-4 font-mono text-slate-300">${s.soulRank}</td>
                        <td class="p-4 text-slate-300">${s.alignment.intention} / ${s.alignment.echo}</td>
                        <td class="p-4 font-mono text-slate-300">${s.consistencyStreak}</td>
                        <td class="p-4 text-slate-500 capitalize">${s.role}</td>
                        <td class="p-4 text-slate-400">${s.age || 'N/A'} (${lifeStage})</td>
                        <td class="p-4 text-slate-400">${healthState}</td>
                        <td class="p-4 text-slate-400">${factionName}</td>
                    </tr>
                `;
            }).join('');
        tbody.innerHTML = rowsHtml;

        tbody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', () => {
                const soulName = row.dataset.soulName;
                const soulType = row.dataset.soulType;
                const forgerPageRendererModule = import('../forgerPageRenderer.js');

                if (soulType === 'wanderer') {
                    forgerPageRendererModule.then(module => {
                        module.ForgerPageRenderer.renderForgerPage({ pageId: 'wanderer_detail', wandererName: soulName });
                    });
                } else if (soulType === 'npc') {
                    // Call a specific NPC detail renderer function if it exists
                    ForgerObservatoryRenderer.renderNpcDetailForForger(soulName);
                }
            });
        });

        WorldManagerInstance.renderRegionsStatus();
    },
    
    // Moved from forgerPageRenderer.js
    renderNpcDetailForForger: (npcName) => {
        const npc = dbInstance.npc_souls[npcName];
        if (!npc) {
            UIManager.showNotification(`NPC ${npcName} tidak ditemukan.`, 'x-circle', 'bg-red-500');
            return;
        }

        const detailHtml = `
            <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-4">Detail Jiwa NPC: ${npc.name}</h3>
                <p class="text-slate-400">Arketipe: ${npc.archetype}</p>
                <p class="text-slate-400">Peringkat Jiwa: ${npc.soulRank}</p>
                <p class="text-slate-400">Usia: ${npc.age} (${npc.lifeStage})</p>
                <p class="text-slate-400">Kesehatan: ${NPC_HEALTH_STATES_Instance[npc.healthState.toUpperCase()]?.description || npc.healthState}</p>
                <p class="text-slate-400">Traits: ${npc.personalityTraits?.map(traitId => {
                    const trait = NPC_PERSONALITY_TRAITS_Instance.find(t => t.id === traitId);
                    return trait ? trait.name : traitId;
                }).join(', ') || 'None'}</p>
                <p class="text-slate-400">Reputasi: ${npc.reputation}</p>
                <p class="text-slate-400">Faksi: ${npc.factionAffiliation || 'N/A'}</p>
                <p class="text-slate-400">Pengaruh Faksi: ${npc.influenceScore || 'N/A'}</p>
                <p class="text-slate-400">Wilayah Saat Ini: ${dbInstance.world.regions[npc.currentRegion]?.name || 'N/A'}</p>
                <h4 class="text-xl font-serif text-white tracking-wider mt-6 mb-4 border-b border-border-color pb-2">Logika NPC</h4>
                <p class="text-slate-400">Echo: ${npc.alignment.echo.toFixed(0)}, Intention: ${npc.alignment.intention.toFixed(0)}</p>
                <p class="text-slate-400">Terakhir disimulasi: ${new Date(npc.lastSimulatedDate).toLocaleString()}</p>
                
                <button id="back-to-observatory-from-npc-detail" class="glass-button flex items-center text-slate-400 hover:text-white mt-6 transition-colors">
                    <i data-feather="arrow-left" class="w-5 h-5 mr-2"></i>
                    Kembali ke Observatorium
                </button>
            </div>
        `;

        const pageContainer = document.getElementById('forger-page-container');
        const headerTitle = document.querySelector('#forger-header-title h2');

        headerTitle.textContent = `Detail NPC: ${npc.name}`;
        UIManager.render(pageContainer, detailHtml);
        feather.replace();

        document.getElementById('back-to-observatory-from-npc-detail').onclick = () => {
            // Need to import ForgerPageRenderer dynamically here if not already imported globally
            import('../forgerPageRenderer.js').then(module => {
                module.ForgerPageRenderer.renderForgerPage({ pageId: 'observatory' });
            });
        };
    },

    renderFactionInfluence() {
        const tbody = document.getElementById('faction-influence-body');
        if (!tbody) return;

        const factionInfluenceHtml = FACTION_TYPES_Instance.map(factionId => {
            const faction = dbInstance.world.factions[factionId];
            if (!faction) return ''; // Skip if faction data is missing

            const totalInfluence = Object.values(faction.influence).reduce((sum, val) => sum + val, 0);

            return `
                <tr class="glass-table-row">
                    <td class="p-4 text-slate-300 font-semibold">${faction.name}</td>
                    <td class="p-4 text-slate-300">${faction.alignmentBias.charAt(0).toUpperCase() + faction.alignmentBias.slice(1)}</td>
                    <td class="p-4 text-slate-300">${totalInfluence.toFixed(0)}</td>
                </tr>
            `;
        }).join('');
        UIManager.render(tbody, factionInfluenceHtml);
    }
};