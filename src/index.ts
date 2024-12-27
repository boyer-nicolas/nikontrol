import { VPORT_NAME } from '@/lib/constants';
import { Input } from 'midi';

console.log(`Creating input ${VPORT_NAME}...`);
const input = new Input();

input.openVirtualPort(VPORT_NAME);

// Configure a callback.
console.log('Listening for MIDI messages...');
input.on('message', (msg) => {
    console.log(msg);
});


process.on('SIGTERM', () => {
    input.closePort()
    console.log('Bye bye!');
    process.exit(0);
});

process.on('SIGINT', () => {
    input.closePort()
    console.log('Bye bye!');
    process.exit(0);
});
