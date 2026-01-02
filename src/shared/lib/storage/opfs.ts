
export class OPFSManager {
  private root: FileSystemDirectoryHandle | null = null;
  private sessionDir: FileSystemDirectoryHandle | null = null;

  async init(): Promise<void> {
    try {
      this.root = await navigator.storage.getDirectory();
    } catch (error) {
      console.error("OPFS not supported:", error);
      throw new Error("Your browser does not support the high-performance storage required for this app.");
    }
  }

  async createSession(sessionId: string): Promise<void> {
    if (!this.root) await this.init();
    // Create a specific folder for this extraction session to keep things clean
    this.sessionDir = await this.root!.getDirectoryHandle(sessionId, { create: true });
  }

  async writeFile(filename: string, blob: Blob): Promise<void> {
    if (!this.sessionDir) throw new Error("Session not initialized");

    // faster specific way to write? createSyncAccessHandle is for workers.
    // In main thread, we use createWritable.
    const fileHandle = await this.sessionDir.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
  }

  async clearSession(): Promise<void> {
    if (this.sessionDir && this.root) {
      const name = this.sessionDir.name;
      await this.root.removeEntry(name, { recursive: true });
      this.sessionDir = null;
    }
  }

  async getFileCount(): Promise<number> {
    if (!this.sessionDir) return 0;
    let count = 0;
    // @ts-ignore
    for await (const _ of this.sessionDir.keys()) {
      count++;
    }
    return count;
  }

  async *getFiles(): AsyncGenerator<{ name: string; blob: Blob }> {
    if (!this.sessionDir) return;

    // @ts-ignore
    for await (const [name, handle] of this.sessionDir.entries()) {
      if (handle.kind === 'file') {
        const fileHandle = handle as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        yield { name, blob: file };
      }
    }
  }

  async readFile(filename: string): Promise<Blob> {
    if (!this.sessionDir) throw new Error("Session not initialized");
    try {
      const fileHandle = await this.sessionDir.getFileHandle(filename);
      return await fileHandle.getFile();
    } catch (e) {
      throw new Error(`File not found: ${filename}`);
    }
  }
}

export const opfs = new OPFSManager();
