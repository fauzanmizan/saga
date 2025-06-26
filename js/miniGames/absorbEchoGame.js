// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 15:03 WITA ==
// == PERIHAL: Modul Mini-game Menyerap Gema ==
// - Berisi semua logika dan fungsionalitas untuk mini-game "Menyerap Gema" (Absorb Echo).
// - Diimpor dan dipanggil oleh `wandererFeatures.js`.
// - Bergantung pada UIManager, AuthService, WorldManager, firebaseService, dan gameData.
// ===========================================

import { UIManager } from '../uiManager.js';
import { getCurrentUser, setCurrentUser } from '../authService.js';
import { updateDocument } from '../firebaseService.js';
import { WorldManager } from '../worldManager.js';

let dbInstance; // Akan diatur oleh App.init()
let saveDBInstance; // Akan diatur oleh App.init()

export const AbsorbEchoGame = {
    /**
     * Mengatur dependensi untuk modul AbsorbEchoGame.
     * @param {object} db - Instans database (dbInstance dari App).
     * @param {function} saveDB - Fungsi untuk menyimpan database.
     */
    setDependencies(db, saveDB) {
        dbInstance = db;
        saveDBInstance = saveDB;
    },

    /**
     * Memicu mini-game "Menyerap Gema" untuk arketipe Echo-Scribe.
     * @param {string} source - Sumber gema (saat ini tidak digunakan, hanya placeholder).
     */
    async triggerAbsorbEchoMiniGame(source) {
        if (getCurrentUser().role !== 'wanderer' || getCurrentUser().archetype !== 'echo-scribe') {
            UIManager.showNotification("Hanya Juru Gema yang dapat Menyerap Gema.", 'info', 'bg-blue-500');
            return;
        }

        UIManager.showLoading("Menyelaraskan dengan Gema Realitas...");

        document.body.classList.add('echo-harmonization-active');
        // TODO: Putar dengungan audio halus

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
                const info = AbsorbEchoGame.generateEchoInsight(source); // Memanggil dari dalam modul
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
                await saveDBInstance(false);
                UIManager.showNotification(`Penglihatan Gema Diterima: ${info.title}!`, 'eye', 'bg-gradient-to-r from-purple-400 to-indigo-400');
                // Asumsi WandererFeatures.renderChronicle() akan direfresh dari wandererFeatures.js jika perlu,
                // atau diimplementasikan di sini jika absorbEchoGame punya kontrol UI langsung.
                // Untuk saat ini, kami tidak memanggil renderChronicle di sini agar tetap modular.
            } else {
                user.alignment.echo = Math.min(100, user.alignment.echo + 15);
                setCurrentUser(user);
                await saveDBInstance(false);
                UIManager.showNotification('Harmonisasi Gema Gagal! Jiwamu bergetar dan Gema Balik melandumu.', 'alert-triangle', 'bg-red-500');
                document.body.classList.add('echo-backlash-active');
                setTimeout(() => document.body.classList.remove('echo-backlash-active'), 5000);
                // TODO: Putar audio terdistorsi
            }
            UIManager.hideLoading();
            // Setelah mini-game selesai, mungkin perlu me-render ulang komponen tertentu di halaman Wanderer
            // Ini akan ditangani di WandererFeatures.setupWandererNavEvents() dengan memanggil renderAllWandererComponents('character')
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