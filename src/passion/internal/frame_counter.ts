export class FrameCounter {
    private timestamp: number = 0;

    private currentFps: number = 0;
    private lastFps: number = 0;

    get FPS(): number {
        return this.lastFps;
    }

    update(dt: number) {
        this.currentFps += 1;
        this.timestamp += dt;
        if (this.timestamp >= 1) {
            this.lastFps = this.currentFps;
            this.currentFps = 0;
            this.timestamp -= 1;
        }
    }
}
