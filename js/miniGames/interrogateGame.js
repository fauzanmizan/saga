// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 14:55 WITA ==
// == PERIHAL: Modul Mini-game Menginterogasi ==
// - Mengisolasi semua logika yang terkait khusus dengan mini-game "Menginterogasi" (Barikade Mental).
// - Menyediakan fungsi utama `triggerInterrogateMiniGame` dan fungsi-fungsi pembantu internalnya.
// - Bergantung pada UIManager, getCurrentUser, updateDocument, firebaseService, dan gameData.
// ===========================================

import { UIManager } from '../uiManager.js';
import { getCurrentUser, setCurrentUser } from '../authService.js';
import { updateDocument } from '../firebaseService.js';
import { SKILL_TREE_DATA, GLOBAL_ATTRIBUTES, INTERROGATION_DATA } from '../gameData.js';

let dbInstance; // Akan diatur oleh App.init() di main.js
let saveDBInstance; // Akan diatur oleh App.init() di main.js
let DB_DOC_ID_Instance; // Akan diatur oleh App.init() di main.js

export const InterrogateGame = {
    /**
     * Mengatur dependensi untuk modul InterrogateGame.
     * @param {object} db - Instans database (dbInstance dari App).
     * @param {string} DB_DOC_ID - ID dokumen database utama.
     * @param {function} saveDB - Fungsi untuk menyimpan database.
     */
    setDependencies(db, DB_DOC_ID, saveDB) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
        saveDBInstance = saveDB;
    },

    /**
     * Memulai mini-game interogasi. Menampilkan modal dan mengelola logika game.
     * @param {object} npcTarget - Objek NPC yang akan diinterogasi (bisa juga string dummy).
     */
    async triggerInterrogateMiniGame(npcTarget) {
        // Memastikan modal yang benar ditargetkan
        const interrogateModal = document.getElementById('interrogate-modal');
        if (!interrogateModal) {
            console.error("Interrogate modal HTML not found.");
            UIManager.showNotification("Kesalahan sistem: Modal interogasi tidak ditemukan.", 'x-circle', 'bg-red-500');
            return;
        }

        if (getCurrentUser().role !== 'wanderer' || getCurrentUser().archetype !== 'inquisitor') {
            UIManager.showNotification("Hanya Sang Inkuisitor yang dapat Menginterogasi.", 'info', 'bg-blue-500');
            return;
        }

        // Menentukan target interogasi dan kelemahan rahasianya
        const target = {
            name: typeof npcTarget === 'string' ? npcTarget : npcTarget.name, // Handle dummy string or actual NPC object
            // Menghasilkan 2-3 kelemahan acak untuk target dari daftar yang tersedia
            secretWeaknesses: ['fear', 'denial', 'ignorance', 'arrogance', 'guilt', 'pride'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2)
        };
        // Inisialisasi rune barikade mental berdasarkan kelemahan target
        let currentBarricadeRunes = target.secretWeaknesses.map(weaknessId => {
            const runeData = INTERROGATION_DATA.runes.find(r => r.weaknesses.includes(weaknessId)) || { id: `default_${weaknessId}`, name: weaknessId.charAt(0).toUpperCase() + weaknessId.slice(1), icon: 'circle', weaknesses: [weaknessId] };
            return { ...runeData, isBroken: false };
        });
        let currentComposure = INTERROGATION_DATA.playerComposureMax; // Komposur awal pemain
        const playerComposureMax = INTERROGATION_DATA.playerComposureMax; // Komposur maksimum

        // Mendapatkan data skill Inkuisitor pemain
        const user = getCurrentUser();
        const inqKnowledge = user.attributes.find(a => a.name === 'Knowledge').value;
        const inqFocus = user.attributes.find(a => a.name === 'Focus').value;
        const passiveInsightActive = inqKnowledge >= (SKILL_TREE_DATA.Inquisitor.passive_insight?.level || Infinity);
        const passiveLogicActive = inqKnowledge >= (SKILL_TREE_DATA.Inquisitor.passive_logic?.level || Infinity);
        const activeRevelationActive = inqFocus >= (SKILL_TREE_DATA.Inquisitor.active_revelation?.level || Infinity);
        const revelationSkillData = SKILL_TREE_DATA.Inquisitor.active_revelation;


        /**
         * Fungsi internal untuk merender ulang konten modal interogasi.
         * Ini memungkinkan pembaruan UI real-time selama mini-game.
         */
        const renderInterrogationModalContent = () => {
            // Memperbarui judul dan deskripsi modal
            document.getElementById('interrogate-modal-title').textContent = `Menginterogasi ${target.name}`;
            document.getElementById('interrogate-modal-description').textContent = "Barikade mental lawan harus dipecahkan.";

            // Merender rune barikade mental
            const mentalBarricadeDisplay = document.getElementById('mental-barricade-display');
            const currentRuneHtml = currentBarricadeRunes.map((rune, i) => `
                <div class="interrogate-rune ${rune.isBroken ? 'broken' : ''}" data-rune-id="${rune.id}" data-weakness="${rune.weaknesses[0]}">
                    <i data-feather="${rune.icon}" class="w-8 h-8 ${rune.isBroken ? 'text-slate-600' : 'text-slate-300'}"></i>
                    <p class="text-sm text-slate-400 mt-1">${rune.name}</p>
                </div>
            `).join('');
            mentalBarricadeDisplay.innerHTML = currentRuneHtml;

            // Merender kartu argumen
            const argumentCardsContainer = document.getElementById('argument-cards-container');
            const argumentCardsHtml = INTERROGATION_DATA.argumentCards.map(card => {
                // Memeriksa apakah kartu memiliki kekuatan yang dapat memecahkan rune yang belum rusak
                const hasEffectiveStrength = currentBarricadeRunes.some(rune => !rune.isBroken && card.strengths.some(s => rune.weaknesses.includes(s)));
                // Memeriksa apakah pemain memiliki cukup Esensi Niat untuk kartu berisiko
                const isUsable = (user.essenceOfWill >= (card.isRisky ? (SKILL_TREE_DATA.Inquisitor.active_interrogate.cost || 0) : 0));
                const buttonClass = card.isRisky ? 'glass-button bg-red-700 hover:bg-red-600' : 'glass-button';

                const isDisabled = !isUsable || !hasEffectiveStrength; // Nonaktifkan jika tidak dapat digunakan atau tidak ada kekuatan efektif yang tersisa

                return `
                    <button class="${buttonClass} interro-card-btn ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                            data-card-id="${card.id}" data-strength="${card.strengths[0]}" ${isDisabled ? 'disabled' : ''}>
                        <i data-feather="${card.icon}" class="w-4 h-4 mr-2"></i> ${card.text}
                    </button>
                `;
            }).join('');
            // Menambahkan tombol skill Revelation secara terpisah jika merupakan skill aktif
            const revelationButtonHtml = activeRevelationActive ? `
                <button class="glass-button primary-button interro-card-btn revelation-skill-btn" data-card-id="revelation_skill_button" style="background: linear-gradient(135deg, #a78bfa, #c084fc);"><i data-feather="${revelationSkillData.icon}" class="w-4 h-4 mr-2"></i> ${revelationSkillData.name}</button>
            ` : '';

            argumentCardsContainer.innerHTML = argumentCardsHtml + revelationButtonHtml;

            // Menginisialisasi ulang ikon Feather setelah merender konten dinamis
            feather.replace();

            // Merender bar komposur
            const canvas = document.getElementById('interrogate-composure-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                InterrogateGame.renderComposureBar(ctx, currentComposure, playerComposureMax);
            }

            // Mengatur event listener untuk kartu argumen
            document.querySelectorAll('#argument-cards-container .interro-card-btn').forEach(button => {
                if (!button.disabled) { // Hanya lampirkan listener jika tombol tidak dinonaktifkan
                    button.onclick = (e) => InterrogateGame.handleInterrogationAction(e.target.dataset.cardId, target, currentBarricadeRunes, currentComposure, playerComposureMax, renderInterrogationModalContent, passiveInsightActive, passiveLogicActive, activeRevelationActive, revelationSkillData);
                }
            });
            // Mengatur tombol tutup
            document.getElementById('interrogate-close-btn').onclick = () => {
                interrogateModal.style.display = 'none'; // Sembunyikan modal secara langsung
                // Potensi menambahkan logika untuk kegagalan interogasi jika ditutup sebelum waktunya
            };

            // Menampilkan modal
            interrogateModal.style.display = 'flex'; // Membuat modal terlihat
            setTimeout(() => {
                interrogateModal.style.opacity = 1;
                interrogateModal.querySelector('.modal-content').style.opacity = 1;
                interrogateModal.querySelector('.modal-content').style.transform = 'scale(1)';
            }, 10);
        };

        renderInterrogationModalContent(); // Render awal
    },

    /**
     * Menangani aksi ketika kartu argumen dimainkan.
     * @param {string} cardId - ID kartu yang dimainkan.
     * @param {object} target - Objek target yang diinterogasi.
     * @param {Array} currentBarricadeRunes - Array rune barikade mental target.
     * @param {number} currentComposure - Komposur pemain saat ini.
     * @param {number} playerComposureMax - Komposur maksimum pemain.
     * @param {function} renderCallback - Fungsi callback untuk merender ulang modal.
     * @param {boolean} passiveInsightActive - Status skill 'Tatapan Tajam'.
     * @param {boolean} passiveLogicActive - Status skill 'Logika Tanpa Celah'.
     * @param {boolean} activeRevelationActive - Status skill 'Penghakiman Terakhir'.
     * @param {object} revelationSkillData - Data skill 'Penghakiman Terakhir'.
     */
    async handleInterrogationAction(cardId, target, currentBarricadeRunes, currentComposure, playerComposureMax, renderCallback, passiveInsightActive, passiveLogicActive, activeRevelationActive, revelationSkillData) {
        let successAttempt = false;
        const user = getCurrentUser();

        // Penanganan khusus untuk skill Revelation
        if (cardId === 'revelation_skill_button') {
            if (activeRevelationActive) {
                if (user.essenceOfWill < (revelationSkillData.cost || 0)) {
                    UIManager.showNotification("Tidak cukup Esensi Niat untuk skill ini!", 'alert-triangle', 'bg-red-500');
                    return;
                }
                user.essenceOfWill -= (revelationSkillData.cost || 0);

                let runesBrokenCount = 0;
                for (let i = 0; i < currentBarricadeRunes.length; i++) {
                    if (!currentBarricadeRunes[i].isBroken) {
                        currentBarricadeRunes[i].isBroken = true;
                        runesBrokenCount++;
                        if (runesBrokenCount >= (revelationSkillData.runeBreakCount || 1)) break; // Memecahkan hingga N rune
                    }
                }
                UIManager.showNotification(`${revelationSkillData.name}: Perisai hancur di bawah beban kebenaran!`, 'zap', 'bg-purple-500');
                // TODO: Putar audio skill
                successAttempt = true;
            } else {
                UIManager.showNotification("Anda belum menguasai Penghakiman Terakhir.", 'info', 'bg-blue-500');
                return; // Jangan lanjutkan jika skill tidak aktif
            }
        } else { // Kartu argumen biasa
            const chosenCard = INTERROGATION_DATA.argumentCards.find(c => c.id === cardId);
            if (!chosenCard) return;

            // Mengonsumsi Esensi Niat untuk kartu berisiko
            if (chosenCard.isRisky) {
                const cost = SKILL_TREE_DATA.Inquisitor.active_interrogate.cost || 0;
                if (user.essenceOfWill < cost) {
                    UIManager.showNotification("Tidak cukup Esensi Niat untuk argumen berisiko ini!", 'alert-triangle', 'bg-red-500');
                    return;
                }
                user.essenceOfWill -= cost;
                await updateDocument("saga_worlds", DB_DOC_ID_Instance, {
                    [`wanderers.${user.name}.essenceOfWill`]: user.essenceOfWill
                });
            }

            for (const strength of chosenCard.strengths) {
                const targetRuneIndex = currentBarricadeRunes.findIndex(rune => !rune.isBroken && rune.weaknesses.includes(strength));
                if (targetRuneIndex !== -1) {
                    currentBarricadeRunes[targetRuneIndex].isBroken = true;
                    successAttempt = true;
                    UIManager.showNotification('Perisai mental retak!', 'check', 'bg-emerald-500');
                    // TODO: Putar suara pecah rune
                    break;
                }
            }
        }

        if (!successAttempt) {
            let composurePenalty = 20;
            if (passiveLogicActive && SKILL_TREE_DATA.Inquisitor.passive_logic.penaltyReduction) {
                composurePenalty = Math.floor(composurePenalty * (1 - SKILL_TREE_DATA.Inquisitor.passive_logic.penaltyReduction));
                UIManager.showNotification('Logika Tanpa Celah mengurangi penalti!', 'cpu', 'bg-blue-400');
            }
            currentComposure = Math.max(0, currentComposure - composurePenalty);
            UIManager.showNotification('Argumen tidak efektif! Komposurmu menurun.', 'x-circle', 'bg-red-500');
            // TODO: Tambahkan umpan balik visual/audio untuk kegagalan
        } else if (passiveInsightActive && SKILL_TREE_DATA.Inquisitor.passive_insight.chance && Math.random() < SKILL_TREE_DATA.Inquisitor.passive_insight.chance) {
            // Skill ini biasanya mengungkapkan kelemahan, tetapi karena kita tidak memiliki UI untuk mengungkapkan,
            // kita hanya akan menampilkan notifikasi sebagai placeholder untuk efeknya.
            UIManager.showNotification('Tatapan Tajam: Sebuah kelemahan baru terdeteksi!', 'eye', 'bg-yellow-400');
            // Dalam UI yang lebih kompleks, ini akan menyoroti kelemahan yang belum terungkap pada rune yang belum rusak secara visual
        }

        // Simpan status game saat ini (komposur dan rune yang rusak)
        // Untuk kesederhanaan, kita akan menganggap ini fana untuk minigame dan hanya menyimpan status keseluruhan pengguna
        setCurrentUser(user);
        await saveDBInstance(false); // Simpan potensi perubahan Esensi Niat

        // Render ulang konten modal untuk mencerminkan perubahan
        renderCallback();

        // Periksa kondisi menang/kalah
        if (currentComposure <= 0) {
            UIManager.closeModal(document.getElementById('interrogate-modal')); // Tutup modal interogasi
            UIManager.showNotification(`Interogasi Gagal! Komposurmu hancur di depan ${target.name}.`, 'dizzy', 'bg-red-700');
            user.alignment.echo = Math.min(100, user.alignment.echo + 20); // Penalti Echo
            setCurrentUser(user);
            await saveDBInstance(false);
            // Anda mungkin ingin memicu pembaruan UI lain di wandererFeatures setelah ini
            return;
        }

        if (currentBarricadeRunes.every(rune => rune.isBroken)) {
            UIManager.closeModal(document.getElementById('interrogate-modal')); // Tutup modal interogasi
            const interrogationResult = InterrogateGame.generateInterrogationResult(target.name);
            user.chronicle.push({
                id: Date.now(),
                type: 'interrogation_success',
                title: `Kebenaran Terungkap dari ${target.name}`,
                spoil: interrogationResult.info,
                reflection: `Melalui interogasi, Anda mengungkap: "${interrogationResult.info}"`,
                timestamp: new Date().toISOString(),
                sigil: 'lightbulb'
            });
            setCurrentUser(user);
            await saveDBInstance(false);
            UIManager.showNotification(`Interogasi Berhasil! Rahasia dari ${target.name} terungkap!`, 'check-circle', 'bg-gradient-to-r from-emerald-400 to-green-400');
            // Anda mungkin ingin memicu pembaruan UI lain di wandererFeatures setelah ini
        }
    },

    /**
     * Merender bar komposur pada elemen canvas.
     * @param {CanvasRenderingContext2D} ctx - Konteks rendering 2D dari canvas.
     * @param {number} current - Nilai komposur saat ini.
     * @param {number} max - Nilai komposur maksimum.
     */
    renderComposureBar(ctx, current, max) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const barHeight = height * 0.6;
        const barWidth = width * 0.9;
        const x = (width - barWidth) / 2;
        const y = (height - barHeight) / 2;

        ctx.clearRect(0, 0, width, height);

        // Latar belakang bar
        ctx.fillStyle = 'rgba(71, 85, 105, 0.5)';
        ctx.fillRect(x, y, barWidth, barHeight);

        // Isi bar berdasarkan komposur
        const fillWidth = barWidth * (current / max);
        ctx.fillStyle = `rgba(129, 140, 248, ${current / max + 0.3})`; // Warna berubah dengan level komposur
        ctx.fillRect(x, y, fillWidth, barHeight);

        // Border bar
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);

        // Teks komposur
        ctx.fillStyle = 'white';
        ctx.font = `bold ${height * 0.4}px Cinzel, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Komposur: ${current}/${max}`, width / 2, height / 2);
    },

    /**
     * Menghasilkan teks hasil interogasi secara acak.
     * @param {string} targetName - Nama target yang diinterogasi.
     * @returns {{title: string, info: string}} Objek berisi judul dan informasi hasil.
     */
    generateInterrogationResult(targetName) {
        const results = [
            { title: `Rahasia ${targetName}`, info: `Setelah interogasi intens, ${targetName} mengungkapkan informasi tentang pertemuan rahasia Kaum Bidat di reruntuhan lama.` },
            { title: `Kelemahan ${targetName}`, info: `Anda berhasil menemukan kelemahan mental ${targetName}. Mereka menunjukkan lokasi cache Gema tersembunyi.` },
            { title: `Jejak ${targetName}`, info: `${targetName} mengungkapkan nama anggota Kaum Bidat lain yang Anda cari.` }
        ];
        return results[Math.floor(Math.random() * results.length)];
    },
};
