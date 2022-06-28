import cast from "@funcs/cast";
import type { CacheStyle } from "@typings/CacheStyle";

export default class Cache<T> extends Array<T> {
    public add(v: any): void {
        this.push(v);
    }

    public get see(): CacheStyle[] {
        return cast<CacheStyle[]>(this);
    }

    public get isEmpty(): boolean {
        return this.length === 0;
    }

    public clear(): number {
        const len = this.length;
        this.slice(0, 0);
        return len;
    }
}
