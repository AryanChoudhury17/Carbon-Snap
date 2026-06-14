import { EMISSION_FACTORS, ECO_ACTIONS } from "./actions.js";

/**
 * Calculate annual carbon footprint (tons CO2e/year)
 *
 * @param {Object} inputs - User input values
 * @param {Array<string>} activePledges - Array of adopted pledge IDs
 * @returns {Object}
 */
export function calculateFootprint(inputs, activePledges = []) {
  const inp = inputs;

  // -------------------------
  // 1. Home Energy
  // -------------------------

  const rawElectricityCarbon =
    (inp.electricity * 12) *
    EMISSION_FACTORS.electricity /
    1000;

  const energyElectricity =
    rawElectricityCarbon *
    (1 - inp.greenElectricity / 100);

  const heatingFactor =
    EMISSION_FACTORS.heating[inp.heatingType] ||
    0.18;

  const energyHeating =
    (inp.heatingAmount * 12) *
    heatingFactor /
    1000;

  const totalEnergy =
    energyElectricity +
    energyHeating;

  // -------------------------
  // 2. Transportation
  // -------------------------

  const carFactor =
    EMISSION_FACTORS.vehicle[inp.carType] ||
    0.17;

  const transportCar =
    (inp.carDist * carFactor) /
    1000;

  const transportBus =
    (inp.busHours * 52) *
    EMISSION_FACTORS.transit.bus /
    1000;

  const transportTrain =
    (inp.trainHours * 52) *
    EMISSION_FACTORS.transit.train /
    1000;

  const transportFlights =
    (inp.flightShort *
      EMISSION_FACTORS.flights.short /
      1000) +
    (inp.flightLong *
      EMISSION_FACTORS.flights.long /
      1000);

  const totalTransport =
    transportCar +
    transportBus +
    transportTrain +
    transportFlights;

  // -------------------------
  // 3. Food
  // -------------------------

  const dietBase =
    EMISSION_FACTORS.diet[inp.dietType] ||
    1.7;

  const localFoodReduction =
    dietBase *
    (0.1 * inp.localFood / 100);

  const wastePenalty =
    Math.max(
      0,
      (inp.foodWaste - 12) * 0.015
    );

  const totalFood =
    (dietBase - localFoodReduction) +
    wastePenalty;

  // -------------------------
  // 4. Waste & Shopping
  // -------------------------

  const baseGarbage =
    (inp.wasteBags *
      EMISSION_FACTORS.wastePerBag) /
    1000;

  const averageRecycling =
    (
      inp.recyclePaper +
      inp.recyclePlastic +
      inp.recycleGlass
    ) / 3;

  const recyclingSavings =
    baseGarbage *
    (0.6 * averageRecycling / 100);

  const wasteGarbage =
    baseGarbage -
    recyclingSavings;

  const shoppingCarbon =
    EMISSION_FACTORS.shopping[
      inp.shoppingStyle
    ] || 1.2;

  const totalWaste =
    wasteGarbage +
    shoppingCarbon;

  // -------------------------
  // Gross Total
  // -------------------------

  const grossTotal =
    totalEnergy +
    totalTransport +
    totalFood +
    totalWaste;

  // -------------------------
  // Pledge Reductions
  // -------------------------

  let totalSavingsKg = 0;

  activePledges.forEach((pledgeId) => {
    const action = ECO_ACTIONS.find(
      (a) => a.id === pledgeId
    );

    if (action) {
      totalSavingsKg += action.saving;
    }
  });

  const pledgeReductions =
    totalSavingsKg / 1000;

  // Never allow footprint below 0.1 tons
  const netTotal =
    Math.max(
      0.1,
      grossTotal - pledgeReductions
    );

  return {
    energy: totalEnergy,
    transport: totalTransport,
    food: totalFood,
    waste: totalWaste,
    gross: grossTotal,
    reductions: pledgeReductions,
    net: netTotal,
  };
}