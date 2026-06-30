export interface RankingEntry {
  name: string;
  elapsed: number;
  stage: string;
  cycle: number;
  timestamp: number;
}

const DB_NAME = 'zen_pebble';
const DB_VERSION = 1;
const STORE_NAME = 'rankings';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
        store.createIndex('elapsed', 'elapsed', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getRankings(): Promise<RankingEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.index('elapsed').openCursor(null, 'prev');
    const entries: RankingEntry[] = [];

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        entries.push(cursor.value);
        cursor.continue();
      } else {
        resolve(entries);
      }
    };
    request.onerror = () => reject(request.error);

    tx.oncomplete = () => db.close();
  });
}

const MAX_RANKINGS = 20;

export async function saveRanking(entry: Omit<RankingEntry, 'timestamp'>): Promise<void> {
  const db = await openDB();

  const all = await getRankings();
  if (all.length >= MAX_RANKINGS && entry.elapsed <= all[all.length - 1].elapsed) {
    db.close();
    return;
  }

  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.add({ ...entry, timestamp: Date.now() });

  return new Promise((resolve, reject) => {
    tx.oncomplete = async () => {
      const updated = await getRankings();
      if (updated.length > MAX_RANKINGS) {
        const toRemove = updated.slice(MAX_RANKINGS);
        const delTx = db.transaction(STORE_NAME, 'readwrite');
        const delStore = delTx.objectStore(STORE_NAME);
        for (const r of toRemove) {
          delStore.delete(r.timestamp);
        }
        delTx.oncomplete = () => { db.close(); resolve(); };
        delTx.onerror = () => reject(delTx.error);
      } else {
        db.close();
        resolve();
      }
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearRankings(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}
