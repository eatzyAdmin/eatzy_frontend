'use client';

import { useCallback, useEffect, useState } from 'react';
import { driverApi, driverKycFields, driverProfileError } from '@repo/api';
import type { DriverProfile, DriverKycRevision } from '@repo/types';

export default function DriverKycReview({ profileId, onReviewed }: { profileId: number; onReviewed: () => void }) {
  const [profile, setProfile] = useState<DriverProfile>();
  const [history, setHistory] = useState<DriverKycRevision[]>([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const load = useCallback(async (target = 0) => {
    setBusy(true); setMessage(''); setProfile(undefined);
    try {
      const [detail, revisions] = await Promise.all([driverApi.getDriverProfileById(profileId), driverApi.getKycHistory(profileId, target)]);
      if (!detail.data) throw new Error('Profile unavailable.');
      setProfile(detail.data); setHistory(revisions.data?.result ?? []); setPages(revisions.data?.meta.pages ?? 0); setPage(target);
    } catch { setMessage('Unable to load the latest profile and revision history. Retry before reviewing.'); }
    finally { setBusy(false); }
  }, [profileId]);
  useEffect(() => { void load(); }, [load]);
  const pending = profile?.kycRevisionState?.pendingRevision;
  async function review(decision: 'APPROVE' | 'REJECT') {
    if (!pending || busy) return;
    setBusy(true); setMessage('');
    try {
      await driverApi.reviewKycRevision(profileId, pending.id, pending.lockVersion, decision, reason.trim() || undefined);
      onReviewed();
    } catch (error: unknown) {
      const failure = driverProfileError(error);
      setMessage(failure.conflict
        ? 'This draft changed or was already reviewed. Reload and inspect the latest version before deciding.'
        : failure.message);
    } finally { setBusy(false); }
  }
  return <section aria-label="Pending document review" className="mb-8 rounded-3xl bg-white border border-gray-200 p-5 space-y-4">
    <h3 className="text-xl font-bold">Document revision review</h3>
    <p className="text-sm">The approved profile remains active until a revision is approved. Review only the version shown below.</p>
    <button disabled={busy} onClick={() => void load()} className="underline text-sm">{busy ? 'Loading…' : 'Reload latest revision'}</button>
    {message && <p role="alert" className="text-sm text-red-700">{message}</p>}
    {profile && !pending && <p className="text-sm">No pending revision.</p>}
    {pending && <>
      <p className="font-semibold text-sm">Revision {pending.revisionNumber}, draft version {pending.lockVersion}</p>
      <div className="overflow-x-auto"><table className="w-full text-sm text-left table-fixed">
        <thead><tr><th className="p-2 w-1/3">Field</th><th className="p-2 w-1/3">Active</th><th className="p-2 w-1/3">Pending</th></tr></thead>
        <tbody>{driverKycFields.filter(field => (profile[field] ?? null) !== pending.documents[field]).map(field =>
          <tr key={field} className="border-t align-top"><th className="p-2 break-words font-medium">{field.replaceAll('_', ' ')}</th><td className="p-2 break-all">{String(profile[field] ?? '—')}</td><td className="p-2 break-all bg-amber-50">{String(pending.documents[field] ?? '—')}</td></tr>)}</tbody>
      </table></div>
      <label className="block text-sm">Review note (required for rejection)<textarea maxLength={1000} value={reason} disabled={busy} onChange={event => setReason(event.target.value)} className="block w-full border rounded-xl p-3 mt-2" /></label>
      <div className="flex flex-wrap gap-3"><button disabled={busy} onClick={() => void review('APPROVE')} className="rounded-xl bg-lime-700 text-white px-4 py-3 disabled:opacity-50">Approve this revision</button><button disabled={busy || !reason.trim()} onClick={() => void review('REJECT')} className="rounded-xl bg-red-700 text-white px-4 py-3 disabled:opacity-50">Reject this revision</button></div>
    </>}
    {history.map(row => <p key={row.id} className="text-sm break-words">Revision {row.revisionNumber}: {row.status} · {row.reviewSource === 'LEGACY_BASELINE' ? 'Legacy approval; historical reviewer unavailable' : new Date(row.submittedAt).toLocaleString()}{row.reason ? ` · ${row.reason}` : ''}</p>)}
    {pages > 1 && <div className="flex gap-3 text-sm"><button disabled={busy || !page} onClick={() => void load(page - 1)}>Previous</button><span>{page + 1} / {pages}</span><button disabled={busy || page + 1 >= pages} onClick={() => void load(page + 1)}>Next</button></div>}
  </section>;
}
