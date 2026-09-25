import * as React from "react";
import { Filter, Info, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type FilterOption = { value: string; label: string };

export type CatalogChromeProps = {
  categories: FilterOption[];
  kinds: FilterOption[];
  statuses: FilterOption[];
};

type FilterState = {
  q: string;
  category: string;
  kind: string;
  status: string;
};

function readState(): FilterState {
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get("q") || "",
    category: params.get("category") || "",
    kind: params.get("kind") || "",
    status: params.get("status") || "",
  };
}

function applyFilters(state: FilterState, persist: boolean): void {
  const terms = state.q
    .trim()
    .toLocaleLowerCase("en")
    .split(/\s+/)
    .filter(Boolean);
  const filtering = Boolean(
    terms.length || state.category || state.kind || state.status,
  );
  const rows = Array.from(document.querySelectorAll<HTMLElement>(".project"));
  let visible = 0;
  for (const row of rows) {
    const search = (row.dataset.search || "").toLocaleLowerCase("en");
    const match =
      terms.every((term) => search.includes(term)) &&
      (!state.category || state.category === row.dataset.category) &&
      (!state.kind || state.kind === row.dataset.kind) &&
      (!state.status || state.status === row.dataset.status);
    row.hidden = !match;
    if (match) visible += 1;
  }

  for (const section of document.querySelectorAll<HTMLElement>(
    ".catalog-section",
  )) {
    const count = section.querySelectorAll(".project:not([hidden])").length;
    section.hidden = count === 0;
    const meta = section.querySelector(".section-heading p");
    if (meta) meta.textContent = String(count);
  }

  const startItems = Array.from(
    document.querySelectorAll<HTMLElement>(".start-list li"),
  );
  for (const item of startItems) {
    const href = item.querySelector("a")?.getAttribute("href") || "";
    const project = href.startsWith("#")
      ? document.getElementById(href.slice(1))
      : null;
    item.hidden = filtering && Boolean(project?.hidden);
  }
  const startRoot = document.getElementById("start-here");
  if (startRoot) {
    startRoot.hidden = filtering && startItems.every((item) => item.hidden);
  }
  const contentsStart = document.querySelector<HTMLElement>(
    "[data-contents-start]",
  );
  if (contentsStart && startRoot) contentsStart.hidden = startRoot.hidden;
  for (const item of document.querySelectorAll<HTMLElement>(
    "[data-contents-section]",
  )) {
    const sectionId = item.dataset.contentsSection || "";
    const section = sectionId ? document.getElementById(sectionId) : null;
    const count = section
      ? section.querySelectorAll(".project:not([hidden])").length
      : 0;
    const meta = item.querySelector("span");
    if (meta) meta.textContent = String(count);
    item.hidden = filtering && count === 0;
  }

  const resultsStatus = document.getElementById("results-status");
  if (resultsStatus) {
    resultsStatus.textContent = `${visible} of ${rows.length} entries, grouped by provenance`;
  }
  const empty = document.getElementById("empty");
  if (empty) empty.hidden = visible !== 0;

  if (persist) {
    const url = new URL(window.location.href);
    const entries: [keyof FilterState, string][] = [
      ["q", state.q],
      ["category", state.category],
      ["kind", state.kind],
      ["status", state.status],
    ];
    for (const [key, value] of entries) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, "", url);
  }
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : true,
  );
  React.useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function FilterSelect({
  id,
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  allLabel: string;
  onChange: (value: string) => void;
}) {
  const selectValue = value || "__all__";
  return (
    <label className="grid gap-1.5 text-sm font-medium text-[var(--foreground)]">
      <span id={`${id}-label`}>{label}</span>
      <Select
        value={selectValue}
        onValueChange={(next) => onChange(next === "__all__" ? "" : next)}
      >
        <SelectTrigger
          id={id}
          aria-labelledby={`${id}-label`}
          aria-controls="project-list"
          className="min-h-11"
        >
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function LabelsDialog({
  open,
  onOpenChange,
  trigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}) {
  const focusLabelsTitle = (event: Event) => {
    event.preventDefault();
    document.getElementById("labels-dialog-title")?.focus();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent
        aria-describedby="labels-dialog-description"
        onOpenAutoFocus={focusLabelsTitle}
        className="motion-reduce:transition-none"
      >
        <DialogHeader>
          <DialogTitle id="labels-dialog-title" tabIndex={-1}>
            Catalog labels
          </DialogTitle>
          <DialogDescription id="labels-dialog-description">
            These labels are catalog fields, not a ranking or a security audit.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="font-semibold">Official</dt>
            <dd className="text-[var(--muted-foreground)]">
              First-party IINA software from the <code>iina/</code> GitHub
              organization or <code>iina.io</code>. Not inferred from stars,
              topics, or plugin-index membership.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">plugins.json</dt>
            <dd className="text-[var(--muted-foreground)]">
              The plugin is listed in IINA’s published plugin index. That is not
              first-party ownership and does not set Official.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Featured</dt>
            <dd className="text-[var(--muted-foreground)]">
              A useful starting point for scanning the catalog. Not an objective
              quality ranking.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Unverified</dt>
            <dd className="text-[var(--muted-foreground)]">
              Relevance was reviewed; maintenance and compatibility are not
              confirmed. Inclusion does not mean Active.
            </dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}

export function CatalogChrome({
  categories,
  kinds,
  statuses,
}: CatalogChromeProps) {
  const [state, setState] = React.useState<FilterState>(() => readState());
  const [labelsOpen, setLabelsOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    applyFilters(state, true);
  }, [state]);

  React.useEffect(() => {
    const onPop = () => setState(readState());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const update = (patch: Partial<FilterState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };
  const reset = () => {
    setState({ q: "", category: "", kind: "", status: "" });
    searchRef.current?.focus();
  };
  const filtering = Boolean(
    state.q.trim() || state.category || state.kind || state.status,
  );

  const selects = (
    <>
      <FilterSelect
        id="category"
        label="Category"
        value={state.category}
        options={categories}
        allLabel="All categories"
        onChange={(category) => update({ category })}
      />
      <FilterSelect
        id="kind"
        label="Type"
        value={state.kind}
        options={kinds}
        allLabel="All types"
        onChange={(kind) => update({ kind })}
      />
      <FilterSelect
        id="project-status"
        label="Status"
        value={state.status}
        options={statuses}
        allLabel="All statuses"
        onChange={(status) => update({ status })}
      />
    </>
  );

  const labelsTrigger = (
    <Tooltip>
      <TooltipTrigger asChild>
        <DialogTrigger asChild>
          <Button id="labels-open" type="button" variant="outline" className="min-h-11">
            <Info className="size-4" aria-hidden="true" />
            Catalog labels
          </Button>
        </DialogTrigger>
      </TooltipTrigger>
      <TooltipContent>
        Official, plugins.json, Featured, and Unverified are catalog fields.
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div id="filters" className="filters catalog-chrome-filters">
        {isDesktop ? (
          <>
            <div className="grid gap-1.5 min-w-0">
              <label className="text-sm font-medium" htmlFor="search">
                Search the catalog
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--muted-foreground)]"
                  aria-hidden="true"
                />
                <Input
                  ref={searchRef}
                  id="search"
                  type="search"
                  placeholder="Name, status, official, type…"
                  autoComplete="off"
                  aria-controls="project-list"
                  className="min-h-11 pl-9"
                  value={state.q}
                  onChange={(event) => update({ q: event.target.value })}
                />
              </div>
            </div>
            {selects}
            <div className="flex flex-wrap items-end gap-2">
              <Button
                id="clear"
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={reset}
              >
                Reset
              </Button>
              {filtering ? (
                <Badge
                  variant="default"
                  className="h-11 px-3 text-xs font-semibold tracking-wide"
                >
                  Filtered
                </Badge>
              ) : null}
            </div>
            <LabelsDialog
              open={labelsOpen}
              onOpenChange={setLabelsOpen}
              trigger={labelsTrigger}
            />
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid gap-1.5 min-w-0">
              <label className="text-sm font-medium" htmlFor="search">
                Search the catalog
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--muted-foreground)]"
                  aria-hidden="true"
                />
                <Input
                  ref={searchRef}
                  id="search"
                  type="search"
                  placeholder="Name, status, official, type…"
                  autoComplete="off"
                  aria-controls="project-list"
                  className="min-h-11 pl-9"
                  value={state.q}
                  onChange={(event) => update({ q: event.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    id="filters-open"
                    type="button"
                    variant="outline"
                    className="min-h-11"
                  >
                    <Filter className="size-4" aria-hidden="true" />
                    Filters
                    {filtering ? (
                      <Badge variant="default" className="ml-1 h-6 px-2 text-[11px]">
                        On
                      </Badge>
                    ) : null}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="gap-4 rounded-t-[calc(var(--radius)+4px)] motion-reduce:transition-none"
                >
                  <SheetHeader>
                    <SheetTitle>Catalog filters</SheetTitle>
                    <SheetDescription>
                      Narrow the provenance-grouped list. Reset clears every
                      control.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 px-4 pb-6">
                    {selects}
                    <Button
                      id="clear"
                      type="button"
                      variant="outline"
                      className="min-h-11"
                      onClick={() => {
                        reset();
                        setSheetOpen(false);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              <LabelsDialog
                open={labelsOpen}
                onOpenChange={setLabelsOpen}
                trigger={labelsTrigger}
              />
              {filtering ? (
                <Badge
                  variant="default"
                  className="h-11 px-3 text-xs font-semibold tracking-wide"
                >
                  Filtered
                </Badge>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
