import { describe, test, expect } from "vitest";
import { calculateFootprint } from "../js/calculator.js";
import { PRESETS, ECO_ACTIONS } from "../js/actions.js";

describe("CarbonSnap Calculator", () => {

  test("Average preset returns a valid footprint", () => {
    const result = calculateFootprint(
      { ...PRESETS.average },
      []
    );

    expect(result).toBeDefined();
    expect(result.net).toBeGreaterThan(0);
    expect(result.gross).toBeGreaterThan(0);
  });

  test("Eco preset should produce lower emissions than High preset", () => {
    const eco = calculateFootprint(
      { ...PRESETS.eco },
      []
    );

    const high = calculateFootprint(
      { ...PRESETS.high },
      []
    );

    expect(eco.net).toBeLessThan(high.net);
  });

  test("Green Energy pledge reduces footprint", () => {
    const withoutPledge = calculateFootprint(
      { ...PRESETS.average },
      []
    );

    const withPledge = calculateFootprint(
      { ...PRESETS.average },
      ["green_energy"]
    );

    expect(withPledge.net).toBeLessThan(
      withoutPledge.net
    );
  });

  test("Multiple pledges reduce footprint even further", () => {
    const base = calculateFootprint(
      { ...PRESETS.average },
      []
    );

    const pledged = calculateFootprint(
      { ...PRESETS.average },
      [
        "green_energy",
        "bike_commute",
        "meatless_monday"
      ]
    );

    expect(pledged.net).toBeLessThan(base.net);
  });

  test("Footprint never drops below 0.1 tons", () => {
    const everyPledge = ECO_ACTIONS.map(
      action => action.id
    );

    const result = calculateFootprint(
      { ...PRESETS.eco },
      everyPledge
    );

    expect(result.net).toBeGreaterThanOrEqual(0.1);
  });

  test("Returned object contains all expected properties", () => {
    const result = calculateFootprint(
      { ...PRESETS.average },
      []
    );

    expect(result).toHaveProperty("energy");
    expect(result).toHaveProperty("transport");
    expect(result).toHaveProperty("food");
    expect(result).toHaveProperty("waste");
    expect(result).toHaveProperty("gross");
    expect(result).toHaveProperty("reductions");
    expect(result).toHaveProperty("net");
  });

});