export interface StoredFrame {
  id: string;      // Unique frame ID
  sessionId: string; // Session ID to group frames
  timestamp: number; // Frame timestamp in microseconds
  blob: Blob;      // The actual image data
}

export class FrameStorage {
  private dbName = 'VideoFramesDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('frames')) {
          const store = db.createObjectStore('frames', { keyPath: 'id' });
          store.createIndex('sessionId', 'sessionId', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveFrame(frame: StoredFrame): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['frames'], 'readwrite');
      const store = transaction.objectStore('frames');
      const request = store.put(frame);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getFramesBySession(sessionId: string): Promise<StoredFrame[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['frames'], 'readonly');
      const store = transaction.objectStore('frames');
      const index = store.index('sessionId');
      const request = index.getAll(sessionId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // Sort by timestamp
        const frames = request.result as StoredFrame[];
        frames.sort((a, b) => a.timestamp - b.timestamp);
        resolve(frames);
      };
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    if (!this.db) await this.init();
    const frames = await this.getFramesBySession(sessionId);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['frames'], 'readwrite');
      const store = transaction.objectStore('frames');

      let completed = 0;
      if (frames.length === 0) {
          resolve();
          return;
      }

      frames.forEach(frame => {
          const request = store.delete(frame.id);
          request.onsuccess = () => {
              completed++;
              if (completed === frames.length) resolve();
          };
          request.onerror = () => reject(request.error);
      });
    });
  }

  async clearAll(): Promise<void> {
      if (!this.db) await this.init();
      return new Promise((resolve, reject) => {
          const transaction = this.db!.transaction(['frames'], 'readwrite');
          const store = transaction.objectStore('frames');
          const request = store.clear();
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
      });
  }
}

export const frameStorage = new FrameStorage();
