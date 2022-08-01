import { preParseFromRecordString } from './utils';
import { z } from 'zod';

function stringifyDataToRecordString(data: Record<string, any>) {
  return Object.entries(data).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key]: typeof value === 'string' ? value : JSON.stringify(value),
    }),
    {},
  );
}

describe('utils', () => {
  it('should work', () => {
    enum TestEnum {
      a = 1,
      b = 2,
      d = 'ccc',
    }
    const schema = z.object({
      a: z.number(),
      b: z.object({
        a: z.number(),
        b: z.string(),
      }),
      c: z.string(),
      d: z.array(z.number()),
      e: z.boolean(),
      f: z.enum(['a', 'b']),
      g: z.nativeEnum(TestEnum),
      h: z.number().optional(),
      j: z.nativeEnum(TestEnum),
      k: z.array(z.number()),
    });

    const result = preParseFromRecordString(schema).safeParse(
      stringifyDataToRecordString({
        a: 1,
        b: {
          a: 1,
          b: '1',
        },
        c: '112',
        d: [123],
        e: true,
        f: 'a',
        g: 1,
        j: 'ccc',
        k: [1, 2],
      }),
    );

    expect(result.success).toBeTruthy();

    interface SchemaType {
      a: string;
      b?: SchemaType;
      c?: number;
    }

    const schema2: z.ZodType<SchemaType> = z.object({
      a: z.string(),
      b: z.lazy(() => schema2).optional(),
      c: z.number().optional(),
    });

    const result2 = preParseFromRecordString(schema2).safeParse(
      stringifyDataToRecordString({
        a: '1',
        b: {
          a: '13',
          c: 2,
        },
      }),
    );

    expect(result2.success).toBeTruthy();
  });
});
