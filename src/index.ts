// import * as readline from 'readline';
import OSC from 'osc-js'

const client = new OSC({ plugin: new OSC.DatagramPlugin() });

const defaultTrackVolume = 0.7160000205039978; // ==> 0.00db
const maxTrackVolume = 1; // ==> 6.00db
const minTrackVolume = 0.0025138729251921177;

// Volumes in DB to float
const VOLUMES = {
    0.00: defaultTrackVolume,
    6.00: maxTrackVolume,
    'inf': minTrackVolume
}

let trackVolume = defaultTrackVolume;

client.on('open', () => {
    console.log('OSC Server connected');
});

client.on("/track/1/volume", function (msg, rinfo) {
    // console.log(msg);
    const { args } = msg;
    trackVolume = args[0];
    console.log('trackVolume', trackVolume);
    if (defaultTrackVolume === trackVolume) {
        console.log('Track volume back to default');
    }

    if (maxTrackVolume === trackVolume) {
        console.log('Track volume at max');
    }

    if (minTrackVolume === trackVolume) {
        console.log('Track volume at min');
    }
});

client.on('error', (err) => {
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
