import { z } from 'zod';

declare type UnknownKeysParam = 'passthrough' | 'strict' | 'strip';

function preParseSingle(schema: z.ZodTypeAny, value?: unknown): any {
  if (schema instanceof z.ZodNumber) {
    return Number(value);
  }

  if (
    typeof value === 'string' &&
    (schema instanceof z.ZodObject ||
      schema instanceof z.ZodArray ||
      schema instanceof z.ZodRecord ||
      schema instanceof z.ZodTuple)
  ) {
    return JSON.parse(value as string);
  }

  if (typeof value === 'string' && schema instanceof z.ZodLazy) {
    return preParseSingle(schema._def.getter(), value);
  }

  if (typeof value === 'string' && schema instanceof z.ZodNativeEnum) {
    const values = Object.values(schema.enum);

    for (let val of values) {
      if (val === value) {
        return value;
      } else if (val === Number(value)) {
        return val;
      }
    }
  }

  if (typeof value === 'string' && schema instanceof z.ZodBoolean) {
    return value === 'true' ? true : value === 'false' ? false : value;
  }

  return value;
}

/**
 * 将schema第一层的value做preprocess处理
 * 应用场景是一体化中为get请求做parse
 */
export function preParseFromRecordString<
  T extends z.ZodRawShape,
  UnknownKeys extends UnknownKeysParam = 'strip',
  Catchall extends z.ZodTypeAny = z.ZodTypeAny,
  Output = z.objectOutputType<T, Catchall>,
  Input = z.objectInputType<T, Catchall>,
>(schema: z.ZodObject<T, UnknownKeys, Catchall, Output, Input> | z.ZodType) {
  let newShape: any = {};

  if (schema instanceof z.ZodObject) {
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = z.preprocess(val => preParseSingle(fieldSchema, val), fieldSchema);
    }
    return new z.ZodObject({
      ...schema._def,
      shape: () => newShape,
    }) as z.ZodObject<T, UnknownKeys, Catchall, Output, Input>;
  }

  return schema;
}
