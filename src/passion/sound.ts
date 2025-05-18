export class Sound {
    private isReady = false;

    private audio?: HTMLAudioElement;

    constructor(path: string) {
        this.isReady = false;

        this.audio = new Audio(path);
        this.audio?.load();
        this.audio.addEventListener('canplaythrough', () => {
            this.isReady = true;
        });
    }

    setPlaybackSpeed(speed: number) {
        if (this.audio) {
            this.audio.playbackRate = speed;
        }
    }

    setVolume(volume: number) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }

    play() {
        if (this.isReady && this.audio && this.audio.paused) {
            this.audio.play();
        }
    }

    pause() {
        if (this.isReady && this.audio) {
            this.audio.pause();
        }
    }

    stop() {
        if (this.isReady && this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }
}