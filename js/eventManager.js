// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 17:40 ==
// == PERIHAL: Mock file untuk eventManager.js ==
// - Menyediakan fungsi mock untuk memicu event Whisper.
// ===========================================
import { UIManager } from './uiManager.js';

export const eventManager = {
    triggerWhisperEvent(whisperObj) {
        console.log(`[EventManager] Whisper Event Triggered: ${whisperObj.name} from NPC ${whisperObj.originNpcId}`);
        // UIManager.showNotification(`New Whisper: ${whisperObj.name}!`, 'cloud-off', 'bg-red-500');
        // In a real game, this would do more than just log and notify, e.g., show a modal to the Wanderer.
    }
};

export const triggerWhisperEvent = eventManager.triggerWhisperEvent;