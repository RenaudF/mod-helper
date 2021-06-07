import fs from "fs";
import { descriptors, parse, serialise } from "lib";

try {
  const data = fs.readFileSync(descriptors.unit.active, "utf8");
  const models = parse(data);
  // prettier-ignore
  // give everyone a defence boost
  models.forEach((model) => {
    const { stat_pri_armour: [armour, defence] } = model;
    model.stat_pri_armour[0] = armour + 2;
    model.stat_pri_armour[1] = defence + 5;
  });
  const serialised = serialise(models);
  fs.writeFileSync(descriptors.unit.active, serialised);
} catch (err) {
  console.error(err);
}
