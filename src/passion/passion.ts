import { PassionData } from "./data";
import { System } from "./system";
import { Graphics } from "./graphics";

function catchMouseWheel(canvas: HTMLCanvasElement) {
    canvas.addEventListener('wheel', event => {
        event.preventDefault();
    }, {
        passive: false,
    });
}

export class Passion {
    private data: PassionData = new PassionData();

    system: System;
    graphics: Graphics;

    constructor(canvas: HTMLCanvasElement) {
        catchMouseWheel(canvas);

        this.data.canvas = canvas;
        this.data.context = this.data.canvas.getContext("2d");

        this.system = new System(this.data);
        this.graphics = new Graphics(this.data);
    }
}
