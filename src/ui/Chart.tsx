import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceArea,
  Legend,
} from 'recharts';
import { COLOR_TOKENS } from '@/styles/tokens.generated';
import { ChartTableToggle } from './ChartTableToggle';
import { DataTable, Column } from './DataTable';

export interface ChartProps<T extends Record<string, any>> {
  title: string;
  subtitle?: string;
  data: T[];
  type?: 'line' | 'bar' | 'band';
  xDataKey: string;
  series: Array<{
    dataKey: string;
    label: string;
    color?: string;
    strokeDasharray?: string;
  }>;
  bands?: Array<{
    y1: number;
    y2: number;
    label: string;
    color: string;
    opacity?: number;
  }>;
  height?: number;
  definition?: string;
  tableColumns?: Column<T>[];
  className?: string;
}

export function CloudscapeChart<T extends Record<string, any>>({
  title,
  subtitle,
  data,
  type = 'line',
  xDataKey,
  series,
  bands,
  height = 260,
  definition,
  tableColumns,
  className = '',
}: ChartProps<T>) {
  const [view, setView] = useState<'chart' | 'table'>('chart');

  // Fallback table columns if not explicitly provided
  const columns: Column<T>[] =
    tableColumns || [
      { key: xDataKey, header: xDataKey.charAt(0).toUpperCase() + xDataKey.slice(1) },
      ...series.map((s) => ({
        key: s.dataKey,
        header: s.label,
        align: 'right' as const,
      })),
    ];

  const defaultColors = [
    COLOR_TOKENS.chart1,
    COLOR_TOKENS.chart2,
    COLOR_TOKENS.chart3,
    COLOR_TOKENS.chart4,
    COLOR_TOKENS.chart5,
  ];

  return (
    <div className={`bg-surface border border-border rounded-container p-6 space-y-4 ${className}`}>
      {/* Header with Title and View as Table toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-3">
        <div>
          <h3 className="text-base font-semibold text-text">{title}</h3>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>
        <ChartTableToggle view={view} onChange={setView} />
      </div>

      {/* Chart View */}
      {view === 'chart' ? (
        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  stroke={COLOR_TOKENS.border}
                  strokeDasharray="0"
                  vertical={false}
                />
                <XAxis
                  dataKey={xDataKey}
                  stroke={COLOR_TOKENS.textSecondary}
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: COLOR_TOKENS.border }}
                />
                <YAxis
                  stroke={COLOR_TOKENS.textSecondary}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: COLOR_TOKENS.surface,
                    borderColor: COLOR_TOKENS.border,
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: '0 4px 16px rgba(29,45,62,.16)',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="left"
                  wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
                />
                {series.map((s, idx) => (
                  <Bar
                    key={s.dataKey}
                    dataKey={s.dataKey}
                    name={s.label}
                    fill={s.color || defaultColors[idx % defaultColors.length]}
                    radius={[0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  stroke={COLOR_TOKENS.border}
                  strokeDasharray="0"
                  vertical={false}
                />
                <XAxis
                  dataKey={xDataKey}
                  stroke={COLOR_TOKENS.textSecondary}
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: COLOR_TOKENS.border }}
                />
                <YAxis
                  stroke={COLOR_TOKENS.textSecondary}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: COLOR_TOKENS.surface,
                    borderColor: COLOR_TOKENS.border,
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: '0 4px 16px rgba(29,45,62,.16)',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="left"
                  wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
                />

                {/* Optional Band Thresholds */}
                {bands?.map((b, i) => (
                  <ReferenceArea
                    key={i}
                    y1={b.y1}
                    y2={b.y2}
                    fill={b.color}
                    fillOpacity={b.opacity || 0.15}
                    label={{ value: b.label, fill: COLOR_TOKENS.textSecondary, fontSize: 11, position: 'insideTopRight' }}
                  />
                ))}

                {series.map((s, idx) => (
                  <Line
                    key={s.dataKey}
                    type="monotone"
                    dataKey={s.dataKey}
                    name={s.label}
                    stroke={s.color || defaultColors[idx % defaultColors.length]}
                    strokeWidth={2}
                    strokeDasharray={s.strokeDasharray}
                    dot={{ r: 3, fill: s.color || defaultColors[idx % defaultColors.length] }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        /* Table View */
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(item: T) => (item.id ? String(item.id) : item[xDataKey] ? String(item[xDataKey]) : JSON.stringify(item))}
        />
      )}

      {/* Definition Caption beneath */}
      {definition && (
        <p className="text-xs text-text-secondary border-t border-border-subtle pt-2.5 leading-relaxed">
          <strong className="text-text font-semibold mr-1">Definition:</strong>
          {definition}
        </p>
      )}
    </div>
  );
}

export interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = COLOR_TOKENS.chart1,
  width = 120,
  height = 32,
}) => {
  const chartData = data.map((val, idx) => ({ idx, val }));

  return (
    <div style={{ width, height }} className="inline-block">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
