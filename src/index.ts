import { Bank } from '@/controller/Bank';
import { Transport } from '@/controller/Transport';
import { Config } from '@/lib/config';
import { DawInterface } from '@/lib/DawInterface';

// Init the DAW Interface
const dawInterface = new DawInterface()

// Create the Bank and the Tracks
const bank = new Bank({
    tracksCount: Config.TracksCount,
    client: dawInterface.getClient(),
})

// Create the Transport
const transport = new Transport({
    client: dawInterface.getClient(),
});

// Configure the callback when the DAW connection is established
dawInterface.onOpen(() => {
    transport.listen();
    bank.listen();
});

// Try to connect to the DAW
dawInterface.open();

process.on('SIGTERM', () => {
    console.log('Bye bye!');
    dawInterface.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Bye bye!');
    dawInterface.close();
    process.exit(0);
});
