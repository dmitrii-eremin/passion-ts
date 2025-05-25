import type { DrawCallback, IObject, IObjectGroup } from "./tiledTypes";
import { Object } from "./object";

export class ObjectGroup implements IObjectGroup {
    name: string = '';
    id: number = 0;
    visible: boolean = true;
    offsetX: number = 0;
    offsetY: number = 0;

    objects: IObject[] = [];

    constructor(metadata: any) {
        this.name = metadata['@_name'] ?? '';
        this.id = parseInt(metadata['@_id'] ?? '0');
        this.visible = metadata['@_visible'] === undefined || metadata['@_visible'] !== '0';
        this.offsetX = parseInt(metadata['@_offsetx'] ?? '0');
        this.offsetY = parseInt(metadata['@_offsety'] ?? '0');

        this.parseObjects(metadata);
    }

    draw(cb: DrawCallback) {
        if (!this.visible) {
            return;
        }

        for (const object of this.objects) {
            object.draw(cb);
        }
    }

    private parseObjects(metadata: any) {
        let objectsMetaData = metadata['object'];
        if (!objectsMetaData) {
            return;
        }

        if (!Array.isArray(objectsMetaData)) {
            objectsMetaData = [objectsMetaData];
        }

        for (const metadata of objectsMetaData) {
            this.objects.push(new Object(metadata));
        }
    }
}
