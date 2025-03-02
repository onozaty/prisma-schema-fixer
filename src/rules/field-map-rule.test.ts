import { Block } from "../block";
import { FieldMapRule } from "./field-map-rule";

describe("apply", () => {
  test("case", () => {
    // Arrange
    const configs: FieldMapRule.Config[] = [{ case: "camel" }];
    const block: Block = {
      type: "model",
      lines: [
        "model UserProfile {",
        "  /// comment",
        "  Id        Int      @id @default(autoincrement())",
        "  name      String?",
        "  CreatedAt DateTime @default(now())",
        "}",
      ],
    };

    // Act
    FieldMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model UserProfile {",
      "  /// comment",
      '  Id        Int      @id @default(autoincrement()) @map("id")',
      '  name      String? @map("name")',
      '  CreatedAt DateTime @default(now()) @map("createdAt")',
      "}",
    ]);
  });

  test("non model", () => {
    // Arrange
    const configs: FieldMapRule.Config[] = [{ case: "pascal" }];
    const block: Block = {
      type: "enum",
      lines: ["enum Role {", "  USER", "  ADMIN", "}"],
    };

    // Act
    FieldMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual(["enum Role {", "  USER", "  ADMIN", "}"]);
  });

  test("configs", () => {
    // Arrange
    const configs: FieldMapRule.Config[] = [
      { case: "camel" },
      { targets: { model: "UserProfile" }, case: "snake" },
      {
        targets: [
          { model: "UserProfile", field: "id" },
          { model: /User/, field: "address" },
        ],
        case: "pascal",
      },
      { targets: { model: "User", field: "birthDay" }, case: "pascal" },
    ];
    const block: Block = {
      type: "model",
      lines: [
        "model UserProfile {",
        "  id        Int      @id @default(autoincrement())",
        "  Name      String",
        "  address   String?",
        "  /// comment",
        "  birthDay  DateTime",
        "  // comment",
        "  createdAt DateTime @default(now())",
        "}",
      ],
    };

    // Act
    FieldMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model UserProfile {",
      '  id        Int      @id @default(autoincrement()) @map("Id")',
      '  Name      String @map("name")',
      '  address   String? @map("Address")',
      "  /// comment",
      '  birthDay  DateTime @map("birth_day")',
      "  // comment",
      '  createdAt DateTime @default(now()) @map("created_at")',
      "}",
    ]);
  });

  test("configs - default", () => {
    // Arrange
    const configs: FieldMapRule.Config[] = [
      { case: "snake" },
      {
        targets: { model: "UserProfile", field: "xxx" },
        case: "pascal",
      },
      { targets: { model: "User", field: "birthDay" }, case: "pascal" },
    ];
    const block: Block = {
      type: "model",
      lines: [
        "model UserProfile {",
        "  id        Int      @id @default(autoincrement())",
        "  Name      String",
        "  address   String?",
        "  birthDay  DateTime",
        "  createdAt DateTime @default(now())",
        "}",
      ],
    };

    // Act
    FieldMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model UserProfile {",
      '  id        Int      @id @default(autoincrement()) @map("id")',
      '  Name      String @map("name")',
      '  address   String? @map("address")',
      '  birthDay  DateTime @map("birth_day")',
      '  createdAt DateTime @default(now()) @map("created_at")',
      "}",
    ]);
  });

  test("configs - miss", () => {
    // Arrange
    const configs: FieldMapRule.Config[] = [
      { targets: { model: "UserProfile", field: "BirthDay" }, case: "snake" },
      { targets: { model: /^Profile/ }, case: "snake" },
      { targets: { field: /birthDay/ }, case: "snake" },
    ];
    const block: Block = {
      type: "model",
      lines: [
        "model UserProfile {",
        "  Id        Int      @id @default(autoincrement())",
        "  Name      String",
        "  Address   String?",
        "  birthDay  DateTime",
        "  createdAt DateTime @default(now())",
        "}",
      ],
    };

    // Act
    FieldMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model UserProfile {",
      "  Id        Int      @id @default(autoincrement())",
      "  Name      String",
      "  Address   String?",
      "  birthDay  DateTime",
      "  createdAt DateTime @default(now())",
      "}",
    ]);
  });
});
