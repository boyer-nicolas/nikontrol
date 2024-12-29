import { DAWEndpoint, onEvent, DAWEvents } from '@/lib/events';
import OSC from 'osc-js';

interface ITrack {
    client: OSC;
    id: number;
}

export class Track {
    public name: string;
    public id: number;
    protected client: OSC;

    // Volume
    public minVolume: number = 0.00; // -150db (-inf)
    public maxVolume: number = 1.00; // +6.00db
    public defaultVolume: number = 0.71; // 0.00db
    public volume: number = this.defaultVolume; // 0.00db

    // Pan
    public minPan: number = 0.00; // Left
    public maxPan: number = 1.00; // Right
    public defaultPan: number = 0.50; // Center
    public pan: number = this.defaultPan; // Center

    // VU meter
    public minVuMeter: number = 0.00; // -inf
    public maxVuMeter: number = 1.00; // +6.00db
    public defaultVuMeter: number = 0.00; // -inf
    public vuMeter: number = this.defaultVuMeter; // -inf

    // Modifiers
    public muted: boolean = false;

    /**
     * Constructs a Track object with the given client and id.
     *
     * @param {Object} opts - An object with the following properties:
     *   client {OSC} - The OSC client to use for communicating with the DAW.
     *   id {number} - The id of the track in the DAW.
     * @memberof Track
     */
    constructor({ client, id }: ITrack) {
        this.client = client;
        this.id = id;
        this.volume = this.defaultVolume;
        this.name = '';

        console.log(`Track ${this.id} created`);
    }

    /**
     * Listens for messages from the DAW related to this track.
     *
     * The following messages are listened for:
     * - /track/{trackId}/volume {float}
     * - /track/{trackId}/pan {float}
     * - /track/{trackId}/vu_meter {float}
     * - /track/{trackId}/name {string}
     *
     * When any of these messages are received, the corresponding property of the Track object is updated.
     */
    listen(): void {
        // Volume
        onEvent({
            client: this.client,
            event: DAWEndpoint(DAWEvents.TrackVolume, this.id),
            callback: (value) => {
                if (typeof value !== 'number') {
                    throw new Error(`Track ${this.id} Volume is not a number`);
                }

                this.setVolume(value);
            }
        });

        // Pan
        onEvent({
            client: this.client,
            event: DAWEndpoint(DAWEvents.TrackPan, this.id),

            callback: (value) => {
                if (typeof value !== 'number') {
                    throw new Error(`Track ${this.id} Pan is not a number`);
                }

                this.setPan(value);
            }
        });

        // VU Meter
        onEvent({
            client: this.client,
            event: DAWEndpoint(DAWEvents.TrackVuMeter, this.id),

            callback: (value) => {
                if (typeof value !== 'number') {
                    throw new Error(`Track ${this.id} VU Meter is not a number`);
                }

                this.setVuMeter(value);
            }
        });

        // Name
        onEvent({
            client: this.client,
            event: DAWEndpoint(DAWEvents.TrackName, this.id),

            callback: (value) => {
                if (typeof value !== 'string') {
                    throw new Error(`Track ${this.id} Name is not a string`);
                }

                this.setName(value);
            }
        });

        // Mute
        onEvent({
            client: this.client,
            event: DAWEndpoint(DAWEvents.TrackMute, this.id),

            callback: (value) => {
                if (typeof value !== 'number') {
                    throw new Error(`Track ${this.id} VU Meter is not a number`);
                }

                // Value is 1 or 0
                this.setMuted(value === 1);
            }
        });

        console.log(`Track ${this.id} listening for events from DAW...`);
    }

    /**
     * Sets the volume of the track.
     *
     * @param {number} volume - The new volume, between 0 (min) and 1 (max).
     * @memberof Track
     */
    setVolume(volume: number): void {
        console.log(`Track ${this.id} Volume:`, volume);
        this.volume = volume;
    }

    /**
     * Returns the current volume of the track.
     *
     * @returns {number} - The current volume, between 0 (min) and 1 (max).
     * @memberof Track
     */
    getVolume(): number {
        return this.volume;
    }

    /**
     * Sets the pan of the track.
     *
     * @param {number} pan - The new pan, between 0 (left) and 1 (right).
     * @memberof Track
     */
    setPan(pan: number): void {
        console.log(`Track ${this.id} Pan:`, pan);
        this.pan = pan;
    }

    /**
     * Returns the current pan of the track.
     *
     * @returns {number} - The current pan, between 0 (left) and 1 (right).
     * @memberof Track
     */
    getPan(): number {
        return this.pan;
    }

    /**
     * Sets the VU meter of the track.
     *
     * @param {number} vuMeter - The new VU meter value, between 0 (min) and 1 (max).
     * @memberof Track
     */
    setVuMeter(vuMeter: number): void {
        console.log(`Track ${this.id} VU Meter:`, vuMeter);
        this.vuMeter = vuMeter;
    }

    /**
     * Returns the current VU meter of the track.
     *
     * @returns {number} - The current VU meter value, between 0 (min) and 1 (max).
     * @memberof Track
     */
    getVuMeter(): number {
        return this.vuMeter;
    }

    /**
     * Sets the name of the track.
     *
     * @param {string} name - The new name of the track.
     * @memberof Track
     */
    setName(name: string): void {
        console.log(`Track ${this.id} Name:`, name);
        this.name = name;
    }

    /**
     * Returns the name of the track.
     *
     * @returns {string} - The name of the track.
     * @memberof Track
     */
    getName(): string {
        return this.name;
    }

    setMuted(muted: boolean): void {
        console.log(`Track ${this.id} Muted:`, muted);
        this.muted = muted;
    }

    /**
     * Returns whether the track is muted.
     *
     * @returns {boolean} - Whether the track is muted.
     * @memberof Track
     */
    isMuted(): boolean {
        return this.muted;
    }
}
