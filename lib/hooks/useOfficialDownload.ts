"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DownloadStatus = "idle" | "loading" | "success" | "error";

export interface OfficialDownloadArgs {
  brand: string;
  product: string;
  doc: string;
  /** Fallback filename if the response omits Content-Disposition. */
  filename: string;
}

/**
 * Downloads an official manufacturer file through our same-origin proxy while
 * keeping the user on the page. Streams the response so `progress` and the
 * success/error states are REAL (never faked): the file is read chunk by
 * chunk, assembled into a blob, and saved via a transient object URL. No new
 * tab, no navigation, no server-side storage.
 */
export function useOfficialDownload() {
  const [status, setStatus] = useState<DownloadStatus>("idle");
  /** 0..1 when the size is known, or `null` for an indeterminate transfer. */
  const [progress, setProgress] = useState<number | null>(null);
  const resetTimer = useRef<number | null>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const scheduleReset = useCallback((delay: number) => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      setStatus("idle");
      setProgress(null);
    }, delay);
  }, []);

  const download = useCallback(
    async ({ brand, product, doc, filename }: OfficialDownloadArgs) => {
      if (inFlight.current) return;
      inFlight.current = true;
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
      setStatus("loading");
      setProgress(null);

      try {
        const url = `/api/download?brand=${encodeURIComponent(brand)}&product=${encodeURIComponent(
          product
        )}&doc=${encodeURIComponent(doc)}`;
        const res = await fetch(url, { headers: { accept: "*/*" } });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const total = Number(res.headers.get("content-length")) || 0;

        // Prefer the server-provided filename (Content-Disposition), else fallback.
        let outName = filename;
        const cd = res.headers.get("content-disposition");
        const match = cd && /filename\*?=(?:UTF-8'')?"?([^"';]+)"?/i.exec(cd);
        if (match?.[1]) {
          try {
            outName = decodeURIComponent(match[1]);
          } catch {
            outName = match[1];
          }
        }

        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.byteLength;
            setProgress(total ? Math.min(received / total, 1) : null);
          }
        }

        const blob = new Blob(chunks as BlobPart[]);
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = outName;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);

        setStatus("success");
        setProgress(1);
        scheduleReset(2200);
      } catch {
        setStatus("error");
        setProgress(null);
        scheduleReset(3200);
      } finally {
        inFlight.current = false;
      }
    },
    [scheduleReset]
  );

  return { status, progress, download };
}
