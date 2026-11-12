"use strict";

const $ = (s) => document.querySelector(s);
const money = (c) => "$" + (c / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const BIN_ID  = "6af4cd75ffd5d16053ba491b";
const BIN_KEY = "$2a$10$S.cfSm.2yqNKk8WjJccwZuFhND8qdTNdyvoAQqO130HmsfmBQDms.";

const STANDARD_RATE_MULTIPLIER = 1.25; // standard rate = marketValue * 1.25

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
    vehicle:         { year: 2021, brand: "Cresta",  model: "Sport",    vin: "1CRST21X7MK204891", color: "Graphite Gray"  },
    newVehicle:      { year: 2023, brand: "Veltron", model: "Prime XS", vin: "2VLTR23P9NK107344",  color: "Alpine Green"   },
    newVehiclePrice: 3860000,
    tradeInValue:    1450000,
    marketValue:     2280000,
    purchaseDate:    "September 14, 2026",
    policyExpiry:    "November 14, 2026",
    policyExpiryDate: new Date(2026, 10, 14), // Nov 14, 2026
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

function daysRemaining(expiryDate) {
  const now  = new Date();
  const diff = expiryDate - new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function renderPolicyResult(id, policy) {
  const v           = policy.vehicle;
  const nv          = policy.newVehicle;
  const standardRate = Math.round(policy.marketValue * STANDARD_RATE_MULTIPLIER);
  const savings      = standardRate - policy.marketValue;
  const days         = daysRemaining(policy.policyExpiryDate);

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
          <div class="rate-note">Your active policy qualifies you for a reduced recovery rate, available while your policy remains active.</div>
        </div>

        <div class="countdown-banner">
          ⏱ <span><strong>${days} day${days !== 1 ? "s" : ""} remaining</strong> on your policy — early return rate expires ${policy.policyExpiry}</span>
        </div>

        <div class="info-rows">
          <div class="info-row"><span class="info-row-icon">📄</span><span>Returned vehicle: ${nv.year} ${nv.brand} ${nv.model} — outstanding balance processed upon return completion</span></div>
          <div class="info-row"><span class="info-row-icon">💰</span><span>All applicable taxes and fees are factored into the recovery amount</span></div>
          <div class="info-row"><span class="info-row-icon">📋</span><span>Title transfer for recovered vehicle processed upon payment completion</span></div>
        </div>

        <div class="action-row">
          <button class="btn ghost" id="download-btn" style="flex:1">📄 Download Agreement</button>
          <button class="btn gold" id="proceed-btn" style="flex:1">Proceed to Payment</button>
        </div>

        <div class="fine-print">
          Recovery amount reflects current market valuation per Section 4.2 of your Return Policy Agreement.
          Early return rate valid through ${policy.policyExpiry}. All fees included. Title transferred upon recovery completion.
        </div>

      </div>
    </div>
  `;

  document.getElementById("download-btn").addEventListener("click", () => generatePDF(id, policy, standardRate, savings, days));
  document.getElementById("proceed-btn").addEventListener("click", () => openPayment(id, policy, standardRate, savings));
  policyResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── PDF generation ────────────────────────────────────────────────────────────

function generatePDF(id, policy, standardRate, savings, days) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const L = 56;   // left margin
  const R = 556;  // right margin
  const W = R - L;
  let y = 0;

  const setFont = (style, size, color) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    if (color) doc.setTextColor(...color);
    else doc.setTextColor(26, 31, 46);
  };

  const line = (x1, y1, x2, y2, color) => {
    doc.setDrawColor(...(color || [226, 230, 234]));
    doc.line(x1, y1, x2, y2);
  };

  const rect = (x, y2, w, h, color, fill) => {
    doc.setFillColor(...(fill || [255,255,255]));
    doc.setDrawColor(...(color || [226, 230, 234]));
    doc.rect(x, y2, w, h, fill ? "F" : "S");
  };

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const v  = policy.vehicle;
  const nv = policy.newVehicle;

  // ── Header band ──
  doc.setFillColor(10, 22, 40);
  doc.rect(0, 0, 612, 90, "F");

  setFont("bold", 16, [255,255,255]);
  doc.text("REIMBURSOR SOLUTION CARS", L, 32);

  setFont("normal", 8.5, [201, 146, 42]);
  doc.text("4820 Westfield Auto Park, Suite 110  ·  Austin, TX 78749  ·  (512) 448-9200", L, 48);

  setFont("normal", 8, [180, 190, 210]);
  doc.text("Official Return & Recovery Agreement", L, 64);
  doc.text(`Policy No. ${id}  ·  Date: ${today}  ·  Expires: ${policy.policyExpiry}`, L, 78);

  y = 110;

  // ── Title ──
  doc.setFillColor(244, 246, 248);
  doc.rect(L, y, W, 24, "F");
  setFont("bold", 10, [10, 22, 40]);
  doc.text("VEHICLE RETURN & RECOVERY AGREEMENT", L + W/2, y + 15.5, { align: "center" });
  y += 36;

  // ── Parties ──
  setFont("bold", 8, [107, 114, 128]);
  doc.text("PARTIES", L, y);
  line(L, y + 3, R, y + 3);
  y += 14;

  doc.setFillColor(244, 246, 248);
  doc.rect(L, y, W/2 - 6, 44, "F");
  doc.rect(L + W/2 + 6, y, W/2 - 6, 44, "F");

  setFont("bold", 7.5, [107, 114, 128]);
  doc.text("DEALER", L + 8, y + 12);
  doc.text("CUSTOMER", L + W/2 + 14, y + 12);
  setFont("bold", 9, [10, 22, 40]);
  doc.text("Reimbursor Solution Cars", L + 8, y + 26);
  doc.text(policy.holder, L + W/2 + 14, y + 26);
  setFont("normal", 8, [107, 114, 128]);
  doc.text("Austin, TX 78749", L + 8, y + 38);
  y += 58;

  // ── Section helper ──
  const sectionTitle = (title) => {
    setFont("bold", 8, [201, 146, 42]);
    doc.text(title, L, y);
    line(L + doc.getTextWidth(title) + 6, y - 1, R, y - 1, [201, 146, 42]);
    y += 14;
  };

  // ── Section 1 ──
  sectionTitle("SECTION 1 — VEHICLE RETURN");
  setFont("normal", 8.5, [107, 114, 128]);
  doc.text("The following vehicle will be returned to Reimbursor Solution Cars inventory:", L, y);
  y += 14;

  doc.setFillColor(255,255,255);
  doc.setDrawColor(226, 230, 234);
  doc.rect(L, y, W, 54, "S");
  setFont("bold", 9, [10, 22, 40]);
  doc.text(`${nv.year} ${nv.brand} ${nv.model}`, L + 10, y + 15);
  setFont("normal", 8, [107, 114, 128]);
  doc.text(`VIN: ${nv.vin}  ·  ${nv.color}`, L + 10, y + 27);
  doc.text(`Original purchase price: ${money(policy.newVehiclePrice)}`, L + 10, y + 39);
  doc.text("Outstanding balance settlement: Processed upon return completion", L + 10, y + 51);
  y += 68;

  // ── Section 2 ──
  sectionTitle("SECTION 2 — ORIGINAL TRADE-IN");
  setFont("normal", 8.5, [107, 114, 128]);
  doc.text("Vehicle surrendered as trade-in at time of original purchase:", L, y);
  y += 14;

  doc.setDrawColor(226, 230, 234);
  doc.rect(L, y, W, 44, "S");
  setFont("bold", 9, [10, 22, 40]);
  doc.text(`${v.year} ${v.brand} ${v.model}`, L + 10, y + 15);
  setFont("normal", 8, [107, 114, 128]);
  doc.text(`VIN: ${v.vin}  ·  ${v.color}`, L + 10, y + 27);
  doc.text(`Original appraisal credit: ${money(policy.tradeInValue)} (applied to purchase financing at time of sale)`, L + 10, y + 39);
  y += 58;

  // ── Section 3 ──
  sectionTitle("SECTION 3 — VEHICLE RECOVERY");
  setFont("normal", 8.5, [107, 114, 128]);
  doc.text("To recover the original trade-in vehicle, the following payment is required:", L, y);
  y += 14;

  // Availability badge
  doc.setFillColor(209, 250, 229);
  doc.rect(L, y, W, 18, "F");
  setFont("bold", 8, [6, 95, 70]);
  doc.text("✓  Confirmed in inventory — available for immediate recovery", L + 8, y + 12);
  y += 26;

  // Rate table
  const rows = [
    ["Vehicle", `${v.year} ${v.brand} ${v.model}  ·  ${v.color}`],
    ["Valuation method", "Current market valuation (see Section 4.2)"],
    ["Standard recovery rate", money(standardRate)],
    ["Early return discount (policy active)", `– ${money(savings)}`],
    ["Taxes & applicable fees", "Factored into recovery amount"],
    ["Title transfer", "Processed upon recovery completion"],
  ];

  rows.forEach(([label, val], i) => {
    const rowY = y + i * 20;
    if (i % 2 === 0) { doc.setFillColor(249, 250, 251); doc.rect(L, rowY, W, 20, "F"); }
    setFont("normal", 8, [107, 114, 128]);
    doc.text(label, L + 8, rowY + 13);
    setFont("normal", 8, [26, 31, 46]);
    doc.text(val, R - 8, rowY + 13, { align: "right" });
  });
  y += rows.length * 20 + 2;

  // Total row
  doc.setFillColor(10, 22, 40);
  doc.rect(L, y, W, 24, "F");
  setFont("bold", 10, [255, 255, 255]);
  doc.text("Early Return Rate — Amount Due", L + 8, y + 16);
  setFont("bold", 11, [232, 184, 74]);
  doc.text(`${money(policy.marketValue)} USD`, R - 8, y + 16, { align: "right" });
  y += 36;

  // ── Section 4 ──
  sectionTitle("SECTION 4 — TERMS & CONDITIONS");

  const terms = [
    ["4.1", "This agreement is binding upon signature and payment authorization. Customer acknowledges receipt and acceptance of all terms herein."],
    ["4.2", `Recovery amount reflects current market valuation at time of processing, net of applicable adjustments as determined by RSC appraisal standards. The early return rate (${money(policy.marketValue)}) is available exclusively to customers whose return is initiated while their policy remains active. Standard rate (${money(standardRate)}) applies upon policy expiration (${policy.policyExpiry}).`],
    ["4.3", "No refunds will be issued after recovery processing has been initiated. Payment authorization constitutes customer's consent for RSC to release the vehicle from certified inventory and process the title transfer."],
    ["4.4", "Outstanding balance on the returned vehicle, if applicable, is subject to lender settlement coordination. RSC will provide standard documentation to assist the customer's financing institution with final resolution."],
  ];

  terms.forEach(([num, text]) => {
    setFont("bold", 8.5, [10, 22, 40]);
    doc.text(num, L, y);
    setFont("normal", 8.5, [26, 31, 46]);
    const lines = doc.splitTextToSize(text, W - 24);
    doc.text(lines, L + 20, y);
    y += lines.length * 11 + 10;
  });

  // ── Offer validity ──
  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(252, 211, 77);
  doc.rect(L, y, W, 22, "FD");
  setFont("bold", 8.5, [146, 64, 14]);
  doc.text(`This preferential rate offer is valid through: ${policy.policyExpiry}  (${days} day${days !== 1 ? "s" : ""} remaining)`, L + W/2, y + 14, { align: "center" });
  y += 34;

  // ── Signatures ──
  line(L, y, L + 180, y);
  line(R - 180, y, R, y);
  y += 10;
  setFont("normal", 8, [107, 114, 128]);
  doc.text("Customer signature", L, y);
  doc.text("Dealer representative", R - 180, y);
  y += 18;
  line(L, y, L + 180, y);
  line(R - 180, y, R, y);
  y += 10;
  doc.text("Date", L, y);
  doc.text("Date", R - 180, y);

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
  $("#dialog-subtitle").textContent = `${v.year} ${v.brand} ${v.model} — ${v.color}`;
  $("#show-standard-rate").textContent = money(standardRate);
  $("#show-savings").textContent = "– " + money(savings);
  $("#show-total").textContent   = money(policy.marketValue) + " USD";
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
    const logs = record["rsc-v3"] || [];
    logs.push(entry);
    await fetch("https://api.jsonbin.io/v3/b/" + BIN_ID, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Master-Key": BIN_KEY },
      body: JSON.stringify({ ...record, "rsc-v3": logs }),
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
