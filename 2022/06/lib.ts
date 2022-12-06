export function findDistinct(input: string, length: number): number {
  return Array.from(input).findIndex((_, index, chars) => {
    return new Set(chars.slice(index - length, index)).size === length;
  });
}
