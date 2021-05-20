export function splitArrayOnNull<T>(arr: (T | null)[]): T[][] {
    const res = [];

    for (let working, i = 0; i < arr.length; i++) {
        if (arr[i] === null) {
            working = null;
        } else {
            if (!working) {
                res.push((working = []));
            }
            working.push(arr[i]);
        }
    }

    return res;
}
