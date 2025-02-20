import { camelCase, pascalCase, snakeCase } from "change-case";
import { plural, singular } from "pluralize";

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
      return singular(str);
    case "plural":
      return plural(str);
  }
};
