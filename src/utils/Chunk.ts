export default (array: Array<string>, size = 1): Array<[]> => {
    size = Math.max(size, 0);
    const len = array.length;
    if (!len || size < 1) {
        return [];
    }
    let index = 0;
    let resIndex = 0;
    const result = new Array(Math.ceil(len / size));
    while (index < len) {
        result[resIndex++] = array.slice(index, (index += size));
    }
    return result;
};
