import { System } from './system';
import { Graphics } from './graphics';
import { Input } from './input';
import { Resource } from './resource';

export class PassionData {
    public canvas: HTMLCanvasElement | null = null;
    public context: CanvasRenderingContext2D | null = null;

    system?: System;
    resource?: Resource;
    graphics?: Graphics;
    input?: Input;

    isReady(): boolean {
        return this.canvas !== null && this.context !== null;
    }
}
