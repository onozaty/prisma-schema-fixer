import { Case, changeCase, changeForm, Form } from "./string-transform";

describe("changeCase", () => {
  test("pascal", () => {
    // Arrange
    const str = "hello_world";
    const to: Case = "pascal";

    // Act/Assert
    expect(changeCase(str, to)).toBe("HelloWorld");
  });

  test("camel", () => {
    // Arrange
    const str = "hello_world";
    const to: Case = "camel";

    // Act/Assert
    expect(changeCase(str, to)).toBe("helloWorld");
  });

  test("snake", () => {
    // Arrange
    const str = "HelloWorld";
    const to: Case = "snake";

    // Act/Assert
    expect(changeCase(str, to)).toBe("hello_world");
  });
});

describe("changeForm", () => {
  test("singular", () => {
    // Arrange
    const str = "users";
    const to: Form = "singular";

    // Act/Assert
    expect(changeForm(str, to)).toBe("user");
  });

  test("plural", () => {
    // Arrange
    const str = "user";
    const to: Form = "plural";

    // Act/Assert
    expect(changeForm(str, to)).toBe("users");
  });
});
