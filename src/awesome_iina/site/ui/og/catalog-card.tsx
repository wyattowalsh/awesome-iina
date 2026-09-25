import type { CSSProperties, ReactElement } from "react";

export type CatalogCardTheme = "dark" | "light";

export type CatalogCardProps = {
  width: number;
  height: number;
  theme: CatalogCardTheme;
  title: string;
  lineOne: string;
  lineTwo: string;
  kicker: string;
};

/** Deterministic waveform heights for the Indexed Media motif (fixed, not random). */
const WAVE_BARS = [28, 48, 36, 64, 44, 72, 52, 40, 60, 34, 56, 42] as const;

const MARK_SIZE = 104;

export function CatalogCard({
  width,
  height,
  theme,
  title,
  lineOne,
  lineTwo,
  kicker,
}: CatalogCardProps): ReactElement {
  const dark = theme === "dark";
  const tall = height >= 640;
  const pad = tall ? 72 : 56;
  const titleSize = tall ? 108 : 92;
  const lineSize = tall ? 42 : 36;
  const barScale = tall ? 1.15 : 1;

  const canvas: CSSProperties = {
    width,
    height,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: pad,
    overflow: "hidden",
    background: dark
      ? "linear-gradient(145deg, var(--brand-background) 0%, color-mix(in srgb, var(--brand-surface) 70%, var(--brand-background)) 52%, var(--brand-surface) 100%)"
      : "linear-gradient(145deg, var(--brand-foreground) 0%, color-mix(in srgb, var(--brand-foreground) 88%, var(--brand-ink)) 58%, color-mix(in srgb, var(--brand-foreground) 82%, var(--brand-light-cyan)) 100%)",
    color: dark ? "var(--brand-foreground)" : "var(--brand-ink)",
  };

  const glowCyan: CSSProperties = {
    position: "absolute",
    top: -height * 0.28,
    right: -width * 0.12,
    width: width * 0.62,
    height: height * 0.9,
    borderRadius: "50%",
    background: dark
      ? "radial-gradient(circle, color-mix(in srgb, var(--brand-cyan) 28%, transparent) 0%, transparent 68%)"
      : "radial-gradient(circle, color-mix(in srgb, var(--brand-light-cyan) 16%, transparent) 0%, transparent 70%)",
  };

  const glowViolet: CSSProperties = {
    position: "absolute",
    bottom: -height * 0.35,
    left: -width * 0.08,
    width: width * 0.55,
    height: height * 0.85,
    borderRadius: "50%",
    background: dark
      ? "radial-gradient(circle, color-mix(in srgb, var(--brand-violet) 22%, transparent) 0%, transparent 70%)"
      : "radial-gradient(circle, color-mix(in srgb, var(--brand-light-violet) 12%, transparent) 0%, transparent 72%)",
  };

  const frame: CSSProperties = {
    position: "absolute",
    inset: 28,
    borderRadius: 28,
    border: dark
      ? "1px solid color-mix(in srgb, var(--brand-secondary) 22%, transparent)"
      : "1px solid color-mix(in srgb, var(--brand-ink) 12%, transparent)",
  };

  const markPlate: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: MARK_SIZE + 28,
    height: MARK_SIZE + 28,
    borderRadius: 22,
    background: dark
      ? "color-mix(in srgb, var(--brand-surface) 88%, var(--brand-cyan))"
      : "color-mix(in srgb, var(--brand-foreground) 70%, var(--brand-ink))",
    border: dark
      ? "1px solid color-mix(in srgb, var(--brand-cyan) 35%, transparent)"
      : "1px solid color-mix(in srgb, var(--brand-light-cyan) 28%, transparent)",
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: titleSize,
    lineHeight: 1.02,
    letterSpacing: "-0.045em",
    fontWeight: 700,
    ...(dark
      ? {
          backgroundImage:
            "linear-gradient(105deg, var(--brand-foreground) 42%, var(--brand-cyan) 92%)",
          backgroundClip: "text",
          color: "transparent",
        }
      : { color: "var(--brand-ink)" }),
  };

  const roleStyle: CSSProperties = {
    margin: "14px 0 0",
    fontSize: lineSize,
    lineHeight: 1.28,
    fontWeight: 500,
    color: dark ? "var(--brand-secondary)" : "var(--brand-ink)",
    opacity: dark ? 0.92 : 0.72,
  };

  return (
    <div tw="flex h-full w-full flex-col justify-between" style={canvas}>
      <div style={glowCyan} />
      <div style={glowViolet} />
      <div style={frame} />

      <div tw="flex items-start justify-between" style={{ position: "relative" }}>
        <div style={markPlate}>
          <img
            src="mark"
            width={MARK_SIZE}
            height={MARK_SIZE}
            alt=""
            style={{ width: MARK_SIZE, height: MARK_SIZE }}
          />
        </div>
        <div tw="flex flex-col items-end" style={{ gap: 10 }}>
          <span
            tw="flex"
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: dark ? "var(--brand-cyan)" : "var(--brand-light-cyan)",
            }}
          >
            {kicker}
          </span>
          <div tw="flex items-end" style={{ gap: 6, height: 76 * barScale }}>
            {WAVE_BARS.map((bar, index) => (
              <div
                key={`wave-${index}`}
                style={{
                  width: tall ? 10 : 8,
                  height: bar * barScale,
                  borderRadius: 999,
                  background:
                    index % 3 === 0
                      ? "var(--brand-cyan)"
                      : index % 3 === 1
                        ? "var(--brand-violet)"
                        : dark
                          ? "var(--brand-secondary)"
                          : "var(--brand-light-cyan)",
                  opacity: dark ? (index % 3 === 2 ? 0.45 : 0.85) : 0.55,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div tw="flex flex-col" style={{ position: "relative", maxWidth: width * 0.78 }}>
        <h1 tw="flex font-bold" style={titleStyle}>
          {title}
        </h1>
        <p tw="flex" style={roleStyle}>
          {lineOne}
        </p>
        <p tw="flex" style={{ ...roleStyle, margin: "2px 0 0" }}>
          {lineTwo}
        </p>
      </div>

      <div
        tw="flex items-center justify-between"
        style={{ position: "relative", gap: 24 }}
      >
        <div
          tw="flex"
          style={{
            flex: 1,
            height: 8,
            borderRadius: 999,
            background:
              "linear-gradient(90deg, var(--brand-cyan) 0%, var(--brand-blue) 48%, var(--brand-violet) 100%)",
          }}
        />
        <span
          tw="flex"
          style={{
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "0.02em",
            color: dark ? "var(--brand-secondary)" : "var(--brand-ink)",
            opacity: 0.55,
            whiteSpace: "nowrap",
          }}
        >
          {width} × {height}
        </span>
      </div>
    </div>
  );
}
