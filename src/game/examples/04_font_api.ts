import type { Passion } from "../../passion/passion";
import type { IGameExample } from "./example";
import { BIOS_FONT } from "./utils/custom_fonts";

export class Example04 implements IGameExample {
    private passion: Passion;

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(_dt: number): void {
    }

    draw(): void {
        const testString = 'The quick brown fox jumps over the lazy dog';

        this.passion.graphics.cls(1);

        // this.passion.graphics.font();
        // this.passion.graphics.text(10, 10 + 35 * 0, testString, 7);

        // this.passion.graphics.font(BOLDER_FONT);
        // this.passion.graphics.text(10, 10 + 35 * 1, testString, 7);

        // this.passion.graphics.font(OTHER_FONT);
        // this.passion.graphics.text(10, 10 + 35 * 2, testString, 7);

        this.passion.graphics.rect(10, 10 + 35 * 3, 100, 16, 0);
        this.passion.graphics.font(BIOS_FONT);
        this.passion.graphics.text(10, 10 + 35 * 3, testString, 7);
    }

    onEnter() {
        this.passion.system.init(300, 250, 'Example 03: Draw API');
    }

    onLeave() {

    }
}