export interface RankingEntry {
  id: number;
  name: string;
  elapsed: number;
  stage: string;
  cycle: number;
  created_at: string;
}

const API_BASE = '/api/rankings';

export async function getRankings(): Promise<RankingEntry[]> {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function saveRanking(entry: { name: string; elapsed: number; stage: string; cycle: number }): Promise<boolean> {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.saved === true;
  } catch {
    return false;
  }
}
