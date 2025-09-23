import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(...classes));
}

export function assertInvalid(value: unknown, error: string): asserts value {
    if (!value) {
        throw new Error(error);
    }
}

export function makeReadonly<T>(obj: T): Readonly<T> {
    return Object.freeze(obj);
}

// utils/cookies.ts

/**
 * Parse a cookie string (like `document.cookie`) into a key-value object.
 */
export function parseCookies(cookieString: string): Record<string, string> {
    const cookies = cookieString
        .split(";")
        .map((c) => c.trim())
        .filter(Boolean)
        .reduce((acc, curr) => {
            const [key, ...values] = curr.split("=");

            acc[key] = decodeURIComponent(values.join("="));

            return acc;
        }, {} as Record<string, string>);

    return cookies;
}

/**
 * Get a single cookie value by key from a cookie string.
 */
export function getCookie(
    cookieString: string,
    key: string
): string | undefined {
    return parseCookies(cookieString)[key];
}
