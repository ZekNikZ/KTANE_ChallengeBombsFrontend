export function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
    if (a[orderBy] === undefined || a[orderBy] === null) {
        return -1;
    }

    if (b[orderBy] === undefined || b[orderBy] === null) {
        return 1;
    }

    if (b[orderBy] < a[orderBy]) {
        return -1;
    }

    if (b[orderBy] > a[orderBy]) {
        return 1;
    }

    return 0;
}

export function getComparator<T>(
    order: 'asc' | 'desc',
    orderBy: keyof T
): (a: T, b: T) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(
    array: T[],
    comparator: (a: T, b: T) => number
): T[] {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0] as T, b[0] as T);
        if (order !== 0) {
            return order;
        }
        return (a[1] as number) - (b[1] as number);
    });
    return stabilizedThis.map((el) => el[0] as T);
}
