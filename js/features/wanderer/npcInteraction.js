// js/features/wanderer/npcInteraction.js
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 20:16 ==
// == PERIHAL: Implementasi Fase III - Misi NPC Generik (Fetch/Delivery) ==
// - Menambahkan import QuestManager.
// - Memanggil QuestManager.offerGenericQuest() saat triggerQuestId terpicu.
// ===========================================
// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 19:40 ==
// == PERIHAL: Implementasi Fase III - Interaksi NPC Mendalam (Sistem Dialog/Pilihan Cabang Sederhana) ==
// - Membuat modul baru untuk mengelola alur dialog NPC.
// - Mengimplementasikan fungsi triggerNpcDialogue untuk memulai dialog.
// - Mengimplementasikan fungsi evaluateConditions untuk memeriksa kondisi dialog/pilihan.
// - Mengimplementasikan fungsi handleDialogChoice untuk memproses konsekuensi pilihan.
// ===========================================

import { NPC_DIALOGUES, NPC_REPUTATION_LEVELS, NPC_PERSONALITY_TRAITS, NPC_HEALTH_STATES, NEXUS_STATES, TRADABLE_ITEMS_DATA } from '../../gameData.js';
import { addToWandererChronicle } from '../../chronicleManager.js'; // Import dari chronicleManager
import { updateDocument } from '../../firebaseService.js'; // Perlu untuk persistency NPC state change
import { offerGenericQuest, checkQuestCompletion } from './questManager.js'; // Import offerGenericQuest from QuestManager

let dbInstance;
let UIManager;
let WorldManager;
let WandererPageRenderer;
let gameTime;
let addToWandererChronicleFunc; // Menggunakan nama yang berbeda untuk menghindari konflik dengan import

let currentNpcDialogueTarget = null;
let currentDialogueState = {}; // Menyimpan state internal dialog, bisa untuk placeholder dinamis

/**
 * Inisialisasi modul NpcInteraction dengan dependensi yang diperlukan.
 * @param {object} dbI - Instans database (dbInstance dari App).
 * @param {object} uiM - Instans UIManager.
 * @param {object} worldM - Instans WorldManager.
 * @param {object} wandererPR - Instans WandererPageRenderer.
 * @param {object} gt - Instans gameTime dari utils.
 * @param {Function} atwcf - Fungsi addToWandererChronicle dari chronicleManager.
 */
export const initializeNpcInteraction = (dbI, uiM, worldM, wandererPR, gt, atwcf) => {
    dbInstance = dbI;
    UIManager = uiM;
    WorldManager = worldM;
    WandererPageRenderer = wandererPR;
    gameTime = gt;
    addToWandererChronicleFunc = atwcf;
    dbInstance.currentNpcDialogueTarget = currentNpcDialogueTarget; // Make it accessible globally
};

/**
 * Mengevaluasi kondisi suatu node atau pilihan dialog.
 * @param {import('../../gameData.js').DialogueChoiceConditions} conditions - Objek kondisi.
 * @param {object} npc - Objek NPC saat ini.
 * @param {object} wanderer - Objek Wanderer.
 * @param {object} world - Objek dunia.
 * @returns {boolean} True jika semua kondisi terpenuhi.
 */
function evaluateConditions(conditions, npc, wanderer, world) {
    if (!conditions) return true;

    const npcRep = npc.reputation || 0; // Get NPC's actual reputation score
    const npcRepLevel = NPC_REPUTATION_LEVELS.find(level => npcRep >= level.threshold) || NPC_REPUTATION_LEVELS[6]; // Default to Neutral if not found

    const region = world.regions[npc.currentRegion];

    if (conditions.minReputation !== undefined && npcRep < conditions.minReputation) return false;
    if (conditions.maxReputation !== undefined && npcRep > conditions.maxReputation) return false;

    if (conditions.requiredNpcTrait && (!npc.personalityTraits || !npc.personalityTraits.includes(conditions.requiredNpcTrait))) return false;
    if (conditions.forbiddenNpcTrait && (npc.personalityTraits && npc.personalityTraits.includes(conditions.forbiddenNpcTrait))) return false;

    if (conditions.requiredNpcHealthState && npc.healthState !== conditions.requiredNpcHealthState) return false;
    if (conditions.forbiddenNpcHealthState && npc.healthState === conditions.forbiddenNpcHealthState) return false;

    if (conditions.requiredWandererTrait && (!wanderer.personalityTraits || !wanderer.personalityTraits.includes(conditions.requiredWandererTrait))) return false;
    if (conditions.forbiddenWandererTrait && (wanderer.personalityTraits && wanderer.personalityTraits.includes(conditions.forbiddenWandererTrait))) return false;

    if (conditions.requiredItem) {
        if (!wanderer.inventory || !wanderer.inventory.some(item => item.id === conditions.requiredItem)) {
            return false;
        }
    }

    if (conditions.isQuestActive !== undefined && conditions.isQuestActive.questId) {
        // Placeholder for quest active/status check
        // Assuming wanderer.activeQuests or similar exists
        const questStatus = (wanderer.quests && wanderer.quests[conditions.isQuestActive.questId]) ? true : false;
        if (questStatus !== conditions.isQuestActive.status) return false;
        // console.warn("[TODO] evaluateConditions: isQuestActive not fully implemented.");
    }

    if (conditions.hasNpcState !== undefined) {
        for (const key in conditions.hasNpcState) {
            if (npc[key] !== conditions.hasNpcState[key]) return false;
        }
    }

    if (conditions.isDayTime !== undefined) {
        const currentHour = gameTime.getCurrentDate().getHours();
        const isDay = currentHour >= 6 && currentHour < 18;
        if (isDay !== conditions.isDayTime) return false;
    }

    if (conditions.nexusStateIs && (!region || region.status.toLowerCase() !== conditions.nexusStateIs.toLowerCase())) return false;

    if (conditions.playerEchoLevelMin !== undefined && wanderer.alignment.echo < conditions.playerEchoLevelMin) return false;
    if (conditions.playerIntentionLevelMin !== undefined && wanderer.alignment.intention < conditions.playerIntentionLevelMin) return false;

    return true;
}

/**
 * Memilih dialog awal yang paling sesuai untuk NPC berdasarkan kondisinya.
 * @param {object} npc - Objek NPC.
 * @returns {import('../../gameData.js').DialogueNode | null} Node dialog yang dipilih.
 */
function selectInitialDialogue(npc) {
    const wanderer = dbInstance.wanderers[dbInstance.currentUser.name];
    const world = dbInstance.world;

    // Sort dialogs by priority (descending) to pick the most relevant one
    const sortedDialogs = Object.values(NPC_DIALOGUES)
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Find the first dialog that meets its conditions
    for (const dialogNode of sortedDialogs) {
        if (evaluateConditions(dialogNode.conditions, npc, wanderer, world)) {
            console.log(`[Dialogue] Selected initial dialogue: ${dialogNode.id}`);
            return dialogNode;
        }
    }

    // Fallback: If no specific dialogs match conditions, try reputation-based greeting as a last resort
    const introGreeting = NPC_DIALOGUES['intro_greeting_by_reputation'];
    if (introGreeting && evaluateConditions(introGreeting.conditions, npc, wanderer, world)) {
        console.log(`[Dialogue] Falling back to reputation-based greeting.`);
        return introGreeting;
    }
    
    UIManager.showNotification("NPC ini sepertinya tidak punya apa-apa untuk dikatakan saat ini.", "info");
    return null;
}

/**
 * Memulai dialog dengan NPC yang diberikan.
 * @param {object} npc - Objek NPC yang akan berdialog.
 */
export const triggerNpcDialogue = (npc) => {
    currentNpcDialogueTarget = npc;
    dbInstance.currentNpcDialogueTarget = currentNpcDialogueTarget; // Update global access
    currentDialogueState = {}; // Reset state dialog untuk percakapan baru

    const initialDialogue = selectInitialDialogue(npc);
    if (!initialDialogue) {
        return;
    }

    displayDialogue(initialDialogue);
    checkQuestCompletion(); // Check for delivery quest completion when starting dialogue
};

/**
 * Menampilkan node dialog saat ini di modal UI.
 * @param {import('../../gameData.js').DialogueNode} dialogueNode - Node dialog yang akan ditampilkan.
 * @param {object} [dialogState] - State tambahan untuk dialog dinamis.
 */
function displayDialogue(dialogueNode, dialogState = {}) {
    const npc = currentNpcDialogueTarget;
    const wanderer = dbInstance.wanderers[dbInstance.currentUser.name];
    const world = dbInstance.world;
    currentDialogueState = { ...currentDialogueState, ...dialogState };

    if (!npc) {
        console.error("Tidak ada NPC target untuk menampilkan dialog.");
        UIManager.closeModal();
        return;
    }

    const modalTitle = npc.name;
    let modalContentText = typeof dialogueNode.text === 'function' ?
        dialogueNode.text(npc, wanderer, world, currentDialogueState) : dialogueNode.text;

    const availableChoices = dialogueNode.choices.filter(choice =>
        evaluateConditions(choice.conditions, npc, wanderer, world)
    );

    const modalButtons = availableChoices.map(choice => ({
        text: choice.text,
        consequence: () => handleDialogChoice(npc, dialogueNode, choice, currentDialogueState)
    }));

    if (modalButtons.length === 0) {
        modalButtons.push({
            text: "Mengakhiri Percakapan.",
            consequence: () => UIManager.closeModal()
        });
    }

    UIManager.showModal(modalTitle, modalContentText, modalButtons);
}

/**
 * Menangani pilihan dialog yang dibuat oleh Wanderer.
 * @param {object} npc - Objek NPC yang sedang berdialog.
 * @param {import('../../gameData.js').DialogueNode} currentNode - Node dialog saat ini.
 * @param {import('../../gameData.js').DialogueChoice} choice - Pilihan dialog yang dipilih Wanderer.
 * @param {object} currentDialogState - State internal dialog saat ini.
 */
async function handleDialogChoice(npc, currentNode, choice, dialogState) {
    const consequence = choice.consequence;
    let dialogueEnded = false;
    const wanderer = dbInstance.wanderers[dbInstance.currentUser.name];

    UIManager.closeModal(); // Close current modal immediately to prepare for next or end

    if (consequence.reputationDelta !== undefined) {
        // WorldManager.recordReputationChange menerima objek NPC, bukan ID
        await WorldManager.recordReputationChange(npc, consequence.reputationDelta, 'dialogue');
        console.log(`Reputasi dengan ${npc.name} berubah ${consequence.reputationDelta}. Reputasi baru: ${npc.reputation}`);
    }

    if (consequence.echoChange !== undefined) {
        wanderer.alignment.echo = Math.max(0, Math.min(100, wanderer.alignment.echo + consequence.echoChange));
        console.log(`Echo Wanderer berubah ${consequence.echoChange}. Echo baru: ${wanderer.alignment.echo}`);
    }

    if (consequence.intentionChange !== undefined) {
        wanderer.alignment.intention = Math.max(0, Math.min(100, wanderer.alignment.intention + consequence.intentionChange));
        console.log(`Intention Wanderer berubah ${consequence.intentionChange}. Intention baru: ${wanderer.alignment.intention}`);
    }

    if (consequence.itemReward) {
        // Asumsi Wanderer's inventory is directly on the wanderer object
        if (!wanderer.inventory) wanderer.inventory = [];
        const existingItem = wanderer.inventory.find(item => item.id === consequence.itemReward.itemId);
        const itemData = TRADABLE_ITEMS_DATA[consequence.itemReward.itemId] || { name: consequence.itemReward.itemId, icon: 'package' }; // Pastikan itemData punya nama dan ikon
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 0) + consequence.itemReward.quantity;
        } else {
            wanderer.inventory.push({ id: consequence.itemReward.itemId, name: itemData.name, quantity: consequence.itemReward.quantity, icon: itemData.icon || 'package' }); // Basic item structure with name and icon
        }
        UIManager.showNotification(`Anda mendapatkan ${consequence.itemReward.quantity}x ${itemData.name}!`, "package", "bg-gradient-to-r from-purple-400 to-indigo-400");
        console.log(`Wanderer mendapatkan item: ${consequence.itemReward.itemId}`);
    }

    if (consequence.chronicleEntry) {
        const finalEntryText = typeof consequence.chronicleEntry === 'function' ?
            consequence.chronicleEntry(npc, dialogState) : consequence.chronicleEntry;

        await addToWandererChronicleFunc(wanderer, {
            id: `dialogue_entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            type: 'dialogue_event',
            title: `Percakapan dengan ${npc.name}`,
            spoil: finalEntryText,
            reflection: finalEntryText,
            timestamp: gameTime.getCurrentDate().toISOString(),
            sigil: 'message-square'
        });
        console.log(`Entri Kronik baru: ${finalEntryText}`);
    }

    if (consequence.setNpcState) {
        for (const key in consequence.setNpcState) {
            npc[key] = consequence.setNpcState[key];
            console.log(`NPC ${npc.name} state updated: ${key} = ${npc[key]}`);
        }
        // Persist NPC state changes
        await updateDocument("saga_worlds", dbInstance.DB_DOC_ID || 'soulforgeSaga_v2.0_KitabAgung', { [`npc_souls.${npc.name}`]: npc });
    }

    if (consequence.setWandererState) {
        for (const key in consequence.setWandererState) {
            wanderer[key] = consequence.setWandererState[key];
            console.log(`Wanderer state updated: ${key} = ${wanderer[key]}`);
        }
    }

    if (consequence.triggerQuestId) {
        const questId = typeof consequence.triggerQuestId === 'function' ?
            consequence.triggerQuestId(npc, dialogState) : consequence.triggerQuestId;
        // Panggil QuestManager untuk menawarkan misi
        offerGenericQuest(npc, questId); // Pass npc object as well
    }

    if (consequence.triggerWorldEvent) {
        console.log(`[PLACEHOLDER] Memicu event dunia: ${consequence.triggerWorldEvent.eventId} di ${consequence.triggerWorldEvent.region}.`);
        UIManager.showNotification(`Event Dunia dipicu: ${consequence.triggerWorldEvent.eventId}!`, "alert-triangle", "bg-orange-500");
    }

    // --- Menentukan Alur Dialog Berikutnya ---
    if (consequence.endsDialogue) {
        dialogueEnded = true;
        console.log(`Dialog dengan ${npc.name} selesai.`);
    } else if (consequence.nextDialogueId) {
        const nextNode = NPC_DIALOGUES[consequence.nextDialogueId];
        if (nextNode) {
            setTimeout(() => displayDialogue(nextNode, dialogState), 300);
        } else {
            console.error(`Dialogue ID '${consequence.nextDialogueId}' tidak ditemukan. Mengakhiri dialog.`);
            dialogueEnded = true;
        }
    } else if (currentNode.defaultNextDialogueId) {
        const nextNode = NPC_DIALOGUES[currentNode.defaultNextDialogueId];
        if (nextNode) {
             setTimeout(() => displayDialogue(nextNode, dialogState), 300);
        } else {
            console.error(`Default Dialogue ID '${currentNode.defaultNextDialogueId}' tidak ditemukan. Mengakhiri dialog.`);
            dialogueEnded = true;
        }
    } else {
        dialogueEnded = true;
    }

    // --- Memperbarui UI Wanderer (jika dialog tidak berlanjut) ---
    await dbInstance.saveDB(false); // Save current Wanderer data and other changes without showing loading
    WandererPageRenderer.renderAllWandererComponents('character'); // Refresh statistik atau visual Wanderer
    // If modal remains open for the next dialogue, the UI will be refreshed by that call.
    // If dialogueEnded is true, then we close modal (already done above) and refresh UI.
}