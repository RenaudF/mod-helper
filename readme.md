# mod-helper

This library offers an I/O interface for the EDU descritor file, along with a fully typed `UnitDescriptor` model.
With this you can easily balance your mod by editing all values from `feral_export_descr_unit.txt` at a brushstroke.
So far it works for `feral_export_descr_unit.txt` but it could be extended to support more files.

## Important

If you're on Windows, you might want to update the paths in `lib/handy-paths.ts` to match the equivalent locations on your file system.

## Required

[npm](npmjs.com)

### Recommended

Basic working knowledge of javascript.

## Usage

This comes with 3 basic scripts:

```bash
npm start       # runs the main script, it comes with a few examples (see `scripts/main.ts`)
npm run backup  # backs up the current version (location configurable in `lib/handy-paths.ts`)
npm run reset   # restores a previously backed up version to be the current version.
```

The `scripts/main.ts` file by default loads and apply a couple of example patches, which can conveniently be found under `scripts/patches`. Those can be used for inspiration for whatever you want to do. The model we use for the unit descriptor entries is the `UnitDescriptor` and can be found under `lib/unit-descriptor/model.ts`. This file contains the interface describing the model data structure along with a yet incomplete list of possible values for some fields. Noteable edge cases are:

- `is_female` is a boolean flag, its key never has a value in the raw file
- `officer` and `ethnicity` can have multiple entries in the raw file
