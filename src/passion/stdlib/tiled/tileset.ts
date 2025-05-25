import type { PassionData } from "../../data";
import { Image } from "./image";
import type { IImage, ITileset } from "./tiledTypes";

export class Tileset implements ITileset {
    private data: PassionData;
    
    name: string = '';
    firstGid: number = 0;
    tileWidth: number = 0;
    tileHeight: number = 0;
    tileCount: number = 0;
    columns: number = 0;

    readonly image: IImage;

    private get lastGid(): number {
        return this.firstGid + this.tileCount - 1;
    }

    constructor(data: PassionData, folder: string, metadata: any) {
        this.data = data;

        this.name = metadata['@_name'] ?? '';
        this.firstGid = parseInt(metadata['@_firstgid'] ?? '0');
        this.tileWidth = parseInt(metadata['@_tilewidth'] ?? '0');
        this.tileHeight = parseInt(metadata['@_tileheight'] ?? '0');
        this.tileCount = parseInt(metadata['@_tilecount'] ?? '0');
        this.columns = parseInt(metadata['@_columns'] ?? '0');

        this.image = new Image(this.data, folder, metadata.image ?? {});
    }

    containsGid(gid: number): boolean {
        return gid >= this.firstGid && gid <= this.lastGid;
    }

    blt(gid: number, x: number, y: number, w?: number, h?: number) {
        if (!this.containsGid(gid)) {
            return;
        }

        const localId = gid - this.firstGid;
        const tileX = localId % this.columns;
        const tileY = Math.floor(localId / this.columns);

        const u = tileX * this.tileWidth;
        const v = tileY * this.tileWidth;

        this.image.blt(x, y, u, v, this.tileWidth, this.tileHeight, w, h);
    }
}