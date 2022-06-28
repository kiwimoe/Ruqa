import { stdout } from "node:process";

export default class Logger {
    public static info(message: string | unknown): void {
        stdout.write(`\x1b[97m ${new Date(Date.now()).toLocaleTimeString()} ~> ${message}\x1b[0m\n`);
    }

    public static debug(message: string | unknown): void {
        stdout.write(`\x1b[94m ${new Date(Date.now()).toLocaleTimeString()} ~> ${message}\x1b[0m\n`);
    }

    public static warn(message: string | unknown): void {
        stdout.write(`\x1b[93m ${new Date(Date.now()).toLocaleTimeString()} ~> ${message}\x1b[0m\n`);
    }

    public static error(message: string | unknown): void {
        stdout.write(`\x1b[91m ${new Date(Date.now()).toLocaleTimeString()} ~> ${message}\x1b[0m\n`);
    }

    public static ok(message: string | unknown): void {
        stdout.write(`\x1b[92m ${new Date(Date.now()).toLocaleTimeString()} ~> ${message}\x1b[0m\n`);
    }
}
