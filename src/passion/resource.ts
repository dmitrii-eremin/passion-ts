import type { PassionData } from './data';
import type { SubSystem } from './subsystem';

export interface IResource {
}

export class Resource implements IResource, SubSystem {
    //private data: PassionData;

    constructor(_data: PassionData) {
      //  this.data = data;
    }

    onAfterAll(_dt: number) {
    }
}