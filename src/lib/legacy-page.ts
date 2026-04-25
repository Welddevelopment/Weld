import { readFile } from "fs/promises";
import path from "path";

type LegacyPageName = "index.html" | "Signup.html";
export type PageVariant = "landing" | "signup";

export type LegacyScript =
  | { type: "inline"; content: string }
  | { type: "external"; src: string };

function extractMatch(source: string, pattern: RegExp, label: string) {
  const match = source.match(pattern);

  if (!match?.[1]) {
    throw new Error(`Could not extract ${label} from legacy source.`);
  }

  return match[1].trim();
}

function extractStyles(source: string) {
  const matches = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];

  if (!matches.length) {
    throw new Error("Could not extract styles from legacy source.");
  }

  return matches
    .map((match) => match[1]?.trim())
    .filter(Boolean)
    .join("\n\n");
}

function extractScripts(source: string) {
  return [...source.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].map((match) => {
    const attrs = match[1] || "";
    const content = match[2]?.trim() || "";
    const srcMatch = attrs.match(/\ssrc=["']([^"']+)["']/i);

    if (srcMatch?.[1]) {
      return {
        type: "external" as const,
        src: srcMatch[1]
      };
    }

    return {
      type: "inline" as const,
      content
    };
  });
}

function patchAssets(html: string) {
  return html
    .replace(/src="Assets\//g, 'src="/Assets/')
    .replace(/this\.src='Assets\//g, "this.src='/Assets/")
    .replace(/href="Assets\//g, 'href="/Assets/');
}

function patchBodyHtml(html: string, variant: PageVariant) {
  const withoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const withAssets = patchAssets(withoutScripts);

  if (variant === "landing") {
    return withAssets;
  }

  return withAssets.replace(/href="index\.html"/g, 'href="/"');
}

function patchCss(css: string, variant: PageVariant) {
  const pageSelector = `body[data-page="${variant}"]`;

  return css
    .replace(/body\.split-active/g, `${pageSelector}.split-active`)
    .replace(/body::before/g, `${pageSelector}::before`)
    .replace(/body\.modal-open/g, `${pageSelector}.modal-open`)
    .replace(/body\[/g, `${pageSelector}[`)
    .replace(/^body\s*\{/m, `${pageSelector} {`);
}

export async function loadLegacyPage(fileName: LegacyPageName, variant: PageVariant) {
  const filePath = path.join(process.cwd(), fileName);
  const source = await readFile(filePath, "utf8");

  const styles = extractStyles(source);
  const rawBody = extractMatch(source, /<body[^>]*>([\s\S]*?)<\/body>/i, "body");
  const scripts = extractScripts(rawBody);

  return {
    bodyHtml: patchBodyHtml(rawBody, variant),
    styles: patchCss(styles, variant),
    scripts
  };
}
