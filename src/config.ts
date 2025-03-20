import { EnumMapRule } from "./rules/enum-map-rule";
import { EnumNameRule } from "./rules/enuml-name-rule";
import { FieldAttributeRule } from "./rules/field-attribute-rule";
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
    "field-attribute"?: FieldAttributeRule.Config[];
    "enum-name"?: EnumNameRule.Config[];
    "enum-map"?: EnumMapRule.Config[];
  };
};

export const defineConfig = (config: Config): Config => {
  return config;
};
