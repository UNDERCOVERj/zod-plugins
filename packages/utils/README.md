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

function stringifyDataToRecordString(data: Record<string, any>): Record<string, string> {
  return Object.entries(data).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key]: typeof value === 'string' ? value : JSON.stringify(value),
    }),
    {},
  );
}

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

### preParseFromRecordString

根据 schema 第一层的 value 类型，自动 preprocess

```typescript
const schema = preParseFromRecordString(z.object({
  a: z.number()
}));

--->

转换后：
const schema = z.object({
  a: z.preprocess(val => Number(val), z.number())
});
```
