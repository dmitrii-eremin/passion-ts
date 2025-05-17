import type { ImageIndex } from '../constants';
import type { PassionData } from './data';
import type { SubSystem } from './subsystem';

export interface IResource {
  loadImage(img: ImageIndex, path: string): void;
}

export class Resource implements IResource, SubSystem {
    private data: PassionData;

    constructor(data: PassionData) {
      this.data = data;
    }

    loadImage(img: ImageIndex, path: string) {
      this.data.images[img].load(0, 0, path);
    }

    onBeforeAll(_dt: number) {}
    onAfterAll(_dt: number) {}
}