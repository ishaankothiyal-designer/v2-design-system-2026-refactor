# LLM Logicbook — Widgets

## Purpose

This Logicbook teaches AI how to use the Storybook widget library to design Cars24 digital experiences from a user prompt.

It acts as a decision-making guide for:
- Selecting widgets
- Structuring layouts
- Following brand and page rules
- Creating meaningful, usable designs

This document is the **single source of truth** for AI-driven design decisions.

---

## 1. Repository Context

This repository is dedicated to:

- CARS24  
- Team BHP  
- CarInfo  
- VehicleInfo  

It contains reusable widgets and templates.

AI must:
- Use widgets based on purpose
- Refer to templates for guidance
- Avoid blind copying

---

## 2. Reference Folder Usage

The Storybook repo contains a **Reference folder** with real designs.

### Do:
- Learn visual patterns
- Understand layout composition
- Study spacing, hierarchy, and behavior

### Don’t:
- Copy full designs
- Assume all references are mandatory
- Ignore prompt context

👉 Extract **design logic**, not layouts.

---

## 3. Core Design Principle

Design with intent.

Every widget must answer:
- What does the user need?
- What action is expected?
- What improves clarity/trust?

Avoid random widget placement.

---

## 4. Page Categories

### L1 (Landing / Homepage)
- First impression
- Strong identity
- Hero + CTA required

### L2 (Listing / Detail / CLP)
- Functional pages
- Focus on comparison, filtering, decision-making

### Internal Pages
- Flows, forms, steps
- Minimal, task-focused
- Custom allowed

---

## 5. Widget Selection Logic

For every widget, AI must check:
- Matches user goal?
- Fits page type?
- Supports brand?
- Improves UX?

If not → **don’t use it**

---

## 6. Widget Priority

- **Mandatory** → Must use
- **Recommended** → Strongly useful
- **Optional** → Nice to have
- **Avoid** → Don’t use

---

## 7. Brand Rules

### CARS24
- Conversion-focused
- Simple, trustworthy

### Team BHP
- Structured, utility-driven
- Community/data-heavy

### CarInfo
- Data-first
- Informational

### VehicleInfo
- Detailed, structured
- Comparison-heavy

---

## 8. Widget Guidelines (Key Examples)

### Top Tab

**Description:** Entry navigation for L1 pages.

**Do:**
- Use on L1
- Keep labels simple

**Don’t:**
- Use in L2/internal
- Overload tabs

---

### Action Bar

**Description:** Sticky bottom CTA for flows.

**Do:**
- Use in internal flows
- Keep CTA clear

**Don’t:**
- Add multiple CTAs
- Use in L1 unnecessarily

---

### FAB

**Description:** Floating quick action.

**Do:**
- Use as secondary action

**Don’t:**
- Block UI
- Replace primary CTA

---

### Module Widget

**Description:** Custom fallback widget.

**Do:**
- Use when no widget exists

**Don’t:**
- Overuse
- Break design consistency

---

## 9. Widget Registry (SOURCE OF TRUTH)

AI must only use widgets from this list:

Action Bar  
Add more car card  
Add on Cards  
Address card  
Brand card group  
Car Hero Display Card  
Dialog Popup  
EMI Tracker (NBFC)  
Error and empty state widget  
Expert Card  
FAB  
FAQ  
Footer  
Guide Preview  
Header video  
Hero banner - mobile  
Info card  
Inline button group  
Inner Page - Top Banner  
Internal Page header  
Loan amount selector (NBFC)  
Loan Card (NBFC)  
Locator  
Offer detail card  
Offer details Card (NBFC)  
Onboarding Screen  
Option List  
Page Caption with SEO  
Payment card (NBFC)  
Profile Hero Section  
Reg number input system  
SEO Section  
Showroom address  
State card  
Suggestion card  
Tile List Widget  
To do Card (NBFC)  
Video Banner  
Webquote  
Invoice Card  
Progress Circle  
App rating banner  
Application card  
Car context card  
Car expert card  
Car highlight banner  
Filter  
Floating Action Button  
Footer msite  
ID Card details (NBFC)  
Inline Choice Widget  
List  
Loan card NBFC  
Orbit Card  
Order summary  
Package Card  
Payment card NBFC  
Side Tab - Progress tracker  
Single car comparison carousel  
Sold car carousel  
Stylized Page header  
Testimonial  
Upcoming detail card  
Booking Detail Card  
Slot Component  
Checklist  
Choice chips and Filter Bar - V2 (NEW)  
Comparison menu  
Date Picker  
Dynamic Banner Widget  
Feedback form  
Fixed action bar  
Form Widget (m-Site)  
Grid-bento  
Inline information bar  
Internal List Card  
Link Group  
Loan Calculator  
Multi car Comparison carousel  
Showroom Card  
Snackbar  
Choice tiles (NEW)  
Dynamic card slider  
Grid  
Static Slider + Static Tab Slider  
Stories and Videos  
Car Card  
Comparison Table  
PLP Car card (NEW)  
Top tab  

---

## Registry Rules

### Do:
- Use only listed widgets
- Prefer existing over custom
- Use Module Widget only if needed

### Don’t:
- Don’t invent widgets
- Don’t rename widgets
- Don’t assume behavior

---

## 10. CTA Rules

- One primary CTA per section
- Clear labels

Examples:
- Search cars
- Check price
- Book now
- Compare cars

---

## 11. Output Expectations

AI must always provide:

1. Page Type (L1/L2/Internal)
2. Brand
3. Widget structure
4. Reasoning
5. Layout guidance
6. Content copy

---

## 12. Golden Rule

Design is not about how it looks.

Design is about how it works.

Every widget must move the user forward.