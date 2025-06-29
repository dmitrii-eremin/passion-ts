import type { Passion } from "../../passion/passion";
import type { IGameExample } from "./example";

export class Example01 implements IGameExample {
    private passion: Passion;

    private currentFrame: number = 0;
    private imageId: string = '';

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(_dt: number): void {
        this.currentFrame += 1;
        if (this.currentFrame > 16) {
            this.currentFrame = 0;
        }
    }

    draw(): void {
        this.passion.graphics.cls(0);
        this.passion.graphics.text(55, 41, 'Hello, Passion!', this.currentFrame);
        this.passion.graphics.blt(100 - 8, 70, this.imageId, 5 * 16, 1 * 16, 16, 16);
    }

    onEnter() {
        this.passion.system.init(200, 140, 'Hello, passion!');
        this.imageId = this.passion.resource.loadImage('/examples/hero.png');
    }

    onLeave() {

    }
}