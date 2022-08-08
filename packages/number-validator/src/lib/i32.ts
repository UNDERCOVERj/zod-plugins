import { z } from 'zod';
import type { errorUtil } from 'zod/lib/helpers/errorUtil';
import './base';

export const I32_MIN = -0x80000000;
export const I32_MAX = 0x7fffffff;

z.ZodNumber.prototype.i32 = function (message: errorUtil.ErrMessage = 'Invalid i32 integer') {
  return this.int(message).max(I32_MAX, message).min(I32_MIN, message);
};
