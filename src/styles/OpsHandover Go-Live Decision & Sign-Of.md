OpsHandover — Go-Live Decision & Sign-Off  
## Operational Acceptance Screen Specification

**Product:** OpsHandover  
**Document Type:** Functional & Behavioural Specification  
**Version:** 1.0  
**Status:** Build-ready  
**Core Principle:** Go-live is a **decision**, not a date

---

## 1. Purpose of the Go-Live Screen

The Go-Live Decision screen exists to:

1. Freeze operational readiness at a point in time  
2. Force an explicit, accountable go-live decision  
3. Create a permanent institutional record of acceptance  

This screen is the **governance moment** of OpsHandover.

---

## 2. When This Screen Is Used

The screen is accessed via a **“Proceed to Go-Live Decision”** action from a Handover Workspace.

It is used only when the organisation is ready to formally answer:

> “Are we prepared to operate this change in Business-as-Usual?”

This screen is **not always visible** and is role-restricted.

---

## 3. Roles & Access

### Required Roles
- BAU Owner (primary signatory)
- Project Lead
- Executive Sponsor (optional co-signatory)

### Access Rules
- Read-only for observers
- Editable only by authorised signatories
- PMs cannot self-approve without BAU involvement

---

## 4. Screen Structure (Top to Bottom)

---

## 4.1 Context Header (Read-Only)

**Title**  
> Go-Live Decision: *[Handover Name]*

**Context Metadata**
- Target Go-Live Date
- Decision Requested By (Project Lead)
- BAU Owner

**Purpose**
- Establishes formality
- Makes accountability explicit
- Sets the tone of decision-making

---

## 4.2 Readiness Snapshot (Frozen)

This section displays a **read-only snapshot** of readiness at the moment the decision is initiated.

### Elements
- Overall Operational Readiness Score (e.g. 68 / 100)
- Status label (Ready / At Risk / Not Ready)
- Count of:
  - Blockers
  - At Risk items
  - Ready items

**Supporting Text**
> This snapshot reflects operational readiness at the time of decision.

This language is required for audit defensibility.

---

## 4.3 Blocking Issues & Accepted Risks Summary

This section displays **exceptions only** — not the full checklist.

---

### 🔴 Blockers
Each blocker includes:
- Domain (e.g. People & Training)
- Check name
- Owner
- One-line reason

**Example**
> People & Training  
> Support Rota Established  
> Owner: Sarah Jones  
> _Weekend on-call coverage not confirmed_

Blockers represent conditions that normally prevent go-live.

---

### 🟡 Accepted Risks (if any)

Displayed only if present.

Each risk includes:
- Domain
- Description
- Owner
- Impact note

**Example**
> Technology & Infrastructure  
> Monitoring alerts not fully tuned  
> Owner: IT Ops  
> _May delay incident detection during early days_

---

## 4.4 Go-Live Decision Selection (Interactive)

Exactly **one** of the following options must be selected.

---

### ✅ Ready to Go Live
**Availability**
- Enabled only when no blockers exist

**Behaviour**
- No justification required
- Represents full operational confidence

---

### ⚠ Go Live with Known Risks
**Availability**
- Enabled when:
  - No blockers exist, OR
  - Leadership explicitly chooses to override

**Requirements**
- Mandatory written justification
- Mandatory acknowledgement checkbox:
  > “I acknowledge that the above risks are accepted by Operations.”

This option protects BAU by making risk acceptance explicit.

---

### ❌ Not Ready to Go Live
**Availability**
- Always enabled

**Requirements**
- Mandatory rationale
- Optional next review date

This option protects the organisation from premature go-live.

---

## 4.5 Sign-Off & Accountability

### Sign-Off Details
- Signatory Name (auto-filled)
- Role
- Date & Time (system-generated)
- Optional additional signatories (e.g. Executive Sponsor)

### Required Statement
> This decision records operational acceptance at this point in time.

This statement must appear above the confirmation action.

---

## 4.6 Confirmation Action

Button label is dynamic based on selected decision:
- “Confirm Go-Live”
- “Confirm Go-Live with Risks”
- “Record Not Ready Decision”

No generic labels such as “Submit” or “Save” are permitted.

---

## 5. Behavioural & Governance Rules

---

### Rule 1: Snapshot Immutability
Once confirmed:
- Readiness score
- Blockers
- Risks

are permanently frozen as a historical record.

Subsequent changes in the workspace do not alter past decisions.

---

### Rule 2: No Silent Overrides
- “Ready to Go Live” is disabled if blockers exist
- Overrides require:
  - Selecting “Go Live with Known Risks”
  - Providing written justification

---

### Rule 3: BAU-Centric Accountability
- BAU Owner is the default and required signatory
- Project Leads cannot approve unilaterally

---

### Rule 4: Audit Artefact
Each Go-Live Decision must be:
- Viewable in read-only mode
- Exportable (PDF / link)
- Referencable post go-live

This screen replaces decks, emails, and verbal approvals.

---

## 6. Design & Tone Principles

The Go-Live screen must feel:
- Calm and formal
- Neutral and non-judgemental
- Deliberate, not rushed

Avoid language implying blame or failure.

Preferred terms:
- “Operational Acceptance”
- “Known Risks”
- “Not Ready”

---

## 7. What This Screen Replaces

Once implemented, this screen replaces:
- Go-live approval slides
- Email-based sign-offs
- Informal verbal agreements
- Post-hoc justification exercises

It becomes the **single source of truth** for go-live decisions.

---

## 8. Success Criteria

This screen is successful if:
- BAU trusts it
- Executives reference it
- Auditors accept it
- Go-live debates focus on resolution, not discovery

---

## 9. Core Question Answered

This screen must always be able to answer, unambiguously:

> “Who accepted this operational risk, when, and under what conditions?”

If it does, OpsHandover has fulfilled its purpose.
