import { z } from 'zod';
import type { errorUtil } from 'zod/lib/helpers/errorUtil';
import { isInt } from './int';
import './base';

export const I8_MIN = -BigInt('0x80');
export const I8_MAX = BigInt('0x7f');

z.ZodString.prototype.i8 = function (message: errorUtil.ErrMessage = 'Invalid i8 string') {
  return this.refine(arg => {
    if (!isInt(arg)) {
      return false;
    }

    const bigint = BigInt(arg);
    if (bigint > I8_MAX || bigint < I8_MIN) {
      return false;
    }

    return true;
  }, message);
};
