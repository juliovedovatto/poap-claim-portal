import { type FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { formatEventDate } from '@/lib/format';
import type { ClaimEvent } from '@/App';

interface ClaimCardProps {
  event: ClaimEvent;
}

const claimEvent = async ({ eventId, attendee }: { eventId: number; attendee: string }) => {
  const res = await fetch('http://localhost:3000/claims', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId, attendee }),
  });
  if (!res.ok) throw new Error('claim failed');
};

const ClaimCard: FC<ClaimCardProps> = ({ event }) => {
  const { address } = useAccount();
  const mutation = useMutation({ mutationFn: claimEvent });

  const handleClaim = () => {
    if (!address) return;
    mutation.mutate({ eventId: event.id, attendee: address });
  };

  const disabled = !event.claimable || !address || mutation.isPending;

  const label = mutation.isPending ? 'Claiming…' : mutation.isSuccess ? 'Claimed' : 'Claim POAP';

  return (
    <article className="rounded-card bg-surface-muted p-6">
      <h3 className="text-lg font-semibold text-ink">{event.name}</h3>
      <p className="mt-1 text-sm text-ink-muted">{formatEventDate(event.date)}</p>
      <p className="mt-3 text-sm text-ink">{event.description}</p>
      {!address && <p className="mt-3 text-xs text-ink-muted">Connect wallet first</p>}
      {mutation.isError && <p className="mt-3 text-xs text-ink-muted">Claim failed</p>}
      <button
        type="button"
        onClick={handleClaim}
        disabled={disabled}
        className="mt-4 w-full rounded-card bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {label}
      </button>
    </article>
  );
};

export default ClaimCard;
