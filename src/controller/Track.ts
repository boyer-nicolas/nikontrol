import { DAW } from '@/lib/events';
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
    public soloed: boolean = false;
    public recArmed: boolean = false;
    public monitor: 'ON' | 'AUTO' | 'OFF' = 'OFF';

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

        console.log(`➡️ Track ${this.id} created`);
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
    public listen(): void {

        // Volume
        DAW.Track(this.id).onVolume(this.client, (value) => this.setVolume(value))

        // Pan
        DAW.Track(this.id).onPan(this.client, (value) => this.setPan(value))

        // VU Meter
        DAW.Track(this.id).onVuMeter(this.client, (value) => this.setVuMeter(value))

        // Name
        DAW.Track(this.id).onName(this.client, (value) => this.setName(value))

        // Mute
        DAW.Track(this.id).onMute(this.client, (value) => this.setMuted(value))

        // Solo
        DAW.Track(this.id).onSolo(this.client, (value) => this.setSoloed(value))

        // RecArm
        DAW.Track(this.id).onRecArm(this.client, (value) => this.setRecArmed(value))

        // Monitor
        DAW.Track(this.id).onMonitor(this.client, (value) => this.setMonitored(value))

        console.log(`✅ Track ${this.id} listening for events from DAW...`);
    }

    /**
     * Sets the volume of the track.
     *
     * @param {number} volume - The new volume, between 0 (min) and 1 (max).
     * @memberof Track
     */
    private setVolume(volume: number): void {
        console.log(`Track ${this.id} Volume:`, volume);
        this.volume = volume;
    }

    /**
     * Returns the current volume of the track.
     *
     * @returns {number} - The current volume, between 0 (min) and 1 (max).
     * @memberof Track
     */
    public getVolume(): number {
        return this.volume;
    }

    /**
     * Sets the volume of the track in the DAW to the given level.
     *
     * @param {number} level - The new volume level, between 0 (min) and 1 (max).
     * @memberof Track
     */
    public setDawVolumeLevel(level: number) {
        DAW.Track(this.id).setVolume(this.client, level);
    }

    /**
     * Sets the pan of the track.
     *
     * @param {number} pan - The new pan, between 0 (left) and 1 (right).
     * @memberof Track
     */
    private setPan(pan: number): void {
        console.log(`Track ${this.id} Pan:`, pan);
        this.pan = pan;
    }

    /**
     * Returns the current pan of the track.
     *
     * @returns {number} - The current pan, between 0 (left) and 1 (right).
     * @memberof Track
     */
    public getPan(): number {
        return this.pan;
    }

    public setDawPan(level: number) {
        DAW.Track(this.id).setPan(this.client, level);
    }

    /**
     * Sets the VU meter of the track.
     *
     * @param {number} vuMeter - The new VU meter value, between 0 (min) and 1 (max).
     * @memberof Track
     */
    private setVuMeter(vuMeter: number): void {
        this.vuMeter = vuMeter;
    }

    /**
     * Returns the current VU meter of the track.
     *
     * @returns {number} - The current VU meter value, between 0 (min) and 1 (max).
     * @memberof Track
     */
    public getVuMeter(): number {
        return this.vuMeter;
    }

    /**
     * Sets the name of the track.
     *
     * @param {string} name - The new name of the track.
     * @memberof Track
     */
    private setName(name: string): void {
        console.log(`Track ${this.id} Name:`, name);
        this.name = name;
    }

    /**
     * Returns the name of the track.
     *
     * @returns {string} - The name of the track.
     * @memberof Track
     */
    public getName(): string {
        return this.name;
    }

    private setMuted(muted: boolean): void {
        console.log(`Track ${this.id} Muted:`, muted);
        this.muted = muted;
    }

    /**
     * Returns whether the track is muted.
     *
     * @returns {boolean} - Whether the track is muted.
     * @memberof Track
     */
    public isMuted(): boolean {
        return this.muted;
    }

    /**
     * Sets the mute status of the track.
     *
     * @param {boolean} muted - Whether the track is muted.
     * @memberof Track
     */
    public setDawMute(muted: boolean) {
        DAW.Track(this.id).setMute(this.client, muted);
    }

    /**
     * Sets the solo status of the track.
     *
     * @param {boolean} soloed - Whether the track is soloed.
     * @memberof Track
     */
    private setSoloed(soloed: boolean): void {
        console.log(`Track ${this.id} Soloed:`, soloed);
        this.soloed = soloed;
    }

    /**
     * Returns whether the track is soloed.
     *
     * @returns {boolean} - Whether the track is soloed.
     * @memberof Track
     */
    public isSoloed(): boolean {
        return this.soloed;
    }

    /**
     * Sets the solo status of the track.
     *
     * @param {boolean} soloed - Whether the track is soloed.
     * @memberof Track
     */
    public setDawSolo(soloed: boolean) {
        DAW.Track(this.id).setSolo(this.client, soloed);
    }

    /**
     * Sets whether the track is armed for recording.
     *
     * @param {boolean} recArmed - Whether the track is armed for recording.
     * @memberof Track
     */
    private setRecArmed(recArmed: boolean): void {
        console.log(`Track ${this.id} RecArmed:`, recArmed);
        this.recArmed = recArmed;
    }

    /**
     * Returns whether the track is armed for recording.
     *
     * @returns {boolean} - Whether the track is armed for recording.
     * @memberof Track
     */
    public getRecArmed(): boolean {
        return this.recArmed;
    }

    /**
     * Sends a message to the DAW to arm or disarm recording on the track.
     *
     * @param {boolean} recArmed - Whether the track is armed for recording.
     * @memberof Track
     */
    public setDawRecArm(recArmed: boolean) {
        DAW.Track(this.id).setRecArm(this.client, recArmed);
    }

    /**
     * Sets whether the track is monitored.
     *
     * @param {boolean} monitored - Whether the track is monitored.
     * @memberof Track
     */
    private setMonitored(monitored: number): void {
        function getMonitredValue() {
            if (monitored === 1) {
                return 'ON';
            } else if (monitored === 2) {
                return 'AUTO'
            }

            return 'OFF';
        }
        console.log(`Track ${this.id} Monitored:`, getMonitredValue());
        this.monitor = getMonitredValue();
    }

    /**
     * Returns whether the track is monitored.
     *
     * @returns {boolean} - Whether the track is monitored.
     * @memberof Track
     */
    public getMonitoring(): 'ON' | 'AUTO' | 'OFF' {
        return this.monitor;
    }

    /**
     * Sends a message to the DAW to monitor or unmonitor the track.
     *
     * @param {boolean} monitored - Whether the track is monitored.
     * @memberof Track
     */
    public setDawMonitor(monitor: number) {
        DAW.Track(this.id).setMonitor(this.client, monitor);
    }

}
