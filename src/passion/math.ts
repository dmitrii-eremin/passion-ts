import { PerlinNoise } from "./internal/perlin_noise";
import { PassionRandom } from "./internal/random";
import type { SubSystem } from "./subsystem";

export interface IMath {
    ceil(x: number): number;
    floor(x: number): number;
    sgn(x: number): number;
    sqrt(x: number): number;
    sin(deg: number): number;
    cos(deg: number): number;
    atan2(y: number, x: number): number;
    rseed(seed: number): void;
    rndi(a: number, b: number): number;
    rndf(a: number, b: number): number;
    choice<T>(arr: T[]): T;
    nseed(seed: number): void;
    noise(x: number, y?: number, z?: number): number;
}

export class PassionMath implements IMath, SubSystem {
    private perlinNoise: PerlinNoise = new PerlinNoise();
    private randomGenerator: PassionRandom = new PassionRandom();

    onBeforeAll(_dt: number) {}
    onAfterAll(_dt: number) {}

    ceil(x: number): number {
        return Math.ceil(x);
    }

    floor(x: number): number {
        return Math.floor(x);
    }

    sgn(x: number): number {
        return x > 0 ? 1 : x < 0 ? -1 : 0;
    }

    sqrt(x: number): number {
        return Math.sqrt(x);
    }

    sin(deg: number): number {
        return Math.sin((deg * Math.PI) / 180);
    }

    cos(deg: number): number {
        return Math.cos((deg * Math.PI) / 180);
    }

    atan2(y: number, x: number): number {
        return (Math.atan2(y, x) * 180) / Math.PI;
    }

    rseed(seed: number): void {
        this.randomGenerator.setSeed(seed);
    }

    rndi(a: number, b: number): number {
        const min = Math.ceil(a);
        const max = Math.floor(b);
        return Math.floor(this.randomGenerator.next() * (max - min + 1)) + min;
    }

    rndf(a: number, b: number): number {
        return this.randomGenerator.next() * (b - a) + a;
    }

    choice<T>(arr: T[]): T {
        if (!arr.length) {
            throw new Error("Cannot choose from an empty array");
        }
        const idx = this.rndi(0, arr.length - 1);
        return arr[idx];
    }

    nseed(seed: number): void {
        this.perlinNoise.setSeed(seed);
    }

    noise(x: number, y: number = 0, z: number = 0): number {
        return this.perlinNoise.noise(x, y, z);
    }
}