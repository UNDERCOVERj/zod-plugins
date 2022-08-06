import { preParseFromRecordString } from './utils';
import type { Equal, Expect } from './interface';
import assert from 'assert';
import { z } from 'zod';

function stringifyDataToRecordString<T>(data: any): T {
  return Object.entries(data).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key]: typeof value === 'string' ? value : JSON.stringify(value),
    }),
    {} as T,
  );
}

describe('utils', () => {
  it('should parse object work', () => {
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
      l: z.preprocess(val => JSON.parse(val as string), z.number().array()),
      m: z.number().array().array(),
      n: z.string().transform(val => z.number().parse(val && Number(val))),
    });

    const inputData = {
      a: 1,
      b: {
        a: 1,
        b: '1',
      },
      c: '112',
      d: [123],
      e: true,
      f: 'a' as 'a' | 'b',
      g: TestEnum.a,
      j: TestEnum.d,
      k: [1, 2],
      l: [1, 2],
      m: [[1], [2]],
      n: '123',
    };

    const result = preParseFromRecordString(schema).safeParse(
      stringifyDataToRecordString(inputData),
    );

    expect(result.success).toBeTruthy();

    assert(result.success);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type Case = Expect<Equal<typeof result.data, Omit<typeof inputData, 'n'> & { n: number }>>;
  });

  it('should parse object has lazy work', () => {
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

    const result = preParseFromRecordString(schema2).safeParse(
      stringifyDataToRecordString({
        a: '1',
        b: {
          a: '13',
          c: 2,
        },
      }),
    );

    expect(result.success).toBeTruthy();
  });

  it('should parse lazy object work', () => {
    interface SchemaType {
      a: string;
      b?: SchemaType;
      c?: number;
    }

    const schema2: z.ZodType<SchemaType> = z.lazy(() =>
      z.object({
        a: z.string(),
        b: z.lazy(() => schema2).optional(),
        c: z.number().optional(),
        d: z
          .object({
            a: z.string(),
          })
          .optional(),
      }),
    );
    const inputData: SchemaType = {
      a: '1',
      b: {
        a: '13',
        c: 2,
      },
    };

    const result = preParseFromRecordString(schema2).safeParse(
      stringifyDataToRecordString(inputData),
    );

    expect(result.success).toBeTruthy();

    assert(result.success);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type Case = Expect<Equal<typeof result.data, typeof inputData>>;
  });

  it('should parse record success', () => {
    const ReocrdSchema = z.record(z.string(), z.number());

    const inputData: Record<string, number> = {
      a: 1,
      b: 2,
    };

    const outputSchema = preParseFromRecordString(ReocrdSchema);

    const result = preParseFromRecordString(outputSchema).safeParse(
      stringifyDataToRecordString(inputData),
    );

    expect(result.success).toBeTruthy();

    assert(result.success);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type Case = Expect<Equal<typeof result.data, typeof inputData>>;
  });

  it('should parse record failed', () => {
    const ReocrdSchema = z.record(z.string(), z.number());

    const data = {
      a: 1,
      b: '',
    };

    const result = preParseFromRecordString(ReocrdSchema).safeParse(
      stringifyDataToRecordString(data),
    );

    expect(result.success).toBeFalsy();
  });

  it('should support transform', () => {
    const schema = z.object({
      key: z.preprocess(
        val => JSON.parse(val as string),
        z.object({
          a: z.string().transform(val => z.number().parse(val && Number(val))),
        }),
      ),
      value: z.string().transform(val =>
        z
          .object({
            a: z.number(),
          })
          .parse(JSON.parse(val)),
      ),
      valueString: z.string(),
      number: z.number(),
    });

    const inputData = {
      key: {
        a: '1',
      },
      value: {
        a: 1,
      },
      valueString: '123',
      number: 123,
    };

    const outputSchema = preParseFromRecordString(schema);
    const result = outputSchema.safeParse(stringifyDataToRecordString(inputData));

    expect(result.success).toBeTruthy();
    expect(result.success && result.data).toEqual({
      key: { a: 1 },
      value: { a: 1 },
      number: 123,
      valueString: '123',
    });

    assert(result.success);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type Case = Expect<
      Equal<
        typeof result.data,
        {
          number: number;
          value: {
            a: number;
          };
          key: {
            a: number;
          };
          valueString: string;
        }
      >
    >;
  });
});
