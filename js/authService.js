// js/authService.js
// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-27 01:11 WITA ==
// == PERIHAL: Refactoring Data - Pembaruan Impor Data ==
// - Memperbarui jalur impor untuk SKILL_TREE_DATA, GLOBAL_ATTRIBUTES, BIRTH_QUESTIONS, dan INTERROGATION_DATA
//   dari gameData.js ke js/data/core.js.
// - Memastikan semua fungsionalitas login, registrasi Wanderer baru, dan manajemen sesi tetap bekerja.
// ===========================================
// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-26 08:27 WITA ==
// == PERIHAL: Refactoring WorldManager.js - Pembaruan Dependency Injection ==
// - Memastikan updateWorldResonanceCallback diterima dari WorldManager proxy.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24 01:05 WITA ==
// == PERIHAL: Implementasi Pengayaan "Singular Saga" - Manajemen Sesi ==
// - Memperbarui loginAsForger() dan loginAsWanderer() untuk menyimpan lastActiveSession ke Firestore.
// - Memperbarui checkSession() untuk membandingkan role yang mencoba login dengan lastActiveSession di Firestore.
// - Menambahkan notifikasi jika sesi lain sedang aktif untuk mencegah login bersamaan.
// - Memperbarui logout() untuk mengupdate lastActiveSession di Firestore menjadi null setelah logout.
// - Memastikan semua dependensi dari firebaseService dan UIManager diimpor dan digunakan dengan benar.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 13:40 WITA ==
// == PERIHAL: Modul Inti Authentication Service ==
// - Mengisolasi semua logika yang terkait dengan otentikasi dan sesi pengguna.
// - Menyediakan fungsi-fungsi ekspor untuk `checkSession`, `initLoginPage`,
//   `renderLoginGate`, `handleMantra`, `renderNewWandererFlow`,
//   `handleCreateWandererFinal`, `createNewWanderer`, `loginAsForger`,
//   `loginAsWanderer`, dan `logout`.
// - Bergantung pada UIManager dan firebaseService untuk operasi UI dan database.
// ===========================================

import { UIManager } from './uiManager.js';
import { updateDocument, getDocument } from './firebaseService.js';
// Memperbarui impor data dari gameData.js ke data/core.js
import { SKILL_TREE_DATA, GLOBAL_ATTRIBUTES, BIRTH_QUESTIONS, INTERROGATION_DATA } from './data/core.js';

let dbInstance;
let currentUserInstance;
let forgerMantraInstance;
let destinyClockIntervalInstance;
let updateWorldResonanceCallback;

export const AuthService = {
    setDependencies(db, currentUser, forgerMantra, destinyClockInterval, updateWorldResonance) {
        dbInstance = db;
        currentUserInstance = currentUser;
        forgerMantraInstance = forgerMantra;
        destinyClockIntervalInstance = destinyClockInterval;
        updateWorldResonanceCallback = updateWorldResonance; // Now correctly receives from WorldManager proxy
    },

    async checkSession(currentPage) {
        const sessionUser = sessionStorage.getItem('soulforgeUser');

        const currentSessionDoc = await getDocument("saga_worlds", dbInstance.DB_DOC_ID || 'soulforgeSaga_v2.0_KitabAgung');
        const lastActiveSession = currentSessionDoc.exists() ? currentSessionDoc.data().lastActiveSession : null;

        if (sessionUser) {
            try {
                currentUserInstance = JSON.parse(sessionUser);

                if (lastActiveSession && lastActiveSession.role !== currentUserInstance.role) {
                    UIManager.showNotification("Sesi peran lain sedang aktif. Mohon pastikan peran sebelumnya telah logout.", 'info', 'bg-blue-500');
                    sessionStorage.removeItem('soulforgeUser');
                    if (currentPage !== 'login') {
                        window.location.href = 'index.html';
                    }
                    return;
                }

                if (currentPage === 'login') {
                    const redirectUrl = currentUserInstance.role === 'forger' ? 'forger.html' : 'wanderer.html';
                    window.location.href = redirectUrl;
                }
            } catch(e) {
                console.error("Error parsing session user:", e);
                sessionStorage.removeItem('soulforgeUser');
                if (currentPage !== 'login') window.location.href = 'index.html';
            }
        } else {
            if (lastActiveSession && lastActiveSession.role) {
                 UIManager.showNotification(`Sesi '${lastActiveSession.role}' aktif dari perangkat lain. Silakan login sebagai peran yang benar atau tunggu logout.`, 'info', 'bg-blue-500');
            }
            if (currentPage !== 'login') {
                window.location.href = 'index.html';
            }
        }
    },

    initLoginPage() {
        AuthService.renderLoginGate();
    },

    renderLoginGate() {
        const gateContainer = document.getElementById('gate-container');
        const html = `
            <h1 class="font-serif text-5xl text-white tracking-widest" style="text-shadow: 0 0 15px rgba(129, 140, 248, 0.5);">Gerbang Takdir</h1>
            <p class="text-slate-400 text-lg mb-8">Ucapkan Mantra Jiwamu</p>
            <input type="text" id="mantra-input" class="mantra-input" placeholder="...mantra..." autocomplete="off">
            <p id="error-message" class="error-message h-6 mt-4 text-red-400"></p>
            <button id="gate-button" class="threshold-button">Masuk</button>
        `;
        UIManager.render(gateContainer, html);
        document.getElementById('gate-button').onclick = () => AuthService.handleMantra();
        document.getElementById('mantra-input').onkeyup = (e) => { if (e.key === 'Enter') AuthService.handleMantra(); };
    },

    async handleMantra() {
        const input = document.getElementById('mantra-input');
        const errorEl = document.getElementById('error-message');
        const mantra = input.value.trim().toLowerCase();

        UIManager.clearError(errorEl);

        if (!mantra) {
            UIManager.showError(errorEl, "Keheningan tidak akan membuka gerbang.");
            return;
        }

        const currentSessionDoc = await getDocument("saga_worlds", dbInstance.DB_DOC_ID || 'soulforgeSaga_v2.0_KitabAgung');
        const lastActiveSession = currentSessionDoc.exists() ? currentSessionDoc.data().lastActiveSession : null;

        if (mantra === forgerMantraInstance) {
            if (lastActiveSession && lastActiveSession.role === 'wanderer') {
                 UIManager.showNotification("Sesi Pengembara sedang aktif. Mohon pastikan Pengembara telah logout.", 'info', 'bg-blue-500');
                 return;
            }
            AuthService.loginAsForger();
            return;
        }

        if (mantra === dbInstance.world.submissionMantra) {
            if (lastActiveSession && lastActiveSession.role === 'forger') {
                UIManager.showNotification("Sesi Penempa sedang aktif. Mohon pastikan Penempa telah logout.", 'info', 'bg-blue-500');
                return;
            }
            AuthService.renderNewWandererFlow();
            return;
        }

        const wanderer = Object.values(dbInstance.wanderers).find(w => w.mantra.toLowerCase() === mantra);
        if (wanderer) {
             if (lastActiveSession && lastActiveSession.role === 'forger') {
                UIManager.showNotification("Sesi Penempa sedang aktif. Mohon pastikan Penempa telah logout.", 'info', 'bg-blue-500');
                return;
            }
            AuthService.loginAsWanderer(wanderer.name);
        } else {
            UIManager.showError(errorEl, "Mantra tidak dikenali. Ucapkan dengan benar, atau serahkan dirimu.");
        }
    },

    renderNewWandererFlow() {
        let currentQuestionIndex = 0;
        let tempAlignment = { echo: 50, intention: 50 };
        let tempAttributes = GLOBAL_ATTRIBUTES.reduce((acc, attr) => {
            acc[attr.toLowerCase() + '_xp'] = 0;
            return acc;
        }, {});
        let chosenArchetype = null;

        const gateContainer = document.getElementById('gate-container');

        const showQuestion = (index) => {
            if (index >= BIRTH_QUESTIONS.length) {
                const archetypes = [
                    { id: 'inquisitor', name: 'Sang Inkuisitor', icon: 'search' },
                    { id: 'sentinel', name: 'Sang Penjaga', icon: 'shield' },
                    { id: 'empath', name: 'Sang Empati', icon: 'heart' },
                    { id: 'echo-scribe', name: 'Sang Juru Gema', icon: 'book-open' },
                    { id: 'will-shaper', name: 'Sang Penempa Niat', icon: 'crosshair' },
                    { id: 'nomad', name: 'Sang Pengelana', icon: 'compass' },
                    { id: 'chronicler', name: 'Sang Juru Kronik', icon: 'feather' },
                    { id: 'artisan', name: 'Sang Juru Karya', icon: 'hammer' }
                ];
                let suggestedArchetypeId = archetypes[0].id;
                if (tempAlignment.intention > tempAlignment.echo && tempAttributes.discipline_xp > tempAttributes.stamina_xp) suggestedArchetypeId = 'sentinel';
                else if (tempAlignment.echo > tempAlignment.intention && tempAttributes.knowledge_xp > tempAttributes.focus_xp) suggestedArchetypeId = 'echo-scribe';
                else if (tempAttributes.social_xp > tempAttributes.knowledge_xp && tempAttributes.social_xp > tempAttributes.discipline_xp) suggestedArchetypeId = 'empath';

                const archetypeOptionsHtml = archetypes.map(arch => `
                    <option value="${arch.id}" ${arch.id === suggestedArchetypeId ? 'selected' : ''}>${arch.name}</option>
                `).join('');


                gateContainer.innerHTML = `
                    <h2 class="font-serif text-3xl text-white tracking-widest mb-6 animate-fade-in-up">Penempaan Diri: Pilihlah Jalanmu</h2>
                    <p class="gate-prompt text-slate-300 animate-fade-in-up" style="animation-delay: 0.2s;">Pertanyaan-pertanyaan telah membentuk inti jiwamu. Kini, pilih jalur yang akan kau jelajahi di Tenunan Kosmik.</p>
                    <select id="choose-archetype" class="glass-input animate-fade-in-up" style="animation-delay: 0.3s;">
                        ${archetypeOptionsHtml}
                    </select>

                    <h2 class="font-serif text-3xl text-white tracking-widest mt-8 mb-6 animate-fade-in-up" style="animation-delay: 0.4s;">Nama dan Mantra Abadi</h2>
                    <p class="gate-prompt text-slate-300 animate-fade-in-up" style="animation-delay: 0.5s;">Sebutkan namamu, agar ia terukir abadi dalam Tenunan Kosmik.</p>
                    <input type="text" id="new-name-input" class="mantra-input animate-fade-in-up" placeholder="Nama Abadi..." autocomplete="off" style="animation-delay: 0.6s;">
                    <p class="gate-prompt text-slate-300 mt-6 animate-fade-in-up" style="animation-delay: 0.7s;">Ukir Mantra Pribadimu. Ini akan menjadi kunci abadi jiwamu. Ucapkan dengan hati-hati, karena ia tak dapat diubah oleh siapapun selain dirimu.</p>
                    <input type="password" id="new-mantra-input" class="mantra-input animate-fade-in-up" placeholder="Mantra Pribadi Baru..." autocomplete="off" style="animation-delay: 0.8s;">
                    <p id="error-message" class="error-message h-6 mt-4 text-red-400"></p>
                    <button id="forge-soul-button" class="threshold-button animate-fade-in-up" style="animation-delay: 0.9s;">Tempa Jiwaku</button>
                `;
                document.getElementById('forge-soul-button').onclick = () => {
                    chosenArchetype = document.getElementById('choose-archetype').value;
                    AuthService.handleCreateWandererFinal(tempAlignment, tempAttributes, chosenArchetype);
                };
                return;
            }

            const questionData = BIRTH_QUESTIONS[index];
            const choicesHtml = questionData.choices.map((choice, i) => `
                <button class="glass-button w-full mt-4 choose-birth-path-btn animate-fade-in-up" data-choice-index="${i}" style="animation-delay: ${0.5 + i * 0.1}s;">
                    ${choice.text}
                </button>
            `).join('');

            gateContainer.innerHTML = `
                <h2 class="font-serif text-3xl text-white tracking-widest mb-6 animate-fade-in-up">Penciptaan Jiwa: Bisikan Takdir</h2>
                <p class="text-slate-400 text-lg mb-8 animate-fade-in-up" style="animation-delay: 0.2s;">${questionData.question}</p>
                <div class="space-y-4">
                    ${choicesHtml}
                </div>
                <p id="error-message" class="error-message h-6 mt-4 text-red-400"></p>
            `;

            document.querySelectorAll('.choose-birth-path-btn').forEach(button => {
                button.onclick = (e) => {
                    const choiceIndex = parseInt(e.target.dataset.choiceIndex);
                    const chosenEffect = questionData.choices[choiceIndex].alignmentEffect;

                    tempAlignment.echo += (chosenEffect.echo || 0);
                    tempAlignment.intention += (chosenEffect.intention || 0);
                    GLOBAL_ATTRIBUTES.forEach(attr => {
                        const attrKey = attr.toLowerCase() + '_xp';
                        if (chosenEffect[attrKey]) {
                            tempAttributes[attrKey] += chosenEffect[attrKey];
                        }
                    });

                    currentQuestionIndex++;
                    showQuestion(currentQuestionIndex);
                };
            });
        };

        showQuestion(currentQuestionIndex);
    },

    async handleCreateWandererFinal(initialAlignment, initialAttributes, archetype) {
        const mantraInput = document.getElementById('new-mantra-input');
        const nameInput = document.getElementById('new-name-input');
        const errorEl = document.getElementById('error-message');
        const newMantra = mantraInput.value.trim();
        const newName = nameInput.value.trim();

        UIManager.clearError(errorEl);

        if (!newMantra || !newName) {
            UIManager.showError(errorEl, "Mantra dan Nama Abadi tidak boleh kosong.");
            return;
        }
        if (dbInstance.wanderers[newName]) {
            UIManager.showError(errorEl, `Nama "${newName}" telah terukir. Pilih nama lain.`);
            return;
        }
        if (Object.values(dbInstance.wanderers).some(w => w.mantra === newMantra)) {
            UIManager.showError(errorEl, "Mantra ini telah menjadi kunci jiwa lain.");
            return;
        }

        await AuthService.createNewWanderer(newName, newMantra, initialAlignment, initialAttributes, archetype);
    },

    async createNewWanderer(name, mantra, initialAlignment, initialAttributes, archetype) {
        UIManager.showLoading("Menempa jiwa baru dalam Tenunan Kosmik...");

        const newAttributes = GLOBAL_ATTRIBUTES.map(attrName => {
            const attrKey = attrName.toLowerCase() + '_xp';
            return {
                name: attrName,
                value: 2,
                xp: initialAttributes[attrKey] || 0,
                xpToNext: 100,
                legendaryRank: 0
            };
        });

        dbInstance.wanderers[name] = {
            name: name, mantra: mantra, role: 'wanderer', soulRank: 1, title: "The Awakened",
            archetype: archetype,
            xp: 0, alignment: initialAlignment, consistencyStreak: 0, essenceOfWill: 0,
            status: { id: 'neutral', text: 'Balanced', color: 'text-slate-400' },
            focus: { attribute: null, setOn: null },
            unlockedImprints: [],
            dailyRitual: {
                streak: 0,
                lastRiteDate: null,
                orbs: [
                    { id: 'dawn', name: 'Fajar', ignited: false, window: [4, 7], icon: 'sunrise' },
                    { id: 'noon', name: 'Siang', ignited: false, window: [12, 14], icon: 'sun' },
                    { id: 'afternoon', name: 'Sore', ignited: false, window: [15, 17], icon: 'cloud' },
                    { id: 'dusk', name: 'Senja', ignited: false, window: [18, 19], icon: 'sunset' },
                    { id: 'night', name: 'Malam', ignited: false, window: [20, 22], icon: 'moon' }
                ],
                todaysRite: null
            },
            attributes: newAttributes,
            divineMandate: null,
            legacyBlessings: [
                 { id: 'blessing1', name: 'Resilience Forge', status: 'Dormant', icon: 'zap' },
                 { id: 'blessing2', name: 'Creative Spark', status: 'Dormant', icon: 'pen-tool'},
            ],
            wordsOfPower: [],
            worldMap: {
                size: 10,
                revealedTiles: ['4,4', '4,5', '5,4', '5,5'],
                landmarks: [ { pos: '1,1', name: 'Altar of Self-Truth', wordId: 'word1', discovered: false } ]
            },
            chronicle: [{ id: Date.now(), type: 'genesis', title: 'The Genesis', spoil: 'A New Soul', reflection: `Jiwa ${name} terlahir di Gerbang Takdir.`, timestamp: new Date().toISOString(), sigil: 'compass' }],
            ledger: { transactions: [] },
            currentRegion: 'TheCentralNexus'
        };
        await saveDB(false);
        AuthService.loginAsWanderer(name);
    },

    async loginAsForger() {
        UIManager.showLoading("Membuka Takhta Sang Penempa...");
        currentUserInstance = { role: 'forger' };
        sessionStorage.setItem('soulforgeUser', JSON.stringify(currentUserInstance));

        await updateDocument("saga_worlds", dbInstance.DB_DOC_ID || 'soulforgeSaga_v2.0_KitabAgung', {
            lastActiveSession: {
                role: 'forger',
                timestamp: new Date().toISOString()
            }
        });

        if (updateWorldResonanceCallback) {
            await updateWorldResonanceCallback();
        }

        document.body.classList.add('shatter-screen-active');

        document.body.addEventListener('animationend', () => {
            window.location.href = 'forger.html';
        }, { once: true });

        setTimeout(() => {
            if (document.body.classList.contains('shatter-screen-active')) {
                window.location.href = 'forger.html';
            }
        }, 1500);
    },

    async loginAsWanderer(name) {
        UIManager.showLoading("Membuka Jalan Sang Pengembara...");
        currentUserInstance = dbInstance.wanderers[name];
        if (!currentUserInstance) {
            UIManager.showError(document.getElementById('error-message'), "Pengembara tidak ditemukan.");
            UIManager.hideLoading();
            return;
        }
        sessionStorage.setItem('soulforgeUser', JSON.stringify(currentUserInstance));

        await updateDocument("saga_worlds", dbInstance.DB_DOC_ID || 'soulforgeSaga_v2.0_KitabAgung', {
            lastActiveSession: {
                role: 'wanderer',
                timestamp: new Date().toISOString()
            }
        });

        if (updateWorldResonanceCallback) {
            await updateWorldResonanceCallback();
        }

        document.body.classList.add('shatter-screen-active');

        document.body.addEventListener('animationend', () => {
            window.location.href = 'wanderer.html';
        }, { once: true });

        setTimeout(() => {
            if (document.body.classList.contains('shatter-screen-active')) {
                window.location.href = 'wanderer.html';
            }
        }, 1500);
    },

    async logout() {
        sessionStorage.removeItem('soulforgeUser');
        if (destinyClockIntervalInstance) clearInterval(destinyClockIntervalInstance);

        await updateDocument("saga_worlds", dbInstance.DB_DOC_ID || 'soulforgeSaga_v2.0_KitabAgung', {
            lastActiveSession: null
        });

        window.location.href = 'index.html';
    }
};

let saveDB;
export function setSaveDB(func) {
    saveDB = func;
}

export function getCurrentUser() {
    return currentUserInstance;
}

export function setCurrentUser(user) {
    currentUserInstance = user;
}