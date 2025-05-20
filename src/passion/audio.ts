import type { SoundIndex } from './constants';
import type { PassionData } from './data';
import type { SubSystem } from './subsystem';

export interface IAudio {
    play(snd: SoundIndex): void;
    pause(snd: SoundIndex): void;
    stop(snd: SoundIndex): void;
    speed(snd: SoundIndex, speed: number): void;
    volume(snd: SoundIndex, volume: number): void;
}

export class Audio implements IAudio, SubSystem {
    private data: PassionData;

    constructor(data: PassionData) {
        this.data = data;
    }
    
    onBeforeAll(_dt: number) {}
    onAfterAll(_dt: number) {}

    play(snd: SoundIndex) {
        this.data.sounds.get(snd)?.play();
    }

    pause(snd: SoundIndex) {
        this.data.sounds.get(snd)?.pause();
    }

    stop(snd: SoundIndex) {
        this.data.sounds.get(snd)?.stop();
    }

    speed(snd: SoundIndex, speed: number) {
        this.data.sounds.get(snd)?.setPlaybackSpeed(speed);
    }

    volume(snd: SoundIndex, volume: number) {
        this.data.sounds.get(snd)?.setVolume(volume);
    }
}