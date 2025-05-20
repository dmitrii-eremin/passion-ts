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

export class PassionData {
    public canvas: HTMLCanvasElement | null = null;
    public context: CanvasRenderingContext2D | null = null;

    public images: PassionImage[] = [];
    public sounds: Sound[] = [];
    public sockets: WSClient[] = [];

    displayScale: number = 1;
    touchIdentified?: number;

    system?: System;
    resource?: Resource;
    graphics?: Graphics;
    input?: Input;
    math?: PassionMath;
    audio?: Audio;
    network?: Network;

    isReady(): boolean {
        return this.canvas !== null && this.context !== null;
    }
}
