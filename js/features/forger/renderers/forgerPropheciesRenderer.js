// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 00:22 WITA ==
// == PERIHAL: Modul Renderer untuk Halaman Tenunan Nubuat (Forger) ==
// - Berisi semua logika rendering dan event listener untuk manajemen Nubuat.
// - Diimpor dan dipanggil oleh forgerPageRenderer.js.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 23:06 WITA ==
// == PERIHAL: Implementasi Fase IV - Narasi Dinamis & Sistem Warisan Awal ==
// - Memodifikasi handleSendProphecy() untuk menambahkan 'triggeredNarrativeFlag' ke objek Prophecy.
// - Memastikan 'activeNarrativeFlags' ditambahkan ke objek Wanderer target.
// ===========================================

import { UIManager } from '../../../uiManager.js';
import { updateDocument } from '../../../firebaseService.js';

let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstance;

export const ForgerPropheciesRenderer = {
    setDependencies(db, DB_DOC_ID, saveDB) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstance = saveDB;
    },

    getHtml() {
        const allWanderers = Object.values(dbInstance.wanderers);
        const wandererOptions = allWanderers.map(w => `<option value="${w.name}">${w.name}</option>`).join('');

        const allProphecies = dbInstance.world.prophecies || [];
        const sentPropheciesListHtml = allProphecies.map(prop => `
            <div class="glass-card p-4 rounded-lg mb-2 animate-fade-in-up">
                <div>
                    <h4 class="text-lg font-bold text-white">${prop.title} <i data-feather="${prop.sigil}" class="inline-block w-5 h-5 ml-2 text-purple-400"></i></h4>
                    <p class="text-slate-400 text-sm">Untuk: ${prop.targetWanderer}</p>
                    <p class="text-slate-500 text-xs mt-1">Dikirim pada: ${new Date(prop.sentAt).toLocaleString('id-ID')}</p>
                    <p class="text-slate-300 mt-2 italic">"${prop.text}"</p>
                    ${prop.triggeredNarrativeFlag ? `<p class="text-slate-500 text-xs mt-1">Flag Narasi: ${prop.triggeredNarrativeFlag}</p>` : ''}
                </div>
            </div>
        `).join('');


        return `
            <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6">Tenunan Nubuat</h3>
                <p class="text-slate-400 mb-6">Tuliskan kata-kata yang akan berbisik di Chronicle seorang Pengembara, membentuk takdir mereka.</p>

                <h4 class="text-xl font-serif text-white tracking-wider mb-4 border-b border-border-color pb-2">Tuliskan Nubuat</h4>
                <div class="space-y-4">
                    <div>
                        <label for="prophecy-target-wanderer" class="text-sm font-bold text-slate-400 block mb-1">Target Pengembara</label>
                        <select id="prophecy-target-wanderer" class="glass-input">
                            ${wandererOptions || '<option value="">Tidak ada Pengembara</option>'}
                        </select>
                        ${allWanderers.length === 0 ? '<p class="text-red-400 text-xs mt-1">Belum ada Pengembara yang terdaftar.</p>' : ''}
                    </div>
                    <div>
                        <label for="prophecy-title" class="text-sm font-bold text-slate-400 block mb-1">Judul Nubuat</label>
                        <input type="text" id="prophecy-title" class="glass-input" placeholder="misal: Ramalan Kebangkitan">
                    </div>
                    <div>
                        <label for="prophecy-text" class="text-sm font-bold text-slate-400 block mb-1">Isi Nubuat</label>
                        <textarea id="prophecy-text" class="glass-input" rows="4" placeholder="Bisikan kata-kata misterius..."></textarea>
                        <p class="text-slate-500 text-xs mt-1">Ini akan muncul sebagai entri misterius di Chronicle Pengembara.</p>
                    </div>
                    <div>
                        <label for="prophecy-sigil" class="text-sm font-bold text-slate-400 block mb-1">Sigil/Ikon (Feather Icon Name)</label>
                        <input type="text" id="prophecy-sigil" class="glass-input" placeholder="misal: eye, cloud, light-bulb">
                    </div>
                    <div>
                        <label for="prophecy-narrative-flag" class="text-sm font-bold text-slate-400 block mb-1">Flag Narasi (Opsional, untuk pengujian)</label>
                        <input type="text" id="prophecy-narrative-flag" class="glass-input" placeholder="misal: quest_arc_zethus">
                        <p class="text-slate-500 text-xs mt-1">Tambahkan flag ini untuk memicu event atau alur cerita tertentu pada Wanderer.</p>
                    </div>
                    <button id="send-prophecy-btn" class="glass-button primary-button w-full mt-6">
                        <i data-feather="send" class="w-5 h-5 mr-2"></i>
                        Kirim Nubuat
                    </button>
                </div>

                <h4 class="text-xl font-serif text-white tracking-wider mt-12 mb-4 border-b border-border-color pb-2">Nubuat yang Telah Dikirim</h4>
                <div id="sent-prophecies-list">
                    ${allProphecies.length > 0 ? sentPropheciesListHtml : '<p class="text-slate-500 italic">Belum ada nubuat yang dikirim.</p>'}
                </div>
            </div>
        `;
    },

    setupPage() {
        document.getElementById('send-prophecy-btn').onclick = () => this.handleSendProphecy();
        this.renderPropheciesList();
    },

    async handleSendProphecy() {
        const targetWandererName = document.getElementById('prophecy-target-wanderer').value;
        const title = document.getElementById('prophecy-title').value.trim();
        const text = document.getElementById('prophecy-text').value.trim();
        const sigil = document.getElementById('prophecy-sigil').value.trim();
        const narrativeFlag = document.getElementById('prophecy-narrative-flag').value.trim(); // Get narrative flag

        if (!targetWandererName || !title || !text || !sigil) {
            UIManager.showNotification('Pilih Pengembara, dan isi Judul, Isi, serta Sigil Nubuat.', 'alert-triangle', 'bg-red-500');
            return;
        }

        const targetWanderer = dbInstance.wanderers[targetWandererName];
        if (!targetWanderer) {
            UIManager.showNotification('Pengembara target tidak ditemukan.', 'x-circle', 'bg-red-500');
            return;
        }

        const newProphecy = {
            id: `prophecy_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            targetWanderer: targetWandererName,
            title: title,
            text: text,
            sigil: sigil,
            sentAt: new Date().toISOString(),
            type: 'divine_prophecy'
        };

        // Add triggeredNarrativeFlag if provided
        if (narrativeFlag) {
            newProphecy.triggeredNarrativeFlag = narrativeFlag;
        }

        UIManager.showLoading(`Mengirim nubuat ke ${targetWandererName}...`);

        dbInstance.world.prophecies.push(newProphecy);

        // Add prophecy to Wanderer's chronicle
        targetWanderer.chronicle.push({
            id: newProphecy.id,
            type: newProphecy.type,
            title: newProphecy.title,
            spoil: newProphecy.text,
            reflection: `Sebuah bisikan takdir: "${newProphecy.text}"`,
            timestamp: newProphecy.sentAt,
            sigil: newProphecy.sigil
        });

        // Add narrative flag to Wanderer's activeNarrativeFlags if it exists
        if (newProphecy.triggeredNarrativeFlag) {
            if (!targetWanderer.activeNarrativeFlags) {
                targetWanderer.activeNarrativeFlags = [];
            }
            if (!targetWanderer.activeNarrativeFlags.includes(newProphecy.triggeredNarrativeFlag)) {
                targetWanderer.activeNarrativeFlags.push(newProphecy.triggeredNarrativeFlag);
            }
        }

        await updateDocument("saga_worlds", DB_DOC_ID_Instance, {
            'world.prophecies': dbInstance.world.prophecies,
            [`wanderers.${targetWandererName}`]: dbInstance.wanderers[targetWandererName] || null // Ensure the whole wanderer object is updated for activeNarrativeFlags
        }, true);

        UIManager.hideLoading();
        UIManager.showNotification(`Nubuat berhasil dikirim ke ${targetWandererName}!`, 'feather', 'bg-gradient-to-r from-purple-400 to-indigo-400');
        this.renderPropheciesList();

        document.getElementById('prophecy-title').value = '';
        document.getElementById('prophecy-text').value = '';
        document.getElementById('prophecy-sigil').value = '';
        document.getElementById('prophecy-narrative-flag').value = ''; // Clear narrative flag input
    },

    renderPropheciesList() {
        const container = document.getElementById('sent-prophecies-list');
        if (!container) return;

        const allProphecies = dbInstance.world.prophecies || [];
        if (allProphecies.length > 0) {
            const html = allProphecies.map(prop => `
                <div class="glass-card p-4 rounded-lg mb-2 animate-fade-in-up">
                    <h4 class="text-lg font-bold text-white">${prop.title} <i data-feather="${prop.sigil}" class="inline-block w-5 h-5 ml-2 text-purple-400"></i></h4>
                    <p class="text-slate-400 text-sm">Untuk: ${prop.targetWanderer}</p>
                    <p class="text-slate-500 text-xs mt-1">Dikirim pada: ${new Date(prop.sentAt).toLocaleString('id-ID')}</p>
                    <p class="text-slate-300 mt-2 italic">"${prop.text}"</p>
                    ${prop.triggeredNarrativeFlag ? `<p class="text-slate-500 text-xs mt-1">Flag Narasi: ${prop.triggeredNarrativeFlag}</p>` : ''}
                </div>
            `).join('');
            UIManager.render(container, html);
        } else {
            container.innerHTML = '<p class="text-slate-500 italic">Belum ada nubuat yang dikirim.</p>';
        }
        feather.replace();
    }
};