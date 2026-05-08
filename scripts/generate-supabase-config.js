/**
 * יוצר supabase-config.js ממשתני סביבה (פריסת Netlify / CI).
 * מקומית: אם אין משתנים אבל כבר קיים supabase-config.js — לא נוגעים.
 * אם אין קובץ — מעתיקים מ-supabase-config.example.js.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const outPath = path.join(root, "supabase-config.js");
const examplePath = path.join(root, "supabase-config.example.js");

const url = process.env.SUPABASE_URL && String(process.env.SUPABASE_URL).trim();
const key = process.env.SUPABASE_ANON_KEY && String(process.env.SUPABASE_ANON_KEY).trim();
const isCI =
  process.env.NETLIFY === "true" ||
  process.env.CI === "true" ||
  process.env.CONTINUOUS_INTEGRATION === "true";

function writeConfig(u, k) {
  const body = `/* Generated at build time (Netlify). File is gitignored. */
window.__SHOPPING_LIST_SUPABASE__ = {
  url: ${JSON.stringify(u)},
  anonKey: ${JSON.stringify(k)},
};
`;
  fs.writeFileSync(outPath, body, "utf8");
  console.log("supabase-config.js נכתב מ-SUPABASE_URL / SUPABASE_ANON_KEY");
}

if (url && key) {
  writeConfig(url, key);
  process.exit(0);
}

if (isCI) {
  console.error(
    "בפריסה (Netlify) חובה להגדיר משתני סביבה:\n" +
      "  SUPABASE_URL\n" +
      "  SUPABASE_ANON_KEY\n" +
      "(Project Settings → Environment variables)"
  );
  process.exit(1);
}

if (fs.existsSync(outPath)) {
  console.log("קיים supabase-config.js — לא שינינו (אין משתני סביבה).");
  process.exit(0);
}

if (!fs.existsSync(examplePath)) {
  console.error("חסר קובץ supabase-config.example.js");
  process.exit(1);
}

fs.copyFileSync(examplePath, outPath);
console.warn(
  "הועתק supabase-config.example.js → supabase-config.js — מלא ערכים אמיתיים מ-Supabase Dashboard."
);
process.exit(0);
