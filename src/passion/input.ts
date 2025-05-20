import { MAX_TOUCH_COUNT } from './constants';
import type { PassionData } from './data';
import { TouchManager } from './internal/touch_manager';
import type { Key } from './key';
import { Position } from './stdlib/position';
import type { SubSystem } from './subsystem';

export interface IInput {
    readonly mouse_x: number;
    readonly mouse_y: number;
    readonly mouse_wheel_x: number;
    readonly mouse_wheel_y: number;

    readonly touch_x: number[];
    readonly touch_y: number[];

    mouse(visible: boolean): void;
    btn(key: Key): boolean;
    btnr(key: Key): boolean;
    btnp(key: Key, hold?: number, repeat?: number): boolean;
}

export class Input implements IInput, SubSystem {
    private data: PassionData;

    private touchManager: TouchManager = new TouchManager();

    private pressedKeys: Partial<Record<Key, number>>;
    private releasedKeys: Set<Key>;

    public mouse_x: number = 0;
    public mouse_y: number = 0;
    public mouse_wheel_x: number = 0;
    public mouse_wheel_y: number = 0;

    public touch_x: number[] = new Array(MAX_TOUCH_COUNT).fill(0);
    public touch_y: number[] = new Array(MAX_TOUCH_COUNT).fill(0);

    constructor(data: PassionData) {
        this.data = data;
        this.pressedKeys = {};
        this.releasedKeys = new Set<Key>();
    }
    
    onBeforeAll(_dt: number) {

    }

    onAfterAll(_dt: number) {
        for (const key in this.pressedKeys) {
            if (this.pressedKeys[key as Key] !== undefined) {
                this.pressedKeys[key as Key]! += 1;
            }
        }
        this.releasedKeys.clear();
    }

    mouse(visible: boolean): void {
        if (!this.data.isReady()) {
            return;
        }
        this.data.canvas!.style.cursor = visible ? 'default' : 'none';
    }

    btn(key: Key): boolean {
        return !!this.pressedKeys[key];
    }

    btnr(key: Key): boolean {
        return this.releasedKeys.has(key);
    }

    btnp(key: Key, hold?: number, repeat?: number) {
        if (hold === undefined && repeat === undefined) {
            return this.pressedKeys[key] === 1;
        }
        if (hold === undefined) {
            hold = 1;
        }

        if (repeat === undefined) {
            return this.pressedKeys[key] === hold;
        }

        if (!this.pressedKeys[key] || this.pressedKeys[key] < hold) {
            return false;
        }

        return (this.pressedKeys[key] - hold) % repeat === 0;
    }

    _setMouseDown(event: MouseEvent) {
        switch (event.button) {
            case 0:
                this._setKeyDown('MouseButtonLeft');
                break;
            case 1:
                this._setKeyDown('MouseButtonMiddle');
                break;
            case 2:
                this._setKeyDown('MouseButtonRight');
                break;
        }
    }

    _setMouseUp(event: MouseEvent) {
        switch (event.button) {
            case 0:
                this._setKeyUp('MouseButtonLeft');
                break;
            case 1:
                this._setKeyUp('MouseButtonMiddle');
                break;
            case 2:
                this._setKeyUp('MouseButtonRight');
                break;
        }
    }

    _setKeyDown(code: Key) {
        if (!this.pressedKeys[code]) {
            this.pressedKeys[code] = 1;
        }
    }

    _setKeyUp(code: Key) {
        delete this.pressedKeys[code];
        this.releasedKeys.add(code);
    }

    _setMouseWheel(deltaX: number, deltaY: number) {
        this.mouse_wheel_x = deltaX;
        this.mouse_wheel_y = deltaY;
        if (Math.abs(this.mouse_wheel_x) <= 1) {
            this.mouse_wheel_x = 0;
        }
        if (Math.abs(this.mouse_wheel_y) <= 1) {
            this.mouse_wheel_y = 0;
        }
    }

    _setClientMouse(x: number, y: number) {
        const pos = convertClientCoordsToCanvas(this.data.canvas!, x, y);
        this.mouse_x = pos.x;
        this.mouse_y = pos.y;
    }

    _onTouchStarted(event: TouchEvent) {
        if (!this.data.isReady()) {
            return;
        }

        const touches = this.touchManager.onTouchStarted(event);
        for (const touch of touches) {
            const pos = convertClientCoordsToCanvas(this.data.canvas!, touch.clientX, touch.clientY);
            this.touch_x[touch.touchIndex] = pos.x;
            this.touch_y[touch.touchIndex] = pos.y;

            const key = convertTouchIdToKey(touch.touchIndex);
            this._setKeyDown(key);
        }
    }

    _onTouchEnded(event: TouchEvent) {
        if (!this.data.isReady()) {
            return;
        }
        
        const touches = this.touchManager.onTouchEnded(event);
        for (const touch of touches) {
            const pos = convertClientCoordsToCanvas(this.data.canvas!, touch.clientX, touch.clientY);
            this.touch_x[touch.touchIndex] = pos.x;
            this.touch_y[touch.touchIndex] = pos.y;

            const key = convertTouchIdToKey(touch.touchIndex);
            this._setKeyUp(key);
        }
    }

    _onTouchMoved(event: TouchEvent) {
        if (!this.data.isReady()) {
            return;
        }
        
        const touches = this.touchManager.onTouchMoved(event);
        for (const touch of touches) {
            const pos = convertClientCoordsToCanvas(this.data.canvas!, touch.clientX, touch.clientY);
            this.touch_x[touch.touchIndex] = pos.x;
            this.touch_y[touch.touchIndex] = pos.y;
        }
    }
}

function convertTouchIdToKey(touchId: number): Key {
    return `Touch${touchId}` as Key;
}

function convertClientCoordsToCanvas(canvas: HTMLCanvasElement, x: number, y: number): Position {
    const aspectCanvas = canvas.width / canvas.height;
    const aspectDisplay = canvas.clientWidth / canvas.clientHeight;

    let offsetX = 0, scaleX = canvas.width / canvas.clientWidth;
    let offsetY = 0, scaleY = canvas.height / canvas.clientHeight;

    if (aspectDisplay > aspectCanvas) {
        const scaledWidth = canvas.clientHeight * aspectCanvas;
        offsetX = (canvas.clientWidth - scaledWidth) / 2;
        scaleX = canvas.width / scaledWidth;
    }

    if (aspectDisplay < aspectCanvas) {
        const scaledHeight = canvas.clientWidth / aspectCanvas;
        offsetY = (canvas.clientHeight - scaledHeight) / 2;
        scaleY = canvas.height / scaledHeight;
    }

    return Position.fromCoords(
        (x - offsetX) * scaleX,
        (y - offsetY) * scaleY,
    );
}