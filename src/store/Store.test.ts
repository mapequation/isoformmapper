import { COLOR_SCHEMES, DiagramStore } from "@mapequation/alluvial-diagram";
import { describe, expect, it, vi } from "vitest";
import InputStore from "./InputStore";
import { Store } from "./Store";

// InputStore loads the example table on construction; serve an empty one.
vi.hoisted(() => {
  vi.stubGlobal(
    "fetch",
    async () => new Response("GeneID\tIsoform1\tIsoform2\n")
  );
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("Store", () => {
  it("extends DiagramStore with the isoform defaults", () => {
    const store = new Store();

    expect(store).toBeInstanceOf(DiagramStore);
    expect(store.identifier).toBe("name");
    expect(store.selectedSchemeName).toBe("C3 Turbo");
    expect(store.selectedScheme).toBe(COLOR_SCHEMES["C3 Turbo"]);
    expect(store.highlightColors).toEqual([...COLOR_SCHEMES["C3 Turbo"]]);
    expect(store.showModuleId).toBe(true);
  });

  it("starts empty with an input store bound to it", () => {
    const store = new Store();

    expect(store.networks).toEqual([]);
    expect(store.numNetworks).toBe(0);
    expect(store.input).toBeInstanceOf(InputStore);
    expect(store.input.rootStore).toBe(store);
    expect(store.input.haveAlluvial).toBe(false);
    expect(() => store.updateLayout()).not.toThrow();
  });
});
