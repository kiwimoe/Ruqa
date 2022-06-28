import panic from "@utils/NodeExceptions";
import cast from "@funcs/cast";

const wrapTryCatchError = async <T>(fn: any): Promise<T> => {
    try {
        return await fn;
    } catch (e) {
        return cast<T>(panic(e));
    }
};

export default wrapTryCatchError;
