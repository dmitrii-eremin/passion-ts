import { PassionData } from './data';
import { type ISystem, System } from './system';
import { type IGraphics, Graphics } from './graphics';
import { type IInput, Input } from './input';
import { type IResource, Resource } from './resource';
import { type IMath, PassionMath } from './math';
import { type IAudio, Audio } from './audio';
import { type INetwork, Network } from './network';
import type { Key } from './key';
import { Tiled, type ITiled } from './stdlib/tiled';

export class Passion {
    private data: PassionData = new PassionData();

    system: ISystem;
    resource: IResource;
    graphics: IGraphics;
    input: IInput;
    math: IMath;
    audio: IAudio;
    network: INetwork;

    readonly tiled: ITiled;

    constructor(canvas: HTMLCanvasElement) {
        this.data.canvas = canvas;
        this.data.context = this.data.canvas.getContext('2d');

        const onBeforeAll = (dt: number) => {
            this.data.system?.onBeforeAll(dt);
            this.data.resource?.onBeforeAll(dt);
            this.data.graphics?.onBeforeAll(dt);
            this.data.input?.onBeforeAll(dt);
            this.data.math?.onBeforeAll(dt);
            this.data.audio?.onBeforeAll(dt);
            this.data.network?.onBeforeAll(dt);
        };

        const onAfterAll = (dt: number) => {
            this.data.system?.onAfterAll(dt);
            this.data.resource?.onAfterAll(dt);
            this.data.graphics?.onAfterAll(dt);
            this.data.input?.onAfterAll(dt);
            this.data.math?.onAfterAll(dt);
            this.data.audio?.onAfterAll(dt);
            this.data.network?.onAfterAll(dt);
        };

        this.data.system = new System(this.data, onBeforeAll, onAfterAll);
        this.data.resource = new Resource(this.data);
        this.data.graphics = new Graphics(this.data);
        this.data.input = new Input(this.data);
        this.data.math = new PassionMath();
        this.data.audio = new Audio(this.data);
        this.data.network = new Network(this.data);

        this.system = this.data.system;
        this.resource = this.data.resource;
        this.graphics = this.data.graphics;
        this.input = this.data.input;
        this.math = this.data.math;
        this.audio = this.data.audio;
        this.network = this.data.network;

        // Some extra components
        this.tiled = new Tiled(this.data);

        canvas.tabIndex = 0;
        canvas.addEventListener('wheel', event => {
            this.data.input?._setMouseWheel(event.deltaX, event.deltaY);
            event.preventDefault();
        }, {
            passive: false,
        });

        canvas.addEventListener('mousedown', event => {
             canvas.focus();
             this.data.input?._setMouseDown(event);
             event.preventDefault();
        });

        canvas.addEventListener('mouseup', event => {
            this.data.input?._setMouseUp(event);
            event.preventDefault();
        });

        canvas.addEventListener('keydown', event => {
            this.data.input?._setKeyDown(event.code as Key);
            // I'm not sure should we do this or not. Depends on what user wants to do
            // event.preventDefault();
        });

        canvas.addEventListener('keyup', event => {
            this.data.input?._setKeyUp(event.code as Key);
            event.preventDefault();
        });

        canvas.addEventListener('mousemove', event => {
            this.data.input?._setClientMouse(event.clientX, event.clientY);
            event.preventDefault();
        });

        canvas.addEventListener('touchstart', event => {
            canvas.focus();
            this.data.input?._onTouchStarted(event);
            event.preventDefault();
        }, { passive: false });

        canvas.addEventListener('touchend', event => {
            this.data.input?._onTouchEnded(event);
            event.preventDefault();
        }, { passive: false });

        canvas.addEventListener('touchmove', event => {
            this.data.input?._onTouchMoved(event);
            event.preventDefault();
        }, { passive: false });
    }
}
