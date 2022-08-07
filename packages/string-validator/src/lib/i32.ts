import { z } from 'zod';
import type { errorUtil } from 'zod/lib/helpers/errorUtil';
import { isInt } from './int';
import './base';

export const I32_MIN = -BigInt('0x80000000');
export const I32_MAX = BigInt('0x7fffffff');

z.ZodString.prototype.i32 = function (message: errorUtil.ErrMessage = 'Invalid i32 string') {
  return this.refine(arg => {
    if (!isInt(arg)) {
      return false;
    }

    const bigint = BigInt(arg);
    if (bigint > I32_MAX || bigint < I32_MIN) {
      return false;
    }

    return true;
  }, message);
};
