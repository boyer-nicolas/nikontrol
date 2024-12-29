/**
 * Converts a boolean to a number.
 *
 * @param {boolean} value - The boolean to convert.
 * @returns {number} 1 if the boolean is true, 0 if it is false.
 */
export function boolToNum(value: boolean): number {
    return value ? 1 : 0;
}

/**
 * Returns a promise that resolves after the given amount of milliseconds.
 *
 * @param {number} ms - The amount of milliseconds to wait.
 * @returns {Promise<void>} - A promise that resolves after the given amount of milliseconds.
 */
export async function delay(ms: number): Promise<void> {
    return await new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}
