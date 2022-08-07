import { z } from 'zod';
import './i16';
import { I16_MAX, I16_MIN } from './i16';

describe('zod-i16-validator', () => {
  it('should test i16 string', () => {
    expect(z.string().i16().safeParse(I16_MIN.toString()).success).toBeTruthy();
    expect(z.string().i16().safeParse(I16_MAX.toString()).success).toBeTruthy();
    expect(
      z
        .string()
        .i16()
        .safeParse(I16_MAX.toString() + '1').success,
    ).toBeFalsy();

    expect(z.string().int().safeParse('aaa').success).toBeFalsy();
    expect(z.string().int().safeParse('010').success).toBeFalsy();
  });
});
