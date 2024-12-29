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
}

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

interface IOnEvent {
    client: OSC,
    event: string,
    callback: (value: number | string) => void
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
 */
export function onEvent({
    client,
    event,
    callback
}: IOnEvent) {
    client.on(event, (msg: Message) => {
        const { args } = msg;
        callback(args[0]);
    });
}
