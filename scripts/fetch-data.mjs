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
