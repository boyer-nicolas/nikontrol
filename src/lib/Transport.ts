import { DAWEvents, onEvent } from '@/lib/events';
import { signalLog } from '@/lib/logger';
import OSC from 'osc-js';

export class Transport {
    public client: OSC;
    public recording: boolean = false;
    public playing: boolean = false;
    public loop: boolean = false;
    public paused: boolean = false;
    public stopped: boolean = true;

    /**
     * Construct a Transport object with the given OSC client.
     *
     * @param {OSC} client - The OSC client to use for communicating with the DAW.
     */
    constructor(client: OSC) {
        this.client = client;
    }

    /**
     * Listen for messages from the DAW related to the transport.
     *
     * The following messages are listened for:
     * - /record {int}
     * - /play {int}
     *
     * When any of these messages are received, the corresponding property of the Transport object is updated.
     */
    public listen() {
        // Is Recording
        onEvent({
            client: this.client,
            event: DAWEvents.Record,
            callback: (value) => {
                this.setRecording(value === 1);
            },
            expectedType: 'number'
        });

        // Is Playing
        onEvent({
            client: this.client,
            event: DAWEvents.Play,
            callback: (value) => {
                this.setPlaying(value === 1);
            },
            expectedType: 'number'
        });

        // On stop
        onEvent({
            client: this.client,
            event: DAWEvents.Stop,
            callback: (value) => {
                this.setStopped(value === 1);
            },
            expectedType: 'number'
        });

        // On pause
        onEvent({
            client: this.client,
            event: DAWEvents.Pause,
            callback: (value) => {
                this.setPaused(value === 1);
            },
            expectedType: 'number'
        });

        console.log('✅ Transport listening for events from DAW');
    }

    /**
     * Sends a message to the DAW to start playing.
     *
     * @memberof Transport
     */
    public play() {
        this.client.send(new OSC.Message(DAWEvents.Play, 1));
        signalLog('▶️  Play');
    }

    /**
     * Sends a message to the DAW to stop playing.
     *
     * @memberof Transport
     */
    public stop() {
        this.client.send(new OSC.Message(DAWEvents.Stop, 1));
        signalLog('⏹️  Stop');
    }

    /**
     * Sends a message to the DAW to start recording.
     *
     * @memberof Transport
     */
    public record() {
        this.client.send(new OSC.Message(DAWEvents.Record, 1));
        signalLog('⏺️  Record');
    }

    /**
     * Sends a message to the DAW to pause playing.
     *
     * @memberof Transport
     */
    public pause() {
        this.client.send(new OSC.Message(DAWEvents.Pause, 1));
        signalLog('⏸️  Pause');
    }

    /**
     * Set the transport playing state.
     *
     * @param {boolean} value - Whether the transport is playing or not.
     * @memberof Transport
     */
    public setPlaying(value: boolean) {
        this.playing = value;
        console.log('▶️  Transport playing', value);
    }

    /**
     * Set the transport recording state.
     *
     * @param {boolean} value - Whether the transport is recording or not.
     * @memberof Transport
     */
    public setRecording(value: boolean) {
        this.recording = value;
        console.log('⏺️  Transport recording', value);
    }

    /**
     * Set the transport stopped state.
     *
     * @param {boolean} value - Whether the transport is stopped or not.
     * @memberof Transport
     */
    public setStopped(value: boolean) {
        this.stopped = value;
        console.log('⏹️  Transport stopped', value);
    }

    /**
     * Set the transport paused state.
     *
     * @param {boolean} value - Whether the transport is paused or not.
     * @memberof Transport
     */
    public setPaused(value: boolean) {
        this.paused = value;
        console.log('⏸️  Transport paused', value);
    }
}
