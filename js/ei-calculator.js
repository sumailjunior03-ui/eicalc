/**
 * ei-calculator.js — EICalc.ca Calculator Logic
 * All calculations driven by EI_CONFIG from ei-config.js
 */
(function () {
  "use strict";

  const C = EI_CONFIG;

  // ── Derive required hours from unemployment rate ────────────────────────────
  function getRequiredHours(unemploymentRate) {
    for (const band of C.hoursBands) {
      if (unemploymentRate <= band.maxRate) {
        return band.requiredHours;
      }
    }
    return 420;
  }

  // ── Get unemployment rate band index (0-11) for benefit weeks lookup ────────
  function getRateBandIndex(rate) {
    if (rate <= 6.0) return 0;
    if (rate <= 7.0) return 1;
    if (rate <= 8.0) return 2;
    if (rate <= 9.0) return 3;
    if (rate <= 10.0) return 4;
    if (rate <= 11.0) return 5;
    if (rate <= 12.0) return 6;
    if (rate <= 13.0) return 7;
    if (rate <= 14.0) return 8;
    if (rate <= 15.0) return 9;
    if (rate <= 16.0) return 10;
    return 11;
  }

  // ── Look up benefit weeks from matrix ───────────────────────────────────────
  function getBenefitWeeks(hoursWorked, unemploymentRate) {
    const colIndex = getRateBandIndex(unemploymentRate);
    for (const row of C.benefitWeeks) {
      if (hoursWorked >= row[0] && hoursWorked <= row[1]) {
        return row[2 + colIndex];
      }
    }
    // If hours exceed the last band (1820+)
    if (hoursWorked >= 1820) {
      return C.benefitWeeks[C.benefitWeeks.length - 1][2 + colIndex];
    }
    return 0;
  }

  // ── Find region by city or province search ──────────────────────────────────
  function findRegion(query) {
    if (!query) return null;
    const q = query.toLowerCase().trim();

    // First: search aliases (city names)
    for (const region of C.regions) {
      if (region.aliases.some(a => a === q || a.includes(q) || q.includes(a))) {
        return region;
      }
    }

    // Second: search region name
    for (const region of C.regions) {
      if (region.name.toLowerCase().includes(q)) {
        return region;
      }
    }

    // Third: province code or name → default region
    const provinceNames = {
      "bc": "BC", "british columbia": "BC",
      "ab": "AB", "alberta": "AB",
      "sk": "SK", "saskatchewan": "SK",
      "mb": "MB", "manitoba": "MB",
      "on": "ON", "ontario": "ON",
      "qc": "QC", "quebec": "QC", "québec": "QC",
      "nb": "NB", "new brunswick": "NB",
      "ns": "NS", "nova scotia": "NS",
      "pe": "PE", "prince edward island": "PE",
      "nl": "NL", "newfoundland": "NL", "newfoundland and labrador": "NL",
      "nt": "NT", "northwest territories": "NT",
      "yt": "YT", "yukon": "YT",
      "nu": "NU", "nunavut": "NU"
    };

    const provCode = provinceNames[q];
    if (provCode && C.provinceDefault[provCode]) {
      return C.regions.find(r => r.id === C.provinceDefault[provCode]);
    }

    return null;
  }

  // ── Calculate weekly benefit ────────────────────────────────────────────────
  function calculateWeeklyBenefit(averageWeeklyEarnings) {
    const raw = averageWeeklyEarnings * C.benefitRate;
    return Math.min(raw, C.maxWeeklyBenefit);
  }

  // ── Full calculation ───────────────────────────────────────────────────────
  function calculate(locationQuery, hoursWorked, averageWeeklyEarnings) {
    const region = findRegion(locationQuery);
    if (!region) {
      return { error: "REGION_NOT_FOUND", region: null };
    }

    const rate = region.unemploymentRate;
    const requiredHours = getRequiredHours(rate);
    const eligible = hoursWorked >= requiredHours;
    const benefitWeeks = eligible ? getBenefitWeeks(hoursWorked, rate) : 0;
    const weeklyBenefit = eligible ? calculateWeeklyBenefit(averageWeeklyEarnings) : 0;
    const totalBenefits = weeklyBenefit * benefitWeeks;

    return {
      region: region,
      unemploymentRate: rate,
      requiredHours: requiredHours,
      hoursWorked: hoursWorked,
      eligible: eligible,
      weeklyBenefit: Math.round(weeklyBenefit * 100) / 100,
      benefitWeeks: benefitWeeks,
      totalBenefits: Math.round(totalBenefits * 100) / 100,
      maxWeeklyBenefit: C.maxWeeklyBenefit,
      benefitRate: C.benefitRate
    };
  }

  // ── Region suggestions for autocomplete ─────────────────────────────────────
  function suggestRegions(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase().trim();
    const results = [];

    for (const region of C.regions) {
      const nameMatch = region.name.toLowerCase().includes(q);
      const aliasMatch = region.aliases.some(a => a.includes(q));
      if (nameMatch || aliasMatch) {
        results.push({
          id: region.id,
          name: region.name,
          province: region.province,
          rate: region.unemploymentRate,
          requiredHours: getRequiredHours(region.unemploymentRate)
        });
      }
      if (results.length >= 8) break;
    }
    return results;
  }

  // ── Format helpers ─────────────────────────────────────────────────────────
  function fmt(n) {
    return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function fmtInt(n) {
    return n.toLocaleString("en-CA");
  }

  // ── Expose ──────────────────────────────────────────────────────────────────
  window.EICalc = {
    calculate,
    findRegion,
    suggestRegions,
    getRequiredHours,
    getBenefitWeeks,
    calculateWeeklyBenefit,
    fmt,
    fmtInt
  };
})();
