export type Targets = string[] | RegExp | undefined;

export const isTarget = (targets: Targets, name: string): boolean => {
  if (targets === undefined) {
    // default
    return true;
  }

  if (Array.isArray(targets)) {
    return targets.includes(name);
  }
  return targets.test(name);
};
