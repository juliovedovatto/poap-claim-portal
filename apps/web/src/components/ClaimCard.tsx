import type { FC } from 'react';
import { useWriteContract } from 'wagmi';
import { zeroAddress } from 'viem';
import { formatEventDate } from '@/lib/format';
import type { ClaimEvent } from '@/App';

const badgeAbi = [
  {
    type: 'function',
    name: 'claim',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'eventId', type: 'uint256' },
      { name: 'proof', type: 'bytes32[]' },
    ],
    outputs: [],
  },
] as const;

interface ClaimCardProps {
  event: ClaimEvent;
}

const ClaimCard: FC<ClaimCardProps> = ({ event }) => {
  const { writeContract, isPending } = useWriteContract();

  const handleClaim = () => {
    writeContract({
      address: zeroAddress,
      abi: badgeAbi,
      functionName: 'claim',
      args: [BigInt(event.id), [] as readonly `0x${string}`[]],
    });
  };

  return (
    <article className="rounded-card bg-surface-muted p-6">
      <h3 className="text-lg font-semibold text-ink">{event.name}</h3>
      <p className="mt-1 text-sm text-ink-muted">{formatEventDate(event.date)}</p>
      <p className="mt-3 text-sm text-ink">{event.description}</p>
      <button
        type="button"
        onClick={handleClaim}
        disabled={!event.claimable || isPending}
        className="mt-4 w-full rounded-card bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Claiming…' : 'Claim POAP'}
      </button>
    </article>
  );
};

export default ClaimCard;
