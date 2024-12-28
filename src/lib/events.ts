export const REAPER_EVENTS = {
    trackVolume: (trackNumber: number) => `/track/${trackNumber}/volume`,
    trackPan: (trackNumber: number) => `/track/${trackNumber}/pan`,
    trackName: (trackNumber: number) => `/track/${trackNumber}/name`,
}

export type Message = {
    offset: number,
    address: string,
    types: string,
    args: any[]
}

export type Rinfo = {
    address: string,
    family: string,
    port: number,
    size: number
}
