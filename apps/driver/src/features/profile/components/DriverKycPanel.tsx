"use client";

import { useState } from "react";
import { driverApi, driverKycFields, makeDriverKycSubmission, driverProfileError } from "@repo/api";
import type { DriverProfile, DriverKycRevision } from "@repo/types";

export default function DriverKycPanel({ profile, onSaved }: { profile: DriverProfile; onSaved: () => Promise<unknown> }) {
  const [editing, setEditing] = useState<DriverProfile | null>(null);
  const [draft, setDraft] = useState<Record<string, string | number | null>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<DriverKycRevision[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyPages, setHistoryPages] = useState(0);
  const state = profile.kycRevisionState;
  const pending = state?.pendingRevision;
  const approved = !!state && (state.legacyApproved || state.activeRevisionNumber > 0);

  function edit() {
    setEditing(profile); // Keep the version actually shown to this editor, even during a background refetch.
    setDraft(Object.fromEntries(driverKycFields.map(field => [field, pending ? pending.documents[field] ?? null : profile[field] ?? null])));
    setMessage("");
  }
  async function save() {
    if (!editing) return;
    setBusy(true); setMessage("");
    try {
      const before = editing.kycRevisionState?.pendingRevision?.documents;
      const patch = Object.fromEntries(driverKycFields.filter(field =>
        draft[field] !== (before ? before[field] : editing[field] ?? null)).map(field => [field, draft[field] ?? null]));
      if (!Object.keys(patch).length) { setMessage("No document changes to submit."); return; }
      await driverApi.submitKycRevision(profile.id, makeDriverKycSubmission(editing, patch));
      setEditing(null); await onSaved();
      setMessage("Changes submitted for review. Your approved profile remains active.");
    } catch (error: unknown) {
      const failure = driverProfileError(error);
      setMessage(failure.conflict
        ? "This version changed. Cancel, reload your profile and review the latest draft before submitting again."
        : failure.message);
    } finally { setBusy(false); }
  }
  async function loadHistory(page: number) {
    setBusy(true); setMessage("");
    try {
      const response = await driverApi.getKycHistory(profile.id, page);
      setHistory(response.data?.result ?? []); setHistoryPages(response.data?.meta.pages ?? 0); setHistoryPage(page); setHistoryLoaded(true);
    } catch { setMessage("Unable to load revision history. Please retry."); }
    finally { setBusy(false); }
  }
  return <section className="rounded-3xl bg-white p-5 space-y-4 border border-gray-200" aria-label="Document revisions">
    <h2 className="font-bold text-lg">Document revisions</h2>
    <p className="text-sm">{approved ? `Approved profile: ${state?.legacyApproved ? 'existing approval' : `revision ${state?.activeRevisionNumber}`}.` : 'Complete your initial driver application before editing approved documents.'}</p>
    {pending && <p className="rounded-xl bg-amber-50 p-3 text-sm">Revision {pending.revisionNumber} is awaiting review. Your approved documents remain in use.</p>}
    {profile.kycEligible === false && approved && <p role="status" className="text-sm text-red-700">Your active profile is currently ineligible for new jobs. Check document validity and account status.</p>}
    {message && <p role="status" className="text-sm break-words">{message}</p>}
    {!editing && <button disabled={!approved || busy} onClick={edit} className="rounded-xl bg-black text-white px-4 py-3 disabled:opacity-50">{pending ? 'Edit pending revision' : 'Submit document changes'}</button>}
    {editing && <form onSubmit={event => { event.preventDefault(); void save(); }} className="space-y-4">
      <p className="text-sm">Edit document URLs and details. Blank fields explicitly clear the value in this draft.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {driverKycFields.map(field => <label key={field} className="text-sm break-words">{field.replaceAll('_', ' ')}
          <input disabled={busy} className="mt-1 w-full rounded-lg border p-2" value={draft[field] ?? ''}
            type={field === 'vehicle_year' ? 'number' : field.endsWith('expiry') || field.endsWith('_date') ? 'date' : 'text'}
            maxLength={255} min={field === 'vehicle_year' ? 1000 : undefined} max={field === 'vehicle_year' ? 9999 : undefined}
            onChange={event => setDraft(current => ({ ...current, [field]: event.target.value === '' ? null : field === 'vehicle_year' ? Number(event.target.value) : event.target.value }))} />
        </label>)}
      </div>
      <div className="flex gap-3"><button disabled={busy} className="rounded-xl bg-black text-white p-3">{busy ? 'Submitting…' : 'Submit for review'}</button><button type="button" disabled={busy} onClick={() => setEditing(null)} className="p-3">Cancel</button></div>
    </form>}
    <div className="border-t pt-3 space-y-2">
      <button disabled={busy} onClick={() => void loadHistory(0)} className="underline text-sm">Load revision history</button>
      {historyLoaded && !history.length && <p className="text-sm">No revisions yet.</p>}
      {history.map(revision => <p key={revision.id} className="text-sm break-words">Revision {revision.revisionNumber}: {revision.status} · {revision.reviewSource === 'LEGACY_BASELINE' ? 'Existing approval; historical reviewer unavailable' : new Date(revision.submittedAt).toLocaleString()}{revision.reason ? ` · ${revision.reason}` : ''}</p>)}
      {historyPages > 1 && <div className="flex gap-4 text-sm"><button disabled={busy || historyPage === 0} onClick={() => void loadHistory(historyPage - 1)}>Previous</button><span>{historyPage + 1} / {historyPages}</span><button disabled={busy || historyPage + 1 >= historyPages} onClick={() => void loadHistory(historyPage + 1)}>Next</button></div>}
    </div>
  </section>;
}
