import React from 'react';
import { useSearchParams } from 'react-router-dom';

export interface TabItem {
  key: string;
  label: string;
  badge?: number | string;
  icon?: React.ReactNode;
}

export interface NavTabBarProps {
  tabs: TabItem[];
  defaultTab: string;
  paramName?: string;
  onTabChange?: (tab: string) => void;
}

export const NavTabBar: React.FC<NavTabBarProps> = ({
  tabs,
  defaultTab,
  paramName = 'tab',
  onTabChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParam = searchParams.get(paramName);
  const activeTab = tabs.some((t) => t.key === currentParam) ? currentParam! : defaultTab;

  const handleSelect = (key: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set(paramName, key);
    setSearchParams(nextParams, { replace: true });
    if (onTabChange) onTabChange(key);
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className="flex border-b border-border bg-surface rounded-t-container px-2 overflow-x-auto select-none shrink-0"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(tab.key)}
            className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap text-xs flex items-center gap-2 ${
              isActive
                ? 'border-accent text-accent font-semibold bg-accent-tint/20'
                : 'border-transparent text-text-secondary hover:text-text font-normal'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs tabular-nums ${
                  isActive
                    ? 'bg-accent text-white font-semibold'
                    : 'bg-surface-subtle text-text-secondary border border-border font-normal'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
