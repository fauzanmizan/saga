// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 02:40 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Kontrol Takdir Personal Forger ==
// - Di getHtml(), menambahkan UI untuk:
//   - Mengubah XP, Essence of Will, Soul Rank, Atribut.
//   - Mengubah Alignment (Intention/Echo).
//   - Menambahkan/Menghapus Imprint.
//   - Mengubah currentRegion (Teleportasi).
//   - Mengaktifkan/Menonaktifkan Divine Mandate.
//   - Memicu Encounter Spesifik.
//   - Memberikan Item.
// - Mengimplementasikan logika untuk `handleUpdateWandererData`, `handleTeleportWanderer`,
//   `handleManageImprints`, `handleManageMandate`, `handleTriggerSpecificEncounter`, dan `handleGrantItem`.
// - Memastikan semua perubahan disimpan ke Firebase.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 00:22 WITA ==
// == PERIHAL: Modul Renderer untuk Halaman Detail Pengembara (Forger) ==
// - Berisi semua logika rendering dan event listener untuk detail Wanderer dan Altar Titah Agung.
// - Diimpor dan dipanggil oleh forgerPageRenderer.js.
// ===========================================

import { UIManager } from '../../../uiManager.js';
import { updateDocument } from '../../../firebaseService.js';
import { GLOBAL_ATTRIBUTES, SKILL_TREE_DATA, TRADABLE_ITEMS_DATA } from '../../../gameData.js'; // Import SKILL_TREE_DATA and TRADABLE_ITEMS_DATA

let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstance;
let GLOBAL_ATTRIBUTES_Instance;
let currentWanderer = null; // Store the currently viewed wanderer object

export const ForgerWandererDetailRenderer = {
    setDependencies(db, DB_DOC_ID, saveDB, globalAttributes) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstance = saveDB;
        GLOBAL_ATTRIBUTES_Instance = globalAttributes;
    },

    getHtml(wanderer) {
        currentWanderer = wanderer; // Set current wanderer
        const alignment = wanderer.alignment;
        const total = alignment.echo + alignment.intention;
        const intentionRatio = total > 0 ? (alignment.intention / total * 100).toFixed(1) : 50;
        const currentMandate = wanderer.divineMandate;
        const attributes = GLOBAL_ATTRIBUTES_Instance; // Use the injected instance

        // Collect all encounters for dropdown
        const allEncounters = [
            ...(dbInstance.world.encounters.whispers || []),
            ...(dbInstance.world.encounters.glimmers || [])
        ];
        const encounterOptions = allEncounters.map(enc => `<option value="${enc.id}">${enc.name} (${enc.type})</option>`).join('');

        // Collect all tradable items for dropdown
        const allItems = TRADABLE_ITEMS_DATA;
        const itemOptions = allItems.map(item => `<option value="${item.id}">${item.name}</option>`).join('');

        // Collect all regions for dropdown
        const allRegions = Object.keys(dbInstance.world.regions).map(id => ({ id: id, name: dbInstance.world.regions[id].name }));
        const regionOptions = allRegions.map(region => `<option value="${region.id}">${region.name}</option>`).join('');


        // Collect all possible imprints for dropdown
        const allImprints = [];
        for (const attr of GLOBAL_ATTRIBUTES_Instance) {
            if (SKILL_TREE_DATA[attr]) {
                for (const level in SKILL_TREE_DATA[attr]) {
                    allImprints.push(SKILL_TREE_DATA[attr][level]);
                }
            }
        }
        // Add archetype-specific skills/imprints
        const archetypeSkills = SKILL_TREE_DATA[wanderer.archetype];
        if (archetypeSkills) {
            for (const skillId in archetypeSkills) {
                 // Ensure it's not a generic level-based imprint but a specific skill
                if (archetypeSkills[skillId].id && !archetypeSkills[skillId].id.startsWith('imprint_')) {
                    allImprints.push(archetypeSkills[skillId]);
                }
            }
        }
        const imprintOptions = allImprints.map(imprint => `<option value="${imprint.id}">${imprint.name}</option>`).join('');


        return `
            <div>
                <button id="back-to-observatory" class="glass-button flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                    <i data-feather="arrow-left" class="w-5 h-5 mr-2"></i>
                    Kembali ke Observatorium
                </button>
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div class="space-y-8">
                        <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                            <div class="text-center mb-8">
                                <h3 class="text-4xl font-serif font-bold text-white tracking-wider">${wanderer.name}</h3>
                                <p class="text-lg font-semibold text-indigo-400 mt-2">Peringkat Jiwa ${wanderer.soulRank}: ${wanderer.title}</p>
                                <p class="text-sm text-slate-400">Arketipe: <span class="capitalize">${wanderer.archetype || 'N/A'}</span></p>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 class="text-xl font-serif font-bold text-white tracking-wider mb-4">Neraca Nurani</h4>
                                    <div class="glass-container p-4 rounded-lg">
                                        <div class="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                                            <div class="bg-indigo-500 h-2.5 rounded-full" style="width: ${intentionRatio}%"></div>
                                        </div>
                                        <p class="text-center mt-2 text-sm text-slate-300">${intentionRatio}% Intention</p>
                                    </div>
                                    <div class="mt-4">
                                        <label for="edit-intention" class="text-sm font-bold text-slate-400">Intention</label>
                                        <input type="number" id="edit-intention" class="glass-input" value="${wanderer.alignment.intention}">
                                    </div>
                                    <div class="mt-2">
                                        <label for="edit-echo" class="text-sm font-bold text-slate-400">Echo</label>
                                        <input type="number" id="edit-echo" class="glass-input" value="${wanderer.alignment.echo}">
                                    </div>
                                    <button data-property="alignment" class="glass-button text-sm mt-3 w-full update-wanderer-data">Perbarui Alignment</button>
                                </div>
                                <div>
                                    <h4 class="text-xl font-serif font-bold text-white tracking-wider mb-4">Statistik Jiwa</h4>
                                     <div class="glass-container p-4 rounded-lg space-y-2 text-sm">
                                        <div class="flex justify-between items-center"><span class="text-slate-400">Total XP:</span><input type="number" id="edit-xp" class="glass-input text-right w-24" value="${wanderer.xp}"><button data-property="xp" class="glass-button text-sm ml-2 update-wanderer-data">Update</button></div>
                                        <div class="flex justify-between items-center"><span class="text-slate-400">Rank Jiwa:</span><input type="number" id="edit-soulRank" class="glass-input text-right w-24" value="${wanderer.soulRank}"><button data-property="soulRank" class="glass-button text-sm ml-2 update-wanderer-data">Update</button></div>
                                        <div class="flex justify-between items-center"><span class="text-slate-400">Streak Konsistensi:</span><input type="number" id="edit-consistencyStreak" class="glass-input text-right w-24" value="${wanderer.consistencyStreak}"><button data-property="consistencyStreak" class="glass-button text-sm ml-2 update-wanderer-data">Update</button></div>
                                        <div class="flex justify-between items-center"><span class="text-slate-400">Esensi Niat:</span><input type="number" id="edit-essenceOfWill" class="glass-input text-right w-24" value="${wanderer.essenceOfWill}"><button data-property="essenceOfWill" class="glass-button text-sm ml-2 update-wanderer-data">Update</button></div>
                                        <div class="flex justify-between"><span class="text-slate-400">Wilayah Aktif:</span>
                                            <select id="edit-currentRegion" class="glass-input w-36">
                                                ${regionOptions}
                                            </select>
                                            <button id="teleport-wanderer-btn" class="glass-button text-sm ml-2">Teleport</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                            <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6">Atribut Jiwa</h3>
                            <div class="space-y-3">
                                ${wanderer.attributes.map(attr => `
                                    <div class="flex justify-between items-center">
                                        <span class="text-slate-300">${attr.name}:</span>
                                        <input type="number" id="edit-attr-${attr.name.toLowerCase()}" class="glass-input text-right w-24" value="${attr.value}">
                                        <button data-property="attribute" data-attribute-name="${attr.name}" class="glass-button text-sm ml-2 update-wanderer-data">Update</button>
                                    </div>
                                `).join('')}
                            </div>
                            <h4 class="text-xl font-serif text-white tracking-wider mt-8 mb-4 border-b border-border-color pb-2">Imprint & Skill</h4>
                            <div id="current-imprints-list" class="space-y-2 mb-4">
                                ${wanderer.unlockedImprints.length > 0 ?
                                    wanderer.unlockedImprints.map(imprintId => {
                                        const imprint = allImprints.find(imp => imp.id === imprintId);
                                        return `<div class="flex justify-between items-center text-slate-300 text-sm">
                                                    <span>${imprint ? imprint.name : imprintId}</span>
                                                    <button class="glass-button text-xs bg-red-600 hover:bg-red-500 remove-imprint-btn" data-imprint-id="${imprintId}">Hapus</button>
                                                </div>`;
                                    }).join('')
                                    : '<p class="text-slate-500 italic text-sm">Tidak ada Imprint yang terbuka.</p>'}
                            </div>
                            <div>
                                <select id="add-imprint-select" class="glass-input w-full">
                                    ${imprintOptions}
                                </select>
                                <button id="add-imprint-btn" class="glass-button text-sm mt-3 w-full">Tambah Imprint</button>
                            </div>
                        </div>
                    </div>
                    <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                        <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6">Altar Titah Agung</h3>
                        <div class="mb-6">
                            <h4 class="text-lg font-semibold text-slate-300 mb-2">Titah Aktif</h4>
                            <div id="current-mandate-display" class="glass-container p-4 rounded-lg text-slate-400 italic">
                                ${currentMandate ? `${currentMandate.title}: ${currentMandate.description} (${currentMandate.completed ? 'Selesai' : 'Aktif'})` : 'Tidak ada titah aktif.'}
                            </div>
                            ${currentMandate ? `
                                <div class="flex space-x-2 mt-3">
                                    <button id="complete-mandate-btn" class="glass-button text-sm primary-button flex-1" ${currentMandate.completed ? 'disabled' : ''}>Tandai Selesai</button>
                                    <button id="clear-mandate-btn" class="glass-button text-sm bg-red-600 hover:bg-red-500 flex-1">Hapus Titah</button>
                                </div>
                            ` : ''}
                        </div>
                        <h4 class="text-lg font-semibold text-slate-300 mb-2 border-t border-border-color pt-6">Tempa Titah Baru</h4>
                        <div class="space-y-4">
                            <div>
                                <label for="mandate-title" class="text-sm font-bold text-slate-400">Judul Titah</label>
                                <input type="text" id="mandate-title" class="glass-input" placeholder="e.g., Mandate of Stamina">
                            </div>
                            <div>
                                <label for="mandate-desc" class="text-sm font-bold text-slate-400">Deskripsi</label>
                                <textarea id="mandate-desc" class="glass-input" rows="3" placeholder="Jelaskan ujian yang harus ditempuh..."></textarea>
                            </div>
                             <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="mandate-attr" class="text-sm font-bold text-slate-400">Atribut Terkait</label>
                                    <select id="mandate-attr" class="glass-input">
                                        ${attributes.map(attr => `<option value="${attr}">${attr}</option>`).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label for="mandate-xp" class="text-sm font-bold text-slate-400">Hadiah XP</label>
                                    <input type="number" id="mandate-xp" class="glass-input" value="100">
                                </div>
                             </div>
                             <button id="forge-mandate-button" class="glass-button primary-button w-full">
                                <i data-feather="pen-tool" class="w-5 h-5 mr-2"></i>
                                Anugerahkan Titah
                             </button>
                        </div>

                        <h4 class="text-xl font-serif text-white tracking-wider mt-12 mb-4 border-b border-border-color pb-2">Picu Encounter & Berikan Item</h4>
                        <div class="space-y-4">
                            <div>
                                <label for="trigger-encounter-select" class="text-sm font-bold text-slate-400">Picu Encounter Spesifik</label>
                                <select id="trigger-encounter-select" class="glass-input w-full">
                                    ${encounterOptions || '<option value="">Tidak ada Encounter</option>'}
                                </select>
                                <button id="trigger-specific-encounter-btn" class="glass-button primary-button w-full mt-3" ${allEncounters.length === 0 ? 'disabled' : ''}>Picu Encounter</button>
                            </div>
                            <div>
                                <label for="grant-item-select" class="text-sm font-bold text-slate-400">Berikan Item</label>
                                <select id="grant-item-select" class="glass-input w-full">
                                    ${itemOptions || '<option value="">Tidak ada Item</option>'}
                                </select>
                                <input type="number" id="grant-item-quantity" class="glass-input w-full mt-2" value="1" min="1">
                                <button id="grant-item-btn" class="glass-button secondary-button w-full mt-3" ${allItems.length === 0 ? 'disabled' : ''}>Berikan Item</button>
                            </div>
                        </div>

                        <h4 class="text-xl font-serif text-white tracking-wider mt-12 mb-4 border-b border-border-color pb-2">Kronik Jiwa</h4>
                        <div id="wanderer-chronicle-display" class="space-y-2">
                            ${wanderer.chronicle && wanderer.chronicle.length > 0 ?
                                wanderer.chronicle.map(entry => `
                                    <div class="glass-container p-3 rounded-lg text-sm text-slate-300">
                                        <p class="font-bold text-white flex items-center"><i data-feather="${entry.sigil || 'book'}" class="w-4 h-4 mr-2"></i>${entry.title}</p>
                                        <p class="text-slate-400 italic mt-1">${entry.spoil}</p>
                                        <p class="text-xs text-slate-500 text-right">${new Date(entry.timestamp).toLocaleString('id-ID')}</p>
                                    </div>
                                `).reverse().join('') // Reverse to show newest first
                                : '<p class="text-slate-500 italic">Kronik ini masih kosong.</p>'}
                        </div>
                    </div>
                </div>
            </div>`;
    },

    setupPage(wandererName) {
        // Ensure currentWanderer is set correctly if page is re-rendered without full refresh
        currentWanderer = dbInstance.wanderers[wandererName];

        document.getElementById('back-to-observatory').onclick = () => {
            import('../forgerPageRenderer.js').then(module => {
                module.ForgerPageRenderer.renderForgerPage({ pageId: 'observatory' });
            });
        };
        document.getElementById('forge-mandate-button').onclick = () => this.handleForgeMandate(wandererName);

        // Setup update buttons for core stats
        document.querySelectorAll('.update-wanderer-data').forEach(button => {
            button.onclick = (e) => this.handleUpdateWandererData(wandererName, e.currentTarget.dataset.property);
        });

        // Setup update buttons for attributes
        // This targets buttons with data-attribute-name, which are for attributes
        document.querySelectorAll('.update-wanderer-data[data-attribute-name]').forEach(button => {
            button.onclick = (e) => this.handleUpdateAttribute(wandererName, e.currentTarget.dataset.attributeName);
        });


        // Setup Imprint management
        document.getElementById('add-imprint-btn').onclick = () => this.handleManageImprints(wandererName, 'add');
        document.querySelectorAll('.remove-imprint-btn').forEach(button => {
            button.onclick = (e) => this.handleManageImprints(wandererName, 'remove', e.currentTarget.dataset.imprintId);
        });

        // Setup Teleport button
        document.getElementById('teleport-wanderer-btn').onclick = () => this.handleTeleportWanderer(wandererName);

        // Setup Mandate management
        const completeMandateBtn = document.getElementById('complete-mandate-btn');
        const clearMandateBtn = document.getElementById('clear-mandate-btn');
        if (completeMandateBtn) {
            completeMandateBtn.onclick = () => this.handleManageMandate(wandererName, 'complete');
        }
        if (clearMandateBtn) {
            clearMandateBtn.onclick = () => this.handleManageMandate(wandererName, 'clear');
        }

        // Setup Trigger Specific Encounter
        document.getElementById('trigger-specific-encounter-btn').onclick = () => this.handleTriggerSpecificEncounter(wandererName);

        // Setup Grant Item
        document.getElementById('grant-item-btn').onclick = () => this.handleGrantItem(wandererName);


        const wanderer = dbInstance.wanderers[wandererName];
        if (wanderer) {
            const currentMandate = wanderer.divineMandate;
            if (currentMandate) {
                const currentMandateDisplay = document.getElementById('current-mandate-display');
                if (currentMandateDisplay) {
                    currentMandateDisplay.innerHTML = `${currentMandate.title}: ${currentMandate.description} (${currentMandate.completed ? 'Selesai' : 'Aktif'})`;
                }
            }
            // Set initial value for currentRegion select
            const currentRegionSelect = document.getElementById('edit-currentRegion');
            if (currentRegionSelect && wanderer.currentRegion) {
                currentRegionSelect.value = wanderer.currentRegion;
            }
        }
    },

    async handleUpdateWandererData(wandererName, property) {
        if (!currentWanderer) return;

        let value;
        let updatePath;

        if (property === 'alignment') {
            const intention = parseInt(document.getElementById('edit-intention').value);
            const echo = parseInt(document.getElementById('edit-echo').value);
            if (isNaN(intention) || isNaN(echo)) {
                UIManager.showNotification('Nilai Intention dan Echo harus berupa angka.', 'alert-triangle', 'bg-red-500');
                return;
            }
            value = { intention: intention, echo: echo };
            updatePath = `wanderers.${wandererName}.alignment`;
        } else {
            const inputElement = document.getElementById(`edit-${property}`);
            if (!inputElement) {
                console.error(`Input element for property ${property} not found.`);
                return;
            }
            value = parseInt(inputElement.value);
            if (isNaN(value)) {
                UIManager.showNotification('Nilai harus berupa angka.', 'alert-triangle', 'bg-red-500');
                return;
            }
            updatePath = `wanderers.${wandererName}.${property}`;
        }

        UIManager.showLoading("Memperbarui data Pengembara...");

        // Update local currentWanderer object first
        if (property === 'alignment') {
            currentWanderer.alignment = value;
        } else {
            currentWanderer[property] = value;
        }
        
        // Push the entire updated wanderer object to Firestore to ensure consistency
        // This is a simpler approach than dynamic paths for each property
        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { [`wanderers.${wandererName}`]: currentWanderer });
        
        // Update local dbInstance as well
        dbInstance.wanderers[wandererName] = currentWanderer;

        UIManager.hideLoading();
        UIManager.showNotification('Data Pengembara berhasil diperbarui!', 'check-circle', 'bg-gradient-to-r from-teal-400 to-emerald-400');
        // Re-render the page to show updated values and recalculate ratios/UI
        import('../forgerPageRenderer.js').then(module => {
            module.ForgerPageRenderer.renderForgerPage({ pageId: 'wanderer_detail', wandererName: wandererName });
        });
    },

    async handleUpdateAttribute(wandererName, attributeName) {
        if (!currentWanderer) return;

        const inputId = `edit-attr-${attributeName.toLowerCase()}`;
        const newLevel = parseInt(document.getElementById(inputId).value);
        if (isNaN(newLevel) || newLevel < 0) {
            UIManager.showNotification('Level atribut harus berupa angka positif.', 'alert-triangle', 'bg-red-500');
            return;
        }

        const attrIndex = currentWanderer.attributes.findIndex(attr => attr.name === attributeName);
        if (attrIndex === -1) {
            UIManager.showNotification(`Atribut ${attributeName} tidak ditemukan.`, 'x-circle', 'bg-red-500');
            return;
        }

        UIManager.showLoading(`Memperbarui atribut ${attributeName} Pengembara...`);

        currentWanderer.attributes[attrIndex].value = newLevel;
        // Optionally reset XP to 0 or calculate new xpToNext if desired for level up logic
        currentWanderer.attributes[attrIndex].xp = 0;
        currentWanderer.attributes[attrIndex].xpToNext = newLevel * 100; // Example formula

        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { [`wanderers.${wandererName}.attributes`]: currentWanderer.attributes });
        
        dbInstance.wanderers[wandererName].attributes = currentWanderer.attributes; // Update local dbInstance
        currentWanderer = dbInstance.wanderers[wandererName]; // Resync currentWanderer

        UIManager.hideLoading();
        UIManager.showNotification(`Atribut ${attributeName} berhasil diperbarui!`, 'check-circle', 'bg-gradient-to-r from-teal-400 to-emerald-400');
        import('../forgerPageRenderer.js').then(module => {
            module.ForgerPageRenderer.renderForgerPage({ pageId: 'wanderer_detail', wandererName: wandererName });
        });
    },

    async handleTeleportWanderer(wandererName) {
        if (!currentWanderer) return;
        const newRegionId = document.getElementById('edit-currentRegion').value;
        if (!newRegionId || !dbInstance.world.regions[newRegionId]) {
            UIManager.showNotification('Pilih wilayah yang valid untuk teleportasi.', 'alert-triangle', 'bg-red-500');
            return;
        }

        UIManager.showLoading(`Menteleportasi ${wandererName} ke ${dbInstance.world.regions[newRegionId].name}...`);
        currentWanderer.currentRegion = newRegionId;
        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { [`wanderers.${wandererName}.currentRegion`]: newRegionId });
        
        dbInstance.wanderers[wandererName].currentRegion = newRegionId; // Update local dbInstance
        currentWanderer = dbInstance.wanderers[wandererName]; // Resync currentWanderer

        UIManager.hideLoading();
        UIManager.showNotification(`Pengembara ${wandererName} diteleportasi!`, 'compass', 'bg-gradient-to-r from-blue-400 to-indigo-400');
        import('../forgerPageRenderer.js').then(module => {
            module.ForgerPageRenderer.renderForgerPage({ pageId: 'wanderer_detail', wandererName: wandererName });
        });
    },

    async handleManageImprints(wandererName, action, imprintId = null) {
        if (!currentWanderer) return;

        let updatedImprints = [...currentWanderer.unlockedImprints];
        let message = '';

        if (action === 'add') {
            const selectedImprintId = document.getElementById('add-imprint-select').value;
            if (!selectedImprintId) {
                UIManager.showNotification('Pilih Imprint untuk ditambahkan.', 'alert-triangle', 'bg-red-500');
                return;
            }
            if (!updatedImprints.includes(selectedImprintId)) {
                updatedImprints.push(selectedImprintId);
                message = `Imprint ${selectedImprintId} ditambahkan.`;
            } else {
                UIManager.showNotification('Pengembara sudah memiliki Imprint ini.', 'info', 'bg-blue-500');
                return;
            }
        } else if (action === 'remove') {
            if (!imprintId) { // Should not happen if button data is correct
                UIManager.showNotification('Imprint yang akan dihapus tidak valid.', 'alert-triangle', 'bg-red-500');
                return;
            }
            const initialLength = updatedImprints.length;
            updatedImprints = updatedImprints.filter(id => id !== imprintId);
            if (updatedImprints.length < initialLength) {
                message = `Imprint ${imprintId} dihapus.`;
            } else {
                UIManager.showNotification('Pengembara tidak memiliki Imprint ini.', 'info', 'bg-blue-500');
                return;
            }
        }

        UIManager.showLoading("Memperbarui Imprint Pengembara...");
        currentWanderer.unlockedImprints = updatedImprints;
        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { [`wanderers.${wandererName}.unlockedImprints`]: updatedImprints });
        
        dbInstance.wanderers[wandererName].unlockedImprints = updatedImprints; // Update local dbInstance
        currentWanderer = dbInstance.wanderers[wandererName]; // Resync currentWanderer

        UIManager.hideLoading();
        UIManager.showNotification(message, 'tool', 'bg-gradient-to-r from-purple-400 to-pink-400');
        import('../forgerPageRenderer.js').then(module => {
            module.ForgerPageRenderer.renderForgerPage({ pageId: 'wanderer_detail', wandererName: wandererName });
        });
    },

    async handleManageMandate(wandererName, action) {
        if (!currentWanderer) return;

        UIManager.showLoading("Memperbarui Titah Pengembara...");
        let newMandateState = null;
        let message = '';

        if (action === 'complete') {
            if (currentWanderer.divineMandate && !currentWanderer.divineMandate.completed) {
                newMandateState = { ...currentWanderer.divineMandate, completed: true, completedAt: new Date().toISOString() };
                message = 'Titah ditandai sebagai Selesai.';
            } else {
                UIManager.showNotification('Tidak ada titah aktif atau sudah selesai.', 'info', 'bg-blue-500');
                UIManager.hideLoading(); return;
            }
        } else if (action === 'clear') {
            newMandateState = null; // Remove mandate
            message = 'Titah dihapus.';
        }

        currentWanderer.divineMandate = newMandateState;
        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { [`wanderers.${wandererName}.divineMandate`]: newMandateState });
        
        dbInstance.wanderers[wandererName].divineMandate = newMandateState; // Update local dbInstance
        currentWanderer = dbInstance.wanderers[wandererName]; // Resync currentWanderer

        UIManager.hideLoading();
        UIManager.showNotification(message, 'award', 'bg-gradient-to-r from-teal-400 to-emerald-400');
        import('../forgerPageRenderer.js').then(module => {
            module.ForgerPageRenderer.renderForgerPage({ pageId: 'wanderer_detail', wandererName: wandererName });
        });
    },

    async handleTriggerSpecificEncounter(wandererName) {
        if (!currentWanderer) return;
        const encounterId = document.getElementById('trigger-encounter-select').value;
        if (!encounterId) {
            UIManager.showNotification('Pilih Encounter untuk dipicu.', 'alert-triangle', 'bg-red-500');
            return;
        }

        const encounter = [...(dbInstance.world.encounters.whispers || []), ...(dbInstance.world.encounters.glimmers || [])]
                            .find(enc => enc.id === encounterId);
        
        if (!encounter) {
            UIManager.showNotification('Encounter tidak ditemukan.', 'x-circle', 'bg-red-500');
            return;
        }

        UIManager.showLoading(`Memicu Encounter '${encounter.name}' untuk ${wandererName}...`);
        
        // Add encounter to Wanderer's chronicle for historical record
        const chronicleEntry = {
            id: `triggered_enc_${Date.now()}`,
            type: 'triggered_encounter',
            title: `Encounter Dipicu: ${encounter.name}`,
            spoil: `Forger memicu: ${encounter.description}`,
            reflection: `Sang Penempa telah memicu Encounter "${encounter.name}" secara langsung untuk menguji jalan Anda.`,
            timestamp: new Date().toISOString(),
            sigil: encounter.type === 'whisper' ? 'cloud-off' : 'sun' // Adjust sigil based on type
        };
        currentWanderer.chronicle.push(chronicleEntry);

        // This is a simulated trigger for the Wanderer. In a full game, this would
        // trigger an actual mini-game or narrative event on the Wanderer's side.
        // For now, we'll just add it to their chronicle and potentially a temporary status.
        // Mock: Add a temporary 'triggeredEncounter' status for Wanderer to process later.
        currentWanderer.activeTriggeredEncounter = {
            id: encounter.id,
            timestamp: new Date().toISOString(),
            // You might add data about how it affects their next login/turn
        };


        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { 
            [`wanderers.${wandererName}`]: currentWanderer, // Save the entire wanderer object to update activeTriggeredEncounter and chronicle
        });

        dbInstance.wanderers[wandererName] = currentWanderer; // Update local dbInstance
        currentWanderer = dbInstance.wanderers[wandererName]; // Resync currentWanderer

        UIManager.hideLoading();
        UIManager.showNotification(`Encounter '${encounter.name}' berhasil dipicu untuk ${wandererName}!`, 'zap', 'bg-gradient-to-r from-orange-400 to-yellow-400');
        import('../forgerPageRenderer.js').then(module => {
            module.ForgerPageRenderer.renderForgerPage({ pageId: 'wanderer_detail', wandererName: wandererName });
        });
    },

    async handleGrantItem(wandererName) {
        if (!currentWanderer) return;
        const itemId = document.getElementById('grant-item-select').value;
        const quantity = parseInt(document.getElementById('grant-item-quantity').value);

        if (!itemId || isNaN(quantity) || quantity <= 0) {
            UIManager.showNotification('Pilih Item dan masukkan kuantitas positif.', 'alert-triangle', 'bg-red-500');
            return;
        }

        const itemData = TRADABLE_ITEMS_DATA.find(item => item.id === itemId);
        if (!itemData) {
            UIManager.showNotification('Item tidak ditemukan.', 'x-circle', 'bg-red-500');
            return;
        }

        UIManager.showLoading(`Memberikan ${quantity}x ${itemData.name} kepada ${wandererName}...`);

        // Ensure wanderer.inventory exists, if not, initialize it
        if (!currentWanderer.inventory) {
            currentWanderer.inventory = [];
        }

        let itemAdded = false;
        for (let i = 0; i < currentWanderer.inventory.length; i++) {
            if (currentWanderer.inventory[i].id === itemId) {
                currentWanderer.inventory[i].quantity = (currentWanderer.inventory[i].quantity || 0) + quantity;
                itemAdded = true;
                break;
            }
        }
        if (!itemAdded) {
            currentWanderer.inventory.push({ ...itemData, quantity: quantity });
        }

        // Add chronicle entry for Wanderer
        currentWanderer.chronicle.push({
            id: `granted_item_${Date.now()}`,
            type: 'divine_provision',
            title: `Item Diterima: ${itemData.name} x${quantity}`,
            spoil: `Sang Penempa menganugerahkan ${itemData.name}.`,
            reflection: `Sebagai tanda kehendak Sang Penempa, ${itemData.name} telah terwujud di hadapanmu.`,
            timestamp: new Date().toISOString(),
            sigil: 'gift'
        });

        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { [`wanderers.${wandererName}`]: currentWanderer });

        dbInstance.wanderers[wandererName] = currentWanderer; // Update local dbInstance
        currentWanderer = dbInstance.wanderers[wandererName]; // Resync currentWanderer

        UIManager.hideLoading();
        UIManager.showNotification(`${quantity}x ${itemData.name} diberikan kepada ${wandererName}!`, 'gift', 'bg-gradient-to-r from-green-400 to-emerald-400');
        import('../forgerPageRenderer.js').then(module => {
            module.ForgerPageRenderer.renderForgerPage({ pageId: 'wanderer_detail', wandererName: wandererName });
        });
    },
};