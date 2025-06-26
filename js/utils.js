// == MODIFIED BY: Tim 3.A ==
// == TANGGAL: 2025-06-24, 17:40 ==
// == PERIHAL: Mock file untuk gameTime.js ==
// - Menyediakan fungsi mock untuk gameTime.
// ===========================================
export const gameTime = {
    _currentDate: new Date(),

    getCurrentDate() {
        return this._currentDate;
    },
    advanceDay() {
        this._currentDate.setDate(this._currentDate.getDate() + 1);
        console.log(`[GameTime] Advanced to: ${this._currentDate.toLocaleDateString()}`);
    },
    resetDate() {
        this._currentDate = new Date(); // Reset to current system date
    }
};