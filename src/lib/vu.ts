import { Message } from '@/lib/events';

export enum TRACK_VU_METERS {
    MAX = 1, // +6.00db
    MIN = 0 // -inf (-150db)
}

/**
 * Handles messages from REAPER regarding track VU meter changes.
 *
 * @param {Message} msg - The message from REAPER containing the track VU value.
 *
 * @fires Console logs at the `log` level when the track VU changes to the max or min values.
 */
export function handleTrackVu(msg: Message, track: number) {
    const { args } = msg;
    const trackVu = args[0];

    console.log(`Track ${track} VU`, trackVu);

    if (TRACK_VU_METERS.MAX === trackVu) {
        console.log(`Track ${track} VU at max`);
    }

    if (TRACK_VU_METERS.MIN === trackVu) {
        console.log(`Track ${track} VU at min`);
    }
}

