export const trim = (s: string) => s.trim();

export const isDefined = <T>(d: T | undefined): d is T => d !== undefined;

export const convertNumbers = (value: string) => (isNaN(+value) ? value : Number(value));
