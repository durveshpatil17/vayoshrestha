import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { Star, MessageSquare, Plus, Search, Building2, User, Filter } from 'lucide-react';
import { FeedbackItem } from '@/api/contracts';

export const FeedbackListPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const feedbackList = data.feedback.filter((fb) => {
    // CC scope
    if (user?.role === 'CC') {
      if (user.assignedCentres && user.assignedCentres.length > 0 && !user.assignedCentres.includes(fb.centreId)) {
        return false;
      }
    }
    if (themeFilter !== 'all' && fb.theme !== themeFilter) return false;
    if (ratingFilter !== 'all' && fb.rating !== parseInt(ratingFilter, 10)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        fb.memberName.toLowerCase().includes(q) ||
        fb.programmeTitle.toLowerCase().includes(q) ||
        fb.comment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const avgRating =
    data.feedback.length > 0
      ? (data.feedback.reduce((acc, f) => acc + f.rating, 0) / data.feedback.length).toFixed(1)
      : '5.0';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Senior Feedback & Session Quality"
        description="Elder satisfaction ratings, venue feedback, and assisted entry records across Ekta Hub programmes (FR-35)"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Feedback' }]}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/feedback/forms">
              <Button variant="outline" size="sm">
                Form Templates
              </Button>
            </Link>
            <Can capability="feedback" action="create">
              <Link to="/feedback/new">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Assisted Feedback Entry
                </Button>
              </Link>
            </Can>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Average Satisfaction Score</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-serif font-bold text-text-primary">{avgRating}</span>
            <div className="flex text-amber-500">
              {'★'.repeat(Math.round(parseFloat(avgRating)))}
            </div>
          </div>
          <div className="text-xs text-text-muted mt-0.5">Based on {data.feedback.length} responses</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Assisted Field Submissions</div>
          <div className="text-2xl font-serif font-bold text-accent mt-1">
            {data.feedback.filter((f) => f.isAssistedEntry).length}
          </div>
          <div className="text-xs text-text-muted mt-0.5">Entered verbally by field staff</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Top Rated Theme</div>
          <div className="text-base font-serif font-bold text-text-primary mt-1.5">Instructor Patience</div>
          <div className="text-xs text-text-muted mt-0.5">94% positive sentiment</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Venue & Accessibility Feedback</div>
          <div className="text-base font-serif font-bold text-text-primary mt-1.5">Cushioning & Ramps</div>
          <div className="text-xs text-text-muted mt-0.5">3 actionable venue suggestions</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search by elder, programme, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <select
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value)}
            className="border border-border-hairline rounded px-2.5 py-1.5 bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Feedback Themes</option>
            <option value="Instructor">Instructor & Teaching</option>
            <option value="Venue">Venue & Seating</option>
            <option value="Content">Programme Content</option>
            <option value="Assistance">Volunteer Assistance</option>
            <option value="General">General Experience</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="border border-border-hairline rounded px-2.5 py-1.5 bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
          </select>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{feedbackList.length}</strong> feedback response{feedbackList.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Feedback List Cards */}
      <div className="space-y-3">
        {feedbackList.length === 0 ? (
          <div className="bg-bg-base border border-border-hairline rounded p-12 text-center text-text-muted text-sm">
            No feedback entries match your filter criteria.
          </div>
        ) : (
          feedbackList.map((item) => {
            const centre = data.centres.find((c) => c.id === item.centreId);

            return (
              <div
                key={item.id}
                className="bg-bg-base border border-border-hairline rounded p-4 space-y-2 hover:border-border-strong transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary text-xs">
                        {user?.role === 'CD' ? 'Senior Participant' : item.memberName}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 bg-bg-subtle text-text-muted border border-border-hairline rounded">
                        {item.theme}
                      </span>
                      {item.isAssistedEntry && (
                        <span className="text-[11px] px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                          Assisted Entry ({item.recordedBy})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted">
                      Programme: <strong>{item.programmeTitle}</strong> • {centre?.name || item.centreId}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                    {'★'.repeat(item.rating)}
                    <span className="text-xs text-text-muted ml-1 font-normal font-sans">({item.rating}/5)</span>
                  </div>
                </div>

                <p className="text-xs text-text-primary leading-relaxed bg-bg-subtle/50 p-3 rounded border border-border-hairline/60">
                  "{item.comment}"
                </p>

                <div className="text-[11px] text-text-muted pt-1">
                  Submitted on {item.createdAt.split('T')[0]}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
