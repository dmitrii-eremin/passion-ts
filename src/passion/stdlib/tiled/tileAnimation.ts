import { TileAnimationFrame } from "./tileAnimationFrame";
import type { ITileAnimation, ITileAnimationFrame } from "./tiledTypes";

export class TileAnimation implements ITileAnimation {
    readonly gid: number;
    readonly frames: ITileAnimationFrame[];

    constructor(metadata: any, firstGid: number) {
        const offsetGidStr = metadata?.[':@']?.['@_id'];
        const offsetGid = typeof offsetGidStr === 'string' ? parseInt(offsetGidStr) : 0;
        this.gid = firstGid + (isNaN(offsetGid) ? 0 : offsetGid);

        const tileArr = Array.isArray(metadata?.tile) ? metadata.tile : [];
        const animations = tileArr[0]?.animation ?? [];
        this.frames = Array.isArray(animations)
            ? animations.map((frame: any) => new TileAnimationFrame(frame, firstGid))
            : [];
    }
}
