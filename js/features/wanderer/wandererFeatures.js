// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, [11:21] ==
// == PERIHAL: Implementasi Fase IV - Narasi Dinamis & Sistem Warisan Awal ==
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 17:00 WITA ==
// == PERIHAL: Integrasi Mini-game Merasakan (Spektrum Emosi) ==
// - Memastikan wandererFeatures.js memanggil renderAllWandererComponents dan renderChronicle
//   dari WandererPageRenderer setelah mini-game encounter selesai, bukan dari dirinya sendiri.
// - Memastikan completeWandererMandate memanggil WandererPageRenderer.renderAllWandererComponents dan WandererPageRenderer.renderWandererMandate.
// - Memastikan gainAttributeXp memanggil WandererPageRenderer.renderAttributeXpBars dan WandererPageRenderer.updateWandererRadarChart.
// - Memastikan SKILL_TREE_DATA dan GLOBAL_ATTRIBUTES diimpor di WandererPageRenderer untuk skill tree rendering.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 16:00 WITA ==
// == PERIHAL: Integrasi Mini-game Menantang (Duel Niat) ==
// - Memastikan wandererFeatures.js memanggil renderAllWandererComponents dan renderChronicle
//   dari WandererPageRenderer setelah mini-game encounter selesai, bukan dari dirinya sendiri.
// - Memastikan completeWandererMandate memanggil WandererPageRenderer.renderAllWandererComponents dan WandererPageRenderer.renderWandererMandate.
// - Memastikan gainAttributeXp memanggil WandererPageRenderer.renderAttributeXpBars dan WandererPageRenderer.updateWandererRadarChart.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 15:10 WITA ==
// == PERIHAL: Modul Fitur Pengembara (Refactoring Tahap 3 - Pemisahan Logika Tampilan Halaman Wanderer) ==
// - Memindahkan semua logika rendering dan pengaturan tampilan yang spesifik untuk halaman Wanderer ke `js/features/wanderer/wandererPageRenderer.js`.
// - Mengimpor dan menggunakan modul `wandererPageRenderer.js` sebagai orkestrator tampilan.
// - Menjaga logika inti gameplay (mis. inisialisasi aplikasi, trigger encounter, gain XP, save/load saga) di sini.
// - Bergantung pada UIManager, AuthService, WorldManager, firebaseService, gameData, InterrogateGame, AbsorbEchoGame, dan WandererPageRenderer.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 15:03 WITA ==
// == PERIHAL: Modul Fitur Pengembara (Refactoring Tahap 2 - Pemisahan Mini-game Menyerap Gema) ==
// - Memindahkan semua logika mini-game "Menyerap Gema" ke `js/miniGames/absorbEchoGame.js`.
// - Mengimpor dan menggunakan modul `absorbEchoGame.js` untuk memicu mini-game.
// - Menjaga semua logika lain yang terkait khusus dengan halaman Wanderer.
// - Bergantung pada UIManager, AuthService, WorldManager, firebaseService, gameData, interrogateGame, dan absorbEchoGame.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 14:55 WITA ==
// == PERIHAL: Modul Fitur Pengembara (Refactoring Tahap 1 - Pemisahan Mini-game Menginterogasi) ==
// - Memindahkan semua logika mini-game "Menginterogasi" ke `js/miniGames/interrogateGame.js`.
// - Mengimpor dan menggunakan modul `interrogateGame.js` untuk memicu mini-game.
// - Menjaga semua logika lain yang terkait khusus dengan halaman Wanderer.
// - Bergantung pada UIManager, AuthService, WorldManager, firebaseService, gameData, dan interrogateGame.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 23:06 WITA ==
// == PERIHAL: Implementasi Fase IV - Narasi Dinamis & Sistem Warisan Awal ==
// - Di dalam completeWandererMandate(), menambahkan logika untuk mengecek dan memberikan Poin Legacy terkait Soul Rank.
// - Di dalam gainAttributeXp(), menambahkan placeholder untuk cek Legacy jika kriteria atribut/skill tree ada.
// - Menambahkan fungsi calculateAndApplyLegacy() untuk menghitung dan menyimpan Poin Legacy saat Apoteosis.
// ===========================================

import { UIManager } from '../../uiManager.js'; // Perbaikan jalur
import { getCurrentUser, setCurrentUser, logout } from '../../authService.js'; // Perbaikan jalur
import { updateDocument, setDocument } from '../../firebaseService.js'; // Perbaikan jalur
import { WorldManager } from '../../worldManager.js'; // Perbaikan jalur
import { SKILL_TREE_DATA, GLOBAL_ATTRIBUTES, BIRTH_QUESTIONS, INTERROGATION_DATA, LEGACY_CRITERIA } from '../../gameData.js'; // Import LEGACY_CRITERIA
import { InterrogateGame } from '../../miniGames/interrogateGame.js';
import { AbsorbEchoGame } from '../../miniGames/absorbEchoGame.js';
import { WandererPageRenderer } from './wandererPageRenderer.js';
import { addToWandererChronicle } from '../../chronicleManager.js'; // Import chronicleManager

let dbInstance;
let saveDBInstance;
let destinyClockIntervalInstance;

export const WandererFeatures = {
    /**
     * Mengatur dependensi untuk modul WandererFeatures.
     * @param {object} db - Instans database (dbInstance dari App).
     * @param {function} saveDB - Fungsi untuk menyimpan database.
     * @param {number} destinyClockInterval - Instans interval untuk jam takdir.
     */
    setDependencies(db, saveDB, destinyClockInterval) {
        dbInstance = db;
        saveDBInstance = saveDB;
        destinyClockIntervalInstance = destinyClockInterval;
        // Mengatur dependensi untuk mini-game dan renderer halaman
        InterrogateGame.setDependencies(db, 'soulforgeSaga_v2.0_KitabAgung', saveDB);
        AbsorbEchoGame.setDependencies(db, saveDB);
        WandererPageRenderer.setDependencies(db, saveDB);
    },

    // --- Inisialisasi Halaman Wanderer ---
    initWandererPage() {
        if (!getCurrentUser() || getCurrentUser().role !== 'wanderer') {
            logout();
            return;
        }
        document.getElementById('wanderer-app').style.display = 'flex';
        document.getElementById('logout-button').onclick = () => logout();
        document.getElementById('wanderer-profile-icon').textContent = getCurrentUser().name.charAt(0);

        WandererPageRenderer.renderWandererNav();
        WandererPageRenderer.setupWandererNavEvents();
        WandererPageRenderer.renderWandererPage('character');
        WandererFeatures.startDestinyClock();

        setInterval(() => WandererFeatures.triggerEncounter(), 30000);
    },

    /**
     * Menyelesaikan Mandat Ilahi Wanderer dan memberikan hadiah.
     * Logika ini tetap di sini karena merupakan inti gameplay dan modifikasi data.
     */
    async completeWandererMandate() {
        const user = getCurrentUser();
        const mandate = user.divineMandate;
        if (!mandate || mandate.completed) return;

        mandate.completed = true;
        let xpGranted = mandate.xpReward;

        const resonance = dbInstance.world.currentResonanceStatus;
        if (resonance === 'Harmonious Resonance') {
            xpGranted = Math.floor(xpGranted * 1.15);
            UIManager.showNotification(`Mandate Selesai! Resonansi Dunia meningkatkan hadiahmu!`, 'star', 'bg-gradient-to-r from-teal-400 to-cyan-400');
        } else if (resonance === 'Discordant Resonance') {
            xpGranted = Math.floor(xpGranted * 0.85);
            UIManager.showNotification(`Mandate Selesai! Resonansi Dunia membebani hadiahmu.`, 'alert-triangle', 'bg-orange-400');
        }

        const oldSoulRank = user.soulRank || 0; // Capture old soul rank
        user.xp += xpGranted;
        // Assume soulRank updates automatically based on XP or is calculated elsewhere.
        // For demonstration, let's assume soulRank is part of user object and is updated.
        // If soulRank needs to be derived from XP, that logic would go here.

        setCurrentUser(user);
        await saveDBInstance(true);
        // Memanggil renderer untuk memperbarui UI setelah logika gameplay selesai
        WandererPageRenderer.renderWandererMandate();
        UIManager.showNotification(`Titah telah diselesaikan! Takdirmu bergeser. (+${xpGranted} XP)`, 'check-circle', 'bg-gradient-to-r from-teal-400 to-cyan-400');
        WandererPageRenderer.renderAllWandererComponents('character');
        await WorldManager.updateWorldResonance();

        // --- Legacy System Integration (Soul Rank Milestone) ---
        // Check for Soul Rank milestones after XP gain and potential rank increase
        if (user.soulRank !== oldSoulRank) {
            LEGACY_CRITERIA.forEach(criterion => {
                if (criterion.id.startsWith('soul_rank_milestone_')) {
                    const targetRank = parseInt(criterion.id.replace('soul_rank_milestone_', ''));
                    if (user.soulRank >= targetRank && oldSoulRank < targetRank) {
                        // Ensure legacyPoints exists on user and world.totalLegacyPoints
                        user.legacyPoints = (user.legacyPoints || 0) + criterion.points;
                        dbInstance.world.totalLegacyPoints = (dbInstance.world.totalLegacyPoints || 0) + criterion.points;

                        addToWandererChronicle(user.name, {
                            id: `legacy_milestone_${criterion.id}_${Date.now()}`,
                            type: 'legacy_milestone',
                            title: `Warisan Terukir: ${criterion.description}`,
                            reflection: `Anda telah mencapai peringkat jiwa ${targetRank}, menambahkan ${criterion.points} Poin Legacy ke Warisan Anda.`,
                            timestamp: new Date().toISOString(),
                            sigil: 'award'
                        });
                        UIManager.showNotification(`Warisan Terukir: ${criterion.description}! (+${criterion.points} Poin Legacy)`, 'award', 'bg-gradient-to-r from-purple-500 to-pink-500');
                    }
                }
            });
            setCurrentUser(user);
            await saveDBInstance(true); // Save again to persist legacy points
        }
    },

    /**
     * Memberikan XP atribut kepada Wanderer.
     * Logika ini tetap di sini karena merupakan inti gameplay dan modifikasi data.
     * @param {string} attributeName - Nama atribut.
     * @param {number} amount - Jumlah XP yang akan diberikan.
     * @returns {boolean} True jika atribut naik level, false jika tidak.
     */
    async gainAttributeXp(attributeName, amount) {
        const user = getCurrentUser();
        const attr = user.attributes.find(a => a.name === attributeName);
        if (!attr) {
            console.warn(`Attribute '${attributeName}' not found.`);
            return;
       }

        let actualAmount = amount;
        const resonance = dbInstance.world.currentResonanceStatus;
        if (resonance === 'Harmonious Resonance') {
            actualAmount = Math.floor(actualAmount * 1.1);
        } else if (resonance === 'Discordant Resonance') {
            actualAmount = Math.floor(actualAmount * 0.9);
        }

        const focusBonus = user.focus.attribute === attributeName ? 1.5 : 1;
        attr.xp += Math.floor(actualAmount * focusBonus);

        let leveledUp = false;
        if (attr.xp >= attr.xpToNext) {
            const oldLevel = attr.value;
            attr.value++;
            attr.xp -= attr.xpToNext;
            attr.xpToNext = Math.floor(attr.xpToNext * 1.5);
            UIManager.showNotification(`Attribute Increased: ${attributeName} is now Level ${attr.value}!`, 'chevrons-up', 'bg-gradient-to-r from-emerald-400 to-green-400');
            WandererFeatures.checkForNewImprints(attributeName, attr.value);
            leveledUp = true;

            // --- Legacy System Integration (Attribute/Skill Tree Milestone Placeholder) ---
            // Current LEGACY_CRITERIA in gameData.js does not define points for attribute level-ups or specific skill unlocks directly.
            // If future LEGACY_CRITERIA include entries like:
            // { id: 'attribute_knowledge_level_10', description: 'Mencapai Pengetahuan Level 10.', points: 30 }
            // { id: 'unlocked_imprint_iron_will', description: 'Membuka Imprint Iron Will.', points: 20 }
            // then the logic would go here, similar to the soul rank check.
            // For now, this is a conceptual placeholder.
            // LEGACY_CRITERIA.forEach(criterion => {
            //     // Example: if criterion.id is 'attribute_knowledge_level_X'
            //     if (criterion.id === `attribute_${attributeName.toLowerCase()}_level_${attr.value}`) {
            //         if (!user.achievedLegacyCriteria.includes(criterion.id)) { // Assuming a list to prevent re-awarding
            //             user.legacyPoints = (user.legacyPoints || 0) + criterion.points;
            //             dbInstance.world.totalLegacyPoints = (dbInstance.world.totalLegacyPoints || 0) + criterion.points;
            //             user.achievedLegacyCriteria.push(criterion.id);
            //             addToWandererChronicle(user.name, {
            //                 id: `legacy_attribute_${criterion.id}_${Date.now()}`,
            //                 type: 'legacy_milestone',
            //                 title: `Warisan Terukir: ${criterion.description}`,
            //                 reflection: `Atribut ${attributeName} Anda mencapai Level ${attr.value}, menambahkan ${criterion.points} Poin Legacy.`,
            //                 timestamp: new Date().toISOString(),
            //                 sigil: 'git-branch'
            //             });
            //             UIManager.showNotification(`Warisan Terukir: ${criterion.description}! (+${criterion.points} Poin Legacy)`, 'award', 'bg-gradient-to-r from-purple-500 to-pink-500');
            //         }
            //     }
            // });
        }
        setCurrentUser(user);
        await saveDBInstance(false);
        // Memanggil renderer untuk memperbarui UI setelah logika gameplay selesai
        WandererPageRenderer.renderAttributeXpBars();
        WandererPageRenderer.updateWandererRadarChart();
        return leveledUp;
    },

    /**
     * Memeriksa apakah imprin baru telah dibuka setelah atribut naik level.
     * Logika ini tetap di sini karena merupakan inti gameplay dan modifikasi data.
     * @param {string} attributeName - Nama atribut yang naik level.
     * @param {number} newLevel - Level atribut yang baru.
     */
    checkForNewImprints(attributeName, newLevel) {
        const user = getCurrentUser();
        const skillData = SKILL_TREE_DATA[attributeName];
        if (skillData && skillData[newLevel]) {
            const imprint = skillData[newLevel];
            if (!user.unlockedImprints.includes(imprint.id)) {
                user.unlockedImprints.push(imprint.id);
                UIManager.showNotification(`Soul Imprint Unlocked: ${imprint.name}!`, 'star', 'bg-gradient-to-r from-indigo-500 to-purple-500');
                setCurrentUser(user);
                // No legacy point check here as per current LEGACY_CRITERIA
            }
        }
    },

    /**
     * Memicu encounter (kejadian) untuk Wanderer berdasarkan resonansi dunia dan atribut.
     * Logika ini tetap di sini karena merupakan inti gameplay dan modifikasi data.
     */
    triggerEncounter() {
        if (document.getElementById('overlay-container').innerHTML !== '' || !getCurrentUser() || getCurrentUser().role !== 'wanderer') return;

        const resonance = dbInstance.world.currentResonanceStatus;
        const allWhispers = dbInstance.world.encounters.whispers || [];
        const allGlimmers = dbInstance.world.encounters.glimmers || [];

        let candidates = [];

        if (resonance === 'Harmonious Resonance') {
            candidates = allGlimmers;
        } else if (resonance === 'Discordant Resonance') {
            candidates = allWhispers;
        } else {
            candidates = [...allWhispers, ...allGlimmers];
        }

        if (candidates.length === 0) {
            console.log(`No encounters defined or suitable for ${resonance} resonance.`);
            return;
        }

        const scoredEncounters = [];
        const wanderer = getCurrentUser();

        const totalAlignment = wanderer.alignment.echo + wanderer.alignment.intention;
        const echoRatio = totalAlignment > 0 ? wanderer.alignment.echo / totalAlignment : 0.5;
        const intentionRatio = totalAlignment > 0 ? wanderer.alignment.intention / totalAlignment : 0.5;

        const wandererAttributes = wanderer.attributes.reduce((acc, attr) => {
            acc[attr.name.toLowerCase()] = attr.value;
            return acc;
        }, {});

        candidates.forEach(enc => {
            let score = 0;
            let meetsHardConditions = true;

            if (resonance === 'Harmonious Resonance' && enc.type === 'glimmer') {
                score += 50;
            } else if (resonance === 'Discordant Resonance' && enc.type === 'whisper') {
                score += 50;
            } else if (resonance === 'Balanced Resonance') {
                score += 10;
            } else {
                score -= 20;
            }

            if (enc.conditions) {
                if (enc.conditions.minEchoRatio && echoRatio < enc.conditions.minEchoRatio) meetsHardConditions = false;
                if (enc.conditions.maxEchoRatio && echoRatio > enc.conditions.maxEchoRatio) meetsHardConditions = false;
                if (enc.conditions.minIntentionRatio && intentionRatio < enc.conditions.minIntentionRatio) meetsHardConditions = false;
                if (enc.conditions.maxIntentionRatio && intentionRatio > enc.conditions.maxIntentionRatio) meetsHardConditions = false;

                for (const key in enc.conditions) {
                    const attrName = key.replace(/^(min|max)/, '').toLowerCase();
                    if (GLOBAL_ATTRIBUTES.map(a => a.toLowerCase()).includes(attrName) && wandererAttributes[attrName] !== undefined) {
                        if (key.startsWith('min') && wandererAttributes[attrName] < enc.conditions[key]) meetsHardConditions = false;
                        if (key.startsWith('max') && wandererAttributes[attrName] > enc.conditions[key]) meetsHardConditions = false;
                    }
                    if (key === 'minSoulRank' && wanderer.soulRank < enc.conditions[key]) meetsHardConditions = false;
                    if (key === 'maxSoulRank' && wanderer.soulRank > enc.conditions[key]) meetsHardConditions = false;
                    if (key === 'minConsistencyStreak' && wanderer.consistencyStreak < enc.conditions[key]) meetsHardConditions = false;
                    if (key === 'maxConsistencyStreak' && wanderer.consistencyStreak > enc.conditions[key]) meetsHardConditions = false;
                }
            }

            if (!meetsHardConditions) {
                return;
            }

            if (enc.tags && enc.tags.length > 0) {
                if (echoRatio > 0.6) {
                    if (enc.tags.includes('doubt') || enc.tags.includes('fear') || enc.tags.includes('challenge')) score += 15;
                }
                if (intentionRatio > 0.6) {
                    if (enc.tags.includes('insight') || enc.tags.includes('opportunity') || enc.tags.includes('growth')) score += 15;
                }
                if (wanderer.focus.attribute && enc.tags.includes(wanderer.focus.attribute.toLowerCase())) {
                    score += 10;
                }
                if (wandererAttributes.social > 5 && enc.tags.includes('connection')) score += 5;
            }

            scoredEncounters.push({ encounter: enc, score: score });
        });

        if (scoredEncounters.length === 0) {
            console.log("No encounters match any conditions after filtering and scoring.");
            return;
        }

        scoredEncounters.sort((a, b) => b.score - a.score);

        const topScore = scoredEncounters[0].score;
        const topEncounters = scoredEncounters.filter(e => e.score === topScore);
        let chosenEncounter = topEncounters[Math.floor(Math.random() * topEncounters.length)].encounter;

        if (chosenEncounter.type === 'whisper') {
            document.body.classList.add('encounter-whisper-active');
        } else if (chosenEncounter.type === 'glimmer') {
            document.body.classList.add('encounter-glimmer-active');
        }

        UIManager.showModal(
            chosenEncounter.name,
            chosenEncounter.description,
            chosenEncounter.choices.map(choice => ({
                text: choice.text,
                consequence: async () => {
                    const user = getCurrentUser();
                    if (choice.effect.echo) {
                        user.alignment.echo += choice.effect.echo;
                    }
                    if (choice.effect.intention) {
                        user.alignment.intention += choice.effect.intention;
                    }
                    if (choice.effect.xp) {
                        user.xp += choice.effect.xp;
                        UIManager.showNotification(`+${choice.effect.xp} XP from ${chosenEncounter.name}!`, 'star', 'bg-gradient-to-r from-yellow-400 to-amber-400');
                    }
                    if (choice.effect.stamina_xp) { await WandererFeatures.gainAttributeXp('Stamina', choice.effect.stamina_xp); }
                    if (choice.effect.discipline_xp) { await WandererFeatures.gainAttributeXp('Discipline', choice.effect.discipline_xp); }
                    if (choice.effect.knowledge_xp) { await WandererFeatures.gainAttributeXp('Knowledge', choice.effect.knowledge_xp); }
                    if (choice.effect.social_xp) { await WandererFeatures.gainAttributeXp('Social', choice.effect.social_xp); }
                    if (choice.effect.focus_xp) { await WandererFeatures.gainAttributeXp('Focus', choice.effect.focus_xp); }

                    setCurrentUser(user);
                    await saveDBInstance(false);
                    await WorldManager.updateWorldResonance();
                    // Panggil renderer untuk memperbarui UI
                    WandererPageRenderer.renderAllWandererComponents('character');
                    WandererPageRenderer.renderChronicle();
                    document.body.classList.remove('encounter-whisper-active', 'encounter-glimmer-active');
                }
            }))
        );
        console.log(`Triggered a ${chosenEncounter.type} (${resonance} Resonance, Score: ${topScore}): ${chosenEncounter.name}`);
    },

    /**
     * Memulai jam takdir yang menghitung mundur ke tanggal apoteosis.
     * Logika ini tetap di sini karena terkait dengan alur waktu game inti.
     */
    startDestinyClock() {
        const clockElement = document.getElementById('destiny-clock');
        if (!clockElement || !dbInstance.world.apotheosisDate) return;
        const targetDate = new Date(dbInstance.world.apotheosisDate).getTime();
        destinyClockIntervalInstance = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance < 0) {
                clockElement.innerHTML = "<div>The Final Day has come.</div>";
                clearInterval(destinyClockIntervalInstance);
                // --- Legacy System Integration (Apoteosis Trigger) ---
                // Call calculateAndApplyLegacy when the final day arrives.
                // This is a placeholder for the actual end-game/apotheosis trigger.
                const currentUser = getCurrentUser();
                WandererFeatures.calculateAndApplyLegacy(currentUser);
                return;
            }
            const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365.25));
            const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            clockElement.innerHTML = `
                <div>${String(years).padStart(2, '0')}y : ${String(days).padStart(3, '0')}d</div>
                <div class="text-lg">${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s</div>`;
        }, 1000);
    },

    /**
     * Mengekspor data saga pemain saat ini ke file JSON.
     * Logika ini tetap di sini karena merupakan fungsionalitas inti aplikasi.
     */
    exportSaga() {
        if (!getCurrentUser()) {
            UIManager.showNotification('Tidak ada data jiwa yang bisa diekspor.', 'x-circle', 'bg-red-500');
            return;
        }
        const dataStr = JSON.stringify(getCurrentUser(), null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `soulforge_saga_${getCurrentUser().name.toLowerCase().replace(/\s/g, '_')}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
        UIManager.showNotification('Data Saga berhasil diekspor!', 'download-cloud', 'bg-gradient-to-r from-blue-400 to-purple-400');
    },

    /**
     * Mengimpor data saga dari file JSON yang diunggah.
     * Logika ini tetap di sini karena merupakan fungsionalitas inti aplikasi.
     * @param {File} file - File JSON yang akan diimpor.
     */
    importSaga(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (importedData && typeof importedData.name === 'string' && typeof importedData.mantra === 'string' && importedData.role === 'wanderer' && getCurrentUser().name === importedData.name) {
                    UIManager.showLoading('Memulihkan data Saga...');
                    dbInstance.wanderers[importedData.name] = importedData;
                    setCurrentUser(importedData);
                    await saveDBInstance(false);
                    UIManager.hideLoading();
                    UIManager.showNotification('Data Saga berhasil dipulihkan! Halaman akan dimuat ulang.', 'upload-cloud', 'bg-gradient-to-r from-emerald-400 to-green-400');
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    UIManager.showError(document.getElementById('error-message'), 'File cadangan tidak valid atau bukan milik jiwa ini.');
                    UIManager.showNotification('Gagal impor: File tidak valid atau bukan milik jiwa ini.', 'x-circle', 'bg-red-500');
                }
            } catch (error) {
                console.error("Error importing saga:", error);
                UIManager.showError(document.getElementById('error-message'), 'Gagal membaca file. Pastikan file dalam format JSON yang benar.');
                UIManager.showNotification('Gagal impor: File rusak atau format salah.', 'alert-triangle', 'bg-red-500');
            }
        };
        reader.readAsText(file);
    },

    /**
     * Menghitung dan menerapkan Poin Legacy untuk Wanderer saat Apoteosis (akhir Saga).
     * @param {object} wanderer - Objek Wanderer saat ini.
     */
    async calculateAndApplyLegacy(wanderer) {
        let totalWandererLegacyPoints = 0;
        const achievedCriteria = [];

        // Ensure legacyPoints and achievedLegacyCriteria exist
        wanderer.legacyPoints = wanderer.legacyPoints || 0;
        wanderer.achievedLegacyCriteria = wanderer.achievedLegacyCriteria || [];

        // Ensure dbInstance.world.totalLegacyPoints exists
        dbInstance.world.totalLegacyPoints = dbInstance.world.totalLegacyPoints || 0;

        LEGACY_CRITERIA.forEach(criterion => {
            if (wanderer.achievedLegacyCriteria.includes(criterion.id)) {
                return; // Already awarded, skip
            }

            let criterionMet = false;
            switch (criterion.id) {
                case 'soul_rank_milestone_10':
                case 'soul_rank_milestone_25':
                case 'soul_rank_milestone_50':
                    const targetRank = parseInt(criterion.id.replace('soul_rank_milestone_', ''));
                    if (wanderer.soulRank >= targetRank) {
                        criterionMet = true;
                    }
                    break;
                case 'intention_dominant_apotheosis':
                    const totalAlignment = wanderer.alignment.echo + wanderer.alignment.intention;
                    if (totalAlignment > 0 && (wanderer.alignment.intention / totalAlignment) > 0.70) {
                        criterionMet = true;
                    }
                    break;
                case 'echo_dominant_apotheosis':
                    const totalAlignmentEcho = wanderer.alignment.echo + wanderer.alignment.intention;
                    if (totalAlignmentEcho > 0 && (wanderer.alignment.echo / totalAlignmentEcho) > 0.70) {
                        criterionMet = true;
                    }
                    break;
                case 'rare_artifact_found':
                    // This would ideally check against items obtained during gameplay.
                    // For now, it's a placeholder. Could check wanderer.inventory for specific rare artifacts.
                    // Example: if (wanderer.inventory.some(item => item.rarity === 'legendary')) { criterionMet = true; }
                    // Since it's about *finding*, it should be triggered when artifact is first obtained.
                    // For this end-game calculation, we'll assume a simple check if the ID is somehow marked.
                    if (wanderer.hasFoundRareArtifact) criterionMet = true; // Placeholder property
                    break;
                case 'corrupted_npc_purified':
                    // This would be tracked through specific game events.
                    if (wanderer.purifiedAnyNpc) criterionMet = true; // Placeholder property
                    break;
                case 'nexus_sanctum_maintained':
                case 'nexus_maelstrom_survived':
                    // These would require historical tracking of nexus state over time.
                    // For now, placeholder for end-game check.
                    if (dbInstance.world.centralNexusStatusDuration && dbInstance.world.centralNexusStatusDuration[criterion.id] >= 30) {
                        criterionMet = true;
                    }
                    break;
                case 'all_main_quests_completed':
                    // This would check a quest completion flag.
                    if (wanderer.mainQuestlineCompleted) criterionMet = true; // Placeholder property
                    break;
                case 'regional_war_won':
                    // This would check a war outcome flag.
                    if (dbInstance.world.regionalWarOutcome === 'sentinel_victory') criterionMet = true; // Placeholder
                    break;
                // Add checks for other criteria here
            }

            if (criterionMet) {
                totalWandererLegacyPoints += criterion.points;
                wanderer.achievedLegacyCriteria.push(criterion.id); // Mark as achieved to prevent re-awarding
                addToWandererChronicle(wanderer.name, {
                    id: `legacy_final_summary_${criterion.id}_${Date.now()}`,
                    type: 'legacy_achievement',
                    title: `Warisan Terukir: ${criterion.description}`,
                    reflection: `Pencapaian ini menambah ${criterion.points} Poin Legacy ke Warisan Anda.`,
                    timestamp: new Date().toISOString(),
                    sigil: 'award',
                    spoil: `Legacy earned for: ${criterion.id}` // Spoil for debug
                });
            }
        });

        wanderer.legacyPoints = (wanderer.legacyPoints || 0) + totalWandererLegacyPoints; // Add newly found points
        dbInstance.world.totalLegacyPoints = (dbInstance.world.totalLegacyPoints || 0) + totalWandererLegacyPoints;

        setCurrentUser(wanderer);
        await saveDBInstance(true); // Persist all changes

        UIManager.showNotification(`Apoteosis Selesai! Anda telah mendapatkan ${totalWandererLegacyPoints} Poin Legacy baru. Total Warisan Dunia: ${dbInstance.world.totalLegacyPoints}.`, 'star', 'bg-gradient-to-r from-green-500 to-blue-500');
        console.log(`Wanderer ${wanderer.name} completed Saga with ${wanderer.legacyPoints} Legacy Points. Global Total: ${dbInstance.world.totalLegacyPoints}`);
        // This is where New Game+ or post-game summary would be triggered
    },
};

// Panggil definePageTemplates saat modul dimuat untuk menyiapkan template
WandererPageRenderer.definePageTemplates();