import type { PassionData } from "../../data";
import { Image } from "./image";
import { TileAnimation } from "./tileAnimation";
import type { IImage, ITileAnimation, ITileAnimationFrame, ITileset } from "./tiledTypes";

class TileGidAnimationCounter {
    readonly originalGid: number;
    readonly frames: ITileAnimationFrame[];

    private timePassed: number = 0;
    private index: number = 0;

    get gid(): number {
        if (this.frames.length === 0) {
            return this.originalGid;
        }

        return this.frames[this.index].tileid;
    }

    constructor(animation: ITileAnimation) {
        this.originalGid = animation.gid;
        this.frames = animation.frames;
    }

    update(dt: number) {
        if (this.frames.length === 0) {
            return;
        }

        this.timePassed += dt;

        const currentDuration = this.frames[this.index].duration;
        while (this.timePassed >=currentDuration) {
            this.timePassed -=currentDuration;
            this.index += 1;
            if (this.index >= this.frames.length) {
                this.index = 0;
            }
            if (currentDuration < 0.001) {
                break;
            }
        }
    }
}

export class Tileset implements ITileset {
    private data: PassionData;
    
    name: string = '';
    firstGid: number = 0;
    tileWidth: number = 0;
    tileHeight: number = 0;
    tileCount: number = 0;
    columns: number = 0;

    readonly image: IImage;
    readonly animations: ITileAnimation[];

    private animationCounters: Record<number, TileGidAnimationCounter>;

    private get lastGid(): number {
        return this.firstGid + this.tileCount - 1;
    }

    constructor(data: PassionData, folder: string, metadata: any) {
        this.data = data;

        const meta = metadata?.[':@'] ?? {};
        this.name = meta['@_name'] ?? '';
        this.firstGid = parseInt(meta['@_firstgid'] ?? '0');
        this.tileWidth = parseInt(meta['@_tilewidth'] ?? '0');
        this.tileHeight = parseInt(meta['@_tileheight'] ?? '0');
        this.tileCount = parseInt(meta['@_tilecount'] ?? '0');
        this.columns = parseInt(meta['@_columns'] ?? '0');

        const tilesetArr = Array.isArray(metadata?.tileset) ? metadata.tileset : [];
        const imageMeta = tilesetArr.find((t: any) => t?.image) ?? {};
        this.image = new Image(this.data, folder, imageMeta);
        this.animations = this.parseAnimations(tilesetArr.filter((t: any) => t?.tile));
        this.animationCounters = this.animations.reduce<Record<number, TileGidAnimationCounter>>((acc, a) => {
            acc[a.gid] = new TileGidAnimationCounter(a);
            return acc;
        }, {});
    }
    
    private parseAnimations(tiles: any): ITileAnimation[] {
        if (!Array.isArray(tiles)) return [];
        return (tiles as any[]).map(t => new TileAnimation(t, this.firstGid));
    }

    containsGid(gid: number): boolean {
        return gid >= this.firstGid && gid <= this.lastGid;
    }

    blt(originalGid: number, x: number, y: number, w?: number, h?: number) {
        if (!this.containsGid(originalGid)) {
            return;
        }

        const gid = this.getGid(originalGid);

        const localId = gid - this.firstGid;
        const tileX = localId % this.columns;
        const tileY = Math.floor(localId / this.columns);

        const u = tileX * this.tileWidth;
        const v = tileY * this.tileWidth;

        this.image.blt(x, y, u, v, this.tileWidth, this.tileHeight, w, h);
    }

    update(dt: number) {
        for (const counter of Object.values(this.animationCounters)) {
            counter.update(dt);
        }
    }

    private getGid(originalGid: number): number {
        const counter = this.animationCounters[originalGid];
        if (!counter) {
            return originalGid;
        }

        return counter.gid;
        
    }
}