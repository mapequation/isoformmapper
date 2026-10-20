# IsoformMapper

Compare splice variants by their protein structure.

**Web app:** <https://www.mapequation.org/isoformmapper>

Alternative splicing can give one gene several protein isoforms with different
structures and functions. IsoformMapper compares two isoforms at the structural
level. It turns each predicted 3D structure, for example from AlphaFold, into a
network of residues in physical contact, finds the structural communities in
each network with [Infomap](https://www.mapequation.org/infomap), and shows in
an alluvial diagram how those communities differ between the isoforms.

The app works in four steps:

1. **Load data:** drop the `.pdb` structure files of two isoforms, or pick an
   example.
2. **Align sequences:** align the isoform sequences so that residues can be
   matched across isoforms.
3. **Generate and partition networks:** link residues that are within a
   distance threshold of each other and partition each network with Infomap.
4. **Compare structures:** explore the community differences in an alluvial
   diagram, and download it as SVG.

Everything runs in the browser; no data is uploaded.

## How to cite

If you use IsoformMapper in your research, please cite:

> Vergara A, Hernández-Verdeja T, Ojeda-May P, Ramirez L, Edler D, Rosvall M,
> Strand Å. IsoformMapper: a web application for protein-level comparison of
> splice variants through structural community analysis. _RNA_ 32(1):1–20
> (2026). [doi:10.1261/rna.080738.125](https://doi.org/10.1261/rna.080738.125)

```bibtex
@article{vergara2026isoformmapper,
  title = {{IsoformMapper}: a web application for protein-level comparison of splice variants through structural community analysis},
  author = {Vergara, Alexander and Hern{\'a}ndez-Verdeja, Tamara and Ojeda-May, Pedro and Ramirez, Leonor and Edler, Daniel and Rosvall, Martin and Strand, {\AA}sa},
  journal = {RNA},
  volume = {32},
  number = {1},
  pages = {1--20},
  year = {2026},
  doi = {10.1261/rna.080738.125}
}
```

## Development

Requires Node.js 24.

```sh
npm install
npm run fetch-data   # download the example AlphaFold structures
npm run dev
```

`fetch-data` downloads the example structures from
[mapequation/isoformmapper-data](https://github.com/mapequation/isoformmapper-data)
into `public/data`. `npm run build` runs it automatically.

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start the dev server                         |
| `npm run build`      | Type-check and build into `build/`           |
| `npm run preview`    | Serve the production build                   |
| `npm test`           | Run the unit tests (Vitest)                  |
| `npx playwright test` | Run the end-to-end smoke test (Playwright)  |
| `npm run release`    | Bump the version and update the changelog    |

Pushes to `master` are deployed to GitHub Pages by
`.github/workflows/pages.yml`.

The alluvial diagram is rendered by
[@mapequation/alluvial-diagram](https://github.com/mapequation/alluvial), and
the networks are partitioned with
[@mapequation/infomap](https://www.npmjs.com/package/@mapequation/infomap).
