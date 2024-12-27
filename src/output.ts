import { VPORT_NAME } from '@/lib/constants';
import { Output } from 'midi';
import * as readline from 'readline';
import osc from 'node-osc'

const output = new Output();

// Configure a callback.
console.log(`Opening port ${VPORT_NAME}... (Ctrl+C to exit)`);
output.openVirtualPort(VPORT_NAME);

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

function handleExit() {
    console.log('Closing port...');
    output.closePort();
    console.log('Bye bye!');
    process.exit(0);
}

type Key = {
    sequence: string;
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
    code?: string;
}

const midiCoarseValue = 7;
const midiChannel = 1;

function getFineValue(coarseValue: number) {
    return Math.floor(coarseValue + 32);
}

function sendVolumeUp() {
    const statusByte = 0xB0 + midiChannel;
    output.sendMessage([statusByte, getFineValue(midiCoarseValue), 127]);
    console.log(new Date().toLocaleString(), 'Sent message to MIDI output');
}

function sendVolumeDown() {
    const statusByte = 0xB0 + midiChannel;
    output.sendMessage([statusByte, getFineValue(midiCoarseValue), 0]);
    console.log(new Date().toLocaleString(), 'Sent message to MIDI output');
}

process.stdin.on('keypress', (index, key: Key) => {
    if (key.ctrl && key.name === 'c') {
        handleExit()
    } else {
        const date = new Date();
        console.log();
        console.log(`Date: ${date.toLocaleString()}`);
        console.log(`You pressed the "${key.name}" key`);
        console.log();
        console.log(key);
        console.log();

        if (key.name === 'up') {
            sendVolumeUp();
        } else if (key.name === 'down') {
            sendVolumeDown();
        }
    }
});

const oscServer = new osc.Server(9000, '0.0.0.0'); // Create an OSC server
console.log('OSC server listening on port 3333');

oscServer.on("message", function (msg, rinfo) {
    console.log("New Reaper message:");
    console.log(msg);
});

// Send an OSC message to Reaper to get the volume
const oscClient = new osc.Client('localhost', 8000); // Replace with Reaper's OSC port
console.log('OSC client connected to Reaper');

function getRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function getVolume() {
    oscClient.send({
        address: '/track/1/volume',
        args: [getRandomFloat(0, 1)]
    }, function (err) {
        if (err) console.error(err);
    });
}

setInterval(() => {
    getVolume();
}, 1000);

process.on('SIGTERM', () => {
    handleExit()
});

process.on('SIGINT', () => {
    handleExit()
});
