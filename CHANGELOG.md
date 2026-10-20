# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.15.0 (2026-10-20)

First standalone release. IsoformMapper no longer carries a copy of the alluvial diagram generator; it renders diagrams with the `@mapequation/alluvial-diagram` package. Earlier versions are in [mapequation/isoformmapper-legacy](https://github.com/mapequation/isoformmapper-legacy).

### Features

- Introduction with a summary of the method and how to cite IsoformMapper.

### Bug Fixes

- Recognise FASTA files that start with blank or comment lines ([#1](https://github.com/mapequation/isoformmapper/issues/1))
- Show the app version however the dev server is started
- Update loading state inside MobX actions, which removes the strict-mode warnings
