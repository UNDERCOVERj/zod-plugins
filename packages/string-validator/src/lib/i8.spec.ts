import { z } from 'zod';
import './i8';
import { I8_MAX, I8_MIN } from './i8';

describe('zod-i8-validator', () => {
  it('should test i8 string', () => {
    expect(z.string().i8().safeParse(I8_MIN.toString()).success).toBeTruthy();
    expect(z.string().i8().safeParse(I8_MAX.toString()).success).toBeTruthy();
    expect(
      z
        .string()
        .i8()
        .safeParse(I8_MAX.toString() + '1').success,
    ).toBeFalsy();

    expect(z.string().int().safeParse('aaa').success).toBeFalsy();
    expect(z.string().int().safeParse('010').success).toBeFalsy();
  });
});
