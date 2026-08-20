export type ClaimStatus = 'idle' | 'preparing' | 'pending' | 'success' | 'error';

const STATUS_LABELS: Record<ClaimStatus, string> = {
  idle: 'Not claimed',
  preparing: 'Preparing transaction…',
  pending: 'Claim pending…',
  success: 'Claimed',
  error: 'Claim failed',
};

export function formatClaimStatus(status: ClaimStatus): string {
  return STATUS_LABELS[status];
}

export function formatEventDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
