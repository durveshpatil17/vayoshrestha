import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { findWorkspaceForPath, WORKSPACES, WorkspaceId } from '@/navigation/workspaces';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const pathname = location.pathname;

  // Don't render redundant breadcrumbs on pure Home page
  if (pathname === '/') {
    return null;
  }

  const items: { label: string; href?: string }[] = [{ label: 'Home', href: '/' }];

  // 1. Workspace detection
  const wsId = findWorkspaceForPath(pathname);
  const workspace = wsId ? WORKSPACES[wsId] : null;

  if (workspace) {
    items.push({
      label: workspace.name,
      href: `/w/${workspace.id}`,
    });

    // 2. App detection within workspace
    if (!pathname.startsWith('/w/')) {
      const matchedApp = workspace.apps.find((app) =>
        pathname === app.path || (app.path !== '/' && pathname.startsWith(app.path))
      );

      if (matchedApp) {
        items.push({
          label: matchedApp.name,
          href: pathname === matchedApp.path ? undefined : matchedApp.path,
        });
      }
    }
  } else if (pathname.startsWith('/inbox')) {
    items.push({ label: 'My work' });
  } else if (pathname.startsWith('/apps')) {
    items.push({ label: 'App Finder' });
  } else if (pathname.startsWith('/about')) {
    items.push({ label: 'About Vayoshrestha' });
  } else if (pathname.startsWith('/login')) {
    return null;
  }

  // 3. Detail ID or sub-resource
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  if (
    lastSegment &&
    !items.some((i) => i.label.toLowerCase() === lastSegment.toLowerCase()) &&
    (lastSegment.length > 5 || params.id || params.seniorId || params.caseId)
  ) {
    items.push({ label: params.id || params.seniorId || params.caseId || lastSegment });
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="h-8 bg-surface-subtle border-b border-border-subtle px-6 flex items-center text-xs text-text-secondary select-none shrink-0 overflow-x-auto"
    >
      <ol className="flex items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5 whitespace-nowrap">
              {index > 0 && <ChevronRight className="w-3 h-3 text-text-secondary/60 stroke-[1.5] shrink-0" />}
              {index === 0 && <Home className="w-3.5 h-3.5 stroke-[1.5] text-text-secondary mr-0.5 shrink-0" />}
              {isLast || !item.href ? (
                <span className={`font-semibold ${isLast ? 'text-text' : 'text-text-secondary'}`} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-text-secondary hover:text-accent hover:underline transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
