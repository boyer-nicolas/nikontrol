// import * as readline from 'readline';
import { Bank } from '@/lib/Bank';
import { CONFIG } from '@/lib/config';
import { Transport } from '@/lib/Transport';
import OSC from 'osc-js'

const client = new OSC({ plugin: new OSC.DatagramPlugin() });

console.log('➡️ OSC Client created');

const bank = new Bank({
    tracksCount: CONFIG.TRACK_COUNT,
    client
})

const transport = new Transport(client);

client.on('open', () => {
    console.log('✅', 'OSC Client connected');
    bank.listen();
    transport.listen();
});

client.on('error', (err: unknown) => {
    console.error('❌', err);
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
