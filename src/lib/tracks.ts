import { CONFIG } from '@/lib/config';
import { REAPER_EVENTS } from '@/lib/events';
import OSC from 'osc-js';

/**
 * Send the track count to REAPER.
 *
 * @param {OSC} client The OSC client to send the message with.
 *
 * @example
 * import { sendTrackCount } from '@/lib/tracks';
 * const client = new OSC({Plugin: new OSC.BrowserPlugin() });
 * sendTrackCount(client);
 */
export function sendTrackCount(client: OSC) {
    client.send(new OSC.Message(REAPER_EVENTS.TRACK_COUNT, CONFIG.TRACK_COUNT));
}

/**
 * Send a message to REAPER to select the next track bank.
 *
 * @param {OSC} client The OSC client to send the message with.
 *
 * @example
 * import { nextBank } from '@/lib/tracks';
 * const client = new OSC({Plugin: new OSC.BrowserPlugin() });
 * nextBank(client);
 */
export function nextBank(client: OSC) {
    client.send(new OSC.Message(REAPER_EVENTS.TRACK_BANK_NEXT));
}

/**
 * Send a message to REAPER to select the previous track bank.
 *
 * @param {OSC} client The OSC client to send the message with.
 *
 * @example
 * import { prevBank } from '@/lib/tracks';
 * const client = new OSC({Plugin: new OSC.BrowserPlugin() });
 * prevBank(client);
 */
export function prevBank(client: OSC) {
    client.send(new OSC.Message(REAPER_EVENTS.TRACK_BANK_PREV));
}
