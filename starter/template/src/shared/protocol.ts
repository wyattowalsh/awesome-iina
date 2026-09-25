/** Small JSON-only, state-display protocol. It exposes no arbitrary commands. */
export const CHANNEL = "iina-starter:state:v1";
export type Ready = Readonly<{v: 1; kind: "ready"; viewId: string}>;
export type Snapshot = Readonly<{
  v: 1; kind: "snapshot"; viewId: string; sequence: number;
  title: string; paused: boolean;
}>;
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function view(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9-]{1,80}$/.test(value);
}
export function isReady(value: unknown): value is Ready {
  return object(value) && Object.keys(value).length === 3 &&
    value.v === 1 && value.kind === "ready" && view(value.viewId);
}
export function isSnapshot(value: unknown): value is Snapshot {
  return object(value) && Object.keys(value).length === 6 &&
    value.v === 1 && value.kind === "snapshot" && view(value.viewId) &&
    typeof value.sequence === "number" && Number.isSafeInteger(value.sequence) && value.sequence >= 1 &&
    typeof value.title === "string" && value.title.length <= 500 &&
    typeof value.paused === "boolean";
}
export function makeSnapshot(viewId: string, sequence: number, title: string, paused: boolean): Snapshot {
  const snapshot: Snapshot = {v: 1, kind: "snapshot", viewId, sequence, title: title.slice(0, 500), paused};
  if (!isSnapshot(snapshot)) throw new Error("Invalid snapshot");
  return snapshot;
}
export function createReceiver(viewId: string, apply: (snapshot: Snapshot) => void): (value: unknown) => boolean {
  let sequence = 0;
  return (value: unknown): boolean => {
    if (!isSnapshot(value) || value.viewId !== viewId || value.sequence <= sequence) return false;
    sequence = value.sequence;
    apply(value);
    return true;
  };
}
