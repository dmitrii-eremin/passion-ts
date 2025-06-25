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
        this.name = metadata['@_name'] ?? '';
        this.id = parseInt(metadata['@_id'] ?? '0');
        this.visible = metadata['@_visible'] === undefined || metadata['@_visible'] !== '0';
        this.offsetX = parseInt(metadata['@_offsetx'] ?? '0');
        this.offsetY = parseInt(metadata['@_offsety'] ?? '0');

        this.image = new Image(this.data, folder, metadata['image']);
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
