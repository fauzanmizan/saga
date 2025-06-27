// js/features/wanderer/wandererPageRenderer.js

// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-27, 06:05 WITA ==
// == PERIHAL: Perbaikan Akses Data dalam Template HTML ==
// - Menghapus akses langsung ke dbInstance.world.regions, WORLD_LANDMARKS, dan data dinamis lainnya
//   dari string HTML literal di definePageTemplates() untuk halaman 'world_map'.
// - Data ini sekarang akan di-render sepenuhnya secara dinamis oleh renderWorldMap().
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-27, 05:40 WITA ==
// == PERIHAL: Perbaikan Scope dbInstance dan Referensi Data Global ==
// - Menghapus deklarasi 'let dbInstance;' yang berlebihan di awal modul.
// - Memastikan akses ke dbInstance.wanderer atau dbInstance.currentUser di tempat yang tepat.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, [Jam:Menit] ==
// == PERIHAL: Implementasi Fase IV - Narasi Dinamis & Sistem Warisan Awal ==
// ===========================================
// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-24, [10:49] ==
// == PERIHAL: Implementasi Fase III - Notifikasi & Logging Detail ==
// - Memperbarui definePageTemplates() untuk menyertakan tab Event Log.
// - Mengimplementasikan fungsi renderNotificationLog() untuk menampilkan log historis.
// - Memperbarui setupQuestLogTabs() untuk mengelola tab baru.
// - Memanggil renderNotificationLog() di renderAllWandererComponents()
// ===========================================
// == MODIFIED BY: Tim 3.C ==
// == TANGGAL: 2025-06-24, 21:36 ==
// == PERIHAL: Implementasi Fase III - Inventaris Penuh & Manajemen Item ==
// - Menambahkan link navigasi 'inventory' ke sidebar.
// - Mendefinisikan template HTML untuk halaman inventaris.
// - Mengimplementasikan logika renderInventoryPage untuk menampilkan item dengan detail.
// - Mengimplementasikan fungsi pengurutan dan pemfilteran item.
// - Mengimplementasikan _showItemDetailPanel dan _hideItemDetailPanel untuk panel detail item.
// - Menambahkan placeholder fungsi _useItem, _equipItem, _discardItem.
// - Memperbarui _getDOMElementsForPage untuk mengambil elemen DOM terkait inventaris.
// - Memperbarui setupWandererNavEvents dan renderAllWandererComponents untuk menangani halaman 'inventory'.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 20:16 ==
// == PERIHAL: Implementasi Fase III - Misi NPC Generik (Fetch/Delivery) ==
// - Menambahkan import dan inisialisasi modul questManager.
// - Memperbarui renderActiveQuestsLog() untuk menampilkan misi aktif.
// - Memanggil checkQuestCompletion() di tempat yang relevan.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 19:40 ==
// == PERIHAL: Implementasi Fase III - Interaksi NPC Mendalam (Sistem Dialog/Pilihan Cabang Sederhana) ==
// - Menambahkan import dan inisialisasi modul npcInteraction.
// - Mengimplementasikan fungsi renderNpcList untuk menampilkan NPC interaktif di World Map atau area lain.
// - Memastikan `renderWorldMap` memanggil `renderNpcList` untuk wilayah Wanderer saat ini.
// - Memperbarui `renderChronicle` untuk menggunakan `dbInstance.wanderers[dbInstance.currentUser.name].chronicle`
//   secara eksplisit untuk data kronik yang akurat.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 18:32 WITA ==
// == PERIHAL: Implementasi Penuh Peta Dunia Interaktif & Sistem Nexus Dinamis ==
// - Mengimplementasikan fungsi renderWorldMap untuk secara dinamis merender penanda wilayah, menerapkan status Nexus, dan menangani event klik.
// - Mengimplementasikan logika untuk menampilkan, mengisi, dan menyembunyikan panel detail wilayah (#region-detail-panel).
// - Menambahkan event listener untuk tombol Fortify dan Cleansing pada panel detail wilayah, yang akan memanggil WorldManager.
// - Menambahkan logika dasar untuk tombol zoom peta.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 18:09 WITA ==
// == PERIHAL: Pembaruan Pemicuan Mini-game Memesan (Kerajinan Kustom) ==
// - Mengganti panggilan placeholder triggerCommissionMiniGame dengan panggilan ke modul CommissionGame yang baru.
// - Memastikan dependensi untuk CommissionGame diatur dengan benar.
// - Memperbarui renderSkillTree untuk menampilkan skill Sang Juru Karya.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 17:35 WITA ==
// == PERIHAL: Pembaruan Pemicuan Mini-game Bertukar (Perdagangan Unik) ==
// - Mengganti panggilan placeholder triggerBarterMiniGame dengan panggilan ke modul BarterGame yang baru.
// - Memastikan dependensi untuk BarterGame diatur dengan benar.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 17:20 WITA ==
// == PERIHAL: Pembaruan Pemicuan Mini-game Menginspirasi (Fokus Motivasi) ==
// - Mengganti panggilan placeholder triggerInspireMiniGame dengan panggilan ke modul InspireGame yang baru.
// - Memastikan dependensi untuk InspireGame diatur dengan benar.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 17:00 WITA ==
// == PERIHAL: Implementasi Penuh Mini-game Merasakan (Spektrum Emosi) ==
// - Mengimplementasikan logika gameplay penuh untuk mini-game "Spektrum Emosi".
// - Menambahkan fungsi triggerEmpathizeMiniGame dan logika terkait.
// - Mencakup visualisasi Spektrum Emosi (canvas), Penanda Jiwa NPC, Instrumen Nada Jiwa.
// - Mengintegrasikan atribut Social dan Focus pemain.
// - Menangani kondisi keberhasilan/kegagalan dan pembaruan data pemain (XP, Essence of Will, Chronicle, reputasi NPC).
// - Mengintegrasikan skill Sang Empati.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 16:00 WITA ==
// == PERIHAL: Pembaruan Pemicuan Mini-game Menantang (Duel Niat) ==
// - Mengganti panggilan placeholder triggerChallengeMiniGame dengan panggilan ke modul ChallengeGame yang baru.
// - Memastikan dependensi untuk ChallengeGame diatur dengan benar.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 15:10 WITA ==
// == PERIHAL: Modul Renderer Halaman Pengembara ==
// - Berisi semua logika rendering dan pengaturan tampilan yang spesifik untuk halaman Wanderer.
// - Diimpor dan dipanggil oleh `wandererFeatures.js`.
// - Bergantung pada UIManager, AuthService, WorldManager, firebaseService, dan gameData.
// ===========================================
// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-24, 22:45 ==
// == PERIHAL: Implementasi Fase III - Notifikasi & Logging Detail ==
// - Memperbarui definePageTemplates() untuk menyertakan tab Event Log.
// - Mengimplementasikan fungsi renderNotificationLog() untuk menampilkan log historis.
// - Memperbarui setupQuestLogTabs() untuk mengelola tab baru.
// - Memanggil renderNotificationLog() di renderAllWandererComponents()
// ===========================================
// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-24, 23:06 WITA ==
// == PERIHAL: Implementasi Fase IV - Narasi Dinamis & Sistem Warisan Awal ==
// - Memastikan renderChronicle() mendukung tampilan entri Chronicle yang lebih kaya, termasuk ikon (sigil) dan deskripsi.
// - Memastikan renderAllWandererComponents() dipanggil di tempat yang relevan.
// ===========================================
// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-25, 00:00 WITA ==
// == PERIHAL: Implementasi Fase IV - Evolusi Dunia Lanjutan & Pilihan Konsekuensial ==
// - Mengatur visual global berdasarkan siklus kosmik (_applyCosmicTheme).
// - Menampilkan legacyPoints Wanderer di halaman karakter (renderPlayerStatus).
// ===========================================
// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-25, 00:07 WITA ==
// == PERIHAL: Verifikasi & Penyesuaian Implementasi Fase IV ==
// - Menyesuaikan path import untuk COSMIC_CYCLES agar sesuai dengan gameData.js yang diperbarui.
// - Memastikan pemanggilan _applyCosmicTheme dilakukan di renderWandererPage.
// - Memperbarui referensi elemen DOM untuk inventory, chronicle, dan notification log agar konsisten dengan struktur yang diharapkan.
// - Menggabungkan perubahan dari file yang lebih baru ke dalam file utama.
// - Memastikan `getCurrentUser()` digunakan secara konsisten.
// ===========================================
// == MODIFIED BY: Tim 3.C ==
// == TANGGAL: 2025-06-25, 12:37 ==
// == PERIHAL: Implementasi Fase IV - Jurnal & Peta Berpeta Interaktif ==
// - Menambahkan link navigasi 'journal' ke sidebar (renderWandererNav).
// - Mendefinisikan template HTML untuk halaman jurnal (definePageTemplates).
// - Mengimplementasikan fungsi renderJournalPage untuk menampilkan entri jurnal dengan filter/sortir.
// - Mengimplementasikan fungsi _addPersonalReflection untuk menambahkan entri refleksi pribadi.
// - Menambahkan logika rendering POI dinamis ke renderWorldMap.
// - Mengimplementasikan _showPoiDetailPanel dan _hidePoiDetailPanel untuk detail POI di peta.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-25, 13:08 ==
// == PERIHAL: Integrasi Massif GameData.js ke WandererPageRenderer.js ==
// - Memperbarui `renderWandererNav` untuk menyertakan tautan 'Jurnal'.
// - Memperbarui `renderWandererPage` untuk memanggil `_getDOMElementsForPage` dan `renderAllWandererComponents`.
// - Memperbarui `_getDOMElementsForPage` untuk mengambil elemen DOM terkait jurnal dan panel detail POI.
// - Memperbarui `renderAllWandererComponents` untuk memanggil `renderJournalPage` dan `renderWorldMap` (dengan POI).
// - Mengimplementasikan `_applyCosmicTheme` untuk visual global berdasarkan siklus kosmik.
// - Memperbarui `renderCharacterPage` untuk menampilkan `legacyPoints` Wanderer.
// - Memperbarui `renderNpcList` untuk menampilkan `npc.role` dan `npc.personalityTraits`.
// - Memperbarui `renderChronicle` untuk menggunakan `entry.icon` dan `entry.description` yang lebih kaya.
// - Mengimplementasikan `renderJournalPage` untuk menampilkan entri jurnal dinamis dengan filter/sortir.
// - Mengimplementasikan `_addPersonalReflection` untuk menambahkan entri jurnal pribadi.
// - Memperbarui `renderWorldMap` untuk:
//     - Menggambar wilayah dari `REGIONS_DATA`.
//     - Menggambar POI dari `WORLD_LANDMARKS` dengan status visual yang berbeda.
//     - Menangani pop-up info untuk wilayah dan POI.
//     - Mengimplementasikan `_showPoiDetailPanel` dan `_hidePoiDetailPanel`.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-27, 18:00 WITA ==
// == PERIHAL: Perbaikan Referensi dbInstance yang Tidak Terdefinisi ==
// - Mengganti semua penggunaan `dbInstance` yang tidak terdefinisi dengan `dbInstanceRef`
//   atau `getCurrentUser()` untuk memastikan akses data yang benar.
// - Memperbaiki logika `WandererFeatures.setDependencies` dan `WandererPageRenderer.setDependencies`.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-27, 18:36 WITA ==
// == PERIHAL: Refaktor Modul Mini-game ==
// - Memindahkan logika mini-game Commission, Empathize, Inspire, dan Challenge
//   ke file mereka masing-masing di `js/miniGames/`.
// - Memperbarui impor dan panggilan `setDependencies` di `WandererPageRenderer`
//   untuk menggunakan modul-modul yang baru diekstrak.
// - Menyesuaikan jalur impor `npcInteraction.js` dan `questManager.js` ke `../../features/wanderer/`
//   sesuai dengan struktur yang direkomendasikan sebelumnya.
// ===========================================

import { UIManager } from '../../uiManager.js';
import { getCurrentUser, setCurrentUser, AuthService as AuthServiceRef } from '../../authService.js';
import { updateDocument, setDocument } from '../../firebaseService.js';
import { WorldManager } from '../../worldManager.js';
import { SKILL_TREE_DATA, GLOBAL_ATTRIBUTES, BIRTH_QUESTIONS, INTERROGATION_DATA, TRADABLE_ITEMS_DATA, COSMIC_CYCLES, NPC_HEALTH_STATES, NPC_LIFESTAGES, NPC_ROLES, NPC_PERSONALITY_TRAITS, WORLD_LANDMARKS, REGIONS_DATA, JOURNAL_ENTRY_TEMPLATES } from '../../data/core.js';
import { LEGACY_CRITERIA } from '../../data/metaGame.js';

// --- Imported Mini-Game Modules ---
import { InterrogateGame } from '../../miniGames/interrogateGame.js';
import { AbsorbEchoGame } from '../../miniGames/absorbEchoGame.js';
import { ChallengeGame } from '../../miniGames/challengeGame.js'; // Extracted
import { InspireGame } from '../../miniGames/inspireGame.js';     // Extracted
import { BarterGame } from '../../miniGames/barterGame.js';
import { CommissionGame } from '../../miniGames/commissionGame.js'; // Extracted
import { EmpathizeGame } from '../../miniGames/empathizeGame.js'; // Extracted

// --- Imported Feature-Specific Modules ---
import { initializeNpcInteraction, triggerNpcDialogue } from '../../features/wanderer/npcInteraction.js'; // Adjusted path
import { initializeQuestManager, checkQuestCompletion } from '../../features/wanderer/questManager.js'; // Adjusted path
import { addToWandererChronicle } from '../../chronicleManager.js';

// HAPUS BARIS INI:
// let dbInstance; // This line was correctly commented out or removed.
let saveDBInstance;
let destinyClockIntervalInstance;

// === Variabel Lokal Modul ===
let dbInstanceRef; // Ganti dengan nama yang jelas agar tidak bingung
let saveDBInstanceRef;
let UIManagerRef;
let WorldManagerRef;
let gameTimeRef;
let currentZoomLevel = 1.0; // For world map
let wandererAttributeChartInstance;

// === Elemen DOM yang akan diakses ===
const mainContentArea = document.getElementById('wanderer-page-container');
const navLinksContainer = document.getElementById('wanderer-nav');

// Inventory UI elements
let inventoryGrid;
let itemDetailPanel;
let detailItemName;
let detailItemType;
let detailItemRarity;
let detailItemDescription;
let detailItemValue;
let detailItemDurability;
let detailItemEffects;
let itemActionButtons;
let sortInventoryBy;
let filterInventoryType;

// Journal UI elements
let journalEntriesContainer;
let sortJournalBy;
let filterJournalType;
let newReflectionText;
let addReflectionBtn;

// World Map UI elements (need to be re-fetched if the HTML content changes for the page)
let worldMapSvgContainer; // Main SVG container for the map
let regionDetailPanel; // Panel for region details
let poiDetailPanel; // Panel for POI details
let poiDetailName;
let poiDetailStatus;
let poiDetailType;
let poiDetailJournalEntry;


// Fungsi pembantu untuk mendapatkan detail item lengkap dari TRADABLE_ITEMS_DATA
const getItemDefinition = (itemId) => TRADABLE_ITEMS_DATA[itemId];

export const WandererFeatures = {
    /**
     * Mengatur dependensi untuk modul WandererFeatures.
     * @param {object} db - Instans database (dbInstance dari App).
     * @param {function} saveDB - Fungsi untuk menyimpan database.
     * @param {number} destinyClockInterval - Instans interval untuk jam takdir.
     */
    setDependencies(db, saveDB, destinyClockInterval) {
        dbInstanceRef = db;
        saveDBInstance = saveDB;
        destinyClockIntervalInstance = destinyClockInterval;
        // The mini-game dependencies are set in WandererPageRenderer.setDependencies
        // as they need more dependencies from the main renderer/UI.
    },

    // --- Inisialisasi Halaman Wanderer ---
    initWandererPage() {
        if (!getCurrentUser() || getCurrentUser().role !== 'wanderer') {
            AuthServiceRef.logout();
            return;
        }
        document.getElementById('wanderer-app').style.display = 'flex';
        document.getElementById('logout-button').onclick = () => AuthServiceRef.logout();
        document.getElementById('wanderer-profile-icon').textContent = getCurrentUser().name.charAt(0);

        WandererPageRenderer.definePageTemplates();
        WandererPageRenderer.renderWandererNav();
        WandererPageRenderer.setupWandererNavEvents();
        WandererPageRenderer.renderCurrentPage('character');
        WandererFeatures.startDestinyClock();

        // This assumes WandererGameLogic exists and is correctly structured
        // It would be better to pass these dependencies explicitly or ensure they are imported.
        // For now, assuming they are globally available or imported in App.js which initializes this.
        setInterval(() => WandererFeatures.triggerEncounter(), 30000);
    },

    getArchetypePathAction(archetypeId) {
        const pathActions = {
            'inquisitor': { id: 'interrogate_action', name: 'Menginterogasi', icon: 'search' },
            'echo-scribe': { id: 'absorb_echo_action', name: 'Menyerap Gema', icon: 'eye' },
            'sentinel': { id: 'challenge_action', name: 'Menantang', icon: 'sword' },
            'empath': { id: 'empathize_action', name: 'Merasakan', icon: 'heart' },
            'will-shaper': { id: 'inspire_action', name: 'Menginspirasi', icon: 'zap' },
            'nomad': { id: 'barter_action', name: 'Bertukar', icon: 'shuffle' },
            'chronicler': { id: 'scrutinize_action', name: 'Menyelidiki', icon: 'book' },
            'artisan': { id: 'commission_action', name: 'Memesan', icon: 'hammer' }
        };
        return pathActions[archetypeId];
    },

    setupWandererNavEvents() {
        const navLinks = document.querySelectorAll('.wanderer-nav-link');
        navLinks.forEach(link => {
            link.removeEventListener('click', WandererPageRenderer._navClickHandler); // Remove previous listener

            WandererPageRenderer._navClickHandler = async (e) => {
                e.preventDefault();
                const pageId = link.dataset.page;
                const currentUser = getCurrentUser();

                if (currentUser && currentUser.archetype) {
                    let targetNpc = null;
                    const npcsInCurrentRegion = Object.values(dbInstanceRef.npc_souls || {}).filter(npc => npc.currentRegion === currentUser.currentRegion);
                    if (npcsInCurrentRegion.length > 0) {
                        targetNpc = npcsInCurrentRegion[Math.floor(Math.random() * npcsInCurrentRegion.length)];
                    }

                    switch (pageId) {
                        case 'interrogate_action':
                            if (targetNpc) {
                                await InterrogateGame.triggerInterrogateMiniGame(targetNpc);
                            } else {
                                UIManagerRef.showNotification("Tidak ada NPC untuk diinterogasi di wilayah ini.", 'info', 'bg-blue-500');
                            }
                            return;
                        case 'absorb_echo_action':
                            await AbsorbEchoGame.triggerAbsorbEchoMiniGame('some_dummy_source');
                            return;
                        case 'challenge_action':
                            if (targetNpc) {
                                await ChallengeGame.triggerChallengeMiniGame(targetNpc);
                            } else {
                                UIManagerRef.showNotification("Tidak ada lawan untuk ditantang di wilayah ini.", 'info', 'bg-blue-500');
                            }
                            return;
                        case 'empathize_action':
                            if (targetNpc) {
                                await EmpathizeGame.triggerEmpathizeMiniGame(targetNpc);
                            } else {
                                UIManagerRef.showNotification("Tidak ada jiwa untuk dirasakan di wilayah ini.", 'info', 'bg-blue-500');
                            }
                            return;
                        case 'inspire_action':
                            if (targetNpc) {
                                await InspireGame.triggerInspireMiniGame(targetNpc);
                            } else {
                                UIManagerRef.showNotification("Tidak ada jiwa untuk diinspirasi di wilayah ini.", 'info', 'bg-blue-500');
                            }
                            return;
                        case 'barter_action':
                            if (targetNpc) {
                                await BarterGame.triggerBarterMiniGame(targetNpc);
                            } else {
                                UIManagerRef.showNotification("Tidak ada jiwa untuk diajak bertukar di wilayah ini.", 'info', 'bg-blue-500');
                            }
                            return;
                        case 'commission_action':
                            if (targetNpc) {
                                await CommissionGame.triggerCommissionMiniGame(targetNpc);
                            } else {
                                UIManagerRef.showNotification("Tidak ada NPC pengrajin yang tersedia di wilayah ini.", 'info', 'bg-blue-500');
                            }
                            return;
                    }
                }

                WandererPageRenderer.renderCurrentPage(pageId);
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                WandererPageRenderer.renderWandererNav(pageId);
            };
            link.addEventListener('click', WandererPageRenderer._navClickHandler);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const initialPage = urlParams.get('page') || 'character';
        WandererPageRenderer.renderCurrentPage(initialPage);
        WandererPageRenderer.renderWandererNav(initialPage);
    },

    renderCurrentPage(pageId) {
        const allPageContainers = document.querySelectorAll('#wanderer-page-container > div');
        allPageContainers.forEach(container => {
            if (container.id.endsWith('-page') || container.id === 'quest-log-page') {
                container.style.display = 'none';
            }
        });

        const targetPageContainer = document.getElementById(`${pageId}-page`) || document.getElementById('quest-log-page');
        if (targetPageContainer) {
            targetPageContainer.style.display = 'block';

            if (pageId === 'quest_log') {
                // Handled by setupQuestLogTabs
            } else {
                targetPageContainer.innerHTML = WandererPageRenderer.pageTemplates[pageId];
            }

            WandererPageRenderer._getDOMElementsForPage(pageId);
            WandererPageRenderer.renderAllWandererComponents(pageId);
            WandererPageRenderer._applyCosmicTheme();

            if (pageId === 'inventory') {
                if (sortInventoryBy && filterInventoryType) {
                    sortInventoryBy.removeEventListener('change', WandererPageRenderer.renderInventoryPage);
                    filterInventoryType.removeEventListener('change', WandererPageRenderer.renderInventoryPage);
                    sortInventoryBy.addEventListener('change', WandererPageRenderer.renderInventoryPage);
                    filterInventoryType.addEventListener('change', WandererPageRenderer.renderInventoryPage);
                }
                document.getElementById('close-detail-panel')?.addEventListener('click', () => WandererPageRenderer._hideItemDetailPanel());
                document.addEventListener('click', (e) => {
                    if (itemDetailPanel && itemDetailPanel.style.display === 'block' &&
                        !itemDetailPanel.contains(e.target) && !e.target.closest('.item-grid-item')) {
                        WandererPageRenderer._hideItemDetailPanel();
                    }
                });
            } else if (pageId === 'journal') {
                if (sortJournalBy && filterJournalType) {
                    sortJournalBy.removeEventListener('change', WandererPageRenderer.renderJournalPage);
                    filterJournalType.removeEventListener('change', WandererPageRenderer.renderJournalPage);
                    sortJournalBy.addEventListener('change', WandererPageRenderer.renderJournalPage);
                    filterJournalType.addEventListener('change', WandererPageRenderer.renderJournalPage);
                }
                if (addReflectionBtn) {
                    addReflectionBtn.removeEventListener('click', WandererPageRenderer._addPersonalReflection);
                    addReflectionBtn.addEventListener('click', () => WandererPageRenderer._addPersonalReflection());
                }
            } else if (pageId === 'world_map') {
                document.getElementById('map-zoom-in')?.addEventListener('click', () => WandererPageRenderer._handleMapZoom(0.1));
                document.getElementById('map-zoom-out')?.addEventListener('click', () => WandererPageRenderer._handleMapZoom(-0.1));

                const detailPanel = document.getElementById('region-detail-panel');
                if (detailPanel) {
                    document.addEventListener('click', (e) => {
                        if (detailPanel.classList.contains('visible') &&
                            !detailPanel.contains(e.target) && !e.target.closest('.region-marker')) {
                            WandererPageRenderer._hideRegionDetailPanel();
                        }
                    });
                }
                const poiDetailPanelEl = document.getElementById('poi-detail-panel');
                if (poiDetailPanelEl) {
                    document.getElementById('close-poi-detail-panel')?.addEventListener('click', () => WandererPageRenderer._hidePoiDetailPanel());
                }
            } else if (pageId === 'skill_tree') {
                document.querySelectorAll('.unlock-imprint-btn').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        const imprintId = e.target.dataset.imprintId;
                        const imprint = Object.values(SKILL_TREE_DATA).flatMap(Object.values).find(i => i.id === imprintId);

                        if (imprint && !getCurrentUser().unlockedImprints.includes(imprintId)) {
                            const user = getCurrentUser();
                            user.unlockedImprints.push(imprintId);
                            setCurrentUser(user);
                            await saveDBInstanceRef(true);
                            UIManagerRef.showNotification(`Soul Imprint Unlocked: ${imprint.name}!`, 'zap', 'bg-gradient-to-r from-purple-400 to-pink-400');
                            WandererPageRenderer.renderSkillTree();
                        }
                    });
                });
            } else if (pageId === 'sanctuary') {
                WandererPageRenderer.setupSanctuaryPetitions();
            }
        } else {
            console.error(`Page container for ID '${pageId}' not found.`);
        }

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    },

    _getDOMElementsForPage(pageId) {
        Object.assign(this, {
            mainContentArea: document.getElementById('wanderer-page-container'),
            navLinksContainer: document.getElementById('wanderer-nav')
        });

        if (pageId === 'inventory') {
            inventoryGrid = document.getElementById('inventory-grid');
            itemDetailPanel = document.getElementById('item-detail-panel');
            detailItemName = document.getElementById('detail-item-name');
            detailItemType = document.getElementById('detail-item-type');
            detailItemRarity = document.getElementById('detail-item-rarity');
            detailItemDescription = document.getElementById('detail-item-description');
            detailItemValue = document.getElementById('detail-item-value');
            detailItemDurability = document.getElementById('detail-item-durability');
            detailItemEffects = document.getElementById('detail-item-effects');
            itemActionButtons = document.getElementById('item-action-buttons');
            sortInventoryBy = document.getElementById('sort-inventory-by');
            filterInventoryType = document.getElementById('filter-inventory-type');
        } else if (pageId === 'journal') {
            journalEntriesContainer = document.getElementById('journal-entries-container');
            sortJournalBy = document.getElementById('sort-journal-by');
            filterJournalType = document.getElementById('filter-journal-type');
            newReflectionText = document.getElementById('new-reflection-text');
            addReflectionBtn = document.getElementById('add-reflection-btn');
        } else if (pageId === 'world_map') {
            worldMapSvgContainer = document.getElementById('world-map-svg');
            regionDetailPanel = document.getElementById('region-detail-panel');
            poiDetailPanel = document.getElementById('poi-detail-panel');
            if (poiDetailPanel) {
                poiDetailName = document.getElementById('poi-detail-name');
                poiDetailStatus = document.getElementById('poi-detail-status');
                poiDetailType = document.getElementById('poi-detail-type');
                poiDetailJournalEntry = document.getElementById('poi-detail-journal-entry');
                document.getElementById('poi-detail-description');
            }
        }
    },

    renderAllWandererComponents(pageId) {
        const currentUser = getCurrentUser();

        if (pageId === 'character') {
            WandererPageRenderer.renderPlayerStatus();
            WandererPageRenderer.renderNpcList(currentUser.currentRegion);
            checkQuestCompletion();
        } else if (pageId === 'quest_log') {
            WandererPageRenderer.setupQuestLogTabs();
            checkQuestCompletion();
        } else if (pageId === 'journal') {
            WandererPageRenderer.renderJournalPage();
        } else if (pageId === 'sanctuary') {
            WorldManagerRef.updateResonanceDisplay();
        } else if (pageId === 'world_map') {
            WandererPageRenderer.renderWorldMap();
            WandererPageRenderer.renderNpcList(currentUser.currentRegion);
        } else if (pageId === 'skill_tree') {
            WandererPageRenderer.renderSkillTree();
        } else if (pageId === 'inventory') {
            WandererPageRenderer.renderInventoryPage();
        }
    },

    _applyCosmicTheme: () => {
        const body = document.body;
        const currentCycleEffects = WorldManagerRef.getCurrentCosmicCycleEffects();
        const theme = currentCycleEffects.worldVisualTheme || 'normal';

        body.classList.remove('theme-dark', 'theme-bright', 'theme-unstable', 'theme-normal');

        if (theme === 'dark') body.classList.add('theme-dark');
        else if (theme === 'bright') body.classList.add('theme-bright');
        else if (theme === 'unstable') body.classList.add('theme-unstable');
        else body.classList.add('theme-normal');

        const cosmicCycleNameDisplay = document.getElementById('cosmic-cycle-name');
        const cosmicCycleIconDisplay = document.getElementById('cosmic-cycle-icon');
        if (cosmicCycleNameDisplay && cosmicCycleIconDisplay && dbInstanceRef.world.cosmicCycle) {
            const currentCycleDef = COSMIC_CYCLES[dbInstanceRef.world.cosmicCycle.currentCycleId];
            cosmicCycleNameDisplay.textContent = currentCycleDef.name;
            cosmicCycleIconDisplay.setAttribute('data-feather', currentCycleDef.eventIcon || (theme === 'bright' ? 'sun' : (theme === 'dark' ? 'moon' : 'star')));
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            } else if (typeof feather !== 'undefined' && feather.replace) {
                feather.replace();
            }
        }
    },

    renderPlayerStatus() {
        document.getElementById('wanderer-title').textContent = `Peringkat Jiwa ${getCurrentUser().soulRank}: ${getCurrentUser().title}`;
        const statusContainer = document.getElementById('player-status-container');
        statusContainer.innerHTML = `<span class="${getCurrentUser().status.color}">${getCurrentUser().status.text}</span>`;
        const wandererLegacyDisplay = document.getElementById('wanderer-legacy-display');
        if (wandererLegacyDisplay) {
            wandererLegacyDisplay.textContent = getCurrentUser().legacyPoints || 0;
        }
    },

    renderNpcList: (regionId) => {
        const npcListContainer = document.getElementById('npc-list-container');
        if (!npcListContainer) return;

        npcListContainer.innerHTML = '<h3 class="text-xl font-serif font-bold text-white mb-4">NPC di Wilayah Ini:</h3>';
        const npcsInRegion = Object.values(dbInstanceRef.npc_souls || {}).filter(npc => npc.currentRegion === regionId);

        if (npcsInRegion.length === 0) {
            npcListContainer.innerHTML += '<p class="text-slate-500 italic">Tidak ada NPC di sini saat ini.</p>';
            return;
        }

        const ul = document.createElement('ul');
        npcsInRegion.forEach(npc => {
            const li = document.createElement('li');
            const attitudeLevel = WorldManagerRef.getNpcAttitudeLevel(npc, getCurrentUser());
            const healthStateDef = NPC_HEALTH_STATES[npc.healthState.toUpperCase()] || NPC_HEALTH_STATES.NORMAL;
            const lifeStageDef = NPC_LIFESTAGES.find(ls => ls.stage === npc.lifeStage) || NPC_LIFESTAGES[2];

            const npcRole = NPC_ROLES[npc.role.toUpperCase()]?.description || 'Warga';
            const npcTraits = npc.personalityTraits && npc.personalityTraits.length > 0 ?
                `(${npc.personalityTraits.map(trait => NPC_PERSONALITY_TRAITS.find(t => t.id === trait)?.name || trait).join(', ')})` : '';

            li.innerHTML = `
                <div class="glass-card p-3 rounded-lg flex justify-between items-center mb-2 cursor-pointer hover:bg-slate-700">
                    <div>
                        <h4 class="text-lg font-bold text-white">${npc.name}</h4>
                        <p class="text-sm text-slate-400">Umur: ${Math.floor(npc.age)} (${lifeStageDef.stage}) | Kesehatan: ${healthStateDef.description}</p>
                        <p class="text-sm text-slate-400">${npcRole} ${npcTraits}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-indigo-400 font-semibold capitalize">${attitudeLevel.replace(/_/g, ' ')}</p>
                        <p class="text-xs text-slate-500">Rep: ${getCurrentUser().reputation[npc.id] || 0}</p>
                    </div>
                </div>
            `;
            li.addEventListener('click', () => {
                console.log(`Mengklik NPC: ${npc.name} (${npc.id})`);
                triggerNpcDialogue(npc);
            });

            ul.appendChild(li);
        });
        npcListContainer.appendChild(ul);
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        } else if (typeof feather !== 'undefined' && feather.replace) {
            feather.replace();
        }
    },

    addToWandererChronicle: (entry) => {
        const currentUser = getCurrentUser();
        if (!currentUser.chronicle) {
            currentUser.chronicle = [];
        }
        currentUser.chronicle.push(entry);
        WandererPageRenderer.renderChronicle();
        saveDBInstanceRef(true);
    },

    renderChronicle() {
        const container = document.getElementById('chronicle-container');
        if (!container) return;

        const currentUserChronicle = getCurrentUser().chronicle;
        if (!currentUserChronicle || currentUserChronicle.length === 0) {
            container.innerHTML = `<p class="text-center text-slate-500 italic">Kisah Anda belum terukir.</p>`;
            return;
        }

        const sortedChronicle = [...currentUserChronicle].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const html = sortedChronicle.map(entry => {
            const date = new Date(entry.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
            const time = new Date(entry.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const highlightClass = entry.type === 'legacy_milestone' || entry.type === 'legacy_achievement' || entry.type === 'global_world_event' ?
                'border-purple-500 bg-purple-900/20' : 'border-border-color';
            const titleClass = entry.type === 'legacy_milestone' || entry.type === 'legacy_achievement' || entry.type === 'global_world_event' ?
                'text-indigo-300' : 'text-white';
            const iconToUse = entry.icon || 'book';

            return `
                <div class="chronicle-entry relative pl-10 pb-12 glass-card animate-fade-in-up ${highlightClass}">
                    <div class="absolute -left-2 top-0 w-4 h-4 bg-indigo-600 rounded-full border-2 border-border-color"></div>
                    <div class="absolute -left-2 top-0 transform -translate-x-1/2 -translate-y-1/2">
                        <i data-feather="${iconToUse}" class="w-6 h-6 text-indigo-300"></i>
                    </div>
                    <h4 class="text-xl font-serif font-bold ${titleClass}">${entry.title}</h4>
                    <p class="text-slate-400 text-sm mt-1">${date} ${time}</p>
                    <p class="text-slate-300 mt-2">${entry.description}</p>
                    ${entry.spoil ? `<p class="text-slate-500 italic mt-1">Spoiler: ${entry.spoil}</p>` : ''}
                </div>
            `;
        }).join('');
        container.innerHTML = html;
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        } else if (typeof feather !== 'undefined' && feather.replace) {
            feather.replace();
        }
    },

    renderActiveQuestsLog() {
        const container = document.getElementById('active-quests-log-container');
        if (!container) return;

        const activeQuests = getCurrentUser().activeQuests || [];

        if (activeQuests.length === 0) {
            container.innerHTML = `<p class="text-slate-500 italic">Tidak ada alur takdir yang aktif saat ini.</p>`;
            return;
        }

        const html = activeQuests.map(quest => {
            const npcGiver = WorldManagerRef.getNpcName(quest.npcId) || 'Unknown NPC';
            const rewardItemName = TRADABLE_ITEMS_DATA[quest.reward.item.id]?.name || quest.reward.item.id;
            const rewardText = `XP: ${quest.reward.xp}, Item: ${quest.reward.item.quantity}x ${rewardItemName}`;
            return `
                <div class="glass-card p-4 rounded-lg flex flex-col mb-2">
                    <h4 class="text-lg font-bold text-white">${quest.name}</h4>
                    <p class="text-slate-400 text-sm italic">Dari: ${npcGiver}</p>
                    <p class="text-slate-300 mt-2">${quest.objective}</p>
                    <p class="text-slate-500 text-xs mt-1">Hadiah: ${rewardText}</p>
                </div>
            `;
        }).join('');
        container.innerHTML = html;

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        } else if (typeof feather !== 'undefined' && feather.replace) {
            feather.replace();
        }
    },

    renderNotificationLog() {
        const container = document.getElementById('notification-log-container');
        if (!container) return;

        const notificationLog = dbInstanceRef.world.notificationLog || [];
        const sortedLog = [...notificationLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


        if (sortedLog.length === 0) {
            container.innerHTML = `<p class="text-center text-slate-500 italic">Tidak ada log peristiwa yang tercatat.</p>`;
            return;
        }

        const html = sortedLog.map(entry => {
            const date = new Date(entry.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
            const time = new Date(entry.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const iconToUse = entry.icon || 'info';
            const typeDisplay = entry.type ? entry.type.replace(/_/g, ' ') : 'Umum';
            return `
                <div class="glass-card p-4 rounded-lg flex items-start space-x-4 mb-3 ${entry.colorClass || 'bg-gray-700'}">
                    <i data-feather="${iconToUse}" class="w-6 h-6 text-white shrink-0 mt-1"></i>
                    <div>
                        <h4 class="font-bold text-white">${entry.title}</h4>
                        <p class="text-slate-100 text-sm">${entry.description}</p>
                        <p class="text-slate-300 text-xs mt-1">${date} ${time} (<span class="capitalize">${typeDisplay}</span>)</p>
                    </div>
                </div>
            `;
        }).join('');
        container.innerHTML = html;

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        } else if (typeof feather !== 'undefined' && feather.replace) {
            feather.replace();
        }
    },

    setupQuestLogTabs() {
        const tabsContainer = document.getElementById('quest-log-tabs');
        if (!tabsContainer) return;

        const allContentAreas = document.querySelectorAll('.quest-content');
        const tabs = tabsContainer.querySelectorAll('.quest-tab');

        tabs.forEach(tab => {
            tab.onclick = null;
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active', 'border-indigo-500', 'text-white'));
                tabs.forEach(t => t.classList.add('text-slate-400', 'hover:text-slate-200', 'border-transparent'));
                allContentAreas.forEach(content => {
                    content.style.display = 'none';
                });

                e.currentTarget.classList.add('active', 'border-indigo-500', 'text-white');
                e.currentTarget.classList.remove('text-slate-400', 'hover:text-slate-200', 'border-transparent');

                const targetId = e.currentTarget.dataset.target;
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.style.display = 'block';

                    if (targetId === 'active_quests_content') {
                        WandererPageRenderer.renderActiveQuestsLog();
                    } else if (targetId === 'the_chronicle_content') {
                        WandererPageRenderer.renderChronicle();
                    } else if (targetId === 'notification_log_content') {
                        WandererPageRenderer.renderNotificationLog();
                    }
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    } else if (typeof feather !== 'undefined' && feather.replace) {
                        feather.replace();
                    }
                }
            });
        });

        const initialActiveTab = tabsContainer.querySelector('.quest-tab.active') || tabs[0];
        if (initialActiveTab) {
            initialActiveTab.click();
        }
    },

    renderInventoryPage: () => {
        if (!inventoryGrid) {
            console.error("Inventory grid element not found for rendering.");
            return;
        }

        const wanderer = getCurrentUser();
        let inventoryItems = (wanderer.inventory || []).map(item => ({ ...item, ...getItemDefinition(item.id) }));

        const filterType = filterInventoryType?.value || 'all';
        if (filterType !== 'all') {
            inventoryItems = inventoryItems.filter(item => item.type === filterType);
        }

        const sortBy = sortInventoryBy?.value || 'name';
        inventoryItems.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'type') return a.type.localeCompare(b.type);
            if (sortBy === 'value') return (b.value || 0) - (a.value || 0);
            if (sortBy === 'quantity') return b.quantity - a.quantity;
            if (sortBy === 'rarity') {
                const rarityOrder = { 'common': 0, 'uncommon': 1, 'rare': 2, 'epic': 3, 'legendary': 4 };
                return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
            }
            return 0;
        });

        inventoryGrid.innerHTML = '';

        if (inventoryItems.length === 0) {
            inventoryGrid.innerHTML = '<p class="text-slate-400 col-span-full text-center">Inventarismu kosong.</p>';
            return;
        }

        inventoryItems.forEach(item => {
            const itemElement = document.createElement('div');
            let borderColorClass = 'border-slate-700';
            if (item.rarity === 'uncommon') borderColorClass = 'border-green-500';
            else if (item.rarity === 'rare') borderColorClass = 'border-blue-500';
            else if (item.rarity === 'epic') borderColorClass = 'border-purple-500';
            else if (item.rarity === 'legendary') borderColorClass = 'border-yellow-500';

            itemElement.className = `glass-card p-4 rounded-lg border ${borderColorClass} shadow-md text-center cursor-pointer hover:bg-slate-700 transition-colors relative item-grid-item`;

            itemElement.innerHTML = `
                <div class="mb-2 text-white">
                    <i data-feather="${item.icon}" class="w-8 h-8 mx-auto"></i>
                </div>
                <h5 class="text-md font-semibold text-white truncate">${item.name}</h5>
                <p class="text-slate-400 text-sm">x${item.quantity}</p>
                <p class="text-slate-500 text-xs capitalize">${item.rarity}</p>
            `;
            itemElement.addEventListener('click', () => WandererPageRenderer._showItemDetailPanel(item));
            inventoryGrid.appendChild(itemElement);
        });
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    },

    _showItemDetailPanel: (item) => {
        if (!itemDetailPanel) return;

        detailItemName.textContent = item.name;
        detailItemType.textContent = item.type.replace('_', ' ');
        detailItemRarity.textContent = item.rarity;
        detailItemDescription.textContent = item.description;
        detailItemValue.textContent = `Nilai: ${item.value} Koin`;

        const durabilityElement = document.getElementById('detail-item-durability');
        if (item.durability !== null && item.durability !== undefined) {
            durabilityElement.textContent = `Durabilitas: ${item.durability}/100`;
            durabilityElement.style.display = 'block';
        } else {
            durabilityElement.style.display = 'none';
        }

        const effectsEl = document.getElementById('detail-item-effects');
        if (item.activeEffects && item.activeEffects.length > 0) {
            effectsEl.innerHTML = `Efek: ${item.activeEffects.map(effect => {
                let effectText = effect.id.replace(/_/g, ' ');
                if (effect.value) effectText += ` (${effect.value})`;
                if (effect.target) effectText += ` ke ${effect.target}`;
                return effectText;
            }).join(', ')}`;
            effectsEl.style.display = 'block';
        } else {
            effectsEl.style.display = 'none';
        }

        itemActionButtons.innerHTML = '';

        if (item.type === 'consumable') {
            WandererPageRenderer._createActionButton(itemActionButtons, 'Gunakan', () => WandererPageRenderer._useItem(item));
        }
        if (item.type === 'equipment') {
            WandererPageRenderer._createActionButton(itemActionButtons, 'Pasang', () => WandererPageRenderer._equipItem(item));
        }
        if (item.type !== 'quest_item' && item.type !== 'currency') {
            WandererPageRenderer._createActionButton(itemActionButtons, 'Buang', () => WandererPageRenderer._discardItem(item));
        }

        itemDetailPanel.style.display = 'block';
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    },

    _hideItemDetailPanel: () => {
        if (itemDetailPanel) {
            itemDetailPanel.style.display = 'none';
        }
    },

    _createActionButton: (container, text, onClickHandler) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors shadow-md';
        button.addEventListener('click', onClickHandler);
        container.appendChild(button);
    },

    _useItem: async (item) => {
        UIManagerRef.showNotification(`Menggunakan ${item.name}. (Fungsionalitas belum penuh)`, "info");
    },

    _equipItem: (item) => {
        UIManagerRef.showNotification(`Memasang ${item.name}. (Fungsionalitas belum penuh)`, "info");
    },

    _discardItem: async (item) => {
        UIManagerRef.showNotification(`Membuang ${item.name}. (Fungsionalitas belum penuh)`, "info");
    },

    renderJournalPage: () => {
        if (!journalEntriesContainer) {
            console.error("Journal entries container element not found for rendering.");
            return;
        }

        const wanderer = getCurrentUser();
        let journalEntries = [...(wanderer.journal || [])];

        const filterType = filterJournalType?.value || 'all';
        if (filterType !== 'all') {
            journalEntries = journalEntries.filter(entry => entry.type === filterType);
        }

        const sortBy = sortJournalBy?.value || 'date_desc';
        journalEntries.sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            if (sortBy === 'date_desc') return dateB - dateA;
            if (sortBy === 'date_asc') return dateA - dateB;
            if (sortBy === 'type') return a.type.localeCompare(b.type);
            return 0;
        });

        journalEntriesContainer.innerHTML = '';

        if (journalEntries.length === 0) {
            journalEntriesContainer.innerHTML = '<p class="text-slate-400 text-center">Jurnalmu masih kosong. Mulailah petualangan untuk mengisinya!</p>';
            return;
        }

        journalEntries.forEach(entry => {
            const date = new Date(entry.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
            const time = new Date(entry.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const icon = entry.icon || (entry.type === 'reflection' ? 'feather' : 'book-open');
            const typeDisplay = entry.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            const entryElement = document.createElement('div');
            entryElement.className = `glass-card p-4 rounded-lg border border-border-color shadow-md relative group`;
            entryElement.innerHTML = `
                <div class="flex items-start mb-2">
                    <i data-feather="${icon}" class="w-6 h-6 mr-3 text-indigo-400 flex-shrink-0"></i>
                    <div>
                        <h4 class="text-xl font-semibold text-white">${entry.title}</h4>
                        <p class="text-slate-400 text-sm mt-1">${date} ${time} | Tipe: ${typeDisplay}</p>
                    </div>
                </div>
                <p class="text-slate-300 text-sm italic mt-2">${entry.description}</p>
            `;
            journalEntriesContainer.appendChild(entryElement);
        });

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    },

    _addPersonalReflection: async () => {
        if (!newReflectionText || !newReflectionText.value.trim()) {
            UIManagerRef.showNotification("Refleksi tidak boleh kosong!", 'alert-triangle', 'bg-red-500');
            return;
        }

        const user = getCurrentUser();
        const reflectionEntry = {
            id: `reflection_${Date.now()}`,
            title: "Refleksi Pribadi",
            description: newReflectionText.value.trim(),
            timestamp: new Date().toISOString(),
            type: "reflection",
            icon: "feather"
        };

        if (!user.journal) {
            user.journal = [];
        }
        user.journal.push(reflectionEntry);
        setCurrentUser(user);
        await saveDBInstanceRef(true);

        UIManagerRef.showNotification("Refleksi berhasil ditambahkan ke jurnal!", 'check-circle', 'bg-green-500');
        newReflectionText.value = '';
        WandererPageRenderer.renderJournalPage();
    },

    getWandererCharacterHtml() {
        return `
            <div id="character-page-content" class="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div class="lg:col-span-2 space-y-8">
                    <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                        <div class="text-center">
                            <h3 class="text-4xl font-serif font-bold text-white tracking-wider">${getCurrentUser().name}</h3>
                            <p id="wanderer-title" class="text-lg font-semibold text-indigo-400 mt-2"></p>
                             <div id="player-status-container" class="mt-2 text-sm font-semibold h-5"></div>
                        </div>
                        <div class="mt-6 pt-6 border-t border-border-color">
                             <h4 class="text-sm font-bold text-center text-slate-400 uppercase tracking-widest mb-4">The Scales of Conscience</h4>
                             <div id="wanderer-scales-container"></div>
                        </div>
                        <div class="mt-6 pt-6 border-t border-border-color">
                            <h4 class="text-sm font-bold text-center text-slate-400 uppercase tracking-widest mb-4">Warisan Terukir</h4>
                            <p class="text-amber-300 text-3xl font-bold text-center" id="wanderer-legacy-display">${getCurrentUser().legacyPoints || 0}</p>
                            <p class="text-slate-400 text-sm mt-2 text-center">Poin Warisan yang dikumpulkan dari Saga Anda.</p>
                        </div>
                    </div>
                     <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color">
                        <h3 class="text-xl font-serif font-bold text-white mb-2 tracking-wider">The Celestial Altar</h3>
                        <p class="text-slate-400">Perform the daily Rite of Reckoning.</p>
                        <div class="relative h-24 mt-8">
                             <div class="absolute inset-0 border-b-2 border-dashed border-border-color rounded-full"></div>
                             <div id="wanderer-altar-container" class="absolute inset-0 flex justify-between items-center px-2"></div>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-3 space-y-8">
                    <div class="glass-card p-6 rounded-2xl shadow-lg border border-border-color">
                        <h3 class="text-xl font-serif font-bold text-white mb-4 tracking-wider">Pentagon of Fate</h3>
                        <div class="w-full max-w-md mx-auto h-64 md:h-80"><canvas id="wanderer-attribute-chart"></canvas></div>
                    </div>
                     <div class="glass-card p-6 rounded-2xl shadow-lg border border-border-color">
                        <h3 class="text-xl font-serif font-bold text-white mb-4 tracking-wider">Soul's Muscle Memory</h3>
                        <div id="attributes-xp-list" class="space-y-4"></div>
                    </div>
                    <div class="glass-card p-6 rounded-2xl shadow-lg border border-border-color">
                        <h3 class="text-xl font-serif font-bold text-white mb-4 tracking-wider">Divine Mandate</h3>
                    </div>
                </div>
            </div>`;
    },

    renderWorldMap() {
        const container = document.getElementById('world-map-page');
        if (!container) return;

        container.innerHTML = `
            <div id="world-map-svg-container" class="relative w-full h-[600px] bg-slate-900 rounded-lg overflow-hidden border border-border-color mb-8 flex-grow">
                <svg id="world-map-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet" class="w-full h-full">
                    <defs>
                        <pattern id="plains-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect x="0" y="0" width="10" height="10" fill="#4CAF50"/>
                            <circle cx="5" cy="5" r="2" fill="#8BC34A"/>
                        </pattern>
                        <pattern id="forest-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect x="0" y="0" width="10" height="10" fill="#2E7D32"/>
                            <circle cx="5" cy="5" r="3" fill="#4CAF50"/>
                        </pattern>
                        <pattern id="desert-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect x="0" y="0" width="10" height="10" fill="#FFEB3B"/>
                            <path d="M0 5 L5 0 L10 5 L5 10 Z" fill="#FFC107"/>
                        </pattern>
                        <pattern id="mountainous-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect x="0" y="0" width="10" height="10" fill="#607D8B"/>
                            <path d="M0 10 L5 0 L10 10 Z" fill="#90A4AE"/>
                        </pattern>
                        <pattern id="swamp-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect x="0" y="0" width="10" height="10" fill="#5D4037"/>
                            <circle cx="2" cy="8" r="1" fill="#4CAF50"/>
                            <circle cx="8" cy="2" r="1" fill="#795548"/>
                        </pattern>
                        <pattern id="oceanic-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect x="0" y="0" width="10" height="10" fill="#2196F3"/>
                            <path d="M0 5 Q5 0 10 5 Q5 10 0 5 Z" fill="#00BCD4"/>
                        </pattern>
                        <pattern id="floating_islands-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect x="0" y="0" width="10" height="10" fill="#BBDEFB"/>
                            <circle cx="5" cy="5" r="3" fill="#64B5F6"/>
                        </pattern>
                        <pattern id="volcanic-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect x="0" y="0" width="10" height="10" fill="#3E2723"/>
                            <circle cx="5" cy="5" r="2" fill="#FF5722"/>
                        </pattern>
                        <pattern id="tundra-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect x="0" y="0" width="10" height="10" fill="#B0BEC5"/>
                            <rect x="2" y="2" width="6" height="6" fill="#CFD8DC"/>
                        </pattern>
                        <pattern id="jungle-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect x="0" y="0" width="10" height="10" fill="#388E3C"/>
                            <path d="M0 10 L5 0 L10 10 Z" fill="#66BB6A"/>
                        </pattern>
                    </defs>
                    </svg>
                <div class="absolute top-4 left-4 flex space-x-2 z-10">
                    <button id="map-zoom-in" class="glass-button p-2 rounded-full"><i data-feather="plus" class="w-5 h-5 text-slate-300"></i></button>
                    <button id="map-zoom-out" class="glass-button p-2 rounded-full"><i data-feather="minus" class="w-5 h-5 text-slate-300"></i></button>
                </div>
            </div>

            <div id="region-detail-panel" class="glass-card p-6 rounded-lg shadow-xl border border-border-color fixed z-20" style="display: none; transition: all 0.3s ease-out;">
                <h4 id="detail-region-name" class="text-xl font-serif text-white mb-2"></h4>
                <p class="text-slate-400 text-sm mb-1">Iklim: <span id="detail-region-climate" class="font-bold capitalize"></span></p>
                <p class="text-slate-400 text-sm mb-1">Medan: <span id="detail-region-terrain" class="font-bold capitalize"></span></p>
                <p class="text-slate-400 text-sm mb-1">Ancaman: <span id="detail-region-threat" class="font-bold"></span></p>
                <p class="text-slate-400 text-sm mb-4">Faksi Dominan: <span id="detail-region-faction" class="font-bold"></span></p>
                <p class="text-slate-400 text-sm mb-4">Deskripsi: <span id="detail-region-description" class="text-slate-300 italic"></span></p>

                <h5 class="text-lg font-bold text-white mb-2">Status Nexus</h5>
                <p class="text-slate-400 text-sm mb-1">Status: <span id="detail-nexus-status" class="font-bold capitalize"></span></p>
                <p class="text-slate-300 text-sm">Intention: <span id="detail-intention-value" class="font-mono"></span></p>
                <p class="text-slate-300 text-sm mb-4">Echo: <span id="detail-echo-value" class="font-mono"></span></p>

                <h5 class="text-lg font-bold text-white mb-2">Wilayah Tetangga</h5>
                <div id="detail-neighboring-regions" class="text-slate-300 text-sm flex flex-wrap gap-2 mb-4"></div>

                <div class="flex justify-end space-x-2">
                    <button id="detail-fortify-btn" class="glass-button primary-button px-4 py-2 text-sm">Fortify (10 Essence)</button>
                    <button id="detail-cleansing-btn" class="glass-button secondary-button px-4 py-2 text-sm">Cleansing (10 Essence)</button>
                </div>
            </div>

            <div id="poi-detail-panel" class="glass-card p-6 rounded-lg shadow-xl border border-border-color fixed z-50" style="display: none; transition: all 0.3s ease-out;">
                <button id="close-poi-detail-panel" class="absolute top-3 right-3 text-slate-400 hover:text-white"><i data-feather="x" class="w-6 h-6"></i></button>
                <h4 id="poi-detail-name" class="text-xl font-serif text-white mb-2"></h4>
                <p class="text-slate-400 text-sm mb-1">Tipe: <span id="poi-detail-type" class="font-bold capitalize"></span></p>
                <p class="text-slate-400 text-sm mb-4">Status: <span id="poi-detail-status" class="font-bold capitalize"></span></p>
                <p id="poi-detail-journal-entry" class="text-slate-300 text-sm italic mb-4" style="display: none;"></p>
                <p id="poi-detail-description" class="text-slate-200 text-sm mb-2"></p>
            </div>

            <div id="npc-list-container" class="glass-card p-8 rounded-2xl shadow-lg border border-border-color mt-8">
            </div>
        `;

        worldMapSvgContainer = document.getElementById('world-map-svg');
        regionDetailPanel = document.getElementById('region-detail-panel');
        poiDetailPanel = document.getElementById('poi-detail-panel');
        if (poiDetailPanel) {
            poiDetailName = document.getElementById('poi-detail-name');
            poiDetailStatus = document.getElementById('poi-detail-status');
            poiDetailType = document.getElementById('poi-detail-type');
            poiDetailJournalEntry = document.getElementById('poi-detail-journal-entry');
            document.getElementById('poi-detail-description');
        }

        if (!worldMapSvgContainer) return;

        const regions = dbInstanceRef.world.regions || {};
        const mapSvg = worldMapSvgContainer;
        mapSvg.innerHTML = '';

        const regionLayout = {
            "TheCentralNexus": { x: 400, y: 400, width: 200, height: 200 },
            "TheLuminousPlains": { x: 650, y: 300, width: 200, height: 150 },
            "TheWhisperingReaches": { x: 150, y: 250, width: 200, height: 180 },
            "TheShatteredPeaks": { x: 700, y: 50, width: 250, height: 200 },
            "TheCrimsonDesert": { x: 50, y: 600, width: 300, height: 250 },
            "TheAzureForest": { x: 400, y: 700, width: 200, height: 250 },
            "TheSunkenCity": { x: 100, y: 50, width: 150, height: 180 },
            "TheFloatingIslands": { x: 750, y: 650, width: 200, height: 200 },
            "TheAshfallWastes": { x: 250, y: 800, width: 250, height: 150 },
            "TheSilentCanyon": { x: 500, y: 150, width: 150, height: 100 },
            "TheWhisperingWoods": { x: 300, y: 50, width: 180, height: 150 },
            "TheEternalGlacier": { x: 10, y: 850, width: 150, height: 100 },
            "TheVerdantJungle": { x: 800, y: 850, width: 150, height: 100 }
        };

        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.innerHTML = `
            <pattern id="plains-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect x="0" y="0" width="10" height="10" fill="#4CAF50"/>
                <circle cx="5" cy="5" r="2" fill="#8BC34A"/>
            </pattern>
            <pattern id="forest-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect x="0" y="0" width="10" height="10" fill="#2E7D32"/>
                <circle cx="5" cy="5" r="3" fill="#4CAF50"/>
            </pattern>
            <pattern id="desert-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect x="0" y="0" width="10" height="10" fill="#FFEB3B"/>
                <path d="M0 5 L5 0 L10 5 L5 10 Z" fill="#FFC107"/>
            </pattern>
            <pattern id="mountainous-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect x="0" y="0" width="10" height="10" fill="#607D8B"/>
                <path d="M0 10 L5 0 L10 10 Z" fill="#90A4AE"/>
            </pattern>
            <pattern id="swamp-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect x="0" y="0" width="10" height="10" fill="#5D4037"/>
                <circle cx="2" cy="8" r="1" fill="#4CAF50"/>
                <circle cx="8" cy="2" r="1" fill="#795548"/>
            </pattern>
            <pattern id="oceanic-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect x="0" y="0" width="10" height="10" fill="#2196F3"/>
                <path d="M0 5 Q5 0 10 5 Q5 10 0 5 Z" fill="#00BCD4"/>
            </pattern>
            <pattern id="floating_islands-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect x="0" y="0" width="10" height="10" fill="#BBDEFB"/>
                <circle cx="5" cy="5" r="3" fill="#64B5F6"/>
            </pattern>
            <pattern id="volcanic-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect x="0" y="0" width="10" height="10" fill="#3E2723"/>
                <circle cx="5" cy="5" r="2" fill="#FF5722"/>
            </pattern>
            <pattern id="tundra-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect x="0" y="0" width="10" height="10" fill="#B0BEC5"/>
                <rect x="2" y="2" width="6" height="6" fill="#CFD8DC"/>
            </pattern>
            <pattern id="jungle-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect x="0" y="0" width="10" height="10" fill="#388E3C"/>
                <path d="M0 10 L5 0 L10 10 Z" fill="#66BB6A"/>
            </pattern>
        `;
        mapSvg.appendChild(defs);

        for (const regionId in regions) {
            const region = regions[regionId];
            const layout = regionLayout[regionId];

            if (!layout) {
                console.warn(`Layout for region ${regionId} not defined in regionLayout.`);
                continue;
            }

            const regionRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            regionRect.setAttribute("x", layout.x);
            regionRect.setAttribute("y", layout.y);
            regionRect.setAttribute("width", layout.width);
            regionRect.setAttribute("height", layout.height);
            regionRect.setAttribute("fill", `url(#${region.terrainType}-pattern)`);
            regionRect.setAttribute("stroke", "white");
            regionRect.setAttribute("stroke-width", "2");
            regionRect.classList.add('region-svg-shape');
            regionRect.dataset.regionId = regionId;
            mapSvg.appendChild(regionRect);

            const nexusOverlay = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            nexusOverlay.setAttribute("x", layout.x);
            nexusOverlay.setAttribute("y", layout.y);
            nexusOverlay.setAttribute("width", layout.width);
            nexusOverlay.setAttribute("height", layout.height);
            nexusOverlay.setAttribute("fill", "transparent");
            nexusOverlay.classList.add('nexus-overlay', `nexus-status-${region.status.toLowerCase()}`);
            mapSvg.appendChild(nexusOverlay);

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", layout.x + layout.width / 2);
            text.setAttribute("y", layout.y + layout.height / 2);
            text.setAttribute("fill", "white");
            text.setAttribute("font-size", "20");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.textContent = region.name;
            text.style.pointerEvents = 'none';
            mapSvg.appendChild(text);

            regionRect.addEventListener('click', (e) => {
                const rect = e.target.getBoundingClientRect();
                WandererPageRenderer._showRegionDetailPanel(regionId, rect.right, rect.top);
            });
        }

        const worldLandmarks = WORLD_LANDMARKS || {};
        for (const poiId in worldLandmarks) {
            const poi = worldLandmarks[poiId];
            const region = regions[poi.regionId];

            if (region && regionLayout[poi.regionId]) {
                const regionLayoutData = regionLayout[poi.regionId];

                const poiSvgX = regionLayoutData.x + (poi.coords.x * regionLayoutData.width);
                const poiSvgY = regionLayoutData.y + (poi.coords.y * regionLayoutData.height);

                const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                markerGroup.setAttribute("transform", `translate(${poiSvgX}, ${poiSvgY}) scale(${1 / currentZoomLevel})`);
                markerGroup.classList.add('poi-marker');
                markerGroup.dataset.poiId = poiId;
                markerGroup.style.cursor = 'pointer';

                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", 0);
                circle.setAttribute("cy", 0);
                circle.setAttribute("r", "10");

                let fill = 'gray';
                if (poi.currentStatus === 'active' || poi.currentStatus === 'discovered') fill = '#4CAF50';
                else if (poi.currentStatus === 'rumored') fill = '#FFC107';
                else if (poi.currentStatus === 'corrupted') fill = '#F44336';
                else if (poi.currentStatus === 'purified') fill = '#2196F3';
                else if (poi.currentStatus === 'ruined' || poi.currentStatus === 'unknown') fill = '#607D8B';

                circle.setAttribute("fill", fill);
                circle.setAttribute("stroke", "white");
                circle.setAttribute("stroke-width", "1");
                markerGroup.appendChild(circle);

                const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                foreignObject.setAttribute("x", -8);
                foreignObject.setAttribute("y", -8);
                foreignObject.setAttribute("width", 16);
                foreignObject.setAttribute("height", 16);
                foreignObject.innerHTML = `<i data-feather="${poi.icon || 'map-pin'}" class="w-4 h-4 text-white"></i>`;
                markerGroup.appendChild(foreignObject);

                mapSvg.appendChild(markerGroup);

                markerGroup.addEventListener('click', (e) => {
                    const groupRect = markerGroup.getBoundingClientRect();
                    WandererPageRenderer._showPoiDetailPanel(poi, groupRect.right, groupRect.top);
                });
            }
        }

        if (typeof feather !== 'undefined' && feather.replace) {
            feather.replace();
        }
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    },

    _showRegionDetailPanel(regionId, mouseX, mouseY) {
        if (!regionDetailPanel) return;
        const region = dbInstanceRef.world.regions[regionId];

        if (!region) return;

        document.getElementById('detail-region-name').textContent = region.name;
        document.getElementById('detail-region-climate').textContent = region.climate;
        document.getElementById('detail-region-terrain').textContent = region.terrainType;
        document.getElementById('detail-region-threat').textContent = region.threatLevel;
        document.getElementById('detail-region-faction').textContent = WorldManagerRef.getFactionName(region.dominantFaction);
        document.getElementById('detail-region-description').textContent = region.description;

        document.getElementById('detail-intention-value').textContent = region.currentIntention;
        document.getElementById('detail-echo-value').textContent = region.currentEcho;

        const statusEl = document.getElementById('detail-nexus-status');
        statusEl.textContent = region.status.replace(/_/g, ' ');
        statusEl.classList.remove('text-sanctum', 'text-maelstrom', 'text-normal', 'text-unstable');
        statusEl.classList.add(`text-${region.status.toLowerCase()}`);

        const neighboringRegionsContainer = document.getElementById('detail-neighboring-regions');
        if (neighboringRegionsContainer) {
            neighboringRegionsContainer.innerHTML = (region.neighboringRegions || [])
                .map(id => `<span class="bg-slate-700 text-white text-xs px-2 py-1 rounded">${WorldManagerRef.getRegionName(id)}</span>`)
                .join('');
        }

        const mapContainer = document.getElementById('world-map-svg-container');
        const mapRect = mapContainer.getBoundingClientRect();

        let panelLeft = mouseX + 20;
        let panelTop = mouseY + 20;

        if (panelLeft + regionDetailPanel.offsetWidth > window.innerWidth) {
            panelLeft = mouseX - regionDetailPanel.offsetWidth - 20;
        }
        if (panelTop + regionDetailPanel.offsetHeight > window.innerHeight) {
            panelTop = mouseY - regionDetailPanel.offsetHeight - 20;
        }

        regionDetailPanel.style.left = `${panelLeft}px`;
        regionDetailPanel.style.top = `${panelTop}px`;
        regionDetailPanel.style.display = 'block';
        setTimeout(() => regionDetailPanel.classList.add('visible'), 10);

        document.getElementById('detail-fortify-btn').onclick = async () => {
            const user = getCurrentUser();
            const cost = 10;
            if (user.essenceOfWill >= cost) {
                UIManagerRef.showLoading('Memperkuat Nexus...');
                user.essenceOfWill -= cost;
                setCurrentUser(user);
                await saveDBInstanceRef(true);
                await WorldManagerRef.fortifyNexus(regionId, 50);
                UIManagerRef.hideLoading();
                UIManagerRef.showNotification(`Nexus ${region.name} diperkuat!`, 'plus-circle', 'success');
                WandererPageRenderer._hideRegionDetailPanel();
                WandererPageRenderer.renderWorldMap();
            } else {
                UIManagerRef.showNotification(`Tidak cukup Esensi Niat! Dibutuhkan ${cost}.`, 'alert-triangle', 'error');
            }
        };
        document.getElementById('detail-cleansing-btn').onclick = async () => {
            const user = getCurrentUser();
            const cost = 10;
            if (user.essenceOfWill >= cost) {
                UIManagerRef.showLoading('Melakukan Ritual Pembersihan...');
                user.essenceOfWill -= cost;
                setCurrentUser(user);
                await saveDBInstanceRef(true);
                await WorldManagerRef.performCleansingRitual(regionId, 50);
                UIManagerRef.hideLoading();
                UIManagerRef.showNotification(`Ritual Pembersihan di ${region.name} berhasil!`, 'minus-circle', 'success');
                WandererPageRenderer._hideRegionDetailPanel();
                WandererPageRenderer.renderWorldMap();
            } else {
                UIManagerRef.showNotification(`Tidak cukup Esensi Niat! Dibutuhkan ${cost}.`, 'alert-triangle', 'error');
            }
        };
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        } else if (typeof feather !== 'undefined' && feather.replace) {
            feather.replace();
        }
    },

    _hideRegionDetailPanel() {
        if (regionDetailPanel) {
            regionDetailPanel.classList.remove('visible');
            setTimeout(() => regionDetailPanel.style.display = 'none', 300);
        }
    },

    _showPoiDetailPanel: (poi, mouseX, mouseY) => {
        if (!poiDetailPanel) return;

        poiDetailName.textContent = poi.name;
        poiDetailType.textContent = poi.type.replace(/_/g, ' ');
        poiDetailStatus.textContent = poi.currentStatus.replace(/_/g, ' ');
        document.getElementById('poi-detail-description').textContent = poi.description || REGIONS_DATA[poi.regionId]?.description || 'Tidak ada deskripsi.';

        poiDetailStatus.classList.remove('text-green-400', 'text-yellow-400', 'text-red-400', 'text-slate-400', 'text-blue-400');
        if (poi.currentStatus === 'discovered' || poi.currentStatus === 'active' || poi.currentStatus === 'purified') {
            poiDetailStatus.classList.add('text-green-400');
        } else if (poi.currentStatus === 'rumored') {
            poiDetailStatus.classList.add('text-yellow-400');
        } else if (poi.currentStatus === 'corrupted' || poi.currentStatus === 'ruined') {
            poiDetailStatus.classList.add('text-red-400');
        } else if (poi.currentStatus === 'unknown') {
            poiDetailStatus.classList.add('text-slate-400');
        } else {
            poiDetailStatus.classList.add('text-slate-400');
        }

        if (poi.journalEntryId) {
            const journalEntryTemplate = JOURNAL_ENTRY_TEMPLATES[poi.journalEntryId];
            const currentUserJournal = getCurrentUser().journal || [];
            const isDiscoveredInJournal = currentUserJournal.some(entry => entry.id === poi.journalEntryId);

            if (journalEntryTemplate && isDiscoveredInJournal) {
                poiDetailJournalEntry.innerHTML = `Entri Jurnal: <span class="text-indigo-300 italic">"${journalEntryTemplate.title}"</span>`;
                poiDetailJournalEntry.style.display = 'block';
            } else if (journalEntryTemplate && poi.currentStatus === 'rumored') {
                poiDetailJournalEntry.innerHTML = `Entri Jurnal: <span class="text-slate-500 italic">"Rumor tentang ${journalEntryTemplate.title}"</span>`;
                poiDetailJournalEntry.style.display = 'block';
            }
            else {
                poiDetailJournalEntry.style.display = 'none';
            }
        } else {
            poiDetailJournalEntry.style.display = 'none';
        }

        const mapSvg = document.getElementById('world-map-svg');
        const mapRect = mapSvg.getBoundingClientRect();

        let panelLeft = mouseX + 20;
        let panelTop = mouseY + 20;

        if (panelLeft + poiDetailPanel.offsetWidth > window.innerWidth) {
            panelLeft = mouseX - poiDetailPanel.offsetWidth - 20;
        }
        if (panelTop + poiDetailPanel.offsetHeight > window.innerHeight) {
            panelTop = mouseY - poiDetailPanel.offsetHeight - 20;
        }

        poiDetailPanel.style.left = `${panelLeft}px`;
        poiDetailPanel.style.top = `${panelTop}px`;
        poiDetailPanel.style.display = 'block';
        setTimeout(() => poiDetailPanel.classList.add('visible'), 10);
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        } else if (typeof feather !== 'undefined' && feather.replace) {
            feather.replace();
        }
    },

    _hidePoiDetailPanel: () => {
        if (poiDetailPanel) {
            poiDetailPanel.classList.remove('visible');
            setTimeout(() => poiDetailPanel.style.display = 'none', 300);
        }
    },


    _handleMapZoom(delta) {
        currentZoomLevel = Math.max(0.5, Math.min(2.0, currentZoomLevel + delta));
        UIManagerRef.showNotification(`Zoom Peta: ${Math.round(currentZoomLevel * 100)}%`, 'zoom-in', 'info');

        WandererPageRenderer.renderWorldMap();
    },

    renderSkillTree() {
        const container = document.getElementById('skill-tree-page');
        if (!container) return;

        let html = `
            <div class="text-center mb-10">
                <h2 class="text-4xl font-serif font-bold text-white tracking-wider">The Constellation of Imprints</h2>
                <p class="text-lg text-slate-400 mt-2">As your Attributes grow, new stars are born, granting permanent boons.</p>
            </div>
            <div id="skill-tree-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">`;

        GLOBAL_ATTRIBUTES.forEach(attrName => {
            const user = getCurrentUser();
            const attribute = user.attributes.find(a => a.name === attrName);
            const skillData = SKILL_TREE_DATA[attrName];

            html += `
                <div class="glass-card p-6 rounded-2xl shadow-lg border border-border-color">
                    <h4 class="text-xl font-serif font-bold text-white mb-4 text-center">${attrName}</h4>
                    <p class="text-slate-400 text-sm mb-4 text-center">Level Saat Ini: <span class="font-bold text-indigo-400">${attribute.value}</span></p>
                    <div class="space-y-4">
            `;

            if (skillData) {
                const levels = Object.keys(skillData).filter(key => !isNaN(Number(key))).map(Number).sort((a, b) => a - b);

                levels.forEach(level => {
                    const imprint = skillData[level];
                    const isUnlocked = user.unlockedImprints.includes(imprint.id);
                    const canUnlock = attribute.value >= level && !isUnlocked;
                    const isFuture = attribute.value < level;

                    html += `
                        <div class="glass-card p-4 rounded-lg border ${isUnlocked ? 'border-emerald-500 bg-emerald-900/20' : isFuture ? 'border-slate-700 bg-slate-900/10' : 'border-indigo-600 bg-indigo-900/20'} ${isFuture ? 'opacity-50' : ''}">
                            <div class="flex items-center mb-2">
                                <i data-feather="${imprint.icon}" class="w-6 h-6 mr-3 ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}"></i>
                                <h5 class="text-lg font-semibold ${isUnlocked ? 'text-white' : 'text-slate-300'}">${imprint.name} (Level ${level})</h5>
                            </div>
                            <p class="text-slate-400 text-sm">${imprint.description}</p>
                            ${isUnlocked ? `<span class="mt-2 block text-emerald-400 text-xs font-bold">UNLOCKED</span>` : ''}
                            ${isFuture ? `<span class="mt-2 block text-slate-500 text-xs font-bold">LEVEL ${level} REQUIRED</span>` : ''}
                            ${canUnlock ? `<button class="glass-button primary-button mt-3 w-full unlock-imprint-btn" data-imprint-id="${imprint.id}">ACTIVATE</button>` : ''}
                        </div>
                    `;
                });
            } else {
                html += `<p class="text-slate-500 text-center">Belum ada imprin untuk atribut ini.</p>`;
            }

            html += `
                    </div>
                </div>
            `;
        });

        const userArchetype = getCurrentUser().archetype;
        if (userArchetype && SKILL_TREE_DATA[userArchetype]) {
            const archetypeSkills = SKILL_TREE_DATA[userArchetype];
            html += `
                <div class="glass-card p-6 rounded-2xl shadow-lg border border-border-color mt-8">
                    <h4 class="text-xl font-serif font-bold text-white mb-4 text-center">Jalur Sang ${userArchetype.charAt(0).toUpperCase() + userArchetype.slice(1)}</h4>
                    <div class="space-y-4">`;

            Object.keys(archetypeSkills).forEach(skillKey => {
                const skill = archetypeSkills[skillKey];
                const isUnlocked = getCurrentUser().unlockedImprints.includes(skill.id);
                let requirementText = '';
                let canUnlock = false;

                if (skill.level) {
                    const requiredAttr = skill.attributeRequirement ? skill.attributeRequirement.attribute : null;
                    const requiredLevel = skill.attributeRequirement ? skill.attributeRequirement.level : skill.level;
                    const userAttrValue = requiredAttr ? getCurrentUser().attributes.find(a => a.name === requiredAttr).value : null;

                    if (requiredAttr && userAttrValue < requiredLevel) {
                        requirementText = `<span class="mt-2 block text-red-400 text-xs font-bold">LEVEL ${requiredLevel} ${requiredAttr.toUpperCase()} DIPERLUKAN</span>`;
                    } else if (userAttrValue >= requiredLevel && !isUnlocked) {
                        canUnlock = true;
                    }
                } else if (!isUnlocked) {
                    canUnlock = true;
                }

                html += `
                    <div class="glass-card p-4 rounded-lg border ${isUnlocked ? 'border-emerald-500 bg-emerald-900/20' : (canUnlock ? 'border-indigo-600 bg-indigo-900/20' : 'border-slate-700 bg-slate-900/10 opacity-50')}">
                        <div class="flex items-center mb-2">
                            <i data-feather="${skill.icon}" class="w-6 h-6 mr-3 ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}"></i>
                            <h5 class="text-lg font-semibold ${isUnlocked ? 'text-white' : 'text-slate-300'} mb-2">${skill.name}</h5>
                        </div>
                        <p class="text-slate-400 text-sm">${skill.description}</p>
                        ${skill.cost ? `<p class="text-slate-500 text-xs mt-1">Biaya: ${skill.cost} Esensi Niat</p>` : ''}
                        ${isUnlocked ? `<span class="mt-2 block text-emerald-400 text-xs font-bold">UNLOCKED</span>` : ''}
                        ${!isUnlocked && !canUnlock ? requirementText : ''}
                        ${!isUnlocked && canUnlock ? `<button class="glass-button primary-button mt-3 w-full unlock-imprint-btn" data-imprint-id="${skill.id}">ACTIVATE</button>` : ''}
                    </div>
                `;
            });
            html += `</div></div>`;
        }

        container.innerHTML = html;
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    },

    definePageTemplates() {
        WandererPageRenderer.pageTemplates = {
            character: WandererPageRenderer.getWandererCharacterHtml(),
            inventory: `
                <div id="inventory-page" class="glass-card p-8 rounded-2xl shadow-lg border border-border-color h-full flex flex-col relative">
                    <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6 text-center">Inventaris Wanderer</h3>
                    <p class="text-slate-400 mb-6 text-center">Tempat di mana semua kepemilikanmu bersemayam.</p>

                    <div class="mb-4 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <span class="text-slate-400 text-sm">Urutkan Berdasarkan:</span>
                        <select id="sort-inventory-by" class="glass-input p-2 rounded text-sm w-full md:w-auto">
                            <option value="name">Nama</option>
                            <option value="quantity">Kuantitas</option>
                            <option value="value">Nilai</option>
                            <option value="type">Tipe</option>
                            <option value="rarity">Kelangkaan</option>
                        </select>
                        <span class="text-slate-400 text-sm">Filter Tipe:</span>
                        <select id="filter-inventory-type" class="glass-input p-2 rounded text-sm w-full md:w-auto">
                            <option value="all">Semua</option>
                            <option value="currency">Mata Uang</option>
                            <option value="material">Material</option>
                            <option value="consumable">Konsumsi</option>
                            <option value="artifact">Artefak</option>
                            <option value="information">Informasi</option>
                            <option value="quest_item">Item Misi</option>
                            <option value="equipment">Peralatan</option>
                            <option value="tool">Alat</option>
                            <option value="resource">Sumber Daya</option>
                        </select>
                    </div>

                    <div id="inventory-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        </div>

                    <div id="item-detail-panel" class="glass-card p-4 rounded-lg shadow-xl border border-border-color fixed inset-x-0 bottom-0 mx-auto w-11/12 md:w-2/3 lg:w-1/2 z-50 transform translate-y-full transition-transform duration-300" style="display: none;">
                        <button id="close-detail-panel" class="absolute top-3 right-3 text-slate-400 hover:text-white"><i data-feather="x" class="w-6 h-6"></i></button>
                        <h4 id="detail-item-name" class="text-2xl font-serif text-white mb-2">Nama Item</h4>
                        <p class="text-slate-400 text-sm mb-1">Tipe: <span id="detail-item-type" class="font-bold capitalize"></span></p>
                        <p class="text-slate-400 text-sm mb-1">Kelangkaan: <span id="detail-item-rarity" class="font-bold capitalize"></span></p>
                        <p id="detail-item-value" class="text-slate-300 text-base mb-2">Nilai: X Koin</p>
                        <p id="detail-item-durability" class="text-slate-300 text-base mb-2" style="display: none;"></p>
                        <p id="detail-item-effects" class="text-slate-300 text-base mb-4" style="display: none;"></p>
                        <p id="detail-item-description" class="text-slate-200 text-sm italic mb-4"></p>
                        <div id="item-action-buttons" class="flex flex-wrap gap-2 justify-end">
                            </div>
                    </div>
                </div>
            `,
            journal: `
                <div id="journal-page" class="glass-card p-8 rounded-2xl shadow-lg border border-border-color h-full flex flex-col">
                    <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6 text-center">Jurnal Perjalanan</h3>
                    <p class="text-slate-400 mb-6 text-center">Catatan pribadimu tentang setiap Denyut Takdir yang terungkap.</p>

                    <div class="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                        <div class="flex-grow flex space-x-4">
                            <div>
                                <label for="sort-journal-by" class="block text-slate-400 text-sm font-semibold mb-2">Urutkan Berdasarkan:</label>
                                <select id="sort-journal-by" class="glass-input bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="date_desc">Tanggal (Terbaru)</option>
                                    <option value="date_asc">Tanggal (Terlama)</option>
                                    <option value="type">Tipe</option>
                                </select>
                            </div>
                            <div>
                                <label for="filter-journal-type" class="block text-slate-400 text-sm font-semibold mb-2">Filter Tipe:</label>
                                <select id="filter-journal-type" class="glass-input bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="all">Semua</option>
                                    <option value="landmark">Landmark</option>
                                    <option value="lore">Lore</option>
                                    <option value="character">Karakter</option>
                                    <option value="creature">Makhluk</option>
                                    <option value="item">Item</option>
                                    <option value="quest">Misi</option>
                                    <option value="world_event">Peristiwa Dunia</option>
                                    <option value="reflection">Refleksi Pribadi</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div id="journal-entries-container" class="space-y-4 overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                    </div>

                    <div class="mt-6 border-t border-border-color pt-6">
                        <label for="new-reflection-text" class="block text-slate-400 text-sm font-semibold mb-2">Refleksi Pribadi:</label>
                        <textarea id="new-reflection-text" class="glass-input w-full p-2" rows="3" placeholder="Tuliskan pemikiranmu tentang perjalanan ini..."></textarea>
                        <button id="add-reflection-btn" class="glass-button primary-button w-full mt-3">
                            <i data-feather="feather" class="w-5 h-5 mr-2"></i> Tambah Refleksi
                        </button>
                    </div>
                </div>
            `,
            quest_log: `
                 <div id="quest-log-page" class="h-full flex flex-col">
                    <div class="border-b border-border-color mb-8">
                        <nav class="flex space-x-8" aria-label="Tabs" id="quest-log-tabs">
                            <button class="quest-tab active glass-button py-4 px-1 text-lg font-semibold border-b-2 border-transparent" data-target="active_quests_content">Misi Aktif</button>
                            <button class="quest-tab glass-button py-4 px-1 text-lg font-semibold text-slate-400 hover:text-slate-200 border-b-2 border-transparent" data-target="the_chronicle_content">Kronik</button>
                            <button class="quest-tab glass-button py-4 px-1 text-lg font-semibold text-slate-400 hover:text-slate-200 border-b-2 border-transparent" data-target="notification_log_content">Log Peristiwa</button>
                        </nav>
                    </div>
                    <div id="active_quests_content" class="quest-content active flex-grow">
                        <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color h-full flex flex-col">
                            <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6">Alur Takdir Aktif</h3>
                             <div id="active-quests-log-container" class="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 flex-grow"></div>
                        </div>
                    </div>
                    <div id="the_chronicle_content" class="quest-content flex-grow" style="display: none;">
                        <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color h-full flex flex-col">
                             <div class="text-center mb-10">
                                <h3 class="text-4xl font-serif font-bold text-white tracking-wider">Kronik Penjelajah Jiwa</h3>
                                <p class="text-lg text-slate-400 mt-2">Catatan hidup perjalanan Anda sejak Hari Pertama.</p>
                             </div>
                             <div id="chronicle-container" class="space-y-12 relative border-l-2 border-border-color ml-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 flex-grow"></div>
                        </div>
                    </div>
                    <div id="notification_log_content" class="quest-content flex-grow" style="display: none;">
                        <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color h-full flex flex-col">
                            <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6">Log Peristiwa Dunia</h3>
                            <div id="notification-log-container" class="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 flex-grow">
                                </div>
                        </div>
                    </div>
                </div>
            `,
            sanctuary: `
                <div id="sanctuary-page" class="h-full flex flex-col">
                    <div id="soul-sanctuary-container" class="glass-card p-8 rounded-2xl shadow-lg border border-border-color flex-grow flex flex-col">
                        <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6 text-center">Tempat Perlindungan Jiwa</h3>
                        <p class="text-slate-400 text-center mb-4">Sebuah cerminan batin jiwamu, berevolusi seiring takdir.</p>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full">
                            <div id="attribute-crystal" class="glass-card p-6 rounded-lg text-center flex flex-col items-center justify-center min-h-[200px]">
                                <i data-feather="hexagon" class="w-12 h-12 text-indigo-400 mb-4"></i>
                                <h4 class="text-xl font-serif text-white mb-2">Kristal Atribut</h4>
                                <p class="text-slate-400 text-sm">Menampilkan kekuatan inti jiwamu.</p>
                                <div id="attribute-display" class="mt-4 text-left w-full">
                                </div>
                            </div>

                            <div id="conscience-scales" class="glass-card p-6 rounded-lg text-center flex flex-col items-center justify-center min-h-[200px]">
                                <i data-feather="sun" class="w-12 h-12 text-yellow-300 mb-4"></i>
                                <h4 class="text-xl font-serif text-white mb-2">Timbangan Nurani</h4>
                                <p class="text-slate-400 text-sm">Keseimbangan antara Niat dan Gema.</p>
                                <div id="alignment-display" class="mt-4 text-left w-full">
                                </div>
                            </div>

                            <div id="chronicle-wall" class="glass-card p-6 rounded-lg text-center flex flex-col items-center justify-center min-h-[200px]">
                                <i data-feather="book-open" class="w-12 h-12 text-green-400 mb-4"></i>
                                <h4 class="text-xl font-serif text-white mb-2">Dinding Kronik</h4>
                                <p class="text-slate-400 text-sm">Catatan perjalanan jiwamu.</p>
                                <div id="chronicle-summary" class="mt-4 text-left w-full">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="glass-card p-8 rounded-2xl shadow-lg border border-border-color mt-8">
                        <h3 class="text-2xl font-serif font-bold text-white tracking-wider mb-6">Altar Permohonan</h3>
                        <p class="text-slate-400 mb-4">Korbankan Esensi Niat Anda untuk memohon bimbingan dari Sang Penempa.</p>
                        <div class="space-y-4">
                            <div class="glass-container p-4 rounded-lg flex items-center justify-between">
                                <span class="text-slate-300">Esensi Niat Anda:</span>
                                <span class="font-mono text-white text-xl">${'${getCurrentUser().essenceOfWill}'} <i data-feather="hexagon" class="inline-block w-5 h-5 ml-1 text-purple-400"></i></span>
                            </div>

                            <button id="petition-guidance-btn" class="glass-button primary-button w-full">
                                <i data-feather="compass" class="w-5 h-5 mr-2"></i> Memohon Petunjuk (5 Esensi Niat)
                            </button>
                            <button id="petition-trial-btn" class="glass-button primary-button w-full">
                                <i data-feather="sword" class="w-5 h-5 mr-2"></i> Memohon Ujian (10 Esensi Niat)
                            </button>
                            <button id="petition-blessing-btn" class="glass-button primary-button w-full">
                                <i data-feather="award" class="w-5 h-5 mr-2"></i> Memohon Berkah (20 Esensi Niat)
                            </button>
                        </div>
                    </div>
                </div>
            `,
            skill_tree: `
                <div id="skill-tree-page" class="h-full flex flex-col">
                    <div class="text-center mb-10">
                        <h2 class="text-4xl font-serif font-bold text-white tracking-wider">The Constellation of Imprints</h2>
                        <p class="text-lg text-slate-400 mt-2">As your Attributes grow, new stars are born, granting permanent boons.</p>
                    </div>
                    <div id="skill-tree-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    </div>
                </div>
            `
        };
    },
};