import { Message } from '@/lib/events';

export enum TRACK_PANS {
    CENTER = 0.5,
    RIGHT = 1,
    LEFT = 0
}

export let trackPan = TRACK_PANS.CENTER;

/**
 * Handles messages from REAPER regarding track pan changes.
 *
 * @param {Message} msg - The message from REAPER containing the track pan value.
 *
 * @fires Console logs at the `log` level when the track pan changes to the default, max, or min values.
 */
export function handleTrackPan(msg: Message, track: number) {
    const { args } = msg;
    trackPan = args[0];

    console.log(`Track ${track} pan`, trackPan);
    if (TRACK_PANS.CENTER === trackPan) {
        console.log(`Track ${track} pan set to CENTER`);
    }

    if (TRACK_PANS.RIGHT === trackPan) {
        console.log(`Track ${track} pan set to RIGHT`);
    }

    if (TRACK_PANS.LEFT === trackPan) {
        console.log(`Track ${track} pan set to LEFT`);
    }
}
