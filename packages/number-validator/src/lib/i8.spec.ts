import { z } from 'zod';
import './i8';
import { I8_MAX, I8_MIN } from './i8';

describe('zod-i8-validator', () => {
  it('should test i8 number', () => {
    expect(z.number().i8().safeParse(I8_MIN).success).toBeTruthy();
    expect(z.number().i8().safeParse(I8_MAX).success).toBeTruthy();
    expect(
      z
        .number()
        .i8()
        .safeParse(I8_MAX + 1).success,
    ).toBeFalsy();

    expect(z.number().int().safeParse('aaa').success).toBeFalsy();
    expect(z.number().int().safeParse('010').success).toBeFalsy();
  });
});
