const DEFAULT_FILTERS = {
  minYear: 2015,
  maxYear: 2022,
  maxKm: 150000,
  searchText: "",
  auctionSite: "all",
  resultMode: "qualified",
};

const STORAGE_KEY = "auctionBuyerStateV1";
const TARGET_COMP_COUNT = 10;

const DEFAULT_BUYING_COSTS = {
  fixedProfit: 3000,
  recon: 1200,
  auctionFees: 800,
  cleanStretch: 1000,
};

const COMP_RESEARCH_ENDPOINTS = [
  "/api/research-comps",
  "/.netlify/functions/research-comps",
];

const CARFAX_CATEGORY_FIELDS = [
  ["accidentDamage", "Accident/damage"],
  ["claims", "Claims"],
  ["rentalFleet", "Rental/fleet"],
  ["serviceRecords", "Service records"],
  ["usHistory", "U.S. history"],
  ["openRecalls", "Open recalls"],
  ["titleIssue", "Title issue"],
];

const DAMAGE_CHECK_FIELDS = [
  ["front", "Front"],
  ["rear", "Rear"],
  ["leftSide", "Left side"],
  ["rightSide", "Right side"],
  ["roof", "Roof"],
  ["interior", "Interior"],
  ["structural", "Structural concern"],
];

const OVERRIDE_REASONS = [
  ["", "No override"],
  ["local-demand", "Local demand"],
  ["mileage-concern", "Mileage concern"],
  ["condition-concern", "Condition concern"],
  ["price-too-high", "Price too high"],
  ["segment-needed", "Need this segment"],
  ["gut-experience", "Gut / experience"],
  ["other", "Other"],
];

const BID_STATUS_LABELS = {
  "no-bid": { label: "No bid submitted", className: "neutral" },
  "not-started": { label: "No bid submitted", className: "neutral" },
  submitted: { label: "Bid submitted", className: "warn" },
  won: { label: "Won", className: "good" },
  lost: { label: "Lost", className: "bad" },
  purchased: { label: "Purchased", className: "good" },
  sold: { label: "Sold", className: "good" },
  complete: { label: "Outcome complete", className: "good" },
};

const RECEIPT_TYPES = [
  ["auction-purchase", "Auction purchase receipt"],
  ["auction-loss", "Auction loss / result notice"],
  ["bill-of-sale", "Bill of sale"],
  ["transport", "Transport invoice"],
  ["reconditioning", "Reconditioning invoice"],
  ["repair", "Repair bill"],
  ["retail-sale", "Retail sale receipt"],
  ["fee-statement", "Fee statement"],
];

const IMPORT_FIELD_DEFINITIONS = [
  { key: "vin", label: "VIN", aliases: ["vin", "serial", "vehicleIdentificationNumber"] },
  { key: "runNumber", label: "Run #", aliases: ["runNumber", "run", "lane", "lot", "stock"] },
  { key: "year", label: "Year", aliases: ["year", "modelYear"] },
  { key: "make", label: "Make", aliases: ["make", "manufacturer"] },
  { key: "model", label: "Model", aliases: ["model"] },
  { key: "trim", label: "Trim", aliases: ["trim", "package", "series", "style"] },
  { key: "km", label: "KM", aliases: ["km", "kilometers", "odometer", "mileage"] },
  {
    key: "auctionSite",
    label: "Auction",
    aliases: ["auctionSite", "auction", "source", "platform", "sale"],
  },
  {
    key: "listingUrl",
    label: "Listing URL",
    aliases: ["listingUrl", "url", "link", "auctionUrl", "listing"],
  },
  {
    key: "marketValue",
    label: "Market value",
    aliases: ["marketValue", "retailValue", "retail", "value", "askingPrice"],
  },
  {
    key: "tradeInValue",
    label: "Trade-in",
    aliases: ["tradeInValue", "tradeIn", "wholesale"],
  },
  {
    key: "carfaxDisclosures",
    label: "CARFAX",
    aliases: ["carfaxDisclosures", "disclosures", "carfax"],
  },
  { key: "damageSeverity", label: "Damage", aliases: ["damageSeverity", "damage"] },
  {
    key: "riskFlags",
    label: "Notes",
    aliases: ["riskFlags", "notes", "announcements"],
  },
];

const rawSampleVehicles = [
  {
    vin: "2T3R1RFV8MW123456",
    runNumber: "A102",
    year: 2021,
    make: "Toyota",
    model: "RAV4",
    trim: "XLE AWD",
    km: 78200,
    retailValue: 30995,
    marketValue: 30995,
    tradeInValue: 25500,
    carfaxDisclosures: 2,
    damageSeverity: "low",
    auctionSite: "OPENLANE",
    reviewStatus: "needs-review",
    riskFlags: ["Minor bumper repaint", "One owner"],
  },
  {
    vin: "2HKRW2H87KH234567",
    runNumber: "T214",
    year: 2019,
    make: "Honda",
    model: "CR-V",
    trim: "EX-L AWD",
    km: 112400,
    retailValue: 26995,
    marketValue: 26995,
    tradeInValue: 21800,
    carfaxDisclosures: 4,
    damageSeverity: "medium",
    auctionSite: "TradeRev",
    reviewStatus: "needs-review",
    riskFlags: ["Previous rental", "Rear bumper claim"],
  },
  {
    vin: "1FMCU0GX9EUA34567",
    runNumber: "L088",
    year: 2014,
    make: "Ford",
    model: "Escape",
    trim: "SE",
    km: 132000,
    retailValue: 11995,
    marketValue: 11995,
    tradeInValue: 8200,
    carfaxDisclosures: 3,
    damageSeverity: "low",
    auctionSite: "AutoLane",
    reviewStatus: "rejected",
    riskFlags: ["Outside year rule"],
  },
  {
    vin: "1FTEW1E55LFC45678",
    runNumber: "E310",
    year: 2020,
    make: "Ford",
    model: "F-150",
    trim: "XLT 302A 4x4",
    km: 148900,
    retailValue: 38995,
    marketValue: 38995,
    tradeInValue: 32000,
    carfaxDisclosures: 7,
    damageSeverity: "medium",
    auctionSite: "EBlock",
    reviewStatus: "needs-review",
    riskFlags: ["7 CARFAX disclosures", "Tow package confirmed"],
  },
  {
    vin: "JM3KFBCM4N0567890",
    runNumber: "A441",
    year: 2022,
    make: "Mazda",
    model: "CX-5",
    trim: "GS AWD",
    km: 64000,
    retailValue: 29995,
    marketValue: 29995,
    tradeInValue: 24600,
    carfaxDisclosures: 1,
    damageSeverity: "low",
    auctionSite: "AutoLane",
    reviewStatus: "accepted",
    customBid: 24000,
    riskFlags: ["Clean title", "Good km"],
  },
  {
    vin: "5XYZUDLB2JG678901",
    runNumber: "T509",
    year: 2018,
    make: "Hyundai",
    model: "Santa Fe",
    trim: "Luxury AWD",
    km: 156800,
    retailValue: 18995,
    marketValue: 18995,
    tradeInValue: 14500,
    carfaxDisclosures: 5,
    damageSeverity: "medium",
    auctionSite: "TradeRev",
    reviewStatus: "high-risk",
    riskFlags: ["Over km rule", "Multiple claims"],
  },
];

let nextVehicleId = 1;
const savedState = loadSavedState();
let vehicles = savedState?.vehicles || rawSampleVehicles.map(withVehicleDefaults);
let selectedVehicleId = savedState?.selectedVehicleId || vehicles[0]?.id || null;
let lastImportSummary = savedState?.lastImportSummary || null;
let savedMappingPresets = savedState?.savedMappingPresets || {};
let buyingCosts = { ...DEFAULT_BUYING_COSTS, ...(savedState?.buyingCosts || {}) };
let pendingImport = null;
const autoResearchInFlight = new Set();

const els = {
  minYear: document.querySelector("#minYear"),
  maxYear: document.querySelector("#maxYear"),
  maxKm: document.querySelector("#maxKm"),
  searchText: document.querySelector("#searchText"),
  auctionSite: document.querySelector("#auctionSite"),
  resultMode: document.querySelector("#resultMode"),
  resetFilters: document.querySelector("#resetFilters"),
  resetData: document.querySelector("#resetData"),
  resetBidSettings: document.querySelector("#resetBidSettings"),
  copyAccepted: document.querySelector("#copyAccepted"),
  copyBidList: document.querySelector("#copyBidList"),
  uploadPreset: document.querySelector("#uploadPreset"),
  csvUpload: document.querySelector("#csvUpload"),
  importPreview: document.querySelector("#importPreview"),
  importFileName: document.querySelector("#importFileName"),
  importPreset: document.querySelector("#importPreset"),
  cancelImport: document.querySelector("#cancelImport"),
  applyImport: document.querySelector("#applyImport"),
  importTotal: document.querySelector("#importTotal"),
  importValid: document.querySelector("#importValid"),
  importFiltered: document.querySelector("#importFiltered"),
  importIssues: document.querySelector("#importIssues"),
  importIssuesList: document.querySelector("#importIssuesList"),
  mappingStatus: document.querySelector("#mappingStatus"),
  saveMapping: document.querySelector("#saveMapping"),
  clearMapping: document.querySelector("#clearMapping"),
  mappingFields: document.querySelector("#mappingFields"),
  importRows: document.querySelector("#importRows"),
  lastImportPanel: document.querySelector("#lastImportPanel"),
  vehicleRows: document.querySelector("#vehicleRows"),
  reviewPanel: document.querySelector("#reviewPanel"),
  valuationPanel: document.querySelector("#valuationPanel"),
  outcomePanel: document.querySelector("#outcomePanel"),
  bidRows: document.querySelector("#bidRows"),
  bidListCount: document.querySelector("#bidListCount"),
  bidListTotal: document.querySelector("#bidListTotal"),
  saveStatus: document.querySelector("#saveStatus"),
  shownCount: document.querySelector("#shownCount"),
  hiddenCount: document.querySelector("#hiddenCount"),
  acceptedCount: document.querySelector("#acceptedCount"),
  highRiskCount: document.querySelector("#highRiskCount"),
};

function withVehicleDefaults(vehicle) {
  const id = vehicle.id || `vehicle-${nextVehicleId++}`;
  const explicitRetailValue = vehicle.marketValue || vehicle.retailValue || 0;
  const compResearchStatus =
    vehicle.compResearchStatus === "loading" ? "" : vehicle.compResearchStatus || "";

  return {
    id,
    vin: vehicle.vin || "",
    runNumber: vehicle.runNumber || "",
    year: vehicle.year || 0,
    make: vehicle.make || "Unknown",
    model: vehicle.model || "Vehicle",
    trim: vehicle.trim || "",
    km: vehicle.km || 0,
    retailValue: explicitRetailValue,
    marketValue: vehicle.marketValue || vehicle.retailValue || 0,
    blackBookRetail: vehicle.blackBookVerified ? vehicle.blackBookRetail || 0 : 0,
    autoTraderAverage: vehicle.autoTraderVerified ? vehicle.autoTraderAverage || 0 : 0,
    carGurusValue: vehicle.carGurusVerified ? vehicle.carGurusValue || 0 : 0,
    postalCode: vehicle.postalCode || "N6A 1A1",
    tradeInValue: vehicle.tradeInValue || 0,
    carfaxDisclosures: vehicle.carfaxDisclosures || 0,
    carfaxCategories: vehicle.carfaxCategories || {},
    damageSeverity: vehicle.damageSeverity || "low",
    damageChecks: vehicle.damageChecks || {},
    notes: vehicle.notes || "",
    auctionSite: vehicle.auctionSite || "Unknown",
    listingUrl: vehicle.listingUrl || "",
    compResearchStatus,
    compResearchMessage:
      vehicle.compResearchStatus === "loading"
        ? "Previous comp search was interrupted. Retrying automatically."
        : vehicle.compResearchMessage || "",
    compResearchUpdatedAt: vehicle.compResearchUpdatedAt || "",
    carfaxFileName: vehicle.carfaxFileName || "",
    carfaxUploadedAt: vehicle.carfaxUploadedAt || "",
    reviewStatus: vehicle.reviewStatus || "needs-review",
    bidStatus:
      vehicle.bidStatus === "placed" || vehicle.bidStatus === "submitted"
        ? "submitted"
        : vehicle.bidStatus === "not-started"
          ? "no-bid"
          : vehicle.bidStatus || "no-bid",
    vehicleIdentityConfirmed: vehicle.vehicleIdentityConfirmed || "",
    followedRecommendation: vehicle.followedRecommendation || "",
    overrideReason: vehicle.overrideReason || "",
    dealerMaxBid: vehicle.dealerMaxBid || vehicle.customBid || 0,
    actualBid: vehicle.actualBid || 0,
    purchasePrice: vehicle.purchasePrice || 0,
    actualAuctionFees: vehicle.actualAuctionFees || 0,
    transportCost: vehicle.transportCost || 0,
    actualReconCost: vehicle.actualReconCost || 0,
    salePrice: vehicle.salePrice || 0,
    purchaseDate: vehicle.purchaseDate || "",
    saleDate: vehicle.saleDate || "",
    outcomeNotes: vehicle.outcomeNotes || "",
    receiptDocuments: vehicle.receiptDocuments || [],
    customBid: vehicle.customBid || 0,
    riskFlags: vehicle.riskFlags || [],
    comparables: normalizeComparables(vehicle.comparables, id, vehicle),
  };
}

function estimateMarketRetail(vehicle) {
  const year = Number(vehicle.year) || 2018;
  const km = Number(vehicle.km) || 120000;
  const modelText = `${vehicle.make || ""} ${vehicle.model || ""}`.toLowerCase();
  const segmentBase =
    /f-150|silverado|sierra|ram|tundra|tacoma/.test(modelText)
      ? 42000
      : /rav4|cr-v|cx-5|santa fe|escape|rogue|equinox|forester/.test(modelText)
        ? 30000
        : /odyssey|sienna|pacifica|caravan/.test(modelText)
          ? 28500
          : /civic|corolla|elantra|mazda3|sentra|jetta/.test(modelText)
            ? 22000
            : 26000;
  const ageFactor = Math.max(0.42, 1 - Math.max(0, 2026 - year) * 0.055);
  const kmFactor = Math.max(0.62, 1 - km / 430000);

  return roundToHundred(segmentBase * ageFactor * kmFactor);
}

function roundToHundred(value) {
  return Math.round((Number(value) || 0) / 100) * 100;
}

function normalizeComparables(comparables, vehicleId, vehicle) {
  const sourceComparables = comparables?.length ? comparables : [];

  return sourceComparables.map((comp, index) => ({
    id: comp.id || `${vehicleId}-comp-${index + 1}`,
    source: comp.source || "Verified comp",
    vin: comp.vin || "",
    listingUrl: comp.listingUrl || comp.url || comp.link || "",
    year: comp.year || vehicle.year,
    modelTrim: comp.modelTrim || `${vehicle.model} ${vehicle.trim}`.trim(),
    km: comp.km || vehicle.km,
    location: comp.location || "",
    price: comp.price || 0,
    adjustment: comp.adjustment || 0,
    approved: Boolean(comp.approved) && hasComparableEvidence(comp),
  }));
}

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function loadSavedState() {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));

    if (!saved?.vehicles?.length) {
      return null;
    }

    return {
      selectedVehicleId: saved.selectedVehicleId,
      lastImportSummary: saved.lastImportSummary || null,
      savedMappingPresets: saved.savedMappingPresets || {},
      buyingCosts: saved.buyingCosts || null,
      vehicles: saved.vehicles.map(withVehicleDefaults),
    };
  } catch {
    storage.removeItem(STORAGE_KEY);
    return null;
  }
}

function setSaveStatus(message = "Saved locally") {
  if (!els.saveStatus) {
    return;
  }

  els.saveStatus.textContent = message;
  window.setTimeout(() => {
    els.saveStatus.textContent = "Saved locally";
  }, 1600);
}

function saveAppState(message) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      selectedVehicleId,
      lastImportSummary,
      savedMappingPresets,
      buyingCosts,
      vehicles,
    }),
  );

  if (message) {
    setSaveStatus(message);
  }
}

function getFilters() {
  return {
    minYear: Number(els.minYear.value) || DEFAULT_FILTERS.minYear,
    maxYear: Number(els.maxYear.value) || DEFAULT_FILTERS.maxYear,
    maxKm: Number(els.maxKm.value) || DEFAULT_FILTERS.maxKm,
    searchText: els.searchText.value.trim().toLowerCase(),
    auctionSite: els.auctionSite.value,
    resultMode: els.resultMode.value,
  };
}

function vehicleIsRiskExcluded(vehicle) {
  if (vehicle.reviewStatus === "rejected" || vehicle.reviewStatus === "high-risk") {
    return true;
  }

  if (vehicle.damageSeverity === "high") {
    return true;
  }

  return vehicle.carfaxDisclosures >= 7 && vehicle.reviewStatus !== "accepted";
}

function vehiclePassesBuyingRules(vehicle, filters) {
  return (
    vehicle.year >= filters.minYear &&
    vehicle.year <= filters.maxYear &&
    vehicle.km < filters.maxKm &&
    !vehicleIsRiskExcluded(vehicle)
  );
}

function vehicleMatchesSearch(vehicle, searchText) {
  const vehicleText =
    `${vehicle.make} ${vehicle.model} ${vehicle.trim} ${vehicle.vin}`.toLowerCase();

  return !searchText || vehicleText.includes(searchText);
}

function vehicleMatchesFilters(vehicle, filters) {
  const passesBuyingRules = vehiclePassesBuyingRules(vehicle, filters);
  const vehicleAuctionSite = vehicle.auctionSite.toLowerCase();

  if (!vehicleMatchesSearch(vehicle, filters.searchText)) {
    return false;
  }

  if (filters.auctionSite !== "all" && vehicleAuctionSite !== filters.auctionSite) {
    return false;
  }

  if (filters.resultMode === "all") {
    return true;
  }

  if (filters.resultMode === "excluded") {
    return !passesBuyingRules;
  }

  return passesBuyingRules;
}

function vehicleMatchesDefaultRules(vehicle) {
  return vehiclePassesBuyingRules(vehicle, DEFAULT_FILTERS);
}

function getRetailValue(vehicle) {
  return getConsensusRetailValue(vehicle);
}

function getComparableAdjustedValue(comp, vehicle) {
  return (Number(comp.price) || 0) + getComparableTotalAdjustment(comp, vehicle);
}

function getComparableTotalAdjustment(comp, vehicle) {
  return (Number(comp.adjustment) || 0) + getComparableTrimAdjustment(comp, vehicle);
}

function normalizeTrimText(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getComparableTrimMatch(comp, vehicle) {
  const targetTrim = normalizeTrimText(vehicle?.trim);
  const compTrim = normalizeTrimText(comp?.modelTrim);

  if (!targetTrim || !compTrim) {
    return { label: "Unknown trim", className: "warn", adjustment: -750 };
  }

  if (compTrim.includes(targetTrim)) {
    return { label: "Exact trim", className: "good", adjustment: 0 };
  }

  const targetTokens = targetTrim.split(" ").filter((token) => token.length > 1);
  const sharedTokens = targetTokens.filter((token) => compTrim.includes(token));

  if (sharedTokens.length) {
    return { label: "Related trim", className: "warn", adjustment: -750 };
  }

  if (vehicle?.model && compTrim.includes(normalizeTrimText(vehicle.model))) {
    return { label: "Model comp", className: "warn", adjustment: -1500 };
  }

  return { label: "Broad comp", className: "bad", adjustment: -2500 };
}

function getComparableTrimAdjustment(comp, vehicle) {
  return getComparableTrimMatch(comp, vehicle).adjustment;
}

function hasComparableEvidence(comp) {
  return Boolean(comp?.source && getSafeExternalUrl(comp.listingUrl) && Number(comp.price) > 0);
}

function normalizeComparableUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    url.hash = "";
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gbraid",
      "gclid",
      "fbclid",
    ].forEach((key) => url.searchParams.delete(key));

    return `${url.hostname.replace(/^www\./, "")}${url.pathname}`.replace(/\/+$/, "").toLowerCase();
  } catch {
    return String(value || "").trim().toLowerCase();
  }
}

function getComparableKeys(comp) {
  const vin = normalizeVin(comp?.vin);
  const keys = [];

  if (vin.length >= 8) {
    keys.push(`vin:${vin}`);
  }

  const normalizedUrl = normalizeComparableUrl(comp?.listingUrl);

  if (normalizedUrl) {
    keys.push(`url:${normalizedUrl}`);
  }

  const listingId = String(comp?.listingUrl || "").match(/(?:listing|details|inventory|vehicle|vdp)[=/_-]?([a-z0-9-]{6,})/i)?.[1];

  if (listingId) {
    keys.push(`listing:${listingId.toLowerCase()}`);
  }

  const fingerprint = [
    String(comp?.source || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
    Number(comp?.year) || 0,
    String(comp?.modelTrim || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
    Math.round((Number(comp?.km) || 0) / 500) * 500,
    Math.round((Number(comp?.price) || 0) / 100) * 100,
    String(comp?.location || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
  ].join(":");

  if (fingerprint.replace(/[:0]/g, "")) {
    keys.push(`fingerprint:${fingerprint}`);
  }

  return keys;
}

function getUniqueComparables(comparables) {
  const seen = new Set();

  return comparables.filter((comp) => {
    const keys = getComparableKeys(comp);

    if (!keys.length || keys.some((key) => seen.has(key))) {
      return false;
    }

    keys.forEach((key) => seen.add(key));
    return true;
  });
}

function normalizeResearchComparable(comp, vehicleId, vehicle, index) {
  return normalizeComparables(
    [
      {
        ...comp,
        id: comp.id || `${vehicleId}-verified-comp-${Date.now()}-${index + 1}`,
        source: comp.source || comp.site || "Verified listing",
        listingUrl: comp.listingUrl || comp.url || comp.link || "",
        modelTrim: comp.modelTrim || comp.trim || `${vehicle.model} ${vehicle.trim}`.trim(),
        price: parseNumber(comp.price || comp.askingPrice || comp.listPrice),
        km: parseNumber(comp.km || comp.odometer || comp.mileage),
        adjustment: parseSignedNumber(comp.adjustment),
      },
    ],
    vehicleId,
    vehicle,
  )[0];
}

function getApprovedComparables(vehicle) {
  return getUniqueComparables(
    vehicle.comparables.filter((comp) => comp.approved && hasComparableEvidence(comp)),
  );
}

function getAverage(values) {
  const cleanValues = values.filter((value) => Number(value) > 0);

  if (!cleanValues.length) {
    return 0;
  }

  return cleanValues.reduce((sum, value) => sum + Number(value), 0) / cleanValues.length;
}

function getApprovedComparableAverage(vehicle) {
  return getAverage(
    getApprovedComparables(vehicle).map((comp) => getComparableAdjustedValue(comp, vehicle)),
  );
}

function getConsensusRetailValue(vehicle) {
  const approvedCompAverage = getApprovedComparableAverage(vehicle);

  return roundToHundred(
    getAverage([
      vehicle.marketValue,
      vehicle.blackBookRetail,
      vehicle.autoTraderAverage,
      vehicle.carGurusValue,
      approvedCompAverage,
    ]) || vehicle.retailValue,
  );
}

function getValuationConfidence(vehicle) {
  const approvedCount = getApprovedComparables(vehicle).length;
  const sourceCount = [
    vehicle.marketValue,
    vehicle.blackBookRetail,
    vehicle.autoTraderAverage,
    vehicle.carGurusValue,
  ].filter((value) => Number(value) > 0).length;

  if (approvedCount >= 3 && sourceCount >= 3 && getRiskLevel(vehicle) === "low") {
    return { label: "High confidence", className: "good", score: 88 };
  }

  if (approvedCount >= 2 && sourceCount >= 2) {
    return { label: "Medium confidence", className: "warn", score: 64 };
  }

  return { label: "Low confidence", className: "bad", score: 38 };
}

function getComparableSimilarity(comp, vehicle) {
  const vehicleTrim = `${vehicle.model} ${vehicle.trim}`.toLowerCase();
  const compTrim = comp.modelTrim.toLowerCase();
  const yearDiff = Math.abs((Number(comp.year) || 0) - (Number(vehicle.year) || 0));
  const kmDiff = Math.abs((Number(comp.km) || 0) - (Number(vehicle.km) || 0));
  const kmRatio = vehicle.km ? kmDiff / vehicle.km : 1;
  const sourceQuality = getComparableSourceQuality(comp);
  let score = 0;

  if (yearDiff === 0) {
    score += 32;
  } else if (yearDiff === 1) {
    score += 22;
  } else if (yearDiff === 2) {
    score += 12;
  }

  if (vehicleTrim && compTrim.includes(vehicle.model.toLowerCase())) {
    score += 18;
  }

  if (vehicle.trim && compTrim.includes(vehicle.trim.toLowerCase().split(" ")[0])) {
    score += 18;
  }

  if (kmRatio <= 0.1) {
    score += 24;
  } else if (kmRatio <= 0.2) {
    score += 16;
  } else if (kmRatio <= 0.35) {
    score += 9;
  }

  if (/london|kitchener|hamilton|toronto/i.test(comp.location)) {
    score += 8;
  }

  score += sourceQuality.score;

  const className = score >= 76 ? "good" : score >= 55 ? "warn" : "bad";
  const label = score >= 76 ? "Closest" : score >= 55 ? "Usable" : "Weak";

  return { score: Math.min(score, 100), className, label, sourceQuality };
}

function getComparableSourceQuality(comp) {
  const combined = `${comp.source || ""} ${comp.listingUrl || ""} ${comp.evidenceNote || ""}`.toLowerCase();

  if (/certified|cpo|toyota\.ca|honda\.ca|ford\.ca|gmcertified|hyundaicertified|kiacertified/.test(combined)) {
    return {
      label: "OEM/CPO",
      score: 14,
      note: "Certified or OEM inventory source.",
    };
  }

  if (/dealer|inventory|autocan|goauto|driveautogroup|autoplanet|carsandcars|motors|mazda|toyota|honda|ford|gm|chevrolet|hyundai|kia|nissan|subaru|volkswagen|vw|lexus|acura|bmw|mercedes|audi/.test(combined)) {
    return {
      label: "Dealer direct",
      score: 12,
      note: "Dealer inventory source with direct listing evidence.",
    };
  }

  if (/autotrader|auto trader|trader\.ca|car gurus|cargurus/.test(combined)) {
    return {
      label: "Verified marketplace",
      score: 10,
      note: "Major Canadian retail marketplace.",
    };
  }

  if (/carfax|black book|canadian black book|cbb/.test(combined)) {
    return {
      label: "Valuation/history",
      score: 8,
      note: "Valuation or vehicle-history source.",
    };
  }

  if (/kijiji|facebook|marketplace|private/.test(combined)) {
    return {
      label: "Weak private",
      score: -8,
      note: "Private or loose marketplace source; use only as backup.",
    };
  }

  return {
    label: "Unclassified",
    score: 0,
    note: "Source quality not identified.",
  };
}

function getVehicleRiskAssessment(vehicle) {
  const reasons = [];
  let margin = 0;

  if (!vehicle.vin) {
    margin += 500;
    reasons.push("VIN missing");
  }

  if (!getApprovedComparables(vehicle).length) {
    margin += 1000;
    reasons.push("No approved comps");
  }

  if (vehicle.km >= DEFAULT_FILTERS.maxKm) {
    margin += 1500;
    reasons.push("Odometer over 150,000 km");
  } else if (vehicle.km >= 120000) {
    margin += 700;
    reasons.push("Higher mileage");
  }

  if (vehicle.year < DEFAULT_FILTERS.minYear || vehicle.year > DEFAULT_FILTERS.maxYear) {
    margin += 1200;
    reasons.push("Outside buying year range");
  }

  if (vehicle.damageSeverity === "medium") {
    margin += 1000;
    reasons.push("Medium damage severity");
  }

  if (vehicle.damageSeverity === "high") {
    margin += 3000;
    reasons.push("High damage severity");
  }

  if (vehicle.carfaxDisclosures >= 7) {
    margin += 2500;
    reasons.push("Seven or more CARFAX disclosures");
  } else if (vehicle.carfaxDisclosures >= 4) {
    margin += 1000;
    reasons.push("Multiple CARFAX disclosures");
  }

  if (vehicle.carfaxCategories?.titleIssue) {
    margin += 3000;
    reasons.push("Title issue");
  }

  if (vehicle.carfaxCategories?.accidentDamage || vehicle.carfaxCategories?.claims) {
    margin += 1200;
    reasons.push("Accident or claim history");
  }

  if (vehicle.carfaxCategories?.rentalFleet) {
    margin += 700;
    reasons.push("Rental or fleet history");
  }

  if (vehicle.carfaxCategories?.usHistory) {
    margin += 700;
    reasons.push("U.S. history");
  }

  if (vehicle.damageChecks?.structural) {
    margin += 3000;
    reasons.push("Structural concern");
  }

  const visibleDamageCount = Object.values(vehicle.damageChecks || {}).filter(Boolean).length;

  if (visibleDamageCount >= 2) {
    margin += 1000;
    reasons.push("Multiple visible damage areas");
  }

  if (getValuationConfidence(vehicle).score < 60) {
    margin += 800;
    reasons.push("Limited pricing confidence");
  }

  const level = margin >= 3000 ? "high" : margin >= 1000 ? "medium" : "low";

  return {
    level,
    margin: roundToHundred(margin),
    reasons: reasons.length ? reasons : ["No major risk evidence recorded"],
  };
}

function getVehicleRecommendation(vehicle) {
  const confidence = getValuationConfidence(vehicle);
  const riskAssessment = getVehicleRiskAssessment(vehicle);
  const bidMath = getBidMath(vehicle);
  const reasons = [...riskAssessment.reasons];

  if (!getRetailValue(vehicle)) {
    reasons.unshift("Retail value unavailable");
  }

  if (vehicle.reviewStatus === "rejected" || vehicle.reviewStatus === "high-risk") {
    return {
      action: "Pass",
      className: "bad",
      maxBid: bidMath.maxBid,
      riskAssessment,
      confidence,
      explanation: "Do not bid until the risk concern is cleared.",
      reasons,
    };
  }

  if (!vehicleMatchesDefaultRules(vehicle) || riskAssessment.level === "high" || !getRetailValue(vehicle)) {
    return {
      action: "Pass",
      className: "bad",
      maxBid: bidMath.maxBid,
      riskAssessment,
      confidence,
      explanation: "Risk, missing value evidence, or buying-rule fit does not support a bid.",
      reasons,
    };
  }

  if (confidence.score < 70 || riskAssessment.level === "medium" || vehicle.reviewStatus === "needs-review") {
    return {
      action: "Watch",
      className: "warn",
      maxBid: bidMath.maxBid,
      riskAssessment,
      confidence,
      explanation: "Potential buy, but needs stronger comps or condition confirmation.",
      reasons,
    };
  }

  return {
    action: "Bid",
    className: "good",
    maxBid: bidMath.maxBid,
    riskAssessment,
    confidence,
    explanation: "Value, risk, and confidence support bidding up to the recommended max.",
    reasons,
  };
}

function getRiskLevel(vehicle) {
  return getVehicleRiskAssessment(vehicle).level;
}

function getRiskBuffer(vehicle) {
  return getVehicleRiskAssessment(vehicle).margin;
}

function getBidMath(vehicle) {
  const retailValue = getRetailValue(vehicle);
  const profit = Number(buyingCosts.fixedProfit) || 0;
  const reconRecommendation = getReconRecommendation(vehicle);
  const recon = Number(reconRecommendation.reserve) || 0;
  const auctionFees = Number(buyingCosts.auctionFees) || 0;
  const riskBuffer = Number(getRiskBuffer(vehicle)) || 0;
  const expectedCosts = recon + auctionFees;
  const maxBid = retailValue - profit - recon - auctionFees - riskBuffer;
  const expectedCostItems = [
    {
      label: "Base recon reserve",
      amount: Number(buyingCosts.recon) || 0,
      reason: "Default allowance for safety, cleanup, inspection, and retail-ready prep.",
    },
    ...reconRecommendation.adjustments,
    {
      label: "Auction fees",
      amount: auctionFees,
      reason: "Default buyer fee estimate from bid settings.",
    },
  ];

  return {
    retailValue,
    profit,
    recon,
    auctionFees,
    expectedCosts,
    expectedCostItems,
    riskBuffer,
    maxBid: Math.max(0, roundToHundred(maxBid)),
  };
}

function getMaxBidFromRetail(retailValue, vehicle, reconOverride = buyingCosts.recon) {
  const profit = Number(buyingCosts.fixedProfit) || 0;
  const recon = Number(reconOverride) || 0;
  const auctionFees = Number(buyingCosts.auctionFees) || 0;
  const riskBuffer = Number(getRiskBuffer(vehicle)) || 0;

  return Math.max(0, roundToHundred(retailValue - profit - recon - auctionFees - riskBuffer));
}

function getTrimMatchCount(vehicle, comparables) {
  const trim = String(vehicle.trim || "").trim().toLowerCase();

  if (!trim) {
    return 0;
  }

  return comparables.filter((comp) =>
    String(comp.modelTrim || "").toLowerCase().includes(trim),
  ).length;
}

function formatDifference(value, unit = "") {
  if (!Number.isFinite(value) || value === 0) {
    return `same${unit ? ` ${unit}` : ""}`;
  }

  const direction = value > 0 ? "higher" : "lower";
  const amount = Math.abs(Math.round(value));

  return `${new Intl.NumberFormat("en-CA").format(amount)}${unit ? ` ${unit}` : ""} ${direction}`;
}

function getReconRecommendation(vehicle, priceSpread = 0) {
  const baseRecon = Number(buyingCosts.recon) || 0;
  const riskLevel = getRiskLevel(vehicle);
  let reserve = baseRecon;
  const adjustments = [];
  const recommendations = [];

  if (Number(vehicle.km) > 120000) {
    reserve += 500;
    adjustments.push({
      label: "Higher-km allowance",
      amount: 500,
      reason: "Odometer is over 120,000 km.",
    });
    recommendations.push("Higher-kilometre unit: inspect brakes, tires, suspension noise, fluids, and warning lights before stretching the bid.");
  }

  if (Number(vehicle.year) <= 2017) {
    reserve += 400;
    adjustments.push({
      label: "Age allowance",
      amount: 400,
      reason: "Older model year increases safety and cosmetic uncertainty.",
    });
    recommendations.push("Older model year: hold extra room for age-related safety items and cosmetic cleanup.");
  }

  if (riskLevel === "medium") {
    reserve += 600;
    adjustments.push({
      label: "Medium-risk allowance",
      amount: 600,
      reason: "Condition or history signals need verification.",
    });
    recommendations.push("Medium risk signals: keep extra recon room until photos, announcements, and disclosures are verified.");
  }

  if (riskLevel === "high") {
    reserve += 1500;
    adjustments.push({
      label: "High-risk allowance",
      amount: 1500,
      reason: "High-risk signals require a larger repair reserve.",
    });
    recommendations.push("High risk signals: price this as a cautious buy or remove it unless the auction photos prove the concern is minor.");
  }

  if (priceSpread > 3000) {
    reserve += 500;
    adjustments.push({
      label: "Market-spread allowance",
      amount: 500,
      reason: "Comparable prices have a wide spread.",
    });
    recommendations.push("Wide comp spread: use the lower side of the market until condition quality is confirmed.");
  }

  if (!recommendations.length) {
    recommendations.push("Standard recon reserve looks reasonable for now, but confirm tires, brakes, windshield, keys, paintwork, and interior wear before bidding.");
  }

  recommendations.push(
    "When auction APIs are connected, damage photos and CARFAX disclosures should adjust this reserve automatically.",
  );

  return {
    reserve: roundToHundred(reserve),
    adjustments,
    recommendations,
  };
}

function getCompSummary(vehicle) {
  const approvedComps = getApprovedComparables(vehicle);
  const verifiedComps = getUniqueComparables(vehicle.comparables.filter(hasComparableEvidence));
  const summaryComps = approvedComps.length ? approvedComps : verifiedComps;
  const isPreliminary = !approvedComps.length;
  const consensusRetail = getConsensusRetailValue(vehicle);

  if (!summaryComps.length) {
    const bidMath = getBidMath(vehicle);
    const recon = getReconRecommendation(vehicle);

    return {
      className: "neutral",
      title: "Waiting for verified comps",
      narrative:
        "Once live listings return with price, VIN, and clickable source links, this section will explain how the auction vehicle compares and what retail and max bid should be considered.",
      conclusion:
        "Do not rely on this as a final market price yet. The app needs verified active listings before it can defend the retail number.",
      suggestedRetail: consensusRetail,
      suggestedMaxBid: getMaxBidFromRetail(consensusRetail, vehicle, recon.reserve) || bidMath.maxBid,
      reconReserve: recon.reserve,
      reconRecommendations: recon.recommendations,
      bullets: [
        "Current price guidance is using imported guide values only.",
        "Auction photos and CARFAX are not connected yet, so condition is not affecting this summary.",
        "When auction APIs are connected, photo and disclosure signals should adjust the vehicle risk margin automatically.",
      ],
    };
  }

  const adjustedValues = summaryComps.map((comp) => getComparableAdjustedValue(comp, vehicle));
  const averageAdjusted = roundToHundred(getAverage(adjustedValues));
  const suggestedRetail = approvedComps.length
    ? consensusRetail || averageAdjusted
    : averageAdjusted || consensusRetail;
  const averageKm = getAverage(summaryComps.map((comp) => comp.km));
  const averageYear = getAverage(summaryComps.map((comp) => comp.year));
  const kmDelta = Number(vehicle.km) - averageKm;
  const yearDelta = Number(vehicle.year) - averageYear;
  const trimMatches = getTrimMatchCount(vehicle, summaryComps);
  const priceSpread = Math.max(...adjustedValues) - Math.min(...adjustedValues);
  const recon = getReconRecommendation(vehicle, priceSpread);
  const suggestedMaxBid = getMaxBidFromRetail(suggestedRetail, vehicle, recon.reserve);
  const closestComp = [...summaryComps].sort(
    (a, b) => getComparableSimilarity(b, vehicle).score - getComparableSimilarity(a, vehicle).score,
  )[0];
  const closestSimilarity = closestComp ? getComparableSimilarity(closestComp, vehicle) : null;

  const className =
    approvedComps.length >= 3 && priceSpread <= 3000
      ? "good"
      : summaryComps.length >= 2
        ? "warn"
        : "neutral";

  const conclusionParts = [
    `Suggested retail is ${formatVerifiedCurrency(suggestedRetail)} because the selected market set averages ${formatCurrency(averageAdjusted)} after adjustments.`,
    `Suggested max bid is ${formatCurrency(suggestedMaxBid)} after ${formatCurrency(buyingCosts.fixedProfit)} profit, ${formatCurrency(recon.reserve)} recon, ${formatCurrency(buyingCosts.auctionFees)} auction fees, and ${formatCurrency(getRiskBuffer(vehicle))} vehicle risk margin.`,
  ];

  if (kmDelta > 10000) {
    conclusionParts.push("The auction vehicle has meaningfully higher kilometres than the comp set, so the bid should stay conservative.");
  } else if (kmDelta < -10000) {
    conclusionParts.push("The auction vehicle has lower kilometres than the comp set, so it may justify pricing closer to the stronger comps.");
  }

  const bullets = [
    `${summaryComps.length} verified comp${summaryComps.length === 1 ? "" : "s"} considered${isPreliminary ? " before approval" : " in the approved set"}.`,
    `This vehicle has about ${formatDifference(kmDelta, "km")} than the comp average.`,
    `Model year is ${formatDifference(yearDelta, "year")} than the comp average.`,
    trimMatches
      ? `${trimMatches} comp${trimMatches === 1 ? "" : "s"} appear to match the selected trim/package.`
      : "Trim/package is not clearly matched yet, so approve only the closest listings.",
    priceSpread
      ? `Adjusted comp spread is ${formatCurrency(priceSpread)}, so use the low end if condition is uncertain.`
      : "Comp spread is not available yet.",
  ];

  if (closestComp && closestSimilarity) {
    bullets.push(
      `Closest current comp is ${closestComp.source} at ${closestSimilarity.score}% similarity.`,
    );
  }

  bullets.push(
    "Photo damage and CARFAX disclosures are not automated yet; when auction APIs are connected they should raise or lower the vehicle risk margin before bidding.",
  );

  return {
    className,
    title: isPreliminary ? "Preliminary comp summary" : "Approved comp summary",
    narrative: isPreliminary
      ? "Verified listings are loaded, but none have been approved yet. Use this as a first read, then approve the closest comps so they can drive the official consensus."
      : "Approved comps are now driving the retail read. The suggested bid should stay below the adjusted retail value after profit, recon, auction fees, and vehicle risk margin.",
    conclusion: conclusionParts.join(" "),
    suggestedRetail,
    suggestedMaxBid,
    reconReserve: recon.reserve,
    reconRecommendations: recon.recommendations,
    bullets,
  };
}

function getMaxBid(vehicle) {
  return getBidMath(vehicle).maxBid;
}

function vehicleCanStretch(vehicle) {
  return (
    getRiskLevel(vehicle) === "low" &&
    vehicle.reviewStatus === "accepted" &&
    vehicle.year >= DEFAULT_FILTERS.minYear &&
    vehicle.year <= DEFAULT_FILTERS.maxYear &&
    vehicle.km < DEFAULT_FILTERS.maxKm
  );
}

function getStretchBid(vehicle) {
  return getMaxBid(vehicle) + (vehicleCanStretch(vehicle) ? buyingCosts.cleanStretch : 0);
}

function getStatus(vehicle, filters) {
  if (vehicle.reviewStatus === "rejected") {
    return { label: "Red", className: "bad" };
  }

  if (vehicle.reviewStatus === "high-risk" || vehicleIsRiskExcluded(vehicle)) {
    return { label: "Red", className: "bad" };
  }

  if (vehicle.year < filters.minYear) {
    return { label: "Red", className: "bad" };
  }

  if (vehicle.year > filters.maxYear) {
    return { label: "Red", className: "bad" };
  }

  if (vehicle.km >= filters.maxKm) {
    return { label: "Yellow", className: "warn" };
  }

  if (vehicle.reviewStatus === "accepted") {
    return { label: "Priority", className: "good" };
  }

  if (getRiskLevel(vehicle) === "low") {
    return { label: "Green", className: "good" };
  }

  return { label: "Yellow", className: "warn" };
}

function getRiskFlags(vehicle) {
  const flags = new Set(vehicle.riskFlags);

  if (vehicle.carfaxDisclosures >= 7) {
    flags.add("CARFAX disclosures at or above 7");
  }

  if (vehicle.damageSeverity === "high") {
    flags.add("High damage severity");
  }

  if (vehicle.damageSeverity === "medium") {
    flags.add("Medium damage severity");
  }

  if (vehicle.km >= DEFAULT_FILTERS.maxKm) {
    flags.add("Odometer over 150,000 km");
  }

  if (vehicle.year < DEFAULT_FILTERS.minYear || vehicle.year > DEFAULT_FILTERS.maxYear) {
    flags.add("Outside 2015-2022 year rule");
  }

  CARFAX_CATEGORY_FIELDS.forEach(([key, label]) => {
    if (vehicle.carfaxCategories?.[key]) {
      flags.add(label);
    }
  });

  DAMAGE_CHECK_FIELDS.forEach(([key, label]) => {
    if (vehicle.damageChecks?.[key]) {
      flags.add(`${label} damage`);
    }
  });

  if (vehicle.notes) {
    flags.add(`Note: ${vehicle.notes}`);
  }

  return [...flags];
}

function getBidDecision(vehicle) {
  const customBid = vehicle.customBid || 0;
  const maxBid = getMaxBid(vehicle);
  const stretchBid = getStretchBid(vehicle);

  if (vehicle.reviewStatus === "rejected" || vehicle.reviewStatus === "high-risk") {
    return { className: "bad", label: "Do not bid until this vehicle is reopened." };
  }

  if (!customBid) {
    return { className: "warn", label: "Enter a custom bid before auction action." };
  }

  if (customBid <= maxBid) {
    return { className: "", label: "Custom bid is inside the calculated max bid." };
  }

  if (customBid <= stretchBid && vehicleCanStretch(vehicle)) {
    return {
      className: "warn",
      label: "Custom bid uses the +$1,000 clean-vehicle stretch range.",
    };
  }

  return { className: "bad", label: "Custom bid exceeds the approved limit." };
}

function getBidStatusMeta(vehicle) {
  return BID_STATUS_LABELS[vehicle.bidStatus] || BID_STATUS_LABELS["no-bid"];
}

function getOutcomeFinancials(vehicle) {
  const hasPurchaseOutcome =
    ["won", "purchased", "sold", "complete"].includes(vehicle.bidStatus) ||
    Boolean(vehicle.purchasePrice || vehicle.salePrice);
  const purchasePrice = hasPurchaseOutcome ? vehicle.purchasePrice || vehicle.actualBid || 0 : 0;
  const auctionFees = hasPurchaseOutcome ? vehicle.actualAuctionFees || buyingCosts.auctionFees : 0;
  const reconCost = hasPurchaseOutcome ? vehicle.actualReconCost || buyingCosts.recon : 0;
  const totalAcquisition =
    purchasePrice + auctionFees + (vehicle.transportCost || 0) + reconCost;
  const grossProfit = vehicle.salePrice ? vehicle.salePrice - totalAcquisition : 0;

  return {
    purchasePrice,
    auctionFees,
    reconCost,
    totalAcquisition,
    grossProfit,
  };
}

function normalizeVin(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function getVehicleIdentityMatch(vehicle) {
  const vin = normalizeVin(vehicle.vin);
  const signals = [];
  const warnings = [];
  let score = 0;

  if (vehicle.vehicleIdentityConfirmed === "no") {
    return {
      score: 0,
      label: "Rejected match",
      className: "bad",
      method: "Dealer marked this as not the same vehicle",
      signals: [],
      warnings: ["Do not use this record for outcome learning until corrected."],
    };
  }

  if (vin.length === 17) {
    score += 55;
    signals.push("Full VIN available");
  } else if (vin.length >= 8) {
    score += 30;
    signals.push("Partial VIN available");
    warnings.push("Confirm full VIN before trusting outcome learning.");
  } else {
    warnings.push("VIN missing; fallback match only.");
  }

  if (vehicle.year && vehicle.make && vehicle.model) {
    score += 18;
    signals.push("Year, make, and model present");
  } else {
    warnings.push("Year/make/model is incomplete.");
  }

  if (vehicle.trim) {
    score += 6;
    signals.push("Trim/package present");
  }

  if (vehicle.km) {
    score += 8;
    signals.push("Mileage present");
  }

  if (vehicle.auctionSite && vehicle.auctionSite !== "Unknown") {
    score += 4;
    signals.push("Auction source present");
  }

  if (vehicle.runNumber) {
    score += 4;
    signals.push("Run/lot number present");
  }

  if (vehicle.receiptDocuments.length) {
    score += 5;
    signals.push(`${vehicle.receiptDocuments.length} receipt file${vehicle.receiptDocuments.length === 1 ? "" : "s"} attached`);
  }

  if (vehicle.vehicleIdentityConfirmed === "yes") {
    score += 20;
    signals.unshift("Dealer confirmed same vehicle");
  }

  score = Math.min(score, 100);

  if (score >= 80) {
    return {
      score,
      label: "High confidence",
      className: "good",
      method: vin.length === 17 ? "VIN-first match" : "Confirmed fallback match",
      signals,
      warnings,
    };
  }

  if (score >= 55) {
    return {
      score,
      label: "Needs confirmation",
      className: "warn",
      method: vin.length >= 8 ? "Partial VIN + vehicle details" : "Vehicle detail fallback",
      signals,
      warnings,
    };
  }

  return {
    score,
    label: "Low confidence",
    className: "bad",
    method: "Insufficient identity signals",
    signals,
    warnings,
  };
}

function getOutcomeAccuracy(vehicle) {
  const consensusRetail = getRetailValue(vehicle);
  const suggestedMaxBid = getMaxBid(vehicle);
  const stretchBid = getStretchBid(vehicle);
  const financials = getOutcomeFinancials(vehicle);
  const saleDelta =
    vehicle.salePrice && consensusRetail ? vehicle.salePrice - consensusRetail : null;
  const saleErrorPercent =
    saleDelta === null || !consensusRetail
      ? null
      : (Math.abs(saleDelta) / consensusRetail) * 100;
  const purchaseDelta = financials.purchasePrice
    ? financials.purchasePrice - suggestedMaxBid
    : null;
  const profitDelta = vehicle.salePrice
    ? financials.grossProfit - buyingCosts.fixedProfit
    : null;
  const learningFlags = [];

  if (!normalizeVin(vehicle.vin)) {
    learningFlags.push("Missing VIN blocks exact matching.");
  }

  if (!financials.purchasePrice) {
    learningFlags.push("Add actual bid or purchase price.");
  }

  if (!vehicle.salePrice) {
    learningFlags.push("Add sale price to score retail accuracy.");
  }

  if (!vehicle.actualAuctionFees) {
    learningFlags.push("Auction fees are using the estimate.");
  }

  if (!vehicle.actualReconCost) {
    learningFlags.push("Recon is using the estimate.");
  }

  if (!vehicle.receiptDocuments.length) {
    learningFlags.push("Attach receipts to verify purchase, recon, fees, and sale.");
  }

  if (saleDelta !== null) {
    learningFlags.push(
      saleDelta >= 0
        ? "Retail consensus was conservative against the actual sale."
        : "Retail consensus was higher than the actual sale.",
    );
  }

  return {
    consensusRetail,
    suggestedMaxBid,
    stretchBid,
    saleDelta,
    saleErrorPercent,
    purchaseDelta,
    profitDelta,
    bidAccuracy:
      purchaseDelta === null
        ? "Waiting for purchase"
        : financials.purchasePrice <= suggestedMaxBid
          ? "Under max"
          : financials.purchasePrice <= stretchBid
            ? "Inside stretch"
            : "Over limit",
    learningFlags,
  };
}

function getDaysToSale(vehicle) {
  if (!vehicle.purchaseDate || !vehicle.saleDate) {
    return "";
  }

  const purchaseTime = new Date(vehicle.purchaseDate).getTime();
  const saleTime = new Date(vehicle.saleDate).getTime();

  if (!purchaseTime || !saleTime || saleTime < purchaseTime) {
    return "";
  }

  return Math.round((saleTime - purchaseTime) / 86400000);
}

function getOptionList(options, selectedValue) {
  return options
    .map(
      ([value, label]) =>
        `<option value="${escapeHtml(value)}" ${selectedValue === value ? "selected" : ""}>${escapeHtml(label)}</option>`,
    )
    .join("");
}

function getBidStatusFromReceiptType(receiptType) {
  if (receiptType === "auction-purchase") {
    return "purchased";
  }

  if (receiptType === "auction-loss") {
    return "lost";
  }

  if (receiptType === "bill-of-sale" || receiptType === "retail-sale") {
    return "sold";
  }

  return "";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatVerifiedCurrency(value) {
  return Number(value) > 0 ? formatCurrency(value) : "Needs verified source";
}

function formatSignedCurrency(value) {
  if (value === null || value === undefined) {
    return "Waiting";
  }

  const sign = value >= 0 ? "+" : "-";
  return `${sign}${formatCurrency(Math.abs(value))}`;
}

function formatPercent(value) {
  return value === null || value === undefined ? "Waiting" : `${value.toFixed(1)}%`;
}

function formatKm(value) {
  return `${new Intl.NumberFormat("en-CA").format(value)} km`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSafeExternalUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function getNumberInputValue(value) {
  return value ? String(value) : "";
}

function renderVehicles() {
  renderBidSettings();
  const filters = getFilters();
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicleMatchesFilters(vehicle, filters),
  );
  const excludedVehicles = vehicles.filter(
    (vehicle) => !vehicleMatchesDefaultRules(vehicle),
  );

  if (!vehicles.some((vehicle) => vehicle.id === selectedVehicleId)) {
    selectedVehicleId = vehicles[0]?.id || null;
  }

  if (
    filteredVehicles.length &&
    !filteredVehicles.some((vehicle) => vehicle.id === selectedVehicleId)
  ) {
    selectedVehicleId = filteredVehicles[0].id;
  }

  if (els.shownCount) {
    els.shownCount.textContent = filteredVehicles.length;
  }
  if (els.hiddenCount) {
    els.hiddenCount.textContent = excludedVehicles.length;
  }
  if (els.acceptedCount) {
    els.acceptedCount.textContent = vehicles.filter(
      (vehicle) => vehicle.reviewStatus === "accepted",
    ).length;
  }
  if (els.highRiskCount) {
    els.highRiskCount.textContent = vehicles.filter(
      (vehicle) => getRiskLevel(vehicle) === "high",
    ).length;
  }

  const acceptedValue = vehicles
    .filter((vehicle) => vehicle.reviewStatus === "accepted")
    .reduce((sum, vehicle) => sum + getMaxBid(vehicle), 0);
  const filteredMaxBidTotal = filteredVehicles.reduce(
    (sum, vehicle) => sum + getMaxBid(vehicle),
    0,
  );

  if (els.shownCount) {
    els.shownCount.title = `Visible max bid total: ${formatCurrency(filteredMaxBidTotal)}`;
  }
  if (els.hiddenCount) {
    els.hiddenCount.title = "Filtered out by the active buying rules.";
  }
  if (els.acceptedCount) {
    els.acceptedCount.title = `Priority max bid total: ${formatCurrency(acceptedValue)}`;
  }
  if (els.highRiskCount) {
    els.highRiskCount.title = "High risk vehicles need manual approval before bidding.";
  }

  if (!filteredVehicles.length) {
    els.vehicleRows.innerHTML = `
      <tr>
        <td class="empty-state" colspan="9">No vehicles match the current filters.</td>
      </tr>
    `;
    renderReviewPanel();
    renderValuationPanel();
    renderBidList();
    renderOutcomePanel();
    renderLastImportSummary();
    return;
  }

  els.vehicleRows.innerHTML = filteredVehicles
    .map((vehicle) => {
      const status = getStatus(vehicle, filters);
      const riskLevel = getRiskLevel(vehicle);
      const riskClass = riskLevel === "low" ? "good" : riskLevel === "medium" ? "warn" : "bad";
      const rowClass = status.className === "good" ? "row-good" : status.className === "warn" ? "row-warn" : "row-bad";
      const carfaxClass =
        vehicle.carfaxDisclosures >= 7
          ? "bad"
          : vehicle.carfaxDisclosures >= 4
            ? "warn"
            : "good";
      const selectedClass = vehicle.id === selectedVehicleId ? "selected-row" : "";

      return `
        <tr class="${selectedClass} ${rowClass}" data-vehicle-id="${escapeHtml(vehicle.id)}">
          <td><span class="run-link">${escapeHtml(vehicle.runNumber || "-")}</span></td>
          <td><span class="vin-cell">${escapeHtml(vehicle.vin || "Missing")}</span></td>
          <td>
            <div class="vehicle-name">${escapeHtml(vehicle.make)} ${escapeHtml(vehicle.model)}</div>
            <div class="vehicle-trim">${escapeHtml(vehicle.trim)} | ${escapeHtml(vehicle.auctionSite)}</div>
          </td>
          <td>${vehicle.year}</td>
          <td>${formatKm(vehicle.km)}</td>
          <td><span class="dot-pill ${carfaxClass}">${vehicle.carfaxDisclosures}</span></td>
          <td>${escapeHtml(vehicle.damageSeverity)}</td>
          <td><span class="pill ${riskClass}">${riskLevel}</span></td>
          <td><span class="pill ${status.className}">${status.label}</span></td>
        </tr>
      `;
    })
    .join("");

  renderReviewPanel();
  renderValuationPanel();
  renderBidList();
  renderOutcomePanel();
  renderLastImportSummary();
}

function renderBidSettings() {
  document.querySelectorAll("[data-bid-setting]").forEach((input) => {
    input.value = buyingCosts[input.dataset.bidSetting] ?? 0;
  });
  document.querySelectorAll("[data-setting-display]").forEach((el) => {
    el.textContent = formatCurrency(buyingCosts[el.dataset.settingDisplay] || 0);
  });
}

function getImportSummary(preview) {
  const validRows = preview.rows.filter((row) => row.valid);
  const filteredRows = preview.rows.filter((row) => row.filtered);
  const rowsWithIssues = preview.rows.filter((row) => row.issues.length);
  const issueCounts = rowsWithIssues
    .flatMap((row) => row.issues)
    .reduce((counts, issue) => {
      counts[issue] = (counts[issue] || 0) + 1;
      return counts;
    }, {});

  return {
    fileName: preview.fileName,
    preset: preview.preset,
    fileType: preview.fileType,
    importedAt: new Date().toLocaleString("en-CA", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    totalRows: preview.rows.length,
    validRows: validRows.length,
    filteredRows: filteredRows.length,
    issueRows: rowsWithIssues.length,
    issueCounts,
  };
}

function renderLastImportSummary() {
  if (!lastImportSummary) {
    els.lastImportPanel.hidden = true;
    return;
  }

  const issueText = Object.entries(lastImportSummary.issueCounts || {})
    .map(([issue, count]) => `<span>${count} x ${escapeHtml(issue)}</span>`)
    .join("");

  els.lastImportPanel.hidden = false;
  els.lastImportPanel.innerHTML = `
    <div>
      <p class="eyebrow">Last Import</p>
      <h2>${escapeHtml(lastImportSummary.fileName)}</h2>
      <p class="page-note">Applied ${escapeHtml(lastImportSummary.importedAt)} using ${escapeHtml(lastImportSummary.preset)} preset (${escapeHtml(lastImportSummary.fileType || "csv")}).</p>
    </div>
    <div class="last-import-metrics">
      <div><strong>${lastImportSummary.totalRows}</strong><span>rows parsed</span></div>
      <div><strong>${lastImportSummary.validRows}</strong><span>valid vehicles</span></div>
      <div><strong>${lastImportSummary.filteredRows}</strong><span>filtered out</span></div>
      <div><strong>${lastImportSummary.issueRows}</strong><span>issue rows</span></div>
    </div>
    <div class="import-issues">${issueText || "<span>No import issues</span>"}</div>
  `;
}

function renderReviewPanel() {
  const vehicle = vehicles.find((item) => item.id === selectedVehicleId);

  if (!vehicle) {
    els.reviewPanel.innerHTML = `
      <div class="empty-state">Select a vehicle to review CARFAX, damage, value, and bid limits.</div>
    `;
    return;
  }

  const riskLevel = getRiskLevel(vehicle);
  const bidMath = getBidMath(vehicle);
  const recommendation = getVehicleRecommendation(vehicle);
  const flags = recommendation.reasons;
  const safeListingUrl = getSafeExternalUrl(vehicle.listingUrl);
  const historyStatus = vehicle.carfaxFileName
    ? "Vehicle history file uploaded"
    : "Vehicle history unavailable";

  els.reviewPanel.innerHTML = `
    <div class="review-header">
      <div>
        <p class="eyebrow">Selected vehicle</p>
        <h2 class="review-title">${escapeHtml(vehicle.year)} ${escapeHtml(vehicle.make)} ${escapeHtml(vehicle.model)}</h2>
        <div class="review-subtitle">${escapeHtml(vehicle.trim)} | ${escapeHtml(vehicle.auctionSite)} | Run ${escapeHtml(vehicle.runNumber || "Not set")}</div>
      </div>
      <span class="pill ${recommendation.className}">${escapeHtml(recommendation.action)}</span>
    </div>

    <div class="vin-copy-card">
      <div>
        <span>Full VIN</span>
        <strong>${escapeHtml(vehicle.vin || "Missing VIN")}</strong>
      </div>
      <button data-copy-vin type="button" ${vehicle.vin ? "" : "disabled"}>Copy VIN</button>
    </div>

    <div class="recommendation-card ${recommendation.className}">
      <div class="recommendation-topline">
        <div>
          <span>Recommended action</span>
          <strong>${escapeHtml(recommendation.action)}</strong>
        </div>
        <div>
          <span>Recommended maximum bid</span>
          <strong>${formatCurrency(recommendation.maxBid)}</strong>
        </div>
      </div>
      <div class="recommendation-metrics">
        <div>
          <span>Risk level</span>
          <strong>${riskLevel.toUpperCase()}</strong>
        </div>
        <div>
          <span>Confidence</span>
          <strong>${escapeHtml(recommendation.confidence.label)}</strong>
        </div>
      </div>
      <p>${escapeHtml(recommendation.explanation)}</p>
    </div>

    <div class="market-snapshot">
      <div>
        <span>Estimated retail value</span>
        <strong>${formatVerifiedCurrency(bidMath.retailValue)}</strong>
      </div>
      <div>
        <span>Target profit</span>
        <strong>${formatCurrency(bidMath.profit)}</strong>
      </div>
      <div>
        <span>Expected costs</span>
        <strong>${formatCurrency(bidMath.expectedCosts)}</strong>
      </div>
      <div>
        <span>Vehicle risk margin</span>
        <strong>${formatCurrency(bidMath.riskBuffer)}</strong>
      </div>
    </div>

    <div class="cost-breakdown">
      <div class="cost-breakdown-header">
        <div>
          <span>Expected costs breakdown</span>
          <strong>${formatCurrency(bidMath.expectedCosts)}</strong>
        </div>
        <small>These are rough buying assumptions until auction photos, vehicle history, and final invoices are connected.</small>
      </div>
      <div class="cost-breakdown-list">
        ${bidMath.expectedCostItems
          .map(
            (item) => `
              <div>
                <span>${escapeHtml(item.label)}</span>
                <p>${escapeHtml(item.reason)}</p>
                <strong>${formatCurrency(item.amount)}</strong>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>

    <div class="review-primary-actions">
      ${
        safeListingUrl
          ? `<a class="action-link" href="${escapeHtml(safeListingUrl)}" target="_blank" rel="noopener">Open auction listing</a>`
          : `<button class="secondary-button" type="button" disabled>Listing URL missing</button>`
      }
      <button data-review-status="accepted" type="button">${vehicle.reviewStatus === "accepted" ? "Priority selected" : "Mark priority"}</button>
    </div>

    <ul class="risk-list">
      ${
        flags.length
          ? flags.map((flag) => `<li>${escapeHtml(flag)}</li>`).join("")
          : "<li>No major risk evidence recorded.</li>"
      }
    </ul>

    <div class="integration-status">
      <div>
        <span>Photo assessment</span>
        <strong>Activates after auction photo integration.</strong>
      </div>
      <div>
        <span>Vehicle history</span>
        <strong>${escapeHtml(historyStatus)}</strong>
      </div>
      <div>
        <span>Dealer history</span>
        <strong>Unavailable until DMS integration.</strong>
      </div>
    </div>

    <div class="formula-stack" aria-label="Bid formula">
      <div class="formula-row"><span>Estimated retail value</span><strong>${formatVerifiedCurrency(bidMath.retailValue)}</strong></div>
      <div class="formula-row"><span>Target profit</span><strong>-${formatCurrency(bidMath.profit)}</strong></div>
      <div class="formula-row"><span>Expected costs</span><strong>-${formatCurrency(bidMath.expectedCosts)}</strong></div>
      <div class="formula-row formula-sub"><span>Recon reserve</span><strong>${formatCurrency(bidMath.recon)}</strong></div>
      <div class="formula-row formula-sub"><span>Auction fees</span><strong>${formatCurrency(bidMath.auctionFees)}</strong></div>
      <div class="formula-row"><span>Vehicle risk margin</span><strong>-${formatCurrency(bidMath.riskBuffer)}</strong></div>
      <div class="formula-row formula-total"><span>Recommended maximum bid</span><strong>${formatCurrency(bidMath.maxBid)}</strong></div>
    </div>

  `;
}

function renderValuationPanel() {
  const vehicle = vehicles.find((item) => item.id === selectedVehicleId);

  if (!vehicle) {
    els.valuationPanel.innerHTML = `
      <div class="empty-state">Select a vehicle to review market values and comparables.</div>
    `;
    return;
  }

  const approvedCompAverage = getApprovedComparableAverage(vehicle);
  const consensusRetail = getConsensusRetailValue(vehicle);
  const confidence = getValuationConfidence(vehicle);
  const approvedCount = getApprovedComparables(vehicle).length;
  const bidMath = getBidMath(vehicle);
  const compSummary = getCompSummary(vehicle);
  const uniqueComparables = getUniqueComparables(vehicle.comparables);
  const researchClass =
    vehicle.compResearchStatus === "complete"
      ? "good"
      : vehicle.compResearchStatus === "error"
        ? "bad"
        : "neutral";

  els.valuationPanel.innerHTML = `
    <div class="valuation-grid">
      <div class="valuation-details">
        <div class="valuation-header">
          <div>
            <h3>${escapeHtml(vehicle.year)} ${escapeHtml(vehicle.make)} ${escapeHtml(vehicle.model)}</h3>
            <p>${escapeHtml(vehicle.trim)} | ${formatKm(vehicle.km)} | ${escapeHtml(vehicle.postalCode)}</p>
          </div>
          <span class="pill ${confidence.className}">${confidence.label}</span>
        </div>

        <div class="source-value-grid">
          <div>
            <span>Market</span>
            <strong>${escapeHtml(vehicle.postalCode)}</strong>
          </div>
          <div>
            <span>Black Book verified</span>
            <strong>${formatVerifiedCurrency(vehicle.blackBookRetail)}</strong>
          </div>
          <div>
            <span>AutoTrader verified</span>
            <strong>${formatVerifiedCurrency(vehicle.autoTraderAverage)}</strong>
          </div>
          <div>
            <span>CarGurus verified</span>
            <strong>${formatVerifiedCurrency(vehicle.carGurusValue)}</strong>
          </div>
          <div>
            <span>Imported retail</span>
            <strong>${formatVerifiedCurrency(vehicle.marketValue)}</strong>
          </div>
          <div>
            <span>Trade-in guide</span>
            <strong>${formatVerifiedCurrency(vehicle.tradeInValue)}</strong>
          </div>
        </div>
      </div>

      <div class="consensus-card">
        <span>Consensus retail value</span>
        <strong>${formatVerifiedCurrency(consensusRetail)}</strong>
        <div class="confidence-meter">
          <i style="width: ${confidence.score}%"></i>
        </div>
        <dl>
          <div>
            <dt>Approved comps</dt>
            <dd>${approvedCount}</dd>
          </div>
          <div>
            <dt>Approved comp avg</dt>
            <dd>${formatVerifiedCurrency(approvedCompAverage)}</dd>
          </div>
          <div>
            <dt>Max bid from consensus</dt>
            <dd>${formatCurrency(bidMath.maxBid)}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="research-panel ${researchClass}">
      <div>
        <span>Automatic live comp research</span>
        <strong>${escapeHtml(
          vehicle.compResearchMessage ||
            "Select a run-list vehicle and verified live comps will load here automatically.",
        )}</strong>
        ${
          vehicle.compResearchUpdatedAt
            ? `<small>Last checked ${escapeHtml(vehicle.compResearchUpdatedAt)}</small>`
            : ""
        }
      </div>
    </div>

    <div class="comp-summary-card ${compSummary.className}">
      <div class="comp-summary-main">
        <span>Comp summary</span>
        <h4>${escapeHtml(compSummary.title)}</h4>
        <p>${escapeHtml(compSummary.narrative)}</p>
      </div>
      <div class="comp-summary-values">
        <div>
          <span>Suggested retail</span>
          <strong>${formatVerifiedCurrency(compSummary.suggestedRetail)}</strong>
        </div>
        <div>
          <span>Suggested max bid</span>
          <strong>${formatCurrency(compSummary.suggestedMaxBid)}</strong>
        </div>
        <div>
          <span>Recon reserve</span>
          <strong>${formatCurrency(compSummary.reconReserve)}</strong>
        </div>
      </div>
      <div class="comp-summary-conclusion">
        <span>Why this price</span>
        <p>${escapeHtml(compSummary.conclusion)}</p>
      </div>
      <ul>
        ${compSummary.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      <div class="recon-summary">
        <span>Recon recommendations</span>
        <ul>
          ${compSummary.reconRecommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    </div>

    <div class="comps-wrap">
      <div class="verification-note">
        Accurate comps must come from live listings or verified imports. Price and clickable listing link are required; VIN improves confidence when available.
      </div>
      <table class="comps-table">
        <thead>
          <tr>
            <th>Approve</th>
            <th>Match</th>
            <th>Source</th>
            <th>Year</th>
            <th>Model / Trim</th>
            <th>Km</th>
            <th>Location</th>
            <th>VIN</th>
            <th>Listing</th>
            <th>Price</th>
            <th>Auto adj.</th>
            <th>Adj. value</th>
          </tr>
        </thead>
        <tbody>
          ${
            uniqueComparables.length
              ? uniqueComparables
            .map((comp) => {
              const similarity = getComparableSimilarity(comp, vehicle);
              const trimMatch = getComparableTrimMatch(comp, vehicle);
              const totalAdjustment = getComparableTotalAdjustment(comp, vehicle);
              const hasEvidence = hasComparableEvidence(comp);
              const safeListingUrl = getSafeExternalUrl(comp.listingUrl);

              return `
                <tr class="comp-row-${similarity.className}" data-comp-id="${escapeHtml(comp.id)}">
                  <td>
                    <button class="${comp.approved ? "" : "secondary-button"} small-button" data-comp-toggle="${escapeHtml(comp.id)}" type="button" ${hasEvidence ? "" : "disabled"}>
                      ${hasEvidence ? (comp.approved ? "Approved" : "Approve") : "Needs proof"}
                    </button>
                  </td>
                  <td><span class="pill ${similarity.className}">${similarity.score}%</span></td>
                  <td>
                    ${escapeHtml(comp.source)}
                    <small class="source-quality">${escapeHtml(similarity.sourceQuality.label)}</small>
                  </td>
                  <td>${comp.year}</td>
                  <td>
                    ${escapeHtml(comp.modelTrim)}
                    <small class="source-quality ${trimMatch.className}">${escapeHtml(trimMatch.label)}</small>
                  </td>
                  <td>${formatKm(comp.km)}</td>
                  <td>${escapeHtml(comp.location)}</td>
                  <td><span class="vin-cell">${escapeHtml(comp.vin || "Missing")}</span></td>
                  <td>${
                    safeListingUrl
                      ? `<a class="table-link" href="${escapeHtml(safeListingUrl)}" target="_blank" rel="noopener">Open listing</a>`
                      : "Missing"
                  }</td>
                  <td class="money">${formatCurrency(comp.price)}</td>
                  <td class="money">${formatSignedCurrency(totalAdjustment)}</td>
                  <td class="money">${formatCurrency(getComparableAdjustedValue(comp, vehicle))}</td>
                </tr>
              `;
            })
            .join("")
              : `<tr><td class="empty-state" colspan="12">No market comps loaded yet. Real comps must include source, price, and a clickable listing URL; VIN should be captured when visible.</td></tr>`
          }
        </tbody>
      </table>
    </div>
  `;
}

function renderBidList() {
  const acceptedVehicles = vehicles.filter(
    (vehicle) => vehicle.reviewStatus === "accepted",
  );
  const bidTotal = acceptedVehicles.reduce(
    (sum, vehicle) => sum + getBidMath(vehicle).maxBid,
    0,
  );

  els.bidListCount.textContent = `${acceptedVehicles.length} vehicle${
    acceptedVehicles.length === 1 ? "" : "s"
  }`;
  els.bidListTotal.textContent = formatCurrency(bidTotal);

  if (!acceptedVehicles.length) {
    els.bidRows.innerHTML = `
      <tr>
        <td class="empty-state" colspan="8">No priority vehicles yet.</td>
      </tr>
    `;
    return;
  }

  els.bidRows.innerHTML = acceptedVehicles
    .map((vehicle) => {
      const riskLevel = getRiskLevel(vehicle);
      const riskClass = riskLevel === "low" ? "good" : riskLevel === "medium" ? "warn" : "bad";
      const bidStatus = getBidStatusMeta(vehicle);
      const bidMath = getBidMath(vehicle);

      return `
        <tr data-bid-vehicle-id="${escapeHtml(vehicle.id)}">
          <td><span class="pill ${bidStatus.className}">${bidStatus.label}</span></td>
          <td>
            <div class="vehicle-name">${escapeHtml(vehicle.year)} ${escapeHtml(vehicle.make)} ${escapeHtml(vehicle.model)}</div>
            <div class="vehicle-trim">${escapeHtml(vehicle.trim)} | ${escapeHtml(vehicle.auctionSite)} | Run ${escapeHtml(vehicle.runNumber || "-")}</div>
          </td>
          <td><span class="vin-cell">${escapeHtml(vehicle.vin || "Missing")}</span></td>
          <td><span class="pill ${riskClass}">${riskLevel}</span></td>
          <td class="money">${formatCurrency(bidMath.maxBid)}</td>
          <td class="money">${formatCurrency(getStretchBid(vehicle))}</td>
          <td>
            <div class="table-actions">
              <button class="secondary-button small-button" data-bid-action="no-bid" type="button">No bid</button>
              <button class="small-button" data-bid-action="submitted" type="button">Bid submitted</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderOutcomePanel() {
  const vehicle = vehicles.find((item) => item.id === selectedVehicleId);

  if (!vehicle) {
    els.outcomePanel.innerHTML = `
      <div class="empty-state">Select a vehicle to log bid results, receipts, and sale outcome.</div>
    `;
    return;
  }

  const recommendation = getVehicleRecommendation(vehicle);
  const bidStatus = getBidStatusMeta(vehicle);
  const financials = getOutcomeFinancials(vehicle);
  const identityMatch = getVehicleIdentityMatch(vehicle);
  const accuracy = getOutcomeAccuracy(vehicle);
  const daysToSale = getDaysToSale(vehicle);
  const identitySignals = [...identityMatch.signals, ...identityMatch.warnings]
    .slice(0, 6)
    .map((signal) => `<li>${escapeHtml(signal)}</li>`)
    .join("");
  const learningFlags = accuracy.learningFlags
    .slice(0, 7)
    .map((flag) => `<li>${escapeHtml(flag)}</li>`)
    .join("");
  const receiptRows = vehicle.receiptDocuments.length
    ? vehicle.receiptDocuments
        .map(
          (receipt) => `
            <li>
              <strong>${escapeHtml(receipt.name)}</strong>
              <span>${escapeHtml(receipt.documentType)} | Needs confirmation | ${escapeHtml(receipt.uploadedAt)}</span>
            </li>
          `,
        )
        .join("")
    : "<li><strong>No receipts uploaded</strong><span>Upload purchase, recon, transport, or sale paperwork here.</span></li>";

  els.outcomePanel.innerHTML = `
    <div class="outcome-grid">
      <div class="outcome-card">
        <span>Recommendation</span>
        <strong>${escapeHtml(recommendation.action)}</strong>
        <small>${escapeHtml(recommendation.explanation)}</small>
      </div>
      <div class="outcome-card">
        <span>Auction status</span>
        <strong class="${bidStatus.className}">${escapeHtml(bidStatus.label)}</strong>
        <small>Dealer max: ${formatCurrency(vehicle.dealerMaxBid || vehicle.customBid || getMaxBid(vehicle))}</small>
      </div>
      <div class="outcome-card">
        <span>Total acquisition</span>
        <strong>${formatCurrency(financials.totalAcquisition)}</strong>
        <small>Purchase + fees + transport + recon</small>
      </div>
      <div class="outcome-card">
        <span>Gross profit</span>
        <strong class="${financials.grossProfit >= 0 ? "good" : "bad"}">${vehicle.salePrice ? formatCurrency(financials.grossProfit) : "Not sold"}</strong>
        <small>${vehicle.salePrice ? (daysToSale !== "" ? `${daysToSale} days to sale` : "Sale entered; add dates for days-to-sale") : "Waiting for sale details"}</small>
      </div>
    </div>

    <div class="learning-grid">
      <section class="learning-card">
        <div class="learning-card-header">
          <div>
            <span>Same-car match</span>
            <strong class="${identityMatch.className}">${identityMatch.score}%</strong>
          </div>
          <b>${escapeHtml(identityMatch.label)}</b>
        </div>
        <p>${escapeHtml(identityMatch.method)}</p>
        <ul>${identitySignals || "<li>Add VIN, mileage, run number, and receipt files to improve matching.</li>"}</ul>
      </section>

      <section class="learning-card">
        <div class="learning-card-header">
          <div>
            <span>Price accuracy</span>
            <strong>${formatPercent(accuracy.saleErrorPercent)}</strong>
          </div>
          <b>${escapeHtml(accuracy.bidAccuracy)}</b>
        </div>
        <dl class="accuracy-list">
          <div><dt>Sale vs consensus</dt><dd>${formatSignedCurrency(accuracy.saleDelta)}</dd></div>
          <div><dt>Purchase vs max bid</dt><dd>${formatSignedCurrency(accuracy.purchaseDelta)}</dd></div>
          <div><dt>Profit vs target</dt><dd>${formatSignedCurrency(accuracy.profitDelta)}</dd></div>
        </dl>
        <ul>${learningFlags || "<li>Outcome has enough data for learning.</li>"}</ul>
      </section>
    </div>

    <div class="outcome-form-grid">
      <label>
        <span>Same car confirmed</span>
        <select data-outcome-field="vehicleIdentityConfirmed">
          <option value="" ${!vehicle.vehicleIdentityConfirmed ? "selected" : ""}>Needs check</option>
          <option value="yes" ${vehicle.vehicleIdentityConfirmed === "yes" ? "selected" : ""}>Yes</option>
          <option value="no" ${vehicle.vehicleIdentityConfirmed === "no" ? "selected" : ""}>No</option>
        </select>
      </label>
      <label>
        <span>Followed recommendation</span>
        <select data-outcome-field="followedRecommendation">
          <option value="" ${!vehicle.followedRecommendation ? "selected" : ""}>Not set</option>
          <option value="yes" ${vehicle.followedRecommendation === "yes" ? "selected" : ""}>Yes</option>
          <option value="no" ${vehicle.followedRecommendation === "no" ? "selected" : ""}>No</option>
        </select>
      </label>
      <label>
        <span>Override reason</span>
        <select data-outcome-field="overrideReason">
          ${getOptionList(OVERRIDE_REASONS, vehicle.overrideReason)}
        </select>
      </label>
      <label>
        <span>Dealer max bid</span>
        <input data-outcome-field="dealerMaxBid" type="number" min="0" step="100" value="${getNumberInputValue(vehicle.dealerMaxBid || vehicle.customBid || getMaxBid(vehicle))}" />
      </label>
      <label>
        <span>Actual bid</span>
        <input data-outcome-field="actualBid" type="number" min="0" step="100" value="${getNumberInputValue(vehicle.actualBid)}" />
      </label>
      <label>
        <span>Auction status from receipts</span>
        <select disabled>
          ${Object.entries(BID_STATUS_LABELS)
            .map(
              ([value, meta]) =>
                `<option value="${escapeHtml(value)}" ${vehicle.bidStatus === value ? "selected" : ""}>${escapeHtml(meta.label)}</option>`,
            )
            .join("")}
        </select>
      </label>
      <label>
        <span>Purchase date</span>
        <input data-outcome-field="purchaseDate" type="date" value="${escapeHtml(vehicle.purchaseDate)}" />
      </label>
      <label>
        <span>Purchase price</span>
        <input data-outcome-field="purchasePrice" type="number" min="0" step="100" value="${getNumberInputValue(vehicle.purchasePrice)}" />
      </label>
      <label>
        <span>Actual auction fees</span>
        <input data-outcome-field="actualAuctionFees" type="number" min="0" step="100" value="${getNumberInputValue(vehicle.actualAuctionFees)}" />
      </label>
      <label>
        <span>Transport cost</span>
        <input data-outcome-field="transportCost" type="number" min="0" step="100" value="${getNumberInputValue(vehicle.transportCost)}" />
      </label>
      <label>
        <span>Actual recon</span>
        <input data-outcome-field="actualReconCost" type="number" min="0" step="100" value="${getNumberInputValue(vehicle.actualReconCost)}" />
      </label>
      <label>
        <span>Sale date</span>
        <input data-outcome-field="saleDate" type="date" value="${escapeHtml(vehicle.saleDate)}" />
      </label>
      <label>
        <span>Sale price</span>
        <input data-outcome-field="salePrice" type="number" min="0" step="100" value="${getNumberInputValue(vehicle.salePrice)}" />
      </label>
    </div>

    <label class="outcome-notes">
      <span>Outcome notes</span>
      <textarea data-outcome-field="outcomeNotes" rows="3" placeholder="Why the dealer overrode the app, sale notes, recon surprises">${escapeHtml(vehicle.outcomeNotes)}</textarea>
    </label>

    <div class="receipt-intake">
      <div>
        <p class="eyebrow">Receipt Intake</p>
        <h3>Upload paperwork</h3>
        <p class="page-note">Auction purchase, loss/result, and sale documents now update won/lost/sold status. Future extraction must show fields for confirmation before saving.</p>
      </div>
      <label>
        <span>Document type</span>
        <select id="receiptType">
          ${getOptionList(RECEIPT_TYPES, RECEIPT_TYPES[0][0])}
        </select>
      </label>
      <label class="upload-control">
        <span>Receipt file</span>
        <input data-receipt-upload type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,image/*,application/pdf" />
      </label>
      <ul class="receipt-list">${receiptRows}</ul>
    </div>
  `;
}

function updateSelectedVehicle(updates) {
  vehicles = vehicles.map((vehicle) =>
    vehicle.id === selectedVehicleId ? { ...vehicle, ...updates } : vehicle,
  );
  saveAppState("Saved changes");
  renderVehicles();
}

function updateVehicleById(vehicleId, updates) {
  vehicles = vehicles.map((vehicle) =>
    vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle,
  );
  saveAppState("Saved bid action");
  renderVehicles();
}

function updateSelectedComparable(compId, updates) {
  vehicles = vehicles.map((vehicle) => {
    if (vehicle.id !== selectedVehicleId) {
      return vehicle;
    }

    return {
      ...vehicle,
      comparables: vehicle.comparables.map((comp) =>
        comp.id === compId ? { ...comp, ...updates } : comp,
      ),
    };
  });
  saveAppState("Saved comp");
  renderVehicles();
}

function updateVehicleCompResearch(vehicleId, updates) {
  vehicles = vehicles.map((vehicle) =>
    vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle,
  );
  saveAppState();
  renderVehicles();
}

function getCompResearchPayload(vehicle) {
  return {
    vehicle: {
      id: vehicle.id,
      vin: vehicle.vin,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim,
      km: vehicle.km,
      postalCode: vehicle.postalCode,
      auctionSite: vehicle.auctionSite,
    },
    requirements: {
      market: "southern Ontario",
      workflow: "vin-first identity, then market comparison",
      targetCompCount: TARGET_COMP_COUNT,
      sources: [
        "dealer inventory",
        "OEM certified inventory",
        "AutoTrader Canada",
        "CarGurus Canada",
        "CARFAX Canada",
        "Canadian Black Book",
        "Kijiji/private as weak backup only",
      ],
      requiredFields: ["source", "price", "listingUrl"],
      preferredFields: ["vin", "trim", "drivetrain", "bodyStyle", "evidenceNote"],
    },
  };
}

async function requestVerifiedComps(vehicle) {
  let lastError = null;

  for (const endpoint of COMP_RESEARCH_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getCompResearchPayload(vehicle)),
      });

      if (!response.ok) {
        lastError = `${endpoint} returned ${response.status}`;
        continue;
      }

      return await response.json();
    } catch (error) {
      lastError = error.message;
    }
  }

  throw new Error(lastError || "No comp research backend is connected.");
}

function maybeAutoResearchVehicleComps(vehicleId) {
  const vehicle = vehicles.find((item) => item.id === vehicleId);

  if (!vehicle || vehicle.compResearchStatus === "loading" || autoResearchInFlight.has(vehicleId)) {
    return;
  }

  const uniqueVerifiedCompCount = getUniqueComparables(
    vehicle.comparables.filter(hasComparableEvidence),
  ).length;

  if (uniqueVerifiedCompCount >= TARGET_COMP_COUNT) {
    return;
  }

  autoResearchInFlight.add(vehicleId);
  window.setTimeout(() => {
    researchSelectedVehicleComps(vehicleId).finally(() => {
      autoResearchInFlight.delete(vehicleId);
    });
  }, 250);
}

async function researchSelectedVehicleComps(vehicleId = selectedVehicleId) {
  const vehicle = vehicles.find((item) => item.id === vehicleId);

  if (!vehicle) {
    return;
  }

  updateVehicleCompResearch(vehicle.id, {
    compResearchStatus: "loading",
    compResearchMessage: "Automatically searching verified market listings...",
  });

  try {
    const result = await requestVerifiedComps(vehicle);
    const rawComparables = Array.isArray(result?.comparables) ? result.comparables : [];
    const verifiedComparables = getUniqueComparables(
      rawComparables
        .map((comp, index) => normalizeResearchComparable(comp, vehicle.id, vehicle, index))
        .filter(hasComparableEvidence),
    );

    if (!verifiedComparables.length) {
      updateVehicleCompResearch(vehicle.id, {
        compResearchStatus: "error",
        compResearchMessage:
          "No market comps were returned. Results must include source, price, and listing URL.",
        compResearchUpdatedAt: new Date().toLocaleString("en-CA"),
      });
      return;
    }

    const existingKeys = new Set(vehicle.comparables.flatMap(getComparableKeys));
    const newComparables = verifiedComparables.filter((comp) =>
      getComparableKeys(comp).every((key) => !existingKeys.has(key)),
    );
    const existingUniqueComparables = getUniqueComparables(vehicle.comparables);
    const shouldReplaceWeakSet =
      existingUniqueComparables.length < 3 && verifiedComparables.length >= existingUniqueComparables.length;
    const mergedComparables = shouldReplaceWeakSet
      ? verifiedComparables
      : getUniqueComparables([...vehicle.comparables, ...newComparables]);

    if (!newComparables.length && !shouldReplaceWeakSet) {
      updateVehicleCompResearch(vehicle.id, {
        compResearchStatus: "error",
        compResearchMessage:
          "Research returned only duplicate listings. Try again or widen sources; comps must be distinct vehicles.",
        compResearchUpdatedAt: new Date().toLocaleString("en-CA"),
      });
      return;
    }

    vehicles = vehicles.map((item) =>
      item.id === vehicle.id
        ? {
            ...item,
            comparables: mergedComparables,
            compResearchStatus: "complete",
            compResearchMessage: `${mergedComparables.length} market comps loaded. Review and approve the closest matches.`,
            compResearchUpdatedAt: new Date().toLocaleString("en-CA"),
          }
        : item,
    );
    saveAppState("Verified comps loaded");
    renderVehicles();
  } catch (error) {
    updateVehicleCompResearch(vehicle.id, {
      compResearchStatus: "error",
      compResearchMessage:
        "Live comp research could not finish. Check the backend key, model access, or listing-source availability.",
      compResearchUpdatedAt: new Date().toLocaleString("en-CA"),
    });
  }
}

function saveCurrentMappingPreset() {
  if (!pendingImport) {
    return;
  }

  const presetKey = getPresetKey(pendingImport.preset);

  if (!presetKey) {
    flashButton(els.saveMapping, "Choose source");
    return;
  }

  savedMappingPresets = {
    ...savedMappingPresets,
    [presetKey]: pendingImport.columnMapping,
  };
  saveAppState("Mapping saved");
  renderImportPreview();
}

function clearCurrentMappingPreset() {
  if (!pendingImport) {
    return;
  }

  const presetKey = getPresetKey(pendingImport.preset);

  if (!presetKey) {
    return;
  }

  const { [presetKey]: _removed, ...remainingPresets } = savedMappingPresets;
  savedMappingPresets = remainingPresets;
  pendingImport = buildImportPreviewFromRecords(
    pendingImport.sourceRecords,
    pendingImport.preset,
    pendingImport.fileName,
    pendingImport.fileType,
    getAutoMapping(pendingImport.headers),
  );
  saveAppState("Mapping cleared");
  renderImportPreview();
}

function resetDemoData() {
  nextVehicleId = 1;
  vehicles = rawSampleVehicles.map(withVehicleDefaults);
  selectedVehicleId = vehicles[0]?.id || null;
  lastImportSummary = null;
  savedMappingPresets = {};
  buyingCosts = { ...DEFAULT_BUYING_COSTS };
  saveAppState("Demo reset");
  renderVehicles();
  flashButton(els.resetData, "Demo reset");
}

function resetBidSettings() {
  buyingCosts = { ...DEFAULT_BUYING_COSTS };
  saveAppState("Settings reset");
  renderVehicles();
  flashButton(els.resetBidSettings, "Settings reset");
}

function resetFilters() {
  els.minYear.value = DEFAULT_FILTERS.minYear;
  els.maxYear.value = DEFAULT_FILTERS.maxYear;
  els.maxKm.value = DEFAULT_FILTERS.maxKm;
  els.searchText.value = DEFAULT_FILTERS.searchText;
  els.auctionSite.value = DEFAULT_FILTERS.auctionSite;
  els.resultMode.value = DEFAULT_FILTERS.resultMode;
  renderVehicles();
  setSaveStatus("Filters reset");
  flashButton(els.resetFilters, "Filters reset");
}

function normalizeHeader(header) {
  return header.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseNumber(value) {
  return Number(String(value || "").replace(/[^0-9.]/g, "")) || 0;
}

function parseSignedNumber(value) {
  return Number(String(value || "").replace(/[^0-9.-]/g, "")) || 0;
}

function getField(record, names) {
  return names.map((name) => record[normalizeHeader(name)]).find(Boolean) || "";
}

function getMappedField(record, mapping, fieldKey, fallbackNames) {
  const mappedHeader = mapping?.[fieldKey];

  if (mappedHeader && record[mappedHeader]) {
    return record[mappedHeader];
  }

  return getField(record, fallbackNames);
}

function getImportHeaders(records) {
  return Object.keys(records[0] || {}).filter(Boolean);
}

function getAutoMapping(headers) {
  return Object.fromEntries(
    IMPORT_FIELD_DEFINITIONS.map((field) => {
      const match = field.aliases
        .map(normalizeHeader)
        .find((alias) => headers.includes(alias));

      return [field.key, match || ""];
    }),
  );
}

function getPresetKey(preset) {
  return preset && preset !== "auto" ? preset : "";
}

function getMappingForPreset(preset, headers) {
  const presetKey = getPresetKey(preset);

  if (presetKey && savedMappingPresets[presetKey]) {
    const savedMapping = savedMappingPresets[presetKey];

    return Object.fromEntries(
      IMPORT_FIELD_DEFINITIONS.map((field) => [
        field.key,
        headers.includes(savedMapping[field.key]) ? savedMapping[field.key] : "",
      ]),
    );
  }

  return getAutoMapping(headers);
}

function getImportPresetSite(preset) {
  const labels = {
    autolane: "AutoLane",
    openlane: "OPENLANE",
    traderev: "TradeRev",
    eblock: "EBlock",
  };

  return labels[preset] || "";
}

function splitCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === "\"" && nextChar === "\"") {
      current += "\"";
      index += 1;
    } else if (char === "\"") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function parseCsvRecords(text) {
  const [headerLine, ...rows] = text.trim().split(/\r?\n/);

  if (!headerLine) {
    return [];
  }

  const headers = splitCsvLine(headerLine).map(normalizeHeader);

  return rows
    .filter((row) => row.trim())
    .map((row) => {
      const columns = splitCsvLine(row);

      return Object.fromEntries(
        headers.map((header, index) => [header, columns[index]?.trim() || ""]),
      );
    });
}

function normalizeRecordKeys(record) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      normalizeHeader(key),
      value === null || value === undefined ? "" : String(value).trim(),
    ]),
  );
}

function mapRecordToVehicle(record, preset = "auto", mapping = {}) {
  const presetSite = getImportPresetSite(preset);
  const retailValue = parseNumber(
    getMappedField(record, mapping, "marketValue", [
      "retailValue",
      "retail",
      "marketValue",
      "value",
      "askingPrice",
    ]),
  );
  const vin = getMappedField(record, mapping, "vin", [
    "vin",
    "serial",
    "vehicleIdentificationNumber",
  ]);
  const year = parseNumber(getMappedField(record, mapping, "year", ["year", "modelYear"]));
  const km = parseNumber(
    getMappedField(record, mapping, "km", ["km", "kilometers", "odometer", "mileage"]),
  );
  const auctionSite =
    presetSite ||
    getMappedField(record, mapping, "auctionSite", [
      "auctionSite",
      "auction",
      "source",
      "platform",
      "sale",
    ]) ||
    "Unknown";
  const riskFlags = getMappedField(record, mapping, "riskFlags", [
    "riskFlags",
    "notes",
    "announcements",
  ]);

  return withVehicleDefaults({
    vin,
    runNumber: getMappedField(record, mapping, "runNumber", [
      "runNumber",
      "run",
      "lane",
      "lot",
      "stock",
    ]),
    year,
    make: getMappedField(record, mapping, "make", ["make", "manufacturer"]) || "Unknown",
    model: getMappedField(record, mapping, "model", ["model"]) || "Vehicle",
    trim: getMappedField(record, mapping, "trim", ["trim", "package", "series", "style"]),
    km,
    auctionSite,
    listingUrl: getMappedField(record, mapping, "listingUrl", [
      "listingUrl",
      "url",
      "link",
      "auctionUrl",
      "listing",
    ]),
    retailValue,
    marketValue:
      parseNumber(
        getMappedField(record, mapping, "marketValue", [
          "marketValue",
          "retailValue",
          "retail",
        ]),
      ) ||
      retailValue,
    tradeInValue: parseNumber(
      getMappedField(record, mapping, "tradeInValue", [
        "tradeInValue",
        "tradeIn",
        "wholesale",
      ]),
    ),
    carfaxDisclosures: parseNumber(
      getMappedField(record, mapping, "carfaxDisclosures", [
        "carfaxDisclosures",
        "disclosures",
        "carfax",
      ]),
    ),
    damageSeverity:
      getMappedField(record, mapping, "damageSeverity", ["damageSeverity", "damage"]) ||
      "low",
    reviewStatus: getField(record, ["reviewStatus"]) || "needs-review",
    customBid: parseNumber(getField(record, ["customBid", "bid"])),
    riskFlags: riskFlags ? riskFlags.split("|") : [],
  });
}

function validateImportedVehicle(vehicle, seenVins) {
  const issues = [];

  if (!vehicle.vin) {
    issues.push("Missing VIN");
  } else if (seenVins.has(vehicle.vin)) {
    issues.push("Duplicate VIN");
  }

  if (!vehicle.year) {
    issues.push("Missing year");
  }

  if (!vehicle.km) {
    issues.push("Missing km");
  }

  if (vehicle.year && (vehicle.year < DEFAULT_FILTERS.minYear || vehicle.year > DEFAULT_FILTERS.maxYear)) {
    issues.push("Outside 2015-2022");
  }

  if (vehicle.km >= DEFAULT_FILTERS.maxKm) {
    issues.push("Over 150,000 km");
  }

  if (vehicle.carfaxDisclosures >= 7) {
    issues.push("7+ disclosures");
  }

  if (vehicle.damageSeverity === "high") {
    issues.push("High damage");
  }

  if (vehicle.vin) {
    seenVins.add(vehicle.vin);
  }

  return issues;
}

function buildImportPreviewFromRecords(
  records,
  preset = "auto",
  fileName = "Auction file",
  fileType = "csv",
  mapping = null,
) {
  const seenVins = new Set();
  const normalizedRecords = records.map(normalizeRecordKeys);
  const headers = getImportHeaders(normalizedRecords);
  const columnMapping = mapping || getMappingForPreset(preset, headers);
  const rows = normalizedRecords.map((record, index) => {
    const vehicle = mapRecordToVehicle(record, preset, columnMapping);
    const issues = validateImportedVehicle(vehicle, seenVins);

    return {
      rowNumber: index + 2,
      vehicle,
      issues,
      valid: vehicle.year && vehicle.km && vehicle.vin && !issues.includes("Duplicate VIN"),
      filtered: issues.some((issue) =>
        ["Outside 2015-2022", "Over 150,000 km", "7+ disclosures", "High damage"].includes(
          issue,
        ),
      ),
    };
  });

  return {
    fileName,
    preset,
    fileType,
    sourceRecords: normalizedRecords,
    headers,
    columnMapping,
    rows,
    vehicles: rows.filter((row) => row.valid).map((row) => row.vehicle),
  };
}

function buildImportPreview(text, preset = "auto", fileName = "Auction CSV") {
  return buildImportPreviewFromRecords(parseCsvRecords(text), preset, fileName, "csv");
}

function getFileExtension(fileName) {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

async function buildSpreadsheetPreview(file, preset = "auto") {
  if (!window.XLSX) {
    throw new Error("Excel support is still loading. Try again in a moment.");
  }

  const workbook = window.XLSX.read(await file.arrayBuffer(), { type: "array" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("No worksheet found in this Excel file.");
  }

  const sheet = workbook.Sheets[firstSheetName];
  const records = window.XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  });

  return buildImportPreviewFromRecords(records, preset, file.name, getFileExtension(file.name));
}

function renderImportPreview() {
  if (!pendingImport) {
    els.importPreview.hidden = true;
    return;
  }

  const validRows = pendingImport.rows.filter((row) => row.valid);
  const filteredRows = pendingImport.rows.filter((row) => row.filtered);
  const rowsWithIssues = pendingImport.rows.filter((row) => row.issues.length);
  const issueCounts = rowsWithIssues
    .flatMap((row) => row.issues)
    .reduce((counts, issue) => {
      counts[issue] = (counts[issue] || 0) + 1;
      return counts;
    }, {});

  els.importPreview.hidden = false;
  els.importFileName.textContent = pendingImport.fileName;
  els.importFileName.title = `${pendingImport.fileType.toUpperCase()} import`;
  els.importPreset.value = pendingImport.preset;
  els.uploadPreset.value = pendingImport.preset;
  const presetKey = getPresetKey(pendingImport.preset);
  els.mappingStatus.textContent =
    presetKey && savedMappingPresets[presetKey]
      ? `Saved ${pendingImport.preset} mapping`
      : "Auto mapping";
  els.saveMapping.disabled = !presetKey;
  els.clearMapping.disabled = !presetKey || !savedMappingPresets[presetKey];
  els.mappingFields.innerHTML = IMPORT_FIELD_DEFINITIONS.map((field) => {
    const selectedHeader = pendingImport.columnMapping[field.key] || "";

    return `
      <label>
        <span>${escapeHtml(field.label)}</span>
        <select data-mapping-field="${escapeHtml(field.key)}">
          <option value="">Auto / blank</option>
          ${pendingImport.headers
            .map(
              (header) => `
                <option value="${escapeHtml(header)}" ${header === selectedHeader ? "selected" : ""}>
                  ${escapeHtml(header)}
                </option>
              `,
            )
            .join("")}
        </select>
      </label>
    `;
  }).join("");
  els.importTotal.textContent = pendingImport.rows.length;
  els.importValid.textContent = validRows.length;
  els.importFiltered.textContent = filteredRows.length;
  els.importIssues.textContent = rowsWithIssues.length;
  els.importIssuesList.innerHTML = Object.entries(issueCounts)
    .map(([issue, count]) => `<span>${count} x ${escapeHtml(issue)}</span>`)
    .join("");
  els.importRows.innerHTML = pendingImport.rows
    .slice(0, 12)
    .map((row) => {
      const status = row.valid ? "Ready" : "Blocked";
      const statusClass = row.valid ? "good" : "bad";

      return `
        <tr>
          <td><span class="pill ${statusClass}">${status}</span></td>
          <td><span class="vin-cell">${escapeHtml(row.vehicle.vin || "Missing")}</span></td>
          <td>
            <div class="vehicle-name">${escapeHtml(row.vehicle.make)} ${escapeHtml(row.vehicle.model)}</div>
            <div class="vehicle-trim">${escapeHtml(row.vehicle.trim || "No trim")}</div>
          </td>
          <td>${row.vehicle.year || "-"}</td>
          <td>${row.vehicle.km ? formatKm(row.vehicle.km) : "-"}</td>
          <td>${escapeHtml(row.vehicle.auctionSite)}</td>
          <td>${row.issues.length ? escapeHtml(row.issues.join(", ")) : "None"}</td>
        </tr>
      `;
    })
    .join("");
}

function parseCsv(text, preset = "auto") {
  return buildImportPreview(text, preset).vehicles;
}

async function copyText(text) {
  if (!text) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);
    return copied;
  }
}

function setCopyFeedback(message) {
  const feedback = document.querySelector("#copyFeedback");

  if (feedback) {
    feedback.textContent = message;
  }
}

function flashButton(button, label) {
  const originalText = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = originalText;
  }, 1400);
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function getBidListCsv() {
  const rows = vehicles
    .filter((vehicle) => vehicle.reviewStatus === "accepted")
    .map((vehicle) => {
      const identityMatch = getVehicleIdentityMatch(vehicle);
      const accuracy = getOutcomeAccuracy(vehicle);

      return [
        getBidStatusMeta(vehicle).label,
        `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        vehicle.trim,
        vehicle.vin,
        vehicle.auctionSite,
        vehicle.runNumber,
        getRiskLevel(vehicle),
        getMaxBid(vehicle),
        getStretchBid(vehicle),
        vehicle.customBid || "",
        vehicle.actualBid || "",
        vehicle.salePrice || "",
        identityMatch.score,
        accuracy.saleDelta ?? "",
        accuracy.purchaseDelta ?? "",
        accuracy.profitDelta ?? "",
        vehicle.followedRecommendation || "",
        vehicle.overrideReason || "",
        vehicle.notes,
      ];
    });

  return [
    [
      "Status",
      "Vehicle",
      "Trim",
      "VIN",
      "Auction",
      "Run",
      "Risk",
      "Max Bid",
      "Stretch Bid",
      "Custom Bid",
      "Actual Bid",
      "Sale Price",
      "Identity Match Score",
      "Sale Vs Consensus",
      "Purchase Vs Max Bid",
      "Profit Vs Target",
      "Followed Recommendation",
      "Override Reason",
      "Notes",
    ],
    ...rows,
  ]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");
}

els.minYear.addEventListener("input", renderVehicles);
els.maxYear.addEventListener("input", renderVehicles);
els.maxKm.addEventListener("input", renderVehicles);
els.searchText.addEventListener("input", renderVehicles);
els.auctionSite.addEventListener("change", renderVehicles);
els.resultMode.addEventListener("change", renderVehicles);
els.resetFilters.addEventListener("click", resetFilters);
els.resetData.addEventListener("click", resetDemoData);
els.resetBidSettings.addEventListener("click", resetBidSettings);

document.querySelectorAll("[data-bid-setting]").forEach((input) => {
  input.addEventListener("change", () => {
    buyingCosts = {
      ...buyingCosts,
      [input.dataset.bidSetting]: parseNumber(input.value),
    };
    saveAppState("Settings saved");
    renderVehicles();
  });
});

els.vehicleRows.addEventListener("click", (event) => {
  const selectButton = event.target.closest("[data-select-vehicle]");
  const row = event.target.closest("[data-vehicle-id]");
  const vehicleId = selectButton?.dataset.selectVehicle || row?.dataset.vehicleId;

  if (!vehicleId) {
    return;
  }

  selectedVehicleId = vehicleId;
  saveAppState();
  renderVehicles();
  maybeAutoResearchVehicleComps(vehicleId);
});

els.reviewPanel.addEventListener("click", async (event) => {
  const statusButton = event.target.closest("[data-review-status]");
  const copyVinButton = event.target.closest("[data-copy-vin]");
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId);

  if (copyVinButton) {
    const copied = await copyText(selectedVehicle?.vin || "");
    flashButton(copyVinButton, copied ? "VIN copied" : "Copy failed");
    return;
  }

  if (statusButton) {
    const updates = { reviewStatus: statusButton.dataset.reviewStatus };

    if (statusButton.dataset.reviewStatus === "accepted") {
      const suggestedMaxBid = getMaxBid(selectedVehicle);
      updates.dealerMaxBid = selectedVehicle.dealerMaxBid || suggestedMaxBid;
      updates.customBid = selectedVehicle.customBid || suggestedMaxBid;
    }

    updateSelectedVehicle(updates);
    return;
  }
});

els.reviewPanel.addEventListener("change", (event) => {
  const field = event.target.dataset.reviewField;
  const carfaxCategory = event.target.dataset.carfaxCategory;
  const damageCheck = event.target.dataset.damageCheck;
  const carfaxUpload = event.target.matches("[data-carfax-upload]");

  if (carfaxUpload && event.target.files?.length) {
    const [file] = event.target.files;
    updateSelectedVehicle({
      carfaxFileName: file.name,
      carfaxUploadedAt: new Date().toLocaleString("en-CA", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    });
    return;
  }

  if (carfaxCategory) {
    const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId);
    updateSelectedVehicle({
      carfaxCategories: {
        ...selectedVehicle.carfaxCategories,
        [carfaxCategory]: event.target.checked,
      },
    });
    return;
  }

  if (damageCheck) {
    const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId);
    updateSelectedVehicle({
      damageChecks: {
        ...selectedVehicle.damageChecks,
        [damageCheck]: event.target.checked,
      },
    });
    return;
  }

  if (!field) {
    return;
  }

  const numericFields = new Set([
    "carfaxDisclosures",
    "tradeInValue",
    "marketValue",
    "customBid",
  ]);

  updateSelectedVehicle({
    [field]: numericFields.has(field) ? parseNumber(event.target.value) : event.target.value,
  });
});

els.valuationPanel.addEventListener("click", (event) => {
  const toggleButton = event.target.closest("[data-comp-toggle]");

  if (!toggleButton) {
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId);
  const comp = selectedVehicle?.comparables.find(
    (item) => item.id === toggleButton.dataset.compToggle,
  );

  if (!comp) {
    return;
  }

  updateSelectedComparable(comp.id, { approved: !comp.approved });
});

els.valuationPanel.addEventListener("change", (event) => {
  const valuationField = event.target.dataset.valuationField;
  const compField = event.target.dataset.compField;

  if (valuationField) {
    const numericFields = new Set([
      "blackBookRetail",
      "autoTraderAverage",
      "carGurusValue",
      "marketValue",
      "tradeInValue",
    ]);

    updateSelectedVehicle({
      [valuationField]: numericFields.has(valuationField)
        ? parseNumber(event.target.value)
        : event.target.value.trim(),
    });
    return;
  }

  if (!compField) {
    return;
  }

  const row = event.target.closest("[data-comp-id]");

  if (!row) {
    return;
  }

  updateSelectedComparable(row.dataset.compId, {
    [compField]: parseNumber(event.target.value),
  });
});

els.outcomePanel.addEventListener("change", (event) => {
  const field = event.target.dataset.outcomeField;
  const receiptUpload = event.target.matches("[data-receipt-upload]");
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId);

  if (receiptUpload && selectedVehicle && event.target.files?.length) {
    const receiptType = document.querySelector("#receiptType")?.value || RECEIPT_TYPES[0][0];
    const receiptTypeLabel =
      RECEIPT_TYPES.find(([value]) => value === receiptType)?.[1] || "Receipt";
    const uploadedAt = new Date().toLocaleString("en-CA", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const newReceipts = [...event.target.files].map((file, index) => ({
      id: `${selectedVehicle.id}-receipt-${Date.now()}-${index}`,
      name: file.name,
      documentType: receiptTypeLabel,
      uploadedAt,
      confidence: "Needs confirmation",
    }));
    const receiptBidStatus = getBidStatusFromReceiptType(receiptType);
    const updates = {
      receiptDocuments: [...selectedVehicle.receiptDocuments, ...newReceipts],
    };

    if (receiptBidStatus) {
      updates.bidStatus = receiptBidStatus;
    }

    if (receiptBidStatus === "purchased" || receiptBidStatus === "sold") {
      updates.vehicleIdentityConfirmed = selectedVehicle.vehicleIdentityConfirmed || "yes";
    }

    updateSelectedVehicle(updates);
    return;
  }

  if (!field) {
    return;
  }

  const numericFields = new Set([
    "dealerMaxBid",
    "actualBid",
    "purchasePrice",
    "actualAuctionFees",
    "transportCost",
    "actualReconCost",
    "salePrice",
  ]);
  const value = numericFields.has(field) ? parseNumber(event.target.value) : event.target.value;
  const updates = { [field]: value };

  if (field === "dealerMaxBid") {
    updates.customBid = value;
  }

  updateSelectedVehicle(updates);
});

els.copyAccepted.addEventListener("click", async () => {
  const acceptedVehicles = vehicles.filter(
    (vehicle) => vehicle.reviewStatus === "accepted" && vehicle.vin,
  );
  const text = acceptedVehicles
    .map((vehicle) => `${vehicle.vin}\t${vehicle.year} ${vehicle.make} ${vehicle.model}`)
    .join("\n");
  const copied = await copyText(text);

  flashButton(
    els.copyAccepted,
    copied ? `${acceptedVehicles.length} VINs copied` : "No priority VINs",
  );
});

els.copyBidList.addEventListener("click", async () => {
  const acceptedCount = vehicles.filter((vehicle) => vehicle.reviewStatus === "accepted").length;

  if (!acceptedCount) {
    flashButton(els.copyBidList, "No priority vehicles");
    return;
  }

  const copied = await copyText(getBidListCsv());
  flashButton(els.copyBidList, copied ? "CSV copied" : "Copy failed");
});

els.bidRows.addEventListener("click", async (event) => {
  const actionButton = event.target.closest("[data-bid-action]");
  const row = event.target.closest("[data-bid-vehicle-id]");
  const vehicle = vehicles.find((item) => item.id === row?.dataset.bidVehicleId);

  if (!vehicle) {
    return;
  }

  if (actionButton) {
    const bidStatus = actionButton.dataset.bidAction;
    const finalBid = vehicle.customBid || getMaxBid(vehicle);
    const updates = { bidStatus };

    if (bidStatus === "no-bid") {
      updates.actualBid = 0;
    }

    if (bidStatus === "submitted") {
      updates.actualBid = vehicle.actualBid || finalBid;
    }

    updateVehicleById(vehicle.id, updates);
    return;
  }
});

els.bidRows.addEventListener("change", (event) => {
  const field = event.target.dataset.bidField;
  const row = event.target.closest("[data-bid-vehicle-id]");

  if (!field || !row) {
    return;
  }

  const value = parseNumber(event.target.value);
  updateVehicleById(row.dataset.bidVehicleId, {
    [field]: value,
    dealerMaxBid: value,
  });
});

els.importPreset.addEventListener("change", () => {
  if (!pendingImport) {
    return;
  }

  els.uploadPreset.value = els.importPreset.value;
  pendingImport = buildImportPreviewFromRecords(
    pendingImport.sourceRecords,
    els.importPreset.value,
    pendingImport.fileName,
    pendingImport.fileType,
  );
  renderImportPreview();
});

els.uploadPreset.addEventListener("change", () => {
  if (!pendingImport) {
    return;
  }

  els.importPreset.value = els.uploadPreset.value;
  pendingImport = buildImportPreviewFromRecords(
    pendingImport.sourceRecords,
    els.uploadPreset.value,
    pendingImport.fileName,
    pendingImport.fileType,
  );
  renderImportPreview();
});

els.saveMapping.addEventListener("click", saveCurrentMappingPreset);
els.clearMapping.addEventListener("click", clearCurrentMappingPreset);

els.mappingFields.addEventListener("change", (event) => {
  const fieldKey = event.target.dataset.mappingField;

  if (!pendingImport || !fieldKey) {
    return;
  }

  const nextMapping = {
    ...pendingImport.columnMapping,
    [fieldKey]: event.target.value,
  };

  pendingImport = buildImportPreviewFromRecords(
    pendingImport.sourceRecords,
    els.importPreset.value,
    pendingImport.fileName,
    pendingImport.fileType,
    nextMapping,
  );
  renderImportPreview();
});

els.cancelImport.addEventListener("click", () => {
  pendingImport = null;
  els.csvUpload.value = "";
  renderImportPreview();
});

els.applyImport.addEventListener("click", () => {
  if (!pendingImport?.vehicles.length) {
    flashButton(els.applyImport, "No valid rows");
    return;
  }

  vehicles = pendingImport.vehicles;
  selectedVehicleId = vehicles[0]?.id || null;
  lastImportSummary = getImportSummary(pendingImport);
  pendingImport = null;
  els.csvUpload.value = "";
  saveAppState("Import saved");
  renderImportPreview();
  renderVehicles();
  maybeAutoResearchVehicleComps(selectedVehicleId);
});

els.csvUpload.addEventListener("change", async (event) => {
  const [file] = event.target.files;

  if (!file) {
    return;
  }

  try {
    const extension = getFileExtension(file.name);

    const selectedPreset = els.uploadPreset.value;
    els.importPreset.value = selectedPreset;

    if (extension === "xlsx" || extension === "xls") {
      pendingImport = await buildSpreadsheetPreview(file, selectedPreset);
    } else {
      pendingImport = buildImportPreview(await file.text(), selectedPreset, file.name);
    }

    renderImportPreview();
  } catch (error) {
    pendingImport = null;
    renderImportPreview();
    setSaveStatus(error.message || "Import failed");
  }
});

document.querySelectorAll(".nav-list a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-list a").forEach((item) => {
      item.classList.toggle("active", item === link);
    });
  });
});

document.querySelector("#downloadSingleHtml")?.addEventListener("click", () => {
  const downloadButton = document.querySelector("#downloadSingleHtml");
  const html = `<!doctype html>\n${document.documentElement.outerHTML}`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "auction-buyer-upload.html";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setSaveStatus("HTML downloaded");
  flashButton(downloadButton, "Downloaded");
});

renderVehicles();
renderImportPreview();
maybeAutoResearchVehicleComps(selectedVehicleId);
