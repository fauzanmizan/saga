// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 00:22 WITA ==
// == PERIHAL: Modul Renderer untuk Halaman Tempaan Artefak (Forger) ==
// - Berisi semua logika rendering dan event listener untuk manajemen Artefak (CRUD).
// - Diimpor dan dipanggil oleh forgerPageRenderer.js.
// ===========================================

import { UIManager } from '../../../uiManager.js';
import { updateDocument } from '../../../firebaseService.js';

let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstance;

export const ForgerArtifactsRenderer = {
    setDependencies(db, DB_DOC_ID, saveDB) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstance = saveDB;
    },

    getHtml() {
        const allArtifacts = dbInstance.world.artifacts || [];

        const artifactListHtml = allArtifacts.map(art => `
            <div class="glass-card p-4 rounded-lg flex justify-between items-center mb-2 animate-fade-in-up">
                <div>
                    <h4 class="text-lg font-bold text-white">${art.name} <i data-feather="${art.icon}" class="inline-block w-5 h-5 ml-2 text-yellow-400"></i></h4>
                    <p class="text-slate-400 text-sm">${art.story}</p>
                    <p class="text-slate-500 text-xs">Efek: ${Object.keys(art.passiveEffects).map(effectKey => `${effectKey}: ${art.passiveEffects[effectKey]}`).join(', ')}</p>
                </div>
                <div class="flex space-x-2">
                   <button class="glass-button text-sm edit-artifact-btn" data-artifact-id="${art.id}">Edit</button>
                   <button class="glass-button text-sm bg-red-600 hover:bg-red-500 delete-artifact-btn" data-artifact-id="${art.id}">Delete</button>
               </div>
            </div>
        `).join('');

        return `
            <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6">Tempaan Artefak</h3>
                <p class="text-slate-400 mb-6">Di sinilah Anda menempa keberkahan yang melimpah (Divine Artifacts) untuk dianugerahkan kepada jiwa-jiwa.</p>

                <h4 class="text-xl font-serif text-white tracking-wider mb-4 border-b border-border-color pb-2" id="form-title">Desain Artefak Baru</h4>
                <div class="space-y-4" id="artifact-form-container">
                    <input type="hidden" id="current-artifact-id" value="">
                    <div>
                        <label for="artifact-name" class="text-sm font-bold text-slate-400 block mb-1">Nama Artefak</label>
                        <input type="text" id="artifact-name" class="glass-input" placeholder="misal: Talisman of Clarity">
                    </div>
                    <div>
                        <label for="artifact-story" class="text-sm font-bold text-slate-400 block mb-1">Kisah/Deskripsi</label>
                        <textarea id="artifact-story" class="glass-input" rows="3" placeholder="Kisah tentang asal-usul dan kekuatannya..."></textarea>
                    </div>
                    <div>
                        <label for="artifact-icon" class="text-sm font-bold text-slate-400 block mb-1">Ikon (Feather Icon Name)</label>
                        <input type="text" id="artifact-icon" class="glass-input" placeholder="misal: star, shield, zap">
                        <p class="text-slate-500 text-xs mt-1">Cari ikon di <a href="https://feathericons.com/" target="_blank" class="text-indigo-400 hover:underline">Feather Icons</a>.</p>
                    </div>

                    <h4 class="text-xl font-serif text-white tracking-wider mt-8 mb-4 border-b border-border-color pb-2">Efek Pasif</h4>
                    <div id="artifact-effects-container" class="space-y-2">
                        ${this.renderArtifactEffectInput(0)}
                    </div>
                    <button id="add-effect-btn" class="glass-button text-sm flex items-center mt-4">
                        <i data-feather="plus" class="w-4 h-4 mr-1"></i> Tambah Efek
                    </button>

                    <button id="create-artifact-btn" class="glass-button primary-button w-full mt-6">
                        <i data-feather="plus-circle" class="w-5 h-5 mr-2"></i>
                        Tempa Artefak
                    </button>
                    <button id="update-artifact-btn" class="glass-button secondary-button w-full mt-6 hidden">
                        <i data-feather="save" class="w-5 h-5 mr-2"></i>
                        Perbarui Artefak
                    </button>
                    <button id="cancel-artifact-edit-btn" class="glass-button w-full mt-3 hidden">
                        <i data-feather="x-circle" class="w-5 h-5 mr-2"></i>
                        Batal Edit
                    </button>
                </div>

                <h4 class="text-xl font-serif text-white tracking-wider mt-12 mb-4 border-b border-border-color pb-2">Artefak yang Telah Ditempa</h4>
                <div id="existing-artifacts-list">
                    ${allArtifacts.length > 0 ? artifactListHtml : '<p class="text-slate-500 italic">Belum ada artefak yang ditempa.</p>'}
                </div>
            </div>
        `;
    },

    setupPage() {
        document.getElementById('create-artifact-btn').onclick = () => this.handleCreateArtifact();
        document.getElementById('update-artifact-btn').onclick = () => this.handleUpdateArtifact();
        document.getElementById('cancel-artifact-edit-btn').onclick = () => {
            document.getElementById('current-artifact-id').value = '';
            document.getElementById('artifact-form-container').querySelector('#form-title').textContent = 'Desain Artefak Baru';
            document.getElementById('artifact-name').value = '';
            document.getElementById('artifact-story').value = '';
            document.getElementById('artifact-icon').value = '';
            document.getElementById('artifact-effects-container').innerHTML = this.renderArtifactEffectInput(0);
            this.setupRemoveArtifactEffectButtons();

            document.getElementById('create-artifact-btn').classList.remove('hidden');
            document.getElementById('update-artifact-btn').classList.add('hidden');
            document.getElementById('cancel-artifact-edit-btn').classList.add('hidden');
            feather.replace();
        };

        const addEffectBtn = document.getElementById('add-effect-btn');
        const artifactEffectsContainer = document.getElementById('artifact-effects-container');
        let effectIndex = artifactEffectsContainer ? artifactEffectsContainer.children.length : 0;
        
        if (addEffectBtn && artifactEffectsContainer) {
            addEffectBtn.onclick = () => {
                artifactEffectsContainer.insertAdjacentHTML('beforeend', this.renderArtifactEffectInput(effectIndex));
                feather.replace();
                this.setupRemoveArtifactEffectButtons();
                effectIndex++;
            };
        }
        this.renderArtifactsList();
        this.setupRemoveArtifactEffectButtons();
    },

    renderArtifactEffectInput(index, key = '', value = '') {
        return `
            <div class="flex space-x-2 artifact-effect-input">
                <input type="text" id="effect-key-${index}" class="glass-input w-1/2" placeholder="Key (e.g., xp_bonus)" value="${key}">
                <input type="number" id="effect-value-${index}" class="glass-input w-1/2" placeholder="Value (e.g., 50)" value="${value}">
                <button class="glass-button text-sm bg-red-600 hover:bg-red-500 remove-effect-btn" data-index="${index}">
                    <i data-feather="minus-circle" class="w-4 h-4"></i>
                </button>
            </div>
        `;
    },

    setupRemoveArtifactEffectButtons() {
        document.querySelectorAll('.remove-effect-btn').forEach(button => {
            button.onclick = (e) => {
                const effectDiv = e.target.closest('.artifact-effect-input');
                if (effectDiv && document.querySelectorAll('#artifact-effects-container .artifact-effect-input').length > 1) {
                    effectDiv.remove();
                    document.querySelectorAll('#artifact-effects-container .artifact-effect-input').forEach((div, i) => {
                        div.querySelector(`[id^="effect-key-"]`).id = `effect-key-${i}`;
                        div.querySelector(`[id^="effect-value-"]`).id = `effect-value-${i}`;
                        div.querySelector('.remove-effect-btn').dataset.index = i;
                    });
                } else {
                    UIManager.showNotification('Setidaknya harus ada satu efek.', 'info', 'bg-blue-500');
                }
            };
        });
    },

    async handleCreateArtifact() {
        const name = document.getElementById('artifact-name').value.trim();
        const story = document.getElementById('artifact-story').value.trim();
        const icon = document.getElementById('artifact-icon').value.trim();
        const passiveEffects = {};

        document.querySelectorAll('#artifact-effects-container .artifact-effect-input').forEach((effectDiv, index) => {
            const key = effectDiv.querySelector(`[id^="effect-key-"]`).value.trim();
            const value = parseInt(effectDiv.querySelector(`[id^="effect-value-"]`).value);
            if (key && !isNaN(value)) {
                passiveEffects[key] = value;
            }
        });

        if (!name || !story || !icon || Object.keys(passiveEffects).length === 0) {
            UIManager.showNotification('Nama, Kisah, Ikon, dan setidaknya satu Efek Artefak harus diisi.', 'alert-triangle', 'bg-red-500');
            return;
        }

        const newArtifact = {
            id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            name, story, icon, passiveEffects
        };

        UIManager.showLoading('Menempa artefak baru...');
        dbInstance.world.artifacts.push(newArtifact);

        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { 'world.artifacts': dbInstance.world.artifacts });

        UIManager.hideLoading();
        UIManager.showNotification(`Artefak '${name}' berhasil ditempa!`, 'sparkles', 'bg-gradient-to-r from-blue-400 to-cyan-400');
        
        import('../forgerPageRenderer.js').then(module => {
            module.ForgerPageRenderer.renderForgerPage({ pageId: 'artifacts' });
        });

        document.getElementById('artifact-name').value = '';
        document.getElementById('artifact-story').value = '';
        document.getElementById('artifact-icon').value = '';
        document.getElementById('artifact-effects-container').innerHTML = this.renderArtifactEffectInput(0);
        this.setupRemoveArtifactEffectButtons();
    },

    renderArtifactsList() {
        const container = document.getElementById('existing-artifacts-list');
        if (!container) return;

        const allArtifacts = dbInstance.world.artifacts || [];
        if (allArtifacts.length > 0) {
            const html = allArtifacts.map(art => `
                <div class="glass-card p-4 rounded-lg mb-2 animate-fade-in-up">
                    <div>
                        <h4 class="text-lg font-bold text-white">${art.name} <i data-feather="${art.icon}" class="inline-block w-5 h-5 ml-2 text-yellow-400"></i></h4>
                        <p class="text-slate-400 text-sm">${art.story}</p>
                        <p class="text-slate-500 text-xs">Efek: ${Object.keys(art.passiveEffects).map(effectKey => `${effectKey}: ${art.passiveEffects[effectKey]}`).join(', ')}</p>
                </div>
                <div class="flex space-x-2">
                   <button class="glass-button text-sm edit-artifact-btn" data-artifact-id="${art.id}">Edit</button>
                   <button class="glass-button text-sm bg-red-600 hover:bg-red-500 delete-artifact-btn" data-artifact-id="${art.id}">Delete</button>
               </div>
            </div>
        `).join('');
            UIManager.render(container, html);
        } else {
            container.innerHTML = '<p class="text-slate-500 italic">Belum ada artefak yang ditempa.</p>';
        }

        document.querySelectorAll('.edit-artifact-btn').forEach(button => {
            button.onclick = (e) => this.handleEditArtifact(e.target.dataset.artifactId);
        });
        document.querySelectorAll('.delete-artifact-btn').forEach(button => {
            button.onclick = (e) => this.handleDeleteArtifact(e.target.dataset.artifactId);
        });
        feather.replace();
    },

    async handleEditArtifact(artifactId) {
        const artifact = dbInstance.world.artifacts.find(a => a.id === artifactId);

        if (!artifact) {
            UIManager.showNotification('Artefak tidak ditemukan!', 'x-circle', 'bg-red-500');
            return;
        }

        document.getElementById('current-artifact-id').value = artifact.id;
        document.getElementById('artifact-form-container').querySelector('#form-title').textContent = `Edit Artefak: ${artifact.name}`;
        document.getElementById('artifact-name').value = artifact.name;
        document.getElementById('artifact-story').value = artifact.story;
        document.getElementById('artifact-icon').value = artifact.icon;

        const effectsContainer = document.getElementById('artifact-effects-container');
        effectsContainer.innerHTML = '';
        Object.keys(artifact.passiveEffects).forEach((key, index) => {
            effectsContainer.insertAdjacentHTML('beforeend', this.renderArtifactEffectInput(index, key, artifact.passiveEffects[key]));
        });
        feather.replace();
        this.setupRemoveArtifactEffectButtons();

        document.getElementById('create-artifact-btn').classList.add('hidden');
        document.getElementById('update-artifact-btn').classList.remove('hidden');
        document.getElementById('cancel-artifact-edit-btn').classList.remove('hidden');

        document.getElementById('artifact-form-container').scrollIntoView({ behavior: 'smooth' });
    },

    async handleUpdateArtifact() {
        const artifactId = document.getElementById('current-artifact-id').value;
        const name = document.getElementById('artifact-name').value.trim();
        const story = document.getElementById('artifact-story').value.trim();
        const icon = document.getElementById('artifact-icon').value.trim();
        const passiveEffects = {};

        document.querySelectorAll('#artifact-effects-container .artifact-effect-input').forEach((effectDiv) => {
            const key = effectDiv.querySelector(`[id^="effect-key-"]`).value.trim();
            const value = parseInt(effectDiv.querySelector(`[id^="effect-value-"]`).value);
            if (key && !isNaN(value)) {
                passiveEffects[key] = value;
            }
        });

        if (!name || !story || !icon || Object.keys(passiveEffects).length === 0) {
            UIManager.showNotification('Nama, Kisah, Ikon, dan setidaknya satu Efek Artefak harus diisi.', 'alert-triangle', 'bg-red-500');
            return;
        }

        const artifactIndex = dbInstance.world.artifacts.findIndex(a => a.id === artifactId);

        if (artifactIndex === -1) {
            UIManager.showNotification('Artefak tidak ditemukan untuk diperbarui!', 'x-circle', 'bg-red-500');
            return;
        }

        const updatedArtifact = {
            id: artifactId,
            name, story, icon, passiveEffects
        };

        UIManager.showLoading('Memperbarui artefak...');

        dbInstance.world.artifacts[artifactIndex] = updatedArtifact;

        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { 'world.artifacts': dbInstance.world.artifacts });

        UIManager.hideLoading();
        UIManager.showNotification(`Artefak '${name}' berhasil diperbarui!`, 'check-circle', 'bg-gradient-to-r from-emerald-400 to-green-400');

        import('../forgerPageRenderer.js').then(module => {
            module.ForgerPageRenderer.renderForgerPage({ pageId: 'artifacts' });
        });
    },

    async handleDeleteArtifact(artifactId) {
        UIManager.showModal(
            'Konfirmasi Penghapusan',
            'Apakah Anda yakin ingin menghapus artefak ini? Tindakan ini tidak dapat dibatalkan.',
            [
                { text: 'Ya, Hapus', isPrimary: true, consequence: async () => {
                    UIManager.showLoading('Menghapus artefak...');
                    dbInstance.world.artifacts = dbInstance.world.artifacts.filter(a => a.id !== artifactId);

                    await updateDocument("saga_worlds", DB_DOC_ID_Instance, { 'world.artifacts': dbInstance.world.artifacts });

                    UIManager.hideLoading();
                    UIManager.showNotification('Artefak berhasil dihapus.', 'trash', 'bg-gradient-to-r from-red-500 to-orange-500');
                    import('../forgerPageRenderer.js').then(module => {
                        module.ForgerPageRenderer.renderForgerPage({ pageId: 'artifacts' });
                    });
                }},
                { text: 'Batal', isPrimary: false, consequence: () => {} }
            ]
        );
    },
};