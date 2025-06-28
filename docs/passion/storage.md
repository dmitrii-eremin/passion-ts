# IStorage — Storage API Reference

The `IStorage` interface provides a unified, type-safe, and flexible way to work with all major browser storage mechanisms in Passion games. This subsystem enables you to store, retrieve, and manage data using LocalStorage, SessionStorage, Cookies, and IndexedDB, all through a consistent API.

---

## Overview

Storage in Passion is designed to be simple and robust. You can store any serializable data (objects, arrays, primitives) and retrieve it in its original form. The API abstracts away the differences between storage types, letting you focus on your game logic.

---

## API Reference

### Types

#### `IStorageAccessor`
```typescript
interface IStorageAccessor {
    set(key: string, value: any, expires?: Date): void;
    get(key: string): any;
    contains(key: string): boolean;
    remove(key: string): void;
    clear(): void;
    keys(): string[];
}
```
A synchronous accessor for LocalStorage, SessionStorage, and Cookies. All values are automatically serialized/deserialized with JSON.

#### `IIndexedDBAccessor`
```typescript
interface IIndexedDBAccessor {
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any>;
    contains(key: string): Promise<boolean>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
    keys(): Promise<string[]>;
}
```
An asynchronous accessor for IndexedDB, supporting large and complex data.

---

### Interface: `IStorage`

#### Properties
- `local: IStorageAccessor` — Access to LocalStorage.
- `session: IStorageAccessor` — Access to SessionStorage.
- `cookie: IStorageAccessor` — Access to Cookies.

#### Methods
- `openDatabase(dbName: string, storeName: string): IIndexedDBAccessor`
    - Opens (or creates) an IndexedDB database and object store, returning an async accessor.

---

## Example Usage

### LocalStorage
```typescript
passion.storage.local.set('score', 42);
const score = passion.storage.local.get('score'); // 42
```

### SessionStorage
```typescript
passion.storage.session.set('sessionId', 'abc123');
const sessionId = passion.storage.session.get('sessionId');
```

### Cookies
```typescript
passion.storage.cookie.set('theme', 'dark', new Date(Date.now() + 86400000)); // expires in 1 day
const theme = passion.storage.cookie.get('theme');
```

### IndexedDB
```typescript
const db = passion.storage.openDatabase('mydb', 'players');
await db.set('player1', { name: 'Alice', score: 100 });
const player = await db.get('player1'); // { name: 'Alice', score: 100 }
```

### Enumerating Keys
```typescript
const keys = passion.storage.local.keys();
const dbKeys = await db.keys();
```

---

## Design Philosophy

- **Unified API**: Consistent interface for all storage types.
- **Type-Safe**: Works with any serializable data.
- **Automatic Serialization**: Objects and arrays are stored and retrieved seamlessly.
- **Async for IndexedDB**: Handles large/complex data without blocking the main thread.

---

For advanced usage, you can manage multiple IndexedDB databases, set cookie expirations, and enumerate all keys in any storage. See the [Passion engine documentation](./passion.md) for more details and best practices.
