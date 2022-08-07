import { z } from 'zod';
import './i32';
import { I32_MAX, I32_MIN } from './i32';

describe('zod-i32-validator', () => {
  it('should test i32 string', () => {
    expect(z.string().i32().safeParse(I32_MIN.toString()).success).toBeTruthy();
    expect(z.string().i32().safeParse(I32_MAX.toString()).success).toBeTruthy();
    expect(
      z
        .string()
        .i32()
        .safeParse(I32_MAX.toString() + '1').success,
    ).toBeFalsy();

    expect(z.string().int().safeParse('aaa').success).toBeFalsy();
    expect(z.string().int().safeParse('010').success).toBeFalsy();
  });
});
