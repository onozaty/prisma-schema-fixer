import { Block } from "../block";
import { changeBlockName } from "../transform/block-transform";
import {
  Case,
  changeCase,
  changeForm,
  Form,
} from "../transform/string-transform";
import { isTarget, Targets } from "./rule";

export namespace ModelNameRule {
  export type Config = {
    targets?: Targets;
    case?: Case;
    form?: Form;
  };

  export const apply = (configs: Config[], block: Block): void => {
    if (block.type !== "model") {
      return;
    }

    changeBlockName(block, (beforeName: string) => {
      const config = selectConfig(configs, beforeName);
      if (config === undefined) {
        return beforeName;
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

  const selectConfig = (
    configs: Config[],
    name: string,
  ): Config | undefined => {
    return configs
      .slice()
      .reverse()
      .find((config) => isTarget(config.targets, name));
  };
}
