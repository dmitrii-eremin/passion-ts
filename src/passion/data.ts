import { System } from './system';
import { Graphics } from './graphics';
import { Input } from './input';
import { Resource } from './resource';
import { Audio } from './audio';
import { PassionMath } from './math';
import { PassionImage } from './image';
import { Sound } from './sound';
import { Network } from './network';

import { WSClient } from './internal/ws_client';
import type { ImageIndex, FontIndex, SoundIndex, WebSocketIndex, CanvasIndex } from './constants';
import type { PassionStorage } from './storage';
import type { BdfFont } from './internal/bdf_font';
import type { PassionCanvas } from './canvas';

export class PassionData {
    public canvas: HTMLCanvasElement | undefined = undefined;
    public context: CanvasRenderingContext2D | undefined = undefined;

    public images: Map<ImageIndex, PassionImage> = new Map<ImageIndex, PassionImage>();
    public fonts: Map<FontIndex, BdfFont> = new Map<FontIndex, BdfFont>();
    public sounds: Map<SoundIndex, Sound> = new Map<SoundIndex, Sound>();
    public sockets: Map<WebSocketIndex, WSClient> = new Map<WebSocketIndex, WSClient>();
    public canvases: Map<CanvasIndex, PassionCanvas> = new Map<CanvasIndex, PassionCanvas>();

    displayScale: number = 1;
    touchIdentified?: number;

    system?: System;
    resource?: Resource;
    graphics?: Graphics;
    input?: Input;
    math?: PassionMath;
    audio?: Audio;
    network?: Network;
    storage?: PassionStorage;

    isReady(): boolean {
        return this.canvas !== undefined && this.context !== undefined;
    }
}
