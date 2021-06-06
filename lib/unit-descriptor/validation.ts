import { UnitDescriptor } from "./model";

// Public API

/**
 * Will run through all known assumptions in the `checklist`.
 * @returns `true` or ducks incoming errors
 * @throws an object with error details for missing data or failed assumption
 * @todo stop using try / catch for passing diagnostic data
 */
export const checkUnitDescriptor = (
  input: Record<string, readonly (string | number | true)[]> | UnitDescriptor
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
  { key: "voice_type", required: ["string"] },
  { key: "voice_indexes", required: [], optional: ["string"] },
  { key: "soldier", required: ["string", "number", "number", "number"] },
  { key: "attributes", required: [], rest: "string" },
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
  { key: "is_female", required: [], optional: ["boolean"] },
];

/** Used to verify known assumptions about a key against a given set of values.
 * `required`, `optional` and `rest` work in a similar way as function arguments. */
type CheckItem = {
  /** The key used to look up the values to check within the `UnitDescriptor` model. */
  key: keyof UnitDescriptor;
  /** `rest` data items follow `optional` data items and if present, should all match the given type.
   * The presence of `rest` data items implies that all `optional` data items are present. */
  rest?: "string" | "number";
} & (
  | {
      /** `required` data items must be in sufficient number and match the given types in the given order. */
      required: ("string" | "number")[];
      /** `optional` data items must validate the given `optional` types, but not all given types need to be met. */
      optional?: ("string" | "number")[];
    }
  | {
      /** No `required` data items are needed for boolean flags, as absence of value is treated as a `false`. */
      required: [];
      /** `boolean` are only used for flags and therefore can only be unique and cannot mix with other types. */
      optional?: ["boolean"];
    }
);

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
  (input: Record<string, readonly (string | number | true)[]> | UnitDescriptor) =>
  ({ key, required, optional = [], rest }: CheckItem) => {
    const values = input[key] || [];

    const requiredValues = values.slice(0, required.length);
    if (requiredValues.length < required.length)
      throw { message: "Missing required value", key, values, required };
    requiredValues.forEach(checkAgainst(required));

    const optionalValues = values.slice(required.length, required.length + optional.length);
    optionalValues.forEach(checkAgainst(optional));

    const restValues = values.slice(required.length + optional.length);
    if (rest) restValues.forEach(checkAgainst(rest));
  };
