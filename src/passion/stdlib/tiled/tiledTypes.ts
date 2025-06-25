import type { Color } from "../../constants";

export type Orientation = 'orthogonal';
export type RenderOrder = 'right-down';

export interface IImage {
    readonly source: string;
    readonly width: number;
    readonly height: number;

    blt(x: number, y: number, u: number, v: number, w: number, h: number, renderWidth?: number, renderHeight?: number): void;
}

export interface ITileAnimationFrame {
    tileid: number;
    duration: number;
}

export interface ITileAnimation {
    gid: number;
    frames: ITileAnimationFrame[];
}

export interface ITileset {
    readonly name: string;
    readonly firstGid: number;
    readonly tileWidth: number;
    readonly tileHeight: number;
    readonly tileCount: number;
    readonly columns: number;

    readonly image: IImage;
    readonly animations: ITileAnimation[];

    containsGid(gid: number): boolean;
    update(dt: number): void;
    blt(gid: number, x: number, y: number, w?: number, h?: number): void;
}

export type ObjectProperty = number | string | boolean;

export interface IObject {
    readonly id: number;
    readonly gid: number;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    readonly properties: { [key: string]: ObjectProperty };

    draw(cb: DrawCallback): void;
}

export type Encoding = 'csv' | 'base64';
export type Compression = 'gzip' | 'zlib' | 'zstd';
export type TileDrawingType = 'tile' | 'object';
export type DrawCallback = (type: TileDrawingType, gid: number, x: number, y: number, w?: number, h?: number) => void;

export interface IDrawableLayer {
    readonly name: string;
    readonly id: number;
    readonly visible: boolean;
    readonly offsetX: number;
    readonly offsetY: number;

    draw(cb: DrawCallback): void;
}

export interface ILayer extends IDrawableLayer {
    readonly width: number;
    readonly height: number;

    readonly encoding?: Encoding;
    readonly compression?: Compression;
}

export interface IObjectGroup extends IDrawableLayer {
    readonly objects: IObject[];
}

export interface IImageLayer extends IDrawableLayer {}

export interface IMap {
    readonly version: string;
    readonly tiledversion: string;
    readonly orientation: Orientation;
    readonly renderOrder: RenderOrder;
    readonly width: number;
    readonly height: number;
    readonly tileWidth: number;
    readonly tileHeight: number;
    readonly infinite: boolean;
    readonly backgroundColor: Color;

    update(dt: number): void;
    draw(x: number, y: number): void;
};
