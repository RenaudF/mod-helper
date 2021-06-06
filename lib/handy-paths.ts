export const STEAM_HOME = <const>`${process.env.HOME}/.steam/debian-installation`;
// prettier-ignore
export const RTW_ROOT = <const>`${STEAM_HOME}/steamapps/common/Total War ROME REMASTERED/share/data`;
export const descriptors = <const>{
  unit: `${RTW_ROOT}/data/feral_export_descr_unit.txt`,
  unit_test: `${RTW_ROOT}/data/feral_export_descr_unit.test.txt`,
  strat: `${RTW_ROOT}/data/world/maps/campaign/imperial_campaign/descr_strat.txt`,
  mercenaries: `${RTW_ROOT}/data/world/maps/campaign/imperial_campaign/descr_mercenaries.txt`,
};
