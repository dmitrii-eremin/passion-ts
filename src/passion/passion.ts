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

        const onAfterAll = (dt: number) => {
            this.data.system?.onAfterAll(dt);
            this.data.graphics?.onAfterAll(dt);
            this.data.input?.onAfterAll(dt);
        };

        this.data.system = new System(this.data, onAfterAll);
        this.data.graphics = new Graphics(this.data);
        this.data.input = new Input(this.data);

        this.system = this.data.system;
        this.graphics = this.data.graphics;
        this.input = this.data.input;

        canvas.tabIndex = 0;
        canvas.addEventListener('wheel', event => {
            this.data.input?._setMouseWheel(event.deltaX, event.deltaY);
            event.preventDefault();
        }, {
            passive: false,
        });

        canvas.addEventListener('mousedown', event => {
             canvas.focus();
        });

        canvas.addEventListener('mouseup', event => {
            // Handle mouse up event
        });

        canvas.addEventListener('keydown', event => {
            this.data.input?._setKeyDown(event);
        });

        canvas.addEventListener('keyup', event => {
            this.data.input?._setKeyUp(event);
        });

        canvas.addEventListener('mousemove', event => {
            this.data.input?._setClientMouse(event.clientX, event.clientY);
        });
    }
}
