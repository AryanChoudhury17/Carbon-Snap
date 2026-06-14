<div align="center">

# 🌿 Carbon Snap

### Interactive Carbon Footprint Tracker & Action Hub

*Understand. Track. Reduce. Act.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

> **Carbon Snap** is a beautifully designed, fully client-side web application that empowers individuals to estimate, visualize, and actively reduce their annual carbon footprint — with zero server dependencies and a zero-friction user experience.

<br/>

---

</div>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🖥️ Live Preview](#️-live-preview)
- [🏗️ Project Architecture](#️-project-architecture)
- [⚙️ How It Works](#️-how-it-works)
- [📐 Emission Calculation Model](#-emission-calculation-model)
- [🚀 Getting Started](#-getting-started)
- [🧪 Testing](#-testing)
- [☁️ Deployment](#️-deployment)
- [🛠️ Tech Stack](#️-tech-stack)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 📊 Dynamic Dashboard

A real-time overview of your entire carbon profile at a glance.

| Component | Description |
|---|---|
| **Gross Emissions Card** | Your raw annual CO2e output before any reductions |
| **Pledged Savings Card** | Live deduction from active eco-pledges |
| **Net Carbon Footprint** | Your final, adjusted annual footprint in metric tons |
| **Footprint Gauge Dial** | Animated half-circle needle spanning 0–20+ tons |
| **Benchmark Axis** | Visual positioning vs. Paris Agreement (2.0t), Global Avg (4.7t), US Avg (16.0t) |
| **Doughnut Chart** | Chart.js breakdown across Energy, Transport, Diet, and Waste |
| **Eco Achievements** | 6 dynamic badges that unlock based on real footprint data |
| **Active Pledges List** | Checklist of adopted pledges with live kg/yr deductions |

---

### 🎛️ Tracker / Calculator

A detailed, slider-driven input form across **4 lifestyle categories**:

<details>
<summary><strong>🏠 Home Energy</strong></summary>

- Monthly electricity consumption (kWh)
- Renewable energy percentage (solar, wind, hydro)
- Heating fuel type (Natural Gas / Oil / Electric / Biomass)
- Monthly heating usage (kWh equivalent)

</details>

<details>
<summary><strong>🚗 Transportation</strong></summary>

- Personal vehicle fuel type (Petrol / Diesel / Hybrid / EV)
- Annual driving distance (km)
- Weekly bus transit hours
- Weekly train / metro hours
- Annual short-haul flight hours (< 3 hrs)
- Annual long-haul flight hours (> 3 hrs)

</details>

<details>
<summary><strong>🥗 Diet & Food</strong></summary>

- Diet type (Heavy Meat → Vegan)
- Locally sourced food ratio (%)
- Estimated food waste (%)

</details>

<details>
<summary><strong>🗑️ Waste & Consumption</strong></summary>

- Weekly landfill garbage bags
- Paper/Cardboard recycling rate (%)
- Plastic & Can recycling rate (%)
- Glass bottle recycling rate (%)
- Consumer purchasing habits (Minimalist / Moderate / Frequent Shopper)

</details>

> 💡 **Quick Profiles** — One-click presets for *Eco-Conscious*, *Average Citizen*, and *High Carbon* lifestyles to instantly populate all fields.

---

### 🤝 Action Hub (Personal Eco-Pledges)

Browse a curated catalog of carbon-reduction habits across **4 categories**:
`Transport` · `Energy` · `Diet` · `Waste`

- Click **Adopt Pledge** to instantly deduct the estimated CO2e savings from your dashboard net score
- Reveal **Pro-Tips** for each pledge to learn actionable steps
- All pledges persist across sessions via `localStorage`

---

### 🏅 Gamified Achievements

Six dynamic badges unlock automatically based on your real footprint data and behavior:

| Badge | Unlock Condition |
|---|---|
| 🌱 **Climate Pioneer** | Net footprint ≤ 3.0 tons CO2e/yr |
| 🚲 **Transit Hero** | Drive < 3,000 km/yr or own an EV |
| 🥦 **Green Gourmet** | Follow a vegetarian or vegan diet |
| 🏆 **Pledge Leader** | Adopt 5 or more active eco-pledges |
| ♻️ **Zero-Waste Champion** | 80%+ avg recycling + ≤ 1 garbage bag/week |
| 🌍 **Footprint Hero** | Net footprint ≤ 1.5 tons CO2e/yr (ultra-low) |

---

### 💾 Persistent Local Cache

All your inputs, active pledges, and profile settings are automatically saved to **`localStorage`** — your data survives browser refreshes and tab closures without any account or server needed.

---

### 📚 Learn Section

A built-in education module that explains:
- What a carbon footprint is and why tracking matters
- The science behind individual vs. systemic climate change
- Full emission factor transparency (EPA, DEFRA, IPCC sources)
- A "Parameter Awareness Guide" with cards for each lifestyle category

---

## 🏗️ Project Architecture

```
carbon-snap/
│
├── index.html              # Main application interface
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Locked dependency versions
├── vercel.json             # Vercel deployment configuration
├── .gitignore              # Git ignore rules
│
├── css/
│   └── styles.css          # Styling and responsive design
│
├── js/
│   ├── app.js              # UI logic, state management, DOM updates
│   ├── calculator.js       # Carbon footprint calculation engine
│   └── actions.js          # Emission factors, presets, and eco actions
│
└── tests/
    └── calculator.test.js  # Automated unit tests using Vitest
```

> Built as a **pure vanilla SPA** — no build tools, no bundlers, no npm dependencies required at runtime. ESM (`type="module"`) imports keep the code modular and clean.

---

## ⚙️ How It Works

```
User adjusts sliders/selects
          │
          ▼
  state.inputs updated
          │
          ▼
  calculateFootprint()          ← Applies EPA/DEFRA/IPCC emission factors
          │
          ├─► totalEnergy    (electricity × grid mix + heating type × usage)
          ├─► totalTransport (car km × fuel factor + transit hrs + flight hrs)
          ├─► totalFood      (diet base − local reduction + waste penalty)
          └─► totalWaste     (garbage bags − recycling savings + shopping style)
                    │
                    ▼
             grossTotal = Σ all categories
                    │
                    ▼
    pledgeReductions = Σ active pledge savings (kg → tons)
                    │
                    ▼
          netTotal = max(0.1, gross − reductions)
                    │
                    ▼
        updateDashboard() → gauge + chart + badges + comparisons
                    │
                    ▼
        saveStateToLocalStorage()
```

---

## 📐 Emission Calculation Model

All factors are derived from internationally recognized climate body guidelines:
**U.S. EPA** · **UK DEFRA** · **IPCC AR6**

### ⚡ Home Energy

| Source | Emission Factor |
|:---|:---|
| Electricity (grid) | 0.38 kg CO2e / kWh (scaled by green % setting) |
| Natural Gas heating | 0.18 kg CO2e / kWh equivalent |
| Heating Oil / LPG | 0.26 kg CO2e / kWh equivalent |
| Electric (Heat Pump) | 0.38 kg CO2e / kWh equivalent |
| Biomass / Wood | 0.03 kg CO2e / kWh equivalent |

### 🚗 Transportation

| Mode | Emission Factor |
|:---|:---|
| Petrol / Gasoline car | 0.17 kg CO2e / km |
| Diesel car | 0.18 kg CO2e / km |
| Hybrid (PHEV/HEV) | 0.10 kg CO2e / km |
| Electric Vehicle | 0.04 kg CO2e / km (grid-dependent) |
| Bus (public transit) | 1.6 kg CO2e / passenger-hour |
| Train / Rail | 1.8 kg CO2e / passenger-hour |
| Short-haul flights (< 3 hrs) | 150 kg CO2e / flight-hour |
| Long-haul flights (> 3 hrs) | 110 kg CO2e / flight-hour |

### 🥗 Diet & Food

| Diet Type | Annual Base Footprint |
|:---|:---|
| Heavy Meat Eater | 2.5 t CO2e / yr |
| Moderate Meat Eater | 1.7 t CO2e / yr |
| Flexitarian / Low Meat | 1.3 t CO2e / yr |
| Vegetarian | 1.0 t CO2e / yr |
| Vegan | 0.7 t CO2e / yr |

> Local sourcing reduces the diet base by up to **10%**. Food waste above 12% adds a proportional penalty.

### 🗑️ Waste & Consumption

| Source | Emission Factor |
|:---|:---|
| Landfill garbage | 52 kg CO2e / bag/week / year |
| Recycling (paper, plastic, glass) | Reduces garbage carbon by up to **60%** |
| Minimalist shopper | 0.3 t CO2e / yr |
| Average consumer | 1.2 t CO2e / yr |
| Frequent shopper | 3.5 t CO2e / yr |

### 🌍 Global Benchmarks Used

| Target / Average | Tons CO2e / Year |
|:---|:---:|
| 🟢 Paris Agreement Target (1.5°C pathway) | **2.0 t** |
| 🔵 Global Average | **4.7 t** |
| 🔴 US Average | **16.0 t** |

---

## 🚀 Getting Started

Carbon Snap requires **no npm install**, no build step, and no backend. Just serve the files over HTTP.

### Option 1 — Python HTTP Server (Recommended for Local Dev)

```bash
# Clone the repository
git clone https://github.com/your-username/carbon-snap.git
cd carbon-snap

# Serve locally (Python 3)
python -m http.server 8000

# Then open in your browser:
# http://localhost:8000
```

### Option 2 — VS Code Live Server

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
2. Open the project folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. The app auto-opens at `http://127.0.0.1:5500`

> ⚠️ **Important:** Do **not** open `index.html` directly via `file://` — ES Modules (`import`/`export`) require an HTTP server due to CORS restrictions.

---

## 🧪 Testing

CarbonSnap includes automated unit tests powered by **Vitest** to verify the correctness of the carbon footprint calculation engine.

### Run the tests

```bash
npm test
```

### Test Coverage

The current test suite validates:

- Carbon footprint calculation for different presets
- Comparison between Eco and High emission profiles
- Carbon reduction after applying eco pledges
- Multiple pledge combinations
- Minimum footprint threshold enforcement
- Correct structure of calculation results
```
## ☁️ Deployment

### 🚀 Vercel (Recommended — Zero Config)

Carbon Snap ships with a [`vercel.json`](vercel.json) pre-configured with:
- ✅ **Clean URLs** (no `.html` extensions)
- ✅ **Immutable asset caching** for CSS/JS (1-year `Cache-Control`)

#### Option A — GitHub Integration (Recommended)

1. Push this project to a **GitHub repository**
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Vercel auto-detects the static site — click **Deploy**
5. Every push to `main` triggers an automatic redeployment ✨

#### Option B — Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### 🌐 Other Static Hosts

Carbon Snap works on **any static file host** with no configuration needed:

| Host | Notes |
|---|---|
| **Netlify** | Drop the folder into netlify.com/drop |
| **GitHub Pages** | Enable Pages in repo Settings → root `/` |
| **Cloudflare Pages** | Connect repo, no build command required |
| **Firebase Hosting** | `firebase deploy` after `firebase init` |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic SPA structure, accessible markup |
| **CSS3** (Vanilla) | Custom design system, CSS variables, animations, glassmorphism |
| **JavaScript ES2022** | App logic, DOM manipulation, state management (ESM modules) |
| **[Chart.js v4](https://www.chartjs.org/)** | Responsive doughnut chart for emissions breakdown |
| **[Google Fonts](https://fonts.google.com/)** | Inter (body) + Outfit (headings) typography |
| **[Font Awesome 6](https://fontawesome.com/)** | Icon system throughout the UI |
| **localStorage API** | Client-side persistence (no backend needed) |
| **Vercel** | Static hosting with edge caching |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a **Pull Request** — describe your changes clearly

### 💡 Ideas for Contributions

- [ ] Add a **carbon offset calculator** (tree planting, renewable energy credits)
- [ ] Add **PDF/image export** of your personalized footprint report
- [ ] Expand the **ECO_ACTIONS** catalog with more community pledges
- [ ] Add **localization** for different grid emission factors by country
- [ ] Integrate a **historical tracking chart** (weekly/monthly progress)
- [ ] Add **dark/light mode toggle**

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

See [`LICENSE`](LICENSE) for full details.

---

<div align="center">

**Built with 💚 for a greener planet**

*Every ton of CO2e saved matters. Start tracking yours today.*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

</div>
