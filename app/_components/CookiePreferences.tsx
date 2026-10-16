"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalyticsRuntime, ConsentState } from "../analytics/config";
import "../analytics/preferences.css";

export function ManageCookies() {
  return <button className="cookie-reopen" type="button" onClick={() => window.dispatchEvent(new Event("radovar:preferences"))}>Manage cookies</button>;
}

/** React UI only. The shared manager exclusively owns choices, expiry, receipts and revocation. */
export function CookiePreferences({ runtime, failed }: { runtime: AnalyticsRuntime | null; failed: boolean }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [open, setOpen] = useState(false);
  const [website, setWebsite] = useState(false);
  const [, refresh] = useState(0);
  const alive = useRef(true);
  const dialog = useRef<HTMLDivElement>(null);
  const invoker = useRef<HTMLElement | null>(null);
  const close = () => {
    if (!open) return; // Dismissing the initial banner has no dialog invoker to restore.
    setOpen(false);
    (invoker.current?.isConnected ? invoker.current : document.querySelector<HTMLElement>(".cookie-reopen"))?.focus({ preventScroll: true });
  };

  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  useEffect(() => {
    if (!runtime) return;
    setConsent(runtime.consentManager.getState());
    return runtime.consentManager.subscribe(state => setConsent({ ...state }));
  }, [runtime]);
  useEffect(() => {
    const show = () => { invoker.current = document.activeElement as HTMLElement; setWebsite(runtime?.consentManager.getState().websiteAnalytics ?? false); setOpen(true); };
    window.addEventListener("radovar:preferences", show);
    return () => window.removeEventListener("radovar:preferences", show);
  }, [runtime]);
  useEffect(() => {
    if (!open) return;
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const choose = async (value: boolean) => {
    if (!runtime) return;
    const operation = runtime.setConsent({ websiteAnalytics: value });
    // Choice/fencing is synchronous in the shared manager. Never lock refusal behind IO,
    // or let completion of an older choice close a newly reopened preferences dialog.
    close();
    try { await operation; } catch { /* Keep preference controls usable if optional IO fails. */ }
    finally { if (alive.current) refresh(value => value + 1); }
  };
  const status = runtime?.status();
  const message = failed ? "Cookie preferences are temporarily unavailable. Optional observations are not sent by this page." : !runtime ? "Loading cookie preferences. Optional analytics needs your choice and a valid receipt." : consent?.state === "pending_revoke" ? "Withdrawal is saved on this browser. Optional analytics is off while collector confirmation is pending." : status === "not_configured" ? "Website analytics is not enabled for this release. You can save your preference; no optional observations are sent." : status === "unavailable" ? "Website analytics is unavailable. Your preference is saved, but collection needs a valid receipt." : status === "ready" ? "Website analytics is available with your consent." : "Optional website analytics is off.";
  const personalize = () => { invoker.current = document.activeElement as HTMLElement; setWebsite(consent?.websiteAnalytics ?? false); setOpen(true); };
  return (
    <aside data-owned-consent="" aria-label="Website preferences">
      {consent?.state === "unknown" ? <section className="cmp-banner" aria-label="Analytics choice">
        <h2>Your analytics choice</h2><p>Optional website analytics helps us understand visits. Essential website functions work with either choice.</p>
        <p role="status">{message}</p>
        <div className="cmp-actions"><button type="button" onClick={() => void choose(true)}>Accept analytics</button><button type="button" onClick={() => void choose(false)}>Decline</button><button type="button" onClick={personalize}>Personalize</button></div>
      </section> : null}
      {(status === "unavailable" || consent?.state === "pending_revoke") && consent?.state !== "unknown" ? <p className="cmp-availability" role="status">{message}</p> : null}
      {open ? <div className="cmp-overlay"><div className="cmp-card" ref={dialog} role="dialog" aria-modal="true" aria-labelledby="cookie-title" onKeyDown={event => {
        if (event.key === "Escape") { event.preventDefault(); close(); }
        if (event.key === "Tab") {
          const buttons = dialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled),input:not(:disabled),a[href]");
          const first = buttons?.[0], last = buttons?.[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      }}>
        <button type="button" onClick={close}>Close preferences</button><h2 id="cookie-title">Cookie preferences</h2>
        <p>Essential storage is required. Your choice lasts 180 days. Optional website analytics uses an anonymous ID for 30 days and sessions up to 24 hours with a 30 minute idle limit.</p>
        <label><input type="checkbox" checked={website} disabled={!runtime} onChange={event => setWebsite(event.target.checked)} /> Website analytics</label>
        <label><input type="checkbox" disabled checked={false} readOnly /> Account analytics</label><p>Manage optional account activity separately in your signed-in account.</p>
        <p role="status" data-owned-status="">{message}</p>
        <div className="cmp-actions"><button type="button" disabled={!runtime} onClick={() => void choose(true)}>Accept analytics</button><button type="button" disabled={!runtime} onClick={() => void choose(false)}>Decline</button><button type="button" disabled={!runtime} onClick={() => void choose(website)}>Save preferences</button></div>
      </div></div> : null}
    </aside>
  );
}
