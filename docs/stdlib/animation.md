# Animation & AnimationGrid — Animation Utilities API Reference

The `Animation` and `AnimationGrid` classes in Passion's standard library provide a powerful, type-safe, and flexible system for managing sprite animations. These utilities make it easy to define, play, and control frame-based animations for characters, effects, and UI elements in your games. The API is inspired by popular animation libraries and is designed for clarity, expressiveness, and performance.

---

## Overview

- **Animation**: Manages a sequence of frames, playback state, timing, and drawing for a single animation.
- **AnimationGrid**: Helps you define animation frames from a sprite sheet using a grid system, supporting anim8-style range strings for easy frame selection.

---

## API Reference

### Class: `AnimationFrameRect`
Represents a single frame's rectangle within a sprite sheet.
- **left**: `number` — X coordinate of the frame's top-left corner.
- **top**: `number` — Y coordinate of the frame's top-left corner.
- **width**: `number` — Width of the frame in pixels.
- **height**: `number` — Height of the frame in pixels.

---

### Class: `Animation`
Manages playback, timing, and drawing of a sequence of animation frames.

#### Constructor
```typescript
constructor(frames: AnimationFrameRect[], frameDuration: number, loop: boolean = true)
```
- **frames**: `AnimationFrameRect[]` — Array of frame rectangles.
- **frameDuration**: `number` — Duration of each frame in seconds.
- **loop**: `boolean` *(optional)* — Whether the animation should loop. Defaults to `true`.

#### Methods

- `play(): void` — Starts or resumes playback.
- `pause(): void` — Pauses playback.
- `stop(): void` — Pauses and rewinds to the first frame.
- `gotoFrame(frameIndex: number): void` — Jumps to a specific frame index.
- `rewind(): void` — Rewinds to the first frame.
- `update(dt: number): void` — Advances the animation by `dt` seconds.
- `draw(passion: Passion, x: number, y: number, img: ImageIndex, colkey?: Color, rotate?: number, scale?: number): void` — Draws the current frame at the specified position using the given image and optional color key, rotation, and scale.
- `getFrame(): AnimationFrameRect` — Returns the current frame rectangle.
- `isPlaying(): boolean` — Returns `true` if the animation is playing.
- `getFrameIndex(): number` — Returns the current frame index.

#### Example Usage
```typescript
const grid: AnimationGrid = new AnimationGrid(16, 16);
const frames: AnimationFrameRect[] = grid.range('1-4', '1');
const walkAnim: Animation = new Animation(frames, 0.1);

function update(dt: number): void {
    walkAnim.update(dt);
}

function draw(): void {
    walkAnim.draw(passion, 100, 100, playerImg);
}
```

---

### Class: `AnimationGrid`
Defines a grid for extracting animation frames from a sprite sheet.

#### Constructor
```typescript
constructor(frameWidth: number, frameHeight: number, offsetX: number = 0, offsetY: number = 0, spacingX: number = 0, spacingY: number = 0)
```
- **frameWidth**: `number` — Width of a single frame.
- **frameHeight**: `number` — Height of a single frame.
- **offsetX**: `number` *(optional)* — X offset in the sprite sheet. Defaults to `0`.
- **offsetY**: `number` *(optional)* — Y offset in the sprite sheet. Defaults to `0`.
- **spacingX**: `number` *(optional)* — Horizontal spacing between frames. Defaults to `0`.
- **spacingY**: `number` *(optional)* — Vertical spacing between frames. Defaults to `0`.

#### Methods

- `range(cols: string, rows: string): AnimationFrameRect[]` — Returns an array of frames using anim8-style range strings for columns and rows (e.g. `'1-4'`, `'1'`).
- `getFrameRect(col: number, row: number): AnimationFrameRect` — Returns the pixel rectangle for a given frame coordinate (1-based indices).

#### Example Usage
```typescript
const grid: AnimationGrid = new AnimationGrid(16, 16);
const frames: AnimationFrameRect[] = grid.range('1-4', '2'); // Frames in columns 1-4, row 2
const anim: Animation = new Animation(frames, 0.08);
```

---

## Design Philosophy

- **Expressive**: Easy to define and control animations with minimal code.
- **Type-Safe**: All parameters and return values are fully typed.
- **Flexible**: Supports looping, pausing, rewinding, and custom frame selection.
- **Sprite Sheet Friendly**: AnimationGrid makes working with sprite sheets effortless.

---

For more details on integrating animation utilities with other subsystems, see the [Passion engine documentation](../index.md).
