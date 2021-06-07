export const trim = (s: string) => s.trim();

export const isDefined = <T>(d: T | undefined): d is T => d !== undefined;

export const convertNumbers = (value: string) => (isNaN(+value) ? value : Number(value));

/** `[key, value]` tuple with a generic value type */
export type Entry<T> = [string, T];

/** Checks if an array contains only other arrays
 * @returns `true` if the input array is empty */
export const is2DArray = <T>(array: T[] | T[][]): array is T[][] =>
  (<(T | T[])[]>array).every((item) => item instanceof Array);

export const isEmpty: {
  <T>(array: T[]): boolean;
  <T>(array: T[] | T[][]): boolean;
} = ({ length }) => !length;
