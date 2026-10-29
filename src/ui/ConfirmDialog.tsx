import React from 'react';
import { ConfirmDialog as BaseConfirmDialog, ConfirmDialogProps } from '@/components/ui/ConfirmDialog';

export type { ConfirmDialogProps };

export const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
  return <BaseConfirmDialog {...props} />;
};

