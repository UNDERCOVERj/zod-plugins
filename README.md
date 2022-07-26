# zod-plugins

Various zod plugins to help leverage zod in all sort so places

## Packages within this repository

- ### [@zod-plugins/utils](./packages/utils/README.md)

  - some utils for zod
    - preParseFromRecordString

- ### [@zod-plugins/string-validator](./packages/string-validator/README.md)

  - `z.string().int();`
  - `z.string().i64();`

- ### [@zod-plugins/number-validator](./packages/number-validator/README.md)

  - `z.string().i8();`
  - `z.string().i16();`
  - `z.string().i32();`

# release command

```
git config user.name "FIRST_NAME LAST_NAME"
git config user.email "MY_NAME@example.com"

nx build my-project
nx version my-project
nx publish my-project --ver=xxx

// nx version utils --releaseAs=patch代替version+publish
```
