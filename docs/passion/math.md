# IMath — Math Utilities API Reference

The `IMath` interface provides a rich, type-safe, and expressive set of mathematical utilities for Passion games. It includes common math functions, random number generation, and Perlin noise, all designed for game development and creative coding. The math subsystem is your go-to toolkit for calculations, randomness, and procedural content.

---

## Overview

The math API is designed to be both familiar and powerful, offering a blend of standard math operations and game-specific helpers. It supports deterministic random number generation (for reproducible gameplay), as well as smooth Perlin noise for procedural effects.

---

## API Reference

### Interface: `IMath`

#### Methods

##### `ceil(x: number): number`
Returns the smallest integer greater than or equal to `x`.
- **x**: `number` — The input value.
- **returns**: `number` — The smallest integer ≥ `x`.

##### `floor(x: number): number`
Returns the largest integer less than or equal to `x`.
- **x**: `number` — The input value.
- **returns**: `number` — The largest integer ≤ `x`.

##### `sgn(x: number): number`
Returns the sign of `x` as `-1`, `0`, or `1`.
- **x**: `number` — The input value.
- **returns**: `number` — `1` if positive, `-1` if negative, `0` if zero.

##### `sqrt(x: number): number`
Returns the square root of `x`.
- **x**: `number` — The input value.
- **returns**: `number` — The square root of `x`.

##### `sin(deg: number): number`
Returns the sine of an angle in degrees.
- **deg**: `number` — The angle in degrees.
- **returns**: `number` — The sine of the angle.

##### `cos(deg: number): number`
Returns the cosine of an angle in degrees.
- **deg**: `number` — The angle in degrees.
- **returns**: `number` — The cosine of the angle.

##### `atan2(y: number, x: number): number`
Returns the angle (in degrees) from the X axis to the point `(x, y)`.
- **y**: `number` — The y coordinate.
- **x**: `number` — The x coordinate.
- **returns**: `number` — The angle in degrees.

##### `rseed(seed: number): void`
Sets the seed for the random number generator (for reproducible randomness).
- **seed**: `number` — The seed value.
- **returns**: `void`

##### `rndi(a: number, b: number): number`
Returns a random integer between `a` and `b` (inclusive).
- **a**: `number` — The lower bound (inclusive).
- **b**: `number` — The upper bound (inclusive).
- **returns**: `number` — A random integer in `[a, b]`.

##### `rndf(a: number, b: number): number`
Returns a random floating-point number between `a` (inclusive) and `b` (exclusive).
- **a**: `number` — The lower bound (inclusive).
- **b**: `number` — The upper bound (exclusive).
- **returns**: `number` — A random float in `[a, b)`.

##### `nseed(seed: number): void`
Sets the seed for Perlin noise generation.
- **seed**: `number` — The seed value.
- **returns**: `void`

##### `noise(x: number, y?: number, z?: number): number`
Returns a Perlin noise value for the given coordinates.
- **x**: `number` — The x coordinate.
- **y**: `number` *(optional)* — The y coordinate. Defaults to `0`.
- **z**: `number` *(optional)* — The z coordinate. Defaults to `0`.
- **returns**: `number` — The Perlin noise value (typically in `[-1, 1]`).

---

## Example Usage

### Random Numbers and Noise
```typescript
// Set random seed for reproducible results
passion.math.rseed(42);
const n: number = passion.math.rndi(1, 10); // Random integer between 1 and 10
const f: number = passion.math.rndf(0, 1);  // Random float between 0 and 1

// Set Perlin noise seed and get a noise value
passion.math.nseed(123);
const value: number = passion.math.noise(10.5, 20.0);
```

### Trigonometry and Utility Functions
```typescript
const angle: number = passion.math.atan2(1, 0); // 90 degrees
const s: number = passion.math.sin(45);         // Sine of 45 degrees
const c: number = passion.math.cos(60);         // Cosine of 60 degrees
const sign: number = passion.math.sgn(-5);      // -1
```

---

## Design Philosophy

- **Comprehensive**: Covers all common math needs for games.
- **Type-Safe**: All parameters and return values are fully typed.
- **Deterministic**: Supports seeding for reproducible randomness and noise.
- **Game-Focused**: Includes helpers for angles, randomness, and procedural content.

---

For more details on integrating the math API with other subsystems, see the [Passion engine documentation](./passion.md).
