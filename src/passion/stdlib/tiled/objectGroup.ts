import type { CustomDrawCallback, DrawCallback, IObject, IObjectGroup } from "./tiledTypes";
import { Object } from "./object";

export class ObjectGroup implements IObjectGroup {
    name: string = '';
    id: number = 0;
    visible: boolean = true;
    offsetX: number = 0;
    offsetY: number = 0;

    objects: IObject[] = [];

    customDrawCallback: CustomDrawCallback | undefined;

    constructor(metadata: any) {
        const meta = metadata?.[':@'] ?? {};
        this.name = meta['@_name'] ?? '';
        this.id = parseInt(meta['@_id'] ?? '0');
        this.visible = meta['@_visible'] === undefined || meta['@_visible'] !== '0';
        this.offsetX = parseInt(meta['@_offsetx'] ?? '0');
        this.offsetY = parseInt(meta['@_offsety'] ?? '0');

        const objectsArr = metadata?.objectgroup ?? [];
        this.parseObjects(objectsArr);
    }

    setCustomDrawCallback(cb: CustomDrawCallback | undefined) {
        this.customDrawCallback = cb;
    }

    getObjectsByType(typeName: string): IObject[] {
        return this.objects.filter(o => o.type === typeName);
    }

    getObjectsByName(name: string): IObject[] {
        return this.objects.filter(o => o.name === name);
    }

    draw(cb: DrawCallback) {
        if (!this.visible) {
            return;
        }

        for (const object of this.objects) {
            object.draw(cb);
        }
    }

    private parseObjects(objects: any) {
        if (!Array.isArray(objects)) return;
        for (const objectMetaData of objects) {
            this.objects.push(new Object(objectMetaData));
        }
    }
}
