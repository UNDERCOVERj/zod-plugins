import { z } from 'zod';
import type { errorUtil } from 'zod/lib/helpers/errorUtil';
import './base';

export const I8_MIN = -0x80;
export const I8_MAX = 0x7f;

z.ZodNumber.prototype.i8 = function (message: errorUtil.ErrMessage = 'Invalid i8 integer') {
  return this.int(message).max(I8_MAX, message).min(I8_MIN, message);
};
