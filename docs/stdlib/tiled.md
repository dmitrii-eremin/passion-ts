# Tiled — Tilemap API Reference

The Tiled module in Passion's standard library provides a comprehensive API for working with tilemaps, tilesets, layers, and objects exported from the Tiled map editor. This API enables efficient rendering, animation, and interaction with 2D tile-based maps in games and graphical applications.

---

## Overview

The Tiled API centers around the `IMap` interface, which represents a loaded Tiled map. It provides access to map properties, layers, tilesets, and objects, as well as methods for updating animations and rendering the map. The API is designed for flexibility, extensibility, and ease of integration with game engines and custom rendering pipelines.

---

## API Reference

### Interface: `IMap`

#### Properties
- **version**: `string` — Tiled map format version.
- **tiledversion**: `string` — Tiled editor version used to create the map.
- **orientation**: `Orientation` — Map orientation (e.g., `'orthogonal'`).
- **renderOrder**: `RenderOrder` — Tile rendering order (e.g., `'right-down'`).
- **width**: `number` — Map width in tiles.
- **height**: `number` — Map height in tiles.
- **tileWidth**: `number` — Width of a single tile in pixels.
- **tileHeight**: `number` — Height of a single tile in pixels.
- **infinite**: `boolean` — Whether the map uses infinite mode.
- **backgroundColor**: `Color` — Background color of the map.
- **layers**: `IDrawableLayer[]` — Array of all map layers (tile layers, object groups, image layers).

#### Methods
- **update(dt: number): void**
  - Advances tile animations and updates internal state.
  - **dt**: `number` — Time step in seconds.
- **draw(x: number, y: number): void**
  - Renders the map at the specified position.
  - **x**: `number` — X coordinate to draw the map.
  - **y**: `number` — Y coordinate to draw the map.
- **getObjectsByType(typeName: string): IObject[]**
  - Returns all objects of a given type from all object groups.
  - **typeName**: `string` — The type of objects to retrieve.
- **getObjectsByName(name: string): IObject[]**
  - Returns all objects with the specified name from all object groups.
  - **name**: `string` — The name of objects to retrieve.
- **getLayersByName(name: string): IDrawableLayer[]**
  - Returns all layers with the specified name.
  - **name**: `string` — The name of layers to retrieve.

---

### Related Interfaces

#### `IDrawableLayer`
Represents a generic drawable layer (tile layer, object group, or image layer).
- **name**: `string` — Layer name.
- **id**: `number` — Layer ID.
- **visible**: `boolean` — Visibility flag.
- **offsetX**: `number` — X offset in pixels.
- **offsetY**: `number` — Y offset in pixels.
- **customDrawCallback**: `CustomDrawCallback | undefined` — Optional custom draw callback.
- **draw(cb: DrawCallback): void** — Draws the layer using a callback.
- **setCustomDrawCallback(cb: CustomDrawCallback | undefined): void** — Sets a custom draw callback.

#### `ILayer` (extends `IDrawableLayer`)
Represents a tile layer.
- **width**: `number` — Layer width in tiles.
- **height**: `number` — Layer height in tiles.
- **encoding?**: `Encoding` — Tile data encoding.
- **compression?**: `Compression` — Tile data compression.

#### `IObjectGroup` (extends `IDrawableLayer`)
Represents an object group layer.
- **objects**: `IObject[]` — Array of objects in the group.
- **getObjectsByType(typeName: string): IObject[]** — Get objects by type.
- **getObjectsByName(name: string): IObject[]** — Get objects by name.

#### `IImageLayer` (extends `IDrawableLayer`)
Represents an image layer.

#### `ITileset`
Represents a tileset used by the map.
- **name**: `string` — Tileset name.
- **firstGid**: `number` — First global tile ID.
- **tileWidth**: `number` — Tile width in pixels.
- **tileHeight**: `number` — Tile height in pixels.
- **tileCount**: `number` — Number of tiles.
- **columns**: `number` — Number of tile columns.
- **image**: `IImage` — Tileset image.
- **animations**: `ITileAnimation[]` — Tile animations.
- **containsGid(gid: number): boolean** — Checks if the tileset contains a GID.
- **update(dt: number): void** — Updates tile animations.
- **blt(gid: number, x: number, y: number, w?: number, h?: number): void** — Draws a tile.

#### `IObject`
Represents a map object (e.g., collision, spawn point).
- **id**: `number` — Object ID.
- **gid**: `number` — Tile GID (if tile object).
- **x, y, width, height**: `number` — Position and size.
- **type**: `string` — Object type.
- **name**: `string` — Object name.
- **properties**: `{ [key: string]: ObjectProperty }` — Custom properties.
- **draw(cb: DrawCallback): void** — Draws the object.

---

## Example Usage

```typescript
import { loadTiledMap } from 'passion/stdlib/tiled';

// Load a Tiled map (implementation-specific)
const map: IMap = await loadTiledMap('tilemap.tmx');

// In your game loop:
function update(dt: number) {
    map.update(dt); // Update tile animations
}

function draw() {
    map.draw(0, 0); // Draw the map at (0, 0)
}

// Access objects by type or name
const enemies = map.getObjectsByType('Enemy');
const spawnPoints = map.getObjectsByName('Spawn');
```

---

### Example: Loading a New Map

```typescript
// Inside your game class or logic, to load a new map:
this.passion.tiled.load('./tilemap/another_map.tmx').then((newMap) => {
    this.map = newMap;
    // Optionally, set up custom draw callbacks or other logic for the new map
    const sceneLayer = newMap.getLayersByName('scene')[0];
    sceneLayer.setCustomDrawCallback((_layer, x, y) => {
        // Draw something in the new map's scene layer
        this.passion.graphics.rectb(x + 40, y + 40, 32, 32, 12);
    });
});
```

---

### Example: Rendering a Player in a Specific Layer

```typescript
// Assume you have a player object with x, y coordinates
const player = { x: 50, y: 100 };

// Get the layer where you want to render the player (e.g., 'scene')
const sceneLayer = map.getLayersByName('scene')[0];

// Set a custom draw callback for the layer
drawPlayerInLayer();

function drawPlayerInLayer() {
    sceneLayer.setCustomDrawCallback((_layer, x, y) => {
        // Draw the player at the correct position relative to the layer
        // Replace with your engine's drawing code
        graphics.rectb(x + player.x, y + player.y, 16, 16, 7); // Example: draw a 16x16 rectangle for the player
    });
}

// Now, when map.draw() is called, the player will be rendered in the specified layer.
```

## Design Philosophy

- **Comprehensive**: Supports all major Tiled map features (tile layers, object groups, image layers, animations).
- **Flexible**: Works with custom rendering and game logic.
- **Extensible**: Easily integrates with other engine systems.

---

For more details on tilemaps and the Tiled editor, see the [Passion engine documentation](../index.md).
