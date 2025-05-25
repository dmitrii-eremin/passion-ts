import type { IMap } from "./tiledTypes";
import { Map } from './map';
import type { PassionData } from "../../data";

export interface ITiled {
    load(filename: string): Promise<IMap>;
}

export class Tiled implements ITiled {
    private data: PassionData;

    constructor(data: PassionData) {
        this.data = data;
    }
    
    async load(filename: string): Promise<IMap> {
        const map = new Map(this.data);
        map.load(filename);
        return map;
    }
}