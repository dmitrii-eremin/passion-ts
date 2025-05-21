# IAudio — Audio API Reference

The `IAudio` interface provides a simple, expressive, and type-safe API for sound playback and audio control in Passion games. It enables you to play, pause, stop, and manipulate sounds with minimal effort, making it easy to add rich audio feedback and atmosphere to your projects. The audio subsystem is designed for real-time games and interactive experiences, supporting multiple simultaneous sounds and fine-grained control.

---

## Overview

The audio API abstracts away browser audio quirks and provides a unified interface for sound management. Sounds are referenced by unique indices, allowing you to decouple your game logic from file paths or raw audio objects. You can control playback, speed, and volume for each sound independently.

---

## API Reference

### Interface: `IAudio`

#### Methods

##### `play(snd: SoundIndex): void`
Plays the specified sound from the beginning.
- **snd**: `SoundIndex` — The index of the sound to play.
- **returns**: `void`

##### `pause(snd: SoundIndex): void`
Pauses playback of the specified sound.
- **snd**: `SoundIndex` — The index of the sound to pause.
- **returns**: `void`

##### `stop(snd: SoundIndex): void`
Stops playback and resets the specified sound to the beginning.
- **snd**: `SoundIndex` — The index of the sound to stop.
- **returns**: `void`

##### `speed(snd: SoundIndex, speed: number): void`
Sets the playback speed for the specified sound.
- **snd**: `SoundIndex` — The index of the sound to modify.
- **speed**: `number` — The playback speed (e.g., `1.0` for normal speed, `2.0` for double speed).
- **returns**: `void`

##### `volume(snd: SoundIndex, volume: number): void`
Sets the playback volume for the specified sound.
- **snd**: `SoundIndex` — The index of the sound to modify.
- **volume**: `number` — The volume (typically in the range `0.0` to `1.0`).
- **returns**: `void`

---

## Example Usage

### Playing and Controlling Sounds
```typescript
const jumpSnd: SoundIndex = passion.resource.loadSound('./sounds/jump.wav');

// Play the sound
passion.audio.play(jumpSnd);

// Pause the sound
passion.audio.pause(jumpSnd);

// Stop the sound
passion.audio.stop(jumpSnd);

// Set playback speed to half
passion.audio.speed(jumpSnd, 0.5);

// Set volume to 50%
passion.audio.volume(jumpSnd, 0.5);
```

---

## Design Philosophy

- **Simplicity**: Minimal API for fast prototyping and easy sound control.
- **Type-Safe**: All parameters and return values are fully typed.
- **Flexible**: Supports multiple simultaneous sounds and real-time control.
- **Browser-First**: Designed for modern web audio environments.

---

For more details on integrating the audio API with other subsystems, see the [Passion engine documentation](./passion.md).
