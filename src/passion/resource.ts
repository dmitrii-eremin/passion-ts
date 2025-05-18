import type { ImageIndex, SoundIndex } from './constants';
import type { PassionData } from './data';
import { PassionImage } from './image';
import { Sound } from './sound';
import type { SubSystem } from './subsystem';

export interface IResource {
  loadImage(path: string): ImageIndex;
  loadSound(path: string): SoundIndex;

  getImageIndex(path: string): ImageIndex | undefined;
  getSoundIndex(path: string): SoundIndex | undefined;
}

export class Resource implements IResource, SubSystem {
    private data: PassionData;

    private imagePathMap: Record<string, ImageIndex> = {};
    private soundPathMap: Record<string, SoundIndex> = {};

    constructor(data: PassionData) {
      this.data = data;
    }

    loadImage(path: string): ImageIndex {
      const image = new PassionImage(path);
      this.data.images.push(image);
      const index = this.data.images.length - 1 as ImageIndex;
      this.imagePathMap[path] = index;
      return index;
    }

    loadSound(path: string): SoundIndex {
      const sound = new Sound(path);
      this.data.sounds.push(sound);
      const index = this.data.sounds.length - 1 as SoundIndex;
      this.soundPathMap[path] = index;
      return index;
    }

    getImageIndex(path: string): ImageIndex | undefined {
      return this.imagePathMap[path];
    }

    getSoundIndex(path: string): SoundIndex | undefined {
      return this.soundPathMap[path];
    }

    onBeforeAll(_dt: number) {}
    onAfterAll(_dt: number) {}
}