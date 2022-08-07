import type { errorUtil } from 'zod/lib/helpers/errorUtil';
import type { z } from 'zod';

export interface IntOptions {
  allowLeadingZeroes?: boolean;
  min?: number;
  max?: number;
  lt?: number;
  gt?: number;
}

declare module 'zod' {
  interface ZodString {
    // check a string is a int string
    int: (
      options?: IntOptions,
      message?: errorUtil.ErrMessage,
    ) => z.ZodEffects<z.ZodString, string, string>;
    // check a string can be converted to i64
    i64: (message?: errorUtil.ErrMessage) => z.ZodEffects<z.ZodString, string, string>;
    // check a string can be converted to i32
    i32: (message?: errorUtil.ErrMessage) => z.ZodEffects<z.ZodString, string, string>;
    // check a string can be converted to i16
    i16: (message?: errorUtil.ErrMessage) => z.ZodEffects<z.ZodString, string, string>;
    // check a string can be converted to i8
    i8: (message?: errorUtil.ErrMessage) => z.ZodEffects<z.ZodString, string, string>;
  }
}
