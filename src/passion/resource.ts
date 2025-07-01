import type { ImageIndex, FontIndex, SoundIndex } from './constants';
import type { PassionData } from './data';
import { PassionImage } from './image';
import { BdfFont } from './internal/bdf_font';
import { generateUniqueName } from './internal/random_id';
import { Sound } from './sound';
import type { SubSystem } from './subsystem';

export interface IResource {
  loadImage(path: string): ImageIndex;
  loadFont(fontData: string): FontIndex;
  loadSound(path: string): SoundIndex;
}

export class Resource implements IResource, SubSystem {
    private data: PassionData;

    constructor(data: PassionData) {
      this.data = data;
    }

    loadImage(path: string): ImageIndex {
      const id = generateUniqueName('img') as ImageIndex;
      const image = new PassionImage(path);
      this.data.images.set(id, image);
      return id;
    }
    
    loadFont(fontData: string): FontIndex {
      const id = generateUniqueName('fnt') as ImageIndex;
      BdfFont.createAsync(fontData).then(font => {
        this.data.fonts.set(id, font);
      });
      return id;
    }

    loadSound(path: string): SoundIndex {
      const id = generateUniqueName('snd') as SoundIndex;
      const sound = new Sound(path);
      this.data.sounds.set(id, sound);
      return id;
    }

    onBeforeAll(_dt: number) {}
    onAfterAll(_dt: number) {}
}
