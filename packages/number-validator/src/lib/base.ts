import type { errorUtil } from 'zod/lib/helpers/errorUtil';
import type { z } from 'zod';

declare module 'zod' {
  interface ZodNumber {
    // check a string can be converted to i32
    i32: (message?: errorUtil.ErrMessage) => z.ZodNumber;
    // check a string can be converted to i16
    i16: (message?: errorUtil.ErrMessage) => z.ZodNumber;
    // check a string can be converted to i8
    i8: (message?: errorUtil.ErrMessage) => z.ZodNumber;
  }
}
