import { UnitDescriptor } from "lib/unit-descriptor";

/** Boosts moral linearly for all units (`f(x) = ceil(x * 1.1) + 2`) */
export const patch = (models: UnitDescriptor[]) =>
  // prettier-ignore
  models.forEach((model) => {
    const { stat_mental: [moral] } = model;
    model.stat_mental[0] = Math.ceil(moral * 1.1) + 2;
  });
