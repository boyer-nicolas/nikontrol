import { Message } from '@/lib/events';

export enum TRACK_PANS {
    DEFAULT = 0.5, // Center
    MAX = 1, // Right
    MIN = 0 // Left
}

export let trackPan = TRACK_PANS.DEFAULT;

/**
 * Handles messages from REAPER regarding track pan changes.
 *
 * @param {Message} msg - The message from REAPER containing the track pan value.
 *
 * @fires Console logs at the `log` level when the track pan changes to the default, max, or min values.
 */
export function handleTrackPan(msg: Message) {
    const { args } = msg;
    trackPan = args[0];

    console.log('trackPan', trackPan);
    if (TRACK_PANS.DEFAULT === trackPan) {
        console.log('Track pan set to default');
    }

    if (TRACK_PANS.MAX === trackPan) {
        console.log('Track pan at max');
    }

    if (TRACK_PANS.MIN === trackPan) {
        console.log('Track pan at min');
    }
}
