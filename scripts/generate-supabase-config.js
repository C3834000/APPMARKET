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

function extractAnonKey(raw) {
  const s = String(raw).trim();
  const m = s.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
  return m ? m[0] : s;
}

function projectRefFromUrl(u) {
  try {
    const m = new URL(u).hostname.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

function projectRefFromJwt(key) {
  const parts = key.split(".");
  if (parts.length < 2) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(b64, "base64").toString("utf8");
    const payload = JSON.parse(json);
    return payload.ref || null;
  } catch {
    return null;
  }
}

const url = process.env.SUPABASE_URL && String(process.env.SUPABASE_URL).trim();
const key =
  process.env.SUPABASE_ANON_KEY && extractAnonKey(process.env.SUPABASE_ANON_KEY);
const isCI =
  process.env.NETLIFY === "true" ||
  String(process.env.NETLIFY || "") === "1" ||
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
  if (/SUPABASE_|=\s*https?:\/\//i.test(String(process.env.SUPABASE_ANON_KEY || ""))) {
    console.error(
      "SUPABASE_ANON_KEY נראה מקולקל (הודבקו גם URL ושם המשתנה).\n" +
        "ב-Netlify הגדר רק את מפתח ה-anon (שורה אחת שמתחילה ב-eyJ...)."
    );
    process.exit(1);
  }
  const urlRef = projectRefFromUrl(url);
  const keyRef = projectRefFromJwt(key);
  if (urlRef && keyRef && urlRef !== keyRef) {
    console.error(
      "SUPABASE_URL וה-anon key לא מאותו פרויקט Supabase:\n" +
        `  URL → ${urlRef}\n` +
        `  key → ${keyRef}\n` +
        "העתק את שניהם מ-Project Settings → API באותו פרויקט."
    );
    process.exit(1);
  }
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
