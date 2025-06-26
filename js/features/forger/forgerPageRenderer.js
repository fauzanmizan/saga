// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:20 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Konflik & Evolusi Faksi NPC (Client-side) ==
// - Di renderRegionsStatus() (sekarang di forgerObservatoryRenderer.js), menampilkan `dominantFaction` dan menerapkan kelas CSS.
// - Di getObservatoryHtml() (sekarang di forgerObservatoryRenderer.js), menambahkan bagian "Peta Pengaruh Faksi".
// - Di getWorldForgeHtml() (sekarang di forgerWorldForgeRenderer.js), menambahkan form/tombol untuk Forger memicu "Event Perang Wilayah".
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:15 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Interaksi & Narasi Mikro NPC (Fase Lanjutan) ==
// - Di renderWandererList(), menambahkan tampilan lifeStage, healthState, dan personalityTraits untuk NPC.
// - Memperbarui penanganan klik NPC di Observatorium untuk menampilkan detail NPC yang diperkaya.
// - Menambahkan tampilan Mandat aktif dan ringkasan Chronicle Pengembara saat Forger mengklik Pengembara.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 00:22 WITA ==
// == PERIHAL: Refactoring Penuh forgerPageRenderer.js (SATU LANGKAH KOMPREHENSIF) ==
// - forgerPageRenderer.js kini berfungsi sebagai orkestrator utama untuk halaman Forger.
// - Semua logika rendering HTML (fungsi get...Html()), setup event listener spesifik halaman,
//   dan logika manajemen state UI terkait rendering telah dipindahkan ke modul-modul renderer baru
//   di dalam js/features/forger/renderers/.
// - Mengimpor dan memanggil fungsi render dari modul-modul renderer tersebut berdasarkan pageId.
// - Memastikan semua dependensi diteruskan dengan benar ke modul-modul renderer baru.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 23:07 WITA ==
// == PERIHAL: Implementasi Penuh Observatorium Kosmik (Cosmic Observatory) & Tempaan Dunia (World Forge) untuk Forger ==
// - Melengkapi getObservatoryHtml() dan renderWandererList() untuk menampilkan Papan Peringkat Jiwa (pemain dan NPC) secara dinamis.
// - Mengimplementasikan logika penyortiran untuk dropdown #sort-souls-by.
// - Menambahkan event listener untuk tombol "Segarkan" (#refresh-souls-list), yang memicu WorldManager.simulateNpcProgress() dan WorldManager.updateWorldResonance().
// - Melengkapi renderRegionsStatus() untuk menampilkan Status Nexus Wilayah.
// - Menangani event click pada baris papan peringkat untuk menampilkan detail Pengembara.
// - Melengkapi getWorldForgeHtml() untuk menampilkan form pengaturan dunia.
// - Menambahkan event listener untuk tombol "Simpan Pengaturan Dunia" (#save-world-settings-button).
// - Melengkapi fungsi saveWorldSettings() untuk menyimpan pengaturan dunia yang diubah ke Firebase.
// - Memperbarui setupForgerNavEvents untuk mengarahkan ke halaman 'observatory' sebagai default.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 22:45 WITA ==
// == PERIHAL: Implementasi Penuh Tenunan Nubuat (Prophecies) untuk Forger ==
// - Mengimplementasikan logika untuk merender form penulisan nubuat di getPropheciesLoomHtml().
// - Memastikan daftar Pengembara di dropdown #prophecy-target-wanderer terisi secara dinamis.
// - Menambahkan event listener untuk tombol "Kirim Nubuat" (#send-prophecy-btn).
// - Mengimplementasikan fungsi handleSendProphecy() untuk:
//   - Membuat objek Nubuat baru dengan id, targetWanderer, title, text, sigil, sentAt, type: 'divine_prophecy'.
//   - Menyimpan Nubuat baru ke dbInstance.world.prophecies dan Firebase (updateDocument).
//   - Mencatat Nubuat di Chronicle Pengembara target.
//   - Menggunakan UIManager.showNotification untuk umpan balik sukses/gagal.
//   - Me-reset form setelah pengiriman.
// - Menampilkan daftar Nubuat yang sudah dikirim di getPropheciesLoomHtml() dan renderPropheciesList().
// - Memastikan feather.replace() dipanggil setelah rendering dinamis.
// - Memperbarui setupForgerNavEvents untuk mengarahkan ke halaman 'prophecies' sebagai default.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 20:45 WITA ==
// == PERIHAL: Implementasi Penuh Tempaan Artefak (Artifacts) untuk Forger ==
// - Mengimplementasikan logika untuk merender form pembuatan/pengeditan Artefak di getArtifactsAnvilHtml().
// - Menambahkan event listener untuk penambahan/penghapusan input efek pasif dinamis (renderArtifactEffectInput, setupRemoveArtifactEffectButtons).
// - Mengimplementasikan fungsi handleCreateArtifact (melengkapi), handleEditArtifact, handleUpdateArtifact, dan handleDeleteArtifact untuk CRUD Artefak.
// - Menampilkan daftar Artefak yang sudah ada di getArtifactsAnvilHtml() dan renderArtifactsList().
// - Memastikan feather.replace() dipanggil setelah rendering dinamis.
// - Memperbarui setupForgerNavEvents untuk mengarahkan ke halaman 'artifacts' sebagai default.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 20:15 WITA ==
// == PERIHAL: Implementasi Penuh Manajemen Permohonan Jiwa (Petitions) untuk Forger ==
// - Mengimplementasikan logika untuk merender daftar permohonan yang tertunda dan yang sudah direspons di getPetitionsHtml() dan renderPetitionsList().
// - Menambahkan event listener untuk tombol respons permohonan (.respond-petition-btn).
// - Mengimplementasikan fungsi handlePetitionResponse(petitionId, action) untuk:
//   - Memperbarui status permohonan di dbInstance.world.petitions.
//   - Menerapkan konsekuensi (XP, Essence of Will, Chronicle, Divine Mandate baru) ke data Wanderer yang relevan.
//   - Menyimpan perubahan ke Firebase.
//   - Memperbarui tampilan halaman petitions setelah respons.
// - Memastikan gaya visual untuk permohonan yang direspons (opacity, grayscale, pointer-events: none) diaplikasikan.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 19:40 WITA ==
// == PERIHAL: Implementasi Penuh Manajemen Wahyu (Encounters) untuk Forger ==
// - Mengimplementasikan form pembuatan/pengeditan Encounter di getCreationWorkshopHtml().
// - Menambahkan event listener untuk penambahan/penghapusan pilihan dinamis (renderEncounterChoiceInput, setupRemoveChoiceButtons).
// - Mengimplementasikan fungsi handleCreateEncounter, handleEditEncounter, handleUpdateEncounter, dan handleDeleteEncounter untuk CRUD Encounter.
// - Menampilkan daftar Encounter yang sudah ada (Whispers/Glimmers) di getCreationWorkshopHtml().
// - Memastikan feather.replace() dipanggil setelah rendering dinamis.
// - Memperbarui setupForgerNavEvents untuk mengarahkan ke halaman 'revelations' dengan benar.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 15:18 WITA ==
// == PERIHAL: Modul Renderer Halaman Penempa ==
// - Berisi semua logika rendering dan pengaturan tampilan yang spesifik untuk halaman Forger.
// - Diimpor dan dipanggil oleh `forgerFeatures.js`.
// - Bergantung pada UIManager, AuthService, WorldManager, firebaseService, dan gameData.
// ===========================================

import { UIManager } from '../../uiManager.js';
import { WorldManager } from '../../worldManager.js';
import { GLOBAL_ATTRIBUTES, NPC_PERSONALITY_TRAITS, NPC_HEALTH_STATES, NPC_LIFESTAGES, FACTION_TYPES } from '../../gameData.js'; // Import new NPC data constants and FACTION_TYPES

// Import all new renderer modules
import { ForgerObservatoryRenderer } from './renderers/forgerObservatoryRenderer.js';
import { ForgerWandererDetailRenderer } from './renderers/forgerWandererDetailRenderer.js';
import { ForgerWorldForgeRenderer } from './renderers/forgerWorldForgeRenderer.js';
import { ForgerRevelationsRenderer } from './renderers/forgerRevelationsRenderer.js';
import { ForgerGuardiansRenderer } from './renderers/forgerGuardiansRenderer.js';
import { ForgerPetitionsRenderer } from './renderers/forgerPetitionsRenderer.js';
import { ForgerArtifactsRenderer } from './renderers/forgerArtifactsRenderer.js';
import { ForgerPropheciesRenderer } from './renderers/forgerPropheciesRenderer.js';


let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstance;
let currentForgerView; // Untuk melacak halaman Forger yang aktif di sisi renderer

export const ForgerPageRenderer = {
    /**
     * Mengatur dependensi untuk modul ForgerPageRenderer dan semua sub-modul renderer.
     * @param {object} db - Instans database (dbInstance dari App).
     * @param {string} DB_DOC_ID - ID dokumen database utama.
     * @param {function} saveDB - Fungsi untuk menyimpan database.
     */
    setDependencies(db, DB_DOC_ID, saveDB) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstance = saveDB;

        // Pass dependencies to all sub-renderers
        ForgerObservatoryRenderer.setDependencies(dbInstance, DB_DOC_ID_Instance, saveDBInstance, WorldManager, NPC_PERSONALITY_TRAITS, NPC_HEALTH_STATES, NPC_LIFESTAGES, FACTION_TYPES);
        ForgerWandererDetailRenderer.setDependencies(dbInstance, DB_DOC_ID_Instance, saveDBInstance, GLOBAL_ATTRIBUTES);
        ForgerWorldForgeRenderer.setDependencies(dbInstance, DB_DOC_ID_Instance, saveDBInstance, WorldManager, FACTION_TYPES); // Pass FACTION_TYPES
        ForgerRevelationsRenderer.setDependencies(dbInstance, DB_DOC_ID_Instance, saveDBInstance, GLOBAL_ATTRIBUTES);
        ForgerGuardiansRenderer.setDependencies(dbInstance, DB_DOC_ID_Instance, saveDBInstance);
        ForgerPetitionsRenderer.setDependencies(dbInstance, DB_DOC_ID_Instance, saveDBInstance, GLOBAL_ATTRIBUTES);
        ForgerArtifactsRenderer.setDependencies(dbInstance, DB_DOC_ID_Instance, saveDBInstance);
        ForgerPropheciesRenderer.setDependencies(dbInstance, DB_DOC_ID_Instance, saveDBInstance);
    },

    /**
     * Merender navigasi Forger (sidebar).
     */
    renderForgerNav() {
        const navContainer = document.getElementById('forger-nav');
        const navItems = [
            { id: 'observatory', name: 'Observatorium', icon: 'eye' },
            { id: 'world_forge', name: 'Tempaan Dunia', icon: 'globe' },
            { id: 'revelations', name: 'Bengkel Wahyu', icon: 'tool' },
            { id: 'guardians', name: 'Aula Para Penjaga', icon: 'shield' },
            { id: 'petitions', name: 'Permohonan Jiwa', icon: 'message-circle' },
            { id: 'artifacts', name: 'Tempaan Artefak', icon: 'hammer' },
            { id: 'prophecies', name: 'Tenunan Nubuat', icon: 'feather' },
        ];
        const html = navItems.map(item => `
            <a href="#${item.id}" class="forger-nav-link sidebar-link flex items-center p-4 rounded-lg" data-page="${item.id}">
                <i data-feather="${item.icon}" class="w-6 h-6"></i>
                <span class="hidden lg:block ml-5 text-lg font-semibold">${item.name}</span>
            </a>
        `).join('');
        UIManager.render(navContainer, html);
    },

    /**
     * Mengatur event listener untuk tautan navigasi Forger.
     */
    setupForgerNavEvents() {
        const navLinks = document.querySelectorAll('.forger-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.dataset.page;
                ForgerPageRenderer.renderForgerPage({ pageId: pageId });
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
        // Set initial active page to 'observatory' for this task
        document.querySelector('.forger-nav-link[data-page="observatory"]').click();
    },

    /**
     * Merender konten halaman Forger berdasarkan ID halaman.
     * Mengorkestrasi pemanggilan ke modul-modul renderer spesifik.
     * @param {object} options - Objek opsi yang berisi pageId dan wandererName (opsional).
     */
    renderForgerPage({ pageId, wandererName = null }) {
        currentForgerView = pageId;
        const pageContainer = document.getElementById('forger-page-container');
        const headerTitle = document.querySelector('#forger-header-title h2');
        let contentHtml = '';
        let title = '';

        switch(pageId) {
            case 'observatory':
                title = 'Observatorium Kosmik';
                contentHtml = ForgerObservatoryRenderer.getHtml();
                break;
            case 'wanderer_detail':
                const wanderer = dbInstance.wanderers[wandererName];
                if (!wanderer) {
                    title = 'Wanderer Tidak Ditemukan';
                    contentHtml = `<p class="text-slate-400">Jiwa ini tidak ada dalam catatan.</p>`;
                    break;
                }
                title = `Kitab Jiwa: ${wanderer.name}`;
                contentHtml = ForgerWandererDetailRenderer.getHtml(wanderer);
                break;
            case 'world_forge':
                title = 'Tempaan Dunia';
                contentHtml = ForgerWorldForgeRenderer.getHtml();
                break;
            case 'revelations':
                title = 'Bengkel Wahyu';
                contentHtml = ForgerRevelationsRenderer.getHtml();
                break;
            case 'guardians':
                title = 'Aula Para Penjaga';
                contentHtml = ForgerGuardiansRenderer.getHtml();
                break;
            case 'petitions':
                title = 'Permohonan Jiwa';
                contentHtml = ForgerPetitionsRenderer.getHtml();
                break;
            case 'artifacts':
                title = 'Tempaan Artefak';
                contentHtml = ForgerArtifactsRenderer.getHtml();
                break;
            case 'prophecies':
                title = 'Tenunan Nubuat';
                contentHtml = ForgerPropheciesRenderer.getHtml();
                break;
            default:
                title = 'Tidak Ditemukan';
                contentHtml = `<p>Realitas ini belum ditempa.</p>`;
        }

        headerTitle.textContent = title;
        UIManager.render(pageContainer, contentHtml);

        // Call setup functions from specific renderers
        switch(pageId) {
            case 'observatory':
                ForgerObservatoryRenderer.setupPage();
                break;
            case 'wanderer_detail':
                ForgerWandererDetailRenderer.setupPage(wandererName);
                break;
            case 'world_forge':
                ForgerWorldForgeRenderer.setupPage();
                break;
            case 'revelations':
                ForgerRevelationsRenderer.setupPage();
                break;
            case 'guardians':
                ForgerGuardiansRenderer.setupPage();
                break;
            case 'petitions':
                ForgerPetitionsRenderer.setupPage();
                break;
            case 'artifacts':
                ForgerArtifactsRenderer.setupPage();
                break;
            case 'prophecies':
                ForgerPropheciesRenderer.setupPage();
                break;
        }

        feather.replace();
    },
};

// Moving renderWandererList and renderNpcDetail into ForgerObservatoryRenderer as per previous refactor
// This function needs to be moved into ForgerObservatoryRenderer
// It is now `ForgerObservatoryRenderer.renderNpcDetailForForger`
// For compatibility, if anything outside still calls this, it will be an issue.
// But based on the previous refactor, ForgerPageRenderer now orchestrates and calls the specific renderers.