import { VPORT_NAME } from '@/lib/constants';
import { Input } from 'midi';

const input = new Input();

input.openVirtualPort(VPORT_NAME)

// Configure a callback.
console.log(`Opening port ${VPORT_NAME}... (Ctrl+C to exit)`);
input.on('message', (number, message) => {
    console.log('number', number);
    console.log('message', message);
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
