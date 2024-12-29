import OSC from 'osc-js'

export class DawInterface {
    private client: OSC;
    public started: boolean = false;

    /**
     * Creates a new DAW interface.
     *
     * Creates a new OSC client and sets up an error handler.
     */
    constructor() {
        this.client = new OSC({ plugin: new OSC.DatagramPlugin() });

        this.client.on('error', (err: unknown) => {
            console.error('❌', err);
        });

        console.log('➡️ OSC Client created');
    }

    /**
     * Gets the OSC client for this DAW interface.
     *
     * @returns {OSC} - The OSC client.
     */
    getClient(): OSC {
        return this.client;
    }

    public checkConnection(): boolean {
        return this.started;
    }

    /**
     * Starts the OSC client.
     *
     * Opens the OSC client on port 9000. The client must be stopped before it can be started again.
     */
    open(): void {
        this.client.open({
            port: 9000,
        });
    }

    /**
     * Calls the given callback when the OSC client is open.
     *
     * The callback will be called once the OSC client is open and ready to send messages.
     * @param {() => void} callback - The callback to call when the client is open.
     */
    onOpen(callback: () => void): void {
        this.client.on('open', () => {
            console.log('✅', 'OSC Client connected');
            this.started = true;
            callback();
        });
    }

    /**
     * Calls the given callback when the OSC client is closed.
     *
     * The callback will be called once the OSC client is closed and disconnected.
     * @param {() => void} callback - The callback to call when the client is closed.
     */
    onClose(callback: () => void): void {
        this.client.on('close', () => {
            console.log('❌', 'OSC Client disconnected');
            callback();
        });
    }

    /**
     * Closes the OSC client.
     *
     * Closes the OSC client and stops it from sending and receiving messages.
     * The client must be started again before it can be used.
     */
    close(): void {
        this.client.close();
        this.started = false;
    }
}


