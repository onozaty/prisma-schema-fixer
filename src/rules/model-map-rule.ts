import { Block } from "../block";
import { changeBlockMap } from "../transform/block-transform";
import {
  Case,
  changeCase,
  changeForm,
  Form,
} from "../transform/string-transform";
import { NameTargets, selectConfigByName } from "./rule";

export namespace ModelMapRule {
  export type Config = {
    targets?: NameTargets;
    case?: Case;
    form?: Form;
  };

  export const apply = (configs: Config[], block: Block): void => {
    if (block.type !== "model") {
      return;
    }

    changeBlockMap(block, (blockName: string) => {
      const config = selectConfigByName(configs, blockName);
      if (config === undefined) {
        return undefined;
      }

      let map = blockName;
      if (config.case !== undefined) {
        map = changeCase(map, config.case);
      }
      if (config.form !== undefined) {
        map = changeForm(map, config.form);
      }
      return map;
    });
  };
}
