const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path");

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-4.1-mini";
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const TARGET_COMP_COUNT = 12;

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["comparables", "researchNotes"],
  properties: {
    researchNotes: { type: "string" },
    comparables: {
      type: "array",
      maxItems: 15,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "source",
          "vin",
          "listingUrl",
          "year",
          "modelTrim",
          "km",
          "location",
          "price",
          "adjustment",
          "evidenceNote",
        ],
        properties: {
          source: { type: "string" },
          vin: { type: "string" },
          listingUrl: { type: "string" },
          year: { type: "number" },
          modelTrim: { type: "string" },
          km: { type: "number" },
          location: { type: "string" },
          price: { type: "number" },
          adjustment: { type: "number" },
          evidenceNote: { type: "string" },
        },
      },
    },
  },
};

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
  res.end(JSON.stringify(body));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function cleanNumber(value) {
  return Number(String(value || "").replace(/[^0-9.-]/g, "")) || 0;
}

function hasRequiredEvidence(comp) {
  return (
    comp &&
    comp.source &&
    /^https?:\/\//i.test(comp.listingUrl || "") &&
    cleanNumber(comp.price) > 0
  );
}

function normalizeVin(value) {
  return String(value || "").replace(/[^a-z0-9]/gi, "").toUpperCase();
}

function normalizeListingUrl(value) {
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
  const vin = normalizeVin(comp.vin);
  const keys = [];

  if (vin.length >= 8) {
    keys.push(`vin:${vin}`);
  }

  const normalizedUrl = normalizeListingUrl(comp.listingUrl);

  if (normalizedUrl) {
    keys.push(`url:${normalizedUrl}`);
  }

  const listingId = String(comp.listingUrl || "").match(/(?:listing|details|inventory|vehicle|vdp)[=/_-]?([a-z0-9-]{6,})/i)?.[1];

  if (listingId) {
    keys.push(`listing:${listingId.toLowerCase()}`);
  }

  const fingerprint = [
    String(comp.source || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
    cleanNumber(comp.year),
    String(comp.modelTrim || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
    Math.round(cleanNumber(comp.km) / 500) * 500,
    Math.round(cleanNumber(comp.price) / 100) * 100,
    String(comp.location || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
  ].join(":");

  if (fingerprint.replace(/[:0]/g, "")) {
    keys.push(`fingerprint:${fingerprint}`);
  }

  return keys;
}

function uniqueComparables(comparables) {
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

function normalizeComparable(comp) {
  return {
    source: String(comp.source || "").trim(),
    vin: normalizeVin(comp.vin),
    listingUrl: String(comp.listingUrl || "").trim(),
    year: cleanNumber(comp.year),
    modelTrim: String(comp.modelTrim || "").trim(),
    km: cleanNumber(comp.km),
    location: String(comp.location || "").trim(),
    price: cleanNumber(comp.price),
    adjustment: cleanNumber(comp.adjustment),
    evidenceNote: String(comp.evidenceNote || "").trim(),
  };
}

function buildPrompt(payload) {
  const vehicle = payload.vehicle || {};
  const postalCode = vehicle.postalCode || "N6A 1A1";
  const target = `${vehicle.year || ""} ${vehicle.make || ""} ${vehicle.model || ""} ${
    vehicle.trim || ""
  }`
    .replace(/\s+/g, " ")
    .trim();

  return [
    "Research current used-vehicle retail comparables for a southern Ontario dealership using a VIN-first workflow.",
    `Target vehicle: ${target}`,
    `Target VIN: ${vehicle.vin || "unknown"}`,
    `Target km: ${vehicle.km || "unknown"}`,
    `Market/postal code: ${postalCode}`,
    "",
    "Step 1: Use the target VIN first to identify or validate the exact vehicle trim, engine, drivetrain, body style, and package when public sources expose that information.",
    "Step 2: Search the target VIN directly across CarGurus, AutoTrader, dealer pages, CARFAX Canada, Canadian Black Book, Google-indexed dealer inventory, and auction/listing snippets.",
    "Step 3: If a public valuation/listing result for the exact VIN exists, use it as identity evidence only. Do not treat the auction vehicle itself as a comparable retail listing unless it is a public retail listing with price.",
    "Step 4: After VIN identity is known, compare against distinct active market listings with matching year/make/model/trim/body/drivetrain/mileage/location.",
    "Step 5: If exact trim comps are thin, widen gradually and explain every compromise in evidenceNote.",
    "",
    "Use live web search and prioritize the sharpest available Canadian/Ontario comp sources in this order:",
    "1. Official dealer inventory pages with VIN, price, mileage, trim, location, and listing URL.",
    "2. OEM certified pre-owned inventory pages when they match the same model/trim/drivetrain.",
    "3. AutoTrader Canada and CarGurus Canada verified retail listings.",
    "4. CARFAX Canada/vehicle-history valuation or listing pages when visible and sourceable.",
    "5. Canadian Black Book-style valuation pages only when an exact public source is available.",
    "6. Kijiji/private marketplace listings only as weak backup comps, never ahead of dealer or verified marketplace listings.",
    "Only return candidate comparable listings that visibly provide a price and a clickable listing URL. VIN is strongly preferred but not required for candidate comps.",
    "Do not invent VINs, prices, URLs, trims, or mileage. If the VIN is not visible, return an empty VIN and explain VIN missing in evidenceNote.",
    "Every comparable must be a different vehicle. Never return the same listing, same VIN, or same dealer page more than once.",
    "If a search result page contains many listings, open individual listing pages and return only distinct vehicles.",
    "If CarGurus has many matching listings, include multiple distinct CarGurus vehicle detail pages rather than repeating one listing.",
    `Return a broad option set: aim for ${TARGET_COMP_COUNT} distinct candidate comps when available, not just the closest 3-5.`,
    "Search in separate buckets before returning: exact trim, trim spelling variants, adjacent trims, dealer inventory, AutoTrader, CarGurus, OEM/CPO, and broader Ontario listings.",
    "If one source has limited results, continue to another source instead of returning a tiny list.",
    "Do not stop after finding the first good result. The dealer needs enough options to approve/reject comps manually.",
    "Compromise rules when exact trim is sparse: first same trim/package; then same generation/body/drivetrain with adjacent trims; then +/- 1 model year with similar mileage; then same model with a clear adjustment.",
    "For Honda Civic EX-T/EXT, treat EX-T, EX T, EXT, EX, Touring, LX turbo, sedan/coupe body style, and 2017-2019 Civic listings as potential backup comps only when exact EX-T comps are limited. Explain the compromise in evidenceNote.",
    "Prefer same year, make, model, trim/package, drivetrain, Ontario listings, and mileage within 25,000 km, but do not repeat one exact listing just to fill spots.",
    "Use the evidenceNote to say why the comp is strong or weak, including source quality, trim match, km difference, and location.",
    "The adjustment should be a simple retail-value adjustment versus the target vehicle for mileage/year/trim differences. Use 0 if unsure.",
    "Return JSON only in the requested schema.",
  ].join("\n");
}

function postJson(url, headers, body) {
  const parsedUrl = new URL(url);
  const bodyText = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: parsedUrl.hostname,
        path: `${parsedUrl.pathname}${parsedUrl.search}`,
        method: "POST",
        headers: {
          ...headers,
          "Content-Length": Buffer.byteLength(bodyText),
        },
      },
      (response) => {
        let responseBody = "";
        response.on("data", (chunk) => {
          responseBody += chunk;
        });
        response.on("end", () => {
          try {
            resolve({
              ok: response.statusCode >= 200 && response.statusCode < 300,
              status: response.statusCode,
              body: JSON.parse(responseBody || "{}"),
            });
          } catch (error) {
            reject(new Error("OpenAI returned invalid JSON."));
          }
        });
      }
    );

    request.on("error", reject);
    request.write(bodyText);
    request.end();
  });
}

async function handleResearchComps(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    });
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Use POST.", comparables: [] });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    sendJson(res, 500, {
      error: "OPENAI_API_KEY is not configured on the server.",
      comparables: [],
    });
    return;
  }

  let payload;
  try {
    payload = JSON.parse(await readRequestBody(req));
  } catch (error) {
    sendJson(res, 400, { error: "Invalid JSON request.", comparables: [] });
    return;
  }

  if (!payload?.vehicle) {
    sendJson(res, 400, { error: "Missing vehicle payload.", comparables: [] });
    return;
  }

  const requestBody = {
    model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
    input: buildPrompt(payload),
    tools: [{ type: "web_search" }],
    text: {
      format: {
        type: "json_schema",
        name: "verified_vehicle_comps",
        strict: true,
        schema: responseSchema,
      },
    },
  };

  try {
    const response = await postJson(
      OPENAI_API_URL,
      {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      requestBody
    );
    const raw = response.body;

    if (!response.ok) {
      sendJson(res, response.status, {
        error: raw.error?.message || "OpenAI request failed.",
        comparables: [],
      });
      return;
    }

    const outputText =
      raw.output_text ||
      raw.output
        ?.flatMap((item) => item.content || [])
        .find((content) => content.type === "output_text")?.text ||
      "";
    const parsed = JSON.parse(outputText);
    const comparables = uniqueComparables(
      (parsed.comparables || [])
        .map(normalizeComparable)
        .filter(hasRequiredEvidence)
    );

    sendJson(res, 200, {
      researchNotes: parsed.researchNotes || "",
      comparables,
    });
  } catch (error) {
    sendJson(res, 500, {
      error: error.message || "Unable to research comps.",
      comparables: [],
    });
  }
}

function serveStatic(req, res) {
  const requestPath = decodeURIComponent(req.url.split("?")[0]);
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, safePath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/research-comps") || req.url.startsWith("/research-comps")) {
    handleResearchComps(req, res);
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Dealership auction buyer running on port ${PORT}`);
});
