import { checkUnitDescriptor, toString, UnitDescriptor } from "../unit-descriptor";
import { convertNumbers, isDefined, trim } from "../utils";

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

/** A key followed by a potentially empty array of values */
type EDUEntry = readonly [string, string[]];

/** Converts a raw block `line` into an `EDUEntry`. The key is separated
 * by whitespaces, further values are separated by commas. Example:
 * ```
 * "stat_health      1, 0"     // input
 * ["stat_health", ["1", "0"]] // output
 * ```
 * @returns an `EDUEntry` if no error is encountered
 * @throws an object with invalid input line
 * @todo stop using try / catch for passing diagnostic data */
const lineParser = (line: string): EDUEntry => {
  const [key, entry] = line
    .replace(/\s+/g, " ") // merge consecutive whitespaces
    .replace(" ", "ツ") // only replace first occurence to isolate the key
    .split("ツ");
  const values = entry?.split(",").map(trim) || [];
  if (!key) throw { message: "Invalid EDUEntry", line };
  return <const>[key, values];
};

/** Reduces multiple entries with the same key into a single entry with concatenated values (see `ethnicity`) */
const keyReducer = (accumulator: Record<string, string[]>, [key, values]: EDUEntry) => {
  accumulator[key] = [...(accumulator[key] || []), ...(values || [])];
  return accumulator;
};

/** Data sanitisation:
 * - converts strings to numbers (where applicable)
 * - converts values for boolean flags (see `is_female`) */
const entryMapper = ([key, values]: EDUEntry) =>
  <const>[key, values.length ? values.map(convertNumbers) : <const>[true]];

/** Attempts to parse a single `block` string into a full `UnitDescriptor` model.
 * Will display any parsing error on the console.
 * @param block a contiguous set of lines, delimited by empty lines
 * @return `UnitDescriptor` or `undefined` if an error occured
 * @todo stop using try / catch for passing diagnostic data */
const modelFactory = (block: string): UnitDescriptor | undefined => {
  const lines = block.split("\n");
  try {
    const entries = Object.entries(lines.map(lineParser).reduce(keyReducer, {}));
    const record = Object.fromEntries(entries.map(entryMapper));
    if (checkUnitDescriptor(record)) return record;
    else throw { message: "Unexpected error" }; // `checkUnitDescriptor` should throw instead
  } catch (err) {
    console.error({ ...err, block });
  }
};
