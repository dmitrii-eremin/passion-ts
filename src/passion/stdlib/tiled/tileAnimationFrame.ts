import type { ITileAnimationFrame } from "./tiledTypes";

export class TileAnimationFrame implements ITileAnimationFrame {
    readonly tileid: number;
    readonly duration: number;

    constructor(metadata: any, firstGid: number) {
        const tileidStr = metadata?.[':@']?.['@_tileid'];
        const durationStr = metadata?.[':@']?.['@_duration'];
        const tileid = typeof tileidStr === 'string' ? parseInt(tileidStr) : 0;
        const duration = typeof durationStr === 'string' ? parseInt(durationStr) : 0;
        this.tileid = firstGid + (isNaN(tileid) ? 0 : tileid);
        this.duration = (isNaN(duration) ? 0 : duration) / 1000; // convert from ms to seconds
    }
}
