import fs from "fs";
import { descriptors, parse, serialise } from "lib";

try {
  const data = fs.readFileSync(descriptors.unit.active, "utf8");
  const models = parse(data);
  // prettier-ignore
  // give everyone a moral boost
  models.forEach((model) => {
    const { stat_mental: [moral] } = model;
    model.stat_mental[0] = moral + 4 + Math.ceil(moral/4);
  });
  const serialised = serialise(models);
  fs.writeFileSync(descriptors.unit.active, serialised);
} catch (err) {
  console.error(err);
}
