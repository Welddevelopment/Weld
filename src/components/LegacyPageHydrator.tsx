"use client";

import { useEffect, useRef } from "react";

import type { LegacyScript, PageVariant } from "@/lib/legacy-page";

interface LegacyPageHydratorProps {
  bodyHtml: string;
  styles: string;
  scripts: LegacyScript[];
  page: PageVariant;
}

export default function LegacyPageHydrator({
  bodyHtml,
  styles,
  scripts,
  page
}: LegacyPageHydratorProps) {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) {
      return;
    }

    ranRef.current = true;

    const previousPage = document.body.dataset.page;
    document.body.dataset.page = page;

    const mountedScripts: HTMLScriptElement[] = [];
    let cancelled = false;

    const loadScripts = async () => {
      for (const script of scripts) {
        if (cancelled) {
          return;
        }

        if (script.type === "external") {
          await new Promise<void>((resolve, reject) => {
            const node = document.createElement("script");
            node.src = script.src;
            node.async = false;
            node.onload = () => resolve();
            node.onerror = () => reject(new Error(`Failed to load ${script.src}`));
            mountedScripts.push(node);
            document.body.appendChild(node);
          }).catch(() => undefined);
          continue;
        }

        const node = document.createElement("script");
        node.textContent = script.content;
        mountedScripts.push(node);
        document.body.appendChild(node);
      }
    };

    void loadScripts();

    return () => {
      cancelled = true;
      mountedScripts.forEach((node) => node.remove());

      if (previousPage) {
        document.body.dataset.page = previousPage;
      } else {
        delete document.body.dataset.page;
      }
    };
  }, [page, scripts]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-screen" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}
