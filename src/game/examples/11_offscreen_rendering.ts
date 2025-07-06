import type { CanvasIndex } from "../../passion/constants";
import type { Passion } from "../../passion/passion";
import type { IGameExample } from "./example";
import { Position } from "../../passion/stdlib/position";

export class Example11 implements IGameExample {
    private passion: Passion;
    private canvas?: CanvasIndex;
    private offset: Position = new Position(0, 0);

    readonly exampleTitle: string = 'Offscreen rendering';

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(dt: number): void {
        this.offset = getShakeOffset(dt);
    }

    draw(): void {
        this.passion.graphics.setCanvas(this.canvas);
        this.passion.graphics.cls(1);

        this.passion.graphics.rect(40, 80, 100, 50, 8);
        this.passion.graphics.rectb(40, 80, 100, 50, 14);
        this.passion.graphics.circ(90, 105, 20, 12);
        this.passion.graphics.tri(120, 120, 160, 100, 140, 140, 10);
        this.passion.graphics.font();
        this.passion.graphics.text(50, 90, "Offscreen!", 15);

        if (this.canvas) {
            this.passion.graphics.setCanvas();
            this.passion.graphics.cls(0);
            this.passion.graphics.blt(this.offset.x, this.offset.y, this.canvas, 0, 0,
                this.passion.system.width, this.passion.system.height);
        }
    }

    onEnter() {
        this.passion.system.init(360, 240, this.exampleTitle);
        this.canvas = this.passion.resource.createCanvas();
        this.offset = new Position(0, 0);
    }

    onLeave() {

    }
}

export function getShakeOffset(dt: number): Position {
    const amplitude = 8; 
    function pseudoRandom(seed: number) {
        return Math.sin(seed * 127.1) * 43758.5453 % 1;
    }
    const x = Math.round((pseudoRandom(dt * 10) * 2 - 1) * amplitude);
    const y = Math.round((pseudoRandom(dt * 20 + 42) * 2 - 1) * amplitude);
    return new Position(x, y);
}

