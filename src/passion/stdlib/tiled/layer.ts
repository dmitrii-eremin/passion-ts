import type { Compression, CustomDrawCallback, DrawCallback, Encoding, ILayer } from "./tiledTypes";
import { createDecompressor } from "./utils/decompressor";

export class Layer implements ILayer {
    name: string = '';
    id: number = 0;
    width: number = 0;
    height: number = 0;
    visible: boolean = true;
    offsetX: number = 0;
    offsetY: number = 0;

    encoding?: Encoding;
    compression?: Compression;

    tiles: number[][] = [];
    tw: number = 0;
    th: number = 0;

    customDrawCallback: CustomDrawCallback | undefined;

    constructor(tw: number, th: number, metadata: any) {
        const layerArr = Array.isArray(metadata?.layer) ? metadata.layer : [];
        const layer = layerArr[0] ?? {};

        this.tw = tw;
        this.th = th;
        const meta = metadata?.[':@'] ?? {};
        this.name = meta['@_name'] ?? '';
        this.id = parseInt(meta['@_id'] ?? '0');
        this.width = parseInt(meta['@_width'] ?? '0');
        this.height = parseInt(meta['@_height'] ?? '0');
        this.encoding = layer?.[':@']?.['@_encoding'];
        this.compression = layer?.[':@']?.['@_compression'];
        this.visible = meta['@_visible'] === undefined || meta['@_visible'] !== '0';
        this.offsetX = parseInt(meta['@_offsetx'] ?? '0');
        this.offsetY = parseInt(meta['@_offsety'] ?? '0');

        const dataArr = Array.isArray(layer?.data) ? layer.data : [];
        const dataText = dataArr[0]?.['#text'] ?? '';
        parseData(this.encoding, this.compression, dataText, this.width)
            .then(value => {
                this.tiles = value;
            });
    }

    setCustomDrawCallback(cb: CustomDrawCallback | undefined) {
        this.customDrawCallback = cb;
    }

    draw(cb: DrawCallback) {
        if (!this.visible) {
            return;
        }

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                cb('tile', (this.tiles[j] ?? [])[i], i * this.tw, j * this.th);
            }
        }
    }
}

async function parseData(encoding: Encoding | undefined, compression: Compression | undefined, data: string, width: number): Promise<number[][]> {
    if (encoding === 'csv') {
        return parseDataCsv(data, width);
    }
    else if (encoding === 'base64') {
        if (compression) {
            return await parseDataCompressed(data, compression, width);
        }
        return parseDataBase64(data, width);
    }
    return [];
}

function parseDataCsv(data: string, width: number): number[][] {
    const numbers = data
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));

    const result: number[][] = [];

    for (let i = 0; i < numbers.length; i += width) {
        result.push(numbers.slice(i, i + width));
    }

    return result;
}

function parseDataBase64(data: string, width: number): number[][] {
    return splitBytes(
        parseBytes(Uint8Array.from(atob(data), c => c.charCodeAt(0))),
        width
    );
}

async function parseDataCompressed(data: string, compression: Compression, width: number): Promise<number[][]> {
    const compressedData = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    const decompressor = createDecompressor(compression);
    const decompressedData = await decompressor.decompress(compressedData);

    return splitBytes(parseBytes(decompressedData),width);
}

function parseBytes(data: Uint8Array): number[] {
    return Array.from(
        { length: Math.ceil(data.length / 4) },
        (_, i) => {
            const bytes =Array.from(data.slice(i * 4, i * 4 + 4));
            return bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);
        }
    );
}

function splitBytes(data: number[], width: number): number[][] {
    const result: number[][] = [];

    for (let i = 0; i < data.length; i += width) {
        result.push(Array.from(data.slice(i, i + width)));
    }

    return result;
}
