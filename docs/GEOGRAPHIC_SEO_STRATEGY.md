# Geographic SEO Strategy

## Overview
This document outlines CodelithLabs' geographic targeting strategy and multilingual expansion roadmap for improved search visibility in India and future international markets.

---

## Current Implementation (March 2026)

### India-Specific Tool Targeting

**Status:** ✅ **LIVE**

16 India-specific tools now include `"availableInCountry": "IN"` in their Schema.org structured data:

1. `tax-calculator-india` — Income Tax Calculator (Old/New Regime)
2. `salary-calculator` — CTC to In-Hand Salary (PF, HRA, India)
3. `investment-comparator` — FD, PPF, NPS, Gold, Nifty 50
4. `gold-silver-calculator` — GST + Making Charges
5. `retirement-calculator` — India Retirement Corpus Planning
6. `capital-gains-tax` — LTCG/STCG (12.5% rate, India)
7. `gst-calculator-india` — CGST/SGST/IGST Breakdown
8. `ppf-calculator` — Public Provident Fund (India)
9. `sip-stepup-calculator` — SIP with Annual Step-Up (India)
10. `fd-calculator-india` — Fixed Deposit with TDS
11. `gratuity-calculator-india` — Indian Employment Law
12. `nps-calculator-india` — National Pension Scheme
13. `car-loan-emi-calculator-india` — HDFC, SBI, ICICI Rates
14. `home-loan-calculator-india` — Housing Loan Eligibility
15. `income-tax-calculator-india` — FY 2024-25 Tax Calculator
16. `sip-calculator-india` — Mutual Fund SIP Returns

**Technical Details:**
- **File:** `src/app/tools/[slug]/page.tsx`
- **Constant:** `INDIA_SPECIFIC_TOOLS`
- **Schema Property:** `availableInCountry: "IN"` (ISO 3166-1 alpha-2 code)
- **Search Engine Impact:** Helps Google understand tool relevance for India-based queries

**Expected Benefits:**
- Improved rankings for "India" + tool keyword queries
- Better local search visibility in Google India (`google.co.in`)
- Enhanced relevance signals for geo-specific SERP features
- Foundation for future country-level expansions

---

## Future Expansion: Hreflang for Hindi Localization

### Hreflang Readiness Assessment

**Status:** 🔄 **PLANNED** (Q2 2026)

CodelithLabs is prepared for Hindi (`hi-IN`) localization with the following infrastructure:

#### 1. Hreflang Tag Structure (Ready to Implement)

```html
<!-- English (Default) -->
<link rel="alternate" hreflang="en" href="https://codelithlabs.in/tools/tax-calculator-india/" />
<link rel="alternate" hreflang="en-IN" href="https://codelithlabs.in/tools/tax-calculator-india/" />

<!-- Hindi (Future) -->
<link rel="alternate" hreflang="hi" href="https://codelithlabs.in/hi/tools/tax-calculator-india/" />
<link rel="alternate" hreflang="hi-IN" href="https://codelithlabs.in/hi/tools/tax-calculator-india/" />

<!-- x-default fallback -->
<link rel="alternate" hreflang="x-default" href="https://codelithlabs.in/tools/tax-calculator-india/" />
```

#### 2. Next.js i18n Configuration (Pending)

**File:** `next.config.mjs`

```javascript
const nextConfig = {
  i18n: {
    locales: ['en', 'hi'],
    defaultLocale: 'en',
    localeDetection: true, // Auto-detect from Accept-Language header
  },
  // ... rest of config
};
```

#### 3. URL Structure Strategy

**Option A: Path-based (Recommended)**
- English: `codelithlabs.in/tools/tax-calculator-india/`
- Hindi: `codelithlabs.in/hi/tools/tax-calculator-india/`

**Option B: Subdomain-based**
- English: `codelithlabs.in/tools/...`
- Hindi: `hi.codelithlabs.in/tools/...`

**Decision:** Path-based for easier maintenance, shared CDN caching, and single SSL certificate.

#### 4. Priority Tools for Hindi Translation

**Phase 1 (Top 5 Most-Searched India Tools):**
1. `tax-calculator-india` — Income Tax Calculator
2. `gst-calculator-india` — GST Calculator
3. `salary-calculator` — CTC to In-Hand Salary
4. `ppf-calculator` — PPF Calculator
5. `home-loan-calculator-india` — Home Loan EMI

**Phase 2 (Next 11 India-Specific Tools):**
6-16. Remaining India-specific tools from current list

**Phase 3 (Global Tools with India Traction):**
- Age Calculator
- Password Generator
- Expense Splitter
- (Data-driven selection based on `/hi/` traffic analytics)

#### 5. Content Translation Strategy

**UI Components:**
- Navbar, Footer, CTA buttons → JSON translation files
- Error messages, tooltips → i18n library (e.g., `next-intl`, `react-i18next`)

**Tool Pages:**
- Tool name, description, keywords → Translated manually (SEO-optimized)
- Blog posts → Selective translation (high-traffic posts first)
- Legal pages → Professional legal translation required

**Dynamic Content:**
- Number formatting: `12,34,567.89` (Indian numbering system for Hindi)
- Date formatting: `DD/MM/YYYY` (Indian standard)
- Currency: `₹` symbol (already used)

#### 6. Technical Implementation Checklist

- [ ] Add `next-intl` or `react-i18next` library
- [ ] Create `/messages/hi.json` for Hindi UI strings
- [ ] Update `src/app/tools/[slug]/page.tsx` to generate hreflang tags
- [ ] Modify `src/lib/tools-registry.ts` to support multilingual tool metadata
- [ ] Create `/src/app/[locale]/tools/[slug]/page.tsx` route structure
- [ ] Update sitemap to include `/hi/*` URLs
- [ ] Add language switcher to Navbar
- [ ] Configure Google Search Console for Hindi locale
- [ ] Set up Bing Webmaster Tools for Hindi language targeting

#### 7. SEO Considerations

**Canonical Tags:**
- Each language version should have a self-referencing canonical
- Avoid canonical pointing from Hindi to English (signals low-quality translation)

**Structured Data:**
- Duplicate JSON-LD for both languages with `inLanguage: "hi"` property
- Keep tool functionality descriptions translated accurately

**Meta Tags:**
- Fully translate `title`, `description`, `og:title`, `og:description`
- Use Hindi keywords in `keywords` meta tag for `/hi/*` pages

---

## State-Level Targeting: Assam-Specific Calculators

### Current Scope

CodelithLabs is headquartered in **Kokrajhar, Assam, India**. While no tools are currently Assam-exclusive, future state-level targeting could include:

#### Potential Assam-Specific Tools

1. **Property Tax Calculator (Assam)**
   - Guwahati Municipal Corporation (GMC) tax rates
   - Different rates for Jorhat, Dibrugarh, Tezpur, Silchar

2. **Vehicle Tax Calculator (Assam)**
   - Road tax for Assam Transport Department
   - Registration charges for new vehicles in Assam

3. **Electricity Bill Calculator (Assam)**
   - APDCL (Assam Power Distribution Company Limited) tariff structures
   - Domestic, commercial, industrial slab rates

4. **Ration Card Application Fee Calculator (Assam)**
   - APL, BPL, AAY ration card requirements

5. **Land Registration Fee Calculator (Assam)**
   - Stamp duty and registration charges for property in Assam

#### Implementation Notes

**Geographic Targeting:**
- Add `"areaServed": {"@type": "State", "name": "Assam"}` to structured data
- Use `availableInCountry: "IN"` + `areaServed: [{name: "Assam", @type: "State"}]`

**URL Structure:**
- `/tools/property-tax-calculator-assam/`
- `/tools/electricity-bill-calculator-assam/`

**Schema Example:**

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Property Tax Calculator (Assam)",
  "availableInCountry": "IN",
  "areaServed": {
    "@type": "State",
    "name": "Assam",
    "containedInPlace": {
      "@type": "Country",
      "name": "India"
    }
  }
}
```

**SEO Strategy:**
- Target long-tail keywords: "assam property tax calculator", "guwahati vehicle tax"
- Build local backlinks: Assam government portals, local news sites, edu domains
- Create Assam-focused blog content: "How to Calculate Property Tax in Guwahati 2026"

---

## International Expansion Roadmap

### Phase 1: India Focus (Current)
- ✅ 16 India-specific tools with geographic targeting
- 🔄 Hindi localization (Q2 2026)
- 🔄 Assam state-level tools (Q3 2026)

### Phase 2: South Asia
- Pakistan (`pk`, Urdu translation)
- Bangladesh (`bd`, Bengali translation)
- Sri Lanka (`lk`)

### Phase 3: Southeast Asia
- Philippines (`ph`)
- Indonesia (`id`, Bahasa Indonesia)
- Malaysia (`my`)

### Phase 4: Global
- USA, UK, Australia (already covered by English)
- Spanish-speaking markets (`es`, `mx`, `ar`)
- Arabic-speaking markets (`ar`, `sa`, `eg`)

---

## Analytics & Monitoring

### Key Metrics to Track

1. **Geographic Traffic Distribution**
   - India vs. Global traffic share
   - State-level breakdown (Assam, Maharashtra, Karnataka, etc.)

2. **Language Preference**
   - Browser language detection (`Accept-Language` header)
   - Manual language switcher usage (post-Hindi launch)

3. **Tool Performance by Country**
   - India-specific tool engagement vs. global tools
   - Conversion rates for premium (if applicable)

4. **Search Console Data**
   - Query keyword rankings by country
   - CTR for India-targeted queries
   - Impressions for `/hi/*` pages (post-Hindi launch)

### Recommended Tools

- **Google Analytics 4:** Country/language report + custom events for language switcher
- **Google Search Console:** Multi-property setup for `/hi/` subdirectory
- **Cloudflare Analytics:** Edge request distribution by country
- **Hotjar/Microsoft Clarity:** Heatmaps for language switcher usage

---

## Maintenance & Updates

### Regular Tasks

1. **Quarterly Review:**
   - Add new India-specific tools to `INDIA_SPECIFIC_TOOLS` constant
   - Update Assam-specific tool rates (property tax, vehicle tax, electricity tariffs)

2. **Annual Review:**
   - Audit hreflang tag accuracy (Google Search Console → International Targeting)
   - Review country-level traffic trends and expand to new geographies

3. **Translation Updates:**
   - Sync UI changes to Hindi translation files
   - Update tool descriptions when keywords change

---

## Contact & Ownership

**Document Owner:** Prasanta Ray (CEO & Founder)  
**Last Updated:** March 10, 2026  
**Next Review:** June 10, 2026 (Q2 2026 — Hindi Launch Readiness)

For questions or expansion suggestions, contact: [team@codelithlabs.in](mailto:team@codelithlabs.in)
