import { Block } from "../blocks/block";
import { ModelBlock } from "../blocks/model-block";
import { changeModelName } from "../transform/block-transform";
import {
  Case,
  changeCase,
  changeForm,
  Form,
} from "../transform/string-transform";
import { NameTargets, selectConfigByName } from "./rule";

export namespace ModelNameRule {
  export type Config = {
    targets?: NameTargets;
    case?: Case;
    form?: Form;
  };

  export const apply = (configs: Config[], blocks: Block[]): void => {
    for (const block of blocks) {
      if (block instanceof ModelBlock) {
        const modelName = block.getModelName();
        const config = selectConfigByName(configs, modelName);
        if (config === undefined) {
          continue;
        }

        let changedModelName = modelName;
        if (config.case !== undefined) {
          changedModelName = changeCase(changedModelName, config.case);
        }
        if (config.form !== undefined) {
          changedModelName = changeForm(changedModelName, config.form);
        }

        if (modelName !== changedModelName) {
          changeModelName(blocks, modelName, changedModelName);
        }
      }
    }
  };
}
