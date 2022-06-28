import { User } from "eris";

Object.defineProperty(User.prototype, "tag", {
    get(this: User) {
        return `${this.username}#${this.discriminator}`;
    },

    set() {
        throw new Error("Can't use method set() in User#tag");
    },
});
