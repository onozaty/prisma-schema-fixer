import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import { ModelBlock } from "../blocks/model-block";
import { NoneBlock } from "../blocks/none-block";
import { OtherBlock } from "../blocks/other-block";
import { ModelNameRule } from "./model-name-rule";

describe("apply", () => {
  test("case", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [{ case: "camel" }];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        "  email     String   @unique",
        "  role      Role     @default(USER)",
        "  profile   UserProfile?",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        "  bio    String?",
        "  user   User   @relation(fields: [user_id], references: [id])",
        "  userId Int    @unique",
        "}",
      ]),
      new EnumBlock(["enum User {", "  USER", "  ADMIN", "}"]),
      new OtherBlock(["other User  {", "}"]),
      new NoneBlock(["// User"]),
    ];

    // Act
    ModelNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model user {",
      "  id        Int      @id @default(autoincrement())",
      "  createdAt DateTime @default(now())",
      "  email     String   @unique",
      "  role      Role     @default(USER)",
      "  profile   userProfile?",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model userProfile {",
      "  id     Int    @id @default(autoincrement())",
      "  name   String?",
      "  bio    String?",
      "  user   user   @relation(fields: [user_id], references: [id])",
      "  userId Int    @unique",
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "enum User {",
      "  USER",
      "  ADMIN",
      "}",
    ]);
    expect(blocks[3].getLines()).toEqual(["other User  {", "}"]);
    expect(blocks[4].getLines()).toEqual(["// User"]);
  });

  test("form", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [{ form: "plural" }];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        "  email     String   @unique",
        "  role      Role     @default(USER)",
        "  profile   UserProfile?",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        "  bio    String?",
        "  user   User   @relation(fields: [user_id], references: [id])",
        "  userId Int    @unique",
        "}",
      ]),
    ];

    // Act
    ModelNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model Users {",
      "  id        Int      @id @default(autoincrement())",
      "  createdAt DateTime @default(now())",
      "  email     String   @unique",
      "  role      Role     @default(USER)",
      "  profile   UserProfiles?",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfiles {",
      "  id     Int    @id @default(autoincrement())",
      "  name   String?",
      "  bio    String?",
      "  user   Users   @relation(fields: [user_id], references: [id])",
      "  userId Int    @unique",
      "}",
    ]);
  });

  test("func", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [{ func: (v) => v.toUpperCase() }];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id Int @id @default(autoincrement())",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id Int @id @default(autoincrement())",
        "}",
      ]),
    ];

    // Act
    ModelNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model USER {",
      "  id Int @id @default(autoincrement())",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model USERPROFILE {",
      "  id Int @id @default(autoincrement())",
      "}",
    ]);
  });

  test("case & form", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [
      { case: "snake", form: "singular" },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model Users {",
        "  id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        "  email     String   @unique",
        "  role      Role     @default(USER)",
        "  profile   UserProfile?",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        "  bio    String?",
        "  user   Users  @relation(fields: [user_id], references: [id])",
        "  userId Int    @unique",
        "}",
      ]),
    ];

    // Act
    ModelNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model user {",
      "  id        Int      @id @default(autoincrement())",
      "  createdAt DateTime @default(now())",
      "  email     String   @unique",
      "  role      Role     @default(USER)",
      "  profile   user_profile?",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model user_profile {",
      "  id     Int    @id @default(autoincrement())",
      "  name   String?",
      "  bio    String?",
      "  user   user  @relation(fields: [user_id], references: [id])",
      "  userId Int    @unique",
      "}",
    ]);
  });

  test("case & form & func", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [
      { case: "snake", form: "singular", func: (v) => `${v}_1` },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model Users {",
        "  id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        "  email     String   @unique",
        "  role      Role     @default(USER)",
        "  profile   UserProfile?",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        "  bio    String?",
        "  user   Users  @relation(fields: [user_id], references: [id])",
        "  userId Int    @unique",
        "}",
      ]),
    ];

    // Act
    ModelNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model user_1 {",
      "  id        Int      @id @default(autoincrement())",
      "  createdAt DateTime @default(now())",
      "  email     String   @unique",
      "  role      Role     @default(USER)",
      "  profile   user_profile_1?",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model user_profile_1 {",
      "  id     Int    @id @default(autoincrement())",
      "  name   String?",
      "  bio    String?",
      "  user   user_1  @relation(fields: [user_id], references: [id])",
      "  userId Int    @unique",
      "}",
    ]);
  });

  test("configs", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [
      { case: "pascal" },
      { targets: ["userProfile"], case: "snake" },
      { targets: ["user"], case: "pascal" },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model user {",
        "  id    Int    @id @default(autoincrement())",
        "  email String @unique",
        "}",
      ]),
      new ModelBlock([
        "model userProfile {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        "}",
      ]),
      new ModelBlock([
        "model XXXX {",
        "  id Int @id @default(autoincrement())",
        "}",
      ]),
    ];

    // Act
    ModelNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id    Int    @id @default(autoincrement())",
      "  email String @unique",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model user_profile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "model Xxxx {",
      "  id Int @id @default(autoincrement())",
      "}",
    ]);
  });

  test("configs - exclude", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [
      { case: "pascal" },
      { targets: ["userProfile"] },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model user {",
        "  id    Int    @id @default(autoincrement())",
        "  email String @unique",
        "}",
      ]),
      new ModelBlock([
        "model userProfile {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        "}",
      ]),
      new ModelBlock([
        "model XXXX {",
        "  id Int @id @default(autoincrement())",
        "}",
      ]),
    ];

    // Act
    ModelNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id    Int    @id @default(autoincrement())",
      "  email String @unique",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model userProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "model Xxxx {",
      "  id Int @id @default(autoincrement())",
      "}",
    ]);
  });

  test("configs - miss", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [
      { targets: ["UserProfile"], case: "snake" },
      { targets: ["user"], case: "snake" },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model userProfile {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        "}",
      ]),
    ];

    // Act
    ModelNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model userProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      "}",
    ]);
  });
});
