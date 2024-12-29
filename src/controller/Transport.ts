import { DAWEvents, DAWSignals, onEvent } from '@/lib/events';
import { signalLog } from '@/lib/logger';
import { boolToNum } from '@/lib/utils';
import OSC from 'osc-js';

interface ITransport {
    client: OSC
}

export class Transport {
    public client: OSC;
    public recording: boolean = false;
    public playing: boolean = false;
    public paused: boolean = false;
    public stopped: boolean = true;
    public metronome: boolean = false;
    public repeat: boolean = false;

    /**
     * Construct a Transport object with the given OSC client.
     *
     * @param {OSC} client - The OSC client to use for communicating with the DAW.
     */
    constructor({
        client
    }: ITransport) {
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

        // On Metronome
        onEvent({
            client: this.client,
            event: DAWEvents.Metronome,
            callback: (value) => {
                this.setMetronomeOn(value === 1);
            },
            expectedType: 'number'
        });

        // On Repeat
        onEvent({
            client: this.client,
            event: DAWEvents.Repeat,
            callback: (value) => {
                this.setRepeatOn(value === 1);
            },
            expectedType: 'number'
        });

        console.log('✅ Transport listening for events from DAW');
    }

    /**
     * Sends a message to the DAW to turn the metronome on or off.
     *
     * @param {boolean} value - `true` to turn the metronome on, `false` to turn it off.
     * @memberof Transport
     */
    public setDawMetronome(value: boolean) {
        this.client.send(new OSC.Message(DAWEvents.Metronome, boolToNum(value)));
        signalLog(DAWSignals.TransportMetronome, boolToNum(value), DAWEvents.Metronome);
    }

    /**
     * Sends a message to the DAW to turn repeat on or off.
     *
     * @param {boolean} value - `true` to turn repeat on, `false` to turn repeat off.
     * @memberof Transport
     */
    public setDawRepeat(value: boolean) {
        this.client.send(new OSC.Message(DAWEvents.Repeat, boolToNum(value)));
        signalLog(DAWSignals.TransportRepeat, boolToNum(value), DAWEvents.Repeat);
    }

    /**
     * Sends a message to the DAW to start playing.
     *
     * @memberof Transport
     */
    public setDawPlaying() {
        this.client.send(new OSC.Message(DAWEvents.Play, boolToNum(true)));
        signalLog(DAWSignals.TransportPlay, boolToNum(true), DAWEvents.Play);
    }

    /**
     * Sends a message to the DAW to stop playing.
     *
     * @memberof Transport
     */
    public setDawStopped() {
        this.client.send(new OSC.Message(DAWEvents.Stop, boolToNum(true)));
        signalLog(DAWSignals.TransportStop, boolToNum(true), DAWEvents.Stop);
    }

    /**
     * Sends a message to the DAW to start recording.
     *
     * @memberof Transport
     */
    public setDawRecording() {
        this.client.send(new OSC.Message(DAWEvents.Record, boolToNum(true)));
        signalLog(DAWSignals.TransportRecord, boolToNum(true), DAWEvents.Record);
    }

    /**
     * Sends a message to the DAW to pause playing.
     *
     * @memberof Transport
     */
    public setDawPaused() {
        this.client.send(new OSC.Message(DAWEvents.Pause, boolToNum(true)));
        signalLog(DAWSignals.TransportPause, boolToNum(true), DAWEvents.Pause);
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
     * Set the metronome on or off.
     *
     * @param {boolean} value - `true` to turn the metronome on, `false` to turn it off.
     * @memberof Transport
     */
    public setMetronomeOn(value: boolean) {
        this.metronome = value;
        console.log('🎵 Metronome', value);
    }

    /**
     * Set the transport repeat state.
     *
     * @param {boolean} value - `true` to turn repeat on, `false` to turn repeat off.
     * @memberof Transport
     */
    public setRepeatOn(value: boolean) {
        this.repeat = value;
        console.log('🔁 Repeat', value);
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
