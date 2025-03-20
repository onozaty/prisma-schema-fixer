import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import { ModelBlock } from "../blocks/model-block";
import { NoneBlock } from "../blocks/none-block";
import { OtherBlock } from "../blocks/other-block";
import { FieldAttributeRule } from "./field-attribute-rule";

describe("apply", () => {
  test("typeToAttributes", () => {
    // Arrange
    const configs: FieldAttributeRule.Config[] = [
      { typeToAttributes: { DateTime: ["@db.Timestamptz()"] } },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id         Int      @id @default(autoincrement())",
        "  birthDay   DateTime?",
        "  createdAt  DateTime @default(now())",
        "  eventDates DateTime[]",
        "  exists     DateTime @default(now()) @db.Timestamptz()",
        "}",
      ]),

      new EnumBlock(["enum Role {", "  USER", "  ADMIN", "}"]),
      new OtherBlock(["other xxxx  { abc efg", "}"]),
      new NoneBlock(["// Comment"]),
    ];

    // Act
    FieldAttributeRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id         Int      @id @default(autoincrement())",
      "  birthDay   DateTime? @db.Timestamptz() ",
      "  createdAt  DateTime @db.Timestamptz()  @default(now())",
      "  eventDates DateTime[]",
      "  exists     DateTime @default(now()) @db.Timestamptz()",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "enum Role {",
      "  USER",
      "  ADMIN",
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual(["other xxxx  { abc efg", "}"]);
    expect(blocks[3].getLines()).toEqual(["// Comment"]);
  });

  test("configs", () => {
    // Arrange
    const configs: FieldAttributeRule.Config[] = [
      { typeToAttributes: { DateTime: ["@db.Timestamptz()"] } },
      {
        targets: { field: "createdAt" },
        typeToAttributes: {
          DateTime: ["@db.Timestamptz()", "@default(now())"],
        },
      },
      {
        targets: { field: "updatedAt" },
        typeToAttributes: {
          DateTime: ["@db.Timestamptz()", "@updatedAt"],
        },
      },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id         Int      @id @default(autoincrement())",
        "  birthDay   DateTime?",
        "  createdAt  DateTime",
        "  updatedAt  DateTime",
        "}",
      ]),
    ];

    // Act
    FieldAttributeRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id         Int      @id @default(autoincrement())",
      "  birthDay   DateTime? @db.Timestamptz() ",
      "  createdAt  DateTime @default(now())  @db.Timestamptz() ",
      "  updatedAt  DateTime @updatedAt  @db.Timestamptz() ",
      "}",
    ]);
  });

  test("configs - exclude", () => {
    // Arrange
    const configs: FieldAttributeRule.Config[] = [
      { typeToAttributes: { DateTime: ["@db.Timestamptz()"] } },
      {
        targets: { field: "createdAt" },
        typeToAttributes: {
          DateTime: ["@db.Timestamptz()", "@default(now())"],
        },
      },
      {
        targets: { field: "updatedAt" },
      },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id         Int      @id @default(autoincrement())",
        "  birthDay   DateTime?",
        "  createdAt  DateTime",
        "  updatedAt  DateTime",
        "}",
      ]),
    ];

    // Act
    FieldAttributeRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id         Int      @id @default(autoincrement())",
      "  birthDay   DateTime? @db.Timestamptz() ",
      "  createdAt  DateTime @default(now())  @db.Timestamptz() ",
      "  updatedAt  DateTime",
      "}",
    ]);
  });

  test("configs - miss", () => {
    // Arrange
    const configs: FieldAttributeRule.Config[] = [
      {
        targets: { model: "userProfile" },
        typeToAttributes: { String: ["@db.Text"] },
      },
      {
        targets: { model: "User", field: "Email" },
        typeToAttributes: { String: ["@db.Text"] },
      },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id    Int    @id @default(autoincrement())",
        "  email String @unique",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id        Int      @id @default(autoincrement())",
        "  Name      String",
        "  address   String?",
        "}",
      ]),
    ];

    // Act
    FieldAttributeRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id    Int    @id @default(autoincrement())",
      "  email String @unique",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id        Int      @id @default(autoincrement())",
      "  Name      String",
      "  address   String?",
      "}",
    ]);
  });
});
