/**
 * Logs that a signal is being sent to the DAW.
 *
 * @param {string} signal The signal being sent.
 */
export function signalLog(signal: string, value: string | number) {
    console.log(`➡️ Sent signal to DAW: "${signal}" with value: ${value}`);
}
