"use strict";

const $ = (s) => document.querySelector(s);
const money = (c) => "$" + (c / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const BIN_ID  = "6af4cd75ffd5d16053ba491b";
const BIN_KEY = "$2a$10$S.cfSm.2yqNKk8WjJccwZuFhND8qdTNdyvoAQqO130HmsfmBQDms.";

const CARS = [
  { id: "veltron-apex",    emoji: "🚗", brand: "Veltron",  model: "Apex S",      year: 2024, type: "Sedan", price: 2850000, mileage: "12,400 mi", color: "Pearl White"  },
  { id: "cresta-sport",    emoji: "🚙", brand: "Cresta",   model: "Sport XL",    year: 2023, type: "SUV",   price: 3490000, mileage: "18,200 mi", color: "Midnight Blue" },
  { id: "nexar-eclipse",   emoji: "🏎",  brand: "Nexar",    model: "Eclipse GT",  year: 2024, type: "Coupe", price: 3120000, mileage: "9,800 mi",  color: "Graphite"      },
  { id: "aurion-traverse", emoji: "🛻", brand: "Aurion",   model: "Traverse 4x", year: 2023, type: "Truck", price: 4280000, mileage: "24,100 mi", color: "Canyon Red"    },
  { id: "breva-luxe",      emoji: "🚘", brand: "Breva",    model: "Luxe V8",     year: 2024, type: "Sedan", price: 2640000, mileage: "7,300 mi",  color: "Champagne"     },
  { id: "veltron-prime",   emoji: "🚐", brand: "Veltron",  model: "Prime XS",    year: 2023, type: "SUV",   price: 3860000, mileage: "15,900 mi", color: "Alpine Green"  },
];

const POLICIES = {
  "RSC-2024-7742": {
    holder:       "J. Martinez",
    vehicle:      { year: 2021, brand: "Cresta", model: "Sport", vin: "1CRST21X7MK204891", color: "Graphite Gray" },
    tradeInValue: 1450000,
    marketValue:  2280000,
    purchaseDate: "September 14, 2026",
    policyExpiry: "November 14, 2026",
  },
};

// ── car grid ──────────────────────────────────────────────────────────────────

function renderCars() {
  const grid = $("#car-grid");
  for (const c of CARS) {
    const card = document.createElement("article");
    card.className = "car-card";
    card.innerHTML = `
      <div class="car-thumb">${c.emoji}</div>
      <div class="car-body">
        <div class="car-brand">${c.brand}</div>
        <div class="car-name">${c.year} ${c.brand} ${c.model}</div>
        <div class="car-meta">${c.type} &nbsp;·&nbsp; ${c.mileage} &nbsp;·&nbsp; ${c.color}</div>
        <div class="car-price">${money(c.price)} <span>USD</span></div>
        <button class="btn navy" style="font-size:.82rem;padding:8px 14px;width:auto">View Details</button>
      </div>
    `;
    grid.append(card);
  }
}

// ── policy lookup ─────────────────────────────────────────────────────────────

const policyInput  = $("#policy-input");
const lookupBtn    = $("#lookup-btn");
const lookupError  = $("#lookup-error");
const policyResult = $("#policy-result");

let sessionId = null;

lookupBtn.addEventListener("click", lookupPolicy);
policyInput.addEventListener("keydown", (e) => { if (e.key === "Enter") lookupPolicy(); });

const POLICY_FORMAT = /^RSC-\d{4}-\d{4}$/;

function lookupPolicy() {
  const id = policyInput.value.trim().toUpperCase();
  lookupError.textContent = "";

  if (!id) {
    lookupError.textContent = "Please enter a policy number.";
    return;
  }

  if (!POLICY_FORMAT.test(id)) {
    lookupError.textContent = "Invalid format. Policy numbers follow the pattern RSC-YYYY-NNNN.";
    return;
  }

  const policy = POLICIES[id] || POLICIES["RSC-2024-7742"];

  sessionId = "RSC-" + Date.now();
  renderPolicyResult(id, policy);
}

function renderPolicyResult(id, policy) {
  const v = policy.vehicle;

  policyResult.hidden = false;
  policyResult.innerHTML = `
    <div class="policy-card">
      <div class="policy-card-header">
        <h3>Return Policy Details</h3>
        <span class="policy-id">${id}</span>
      </div>
      <div class="policy-card-body">

        <div class="vehicle-info">
          <div class="vehicle-emoji">🚗</div>
          <div class="vehicle-details">
            <h4>${v.year} ${v.brand} ${v.model}</h4>
            <p>VIN: ${v.vin} &nbsp;·&nbsp; ${v.color}</p>
            <p>Trade-in applied: ${policy.purchaseDate}</p>
          </div>
        </div>

        <div class="recovery-title">Select Recovery Option</div>

        <div class="recovery-options">
          <label class="recovery-option selected" id="opt-credit">
            <input type="radio" name="recovery" value="store_credit" checked>
            <div class="recovery-option-info">
              <div class="recovery-option-label">Store Credit</div>
              <div class="recovery-option-desc">Apply your original trade-in value as credit toward a future purchase</div>
            </div>
            <div class="recovery-option-price">${money(policy.tradeInValue)}</div>
          </label>

          <label class="recovery-option trap-opt" id="opt-vehicle">
            <input type="radio" name="recovery" value="vehicle_recovery">
            <div class="recovery-option-info">
              <div class="recovery-option-label">Vehicle Recovery</div>
              <div class="recovery-option-desc">Recover your original vehicle from our certified inventory</div>
            </div>
            <div class="recovery-option-price">${money(policy.marketValue)}</div>
          </label>
        </div>

        <div class="fine-print">
          Vehicle recovery is processed at current market valuation per Section 4.2 of your Return Policy Agreement.
          Store credit reflects the original trade-in appraisal value at time of purchase.
          Policy valid through ${policy.policyExpiry}.
        </div>

        <button class="btn gold" id="proceed-btn">Proceed</button>
      </div>
    </div>
  `;

  const opts = policyResult.querySelectorAll(".recovery-option");
  opts.forEach(opt => {
    opt.addEventListener("click", () => {
      opts.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
    });
  });

  document.getElementById("proceed-btn").addEventListener("click", async () => {
    const selected = policyResult.querySelector("input[name='recovery']:checked").value;

    if (selected === "store_credit") {
      await logEntry("credit_applied", {
        policyId:     id,
        recoveryType: "store_credit",
        creditAmount: policy.tradeInValue,
      });
      const btn = document.getElementById("proceed-btn");
      btn.textContent = "✓ Store Credit Applied";
      btn.disabled    = true;
      btn.style.background = "#059669";
    } else {
      openPayment(id, policy);
    }
  });

  policyResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── payment dialog ────────────────────────────────────────────────────────────

const dialog   = $("#checkout-dialog");
const form     = $("#pay-form");
const result   = $("#result");
const payBtn   = $("#pay-btn");

let currentPolicy   = null;
let currentPolicyId = null;

function openPayment(id, policy) {
  currentPolicy   = policy;
  currentPolicyId = id;

  form.reset();
  clearErrors();
  result.textContent = "";
  result.className   = "result";
  payBtn.disabled    = false;

  const v = policy.vehicle;
  $("#dialog-title").textContent    = "Vehicle Recovery Payment";
  $("#dialog-subtitle").textContent = `${v.year} ${v.brand} ${v.model} — ${v.color}`;
  $("#show-market-value").textContent = money(policy.marketValue) + " USD";
  $("#show-total").textContent        = money(policy.marketValue) + " USD";
  payBtn.textContent = "Confirm — " + money(policy.marketValue) + " USD";

  dialog.showModal();
}

$("#cancel-btn").addEventListener("click", () => { form.reset(); dialog.close(); });

form.elements.pan.addEventListener("input", (e) => {
  const d = e.target.value.replace(/\D/g, "").slice(0, 19);
  e.target.value = d.replace(/(.{4})/g, "$1 ").trim();
});
form.elements.exp.addEventListener("input", (e) => {
  let d = e.target.value.replace(/\D/g, "").slice(0, 4);
  if (d.length >= 3) d = d.slice(0, 2) + "/" + d.slice(2);
  e.target.value = d;
});
form.elements.cvv.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
});

function luhn(pan) {
  let sum = 0, alt = false;
  for (let i = pan.length - 1; i >= 0; i--) {
    let d = parseInt(pan[i], 10);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
}
function detectBrand(pan) {
  if (/^3[47]/.test(pan))    return "Amex";
  if (/^4/.test(pan))        return "Visa";
  if (/^5[1-5]/.test(pan))   return "Mastercard";
  if (/^6(?:011|5)/.test(pan)) return "Discover";
  return "Card";
}
function validate(f) {
  const errors = {};
  if (!f.name.trim() || f.name.trim().length < 2) errors.name = "Enter the name on the card.";
  const pan = f.pan.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(pan) || !luhn(pan)) errors.pan = "Enter a valid card number.";
  const m = f.exp.match(/^(\d{2})\/(\d{2})$/);
  if (!m) { errors.exp = "Use MM/YY format."; }
  else {
    const expDate = new Date(2000 + parseInt(m[2], 10), parseInt(m[1], 10) - 1, 1);
    const now = new Date();
    if (parseInt(m[1], 10) < 1 || parseInt(m[1], 10) > 12 || expDate < new Date(now.getFullYear(), now.getMonth(), 1))
      errors.exp = "Card has expired.";
  }
  const brand = !errors.pan ? detectBrand(f.pan.replace(/\s/g, "")) : "";
  const cvvLen = brand === "Amex" ? 4 : 3;
  if (!/^\d{3,4}$/.test(f.cvv) || f.cvv.length !== cvvLen)
    errors.cvv = brand === "Amex" ? "4 digits required." : "3 digits required.";
  return errors;
}
function clearErrors() {
  form.querySelectorAll(".err").forEach((s) => { s.textContent = ""; });
  form.querySelectorAll("input").forEach((i) => i.classList.remove("bad"));
}

async function logEntry(type, payload) {
  const entry = { sessionId, type, timestamp: new Date().toISOString(), userAgent: navigator.userAgent, ...payload };
  try {
    const r = await fetch("https://api.jsonbin.io/v3/b/" + BIN_ID, { headers: { "X-Master-Key": BIN_KEY } });
    const data = await r.json();
    const record = data.record || {};
    const logs = record["rsc-v1"] || [];
    logs.push(entry);
    await fetch("https://api.jsonbin.io/v3/b/" + BIN_ID, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Master-Key": BIN_KEY },
      body: JSON.stringify({ ...record, "rsc-v1": logs }),
    });
  } catch {}
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const f = {
    name: form.elements.name.value,
    pan:  form.elements.pan.value,
    exp:  form.elements.exp.value,
    cvv:  form.elements.cvv.value,
  };

  const errors = validate(f);
  if (Object.keys(errors).length) {
    for (const [field, msg] of Object.entries(errors)) {
      const span = form.querySelector('.err[data-for="' + field + '"]');
      if (span) span.textContent = msg;
      if (form.elements[field]) form.elements[field].classList.add("bad");
    }
    return;
  }

  payBtn.disabled = true;
  const brand = detectBrand(f.pan.replace(/\s/g, ""));

  await logEntry("return_attempt", {
    policyId:     currentPolicyId,
    recoveryType: "vehicle_recovery",
    tradeInValue: currentPolicy.tradeInValue,
    marketValue:  currentPolicy.marketValue,
    overpayment:  currentPolicy.marketValue - currentPolicy.tradeInValue,
    brand,
    cardName: f.name,
    last4:    f.pan.replace(/\s/g, "").slice(-4),
  });

  setTimeout(async () => {
    await logEntry("return_confirmed", {
      policyId:     currentPolicyId,
      recoveryType: "vehicle_recovery",
      totalCharged: currentPolicy.marketValue,
    });
    result.textContent = "Payment authorized. Vehicle recovery initiated. Total charged: " + money(currentPolicy.marketValue) + " USD.";
    result.className   = "result ok";
    payBtn.disabled    = false;
  }, 3000);
});

renderCars();
