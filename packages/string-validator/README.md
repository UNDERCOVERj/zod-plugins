# string-validator

This library is a extend for z.ZodString，providing some custom validator for string

## Usage

```
import '@zod-plugins/string-validator';

z.string().int();
z.string().i8();
z.string().i16();
z.string().i32();
z.string().i64();
```
