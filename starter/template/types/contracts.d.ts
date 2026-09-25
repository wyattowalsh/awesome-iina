/** Original narrow contracts for this starter's used API subset, not an IINA SDK.
 * Signatures were compared with upstream declarations; native host parity is unverified.
 * Do not broaden these to make an invalid cross-context import compile.
 */
export interface MenuItem { readonly title: string; }
export interface Menu {
  item(title: string, action?: () => void): MenuItem;
  addItem(item: MenuItem): void;
}
export interface Logger {
  log(...messages: unknown[]): void;
  warn(message: unknown): void;
  error(message: unknown): void;
}
export interface MessagePort {
  postMessage(name: string, data: unknown): void;
  onMessage(name: string, callback: (data: unknown) => void): void;
}
export interface View extends MessagePort { loadFile(path: string): void; }
export interface Preferences {
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  sync(): void;
}
export interface PlayerHost {
  menu: Menu;
  console: Logger;
  preferences: Preferences;
  mpv: { getString(name: string): string; getFlag(name: string): boolean; };
  event: {
    on(name: string, callback: (value?: unknown) => void): string;
    off(name: string, subscriptionId: string): void;
  };
  sidebar: View & { show(): void; hide(): void; };
  overlay: View & { show(): void; hide(): void; setClickable(value: boolean): void; };
  global: MessagePort;
}
export interface GlobalHost {
  menu: Menu;
  console: Logger;
  preferences: Preferences;
  global: {
    postMessage(target: null | number | string, name: string, data: unknown): void;
    onMessage(name: string, callback: (data: unknown, player?: string) => void): void;
  };
  standaloneWindow: View & {
    open(): void;
    close(): void;
    setProperty(props: {title?: string; resizable?: boolean}): void;
  };
}
