import fs from "fs";
import { descriptors } from "lib";

try {
  const data = fs.readFileSync(descriptors.unit.active, "utf8");
  fs.writeFileSync(descriptors.unit.backup, data);
} catch (err) {
  console.error(err);
}
