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
export interface UnitDescriptor {
  /** [ID used in `descr_strat`, `descr_mercenaries` and `export_descr_buildings`] */
  readonly type:            [string];
  /** [ID used in `export_units` and `export_descr_unit_enums`, in-game display name] */
  readonly dictionary:      [string, string];
  readonly category:        [UnitDescriptor.Category];
  readonly class:           [UnitDescriptor.Class];
  readonly voice_type:      [UnitDescriptor.VoiceType];
  readonly voice_indexes?:  [string];
  /** [ID from `descr_models_battle`, unit size, extras (dogs, chariots, etc), mass (1.0 standard - infantry only)] */
  readonly soldier:         [string, number, number, number];
  readonly attributes:      UnitDescriptor.Attributes[];
  readonly formation:       [number, number, number, number, number, string, string | undefined];
  readonly stat_health:     [number, number];
  readonly stat_pri:        [number, number, string, number, number, string, string, string, string, number, number];
  readonly stat_pri_attr:   [string, ...string[]];
  readonly stat_sec:        UnitDescriptor['stat_pri'];
  readonly stat_sec_attr:   UnitDescriptor['stat_pri_attr'];
  readonly stat_pri_armour: [number, number, number, string];
  readonly stat_sec_armour: [number, number, string];
  readonly stat_heat:       [number];
  readonly stat_ground:     [number, number, number, number];
  readonly stat_mental:     [number, string, string];
  readonly stat_charge_dist:[number];
  // stat_fire_delay  0
  // stat_food        60, 300
  // stat_cost        1, 320, 130, 40, 50, 320
  // ownership        germans
  // ethnicity germans, Germania_Superior
  readonly is_female: [] | [true];
}
/** The (hopefully) exhaustive list of keys from `UnitDescriptor`, in the order they appear in the file.
 * Used for serialisation so if a key is present in the file but missing here, it won't be serialised. */
const sortedKeys = <const>[
  "type",
  "dictionary",
  "category",
  "class",
  "voice_type",
  "voice_indexes",
  "soldier",
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
  "is_female",
];

/** For all your serialisation needs. */
export const toString = (model: UnitDescriptor) =>
  sortedKeys.reduce((output, key) => {
    const value = model[key];
    if (value instanceof Array) {
      switch (value.length) {
        case 0: // equivalent to a `false` flag
          return output;
        case 1: // equivalent to a `true` flag
          if (value[0] === true) return `${output}${key}\n`;
        default:
          return `${output}${key.padEnd(17)}${value.join(", ")}\n`;
      }
    } else return output; // value is undefined - key not present
  }, "");
