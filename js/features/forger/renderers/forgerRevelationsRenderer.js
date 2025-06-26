// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 00:22 WITA ==
// == PERIHAL: Modul Renderer untuk Halaman Bengkel Wahyu (Forger) ==
// - Berisi semua logika rendering dan event listener untuk manajemen Encounter (CRUD).
// - Diimpor dan dipanggil oleh forgerPageRenderer.js.
// ===========================================

import { UIManager } from '../../../uiManager.js';
import { updateDocument } from '../../../firebaseService.js';

let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstance;
let GLOBAL_ATTRIBUTES_Instance;

export const ForgerRevelationsRenderer = {
    setDependencies(db, DB_DOC_ID, saveDB, globalAttributes) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstance = saveDB;
        GLOBAL_ATTRIBUTES_Instance = globalAttributes;
    },

    getHtml() {
        const allEncounters = [
            ...(dbInstance.world.encounters.whispers || []),
            ...(dbInstance.world.encounters.glimmers || [])
        ];

        const encounterListHtml = allEncounters.map(enc => `
            <div class="glass-card p-4 rounded-lg flex justify-between items-center mb-2 animate-fade-in-up">
                <div>
                    <h4 class="text-lg font-bold text-white">${enc.name} (${enc.type === 'whisper' ? 'Whisper' : 'Glimmer'})</h4>
                    <p class="text-slate-400 text-sm">${enc.description}</p>
                    <p class="text-slate-500 text-xs">Tags: ${enc.tags ? enc.tags.join(', ') : 'None'}</p>
                </div>
                <div class="flex space-x-2">
                   <button class="glass-button text-sm edit-encounter-btn" data-encounter-id="${enc.id}">Edit</button>
                   <button class="glass-button text-sm bg-red-600 hover:bg-red-500 delete-encounter-btn" data-encounter-id="${enc.id}">Delete</button>
               </div>
            </div>
        `).join('');

        return `
            <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6">Bengkel Wahyu</h3>
                <p class="text-slate-400 mb-6">Tempa Whispers dan Glimmers yang membentuk ujian dan anugerah bagi jiwa-jiwa.</p>

                <div class="space-y-4 mb-8" id="encounter-form-container">
                    <h4 class="text-xl font-serif text-white tracking-wider mb-4 border-b border-border-color pb-2" id="form-title">Ciptakan Wahyu Baru</h4>
                    <input type="hidden" id="current-encounter-id" value="">
                    <div>
                        <label for="new-encounter-name" class="text-sm font-bold text-slate-400 block mb-1">Nama Wahyu</label>
                        <input type="text" id="new-encounter-name" class="glass-input" placeholder="Nama Glimmer atau Whisper">
                    </div>
                    <div>
                        <label for="new-encounter-type" class="text-sm font-bold text-slate-400 block mb-1">Tipe</label>
                        <select id="new-encounter-type" class="glass-input">
                            <option value="glimmer">Glimmer of Opportunity</option>
                            <option value="whisper">Whisper of The Past</option>
                        </select>
                    </div>
                    <div>
                        <label for="new-encounter-description" class="text-sm font-bold text-slate-400 block mb-1">Deskripsi</label>
                        <textarea id="new-encounter-description" class="glass-input" rows="3" placeholder="Jelaskan apa yang terjadi..."></textarea>
                    </div>
                    <div>
                        <label for="new-encounter-tags" class="text-sm font-bold text-slate-400 block mb-1">Tags (Comma-separated)</label>
                        <input type="text" id="new-encounter-tags" class="glass-input" placeholder="e.g., focus, discipline, fear">
                    </div>

                    <h4 class="text-xl font-serif text-white tracking-wider mt-8 mb-4 border-b border-border-color pb-2">Pilihan & Efek</h4>
                    <div id="new-encounter-choices-container" class="space-y-4">
                        ${this.renderEncounterChoiceInput(0)}
                    </div>
                    <button id="add-choice-btn" class="glass-button flex items-center mt-4">
                        <i data-feather="plus" class="w-4 h-4 mr-1"></i> Tambah Pilihan
                    </button>

                    <button id="create-encounter-btn" class="glass-button primary-button w-full mt-6">
                        <i data-feather="plus-circle" class="w-5 h-5 mr-2"></i>
                        Tempa Wahyu Baru
                    </button>
                    <button id="update-encounter-btn" class="glass-button secondary-button w-full mt-6 hidden">
                        <i data-feather="save" class="w-5 h-5 mr-2"></i>
                        Perbarui Wahyu
                    </button>
                    <button id="cancel-edit-btn" class="glass-button w-full mt-3 hidden">
                        <i data-feather="x-circle" class="w-5 h-5 mr-2"></i>
                        Batal Edit
                    </button>
                </div>

                <h4 class="text-xl font-serif text-white tracking-wider mt-12 mb-4 border-b border-border-color pb-2">Wahyu yang Telah Ditempa</h4>
                <div id="existing-encounters-list">
                    ${allEncounters.length > 0 ? encounterListHtml : '<p class="text-slate-500 italic">Belum ada wahyu yang ditempa.</p>'}
                </div>
            </div>
        `;
    },

    setupPage() {
        const addChoiceBtn = document.getElementById('add-choice-btn');
        const choicesContainer = document.getElementById('new-encounter-choices-container');
        const createEncounterBtn = document.getElementById('create-encounter-btn');
        const updateEncounterBtn = document.getElementById('update-encounter-btn');
        const cancelEditBtn = document.getElementById('cancel-edit-btn');

        let choiceIndex = choicesContainer ? choicesContainer.children.length : 0;

        if (addChoiceBtn && choicesContainer) {
            addChoiceBtn.onclick = () => {
                choicesContainer.insertAdjacentHTML('beforeend', this.renderEncounterChoiceInput(choiceIndex));
                feather.replace();
                this.setupRemoveChoiceButtons();
                choiceIndex++;
            };
        }
        if (createEncounterBtn) {
            createEncounterBtn.onclick = () => this.handleCreateEncounter();
        }
        if (updateEncounterBtn) {
            updateEncounterBtn.onclick = () => this.handleUpdateEncounter();
        }
        if (cancelEditBtn) {
            cancelEditBtn.onclick = () => {
                document.getElementById('current-encounter-id').value = '';
                document.getElementById('form-title').textContent = 'Ciptakan Wahyu Baru';
                document.getElementById('new-encounter-name').value = '';
                document.getElementById('new-encounter-type').value = 'glimmer';
                document.getElementById('new-encounter-description').value = '';
                document.getElementById('new-encounter-tags').value = '';
                document.getElementById('new-encounter-choices-container').innerHTML = this.renderEncounterChoiceInput(0);
                choiceIndex = 1;

                document.getElementById('create-encounter-btn').classList.remove('hidden');
                document.getElementById('update-encounter-btn').classList.add('hidden');
                document.getElementById('cancel-edit-btn').classList.add('hidden');
                feather.replace();
                this.setupRemoveChoiceButtons();
            };
        }

        document.querySelectorAll('.edit-encounter-btn').forEach(button => {
            button.onclick = (e) => this.handleEditEncounter(e.target.dataset.encounterId);
        });
        document.querySelectorAll('.delete-encounter-btn').forEach(button => {
            button.onclick = (e) => this.handleDeleteEncounter(e.target.dataset.encounterId);
        });

        this.setupRemoveChoiceButtons();
    },

    renderEncounterChoiceInput(index, choice = {}) {
        const defaultEffect = { xp: 0, echo: 0, intention: 0 };
        GLOBAL_ATTRIBUTES_Instance.forEach(attr => defaultEffect[`${attr.toLowerCase()}_xp`] = 0);

        const currentEffect = { ...defaultEffect, ...(choice.effect || {}) };

        return `
            <div class="glass-container p-4 rounded-lg border border-border-color">
                <h5 class="text-lg font-semibold text-white mb-2">Pilihan ${index + 1}</h5>
                <div>
                    <label for="choice-text-${index}" class="text-sm font-bold text-slate-400 block mb-1">Teks Pilihan</label>
                    <input type="text" id="choice-text-${index}" class="glass-input" value="${choice.text || ''}" placeholder="Apa yang dilakukan Pengembara?">
                </div>
                <div class="grid grid-cols-2 gap-4 mt-3">
                    <div>
                        <label for="choice-xp-${index}" class="text-sm font-bold text-slate-400 block mb-1">XP Umum</label>
                        <input type="number" id="choice-xp-${index}" class="glass-input" value="${currentEffect.xp}">
                    </div>
                    <div>
                        <label for="choice-echo-${index}" class="text-sm font-bold text-slate-400 block mb-1">Efek Echo</label>
                        <input type="number" id="choice-echo-${index}" class="glass-input" value="${currentEffect.echo}">
                    </div>
                    <div>
                        <label for="choice-intention-${index}" class="text-sm font-bold text-slate-400 block mb-1">Efek Intention</label>
                        <input type="number" id="choice-intention-${index}" class="glass-input" value="${currentEffect.intention}">
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-4 mt-3">
                    ${GLOBAL_ATTRIBUTES_Instance.map(attr => `
                        <div>
                            <label for="choice-${attr.toLowerCase()}-xp-${index}" class="text-sm font-bold text-slate-400 block mb-1">${attr} XP</label>
                            <input type="number" id="choice-${attr.toLowerCase()}-xp-${index}" class="glass-input" value="${currentEffect[attr.toLowerCase() + '_xp'] || ''}">
                        </div>
                    `).join('')}
                </div>
                <button class="glass-button text-sm bg-red-600 hover:bg-red-500 mt-3 remove-choice-btn" data-index="${index}">
                    <i data-feather="minus-circle" class="w-4 h-4 mr-1"></i> Hapus Pilihan
                </button>
            </div>
        `;
    },

    async handleCreateEncounter() {
        const name = document.getElementById('new-encounter-name').value.trim();
        const type = document.getElementById('new-encounter-type').value;
        const description = document.getElementById('new-encounter-description').value.trim();
        const tagsInput = document.getElementById('new-encounter-tags').value.trim();
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim().toLowerCase()) : [];

        const choices = [];
        document.querySelectorAll('#new-encounter-choices-container .glass-container').forEach((choiceDiv, index) => {
            const text = choiceDiv.querySelector(`#choice-text-${index}`).value.trim();
            const xp = parseInt(choiceDiv.querySelector(`#choice-xp-${index}`).value) || 0;
            const echo = parseInt(choiceDiv.querySelector(`#choice-echo-${index}`).value) || 0;
            const intention = parseInt(choiceDiv.querySelector(`#choice-intention-${index}`).value) || 0;

            const effect = { xp, echo, intention };
            GLOBAL_ATTRIBUTES_Instance.forEach(attr => {
                const attrInput = choiceDiv.querySelector(`#choice-${attr.toLowerCase()}-xp-${index}`);
                if (attrInput && parseInt(attrInput.value) !== 0) {
                    effect[`${attr.toLowerCase()}_xp`] = parseInt(attrInput.value);
                }
            });

            if (text) {
                choices.push({ text, effect });
            }
        });

        if (!name || !description || choices.length === 0) {
            UIManager.showNotification('Nama, Deskripsi, dan setidaknya satu Pilihan harus diisi.', 'alert-triangle', 'bg-red-500');
            return;
        }

        const newEncounter = {
            id: `enc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            type: type,
            name: name,
            description: description,
            tags: tags,
            conditions: {},
            choices: choices
        };

        UIManager.showLoading('Menempa wahyu baru...');

        if (newEncounter.type === 'whisper') {
            dbInstance.world.encounters.whispers.push(newEncounter);
        } else {
            dbInstance.world.encounters.glimmers.push(newEncounter);
        }

        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { 'world.encounters': dbInstance.world.encounters });

        UIManager.hideLoading();
        UIManager.showNotification(`Wahyu '${name}' berhasil ditempa!`, 'sparkles', 'bg-gradient-to-r from-purple-400 to-pink-400');

        import('../forgerPageRenderer.js').then(module => {
            module.ForgerPageRenderer.renderForgerPage({ pageId: 'revelations' });
        });

        document.getElementById('new-encounter-name').value = '';
        document.getElementById('new-encounter-description').value = '';
        document.getElementById('new-encounter-tags').value = '';
        const choicesContainer = document.getElementById('new-encounter-choices-container');
        choicesContainer.innerHTML = this.renderEncounterChoiceInput(0);
        this.setupRemoveChoiceButtons();
    },

    async handleEditEncounter(encounterId) {
        const encounter = [...dbInstance.world.encounters.whispers, ...dbInstance.world.encounters.glimmers]
                            .find(e => e.id === encounterId);

        if (!encounter) {
            UIManager.showNotification('Encounter tidak ditemukan!', 'x-circle', 'bg-red-500');
            return;
        }

        document.getElementById('current-encounter-id').value = encounter.id;
        document.getElementById('form-title').textContent = `Edit Wahyu: ${encounter.name}`;
        document.getElementById('new-encounter-name').value = encounter.name;
        document.getElementById('new-encounter-type').value = encounter.type;
        document.getElementById('new-encounter-description').value = encounter.description;
        document.getElementById('new-encounter-tags').value = (encounter.tags || []).join(', ');

        const choicesContainer = document.getElementById('new-encounter-choices-container');
        choicesContainer.innerHTML = '';
        encounter.choices.forEach((choice, index) => {
            choicesContainer.insertAdjacentHTML('beforeend', this.renderEncounterChoiceInput(index, choice));
        });
        feather.replace();
        this.setupRemoveChoiceButtons();

        document.getElementById('create-encounter-btn').classList.add('hidden');
        document.getElementById('update-encounter-btn').classList.remove('hidden');
        document.getElementById('cancel-edit-btn').classList.remove('hidden');

        document.getElementById('encounter-form-container').scrollIntoView({ behavior: 'smooth' });
    },

    async handleUpdateEncounter() {
        const encounterId = document.getElementById('current-encounter-id').value;
        const name = document.getElementById('new-encounter-name').value.trim();
        const type = document.getElementById('new-encounter-type').value;
        const description = document.getElementById('new-encounter-description').value.trim();
        const tagsInput = document.getElementById('new-encounter-tags').value.trim();
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim().toLowerCase()) : [];

        const choices = [];
        document.querySelectorAll('#new-encounter-choices-container .glass-container').forEach((choiceDiv, index) => {
            const text = choiceDiv.querySelector(`#choice-text-${index}`).value.trim();
            const xp = parseInt(choiceDiv.querySelector(`#choice-xp-${index}`).value) || 0;
            const echo = parseInt(choiceDiv.querySelector(`#choice-echo-${index}`).value) || 0;
            const intention = parseInt(choiceDiv.querySelector(`#choice-intention-${index}`).value) || 0;

            const effect = { xp, echo, intention };
            GLOBAL_ATTRIBUTES_Instance.forEach(attr => {
                const attrInput = choiceDiv.querySelector(`#choice-${attr.toLowerCase()}-xp-${index}`);
                if (attrInput && parseInt(attrInput.value) !== 0) {
                    effect[`${attr.toLowerCase()}_xp`] = parseInt(attrInput.value);
                }
            });

            if (text) {
                choices.push({ text, effect });
            }
        });

        if (!name || !description || choices.length === 0) {
            UIManager.showNotification('Nama, Deskripsi, dan setidaknya satu Pilihan harus diisi.', 'alert-triangle', 'bg-red-500');
            return;
        }

        const updatedEncounter = {
            id: encounterId,
            type: type,
            name: name,
            description: description,
            tags: tags,
            conditions: {},
            choices: choices
        };

        UIManager.showLoading('Memperbarui wahyu...');

        dbInstance.world.encounters.whispers = dbInstance.world.encounters.whispers.filter(e => e.id !== encounterId);
        dbInstance.world.encounters.glimmers = dbInstance.world.encounters.glimmers.filter(e => e.id !== encounterId);

        if (updatedEncounter.type === 'whisper') {
            dbInstance.world.encounters.whispers.push(updatedEncounter);
        } else {
            dbInstance.world.encounters.glimmers.push(updatedEncounter);
        }

        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { 'world.encounters': dbInstance.world.encounters });

        UIManager.hideLoading();
        UIManager.showNotification(`Wahyu '${name}' berhasil diperbarui!`, 'check-circle', 'bg-gradient-to-r from-emerald-400 to-green-400');

        import('../forgerPageRenderer.js').then(module => {
            module.ForgerPageRenderer.renderForgerPage({ pageId: 'revelations' });
        });
    },

    async handleDeleteEncounter(encounterId) {
        UIManager.showModal(
            'Konfirmasi Penghapusan',
            'Apakah Anda yakin ingin menghapus wahyu ini? Tindakan ini tidak dapat dibatalkan.',
            [
                { text: 'Ya, Hapus', isPrimary: true, consequence: async () => {
                    UIManager.showLoading('Menghapus wahyu...');
                    dbInstance.world.encounters.whispers = dbInstance.world.encounters.whispers.filter(e => e.id !== encounterId);
                    dbInstance.world.encounters.glimmers = dbInstance.world.encounters.glimmers.filter(e => e.id !== encounterId);

                    await updateDocument("saga_worlds", DB_DOC_ID_Instance, { 'world.encounters': dbInstance.world.encounters });

                    UIManager.hideLoading();
                    UIManager.showNotification('Wahyu berhasil dihapus.', 'trash', 'bg-gradient-to-r from-red-500 to-orange-500');
                    import('../forgerPageRenderer.js').then(module => {
                        module.ForgerPageRenderer.renderForgerPage({ pageId: 'revelations' });
                    });
                }},
                { text: 'Batal', isPrimary: false, consequence: () => {} }
            ]
        );
    },

    setupRemoveChoiceButtons() {
        document.querySelectorAll('.remove-choice-btn').forEach(button => {
            button.onclick = (e) => {
                const choiceDiv = e.target.closest('.glass-container');
                if (choiceDiv && document.querySelectorAll('#new-encounter-choices-container .glass-container').length > 1) {
                    choiceDiv.remove();
                    document.querySelectorAll('#new-encounter-choices-container .glass-container').forEach((div, i) => {
                        div.querySelector('h5').textContent = `Pilihan ${i + 1}`;
                        div.querySelector('input[id^="choice-text-"]').id = `choice-text-${i}`;
                        div.querySelector('input[id^="choice-xp-"]').id = `choice-xp-${i}`;
                        div.querySelector('input[id^="choice-echo-"]').id = `choice-echo-${i}`;
                        div.querySelector('input[id^="choice-intention-"]').id = `choice-intention-${i}`;
                        GLOBAL_ATTRIBUTES_Instance.forEach(attr => {
                            const attrInput = div.querySelector(`input[id^="choice-${attr.toLowerCase()}-xp-"]`);
                            if (attrInput) attrInput.id = `choice-${attr.toLowerCase()}-xp-${i}`;
                        });
                        div.querySelector('.remove-choice-btn').dataset.index = i;
                    });
                } else {
                    UIManager.showNotification('Setidaknya harus ada satu pilihan.', 'info', 'bg-blue-500');
                }
            };
        });
    },
};