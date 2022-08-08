import { z } from 'zod';
import './int';

describe('zod-int-validator', () => {
  it('should test int string', () => {
    expect(z.string().int().min(1).safeParse('1').success).toBeTruthy();
    expect(z.string().int().min(2).safeParse('1').success).toBeFalsy();
    expect(z.string().int().safeParse('1').success).toBeTruthy();
    expect(z.string().int().safeParse('a').success).toBeFalsy();
    expect(z.string().int().safeParse('101').success).toBeTruthy();
    expect(z.string().int().safeParse('010').success).toBeFalsy();
  });
});
