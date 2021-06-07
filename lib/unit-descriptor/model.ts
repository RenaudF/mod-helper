import { is2DArray, Multi } from "lib/utils";

/** Namespace to document union types of known possible values for their eponymous keys.
 * This namespace doubles up as an interface to model all possible known entries from the EDU.
 * @todo finish list of attributes (see commented out input samples)
 * @todo finish documenting union types of known possible values (see the exported namespace) */
export namespace UnitDescriptor {
  export type Category = "infantry" | "handler" | "cavalry" | "siege" | "ship" | "non_combatant";
  export type Class = "light" | "missile" | "spearmen" | "heavy";
  export type VoiceType =
    | "Light_1"
    | "Medium_1"
    | "Heavy_1"
    | "Female_1"
    | "Light_1 carthaginian"
    | "Heavy_1 carthaginian"
    | "Medium_1 carthaginian"
    | "Light_1 greek"
    | "Medium_1 greek"
    | "Heavy_1 roman"
    | "Medium_1 barbarian"
    | "Heavy_1 barbarian"
    | "Light_1 barbarian"
    | "Light_1 eastern"
    | "Heavy_1 eastern"
    | "Medium_1 eastern"
    | "Heavy_1 greek";
  export type Attributes =
    | "sea_faring"
    | "hide_improved_forest"
    | "hide_long_grass"
    | "hardy"
    | "hide_anywhere"
    | "very_hardy"
    | "warcry"
    | "druid"
    | "hide_forest"
    | "frighten_foot"
    | "screeching_women"
    | "cantabrian_circle"
    | "general_unit"
    | "general_unit_upgrade"
    | "can_sap"
    | "can_run_amok"
    | "frighten_mounted"
    | "command"
    | "mercenary_unit"
    | "no_custom";
}
// prettier-ignore
export interface UnitDescriptor extends Record<string, EDUSanitisedData> {
  /** [ID used in `descr_strat`, `descr_mercenaries` and `export_descr_buildings`] */
  type:             [string];
  /** [ID used in `export_units` and `export_descr_unit_enums`, in-game display name] */
  dictionary:       [string, string];
  category:         [UnitDescriptor.Category];
  class:            [UnitDescriptor.Class];
  voice_type:       [UnitDescriptor.VoiceType, string?];
  voice_indexes?:   [string];
  /** [ID from `descr_models_battle`, unit size, extras (dogs, chariots, etc), mass (1.0 standard - infantry only)] */
  soldier:          [string, number, number, number];
  mount:            [string];
  mount_effect:     [string, string, string?];
  engine?:          [string];
  attributes:       UnitDescriptor.Attributes[];
  formation:        [number, number, number, number, number, string, string?];
  stat_health:      [number, number];
  stat_pri:         [number, number, string, number, number, string, string, string, string, number, number];
  stat_pri_attr:    [string, ...string[]];
  stat_sec:         UnitDescriptor['stat_pri'];
  stat_sec_attr:    UnitDescriptor['stat_pri_attr'];
  stat_pri_armour:  [number, number, number, string];
  stat_sec_armour:  [number, number, string];
  stat_heat:        [number];
  stat_ground:      [number, number, number, number];
  stat_mental:      [number, string, string];
  stat_charge_dist: [number];
  stat_fire_delay:  [number];
  stat_food:        [number, number];
  stat_cost:        [number, number, number, number, number, number];
  ownership:        [string, ...string[]];
  ethnicity?:       Multi<([string, string?] |
                    [string, string, string?] |
                    [string, string, string, string?] |
                    [string, string, string, string, string?])>;
  tattoo_color?:    [string];
  unique_tattoo?:   [number];
  exclude_tattoo?:  [string];
  is_female?:       true;
}

/** The (hopefully) exhaustive list of keys from `UnitDescriptor`, in the order they appear in the file.
 * Used for serialisation so if a key is present in the file but missing here, it won't be serialised. */
const sortedKeys = [
  "type",
  "dictionary",
  "category",
  "class",
  "voice_type",
  "voice_indexes",
  "soldier",
  "mount",
  "mount_effect",
  "engine",
  "attributes",
  "formation",
  "stat_health",
  "stat_pri",
  "stat_pri_attr",
  "stat_sec",
  "stat_sec_attr",
  "stat_pri_armour",
  "stat_sec_armour",
  "stat_heat",
  "stat_ground",
  "stat_mental",
  "stat_charge_dist",
  "stat_fire_delay",
  "stat_food",
  "stat_cost",
  "ownership",
  "ethnicity",
  "tattoo_color",
  "unique_tattoo",
  "exclude_tattoo",
  "is_female",
];

/** The simplest model, whatever is left from a raw line once the key is removed, split by commas, trimmed. */
export type EDUBaseData = string[];
/** The `EDUAggregatedData` is an intermediary model to accomodate for multiple entries with the same key.
 * When collision happens on a key, the values for each entries are boxed into an outer array. */
export type EDUAggregatedData = string[] | string[][];
/** Compared to the previous `EDUAggregatedData` model, sanitisation will coerce numbers and booleans. */
export type EDUSanitisedData =
  | undefined
  | true
  | (string | number | undefined)[]
  | (string | number | undefined)[][];

/** For all your serialisation needs. */
// prettier-ignore
export const toString = (model: UnitDescriptor) =>
  sortedKeys.reduce((output, key) => {
    const values = model[key];
    if (values instanceof Array) {
      if (is2DArray<string | number | undefined>(values)) {
        const mapped = values.map((values) => `${key.padEnd(17)}${values.join(", ")}`);
        return `${output}${mapped.join("\n")}\n`; // key with multiple records (see `ethnicity`)
      } else return `${output}${key.padEnd(17)}${values.join(", ")}\n`; // generic case
    } else if (values) return `${output}${key}\n`; // boolean flag - only add the key
    else return output; // value is undefined - key not present
  }, "");
