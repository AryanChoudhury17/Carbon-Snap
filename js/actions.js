// Carbon Footprint Emission Factors and Eco Actions Catalog

export const EMISSION_FACTORS = {
  // Electricity: kg CO2e per kWh
  electricity: 0.38, 
  
  // Heating: kg CO2e per kWh equivalent
  heating: {
    gas: 0.18,
    oil: 0.26,
    electric: 0.38,
    biomass: 0.03
  },
  
  // Vehicles: kg CO2e per km
  vehicle: {
    petrol: 0.17,
    diesel: 0.18,
    hybrid: 0.10,
    electric: 0.04
  },
  
  // Public Transit: kg CO2e per passenger-hour (estimated average speed and occupancy)
  transit: {
    bus: 1.6, // ~20 km/h * 0.08 kg/km
    train: 1.8 // ~45 km/h * 0.04 kg/km
  },
  
  // Flights: kg CO2e per hour of travel
  flights: {
    short: 150, // Short haul average (higher take-off weight impact per hour)
    long: 110   // Long haul average cruising efficiency
  },
  
  // Diet base footprints: tons CO2e per year
  diet: {
    heavyMeat: 2.5,
    mediumMeat: 1.7,
    lowMeat: 1.3,
    vegetarian: 1.0,
    vegan: 0.7
  },
  
  // Waste base footprints: kg CO2e per bag of garbage per week (annually)
  wastePerBag: 52, // 1 kg CO2e per bag per week * 52 weeks
  
  // Shopping emissions base: tons CO2e per year
  shopping: {
    minimal: 0.3,
    average: 1.2,
    high: 3.5
  }
};

// Quick presets to populate inputs instantly
export const PRESETS = {
  eco: {
    electricity: 150,
    greenElectricity: 100,
    heatingType: 'electric',
    heatingAmount: 200,
    carType: 'electric',
    carDist: 3000,
    busHours: 5,
    trainHours: 10,
    flightShort: 0,
    flightLong: 0,
    dietType: 'vegan',
    localFood: 80,
    foodWaste: 5,
    wasteBags: 1,
    recyclePaper: 90,
    recyclePlastic: 90,
    recycleGlass: 90,
    shoppingStyle: 'minimal'
  },
  average: {
    electricity: 350,
    greenElectricity: 20,
    heatingType: 'gas',
    heatingAmount: 600,
    carType: 'hybrid',
    carDist: 11000,
    busHours: 2,
    trainHours: 1,
    flightShort: 4,
    flightLong: 8,
    dietType: 'mediumMeat',
    localFood: 30,
    foodWaste: 15,
    wasteBags: 3,
    recyclePaper: 50,
    recyclePlastic: 40,
    recycleGlass: 50,
    shoppingStyle: 'average'
  },
  high: {
    electricity: 900,
    greenElectricity: 0,
    heatingType: 'oil',
    heatingAmount: 1200,
    carType: 'petrol',
    carDist: 25000,
    busHours: 0,
    trainHours: 0,
    flightShort: 15,
    flightLong: 30,
    dietType: 'heavyMeat',
    localFood: 10,
    foodWaste: 35,
    wasteBags: 6,
    recyclePaper: 10,
    recyclePlastic: 5,
    recycleGlass: 10,
    shoppingStyle: 'high'
  }
};

// Recommended actions for footprint reduction
export const ECO_ACTIONS = [
  {
    id: 'green_energy',
    title: 'Switch to Renewable Energy',
    category: 'energy',
    impact: 'High',
    saving: 950, // kg CO2e saved annually
    description: 'Switch your home electricity provider to a 100% green renewable power plan.',
    tip: 'Many standard utility companies offer a "Green Power Add-On" where you pay a minor premium to support solar and wind generators.'
  },
  {
    id: 'ev_transition',
    title: 'Switch to an Electric Vehicle',
    category: 'transport',
    impact: 'High',
    saving: 1600,
    description: 'Replace an old internal combustion engine (petrol/diesel) vehicle with an EV.',
    tip: 'Electric cars produce zero direct emissions. Even with grid electricity factored in, they typically reduce travel carbon by 70%+.'
  },
  {
    id: 'diet_veg',
    title: 'Adopt a Vegetarian Diet',
    category: 'diet',
    impact: 'High',
    saving: 700,
    description: 'Eliminate meat products and focus on plant-based alternatives, dairy, and eggs.',
    tip: 'Livestock farming produces heavy methane emissions. Shifting away from red meat is one of the single most impactful individual decisions.'
  },
  {
    id: 'fly_half',
    title: 'Cut Air Travel in Half',
    category: 'transport',
    impact: 'High',
    saving: 800,
    description: 'Reduce the total amount of flights you take per year by 50% or replace with trains.',
    tip: 'Take local holidays (staycations) or use fast rail networks for regional distances rather than short-haul passenger jets.'
  },
  {
    id: 'led_retrofit',
    title: 'Install 100% LED Bulbs',
    category: 'energy',
    impact: 'Medium',
    saving: 180,
    description: 'Replace remaining incandescent or halogen bulbs with modern energy-efficient LEDs.',
    tip: 'LEDs consume up to 85% less energy and last 25 times longer than traditional lightbulbs.'
  },
  {
    id: 'thermostat_adjust',
    title: 'Adjust Heating/Cooling by 2°C',
    category: 'energy',
    impact: 'Medium',
    saving: 220,
    description: 'Set your heating thermostat 2°C cooler in winter and cooling 2°C warmer in summer.',
    tip: 'Layer up with sweaters in winter and use window blinds strategically in summer to reduce heater/AC electricity load.'
  },
  {
    id: 'bike_commute',
    title: 'Bike or Walk Short Trips',
    category: 'transport',
    impact: 'Medium',
    saving: 350,
    description: 'Commit to cycling or walking for all grocery, gym, or social trips under 3 kilometers.',
    tip: 'Over 50% of urban car trips are under 5km. Commuting by bicycle keeps you fit and saves petrol and cold-start engine wear.'
  },
  {
    id: 'meatless_monday',
    title: 'Participate in Meatless Mondays',
    category: 'diet',
    impact: 'Medium',
    saving: 250,
    description: 'Commit to going fully plant-based or vegetarian just one day every week.',
    tip: 'A small weekly habit serves as an easy onboarding step toward lower carbon eating and saves money on your grocery bills.'
  },
  {
    id: 'zero_food_waste',
    title: 'Reduce Food Waste to Zero',
    category: 'diet',
    impact: 'Medium',
    saving: 210,
    description: 'Plan weekly meals, store foods correctly, and freeze leftovers to stop food spoilage.',
    tip: 'When food decomposes in landfills, it creates methane, a greenhouse gas 25x more potent than CO2. Use shopping lists to buy only what you need.'
  },
  {
    id: 'composting',
    title: 'Compost Organic Scraps',
    category: 'waste',
    impact: 'Medium',
    saving: 130,
    description: 'Divert peelings, coffee grounds, and food leftovers from garbage bins into a compost pile.',
    tip: 'Composting digests waste aerobically, which dramatically reduces methane formation compared to standard landfill decomposition.'
  },
  {
    id: 'secondhand_clothing',
    title: 'Buy Clothes Secondhand First',
    category: 'waste',
    impact: 'Medium',
    saving: 190,
    description: 'Seek vintage, thrifted, or rented clothing before buying newly manufactured garments.',
    tip: 'The fashion industry is responsible for 10% of global carbon emissions. Buying pre-owned cuts manufacturing carbon to zero.'
  },
  {
    id: 'cold_wash_dry',
    title: 'Cold Laundry & Line Drying',
    category: 'energy',
    impact: 'Medium',
    saving: 200,
    description: 'Wash clothes at 30°C or below and skip the tumble dryer by line-drying outdoors or on racks.',
    tip: 'Heating water accounts for 90% of a washing machine\'s electricity usage. Air drying keeps clothes in better shape and saves power.'
  },
  {
    id: 'plastic_ban',
    title: 'Adopt Reusable Shopping Bags',
    category: 'waste',
    impact: 'Low',
    saving: 50,
    description: 'Eliminate single-use grocery bags, bottles, and utensils, using sturdy reusables instead.',
    tip: 'Manufacturing plastic bags requires crude oil refining. Standard tote bags pay back their carbon cost in just 10-15 uses.'
  },
  {
    id: 'max_recycling',
    title: 'Maximize Household Recycling',
    category: 'waste',
    impact: 'Low',
    saving: 90,
    description: 'Rigorously sort paper, aluminum cans, cardboard, and clean glass jars into recycling streams.',
    tip: 'Recycling aluminum saves 95% of the energy needed to refine raw bauxite ore; recycling paper saves trees that continue absorbing CO2.'
  }
];
