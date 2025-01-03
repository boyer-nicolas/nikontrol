/**
 * Logs that a signal is being sent to the DAW.
 *
 * @param {string} signal The signal being sent.
 */
export function signalLog(signal: string, value: string | number, path: string) {
    console.log(`➡️ Sent signal to DAW: "${signal}" (${path}) with value: ${value}`);
}
