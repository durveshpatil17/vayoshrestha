import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Users,
  Search,
  Filter,
  Plus,
  ChevronRight,
  CheckCircle,
  Clock,
  UserX,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

interface AssociateRow {
  id: string;
  fullName: string;
  phone: string;
  chapterId: string;
  chapterName: string;
  trainingStatus: 'Certified' | 'In Training' | 'Needs Refresher';
  isActive: boolean;
  onboardedCount: number;
  activityCount: number;
  lastActiveAt: string;
}

const SEED_ASSOCIATES: AssociateRow[] = [
  {
    id: 'fa-001',
    fullName: 'Ramakant Shinde',
    phone: '+91 98220 99001',
    chapterId: 'HUB-PUN',
    chapterName: 'Pune Ekta Hub',
    trainingStatus: 'Certified',
    isActive: true,
    onboardedCount: 14,
    activityCount: 48,
    lastActiveAt: '12 min ago',
  },
  {
    id: 'fa-002',
    fullName: 'Anasuya Kelkar',
    phone: '+91 98220 99002',
    chapterId: 'HUB-PUN',
    chapterName: 'Pune Ekta Hub',
    trainingStatus: 'Certified',
    isActive: true,
    onboardedCount: 12,
    activityCount: 39,
    lastActiveAt: '35 min ago',
  },
  {
    id: 'fa-003',
    fullName: 'K. S. Narayana',
    phone: '+91 98800 11001',
    chapterId: 'HUB-BLR',
    chapterName: 'Bengaluru Ekta Hub',
    trainingStatus: 'Certified',
    isActive: true,
    onboardedCount: 16,
    activityCount: 52,
    lastActiveAt: '8 min ago',
  },
  {
    id: 'fa-004',
    fullName: 'Venkatesh Rao',
    phone: '+91 98800 11002',
    chapterId: 'HUB-BLR',
    chapterName: 'Bengaluru Ekta Hub',
    trainingStatus: 'Certified',
    isActive: true,
    onboardedCount: 9,
    activityCount: 31,
    lastActiveAt: '1h ago',
  },
  {
    id: 'fa-005',
    fullName: 'Suresh Deshmukh',
    phone: '+91 98220 99005',
    chapterId: 'HUB-NSK',
    chapterName: 'Nashik Ekta Hub',
    trainingStatus: 'Certified',
    isActive: true,
    onboardedCount: 11,
    activityCount: 37,
    lastActiveAt: '2h ago',
  },
  {
    id: 'fa-006',
    fullName: 'Meenakshi Sundaram',
    phone: '+91 98400 22001',
    chapterId: 'HUB-CHE',
    chapterName: 'Chennai Ekta Hub',
    trainingStatus: 'In Training',
    isActive: true,
    onboardedCount: 4,
    activityCount: 12,
    lastActiveAt: '3h ago',
  },
  {
    id: 'fa-007',
    fullName: 'Gopal Krishna Iyer',
    phone: '+91 98800 33001',
    chapterId: 'HUB-MYS',
    chapterName: 'Mysuru Ekta Hub',
    trainingStatus: 'Certified',
    isActive: true,
    onboardedCount: 13,
    activityCount: 41,
    lastActiveAt: '4h ago',
  },
  {
    id: 'fa-008',
    fullName: 'Laxman Prasad Verma',
    phone: '+91 98110 44001',
    chapterId: 'HUB-JAI',
    chapterName: 'Jaipur Ekta Hub',
    trainingStatus: 'Certified',
    isActive: true,
    onboardedCount: 8,
    activityCount: 29,
    lastActiveAt: '5h ago',
  },
  {
    id: 'fa-009',
    fullName: 'Raghunath Pandey',
    phone: '+91 98110 55001',
    chapterId: 'HUB-LUK',
    chapterName: 'Lucknow Ekta Hub',
    trainingStatus: 'Certified',
    isActive: true,
    onboardedCount: 10,
    activityCount: 33,
    lastActiveAt: '6h ago',
  },
  {
    id: 'fa-010',
    fullName: 'Manohar Joshi',
    phone: '+91 98220 99010',
    chapterId: 'HUB-NAG',
    chapterName: 'Nagpur Ekta Hub',
    trainingStatus: 'Needs Refresher',
    isActive: false,
    onboardedCount: 6,
    activityCount: 19,
    lastActiveAt: '3 days ago',
  },
];

export const FieldAssociatesPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [chapterFilter, setChapterFilter] = useState('ALL');
  const [trainingFilter, setTrainingFilter] = useState('ALL');
  const [associates, setAssociates] = useState<AssociateRow[]>(SEED_ASSOCIATES);

  const filtered = associates.filter((a) => {
    if (chapterFilter !== 'ALL' && a.chapterId !== chapterFilter) return false;
    if (trainingFilter !== 'ALL' && a.trainingStatus !== trainingFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.fullName.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.chapterName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-secondary mb-1">
            <span
              onClick={() => navigate('/field-network')}
              className="hover:text-accent cursor-pointer"
            >
              Field Network
            </span>
            <span>/</span>
            <span className="text-text font-semibold">Associates Roster</span>
          </div>
          <h1 className="text-2xl font-semibold text-text">
            Senior Field Associates Roster
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            60 active senior community workers conducting ethical last-mile outreach across 9 chapters.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => alert('Invite Field Associate Modal: Enter senior name, mobile, and chapter assignment.')}
        >
          Invite Senior Associate
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Search by associate name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-bg-surface text-text text-xs focus:border-accent"
          >
            <option value="ALL">All Chapters (9 Ekta Hubs)</option>
            <option value="HUB-PUN">Pune Ekta Hub</option>
            <option value="HUB-BLR">Bengaluru Ekta Hub</option>
            <option value="HUB-NSK">Nashik Ekta Hub</option>
            <option value="HUB-MYS">Mysuru Ekta Hub</option>
            <option value="HUB-CHE">Chennai Ekta Hub</option>
            <option value="HUB-NAG">Nagpur Ekta Hub</option>
            <option value="HUB-IND">Indore Ekta Hub</option>
            <option value="HUB-JAI">Jaipur Ekta Hub</option>
            <option value="HUB-LUK">Lucknow Ekta Hub</option>
          </select>

          <select
            value={trainingFilter}
            onChange={(e) => setTrainingFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-bg-surface text-text text-xs focus:border-accent"
          >
            <option value="ALL">All Training Statuses</option>
            <option value="Certified">Certified (DPDP Ready)</option>
            <option value="In Training">In Training</option>
            <option value="Needs Refresher">Needs Refresher</option>
          </select>
        </div>
      </div>

      {/* Associates Table */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-subtle text-text-secondary text-xs font-semibold">
              <th className="py-3 px-4">Associate Name &amp; Phone</th>
              <th className="py-3 px-4">Assigned Chapter</th>
              <th className="py-3 px-4">Training Certification</th>
              <th className="py-3 px-4 text-center">Peers Onboarded</th>
              <th className="py-3 px-4 text-center">Activities Logged</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Active</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-secondary">
            {filtered.map((a) => (
              <tr
                key={a.id}
                onClick={() => navigate(`/field-network/associates/${a.id}`)}
                className="hover:bg-surface-subtle/50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-semibold text-text">
                  <div className="font-semibold text-text text-sm">{a.fullName}</div>
                  <div className="text-xs text-text-secondary tabular-nums mt-0.5">{a.phone}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-text">
                    <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <span>{a.chapterName}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      a.trainingStatus === 'Certified'
                        ? 'bg-positive-tint text-positive'
                        : a.trainingStatus === 'In Training'
                        ? 'bg-critical-tint text-critical'
                        : 'bg-surface-subtle text-text-secondary'
                    }`}
                  >
                    {a.trainingStatus === 'Certified' && <CheckCircle className="w-3 h-3" />}
                    {a.trainingStatus}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-semibold text-accent tabular-nums text-sm">
                  {a.onboardedCount}
                </td>
                <td className="py-3 px-4 text-center tabular-nums text-text">
                  {a.activityCount}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      a.isActive
                        ? 'bg-positive-tint text-positive'
                        : 'bg-surface-subtle text-text-secondary'
                    }`}
                  >
                    {a.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td className="py-3 px-4 text-text-secondary tabular-nums">
                  {a.lastActiveAt}
                </td>
                <td className="py-3 px-4 text-right">
                  <ChevronRight className="w-4 h-4 text-text-secondary inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
