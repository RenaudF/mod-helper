import { UnitDescriptor } from "lib/unit-descriptor";

export const patch = (models: UnitDescriptor[]) =>
  models
    .filter(({ type: [_type] }) => _type.includes("female"))
    .forEach((model) => (model.is_female = true));
