import type { Passion } from "../../passion/passion";
import type { IGameExample } from "./example";

export class Example03 implements IGameExample {
    private passion: Passion;

    private currentFrame: number = 0;

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
        this.passion.graphics.cls(1);
    }

    onEnter() {
        this.passion.system.init(200, 140, 'Example 01: Hello, passion!');
    }

    onLeave() {

    }
}