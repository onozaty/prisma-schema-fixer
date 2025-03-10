import {
  FieldTargets,
  isTargetByField,
  isTargetByName,
  NameTargets,
} from "./rule";

describe("isTargetByName", () => {
  test("string - true", () => {
    // Arrange
    const targets: NameTargets = ["User"];
    const name = "User";

    // Act/Assert
    expect(isTargetByName(targets, name)).toBe(true);
  });
  test("string - false", () => {
    // Arrange
    const targets: NameTargets = ["User"];
    const name = "Comment";

    // Act/Assert
    expect(isTargetByName(targets, name)).toBe(false);
  });

  test("string[] - true", () => {
    // Arrange
    const targets: NameTargets = ["User", "Post"];
    const name = "User";

    // Act/Assert
    expect(isTargetByName(targets, name)).toBe(true);
  });
  test("string[] - false", () => {
    // Arrange
    const targets: NameTargets = ["User", "Post"];
    const name = "Comment";

    // Act/Assert
    expect(isTargetByName(targets, name)).toBe(false);
  });

  test("RegExp - true", () => {
    // Arrange
    const targets: NameTargets = /^User.+/;
    const name = "UserProfile";

    // Act/Assert
    expect(isTargetByName(targets, name)).toBe(true);
  });
  test("RegExp - false", () => {
    // Arrange
    const targets: NameTargets = /^User.+/;
    const name = "CustomeUser";

    // Act/Assert
    expect(isTargetByName(targets, name)).toBe(false);
  });

  test("undefined", () => {
    // Arrange
    const targets: NameTargets = undefined;
    const name = "AnyName";

    // Act/Assert
    expect(isTargetByName(targets, name)).toBe(true);
  });
});

describe("isTargetByField", () => {
  test("model: string, field: string - true", () => {
    // Arrange
    const targets: FieldTargets = [
      { model: "User", field: "id" },
      { model: "User", field: "name" },
    ];
    const model = "User";
    const field = "name";

    // Act/Assert
    expect(isTargetByField(targets, model, field)).toBe(true);
  });
  test("model: string, field: string - false", () => {
    // Arrange
    const targets: FieldTargets = [
      { model: "User", field: "id" },
      { model: "User", field: "name" },
    ];
    const model = "User";
    const field = "email";

    // Act/Assert
    expect(isTargetByField(targets, model, field)).toBe(false);
  });

  test("model: string, field: undefined - true", () => {
    // Arrange
    const targets: FieldTargets = [{ model: "User" }];
    const model = "User";
    const field = "name";

    // Act/Assert
    expect(isTargetByField(targets, model, field)).toBe(true);
  });
  test("model: string, field: undefined - false", () => {
    // Arrange
    const targets: FieldTargets = [{ model: "User" }];
    const model = "Post";
    const field = "name";

    // Act/Assert
    expect(isTargetByField(targets, model, field)).toBe(false);
  });

  test("model: undefined, field: string - true", () => {
    // Arrange
    const targets: FieldTargets = [{ field: "id" }, { field: "name" }];
    const model = "User";
    const field = "id";

    // Act/Assert
    expect(isTargetByField(targets, model, field)).toBe(true);
  });
  test("model: undefined, field: string - false", () => {
    // Arrange
    const targets: FieldTargets = [{ field: "id" }, { field: "name" }];
    const model = "User";
    const field = "email";

    // Act/Assert
    expect(isTargetByField(targets, model, field)).toBe(false);
  });

  test("model: RegExp, field: string[] - true", () => {
    // Arrange
    const targets: FieldTargets = [{ model: /^U/, field: ["id", "name"] }];
    const model = "User";
    const field = "name";

    // Act/Assert
    expect(isTargetByField(targets, model, field)).toBe(true);
  });
  test("model: RegExp, field: string[] - false", () => {
    // Arrange
    const targets: FieldTargets = [{ model: /^U/, field: ["id", "name"] }];
    const model = "TestUser";
    const field = "name";

    // Act/Assert
    expect(isTargetByField(targets, model, field)).toBe(false);
  });

  test("model: string[], field: RegExp - true", () => {
    // Arrange
    const targets: FieldTargets = [{ model: ["Post", "User"], field: /i/ }];
    const model = "User";
    const field = "id";

    // Act/Assert
    expect(isTargetByField(targets, model, field)).toBe(true);
  });
  test("model: string[], field: RegExp - false", () => {
    // Arrange
    const targets: FieldTargets = [{ model: ["Post", "User"], field: /i/ }];
    const model = "User";
    const field = "name";

    // Act/Assert
    expect(isTargetByField(targets, model, field)).toBe(false);
  });

  test("undefined - true", () => {
    // Arrange
    const targets: FieldTargets = undefined;
    const model = "User";
    const field = "id";

    // Act/Assert
    expect(isTargetByField(targets, model, field)).toBe(true);
  });
});
