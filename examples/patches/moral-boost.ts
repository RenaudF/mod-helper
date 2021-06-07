import { UnitDescriptor } from "lib/unit-descriptor";

export const patch = (models: UnitDescriptor[]) =>
  // prettier-ignore
  models.forEach((model) => {
    const { stat_mental: [moral] } = model;
    model.stat_mental[0] = moral + 4 + Math.ceil(moral/4);
  });
