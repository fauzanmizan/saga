// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 15:03 WITA ==
// == PERIHAL: Modul Mini-game Menyerap Gema ==
// - Berisi semua logika dan fungsionalitas untuk mini-game "Menyerap Gema" (Absorb Echo).
// - Diimpor dan dipanggil oleh `wandererFeatures.js`.
// - Bergantung pada UIManager, AuthService, WorldManager, firebaseService, dan gameData.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-27, 19:00 WITA ==
// == PERIHAL: Perbaikan Konsistensi Variabel dan Dependensi ==
// - Mengganti variabel lokal `dbInstance` dan `saveDBInstance` dengan `dbInstanceRef` dan `saveDBInstanceRef`.
// - Menambahkan `UIManagerRef`, `WorldManagerRef`, dan `WandererPageRendererRef` ke setDependencies untuk konsistensi.
// - Memastikan penggunaan `UIManagerRef` yang konsisten.
// ===========================================

import { UIManager } from '../uiManager.js';
import { getCurrentUser, setCurrentUser } from '../authService.js';
import { updateDocument } from '../firebaseService.js';
import { WorldManager } from '../worldManager.js'; // Pastikan WorldManager diimpor

// Gunakan nama variabel yang konsisten dengan modul lain
let dbInstanceRef;
let saveDBInstanceRef;
let UIManagerRef; // Tambahkan ini
let WorldManagerRef; // Tambahkan ini
let WandererPageRendererRef; // Tambahkan ini

export const AbsorbEchoGame = {
    /**
     * Mengatur dependensi untuk modul AbsorbEchoGame.
     * @param {object} db - Instans database (dbInstance dari App).
     * @param {function} saveDB - Fungsi untuk menyimpan database.
     * @param {object} uiM - Instans UIManager.
     * @param {object} worldM - Instans WorldManager.
     * @param {object} renderer - Referensi ke WandererPageRenderer.
     */
    setDependencies(db, saveDB, uiM, worldM, renderer) { // Sesuaikan parameter
        dbInstanceRef = db;
        saveDBInstanceRef = saveDB;
        UIManagerRef = uiM;
        WorldManagerRef = worldM;
        WandererPageRendererRef = renderer;
    },

    /**
     * Memicu mini-game "Menyerap Gema" untuk arketipe Echo-Scribe.
     * @param {string} source - Sumber gema (saat ini tidak digunakan, hanya placeholder).
     */
    async triggerAbsorbEchoMiniGame(source) {
        if (getCurrentUser().role !== 'wanderer' || getCurrentUser().archetype !== 'echo-scribe') {
            UIManagerRef.showNotification("Hanya Juru Gema yang dapat Menyerap Gema.", 'info', 'bg-blue-500'); // Gunakan UIManagerRef
            return;
        }

        UIManagerRef.showLoading("Menyelaraskan dengan Gema Realitas..."); // Gunakan UIManagerRef

        document.body.classList.add('echo-harmonization-active');

        const miniGameDuration = 3000;
        const successChance = 0.7;

        const user = getCurrentUser();
        const currentKnowledge = user.attributes.find(a => a.name === 'Knowledge').value;
        const currentFocus = user.attributes.find(a => a.name === 'Focus').value;
        let finalSuccessChance = successChance + (currentKnowledge * 0.02) + (currentFocus * 0.01);
        finalSuccessChance = Math.min(0.95, finalSuccessChance);

        const success = Math.random() < finalSuccessChance;

        setTimeout(async () => {
            document.body.classList.remove('echo-harmonization-active');

            if (success) {
                const info = AbsorbEchoGame.generateEchoInsight(source);
                user.chronicle.push({
                    id: Date.now(),
                    type: 'echo_insight',
                    title: `Penglihatan Gema: ${info.title}`,
                    spoil: info.text,
                    reflection: `Melalui Gema, Anda melihat: "${info.text}"`,
                    timestamp: new Date().toISOString(),
                    sigil: 'eye'
                });
                setCurrentUser(user);
                await saveDBInstanceRef(false);
                UIManagerRef.showNotification(`Penglihatan Gema Diterima: ${info.title}!`, 'eye', 'bg-gradient-to-r from-purple-400 to-indigo-400'); // Gunakan UIManagerRef
                if (WandererPageRendererRef && WandererPageRendererRef.renderChronicle) { // Jika ada referensi ke renderer
                    WandererPageRendererRef.renderChronicle();
                }

            } else {
                user.alignment.echo = Math.min(100, user.alignment.echo + 15);
                setCurrentUser(user);
                await saveDBInstanceRef(false);
                UIManagerRef.showNotification('Harmonisasi Gema Gagal! Jiwamu bergetar dan Gema Balik melandumu.', 'alert-triangle', 'bg-red-500'); // Gunakan UIManagerRef
                document.body.classList.add('echo-backlash-active');
                setTimeout(() => document.body.classList.remove('echo-backlash-active'), 5000);
            }
            UIManagerRef.hideLoading(); // Gunakan UIManagerRef
            if (WandererPageRendererRef && WandererPageRendererRef.renderPlayerStatus) { // Jika ada referensi ke renderer
                 WandererPageRendererRef.renderPlayerStatus();
            }
        }, miniGameDuration);
    },

    /**
     * Menghasilkan wawasan gema secara acak.
     * @param {string} source - Sumber gema (saat ini tidak digunakan, hanya placeholder).
     * @returns {{title: string, text: string}} Objek berisi judul dan teks wawasan.
     */
    generateEchoInsight(source) {
        const insights = [
            { title: "Fragmen Memori Pertempuran", text: "Anda melihat sekilas pertempuran kuno, menyisakan jejak ketakutan. Sebuah nama berbisik: 'Valerius...'" },
            { title: "Bisikan Kebenaran Tersembunyi", text: "Sebuah rahasia kecil tentang lokasi sebuah item tersembunyi terungkap. Tersembunyi di bawah altar tua..." },
            { title: "Bayangan Masa Depan", text: "Anda merasakan gambaran samar tentang potensi bahaya di jalan di depan. Sebuah jembatan retak..." },
            { title: "Koneksi yang Hilang", text: "Sebuah visi singkat tentang Lyra, berjuang sendirian di perbatasan." }
        ];
        return insights[Math.floor(Math.random() * insights.length)];
    },
};