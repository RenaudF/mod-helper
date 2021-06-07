import { EDUBaseData, EDUAggregatedData, EDUSanitisedData } from "lib/unit-descriptor/model";
import { checkUnitDescriptor, toString, UnitDescriptor } from "lib/unit-descriptor";
import { convertNumbers, Entry, is2DArray, isDefined, isEmpty, trim } from "lib/utils";

// Public API - hopefully these are self-explanatory enough

/** The parser currently handles parsing errors internally and displays
 * diagnostic data on the `console.error` output when an error occurs.
 * @todo stop using try / catch for passing diagnostic data */
export const parse = (data: string) => dataParser(data).map(modelFactory).filter(isDefined);

/**
 * The serialiser will simply attempt to serialise and concatenate the input `models`.
 * No validation is attempted on writeout so you will not be guaranteed a valid output
 * if you modify the values outside of the type system, in a debugger session for example.
 * @todo windows line endings
 * @todo validation */
export const serialise = (models: UnitDescriptor[]) => models.map(toString).join("\n\n");

// Private API

/** Data sanitisation:
 * - fix line endings
 * - strip comments
 * - merge empty lines
 * - splits `data` into individual `string` blocks */
const dataParser = (data: string) =>
  data
    .replace(/\r/g, "") // cure windows cancer
    .split("\n")
    .map((line) => line.replace(/;.*/, "").trim()) // strip comments
    .join("\n")
    .replace(/\n\n+/g, "\n\n") // merge empty lines
    .trim()
    .split("\n\n");

/** Converts a raw block `line` into an `Entry<EDUBaseData>`. The key is separated
 * by whitespaces, further values are separated by commas. Example:
 * ```
 * "stat_health      1, 0"     // input
 * ["stat_health", ["1", "0"]] // output
 * ```
 * @returns an `Entry<EDUBaseData>` if no error is encountered
 * @throws an object with invalid input line
 * @todo stop using try / catch for passing diagnostic data */
const lineParser = (line: string): Entry<EDUBaseData> => {
  const [key, entry] = line
    .replace(/\s+/g, " ") // merge consecutive whitespaces
    .replace(" ", "ツ") // only replace first occurence to isolate the key
    .split("ツ");
  const values = entry?.split(",").map(trim) || [];
  if (!key) throw { message: "Invalid entry", line };
  return [key, values];
};

/** Reduces multiple entries with the same key into a single entry with concatenated values (see `ethnicity`) */
const keyReducer = (
  accumulator: Record<string, EDUAggregatedData>,
  [key, values]: Entry<EDUBaseData>
) => {
  const entry = accumulator[key];
  if (!entry) accumulator[key] = values;
  else if (isEmpty(entry))
    if (isEmpty(values)) throw { message: "Duplicate flag", key, entry };
    else throw { message: "Mixed flag and data", key, entry };
  else if (is2DArray(entry)) entry.push(values);
  else accumulator[key] = [entry, values];
  return accumulator;
};

/** Data sanitisation:
 * - converts strings to numbers (where applicable)
 * - converts values for boolean flags (see `is_female`) */
const entryMapper = ([key, entry]: Entry<EDUAggregatedData>): Entry<EDUSanitisedData> => {
  if (isEmpty(entry)) return [key, true];
  if (is2DArray(entry)) {
    if (entry.every(isEmpty)) throw { message: "Duplicate flag", key, entry };
    if (entry.some(isEmpty)) throw { message: "Mixed flag and data", key, entry };
    return [key, entry.map((entry) => entry.map(convertNumbers))];
  } else return [key, entry.map(convertNumbers)];
};

/** Splits block into entries, aggregates multiple keys, sanitises and reduces into a single record. */
const blockParser = (block: string): Record<string, EDUSanitisedData> => {
  const lines = block.split("\n");
  const entries = Object.entries(lines.map(lineParser).reduce(keyReducer, {}));
  return Object.fromEntries(entries.map(entryMapper));
};

/** Attempts to parse a single `block` string into a full `UnitDescriptor` model.
 * Will display any parsing error on the console.
 * @param block a contiguous set of lines, delimited by empty lines
 * @return `UnitDescriptor` or `undefined` if an error occured
 * @todo stop using try / catch for passing diagnostic data */
const modelFactory = (block: string): UnitDescriptor | undefined => {
  try {
    const record = blockParser(block);
    if (checkUnitDescriptor(record)) return record;
    else throw { message: "Unexpected error" }; // `checkUnitDescriptor` should throw instead
  } catch (err) {
    console.error({ ...err, block });
  }
};
