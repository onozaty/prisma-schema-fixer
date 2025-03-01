import { ModelMapRule } from "./rules/model-map-rule";
import { ModelNameRule } from "./rules/model-name-rule";

export type Config = {
  rules: {
    "model-name"?: ModelNameRule.Config[];
    "model-map"?: ModelMapRule.Config[];
  };
};

export const defineConfig = (config: Config): Config => {
  return config;
};
