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
import type { ImageIndex, FontIndex, SoundIndex, WebSocketIndex } from './constants';
import type { PassionStorage } from './storage';
import type { BdfFont } from './internal/bdf_font';

export class PassionData {
    public canvas: HTMLCanvasElement | null = null;
    public context: CanvasRenderingContext2D | null = null;

    public images: Map<ImageIndex, PassionImage> = new Map<ImageIndex, PassionImage>();
    public fonts: Map<FontIndex, BdfFont> = new Map<FontIndex, BdfFont>();
    public sounds: Map<SoundIndex, Sound> = new Map<SoundIndex, Sound>();
    public sockets: Map<WebSocketIndex, WSClient> = new Map<WebSocketIndex, WSClient>();

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
        return this.canvas !== null && this.context !== null;
    }
}
