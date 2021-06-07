import fs from "fs";
import { descriptors } from "lib";

try {
  const data = fs.readFileSync(descriptors.unit.backup, "utf8");
  fs.writeFileSync(descriptors.unit.active, data);
} catch (err) {
  console.error(err);
}
