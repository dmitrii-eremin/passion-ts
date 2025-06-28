import type { PassionData } from "../../data";
import { PassionImage } from "../../image";
import type { IImage } from "./tiledTypes";

export class Image implements IImage {
    source: string = '';
    width: number = 0;
    height: number = 0;

    private filename: string;
    private image: PassionImage;
    private data: PassionData;

    constructor(data: PassionData, folder: string, metadata: any) {
        this.data = data;

        const meta = metadata?.[':@'] ?? {};
        this.source = meta['@_source'] ?? '';
        this.width = parseInt(meta['@_width'] ?? '0');
        this.height = parseInt(meta['@_height'] ?? '0');

        this.filename = `${folder}/${this.source}`;
        this.image = new PassionImage(this.filename);
    }

    blt(x: number, y: number, u: number, v: number, w: number, h: number, renderWidth?: number, renderHeight?: number) {
        if (!this.data.isReady()) {
            return;
        }

        const scaleX = renderWidth ? (renderWidth / w) : 1;
        const scaleY = renderHeight ? (renderHeight / h) : 1;

        this.image.blt(this.data.context!, x, y, u, v, w, h, undefined, undefined, scaleX, scaleY);
    }

    bltFullImage(x: number, y: number) {
        if (!this.data.isReady()) {
            return;
        }

        this.image.blt(this.data.context!, x, y, 0, 0, this.image.width, this.image.height);
    }
}