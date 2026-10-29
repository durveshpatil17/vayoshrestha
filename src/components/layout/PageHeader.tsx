import React from 'react';
import { DynamicPageHeader, DynamicPageHeaderProps } from '@/ui/DynamicPageHeader';

export type { BreadcrumbItem } from '@/ui/DynamicPageHeader';

export interface PageHeaderProps extends DynamicPageHeaderProps {
  description?: string;
  subtitle?: string;
  breadcrumbs?: any[];
  breadcrumb?: any[];
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  actions?: React.ReactNode;
  statusBadge?: React.ReactNode;
  statusIndicator?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  actions,
  statusBadge,
  statusIndicator,
  ...props
}) => {
  return (
    <DynamicPageHeader
      {...props}
      primaryAction={props.primaryAction || actions}
      statusIndicator={statusIndicator || statusBadge}
    />
  );
};
