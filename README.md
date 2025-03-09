# prisma-schema-fixer

`prisma-schema-fixer` is a tool to fix Prisma schema files (`schema.prisma`) according to specified rules.

## 1. Installation

```sh
npm install --save-dev @onozaty/prisma-schema-fixer
```

## 2. Usage

Run the following command to fix your schema file:

```sh
prisma-schema-fixer -f path/to/schema.prisma -c path/to/schema-fixer.config.mjs
```

```
Options:
  -f, --file <schemaFile>         Path to `schema.prisma` file (default: "./prisma/schema.prisma")
  -c, --config-file <configFile>  Path to configuration file (default: "./prisma/schema-fixer.config.mjs")
  -n, --dry-run                   Show changes in the console instead of modifying the file (default: false)
  -V, --version                   output the version number
  -h, --help                      display help for command
```

## 3. Configuration File

The configuration file is used to define the rules for fixing the schema.
The configuration file is written in .mjs format and has the following structure:

```js
// @ts-check
/** @type {import("@onozaty/prisma-schema-fixer").Config} */
export default {
  rules: {
    "model-name": [
      {
        case: "pascal",
        form: "singular",
      },
    ],
    "model-map": [
      {
        case: "snake",
        form: "plural",
      },
    ],
    "field-name": [
      {
        case: "camel",
      },
    ],
    "field-map": [
      {
        case: "snake",
      },
    ],
    "enum-name": [
      {
        case: "pascal",
        form: "singular",
      },
    ],
    "enum-map": [
      {
        case: "snake",
        form: "plural",
      },
    ],
  },
};
```

## 4. Roules

### (1) model-name

Rules for model names.

- `case`: Specify case styles.
  - `pascal`: PascalCase
  - `camel`: camelCase
  - `snake`: snake_case
- `form`: Specify singular or plural form.
  - `singular`: Singular
  - `plural`: Plural

Using the following rule:

```js
export default {
  rules: {
    "model-name": [
      {
        case: "pascal",
        form: "singular",
      },
    ],
  },
};
```

The `schema.prisma` will be fixed as follows:

```diff
-model users {
+model User {
  id   Int  @id @default(autoincrement())
  name String
}
```

### (2) model-map

Rules for table names corresponding to models.

- `case`: Specify case styles.
  - `pascal`: PascalCase
  - `camel`: camelCase
  - `snake`: snake_case
- `form`: Specify singular or plural form.
  - `singular`: Singular
  - `plural`: Plural

Using the following rule:

```js
export default {
  rules: {
    "model-map": [
      {
        case: "snake",
        form: "plural",
      },
    ],
  },
};
```

The `schema.prisma` will be fixed as follows:

```diff
model UserProfile {
  id   Int  @id @default(autoincrement())
  name String
+
+ @@map("user_profiles")
}
```

### (3) field-name

Rules for field names.

- `case`: Specify case styles.
  - `pascal`: PascalCase
  - `camel`: camelCase
  - `snake`: snake_case

Using the following rule:

```js
export default {
  rules: {
    "field-name": [
      {
        case: "camel",
      },
    ],
  },
};
```

The `schema.prisma` will be fixed as follows:

```diff
model Post {
  id        Int      @id @default(autoincrement())
- Published Boolean  @default(false)
+ published Boolean  @default(false)
- CreatedAt DateTime @default(now())
+ createdAt DateTime @default(now())
}
```

### (4) field-map

Rules for column names corresponding to fields.

- `case`: Specify case styles.
  - `pascal`: PascalCase
  - `camel`: camelCase
  - `snake`: snake_case

Using the following rule:

```js
export default {
  rules: {
    "field-map": [
      {
        case: "snake",
      },
    ],
  },
};
```

The `schema.prisma` will be fixed as follows:

```diff
model User {
  id        Int      @id @default(autoincrement())
- createdAt DateTime @default(now())
+ createdAt DateTime @default(now()) @map("created_at")
}
```

### (5) enum-name

Rules for enum names.

- `case`: Specify case styles.
  - `pascal`: PascalCase
  - `camel`: camelCase
  - `snake`: snake_case
- `form`: Specify singular or plural form.
  - `singular`: Singular
  - `plural`: Plural

Using the following rule:

```js
export default {
  rules: {
    "enum-name": [
      {
        case: "pascal",
        form: "singular",
      },
    ],
  },
};
```

The `schema.prisma` will be fixed as follows:

```diff
-enum roles {
+enum Role {
  USER
  ADMIN
}
```

### (6) enum-map

Rules for database-side enum names corresponding to enums.

- `case`: Specify case styles.
  - `pascal`: PascalCase
  - `camel`: camelCase
  - `snake`: snake_case
- `form`: Specify singular or plural form.
  - `singular`: Singular
  - `plural`: Plural

Using the following rule:

```js
export default {
  rules: {
    "enum-map": [
      {
        case: "snake",
        form: "plural",
      },
    ],
  },
};
```

The `schema.prisma` will be fixed as follows:

```diff
enum Role {
  USER
  ADMIN
+
+ @@map("roles")
}
```

### Targets

Specify the targets for the rules. This can be used to apply rules to specific models, fields, or enums.

- `string`: Target a specific model, field, or enum by name.
- `string[]`: Target multiple models, fields, or enums by their names.
- `RegExp`: Target models, fields, or enums that match the regular expression.

If more than one is written in a single rule, the one written later takes precedence.  
Therefore, it is best to write default rules first, followed by individual rules.

Example usage:

```js
export default {
  rules: {
    "model-name": [
      {
        case: "snake",
        form: "singular",
      },
      {
        targets: ["User"],
        case: "pascal",
      },
    ],
    "field-name": [
      {
        case: "snake",
      },
      {
        targets: { model: "post", field: "createdAt" },
        case: "pascal",
      },
    ],
  },
};
```

The `schema.prisma` will be fixed as follows:

```diff
-model users {
+model User {
  id        Int  @id @default(autoincrement())
  name      String
- createdAt DateTime @default(now())
+ created_at DateTime @default(now())
}

-model Posts {
+model post {
  id        Int      @id @default(autoincrement())
- Published Boolean  @default(false)
+ published Boolean  @default(false)
- createdAt DateTime @default(now())
+ CreatedAt DateTime @default(now())
}
```

You can also write that you do not apply rules in a specific pattern.

```js
export default {
  rules: {
    "model-name": [
      {
        case: "pascal",
        form: "singular",
      },
      {
        targets: ["users"],
      },
    ],
  },
};
```

The `schema.prisma` will be fixed as follows:  
Only `users` will not be fixed.

```diff
model users {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
}

-model userProfiles {
+model UserProfile {
  id   Int    @id @default(autoincrement())",
  name String",
}

-model posts {
+model Post {
  id        Int      @id @default(autoincrement())
  published Boolean  @default(false)
}
```

## License

MIT

## Author

[onozaty](https://github.com/onozaty)
