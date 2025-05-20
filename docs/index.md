# Passion

**Passion** is a modern, lightweight browser game engine for TypeScript, inspired by [Pyxel](https://github.com/kitao/pyxel) but designed from the ground up for web development. Passion provides a clean, modular API that makes it easy to build retro-style 2D games with minimal setup and maximum control.

```bash
npm install @dmitrii-eremin/passion-engine
```

## Documentation
The latest documentation is always available below in this README, or you can browse it online at [https://passion-ts.readthedocs.io/en/latest/](https://passion-ts.readthedocs.io/en/latest/).


## Overview
At its core, Passion is built around a set of focused subsystems:
- **System**: Manages the game loop, timing, and canvas scaling, providing a smooth and consistent frame rate.
- **Graphics**: Offers a pixel-perfect 2D renderer with palette-based color (custom colors are also possible), camera support, and a suite of drawing primitives (lines, rectangles, circles, ellipses, triangles, flood fill, and text rendering using a built-in bitmap font). It supports image blitting with flipping, scaling, rotation, and color key transparency.
- **Resource**: Handles loading and managing images and sounds, making asset management simple and efficient.
- **Input**: Provides unified keyboard and mouse input, including key/button state tracking, repeat/hold logic, and mouse wheel support.
- **Math**: Supplies utility functions for random numbers, Perlin noise, and common math operations, all tailored for game development.
- **Audio**: Enables playback and control of sound effects, including speed and volume adjustments.

### StdLib
The **StdLib** is a collection of simple, reusable helpers that extend the core engine, making it easier and faster to develop games. It includes utilities for common tasks such as animation, grid management, and other gameplay patterns, allowing you to focus on building your game logic without reinventing the wheel.
- **Animation**: Provides tools for creating and managing animations, including grid-based animations and frame rectangles.
- **Collision**: Integrates the bump collision detection library, providing simple and efficient AABB collision handling for grid-based and platformer games.

Passion is designed for rapid prototyping and educational use, with a focus on clarity, hackability, and fun. The engine is fully written in TypeScript, making it type-safe and easy to extend. All rendering is done on a single HTMLCanvasElement, and the engine is dependency-free, running in any modern browser.

Whether you're making a jam game, a teaching demo, or a nostalgic pixel adventure, Passion gives you the tools to get started quickly and iterate fast. Explore the API below to see how each subsystem works and how you can use them together to build your own games.

## Features

- Lightweight and easy to use
- Designed for rapid prototyping
- Runs in modern browsers
