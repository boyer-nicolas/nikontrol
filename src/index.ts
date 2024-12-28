// import * as readline from 'readline';
import { selectTrackBank } from '@/lib/banks';
import { CONFIG } from '@/lib/config';
import { Message, REAPER_EVENTS, Rinfo } from '@/lib/events';
import { handleTrackPan } from '@/lib/pan';
import { sendTrackCount } from '@/lib/tracks';
import { handleTrackVolume } from '@/lib/volume';
import { handleTrackVu } from '@/lib/vu';
import OSC from 'osc-js'

const client = new OSC({ plugin: new OSC.DatagramPlugin() });

client.on('open', () => {
    console.log('OSC Server connected');
    sendTrackCount(client);
    selectTrackBank(client, 0);
});

for (let track = 0; track < CONFIG.TRACK_COUNT; track++) {
    client.on(REAPER_EVENTS.TRACK_VOLUME(track), function (msg: Message) {
        handleTrackVolume(msg, track)
    });
    client.on(REAPER_EVENTS.TRACK_VU_METER(track), function (msg: Message) {
        handleTrackVu(msg, track)
    });
    client.on(REAPER_EVENTS.TRACK_PAN(track), function (msg: Message) {
        handleTrackPan(msg, track)
    });
    client.on(REAPER_EVENTS.TRACK_NAME(track), function (msg: Message) {
        console.log(`Track ${track} Name:`, msg.args[0]);
    });
}

client.on('error', (err: any) => {
    console.error(err);
});

client.open({
    port: 9000,
});


/**
 * Log a message and exit the process with status 0.
 */
export function handleExit() {
    client.close();
    console.log('Bye bye!');
    process.exit(0);
}


process.on('SIGTERM', () => {
    handleExit()
});

process.on('SIGINT', () => {
    handleExit()
});
