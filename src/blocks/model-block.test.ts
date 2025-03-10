import { ModelBlock } from "./model-block";

describe("ModelBlock", () => {
  test("minimum", () => {
    // Arrange
    const lines = [
      "model Xyz {",
      "  id Int @id @default(autoincrement())",
      "}",
    ];

    // Act
    const modelBlock = new ModelBlock();
    lines.forEach((line) => modelBlock.appendLine(line));

    // Assert
    expect(modelBlock.getLines()).toEqual(lines);
    expect(modelBlock.getModelName()).toEqual("Xyz");
    expect(modelBlock.getMap()).toEqual(undefined);

    const fieldLines = modelBlock.getFieldLines();
    expect(fieldLines).toHaveLength(1);
    const field1 = fieldLines[0];
    expect(field1.getFieldName()).toEqual("id");
    expect(field1.getFieldType()).toEqual("Int");
    expect(field1.getMap()).toEqual(undefined);
    expect(field1.getRelationFields()).toEqual(undefined);
    expect(field1.getRelationReferences()).toEqual(undefined);
  });

  test("model map", () => {
    // Arrange
    const lines = [
      "model User {",
      "  id         String     @id @default(uuid())",
      "  name       String",
      "  email      String     @unique",
      '  posts      Post[]     @relation("PostAuthor")',
      '  comments   Comment[]  @relation("CommentAuthor")',
      "  likedPosts PostLike[]",
      "  createdAt  DateTime   @default(now())",
      "",
      '  @@map("users")',
      "}",
    ];

    // Act
    const modelBlock = new ModelBlock();
    lines.forEach((line) => modelBlock.appendLine(line));

    // Assert
    expect(modelBlock.getLines()).toEqual(lines);
    expect(modelBlock.getModelName()).toEqual("User");
    expect(modelBlock.getMap()).toEqual("users");

    const fieldLines = modelBlock.getFieldLines();
    expect(fieldLines).toHaveLength(7);
  });

  test("relations", () => {
    // Arrange
    const lines = [
      "model Xyz {",
      "  x     X?   @relation(fields: [xId], references: [id])",
      "  xId   Int?",
      '  y     Y    @relation("Abc", references: [id1, id2], onDelete: Cascasde, fields: [y1Id, y2Id])',
      "  y1Id  Int",
      "  y2Id  Int /// comment",
      "}",
    ];

    // Act
    const modelBlock = new ModelBlock();
    lines.forEach((line) => modelBlock.appendLine(line));

    // Assert
    expect(modelBlock.getLines()).toEqual(lines);
    expect(modelBlock.getModelName()).toEqual("Xyz");
    expect(modelBlock.getMap()).toEqual(undefined);

    const fieldLines = modelBlock.getFieldLines();
    expect(fieldLines).toHaveLength(5);
    // check relation
    const field1 = fieldLines[0];
    expect(field1.getFieldName()).toEqual("x");
    expect(field1.getFieldType()).toEqual("X?");
    expect(field1.getMap()).toEqual(undefined);
    expect(field1.getRelationFields()).toEqual(["xId"]);
    expect(field1.getRelationReferences()).toEqual(["id"]);
    const field3 = fieldLines[2];
    expect(field3.getFieldName()).toEqual("y");
    expect(field3.getFieldType()).toEqual("Y");
    expect(field3.getMap()).toEqual(undefined);
    expect(field3.getRelationFields()).toEqual(["y1Id", "y2Id"]);
    expect(field3.getRelationReferences()).toEqual(["id1", "id2"]);
  });

  test("field map", () => {
    // Arrange
    const lines = [
      "model User {",
      "  id        String   @id @default(uuid())",
      '  username  String   @map("user_name")',
      "  email     String   @unique",
      '  createdAt DateTime @default(now()) @map("created_at")',
      "}",
    ];

    // Act
    const modelBlock = new ModelBlock();
    lines.forEach((line) => modelBlock.appendLine(line));

    // Assert
    expect(modelBlock.getLines()).toEqual(lines);
    expect(modelBlock.getModelName()).toEqual("User");
    expect(modelBlock.getMap()).toEqual(undefined);

    const fieldLines = modelBlock.getFieldLines();
    expect(fieldLines).toHaveLength(4);
    const field1 = fieldLines[0];
    expect(field1.getFieldName()).toEqual("id");
    expect(field1.getFieldType()).toEqual("String");
    expect(field1.getMap()).toEqual(undefined);
    expect(field1.getRelationFields()).toEqual(undefined);
    expect(field1.getRelationReferences()).toEqual(undefined);
    const field2 = fieldLines[1];
    expect(field2.getFieldName()).toEqual("username");
    expect(field2.getFieldType()).toEqual("String");
    expect(field2.getMap()).toEqual("user_name");
    expect(field2.getRelationFields()).toEqual(undefined);
    expect(field2.getRelationReferences()).toEqual(undefined);
    const field3 = fieldLines[2];
    expect(field3.getFieldName()).toEqual("email");
    expect(field3.getFieldType()).toEqual("String");
    expect(field3.getMap()).toEqual(undefined);
    expect(field3.getRelationFields()).toEqual(undefined);
    expect(field3.getRelationReferences()).toEqual(undefined);
    const field4 = fieldLines[3];
    expect(field4.getFieldName()).toEqual("createdAt");
    expect(field4.getFieldType()).toEqual("DateTime");
    expect(field4.getMap()).toEqual("created_at");
    expect(field4.getRelationFields()).toEqual(undefined);
    expect(field4.getRelationReferences()).toEqual(undefined);
  });

  test("Unsupported", () => {
    // Arrange
    const lines = [
      "model X {",
      "  id        String                                 @id @default(uuid())",
      `  position  Unsupported("circle")                  @default(dbgenerated("'<(10,4),11>'::circle"))`,
      '  geo       Unsupported("geometry(Point, 4326)")?',
      '  geos      Unsupported("geometry(Point, 4326)")[] @map("geos")',
      "}",
    ];

    // Act
    const modelBlock = new ModelBlock();
    lines.forEach((line) => modelBlock.appendLine(line));

    // Assert
    expect(modelBlock.getLines()).toEqual(lines);
    expect(modelBlock.getModelName()).toEqual("X");
    expect(modelBlock.getMap()).toEqual(undefined);

    const fieldLines = modelBlock.getFieldLines();
    expect(fieldLines).toHaveLength(4);
    const field1 = fieldLines[0];
    expect(field1.getFieldName()).toEqual("id");
    expect(field1.getFieldType()).toEqual("String");
    expect(field1.getMap()).toEqual(undefined);
    expect(field1.getRelationFields()).toEqual(undefined);
    expect(field1.getRelationReferences()).toEqual(undefined);
    const field2 = fieldLines[1];
    expect(field2.getFieldName()).toEqual("position");
    expect(field2.getFieldType()).toEqual('Unsupported("circle")');
    expect(field2.getMap()).toEqual(undefined);
    expect(field2.getRelationFields()).toEqual(undefined);
    expect(field2.getRelationReferences()).toEqual(undefined);
    const field3 = fieldLines[2];
    expect(field3.getFieldName()).toEqual("geo");
    expect(field3.getFieldType()).toEqual(
      'Unsupported("geometry(Point, 4326)")?',
    );
    expect(field3.getMap()).toEqual(undefined);
    expect(field3.getRelationFields()).toEqual(undefined);
    expect(field3.getRelationReferences()).toEqual(undefined);
    const field4 = fieldLines[3];
    expect(field4.getFieldName()).toEqual("geos");
    expect(field4.getFieldType()).toEqual(
      'Unsupported("geometry(Point, 4326)")[]',
    );
    expect(field4.getMap()).toEqual("geos");
    expect(field4.getRelationFields()).toEqual(undefined);
    expect(field4.getRelationReferences()).toEqual(undefined);
  });
});
