import { Message } from '@/lib/events';

export enum TRACK_VOLUMES {
    DEFAULT = 0.7160000205039978, // 0.00db
    MAX = 1, // +6.00db
    MIN = 0.0025138729251921177 // -inf (-150db)
}

export let trackVolume = TRACK_VOLUMES.DEFAULT;

/**
 * Handles messages from REAPER regarding track volume changes.
 *
 * @param {Message} msg - The message from REAPER containing the track volume value.
 *
 * @fires Console logs at the `log` level when the track volume changes to the default, max, or min values.
 */
export function handleTrackVolume(msg: Message, track: number) {
    const { args } = msg;
    trackVolume = args[0];

    console.log(`Track ${track} volume`, trackVolume);
    if (TRACK_VOLUMES.DEFAULT === trackVolume) {
        console.log('Track volume set to default');
    }

    if (TRACK_VOLUMES.MAX === trackVolume) {
        console.log(`Track ${track} volume at max`);
    }

    if (TRACK_VOLUMES.MIN === trackVolume) {
        console.log(`Track ${track} volume at min`);
    }
}
