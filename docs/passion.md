# Passion Class Documentation

## Overview

The `Passion` class is the main entry point for the Passion engine. It acts as a container and orchestrator for all subsystems, including graphics, input, audio, networking, resources, and math. It is designed to be initialized with an HTML `<canvas>` element and provides a unified API for interacting with the engine's core features.

---

## Constructor

```typescript
constructor(canvas: HTMLCanvasElement)
```

- **canvas**: The HTML canvas element to be used for rendering and input.

Initializes all subsystems and sets up event listeners on the canvas for input handling (mouse, keyboard, touch, and wheel events).

---

## Properties

- **system: ISystem**  
  Provides access to system-level functionality (timing, main loop, etc).
- **resource: IResource**  
  Manages loading and access to resources (images, sounds, etc).
- **graphics: IGraphics**  
  Handles all rendering operations.
- **input: IInput**  
  Manages keyboard, mouse, and touch input.
- **math: IMath**  
  Provides math utilities.
- **audio: IAudio**  
  Handles audio playback and manipulation.
- **network: INetwork**  
  Provides networking capabilities.

---

## Event Handling

The `Passion` class automatically attaches the following event listeners to the provided canvas:

- **Mouse Events**: `mousedown`, `mouseup`, `mousemove`, `wheel`
- **Keyboard Events**: `keydown`, `keyup`
- **Touch Events**: `touchstart`, `touchend`, `touchmove`

These events are forwarded to the appropriate input subsystem methods for unified handling.

---

## Example Usage

```typescript
import { Passion } from 'path/to/passion';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const passion = new Passion(canvas);

// Access subsystems
passion.graphics.clear();
passion.input.isKeyDown('ArrowUp');
// ...
```

---

## Subsystems

Each subsystem is initialized and accessible as a property on the `Passion` instance. They are responsible for their respective domains and can be used independently or together.

- **System**: Main loop, timing, and system events
- **Resource**: Asset loading and management
- **Graphics**: Drawing and rendering
- **Input**: Keyboard, mouse, and touch input
- **Math**: Math utilities
- **Audio**: Sound and music
- **Network**: Networking and communication

---

## Notes

- The canvas element is set to be focusable (`tabIndex = 0`) to ensure keyboard events are captured.
- All event listeners call `preventDefault()` to avoid unwanted browser behavior.
- The class is designed for extensibility and modularity, with each subsystem being replaceable or extendable.

---

## See Also

- [Subsystem Documentation](./)
- [Usage Guide](usage.md)
- [Graphics](./graphics.md)