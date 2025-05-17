import type { ImageIndex, SoundIndex } from '../constants';
import type { PassionData } from './data';
import type { SubSystem } from './subsystem';

export interface IResource {
  loadImage(img: ImageIndex, path: string): void;
  loadSound(snd: SoundIndex, path: string): void;
}

export class Resource implements IResource, SubSystem {
    private data: PassionData;

    constructor(data: PassionData) {
      this.data = data;
    }

    loadImage(img: ImageIndex, path: string) {
      this.data.images[img].load(0, 0, path);
    }

    loadSound(snd: SoundIndex, path: string) {
      this.data.sounds[snd].load(path);
    }

    onBeforeAll(_dt: number) {}
    onAfterAll(_dt: number) {}
}