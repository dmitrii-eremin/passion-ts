import type { SoundIndex } from "../../passion/constants";
import type { Passion } from "../../passion/passion";
import { Position } from "../../passion/stdlib/position";
import type { IGameExample } from "./example";

class Button {
    private passion: Passion;
    private pos: Position;
    private size: Position;
    private title: string;
    private sound: SoundIndex;
    private isPressed = false;

    constructor(passion: Passion, x: number, y: number, w: number, h: number, title: string, sound: SoundIndex) {
        this.passion = passion;
        this.pos = new Position(x, y);
        this.size = new Position(w, h);
        this.title = title;
        this.sound = sound;
    }

    update(_dt: number) {
        if (this.passion.input.btnp('MouseButtonLeft') &&
            this.passion.input.mouse_x >= this.pos.x &&
            this.passion.input.mouse_x <= this.pos.x + this.size.x &&
            this.passion.input.mouse_y >= this.pos.y &&
            this.passion.input.mouse_y <= this.pos.y + this.size.y) {
                this.passion.audio.play(this.sound);
                this.isPressed = true;
        }

        if (this.passion.input.btnr('MouseButtonLeft')) {
            this.isPressed = false;
        }
    }

    draw() {
        const offset = this.isPressed ? 3 : 0;
        this.passion.graphics.rect(this.pos.x + 3, this.pos.y + 3, this.size.x, this.size.y, 0);

        this.passion.graphics.rect(this.pos.x + offset, this.pos.y + offset, this.size.x, this.size.y, 1);
        this.passion.graphics.rectb(this.pos.x + offset, this.pos.y + offset, this.size.x, this.size.y, 14);
        this.passion.graphics.text(this.pos.x + offset + 5, this.pos.y + offset + 10, this.title, 15);
    }
}

export class Example09 implements IGameExample {
    private passion: Passion;

    private buttons: Button[] = [];

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(dt: number): void {
        for (const button of this.buttons) {
            button.update(dt);
        }
    }

    draw(): void {
        this.passion.graphics.cls(4);

        this.passion.graphics.text(150, 50, 'Sound API in Passion engine', 6);
        for (const button of this.buttons) {
            button.draw();
        }

        this.passion.graphics.text(10, 350, 'Remember to turn on the volume', 9);
    }

    onEnter() {
        this.passion.system.init(480, 368, 'Example 09: Sound API');

        const xOffset = 50;
        const yOffset = 100;

        this.buttons = [
            new Button(this.passion, xOffset + 10, yOffset + 10, 80, 30, 'Blip', this.passion.resource.loadSound('./examples/sounds/Blip.wav')),
            new Button(this.passion, xOffset + 10, yOffset + 50, 80, 30, 'Boom', this.passion.resource.loadSound('./examples/sounds/Boom.wav')),
            new Button(this.passion, xOffset + 10, yOffset + 90, 80, 30, 'Hit', this.passion.resource.loadSound('./examples/sounds/Hit.wav')),
            new Button(this.passion, xOffset + 290, yOffset + 10, 80, 30, 'Jump', this.passion.resource.loadSound('./examples/sounds/Jump.wav')),
            new Button(this.passion, xOffset + 290, yOffset + 50, 80, 30, 'Pickup', this.passion.resource.loadSound('./examples/sounds/Pickup.wav')),
            new Button(this.passion, xOffset + 290, yOffset + 90, 80, 30, 'PowerUp', this.passion.resource.loadSound('./examples/sounds/PowerUp.wav')),
            new Button(this.passion, xOffset + 150, yOffset + 50, 80, 30, 'Shoot', this.passion.resource.loadSound('./examples/sounds/Shoot.wav')),
        ];
    }

    onLeave() {

    }
}
