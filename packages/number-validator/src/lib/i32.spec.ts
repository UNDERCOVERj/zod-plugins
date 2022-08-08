import { z } from 'zod';
import './i32';
import { I32_MAX, I32_MIN } from './i32';

describe('zod-i32-validator', () => {
  it('should test i32 number', () => {
    expect(z.number().i32().safeParse(I32_MIN).success).toBeTruthy();
    expect(z.number().i32().safeParse(I32_MAX).success).toBeTruthy();
    expect(
      z
        .number()
        .i32()
        .safeParse(I32_MAX + 1).success,
    ).toBeFalsy();

    expect(z.number().int().safeParse('aaa').success).toBeFalsy();
    expect(z.number().int().safeParse('010').success).toBeFalsy();
  });
});
