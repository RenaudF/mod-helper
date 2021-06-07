import { UnitDescriptor } from "lib/unit-descriptor";

/** Simply adds 2 armour and 5 defence to everyone */
export const patch = (models: UnitDescriptor[]) =>
  // prettier-ignore
  models.forEach((model) => {
    const { stat_pri_armour: [armour, defence] } = model;
    model.stat_pri_armour[0] = armour + 2;
    model.stat_pri_armour[1] = defence + 5;
  });
