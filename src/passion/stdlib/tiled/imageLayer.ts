import type { CustomDrawCallback, DrawCallback, IImageLayer } from "./tiledTypes";
import type { PassionData } from "../../data";
import { Image } from "./image";

export class ImageLayer implements IImageLayer {
    private data: PassionData;

    name: string = '';
    id: number = 0;
    visible: boolean = true;
    offsetX: number = 0;
    offsetY: number = 0;

    customDrawCallback: CustomDrawCallback | undefined;

    private image: Image;

    constructor(data: PassionData, folder: string, metadata: any) {
        this.data = data;
        const meta = metadata?.[':@'] ?? {};
        this.name = meta['@_name'] ?? '';
        this.id = parseInt(meta['@_id'] ?? '0');
        this.visible = meta['@_visible'] === undefined || meta['@_visible'] !== '0';
        this.offsetX = parseInt(meta['@_offsetx'] ?? '0');
        this.offsetY = parseInt(meta['@_offsety'] ?? '0');

        const imageLayerArr = Array.isArray(metadata?.imagelayer) ? metadata.imagelayer : [];
        this.image = new Image(this.data, folder, imageLayerArr[0] ?? {});
    }

    setCustomDrawCallback(cb: CustomDrawCallback | undefined) {
        this.customDrawCallback = cb;
    }

    draw(_cb: DrawCallback) {
        if (!this.visible) {
            return;
        }

        this.image.bltFullImage(this.offsetX, this.offsetY);
    }
}
