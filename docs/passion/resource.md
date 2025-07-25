# IResource — Resource Management API Reference

The `IResource` interface provides a simple, type-safe, and efficient way to load and manage game assets in Passion. It is responsible for loading images, sounds, fonts, and canvases, assigning them unique indices, and making them available for use throughout your game. This subsystem abstracts away the details of asset management, allowing you to focus on game logic and creativity.

---

## Overview

Resource management is a core part of any game engine. In Passion, the resource API is designed to be minimal and intuitive, making it easy to load and reference assets by unique indices. This approach enables efficient asset lookup and decouples your game logic from file paths or raw asset objects.

---

## API Reference

### Interface: `IResource`

#### Methods

##### `loadImage(path: string): ImageIndex`
Loads an image from the specified path and returns a unique image index for later reference.

- **path**: `string` — The path or URL to the image file (e.g., `'./images/player.png'`).
- **returns**: `ImageIndex` — A unique index representing the loaded image.

##### `loadSound(path: string): SoundIndex`
Loads a sound from the specified path and returns a unique sound index for later reference.

- **path**: `string` — The path or URL to the sound file (e.g., `'./sounds/jump.wav'`).
- **returns**: `SoundIndex` — A unique index representing the loaded sound.

##### `loadFont(fontData: string): FontIndex`
Loads a bitmap font from a BDF font string and returns a unique font index for later reference. Font loading is asynchronous; the font will be available after it is parsed.

- **fontData**: `string` — The contents of a BDF font file as a string.
- **returns**: `FontIndex` — A unique index representing the loaded font.

##### `createCanvas(width?: number, height?: number): CanvasIndex`
Creates a new offscreen canvas and returns a unique canvas index for later reference.

- **width**: `number` *(optional)* — The width of the canvas. Defaults to the system width or 256.
- **height**: `number` *(optional)* — The height of the canvas. Defaults to the system height or 256.
- **returns**: `CanvasIndex` — A unique index representing the created canvas.

---

## Example Usage

### Loading and Using Assets
```typescript
const playerImg: ImageIndex = passion.resource.loadImage('./images/player.png');
const jumpSnd: SoundIndex = passion.resource.loadSound('./sounds/jump.wav');
const font: FontIndex = passion.resource.loadFont(bdfFontString);
const offscreen: CanvasIndex = passion.resource.createCanvas(128, 128);

function draw(): void {
    passion.graphics.blt(10, 10, playerImg, 0, 0, 16, 16);
    passion.graphics.blt(50, 50, offscreen, 0, 0, 128, 128);
    passion.graphics.font(font);
    passion.graphics.text(10, 30, 'Hello');
}

function onJump(): void {
    passion.audio.play(jumpSnd);
}
```

---

## Design Philosophy

- **Simplicity**: Minimal API for fast prototyping and easy asset management.
- **Type-Safe**: All parameters and return values are fully typed.
- **Efficiency**: Assets are referenced by unique indices for fast lookup and decoupling from file paths.
- **Browser-First**: Designed for modern web environments and asynchronous asset loading.

---

For more details on integrating the resource API with other subsystems, see the [Passion engine documentation](./passion.md).
