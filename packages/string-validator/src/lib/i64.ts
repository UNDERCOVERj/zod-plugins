import { z } from 'zod';
import type { errorUtil } from 'zod/lib/helpers/errorUtil';
import { isInt } from './int';
import './base';

export const I64_MIN = -BigInt('0x8000000000000000');
export const I64_MAX = BigInt('0x7fffffffffffffff');

z.ZodString.prototype.i64 = function (message: errorUtil.ErrMessage = 'Invalid i64 string') {
  return this.refine(arg => {
    if (!isInt(arg)) {
      return false;
    }

    const bigint = BigInt(arg);
    if (bigint > I64_MAX || bigint < I64_MIN) {
      return false;
    }

    return true;
  }, message);
};
