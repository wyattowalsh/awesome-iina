import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  CatalogChrome,
  type CatalogChromeProps,
  type FilterOption,
} from "@/components/catalog-chrome";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";

import "./styles.css";

function parseOptions(raw: string | undefined): FilterOption[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is FilterOption =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as FilterOption).value === "string" &&
        typeof (item as FilterOption).label === "string",
    );
  } catch {
    return [];
  }
}

function mountTheme(): void {
  const root = document.getElementById("theme-root");
  if (!root) return;
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="awesome-iina-theme">
        <ModeToggle />
      </ThemeProvider>
    </StrictMode>,
  );
}

function mountChrome(): void {
  const root = document.getElementById("catalog-chrome-root");
  if (!root) return;
  const props: CatalogChromeProps = {
    categories: parseOptions(root.dataset.categories),
    kinds: parseOptions(root.dataset.kinds),
    statuses: parseOptions(root.dataset.statuses),
  };
  createRoot(root).render(
    <StrictMode>
      <CatalogChrome {...props} />
    </StrictMode>,
  );
}

mountTheme();
mountChrome();
