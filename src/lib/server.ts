import { Bank } from '@/controller/Bank';
import { Transport } from '@/controller/Transport';
import { Config } from '@/lib/config';
import { DawInterface } from '@/lib/DawInterface';

export class Server {
    public dawInterface: DawInterface
    public bank: Bank
    public transport: Transport

    /**
     * Construct a new Server object.
     *
     * Creates a new DAWInterface object, a new Bank object with the number of tracks specified in the configuration,
     * and a new Transport object.
     *
     * When the DAW connection is established, the callbacks for the Transport and the Bank are called.
     *
     * Listens for SIGTERM and SIGINT events to close the DAW connection and exit.
     */
    constructor() {
        // Init the DAW Interface
        this.dawInterface = new DawInterface()

        // Create the Bank and the Tracks
        this.bank = new Bank({
            tracksCount: Config.TracksCount,
            client: this.dawInterface.getClient(),
        })

        // Create the Transport
        this.transport = new Transport({
            client: this.dawInterface.getClient(),
        });

        // Configure the callback when the DAW connection is established
        this.dawInterface.onOpen(() => {
            this.transport.listen();
            this.bank.listen();
        });
    }

    /**
     * Starts the OSC server.
     *
     * Opens the OSC client to start communicating with the DAW.
     *
     * @returns {void}
     */
    public start(): void {
        this.dawInterface.open();
    }

    /**
     * Stops the OSC server.
     *
     * Closes the OSC client to stop communicating with the DAW.
     *
     * @returns {void}
     */
    public stop(): void {
        this.dawInterface.close()
    }
}
