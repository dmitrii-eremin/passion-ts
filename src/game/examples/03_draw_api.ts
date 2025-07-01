import type { Passion } from "../../passion/passion";
import { Position } from "../../passion/stdlib/position";
import type { IGameExample } from "./example";

class ClipRectangle {
    private passion: Passion;

    private pos = new Position(1, 1);
    private size = new Position(150, 115);
    private readonly speed = 45;

    private target?: Position;

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(dt: number) {
        if (this.target === undefined) {
            this.target = new Position(
                this.passion.math.rndi(1, this.passion.system.width - this.size.x - 1),
                this.passion.math.rndi(1, this.passion.system.height - this.size.y - 1),
            );
        }
        else {
            const direction = this.target.substract(this.pos).normalize();
            const delta = direction.multiple(this.speed * dt);
            if (delta.length < this.target.substract(this.pos).length) {
                this.pos = this.pos.add(delta);
            }
            else {
                this.pos = this.target;
                this.target = undefined;
            }
        }
    }

    beginDraw() {
        this.passion.graphics.clip(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    endDraw() {
        this.passion.graphics.clip();
        this.passion.graphics.rectb(this.pos.x - 1, this.pos.y - 1, this.size.x + 2, this.size.y + 2, 3);
    }
}

export class Example03 implements IGameExample {
    private passion: Passion;

    private currentFrame: number = 0;
    private clip: ClipRectangle;
    private imageId: string = '';

    constructor(passion: Passion) {
        this.passion = passion;
        this.clip = new ClipRectangle(passion);
    }

    update(dt: number): void {
        this.currentFrame += 1;
        if (this.currentFrame > 16) {
            this.currentFrame = 0;
        }

        this.clip.update(dt);
    }

    draw(): void {
        this.passion.graphics.cls(1);

        this.clip.beginDraw();
        this.passion.graphics.line(10, 10, 100, 10, 15);
        this.passion.graphics.rect(20, 20, 40, 30, 14);
        this.passion.graphics.rectb(70, 20, 40, 30, 13);
        this.passion.graphics.circ(40, 80, 15, 12);
        this.passion.graphics.circb(90, 80, 15, 11);
        this.passion.graphics.elli(40, 120, 30, 15, 10);
        this.passion.graphics.ellib(90, 120, 30, 15, 9);
        this.passion.graphics.tri(140, 30, 180, 30, 160, 60, 8);
        this.passion.graphics.trib(140, 80, 180, 80, 160, 110, 7);
        this.passion.graphics.text(10, 140, "Draw API Demo", 15);
        this.clip.endDraw();

        this.passion.graphics.blt(
            this.passion.input.mouse_x,
            this.passion.input.mouse_y,
            this.imageId, 0, 0, 28, 32,
        )
    }

    onEnter() {
        this.passion.system.init(200, 150, 'Example 03: Draw API');
        this.passion.input.mouse(false);
        this.imageId = this.passion.resource.loadImage('./examples/cursor.png');
    }

    onLeave() {

    }
}