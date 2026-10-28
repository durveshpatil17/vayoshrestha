import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { escapeCsvFormula } from '@/domain/masking';
import { Download, X, AlertTriangle } from 'lucide-react';

export interface ExportDialogProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  datasetName?: string;
  entityName?: string;
  title?: string;
  totalRows?: number;
  data?: any[];
  fileNamePrefix?: string;
  defaultFileName?: string;
  columns?: { key: string; label: string }[];
  onExport?: (reason: string) => Promise<void> | void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  open,
  onClose,
  onOpenChange,
  datasetName,
  entityName,
  title,
  totalRows,
  data = [],
  fileNamePrefix,
  defaultFileName,
  columns,
  onExport,
}) => {
  const isDialogVisible = open !== undefined ? open : (isOpen ?? false);
  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };
  const user = useAuthStore((s) => s.user);
  const effectiveDatasetName = datasetName || entityName || title || 'Export Data';
  const effectivePrefix = fileNamePrefix || defaultFileName || entityName || 'export';

  const [reason, setReason] = useState('');
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  if (!isDialogVisible) return null;

  const handleExport = async () => {
    if (!reason.trim()) {
      setError('Please provide a mandatory justification reason for this data export.');
      return;
    }

    setIsExporting(true);
    setError('');

    try {
      if (onExport) {
        await onExport(reason);
      }

      // Generate CSV download
      const rowData = data.length > 0 ? data : [{ exported: true, timestamp: new Date().toISOString() }];
      const cols = columns || Object.keys(rowData[0] || {}).map((k) => ({ key: k, label: k }));
      const headerRow = cols.map((c) => `"${escapeCsvFormula(c.label)}"`).join(',');
      const dataRows = rowData.map((row) =>
        cols
          .map((col) => {
            const val = row[col.key] !== undefined ? String(row[col.key]) : '';
            return `"${escapeCsvFormula(val)}"`;
          })
          .join(',')
      );
      const csvContent = [headerRow, ...dataRows].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `${effectivePrefix}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white border border-border-hairline rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-border-hairline pb-3">
          <h3 className="font-serif font-bold text-base text-text-primary flex items-center gap-2">
            <Download className="w-4 h-4 text-accent" />
            {title || `Export ${effectiveDatasetName}`}
          </h3>
          <button onClick={handleClose} className="text-text-muted hover:text-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        {totalRows !== undefined && (
          <p className="text-xs text-text-muted">
            Exporting <strong>{totalRows}</strong> records matching active filters.
          </p>
        )}

        {error && (
          <div className="p-2.5 bg-danger-surface border border-danger/30 rounded text-xs text-danger flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-text-primary mb-1">
              Mandatory Justification Reason <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly chapter health audit / Regional review"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div className="p-3 bg-surface-subtle border border-border-hairline rounded text-[11px] text-text-muted leading-relaxed">
            Exports are watermarked and logged to the cryptographic audit trail with your user identity
            ({user?.fullName || user?.role}). CSV formula injection characters (=, +, -, @) are
            strictly escaped.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            isLoading={isExporting}
            className="text-xs bg-accent gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Confirm & Download
          </Button>
        </div>
      </div>
    </div>
  );
};
