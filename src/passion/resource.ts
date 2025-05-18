import type { ImageIndex, SoundIndex } from './constants';
import type { PassionData } from './data';
import { PassionImage } from './image';
import { Sound } from './sound';
import type { SubSystem } from './subsystem';

export interface IResource {
  loadImage(path: string): ImageIndex;
  loadSound(path: string): SoundIndex;
}

export class Resource implements IResource, SubSystem {
    private data: PassionData;

    constructor(data: PassionData) {
      this.data = data;
    }

    loadImage(path: string): ImageIndex {
      const image = new PassionImage(path);
      this.data.images.push(image);
      return this.data.images.length - 1 as ImageIndex;
    }

    loadSound(path: string): SoundIndex {
      const sound = new Sound(path);
      this.data.sounds.push(sound);
      return this.data.sounds.length - 1 as SoundIndex;
    }

    onBeforeAll(_dt: number) {}
    onAfterAll(_dt: number) {}
}