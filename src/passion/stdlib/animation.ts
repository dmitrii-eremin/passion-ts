import type { Color } from "../constants";
import type { ImageIndex } from "../constants";
import type { Passion } from "../passion";

export class AnimationFrameRect {
    left: number;
    top: number;
    width: number;
    height: number;

    constructor(left: number, top: number, width: number, height: number) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

export class Animation {
    private frames: AnimationFrameRect[];
    private frameDuration: number;
    private currentTime: number = 0;
    private currentFrameIndex: number = 0;
    private playing: boolean = true;
    private loop: boolean = true;

    /**
     * @param frames 2D array of frame coordinates (e.g. [[0,0],[1,0],[2,0]])
     * @param frameDuration Duration of each frame in seconds
     * @param loop Whether the animation should loop
     */
    constructor(frames: AnimationFrameRect[], frameDuration: number, loop: boolean = true) {
        this.frames = frames;
        this.frameDuration = frameDuration;
        this.loop = loop;
    }

    play() {
        this.playing = true;
    }

    pause() {
        this.playing = false;
    }

    stop() {
        this.pause();
        this.gotoFrame(0);
    }

    gotoFrame(frameIndex: number) {
        if (frameIndex >= 0 && frameIndex < this.frames.length) {
            this.currentFrameIndex = frameIndex;
            this.currentTime = 0;
        }
    }

    rewind() {
        this.gotoFrame(0);
    }

    update(dt: number) {
        if (!this.playing) return;
        this.currentTime += dt;
        while (this.currentTime >= this.frameDuration) {
            this.currentTime -= this.frameDuration;
            this.currentFrameIndex++;
            if (this.currentFrameIndex >= this.frames.length) {
                if (this.loop) {
                    this.currentFrameIndex = 0;
                } else {
                    this.currentFrameIndex = this.frames.length - 1;
                    this.playing = false;
                    break;
                }
            }
        }
    }

    draw(passion: Passion, x: number, y: number, img: ImageIndex, colkey?: Color, rotate?: number, scale?: number) {
        const { left, top, width, height } = this.getFrame();
        passion.graphics.blt(x, y, img, left, top, width, height, colkey, rotate, scale);
    }

    getFrame(): AnimationFrameRect {
        return this.frames[this.currentFrameIndex];
    }

    isPlaying(): boolean {
        return this.playing;
    }

    getFrameIndex(): number {
        return this.currentFrameIndex;
    }
}

export class AnimationGrid {
    private frameWidth: number;
    private frameHeight: number;
    private offsetX: number;
    private offsetY: number;
    private spacingX: number;
    private spacingY: number;

    /**
     * @param frameWidth Width of a single frame
     * @param frameHeight Height of a single frame
     * @param offsetX Optional X offset (default 0)
     * @param offsetY Optional Y offset (default 0)
     * @param spacingX Optional horizontal spacing between frames (default 0)
     * @param spacingY Optional vertical spacing between frames (default 0)
     */
    constructor(frameWidth: number, frameHeight: number, offsetX = 0, offsetY = 0, spacingX = 0, spacingY = 0) {
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.spacingX = spacingX;
        this.spacingY = spacingY;
    }

    /**
     * Parses anim8-style range strings (e.g. '1-8', '1,3,5', '2-4,6') into an array of numbers.
     */
    private static parseRange(range: string): number[] {
        const result: number[] = [];
        for (const part of range.split(',')) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                const delta = start < end ? 1 : -1;
                for (let i = start; i <= end; i += delta) result.push(i);
            } else {
                result.push(Number(part));
            }
        }
        return result;
    }

    /**
     * Returns frames using anim8-style range strings for columns and rows.
     * Example: grid.range('1-8', 1) or grid.range('1-8', '1')
     */
    public range(cols: string, rows: string): AnimationFrameRect[] {
        const colArr = AnimationGrid.parseRange(cols);
        const rowArr = AnimationGrid.parseRange(rows);
        return this.frames(colArr, rowArr).map(frame => {
            return this.getFrameRect(frame[0], frame[1])
        });
    }

    /**
     * Returns an array of [col, row] frame coordinates for the given ranges.
     * Example: grid.frames([1,2,3], [1]) returns frames in columns 1,2,3 of row 1.
     * Indices are 1-based (like anim8).
     */
    private frames(cols: number[], rows: number[]): number[][] {
        const result: number[][] = [];
        for (const row of rows) {
            for (const col of cols) {
                result.push([col - 1, row - 1]);
            }
        }
        return result;
    }

    /**
     * Returns the pixel rectangle for a given frame coordinate [col, row].
     * Useful for rendering/cropping.
     */
    getFrameRect(col: number, row: number): AnimationFrameRect {
        return {
            left: this.offsetX + col * (this.frameWidth + this.spacingX),
            top: this.offsetY + row * (this.frameHeight + this.spacingY),
            width: this.frameWidth,
            height: this.frameHeight
        };
    }
}