// js/features/wanderer/questManager.js

// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 20:16 ==
// == PERIHAL: Implementasi Fase III - Misi NPC Generik (Fetch/Delivery) ==
// - Membuat modul baru untuk mengelola logika misi (penawaran, penerimaan, pelacakan, penyelesaian).
// - Mengimplementasikan fungsi offerGenericQuest dan generateQuestDetails.
// - Mengimplementasikan fungsi checkQuestCompletion untuk misi fetch.
// - Menyediakan struktur dasar untuk acceptQuest, declineQuest, completeFetchQuest, completeDeliveryQuest.
// ===========================================
// == MODIFIED BY: Gemini (requested by User) ==
// == TANGGAL: 2025-06-25, 13:10 ==
// == PERIHAL: Integrasi Masif GameData.js ke QuestManager.js ==
// - Memperbarui `generateQuestDetails` untuk generasi quest yang lebih cerdas berdasarkan data dunia.
// - Memperbarui `checkQuestCompletion` untuk mendukung tipe quest baru (hunt, explore, cleanse, craft, escort, defend).
// - Memperbarui `completeQuest` untuk menangani hadiah yang lebih kompleks (factionReputationDelta, wandererTrait, essenceGain).
// - Mengintegrasikan `QUEST_OBJECTIVE_TEMPLATES`, `REGIONS_DATA`, `FACTIONS_DATA`, `CREATURES_DATA`, `WORLD_LANDMARKS`, `NPC_ROLES`, `NPC_PERSONALITY_TRAITS`, `ITEM_EFFECTS_DATA`.
// ===========================================

import {
    GENERIC_QUEST_TYPES, TRADABLE_ITEMS_DATA, QUEST_OBJECTIVE_TEMPLATES,
    REGIONS_DATA, FACTIONS_DATA, CREATURES_DATA, WORLD_LANDMARKS, NPC_ROLES,
    NPC_PERSONALITY_TRAITS, ITEM_EFFECTS_DATA, CHRONICLE_EVENTS // Added new imports
} from '../../gameData.js';
import { addToWandererChronicle } from '../../chronicleManager.js';
import { getCurrentUser, setCurrentUser } from '../../authService.js'; // Ensure setCurrentUser is imported

let dbInstance; // Global db object
let saveDBInstanceRef; // Function to save db
let UIManager;
let WorldManager; // WorldManager module
let WandererPageRenderer; // WandererPageRenderer module
let gameTime; // gameTime utility

export const initializeQuestManager = (db, save, ui, world, wandererPR, gt) => {
    dbInstance = db;
    saveDBInstanceRef = save;
    UIManager = ui;
    WorldManager = world;
    WandererPageRenderer = wandererPR;
    gameTime = gt;
    console.log("QuestManager initialized with dependencies.");
};

/**
 * Mendapatkan detail item lengkap dari TRADABLE_ITEMS_DATA.
 * @param {string} itemId - ID item.
 * @returns {object} Detail item.
 */
const getItemDefinition = (itemId) => TRADABLE_ITEMS_DATA[itemId];

/**
 * Mendapatkan definisi makhluk dari CREATURES_DATA.
 * @param {string} creatureId - ID makhluk.
 * @returns {object} Definisi makhluk.
 */
const getCreatureDefinition = (creatureId) => CREATURES_DATA[creatureId];

/**
 * Mendapatkan definisi landmark dari WORLD_LANDMARKS.
 * @param {string} landmarkId - ID landmark.
 * @returns {object} Definisi landmark.
 */
const getLandmarkDefinition = (landmarkId) => WORLD_LANDMARKS[landmarkId];


/**
 * Menghasilkan detail misi spesifik berdasarkan template dan konteks.
 * @param {string} questTypeId - ID tipe misi dari GENERIC_QUEST_TYPES.
 * @param {object} npc - NPC yang menawarkan misi.
 * @returns {object} Objek detail misi yang tergenerasi.
 */
function generateQuestDetails(questTypeId, npc) {
    const questTemplate = GENERIC_QUEST_TYPES[questTypeId];
    if (!questTemplate) {
        console.error(`Tipe misi '${questTypeId}' tidak ditemukan.`);
        return null;
    }

    const currentUser = getCurrentUser();
    const region = dbInstance.world.regions[npc.currentRegion];
    const difficulty = questTemplate.baseDifficulty + Math.floor(Math.random() * 2); // Variasi kesulitan: +0 atau +1

    const generatedDetails = {
        itemName: null, quantity: 0, itemId: null, itemIcon: null,
        targetNpcId: null, targetNpcName: null, targetNpcRole: null,
        targetCreatureId: null, targetCreatureName: null,
        targetLandmarkId: null, targetLandmarkName: null, targetLandmarkType: null,
        location: null,
        difficulty: difficulty,
        threatType: null, // For defend quests
        startLocation: null, endLocation: null, // For escort quests
    };

    // --- Generate Objective Details based on Quest Type ---
    if (questTemplate.type === "fetch" || questTemplate.type === "delivery" || questTemplate.type === "craft") {
        const availableItems = Object.values(TRADABLE_ITEMS_DATA).filter(item =>
            questTemplate.requiredItemTypes?.includes(item.type)
        );
        if (availableItems.length > 0) {
            const selectedItem = availableItems[Math.floor(Math.random() * availableItems.length)];
            generatedDetails.itemName = selectedItem.name;
            generatedDetails.itemIcon = selectedItem.icon;
            generatedDetails.itemId = selectedItem.id;
        } else {
            generatedDetails.itemName = "Item Aneh";
            generatedDetails.itemIcon = "help-circle";
            generatedDetails.itemId = "placeholder_item";
        }
        generatedDetails.quantity = Math.ceil(Math.random() * 3 * difficulty);
    }

    if (questTemplate.type === "delivery" || questTemplate.type === "escort" || questTemplate.type === "talk_to_npc") {
        // Find a suitable target NPC in the current or a neighboring region
        const potentialTargets = Object.values(dbInstance.npc_souls).filter(n =>
            n.id !== npc.id &&
            (n.currentRegion === npc.currentRegion || (region.neighboringRegions && region.neighboringRegions.includes(n.currentRegion))) &&
            (questTemplate.targetNpcRole === 'any' || n.role === questTemplate.targetNpcRole) // Filter by role
        );
        if (potentialTargets.length > 0) {
            const targetNpc = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
            generatedDetails.targetNpcId = targetNpc.id;
            generatedDetails.targetNpcName = targetNpc.name;
            generatedDetails.targetLocation = WorldManager.getRegionName(targetNpc.currentRegion); // Location for NPC
        } else {
            generatedDetails.targetNpcId = "stranger";
            generatedDetails.targetNpcName = "Seseorang di daerah ini";
            generatedDetails.targetLocation = "lokasi terpencil";
        }
    }

    if (questTemplate.type === "hunt") {
        const availableCreatures = Object.values(CREATURES_DATA).filter(creature =>
            questTemplate.targetCreatureTypes?.includes(creature.types[0]) && // Assuming first type is main type
            (region.spawnableCreatureTypes?.includes(creature.id) || creature.habitatRegions.includes(region.id)) // Spawns here or in habitat
        );
        if (availableCreatures.length > 0) {
            const selectedCreature = availableCreatures[Math.floor(Math.random() * availableCreatures.length)];
            generatedDetails.targetCreatureId = selectedCreature.id;
            generatedDetails.targetCreatureName = selectedCreature.name;
            generatedDetails.quantity = Math.ceil(Math.random() * 2 * difficulty) + 1; // 1 to 3+ creatures
        } else {
            generatedDetails.targetCreatureId = "wild_beast";
            generatedDetails.targetCreatureName = "Binatang Buas";
            generatedDetails.quantity = 1;
        }
    }

    if (questTemplate.type === "explore" || questTemplate.type === "cleanse" || questTemplate.type === "defend") {
        const availableLandmarks = Object.values(WORLD_LANDMARKS).filter(landmark =>
            landmark.regionId === region.id &&
            (questTemplate.targetLandmarkTypes?.includes(landmark.type) || questTemplate.targetLandmarkTypes?.includes('any')) &&
            (questTemplate.type !== 'cleanse' || landmark.currentStatus === 'corrupted') // For cleanse, must be corrupted
        );
        if (availableLandmarks.length > 0) {
            const selectedLandmark = availableLandmarks[Math.floor(Math.random() * availableLandmarks.length)];
            generatedDetails.targetLandmarkId = selectedLandmark.id;
            generatedDetails.targetLandmarkName = selectedLandmark.name;
            generatedDetails.location = selectedLandmark.name;
        } else {
            generatedDetails.targetLandmarkId = "ancient_site";
            generatedDetails.targetLandmarkName = "Situs Kuno";
            generatedDetails.location = "lokasi tersembunyi";
        }
        if (questTemplate.type === 'defend') {
            generatedDetails.threatType = questTemplate.threatTypes ? questTemplate.threatTypes[Math.floor(Math.random() * questTemplate.threatTypes.length)] : 'ancaman';
        }
    }

    if (questTemplate.type === "escort") {
        // Start and end locations for escort. For simplicity, end location is a neighboring region's town.
        generatedDetails.startLocation = WorldManager.getRegionName(npc.currentRegion);
        if (region.neighboringRegions && region.neighboringRegions.length > 0) {
            const endRegionId = region.neighboringRegions[Math.floor(Math.random() * region.neighboringRegions.length)];
            generatedDetails.endLocation = WorldManager.getRegionName(endRegionId);
        } else {
            generatedDetails.endLocation = "desa terdekat";
        }
    }

    // --- Calculate Rewards Dynamically ---
    const calculatedReward = {};
    for (const key in questTemplate.rewardSchema) {
        if (typeof questTemplate.rewardSchema[key] === 'function') {
            calculatedReward[key] = questTemplate.rewardSchema[key](difficulty);
        } else if (typeof questTemplate.rewardSchema[key] === 'object' && questTemplate.rewardSchema[key] !== null) {
            calculatedReward[key] = { ...questTemplate.rewardSchema[key] };
            if (typeof calculatedReward[key].quantity === 'function') {
                calculatedReward[key].quantity = calculatedReward[key].quantity(difficulty);
            }
        } else {
            calculatedReward[key] = questTemplate.rewardSchema[key];
        }
    }

    // --- Populate Quest Strings ---
    const name = typeof questTemplate.name === 'function' ? questTemplate.name(generatedDetails) : questTemplate.name
        .replace("{itemName}", generatedDetails.itemName)
        .replace("{targetNpcName}", generatedDetails.targetNpcName)
        .replace("{targetCreatureName}", generatedDetails.targetCreatureName)
        .replace("{targetLandmarkName}", generatedDetails.targetLandmarkName);

    const description = typeof questTemplate.description === 'function' ? questTemplate.description(npc, currentUser, dbInstance.world, generatedDetails) : questTemplate.description
        .replace("{quantity}", generatedDetails.quantity)
        .replace("{itemName}", generatedDetails.itemName)
        .replace("{targetNpcName}", generatedDetails.targetNpcName)
        .replace("{targetCreatureName}", generatedDetails.targetCreatureName)
        .replace("{targetLandmarkName}", generatedDetails.targetLandmarkName)
        .replace("{threatType}", generatedDetails.threatType)
        .replace("{startLocation}", generatedDetails.startLocation)
        .replace("{endLocation}", generatedDetails.endLocation);

    const objective = typeof questTemplate.objectiveTemplate === 'function' ? questTemplate.objectiveTemplate(generatedDetails) : questTemplate.objectiveTemplate
        .replace("{quantity}", generatedDetails.quantity)
        .replace("{itemName}", generatedDetails.itemName)
        .replace("{targetNpcName}", generatedDetails.targetNpcName)
        .replace("{targetCreatureName}", generatedDetails.targetCreatureName)
        .replace("{targetLandmarkName}", generatedDetails.targetLandmarkName)
        .replace("{location}", generatedDetails.location)
        .replace("{threatType}", generatedDetails.threatType)
        .replace("{startLocation}", generatedDetails.startLocation)
        .replace("{endLocation}", generatedDetails.endLocation);

    return {
        id: `quest_${questTemplate.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: questTemplate.type,
        name: name,
        description: description,
        objective: objective,
        status: "active",
        reward: calculatedReward,
        npcId: npc.id,
        npcName: npc.name,
        generatedDetails: generatedDetails,
        difficulty: difficulty,

        // Specific properties for completion tracking
        itemToFetchId: generatedDetails.itemId,
        quantityNeeded: generatedDetails.quantity,
        itemToDeliverId: generatedDetails.itemId,
        targetNpcId: generatedDetails.targetNpcId,
        targetCreatureId: generatedDetails.targetCreatureId,
        targetLandmarkId: generatedDetails.targetLandmarkId,
        initialKilledCount: 0, // For hunt quests, track how many killed AFTER quest acceptance
    };
}

/**
 * Memilih tipe misi generik yang sesuai berdasarkan kondisi NPC dan Wanderer.
 * @param {object} npc - NPC yang menawarkan misi.
 * @returns {string} ID tipe misi yang dipilih.
 */
function selectGenericQuestType(npc) {
    const currentUser = getCurrentUser();
    const world = dbInstance.world;
    const region = world.regions[npc.currentRegion];

    const availableQuests = Object.values(GENERIC_QUEST_TYPES).filter(questType => {
        // Basic conditions from questTemplate.conditions
        if (questType.conditions) {
            if (questType.conditions.requiredNpcTrait && (!npc.personalityTraits || !npc.personalityTraits.includes(questType.conditions.requiredNpcTrait))) return false;
            if (questType.conditions.minReputationToOffer && (currentUser.reputation[npc.id] || 0) < questType.conditions.minReputationToOffer) return false;
            if (questType.conditions.nexusState && (region.status.toUpperCase() !== questType.conditions.nexusState.toUpperCase())) return false;
            if (questType.conditions.playerLevelMin && currentUser.level < questType.conditions.playerLevelMin) return false;
            // TODO: Add conditions for timeOfDay, weather, questPrerequisite
        }

        // More intelligent filtering based on generated details feasibility
        if (questType.type === "fetch" || questType.type === "delivery" || questType.type === "craft") {
            const hasRequiredItems = Object.values(TRADABLE_ITEMS_DATA).some(item =>
                questType.requiredItemTypes?.includes(item.type)
            );
            if (!hasRequiredItems) return false;
        }
        if (questType.type === "hunt") {
            const hasTargetCreatures = Object.values(CREATURES_DATA).some(creature =>
                questType.targetCreatureTypes?.includes(creature.types[0]) &&
                (region.spawnableCreatureTypes?.includes(creature.id) || creature.habitatRegions.includes(region.id))
            );
            if (!hasTargetCreatures) return false;
        }
        if (questType.type === "explore" || questType.type === "cleanse" || questType.type === "defend") {
            const hasTargetLandmarks = Object.values(WORLD_LANDMARKS).some(landmark =>
                landmark.regionId === region.id &&
                (questType.targetLandmarkTypes?.includes(landmark.type) || questType.targetLandmarkTypes?.includes('any')) &&
                (questType.type !== 'cleanse' || landmark.currentStatus === 'corrupted')
            );
            if (!hasTargetLandmarks) return false;
        }
        if (questType.type === "delivery" || questType.type === "escort" || questType.type === "talk_to_npc") {
            const hasTargetNpc = Object.values(dbInstance.npc_souls).some(n =>
                n.id !== npc.id &&
                (n.currentRegion === npc.currentRegion || (region.neighboringRegions && region.neighboringRegions.includes(n.currentRegion))) &&
                (questType.targetNpcRole === 'any' || n.role === questType.targetNpcRole)
            );
            if (!hasTargetNpc) return false;
        }

        // Avoid offering quests if Wanderer already has too many active quests
        const MAX_ACTIVE_QUESTS = 5; // Define a limit
        if (currentUser.activeQuests && currentUser.activeQuests.length >= MAX_ACTIVE_QUESTS) return false;

        // Avoid offering quests if the specific target doesn't exist
        // This is handled by generateQuestDetails, so we can assume if generateQuestDetails returns null,
        // this quest type won't be offered. For `selectGenericQuestType`, we try to avoid it earlier.

        return true;
    });

    if (availableQuests.length === 0) {
        return null;
    }

    // Prioritize quests based on NPC's personality traits or role
    let prioritizedQuests = [...availableQuests];

    // Example: Greedy NPCs prefer quests with gold rewards, Loyal prefer quests for their faction
    if (npc.personalityTraits.includes('greedy')) {
        prioritizedQuests.sort((a, b) => (b.rewardSchema.item?.id === 'gold_coin' ? 1 : 0) - (a.rewardSchema.item?.id === 'gold_coin' ? 1 : 0));
    }
    if (npc.role === NPC_ROLES.GUARD.id) {
        prioritizedQuests.sort((a, b) => (b.type === 'hunt' || b.type === 'defend' ? 1 : 0) - (a.type === 'hunt' || a.type === 'defend' ? 1 : 0));
    }


    return prioritizedQuests[0]?.id || null; // Return the most prioritized or first available
}

/**
 * Menawarkan misi generik kepada Wanderer.
 * @param {object} npc - NPC yang menawarkan misi.
 * @param {string} [typeId] - ID tipe misi (opsional).
 */
export const offerGenericQuest = (npc, typeId) => {
    const currentUser = getCurrentUser();
    // Cek apakah Wanderer sudah memiliki misi aktif dari NPC ini atau misi yang sama
    if (currentUser.activeQuests && currentUser.activeQuests.some(q => q.npcId === npc.id && q.status === 'active') ||
        (typeId && currentUser.activeQuests.some(q => q.type === typeId && q.status === 'active'))) {
        UIManager.showNotification(`NPC ${npc.name} sudah memberimu misi atau kau sudah punya misi sejenis.`, "info", "bg-blue-500");
        return;
    }

    const questTypeId = typeId || selectGenericQuestType(npc);
    if (!questTypeId) {
        UIManager.showNotification("NPC ini tidak punya misi untukmu saat ini.", "info", "bg-blue-500");
        return;
    }

    const questDetails = generateQuestDetails(questTypeId, npc);
    if (!questDetails) {
        UIManager.showNotification("Tidak dapat menghasilkan misi yang cocok saat ini.", "info", "bg-orange-500");
        return;
    }

    const rewardText = `XP: ${questDetails.reward.xp || 0}, Item: ${questDetails.reward.item?.quantity || 0}x ${TRADABLE_ITEMS_DATA[questDetails.reward.item?.id]?.name || questDetails.reward.item?.id || 'Tidak ada item'}.`;
    const modalTitle = `Misi dari ${npc.name}`;
    const modalContent = `${questDetails.description}<br><br><span class="font-bold text-white">Tujuan:</span> ${questDetails.objective}<br><br><span class="font-bold text-white">Hadiah:</span> ${rewardText}.`;
    const modalButtons = [
        {
            text: "Terima Misi",
            isPrimary: true,
            onClick: () => { // Changed to onClick to be compatible with UIManager.showModal
                UIManager.closeModal(); // Close modal first
                acceptQuest(questDetails);
            }
        },
        {
            text: "Tolak Misi",
            isPrimary: false,
            onClick: () => { // Changed to onClick
                UIManager.closeModal(); // Close modal first
                declineQuest(npc);
            }
        }
    ];

    UIManager.showModal(modalTitle, modalContent, modalButtons);
};

/**
 * Menerima misi dan menambahkannya ke log Wanderer.
 * @param {object} questDetails - Detail misi.
 */
function acceptQuest(questDetails) {
    const currentUser = getCurrentUser();
    if (!currentUser.activeQuests) {
        currentUser.activeQuests = [];
    }
    currentUser.activeQuests.push(questDetails);

    // For hunt quests, record current kill counts to track progress
    if (questDetails.type === 'hunt') {
        questDetails.initialKilledCount = currentUser.killedCreatures?.[questDetails.targetCreatureId] || 0;
    }

    addToWandererChronicle(currentUser, {
        id: `quest_accepted_entry_${questDetails.id}`,
        type: CHRONICLE_EVENTS.JOURNAL_QUEST_ACCEPTED.type,
        title: CHRONICLE_EVENTS.JOURNAL_QUEST_ACCEPTED.title,
        description: CHRONICLE_EVENTS.JOURNAL_QUEST_ACCEPTED.content({ npcName: questDetails.npcName, questName: questDetails.name }),
        timestamp: gameTime.getCurrentDate().toISOString(),
        icon: CHRONICLE_EVENTS.JOURNAL_QUEST_ACCEPTED.icon || 'clipboard-list'
    });
    UIManager.showNotification(`Misi "${questDetails.name}" diterima.`, "check-square", "quest");
    saveDBInstanceRef(true);
    WandererPageRenderer.renderActiveQuestsLog();
    // No need to renderAllWandererComponents('character') here, it's done by daily update or manual nav.
}

/**
 * Menolak misi dan (opsional) mengurangi reputasi.
 * @param {object} npc - NPC yang menawarkan misi.
 */
function declineQuest(npc) {
    UIManager.showNotification("Misi ditolak.", "info", "bg-blue-500");
    WorldManager.recordReputationChange(npc.id, -2, "quest_declined"); // Pass npc.id
    // saveDBInstanceRef is handled by WorldManager.recordReputationChange
}

/**
 * Memeriksa penyelesaian misi untuk semua misi aktif.
 * Dipanggil secara berkala (misal, setiap hari, atau saat event tertentu seperti perubahan inventaris/lokasi).
 */
export const checkQuestCompletion = () => {
    const currentUser = getCurrentUser();
    if (!currentUser.activeQuests || currentUser.activeQuests.length === 0) return;

    let questsToComplete = [];
    let questsToFail = []; // For potential future failure conditions

    currentUser.activeQuests.forEach(quest => {
        if (quest.status !== "active") return;

        let isCompleted = false;

        switch (quest.type) {
            case "fetch":
                const requiredItem = currentUser.inventory.find(item => item.id === quest.itemToFetchId);
                if (requiredItem && requiredItem.quantity >= quest.quantityNeeded) {
                    isCompleted = true;
                }
                break;
            case "delivery":
                // Assumed to be completed by talking to the target NPC
                // This requires npcInteraction to set a flag or tell QuestManager who was last talked to.
                // For simplicity, let's assume it completes if the Wanderer is in the target NPC's region
                // AND has interacted with ANY NPC recently. A better way: the dialogue with the target NPC.
                // This is where dbInstance.currentNpcDialogueTarget comes in from npcInteraction.js.
                const targetDeliveryNpc = dbInstance.npc_souls[quest.targetNpcId];
                if (targetDeliveryNpc && currentUser.currentRegion === targetDeliveryNpc.currentRegion &&
                    dbInstance.currentNpcDialogueTarget && dbInstance.currentNpcDialogueTarget.id === targetDeliveryNpc.id) {
                    isCompleted = true;
                }
                break;
            case "hunt":
                // Assumes `currentUser.killedCreatures` tracks kills globally, initialized at 0.
                // Format: { creatureId: count }
                const currentKills = currentUser.killedCreatures?.[quest.targetCreatureId] || 0;
                if (currentKills - (quest.initialKilledCount || 0) >= quest.quantityNeeded) {
                    isCompleted = true;
                }
                break;
            case "explore":
                // Assumes `currentUser.discoveredLandmarks` is a set/array of discovered landmark IDs.
                // If the target landmark is in `dbInstance.world.landmarks` and its `currentStatus` is 'discovered' or 'active' (meaning player visited)
                const targetExploreLandmark = getLandmarkDefinition(quest.targetLandmarkId);
                if (targetExploreLandmark && currentUser.discoveredLandmarks?.includes(targetExploreLandmark.id)) {
                    isCompleted = true;
                }
                break;
            case "cleanse":
                // Assumes `WorldManager.getLandmarkStatus(landmarkId)` returns current status.
                // Needs to change the landmark status in db.world.landmarks when purification happens.
                const targetCleanseLandmark = dbInstance.world.landmarks[quest.targetLandmarkId];
                if (targetCleanseLandmark && targetCleanseLandmark.currentStatus === 'purified') {
                    isCompleted = true;
                }
                break;
            case "craft":
                // Assumes `CommissionGame` adds crafted items to inventory and quest completion is checked after crafting.
                const craftedItem = currentUser.inventory.find(item => item.id === quest.itemToCraftId);
                if (craftedItem && craftedItem.quantity >= quest.quantityNeeded) { // Check if crafted quantity is met
                    isCompleted = true;
                }
                break;
            case "escort":
                // Very simplified: Assume completed if target NPC reaches their destination region (tracked by NPC itself)
                // Or if Wanderer enters the target's destination region while quest is active.
                const escortedNpc = dbInstance.npc_souls[quest.generatedDetails.targetNpcId];
                const destinationRegionId = Object.keys(REGIONS_DATA).find(id => REGIONS_DATA[id].name === quest.generatedDetails.endLocation);
                if (escortedNpc && escortedNpc.currentRegion === destinationRegionId) {
                    isCompleted = true;
                }
                break;
            case "defend":
                // Placeholder: Assume completed if threat level in region reduces significantly or specific enemy is defeated.
                // For now, let's say it completes if Wanderer talks to the quest giver again.
                // This implies NPC dialogue needs to trigger a check.
                if (dbInstance.currentNpcDialogueTarget && dbInstance.currentNpcDialogueTarget.id === quest.npcId) {
                    isCompleted = true; // Simplified: just talk to NPC giver to complete defend quest
                }
                break;
        }

        if (isCompleted) {
            questsToComplete.push(quest);
        }
    });

    questsToComplete.forEach(quest => {
        completeQuest(quest);
    });
    // No need to saveDBInstanceRef here, completeQuest handles it.
};

/**
 * Menyelesaikan misi dan memberikan hadiah.
 * @param {object} quest - Objek misi yang akan diselesaikan.
 */
function completeQuest(quest) {
    const currentUser = getCurrentUser();
    const npcGiver = dbInstance.npc_souls[quest.npcId];

    // Remove quest from active quests
    currentUser.activeQuests = currentUser.activeQuests.filter(q => q.id !== quest.id);

    // --- Apply Rewards ---
    // XP
    if (quest.reward.xp) {
        currentUser.xp += quest.reward.xp;
        UIManager.showNotification(`+${quest.reward.xp} XP dari misi "${quest.name}"!`, "award", "success");
    }

    // Item
    if (quest.reward.item) {
        const rewardItemData = getItemDefinition(quest.reward.item.id);
        if (rewardItemData) {
            if (!currentUser.inventory) currentUser.inventory = [];
            const existingItem = currentUser.inventory.find(item => item.id === rewardItemData.id);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + quest.reward.item.quantity;
            } else {
                currentUser.inventory.push({ id: rewardItemData.id, name: rewardItemData.name, quantity: quest.reward.item.quantity, icon: rewardItemData.icon });
            }
            UIManager.showNotification(`Anda mendapatkan ${quest.reward.item.quantity}x ${rewardItemData.name}!`, "package", "item");
        }
    }

    // Essence Gain
    if (quest.reward.essenceGain) {
        currentUser.essenceOfWill = (currentUser.essenceOfWill || 0) + quest.reward.essenceGain;
        UIManager.showNotification(`+${quest.reward.essenceGain} Esensi Niat!`, "hexagon", "success");
    }

    // NPC Reputation
    if (quest.reward.reputationDelta && npcGiver) {
        WorldManager.recordReputationChange(npcGiver.id, quest.reward.reputationDelta, "quest_completed"); // Pass npc.id
    }
    // Faction Reputation
    if (quest.reward.factionId && quest.reward.factionReputationDelta) {
        WorldManager.recordFactionReputationChange(quest.reward.factionId, quest.reward.factionReputationDelta, "quest_completed"); // Placeholder for faction reputation function
    }

    // Wanderer Trait
    if (quest.reward.wandererTrait) {
        if (!currentUser.personalityTraits) currentUser.personalityTraits = [];
        if (!currentUser.personalityTraits.includes(quest.reward.wandererTrait)) {
            currentUser.personalityTraits.push(quest.reward.wandererTrait);
            UIManager.showNotification(`Anda mendapatkan trait baru: ${quest.reward.wandererTrait}!`, "sparkles", "success");
        }
    }

    // --- Handle Quest-Specific Item/State Changes ---
    // Remove required items for 'fetch' quests
    if (quest.type === "fetch" && quest.itemToFetchId) {
        const itemIndex = currentUser.inventory.findIndex(item => item.id === quest.itemToFetchId);
        if (itemIndex !== -1) {
            currentUser.inventory[itemIndex].quantity -= quest.quantityNeeded;
            if (currentUser.inventory[itemIndex].quantity <= 0) {
                currentUser.inventory.splice(itemIndex, 1);
            }
        }
    }
    // For 'craft' quests, remove materials (assuming done by crafting system)
    // For 'cleanse' quests, update landmark status (assumed by specific cleansing action in WorldManager)

    // --- Record Chronicle Entry ---
    addToWandererChronicle(currentUser, {
        id: `quest_completed_entry_${quest.id}`,
        type: CHRONICLE_EVENTS.QUEST_COMPLETED_SUCCESS.type,
        title: CHRONICLE_EVENTS.QUEST_COMPLETED_SUCCESS.title,
        description: CHRONICLE_EVENTS.QUEST_COMPLETED_SUCCESS.template
            .replace('{questName}', quest.name)
            .replace('{rewardDescription}', `memberikan ${quest.reward.xp} XP dan ${quest.reward.item.quantity}x ${getItemDefinition(quest.reward.item.id)?.name || quest.reward.item.id}`),
        timestamp: gameTime.getCurrentDate().toISOString(),
        icon: CHRONICLE_EVENTS.QUEST_COMPLETED_SUCCESS.icon || 'check-circle'
    });
    UIManager.showNotification(`Misi "${quest.name}" selesai!`, "check-circle", "quest");

    saveDBInstanceRef(true); // Save all changes to DB
    WandererPageRenderer.renderActiveQuestsLog(); // Update quest log UI
    WandererPageRenderer.renderAllWandererComponents('character'); // Update character UI (XP, items)
}

/**
 * Mendapatkan detail template misi berdasarkan ID.
 * @param {string} questId - ID misi.
 * @returns {object | null} Objek template misi atau null jika tidak ditemukan.
 */
export const getQuestById = (questId) => {
    return Object.values(GENERIC_QUEST_TYPES).find(quest => quest.id === questId) || null;
};
