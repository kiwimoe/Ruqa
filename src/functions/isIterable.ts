export default (v: unknown[]) => typeof v[Symbol.iterator] === "function";
