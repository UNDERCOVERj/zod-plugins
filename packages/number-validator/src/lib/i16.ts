import { z } from 'zod';
import type { errorUtil } from 'zod/lib/helpers/errorUtil';
import './base';

export const I16_MIN = -0x8000;
export const I16_MAX = 0x7fff;

z.ZodNumber.prototype.i16 = function (message: errorUtil.ErrMessage = 'Invalid i16 integer') {
  return this.int(message).max(I16_MAX, message).min(I16_MIN, message);
};
