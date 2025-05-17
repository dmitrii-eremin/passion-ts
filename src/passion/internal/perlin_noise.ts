export class PerlinNoise {
    private permutation: number[] = [];
    private p: number[] = [];

    constructor(seed: number = 0) {
        this.setSeed(seed);
    }

    setSeed(seed: number) {
        this.permutation = [];
        for (let i = 0; i < 256; i++) {
            this.permutation[i] = i;
        }
        // Simple seed shuffle (Fisher-Yates)
        let random = this.xorshift32(seed);
        for (let i = 255; i > 0; i--) {
            let j = Math.floor(random() * (i + 1));
            [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
        }
        this.p = this.permutation.concat(this.permutation);
    }

    // Xorshift32 PRNG for deterministic shuffling
    private xorshift32(seed: number) {
        let x = seed || 123456789;
        return function () {
            x ^= x << 13;
            x ^= x >> 17;
            x ^= x << 5;
            return (x < 0 ? ~x + 1 : x) % 0x100000000 / 0x100000000;
        };
    }

    // Fade function as defined by Ken Perlin
    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    // Linear interpolation
    private lerp(t: number, a: number, b: number): number {
        return a + t * (b - a);
    }

    // Gradient function
    private grad(hash: number, x: number, y: number, z: number): number {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x: number, y: number = 0, z: number = 0): number {
        // Find unit cube that contains point
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;

        // Find relative x, y, z of point in cube
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);

        // Compute fade curves for each of x, y, z
        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);

        // Hash coordinates of the 8 cube corners
        const A = this.p[X] + Y;
        const AA = this.p[A] + Z;
        const AB = this.p[A + 1] + Z;
        const B = this.p[X + 1] + Y;
        const BA = this.p[B] + Z;
        const BB = this.p[B + 1] + Z;

        // Add blended results from 8 corners of cube
        return this.lerp(w,
            this.lerp(v,
                this.lerp(u, this.grad(this.p[AA], x, y, z),
                             this.grad(this.p[BA], x - 1, y, z)),
                this.lerp(u, this.grad(this.p[AB], x, y - 1, z),
                             this.grad(this.p[BB], x - 1, y - 1, z))
            ),
            this.lerp(v,
                this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1),
                             this.grad(this.p[BA + 1], x - 1, y, z - 1)),
                this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1),
                             this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))
            )
        );
    }
}