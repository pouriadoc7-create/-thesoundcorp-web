// Shared helpers for the asset pipeline.
import { createHash } from "node:crypto";
import { mkdir, readdir, stat, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { IMAGE_EXT, USER_AGENT } from "./config.mjs";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** asset-library/ root (parent of _pipeline). */
export const ROOT = path.resolve(__dirname, "..");
export const libraryPath = (...p) => path.join(ROOT, "Master Assets", ...p);

export const slugify = (s) =>
  s.toString().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const ensureDir = (p) => mkdir(p, { recursive: true });

export function extname(u) {
  try { return path.extname(new URL(u).pathname).toLowerCase(); }
  catch { return path.extname(u).toLowerCase(); }
}

/** Download a binary asset with a browser UA. Returns {ok, bytes, status, buf}. */
export async function fetchBinary(url, { timeout = 30000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
    });
    if (!res.ok) return { ok: false, status: res.status };
    const buf = Buffer.from(await res.arrayBuffer());
    return { ok: true, status: res.status, buf, bytes: buf.length, type: res.headers.get("content-type") };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  } finally { clearTimeout(t); }
}

/** Fetch text (HTML/JSON) from an official domain. */
export async function fetchText(url, { timeout = 30000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": USER_AGENT } });
    return { ok: res.ok, status: res.status, text: res.ok ? await res.text() : "" };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  } finally { clearTimeout(t); }
}

export function sha1(buf) { return createHash("sha1").update(buf).digest("hex"); }

/** Recursively list files under dir (absolute paths). */
export async function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

export const isImage = (p) => IMAGE_EXT.has(path.extname(p).toLowerCase());

export async function fileInfo(p) {
  const s = await stat(p);
  return { path: p, bytes: s.size };
}

/** 64-bit difference hash for near-duplicate detection (needs a sharp instance). */
export async function dHash(sharp, buf) {
  const { data } = await sharp(buf).grayscale().resize(9, 8, { fit: "fill" })
    .raw().toBuffer({ resolveWithObject: true });
  let bits = "";
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      bits += data[r * 9 + c] > data[r * 9 + c + 1] ? "1" : "0";
  return BigInt("0b" + bits).toString(16).padStart(16, "0");
}

export async function readJSON(p, fallback = null) {
  try { return JSON.parse(await readFile(p, "utf8")); } catch { return fallback; }
}
