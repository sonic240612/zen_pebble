import { sql } from '@vercel/postgres';

export default async function handler(
  req: { method: string; body?: string },
  res: { status: (code: number) => { json: (data: unknown) => void; end: (msg?: string) => void } }
) {
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`
        SELECT id, name, elapsed, stage, cycle, created_at
        FROM rankings
        ORDER BY elapsed DESC
        LIMIT 20
      `;
      res.status(200).json(rows);
    } catch {
      res.status(200).json([]);
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { name, elapsed, stage, cycle } = JSON.parse(req.body ?? '{}');
      if (!name || typeof elapsed !== 'number') {
        res.status(400).json({ error: 'invalid payload' });
        return;
      }

      const { rows: current } = await sql`
        SELECT elapsed FROM rankings ORDER BY elapsed DESC LIMIT 20
      `;

      if (current.length >= 20 && elapsed <= current[current.length - 1].elapsed) {
        res.status(200).json({ saved: false });
        return;
      }

      const { rows: inserted } = await sql`
        INSERT INTO rankings (name, elapsed, stage, cycle)
        VALUES (${name.slice(0, 12)}, ${elapsed}, ${stage ?? ''}, ${cycle ?? 0})
        RETURNING id
      `;

      const { rows: all } = await sql`
        SELECT id FROM rankings ORDER BY elapsed DESC
      `;

      if (all.length > 20) {
        const toDelete = all.slice(20).map((r: { id: number }) => r.id);
        await sql`DELETE FROM rankings WHERE id = ANY(${toDelete})`;
      }

      res.status(200).json({ saved: true, id: inserted[0].id });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
}
