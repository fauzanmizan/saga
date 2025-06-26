// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 17:40 ==
// == PERIHAL: Mock file untuk chronicleManager.js ==
// - Menyediakan fungsi mock untuk menambahkan entri kronik ke Wanderer.
// ===========================================
import { updateDocument } from './firebaseService.js'; // Assuming firebaseService is available

let dbInstance; // Akan diatur oleh App.init() di main.js
let DB_DOC_ID_Instance;

export const chronicleManager = {
    setDependencies(db, DB_DOC_ID) {
        dbInstance = db;
        DB_DOC_ID_Instance = DB_DOC_ID;
    },

    async addToWandererChronicle(wanderer, entry) {
        if (!wanderer.chronicle) {
            wanderer.chronicle = [];
        }
        wanderer.chronicle.push(entry);
        console.log(`[ChronicleManager] Added to ${wanderer.name}'s chronicle: ${entry.title}`);
        
        // Save to Firestore
        await updateDocument("saga_worlds", DB_DOC_ID_Instance, { [`wanderers.${wanderer.name}.chronicle`]: wanderer.chronicle });
    }
};

export const addToWandererChronicle = chronicleManager.addToWandererChronicle;