import { z } from 'zod';
import './base';
import type { IntOptions, IssueArg } from './base';

// copy from https://github.com/validatorjs/validator.js/blob/master/src/lib/isInt.js
const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
const intLeadingZeroes = /^[-+]?[0-9]+$/;

z.ZodString.prototype.int = function (
  options?: IntOptions,
  issueArg: IssueArg = 'Invalid int string',
) {
  return new z.ZodString({
    ...this._def,
    customChecks: [
      ...(this._def.customChecks || []),
      (input, addIssue) => {
        if (!isInt(input, options)) {
          addIssue(issueArg);
        }
      },
    ],
  });
};

export function isInt(arg: string, options?: IntOptions) {
  const regex = !options?.allowLeadingZeroes ? int : intLeadingZeroes;

  // Check min/max/lt/gt
  const minCheckPassed = !options?.min || Number(arg) >= options.min;
  const maxCheckPassed = !options?.max || Number(arg) <= options.max;
  const ltCheckPassed = !options?.lt || Number(arg) < options.lt;
  const gtCheckPassed = !options?.gt || Number(arg) > options.gt;

  return regex.test(arg) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
}
