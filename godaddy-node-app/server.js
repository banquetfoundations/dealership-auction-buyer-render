const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path");

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-4.1-mini";
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["comparables", "researchNotes"],
  properties: {
    researchNotes: { type: "string" },
    comparables: {
      type: "array",
      maxItems: 8,
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
    comp.vin &&
    /^https?:\/\//i.test(comp.listingUrl || "") &&
    cleanNumber(comp.price) > 0
  );
}

function normalizeComparable(comp) {
  return {
    source: String(comp.source || "").trim(),
    vin: String(comp.vin || "").trim().toUpperCase(),
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
    "Research current used-vehicle retail comparables for a southern Ontario dealership.",
    `Target vehicle: ${target}`,
    `Target VIN: ${vehicle.vin || "unknown"}`,
    `Target km: ${vehicle.km || "unknown"}`,
    `Market/postal code: ${postalCode}`,
    "",
    "Use live web search and prioritize the sharpest available Canadian/Ontario comp sources in this order:",
    "1. Official dealer inventory pages with VIN, price, mileage, trim, location, and listing URL.",
    "2. OEM certified pre-owned inventory pages when they match the same model/trim/drivetrain.",
    "3. AutoTrader Canada and CarGurus Canada verified retail listings.",
    "4. CARFAX Canada/vehicle-history valuation or listing pages when visible and sourceable.",
    "5. Canadian Black Book-style valuation pages only when an exact public source is available.",
    "6. Kijiji/private marketplace listings only as weak backup comps, never ahead of dealer or verified marketplace listings.",
    "Only return listings that visibly provide a price, a VIN, and a clickable listing URL.",
    "Do not invent VINs, prices, URLs, trims, or mileage. If the VIN is not visible, exclude the listing.",
    "Prefer same year, make, model, trim/package, drivetrain, Ontario listings, and mileage within 25,000 km.",
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
    const comparables = (parsed.comparables || [])
      .map(normalizeComparable)
      .filter(hasRequiredEvidence);

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
