import fs from "fs";
import { descriptors, parse, serialise } from "lib";
import { defenceBoostPatch, femaleFixPatch, moralBoostPatch, unitCostPatch } from "./patches";

try {
  const data = fs.readFileSync(descriptors.unit.backup, "utf8");
  const models = parse(data);
  // ----------------------------------//
  //       Do what you want below      //
  // --------------------------------- //
  femaleFixPatch(models);
  moralBoostPatch(models);
  defenceBoostPatch(models);
  unitCostPatch(models);
  // --------------------------------- //
  const serialised = serialise(models);
  fs.writeFileSync(descriptors.unit.active, serialised);
} catch (err) {
  console.error(err);
}
