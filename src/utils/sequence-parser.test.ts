import { describe, expect, it } from "vitest";
import { isFasta, parseFasta } from "./sequence-parser";

describe("sequence-parser", () => {
  it("detects FASTA input", () => {
    expect(isFasta([">AT1G01790_P1", "MEFA"])).toBe(true);
    expect(isFasta(["MEFA", "KLLV"])).toBe(false);
  });

  it("parses multiple records with wrapped sequence lines", () => {
    const lines = [
      ">AT1G01790_P1",
      "MEFA SKL",
      "LVAG",
      "",
      ">AT1G01790_c3",
      "MEFAKLV",
    ];

    expect(parseFasta(lines)).toEqual([
      { taxon: "AT1G01790_P1", code: "MEFASKLLVAG" },
      { taxon: "AT1G01790_c3", code: "MEFAKLV" },
    ]);
  });

  it("rejects input that is not FASTA", () => {
    expect(() => parseFasta(["MEFA"])).toThrow(/FASTA/);
  });
});
