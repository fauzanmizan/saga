// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 14:55 WITA ==
// == PERIHAL: Modul Mini-game Menginterogasi ==
// - Mengisolasi semua logika yang terkait khusus dengan mini-game "Menginterogasi" (Barikade Mental).
// - Menyediakan fungsi utama `triggerInterrogateMiniGame` dan fungsi-fungsi pembantu internalnya.
// - Bergantung pada UIManager, getCurrentUser, updateDocument, firebaseService, dan gameData.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-27, 19:00 WITA ==
// == PERIHAL: Perbaikan Jalur Impor dan Konsistensi Variabel ==
// - Memperbarui jalur impor untuk SKILL_TREE_DATA, GLOBAL_ATTRIBUTES, INTERROGATION_DATA dari core.js.
// - Mengganti variabel lokal `dbInstance`, `saveDBInstance`, `DB_DOC_ID_Instance` dengan `dbInstanceRef`, `saveDBInstanceRef` yang sudah digunakan secara global di modul lain.
// - Menambahkan `UIManagerRef` dan `WandererPageRendererRef` ke setDependencies untuk konsistensi.
// ===========================================

import { UIManager } from '../uiManager.js';
import { getCurrentUser, setCurrentUser } from '../authService.js';
import { updateDocument } from '../firebaseService.js';
// PERBAIKI JALUR IMPOR INI:
import { SKILL_TREE_DATA, GLOBAL_ATTRIBUTES, INTERROGATION_DATA } from '../data/core.js'; //

// Gunakan nama variabel yang konsisten dengan modul lain
let dbInstanceRef;
let saveDBInstanceRef;
let UIManagerRef; // Tambahkan ini
let WorldManagerRef; // Tambahkan ini jika dibutuhkan, dari App.js
let WandererPageRendererRef; // Tambahkan ini

export const InterrogateGame = {
    /**
     * Mengatur dependensi untuk modul InterrogateGame.
     * @param {object} db - Instans database (dbInstance dari App).
     * @param {string} DB_DOC_ID - ID dokumen database utama (tidak lagi digunakan secara langsung di sini, diasumsikan dikelola di App.js).
     * @param {function} saveDB - Fungsi untuk menyimpan database.
     * @param {object} uiM - Instans UIManager.
     * @param {object} worldM - Instans WorldManager.
     * @param {object} renderer - Referensi ke WandererPageRenderer.
     */
    setDependencies(db, DB_DOC_ID, saveDB, uiM, worldM, renderer) { // Sesuaikan parameter
        dbInstanceRef = db;
        // DB_DOC_ID_Instance tidak lagi dibutuhkan sebagai variabel terpisah di sini,
        // karena updateDocument tidak memanfaatkannya secara langsung di dalam mini-game ini.
        saveDBInstanceRef = saveDB;
        UIManagerRef = uiM;
        WorldManagerRef = worldM;
        WandererPageRendererRef = renderer;
    },

    /**
     * Memulai mini-game interogasi. Menampilkan modal dan mengelola logika game.
     * @param {object} npcTarget - Objek NPC yang akan diinterogasi (bisa juga string dummy).
     */
    async triggerInterrogateMiniGame(npcTarget) {
        const interrogateModal = document.getElementById('interrogate-modal');
        if (!interrogateModal) {
            console.error("Interrogate modal HTML not found.");
            UIManagerRef.showNotification("Kesalahan sistem: Modal interogasi tidak ditemukan.", 'x-circle', 'bg-red-500'); // Gunakan UIManagerRef
            return;
        }

        if (getCurrentUser().role !== 'wanderer' || getCurrentUser().archetype !== 'inquisitor') {
            UIManagerRef.showNotification("Hanya Sang Inkuisitor yang dapat Menginterogasi.", 'info', 'bg-blue-500'); // Gunakan UIManagerRef
            return;
        }

        const target = {
            name: typeof npcTarget === 'string' ? npcTarget : npcTarget.name,
            secretWeaknesses: ['fear', 'denial', 'ignorance', 'arrogance', 'guilt', 'pride'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2)
        };
        let currentBarricadeRunes = target.secretWeaknesses.map(weaknessId => {
            const runeData = INTERROGATION_DATA.runes.find(r => r.weaknesses.includes(weaknessId)) || { id: `default_${weaknessId}`, name: weaknessId.charAt(0).toUpperCase() + weaknessId.slice(1), icon: 'circle', weaknesses: [weaknessId] }; //
            return { ...runeData, isBroken: false };
        });
        let currentComposure = INTERROGATION_DATA.playerComposureMax; //
        const playerComposureMax = INTERROGATION_DATA.playerComposureMax; //

        const user = getCurrentUser();
        const inqKnowledge = user.attributes.find(a => a.name === 'Knowledge').value;
        const inqFocus = user.attributes.find(a => a.name === 'Focus').value;
        const passiveInsightActive = inqKnowledge >= (SKILL_TREE_DATA.Inquisitor.passive_insight?.level || Infinity); //
        const passiveLogicActive = inqKnowledge >= (SKILL_TREE_DATA.Inquisitor.passive_logic?.level || Infinity); //
        const activeRevelationActive = inqFocus >= (SKILL_TREE_DATA.Inquisitor.active_revelation?.level || Infinity); //
        const revelationSkillData = SKILL_TREE_DATA.Inquisitor.active_revelation; //


        const renderInterrogationModalContent = () => {
            document.getElementById('interrogate-modal-title').textContent = `Menginterogasi ${target.name}`;
            document.getElementById('interrogate-modal-description').textContent = "Barikade mental lawan harus dipecahkan.";

            const mentalBarricadeDisplay = document.getElementById('mental-barricade-display');
            const currentRuneHtml = currentBarricadeRunes.map((rune, i) => `
                <div class="interrogate-rune ${rune.isBroken ? 'broken' : ''}" data-rune-id="${rune.id}" data-weakness="${rune.weaknesses[0]}">
                    <i data-feather="${rune.icon}" class="w-8 h-8 ${rune.isBroken ? 'text-slate-600' : 'text-slate-300'}"></i>
                    <p class="text-sm text-slate-400 mt-1">${rune.name}</p>
                </div>
            `).join('');
            mentalBarricadeDisplay.innerHTML = currentRuneHtml;

            const argumentCardsContainer = document.getElementById('argument-cards-container');
            const argumentCardsHtml = INTERROGATION_DATA.argumentCards.map(card => { //
                const hasEffectiveStrength = currentBarricadeRunes.some(rune => !rune.isBroken && card.strengths.some(s => rune.weaknesses.includes(s)));
                const isUsable = (user.essenceOfWill >= (card.isRisky ? (SKILL_TREE_DATA.Inquisitor.active_interrogate.cost || 0) : 0)); //
                const buttonClass = card.isRisky ? 'glass-button bg-red-700 hover:bg-red-600' : 'glass-button';

                const isDisabled = !isUsable || !hasEffectiveStrength;

                return `
                    <button class="${buttonClass} interro-card-btn ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                            data-card-id="${card.id}" data-strength="${card.strengths[0]}" ${isDisabled ? 'disabled' : ''}>
                        <i data-feather="${card.icon}" class="w-4 h-4 mr-2"></i> ${card.text}
                    </button>
                `;
            }).join('');
            const revelationButtonHtml = activeRevelationActive ? `
                <button class="glass-button primary-button interro-card-btn revelation-skill-btn" data-card-id="revelation_skill_button" style="background: linear-gradient(135deg, #a78bfa, #c084fc);"><i data-feather="${revelationSkillData.icon}" class="w-4 h-4 mr-2"></i> ${revelationSkillData.name}</button>
            ` : ''; //

            argumentCardsContainer.innerHTML = argumentCardsHtml + revelationButtonHtml;

            feather.replace();

            const canvas = document.getElementById('interrogate-composure-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                InterrogateGame.renderComposureBar(ctx, currentComposure, playerComposureMax);
            }

            document.querySelectorAll('#argument-cards-container .interro-card-btn').forEach(button => {
                if (!button.disabled) {
                    button.onclick = (e) => InterrogateGame.handleInterrogationAction(e.target.dataset.cardId, target, currentBarricadeRunes, currentComposure, playerComposureMax, renderInterrogationModalContent, passiveInsightActive, passiveLogicActive, activeRevelationActive, revelationSkillData);
                }
            });
            document.getElementById('interrogate-close-btn').onclick = () => {
                interrogateModal.style.display = 'none';
            };

            interrogateModal.style.display = 'flex';
            setTimeout(() => {
                interrogateModal.style.opacity = 1;
                interrogateModal.querySelector('.modal-content').style.opacity = 1;
                interrogateModal.querySelector('.modal-content').style.transform = 'scale(1)';
            }, 10);
        };

        renderInterrogationModalContent();
    },

    async handleInterrogationAction(cardId, target, currentBarricadeRunes, currentComposure, playerComposureMax, renderCallback, passiveInsightActive, passiveLogicActive, activeRevelationActive, revelationSkillData) {
        let successAttempt = false;
        const user = getCurrentUser();

        if (cardId === 'revelation_skill_button') {
            if (activeRevelationActive) {
                if (user.essenceOfWill < (revelationSkillData.cost || 0)) {
                    UIManagerRef.showNotification("Tidak cukup Esensi Niat untuk skill ini!", 'alert-triangle', 'bg-red-500'); // Gunakan UIManagerRef
                    return;
                }
                user.essenceOfWill -= (revelationSkillData.cost || 0);

                let runesBrokenCount = 0;
                for (let i = 0; i < currentBarricadeRunes.length; i++) {
                    if (!currentBarricadeRunes[i].isBroken) {
                        currentBarricadeRunes[i].isBroken = true;
                        runesBrokenCount++;
                        if (runesBrokenCount >= (revelationSkillData.runeBreakCount || 1)) break;
                    }
                }
                UIManagerRef.showNotification(`${revelationSkillData.name}: Perisai hancur di bawah beban kebenaran!`, 'zap', 'bg-purple-500'); // Gunakan UIManagerRef
                successAttempt = true;
            } else {
                UIManagerRef.showNotification("Anda belum menguasai Penghakiman Terakhir.", 'info', 'bg-blue-500'); // Gunakan UIManagerRef
                return;
            }
        } else {
            const chosenCard = INTERROGATION_DATA.argumentCards.find(c => c.id === cardId); //
            if (!chosenCard) return;

            if (chosenCard.isRisky) {
                const cost = SKILL_TREE_DATA.Inquisitor.active_interrogate.cost || 0; //
                if (user.essenceOfWill < cost) {
                    UIManagerRef.showNotification("Tidak cukup Esensi Niat untuk argumen berisiko ini!", 'alert-triangle', 'bg-red-500'); // Gunakan UIManagerRef
                    return;
                }
                user.essenceOfWill -= cost;
                // updateDocument tidak perlu DB_DOC_ID_Instance jika currentUser sudah updated.
                // updateDocument("saga_worlds", DB_DOC_ID_Instance, { [`wanderers.${user.name}.essenceOfWill`]: user.essenceOfWill });
            }

            for (const strength of chosenCard.strengths) {
                const targetRuneIndex = currentBarricadeRunes.findIndex(rune => !rune.isBroken && rune.weaknesses.includes(strength));
                if (targetRuneIndex !== -1) {
                    currentBarricadeRunes[targetRuneIndex].isBroken = true;
                    successAttempt = true;
                    UIManagerRef.showNotification('Perisai mental retak!', 'check', 'bg-emerald-500'); // Gunakan UIManagerRef
                    break;
                }
            }
        }

        if (!successAttempt) {
            let composurePenalty = 20;
            if (passiveLogicActive && SKILL_TREE_DATA.Inquisitor.passive_logic.penaltyReduction) { //
                composurePenalty = Math.floor(composurePenalty * (1 - SKILL_TREE_DATA.Inquisitor.passive_logic.penaltyReduction)); //
                UIManagerRef.showNotification('Logika Tanpa Celah mengurangi penalti!', 'cpu', 'bg-blue-400'); // Gunakan UIManagerRef
            }
            currentComposure = Math.max(0, currentComposure - composurePenalty);
            UIManagerRef.showNotification('Argumen tidak efektif! Komposurmu menurun.', 'x-circle', 'bg-red-500'); // Gunakan UIManagerRef
        } else if (passiveInsightActive && SKILL_TREE_DATA.Inquisitor.passive_insight.chance && Math.random() < SKILL_TREE_DATA.Inquisitor.passive_insight.chance) { //
            UIManagerRef.showNotification('Tatapan Tajam: Sebuah kelemahan baru terdeteksi!', 'eye', 'bg-yellow-400'); // Gunakan UIManagerRef
        }

        setCurrentUser(user);
        await saveDBInstanceRef(false);

        renderCallback();

        if (currentComposure <= 0) {
            UIManagerRef.closeModal(document.getElementById('interrogate-modal')); // Gunakan UIManagerRef
            UIManagerRef.showNotification(`Interogasi Gagal! Komposurmu hancur di depan ${target.name}.`, 'dizzy', 'bg-red-700'); // Gunakan UIManagerRef
            user.alignment.echo = Math.min(100, user.alignment.echo + 20);
            setCurrentUser(user);
            await saveDBInstanceRef(false);
            if (WandererPageRendererRef && WandererPageRendererRef.renderPlayerStatus) { // Jika ada referensi ke renderer
                 WandererPageRendererRef.renderPlayerStatus();
            }
            return;
        }

        if (currentBarricadeRunes.every(rune => rune.isBroken)) {
            UIManagerRef.closeModal(document.getElementById('interrogate-modal')); // Gunakan UIManagerRef
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
            await saveDBInstanceRef(false);
            UIManagerRef.showNotification(`Interogasi Berhasil! Rahasia dari ${target.name} terungkap!`, 'check-circle', 'bg-gradient-to-r from-emerald-400 to-green-400'); // Gunakan UIManagerRef
            if (WandererPageRendererRef && WandererPageRendererRef.renderPlayerStatus) { // Jika ada referensi ke renderer
                WandererPageRendererRef.renderPlayerStatus();
                WandererPageRendererRef.renderChronicle(); // Perbarui kronik
            }
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

        ctx.fillStyle = 'rgba(71, 85, 105, 0.5)';
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = `rgba(129, 140, 248, ${current / max + 0.3})`;
        ctx.fillRect(x, y, fillWidth, barHeight);

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);

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