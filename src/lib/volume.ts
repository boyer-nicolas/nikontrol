import { Message } from '@/lib/events';

export enum TRACK_VOLUMES {
    DEFAULT = 0.7160000205039978,
    MAX = 1,
    MIN = 0.0025138729251921177
}

export let trackVolume = TRACK_VOLUMES.DEFAULT;

/**
 * Handles messages from REAPER regarding track volume changes.
 *
 * @param {Message} msg - The message from REAPER containing the track volume value.
 *
 * @fires Console logs at the `log` level when the track volume changes to the default, max, or min values.
 */
export function handleTrackVolume(msg: Message) {
    const { args } = msg;
    trackVolume = args[0];

    console.log('trackVolume', trackVolume);
    if (TRACK_VOLUMES.DEFAULT === trackVolume) {
        console.log('Track volume back to default');
    }

    if (TRACK_VOLUMES.MAX === trackVolume) {
        console.log('Track volume at max');
    }

    if (TRACK_VOLUMES.MIN === trackVolume) {
        console.log('Track volume at min');
    }
}
