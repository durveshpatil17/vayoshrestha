import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-96 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="w-14 h-14 rounded-full bg-surface-subtle text-text-secondary flex items-center justify-center mb-4 border border-border">
        <FileQuestion className="w-7 h-7 stroke-[1.5]" />
      </div>
      <span className="text-xs font-semibold text-text-secondary mb-1">
        HTTP 404
      </span>
      <h1 className="text-2xl font-semibold text-text mb-2">
        Page Not Found
      </h1>
      <p className="text-xs text-text-secondary mb-6 leading-relaxed">
        The requested screen does not exist or has been relocated within the Vayoshreshtha eldercare workspace.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" size="md" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" size="md" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    </div>
  );
};
