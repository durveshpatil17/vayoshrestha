import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Clock, ArrowRight } from 'lucide-react';

export const SessionExpiredPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const returnTo = queryParams.get('returnTo') || '/';

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-bg-base border border-border-strong rounded p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-warning-bg text-warning flex items-center justify-center mx-auto mb-4 border border-warning/30">
            <Clock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Session Expired
          </h2>
          <p className="text-xs text-text-muted mb-6 leading-relaxed">
            Your login session has timed out due to 15 minutes of inactivity. Please re-authenticate to continue where you left off.
          </p>

          <Button
            variant="primary"
            size="md"
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`)}
          >
            Sign In Again
          </Button>
        </div>
      </div>

      <footer className="py-4 text-center border-t border-border-hairline text-xs text-text-muted">
        Vayoshreshtha Ecosystem · Vayoh Vikas NGO
      </footer>
    </div>
  );
};
