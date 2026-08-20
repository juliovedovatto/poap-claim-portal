import type { FC } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const ConnectButton: FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="rounded-card bg-surface-muted px-4 py-2 text-sm text-ink hover:bg-brand-600"
      >
        {short}
      </button>
    );
  }

  const injected = connectors.find((c) => c.id === 'injected');

  const handleConnect = () => {
    if (injected) {
      connect({ connector: injected });
    }
  };

  return (
    <button
      type="button"
      onClick={handleConnect}
      className="rounded-card bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
    >
      Connect wallet
    </button>
  );
};

export default ConnectButton;
