import type { Passion } from "../passion/passion";
import type { IMap } from "../passion/stdlib/tiled/tiledTypes";

export class Game {
    private passion: Passion;
    private map?: IMap;

    constructor(passion: Passion) {
        this.passion = passion;
        this.passion.system.init(360, 240, 'Tweening demo');
        this.passion.tiled.load('./tilemap/tilemap.tmx').then((map) => {
            this.map = map;
        });
    }

    update(dt: number) {
        if (this.map) {
            this.map.update(dt);
        }
    }

    draw() {
        if (this.map) {
            this.passion.graphics.cls(this.map.backgroundColor);
            this.map.draw(0, 0);
        }

        this.passion.graphics.text(10, 10, `FPS: ${this.passion.system.frame_count}`, 15);
    }
}