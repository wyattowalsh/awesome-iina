import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { render } from "takumi-js";

import { CatalogCard, type CatalogCardTheme } from "../og/catalog-card.tsx";

type KitTokens = {
  colors: Record<string, string>;
};

type CardSpec = {
  name: string;
  width: number;
  height: number;
  theme: CatalogCardTheme;
};

const here = path.dirname(fileURLToPath(import.meta.url));
const uiRoot = path.resolve(here, "..");
const repoRoot = path.resolve(uiRoot, "../../../..");
const kitRoot = path.join(repoRoot, "src/awesome_iina/site/kit");
const staticOg = path.join(repoRoot, "src/awesome_iina/site/static/og");
const outputOg = path.join(repoRoot, "output/og");

const CARDS: CardSpec[] = [
  { name: "open-graph-1200x630.png", width: 1200, height: 630, theme: "dark" },
  {
    name: "github-social-preview-1280x640.png",
    width: 1280,
    height: 640,
    theme: "dark",
  },
  { name: "share-card-1200x630-light.png", width: 1200, height: 630, theme: "light" },
];

function tokenCss(colors: Record<string, string>): string {
  const keys = [
    "background",
    "surface",
    "foreground",
    "secondary",
    "cyan",
    "blue",
    "violet",
    "ink",
    "light_cyan",
    "light_violet",
  ];
  const lines = keys.map((key) => {
    const value = colors[key];
    if (!value || !/^#[0-9A-Fa-f]{6}$/.test(value)) {
      throw new Error(`missing kit color token: ${key}`);
    }
    return `  --brand-${key.replaceAll("_", "-")}: ${value};`;
  });
  return `:root {\n${lines.join("\n")}\n}\n`;
}

async function writePng(target: string, bytes: Uint8Array): Promise<void> {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
}

async function main(): Promise<void> {
  const tokens = JSON.parse(
    await readFile(path.join(kitRoot, "source/tokens.json"), "utf8"),
  ) as KitTokens;
  const css = tokenCss(tokens.colors);
  const markDark = await readFile(
    path.join(kitRoot, "assets/brand/symbol-white.svg"),
  );
  const markLight = await readFile(
    path.join(kitRoot, "assets/brand/symbol-ink.svg"),
  );
  const records = [];
  for (const card of CARDS) {
    const mark = card.theme === "dark" ? markDark : markLight;
    const png = await render(
      <CatalogCard
        width={card.width}
        height={card.height}
        theme={card.theme}
        title="Awesome IINA"
        lineOne="Independent catalog"
        lineTwo="for the IINA ecosystem"
        kicker="awesome-iina"
      />,
      {
        width: card.width,
        height: card.height,
        format: "png",
        css,
        images: [{ src: "mark", data: () => mark }],
      },
    );
    const bytes = Uint8Array.from(png);
    await writePng(path.join(staticOg, card.name), bytes);
    await writePng(path.join(outputOg, card.name), bytes);
    records.push({
      path: `assets/og/${card.name}`,
      bytes: bytes.byteLength,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      width: card.width,
      height: card.height,
      theme: card.theme,
      generator: "takumi-js",
      source: "src/awesome_iina/site/ui/og/catalog-card.tsx",
    });
  }
  const manifest = `${JSON.stringify(
    {
      schema_version: 1,
      role: "Takumi-derived catalog share cards. Kit originals stay in kit/assets/brand/.",
      assets: records,
    },
    null,
    2,
  )}\n`;
  await writeFile(path.join(staticOg, "MANIFEST.json"), manifest);
  await writeFile(path.join(outputOg, "MANIFEST.json"), manifest);
}

await main();
