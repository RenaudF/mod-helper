import { is2DArray, isEmpty } from "lib/utils";
import { EDUSanitisedData, UnitDescriptor } from "./model";

// Public API

/**
 * Will run through all known assumptions in the `checklist`.
 * @returns `true` or ducks incoming errors
 * @throws an object with error details for missing data or failed assumption
 * @todo stop using try / catch for passing diagnostic data
 */
export const checkUnitDescriptor = (
  input: Record<string, EDUSanitisedData> | UnitDescriptor
): input is UnitDescriptor => {
  checklist.forEach(checkEntry(input));
  return true;
};

// Private API

/** A list of assumptions about the EDU file format and the resulting `UnitDescriptor` model.
 * There should be a `CheckItem` in the list for each key within the `UnitDescriptor` model.
 * That checklist is used to validate input when attempting to parse an EDU file. */
const checklist: CheckItem[] = [
  { key: "type", required: ["string"] },
  { key: "dictionary", required: ["string"] },
  { key: "category", required: ["string"] },
  { key: "class", required: ["string"] },
  { key: "voice_type", required: ["string"], optional: ["string"] },
  { key: "voice_indexes", isOptional: true, required: ["string"] },
  { key: "soldier", required: ["string", "number", "number", "number"] },
  { key: "mount", isOptional: true, required: ["string"] },
  { key: "mount_effect", isOptional: true, required: ["string", "string"], optional: ["string"] },
  { key: "engine", isOptional: true, required: ["string"] },
  { key: "attributes", required: ["string"], rest: "string" },
  {
    key: "formation",
    required: ["number", "number", "number", "number", "number", "string"],
    optional: ["string"],
  },
  { key: "stat_health", required: ["number", "number"] },
  // prettier-ignore
  {
      key: 'stat_pri',
      required: ['number', 'number', 'string', 'number', 'number', 'string', 'string', 'string', 'string', 'number', 'number'],
    },
  { key: "stat_pri_attr", required: ["string"], rest: "string" },
  // prettier-ignore
  {
      key: 'stat_sec',
      required: ['number', 'number', 'string', 'number', 'number', 'string', 'string', 'string', 'string', 'number', 'number'],
  },
  { key: "stat_sec_attr", required: ["string"], rest: "string" },
  { key: "stat_pri_armour", required: ["number", "number", "number", "string"] },
  { key: "stat_sec_armour", required: ["number", "number", "string"] },
  { key: "stat_heat", required: ["number"] },
  { key: "stat_ground", required: ["number", "number", "number", "number"] },
  { key: "stat_mental", required: ["number", "string", "string"] },
  { key: "stat_charge_dist", required: ["number"] },
  { key: "stat_fire_delay", required: ["number"] },
  { key: "stat_food", required: ["number", "number"] },
  { key: "stat_cost", required: ["number", "number", "number", "number", "number", "number"] },
  { key: "ownership", required: ["string"], rest: "string" },
  {
    key: "ethnicity",
    isOptional: true,
    required: ["string"],
    optional: ["string", "string", "string", "string"],
  },
  { key: "is_female", isFlag: true },
];

type BaseCheckItem = {
  /** The key used to look up the values to check within the `UnitDescriptor` model. */
  key: keyof UnitDescriptor;
};
/** Only used to check flags (see `is_female`) */
type BooleanCheck = BaseCheckItem & {
  /** Only used to check flags (see `is_female`) */
  isFlag: true;
};
/** `required`, `optional` and `rest` work in a similar way as function arguments. */
type ArrayCheck = BaseCheckItem & {
  /** Whether or not a key must have a value */
  isOptional?: true;
  /** `required` data items must be in sufficient number and match the given types in the given order. */
  required?: ("string" | "number")[];
  /** `optional` data items must validate the given `optional` types, but not all given types need to be met. */
  optional?: ("string" | "number")[];
  /** `rest` data items follow `optional` data items and if present, should all match the given type.
   * The presence of `rest` data items implies that all `optional` data items are present. */
  rest?: "string" | "number";
};
/** Used to verify known assumptions about a key against a given set of values. */
type CheckItem = BooleanCheck | ArrayCheck;

/** Type guard use to differentiate between checks */
const isBooleanCheck = (checkItem: CheckItem): checkItem is BooleanCheck => {
  return (<Object>checkItem).hasOwnProperty("isFlag");
};

/** Overloaded curry for validating a subset of `CheckItem` assumptions. Yummy.
 * @throws an object with expected type and actual value
 * @todo stop using try / catch for passing diagnostic data */
// prettier-ignore
const checkAgainst =
  (types: string | string[]) =>
  (value: string | number | boolean | undefined, index: number) => {
    const type = types instanceof Array ? types[index] : types;
    const ok = value !== "" && typeof value === type;
    if (!ok) throw { message: 'Invalid input', value, expected: type };
  };

/** Curry to validate a given input against a set of assumptions.
 * @throws an object with error details for missing data or failed assumption
 * @todo stop using try / catch for passing diagnostic data */
const checkEntry =
  (input: Record<string, EDUSanitisedData> | UnitDescriptor) => (check: CheckItem) => {
    const { key } = check;

    if (isBooleanCheck(check))
      if (input[key] && input[key] !== true) throw { message: "Expected boolean flag", input, key };
      else return;

    const { isOptional, required = [], optional = [], rest } = check;

    const data = input[key];
    if (data === true) throw { message: "Expected array of values", input, key };

    const checkFn = (values: (string | number | undefined)[]) => {
      const requiredValues = values.slice(0, required.length);
      if (requiredValues.length < required.length)
        throw { message: "Missing required value", key, data, required };
      requiredValues.forEach(checkAgainst(required));

      const optionalValues = values.slice(required.length, required.length + optional.length);
      optionalValues.forEach(checkAgainst(optional));

      const restValues = values.slice(required.length + optional.length);
      if (rest) restValues.forEach(checkAgainst(rest));
    };

    if (!data)
      if (isOptional) return;
      else throw { message: "Missing required value", key, input };
    if (isEmpty(data)) throw { message: "Unexpected empty data", key, input };
    if (is2DArray(data)) data.forEach(checkFn);
    else checkFn(data);
  };
