import type { ITileAnimationFrame } from "./tiledTypes";

export class TileAnimationFrame implements ITileAnimationFrame {
    readonly tileid: number;
    readonly duration: number;

    constructor(metadata: any, firstGid: number) {
        this.tileid = firstGid + parseInt(metadata['@_tileid']);
        this.duration = parseInt(metadata['@_duration']) / 1000; // convert from ms to seconds
    }
}
