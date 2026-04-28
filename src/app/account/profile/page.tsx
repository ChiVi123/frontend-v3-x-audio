'use client';

import { CheckIcon, EditIcon, Loader2Icon, ShieldAlertIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useId, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Switch } from '~/components/ui/switch';
import { cn } from '~/lib/utils';

/**
 * Profile page — `/profile`
 *
 * Desktop : Avatar + name header | Personal Info card (2-col grid) |
 *           Security card (password form + strength bar) |
 *           Notifications card (3 toggles) | Danger Zone card.
 * Mobile  : Avatar + name inline | Personal Details card (stacked rows, each editable) |
 *           Security card | Notifications | Delete Account button.
 *
 * 'use client' — owns form state for password inputs and notification toggles.
 * Avatar edit button, inline field editing, and delete confirm are local state.
 */

// ── Types ──────────────────────────────────────────────────────────────────

interface NotificationPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

// ── Password strength helper ───────────────────────────────────────────────

function getPasswordStrength(pw: string): { level: 0 | 1 | 2 | 3 | 4; label: string; color: string } {
  if (!pw) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { level: 1 as const, label: 'Weak', color: 'bg-destructive' },
    { level: 2 as const, label: 'Fair', color: 'bg-status-processing-fg' },
    { level: 3 as const, label: 'Good', color: 'bg-status-shipped-fg' },
    { level: 4 as const, label: 'Strong', color: 'bg-status-delivered-fg' },
  ];
  return map[score - 1] ?? { level: 0, label: '', color: '' };
}

// ── Inline editable field (mobile pattern) ────────────────────────────────

function EditableField({ label, value }: { label: string; value: string }) {
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState(value);
  const inputId = useId();

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <label
          htmlFor={inputId}
          className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant"
        >
          {label}
        </label>
        {editing ? (
          <Input
            id={inputId}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="h-8 bg-surface-container-low px-2 text-sm"
            autoFocus
          />
        ) : (
          <p className="truncate text-sm font-medium text-on-surface">{current}</p>
        )}
      </div>
      <button
        type="button"
        aria-label={editing ? `Save ${label}` : `Edit ${label}`}
        onClick={() => setEditing((v) => !v)}
        className="shrink-0 text-primary transition-opacity hover:opacity-70"
      >
        {editing ? <CheckIcon className="size-5" /> : <EditIcon className="size-4" />}
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  // Password form state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState<NotificationPref[]>([
    {
      id: 'new-releases',
      label: 'New Product Releases',
      description: 'Get notified about V3-X limited drops',
      enabled: true,
    },
    {
      id: 'order-updates',
      label: 'Order Updates',
      description: 'Tracking info and delivery confirmations',
      enabled: true,
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      description: 'Monthly audio engineering tips and stories',
      enabled: false,
    },
  ]);

  // Delete confirm modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const strength = getPasswordStrength(newPw);

  const handlePasswordSubmit = async () => {
    setPwSaving(true);
    // Simulate API call — replace with real endpoint
    await new Promise((r) => setTimeout(r, 1000));
    setPwSaving(false);
    setPwSaved(true);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    setTimeout(() => setPwSaved(false), 3000);
  };

  const toggleNotif = (id: string) => {
    setNotifPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  // ── Shared section card ────────────────────────────────────────────────

  function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <div className={cn('rounded-xl border border-surface-container-high bg-surface-container p-5 md:p-6', className)}>
        {children}
      </div>
    );
  }

  // ── Password strength bar ──────────────────────────────────────────────

  function StrengthBar() {
    if (!newPw) return null;
    return (
      <div className="flex flex-col gap-1">
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
          <div
            className={cn('h-full rounded-full transition-all duration-300', strength.color)}
            style={{ width: `${(strength.level / 4) * 100}%` }}
          />
        </div>
        <p className="font-mono text-[10px] text-on-surface-variant">
          Strength:{' '}
          <span
            className={cn(
              strength.level >= 3
                ? 'text-status-delivered-fg'
                : strength.level === 2
                  ? 'text-status-processing-fg'
                  : 'text-destructive',
            )}
          >
            {strength.label}
          </span>
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:py-10 md:pb-10 lg:py-12">
      <div className="max-w-3xl space-y-6">
        {/* ── Profile header ── */}
        <section className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="size-20 overflow-hidden rounded-full border-2 border-primary shadow-lg md:size-24">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                alt="Alex Thompson"
                width={96}
                height={96}
                className="size-full object-cover"
              />
            </div>
            {/* Edit avatar button */}
            <button
              type="button"
              aria-label="Change profile photo"
              className={cn(
                'absolute bottom-0 right-0',
                'flex size-7 items-center justify-center rounded-full',
                'border-2 border-background bg-primary text-primary-foreground',
                'transition-colors hover:bg-primary/90',
              )}
            >
              <EditIcon className="size-3.5" />
            </button>
          </div>

          {/* Name + tier */}
          <div className="flex flex-col items-center gap-1.5 text-center md:items-start md:text-left">
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
              <h1 className="font-heading text-3xl font-normal text-on-surface md:text-4xl">Alex Thompson</h1>
              <span className="inline-flex w-fit items-center rounded border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
                Gold Fidelity
              </span>
            </div>
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Member since Oct 2021
            </p>
          </div>
        </section>

        {/* ── Personal Information ── */}
        <SectionCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-lg font-medium text-on-surface md:text-xl">Personal Information</h2>
            <button
              type="button"
              aria-label="Edit personal information"
              className="text-primary transition-opacity hover:opacity-70"
            >
              <EditIcon className="size-4" />
            </button>
          </div>

          {/* Desktop: 2-col grid */}
          <div className="hidden grid-cols-2 gap-x-8 gap-y-5 md:grid">
            {[
              { label: 'Full Name', value: 'Alex Thompson' },
              { label: 'Display Name', value: 'AlexT_Studio' },
              { label: 'Email Address', value: 'alex.thompson@fidelity-audio.com' },
              { label: 'Phone Number', value: '+1 (555) 012-3456' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant">
                  {label}
                </span>
                <p className="text-sm font-medium text-on-surface">{value}</p>
              </div>
            ))}
          </div>

          {/* Mobile: stacked editable rows */}
          <div className="flex flex-col divide-y divide-surface-container-high md:hidden">
            {[
              { label: 'Full Name', value: 'Alex Thompson' },
              { label: 'Email Address', value: 'alex.thompson@fidelity-audio.com' },
              { label: 'Phone Number', value: '+1 (555) 012-3456' },
            ].map(({ label, value }, i) => (
              <div key={label} className={cn('py-3', i === 0 && 'pt-0')}>
                <EditableField label={label} value={value} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── Security ── */}
        <SectionCard>
          <h2 className="mb-5 font-heading text-lg font-medium text-on-surface md:text-xl">Security</h2>

          <div className="flex flex-col gap-4 md:max-w-md">
            {/* Current password — desktop only */}
            <div className="hidden flex-col gap-1.5 md:flex">
              <label
                htmlFor="current-password"
                className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                Current Password
              </label>
              <Input
                id="current-password"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="new-password"
                className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Enter new password"
              />
              <StrengthBar />
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirm-password"
                className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Confirm new password"
                aria-invalid={confirmPw.length > 0 && confirmPw !== newPw}
              />
            </div>

            <Button
              variant="gold"
              size="default"
              className="w-full font-mono text-xs uppercase tracking-widest md:w-fit"
              onClick={handlePasswordSubmit}
              disabled={pwSaving || !newPw || newPw !== confirmPw}
            >
              {pwSaving ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Updating…
                </>
              ) : pwSaved ? (
                <>
                  <CheckIcon className="size-4" />
                  Updated!
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </SectionCard>

        {/* ── Communication Preferences / Notifications ── */}
        <SectionCard>
          <h2 className="mb-5 font-heading text-lg font-medium text-on-surface md:text-xl">
            <span className="hidden md:inline">Communication Preferences</span>
            <span className="md:hidden">Notifications</span>
          </h2>

          <div className="flex flex-col divide-y divide-surface-container-high">
            {notifPrefs.map((pref) => (
              <div key={pref.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-on-surface">{pref.label}</p>
                  <p className="text-xs text-on-surface-variant">{pref.description}</p>
                </div>
                <Switch
                  id={`notif-${pref.id}`}
                  checked={pref.enabled}
                  onCheckedChange={() => toggleNotif(pref.id)}
                  aria-label={pref.label}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── Danger Zone ── */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 md:p-6">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlertIcon className="size-4 text-destructive" strokeWidth={1.5} />
            <h2 className="font-heading text-lg font-medium text-destructive md:text-xl">Danger Zone</h2>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
            Permanently delete your V3-X account and all associated listening data, orders, and fidelity status. This
            action is irreversible.
          </p>

          {showDeleteConfirm ? (
            <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-background/50 p-4">
              <p className="text-sm font-medium text-on-surface">Are you absolutely sure?</p>
              <div className="flex gap-2">
                <Button
                  variant="ghost-neutral"
                  size="sm"
                  className="font-mono text-xs uppercase tracking-widest"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-destructive/10 font-mono text-xs uppercase tracking-widest text-destructive hover:bg-destructive/20"
                  onClick={() => {
                    /* TODO: call delete account API */
                  }}
                >
                  <TrashIcon className="size-3.5" />
                  Yes, Delete Account
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost-neutral"
              size="default"
              className="font-mono text-xs uppercase tracking-widest text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/10"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <TrashIcon className="size-4" />
              Delete Account
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
