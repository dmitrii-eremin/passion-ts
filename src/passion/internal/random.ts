export class PassionRandom {
    private _seed: number;

    constructor(seed: number = Date.now()) {
        this._seed = seed >>> 0;
    }

    setSeed(seed: number): void {
        this._seed = seed >>> 0;
    }

    // Linear Congruential Generator (LCG)
    next(): number {
        // Constants from Numerical Recipes
        this._seed = (this._seed * 1664525 + 1013904223) % 0x100000000;
        return this._seed / 0x100000000;
    }
}