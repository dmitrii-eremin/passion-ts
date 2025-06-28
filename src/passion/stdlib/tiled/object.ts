import type { DrawCallback, IObject, ObjectProperty } from "./tiledTypes";

export class Object implements IObject {
    id: number;
    gid: number;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    type: string;

    properties: { [key: string]: ObjectProperty } = {};

    get isVisible(): boolean {
        return !this.properties['hidden'];
    }

    constructor(metadata: any) {
        const meta = metadata?.[':@'] ?? {};
        this.id = parseInt(meta['@_id'] ?? '0');
        this.gid = parseInt(meta['@_gid'] ?? '0');
        this.x = parseInt(meta['@_x'] ?? '0');
        this.y = parseInt(meta['@_y'] ?? '0');
        this.width = parseInt(meta['@_width'] ?? '0');
        this.height = parseInt(meta['@_height'] ?? '0');
        this.name = meta['@_name'] ?? '';
        this.type = meta['@_type'] ?? '';

        // Defensive: handle missing or malformed object/property arrays
        const objectsArr = Array.isArray(metadata?.object) ? metadata.object : [];
        for (const object of objectsArr) {
            const propertiesArr = Array.isArray(object?.properties) ? object.properties : [];
            for (const property of propertiesArr) {
                this.addProperty(property);
            }
        }
    }

    draw(cb: DrawCallback) {
        if (!this.isVisible) {
            return;
        }

        cb('object', this.gid, this.x, this.y, this.width, this.height);
    }

    private addProperty(property: any) {
        const name = property[':@']['@_name'];
        let value: ObjectProperty = 0;

        if (property[':@']['@_type'] === 'int') {
            value = parseInt(property[':@']['@_value']);
        }
        else if (property[':@']['@_type'] === 'float') {
            value = parseFloat(property[':@']['@_value']);
        }
        else if (property[':@']['@_type'] === 'bool') {
            value = property[':@']['@_value'] === 'true';
        }
        else {
            value = property[':@']['@_value'];
        }

        this.properties[name] = value;
    }
}