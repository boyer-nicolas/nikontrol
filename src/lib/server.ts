import { Bank } from '@/controller/Bank';
import { Transport } from '@/controller/Transport';
import { Config } from '@/lib/config';
import { DawInterface } from '@/lib/DawInterface';

/**
 * Initializes the server.
 *
 * Starts the OSC server and sets up the connection with the DAW.
 *
 * The server is configured to exit when the process receives a SIGTERM or SIGINT
 * signal. When the server exits, the DAW connection is closed.
 *
 * @returns {void}
 */
export function server() {
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

    process.on('SIGTERM', () => {
        console.log('Bye bye!');
        if (dawInterface.started) {
            dawInterface.close()
        }
        process.exit(0);
    });

    process.on('SIGINT', () => {
        console.log('Bye bye!');
        if (dawInterface.started) {
            dawInterface.close()
        }
        process.exit(0);
    });

    dawInterface.open();

    return {
        dawInterface,
        bank,
        transport
    }

}
