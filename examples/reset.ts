import fs from "fs";
import { descriptors, parse, serialise } from "lib";

try {
  const data = fs.readFileSync(descriptors.unit.backup, "utf8");
  const models = parse(data);
  const serialised = serialise(models);
  fs.writeFileSync(descriptors.unit.active, serialised);
} catch (err) {
  console.error(err);
}
