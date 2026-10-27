import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Calendar, Building2, User, Search, Plus, CheckCircle2 } from 'lucide-react';

interface ServiceRequestItem {
  id: string;
  memberId: string;
  memberName: string;
  serviceId: string;
  serviceTitle: string;
  partnerName: string;
  centreId: string;
  requestedDate: string;
  status: 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes: string;
}

export const ServiceRequestsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  // Synthetic service requests based on referrals
  const [requests, setRequests] = useState<ServiceRequestItem[]>([
    {
      id: 'req-1',
      memberId: data.seniorCitizens[0]?.id || 'm-1',
      memberName: data.seniorCitizens[0]?.fullName || 'Kamala Deshpande',
      serviceId: 'srv-1',
      serviceTitle: 'Geriatric Outpatient Medical Assessment',
      partnerName: 'Sanctuary Elder Health Clinic',
      centreId: 'HUB-PUN',
      requestedDate: '2026-10-30',
      status: 'Confirmed',
      notes: 'Assisted booking by field volunteer for mobility consultation.',
    },
    {
      id: 'req-2',
      memberId: data.seniorCitizens[2]?.id || 'm-3',
      memberName: data.seniorCitizens[2]?.fullName || 'Sitaram Joshi',
      serviceId: 'srv-2',
      serviceTitle: 'Senior Citizen Maintenance & Pension Aid Consultation',
      partnerName: 'Justice For Elders Legal Aid Foundation',
      centreId: 'HUB-PUN',
      requestedDate: '2026-11-04',
      status: 'Requested',
      notes: 'Pending partner schedule confirmation.',
    },
    {
      id: 'req-3',
      memberId: data.seniorCitizens[4]?.id || 'm-5',
      memberName: data.seniorCitizens[4]?.fullName || 'Mohan Kulkarni',
      serviceId: 'srv-3',
      serviceTitle: 'Senior Vision Screening & Cataract Triage',
      partnerName: 'Drushti Netralaya & Charitable Eye Trust',
      centreId: 'HUB-NSK',
      requestedDate: '2026-10-25',
      status: 'Completed',
      notes: 'Screening done; advised reading glasses.',
    },
  ]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = requests.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.memberName.toLowerCase().includes(q) || r.serviceTitle.toLowerCase().includes(q);
    }
    return true;
  });

  const handleUpdateStatus = (id: string, newStatus: ServiceRequestItem['status']) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'CC',
      'UPDATE',
      'ServiceRequest',
      id,
      `Updated service request status to ${newStatus}`,
      null,
      { status: newStatus },
      undefined
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Service Bookings & Consultations"
        description="Assisted appointments and consultation requests coordinated with approved partners (FR-31)"
        breadcrumb={[
          { label: 'Services', href: '/services' },
          { label: 'Bookings' },
        ]}
        actions={
          <Link to="/referrals/new">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Book on Behalf of Senior
            </Button>
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search senior or service name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {['all', 'Requested', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  statusFilter === st
                    ? 'bg-accent text-white'
                    : 'bg-bg-subtle text-text-muted hover:text-text-primary'
                }`}
              >
                {st === 'all' ? 'All Bookings' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{filtered.length}</strong> booking{filtered.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Senior Citizen</th>
              <th className="py-3 px-4">Service & Specialty</th>
              <th className="py-3 px-4">Partner Organization</th>
              <th className="py-3 px-4">Preferred Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-text-muted">
                  No bookings found in this filter view.
                </td>
              </tr>
            ) : (
              filtered.map((req) => (
                <tr key={req.id} className="hover:bg-bg-subtle/40">
                  <td className="py-3.5 px-4">
                    <Link to={`/members/${req.memberId}`} className="font-medium text-text-primary hover:text-accent underline decoration-dotted">
                      {req.memberName}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-text-primary">{req.serviceTitle}</td>
                  <td className="py-3.5 px-4 text-text-muted">{req.partnerName}</td>
                  <td className="py-3.5 px-4 text-text-muted">{req.requestedDate}</td>
                  <td className="py-3.5 px-4">
                    <StatusChip
                      label={req.status}
                      variant={req.status === 'Completed' || req.status === 'Confirmed' ? 'active' : req.status === 'Requested' ? 'warning' : 'neutral'}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {req.status === 'Requested' && (
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'Confirmed')}
                        className="text-xs text-accent font-semibold hover:underline mr-3"
                      >
                        Confirm Slot
                      </button>
                    )}
                    {req.status === 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'Completed')}
                        className="text-xs text-emerald-700 font-semibold hover:underline"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
