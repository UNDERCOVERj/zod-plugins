import { z } from 'zod';

function preParseSingle(schema: z.ZodTypeAny, value?: unknown): any {
  if (typeof value !== 'string') return value; // 可能为undefined

  if (schema instanceof z.ZodNumber) {
    return /^[-]?\d+$/.test(value) ? Number(value) : value;
  }

  if (
    schema instanceof z.ZodObject ||
    schema instanceof z.ZodArray ||
    schema instanceof z.ZodRecord ||
    schema instanceof z.ZodTuple
  ) {
    try {
      const parsedData = JSON.parse(value as string);
      return parsedData;
    } catch {
      return value;
    }
  }

  if (schema instanceof z.ZodLazy) {
    return preParseSingle(schema._def.getter(), value);
  }

  if (schema instanceof z.ZodNativeEnum) {
    const values = Object.values(schema.enum);

    for (const val of values) {
      if (val === value || val === Number(value)) {
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

function preParseToRecordOrObject<Schema extends z.ZodType = z.ZodType>(
  schema: Schema,
): Schema | undefined {
  if (schema instanceof z.ZodRecord) {
    return z.record(
      schema.keySchema as any,
      z.preprocess(val => preParseSingle(schema.valueSchema, val), schema.valueSchema) as any,
    ) as unknown as Schema;
  } else if (schema instanceof z.ZodObject) {
    const newShape: any = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = z.preprocess(val => preParseSingle(fieldSchema, val), fieldSchema);
    }

    return new z.ZodObject({
      ...schema._def,
      shape: () => newShape,
    }) as unknown as Schema;
  }

  return undefined;
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
export function preParseFromRecordString<Schema extends z.ZodType>(schema: Schema): Schema {
  const result = preParseToRecordOrObject(schema instanceof z.ZodLazy ? schema.schema : schema);

  if (result) return result;

  throw new Error('only support schema type: ZodObject、ZodLazy(() => ZodObject)');
}
