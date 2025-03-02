import { Block } from "../block";
import { changeBlockName } from "../transform/block-transform";
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

  export const apply = (configs: Config[], block: Block): void => {
    if (block.type !== "model") {
      return;
    }

    changeBlockName(block, (beforeName: string) => {
      const config = selectConfigByName(configs, beforeName);
      if (config === undefined) {
        return undefined;
      }

      let afterName = beforeName;
      if (config.case !== undefined) {
        afterName = changeCase(afterName, config.case);
      }
      if (config.form !== undefined) {
        afterName = changeForm(afterName, config.form);
      }
      return afterName;
    });
  };
}
