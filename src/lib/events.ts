export const REAPER_EVENTS = {
    currentTrackVolume: '/track/volume',
    trackVolume: (trackNumber: number) => `/track/${trackNumber}/volume`,
    currentTrackPan: '/track/pan',
    trackPan: (trackNumber: number) => `/track/${trackNumber}/pan`,
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
