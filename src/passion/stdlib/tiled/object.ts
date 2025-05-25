import type { DrawCallback, IObject } from "./tiledTypes";

export class Object implements IObject {
    id: number;
    gid: number;
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(metadata: any) {
        this.id = parseInt(metadata['@_id'] ?? '0');
        this.gid = parseInt(metadata['@_gid'] ?? '0');
        this.x = parseInt(metadata['@_x'] ?? '0');
        this.y = parseInt(metadata['@_y'] ?? '0');
        this.width = parseInt(metadata['@_width'] ?? '0');
        this.height = parseInt(metadata['@_height'] ?? '0');
    }

    draw(cb: DrawCallback) {
        cb('object', this.gid, this.x, this.y, this.width, this.height);
    }
}