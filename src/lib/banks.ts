import { REAPER_EVENTS } from '@/lib/events';
import OSC from 'osc-js';

/**
 * Send the message to change the selected track bank in REAPER.
 *
 * @param {OSC} client The OSC client to send the message with.
 * @param {number} bank The number of the bank to select.
 *
 * @example
 * import { sendTrackCount } from '@/lib/tracks';
 * const client = new OSC({Plugin: new OSC.BrowserPlugin() });
 * selectTrackBank(client, 0);
 */
export function selectTrackBank(client: OSC, bank: number) {
    client.send(new OSC.Message(REAPER_EVENTS.TRACK_BANK_SELECT, bank));
}
