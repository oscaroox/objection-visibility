
interface IObjectType {
    [k: string]: {};
}

function includes(haystack: string[], needle: string) {
    return haystack.indexOf(needle) !== -1;
}

export function pick(data: IObjectType, toPick: string[]) {
    return pickBy(data, toPick, (values, v) => includes(values, v));
}

export function omit(data: IObjectType, toOmit: string[]) {
    return pickBy(data, toOmit, (values, v) => !includes(values, v));
}

function pickBy(data: IObjectType, values: string[], predicate: (values: string[], v: string) => boolean) {
    return Object.keys(data)
    .reduce((c: IObjectType, v) => {
        if (predicate(values, v)) {
            c[v] = data[v];
            return c;
        }
        return c;
    }, {});
}
