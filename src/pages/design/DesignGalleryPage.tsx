import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Switch } from '@/components/ui/Switch';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { DatePicker } from '@/components/ui/DatePicker';
import { TimePicker } from '@/components/ui/TimePicker';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { StatusChip } from '@/components/ui/StatusChip';
import { MessageStrip } from '@/components/ui/MessageStrip';
import { Flashbar } from '@/components/ui/Flashbar';
import { Card } from '@/components/ui/Card';
import { KpiTile } from '@/components/ui/KpiTile';
import { Dialog } from '@/components/ui/Dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Drawer } from '@/components/ui/Drawer';
import { StatusPath } from '@/components/ui/StatusPath';
import { Avatar } from '@/components/ui/Avatar';
import { DataTable } from '@/components/data/DataTable';
import { CommandBar } from '@/components/layout/CommandBar';
import { FilterBar } from '@/components/data/FilterBar';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  User,
  Phone,
  AlertOctagon,
  Clock,
  CheckCircle,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

export const DesignGalleryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'floorplans'>('components');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState('phone');
  const [switchVal, setSwitchVal] = useState(true);
  const [multiVal, setMultiVal] = useState(['hi', 'mr']);
  const [pathStep, setPathStep] = useState('triage');
  const [tableSelected, setTableSelected] = useState<string[]>(['s-1']);

  const sampleTableData = [
    { id: 's-1', name: 'Savitri Devi Sharma', age: 76, chapter: 'Hubballi Central', status: 'positive' as const, statusLabel: 'Active', adherence: 94 },
    { id: 's-2', name: 'Raghunath V. Joshi', age: 82, chapter: 'Dharwad Urban', status: 'critical' as const, statusLabel: 'Needs Call', adherence: 68 },
    { id: 's-3', name: 'Anasuya K. Patil', age: 71, chapter: 'Belagavi North', status: 'positive' as const, statusLabel: 'Active', adherence: 100 },
    { id: 's-4', name: 'Gopalrao S. Deshpande', age: 79, chapter: 'Hubballi South', status: 'neutral' as const, statusLabel: 'Scheduled', adherence: 82 },
    { id: 's-5', name: 'Kamala Narayan Rao', age: 84, chapter: 'Dharwad Rural', status: 'negative' as const, statusLabel: 'Unacknowledged', adherence: 45 },
  ];

  const tableColumns = [
    {
      key: 'name',
      header: 'Senior name',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <Avatar name={item.name} size="sm" />
          <span className="font-semibold text-text">{item.name}</span>
        </div>
      ),
    },
    { key: 'age', header: 'Age', align: 'right' as const },
    { key: 'chapter', header: 'Chapter hub' },
    {
      key: 'status',
      header: 'Care status',
      render: (item: any) => (
        <StatusIndicator status={item.status} label={item.statusLabel} />
      ),
    },
    {
      key: 'adherence',
      header: 'Adherence rate',
      align: 'right' as const,
      render: (item: any) => (
        <span className="tabular-nums font-semibold">{item.adherence}%</span>
      ),
    },
  ];

  const chartData = [
    { day: 'Mon', completed: 42, missed: 5 },
    { day: 'Tue', completed: 48, missed: 3 },
    { day: 'Wed', completed: 45, missed: 7 },
    { day: 'Thu', completed: 51, missed: 2 },
    { day: 'Fri', completed: 56, missed: 4 },
    { day: 'Sat', completed: 38, missed: 6 },
    { day: 'Sun', completed: 40, missed: 3 },
  ];

  return (
    <div className="min-h-screen bg-canvas text-text pb-20">
      {/* 1. Flashbar Preview */}
      <Flashbar
        alerts={[
          {
            id: 'sos-live-101',
            seniorName: 'Savitri Devi Sharma',
            chapter: 'Hubballi Central',
            elapsedSeconds: 142,
          },
        ]}
        onViewCase={() => setIsDrawerOpen(true)}
        onAcknowledge={() => alert('SOS Case acknowledged (logged to audit trail)')}
      />

      {/* 2. Page Header Bar */}
      <div className="bg-surface border-b border-border px-8 py-5">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs text-text-secondary font-medium mb-1">
              Design System · Verification and Component Gallery
            </div>
            <h1 className="text-[28px] leading-[36px] font-semibold text-text">
              Vayoshrestha Design Gallery
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              SAP Fiori Horizon shell paired with AWS Cloudscape data console patterns (white theme).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SegmentedControl
              value={activeTab}
              onChange={setActiveTab}
              options={[
                { value: 'components', label: 'Component Catalog' },
                { value: 'floorplans', label: 'Floorplan Skeletons' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 pt-6 space-y-8">
        {activeTab === 'components' ? (
          <>
            {/* Foundations */}
            <Card title="1. Foundations: Design Tokens and Typography Scale">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-text mb-3">Color Token Surfaces and Semantic Roles</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-control bg-canvas border border-border">
                      <div className="font-semibold text-text">Canvas</div>
                      <div className="text-text-secondary tabular-nums text-xs">#F5F6F7</div>
                    </div>
                    <div className="p-2.5 rounded-control bg-surface border border-border">
                      <div className="font-semibold text-text">Surface</div>
                      <div className="text-text-secondary tabular-nums text-xs">#FFFFFF</div>
                    </div>
                    <div className="p-2.5 rounded-control bg-surface-subtle border border-border">
                      <div className="font-semibold text-text">Subtle</div>
                      <div className="text-text-secondary tabular-nums text-xs">#F8F9FA</div>
                    </div>
                    <div className="p-2.5 rounded-control bg-accent text-white">
                      <div className="font-semibold">Horizon Blue</div>
                      <div className="text-white tabular-nums text-xs">#0070F2</div>
                    </div>
                    <div className="p-2.5 rounded-control bg-accent-tint text-accent border border-border">
                      <div className="font-semibold">Accent Tint</div>
                      <div className="text-accent tabular-nums text-xs">#EAF3FE</div>
                    </div>
                    <div className="p-2.5 rounded-control bg-positive-tint text-positive border border-border">
                      <div className="font-semibold">Positive</div>
                      <div className="text-positive tabular-nums text-xs">#256F3A</div>
                    </div>
                    <div className="p-2.5 rounded-control bg-critical-tint text-critical border border-border">
                      <div className="font-semibold">Critical</div>
                      <div className="text-critical tabular-nums text-xs">#E76500</div>
                    </div>
                    <div className="p-2.5 rounded-control bg-negative-tint text-negative border border-border">
                      <div className="font-semibold">Negative</div>
                      <div className="text-negative tabular-nums text-xs">#D20A0A</div>
                    </div>
                    <div className="p-2.5 rounded-control bg-surface-subtle border border-border">
                      <div className="font-semibold text-text">Border 1px</div>
                      <div className="text-text-secondary tabular-nums text-xs">#D5DADD</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-text mb-3">Open Sans Typography Scale (Weights 400 and 600)</h4>
                  <div className="space-y-2 text-text">
                    <div className="text-[28px] leading-[36px] font-semibold">Title 28/600 — वयोश्रेष्ठ वयो विकास</div>
                    <div className="text-xl leading-7 font-semibold">Section 20/600 — ಹಿರಿಯರ ಆರೈಕೆ</div>
                    <div className="text-base leading-6 font-semibold">Card 16/600 — மூத்த குடிமக்கள் நலன்</div>
                    <div className="text-sm leading-5 font-normal">Body 14/400 — Humanist Open Sans with tabular numerals: 123,456.78</div>
                    <div className="text-xs leading-4 font-semibold text-text-secondary">Label 12/600 — Secondary text form label</div>
                    <div className="text-xs leading-4 font-normal text-text-secondary">Footnote 12/400 — Timestamp and secondary notes</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Buttons Matrix */}
            <Card title="2. Controls: Buttons (40px Height, 8px Radius, Horizon Blue #0070F2)">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" icon={<Plus className="w-4 h-4" strokeWidth={1.5} />}>
                    Primary Action
                  </Button>
                  <Button variant="outline" icon={<Filter className="w-4 h-4" strokeWidth={1.5} />}>
                    Default / Outline
                  </Button>
                  <Button variant="ghost">
                    Ghost / Tertiary
                  </Button>
                  <Button variant="destructive">
                    Destructive Action
                  </Button>
                  <Button variant="outline" size="icon" icon={<MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />} />
                  <Button variant="outline" size="sm">
                    Small Control
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
                  <span className="text-xs text-text-secondary font-medium mr-2">States:</span>
                  <Button variant="primary" isLoading>
                    Loading State
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled Primary
                  </Button>
                  <Button variant="outline" disabled>
                    Disabled Default
                  </Button>
                  <Button variant="ghost" disabled>
                    Disabled Ghost
                  </Button>
                </div>
              </div>
            </Card>

            {/* Form Inputs */}
            <Card title="3. Form Inputs and Primitives (Single Column, 40px Height, Labels Above)">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Senior full name"
                  placeholder="e.g. Savitri Devi Sharma"
                  defaultValue="Savitri Devi Sharma"
                  required
                />
                <Input
                  label="Contact mobile"
                  placeholder="+91 98450 12345"
                  helperText="Primary WhatsApp alert number"
                  leftIcon={<Phone className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />}
                />
                <Input
                  label="ABHA health ID"
                  placeholder="14-digit ABHA Number"
                  error="Invalid ABHA format. Must be 14 numeric digits."
                />

                <Select
                  label="Chapter hub"
                  options={[
                    { value: 'hubballi', label: 'Hubballi Central' },
                    { value: 'dharwad', label: 'Dharwad Urban' },
                    { value: 'belagavi', label: 'Belagavi North' },
                  ]}
                  defaultValue="hubballi"
                />

                <MultiSelect
                  label="Preferred languages"
                  options={[
                    { value: 'hi', label: 'Hindi (हिंदी)' },
                    { value: 'mr', label: 'Marathi (मराठी)' },
                    { value: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
                    { value: 'en', label: 'English' },
                  ]}
                  value={multiVal}
                  onChange={setMultiVal}
                />

                <DatePicker
                  label="Birth date"
                  defaultValue="1948-06-15"
                />

                <TimePicker
                  label="Morning call time"
                  defaultValue="08:30"
                />

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Notification options</label>
                  <div className="flex items-center gap-4 pt-1">
                    <Switch
                      checked={switchVal}
                      onCheckedChange={setSwitchVal}
                      label="WhatsApp alerts"
                    />
                    <Checkbox
                      checked={checkboxVal}
                      onCheckedChange={setCheckboxVal}
                      label="SMS fallback"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Notification mode</label>
                  <RadioGroup
                    value={radioVal}
                    onValueChange={setRadioVal}
                    options={[
                      { value: 'phone', label: 'Voice wellness call' },
                      { value: 'whatsapp', label: 'WhatsApp interactive prompt' },
                    ]}
                  />
                </div>
              </div>
            </Card>

            {/* Status Indicators, Chips and Fiori Message Strips */}
            <Card title="4. Status Indicators, Chips and Message Strips">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-secondary mb-2">
                    AWS Cloudscape Status Indicators (Icon + Text, 1.5 Stroke, 20px)
                  </h4>
                  <div className="flex flex-wrap items-center gap-6">
                    <StatusIndicator status="positive" label="Delivered / Active" />
                    <StatusIndicator status="critical" label="Needs Call / Pending" />
                    <StatusIndicator status="negative" label="Unacknowledged / Error" />
                    <StatusIndicator status="neutral" label="Queued / Scheduled" />
                    <StatusIndicator status="informative" label="Draft / In Review" />
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <h4 className="text-xs font-semibold text-text-secondary mb-2">
                    Status Chips (Tinted fills, solid red strictly for open SOS count)
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusChip label="Role: Care Coordinator" variant="accent" />
                    <StatusChip label="Chapter: Hubballi (42)" variant="neutral" />
                    <StatusChip label="Completed (120)" variant="positive" />
                    <StatusChip label="Attention Needed (8)" variant="critical" />
                    <StatusChip label="Critical SOS (1 open)" variant="critical-sos" />
                  </div>
                </div>

                <div className="pt-2 border-t border-border space-y-2">
                  <h4 className="text-xs font-semibold text-text-secondary mb-2">
                    Fiori Message Strips
                  </h4>
                  <MessageStrip
                    type="informative"
                    title="Phase 2 ABHA Milestone"
                    message="Digital ABHA card generation is active in staging for Hubballi Central pilot cohort."
                    actionText="View Documentation"
                    onAction={() => alert('Opening ABHA pilot specs')}
                    dismissible
                  />
                  <MessageStrip
                    type="critical"
                    title="Consent Verification Required"
                    message="Next-of-kin SMS consent pending for 3 newly registered seniors."
                    actionText="Resolve in Funnel"
                    onAction={() => alert('Navigating to funnel')}
                  />
                </div>
              </div>
            </Card>

            {/* Salesforce Lightning Status Path */}
            <Card title="5. Status Path (Salesforce Lightning Pattern)">
              <StatusPath
                steps={[
                  { id: 'intake', label: '1. Intake and vitals', guidance: 'Collect senior basic details and emergency contact numbers.' },
                  { id: 'consent', label: '2. Consent verification', guidance: 'Collect DPDP-compliant verifiable consent from senior or authorized legal guardian.' },
                  { id: 'triage', label: '3. Clinical triage', guidance: 'Nurse assigns personalized reminder schedule and vital alert thresholds.' },
                  { id: 'active', label: '4. Active in ecosystem', guidance: 'Senior is enrolled in automated wellness loops and Ekta Hub activities.' },
                ]}
                currentStepId={pathStep}
                onStepSelect={setPathStep}
              />
            </Card>

            {/* KPI Tiles (At most 4 tiles rule) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiTile
                title="Registered seniors"
                value="1,248"
                unit="/ 1,500"
                statusLine="Target cohort progress"
                status="positive"
              />
              <KpiTile
                title="SOS median response"
                value="1.4"
                unit="min"
                statusLine="SLA < 2.0 min met"
                status="positive"
              />
              <KpiTile
                title="Medication adherence"
                value="91.6%"
                statusLine="Target > 75.0% met"
                status="positive"
              />
              <KpiTile
                title="Open anomaly flags"
                value="0"
                statusLine="No open emergencies"
                status="positive"
              />
            </div>

            {/* Recharts Enterprise Restyle */}
            <Card
              title="6. Data Visualization (Tokens: Horizon Blue and Categorical Set, 1px Horizontal Gridlines)"
              subtitle="Daily preventive health reminder completion vs missed prompts"
            >
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#E8ECEF" strokeDasharray="0" vertical={false} />
                    <XAxis dataKey="day" stroke="#556B82" fontSize={12} tickLine={false} />
                    <YAxis stroke="#556B82" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D5DADD',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="completed" fill="#0070F2" name="Completed Prompts" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="missed" fill="#E76500" name="Missed Prompts" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-text-secondary mt-3 pt-2 border-t border-border flex items-center justify-between">
                <span>Daily automated reminder outcomes recorded through WhatsApp Interactive and SMS gateways.</span>
                <span className="tabular-nums">Updated 2m ago</span>
              </div>
            </Card>

            {/* Data Table */}
            <div className="space-y-0">
              <FilterBar
                searchQuery=""
                onSearchChange={() => {}}
                searchPlaceholder="Search pilot cohort seniors..."
                filters={[
                  {
                    id: 'chapter',
                    label: 'Chapter',
                    value: 'ALL',
                    options: [
                      { value: 'hubballi', label: 'Hubballi Central' },
                      { value: 'dharwad', label: 'Dharwad Urban' },
                    ],
                    onChange: () => {},
                  },
                ]}
              />

              <div className="border border-border rounded-card bg-surface overflow-hidden">
                <CommandBar
                  primaryAction={{
                    id: 'new-senior',
                    label: 'Onboard Senior',
                    onClick: () => setIsDialogOpen(true),
                  }}
                  onExport={() => alert('Exporting data as CSV')}
                  onColumnSettings={() => alert('Configuring visible table columns')}
                  onRefresh={() => alert('Refreshed')}
                />

                <DataTable
                  columns={tableColumns}
                  data={sampleTableData}
                  keyExtractor={(item) => item.id}
                  selectable
                  selectedIds={tableSelected}
                  onSelectChange={setTableSelected}
                  onRowClick={() => setIsDrawerOpen(true)}
                  bulkActions={
                    <Button variant="ghost" size="sm" onClick={() => alert('Bulk assigning responder')}>
                      Assign Volunteer
                    </Button>
                  }
                  rowActions={() => (
                    <Button
                      variant="ghost"
                      size="icon"
                      icon={<MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />}
                      onClick={() => setIsDrawerOpen(true)}
                    />
                  )}
                />
              </div>
            </div>

            {/* Dialogs and Drawers */}
            <Card title="7. Overlays, Dialogs and Quick-View Drawer">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                  Open Form Dialog (640px)
                </Button>
                <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
                  Open Destructive Dialog (480px)
                </Button>
                <Button variant="primary" onClick={() => setIsDrawerOpen(true)}>
                  Open Quick-View Drawer (480px)
                </Button>
              </div>

              {/* Standard Form Dialog */}
              <Dialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title="Quick Senior Registration"
                description="Initiate assisted onboarding for a senior citizen residing in Karnataka pilot Ekta Hubs."
                size="md"
              >
                <div className="space-y-3 py-2">
                  <Input label="Senior legal name" placeholder="e.g. Anand Murthy" required />
                  <Input label="Emergency contact phone" placeholder="+91 98450 12345" required />
                  <Select
                    label="Assign Ekta Hub chapter"
                    options={[
                      { value: 'hubballi', label: 'Hubballi Central Ekta Hub' },
                      { value: 'dharwad', label: 'Dharwad Urban Ekta Hub' },
                    ]}
                  />
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setIsDialogOpen(false)}>
                      Save Senior Record
                    </Button>
                  </div>
                </div>
              </Dialog>

              {/* Destructive Confirm Dialog */}
              <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="De-escalate Emergency SOS Case"
                description="Are you certain you want to close SOS Case #SOS-2026-0814? This action logs responder verification to the permanent audit registry."
                confirmLabel="Confirm De-escalation"
                isDestructive
                requireMatchText="RESOLVE"
                onConfirm={() => setIsConfirmOpen(false)}
              />

              {/* Quick-View Inspection Drawer */}
              <Drawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title="Senior Profile Quick View"
                subtitle="Savitri Devi Sharma · ID: SEN-HUB-0042"
                footer={
                  <>
                    <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={() => alert('Navigating to full Object Page')}>
                      Open Full Profile
                    </Button>
                  </>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-surface-subtle border border-border rounded-card">
                    <Avatar name="Savitri Devi Sharma" size="lg" />
                    <div>
                      <div className="font-semibold text-text">Savitri Devi Sharma (76 yrs)</div>
                      <div className="text-xs text-text-secondary">Hubballi Central · Ekta Hub Member</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-text-secondary">
                      Key facts
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs bg-surface p-3 border border-border rounded-card">
                      <div>
                        <span className="text-text-secondary block">Primary Phone</span>
                        <span className="tabular-nums text-text font-semibold">••••••2345 (Masked)</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block">Living Arrangement</span>
                        <span className="text-text">Lives Alone</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block">Medical Conditions</span>
                        <span className="text-text">Hypertension, Type II</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block">Vayomitra Volunteer</span>
                        <span className="text-text">Ramesh Kulkarni</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-text-secondary">
                      Recent activity timeline
                    </div>
                    <div className="border-l border-border pl-3 space-y-3 text-xs">
                      <div>
                        <div className="font-semibold text-text">Morning Blood Pressure Check-in</div>
                        <div className="text-text-secondary">130/85 mmHg · 08:35 AM (WhatsApp)</div>
                      </div>
                      <div>
                        <div className="font-semibold text-text">Ekta Hub Yoga Attendance</div>
                        <div className="text-text-secondary">Present · Yesterday 10:00 AM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Drawer>
            </Card>

            {/* Feedback States Preview */}
            <Card title="8. Feedback States (Empty State, Loading Skeleton)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-card bg-surface">
                  <EmptyState
                    title="No unresolved health flags"
                    description="All clinical biomarker alerts for this chapter have been addressed by the assigned medical officer."
                    actionLabel="View Historical Log"
                    onAction={() => alert('Viewing history')}
                  />
                </div>
                <div className="border border-border rounded-card bg-surface p-4 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-text-secondary mb-2">Loading Skeleton (1.4s Soft Shimmer)</span>
                  <LoadingSkeleton rows={4} />
                </div>
              </div>
            </Card>
          </>
        ) : (
          /* Floorplan Skeletons */
          <div className="space-y-6">
            <Card title="Floorplan 1: List Report (Fiori Style)">
              <p className="text-sm text-text-secondary mb-3">
                Used in Seniors Directory, SOS History, Health Logs, Audit Logs, and User Management.
              </p>
              <div className="border border-border rounded-card p-4 bg-canvas space-y-3">
                <div className="h-10 bg-surface border border-border rounded-control px-3 flex items-center justify-between text-xs text-text-secondary">
                  <span>Page Header (Dynamic collapsing title + actions)</span>
                  <div className="flex gap-2">
                    <span className="h-6 w-16 bg-surface-subtle border border-border rounded-chip" />
                    <span className="h-6 w-20 bg-accent rounded-chip" />
                  </div>
                </div>
                <div className="h-10 bg-surface border border-border rounded-control px-3 flex items-center text-xs text-text-secondary">
                  <span>Filter Bar (Search + Dropdowns + Saved Views)</span>
                </div>
                <div className="h-8 bg-surface border border-border rounded-control px-3 flex items-center text-xs text-text-secondary">
                  <span>Command Bar (Create · Export · Bulk actions · Columns · Refresh)</span>
                </div>
                <div className="h-32 bg-surface border border-border rounded-control px-3 flex items-center justify-center text-xs text-text-secondary">
                  <span>Data Table (Sticky header, 48px rows, hairline dividers, tabular numbers)</span>
                </div>
              </div>
            </Card>

            <Card title="Floorplan 2: Board + Split Panel (AWS Cloudscape Style)">
              <p className="text-sm text-text-secondary mb-3">
                Used in Live Emergency SOS Board (`/sos`) for rapid triage without context switching.
              </p>
              <div className="border border-border rounded-card p-4 bg-canvas flex gap-4 h-64">
                <div className="flex-1 bg-surface border border-border rounded-control p-3 flex flex-col justify-between text-xs text-text-secondary">
                  <span>Active Emergency SOS Master Table (Full Width)</span>
                  <span className="text-[11px] text-text-tertiary">Select row to inspect in right split panel</span>
                </div>
                <div className="w-[320px] bg-surface border border-border rounded-control p-3 flex flex-col justify-between text-xs text-text-secondary">
                  <div>
                    <span className="font-semibold text-text block mb-1">Right Split Panel (440px)</span>
                    <span>Live case summary, responder dispatch actions, and realtime telemetry.</span>
                  </div>
                  <Button variant="primary" size="sm">Open Full Case Page</Button>
                </div>
              </div>
            </Card>

            <Card title="Floorplan 3: Object Page + Highlights Panel (Fiori Pattern)">
              <p className="text-sm text-text-secondary mb-3">
                Used in Senior Citizen Profile (`/seniors/:id`) and SOS Case Detail (`/sos/:id`).
              </p>
              <div className="border border-border rounded-card p-4 bg-canvas space-y-3">
                <div className="bg-surface border border-border rounded-control p-4 flex items-center justify-between text-xs text-text-secondary">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-card bg-surface-subtle text-text flex items-center justify-center font-semibold border border-border">SD</div>
                    <div>
                      <div className="font-semibold text-text text-sm">Highlights Panel: Senior Identity & Key Facts</div>
                      <div>Hubballi Central · Age 76 · Status: Active</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="primary" size="sm">Trigger Call</Button>
                  </div>
                </div>
                <div className="h-8 bg-surface border-b border-border flex items-center gap-6 px-4 text-xs font-semibold text-text">
                  <span className="border-b-2 border-accent text-accent py-2">Clinical Vitals</span>
                  <span className="text-text-secondary py-2">Reminder Schedules</span>
                  <span className="text-text-secondary py-2">Attendance History</span>
                  <span className="text-text-secondary py-2">Emergency Contacts</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-surface border border-border rounded-control p-4 text-xs text-text-secondary h-32">
                    Tab Section Content
                  </div>
                  <div className="w-64 bg-surface border border-border rounded-control p-4 text-xs text-text-secondary h-32">
                    Right Action Rail & Timeline
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Floorplan 4: Assisted Onboarding Wizard">
              <p className="text-sm text-text-secondary mb-3">
                Used in Assisted Senior Citizen Onboarding (`/onboarding/new`).
              </p>
              <div className="border border-border rounded-card p-4 bg-canvas space-y-4">
                <div className="bg-surface border border-border rounded-control p-3 flex items-center justify-around text-xs font-semibold text-text">
                  <span className="text-positive">1. Demographics</span>
                  <span className="text-accent border border-accent px-2 py-0.5 rounded-chip">2. Health & Vitals</span>
                  <span className="text-text-disabled">3. Contacts</span>
                  <span className="text-text-disabled">4. Review</span>
                </div>
                <div className="bg-surface border border-border rounded-control p-6 text-xs text-text-secondary h-32 flex items-center justify-center">
                  Form Section for Active Wizard Step with Inline Validation
                </div>
                <div className="bg-surface border border-border rounded-control p-3 flex items-center justify-between text-xs text-text-secondary">
                  <span>Saved 2s ago (Autosave)</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Back</Button>
                    <Button variant="primary" size="sm">Save & Next</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
