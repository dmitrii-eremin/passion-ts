// Gzip decompression utility for Tiled maps and other gzip-compressed data
// Requires: pako (https://www.npmjs.com/package/pako)
import pako from 'pako';
import { ZSTDDecoder } from 'zstddec';
import type { Compression } from '../tiledTypes';

export interface IDecompressor {
    decompress(input: Uint8Array | ArrayBuffer): Promise<Uint8Array>;
}

export class Gzip implements IDecompressor {
    async decompress(input: Uint8Array | ArrayBuffer): Promise<Uint8Array> {
        return pako.ungzip(input);
    }
}

export class Zlib implements IDecompressor {
    async decompress(input: Uint8Array | ArrayBuffer): Promise<Uint8Array> {
        return pako.inflate(input);
    }
}

export class Zstd implements IDecompressor {
    async decompress(input: Uint8Array | ArrayBuffer): Promise<Uint8Array> {
        const decoder = new ZSTDDecoder();
        await decoder.init();
        const inputArray = input instanceof Uint8Array ? input : new Uint8Array(input);
        return decoder.decode(inputArray);
    }
}

export function createDecompressor(compression: Compression): IDecompressor {
    switch (compression) {
        case 'gzip':
            return new Gzip();
        case 'zlib':
            return new Zlib();
        case 'zstd':
            return new Zstd();
        default:
            throw new Error('Unsupported compression: ' + compression);
    }
}
