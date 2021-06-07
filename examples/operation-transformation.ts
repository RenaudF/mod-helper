import fs from "fs";
import { descriptors, parse, serialise } from "lib";

try {
  const data = fs.readFileSync(descriptors.unit.backup, "utf8");
  const models = parse(data);
  // fix missing is_female tags on some female units
  models
    .filter(({ type: [_type] }) => _type.includes("female"))
    .forEach((model) => (model.is_female = true));
  const serialised = serialise(models);
  fs.writeFileSync(descriptors.unit.active, serialised);
} catch (err) {
  console.error(err);
}
