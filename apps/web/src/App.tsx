import type { FC } from 'react';
import ConnectButton from '@/components/ConnectButton';
import ClaimCard from '@/components/ClaimCard';

export interface ClaimEvent {
  id: number;
  name: string;
  date: string;
  description: string;
  claimable: boolean;
}

const events: ClaimEvent[] = [
  {
    id: 1,
    name: 'Base Camp Hackathon',
    date: '2024-06-15T18:00:00.000Z',
    description: 'Attendees of the Base Camp hackathon kickoff.',
    claimable: true,
  },
  {
    id: 2,
    name: 'Onchain Summer',
    date: '2024-08-01T12:00:00.000Z',
    description: 'Early builders who shipped during Onchain Summer.',
    claimable: true,
  },
  {
    id: 3,
    name: 'Devcon SEA',
    date: '2024-11-12T09:00:00.000Z',
    description: 'Community members who joined the Devcon SEA side event.',
    claimable: false,
  },
];

const App: FC = () => {
  return (
    <div className="min-h-screen bg-surface text-ink font-sans">
      <header className="flex items-center justify-between border-b border-surface-muted px-6 py-4">
        <h1 className="text-xl font-semibold text-brand-500">POAP Claim Portal</h1>
        <ConnectButton />
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="mb-6 text-lg text-ink-muted">Claimable events</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <ClaimCard key={event.id} event={event} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
