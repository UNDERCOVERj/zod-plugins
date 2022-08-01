# utils

export some functions to help you use zod

## Usage

1. install

```
npm i @zod-plugins/utils -D

yarn add @zod-plugins/utils -D

pnpm i @zod-plugins/utils -D
```

2. import

```
import { preParseFromRecordString } from '@zod-plugins/utils';

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
```
