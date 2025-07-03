import type { Passion } from "../passion/passion";
import { Example01 } from "./examples/01_hello_passion";
import { Example02 } from "./examples/02_jump_game";
import { Example03 } from "./examples/03_draw_api";
import { Example04 } from "./examples/04_font_api";
import { Example05 } from "./examples/05_perlin_noise";
import { Example06 } from "./examples/06_snake_game";
import { Example07 } from "./examples/07_color_palette";
import { ExampleCredits } from "./examples/credits";
import type { IGameExample } from "./examples/example";

class Example {
    public name: string;
    public example: IGameExample;

    constructor(name: string, example: IGameExample) {
        this.name = name;
        this.example = example;
    }
}

export class Game {
    private passion: Passion;

    private examples: Example[];
    private exampleIndex: number = 0;
    private currentExample: IGameExample | undefined = undefined;

    constructor(passion: Passion) {
        this.passion = passion;
        this.examples = [
            new Example('Credits', new ExampleCredits(this.passion)),
            new Example('Hello, Passion!', new Example01(this.passion)),
            new Example('Jump game', new Example02(this.passion)),
            new Example('Draw API', new Example03(this.passion)),
            new Example('Custom fonts', new Example04(this.passion)),
            new Example('Perlin noise', new Example05(this.passion)),
            new Example('Snake game', new Example06(this.passion)),
            new Example('Color palette', new Example07(this.passion)),
        ];

        this.passion.system.init(420, 240, 'Passion examples');

        this.currentExample = this.examples[this.examples.length - 1].example;
        this.currentExample.onEnter();
    }

    update(dt: number) {
        if (this.currentExample === undefined) {
            if (this.passion.input.btnp('ArrowDown')) {
                this.exampleIndex += 1;
                if (this.exampleIndex >= this.examples.length) {
                    this.exampleIndex = 0;
                }
            }
            if (this.passion.input.btnp('ArrowUp')) {
                this.exampleIndex -= 1;
                if (this.exampleIndex < 0) {
                    this.exampleIndex = this.examples.length - 1;
                }
            }
            if ((this.passion.input.btnp('Enter') || this.passion.input.btnp('Space')) && this.currentExample === undefined) {
                this.currentExample = this.examples[this.exampleIndex].example;
                this.currentExample.onEnter();
            }
        }
        else if (this.passion.input.btnp('Escape')) {
            this.currentExample.onLeave();
            this.currentExample = undefined;
            this.passion.system.init(420, 240, 'Passion examples');
        }

        if (this.currentExample !== undefined) {
            this.currentExample.update(dt);
        }
    }

    draw() {
        if (this.currentExample !== undefined) {
            this.currentExample.draw();
            return;
        }

        this.passion.graphics.cls(1);
        this.passion.graphics.text(5, 4, 'Passion examples', 3);

        let y = 24;
        for (const [index, example] of this.examples.entries()) {
            if (index === this.exampleIndex) {
                this.passion.graphics.text(10, y, `>> ${index + 1}: ${example.name} <<`, 7);
            }
            else {
                this.passion.graphics.text(28, y, `${index + 1}: ${example.name}`, 5);
            }
            y += 12;
        }
    }
}
