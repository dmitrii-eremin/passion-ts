import type { FontIndex } from "../../passion/constants";
import type { Passion } from "../../passion/passion";
import type { IGameExample } from "./example";
import { BIOS_FONT, BOLDER_FONT, OTHER_FONT, TINY_FONT } from "./utils/custom_fonts";

export class Example04 implements IGameExample {
    private passion: Passion;
    readonly exampleTitle: string = 'Custom BDF fonts';

    private fonts: FontIndex[] = [];

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(_dt: number): void {
    }

    draw(): void {
        const testString = 'The quick brown fox jumps over the lazy dog';

        this.passion.graphics.cls(1);

        this.passion.graphics.font();
        this.passion.graphics.text(10, 10 + 35 * 0, testString, 0);

        this.fonts.forEach((font: FontIndex, index: number) => {
            this.passion.graphics.font(font);
            this.passion.graphics.text(10, 10 + 35 * (1 + index), testString, index + 4);
        });
    }

    onEnter() {
        this.passion.system.init(500, 400, this.exampleTitle);
        this.fonts = [
            this.passion.resource.loadFont(BOLDER_FONT),
            this.passion.resource.loadFont(OTHER_FONT),
            this.passion.resource.loadFont(TINY_FONT),
            this.passion.resource.loadFont(BIOS_FONT),
        ];
    }

    onLeave() {

    }
}