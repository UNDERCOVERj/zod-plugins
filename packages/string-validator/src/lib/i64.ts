import { z } from 'zod';
import { isInt } from './int';
import './base';
import type { IssueArg } from './base';

export const I64_MIN = -BigInt('0x8000000000000000');
export const I64_MAX = BigInt('0x7fffffffffffffff');

z.ZodString.prototype.i64 = function (issueArg: IssueArg = 'Invalid i64 string') {
  return new z.ZodString({
    ...this._def,
    customChecks: [
      ...(this._def.customChecks || []),
      (input, addIssue) => {
        if (!isInt(input)) {
          return addIssue(issueArg);
        }

        const bigint = BigInt(input);
        if (bigint > I64_MAX || bigint < I64_MIN) {
          return addIssue(issueArg);
        }
      },
    ],
  });
};
