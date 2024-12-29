import OSC from 'osc-js';

export class Transport {
    public client: OSC;
    public isRecording: boolean = false;
    public isPlaying: boolean = false;
    public loop: boolean = false;
    public stopped: boolean = false;
    public paused: boolean = false;

    constructor(client: OSC) {
        this.client = client;
    }
}
