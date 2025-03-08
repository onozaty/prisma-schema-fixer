import { Config } from "./config";
import { joinBlocks, parseBlocks } from "./parser";
import { EnumMapRule } from "./rules/enum-map-rule";
import { EnumNameRule } from "./rules/enuml-name-rule";
import { FieldMapRule } from "./rules/field-map-rule";
import { FieldNameRule } from "./rules/field-name-rule";
import { ModelMapRule } from "./rules/model-map-rule";
import { ModelNameRule } from "./rules/model-name-rule";
import { formatSchema } from "./schema";

export const fix = async (content: string, config: Config): Promise<string> => {
  const blocks = parseBlocks(await formatSchema(content));

  if (config.rules["model-name"] !== undefined) {
    const configs = config.rules["model-name"];
    ModelNameRule.apply(configs, blocks);
  }
  if (config.rules["model-map"] !== undefined) {
    const configs = config.rules["model-map"];
    ModelMapRule.apply(configs, blocks);
  }
  if (config.rules["field-name"] !== undefined) {
    const configs = config.rules["field-name"];
    FieldNameRule.apply(configs, blocks);
  }
  if (config.rules["field-map"] !== undefined) {
    const configs = config.rules["field-map"];
    FieldMapRule.apply(configs, blocks);
  }
  if (config.rules["enum-name"] !== undefined) {
    const configs = config.rules["enum-name"];
    EnumNameRule.apply(configs, blocks);
  }
  if (config.rules["enum-map"] !== undefined) {
    const configs = config.rules["enum-map"];
    EnumMapRule.apply(configs, blocks);
  }

  const fixedContent = joinBlocks(blocks);
  return formatSchema(fixedContent);
};
