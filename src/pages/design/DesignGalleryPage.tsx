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
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip';
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { PopoverRoot, PopoverTrigger, PopoverContent } from '@/components/ui/Popover';
import { StatusPath } from '@/components/ui/StatusPath';
import { Avatar } from '@/components/ui/Avatar';
import { DataTable } from '@/components/data/DataTable';
import { CommandBar } from '@/components/layout/CommandBar';
import { FilterBar } from '@/components/data/FilterBar';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Forbidden403 } from '@/components/feedback/Forbidden403';
import {
  Add16Regular,
  Search16Regular,
  Filter16Regular,
  MoreHorizontal16Regular,
  Person16Regular,
  Call16Regular,
  AlertUrgent16Filled,
  Clock16Regular,
  CheckmarkCircle16Regular,
  Info16Regular,
} from '@fluentui/react-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export const DesignGalleryPage: React.FC = () => {
  // Interactive state demos
  const [activeTab, setActiveTab] = useState<'components' | 'floorplans'>('components');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState('phone');
  const [switchVal, setSwitchVal] = useState(true);
  const [segmentVal, setSegmentVal] = useState('daily');
  const [multiVal, setMultiVal] = useState(['hi', 'mr']);
  const [pathStep, setPathStep] = useState('triage');
  const [tableSelected, setTableSelected] = useState<string[]>(['s-1']);

  // Sample data for Table
  const sampleTableData = [
    { id: 's-1', name: 'Savitri Devi Sharma', age: 76, chapter: 'Hubballi Central', status: 'positive', statusLabel: 'Active', adherence: 94 },
    { id: 's-2', name: 'Raghunath V. Joshi', age: 82, chapter: 'Dharwad Urban', status: 'critical', statusLabel: 'Needs Call', adherence: 68 },
    { id: 's-3', name: 'Anasuya K. Patil', age: 71, chapter: 'Belagavi North', status: 'positive', statusLabel: 'Active', adherence: 100 },
    { id: 's-4', name: 'Gopalrao S. Deshpande', age: 79, chapter: 'Hubballi South', status: 'neutral', statusLabel: 'Scheduled', adherence: 82 },
    { id: 's-5', name: 'Kamala Narayan Rao', age: 84, chapter: 'Dharwad Rural', status: 'negative', statusLabel: 'Unacknowledged', adherence: 45 },
  ];

  const tableColumns = [
    { key: 'name', header: 'Senior Name', render: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar name={item.name} size="sm" />
        <span className="font-medium text-text">{item.name}</span>
      </div>
    )},
    { key: 'age', header: 'Age', align: 'right' as const },
    { key: 'chapter', header: 'Chapter / Ekta Hub' },
    { key: 'status', header: 'Care Status', render: (item: any) => (
      <StatusIndicator type={item.status} label={item.statusLabel} />
    )},
    { key: 'adherence', header: 'Adherence %', align: 'right' as const, render: (item: any) => (
      <span className="tabular-nums font-medium">{item.adherence}%</span>
    )},
  ];

  // Sample data for Recharts
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
      {/* Top Banner Flashbar Preview */}
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

      {/* Main Page Header */}
      <div className="bg-surface border-b border-border px-8 py-5">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs text-text-secondary font-medium mb-1">
              Design System · Verification & Component Gallery
            </div>
            <h1 className="text-page-title text-text">
              Vayoshrestha Design Gallery
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Enterprise UI/UX specification compliant with SAP Fiori, AWS Cloudscape, Microsoft Fluent 2, and Salesforce Lightning.
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
            {/* 1. Design Tokens & Typography Specimen */}
            <Card title="1. Foundations: Design Tokens & Typography Scale">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-text mb-3">Color Token Surfaces & Palette</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded-control bg-canvas border border-border">
                      <div className="font-medium text-text">Canvas</div>
                      <div className="text-text-secondary font-mono text-[11px]">#F5F7FA</div>
                    </div>
                    <div className="p-2 rounded-control bg-surface border border-border">
                      <div className="font-medium text-text">Surface</div>
                      <div className="text-text-secondary font-mono text-[11px]">#FFFFFF</div>
                    </div>
                    <div className="p-2 rounded-control bg-surface-subtle border border-border-subtle">
                      <div className="font-medium text-text">Subtle</div>
                      <div className="text-text-secondary font-mono text-[11px]">#F8FAFC</div>
                    </div>
                    <div className="p-2 rounded-control bg-accent text-white">
                      <div className="font-medium">Accent</div>
                      <div className="text-white/80 font-mono text-[11px]">#0064D9</div>
                    </div>
                    <div className="p-2 rounded-control bg-accent-tint text-accent border border-accent/20">
                      <div className="font-medium">Accent Tint</div>
                      <div className="text-accent/80 font-mono text-[11px]">#EBF3FD</div>
                    </div>
                    <div className="p-2 rounded-control bg-positive-tint text-positive border border-positive/20">
                      <div className="font-medium">Positive</div>
                      <div className="text-positive/80 font-mono text-[11px]">#107E3E</div>
                    </div>
                    <div className="p-2 rounded-control bg-critical-tint text-critical border border-critical/20">
                      <div className="font-medium">Critical</div>
                      <div className="text-critical/80 font-mono text-[11px]">#B25A00</div>
                    </div>
                    <div className="p-2 rounded-control bg-negative-tint text-negative border border-negative/20">
                      <div className="font-medium">Negative</div>
                      <div className="text-negative/80 font-mono text-[11px]">#C4161C</div>
                    </div>
                    <div className="p-2 rounded-control bg-neutral-tint text-neutral border border-border-subtle">
                      <div className="font-medium">Neutral</div>
                      <div className="text-neutral/80 font-mono text-[11px]">#556B82</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-text mb-3">Typography Scale & Multilingual Stack</h4>
                  <div className="space-y-2 text-text">
                    <div className="text-page-title">Page Title (24/32 600) — वयोश्रेष्ठ वयो विकास</div>
                    <div className="text-section-title">Section Title (18/24 600) — ಹಿರಿಯರ ಆರೈಕೆ</div>
                    <div className="text-card-title">Card Title (16/24 600) — மூத்த குடிமக்கள் நலன்</div>
                    <div className="text-body">Body & Table (14/20 400) — Crisp humanist sans-serif with tabular numerals: 123,456.78</div>
                    <div className="text-label">Form Label (12/16 500 secondary)</div>
                    <div className="text-caption text-text-secondary">Caption & Footnote (12/16 400)</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 2. Buttons Matrix */}
            <Card title="2. Buttons (32px high, 6px radius, 14px/500, Max One Primary per Area)">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" icon={<Add16Regular />}>
                    Primary Action
                  </Button>
                  <Button variant="default" icon={<Filter16Regular />}>
                    Default / Secondary
                  </Button>
                  <Button variant="ghost">
                    Ghost / Tertiary
                  </Button>
                  <Button variant="destructive">
                    Destructive Action
                  </Button>
                  <Button variant="destructive-confirm">
                    Destructive Confirm
                  </Button>
                  <Button variant="default" size="icon" icon={<MoreHorizontal16Regular />} />
                  <Button variant="default" size="sm">
                    Small 28px
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border-subtle">
                  <span className="text-xs text-text-secondary font-medium mr-2">States:</span>
                  <Button variant="primary" isLoading>
                    Loading State
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled Primary
                  </Button>
                  <Button variant="default" disabled>
                    Disabled Default
                  </Button>
                  <Button variant="ghost" disabled>
                    Disabled Ghost
                  </Button>
                </div>
              </div>
            </Card>

            {/* 3. Form Controls & Inputs */}
            <Card title="3. Form Inputs & Primitives (Radix Primitives, 32px Standard Height)">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Senior Full Name"
                  placeholder="e.g. Savitri Devi Sharma"
                  defaultValue="Savitri Devi Sharma"
                  required
                />
                <Input
                  label="Contact Mobile"
                  placeholder="+91 98450 12345"
                  helperText="Primary WhatsApp alert number"
                  leftIcon={<Call16Regular />}
                />
                <Input
                  label="ABHA Health ID"
                  placeholder="14-digit ABHA Number"
                  error="Invalid ABHA format. Must be 14 numeric digits."
                />

                <Select
                  label="Ekta Hub / Chapter"
                  options={[
                    { value: 'hubballi', label: 'Hubballi Central' },
                    { value: 'dharwad', label: 'Dharwad Urban' },
                    { value: 'belagavi', label: 'Belagavi North' },
                  ]}
                  defaultValue="hubballi"
                />

                <MultiSelect
                  label="Preferred Languages"
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
                  label="Birth Date"
                  defaultValue="1948-06-15"
                />

                <TimePicker
                  label="Morning Call Time"
                  defaultValue="08:30"
                />

                <div className="flex flex-col gap-2">
                  <label className="text-label">Radix Switches & Radios</label>
                  <div className="flex items-center gap-4 pt-1">
                    <Switch
                      checked={switchVal}
                      onCheckedChange={setSwitchVal}
                      label="WhatsApp Bot Alerts"
                    />
                    <Checkbox
                      checked={checkboxVal}
                      onCheckedChange={setCheckboxVal}
                      label="SMS Fallback"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-label">Notification Mode (Radio Group)</label>
                  <RadioGroup
                    value={radioVal}
                    onValueChange={setRadioVal}
                    options={[
                      { value: 'phone', label: 'Voice Wellness Call' },
                      { value: 'whatsapp', label: 'WhatsApp Interactive Prompt' },
                    ]}
                  />
                </div>
              </div>
            </Card>

            {/* 4. Status Indicators, Chips & Fiori Message Strips */}
            <Card title="4. Status Indicators, Chips & Message Strips">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    AWS/Fiori Status Indicators (16px Icon + Text)
                  </h4>
                  <div className="flex flex-wrap items-center gap-6">
                    <StatusIndicator type="positive" label="Delivered / Active" />
                    <StatusIndicator type="critical" label="Needs Call / Pending" />
                    <StatusIndicator type="negative" label="Unacknowledged / Error" />
                    <StatusIndicator type="neutral" label="Queued / Scheduled" />
                    <StatusIndicator type="information" label="Draft / In Review" />
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle">
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Status Chips (Reserved for counts, roles, filters, and critical SOS badge)
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusChip label="Role: Care Coordinator" variant="accent" />
                    <StatusChip label="Chapter: Hubballi (42)" variant="neutral" />
                    <StatusChip label="Completed (120)" variant="positive" />
                    <StatusChip label="Attention Needed (8)" variant="critical" />
                    <StatusChip label="CRITICAL SOS (1 OPEN)" variant="critical-sos" />
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle space-y-2">
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Fiori Message Strips
                  </h4>
                  <MessageStrip
                    type="information"
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

            {/* 5. Salesforce Lightning Status Path */}
            <Card title="5. Status Path (Salesforce Lightning Pattern)">
              <StatusPath
                steps={[
                  { id: 'intake', label: '1. Intake & Vitals', guidance: 'Collect senior basic details and emergency contact numbers.' },
                  { id: 'consent', label: '2. Consent Verification', guidance: 'Collect DPDP-compliant verifiable consent from senior or authorized legal guardian.' },
                  { id: 'triage', label: '3. Clinical Triage', guidance: 'Nurse assigns personalized reminder schedule and vital alert thresholds.' },
                  { id: 'active', label: '4. Active In Ecosystem', guidance: 'Senior is enrolled in automated wellness loops and Ekta Hub activities.' },
                ]}
                currentStepId={pathStep}
                onStepSelect={setPathStep}
              />
            </Card>

            {/* 6. KPI Tiles & Recharts Visualizations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KpiTile
                label="Pilot Seniors Enrolled"
                value="1,248"
                unitOrTarget="of 1,500 Target"
                delta={{ value: 12.4, trend: 'up', label: 'vs last week' }}
                definition="Total active verified senior citizens enrolled across pilot Ekta Hub chapters."
                sparklineData={[15, 22, 28, 35, 42, 50, 65]}
              />
              <KpiTile
                label="SOS Response Median"
                value="1m 42s"
                unitOrTarget="SLA: < 3m 00s"
                delta={{ value: 8.5, trend: 'down', label: 'faster response' }}
                definition="Time elapsed from senior emergency trigger to responder acknowledgement."
                sparklineData={[50, 45, 42, 38, 35, 30, 26]}
              />
              <KpiTile
                label="Preventive Health Adherence"
                value="91.6%"
                unitOrTarget="Target: > 85%"
                delta={{ value: 3.2, trend: 'up', label: 'vs target' }}
                definition="Percentage of daily medication and hydration check-in prompts acknowledged."
                sparklineData={[30, 32, 35, 38, 40, 42, 45]}
              />
              <KpiTile
                label="Volunteer Ratio"
                value="1 : 12"
                unitOrTarget="Cap: 1 : 15"
                delta={{ value: 0, trend: 'neutral', label: 'within safe range' }}
                definition="Vayomitra volunteers to enrolled vulnerable seniors in active cohort."
              />
            </div>

            {/* 7. Recharts Enterprise Restyle */}
            <Card
              title="7. Recharts Enterprise Restyling (Tokens: --chart-1 to --chart-6, 1px Horizontal Gridlines)"
              subtitle="Daily Preventive Health Reminder Completion vs Missed Prompts"
            >
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#EDF0F3" strokeDasharray="0" vertical={false} />
                    <XAxis dataKey="day" stroke="#556B82" fontSize={12} tickLine={false} />
                    <YAxis stroke="#556B82" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #DDE2E8',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(16, 24, 40, 0.10)',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="completed" fill="#0064D9" name="Completed Prompts" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="missed" fill="#E9730C" name="Missed Prompts" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-caption text-text-secondary mt-3 pt-2 border-t border-border-subtle flex items-center justify-between">
                <span>Chart definition: Daily automated reminder outcomes recorded through WhatsApp Interactive and SMS gateways.</span>
                <span className="font-mono text-xs">Updated 2m ago</span>
              </div>
            </Card>

            {/* 8. Data Table with Azure Command Bar & Filter Bar */}
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

              <div className="border border-border rounded-card bg-surface overflow-hidden shadow-xs">
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
                  onRowClick={(item) => setIsDrawerOpen(true)}
                  bulkActions={
                    <Button variant="ghost" size="sm" onClick={() => alert('Bulk assigning responder')}>
                      Assign Volunteer
                    </Button>
                  }
                  rowActions={(item) => (
                    <Button
                      variant="ghost"
                      size="icon"
                      icon={<MoreHorizontal16Regular />}
                      onClick={() => setIsDrawerOpen(true)}
                    />
                  )}
                />
              </div>
            </div>

            {/* 9. Interactive Dialogs & Drawers */}
            <Card title="9. Overlays, Dialogs & Quick-View Drawer">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default" onClick={() => setIsDialogOpen(true)}>
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
                  <Input label="Senior Legal Name" placeholder="e.g. Anand Murthy" required />
                  <Input label="Emergency Contact Phone" placeholder="+91 98450 12345" required />
                  <Select
                    label="Assign Ekta Hub Chapter"
                    options={[
                      { value: 'hubballi', label: 'Hubballi Central Ekta Hub' },
                      { value: 'dharwad', label: 'Dharwad Urban Ekta Hub' },
                    ]}
                  />
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-border-subtle">
                    <Button variant="default" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setIsDialogOpen(false)}>
                      Save Senior Record
                    </Button>
                  </div>
                </div>
              </Dialog>

              {/* Destructive Confirm Dialog with Type-to-Confirm */}
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

              {/* Quick-View Inspection Drawer (480px) */}
              <Drawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title="Senior Profile Quick View"
                subtitle="Savitri Devi Sharma · ID: SEN-HUB-0042"
                footer={
                  <>
                    <Button variant="default" onClick={() => setIsDrawerOpen(false)}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={() => alert('Navigating to full Object Page')}>
                      Open Full Profile
                    </Button>
                  </>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-surface-subtle border border-border-subtle rounded-control">
                    <Avatar name="Savitri Devi Sharma" size="lg" />
                    <div>
                      <div className="font-semibold text-text">Savitri Devi Sharma (76 yrs)</div>
                      <div className="text-xs text-text-secondary">Hubballi Central · Ekta Hub Member</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Key Facts
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm bg-surface p-3 border border-border-subtle rounded-control">
                      <div>
                        <span className="text-label block">Primary Phone</span>
                        <span className="font-mono text-text">••••••2345 (Masked)</span>
                      </div>
                      <div>
                        <span className="text-label block">Living Arrangement</span>
                        <span className="text-text">Lives Alone</span>
                      </div>
                      <div>
                        <span className="text-label block">Medical Conditions</span>
                        <span className="text-text">Hypertension, Type II</span>
                      </div>
                      <div>
                        <span className="text-label block">Vayomitra Volunteer</span>
                        <span className="text-text">Ramesh Kulkarni</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Recent Activity Timeline
                    </div>
                    <div className="border-l border-border pl-3 space-y-3 text-xs">
                      <div>
                        <div className="font-medium text-text">Morning Blood Pressure Check-in</div>
                        <div className="text-text-secondary">130/85 mmHg · 08:35 AM (WhatsApp)</div>
                      </div>
                      <div>
                        <div className="font-medium text-text">Ekta Hub Yoga Attendance</div>
                        <div className="text-text-secondary">Present · Yesterday 10:00 AM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Drawer>
            </Card>

            {/* 10. Feedback States Preview */}
            <Card title="10. Feedback States (Empty, Loading Skeleton, Error, 403)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border-subtle rounded-control bg-surface">
                  <EmptyState
                    title="No Unresolved Health Flags"
                    description="All clinical biomarker alerts for this chapter have been addressed by the assigned medical officer."
                    actionLabel="View Historical Log"
                    onAction={() => alert('Viewing history')}
                  />
                </div>
                <div className="border border-border-subtle rounded-control bg-surface p-4 flex flex-col justify-center">
                  <span className="text-label mb-2">Loading Skeleton (1.4s Soft Shimmer)</span>
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
              <div className="border border-border rounded-control p-4 bg-canvas space-y-3">
                <div className="h-10 bg-surface border border-border rounded-control px-3 flex items-center justify-between text-xs text-text-secondary">
                  <span>Page Header (Dynamic collapsing title + actions)</span>
                  <div className="flex gap-2">
                    <span className="h-6 w-16 bg-surface-subtle border rounded" />
                    <span className="h-6 w-20 bg-accent rounded" />
                  </div>
                </div>
                <div className="h-10 bg-surface border border-border rounded-control px-3 flex items-center text-xs text-text-secondary">
                  <span>Filter Bar (Search + Dropdowns + Saved Views Dropdown)</span>
                </div>
                <div className="h-8 bg-surface border border-border rounded-control px-3 flex items-center text-xs text-text-secondary">
                  <span>Command Bar (Create · Export · Bulk actions · Columns · Refresh)</span>
                </div>
                <div className="h-32 bg-surface border border-border rounded-control px-3 flex items-center justify-center text-xs text-text-secondary">
                  <span>Data Table (Sticky header, hairline dividers, tabular numbers)</span>
                </div>
              </div>
            </Card>

            <Card title="Floorplan 2: Board + Split Panel (AWS Cloudscape Style)">
              <p className="text-sm text-text-secondary mb-3">
                Used in Live Emergency SOS Board (`/sos`) for rapid triage without context switching.
              </p>
              <div className="border border-border rounded-control p-4 bg-canvas flex gap-4 h-64">
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

            <Card title="Floorplan 3: Object Page + Highlights Panel (Fiori + Salesforce Lightning)">
              <p className="text-sm text-text-secondary mb-3">
                Used in Senior Citizen Profile (`/seniors/:id`) and SOS Case Detail (`/sos/:id`).
              </p>
              <div className="border border-border rounded-control p-4 bg-canvas space-y-3">
                <div className="bg-surface border border-border rounded-control p-4 flex items-center justify-between text-xs text-text-secondary">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-tint text-text flex items-center justify-center font-semibold">SD</div>
                    <div>
                      <div className="font-semibold text-text text-sm">Highlights Panel: Senior Identity & Key Facts</div>
                      <div>Hubballi Central · Age 76 · Status: Active</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">Edit</Button>
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
              <div className="border border-border rounded-control p-4 bg-canvas space-y-4">
                <div className="bg-surface border border-border rounded-control p-3 flex items-center justify-around text-xs font-medium text-text">
                  <span className="text-positive font-semibold">✓ 1. Demographics</span>
                  <span className="text-accent font-semibold ring-1 ring-accent px-2 py-0.5 rounded">2. Health & Vitals</span>
                  <span className="text-text-disabled">3. Contacts</span>
                  <span className="text-text-disabled">4. Review</span>
                </div>
                <div className="bg-surface border border-border rounded-control p-6 text-xs text-text-secondary h-32 flex items-center justify-center">
                  Form Section for Active Wizard Step with Inline Validation
                </div>
                <div className="bg-surface border border-border rounded-control p-3 flex items-center justify-between text-xs text-text-secondary">
                  <span>Saved 2s ago (Autosave)</span>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">Back</Button>
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
