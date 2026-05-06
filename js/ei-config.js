/**
 * ei-config.js — EICalc.ca Central Configuration
 * Single source of truth for all EI rate parameters, regions, and benefit logic.
 * Tax Year: 2026
 *
 * TO UPDATE REGIONAL RATES:
 *   1. Download latest from StatCan Table 14100354
 *   2. Update each region's unemploymentRate
 *   3. Update lastRatesUpdated to the effective month/year
 *   4. No other changes required — hours are derived dynamically
 */
const EI_CONFIG = {

  // ── Dates ──────────────────────────────────────────────────────────────────
  lastRatesUpdated: "April 2026",
  lastLegalReview: "March 2026",

  // ── Global Constants (2026) ────────────────────────────────────────────────
  employeeRate: 0.0163,
  employerMultiplier: 1.4,
  get employerRate() { return parseFloat((this.employeeRate * this.employerMultiplier).toFixed(4)); },
  maxInsurableEarnings: 68900,
  maxEmployeeContribution: 1123.07,
  get maxEmployerContribution() { return parseFloat((this.maxEmployeeContribution * this.employerMultiplier).toFixed(2)); },
  benefitRate: 0.55,
  maxWeeklyBenefit: 729,

  // ── Hours Threshold Bands ──────────────────────────────────────────────────
  // Maps unemployment rate to required insurable hours (no violation)
  hoursBands: [
    { maxRate: 6.0,  requiredHours: 700 },
    { maxRate: 7.0,  requiredHours: 665 },
    { maxRate: 8.0,  requiredHours: 630 },
    { maxRate: 9.0,  requiredHours: 595 },
    { maxRate: 10.0, requiredHours: 560 },
    { maxRate: 11.0, requiredHours: 525 },
    { maxRate: 12.0, requiredHours: 490 },
    { maxRate: 13.0, requiredHours: 455 },
    { maxRate: Infinity, requiredHours: 420 }
  ],

  // ── Benefit Weeks Matrix (41 rows × 12 columns) ───────────────────────────
  // Source: Service Canada — Number of weeks of EI regular benefits payable
  // Columns: rate bands A–L (6%&under through 16%&over)
  // Rows: insurable hours bands
  benefitWeeks: [
    // [hoursMin, hoursMax, A,  B,  C,  D,  E,  F,  G,  H,  I,  J,  K,  L]
    [420,   454,   0,  0,  0,  0,  0,  0,  0,  0, 26, 28, 30, 32],
    [455,   489,   0,  0,  0,  0,  0,  0,  0, 24, 26, 28, 30, 32],
    [490,   524,   0,  0,  0,  0,  0,  0, 23, 25, 27, 29, 31, 33],
    [525,   559,   0,  0,  0,  0,  0, 21, 23, 25, 27, 29, 31, 33],
    [560,   594,   0,  0,  0,  0, 20, 22, 24, 26, 28, 30, 32, 34],
    [595,   629,   0,  0,  0, 18, 20, 22, 24, 26, 28, 30, 32, 34],
    [630,   664,   0,  0, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
    [665,   699,   0, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
    [700,   734,  14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
    [735,   769,  14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
    [770,   804,  15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37],
    [805,   839,  15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37],
    [840,   874,  16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38],
    [875,   909,  16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38],
    [910,   944,  17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39],
    [945,   979,  17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39],
    [980,  1014,  18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
    [1015, 1049,  18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
    [1050, 1084,  19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41],
    [1085, 1119,  19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41],
    [1120, 1154,  20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42],
    [1155, 1189,  20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42],
    [1190, 1224,  21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43],
    [1225, 1259,  21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43],
    [1260, 1294,  22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44],
    [1295, 1329,  22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44],
    [1330, 1364,  23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45],
    [1365, 1399,  23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45],
    [1400, 1434,  24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 45],
    [1435, 1469,  25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 45],
    [1470, 1504,  26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 45, 45],
    [1505, 1539,  27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 45, 45],
    [1540, 1574,  28, 30, 32, 34, 36, 38, 40, 42, 44, 45, 45, 45],
    [1575, 1609,  29, 31, 33, 35, 37, 39, 41, 43, 45, 45, 45, 45],
    [1610, 1644,  30, 32, 34, 36, 38, 40, 42, 44, 45, 45, 45, 45],
    [1645, 1679,  31, 33, 35, 37, 39, 41, 43, 45, 45, 45, 45, 45],
    [1680, 1714,  32, 34, 36, 38, 40, 42, 44, 45, 45, 45, 45, 45],
    [1715, 1749,  33, 35, 37, 39, 41, 43, 45, 45, 45, 45, 45, 45],
    [1750, 1784,  34, 36, 38, 40, 42, 44, 45, 45, 45, 45, 45, 45],
    [1785, 1819,  35, 37, 39, 41, 43, 45, 45, 45, 45, 45, 45, 45],
    [1820, Infinity, 36, 38, 40, 42, 44, 45, 45, 45, 45, 45, 45, 45]
  ],

  // ── EI Economic Regions (62 from StatCan) ──────────────────────────────────
  // id: short identifier, name: display name, province: 2-letter code
  // unemploymentRate: current rate from StatCan (updated monthly)
  // aliases: city names that map to this region (for user search)
  regions: [
    { id: "abbotsford", name: "Abbotsford", province: "BC", unemploymentRate: 5.8, aliases: ["abbotsford", "mission"] },
    { id: "calgary", name: "Calgary", province: "AB", unemploymentRate: 6.9, aliases: ["calgary", "airdrie"] },
    { id: "central-ontario", name: "Central Ontario", province: "ON", unemploymentRate: 6.3, aliases: ["barrie", "peterborough", "central ontario"] },
    { id: "central-quebec", name: "Central Quebec", province: "QC", unemploymentRate: 4.2, aliases: ["drummondville", "victoriaville", "central quebec"] },
    { id: "charlottetown", name: "Charlottetown", province: "PE", unemploymentRate: 6.3, aliases: ["charlottetown", "pei", "prince edward island"] },
    { id: "chicoutimi", name: "Chicoutimi-Jonquière", province: "QC", unemploymentRate: 2.9, aliases: ["chicoutimi", "jonquiere", "saguenay"] },
    { id: "eastern-nova-scotia", name: "Eastern Nova Scotia", province: "NS", unemploymentRate: 10.6, aliases: ["cape breton", "sydney", "glace bay", "eastern nova scotia"] },
    { id: "eastern-ontario", name: "Eastern Ontario", province: "ON", unemploymentRate: 4.3, aliases: ["cornwall", "brockville", "pembroke", "eastern ontario"] },
    { id: "edmonton", name: "Edmonton", province: "AB", unemploymentRate: 6.4, aliases: ["edmonton", "st albert", "sherwood park", "leduc"] },
    { id: "fredericton-moncton-sj", name: "Fredericton-Moncton-Saint John", province: "NB", unemploymentRate: 6.4, aliases: ["fredericton", "moncton", "saint john", "new brunswick"] },
    { id: "gaspesie", name: "Gaspésie-Îles-de-la-Madeleine", province: "QC", unemploymentRate: 7.0, aliases: ["gaspé", "gaspesie", "iles de la madeleine"] },
    { id: "halifax", name: "Halifax", province: "NS", unemploymentRate: 6.0, aliases: ["halifax", "dartmouth"] },
    { id: "hamilton", name: "Hamilton", province: "ON", unemploymentRate: 6.3, aliases: ["hamilton", "burlington", "stoney creek"] },
    { id: "hull", name: "Hull", province: "QC", unemploymentRate: 6.4, aliases: ["hull", "gatineau", "outaouais"] },
    { id: "huron", name: "Huron", province: "ON", unemploymentRate: 7.1, aliases: ["huron", "goderich", "exeter"] },
    { id: "iqaluit", name: "Iqaluit", province: "NU", unemploymentRate: 5.7, aliases: ["iqaluit"] },
    { id: "kingston", name: "Kingston", province: "ON", unemploymentRate: 5.8, aliases: ["kingston", "belleville"] },
    { id: "kitchener", name: "Kitchener", province: "ON", unemploymentRate: 8.2, aliases: ["kitchener", "waterloo", "cambridge", "guelph"] },
    { id: "london", name: "London", province: "ON", unemploymentRate: 9.0, aliases: ["london", "st thomas", "woodstock"] },
    { id: "lower-st-lawrence", name: "Lower Saint Lawrence and North Shore", province: "QC", unemploymentRate: 5.2, aliases: ["rimouski", "sept-iles", "baie-comeau", "lower st lawrence"] },
    { id: "madawaska-charlotte", name: "Madawaska-Charlotte", province: "NB", unemploymentRate: 5.9, aliases: ["edmundston", "madawaska", "charlotte"] },
    { id: "montreal", name: "Montreal", province: "QC", unemploymentRate: 6.8, aliases: ["montreal", "montréal", "laval", "longueuil"] },
    { id: "monteregie", name: "Montérégie", province: "QC", unemploymentRate: 4.0, aliases: ["monteregie", "brossard", "saint-jean-sur-richelieu", "sorel"] },
    { id: "newfoundland-labrador", name: "Newfoundland and Labrador", province: "NL", unemploymentRate: 10.3, aliases: ["newfoundland", "labrador"] },
    { id: "niagara", name: "Niagara", province: "ON", unemploymentRate: 7.3, aliases: ["niagara", "st catharines", "niagara falls", "welland"] },
    { id: "northwestern-quebec", name: "North Western Quebec", province: "QC", unemploymentRate: 3.9, aliases: ["rouyn-noranda", "val-d'or", "northwestern quebec"] },
    { id: "northern-alberta", name: "Northern Alberta", province: "AB", unemploymentRate: 9.6, aliases: ["fort mcmurray", "grande prairie", "northern alberta"] },
    { id: "northern-bc", name: "Northern British Columbia", province: "BC", unemploymentRate: 10.1, aliases: ["prince george", "terrace", "northern bc"] },
    { id: "northern-manitoba", name: "Northern Manitoba", province: "MB", unemploymentRate: 27.8, aliases: ["thompson", "churchill", "northern manitoba"] },
    { id: "northern-ontario", name: "Northern Ontario", province: "ON", unemploymentRate: 7.5, aliases: ["timmins", "north bay", "kenora", "northern ontario"] },
    { id: "northern-saskatchewan", name: "Northern Saskatchewan", province: "SK", unemploymentRate: 14.2, aliases: ["prince albert", "la ronge", "northern saskatchewan"] },
    { id: "northwest-territories", name: "Northwest Territories", province: "NT", unemploymentRate: 8.0, aliases: ["northwest territories", "nwt"] },
    { id: "nunavut", name: "Nunavut", province: "NU", unemploymentRate: 16.6, aliases: ["nunavut", "rankin inlet", "cambridge bay"] },
    { id: "oshawa", name: "Oshawa", province: "ON", unemploymentRate: 7.7, aliases: ["oshawa", "whitby", "ajax", "pickering"] },
    { id: "ottawa", name: "Ottawa", province: "ON", unemploymentRate: 6.6, aliases: ["ottawa", "kanata", "orleans", "nepean"] },
    { id: "pei", name: "Prince Edward Island", province: "PE", unemploymentRate: 9.0, aliases: ["prince edward island", "summerside"] },
    { id: "quebec-city", name: "Quebec", province: "QC", unemploymentRate: 2.8, aliases: ["quebec city", "québec", "lévis"] },
    { id: "regina", name: "Regina", province: "SK", unemploymentRate: 6.1, aliases: ["regina", "moose jaw"] },
    { id: "restigouche-albert", name: "Restigouche-Albert", province: "NB", unemploymentRate: 9.9, aliases: ["bathurst", "campbellton", "restigouche"] },
    { id: "saskatoon", name: "Saskatoon", province: "SK", unemploymentRate: 5.2, aliases: ["saskatoon", "martensville"] },
    { id: "sherbrooke", name: "Sherbrooke", province: "QC", unemploymentRate: 4.5, aliases: ["sherbrooke", "magog"] },
    { id: "south-central-ontario", name: "South Central Ontario", province: "ON", unemploymentRate: 5.6, aliases: ["owen sound", "bruce peninsula", "south central ontario"] },
    { id: "south-central-quebec", name: "South Central Quebec", province: "QC", unemploymentRate: 2.5, aliases: ["thetford mines", "south central quebec"] },
    { id: "southern-alberta", name: "Southern Alberta", province: "AB", unemploymentRate: 6.8, aliases: ["lethbridge", "medicine hat", "southern alberta"] },
    { id: "southern-coastal-bc", name: "Southern Coastal British Columbia", province: "BC", unemploymentRate: 6.4, aliases: ["nanaimo", "southern coastal bc"] },
    { id: "southern-interior-bc", name: "Southern Interior British Columbia", province: "BC", unemploymentRate: 7.9, aliases: ["kelowna", "kamloops", "vernon", "penticton"] },
    { id: "southern-manitoba", name: "Southern Manitoba", province: "MB", unemploymentRate: 6.5, aliases: ["brandon", "steinbach", "southern manitoba"] },
    { id: "southern-saskatchewan", name: "Southern Saskatchewan", province: "SK", unemploymentRate: 5.6, aliases: ["swift current", "yorkton", "southern saskatchewan"] },
    { id: "st-catharines", name: "St. Catharines", province: "ON", unemploymentRate: 6.7, aliases: ["st catharines", "st. catharines", "grimsby"] },
    { id: "st-johns", name: "St. John's", province: "NL", unemploymentRate: 6.7, aliases: ["st john's", "st. john's", "mount pearl", "conception bay"] },
    { id: "sudbury", name: "Sudbury", province: "ON", unemploymentRate: 5.6, aliases: ["sudbury", "greater sudbury"] },
    { id: "thunder-bay", name: "Thunder Bay", province: "ON", unemploymentRate: 6.1, aliases: ["thunder bay"] },
    { id: "toronto", name: "Toronto", province: "ON", unemploymentRate: 8.1, aliases: ["toronto", "mississauga", "brampton", "scarborough", "north york", "etobicoke", "markham", "vaughan", "richmond hill"] },
    { id: "trois-rivieres", name: "Trois-Rivières", province: "QC", unemploymentRate: 4.4, aliases: ["trois-rivières", "trois rivieres", "shawinigan"] },
    { id: "vancouver", name: "Vancouver", province: "BC", unemploymentRate: 6.3, aliases: ["vancouver", "burnaby", "surrey", "richmond", "delta", "coquitlam"] },
    { id: "victoria", name: "Victoria", province: "BC", unemploymentRate: 4.9, aliases: ["victoria", "saanich", "esquimalt"] },
    { id: "western-nova-scotia", name: "Western Nova Scotia", province: "NS", unemploymentRate: 6.6, aliases: ["yarmouth", "digby", "annapolis", "western nova scotia"] },
    { id: "whitehorse", name: "Whitehorse", province: "YT", unemploymentRate: 4.5, aliases: ["whitehorse"] },
    { id: "windsor", name: "Windsor", province: "ON", unemploymentRate: 8.9, aliases: ["windsor", "chatham", "leamington"] },
    { id: "winnipeg", name: "Winnipeg", province: "MB", unemploymentRate: 6.3, aliases: ["winnipeg", "selkirk"] },
    { id: "yellowknife", name: "Yellowknife", province: "NT", unemploymentRate: 4.7, aliases: ["yellowknife"] },
    { id: "yukon", name: "Yukon", province: "YT", unemploymentRate: 6.1, aliases: ["yukon", "dawson city", "watson lake"] }
  ],

  // ── Province → Region Fallback ─────────────────────────────────────────────
  // When user selects a province without a specific city, use the most populous region
  provinceDefault: {
    "BC": "vancouver",
    "AB": "calgary",
    "SK": "saskatoon",
    "MB": "winnipeg",
    "ON": "toronto",
    "QC": "montreal",
    "NB": "fredericton-moncton-sj",
    "NS": "halifax",
    "PE": "charlottetown",
    "NL": "st-johns",
    "NT": "yellowknife",
    "YT": "whitehorse",
    "NU": "iqaluit"
  }
};
