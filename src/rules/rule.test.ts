import { isTarget, Targets } from "./rule";

describe("isTarget", () => {
  test("should return true if name is in the array of targets", () => {
    // Arrange
    const targets: Targets = ["User", "Post"];
    const name = "User";

    // Act/Assert
    expect(isTarget(targets, name)).toBe(true);
  });

  test("should return false if name is not in the array of targets", () => {
    // Arrange
    const targets: Targets = ["User", "Post"];
    const name = "Comment";

    // Act/Assert
    expect(isTarget(targets, name)).toBe(false);
  });

  test("should return true if name matches the regular expression", () => {
    // Arrange
    const targets: Targets = /^User.+/;
    const name = "UserProfile";

    // Act/Assert
    expect(isTarget(targets, name)).toBe(true);
  });

  test("should return false if name does not match the regular expression", () => {
    // Arrange
    const targets: Targets = /^User.+/;
    const name = "CustomeUser";

    // Act/Assert
    expect(isTarget(targets, name)).toBe(false);
  });

  test("should return true if targets is undefined", () => {
    // Arrange
    const targets: Targets = undefined;
    const name = "AnyName";

    // Act/Assert
    expect(isTarget(targets, name)).toBe(true);
  });
});
