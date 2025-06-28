import { XMLParser } from "fast-xml-parser";
import type { TileDrawingType, IDrawableLayer, ILayer, IMap, IObjectGroup, ITileset, Orientation, RenderOrder, IObject } from "./tiledTypes";
import { Tileset } from "./tileset";
import { Layer } from "./layer";
import type { PassionData } from "../../data";
import type { Color } from "../../constants";
import { ObjectGroup } from "./objectGroup";
import { ImageLayer } from "./imageLayer";

export class Map implements IMap {
    private data: PassionData;

    version: string = '';
    tiledversion: string = '';
    orientation: Orientation = 'orthogonal';
    renderOrder: RenderOrder = 'right-down';
    width: number = 0;
    height: number = 0;
    tileWidth: number = 0;
    tileHeight: number = 0;
    infinite: boolean = false;
    backgroundColor: Color = 0;

    private tilesets: ITileset[] = [];

    private tileLayers: ILayer[] = [];
    private objectGroups: IObjectGroup[] = [];
    private imageLayers: ImageLayer[] = [];

    layers: IDrawableLayer[] = [];

    constructor(data: PassionData) {
        this.data = data;
    }

    async load(filename: string) {
        const folder = filename.substring(0, filename.lastIndexOf('/'));

        const content = await loadXmlFile(filename);
        if (content === undefined) {
            return;
        }

        this.parseMetaData(content);
        this.parseLayers(folder, content);
    }

    update(dt: number) {
        this.tilesets.forEach(t => t.update(dt));
    }

    draw(x: number, y: number) {
        for (const layer of this.layers) {
            if (layer.customDrawCallback !== undefined) {
                layer.customDrawCallback(layer, x, y);
                continue;
            }

            layer.draw((type: TileDrawingType, gid: number, ox: number, oy: number, w?: number, h?: number) => {
                const tileset = this.getTilesetByGid(gid);
                if (!tileset) {
                    return;
                }

                if (type === 'tile') {
                    tileset.blt(gid, ox + x, oy + y);
                }
                else if (type === 'object') {
                    tileset.blt(gid, ox + x, oy + y - (h ?? this.tileHeight), w, h);
                }
            });
        }
    }

    getObjectsByType(typeName: string): IObject[] {
        return this.objectGroups.flatMap(group => group.getObjectsByType(typeName));
    }

    getObjectsByName(name: string): IObject[] {
        return this.objectGroups.flatMap(group => group.getObjectsByName(name));
    }

    getLayersByName(name: string): IDrawableLayer[] {
        return this.layers.filter(l => l.name === name);
    }

    private getTilesetByGid(gid: number): ITileset | undefined {
        return this.tilesets.find(item => item.containsGid(gid));
    }

    private parseLayers(folder: string, content: any) {
        const mapMetaData = content?.map ?? [];
        if (!Array.isArray(mapMetaData)) return;
        for (const node of mapMetaData) {
            if (node?.tileset) {
                const tileset = new Tileset(this.data, folder, node);
                this.tilesets.push(tileset);
            }
            else if (node?.imagelayer) {
                const layer = new ImageLayer(this.data, folder, node);
                this.imageLayers.push(layer);
                this.layers.push(layer);
            }
            else if (node?.layer) {
                const layer = new Layer(this.tileWidth, this.tileHeight, node);
                this.tileLayers.push(layer);
                this.layers.push(layer);
            }
            else if (node?.objectgroup) {
                const layer = new ObjectGroup(node);
                this.objectGroups.push(layer);
                this.layers.push(layer);
            }
        }
    }

    private parseMetaData(content: any) {
        const mapMetaData = content?.[':@'] ?? {};
        this.version = mapMetaData['@_version'] ?? '';
        this.tiledversion = mapMetaData['@_tiledversion'] ?? '';
        this.orientation = (mapMetaData['@_orientation'] ?? 'orthogonal') as Orientation;
        this.renderOrder = (mapMetaData['@_renderorder'] ?? 'right-down') as RenderOrder;
        this.width = parseInt(mapMetaData['@_width'] ?? '0');
        this.height = parseInt(mapMetaData['@_height'] ?? '0');
        this.tileWidth = parseInt(mapMetaData['@_tilewidth'] ?? '0');
        this.tileHeight = parseInt(mapMetaData['@_tileheight'] ?? '0');
        this.infinite = (mapMetaData['@_infinite'] ?? '0') !== '0';
        this.backgroundColor = mapMetaData['@_backgroundcolor'] ?? '#000000';
    }
}

async function loadXmlFile(filename: string): Promise<any> {
    const response = await fetch(filename);
    const content = await response.text();

    const parser: XMLParser = new XMLParser({
        ignoreAttributes: false,
        preserveOrder: true,
    });

    const object = parser.parse(content);
    return object.find((x: any) => x.map);
}
