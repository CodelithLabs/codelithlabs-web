---
title: "Percentage Calculator - Free Online Percent Calculator"
description: "Calculate percentages, percentage change, percentage of a number, and reverse percentages instantly. Includes tip calculator, discount calculator, and grade percentage converter."
keywords: ["percentage calculator", "percent calculator", "calculate percentage", "percentage change", "percentage increase", "percentage decrease", "discount calculator"]
category: "calculator"
slug: "percentage-calculator"
datePublished: "2025-01-15T00:00:00.000Z"
dateModified: "2026-02-28T00:00:00.000Z"
author: "CodelithLabs Team"
---

# Percentage Calculator

Calculate any percentage operation instantly: "What is X% of Y?", "X is what percent of Y?", "percentage change from X to Y", and more. Includes practical tools for discounts, tips, grade calculations, and markup/margin conversions.

## 🚀 Features

- **Four Calculation Modes** — "X% of Y", "X is what % of Y", "% change from X to Y", and "increase/decrease Y by X%"
- **Tip Calculator** — Calculate tip amounts and split bills for any party size
- **Discount Calculator** — Enter original price and discount percentage to see sale price and savings
- **Grade Calculator** — Convert scores (e.g., 45 out of 60) to percentages for academic grading
- **Reverse Percentage** — Find the original number before a percentage was applied (e.g., "After 20% off, the price is ₹400 — what was the original?")
- **Step-by-Step Solution** — Shows the formula and calculation steps, not just the answer
- **History** — Recent calculations are saved in session for easy reference

## 📖 How to Use Percentage Calculator

1. **Select Mode** — Choose your calculation type: "% of a number", "what % is X of Y", "% change", or "increase/decrease by %".
2. **Enter Values** — Fill in the two known values. The third value is calculated automatically.
3. **View Result** — The answer appears instantly with the formula used shown below.
4. **Use Quick Tools** — Switch to the tip calculator, discount calculator, or grade calculator tabs for specialized workflows.
5. **Copy Result** — Click the result to copy it to your clipboard.

## 💡 Common Use Cases

### Shopping & Discounts
"This shirt is ₹1,200 with a 30% discount — how much do I pay?" Enter 30% of 1200 to get ₹360 off, final price ₹840. The discount calculator shows both at once.

### Academic Grading
"I scored 72 out of 85 on the exam — what's my percentage?" The grade calculator instantly shows 84.7%, along with the letter grade equivalent.

### Business & Finance
Calculate profit margins, markup percentages, tax amounts, and commission rates. The percentage change mode helps track month-over-month revenue growth.

### Tip Calculation
Dining out in a group? Enter the bill amount, tip percentage (15-20%), and number of people. The calculator shows per-person amount including tip.

### Data Analysis
Calculate percentage distributions, growth rates, and proportional changes in datasets. Essential for reporting KPIs like conversion rates, churn rates, and user growth.

## 🎯 Why Choose CodelithLabs Percentage Calculator?

### Shows the Math
Unlike calculators that just output a number, ours displays the formula: `30% of 1200 = (30/100) × 1200 = 360`. Perfect for students learning and professionals documenting calculations.

### All Percentage Operations in One Tool
No need to Google a different calculator for each type. "X% of Y", "what % is X of Y", "% change", and reverse percentages are all in one interface with mode switching.

### India-Focused Features
Handles Indian numbering format (lakhs and crores with commas in the right places: 1,00,000 instead of 100,000), GST calculations (5%, 12%, 18%, 28% slabs), and ₹ currency formatting.

## 🔧 Technical Details

### Formulas Used
| Operation | Formula |
|-----------|---------|
| X% of Y | `(X / 100) × Y` |
| X is what % of Y | `(X / Y) × 100` |
| % change from X to Y | `((Y - X) / X) × 100` |
| Increase Y by X% | `Y × (1 + X/100)` |
| Decrease Y by X% | `Y × (1 - X/100)` |
| Reverse: Before X% increase | `Y / (1 + X/100)` |

### Precision
All calculations use JavaScript's `Number` type (64-bit IEEE 754 double-precision floating point). Results are accurate to 15 significant digits and displayed rounded to the precision you select.

### Edge Case Handling
- Division by zero shows "Undefined" instead of crashing
- Very large numbers (trillions+) are formatted in scientific notation
- Negative percentages are supported for decrease calculations

## 📝 Best Practices

1. **Watch for percentage vs. percentage point** — "Increased from 10% to 15%" is a 5 percentage point increase but a 50% increase. This calculator handles both — choose the right mode.
2. **Use reverse percentage for original prices** — If a discounted price is ₹800 after 20% off, the original was ₹800 / 0.80 = ₹1,000, not ₹800 + 20% = ₹960.
3. **Round appropriately** — Financial calculations typically round to 2 decimal places. Academic grades usually round to 1.
4. **Double-check direction** — "Percentage change from X to Y" gives positive for increase and negative for decrease. Make sure X is the old value and Y is the new value.

## ❓ Frequently Asked Questions

### What's the difference between percentage and percentage point?
If interest rate goes from 5% to 7%, that's a 2 **percentage point** increase but a 40% **percentage** increase (2/5 × 100). Context matters — finance usually uses percentage points; marketing usually uses percentage.

### How do I calculate reverse percentage?
If a value of 600 represents 75% of the original, the original is `600 / (75/100) = 800`. Use the "reverse percentage" mode in our calculator.

### Can I calculate compound percentages?
For compound interest, use our [Compound Interest Calculator](/tools/compound-interest-calculator). This tool handles single-step percentage operations.

### Why does 50% increase followed by 50% decrease not return to the original?
Because percentages are relative. 50% increase on 100 = 150. Then 50% decrease on 150 = 75, not 100. The decrease is calculated on the larger number.

### Does it handle negative percentages?
Yes. Negative percentages represent decreases. "-20% of 500" returns -100, meaning a reduction of 100 from 500.

## 🌟 Related Tools

- [Compound Interest Calculator](/tools/compound-interest-calculator) — Calculate compound growth over time
- [Loan EMI Calculator](/tools/loan-calculator) — Calculate monthly loan payments
- [BMI Calculator](/tools/bmi-calculator) — Calculate Body Mass Index
- [Profit Margin Calculator](/tools/profit-margin-calculator) — Calculate business margins
- [Break-Even Calculator](/tools/breakeven-calculator) — Find your break-even point
