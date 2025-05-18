# Passion
**Passion** is a modern, lightweight browser game engine for TypeScript, inspired by [Pyxel](https://github.com/kitao/pyxel) but designed from the ground up for web development. Passion provides a clean, modular API that makes it easy to build retro-style 2D games with minimal setup and maximum control.

```bash
npm install passion-engine
```

At its core, Passion is built around a set of focused subsystems:
- **System**: Manages the game loop, timing, and canvas scaling, providing a smooth and consistent frame rate.
- **Graphics**: Offers a pixel-perfect 2D renderer with palette-based color, camera support, and a suite of drawing primitives (lines, rectangles, circles, ellipses, triangles, flood fill, and text rendering using a built-in bitmap font). It supports image blitting with flipping, scaling, rotation, and color key transparency.
- **Resource**: Handles loading and managing images and sounds, making asset management simple and efficient.
- **Input**: Provides unified keyboard and mouse input, including key/button state tracking, repeat/hold logic, and mouse wheel support.
- **Math**: Supplies utility functions for random numbers, Perlin noise, and common math operations, all tailored for game development.
- **Audio**: Enables playback and control of sound effects, including speed and volume adjustments.

Passion is designed for rapid prototyping and educational use, with a focus on clarity, hackability, and fun. The engine is fully written in TypeScript, making it type-safe and easy to extend. All rendering is done on a single HTMLCanvasElement, and the engine is dependency-free, running in any modern browser.

Whether you're making a jam game, a teaching demo, or a nostalgic pixel adventure, Passion gives you the tools to get started quickly and iterate fast. Explore the API below to see how each subsystem works and how you can use them together to build your own games.

## Features

- Lightweight and easy to use
- Designed for rapid prototyping
- Runs in modern browsers

## Getting Started

Here's a minimal example to get you started with Passion:

```ts
import { Passion } from './passion/passion';

// Get your canvas element
const canvas = document.getElementById('app') as HTMLCanvasElement;

// Create the engine
const passion = new Passion(canvas);

// Initialize the system (width, height, title, scale)
passion.system.init(240, 180, 'My Passion Game', 3);

// Load resources
const imageIndex = passion.resource.loadImage('./cat_16x16.png');
const soundIndex = passion.resource.loadSound('./Jump1.wav');

// Main update and draw functions
function update(dt: number) {
  // Game logic here
}

function draw() {
  passion.graphics.cls(0); // Clear screen with color 0
  passion.graphics.text(10, 10, 'Hello, Passion!', 7);
  passion.graphics.blt(50, 50, imageIndex, 0, 0, 16, 16); // Draw image
}

// Start the game loop
passion.system.run(update, draw);
```

Make sure your HTML contains a canvas element with id `app`:

```html
<canvas id="app" width="240" height="180" tabindex="0"></canvas>
```

This will display a window, clear the screen, draw some text, and blit an image. You can expand on this by using the full API described below.

## Inspiration
Built with inspiration from Pyxel, but tailored for TypeScript developers.

# Passion Game Engine Public API

The main entry point is the `Passion` class, which exposes several subsystems for game development:

## Passion

```ts
/**
 * Main Passion game engine class.
 * @param canvas The HTMLCanvasElement to render the game on.
 */
new Passion(canvas: HTMLCanvasElement)
```

### Subsystems

- `system: ISystem`
- `resource: IResource`
- `graphics: IGraphics`
- `input: IInput`
- `math: IMath`
- `audio: IAudio`

---

## ISystem

```ts
interface ISystem {
  /** Width of the game screen in pixels. */
  readonly width: number;
  /** Height of the game screen in pixels. */
  readonly height: number;
  /** Number of frames since the game started. */
  readonly frame_count: number;

  /**
   * Initialize the system.
   * @param width Screen width in pixels.
   * @param height Screen height in pixels.
   * @param title (Optional) Window or game title.
   * @param display_scale (Optional) Display scale factor.
   */
  init(width: number, height: number, title?: string, display_scale?: number): void;
  /**
   * Start the game loop.
   * @param update Function called every frame with delta time (dt) in seconds.
   * @param draw Function called every frame to render the game.
   */
  run(update: (dt: number) => void, draw: () => void): void;
}
```

---

## IResource

```ts
interface IResource {
  /**
   * Load an image resource and return its index.
   * @param path Path or URL to the image file.
   * @returns ImageIndex assigned to the loaded image.
   */
  loadImage(path: string): ImageIndex;
  /**
   * Load a sound resource and return its index.
   * @param path Path or URL to the sound file.
   * @returns SoundIndex assigned to the loaded sound.
   */
  loadSound(path: string): SoundIndex;
}
```

---

## IGraphics

```ts
interface IGraphics {
  /** Array of loaded images. */
  readonly images: PassionImage[];

  /**
   * Set or get the camera position.
   * @param x (Optional) X coordinate of the camera.
   * @param y (Optional) Y coordinate of the camera.
   */
  camera(x?: number, y?: number): void;
  /**
   * Clear the screen with a color.
   * @param col Color index to fill the screen with.
   */
  cls(col: Color): void;
  /**
   * Get the color of a pixel.
   * @param x X coordinate.
   * @param y Y coordinate.
   * @returns Color index at the specified pixel.
   */
  pget(x: number, y: number): Color;
  /**
   * Set the color of a pixel.
   * @param x X coordinate.
   * @param y Y coordinate.
   * @param col Color index to set.
   */
  pset(x: number, y: number, col: Color): void;
  /**
   * Draw a line between two points.
   * @param x1 X coordinate of the start point.
   * @param y1 Y coordinate of the start point.
   * @param x2 X coordinate of the end point.
   * @param y2 Y coordinate of the end point.
   * @param col Color index of the line.
   */
  line(x1: number, y1: number, x2: number, y2: number, col: Color): void;
  /**
   * Draw a filled rectangle.
   * @param x X coordinate of the top-left corner.
   * @param y Y coordinate of the top-left corner.
   * @param w Width of the rectangle.
   * @param h Height of the rectangle.
   * @param col Color index to fill.
   */
  rect(x: number, y: number, w: number, h: number, col: Color): void;
  /**
   * Draw a rectangle border.
   * @param x X coordinate of the top-left corner.
   * @param y Y coordinate of the top-left corner.
   * @param w Width of the rectangle.
   * @param h Height of the rectangle.
   * @param col Color index of the border.
   */
  rectb(x: number, y: number, w: number, h: number, col: Color): void;
  /**
   * Draw a filled circle.
   * @param x X coordinate of the center.
   * @param y Y coordinate of the center.
   * @param r Radius of the circle.
   * @param col Color index to fill.
   */
  circ(x: number, y: number, r: number, col: Color): void;
  /**
   * Draw a circle border.
   * @param x X coordinate of the center.
   * @param y Y coordinate of the center.
   * @param r Radius of the circle.
   * @param col Color index of the border.
   */
  circb(x: number, y: number, r: number, col: Color): void;
  /**
   * Draw a filled ellipse.
   * @param x X coordinate of the center.
   * @param y Y coordinate of the center.
   * @param w Width of the ellipse.
   * @param h Height of the ellipse.
   * @param col Color index to fill.
   */
  elli(x: number, y: number, w: number, h: number, col: Color): void;
  /**
   * Draw an ellipse border.
   * @param x X coordinate of the center.
   * @param y Y coordinate of the center.
   * @param w Width of the ellipse.
   * @param h Height of the ellipse.
   * @param col Color index of the border.
   */
  ellib(x: number, y: number, w: number, h: number, col: Color): void;
  /**
   * Draw a filled triangle.
   * @param x1 X coordinate of the first vertex.
   * @param y1 Y coordinate of the first vertex.
   * @param x2 X coordinate of the second vertex.
   * @param y2 Y coordinate of the second vertex.
   * @param x3 X coordinate of the third vertex.
   * @param y3 Y coordinate of the third vertex.
   * @param col Color index to fill.
   */
  tri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, col: Color): void;
  /**
   * Draw a triangle border.
   * @param x1 X coordinate of the first vertex.
   * @param y1 Y coordinate of the first vertex.
   * @param x2 X coordinate of the second vertex.
   * @param y2 Y coordinate of the second vertex.
   * @param x3 X coordinate of the third vertex.
   * @param y3 Y coordinate of the third vertex.
   * @param col Color index of the border.
   */
  trib(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, col: Color): void;
  /**
   * Flood fill an area with a color.
   * @param x X coordinate to start filling from.
   * @param y Y coordinate to start filling from.
   * @param col Color index to fill.
   */
  fill(x: number, y: number, col: Color): void;
  /**
   * Draw text on the screen.
   * @param x X coordinate of the text.
   * @param y Y coordinate of the text.
   * @param text The string to draw.
   * @param col Color index of the text.
   */
  text(x: number, y: number, text: string, col: Color): void;
  /**
   * Blit (draw) a region of an image to the screen.
   * @param x X coordinate to draw at.
   * @param y Y coordinate to draw at.
   * @param img Image index to draw from.
   * @param u X coordinate in the image.
   * @param v Y coordinate in the image.
   * @param w Width of the region to draw.
   * @param h Height of the region to draw.
   * @param colkey (Optional) Color index to treat as transparent.
   * @param rotate (Optional) Rotation in degrees.
   * @param scale (Optional) Scale factor.
   */
  blt(x: number, y: number, img: ImageIndex, u: number, v: number, w: number, h: number, colkey?: Color, rotate?: number, scale?: number): void;
}
```

---

## IInput

```ts
interface IInput {
  /** Mouse X coordinate. */
  readonly mouse_x: number;
  /** Mouse Y coordinate. */
  readonly mouse_y: number;
  /** Mouse wheel X movement. */
  readonly mouse_wheel_x: number;
  /** Mouse wheel Y movement. */
  readonly mouse_wheel_y: number;

  /**
   * Show or hide the mouse cursor.
   * @param visible Whether the mouse should be visible.
   */
  mouse(visible: boolean): void;
  /**
   * Check if a key or button is currently pressed.
   * @param key Key or button to check.
   * @returns True if pressed.
   */
  btn(key: Key): boolean;
  /**
   * Check if a key or button was released this frame.
   * @param key Key or button to check.
   * @returns True if released.
   */
  btnr(key: Key): boolean;
  /**
   * Check if a key or button was pressed this frame, with optional hold/repeat.
   * @param key Key or button to check.
   * @param hold (Optional) Frames to hold before repeat starts.
   * @param repeat (Optional) Repeat interval in frames.
   * @returns True if pressed.
   */
  btnp(key: Key, hold?: number, repeat?: number): boolean;
}
```

---

## IMath

```ts
interface IMath {
  /**
   * Round up to the nearest integer.
   * @param x Number to round up.
   * @returns Rounded integer.
   */
  ceil(x: number): number;
  /**
   * Round down to the nearest integer.
   * @param x Number to round down.
   * @returns Rounded integer.
   */
  floor(x: number): number;
  /**
   * Get the sign of a number.
   * @param x Number to check.
   * @returns -1, 0, or 1.
   */
  sgn(x: number): number;
  /**
   * Get the square root of a number.
   * @param x Number to get the square root of.
   * @returns Square root.
   */
  sqrt(x: number): number;
  /**
   * Sine of an angle in degrees.
   * @param deg Angle in degrees.
   * @returns Sine value.
   */
  sin(deg: number): number;
  /**
   * Cosine of an angle in degrees.
   * @param deg Angle in degrees.
   * @returns Cosine value.
   */
  cos(deg: number): number;
  /**
   * Arc tangent of y/x in degrees.
   * @param y Y coordinate.
   * @param x X coordinate.
   * @returns Angle in degrees.
   */
  atan2(y: number, x: number): number;
  /**
   * Set the random seed for rndi/rndf.
   * @param seed Seed value.
   */
  rseed(seed: number): void;
  /**
   * Get a random integer in [a, b].
   * @param a Lower bound (inclusive).
   * @param b Upper bound (inclusive).
   * @returns Random integer.
   */
  rndi(a: number, b: number): number;
  /**
   * Get a random float in [a, b).
   * @param a Lower bound (inclusive).
   * @param b Upper bound (exclusive).
   * @returns Random float.
   */
  rndf(a: number, b: number): number;
  /**
   * Set the seed for noise().
   * @param seed Seed value.
   */
  nseed(seed: number): void;
  /**
   * Get Perlin noise value for coordinates.
   * @param x X coordinate.
   * @param y (Optional) Y coordinate.
   * @param z (Optional) Z coordinate.
   * @returns Noise value.
   */
  noise(x: number, y?: number, z?: number): number;
}
```

---

## IAudio

```ts
interface IAudio {
  /**
   * Play a sound.
   * @param snd Sound index to play.
   */
  play(snd: SoundIndex): void;
  /**
   * Pause a sound.
   * @param snd Sound index to pause.
   */
  pause(snd: SoundIndex): void;
  /**
   * Stop a sound.
   * @param snd Sound index to stop.
   */
  stop(snd: SoundIndex): void;
  /**
   * Set playback speed for a sound.
   * @param snd Sound index.
   * @param speed Playback speed (1.0 = normal).
   */
  speed(snd: SoundIndex, speed: number): void;
  /**
   * Set volume for a sound.
   * @param snd Sound index.
   * @param volume Volume (0.0–1.0).
   */
  volume(snd: SoundIndex, volume: number): void;
}
```

---

## Types

- `Color`: 0–15 (palette index)
- `ImageIndex`, `SoundIndex`: integer indices for resources
- `Key`: string key names (see key.ts for all supported keys)

---

This API allows you to control the game loop, draw graphics, handle input, manage resources, perform math operations, and play audio. Let me know if you want a more detailed description of any subsystem or method!

## License
MIT