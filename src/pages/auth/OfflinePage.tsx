import React from 'react';
import { Button } from '@/components/ui/Button';
import { WifiOff, RotateCcw } from 'lucide-react';

export const OfflinePage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="w-14 h-14 rounded-full bg-warning-bg text-warning flex items-center justify-center mb-4 border border-warning/30">
        <WifiOff className="w-7 h-7" />
      </div>
      <span className="text-xs font-semibold text-text-muted mb-1">
        Connectivity Interrupted
      </span>
      <h1 className="text-2xl font-semibold text-text-primary mb-2">
        Working in Offline Mode
      </h1>
      <p className="text-xs text-text-muted mb-6 leading-relaxed">
        The application is currently disconnected from the network. Stored local changes and marked attendance records will synchronize automatically once reconnected.
      </p>
      <Button
        variant="primary"
        size="md"
        icon={<RotateCcw className="w-4 h-4" />}
        onClick={() => window.location.reload()}
      >
        Check Connection & Retry
      </Button>
    </div>
  );
};
