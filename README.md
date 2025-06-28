# Passion
**Passion** is a modern, lightweight browser game engine for TypeScript, inspired by [Pyxel](https://github.com/kitao/pyxel) but designed from the ground up for web development. Passion provides a clean, modular API that makes it easy to build retro-style 2D games with minimal setup and maximum control.

```bash
npm install @dmitrii-eremin/passion-engine
```

Passion is designed for rapid prototyping and educational use, with a focus on clarity, hackability, and fun. The engine is fully written in TypeScript, making it type-safe and easy to extend. All rendering is done on a single HTMLCanvasElement, and the engine is dependency-free, running in any modern browser.

Whether you're making a jam game, a teaching demo, or a nostalgic pixel adventure, Passion gives you the tools to get started quickly and iterate fast. Explore the API below to see how each subsystem works and how you can use them together to build your own games.

## Inspiration
Built with inspiration from Pyxel, but tailored for TypeScript developers.

## Features

- Lightweight and easy to use
- Designed for rapid prototyping
- Runs in modern browsers

## Palette
Passion uses exactly the same palette as pyxel engine. But you can change it anyhow you'd like.
![palette.png](./images/palette.png)

# Documentation
The latest documentation is always available in this readme file, or you can browse it online at [https://passion-ts.readthedocs.io/en/latest/](https://passion-ts.readthedocs.io/en/latest/).

## API Reference

* [Passion](./docs/passion/passion.md) — the entry point for all API functions in the engine.
  * [ISystem](./docs/passion/system.md) — Core game loop, window, and timing management.
  * [IResource](./docs/passion/resource.md) — Image and sound loading and resource management.
  * [IGraphics](./docs/passion/graphics.md) — Drawing, palette, and rendering functions for 2D graphics.
  * [IInput](./docs/passion/input.md) — Keyboard, mouse, and touch input handling.
    * [IKeys](./docs/passion/keys.md) — Key codes and keyboard mapping reference.
  * [IMath](./docs/passion/math.md) — Math helpers, random numbers, and noise generation.
  * [IAudio](./docs/passion/audio.md) — Sound playback and audio control.
  * [INetwork](./docs/passion/network.md) — WebSocket networking for multiplayer and online games.
* StdLib - a set of useful helpers to extend the main engine
  * [Animation](./docs/stdlib/animation.md) — Animation utilities for sprite and frame-based animation.
  * [Tween](./docs/stdlib/tween.md) — Tweening and Easing Utility API Reference
  * [Position](./docs/stdlib/position.md) — 2D position utility class.
  * [Rect](./docs/stdlib/rect.md) — 2D rectangle utility class.
  * [Tiled](./docs/stdlib/tiled.md) — Load and render .tmx tilemaps (Tiled).

Passion also includes a standard library (stdlib) with additional helper classes, as listed above, to further support your game development needs.

# Getting started

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


# License
MIT