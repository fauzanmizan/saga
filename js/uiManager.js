// js/uiManager.js
// == MODIFIED BY: Tim 3.D ==
// == TANGGAL: 2025-06-24, 21:42 ==
// == PERIHAL: Implementasi Fase III - Notifikasi & Logging Detail ==
// - Menambahkan fungsi setDependencies untuk menerima dbInstance dan DB_DOC_ID_Instance.
// - Memperkaya showNotification dengan parameter duration dan loggable.
// - Mengimplementasikan fungsi internal _addLogEntry untuk log historis persisten.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 20:16 ==
// == PERIHAL: Implementasi Fase III - Misi NPC Generik (Fetch/Delivery) ==
// - Memperbarui `showModal()` untuk menerima `consequence` sebagai fungsi langsung di objek `choices`.
// - Menyesuaikan penanganan klik tombol modal untuk mengeksekusi `consequence()`.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 19:40 ==
// == PERIHAL: Implementasi Fase III - Interaksi NPC Mendalam (Sistem Dialog/Pilihan Cabang Sederhana) ==
// - Memastikan fungsi `showModal()` dapat menerima array objek `choices` dengan properti `consequence` yang dapat menjadi fungsi.
// - Menyesuaikan penanganan `onClick` untuk tombol modal agar memanggil `consequence()` yang sesuai.
// - Memperbarui `closeModal()` untuk memastikan callback dieksekusi dengan benar.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 13:20 WITA ==
// == PERIHAL: Modul Inti UI Manager ==
// - Mengisolasi semua fungsionalitas manajemen antarmuka pengguna.
// - Menyediakan objek `UIManager` dengan metode untuk menampilkan/menyembunyikan loading,
//   merender HTML, menampilkan/membersihkan pesan error, menampilkan notifikasi,
//   dan mengelola modal dinamis.
// ===========================================

let dbInstance; // Akan diatur oleh App.init()
let DB_DOC_ID_Instance; // Akan diatur oleh App.init()

export const UIManager = {
    /**
     * Mengatur dependensi untuk modul UIManager.
     * @param {object} db - Instans database (dbInstance dari App).
     * @param {string} DB_DOC_ID - ID dokumen database utama.
     */
    setDependencies(db, DB_DOC_ID) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
    },

    showLoading(message = "Menempa Realitas...") {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingText = document.getElementById('loading-text');
        if (loadingText) loadingText.textContent = message;
        if (loadingScreen) loadingScreen.classList.add('visible');
    },
    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.remove('visible');
    },
    render(container, html) {
        if (container) container.innerHTML = html;
        // Menggunakan lucide.createIcons() jika tersedia, jika tidak, fallback ke feather.replace()
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        } else if (typeof feather !== 'undefined' && feather.replace) {
            feather.replace(); 
        }
    },
    showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.opacity = 1;
        }
    },
    clearError(element) {
        if (element) {
            element.textContent = '';
            element.style.opacity = 0;
        }
    },
    /**
     * Menampilkan notifikasi singkat dan mencatatnya ke log jika loggable.
     * @param {string} text - Pesan notifikasi.
     * @param {string} icon - Ikon untuk notifikasi (feather/lucide icon name).
     * @param {string} colorClass - Kelas CSS untuk warna latar belakang notifikasi.
     * @param {number} [duration=4000] - Durasi tampilan notifikasi dalam milidetik.
     * @param {boolean} [loggable=true] - Apakah notifikasi ini harus dicatat ke log historis.
     */
    showNotification(text, icon = 'award', colorClass = 'bg-gradient-to-r from-yellow-400 to-amber-400', duration = 4000, loggable = true) {
        const banner = document.getElementById('notification-banner');
        const bannerText = document.getElementById('notification-text');
        const bannerIcon = document.getElementById('notification-icon');
        if(!banner || !bannerText || !bannerIcon) return;

        banner.className = `fixed top-0 left-0 right-0 p-4 text-slate-900 font-bold text-center z-50 shadow-lg opacity-0 ${colorClass} animate-fade-in-down`;
        bannerIcon.setAttribute('data-feather', icon);
        // Menggunakan lucide.createIcons() jika tersedia, jika tidak, fallback ke feather.replace()
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        } else if (typeof feather !== 'undefined' && feather.replace) {
            feather.replace(); 
        }

        bannerText.textContent = text;
        banner.classList.add('show');
        banner.style.opacity = 1;

        // Catat ke log historis jika loggable
        if (loggable) {
            UIManager._addLogEntry({
                id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                timestamp: new Date().toISOString(),
                type: 'notification',
                icon: icon,
                title: text, // Untuk log, judul adalah teks notifikasi
                description: text,
                colorClass: colorClass
            });
        }

        setTimeout(() => {
            banner.classList.remove('show');
            banner.style.opacity = 0;
        }, duration);
    },
     showModal(title, text, choices = []) {
        // Map choices to buttons. The 'consequence' should be passed as the handler.
        const choiceButtons = choices.map((c, i) => `
            <button class="modal-choice-btn glass-button px-6 py-3 font-semibold rounded-lg ${c.isPrimary ? 'primary-button' : ''}" data-index="${i}">
                ${c.text}
            </button>
        `).join('') || `<button class="modal-choice-btn glass-button px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg" data-index="0">Acknowledge</button>`;
        
        const overlayContainer = document.getElementById('overlay-container');
        
        const modalHTML = `
            <div id="dynamic-modal" class="modal-overlay fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-8 opacity-0">
                <div class="modal-content glass-card w-full max-w-2xl p-10 rounded-2xl shadow-2xl border border-border-color transform scale-95 opacity-0 animate-scale-in">
                    <h2 class="text-3xl font-serif text-center text-white tracking-wider">${title}</h2>
                    <p class="text-center text-slate-400 mt-4 text-lg leading-relaxed">${text}</p>
                    <div id="choices-list" class="mt-8 flex justify-end space-x-4">${choiceButtons}</div>
                </div>
            </div>`;
        
        overlayContainer.innerHTML = modalHTML;
        const modal = document.getElementById('dynamic-modal');
        const modalContent = modal.querySelector('.modal-content');

        modal.querySelectorAll('.modal-choice-btn').forEach(btn => {
            btn.onclick = () => {
                const choice = choices[parseInt(btn.dataset.index)];
                if(choice && typeof choice.consequence === 'function') {
                    choice.consequence(); // Execute the consequence function
                }
                // The dialogue logic (npcInteraction.js) is responsible for closing the modal
                // if the consequence leads to ending the dialogue.
                // If this is a generic modal (no choices, or Acknowledge), close it here.
                if (choices.length === 0 || (choices.length > 0 && btn.dataset.index === "0" && choices[0].text === "Acknowledge")) {
                    UIManager.closeModal(modal);
                }
            };
        });
        
        // If there are no choices (e.g., just info modal), allow clicking anywhere to close, or add an explicit close button.
        // For general usage, the logic calling UIManager.showModal should ensure there's a way to close.
        if (choices.length === 0) { // If it's a simple alert modal
            modal.addEventListener('click', () => UIManager.closeModal(modal), {once: true}); // Click anywhere to close
        }


        setTimeout(() => { modal.style.opacity = 1; modalContent.style.opacity = 1; modalContent.style.transform = 'scale(1)'; }, 10);
    },

    closeModal(modal, callback = () => {}) {
        const overlayContainer = document.getElementById('overlay-container');
        if(!modal) { // If modal is not provided, try to find the dynamic one
            modal = document.getElementById('dynamic-modal');
            if (!modal) return;
        }

        const modalContent = modal.querySelector('.modal-content');
        modal.style.opacity = 0;
        if(modalContent) modalContent.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if(overlayContainer) overlayContainer.innerHTML = '';
            callback();
        }, 300);
    },

    /**
     * Menambahkan entri ke log peristiwa historis.
     * Ini akan menjadi log persisten yang dapat dilihat pemain.
     * @param {object} entry - Objek entri log: { id, timestamp, type, icon, title, description, [colorClass] }.
     */
    _addLogEntry(entry) {
        if (!dbInstance || !dbInstance.world) {
            console.warn("UIManager: dbInstance or dbInstance.world not available to add log entry.");
            return;
        }
        if (!dbInstance.world.notificationLog) {
            dbInstance.world.notificationLog = [];
        }

        dbInstance.world.notificationLog.push(entry);

        // Batasi jumlah entri log untuk mencegah pertumbuhan yang tak terbatas
        const MAX_LOG_ENTRIES = 100;
        if (dbInstance.world.notificationLog.length > MAX_LOG_ENTRIES) {
            dbInstance.world.notificationLog.splice(0, dbInstance.world.notificationLog.length - MAX_LOG_ENTRIES);
        }

        // Tidak perlu menyimpan ke DB di sini; App.saveDB() akan dipanggil secara periodik
        // atau setelah aksi besar, yang akan mencakup dbInstance.world.notificationLog.
    },
};
