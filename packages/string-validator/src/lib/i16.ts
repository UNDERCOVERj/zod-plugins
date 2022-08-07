import { z } from 'zod';
import type { errorUtil } from 'zod/lib/helpers/errorUtil';
import { isInt } from './int';
import './base';

export const I16_MIN = -BigInt('0x8000');
export const I16_MAX = BigInt('0x7fff');

z.ZodString.prototype.i16 = function (message: errorUtil.ErrMessage = 'Invalid i16 string') {
  return this.refine(arg => {
    if (!isInt(arg)) {
      return false;
    }

    const bigint = BigInt(arg);
    if (bigint > I16_MAX || bigint < I16_MIN) {
      return false;
    }

    return true;
  }, message);
};
