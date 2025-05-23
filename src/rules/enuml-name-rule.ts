import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import { changeEnumName } from "../transform/block-transform";
import {
  Case,
  changeCase,
  changeForm,
  Form,
} from "../transform/string-transform";
import { NameTargets, selectConfigByName } from "./rule";

export namespace EnumNameRule {
  export type Config = {
    targets?: NameTargets;
    case?: Case;
    form?: Form;
    func?: (value: string, target: { name: string }) => string;
  };

  export const apply = (configs: Config[], blocks: Block[]): void => {
    for (const enumBlock of EnumBlock.filter(blocks)) {
      const enumName = enumBlock.getEnumName();
      const config = selectConfigByName(configs, enumName);
      if (
        config?.case === undefined &&
        config?.form === undefined &&
        config?.func === undefined
      ) {
        // if no config, skip
        continue;
      }

      let changedEnumName = enumName;
      if (config.case !== undefined) {
        changedEnumName = changeCase(changedEnumName, config.case);
      }
      if (config.form !== undefined) {
        changedEnumName = changeForm(changedEnumName, config.form);
      }
      if (config.func !== undefined) {
        changedEnumName = config.func(changedEnumName, { name: enumName });
      }

      if (enumName !== changedEnumName) {
        changeEnumName(blocks, enumName, changedEnumName);
      }
    }
  };
}
