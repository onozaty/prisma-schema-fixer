import { Block } from "../block";
import { FieldNameRule } from "./field-name-rule";

describe("apply", () => {
  test("case", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [{ case: "camel" }];
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
    FieldNameRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model UserProfile {",
      "  /// comment",
      "  id        Int      @id @default(autoincrement())",
      "  name      String?",
      "  createdAt DateTime @default(now())",
      "}",
    ]);
  });

  test("non model", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [{ case: "pascal" }];
    const block: Block = {
      type: "enum",
      lines: ["enum Role {", "  USER", "  ADMIN", "}"],
    };

    // Act
    FieldNameRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual(["enum Role {", "  USER", "  ADMIN", "}"]);
  });

  test("configs", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [
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
    FieldNameRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model UserProfile {",
      "  Id        Int      @id @default(autoincrement())",
      "  name      String",
      "  Address   String?",
      "  /// comment",
      "  birth_day  DateTime",
      "  // comment",
      "  created_at DateTime @default(now())",
      "}",
    ]);
  });

  test("configs - default", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [
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
    FieldNameRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model UserProfile {",
      "  id        Int      @id @default(autoincrement())",
      "  name      String",
      "  address   String?",
      "  birth_day  DateTime",
      "  created_at DateTime @default(now())",
      "}",
    ]);
  });

  test("configs - miss", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [
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
    FieldNameRule.apply(configs, block);

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
