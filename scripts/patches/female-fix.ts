import { UnitDescriptor } from "lib/unit-descriptor";

/** Add a missing `is_female` flag from a bunch of female peasant units */
export const patch = (models: UnitDescriptor[]) =>
  models
    .filter(({ type: [_type] }) => _type.includes("female"))
    .forEach((model) => (model.is_female = true));
