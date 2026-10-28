import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Phone,
  Users,
  Calendar,
  AlertTriangle,
  UserCheck,
  Edit,
  ArrowLeft,
  Plus,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { useAuthStore } from '@/store/authStore';

export const ChapterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const chapter = data.chapters.find((c) => c.id === id) || data.chapters[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'staff' | 'roster' | 'programmes' | 'participation' | 'seniors'>('overview');

  if (!chapter) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-serif font-semibold">Chapter not found</h2>
        <Link to="/chapters" className="text-[var(--accent)] text-sm mt-2 inline-block">Back to chapters</Link>
      </div>
    );
  }

  const registeredSeniors = data.seniors.filter((s) => s.chapterId === chapter.id);
  const chapterStaff = data.users.filter((u) => u.assignedChapter === chapter.id || u.assignedCentres?.includes(chapter.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/chapters" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Chapters
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">{chapter.name}</span>
      </div>

      <PageHeader
        title={chapter.name}
        subtitle={`${chapter.city}, ${chapter.state} • Code: ${chapter.code} • Region: ${chapter.regionId}`}
        actions={
          <div className="flex items-center gap-3">
            <StatusChip label={chapter.status} status={chapter.status === 'Active' ? 'active' : 'inactive'} />
            {(user?.role === 'SA' || user?.role === 'NM' || user?.role === 'RA' || user?.role === 'CM') && (
              <Link to={`/chapters/${chapter.id}/edit`}>
                <Button variant="outline" size="sm" icon={<Edit size={14} />}>
                  Edit chapter
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* 7 Tabs */}
      <div className="border-b border-[var(--border)] flex gap-6 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'schedule', label: 'Schedule' },
          { key: 'staff', label: 'Coordinators & staff' },
          { key: 'roster', label: 'SOS duty roster' },
          { key: 'programmes', label: 'Programmes' },
          { key: 'participation', label: 'Participation' },
          { key: 'seniors', label: `Seniors (${registeredSeniors.length || 142})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
              activeTab === tab.key
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card title="Chapter facility details">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-[var(--text-secondary)] block">Address</span>
                  <span className="font-semibold text-[var(--text)]">{chapter.address}</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-secondary)] block">City & State</span>
                  <span className="font-semibold text-[var(--text)]">{chapter.city}, {chapter.state}</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-secondary)] block">Centre coordinator</span>
                  <span className="font-semibold text-[var(--text)]">{chapter.contactPerson}</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-secondary)] block">Contact phone</span>
                  <span className="font-semibold text-[var(--text)]">{chapter.contactPhone}</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-secondary)] block">Languages supported</span>
                  <span className="font-semibold text-[var(--text)]">{chapter.languagesServed?.join(', ') || 'English, Marathi'}</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-secondary)] block">Operating hours</span>
                  <span className="font-semibold text-[var(--text)]">Mon – Sat, 9:00 AM – 6:00 PM IST</span>
                </div>
              </div>
            </Card>

            <Card title="Community impact snapshot">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded bg-[var(--surface-subtle)] text-center">
                  <div className="text-2xl font-semibold text-[var(--text)] tabular-nums">{registeredSeniors.length || 142}</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">Enrolled seniors</div>
                </div>
                <div className="p-4 rounded bg-[var(--surface-subtle)] text-center">
                  <div className="text-2xl font-semibold text-[var(--positive)] tabular-nums">94.2%</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">Session attendance rate</div>
                </div>
                <div className="p-4 rounded bg-[var(--surface-subtle)] text-center">
                  <div className="text-2xl font-semibold text-[var(--accent)] tabular-nums">18</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">Monthly sessions</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Primary emergency contact">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 rounded bg-[var(--surface-selected)] border border-[var(--border)]">
                  <ShieldCheck size={20} className="text-[var(--accent)] shrink-0" />
                  <div>
                    <div className="font-semibold text-[var(--text)]">{chapter.contactPerson}</div>
                    <div className="text-xs text-[var(--text-secondary)]">Primary Hub Responder</div>
                    <div className="text-xs font-semibold text-[var(--accent)] mt-0.5">{chapter.contactPhone}</div>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Calls forwarded automatically if unanswered within 120 seconds.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Schedule */}
      {activeTab === 'schedule' && (
        <Card title="Weekly session calendar">
          <div className="divide-y divide-[var(--border-subtle)]">
            {[
              { day: 'Monday, 10:00 AM', title: 'Gentle Yoga & Joint Mobility', room: 'Hall A', instructor: 'Meera K. (VF)', capacity: '25/30' },
              { day: 'Wednesday, 11:30 AM', title: 'Digital Literacy: WhatsApp & UPI', room: 'Computer Room', instructor: 'Arjun N. (CM)', capacity: '18/20' },
              { day: 'Thursday, 3:00 PM', title: 'Preventive Health & BP Check-in', room: 'Clinic Room', instructor: 'Nurse Sunita (SP)', capacity: '32/35' },
              { day: 'Saturday, 4:00 PM', title: 'Bhajan & Cultural Storytelling', room: 'Main Lounge', instructor: 'Suresh Kulkarni', capacity: '45/50' },
            ].map((s, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">{s.title}</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {s.day} • {s.room} • Facilitator: {s.instructor}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--text-secondary)] block">Registered</span>
                  <span className="text-sm font-semibold text-[var(--text)] tabular-nums">{s.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 3: Staff */}
      {activeTab === 'staff' && (
        <Card title="Chapter personnel">
          <div className="divide-y divide-[var(--border-subtle)]">
            {chapterStaff.length > 0 ? (
              chapterStaff.map((staff) => (
                <div key={staff.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">{staff.fullName}</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Role: <strong>{staff.role}</strong> • Email: {staff.email}
                    </div>
                  </div>
                  <StatusChip label={staff.isActive ? 'Active' : 'Inactive'} status={staff.isActive ? 'active' : 'inactive'} />
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-[var(--text-secondary)]">
                Coordinator: {chapter.contactPerson} ({chapter.contactPhone})
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Tab 4: SOS Duty Roster */}
      {activeTab === 'roster' && (
        <Card title="SOS Duty Roster & Escalation Roster">
          <div className="space-y-4">
            <div className="text-xs text-[var(--text-secondary)]">
              Primary responders are notified immediately on emergency SOS trigger via interactive WhatsApp prompt and audible chime.
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {(chapter.onDutyRoster || []).map((m, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-[var(--surface-subtle)] text-[var(--accent)]">
                      <UserCheck size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)]">
                        {m.userName} {m.isPrimaryResponder && <span className="text-xs text-[var(--accent)] font-semibold">(Primary Responder)</span>}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Shift: {m.shift} • Contact: {m.onCallPhone}
                      </div>
                    </div>
                  </div>
                  <StatusChip label={m.role} status="info" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Tab 5: Programmes */}
      {activeTab === 'programmes' && (
        <Card title="Active community programmes">
          <div className="divide-y divide-[var(--border-subtle)]">
            {[
              { name: 'Swasthya Seva — Preventive Geriatric Health', category: 'Health & Wellness', sessions: '8/month', enrolled: '94' },
              { name: 'Digital Sahayata — Smartphone Confidence', category: 'Digital Empowerment', sessions: '4/month', enrolled: '62' },
              { name: 'Ananda Sangam — Social Circle & Recreation', category: 'Mental Health & Social', sessions: '6/month', enrolled: '112' },
            ].map((p, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">{p.name}</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Category: {p.category} • Frequency: {p.sessions}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--text-secondary)] block">Enrolled elders</span>
                  <span className="text-sm font-semibold text-[var(--text)] tabular-nums">{p.enrolled}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 6: Participation */}
      {activeTab === 'participation' && (
        <Card title="Monthly participation analytics">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded bg-[var(--surface-subtle)]">
                <span className="text-xs text-[var(--text-secondary)] block">Total session visits</span>
                <span className="text-xl font-semibold text-[var(--text)] tabular-nums">482</span>
              </div>
              <div className="p-4 rounded bg-[var(--surface-subtle)]">
                <span className="text-xs text-[var(--text-secondary)] block">Unique seniors attending</span>
                <span className="text-xl font-semibold text-[var(--text)] tabular-nums">128</span>
              </div>
              <div className="p-4 rounded bg-[var(--surface-subtle)]">
                <span className="text-xs text-[var(--text-secondary)] block">Average satisfaction score</span>
                <span className="text-xl font-semibold text-[var(--positive)] tabular-nums">4.8 / 5.0</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 7: Seniors */}
      {activeTab === 'seniors' && (
        <Card title="Registered senior citizens in this chapter">
          <div className="divide-y divide-[var(--border-subtle)]">
            {(registeredSeniors.slice(0, 10)).map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link to={`/seniors/${s.id}`} className="text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)]">
                    {s.name} ({s.age}y, {s.gender})
                  </Link>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Member ID: <span className="tabular-nums font-semibold">{s.id}</span> • Phone: {s.phone}
                  </div>
                </div>
                <Link to={`/seniors/${s.id}`}>
                  <Button size="sm" variant="outline">View record</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
