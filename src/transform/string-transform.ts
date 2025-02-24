import { camelCase, pascalCase, snakeCase } from "change-case";
import pluralize from "pluralize";

export type Case = "pascal" | "camel" | "snake";
export type Form = "singular" | "plural";

export const changeCase = (str: string, to: Case): string => {
  switch (to) {
    case "pascal":
      return pascalCase(str);
    case "camel":
      return camelCase(str);
    case "snake":
      return snakeCase(str);
  }
};

export const changeForm = (str: string, to: Form): string => {
  switch (to) {
    case "singular":
      return pluralize.singular(str);
    case "plural":
      return pluralize.plural(str);
  }
};
