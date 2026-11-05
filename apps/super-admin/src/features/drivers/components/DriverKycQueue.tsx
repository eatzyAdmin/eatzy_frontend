'use client';

import { useState } from 'react';
import { driverApi } from '@repo/api';
import type { DriverProfile, DriverKycRevision } from '@repo/types';

export default function DriverKycQueue({ onOpen }: { onOpen: (profile: DriverProfile) => void }) {
  const [rows, setRows] = useState<DriverKycRevision[]>([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function load(target = 0) {
    setBusy(true); setError('');
    try {
      const response = await driverApi.getPendingKycRevisions(target);
      setRows(response.data?.result ?? []); setPages(response.data?.meta.pages ?? 0); setPage(target); setLoaded(true);
    } catch { setError('Unable to load the review queue. Please retry.'); }
    finally { setBusy(false); }
  }
  async function open(id: number) {
    setBusy(true); setError('');
    try { const response = await driverApi.getDriverProfileById(id); if (!response.data) throw new Error(); onOpen(response.data); }
    catch { setError('Unable to load this profile. Refresh the queue and retry.'); }
    finally { setBusy(false); }
  }
  return <section className="mb-4 p-4 bg-white border rounded-2xl space-y-3" aria-label="Driver document review queue">
    <button disabled={busy} onClick={() => void load()} className="font-semibold underline">{busy ? 'Loading…' : 'Load pending document revisions'}</button>
    {error && <p role="alert">{error}</p>}
    {loaded && !rows.length && <p>No pending revisions on this page.</p>}
    <div className="flex flex-wrap gap-3">{rows.map(row => <button key={row.id} disabled={busy} onClick={() => void open(row.driverProfileId)} className="rounded-xl border p-3 text-sm">Driver #{row.driverProfileId} · Revision {row.revisionNumber}</button>)}</div>
    {pages > 1 && <div className="flex gap-3"><button disabled={busy || !page} onClick={() => void load(page - 1)}>Previous</button><span>{page + 1} / {pages}</span><button disabled={busy || page + 1 >= pages} onClick={() => void load(page + 1)}>Next</button></div>}
  </section>;
}
