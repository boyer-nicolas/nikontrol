export const REAPER_EVENTS = {
    TRACK_VOLUME: (trackNumber: number) => `/track/${trackNumber}/volume`,
    TRACK_PAN: (trackNumber: number) => `/track/${trackNumber}/pan`,
    TRACK_NAME: (trackNumber: number) => `/track/${trackNumber}/name`,
    TRACK_COUNT: '/device/track/count',
    TRACK_BANK_SELECT: '/device/track/bank/select',
    TRACK_BANK_PREV: '/device/track/bank/-',
    TRACK_BANK_NEXT: '/device/track/bank/+',
    TRACK_VU_METER: (trackNumber: number) => `/track/${trackNumber}/vu`,
}

export type Message = {
    offset: number,
    address: string,
    types: string,
    args: number[]
}

export type Rinfo = {
    address: string,
    family: string,
    port: number,
    size: number
}
