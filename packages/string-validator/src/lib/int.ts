import { z } from 'zod';
import './base';
import type { IntOptions, IssueArg, CustomCheck } from './base';

// copy from https://github.com/validatorjs/validator.js/blob/master/src/lib/isInt.js
const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
const intLeadingZeroes = /^[-+]?[0-9]+$/;

z.ZodString.prototype.int = function (
  options?: IntOptions,
  issueArg: IssueArg = 'Invalid int string',
) {
  const customCheck: CustomCheck = (input, addIssue) => {
    if (!isInt(input, options)) {
      addIssue(issueArg);
    }
  };
  customCheck.kind = 'int';
  return new z.ZodString({
    ...this._def,
    customChecks: [...(this._def.customChecks || []), customCheck],
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
