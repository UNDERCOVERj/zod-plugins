import { z } from 'zod';
import { errorUtil } from 'zod/lib/helpers/errorUtil';

declare module 'zod' {
  interface ZodString {
    numeric: (message?: errorUtil.ErrMessage) => ZodString;
  }
}

z.ZodString.prototype.numeric = function (
  message: errorUtil.ErrMessage = 'Invalid numeric string',
) {
  return this._addCheck({
    kind: 'regex',
    regex: /^\d+$/,
    ...errorUtil.errToObj(message),
  });
};
