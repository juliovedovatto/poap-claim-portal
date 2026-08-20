import { useState, type FC } from 'react';
import { useAccount } from 'wagmi';
import { formatEventDate } from '@/lib/format';
import type { ClaimEvent } from '@/App';

interface ClaimCardProps {
  event: ClaimEvent;
}

type ClaimState = 'idle' | 'pending' | 'success' | 'error';

const ClaimCard: FC<ClaimCardProps> = ({ event }) => {
  const { address } = useAccount();
  const [state, setState] = useState<ClaimState>('idle');

  const handleClaim = async () => {
    if (!address) return;
    setState('pending');
    try {
      const res = await fetch('http://localhost:3000/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, attendee: address }),
      });
      if (!res.ok) throw new Error('claim failed');
      setState('success');
    } catch {
      setState('error');
    }
  };

  const disabled = !event.claimable || !address || state === 'pending';

  const label = state === 'pending' ? 'Claiming…' : state === 'success' ? 'Claimed' : 'Claim POAP';

  return (
    <article className="rounded-card bg-surface-muted p-6">
      <h3 className="text-lg font-semibold text-ink">{event.name}</h3>
      <p className="mt-1 text-sm text-ink-muted">{formatEventDate(event.date)}</p>
      <p className="mt-3 text-sm text-ink">{event.description}</p>
      {!address && <p className="mt-3 text-xs text-ink-muted">Connect wallet first</p>}
      {state === 'error' && <p className="mt-3 text-xs text-ink-muted">Claim failed</p>}
      <button
        type="button"
        onClick={() => void handleClaim()}
        disabled={disabled}
        className="mt-4 w-full rounded-card bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {label}
      </button>
    </article>
  );
};

export default ClaimCard;
