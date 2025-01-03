import { signalLog } from "interface/lib/logger";
import { boolToNum } from "interface/lib/utils";
import OSC from "osc-js";

enum DAWEvents {
    TrackVolume = `/track/:id/volume`,
    TrackPan = `/track/:id/pan`,
    TrackVuMeter = `/track/:id/vu`,
    TrackName = `/track/:id/name`,
    TrackMute = `/track/:id/mute`,
    TrackSolo = `/track/:id/solo`,
    TrackRecArm = `/track/:id/recarm`,
    TrackMonitor = `/track/:id/monitor`,
    TracksCount = "/device/track/count",
    BankSelect = "/device/track/bank/select",
    BankPrev = "/device/track/bank/-",
    BankNext = "/device/track/bank/+",
    Metronome = "/click",
    Record = "/record",
    Stop = "/stop",
    Play = "/play",
    Pause = "/pause",
    Repeat = "/repeat",
}

enum DAWSignals {
    TransportRecord = "TRANSPORT_RECORD",
    TransportPlay = "TANSPORT_PLAY",
    TransportPause = "TRANSPORT_PAUSE",
    TransportStop = "TRANSPORT_STOP",
    TransportMetronome = "METRONOME",
    TransportRepeat = "REPEAT",
    TracksCount = "TRACKS_COUNT",
    BankNext = "BANK_NEXT",
    BankPrev = "BANK_PREV",
    BankSelect = "BANK_SELECT",
}

type Message = {
    offset: number;
    address: string;
    types: string;
    args: number[] | string[];
};

type MultiType<T> = T extends "number"
    ? number
    : T extends "string"
    ? string
    : boolean;

interface IOnEvent<T extends "number" | "string" | "boolean"> {
    client: OSC;
    event: string;
    callback: (value: MultiType<T>) => void;
    expectedType?: T;
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
function onEvent<T extends "number" | "string" | "boolean">({
    client,
    event,
    callback,
    expectedType,
}: IOnEvent<T>) {
    client.on(event, (msg: Message) => {
        const { args } = msg;

        if (typeof args[0] === "string" && expectedType === "string") {
            return callback(args[0] as MultiType<T>);
        } else if (typeof args[0] === "number" && expectedType === "number") {
            return callback(args[0] as MultiType<T>);
        } else if (typeof args[0] === "number" && expectedType === "boolean") {
            const value = args[0] as MultiType<T>;
            const boolValue = value !== 0;
            return callback(boolValue as MultiType<T>);
        }

        throw new Error(
            `Error in event ${event}: Expected ${expectedType} but got ${typeof args[0]}`
        );
    });
}

interface ISendMessage {
    client: OSC;
    path: string;
    value: string | number;
    signal: string;
}

/**
 * Sends an OSC message to the DAW and logs the message as a signal.
 *
 * @param {ISendMessage} opts - Options for the message to send.
 * @param {OSC} opts.client - The OSC client that will send the message.
 * @param {string} opts.path - The path of the message to send.
 * @param {string | number} opts.value - The value of the message to send.
 * @param {string} opts.signal - The name of the signal to log.
 */
function sendMessage({ client, path, value, signal }: ISendMessage) {
    client.send(new OSC.Message(path, value), {
        port: 8000,
    });

    signalLog(signal, value, path);
}

export const DAW = {
    Track(id: number) {
        return {
            Volume: DAWEvents.TrackVolume.replace(":id", id.toString()),
            Pan: DAWEvents.TrackPan.replace(":id", id.toString()),
            VuMeter: DAWEvents.TrackVuMeter.replace(":id", id.toString()),
            Name: DAWEvents.TrackName.replace(":id", id.toString()),
            Mute: DAWEvents.TrackMute.replace(":id", id.toString()),
            Solo: DAWEvents.TrackSolo.replace(":id", id.toString()),
            RecArm: DAWEvents.TrackRecArm.replace(":id", id.toString()),
            onVolume(client: OSC, callback: (value: number) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackVolume.replace(":id", id.toString()),
                    callback,
                    expectedType: "number",
                });
            },
            onPan(client: OSC, callback: (value: number) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackPan.replace(":id", id.toString()),
                    callback,
                    expectedType: "number",
                });
            },
            onVuMeter(client: OSC, callback: (value: number) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackVuMeter.replace(":id", id.toString()),
                    callback,
                    expectedType: "number",
                });
            },
            onName(client: OSC, callback: (value: string) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackName.replace(":id", id.toString()),
                    callback,
                    expectedType: "string",
                });
            },
            onMute(client: OSC, callback: (value: boolean) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackMute.replace(":id", id.toString()),
                    callback,
                    expectedType: "boolean",
                });
            },
            onSolo(client: OSC, callback: (value: boolean) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackSolo.replace(":id", id.toString()),
                    callback,
                    expectedType: "boolean",
                });
            },
            onRecArm(client: OSC, callback: (value: boolean) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackRecArm.replace(":id", id.toString()),
                    callback,
                    expectedType: "boolean",
                });
            },
            onMonitor(client: OSC, callback: (value: number) => void) {
                onEvent({
                    client,
                    event: DAWEvents.TrackMonitor.replace(":id", id.toString()),
                    callback,
                    expectedType: "number",
                });
            },
            setVolume(client: OSC, volume: number) {
                sendMessage({
                    client,
                    path: DAWEvents.TrackVolume.replace(":id", id.toString()),
                    value: volume,
                    signal: `TRACK_${id}_VOLUME`,
                });
            },
            setPan(client: OSC, pan: number) {
                sendMessage({
                    client,
                    path: DAWEvents.TrackPan.replace(":id", id.toString()),
                    value: pan,
                    signal: `TRACK_${id}_PAN`,
                });
            },
            setMute(client: OSC, muted: boolean) {
                sendMessage({
                    client,
                    path: DAWEvents.TrackMute.replace(":id", id.toString()),
                    value: boolToNum(muted),
                    signal: `TRACK_${id}_MUTE`,
                });
            },
            setSolo(client: OSC, soloed: boolean) {
                sendMessage({
                    client,
                    path: DAWEvents.TrackSolo.replace(":id", id.toString()),
                    value: boolToNum(soloed),
                    signal: `TRACK_${id}_SOLO`,
                });
            },
            setRecArm(client: OSC, recArmed: boolean) {
                sendMessage({
                    client,
                    path: DAWEvents.TrackRecArm.replace(":id", id.toString()),
                    value: boolToNum(recArmed),
                    signal: `TRACK_${id}_RECARM`,
                });
            },
            setMonitor(client: OSC, monitored: number) {
                sendMessage({
                    client,
                    path: DAWEvents.TrackMonitor.replace(":id", id.toString()),
                    value: monitored,
                    signal: `TRACK_${id}_MONITOR`,
                });
            },
        };
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
                expectedType: "boolean",
            });
        },
        onPlay(client: OSC, callback: (value: boolean) => void) {
            onEvent({
                client,
                event: DAWEvents.Play,
                callback,
                expectedType: "boolean",
            });
        },
        onPause(client: OSC, callback: (value: boolean) => void) {
            onEvent({
                client,
                event: DAWEvents.Pause,
                callback,
                expectedType: "boolean",
            });
        },
        onStop(client: OSC, callback: (value: boolean) => void) {
            onEvent({
                client,
                event: DAWEvents.Stop,
                callback,
                expectedType: "boolean",
            });
        },
        onMetronome(client: OSC, callback: (value: boolean) => void) {
            onEvent({
                client,
                event: DAWEvents.Metronome,
                callback,
                expectedType: "boolean",
            });
        },
        onRepeat(client: OSC, callback: (value: boolean) => void) {
            onEvent({
                client,
                event: DAWEvents.Repeat,
                callback,
                expectedType: "boolean",
            });
        },
        setRecord(client: OSC) {
            sendMessage({
                client,
                path: DAWEvents.Record,
                value: 1,
                signal: DAWSignals.TransportRecord,
            });
        },
        setPlay(client: OSC) {
            sendMessage({
                client,
                path: DAWEvents.Play,
                value: 1,
                signal: DAWSignals.TransportPlay,
            });
        },
        setPause(client: OSC) {
            sendMessage({
                client,
                path: DAWEvents.Pause,
                value: 1,
                signal: DAWSignals.TransportPause,
            });
        },
        setStop(client: OSC) {
            sendMessage({
                client,
                path: DAWEvents.Stop,
                value: 1,
                signal: DAWSignals.TransportStop,
            });
        },
        setMetronome(client: OSC, value: boolean) {
            sendMessage({
                client,
                path: DAWEvents.Metronome,
                value: boolToNum(value),
                signal: DAWSignals.TransportMetronome,
            });
        },
        setRepeat(client: OSC, value: boolean) {
            sendMessage({
                client,
                path: DAWEvents.Repeat,
                value: boolToNum(value),
                signal: DAWSignals.TransportRepeat,
            });
        },
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
                expectedType: "number",
            });
        },
        setBank(client: OSC, bank: number) {
            sendMessage({
                client,
                path: DAWEvents.BankSelect,
                value: bank,
                signal: DAWSignals.BankSelect,
            })
        },
        setNextBank(client: OSC) {
            sendMessage({
                client,
                path: DAWEvents.BankNext,
                value: 1,
                signal: DAWSignals.BankNext,
            })
        },
        setPrevBank(client: OSC) {
            sendMessage({
                client,
                path: DAWEvents.BankPrev,
                value: 1,
                signal: DAWSignals.BankPrev,
            })
        },
        setTrackCount(client: OSC, count: number) {
            sendMessage({
                client,
                path: DAWEvents.TracksCount,
                value: count,
                signal: DAWSignals.TracksCount
            })
        },
    },
};
