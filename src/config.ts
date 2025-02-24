import { ModelNameRule } from "./rules/model-name-rule";

export type Config = {
  rules: {
    "model-name"?: ModelNameRule.Config[];
  };
};

export const defineConfig = (config: Config): Config => {
  return config;
};
