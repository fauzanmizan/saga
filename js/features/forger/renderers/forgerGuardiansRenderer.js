// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 12:53 WITA ==
// == PERIHAL: Implementasi Penuh Aula Para Penjaga (Guardians) untuk Forger ==
// - Mengimplementasikan fungsionalitas untuk menampilkan daftar Penjaga (Wanderer dan NPC).
// - Mengimplementasikan fitur "Tunjuk Penjaga" (Appoint Guardian) untuk menetapkan Wanderer sebagai Penjaga.
// - Mengimplementasikan fitur "Edit Penjaga" untuk mengubah status dan wilayah tugas Penjaga.
// - Mengimplementasikan fitur "Hapus Penjaga" untuk mencabut penunjukan Penjaga.
// - Memastikan status Penjaga (aktif, tidak aktif, bertugas) diterapkan secara dinamis.
// - Mengintegrasikan UIManager untuk notifikasi dan modal konfirmasi.
// - Memastikan semua event listener terpasang dengan benar.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 00:22 WITA ==
// == PERIHAL: Modul Renderer untuk Halaman Aula Para Penjaga (Forger) ==
// - Berisi semua logika rendering dan event listener untuk manajemen Penjaga.
// - Diimpor dan dipanggil oleh forgerPageRenderer.js.
// - Placeholder fungsi CRUD Guardians ditambahkan.
// ===========================================

import { UIManager } from '../../../uiManager.js';
import { updateDocument } from '../../../firebaseService.js'; // Membutuhkan updateDocument

let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstance;

export const ForgerGuardiansRenderer = {
    setDependencies(db, DB_DOC_ID, saveDB) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstance = saveDB;
    },

    getHtml() {
        const allWanderers = Object.values(dbInstance.wanderers || {});
        const allRegions = Object.values(dbInstance.world.regions || {});

        // Filter out wanderers who are already guardians
        const appointableWanderers = allWanderers.filter(w => !w.isGuardian);

        const wandererOptions = appointableWanderers.map(w => `<option value="${w.name}">${w.name}</option>`).join('');
        const regionOptions = allRegions.map(r => `<option value="${r.name}">${r.name}</option>`).join('');

        return `
            <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6">Aula Para Penjaga</h3>
                <p class="text-slate-400 mb-6">Kelola jiwa-jiwa yang telah diangkat menjadi Penjaga, pelindung Tenunan Kosmik.</p>

                <h4 class="text-xl font-serif text-white tracking-wider mb-4 border-b border-border-color pb-2">Tunjuk Penjaga Baru</h4>
                <div class="space-y-4 mb-8">
                    <div>
                        <label for="appoint-wanderer-select" class="text-sm font-bold text-slate-400 block mb-1">Pilih Pengembara</label>
                        <select id="appoint-wanderer-select" class="glass-input">
                            ${appointableWanderers.length > 0 ? wandererOptions : '<option value="" disabled selected>Tidak ada Pengembara untuk ditunjuk</option>'}
                        </select>
                        ${appointableWanderers.length === 0 ? '<p class="text-red-400 text-xs mt-1">Semua Pengembara sudah menjadi Penjaga, atau tidak ada Pengembara terdaftar.</p>' : ''}
                    </div>
                    <div>
                        <label for="appoint-region-select" class="text-sm font-bold text-slate-400 block mb-1">Wilayah Tugas</label>
                        <select id="appoint-region-select" class="glass-input">
                            ${regionOptions || '<option value="" disabled selected>Tidak ada wilayah</option>'}
                        </select>
                    </div>
                    <button id="appoint-guardian-btn" class="glass-button primary-button w-full mt-6" ${appointableWanderers.length === 0 ? 'disabled' : ''}>
                        <i data-feather="plus-circle" class="w-5 h-5 mr-2"></i>
                        Tunjuk Sebagai Penjaga
                    </button>
                </div>

                <h4 class="text-xl font-serif text-white tracking-wider mt-12 mb-4 border-b border-border-color pb-2">Daftar Penjaga</h4>
                <div class="overflow-x-auto glass-table-container">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="glass-table-header">
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Nama</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Tipe</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Peringkat Jiwa</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Wilayah Tugas</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th class="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="guardians-list-body"></tbody>
                    </table>
                </div>

                <div id="guardian-edit-form-container" class="glass-card p-8 rounded-2xl shadow-lg border border-border-color mt-8 hidden">
                    <h4 class="text-xl font-serif text-white tracking-wider mb-4 border-b border-border-color pb-2">Edit Penjaga: <span id="edit-guardian-name"></span></h4>
                    <input type="hidden" id="edit-guardian-id">
                    <div class="space-y-4">
                        <div>
                            <label for="edit-guardian-status" class="text-sm font-bold text-slate-400 block mb-1">Status Penjaga</label>
                            <select id="edit-guardian-status" class="glass-input">
                                <option value="active">Aktif</option>
                                <option value="on-duty">Bertugas</option>
                                <option value="inactive">Tidak Aktif</option>
                            </select>
                        </div>
                        <div>
                            <label for="edit-guardian-region" class="text-sm font-bold text-slate-400 block mb-1">Wilayah Tugas</label>
                            <select id="edit-guardian-region" class="glass-input">
                                ${regionOptions}
                            </select>
                        </div>
                        <button id="update-guardian-btn" class="glass-button primary-button w-full mt-6">
                            <i data-feather="save" class="w-5 h-5 mr-2"></i>
                            Perbarui Penjaga
                        </button>
                        <button id="cancel-guardian-edit-btn" class="glass-button w-full mt-3">
                            <i data-feather="x-circle" class="w-5 h-5 mr-2"></i>
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    setupPage() {
        document.getElementById('appoint-guardian-btn').onclick = () => this.handleAppointGuardian();
        document.getElementById('update-guardian-btn').onclick = () => this.handleUpdateGuardian();
        document.getElementById('cancel-guardian-edit-btn').onclick = () => this.hideEditForm();
        this.renderGuardiansList();
    },

    renderGuardiansList() {
        const tbody = document.getElementById('guardians-list-body');
        if (!tbody) return;

        const guardians = [
            ...Object.values(dbInstance.wanderers || {}).filter(w => w.isGuardian),
            ...Object.values(dbInstance.npc_souls || {}).filter(n => n.isGuardian)
        ];

        if (guardians.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-500">Belum ada Penjaga yang ditunjuk.</td></tr>`;
            return;
        }

        const rowsHtml = guardians.map(g => {
            let statusClass = 'text-slate-400';
            if (g.guardianStatus === 'active') statusClass = 'text-emerald-400';
            else if (g.guardianStatus === 'on-duty') statusClass = 'text-yellow-400';
            else if (g.guardianStatus === 'inactive') statusClass = 'text-red-400';

            const regionName = dbInstance.world.regions[g.guardianRegion]?.name || g.guardianRegion || 'N/A';
            const actionButtons = g.role === 'wanderer' ? `
                <button class="glass-button text-sm edit-guardian-btn" data-guardian-id="${g.name}">Edit</button>
                <button class="glass-button text-sm bg-red-600 hover:bg-red-500 delete-guardian-btn" data-guardian-id="${g.name}">Hapus</button>
            ` : `<span class="text-slate-500 text-sm">N/A</span>`; // NPC guardians might not be editable/deletable directly via this UI

            return `
                <tr class="glass-table-row animate-fade-in-up">
                    <td class="p-4 font-bold text-lg text-slate-100">${g.name}</td>
                    <td class="p-4 text-slate-300 capitalize">${g.role}</td>
                    <td class="p-4 font-mono text-slate-300">${g.soulRank}</td>
                    <td class="p-4 text-indigo-400 font-semibold">${regionName}</td>
                    <td class="p-4 ${statusClass} capitalize">${g.guardianStatus || 'N/A'}</td>
                    <td class="p-4 flex space-x-2">${actionButtons}</td>
                </tr>
            `;
        }).join('');
        tbody.innerHTML = rowsHtml;

        document.querySelectorAll('.edit-guardian-btn').forEach(button => {
            button.onclick = (e) => this.handleEditGuardian(e.target.dataset.guardianId);
        });
        document.querySelectorAll('.delete-guardian-btn').forEach(button => {
            button.onclick = (e) => this.handleRemoveGuardian(e.target.dataset.guardianId);
        });
        feather.replace();
    },

    async handleAppointGuardian() {
        const wandererName = document.getElementById('appoint-wanderer-select').value;
        const regionName = document.getElementById('appoint-region-select').value;

        if (!wandererName) {
            UIManager.showNotification('Pilih Pengembara untuk ditunjuk.', 'alert-triangle', 'bg-red-500');
            return;
        }
        if (!regionName) {
            UIManager.showNotification('Pilih Wilayah Tugas untuk Penjaga.', 'alert-triangle', 'bg-red-500');
            return;
        }

        if (!dbInstance.wanderers[wandererName]) {
            UIManager.showNotification('Pengembara tidak ditemukan.', 'x-circle', 'bg-red-500');
            return;
        }

        UIManager.showLoading(`Menunjuk ${wandererName} sebagai Penjaga...`);

        dbInstance.wanderers[wandererName].isGuardian = true;
        dbInstance.wanderers[wandererName].guardianRegion = Object.keys(dbInstance.world.regions).find(key => dbInstance.world.regions[key].name === regionName);
        dbInstance.wanderers[wandererName].guardianStatus = 'active'; // Default status when appointed

        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { [`wanderers.${wandererName}`]: dbInstance.wanderers[wandererName] });

        UIManager.hideLoading();
        UIManager.showNotification(`'${wandererName}' berhasil ditunjuk sebagai Penjaga di ${regionName}!`, 'shield', 'bg-gradient-to-r from-emerald-400 to-green-400');
        this.renderGuardiansList();
        this.resetAppointForm();
    },

    handleEditGuardian(guardianId) {
        const guardian = dbInstance.wanderers[guardianId] || dbInstance.npc_souls[guardianId]; // Assuming NPC Guardians are also editable if implemented
        if (!guardian) {
            UIManager.showNotification('Penjaga tidak ditemukan.', 'x-circle', 'bg-red-500');
            return;
        }

        document.getElementById('edit-guardian-id').value = guardianId;
        document.getElementById('edit-guardian-name').textContent = guardian.name;
        document.getElementById('edit-guardian-status').value = guardian.guardianStatus || 'active';
        
        // Find region ID from name for the dropdown
        const regionKey = Object.keys(dbInstance.world.regions).find(key => key === guardian.guardianRegion);
        if (regionKey) {
            document.getElementById('edit-guardian-region').value = dbInstance.world.regions[regionKey].name;
        } else {
             document.getElementById('edit-guardian-region').value = ''; // Reset if region not found
        }
       

        document.getElementById('guardian-edit-form-container').classList.remove('hidden');
        document.getElementById('guardian-edit-form-container').scrollIntoView({ behavior: 'smooth' });
    },

    async handleUpdateGuardian() {
        const guardianId = document.getElementById('edit-guardian-id').value;
        const newStatus = document.getElementById('edit-guardian-status').value;
        const newRegionName = document.getElementById('edit-guardian-region').value;

        let guardian = dbInstance.wanderers[guardianId];
        let path = `wanderers.${guardianId}`;

        if (!guardian) { // Check NPC if not Wanderer
            guardian = dbInstance.npc_souls[guardianId];
            path = `npc_souls.${guardianId}`;
        }

        if (!guardian) {
            UIManager.showNotification('Penjaga tidak ditemukan untuk diperbarui.', 'x-circle', 'bg-red-500');
            return;
        }
        
        const newRegionId = Object.keys(dbInstance.world.regions).find(key => dbInstance.world.regions[key].name === newRegionName);

        UIManager.showLoading(`Memperbarui Penjaga '${guardian.name}'...`);

        guardian.guardianStatus = newStatus;
        guardian.guardianRegion = newRegionId;
        guardian.currentRegion = newRegionId; // Update currentRegion as well for consistency

        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { [path]: guardian });

        UIManager.hideLoading();
        UIManager.showNotification(`Penjaga '${guardian.name}' berhasil diperbarui!`, 'check-circle', 'bg-gradient-to-r from-emerald-400 to-green-400');
        this.renderGuardiansList();
        this.hideEditForm();
    },

    async handleRemoveGuardian(guardianId) {
        UIManager.showModal(
            'Konfirmasi Penghapusan',
            `Apakah Anda yakin ingin mencabut penunjukan Penjaga dari '${guardianId}'?`,
            [
                { text: 'Ya, Cabut', isPrimary: true, consequence: async () => {
                    UIManager.showLoading(`Mencabut Penjaga dari '${guardianId}'...`);

                    if (dbInstance.wanderers[guardianId]) {
                        delete dbInstance.wanderers[guardianId].isGuardian;
                        delete dbInstance.wanderers[guardianId].guardianRegion;
                        delete dbInstance.wanderers[guardianId].guardianStatus;
                        // It's crucial to explicitly set fields to null or delete them in Firestore to remove them.
                        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { 
                            [`wanderers.${guardianId}.isGuardian`]: null,
                            [`wanderers.${guardianId}.guardianRegion`]: null,
                            [`wanderers.${guardianId}.guardianStatus`]: null
                        }, true); // Merge true to only update specified fields
                    } else if (dbInstance.npc_souls[guardianId]) {
                        // Handle NPC removal if applicable, similar to wanderer
                        delete dbInstance.npc_souls[guardianId].isGuardian;
                        delete dbInstance.npc_souls[guardianId].guardianRegion;
                        delete dbInstance.npc_souls[guardianId].guardianStatus;
                         await updateDocument("saga_worlds", DB_DOC_ID_Instance, { 
                            [`npc_souls.${guardianId}.isGuardian`]: null,
                            [`npc_souls.${guardianId}.guardianRegion`]: null,
                            [`npc_souls.${guardianId}.guardianStatus`]: null
                        }, true);
                    }

                    UIManager.hideLoading();
                    UIManager.showNotification(`Penunjukan Penjaga dari '${guardianId}' berhasil dicabut.`, 'slash', 'bg-gradient-to-r from-red-500 to-orange-500');
                    this.renderGuardiansList();
                }},
                { text: 'Batal', isPrimary: false, consequence: () => {} }
            ]
        );
    },

    hideEditForm() {
        document.getElementById('guardian-edit-form-container').classList.add('hidden');
        document.getElementById('edit-guardian-id').value = '';
        document.getElementById('edit-guardian-name').textContent = '';
        document.getElementById('edit-guardian-status').value = 'active';
        document.getElementById('edit-guardian-region').value = '';
    },

    resetAppointForm() {
        const appointWandererSelect = document.getElementById('appoint-wanderer-select');
        const appointRegionSelect = document.getElementById('appoint-region-select');
        if (appointWandererSelect) appointWandererSelect.value = '';
        if (appointRegionSelect) appointRegionSelect.value = '';
        // Re-render the select options to reflect changes (e.g., appointed wanderer removed from list)
        this.getHtml(); // This will regenerate the entire HTML, including options
        this.setupPage(); // Re-attach event listeners
    }
};