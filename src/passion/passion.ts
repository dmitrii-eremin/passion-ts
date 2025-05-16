import { PassionData } from './data';
import { type ISystem, System } from './system';
import { type IGraphics, Graphics } from './graphics';
import { type IInput, Input } from './input';

export class Passion {
    private data: PassionData = new PassionData();

    system: ISystem;
    graphics: IGraphics;
    input: IInput;

    constructor(canvas: HTMLCanvasElement) {
        this.data.canvas = canvas;
        this.data.context = this.data.canvas.getContext('2d');

        this.data.system = new System(this.data);
        this.data.graphics = new Graphics(this.data);
        this.data.input = new Input(this.data);

        this.system = this.data.system;
        this.graphics = this.data.graphics;
        this.input = this.data.input;

        canvas.addEventListener('wheel', event => {
            event.preventDefault();
        }, {
            passive: false,
        });

        canvas.addEventListener('mousedown', event => {
            // Handle mouse down event
        });

        canvas.addEventListener('mouseup', event => {
            // Handle mouse up event
        });

        canvas.addEventListener('mousemove', event => {
            this.data.input?._setClientMouse(event.clientX, event.clientY);
        });
    }
}
