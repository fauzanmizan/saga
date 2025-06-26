// js/main.js

// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-26, 8:27 PM WITA ==
// == PERIHAL: Refactoring WorldManager.js - Pembaruan Dependency Injection ==
// - Mengubah impor WorldManager untuk menunjuk ke proxy.
// - Menyesuaikan pemanggilan setDependencies untuk WorldManager.
// - Menghapus inisialisasi properti dunia yang kini ditangani oleh coreStateManager.
// ===========================================
// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-24, 21:40 ==
// == PERIHAL: Implementasi Fase III - Notifikasi & Logging Detail ==
// - Memastikan UIManager.setDependencies(this.db, this.DB_DOC_ID) dipanggil setelah loadDB().
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:20 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Konflik & Evolusi Faksi NPC (Client-side) - Inisialisasi ==
// - Memastikan db.world.factions dan db.world.globalEvents terinisialisasi jika tidak ada di DB yang dimuat.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2023-06-23 14:25 WITA ==
// == PERIHAl: Koreksi & Permintaan Ulang Pengiriman main.js (Lengkap - Tahap 3 Refactoring) ==
// - Melampirkan file main.js yang telah dimodifikasi penuh untuk Tahap 3 refactoring.
// - Memastikan semua fungsi dan data spesifik halaman/statis dihapus dan diganti dengan impor modul.
// - Memastikan App.init() dan logika terkait menggunakan modul wandererFeatures, forgerFeatures, dan gameData.
// - Memperbarui catatan perubahan dan komentar dokumentasi.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2023-06-23 14:09 WITA ==
// == PERIHAl: Refactoring Tahap 3 - Pemisahan Logika Halaman & Data Statis ==
// - Memindahkan semua logika spesifik Wanderer ke wandererFeatures.js.
// - Memindahkan semua logika spesifik Forger ke forgerFeatures.js.
// - Memindahkan semua data statis (SKILL_TREE_DATA, GLOBAL_ATTRIBUTES, dll.) ke gameData.js.
// - Mengimpor dan menggunakan fungsionalitas dari modul-modul tersebut.
// - Mengubah main.js menjadi orkestrator utama aplikasi yang ramping.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2023-06-23 13:40 WITA ==
// == PERIHAl: Refactoring Tahap 2 - Pemisahan Logika Otentikasi & Dunia ==
// - Memindahkan semua logika otentikasi dan sesi ke authService.js.
// - Memindahkan semua logika manajemen dunia (NPC, resonansi) ke worldManager.js.
// - Mengimpor dan menggunakan fungsionalitas dari modul-modul tersebut.
// - Memastikan semua fungsionalitas yang ada tetap berfungsi 100% seperti sebelumnya.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2023-06-23 13:20 WITA ==
// == PERIHAl: Refactoring Tahap 1 - Pemisahan Modul Inti (Firebase & UIManager) ==
// - Memindahkan inisialisasi Firebase dan fungsi interaksi Firestore ke firebaseService.js.
// - Memindahkan objek UIManager dan semua fungsi pembantu UI ke uiManager.js.
// - Mengimpor dan menggunakan fungsionalitas dari modul-modul tersebut.
// - Memastikan semua fungsionalitas yang ada tetap berfungsi 100% seperti sebelumnya.
// ===========================================

/*
 * The Soulforge Saga - The Shattered Mirror (v6.4 - Kedalaman Interogasi & Sanctuary)
 * Sebuah dunia yang utuh, hidup, dan bernapas narasi.
 * Ditempa ulang pada Minggu, 22 Juni 2025, pukul 01:31 PM WITA.
 *
 * Perbaikan & Pengembangan Terakhir:
 * - Integrasi Lore & Narasi Utama: Primordial Weaver, Forger, Eternal Echo, Sparks, Convergence.
 * - Mekanika Dunia Sistem Nexus: Regional Intention/Echo memengaruhi Sanctum/Maelstrom.
 * - Penciptaan Jiwa yang Bermakna: Pertanyaan filosofis menentukan alignment awal.
 * - Visualisasi Encounter Dinamis: Efek visual/audio untuk Whisper/Glimmer.
 * - Dasbor Pengembara Imersif: UI sebagai representasi Sanctuary (kristal, timbangan fisik, dinding kronik).
 * - Papan Peringkat Jiwa: Gabungan Player & NPC, sorting, visualisasi tipe.
 * - Altar Permohonan (Wanderer dapat memohon, Forger dapat melihat & merespons).
 * - Bengkel Wahyu (Forger): CRUD Encounters.
 * - Tempaan Artefak (Forger): UI dasar & logika penyimpanan.
 * - Tenunan Nubuat (Forger): UI dasar & logika pengiriman ke Chronicle.
 * - Otomatisasi NPC: Generate, progres harian sederhana.
 * - Resonansi Dunia: Global & Regional (konsep).
 * - Peningkatan Glassmorphism UI/UX: Transparansi, blur, shadow, animasi mikro.
 * - Perbaikan semua TypeError sebelumnya.
 * - Penyempurnaan tata letak responsif.
 * - Mini-game "Menginterogasi" (Barikade Mental) LENGKAP dengan logika, UI, dan integrasi skill Inkuisitor.
 * - Evolusi visual Tempat Perlindungan Jiwa (Sanctuary) berdasarkan Soul Rank & Alignment.
 * - Persiapan Desain Audio.
 */

// Bagian 1: Impor & Inisialisasi
import { getDocument, setDocument, updateDocument } from './firebaseService.js';
import { UIManager } from './uiManager.js';
import { AuthService, setSaveDB, getCurrentUser, setCurrentUser } from './authService.js';
import { WorldManager } from './worldManager.js'; // Updated import path to the proxy
import { WandererFeatures } from './features/wanderer/wandererFeatures.js';
import { ForgerFeatures } from './features/forger/forgerFeatures.js';
import { FACTION_TYPES } from './gameData.js'; // Keep for defaultDB if needed in App.loadDB

// Bagian 2: Objek App - Jantung Operasi
const App = {
    DB_DOC_ID: 'soulforgeSaga_v2.0_KitabAgung',
    db: {},
    currentUser: null,
    forgerMantra: 'i am the forger',
    destinyClockInterval: null,
    wandererAttributeChart: null,
    pageTemplates: {},
    echoHarmonizationCanvas: null,
    echoHarmonizationCtx: null,

    async init() {
        UIManager.showLoading("Menghubungi Tenunan Kosmik...");
        await this.loadDB();

        UIManager.setDependencies(this.db, this.DB_DOC_ID);

        // Pass core dependencies to AuthService, WorldManager, WandererFeatures, and ForgerFeatures
        // WorldManager now uses the new setDependencies
        WorldManager.setDependencies(this.db, this.DB_DOC_ID, this.saveDB.bind(this));
        AuthService.setDependencies(this.db, this.currentUser, this.forgerMantra, this.destinyClockInterval, WorldManager.updateWorldResonance);
        setSaveDB(this.saveDB.bind(this)); // For authService to call App.saveDB
        WandererFeatures.setDependencies(this.db, this.saveDB.bind(this), this.destinyClockInterval);
        ForgerFeatures.setDependencies(this.db, this.DB_DOC_ID, this.saveDB.bind(this));

        // The following initializations are now handled by coreStateManager._initializeMissingWorldProperties()
        // which is called by WorldManager.setDependencies.
        // No direct Firestore update for these default values here, as loadDB and coreStateManager handle existence.
        // Forger will trigger initial NPC generation and daily simulation.
        const currentPage = document.body.dataset.page;
        if (currentPage === 'forger') {
            await WorldManager.generateInitialNpcs(); // Still call explicitly for initial generation
            // The simulateNpcProgress here is for initial load. Daily updates will be by dailyWorldUpdate.
            await WorldManager.simulateNpcProgress();
        }

        await WorldManager.updateWorldResonance(); // Using WorldManager proxy

        AuthService.checkSession(currentPage);
        this.currentUser = getCurrentUser();

        UIManager.hideLoading();

        switch (currentPage) {
            case 'login':
                AuthService.initLoginPage();
                break;
            case 'wanderer':
                if (this.currentUser && this.currentUser.role === 'wanderer') {
                    WandererFeatures.definePageTemplates();
                    WandererFeatures.initWandererPage();
                } else {
                    AuthService.logout();
                }
                break;
            case 'forger':
                if (this.currentUser && this.currentUser.role === 'forger') {
                    ForgerFeatures.initForgerPage();
                } else {
                    AuthService.logout();
                }
                break;
            default:
                AuthService.logout();
                break;
        }
    },

    async loadDB() {
        const docSnap = await getDocument("saga_worlds", this.DB_DOC_ID);
        if (docSnap.exists()) {
            this.db = docSnap.data();
        } else {
            // Get default DB structure from coreStateManager
            const { coreStateManager } = await import('./world/coreStateManager.js'); // Dynamically import to avoid circular dependency at top
            coreStateManager.setDependencies(this.db, this.DB_DOC_ID); // Ensure coreStateManager has dbInstance context
            this.db = coreStateManager._getDefaultDBStructure();
        }
    },

    async saveDB(showLoading = true) {
        if (showLoading) UIManager.showLoading("Menyimpan takdir ke awan...");
        if (getCurrentUser() && getCurrentUser().role === 'wanderer') {
            this.db.wanderers[getCurrentUser().name] = getCurrentUser();
        }
        await setDocument("saga_worlds", this.DB_DOC_ID, this.db, true);
        if (showLoading) UIManager.hideLoading();
    },

    initWandererPage() {
        WandererFeatures.initWandererPage();
    },

    initForgerPage() {
        ForgerFeatures.initForgerPage();
    },
};

window.particles = [];

document.addEventListener('DOMContentLoaded', () => {
    App.init();

    const exportButton = document.getElementById('export-button');
    const importInput = document.getElementById('import-input');

    if (exportButton) {
        exportButton.onclick = () => WandererFeatures.exportSaga();
    }
    if (importInput) {
        importInput.onchange = (e) => {
            if (e.target.files.length > 0) {
                WandererFeatures.importSaga(e.target.files[0]);
            }
        };
    }

    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'overlay-container';
    document.body.appendChild(overlayContainer);

    const notificationBanner = document.createElement('div');
    notificationBanner.id = 'notification-banner';
    notificationBanner.className = `fixed top-0 left-0 right-0 p-4 text-slate-900 font-bold text-center z-50 shadow-lg opacity-0`;
    notificationBanner.innerHTML = `
        <div class="flex items-center justify-center">
            <i id="notification-icon" data-feather="award" class="w-6 h-6 mr-3"></i>
            <span id="notification-text"></span>
        </div>
    `;
    document.body.appendChild(notificationBanner);
    feather.replace();

    const backgroundCanvas = document.getElementById('background-canvas');
    if (backgroundCanvas) {
        const ctx = backgroundCanvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        backgroundCanvas.width = width;
        backgroundCanvas.height = height;

        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            backgroundCanvas.width = width;
            backgroundCanvas.height = height;
        });

        window.particles = [];
        const numParticles = 100;

        function Particle(x, y, radius, color, velocity) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = velocity;

            this.draw = function() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            };

            this.update = function() {
                this.x += this.velocity.x;
                this.y += this.velocity.y;

                if (this.x - this.radius < 0 || this.x + this.radius > width) {
                    this.velocity.x = -this.velocity.x;
                }
                if (this.y - this.radius < 0 || this.y + this.radius > height) {
                    this.velocity.y = -this.velocity.y;
                }
                this.draw();
            };
        }

        function initParticles() {
            for (let i = 0; i < numParticles; i++) {
                const radius = Math.random() * 2 + 1;
                const x = Math.random() * (width - radius * 2) + radius;
                const y = Math.random() * (height - radius * 2) + radius;
                const color = `rgba(129, 140, 248, ${Math.random() * 0.5 + 0.1})`;
                const velocity = {
                    x: (Math.random() - 0.5) * 0.5,
                    y: (Math.random() - 0.5) * 0.5
                };
                window.particles.push(new Particle(x, y, radius, color, velocity));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < window.particles.length; i++) {
                window.particles[i].update();
            }

            for (let i = 0; i < window.particles.length; i++) {
                for (let j = i; j < window.particles.length; j++) {
                    const dx = window.particles[i].x - window.particles[j].x;
                    const dy = window.particles[i].y - window.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(window.particles[i].x, window.particles[i].y);
                        ctx.lineTo(window.particles[j].x, window.particles[j].y);
                        ctx.lineWidth = 0.5;
                        ctx.strokeStyle = `rgba(129, 140, 248, ${1 - (distance / 100)})`;
                        ctx.stroke();
                    }
                }
            }
        }

        initParticles();
        animate();
    }
});