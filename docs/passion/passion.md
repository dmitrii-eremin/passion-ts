# Passion Engine API

The `Passion` class is the main entry point for the Passion game engine. It provides access to all core subsystems required to build 2D games in the browser, including graphics, input, audio, resource management, math utilities, and networking. This class is designed to be instantiated with a single HTMLCanvasElement, which serves as the rendering surface for your game.

## Usage

```typescript
import { Passion } from '@dmitrii-eremin/passion-engine';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const passion = new Passion(canvas);
```

## Constructor

### `new Passion(canvas: HTMLCanvasElement)`
- **canvas**: The HTMLCanvasElement to use for rendering. All drawing and input will be handled through this canvas.

Initializes all engine subsystems and sets up event listeners for input (keyboard, mouse, touch) on the provided canvas.

## Subsystems

The `Passion` instance exposes the following subsystems as properties:

- **system**: [`ISystem`](./system.md) — Core game loop, window, and timing management. Controls initialization, frame updates, and the main run loop.
- **resource**: [`IResource`](./resource.md) — Handles loading and management of images and sounds.
- **graphics**: [`IGraphics`](./graphics.md) — Provides drawing functions for 2D graphics, including shapes, images, text, and palette management.
- **input**: [`IInput`](./input.md) — Manages keyboard, mouse, and touch input. Tracks button states and pointer positions.
- **math**: [`IMath`](./math.md) — Math helpers, random number generation, and Perlin noise utilities.
- **audio**: [`IAudio`](./audio.md) — Controls sound playback, volume, and speed.
- **network**: [`INetwork`](./network.md) — WebSocket networking for multiplayer and online features.
- **tiled**: [`ITiled`](../stdlib/tiled.md) — Tiled map loading and rendering for `.tmx` maps created with the Tiled editor.

## Event Handling

The engine automatically attaches event listeners to the canvas for:
- Mouse events (move, down, up, wheel)
- Keyboard events (down, up)
- Touch events (start, move, end)

This ensures that all input is captured and routed to the appropriate subsystem, making it easy to build interactive games without manual event wiring.

## Example: Minimal Game Loop

```typescript
passion.system.init(256, 256, 'My Game');

function update(dt: number) {
    // Game logic here
}

function draw() {
    passion.graphics.cls(0); // Clear screen with color 0
    // Drawing code here
}

passion.system.run(update, draw);
```

## Design Philosophy

- **Modular**: Each subsystem is independent and can be used in isolation or together.
- **Type-Safe**: Written in TypeScript for robust, type-checked development.
- **Browser-First**: Designed for modern browsers, with no external dependencies.
- **Retro-Inspired**: Inspired by Pyxel, but tailored for TypeScript and the web.

---

For more details on each subsystem, see their respective documentation pages linked above.