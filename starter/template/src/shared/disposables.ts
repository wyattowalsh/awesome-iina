/** Application-owned cleanup; not a claim that IINA exposes an unload hook. */
export class Disposables {
  private callbacks: Array<() => void> = [];
  private disposed = false;
  add(callback: () => void): void {
    if (this.disposed) { callback(); return; }
    this.callbacks.push(callback);
  }
  dispose(): unknown[] {
    if (this.disposed) return [];
    this.disposed = true;
    const errors: unknown[] = [];
    for (const callback of this.callbacks.splice(0).reverse()) {
      try { callback(); } catch (error: unknown) { errors.push(error); }
    }
    return errors;
  }
}
