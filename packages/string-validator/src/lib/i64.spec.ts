import { z } from 'zod';
import './i64';
import { I64_MAX, I64_MIN } from './i64';

describe('zod-i64-validator', () => {
  it('should test i64 string', () => {
    expect(
      z.string().i64().min(10).safeParse(I64_MAX.toString().slice(0, 10)).success,
    ).toBeTruthy();
    expect(z.string().i64().min(10).safeParse(I64_MAX.toString().slice(0, 8)).success).toBeFalsy();
    expect(z.string().i64().safeParse(I64_MIN.toString()).success).toBeTruthy();
    expect(z.string().i64().safeParse(I64_MAX.toString()).success).toBeTruthy();
    expect(
      z
        .string()
        .i64()
        .safeParse(I64_MAX.toString() + '1').success,
    ).toBeFalsy();
    expect(z.string().int().safeParse('aaa').success).toBeFalsy();
    expect(z.string().int().safeParse('010').success).toBeFalsy();

    expect(
      z
        .string()
        .i64()
        .int()
        ._def.customChecks?.map(item => item.kind),
    ).toEqual(['i64', 'int']);
  });
});
