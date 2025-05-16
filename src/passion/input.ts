import type { PassionData } from './data';
import type { Key } from './key';

export interface IInput {
    readonly mouse_x: number;
    readonly mouse_y: number;
    readonly mouse_wheel_x: number;
    readonly mouse_wheel_y: number;

    mouse(visible: boolean): void;
    btn(key: Key): boolean;
}

export class Input implements IInput {
    private data: PassionData;

    private clientMouseX: number = 0;
    private clientMouseY: number = 0;

    private pressedKeys: Set<Key> = new Set();

    public mouse_x: number = 0;
    public mouse_y: number = 0;
    public mouse_wheel_x: number = 0;
    public mouse_wheel_y: number = 0;

    constructor(data: PassionData) {
        this.data = data;
    }

    mouse(visible: boolean): void {
        if (!this.data.isReady()) {
            return;
        }
        this.data.canvas!.style.cursor = visible ? 'default' : 'none';
    }

    btn(key: Key): boolean {
        return this.pressedKeys.has(key);
    }

    _setKeyDown(event: KeyboardEvent) {
        this.pressedKeys.add(event.code as Key);
    }

    _setKeyUp(event: KeyboardEvent) {
        this.pressedKeys.delete(event.code as Key);
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
        this.clientMouseX = x;
        this.clientMouseY = y;

        if (!this.data.isReady()) return 0;

        const canvas = this.data.canvas!;
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

        this.mouse_x = (this.clientMouseX - offsetX) * scaleX;
        this.mouse_y = (this.clientMouseY - offsetY) * scaleY;
    }
}