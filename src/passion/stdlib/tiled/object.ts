import type { DrawCallback, IObject, ObjectProperty } from "./tiledTypes";

export class Object implements IObject {
    id: number;
    gid: number;
    x: number;
    y: number;
    width: number;
    height: number;

    properties: { [key: string]: ObjectProperty } = {};

    constructor(metadata: any) {
        this.id = parseInt(metadata['@_id'] ?? '0');
        this.gid = parseInt(metadata['@_gid'] ?? '0');
        this.x = parseInt(metadata['@_x'] ?? '0');
        this.y = parseInt(metadata['@_y'] ?? '0');
        this.width = parseInt(metadata['@_width'] ?? '0');
        this.height = parseInt(metadata['@_height'] ?? '0');

        if (metadata.properties) {
            const properties = Array.isArray(metadata.properties.property) ? metadata.properties.property : [metadata.properties.property];
            for (const property of properties) {
                this.addProperty(property);
            }
        }
    }

    draw(cb: DrawCallback) {
        cb('object', this.gid, this.x, this.y, this.width, this.height);
    }

    private addProperty(property: any) {
        const name = property['@_name'];
        let value: ObjectProperty = 0;

        if (property['@_type'] === 'int') {
            value = parseInt(property['@_value']);
        }
        else if (property['@_type'] === 'float') {
            value = parseFloat(property['@_value']);
        }
        else if (property['@_type'] === 'bool') {
            value = property['@_value'] === 'true';
        }
        else {
            value = property['@_value'];
        }

        this.properties[name] = value;
    }
}