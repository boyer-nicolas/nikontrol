// import * as readline from 'readline';
import { Message, REAPER_EVENTS, Rinfo } from '@/lib/events';
import { handleTrackPan } from '@/lib/pan';
import { handleTrackVolume } from '@/lib/volume';
import OSC from 'osc-js'

const client = new OSC({ plugin: new OSC.DatagramPlugin() });

client.on('open', () => {
    console.log('OSC Server connected');
});


client.on(REAPER_EVENTS.trackVolume(1), function (msg: Message) {
    handleTrackVolume(msg)
});

client.on(REAPER_EVENTS.trackPan(1), function (msg: Message) {
    handleTrackPan(msg)
});

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
