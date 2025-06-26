// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 00:22 WITA ==
// == PERIHAL: Modul Renderer untuk Halaman Permohonan Jiwa (Forger) ==
// - Berisi semua logika rendering dan event listener untuk manajemen Permohonan Jiwa.
// - Diimpor dan dipanggil oleh forgerPageRenderer.js.
// ===========================================

import { UIManager } from '../../../uiManager.js';
import { updateDocument } from '../../../firebaseService.js';

let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstance;
let GLOBAL_ATTRIBUTES_Instance; // Needed for trial mandates

export const ForgerPetitionsRenderer = {
    setDependencies(db, DB_DOC_ID, saveDB, globalAttributes) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstance = saveDB;
        GLOBAL_ATTRIBUTES_Instance = globalAttributes;
    },

    getHtml() {
        const pendingPetitions = Object.values(dbInstance.world.petitions || {}).filter(p => p.status === 'pending');
        const respondedPetitions = Object.values(dbInstance.world.petitions || {}).filter(p => p.status !== 'pending');

        const pendingPetitionsListHtml = pendingPetitions.map(p => `
            <div class="glass-card p-4 rounded-lg mb-2 animate-fade-in-up">
                <h4 class="text-lg font-bold text-white">Permohonan dari ${p.wandererName} (${p.type.charAt(0).toUpperCase() + p.type.slice(1)})</h4>
                <p class="text-slate-400 text-sm mt-1">Diajukan pada: ${new Date(p.submittedAt).toLocaleString('id-ID')}</p>
                <p class="text-slate-300 mt-2">"O Destiny Forger, hamba-Mu ${p.wandererName} memohon ${p.type === 'guidance' ? 'petunjuk' : p.type === 'trial' ? 'ujian' : 'berkah'}."</p>
                <div class="mt-4 flex justify-end space-x-2">
                    <button class="glass-button text-sm bg-emerald-600 hover:bg-emerald-500 respond-petition-btn" data-petition-id="${p.id}" data-action="grant">Kabulkan</button>
                    <button class="glass-button text-sm bg-red-600 hover:bg-red-500 respond-petition-btn" data-petition-id="${p.id}" data-action="deny">Tolak</button>
                </div>
            </div>
        `).join('');

        const respondedPetitionsListHtml = respondedPetitions.map(p => `
            <div class="glass-card p-4 rounded-lg mb-2 opacity-70 animate-fade-in-up">
                <h4 class="text-lg font-bold text-slate-400">Permohonan dari ${p.wandererName} (${p.type.charAt(0).toUpperCase() + p.type.slice(1)}) - ${p.status === 'granted' ? 'Dikabulkan' : 'Ditolak'}</h4>
                <p class="text-slate-500 text-sm mt-1">Diajukan: ${new Date(p.submittedAt).toLocaleString('id-ID')} | Direspons: ${new Date(p.respondedAt).toLocaleString('id-ID')}</p>
                <p class="text-slate-500 italic mt-2">${p.response}</p>
            </div>
        `).join('');


        return `
            <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6">Permohonan Jiwa</h3>
                <p class="text-slate-400 mb-6">Jiwa-jiwa memohon bimbingan, ujian, dan berkah dari Takdir Penempa.</p>

                <h4 class="text-xl font-serif text-white tracking-wider mb-4 border-b border-border-color pb-2">Permohonan Tertunda</h4>
                <div id="pending-petitions-list" class="mb-8">
                    ${pendingPetitions.length > 0 ? pendingPetitionsListHtml : '<p class="text-slate-500 italic">Tidak ada permohonan yang tertunda saat ini.</p>'}
                </div>

                <h4 class="text-xl font-serif text-white tracking-wider mb-4 border-b border-border-color pb-2">Permohonan yang Telah Direspons</h4>
                <div id="responded-petitions-list">
                    ${respondedPetitions.length > 0 ? respondedPetitionsListHtml : '<p class="text-slate-500 italic">Belum ada permohonan yang direspons.</p>'}
                </div>
            </div>
        `;
    },

    setupPage() {
        this.renderPetitionsList();
    },

    renderPetitionsList() {
        const pageContainer = document.getElementById('forger-page-container');
        if (pageContainer) { // Check if the container exists
            // Re-render the HTML content for petitions
            UIManager.render(pageContainer, this.getHtml());

            document.querySelectorAll('.respond-petition-btn').forEach(button => {
                button.onclick = (e) => {
                    const petitionId = e.target.dataset.petitionId;
                    const action = e.target.dataset.action;
                    this.handlePetitionResponse(petitionId, action);
                };
            });
            feather.replace();
        }
    },

    async handlePetitionResponse(petitionId, action) {
        const petition = dbInstance.world.petitions[petitionId];
        if (!petition) {
            UIManager.showNotification('Permohonan tidak ditemukan.', 'x-circle', 'bg-red-500');
            return;
        }

        if (petition.status !== 'pending') {
            UIManager.showNotification('Permohonan ini sudah direspons.', 'info', 'bg-blue-500');
            return;
        }

        UIManager.showLoading(`Merespons permohonan dari ${petition.wandererName}...`);

        petition.status = action === 'grant' ? 'granted' : 'denied';
        petition.respondedAt = new Date().toISOString();
        petition.response = action === 'grant' ? `Permohonan ${petition.type} Anda telah dikabulkan oleh Sang Penempa.` : `Permohonan ${petition.type} Anda telah ditolak oleh Sang Penempa.`;

        if (action === 'grant') {
            const wanderer = dbInstance.wanderers[petition.wandererName];
            if (wanderer) {
                if (petition.type === 'guidance') {
                    wanderer.chronicle.push({
                        id: Date.now(),
                        type: 'divine_guidance',
                        title: 'Petunjuk Ilahi Diterima',
                        spoil: 'Sebuah jalur terungkap.',
                        reflection: `Sang Penempa telah mengabulkan permohonan petunjukmu. Sebuah jalur baru kini terbuka dalam pemahamanmu.`,
                        timestamp: new Date().toISOString(),
                        sigil: 'map-pin'
                    });
                    UIManager.showNotification(`Jiwa ${wanderer.name} menerima petunjuk!`, 'compass', 'bg-blue-400');
                } else if (petition.type === 'trial') {
                    if (!wanderer.divineMandate || wanderer.divineMandate.completed) {
                         wanderer.divineMandate = {
                            id: `mandate_trial_${Date.now()}`,
                            title: `Ujian dari Sang Penempa (${GLOBAL_ATTRIBUTES_Instance[Math.floor(Math.random() * GLOBAL_ATTRIBUTES_Instance.length)]})`,
                            description: 'Sebuah ujian khusus yang dianugerahkan oleh Sang Penempa untuk menempa jiwamu.',
                            attribute: GLOBAL_ATTRIBUTES_Instance[Math.floor(Math.random() * GLOBAL_ATTRIBUTES_Instance.length)],
                            xpReward: 200,
                            completed: false,
                            assignedAt: new Date().toISOString()
                        };
                        UIManager.showNotification(`Jiwa ${wanderer.name} menerima ujian baru!`, 'sword', 'bg-orange-400');
                    } else {
                        UIManager.showNotification(`Jiwa ${wanderer.name} sudah memiliki titah aktif.`, 'info', 'bg-blue-500');
                    }
                } else if (petition.type === 'blessing') {
                    wanderer.xp += 500;
                    UIManager.showNotification(`Jiwa ${wanderer.name} menerima berkah XP!`, 'award', 'bg-yellow-400');
                }
            } else {
                console.warn(`Wanderer ${petition.wandererName} for petition ${petitionId} not found locally.`);
            }
        }

        await updateDocument("saga_worlds", DB_DOC_ID_Instance, {
            [`world.petitions.${petitionId}`]: petition,
            [`wanderers.${petition.wandererName}`]: dbInstance.wanderers[petition.wandererName] || null
        }, true);

        UIManager.hideLoading();
        UIManager.showNotification(`Permohonan dari ${petition.wandererName} telah direspons: ${action === 'grant' ? 'Dikabulkan' : 'Ditolak'}.`, action === 'grant' ? 'check-circle' : 'x-circle', action === 'grant' ? 'bg-green-500' : 'bg-red-500');
        this.renderPetitionsList(); // Re-render the petitions page to show updated list
    },
};