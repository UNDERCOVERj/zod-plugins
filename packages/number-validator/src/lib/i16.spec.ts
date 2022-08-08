import { z } from 'zod';
import './i16';
import { I16_MAX, I16_MIN } from './i16';

describe('zod-i16-validator', () => {
  it('should test i16 number', () => {
    expect(z.number().i16().safeParse(I16_MIN).success).toBeTruthy();
    expect(z.number().i16().safeParse(I16_MAX).success).toBeTruthy();
    expect(
      z
        .number()
        .i16()
        .safeParse(I16_MAX + 1).success,
    ).toBeFalsy();

    expect(z.number().int().safeParse('aaa').success).toBeFalsy();
    expect(z.number().int().safeParse('010').success).toBeFalsy();
  });
});
