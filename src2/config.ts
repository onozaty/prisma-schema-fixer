import { FieldMapRule } from "./rules/field-map-rule";
import { FieldNameRule } from "./rules/field-name-rule";
import { ModelMapRule } from "./rules/model-map-rule";
import { ModelNameRule } from "./rules/model-name-rule";

export type Config = {
  rules: {
    "model-name"?: ModelNameRule.Config[];
    "model-map"?: ModelMapRule.Config[];
    "field-name"?: FieldNameRule.Config[];
    "field-map"?: FieldMapRule.Config[];
  };
};

export const defineConfig = (config: Config): Config => {
  return config;
};
