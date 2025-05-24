export type TweenObject = Object;
export type EasingFunction = (time: number, begin: number, change: number, duration: number) => number;

export class Tween {
    private object: TweenObject;

    private source: Record<string, number>;
    private target: Record<string, number>;
    private easing: EasingFunction;

    private keys: string[] = [];

    private clock: number = 0;
    private duration: number = 0;

    constructor(object: TweenObject, target: Record<string, number>, duration: number, easing: EasingFunction) {
        this.keys = Object.keys(target);
        this.source = Tween.createSource(object, this.keys);

        this.object = object;
        this.target = target;
        this.duration = duration;
        this.easing = easing;
    }

    update(dt: number): boolean {
        this.clock += dt;
        if (this.clock > this.duration) {
            this.clock = this.duration;
        }

        for (const key of this.keys) {
            const source = this.source[key];
            const target = this.target[key];
            (this.object as Record<string, number>)[key] = this.interpolate(source, target);
        }
        
        return this.clock >= this.duration;
    }

    private interpolate(source: number, target: number): number {
        return this.easing(this.clock, source, target - source, this.duration);
    }

    private static createSource(object: TweenObject, keys: string[]): Record<string, number> {
        const result: Record<string, number> = {};

        for (const key of keys) {
            const value = (object as Record<string, number>)[key];
            result[key] = value;
        }
        return result;
    }
}

export class Easing {
    // Linear
    static linear(time: number, begin: number, change: number, duration: number): number {
        return change * time / duration + begin;
    }

    // Quad
    static inQuad(time: number, begin: number, change: number, duration: number): number {
        return change * Math.pow(time / duration, 2) + begin;
    }
    static outQuad(time: number, begin: number, change: number, duration: number): number {
        const t = time / duration;
        return -change * t * (t - 2) + begin;
    }
    static inOutQuad(time: number, begin: number, change: number, duration: number): number {
        let t = time / duration * 2;
        if (t < 1) return change / 2 * Math.pow(t, 2) + begin;
        return -change / 2 * ((t - 1) * (t - 3) - 1) + begin;
    }
    static outInQuad(time: number, begin: number, change: number, duration: number): number {
        if (time < duration / 2) return Easing.outQuad(time * 2, begin, change / 2, duration);
        return Easing.inQuad((time * 2) - duration, begin + change / 2, change / 2, duration);
    }

    // Cubic
    static inCubic(time: number, begin: number, change: number, duration: number): number {
        return change * Math.pow(time / duration, 3) + begin;
    }
    static outCubic(time: number, begin: number, change: number, duration: number): number {
        return change * (Math.pow(time / duration - 1, 3) + 1) + begin;
    }
    static inOutCubic(time: number, begin: number, change: number, duration: number): number {
        let t = time / duration * 2;
        if (t < 1) return change / 2 * t * t * t + begin;
        t = t - 2;
        return change / 2 * (t * t * t + 2) + begin;
    }
    static outInCubic(time: number, begin: number, change: number, duration: number): number {
        if (time < duration / 2) return Easing.outCubic(time * 2, begin, change / 2, duration);
        return Easing.inCubic((time * 2) - duration, begin + change / 2, change / 2, duration);
    }

    // Quart
    static inQuart(time: number, begin: number, change: number, duration: number): number {
        return change * Math.pow(time / duration, 4) + begin;
    }
    static outQuart(time: number, begin: number, change: number, duration: number): number {
        return -change * (Math.pow(time / duration - 1, 4) - 1) + begin;
    }
    static inOutQuart(time: number, begin: number, change: number, duration: number): number {
        let t = time / duration * 2;
        if (t < 1) return change / 2 * Math.pow(t, 4) + begin;
        return -change / 2 * (Math.pow(t - 2, 4) - 2) + begin;
    }
    static outInQuart(time: number, begin: number, change: number, duration: number): number {
        if (time < duration / 2) return Easing.outQuart(time * 2, begin, change / 2, duration);
        return Easing.inQuart((time * 2) - duration, begin + change / 2, change / 2, duration);
    }

    // Quint
    static inQuint(time: number, begin: number, change: number, duration: number): number {
        return change * Math.pow(time / duration, 5) + begin;
    }
    static outQuint(time: number, begin: number, change: number, duration: number): number {
        return change * (Math.pow(time / duration - 1, 5) + 1) + begin;
    }
    static inOutQuint(time: number, begin: number, change: number, duration: number): number {
        let t = time / duration * 2;
        if (t < 1) return change / 2 * Math.pow(t, 5) + begin;
        return change / 2 * (Math.pow(t - 2, 5) + 2) + begin;
    }
    static outInQuint(time: number, begin: number, change: number, duration: number): number {
        if (time < duration / 2) return Easing.outQuint(time * 2, begin, change / 2, duration);
        return Easing.inQuint((time * 2) - duration, begin + change / 2, change / 2, duration);
    }

    // Sine
    static inSine(time: number, begin: number, change: number, duration: number): number {
        return -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
    }
    static outSine(time: number, begin: number, change: number, duration: number): number {
        return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
    }
    static inOutSine(time: number, begin: number, change: number, duration: number): number {
        return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
    }
    static outInSine(time: number, begin: number, change: number, duration: number): number {
        if (time < duration / 2) return Easing.outSine(time * 2, begin, change / 2, duration);
        return Easing.inSine((time * 2) - duration, begin + change / 2, change / 2, duration);
    }

    // Expo
    static inExpo(time: number, begin: number, change: number, duration: number): number {
        if (time === 0) return begin;
        return change * Math.pow(2, 10 * (time / duration - 1)) + begin - change * 0.001;
    }
    static outExpo(time: number, begin: number, change: number, duration: number): number {
        if (time === duration) return begin + change;
        return change * 1.001 * (-Math.pow(2, -10 * time / duration) + 1) + begin;
    }
    static inOutExpo(time: number, begin: number, change: number, duration: number): number {
        if (time === 0) return begin;
        if (time === duration) return begin + change;
        let t = time / duration * 2;
        if (t < 1) return change / 2 * Math.pow(2, 10 * (t - 1)) + begin - change * 0.0005;
        return change / 2 * 1.0005 * (-Math.pow(2, -10 * (t - 1)) + 2) + begin;
    }
    static outInExpo(time: number, begin: number, change: number, duration: number): number {
        if (time < duration / 2) return Easing.outExpo(time * 2, begin, change / 2, duration);
        return Easing.inExpo((time * 2) - duration, begin + change / 2, change / 2, duration);
    }

    // Circ
    static inCirc(time: number, begin: number, change: number, duration: number): number {
        return -change * (Math.sqrt(1 - Math.pow(time / duration, 2)) - 1) + begin;
    }
    static outCirc(time: number, begin: number, change: number, duration: number): number {
        return change * Math.sqrt(1 - Math.pow(time / duration - 1, 2)) + begin;
    }
    static inOutCirc(time: number, begin: number, change: number, duration: number): number {
        let t = time / duration * 2;
        if (t < 1) return -change / 2 * (Math.sqrt(1 - t * t) - 1) + begin;
        t = t - 2;
        return change / 2 * (Math.sqrt(1 - t * t) + 1) + begin;
    }
    static outInCirc(time: number, begin: number, change: number, duration: number): number {
        if (time < duration / 2) return Easing.outCirc(time * 2, begin, change / 2, duration);
        return Easing.inCirc((time * 2) - duration, begin + change / 2, change / 2, duration);
    }

    // Elastic helpers
    private static calculatePAS(period: number | undefined, amplitude: number | undefined, change: number, duration: number): [number, number, number] {
        let p = period ?? duration * 0.3;
        let a = amplitude ?? 0;
        let s: number;
        if (a < Math.abs(change)) {
            a = change;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(change / a);
        }
        return [p, a, s];
    }

    // Elastic
    static inElastic(time: number, begin: number, change: number, duration: number, amplitude?: number, period?: number): number {
        if (time === 0) return begin;
        let t = time / duration;
        if (t === 1) return begin + change;
        const [p, a, s] = Easing.calculatePAS(period, amplitude, change, duration);
        t = t - 1;
        return -(a * Math.pow(2, 10 * t) * Math.sin((t * duration - s) * (2 * Math.PI) / p)) + begin;
    }
    static outElastic(time: number, begin: number, change: number, duration: number, amplitude?: number, period?: number): number {
        if (time === 0) return begin;
        let t = time / duration;
        if (t === 1) return begin + change;
        const [p, a, s] = Easing.calculatePAS(period, amplitude, change, duration);
        return a * Math.pow(2, -10 * t) * Math.sin((t * duration - s) * (2 * Math.PI) / p) + change + begin;
    }
    static inOutElastic(time: number, begin: number, change: number, duration: number, amplitude?: number, period?: number): number {
        if (time === 0) return begin;
        let t = time / duration * 2;
        if (t === 2) return begin + change;
        const [p, a, s] = Easing.calculatePAS(period, amplitude, change, duration);
        t = t - 1;
        if (t < 0) return -0.5 * (a * Math.pow(2, 10 * t) * Math.sin((t * duration - s) * (2 * Math.PI) / p)) + begin;
        return a * Math.pow(2, -10 * t) * Math.sin((t * duration - s) * (2 * Math.PI) / p) * 0.5 + change + begin;
    }
    static outInElastic(time: number, begin: number, change: number, duration: number, amplitude?: number, period?: number): number {
        if (time < duration / 2) return Easing.outElastic(time * 2, begin, change / 2, duration, amplitude, period);
        return Easing.inElastic((time * 2) - duration, begin + change / 2, change / 2, duration, amplitude, period);
    }

    // Back
    static inBack(time: number, begin: number, change: number, duration: number, overshoot?: number): number {
        const s = overshoot ?? 1.70158;
        const t = time / duration;
        return change * t * t * ((s + 1) * t - s) + begin;
    }
    static outBack(time: number, begin: number, change: number, duration: number, overshoot?: number): number {
        const s = overshoot ?? 1.70158;
        let t = time / duration - 1;
        return change * (t * t * ((s + 1) * t + s) + 1) + begin;
    }
    static inOutBack(time: number, begin: number, change: number, duration: number, overshoot?: number): number {
        let s = (overshoot ?? 1.70158) * 1.525;
        let t = time / duration * 2;
        if (t < 1) return change / 2 * (t * t * ((s + 1) * t - s)) + begin;
        t = t - 2;
        return change / 2 * (t * t * ((s + 1) * t + s) + 2) + begin;
    }
    static outInBack(time: number, begin: number, change: number, duration: number, overshoot?: number): number {
        if (time < duration / 2) return Easing.outBack(time * 2, begin, change / 2, duration, overshoot);
        return Easing.inBack((time * 2) - duration, begin + change / 2, change / 2, duration, overshoot);
    }

    // Bounce
    static outBounce(time: number, begin: number, change: number, duration: number): number {
        let t = time / duration;
        if (t < 1 / 2.75) {
            return change * (7.5625 * t * t) + begin;
        } else if (t < 2 / 2.75) {
            t = t - (1.5 / 2.75);
            return change * (7.5625 * t * t + 0.75) + begin;
        } else if (t < 2.5 / 2.75) {
            t = t - (2.25 / 2.75);
            return change * (7.5625 * t * t + 0.9375) + begin;
        } else {
            t = t - (2.625 / 2.75);
            return change * (7.5625 * t * t + 0.984375) + begin;
        }
    }
    static inBounce(time: number, begin: number, change: number, duration: number): number {
        return change - Easing.outBounce(duration - time, 0, change, duration) + begin;
    }
    static inOutBounce(time: number, begin: number, change: number, duration: number): number {
        if (time < duration / 2) return Easing.inBounce(time * 2, 0, change, duration) * 0.5 + begin;
        return Easing.outBounce(time * 2 - duration, 0, change, duration) * 0.5 + change * 0.5 + begin;
    }
    static outInBounce(time: number, begin: number, change: number, duration: number): number {
        if (time < duration / 2) return Easing.outBounce(time * 2, begin, change / 2, duration);
        return Easing.inBounce((time * 2) - duration, begin + change / 2, change / 2, duration);
    }
}

export const EASINGS = [
    Easing.linear,

    Easing.inQuad, Easing.outQuad, Easing.inOutQuad, Easing.outInQuad,
    Easing.inCubic, Easing.outCubic, Easing.inOutCubic, Easing.outInCubic,
    Easing.inQuart, Easing.outQuart, Easing.inOutQuart, Easing.outInQuart,
    Easing.inQuint, Easing.outQuint, Easing.inOutQuint, Easing.outInQuint,

    Easing.inSine, Easing.outSine, Easing.inOutSine, Easing.outInSine,

    Easing.inExpo, Easing.outExpo, Easing.inOutExpo, Easing.outInExpo,

    Easing.inCirc, Easing.outCirc, Easing.inOutCirc, Easing.outInCirc,

    Easing.inElastic, Easing.outElastic, Easing.inOutElastic, Easing.outInElastic,

    Easing.inBack, Easing.outBack, Easing.inOutBack, Easing.outInBack,

    Easing.inBounce, Easing.outBounce, Easing.inOutBounce, Easing.outInBounce
];
