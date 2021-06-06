import fs from "fs";
import { descriptors, parse, serialise } from "lib";

try {
  const data = fs.readFileSync(descriptors.unit, "utf8");
  const models = parse(data);
  const serialised = serialise(models);
  fs.writeFileSync(descriptors.unit_test, serialised);
} catch (err) {
  console.error(err);
}
