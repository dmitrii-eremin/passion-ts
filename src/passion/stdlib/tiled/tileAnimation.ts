import { TileAnimationFrame } from "./tileAnimationFrame";
import type { ITileAnimation, ITileAnimationFrame } from "./tiledTypes";

export class TileAnimation implements ITileAnimation {
    readonly gid: number;
    readonly frames: ITileAnimationFrame[];

    constructor(metadata: any, firstGid: number) {
        const offsetGid = parseInt(metadata['@_id']);
        this.gid = firstGid + offsetGid;

        const animation = metadata['animation'];
        this.frames = animation === undefined ?
            [] : (animation['frame'] as any[]).map(frame => new TileAnimationFrame(frame, firstGid));
    }
}
