

export function assertInvalid(value: unknown, error: string): asserts value {
    if (!value) {
        throw new Error(error);
    }
}

export function makeReadonly<T>(obj: T): Readonly<T> {
    return Object.freeze(obj);
}

export function isDevMode(
    mode: string
) {
    return mode === "development";
}

export async function asyncSleep(delay: number) {
    return new Promise((res, _) => {
        setTimeout(() => res(""), delay);
    });
}

export function doesExists<T>(
    value: T
): NonNullable<T> | never {
    if(!value) throw new Error("'value' doesn't exists.");

    return value;
}

export const logoutMemDBKey = (value: string): string => `logout:${value}`;

export function isNonEmpty(value: any) {
    return value !== undefined && value !== null && value !== '';
}