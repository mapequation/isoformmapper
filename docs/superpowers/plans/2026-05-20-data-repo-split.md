# Data Repo Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract `public/data/Alphafold_PDBs/` (276 MB) into a dedicated GitHub repo `mapequation/isoformmapper-data`, and add a fetch script that downloads the data on-demand — both locally and in GitHub Actions CI.

**Architecture:** A `prebuild` npm lifecycle hook (`scripts/fetch-data.mjs`) checks whether `public/data/Alphafold_PDBs/` already exists; if not, it downloads and extracts the data repo tarball from GitHub. Because npm automatically runs `prebuild` before `npm run build`, the GitHub Actions workflow needs no changes. `example_data.tsv` (65 KB, used as the app default) moves from gitignored-but-present to properly tracked in the code repo.

**Tech Stack:** Node.js built-ins (`fs`, `child_process`), `curl`, `tar` (available on all target platforms: macOS, Linux CI)

---

## Current State

| File/Dir | Size | In git | Notes |
|---|---|---|---|
| `public/data/Alphafold_PDBs/` | 276 MB | No (gitignored) | To move to data repo |
| `public/data/example_data.tsv` | 65 KB | No (gitignored) | Should be tracked in code repo |
| `public/data/*.stree`, `*.tree`, `*.json` | Small | Yes (force-added before gitignore rule) | Stay in code repo |

The current `.gitignore` has `public/data` (broad); this plan narrows it to `public/data/Alphafold_PDBs` so `example_data.tsv` can be tracked.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `scripts/fetch-data.mjs` | Download + extract data tarball if absent |
| Modify | `package.json` | Add `prebuild` and `fetch-data` npm scripts |
| Modify | `.gitignore` | Replace `public/data` with `public/data/Alphafold_PDBs` |
| Track | `public/data/example_data.tsv` | Default example dataset served by the app |

The GitHub Actions workflow (`deploy.yml`) needs **no changes** — `prebuild` fires automatically before `npm run build`.

---

## Task 1: Create the `mapequation/isoformmapper-data` GitHub repo

> Automated via `gh` CLI. Requires `gh` authenticated with `repo` scope and access to the `mapequation` org.

**Files:** none in this repo

- [ ] **Step 1: Check the repo does not already exist**

  ```bash
  gh repo view mapequation/isoformmapper-data 2>&1
  ```

  Expected: error message `repository not found` (confirming it doesn't exist yet). If it already exists, skip to Step 5.

- [ ] **Step 2: Create the repository**

  ```bash
  gh repo create mapequation/isoformmapper-data \
    --public \
    --description "Data files for IsoformMapper — Alphafold PDB structures"
  ```

  Expected: `✓ Created repository mapequation/isoformmapper-data on GitHub`

- [ ] **Step 3: Initialize a local git repo and copy the data**

  ```bash
  cd /tmp
  rm -rf isoformmapper-data
  git init isoformmapper-data
  cd isoformmapper-data
  git remote add origin git@github.com:mapequation/isoformmapper-data.git
  cp -r /Users/daniel/dev/projects/icelab/code/web/isoformmapper/public/data/Alphafold_PDBs .
  ```

- [ ] **Step 4: Write README, commit, and push**

  Create `/tmp/isoformmapper-data/README.md`:
  ```markdown
  # IsoformMapper Data

  Alphafold PDB structure files used by [IsoformMapper](https://github.com/mapequation/isoformmapper).

  Fetched automatically by `npm run fetch-data` (or `npm run build`) in the main repo.
  ```

  ```bash
  cd /tmp/isoformmapper-data
  git add .
  git commit -m "feat: add Alphafold PDB structures"
  git branch -M main
  git push -u origin main
  ```

  Expected: push succeeds (~276 MB uploaded). This will take a few minutes.

- [ ] **Step 5: Verify the tarball URL works**

  ```bash
  curl -fsSLI "https://codeload.github.com/mapequation/isoformmapper-data/tar.gz/refs/heads/main"
  ```

  Expected: HTTP 200 with `Content-Type: application/x-gzip`

---

## Task 2: Update `.gitignore` and track `example_data.tsv`

**Files:**
- Modify: `.gitignore`
- Track: `public/data/example_data.tsv`

- [ ] **Step 1: Narrow the gitignore rule**

  In `.gitignore`, replace:
  ```
  public/data
  ```
  with:
  ```
  public/data/Alphafold_PDBs
  ```

- [ ] **Step 2: Verify `example_data.tsv` is no longer ignored**

  ```bash
  git check-ignore -v public/data/example_data.tsv
  ```

  Expected: no output (file is not ignored)

- [ ] **Step 3: Stage `example_data.tsv`**

  ```bash
  git add public/data/example_data.tsv
  git status
  ```

  Expected: `public/data/example_data.tsv` shown as new file to be committed.

- [ ] **Step 4: Verify `Alphafold_PDBs` is still ignored**

  ```bash
  git check-ignore -v public/data/Alphafold_PDBs
  ```

  Expected: output shows the rule `public/data/Alphafold_PDBs` applies.

- [ ] **Step 5: Commit**

  ```bash
  git add .gitignore
  git commit -m "chore: track example_data.tsv, narrow Alphafold gitignore rule"
  ```

---

## Task 3: Create `scripts/fetch-data.mjs`

**Files:**
- Create: `scripts/fetch-data.mjs`

- [ ] **Step 1: Create the scripts directory**

  ```bash
  mkdir -p scripts
  ```

- [ ] **Step 2: Write the fetch script**

  Create `scripts/fetch-data.mjs`:

  ```js
  import { existsSync, mkdirSync } from "fs";
  import { execSync } from "child_process";

  const DATA_REPO = "mapequation/isoformmapper-data";
  const DATA_DIR = "public/data/Alphafold_PDBs";
  const BRANCH = "main";

  if (existsSync(DATA_DIR)) {
    console.log("Data already present, skipping fetch.");
    process.exit(0);
  }

  console.log(`Fetching data from github.com/${DATA_REPO}...`);
  mkdirSync("public/data", { recursive: true });

  const tarUrl = `https://codeload.github.com/${DATA_REPO}/tar.gz/refs/heads/${BRANCH}`;

  try {
    execSync(`curl -fsSL "${tarUrl}" | tar -xz --strip-components=1 -C public/data`, {
      stdio: "inherit",
    });
    console.log("Done.");
  } catch (err) {
    console.error("Failed to fetch data:", err.message);
    process.exit(1);
  }
  ```

  The `--strip-components=1` flag strips the top-level directory name that GitHub adds to tarballs (e.g. `isoformmapper-data-main/`), placing `Alphafold_PDBs/` directly under `public/data/`.

- [ ] **Step 3: Verify the script runs without error on a clean state**

  First, rename the existing folder to simulate a clean environment:
  ```bash
  mv public/data/Alphafold_PDBs public/data/Alphafold_PDBs.bak
  ```

  Run the script:
  ```bash
  node scripts/fetch-data.mjs
  ```

  Expected output:
  ```
  Fetching data from github.com/mapequation/isoformmapper-data...
  Done.
  ```

  Verify data arrived:
  ```bash
  ls public/data/Alphafold_PDBs | wc -l
  ```
  Expected: `120` (same number of directories as before)

- [ ] **Step 4: Verify idempotency (already-present case)**

  Run the script again:
  ```bash
  node scripts/fetch-data.mjs
  ```

  Expected output:
  ```
  Data already present, skipping fetch.
  ```

  Expected exit code: 0

- [ ] **Step 5: Remove the backup**

  ```bash
  rm -rf public/data/Alphafold_PDBs.bak
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add scripts/fetch-data.mjs
  git commit -m "feat: add fetch-data script to download Alphafold PDBs from data repo"
  ```

---

## Task 4: Wire the script into npm scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add `prebuild` and `fetch-data` scripts**

  In `package.json`, update the `scripts` block:

  ```json
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "prebuild": "node scripts/fetch-data.mjs",
    "fetch-data": "node scripts/fetch-data.mjs",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "release": "standard-version"
  },
  ```

  `prebuild` runs automatically before `npm run build`. `fetch-data` lets developers fetch data explicitly without triggering the full build.

- [ ] **Step 2: Verify `prebuild` fires during build**

  Remove the data to force a fetch:
  ```bash
  rm -rf public/data/Alphafold_PDBs
  npm run build
  ```

  Expected: script output appears before the TypeScript/Vite build output:
  ```
  Fetching data from github.com/mapequation/isoformmapper-data...
  Done.
  ```
  Then the normal build completes.

- [ ] **Step 3: Commit**

  ```bash
  git add package.json
  git commit -m "feat: add prebuild hook to auto-fetch Alphafold data before build"
  ```

---

## Task 5: Verify GitHub Actions builds correctly

**Files:** no changes — `deploy.yml` is unchanged

- [ ] **Step 1: Push the branch and observe the CI run**

  ```bash
  git push origin dev
  ```

  Open https://github.com/mapequation/isoformmapper/actions and watch the **Deploy to GitHub Pages** run (or trigger it manually with `workflow_dispatch`).

- [ ] **Step 2: Confirm the fetch step appears in the build log**

  In the `Run npm run build` step, the log should start with:
  ```
  Fetching data from github.com/mapequation/isoformmapper-data...
  Done.
  ```
  followed by the normal TypeScript + Vite output.

- [ ] **Step 3: Confirm the deployed site loads Alphafold data**

  Open the deployed GitHub Pages URL and load a gene with Alphafold PDB data. Verify it renders correctly.

---

## Self-Review

**Spec coverage:**
- ✅ Move data to `mapequation/isoformmapper-data` — Task 1
- ✅ Init/fetch script — Task 3
- ✅ Works locally — Tasks 3 + 4 (manual test + prebuild)
- ✅ Works in GitHub Actions — Task 4 (`prebuild`) + Task 5 (verification)
- ✅ Skip if data already present — Task 3 Step 4

**Edge cases handled:**
- Script is idempotent (no re-download if data exists)
- `public/data` directory created if missing (`mkdirSync` with `recursive: true`)
- Non-zero exit on curl/tar failure so CI fails loudly

**Not covered (intentional):**
- Version pinning: the script always fetches `main`. If the data repo evolves incompatibly, pin to a tag by changing `BRANCH` in `fetch-data.mjs`. Not needed now.
- Windows native support: `curl` and `tar` are available on Windows 10+ (Git for Windows includes both). WSL also works.
