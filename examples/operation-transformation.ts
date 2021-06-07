import fs from "fs";
import { descriptors, identity, parse, serialise } from "lib";

try {
  const data = fs.readFileSync(descriptors.unit.backup, "utf8");
  const models = parse(data);
  const updated = models.map(identity);
  const serialised = serialise(updated);
  fs.writeFileSync(descriptors.unit.active, serialised);
} catch (err) {
  console.error(err);
}
