// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-23 13:20 WITA ==
// == PERIHAL: Modul Inti Firebase Service ==
// - Mengisolasi semua inisialisasi Firebase dan fungsi interaksi Firestore.
// - Menyediakan fungsi-fungsi ekspor untuk `firestoreDB`, `getDocument`, `setDocument`, dan `updateDocument`.
// - Memastikan semua dependensi Firebase diimpor dari CDN.
// ===========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc as firestoreUpdateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js'; // Assuming firebase-config.js exists and is correctly configured.

// Inisialisasi Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const firestoreDB = getFirestore(firebaseApp);

/**
 * Mengambil dokumen dari Firestore.
 * @param {string} collectionName - Nama koleksi.
 * @param {string} documentId - ID dokumen.
 * @returns {Promise<DocumentSnapshot>} Snapshot dokumen.
 */
export const getDocument = async (collectionName, documentId) => {
    const docRef = doc(firestoreDB, collectionName, documentId);
    return await getDoc(docRef);
};

/**
 * Menetapkan (set) atau menggabungkan (merge) dokumen ke Firestore.
 * @param {string} collectionName - Nama koleksi.
 * @param {string} documentId - ID dokumen.
 * @param {object} data - Data yang akan diatur.
 * @param {boolean} merge - Jika true, akan menggabungkan data. Default false.
 * @returns {Promise<void>}
 */
export const setDocument = async (collectionName, documentId, data, merge = false) => {
    const docRef = doc(firestoreDB, collectionName, documentId);
    await setDoc(docRef, data, { merge });
};

/**
 * Memperbarui (update) bagian dari dokumen di Firestore.
 * @param {string} collectionName - Nama koleksi.
 * @param {string} documentId - ID dokumen.
 * @param {object} data - Data yang akan diperbarui.
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, documentId, data) => {
    const docRef = doc(firestoreDB, collectionName, documentId);
    await firestoreUpdateDoc(docRef, data);
};