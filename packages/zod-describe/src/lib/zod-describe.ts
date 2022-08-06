import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function test() {}

declare module 'zod' {
  interface ZodString {
    a: string;
  }
}

z.ZodString.prototype.a = 'test';
