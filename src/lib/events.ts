import OSC from 'osc-js'

export enum DAWEvents {
    TrackVolume = `/track/:id/volume`,
    TrackPan = `/track/:id/pan`,
    TrackVuMeter = `/track/:id/vu`,
    TrackName = `/track/:id/name`,
    TrackMute = `/track/:id/mute`,
    TrackCount = '/device/track/count',
    TrackBankSelect = '/device/track/bank/select',
    TrackBankPrev = '/device/track/bank/-',
    TrackBankNext = '/device/track/bank/+',
    Metronome = '/click',
    Record = '/record',
    Stop = '/stop',
    Play = '/play',
    Pause = '/pause',
    Repeat = '/repeat',
}

export enum DAWSignals {
    TransportRecord = 'TRANSPORT_RECORD',
    TransportPlay = 'TANSPORT_PLAY',
    TransportPause = 'TRANSPORT_PAUSE',
    TransportStop = 'TRANSPORT_STOP',
    TransportMetronome = 'METRONOME',
    TransportRepeat = 'REPEAT',
    TracksCount = 'TRACKS_COUNT',
    BankNext = 'BANK_NEXT',
    BankPrev = 'BANK_PREV',
    BankSelect = 'BANK_SELECT',
}

/**
 * Returns a DAW endpoint string with the track ID replaced by the provided number,
 * if the endpoint string contains the string ":id".
 *
 * @param {DAWEvents} endpoint - The DAW endpoint string.
 * @param {number} id - The track ID to replace the ":id" string with.
 * @returns {string} - The endpoint string with the track ID replaced, or the original string if the endpoint did not contain ":id".
 * @throws {Error} - If the endpoint contains ":id" but the track ID is not provided.
 */
export function DAWEndpoint(endpoint: DAWEvents, id?: number) {
    if (endpoint.includes(':id') && id) {
        return endpoint.replace(':id', id.toString());
    }
    else if (endpoint.includes(':id')) {
        throw new Error('Track ID not provided');
    }

    return endpoint;
}

export type Message = {
    offset: number,
    address: string,
    types: string,
    args: number[] | string[]
}

export type Rinfo = {
    address: string,
    family: string,
    port: number,
    size: number
}

interface IOnEvent<T extends 'number' | 'string'> {
    client: OSC,
    event: string,
    callback: (value: T extends 'number' ? number : string) => void,
    expectedType?: T
}

/**
 * Listens for a specific DAW event and calls the given callback when
 * the event is received.
 *
 * @param {IOnEvent} opts - Options for the event listener.
 * @param {OSC} opts.client - The OSC client that will receive events.
 * @param {DAWEvent} opts.event - The event to listen for. Must
 * be one of the keys in the DAWEvents object.
 * @param {(value: number | string) => void} opts.callback - The callback that will
 * be called when the event is received. The callback will be called with a single
 * argument, the value of the event.
 * @param {'number' | 'string'} [opts.expectedType='number'] - The type of the
 * value that is expected in the event.
 */
export function onEvent<T extends 'number' | 'string'>({
    client,
    event,
    callback,
    expectedType
}: IOnEvent<T>) {
    client.on(event, (msg: Message) => {
        const { args } = msg;

        if (typeof args[0] !== expectedType) {
            throw new Error(`Error in event ${event}: Expected ${expectedType} but got ${typeof args[0]}`);
        }

        if (typeof args[0] === 'string' && expectedType === 'string') {
            return callback(args[0] as T extends 'number' ? number : string);
        } else if (typeof args[0] === 'number' && expectedType === 'number') {
            return callback(args[0] as T extends 'number' ? number : string);
        }

        throw new Error(`Error in event ${event}: Expected ${expectedType} but got ${typeof args[0]}`);
    });
}
