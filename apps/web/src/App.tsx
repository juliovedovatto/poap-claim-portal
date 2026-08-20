import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import ConnectButton from '@/components/ConnectButton';
import ClaimCard from '@/components/ClaimCard';

export interface ClaimEvent {
  id: number;
  name: string;
  date: string;
  description: string;
  claimable: boolean;
}

const useEvents = () =>
  useQuery({
    queryKey: ['events'],
    queryFn: async () =>
      (await fetch('http://localhost:3000/events')).json() as Promise<ClaimEvent[]>,
  });

const App: FC = () => {
  const { data: events, isLoading, isError } = useEvents();

  return (
    <div className="min-h-screen bg-surface text-ink font-sans">
      <header className="flex items-center justify-between border-b border-surface-muted px-6 py-4">
        <h1 className="text-xl font-semibold text-brand-500">POAP Claim Portal</h1>
        <ConnectButton />
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="mb-6 text-lg text-ink-muted">Claimable events</h2>

        {isLoading && <p className="text-sm text-ink-muted">Loading events…</p>}
        {isError && <p className="text-sm text-ink-muted">Failed to load events.</p>}

        {events && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <ClaimCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
