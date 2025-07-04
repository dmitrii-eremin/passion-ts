import type { Passion } from "../../passion/passion";
import type { IGameExample } from "./example";

export class ExampleCredits implements IGameExample {
    private passion: Passion;
    private lines = [
        'Code: Dmitrii Eremin',
        'Jump game sprites: GrafxKid',
        'Tiled map sprites: Kenney.nl',
        'Assets: OpenGameArt community'
    ];

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(_dt: number): void {
    }

    draw(): void {
        this.passion.graphics.cls(1);

        this.passion.graphics.font
        this.passion.graphics.text(160, 10, 'CREDITS', 9);
        this.lines.forEach((line, index) => {
            this.passion.graphics.text(18, 32 + 15 * index, line, 11);
        });
    }

    onEnter() {
        this.passion.system.init(350, 270, 'Credits');
    }

    onLeave() {
    }
}