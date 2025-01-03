import { DAW } from 'interface/lib/events';
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
     */
    public listen() {
        // Is Recording
        DAW.Transport.onRecord(this.client, (value) => this.setRecording(value));

        // Is Playing
        DAW.Transport.onPlay(this.client, (value) => this.setPlaying(value));

        // Is Stopped
        DAW.Transport.onStop(this.client, (value) => this.setStopped(value));

        // Is Paused
        DAW.Transport.onPause(this.client, (value) => this.setPaused(value));

        // On Metronome
        DAW.Transport.onMetronome(this.client, (value) => this.setMetronomeOn(value));

        // On Repeat
        DAW.Transport.onRepeat(this.client, (value) => this.setRepeatOn(value));

        console.log('✅ Transport listening for events from DAW');
    }

    /**
     * Sends a message to the DAW to turn the metronome on or off.
     *
     * @param {boolean} value - `true` to turn the metronome on, `false` to turn it off.
     * @memberof Transport
     */
    public setDawMetronome(value: boolean) {
        DAW.Transport.setMetronome(this.client, value);
    }

    /**
     * Sends a message to the DAW to turn repeat on or off.
     *
     * @param {boolean} value - `true` to turn repeat on, `false` to turn repeat off.
     * @memberof Transport
     */
    public setDawRepeat(value: boolean) {
        DAW.Transport.setRepeat(this.client, value);
    }

    /**
     * Sends a message to the DAW to start playing.
     *
     * @memberof Transport
     */
    public setDawPlaying() {
        DAW.Transport.setPlay(this.client);
    }

    /**
     * Sends a message to the DAW to stop playing.
     *
     * @memberof Transport
     */
    public setDawStopped() {
        DAW.Transport.setStop(this.client);
    }

    /**
     * Sends a message to the DAW to start recording.
     *
     * @memberof Transport
     */
    public setDawRecording() {
        DAW.Transport.setRecord(this.client);
    }

    /**
     * Sends a message to the DAW to pause playing.
     *
     * @memberof Transport
     */
    public setDawPaused() {
        DAW.Transport.setPause(this.client);
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
