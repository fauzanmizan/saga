// js/features/forger/renderers/forgerWorldForgeRenderer.js

// == MODIFIED BY: Tim 3.B ==
// == TANGGAL: 2025-06-24, 23:35 ==
// == PERIHAL: Implementasi Fase IV - Evolusi Dunia Lanjutan: Forger Macro Events & Legacy Display ==
// - Menambahkan UI untuk memicu Global World Events.
// - Menampilkan total Legacy Points.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:28 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Konflik & Evolusi Faksi NPC (Client-side) & Dinamika Dunia Makro ==
// - Di getHtml(), menambahkan form/tombol untuk Forger memicu "Event Perang Wilayah" secara manual.
// - Di getHtml(), menambahkan form/input untuk Forger mengatur `resourceMultipliers` global.
// - Memperbarui dokumentasi di header file.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:20 WITA ==
// == PERIHAL: Modul Renderer untuk Halaman Tempaan Dunia (Forger) ==
// - Menambahkan form/tombol untuk Forger memicu "Event Perang Wilayah" secara manual.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 00:22 WITA ==
// == PERIHAL: Modul Renderer untuk Halaman Tempaan Dunia (Forger) ==
// - Berisi semua logika rendering dan event listener untuk form pengaturan dunia.
// - Diimpor dan dipanggil oleh forgerPageRenderer.js.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-25, 13:09 ==
// == PERIHAL: Integrasi Massif GameData.js ke ForgerWorldForgeRenderer.js ==
// - Memperbarui `getHtml` untuk membuat dropdown `GLOBAL_WORLD_EVENTS` dinamis, termasuk persyaratan target.
// - Memperbarui `getHtml` untuk menampilkan ringkasan status faksi dan populasi NPC.
// - Memperbarui `attachEventListeners` untuk mengelola visibilitas input target berdasarkan event yang dipilih.
// - Memperbarui `handleTriggerGlobalWorldEvent` untuk meneruskan opsi target ke WorldManager.
// ===========================================

import { UIManager } from '../../../uiManager.js';
import { updateDocument } from '../../../firebaseService.js';
import { GLOBAL_WORLD_EVENTS, REGIONS_DATA, FACTIONS_DATA, WORLD_LANDMARKS, NPC_ROLES } from '../../../gameData.js'; // Import data baru dari gameData.js

let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstance;
let WorldManagerInstance;

export const ForgerWorldForgeRenderer = {
    setDependencies(db, DB_DOC_ID, saveDB, worldManager) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstance = saveDB;
        WorldManagerInstance = worldManager;
    },

    getHtml() {
        const worldData = dbInstance.world;
        const regions = Object.values(worldData.regions || {});
        const factions = Object.values(worldData.factions || {});
        const npcs = Object.values(dbInstance.npc_souls || {}); // Access npc_souls

        const regionOptions = regions.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
        const factionOptions = factions.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
        const landmarkOptions = Object.values(worldData.landmarks || {}) // Use WORLD_LANDMARKS from dbInstance
                                    .map(l => `<option value="${l.id}">${l.name} (${WorldManagerInstance.getRegionName(l.regionId)})</option>`)
                                    .join('');

        // Get current resource multipliers
        // Ensure resourceMultipliers exists and is structured correctly (e.g., world.resourceMultipliers.echo_shard)
        const resourceMultipliers = worldData.resourceMultipliers && worldData.resourceMultipliers.material ?
                                    worldData.resourceMultipliers : // Assuming a new structure per type, or fallback
                                    { 'echo_shard': { 'TheCentralNexus': 1.0 }, 'glimmer_crystal': { 'TheLuminousPlains': 1.0 } }; // Simplified fallback structure

        // Calculate Faction Summaries
        const factionSummaries = factions.map(faction => {
            let totalInfluence = 0;
            for (const regionId in faction.influence) {
                totalInfluence += faction.influence[regionId];
            }
            // Determine faction status/color based on global reputation (if applicable) or influence
            let statusColor = 'text-slate-400';
            let statusIcon = 'dot'; // Default icon
            if (faction.id === 'TheEchoCult' && totalInfluence > 100) { statusColor = 'text-red-400'; statusIcon = 'skull'; }
            else if (faction.id === 'TheLuminousGuardians' && totalInfluence > 100) { statusColor = 'text-emerald-400'; statusIcon = 'sparkles'; }
            // Add more specific faction status logic here
            return `
                <div class="glass-container p-3 rounded-lg flex items-center justify-between">
                    <div>
                        <h5 class="text-white font-semibold">${faction.name}</h5>
                        <p class="text-slate-400 text-sm">Tipe: ${faction.type.replace(/_/g, ' ')}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-slate-300 text-sm">Pengaruh: ${totalInfluence.toFixed(0)}</p>
                        <p class="${statusColor} text-xs"><i data-feather="${statusIcon}" class="w-3 h-3 inline-block mr-1"></i>Status</p>
                    </div>
                </div>
            `;
        }).join('');

        // Calculate NPC Population Summary
        const npcRoleCounts = {};
        for (const roleId in NPC_ROLES) {
            npcRoleCounts[roleId] = 0;
        }
        npcs.forEach(npc => {
            if (npc.role && NPC_ROLES[npc.role.toUpperCase()]) {
                npcRoleCounts[npc.role.toUpperCase()]++;
            }
        });
        const npcPopulationSummary = Object.keys(npcRoleCounts).map(roleId => {
            if (npcRoleCounts[roleId] > 0) {
                const roleDef = NPC_ROLES[roleId];
                return `<p class="text-slate-300 text-sm">${roleDef.description}: <span class="font-bold">${npcRoleCounts[roleId]}</span></p>`;
            }
            return '';
        }).join('');


        // Siapkan opsi untuk dropdown Global World Events
        const globalEventOptions = Object.values(GLOBAL_WORLD_EVENTS).map(event => `
            <option value="${event.id}" 
                    data-requires-region="${event.requiresTargetRegion || false}" 
                    data-requires-faction="${event.requiresTargetFaction || false}"
                    data-requires-landmark="${event.possibleLandmarks && event.possibleLandmarks.length > 0 || false}"
                    data-has-forger-choice="${event.consequences.forgerChoicePrompt ? true : false}">
                ${event.name}
            </option>
        `).join('');

        return `
            <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                <h3 class="text-3xl font-serif font-bold text-white tracking-wider mb-6">Penempaan Dunia</h3>
                <p class="text-slate-400 mb-8">Sebagai The Forger, Anda memiliki kendali atas takdir Saga. Bentuklah dunia sesuai keinginan Anda.</p>

                <!-- Total Legacy Points Display -->
                <div class="mb-8 p-4 bg-indigo-800 bg-opacity-30 rounded-lg border border-indigo-700 shadow-inner">
                    <h4 class="text-xl font-bold text-white mb-2">Total Warisan Terkumpul</h4>
                    <p class="text-amber-300 text-3xl font-bold">${worldData.totalLegacyPoints || 0} Poin Legacy</p>
                    <p class="text-slate-400 text-sm mt-1">Ini adalah akumulasi kekuatan dan pengaruh Anda di seluruh Saga yang telah Anda tempa.</p>
                </div>

                <!-- NEW: Faction Status Summary -->
                <div class="mb-8 p-6 bg-slate-800 bg-opacity-50 rounded-lg border border-slate-700 shadow-lg">
                    <h4 class="text-xl font-bold text-white mb-4">Status Faksi Global</h4>
                    <p class="text-slate-400 text-sm mb-4">Ringkasan pengaruh faksi di seluruh dunia.</p>
                    <div class="space-y-3">
                        ${factionSummaries}
                    </div>
                </div>

                <!-- NEW: NPC Population Summary -->
                <div class="mb-8 p-6 bg-slate-800 bg-opacity-50 rounded-lg border border-slate-700 shadow-lg">
                    <h4 class="text-xl font-bold text-white mb-4">Ringkasan Populasi NPC</h4>
                    <p class="text-slate-400 text-sm mb-4">Distribusi peran NPC di dunia.</p>
                    <div class="space-y-2">
                        ${npcPopulationSummary}
                    </div>
                </div>

                <!-- Global World Events Trigger -->
                <div class="mb-8 p-6 bg-slate-800 bg-opacity-50 rounded-lg border border-slate-700 shadow-lg">
                    <h4 class="text-xl font-bold text-white mb-4">Picu Event Makro Dunia</h4>
                    <p class="text-slate-400 text-sm mb-4">Mengarahkan takdir dunia dengan memicu peristiwa-peristiwa berskala besar.</p>

                    <div class="mb-4">
                        <label for="world-event-select" class="block text-slate-300 text-sm font-semibold mb-2">Pilih Event:</label>
                        <select id="world-event-select" class="glass-input w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white">
                            ${globalEventOptions}
                        </select>
                    </div>

                    <div id="event-target-region-container" class="mb-4" style="display: none;">
                        <label for="event-target-region" class="block text-slate-300 text-sm font-semibold mb-2">Pilih Wilayah Target:</label>
                        <select id="event-target-region" class="glass-input w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white">
                            ${regionOptions}
                        </select>
                    </div>

                    <div id="event-target-faction-container" class="mb-4" style="display: none;">
                        <label for="event-target-faction-1" class="block text-slate-300 text-sm font-semibold mb-2">Pilih Faksi Target 1:</label>
                        <select id="event-target-faction-1" class="glass-input w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white">
                            ${factionOptions}
                        </select>
                        <label for="event-target-faction-2" class="block text-slate-300 text-sm font-semibold mt-2 mb-2">Pilih Faksi Target 2 (jika Perang):</label>
                        <select id="event-target-faction-2" class="glass-input w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white">
                            ${factionOptions}
                        </select>
                    </div>

                    <div id="event-target-landmark-container" class="mb-4" style="display: none;">
                        <label for="event-target-landmark" class="block text-slate-300 text-sm font-semibold mb-2">Pilih Landmark Target:</label>
                        <select id="event-target-landmark" class="glass-input w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white">
                            ${landmarkOptions}
                        </select>
                    </div>

                    <button id="trigger-world-event-btn" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-md w-full">
                        Picu Event Dunia
                    </button>
                </div>

                <!-- Existing Sections for Forger if any -->
                 <h4 class="text-xl font-serif text-white tracking-wider mt-12 mb-4 border-b border-border-color pb-2">Pengaturan Dunia Dasar</h4>
                <div class="space-y-6">
                    <div>
                        <label for="submission-mantra" class="text-sm font-bold text-slate-400 block mb-2">Mantra Penyerahan Jiwa Baru</label>
                        <input type="text" id="submission-mantra" class="glass-input"
                               value="${worldData.submissionMantra || ''}" placeholder="Mantra untuk jiwa baru...">
                        <p class="text-sm text-slate-500 mt-1">Mantra yang harus diucapkan jiwa baru untuk terukir di dunia ini.</p>
                    </div>

                    <div>
                        <label for="cosmic-season" class="text-sm font-bold text-slate-400 block mb-2">Musim Kosmik Saat Ini</label>
                        <input type="text" id="cosmic-season" class="glass-input"
                               value="${worldData.cosmicCycle?.currentCycleId ? GLOBAL_WORLD_EVENTS[worldData.cosmicCycle.currentCycleId]?.name || worldData.cosmicCycle.currentCycleId : 'Belum diatur'}" placeholder="Contoh: Winter of Whispers" readonly>
                        <p class="text-sm text-slate-500 mt-1">Gelar atau tema yang menggambarkan era saat ini.</p>
                    </div>

                    <div>
                        <label for="apotheosis-date" class="text-sm font-bold text-slate-400 block mb-2">Tanggal Apoteosis (Akhir Saga)</label>
                        <input type="datetime-local" id="apotheosis-date" class="glass-input"
                               value="${worldData.apotheosisDate ? new Date(worldData.apotheosisDate).toISOString().slice(0, 16) : ''}">
                        <p class="text-sm text-slate-500 mt-1">Momen krusial di masa depan, gunakan format tanggal dan waktu lokal.</p>
                    </div>

                    <button id="save-world-settings-button" class="glass-button primary-button w-full">
                        <i data-feather="save" class="w-5 h-5 mr-2"></i>
                        Simpan Pengaturan Dunia
                    </button>
                </div>

                <h4 class="text-xl font-serif text-white tracking-wider mt-12 mb-4 border-b border-border-color pb-2">Manajemen Ekonomi Global</h4>
                <div class="space-y-4">
                    <p class="text-slate-400">Sesuaikan kelangkaan sumber daya tertentu.</p>
                    <div>
                        <label for="multiplier-echo-shard" class="text-sm font-bold text-slate-400 block mb-1">Multiplikator Pecahan Gema:</label>
                        <input type="number" id="multiplier-echo-shard" class="glass-input w-32" value="${(resourceMultipliers['echo_shard'] && resourceMultipliers['echo_shard'][Object.keys(resourceMultipliers['echo_shard'])[0]]) ? resourceMultipliers['echo_shard'][Object.keys(resourceMultipliers['echo_shard'])[0]].toFixed(2) : '1.00'}" step="0.01" min="0.1" max="2.0">
                    </div>
                    <div>
                        <label for="multiplier-glimmer-crystal" class="text-sm font-bold text-slate-400 block mb-1">Multiplikator Kristal Cahaya:</label>
                        <input type="number" id="multiplier-glimmer-crystal" class="glass-input w-32" value="${(resourceMultipliers['glimmer_crystal'] && resourceMultipliers['glimmer_crystal'][Object.keys(resourceMultipliers['glimmer_crystal'])[0]]) ? resourceMultipliers['glimmer_crystal'][Object.keys(resourceMultipliers['glimmer_crystal'])[0]].toFixed(2) : '1.00'}" step="0.01" min="0.1" max="2.0">
                    </div>
                    <button id="save-resource-multipliers-btn" class="glass-button primary-button w-full">
                        <i data-feather="dollar-sign" class="w-5 h-5 mr-2"></i>
                        Simpan Multiplikator Sumber Daya
                    </button>
                </div>
            </div>
        `;
    },

    attachEventListeners() {
        // Attach listeners for basic world settings
        const saveButton = document.getElementById('save-world-settings-button');
        if (saveButton) {
            saveButton.onclick = () => this.saveWorldSettings();
        }

        // Attach listeners for Global World Events
        const eventSelect = document.getElementById('world-event-select');
        const targetRegionContainer = document.getElementById('event-target-region-container');
        const targetFactionContainer = document.getElementById('event-target-faction-container');
        const targetLandmarkContainer = document.getElementById('event-target-landmark-container'); // NEW landmark container
        const triggerWorldEventBtn = document.getElementById('trigger-world-event-btn');

        if (eventSelect) {
            eventSelect.addEventListener('change', () => {
                const selectedOption = eventSelect.options[eventSelect.selectedIndex];
                const requiresRegion = selectedOption.dataset.requiresRegion === 'true';
                const requiresFaction = selectedOption.dataset.requiresFaction === 'true';
                const requiresLandmark = selectedOption.dataset.requiresLandmark === 'true'; // NEW check for landmark
                const hasForgerChoice = selectedOption.dataset.hasForgerChoice === 'true'; // NEW check for Forger choice

                targetRegionContainer.style.display = requiresRegion ? 'block' : 'none';
                targetFactionContainer.style.display = requiresFaction ? 'block' : 'none';
                targetLandmarkContainer.style.display = requiresLandmark ? 'block' : 'none'; // Show/hide landmark input

                // Logic for Forger choices in dynamic events
                if (hasForgerChoice) {
                    // This is where Forger might be prompted for a choice specific to the event
                    // For now, it will be handled inside WorldManager.triggerGlobalWorldEvent
                    // when it encounters `forgerChoicePrompt`.
                }
            });
            eventSelect.dispatchEvent(new Event('change')); // Trigger change once on load to set initial display state
        }

        if (triggerWorldEventBtn) {
            triggerWorldEventBtn.onclick = () => this.handleTriggerGlobalWorldEvent();
        }

        // Attach listeners for resource multipliers
        const saveResourceMultipliersBtn = document.getElementById('save-resource-multipliers-btn');
        if (saveResourceMultipliersBtn) {
            saveResourceMultipliersBtn.onclick = () => this.handleSaveResourceMultipliers();
        }

        // Ensure icons are replaced
        feather.replace();
    },

    async saveWorldSettings() {
        const submissionMantra = document.getElementById('submission-mantra').value.trim();
        // Cosmic season is now read-only, updated by WorldManager.advanceCosmicCycle
        const apotheosisDateInput = document.getElementById('apotheosis-date').value;
        let apotheosisDate = null;

        if (apotheosisDateInput) {
            try {
                apotheosisDate = new Date(apotheosisDateInput).toISOString();
            } catch (e) {
                UIManager.showNotification('Invalid Apotheosis Date format.', 'alert-triangle', 'error');
                return;
            }
        }

        if (!submissionMantra) {
            UIManager.showNotification('Submission Mantra cannot be empty.', 'alert-triangle', 'error');
            return;
        }

        const updatedWorldData = {
            ...dbInstance.world,
            submissionMantra: submissionMantra,
            // cosmicSeason is managed by WorldManager
            apotheosisDate: apotheosisDate,
        };

        UIManager.showLoading("Saving world settings...");

        // Directly update dbInstance.world and let saveDBInstance handle Firebase update
        dbInstance.world = updatedWorldData;
        await saveDBInstance(true); // Request save to Firebase

        UIManager.hideLoading();
        UIManager.showNotification('World settings updated successfully!', 'check-circle', 'success');

        // Re-render the Forger page to ensure UI reflects any changes (e.g., cosmetic)
        ForgerWorldForgeRenderer.renderForgerPage(); // Call directly
        // No need to call WorldManagerInstance.updateWorldResonance here, it's called periodically by App.
    },

    async handleTriggerGlobalWorldEvent() {
        const selectedEventId = document.getElementById('world-event-select').value;
        const eventDef = GLOBAL_WORLD_EVENTS[selectedEventId];

        if (!eventDef) {
            UIManager.showNotification('Invalid world event selected.', 'alert-triangle', 'error');
            return;
        }

        const options = {};
        if (eventDef.requiresTargetRegion) {
            const targetRegionSelect = document.getElementById('event-target-region');
            if (!targetRegionSelect || !targetRegionSelect.value) {
                UIManager.showNotification('Please select a target region for this event.', 'alert-triangle', 'error');
                return;
            }
            options.targetRegionId = targetRegionSelect.value;
            options.targetRegionName = WorldManagerInstance.getRegionName(options.targetRegionId); // Pass name for chronicle
        }

        if (eventDef.requiresTargetFaction) {
            const targetFactionSelect1 = document.getElementById('event-target-faction-1');
            const targetFactionSelect2 = document.getElementById('event-target-faction-2');
            if (!targetFactionSelect1 || !targetFactionSelect1.value || !targetFactionSelect2 || !targetFactionSelect2.value) {
                UIManager.showNotification('Please select two target factions for this event.', 'alert-triangle', 'error');
                return;
            }
            options.targetFactionIds = [targetFactionSelect1.value, targetFactionSelect2.value];
            // No need to pass faction names explicitly, WorldManager can fetch them.
        }

        if (eventDef.possibleLandmarks && eventDef.possibleLandmarks.length > 0) { // NEW: Handle target landmark
            const targetLandmarkSelect = document.getElementById('event-target-landmark');
            if (!targetLandmarkSelect || !targetLandmarkSelect.value) {
                UIManager.showNotification('Please select a target landmark for this event.', 'alert-triangle', 'error');
                return;
            }
            options.targetLandmarkId = targetLandmarkSelect.value;
            options.targetLandmarkName = WorldManagerInstance.getLandmarkName(options.targetLandmarkId); // Pass name for chronicle
        }


        UIManager.showModal(
            'Confirm Global Event Trigger',
            `Are you sure you want to trigger "${eventDef.name}"? This will have significant consequences on the world!`,
            [
                { text: 'Yes, Trigger Event', isPrimary: true, consequence: async () => {
                    UIManager.showLoading(`Triggering "${eventDef.name}"...`);
                    // This call will now handle Forger choices internally via WorldManager
                    await WorldManagerInstance.triggerGlobalWorldEvent(selectedEventId, options);
                    UIManager.hideLoading();
                    // Notification for success is now handled by WorldManager itself after choice or direct application
                    UIManager.closeModal(); // Close confirmation modal
                    ForgerWorldForgeRenderer.renderForgerPage(); // Re-render to reflect changes
                }},
                { text: 'Cancel', isPrimary: false, consequence: () => { UIManager.closeModal(); } }
            ]
        );
    },

    async handleSaveResourceMultipliers() {
        // Assuming resource multipliers are stored per resource type per region.
        // For simplicity, updating just the Echo Shard and Glimmer Crystal multiplier for a default region.
        // In a full implementation, this would involve selecting region and resource type.
        const multiplierEchoShard = parseFloat(document.getElementById('multiplier-echo-shard').value);
        const multiplierGlimmerCrystal = parseFloat(document.getElementById('multiplier-glimmer-crystal').value);

        if (isNaN(multiplierEchoShard) || isNaN(multiplierGlimmerCrystal) || multiplierEchoShard <= 0 || multiplierGlimmerCrystal <= 0) {
            UIManager.showNotification('Multipliers must be positive numbers.', 'alert-triangle', 'error');
            return;
        }

        UIManager.showLoading("Saving resource multipliers...");

        // Update dbInstance directly for resource multipliers
        // Assuming 'material' or 'artifact' type for these resources
        if (!dbInstance.world.resourceMultipliers) dbInstance.world.resourceMultipliers = {};
        if (!dbInstance.world.resourceMultipliers['artifact']) dbInstance.world.resourceMultipliers['artifact'] = {};

        // Apply to a default region for demo purposes
        const defaultRegionId = Object.keys(REGIONS_DATA)[0]; // Use first region as default
        dbInstance.world.resourceMultipliers['artifact']['echo_shard'] = multiplierEchoShard;
        dbInstance.world.resourceMultipliers['artifact']['glimmer_crystal'] = multiplierGlimmerCrystal;
        
        await saveDBInstance(true); // Request save to Firebase

        UIManager.hideLoading();
        UIManager.showNotification('Resource multipliers updated successfully!', 'check-circle', 'success');
        ForgerWorldForgeRenderer.renderForgerPage();
    },

    // Entry point for rendering the Forger World Forge page
    renderForgerPage: () => {
        const forgerContentArea = document.getElementById('forger-content-area'); // Assuming this exists in your HTML
        if (forgerContentArea) {
            forgerContentArea.innerHTML = ForgerWorldForgeRenderer.getHtml();
            ForgerWorldForgeRenderer.attachEventListeners();
            feather.replace(); // Ensure icons are rendered
        }
    }
};
