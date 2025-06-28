import type { SubSystem } from './subsystem';

type StorageType = 'local' | 'session' | 'cookie' | 'indexedDb';

export interface IStorageAccessor {
  set(key: string, value: any, expires?: Date): void;
  get(key: string): any;
  contains(key: string): boolean;
  remove(key: string): void;
  clear(): void;
  keys(): string[];
}

export interface IIndexedDBAccessor {
  set(key: string, value: any): Promise<void>;
  get(key: string): Promise<any>;
  contains(key: string): Promise<boolean>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

export interface IStorage {
  readonly local: IStorageAccessor;
  readonly session: IStorageAccessor;
  readonly cookie: IStorageAccessor;

  openDatabase(dbName: string, storeName: string): IIndexedDBAccessor;
}

export class PassionStorage implements IStorage, SubSystem {
    local: IStorageAccessor;
    session: IStorageAccessor;
    cookie: IStorageAccessor;

    constructor() {
      this.local = new WebStorageAccessor('local');
      this.session = new WebStorageAccessor('session');
      this.cookie = new CookieStorageAccessor();
    }

    openDatabase(dbName: string, storeName: string): IIndexedDBAccessor {
      return new IndexedDBAccessor(dbName, storeName);
    }

    onBeforeAll(_dt: number) {}
    onAfterAll(_dt: number) {}
}

class WebStorageAccessor implements IStorageAccessor {
  private storage: Storage;

  constructor(type: StorageType) {
    if (type === 'local') {
      this.storage = window.localStorage;
    } else if (type === 'session') {
      this.storage = window.sessionStorage;
    } else {
      throw new Error('WebStorageAccessor only supports local or session storage');
    }
  }

  set(key: string, value: any, _expires?: Date): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  get(key: string): any {
    const value = this.storage.getItem(key);
    if (value === null) return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  contains(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }

  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key !== null) {
        keys.push(key);
      }
    }
    return keys;
  }
}

class CookieStorageAccessor implements IStorageAccessor {
  set(key: string, value: any, expires?: Date): void {
    const serialized = JSON.stringify(value);
    let cookie = `${encodeURIComponent(key)}=${encodeURIComponent(serialized)}; path=/`;
    if (expires) {
      cookie += `; expires=${expires.toUTCString()}`;
    }
    document.cookie = cookie;
  }

  get(key: string): any {
    const nameEQ = encodeURIComponent(key) + "=";
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(nameEQ)) {
        const value = decodeURIComponent(c.substring(nameEQ.length));
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
    }
    return undefined;
  }

  contains(key: string): boolean {
    return this.get(key) !== undefined;
  }

  remove(key: string): void {
    this.set(key, '', new Date(0));
  }

  clear(): void {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      if (name) {
        this.remove(decodeURIComponent(name));
      }
    }
  }

  keys(): string[] {
    const cookies = document.cookie.split(';');
    const keys: string[] = [];
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      if (name) {
        keys.push(decodeURIComponent(name));
      }
    }
    return keys;
  }
}

class IndexedDBAccessor implements IIndexedDBAccessor {
  private dbName: string;
  private storeName: string;
  private dbPromise: Promise<IDBDatabase>;

  constructor(dbName = 'PassionDB', storeName = 'store') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.dbPromise = this.openDB();
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => void): Promise<T> {
    const db = await this.dbPromise;
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction(this.storeName, mode);
      const store = tx.objectStore(this.storeName);
      fn(store);
      tx.oncomplete = () => resolve(undefined as T);
      tx.onerror = () => reject(tx.error);
    });
  }

  async set(key: string, value: any): Promise<void> {
    await this.withStore<void>('readwrite', store => {
      store.put(JSON.stringify(value), key);
    });
  }

  async get(key: string): Promise<any> {
    const db = await this.dbPromise;
    return new Promise<any>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.get(key);
      req.onsuccess = () => {
        const val = req.result;
        if (val === undefined) return resolve(undefined);
        try {
          resolve(JSON.parse(val));
        } catch {
          resolve(val);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  async contains(key: string): Promise<boolean> {
    return (await this.get(key)) !== undefined;
  }

  async remove(key: string): Promise<void> {
    await this.withStore<void>('readwrite', store => {
      store.delete(key);
    });
  }

  async clear(): Promise<void> {
    await this.withStore<void>('readwrite', store => {
      store.clear();
    });
  }

  async keys(): Promise<string[]> {
    const db = await this.dbPromise;
    return new Promise<string[]>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const keys: string[] = [];
      const req = store.openKeyCursor ? store.openKeyCursor() : (store as any).openCursor();
      req.onsuccess = function () {
        const cursor = req.result;
        if (cursor) {
          keys.push(cursor.key);
          cursor.continue();
        } else {
          resolve(keys);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }
}