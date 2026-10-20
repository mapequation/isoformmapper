import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";

// Collects console errors, uncaught page errors and MobX warnings such as
// "[MobX] Since strict-mode is enabled, changing (observed) observable values
// without using an action is not allowed".
const collectConsole = (page: Page) => {
  const errors: string[] = [];
  const mobxWarnings: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
    if (msg.text().includes("[MobX]")) mobxWarnings.push(msg.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return { errors, mobxWarnings };
};

const pdbFile = (isoform: string) =>
  fileURLToPath(
    new URL(
      `../public/data/Alphafold_PDBs/${isoform}/relaxed_model_1_pred_0.pdb`,
      import.meta.url
    )
  );

test("example data generates an alluvial diagram without console errors", async ({
  page,
}) => {
  const { errors, mobxWarnings } = collectConsole(page);

  await page.goto("./");

  // Clicking an example row loads both isoforms, aligns them, runs Infomap
  // and generates the alluvial diagram.
  const firstExample = page.locator("#step1 table tbody tr").first();
  // The example table loads a TSV and renders a few hundred rows, which can
  // take longer than the default 5 s on a busy or freshly restarted dev server.
  await expect(firstExample).toBeVisible({ timeout: 30_000 });
  await firstExample.click();

  const svg = page.locator("#alluvialSvg");
  await expect(svg.locator("g.module").first()).toBeAttached({
    timeout: 60_000,
  });
  expect(await svg.locator("g.module").count()).toBeGreaterThan(0);
  await expect(
    page.getByRole("button", { name: "Download SVG" })
  ).toBeVisible();

  expect(errors).toEqual([]);
  expect(mobxWarnings).toEqual([]);
});

test("dropping a pdb file on each isoform loads it without MobX warnings", async ({
  page,
}) => {
  const { errors, mobxWarnings } = collectConsole(page);

  await page.goto("./");

  const dropzones = page.locator("#step1 input[type=file]");
  await expect(dropzones).toHaveCount(2);
  await dropzones.nth(0).setInputFiles(pdbFile("AT1G06190_P1"));
  await dropzones.nth(1).setInputFiles(pdbFile("AT1G06190.2"));

  // Each loaded isoform shows its sequence with a "Clear" button.
  await expect(page.getByRole("button", { name: "Clear" })).toHaveCount(2, {
    timeout: 30_000,
  });

  expect(errors).toEqual([]);
  expect(mobxWarnings).toEqual([]);
});
