import { UnitDescriptor } from "lib/unit-descriptor";

/** Balances unit costs
; stat_cost         Number of turns to build,
;                   Cost of unit to construct
;                   Cost of upkeep
;                   Cost of upgrading weapons
;                   Cost of upgrading armour
;                   Cost for custom battles */
export const patch = (models: UnitDescriptor[]) => {
  const cavalry = models.filter(({ mount }) => mount);
  // prettier-ignore
  cavalry.forEach((model) => {
    const { stat_cost: [turns, hire, upkeep, weapons, armour, custom] } = model;
    model.stat_cost[2] = upkeep * 2; // double upkeep for all cavalry (including elephants)
  });

  const elephants = cavalry.filter(({ mount }) => mount![0]!.includes("elephant"));
  // prettier-ignore
  elephants.forEach((model) => {
    const { stat_cost: [turns, hire, upkeep, weapons, armour, custom] } = model;
    model.stat_cost[2] = upkeep * 3/4; // reduce upkeep slightly for elephants, to offset the previous cavalry nerf
  });

  const light_skirmishers = [
    "carthaginian peltast",
    "numidian javelinmen",
    "east peltast",
    "egyptian peltast",
    "greek peltast",
    "roman velite",
    "merc peltast",
    "merc cilician pirate",
  ];
  const light_archers = [
    "barb archer dacian",
    "barb archer scythian",
    "barb archer slave",
    "carthaginian archer",
    "east archer",
    "egyptian archer",
    "greek archer",
    "roman archer",
  ];
  const light_slingers = [
    "barb slinger briton",
    "carthaginian slinger",
    "east slinger",
    "egyptian slingers",
  ];
  [...light_skirmishers, ...light_archers, ...light_slingers].forEach((unitType) => {
    const model = models.find(({ type: [type] }) => type === unitType);
    if (model) model.stat_cost[2] = 130; // reduce upkeep from 170 to 130
  });
};
