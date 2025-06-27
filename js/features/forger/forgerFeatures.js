// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:25 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Kontrol Takdir Personal Forger ==
// - Memastikan `ForgerPageRenderer.setDependencies` dipanggil dengan semua dependensi yang diperlukan.
// - Tidak ada logika bisnis utama yang ditambahkan di sini, karena sebagian besar manipulasi data ditangani di `forgerWandererDetailRenderer.js`.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 00:22 WITA ==
// == PERIHAL: Modul Fitur Penempa (Refactoring Penuh forgerPageRenderer.js) ==
// - forgerFeatures.js kini bertindak sebagai titik masuk utama untuk fitur Forger.
// - Modul ini menginisialisasi forgerPageRenderer dan meneruskan semua dependensi.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 23:07 WITA ==
// == PERIHAL: Implementasi Penuh Observatorium Kosmik (Cosmic Observatory) & Tempaan Dunia (World Forge) untuk Forger ==
// - Memastikan forgerFeatures.js memanggil ForgerPageRenderer.renderForgerPage dengan pageId 'observatory' sebagai halaman awal Forger.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 22:45 WITA ==
// == PERIHAL: Implementasi Penuh Tenunan Nubuat (Prophecies) untuk Forger ==
// - Memastikan forgerFeatures.js memanggil ForgerPageRenderer.renderForgerPage dengan pageId 'prophecies' sebagai halaman awal Forger.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 15:18 WITA ==
// == PERIHAL: Modul Fitur Penempa (Refactoring Tahap 1 - Pemisahan Logika Tampilan Halaman Forger) ==
// - Memindahkan semua logika rendering dan pengaturan tampilan yang spesifik untuk halaman Forger ke `js/features/forger/forgerPageRenderer.js`.
// - Mengimpor dan menggunakan modul `forgerPageRenderer.js` sebagai orkestrator tampilan.
// - Menjaga logika inti aplikasi Forger (mis. inisialisasi aplikasi) di sini.
// - Bergantung pada UIManager, AuthService, WorldManager, firebaseService, gameData, dan ForgerPageRenderer.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 14:09 WITA ==
// == PERIHAL: Modul Fitur Penempa ==
// - Mengisolasi semua logika yang terkait khusus dengan halaman Forger.
// - Menyediakan fungsi-fungsi seperti `initForgerPage`, `renderForgerNav`,
//   manajemen dunia (encounter, mandate, artifact, prophecy), dan fungsionalitas UI spesifik Forger.
// - Bergantung pada UIManager, AuthService, WorldManager, firebaseService, dan gameData.
// ===========================================

import { UIManager } from '../../uiManager.js';
import { getCurrentUser, AuthService as AuthServiceRef } from '../../authService.js'; // Mengimpor AuthService sebagai AuthServiceRef
import { ForgerPageRenderer } from './forgerPageRenderer.js';
import { WorldManager } from '../../worldManager.js';
import { NPC_PERSONALITY_TRAITS, NPC_HEALTH_STATES, NPC_LIFESTAGES, FACTION_TYPES, GLOBAL_ATTRIBUTES, SKILL_TREE_DATA, TRADABLE_ITEMS_DATA } from '../../gameData.js'; // Import all necessary gameData for dependencies

let dbInstance;
let DB_DOC_ID_Instance;
let saveDBInstance;

export const ForgerFeatures = {
    /**
     * Mengatur dependensi untuk modul ForgerFeatures.
     * @param {object} db - Instans database (dbInstance dari App).
     * @param {string} DB_DOC_ID - ID dokumen database utama.
     * @param {function} saveDB - Fungsi untuk menyimpan database.
     */
    setDependencies(db, DB_DOC_ID, saveDB) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstance = save;
        // Pass all necessary dependencies to the ForgerPageRenderer which then distributes them
        ForgerPageRenderer.setDependencies(
            dbInstance,
            DB_DOC_ID_Instance,
            saveDBInstance,
            WorldManager,
            NPC_PERSONALITY_TRAITS,
            NPC_HEALTH_STATES,
            NPC_LIFESTAGES,
            FACTION_TYPES,
            GLOBAL_ATTRIBUTES, // Pass GLOBAL_ATTRIBUTES
            SKILL_TREE_DATA,    // Pass SKILL_TREE_DATA
            TRADABLE_ITEMS_DATA // Pass TRADABLE_ITEMS_DATA
        );
    },

    // --- Inisialisasi Halaman Forger ---
    initForgerPage() {
        if (!getCurrentUser() || getCurrentUser().role !== 'forger') {
            // UBAH PANGGILAN LOGOUT DI SINI
            AuthServiceRef.logout(); // Panggil logout dari objek AuthServiceRef
            return;
        }
        document.getElementById('forger-app').style.display = 'flex';
        // UBAH PANGGILAN LOGOUT DI SINI UNTUK TOMBOL LOGOUT JUGA
        document.getElementById('logout-button').onclick = () => AuthServiceRef.logout(); // Panggil logout dari objek AuthServiceRef

        ForgerPageRenderer.renderForgerNav();
        ForgerPageRenderer.setupForgerNavEvents();
        // The default page is now handled by setupForgerNavEvents, which clicks 'observatory'
        // No explicit call to renderForgerPage here is needed unless a different default is desired.
    },
};