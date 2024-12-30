import { signalLog } from '@/lib/logger';
import { boolToNum } from '@/lib/utils';
import OSC from 'osc-js'

enum DAWEvents {
    TrackVolume = `/track/:id/volume`,
    TrackPan = `/track/:id/pan`,
    TrackVuMeter = `/track/:id/vu`,
    TrackName = `/track/:id/name`,
    TrackMute = `/track/:id/mute`,
    TrackSolo = `/track/:id/solo`,
    TrackRecArm = `/track/:id/recarm`,
    TrackCount = '/device/track/count',
    BankSelect = '/device/track/bank/select',
    BankPrev = '/device/track/bank/-',
    BankNext = '/device/track/bank/+',
    Metronome = '/click',
    Record = '/record',
    Stop = '/stop',
    Play = '/play',
    Pause = '/pause',
    Repeat = '/repeat',
}

enum DAWSignals {
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

type Message = {
    offset: number,
    address: string,
    types: string,
    args: number[] | string[]
}

type MultiType<T> = T extends 'number' ? number : T extends 'string' ? string : boolean

interface IOnEvent<T extends 'number' | 'string' | 'boolean'> {
    client: OSC,
    event: string,
    callback: (value: MultiType<T>) => void
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
function onEvent<T extends 'number' | 'string' | 'boolean'>({
    client,
    event,
    callback,
    expectedType
}: IOnEvent<T>) {
    client.on(event, (msg: Message) => {
        const { args } = msg;

        if (typeof args[0] === 'string' && expectedType === 'string') {
            return callback(args[0] as MultiType<T>);
        } else if (typeof args[0] === 'number' && expectedType === 'number') {
            return callback(args[0] as MultiType<T>);
        } else if (typeof args[0] === 'number' && expectedType === 'boolean') {
            const value = args[0] as MultiType<T>;
            const boolValue = value !== 0;
            return callback(boolValue as MultiType<T>);
        }

        throw new Error(`Error in event ${event}: Expected ${expectedType} but got ${typeof args[0]}`);
    });
}

export const DAW = {
    Track(id: number) {
        return {
            Volume: DAWEvents.TrackVolume.replace(':id', id.toString()),
            Pan: DAWEvents.TrackPan.replace(':id', id.toString()),
            VuMeter: DAWEvents.TrackVuMeter.replace(':id', id.toString()),
            Name: DAWEvents.TrackName.replace(':id', id.toString()),
            Mute: DAWEvents.TrackMute.replace(':id', id.toString()),
            Solo: DAWEvents.TrackSolo.replace(':id', id.toString()),
            RecArm: DAWEvents.TrackRecArm.replace(':id', id.toString()),
            onVolume(client: OSC, callback: (value: number) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackVolume.replace(':id', id.toString()),
                    callback,
                    expectedType: 'number'
                });
            },
            onPan(client: OSC, callback: (value: number) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackPan.replace(':id', id.toString()),
                    callback,
                    expectedType: 'number'
                });
            },
            onVuMeter(client: OSC, callback: (value: number) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackVuMeter.replace(':id', id.toString()),
                    callback,
                    expectedType: 'number'
                });
            },
            onName(client: OSC, callback: (value: string) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackName.replace(':id', id.toString()),
                    callback,
                    expectedType: 'string'
                });
            },
            onMute(client: OSC, callback: (value: boolean) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackMute.replace(':id', id.toString()),
                    callback,
                    expectedType: 'boolean'
                });
            },
            onSolo(client: OSC, callback: (value: boolean) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackSolo.replace(':id', id.toString()),
                    callback,
                    expectedType: 'boolean'
                });
            },
            onRecArm(client: OSC, callback: (value: boolean) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackRecArm.replace(':id', id.toString()),
                    callback,
                    expectedType: 'boolean'
                });
            },
            setVolume(client: OSC, volume: number) {
                const event = DAWEvents.TrackVolume.replace(':id', id.toString());
                client.send(new OSC.Message(event, volume));
                signalLog(`TRACK_${id}_VOLUME`, volume, event);
            },
            setPan(client: OSC, pan: number) {
                const event = DAWEvents.TrackPan.replace(':id', id.toString());
                client.send(new OSC.Message(event, pan));
                signalLog(`TRACK_${id}_PAN`, pan, event);
            },
            setMute(client: OSC, muted: boolean) {
                const event = DAWEvents.TrackMute.replace(':id', id.toString());
                client.send(new OSC.Message(event, boolToNum(muted)));
                signalLog(`TRACK_${id}_MUTE`, boolToNum(muted), event);
            },
            setSolo(client: OSC, soloed: boolean) {
                const event = DAWEvents.TrackSolo.replace(':id', id.toString());
                client.send(new OSC.Message(event, boolToNum(soloed)));
                signalLog(`TRACK_${id}_SOLO`, boolToNum(soloed), event);
            },
            setRecArm(client: OSC, recArmed: boolean) {
                const event = DAWEvents.TrackRecArm.replace(':id', id.toString());
                client.send(new OSC.Message(event, boolToNum(recArmed)));
                signalLog(`TRACK_${id}_RECARM`, boolToNum(recArmed), event);
            }
        }
    },
    Transport: {
        Record: DAWEvents.Record,
        Play: DAWEvents.Play,
        Pause: DAWEvents.Pause,
        Stop: DAWEvents.Stop,
        Metronome: DAWEvents.Metronome,
        Repeat: DAWEvents.Repeat,
        onRecord(client: OSC, callback: (value: boolean) => void) {
            onEvent({
                client,
                event: DAWEvents.Record,
                callback,
                expectedType: 'boolean'
            });
        },
        onPlay(client: OSC, callback: (value: boolean) => void) {
            onEvent({
                client,
                event: DAWEvents.Play,
                callback,
                expectedType: 'boolean'
            });
        },
        onPause(client: OSC, callback: (value: boolean) => void) {
            onEvent({
                client,
                event: DAWEvents.Pause,
                callback,
                expectedType: 'boolean'
            });
        },
        onStop(client: OSC, callback: (value: boolean) => void) {
            onEvent({
                client,
                event: DAWEvents.Stop,
                callback,
                expectedType: 'boolean'
            });
        },
        onMetronome(client: OSC, callback: (value: boolean) => void) {
            onEvent({
                client,
                event: DAWEvents.Metronome,
                callback,
                expectedType: 'boolean'
            });
        },
        onRepeat(client: OSC, callback: (value: boolean) => void) {
            onEvent({
                client,
                event: DAWEvents.Repeat,
                callback,
                expectedType: 'boolean'
            });
        },
        setRecord(client: OSC) {
            const event = DAWEvents.Record;
            client.send(new OSC.Message(event, 1));
            signalLog(DAWSignals.TransportRecord, 1, event);
        },
        setPlay(client: OSC) {
            const event = DAWEvents.Play;
            client.send(new OSC.Message(event, 1));
            signalLog(DAWSignals.TransportPlay, 1, event);
        },
        setPause(client: OSC) {
            const event = DAWEvents.Pause;
            client.send(new OSC.Message(event, 1));
            signalLog(DAWSignals.TransportPause, 1, event);
        },
        setStop(client: OSC) {
            const event = DAWEvents.Stop;
            client.send(new OSC.Message(event, 1));
            signalLog(DAWSignals.TransportStop, 1, event);
        },
        setMetronome(client: OSC, value: boolean) {
            const event = DAWEvents.Metronome;
            client.send(new OSC.Message(event, boolToNum(value)));
            signalLog(DAWSignals.TransportMetronome, boolToNum(value), event);
        },
        setRepeat(client: OSC, value: boolean) {
            const event = DAWEvents.Repeat;
            client.send(new OSC.Message(event, boolToNum(value)));
            signalLog(DAWSignals.TransportRepeat, boolToNum(value), event);
        }
    },
    Bank: {
        Next: DAWEvents.BankNext,
        Prev: DAWEvents.BankPrev,
        Select: DAWEvents.BankSelect,
        onBankSelect(client: OSC, callback: (value: number) => void) {
            onEvent({
                client,
                event: DAWEvents.BankSelect,
                callback,
                expectedType: 'number'
            });
        },
        setBank(client: OSC, bank: number) {
            const event = DAWEvents.BankSelect;
            client.send(new OSC.Message(event, bank));
            signalLog(DAWSignals.BankSelect, bank, event);
        },
        setNextBank(client: OSC) {
            const event = DAWEvents.BankNext;
            client.send(new OSC.Message(event, 1));
            signalLog(DAWSignals.BankNext, 1, event);
        },
        setPrevBank(client: OSC) {
            const event = DAWEvents.BankPrev;
            client.send(new OSC.Message(event, 1));
            signalLog(DAWSignals.BankPrev, 1, event);
        },
        setTrackCount(client: OSC, count: number) {
            const event = DAWEvents.TrackCount;
            client.send(new OSC.Message(event, count));
            signalLog(DAWSignals.TracksCount, count, event);
        }

    }
}
