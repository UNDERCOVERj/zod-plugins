# numeric

This library is a extend for z.ZodString to check whether the string value is numeric

## Usage

```
import '@zod-plugins/numeric';

z.string().numeric();
```

> it's just a syntactic sugar for `z.string().regex(/^\d+$/)`
