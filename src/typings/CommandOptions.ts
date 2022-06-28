export interface CommandOptions {
    name: string;
    description: string;
    aliases?: Array<string>;
    category: string;
    example?: string;
    requirements: Array<"insideVC" | "sameVC" | "none">;
    permissions: Array<"manageGuild" | "connect" | "speak" | "reactions" | "none">;
    run: Function;
}
