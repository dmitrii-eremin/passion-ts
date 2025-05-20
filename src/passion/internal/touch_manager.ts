import { MAX_TOUCH_COUNT } from "../constants";
import { Position } from "../stdlib/position";

export interface TouchInfo {
    touchIndex: number;
    clientX: number;
    clientY: number;
}

export class TouchManager {
    private readonly touchIndices: number[] = Array.from({ length: MAX_TOUCH_COUNT }, (_, i) => i);

    private clientTouchesPos: Position[] = Array.from({ length: MAX_TOUCH_COUNT }, () => new Position());

    private touchIdToIndex: Map<number, number> = new Map();
    private indexToTouchId: Map<number, number> = new Map();

    private getFreeTouchIndex(): number {
        for (const idx of this.touchIndices) {
            if (![...this.touchIdToIndex.values()].includes(idx)) {
                return idx;
            }
        }
        return -1;
    }

    onTouchStarted(event: TouchEvent): TouchInfo[] {
        const touchIndicies: TouchInfo[] = [];

        for (const touchEvent of event.changedTouches) {
            if (this.touchIdToIndex.size >= MAX_TOUCH_COUNT) {
                return [];
            }
            if (this.touchIdToIndex.has(touchEvent.identifier)) {
                continue;
            }

            const index = this.getFreeTouchIndex();

            touchIndicies.push({
                clientX: touchEvent.clientX,
                clientY: touchEvent.clientY,
                touchIndex: index
            });

            this.touchIdToIndex.set(touchEvent.identifier, index);
            this.indexToTouchId.set(index, touchEvent.identifier);

            this.clientTouchesPos[index] = Position.fromCoords(touchEvent.clientX, touchEvent.clientY);
        }

        return touchIndicies;
    }

    onTouchEnded(event: TouchEvent): TouchInfo[] {
        const touchIndicies: TouchInfo[] = [];

        for (const touchEvent of event.changedTouches) {
            if (!this.touchIdToIndex.has(touchEvent.identifier)) {
                continue;
            }

            const index = this.touchIdToIndex.get(touchEvent.identifier)!;

            touchIndicies.push({
                clientX: touchEvent.clientX,
                clientY: touchEvent.clientY,
                touchIndex: index
            });

            this.indexToTouchId.delete(index);
            this.touchIdToIndex.delete(touchEvent.identifier);
        }

        return touchIndicies;
    }

    onTouchMoved(event: TouchEvent): TouchInfo[] {
        const touchIndicies: TouchInfo[] = [];

        for (const touchEvent of event.changedTouches) {
            if (!this.touchIdToIndex.has(touchEvent.identifier)) {
                continue;
            }

            const index = this.touchIdToIndex.get(touchEvent.identifier)!;

            touchIndicies.push({
                clientX: touchEvent.clientX,
                clientY: touchEvent.clientY,
                touchIndex: index
            });

            this.clientTouchesPos[index] = Position.fromCoords(touchEvent.clientX, touchEvent.clientY);
        }

        return touchIndicies;
    }
}