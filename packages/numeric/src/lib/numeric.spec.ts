import { z } from 'zod';
import './numeric';

describe('zod-numeric', () => {
  it('should test numeric string', () => {
    expect(z.string().numeric().safeParse('1').success).toBeTruthy();
    expect(z.string().numeric().safeParse('a').success).toBeFalsy();
  });
});
