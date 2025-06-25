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
        this.parseMetaData(content);
        this.parseTilesets(folder, content);
        this.parseTileLayers(content);
        this.parseObjectGroups(content);
        this.parseImageLayers(this.data, folder, content);

        this.collectDrawableLayers();
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

    private parseTileLayers(content: any) {
        const mapMetaData = content.map ?? {};
        let layers = mapMetaData['layer'];
        if (!layers) {
            return;
        }
        if (!Array.isArray(layers)) {
            layers = [layers];
        }

        for (const item of layers) {
            const layer = new Layer(this.tileWidth, this.tileHeight, item);
            this.tileLayers.push(layer);
        }
    }

    private parseObjectGroups(content: any) {
        const mapMetaData = content.map ?? {};
        let objectGroups = mapMetaData['objectgroup'];
        if (!objectGroups) {
            return;
        }
        if (!Array.isArray(objectGroups)) {
            objectGroups = [objectGroups];
        }

        for (const item of objectGroups) {
            const objectGroup = new ObjectGroup(item);
            this.objectGroups.push(objectGroup);
        }
    }

    private parseImageLayers(data: PassionData, folder: string, content: any) {
        const mapMetaData = content.map ?? {};
        let imageLayers = mapMetaData['imagelayer'];
        if (!imageLayers) {
            return;
        }
        if (!Array.isArray(imageLayers)) {
            imageLayers = [imageLayers];
        }

        for (const item of imageLayers) {
            const imageLayer = new ImageLayer(data, folder, item);
            this.imageLayers.push(imageLayer);
        }
    }

    private collectDrawableLayers() {
        const ids = [...this.tileLayers.map(v => v.id), ...this.objectGroups.map(v => v.id), ...this.imageLayers.map(v => v.id)].sort();
        this.layers = (ids.map(id => this.getDrawableObjectById(id)).filter(i => i)) as IDrawableLayer[];
    }

    private getDrawableObjectById(id: number): IDrawableLayer | undefined {
        let layer: IDrawableLayer | undefined = this.tileLayers.find(v => v.id === id);
        if (layer) {
            return layer;
        }
        layer = this.objectGroups.find(v => v.id === id);
        if (layer) {
            return layer;
        }

        return this.imageLayers.find(v => v.id === id);
    }

    private parseTilesets(folder: string, content: any) {
        const mapMetaData = content.map ?? {};
        let tilesets = mapMetaData['tileset'];
        if (!tilesets) {
            return;
        }
        if (!Array.isArray(tilesets)) {
            tilesets = [tilesets];
        }

        for (const item of tilesets) {
            const tileset = new Tileset(this.data, folder, item);
            this.tilesets.push(tileset);
        }
    }

    private parseMetaData(content: any) {
        const mapMetaData = content.map ?? {};
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
    });
    return parser.parse(content);
}
