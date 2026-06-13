# TerraStep: Interactive Carbon Tracker & Action Hub

TerraStep is a highly interactive, responsive single-page web application designed to help individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## Key Features

1. **Dynamic Dashboard Overview**:
   - **Real-Time Emission Gauge**: Visual indicator showing annual carbon emission estimates.
   - **Benchmark Comparison**: Real-time positioning relative to the Paris Agreement Target (<2.0t), Global Average (4.7t), and US Average (16.0t).
   - **Interactive Chart breakdown**: Breakdown doughnut chart of emissions across lifestyle sectors powered by Chart.js.
   - **Active Pledges checklist**: Instantly deducts adopted active pledges from your gross score.
   
2. **User-Friendly Parameter Tracker**:
   - **Quick Profile Presets**: One-click configuration buttons (*Eco-Conscious*, *Average Citizen*, *High Carbon*) to load default profiles instantly.
   - **Detailed Range Sliders**: Adjust home utility bills, vehicle travel, public transit, flights, food waste, and recycling rates.
   - **Styled Popover Tooltips**: Information icons (`i`) next to each parameter to guide estimations (e.g. explaining grid mixes, passenger train fuel, etc.).
   
3. **Action Hub**:
   - Browse cataloged environmental habit pledges across Transport, Energy, Diet, and Waste.
   - Click "Adopt Pledge" to instantly recalculate your simulated reductions on the Dashboard.
   - Review "Pro-Tips" for actionable steps on each card.
   
4. **Gamified Achievements (Eco Badges)**:
   - Dynamic badges like *Climate Pioneer*, *Transit Hero*, *Green Gourmet*, *Zero-Waste Champion* that unlock automatically based on your footprint and pledges.
   
5. **Persistent Local Cache**:
   - Save details in `localStorage` so that customized footprints and adopted pledges survive browser refreshes.

## Calculation Model & Emission Factors

The carbon engine uses standard factors (derived from guidelines by EPA, DEFRA, and IPCC):

| Category | parameter | Emission Factor |
| :--- | :--- | :--- |
| **Energy** | Electricity | 0.38 kg CO2e per kWh (clamped by green provider %) |
| **Energy** | Gas / Heating Oil / Electric / Biomass | 0.18 / 0.26 / 0.38 / 0.03 kg CO2e per kWh equivalent |
| **Transport** | Vehicles (Petrol/Diesel/Hybrid/EV) | 0.17 / 0.18 / 0.10 / 0.04 kg CO2e per km |
| **Transport** | Public Transit (Bus/Train) | 1.6 / 1.8 kg CO2e per passenger-hour |
| **Transport** | Flights (Short Haul/Long Haul) | 150 / 110 kg CO2e per flight-hour |
| **Diet** | Diet Base (Heavy/Medium/Low/Veg/Vegan) | 2.5 / 1.7 / 1.3 / 1.0 / 0.7 tons CO2e per year |
| **Diet** | Local Food & Food Waste | Adjusts diet footprint (reduces by up to 10% or adds waste penalty) |
| **Waste** | Household Landfill Garbage | 52 kg CO2e per bag/week annually (reduced by up to 60% with recycling) |
| **Waste** | Shopping habits (Min/Average/High) | 0.3 / 1.2 / 3.5 tons CO2e per year |

## Local Development & Testing

Since the application is written in pure vanilla HTML, CSS, and JS (ESM), it does not require compile-time Node.js dependencies. You can run a lightweight local web server using Python:

1. Open a terminal/command prompt in the project directory.
2. Run the Python HTTP server command:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Deploying to Vercel

### Option 1: Vercel GitHub Integration (Recommended)
1. Push this project folder to a repository on GitHub, GitLab, or Bitbucket.
2. Import the repository in your [Vercel Dashboard](https://vercel.com).
3. Vercel automatically detects the static HTML structure and configures the build settings.
4. Click **Deploy**. Any future changes pushed to your main branch will trigger automatic redeployments!

### Option 2: Deploying via Vercel CLI
If you want to deploy directly from your local terminal:
1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Log in and deploy from your project directory:
   ```bash
   vercel
   ```
3. Confirm deployment settings. Vercel will create a preview deployment.
4. To release to production:
   ```bash
   vercel --prod
   ```
