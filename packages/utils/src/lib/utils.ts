import { z } from 'zod';

declare type UnknownKeysParam = 'passthrough' | 'strict' | 'strip';

function preParseSingle(schema: z.ZodTypeAny, value?: unknown): any {
  if (typeof value !== 'string') return value; // 可能为undefined

  if (schema instanceof z.ZodNumber) {
    return Number(value);
  }

  if (
    schema instanceof z.ZodObject ||
    schema instanceof z.ZodArray ||
    schema instanceof z.ZodRecord ||
    schema instanceof z.ZodTuple
  ) {
    return JSON.parse(value as string);
  }

  if (schema instanceof z.ZodLazy) {
    return preParseSingle(schema._def.getter(), value);
  }

  if (schema instanceof z.ZodNativeEnum) {
    const values = Object.values(schema.enum);

    for (let val of values) {
      if (val === value) {
        return value;
      } else if (val === Number(value)) {
        return val;
      }
    }
  }

  if (schema instanceof z.ZodOptional) {
    return preParseSingle(schema.unwrap(), value);
  }

  if (schema instanceof z.ZodBoolean) {
    return value === 'true' ? true : value === 'false' ? false : value;
  }

  return value;
}

/**
 * 将schema第一层的value做preprocess处理
 * 应用场景是一体化中为get请求做parse
 *
 * @example
  * ```typescript
  * const schema = preParseFromRecordString(z.object({
  *   a: z.number()
  * }));
  * ---> 转换后：
  * const schema = z.object({
  *   a: z.preprocess(val => Number(val), z.number())
  * });
  * ```
```
 */
export function preParseFromRecordString<
  T extends z.ZodRawShape,
  UnknownKeys extends UnknownKeysParam = 'strip',
  Catchall extends z.ZodTypeAny = z.ZodTypeAny,
  Output = z.objectOutputType<T, Catchall>,
  Input = z.objectInputType<T, Catchall>,
>(schema: z.ZodObject<T, UnknownKeys, Catchall, Output, Input> | z.ZodType) {
  let newShape: any = {};

  let zodObject =
    schema instanceof z.ZodObject
      ? schema
      : schema instanceof z.ZodLazy && schema.schema instanceof z.ZodObject
      ? schema.schema
      : null;

  if (zodObject) {
    for (const key in zodObject.shape) {
      const fieldSchema = zodObject.shape[key];
      newShape[key] = z.preprocess(val => preParseSingle(fieldSchema, val), fieldSchema);
    }

    return new z.ZodObject({
      ...zodObject._def,
      shape: () => newShape,
    }) as z.ZodObject<T, UnknownKeys, Catchall, Output, Input>;
  }

  throw new Error('only support schema type: ZodObject、ZodLazy(() => ZodObject)');
}
