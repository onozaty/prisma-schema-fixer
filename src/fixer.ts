import { Config } from "./config";
import { joinBlocks, parseBlocks } from "./parser";
import { FieldNameRule } from "./rules/field-name-rule";
import { ModelMapRule } from "./rules/model-map-rule";
import { ModelNameRule } from "./rules/model-name-rule";
import { formatSchema } from "./schema";

export const fix = async (content: string, config: Config): Promise<string> => {
  const blocks = parseBlocks(await formatSchema(content));

  if (config.rules["model-name"] !== undefined) {
    const configs = config.rules["model-name"];
    blocks.forEach((block) => ModelNameRule.apply(configs, block));
  }
  if (config.rules["model-map"] !== undefined) {
    const configs = config.rules["model-map"];
    blocks.forEach((block) => ModelMapRule.apply(configs, block));
  }
  if (config.rules["field-name"] !== undefined) {
    const configs = config.rules["field-name"];
    blocks.forEach((block) => FieldNameRule.apply(configs, block));
  }

  const fixedContent = joinBlocks(blocks);
  return formatSchema(fixedContent);
};
