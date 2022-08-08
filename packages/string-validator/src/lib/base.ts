import { z } from 'zod';

export interface IntOptions {
  allowLeadingZeroes?: boolean;
  min?: number;
  max?: number;
  lt?: number;
  gt?: number;
}

export type IssueArg = string | { message?: string | undefined; fatal?: boolean };

declare module 'zod' {
  interface ZodString {
    // check a string is a int string
    int: (options?: IntOptions, issueArg?: IssueArg) => z.ZodString;
    // check a string can be converted to i64
    i64: (issueArg?: IssueArg) => z.ZodString;
  }

  interface ZodStringDef {
    customChecks?: Array<
      (input: string, addIssue: (arg?: IssueArg) => void, ctx: z.ParseContext) => void
    >;
  }
}

const _parse = z.ZodString.prototype._parse;

z.ZodString.prototype._parse = function (input: z.ParseInput): z.ParseReturnType<string> {
  const parsedResult = _parse.call(this, input);

  if (z.isAsync(parsedResult)) {
    throw new Error('parsedResult should not be promise');
  }

  const status = new z.ParseStatus();
  let ctx: z.ParseContext = this._getOrReturnCtx(input);

  for (const fn of this._def.customChecks || []) {
    ctx = this._getOrReturnCtx(input);
    fn(
      input.data,
      arg => {
        z.addIssueToContext(
          ctx,
          typeof arg === 'string'
            ? {
                message: arg,
                code: z.ZodIssueCode.custom,
              }
            : {
                ...arg,
                message: arg?.message || 'Invalid string',
                code: z.ZodIssueCode.custom,
              },
        );
        status.dirty();
      },
      ctx,
    );
  }

  if (status.value !== 'valid') {
    return { status: status.value, value: input.data };
  }

  return parsedResult;
};
