import { EMISSION_FACTORS, PRESETS, ECO_ACTIONS } from './actions.js';

// Application State
let state = {
  inputs: { ...PRESETS.average },
  activePledges: []
};

let chartInstance = null;

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  loadStateFromLocalStorage();
  setupNavigation();
  setupPresetListeners();
  setupInputListeners();
  renderPledgeCatalog();
  updateDashboard();
  setupTooltipMobileToggles();
});

// Load state from local storage
function loadStateFromLocalStorage() {
  const savedState = localStorage.getItem('terraStepState');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      if (parsed.inputs && parsed.activePledges) {
        state = parsed;
        // Sync values to UI inputs
        syncStateToDOMInputs();
      }
    } catch (e) {
      console.error('Failed to parse saved state, using defaults', e);
    }
  } else {
    // If no cache, initialize DOM values with average preset values
    syncStateToDOMInputs();
  }
}

// Save state to local storage
function saveStateToLocalStorage() {
  localStorage.setItem('terraStepState', JSON.stringify(state));
}

// Sync inputs state into form elements
function syncStateToDOMInputs() {
  Object.keys(state.inputs).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      if (el.type === 'checkbox') {
        el.checked = state.inputs[key];
      } else {
        el.value = state.inputs[key];
      }
      
      // Trigger event to update custom range labels if any
      const label = document.getElementById(`${key}-val`);
      if (label) {
        label.textContent = formatInputValue(key, el.value);
      }
    }
  });
}

// Format range display text nicely
function formatInputValue(key, val) {
  if (key.includes('greenElectricity') || key.includes('recycle') || key.includes('localFood')) {
    return `${val}%`;
  }
  if (key === 'carDist') {
    return `${Number(val).toLocaleString()} km/yr`;
  }
  if (key.includes('Hours')) {
    return `${val} hrs/wk`;
  }
  if (key.includes('flight')) {
    return `${val} hrs/yr`;
  }
  if (key === 'electricity') {
    return `${val} kWh/mo`;
  }
  if (key === 'heatingAmount') {
    return `${val} kWh/mo`;
  }
  if (key === 'foodWaste') {
    return `${val}% waste`;
  }
  if (key === 'wasteBags') {
    return `${val} bag${val == 1 ? '' : 's'}/wk`;
  }
  return val;
}

// Handle Page Navigation Tabs
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.tab-section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');
      
      // Update navigation styling
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Show targeted tab section
      sections.forEach(sec => {
        if (sec.id === `${targetTab}-section`) {
          sec.classList.remove('hidden');
          sec.classList.add('active-section');
        } else {
          sec.classList.add('hidden');
          sec.classList.remove('active-section');
        }
      });

      // Show/Hide live estimate floating widget
      const liveWidget = document.getElementById('live-gauge-widget');
      if (liveWidget) {
        if (targetTab === 'tracker') {
          liveWidget.classList.remove('live-gauge-hidden');
        } else {
          liveWidget.classList.add('live-gauge-hidden');
        }
      }
      
      // Re-render chart on tab activation to prevent sizing bugs
      if (targetTab === 'dashboard' && chartInstance) {
        setTimeout(() => {
          chartInstance.resize();
        }, 50);
      }
    });
  });
}

// Hook up Profile Presets buttons
function setupPresetListeners() {
  const presetButtons = document.querySelectorAll('.preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetType = btn.getAttribute('data-preset');
      if (PRESETS[presetType]) {
        // Apply presets to state
        state.inputs = { ...PRESETS[presetType] };
        
        // Visual button selection effect
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Sync to DOM inputs and update calculations
        syncStateToDOMInputs();
        updateDashboard();
        saveStateToLocalStorage();
        
        // Visual indication
        showToast(`Loaded ${presetType.toUpperCase()} profile!`);
      }
    });
  });
}

// Listen to input changes in calculator
function setupInputListeners() {
  const inputs = document.querySelectorAll('.calc-input');
  inputs.forEach(input => {
    const handleInput = () => {
      const id = input.id;
      let val;
      if (input.type === 'number' || input.type === 'range') {
        val = Number(input.value);
      } else if (input.type === 'checkbox') {
        val = input.checked;
      } else {
        val = input.value;
      }
      
      // Update state
      state.inputs[id] = val;
      
      // Update label
      const label = document.getElementById(`${id}-val`);
      if (label) {
        label.textContent = formatInputValue(id, val);
      }
      
      // Clear preset button active states since settings were modified
      document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
      
      // Recalculate
      updateDashboard();
      saveStateToLocalStorage();
    };
    
    input.addEventListener('input', handleInput);
    input.addEventListener('change', handleInput);
  });
}

// Calculate carbon footprint values in metric tons CO2e per year
function calculateFootprint() {
  const inp = state.inputs;
  
  // 1. Home Energy Carbon
  const rawElectricityCarbon = (inp.electricity * 12) * EMISSION_FACTORS.electricity / 1000;
  // Reduce electricity footprint by green energy percentage
  const energyElectricity = rawElectricityCarbon * (1 - inp.greenElectricity / 100);
  
  const heatingType = inp.heatingType;
  const factor = EMISSION_FACTORS.heating[heatingType] || 0.18;
  const energyHeating = (inp.heatingAmount * 12) * factor / 1000;
  
  const totalEnergy = energyElectricity + energyHeating;
  
  // 2. Transportation Carbon
  const carFactor = EMISSION_FACTORS.vehicle[inp.carType] || 0.17;
  const transCar = inp.carDist * carFactor / 1000;
  
  const transBus = (inp.busHours * 52) * EMISSION_FACTORS.transit.bus / 1000;
  const transTrain = (inp.trainHours * 52) * EMISSION_FACTORS.transit.train / 1000;
  
  const transFlights = (inp.flightShort * EMISSION_FACTORS.flights.short / 1000) +
                       (inp.flightLong * EMISSION_FACTORS.flights.long / 1000);
                       
  const totalTransport = transCar + transBus + transTrain + transFlights;
  
  // 3. Diet & Food Carbon
  const dietBase = EMISSION_FACTORS.diet[inp.dietType] || 1.7;
  // Reduce base footprint slightly by local food score (up to 10% reduction)
  const localFoodReduction = dietBase * (0.10 * inp.localFood / 100);
  // Food waste penalty (average standard is around 15% waste. Add penalty for high waste)
  const wastePenalty = Math.max(0, (inp.foodWaste - 12) * 0.015);
  
  const totalFood = (dietBase - localFoodReduction) + wastePenalty;
  
  // 4. Waste & Shopping Carbon
  const baseGarbage = inp.wasteBags * EMISSION_FACTORS.wastePerBag / 1000;
  // Average recycling reduces garbage carbon by up to 60%
  const averageRecyclingPercent = (inp.recyclePaper + inp.recyclePlastic + inp.recycleGlass) / 3;
  const recyclingSavings = baseGarbage * (0.60 * averageRecyclingPercent / 100);
  const wasteGarbage = baseGarbage - recyclingSavings;
  
  const shoppingCarbon = EMISSION_FACTORS.shopping[inp.shoppingStyle] || 1.2;
  
  const totalWaste = wasteGarbage + shoppingCarbon;
  
  // Gross calculations
  const grossTotal = totalEnergy + totalTransport + totalFood + totalWaste;
  
  // Calculations of pledged reductions
  let totalSavingsKg = 0;
  state.activePledges.forEach(pledgeId => {
    const actionObj = ECO_ACTIONS.find(a => a.id === pledgeId);
    if (actionObj) {
      totalSavingsKg += actionObj.saving;
    }
  });
  
  const pledgeReductions = totalSavingsKg / 1000; // convert to tons
  // Clamp net total so it doesn't go below 0.1 tons (everyone has some base footprint)
  const netTotal = Math.max(0.1, grossTotal - pledgeReductions);
  
  return {
    energy: totalEnergy,
    transport: totalTransport,
    food: totalFood,
    waste: totalWaste,
    gross: grossTotal,
    reductions: pledgeReductions,
    net: netTotal
  };
}

// Update UI and Dashboard components
function updateDashboard() {
  const results = calculateFootprint();
  
  // Update big totals
  document.getElementById('gross-footprint-val').textContent = results.gross.toFixed(1);
  document.getElementById('net-footprint-val').textContent = results.net.toFixed(1);
  document.getElementById('reductions-val').textContent = results.reductions.toFixed(1);
  
  // Update compare meter description
  updateComparisons(results.net);
  
  // Update gauge dial position
  updateGaugeDial(results.net);
  
  // Update Chart.js breakdown chart
  updateChart(results);
  
  // Update active pledges dashboard list
  renderActivePledgesList();
  
  // Process and render dynamic accomplishments/badges
  updateBadges(results);

  // Update floating live footprint widget
  updateLiveWidget(results);
}

// Update floating live footprint estimate widget
function updateLiveWidget(results) {
  const liveVal = document.getElementById('live-footprint-val');
  if (liveVal) {
    liveVal.textContent = results.net.toFixed(1);
  }
  
  // Update comparison label
  const liveLabel = document.getElementById('live-compare-label');
  if (liveLabel) {
    const parisTarget = 2.0;
    const globalAvg = 4.7;
    const usAvg = 16.0;
    const footprint = results.net;
    let labelText = '';
    let fillColor = 'var(--accent-emerald)';
    let fillWidth = 0;
    
    if (footprint <= parisTarget) {
      labelText = '🌟 Paris Target Met';
      fillColor = 'var(--accent-emerald)';
      fillWidth = (footprint / parisTarget) * 20; // 0-20%
    } else if (footprint <= globalAvg) {
      labelText = '🌱 Under Global Avg';
      fillColor = 'var(--accent-indigo)';
      fillWidth = 20 + ((footprint - parisTarget) / (globalAvg - parisTarget)) * 30; // 20-50%
    } else if (footprint <= usAvg) {
      labelText = '⚠️ Moderate (Below US Avg)';
      fillColor = 'var(--accent-amber)';
      fillWidth = 50 + ((footprint - globalAvg) / (usAvg - globalAvg)) * 30; // 50-80%
    } else {
      labelText = '🚨 High Carbon Footprint';
      fillColor = 'var(--accent-rose)';
      fillWidth = 80 + Math.min(20, ((footprint - usAvg) / 10) * 20); // 80-100%
    }
    
    liveLabel.innerHTML = labelText;
    
    const fillEl = document.getElementById('live-indicator-fill');
    if (fillEl) {
      fillEl.style.width = `${Math.min(100, Math.max(5, fillWidth))}%`;
      fillEl.style.backgroundColor = fillColor;
    }
  }
}

// Compare current footprint to global standards
function updateComparisons(footprint) {
  const parisTarget = 2.0;
  const globalAvg = 4.7;
  const usAvg = 16.0;
  
  let comparisonText = '';
  let markerPercent = 0;
  
  if (footprint <= parisTarget) {
    comparisonText = `🌟 Outstanding! Your footprint meets the <strong>Paris Climate Agreement target (${parisTarget}t)</strong> to keep global warming below 1.5°C.`;
    markerPercent = (footprint / parisTarget) * 20; // 0-20%
  } else if (footprint <= globalAvg) {
    comparisonText = `🌱 Good job! You are below the <strong>Global Average footprint (${globalAvg}t)</strong>, but can reduce further to hit the Paris target.`;
    markerPercent = 20 + ((footprint - parisTarget) / (globalAvg - parisTarget)) * 30; // 20-50%
  } else if (footprint <= usAvg) {
    comparisonText = `⚠️ Moderate footprint. You are higher than the global average but lower than the <strong>US average footprint (${usAvg}t)</strong>.`;
    markerPercent = 50 + ((footprint - globalAvg) / (usAvg - globalAvg)) * 30; // 50-80%
  } else {
    comparisonText = `🚨 High footprint! Your score exceeds the <strong>US average (${usAvg}t)</strong>. Look at active pledges to trim emissions!`;
    markerPercent = 80 + Math.min(20, ((footprint - usAvg) / 10) * 20); // 80-100%
  }
  
  document.getElementById('comparison-desc').innerHTML = comparisonText;
  
  // Update position of marker pin
  const markerPin = document.getElementById('benchmark-marker');
  if (markerPin) {
    markerPin.style.left = `${Math.min(96, Math.max(2, markerPercent))}%`;
  }
}

// Rotate the dashboard carbon dial needle
function updateGaugeDial(footprint) {
  const needle = document.getElementById('gauge-needle');
  if (needle) {
    // Max scale on needle is 20 tons
    // Angled from -90deg (0 tons) to +90deg (20+ tons)
    const clampedFootprint = Math.min(20, footprint);
    const angle = -90 + (clampedFootprint / 20) * 180;
    needle.style.transform = `rotate(${angle}deg)`;
  }
}

// Create/Update Chart.js instance
function updateChart(results) {
  const ctx = document.getElementById('emissions-chart');
  if (!ctx) return;
  
  const data = [
    results.energy,
    results.transport,
    results.food,
    results.waste
  ];
  
  if (chartInstance) {
    chartInstance.data.datasets[0].data = data;
    chartInstance.update();
  } else {
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Home Energy', 'Transportation', 'Diet & Food', 'Waste & Shopping'],
        datasets: [{
          data: data,
          backgroundColor: [
            '#f59e0b', // Amber/Yellow
            '#3b82f6', // Blue
            '#10b981', // Emerald
            '#8b5cf6'  // Purple
          ],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#9ca3af',
              font: {
                family: 'Outfit',
                size: 13
              },
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const val = context.raw || 0;
                return ` ${context.label}: ${val.toFixed(2)} tons CO2e/yr`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }
}

// Render dynamic badges/achievements based on footprint score
function updateBadges(results) {
  const badges = [
    {
      id: 'badge-eco-pioneer',
      condition: results.net <= 3.0,
      title: 'Climate Pioneer',
      desc: 'Achieve an annual footprint of 3.0 tons or less.'
    },
    {
      id: 'badge-transit-hero',
      condition: state.inputs.carDist <= 3000 || state.inputs.carType === 'electric',
      title: 'Transit Hero',
      desc: 'Drive under 3,000 km/year or operate an electric vehicle.'
    },
    {
      id: 'badge-green-chef',
      condition: state.inputs.dietType === 'vegan' || state.inputs.dietType === 'vegetarian',
      title: 'Green Gourmet',
      desc: 'Eat low-carbon meat-free vegetarian or vegan diets.'
    },
    {
      id: 'badge-pledge-master',
      condition: state.activePledges.length >= 5,
      title: 'Pledge Leader',
      desc: 'Adopt 5 or more active carbon reduction commitments.'
    },
    {
      id: 'badge-waste-champion',
      condition: ((state.inputs.recyclePaper + state.inputs.recyclePlastic + state.inputs.recycleGlass) / 3) >= 80 && state.inputs.wasteBags <= 1,
      title: 'Zero-Waste Champion',
      desc: 'Recycle heavily (80%+) and throw away 1 bag or less per week.'
    },
    {
      id: 'badge-footprint-hero',
      condition: results.net <= 1.5,
      title: 'Footprint Hero',
      desc: 'Achieve the ultra-low carbon benchmark of 1.5 tons or less.'
    }
  ];

  const badgesGrid = document.getElementById('badges-grid');
  if (!badgesGrid) return;
  
  badgesGrid.innerHTML = '';
  
  badges.forEach(b => {
    const badgeCard = document.createElement('div');
    badgeCard.className = `badge-item ${b.condition ? 'unlocked' : 'locked'}`;
    
    // Icon mapping based on badge type
    let iconClass = 'fa-lock';
    if (b.condition) {
      if (b.id.includes('pioneer')) iconClass = 'fa-seedling';
      else if (b.id.includes('transit')) iconClass = 'fa-bicycle';
      else if (b.id.includes('chef')) iconClass = 'fa-leaf';
      else if (b.id.includes('pledge')) iconClass = 'fa-award';
      else if (b.id.includes('waste')) iconClass = 'fa-recycle';
      else iconClass = 'fa-globe';
    }
    
    badgeCard.innerHTML = `
      <div class="badge-icon-wrap">
        <i class="fas ${iconClass}"></i>
      </div>
      <div class="badge-info">
        <h4>${b.title}</h4>
        <p>${b.desc}</p>
      </div>
    `;
    
    badgesGrid.appendChild(badgeCard);
  });
}

// Render the Catalog of Reduction Pledges in Action Hub tab
function renderPledgeCatalog() {
  const catalogWrap = document.getElementById('pledges-catalog');
  if (!catalogWrap) return;
  
  catalogWrap.innerHTML = '';
  
  ECO_ACTIONS.forEach(action => {
    const isAdopted = state.activePledges.includes(action.id);
    
    // Pick styling color class for pledge category
    let catColorClass = 'cat-energy';
    let catIcon = 'fa-lightbulb';
    if (action.category === 'transport') {
      catColorClass = 'cat-transport';
      catIcon = 'fa-car-side';
    } else if (action.category === 'diet') {
      catColorClass = 'cat-diet';
      catIcon = 'fa-apple-alt';
    } else if (action.category === 'waste') {
      catColorClass = 'cat-waste';
      catIcon = 'fa-trash-restore';
    }
    
    const pledgeCard = document.createElement('div');
    pledgeCard.className = `pledge-card ${isAdopted ? 'adopted' : ''}`;
    pledgeCard.setAttribute('data-id', action.id);
    
    pledgeCard.innerHTML = `
      <div class="pledge-header">
        <span class="pledge-category ${catColorClass}">
          <i class="fas ${catIcon}"></i> ${action.category.toUpperCase()}
        </span>
        <span class="pledge-impact impact-${action.impact.toLowerCase()}">
          ${action.impact} Impact
        </span>
      </div>
      <h3>${action.title}</h3>
      <p>${action.description}</p>
      
      <div class="pledge-stats">
        <span class="saving-metric">-${action.saving} kg CO2e/yr</span>
      </div>
      
      <div class="pledge-tip hidden-tip">
        <strong>Pro-Tip:</strong> ${action.tip}
      </div>
      
      <div class="pledge-actions">
        <button class="pledge-toggle-btn ${isAdopted ? 'btn-danger' : 'btn-success'}">
          ${isAdopted ? '<i class="fas fa-check"></i> Active Pledge' : 'Adopt Pledge'}
        </button>
        <button class="tip-toggle-btn" title="Learn tips">
          <i class="fas fa-info-circle"></i>
        </button>
      </div>
    `;
    
    // Hook up button clicks
    const toggleBtn = pledgeCard.querySelector('.pledge-toggle-btn');
    toggleBtn.addEventListener('click', () => togglePledge(action.id));
    
    const tipBtn = pledgeCard.querySelector('.tip-toggle-btn');
    const tipEl = pledgeCard.querySelector('.pledge-tip');
    tipBtn.addEventListener('click', () => {
      tipEl.classList.toggle('hidden-tip');
      tipBtn.classList.toggle('active-tip');
    });
    
    catalogWrap.appendChild(pledgeCard);
  });
}

// Toggle a pledge adoption state
function togglePledge(id) {
  const index = state.activePledges.indexOf(id);
  const actionObj = ECO_ACTIONS.find(a => a.id === id);
  
  if (index === -1) {
    // Add pledge
    state.activePledges.push(id);
    showToast(`Pledged: ${actionObj.title}! Check your reductions on the dashboard!`);
  } else {
    // Remove pledge
    state.activePledges.splice(index, 1);
    showToast(`Removed pledge: ${actionObj.title}`);
  }
  
  // Re-render and recalculate
  renderPledgeCatalog();
  updateDashboard();
  saveStateToLocalStorage();
}

// Render dynamic checklist of active pledges on Dashboard overview
function renderActivePledgesList() {
  const listWrap = document.getElementById('active-pledges-list');
  if (!listWrap) return;
  
  listWrap.innerHTML = '';
  
  if (state.activePledges.length === 0) {
    listWrap.innerHTML = `
      <div class="empty-pledges">
        <p>No active pledges adopted yet.</p>
        <a href="#" class="go-to-actions-link">Adopt pledges in the Action Hub!</a>
      </div>
    `;
    
    const link = listWrap.querySelector('.go-to-actions-link');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const actionsTabLink = document.querySelector('.nav-link[data-tab="actions"]');
        if (actionsTabLink) actionsTabLink.click();
      });
    }
    return;
  }
  
  state.activePledges.forEach(pledgeId => {
    const actionObj = ECO_ACTIONS.find(a => a.id === pledgeId);
    if (!actionObj) return;
    
    const activeItem = document.createElement('div');
    activeItem.className = 'active-pledge-item';
    activeItem.innerHTML = `
      <div class="active-pledge-meta">
        <span class="active-pledge-dot ${actionObj.category}"></span>
        <span class="active-pledge-title">${actionObj.title}</span>
      </div>
      <span class="active-pledge-saving">-${actionObj.saving} kg/yr</span>
    `;
    
    listWrap.appendChild(activeItem);
  });
}

// Mobile tooltip triggers
function setupTooltipMobileToggles() {
  const tooltipIcons = document.querySelectorAll('.tooltip-icon');
  tooltipIcons.forEach(icon => {
    // Allows tap-to-reveal tooltips on mobile screens
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      tooltipIcons.forEach(other => {
        if (other !== icon) other.classList.remove('active-mobile-tooltip');
      });
      icon.classList.toggle('active-mobile-tooltip');
    });
  });
  
  // Clicking anywhere else closes active tooltips
  document.addEventListener('click', () => {
    tooltipIcons.forEach(icon => icon.classList.remove('active-mobile-tooltip'));
  });
}

// Custom simple toast indicator
function showToast(message) {
  const container = document.getElementById('toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = 'toast-popup';
  toast.innerHTML = `<i class="fas fa-leaf"></i> ${message}`;
  
  container.appendChild(toast);
  
  // Fade in, hold, fade out
  setTimeout(() => toast.classList.add('visible'), 10);
  
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
  return container;
}
