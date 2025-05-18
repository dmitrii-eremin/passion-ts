import { System } from './system';
import { Graphics } from './graphics';
import { Input } from './input';
import { Resource } from './resource';
import { Audio } from './audio';
import { PassionMath } from './math';
import { PassionImage } from './image';
import { MAX_IMAGE_COUNT, MAX_SOUND_COUNT } from './constants';
import { Sound } from './sound';

export class PassionData {
    public canvas: HTMLCanvasElement | null = null;
    public context: CanvasRenderingContext2D | null = null;

    public images: PassionImage[] = Array.from({ length: MAX_IMAGE_COUNT }, () => new PassionImage());
    public sounds: Sound[] = Array.from({ length: MAX_SOUND_COUNT }, () => new Sound());

    displayScale: number = 1;

    system?: System;
    resource?: Resource;
    graphics?: Graphics;
    input?: Input;
    math?: PassionMath;
    audio?: Audio;

    isReady(): boolean {
        return this.canvas !== null && this.context !== null;
    }
}
