import type { Passion } from "../passion/passion";
import { Example01 } from "./examples/01_hello_passion";
import { Example02 } from "./examples/02_jump_game";
import type { IGameExample } from "./examples/example";

class Example {
    private passion: Passion;
    public name: string;
    public example: IGameExample;

    constructor(passion: Passion, name: string, example: IGameExample) {
        this.passion = passion;
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
            new Example(passion, 'Hello, Passion!', new Example01(this.passion)),
            new Example(passion, 'Jump game [credits for sprites: GrafxKid]', new Example02(this.passion)),
        ];

        this.passion.system.init(420, 240, 'Passion examples');

        this.currentExample = this.examples[1].example;
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
                this.passion.graphics.text(10, y, `>> ${index}: ${example.name} <<`, 7);
            }
            else {
                this.passion.graphics.text(28, y, `${index}: ${example.name}`, 5);
            }
            y += 12;
        }
    }
}
