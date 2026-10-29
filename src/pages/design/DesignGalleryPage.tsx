import React, { useState } from 'react';
import {
  Container,
  MetricTile,
  KeyValueList,
  StatusIndicator,
  DataTable,
  FilterBar,
  CloudscapeChart,
  DynamicPageHeader,
  MessageStrip,
  Flashbar,
  ConfirmDialog,
} from '@/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';
import { RadioGroup } from '@/components/ui/RadioGroup';
import {
  Plus,
  Filter,
  MoreHorizontal,
  Phone,
  Layers,
  LayoutTemplate,
} from 'lucide-react';

export const DesignGalleryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'floorplans'>('components');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState('phone');
  const [switchVal, setSwitchVal] = useState(true);
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
      header: 'Senior Name',
      render: (item: any) => (
        <span className="font-semibold text-text">{item.name}</span>
      ),
    },
    { key: 'age', header: 'Age', align: 'right' as const },
    { key: 'chapter', header: 'Chapter Hub' },
    {
      key: 'status',
      header: 'Care Status',
      render: (item: any) => (
        <StatusIndicator status={item.status} label={item.statusLabel} />
      ),
    },
    {
      key: 'adherence',
      header: 'Adherence Rate',
      align: 'right' as const,
      render: (item: any) => (
        <span className="tabular-nums font-semibold">{item.adherence}%</span>
      ),
    },
  ];

  const chartData = [
    { day: 'Mon', bp: 128 },
    { day: 'Tue', bp: 132 },
    { day: 'Wed', bp: 124 },
    { day: 'Thu', bp: 138 },
    { day: 'Fri', bp: 126 },
    { day: 'Sat', bp: 130 },
    { day: 'Sun', bp: 125 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Flashbar Preview */}
      <Flashbar
        items={[
          {
            id: 'sos-live-101',
            type: 'error',
            content: 'Active SOS Alert: Savitri Devi Sharma (Hubballi Central) · Response SLA 1.4 min.',
            action: (
              <Button variant="outline" size="sm" onClick={() => alert('Focusing incident drawer')}>
                View Incident
              </Button>
            ),
          },
        ]}
      />

      {/* 2. Dynamic Page Header */}
      <DynamicPageHeader
        title="Vayoshreshtha Design Gallery"
        description="Comprehensive verification showcase for SAP Fiori Horizon shell and AWS Cloudscape data console patterns (white theme)."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Design System Gallery' }]}
        primaryAction={
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'components' ? 'primary' : 'outline'}
              size="sm"
              icon={<Layers className="w-4 h-4" />}
              onClick={() => setActiveTab('components')}
            >
              Component Catalog
            </Button>
            <Button
              variant={activeTab === 'floorplans' ? 'primary' : 'outline'}
              size="sm"
              icon={<LayoutTemplate className="w-4 h-4" />}
              onClick={() => setActiveTab('floorplans')}
            >
              Enterprise Floorplans
            </Button>
          </div>
        }
      />

      {activeTab === 'components' ? (
        <div className="space-y-6">
          {/* Section 1: Design Tokens & Foundations */}
          <Container
            header={
              <div>
                <h2 className="text-xl font-semibold text-text">1. Foundations: Color Tokens and Multilingual Typography</h2>
                <p className="text-sm text-text-secondary">Strict CSS variables only. Zero hardcoded colors. Open Sans 400 and 600 only.</p>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Color Token Surfaces and Semantic Roles</h3>
                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-control bg-page border border-border">
                    <div className="font-semibold text-text">Page Canvas</div>
                    <div className="text-text-secondary tabular-nums">var(--page)</div>
                  </div>
                  <div className="p-3 rounded-control bg-surface border border-border">
                    <div className="font-semibold text-text">Surface</div>
                    <div className="text-text-secondary tabular-nums">var(--surface)</div>
                  </div>
                  <div className="p-3 rounded-control bg-border-subtle border border-border">
                    <div className="font-semibold text-text">Border Hairline</div>
                    <div className="text-text-secondary tabular-nums">var(--border)</div>
                  </div>
                  <div className="p-3 rounded-control bg-accent text-white">
                    <div className="font-semibold">Horizon Blue</div>
                    <div className="tabular-nums">var(--accent)</div>
                  </div>
                  <div className="p-3 rounded-control bg-accent-tint text-accent border border-accent/20">
                    <div className="font-semibold">Accent Tint</div>
                    <div className="tabular-nums">var(--accent-tint)</div>
                  </div>
                  <div className="p-3 rounded-control bg-positive-tint text-positive border border-positive/20">
                    <div className="font-semibold">Positive Tint</div>
                    <div className="tabular-nums">var(--positive)</div>
                  </div>
                  <div className="p-3 rounded-control bg-critical-tint text-critical border border-critical/20">
                    <div className="font-semibold">Critical Tint</div>
                    <div className="tabular-nums">var(--critical)</div>
                  </div>
                  <div className="p-3 rounded-control bg-negative-tint text-negative border border-negative/20">
                    <div className="font-semibold">Negative Tint</div>
                    <div className="tabular-nums">var(--negative)</div>
                  </div>
                  <div className="p-3 rounded-control bg-informative-tint text-informative border border-informative/20">
                    <div className="font-semibold">Informative</div>
                    <div className="tabular-nums">var(--informative)</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Typography Scale & Indic Scripts (Weights 400 and 600)</h3>
                <div className="space-y-2.5 text-text">
                  <div className="text-2xl font-semibold">Title 28/600 — Open Sans Display</div>
                  <div className="text-xl font-semibold">Section 20/600 — Hindi (हिंदी): वयोश्रेष्ठ डिजिटल वरिष्ठ सहायता</div>
                  <div className="text-base font-semibold">Card 16/600 — Kannada (ಕನ್ನಡ): ಹಿರಿಯ ನಾಗರಿಕರ ಆರೈಕೆ ವ್ಯವಸ್ಥೆ</div>
                  <div className="text-sm font-normal">Body 14/400 — Tamil (தமிழ்): முதியோர் நலன் மற்றும் அவசர உதவி</div>
                  <div className="text-xs font-semibold text-text-secondary">Label 12/600 — Form field header and tabular numerals</div>
                  <div className="text-xs font-normal tabular-nums text-text-secondary">
                    Tabular Numerals Specimen: ₹1,248,500.00 · Latency: 1.42s · 2026-10-30
                  </div>
                </div>
              </div>
            </div>
          </Container>

          {/* Section 2: Metric Tiles */}
          <div>
            <h3 className="text-base font-semibold text-text mb-3">2. Headline Metric Tiles (Maximum 4 per view rule)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricTile
                label="Registered Seniors"
                value="1,248"
                statusLine="Target cohort progress (1,500)"
                status="positive"
              />
              <MetricTile
                label="SOS Median Latency"
                value="1.4 min"
                statusLine="SLA threshold < 2.0 min met"
                status="positive"
              />
              <MetricTile
                label="Medication Adherence"
                value="91.6%"
                statusLine="Pilot threshold > 75.0% met"
                status="positive"
              />
              <MetricTile
                label="Open Health Flags"
                value="2"
                statusLine="Requires clinical triage call"
                status="critical"
              />
            </div>
          </div>

          {/* Section 3: Controls & Form Fields */}
          <Container
            header={
              <div>
                <h2 className="text-xl font-semibold text-text">3. Form Controls & Primitives</h2>
                <p className="text-sm text-text-secondary">Standard 40px height, 8px radius, focus ring, labels above controls.</p>
              </div>
            }
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                  Primary Button
                </Button>
                <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
                  Default Outline
                </Button>
                <Button variant="ghost">
                  Ghost Tertiary
                </Button>
                <Button variant="destructive">
                  Destructive Action
                </Button>
                <Button variant="outline" size="icon" icon={<MoreHorizontal className="w-4 h-4" />} />
                <Button variant="primary" isLoading>
                  Loading State
                </Button>
                <Button variant="outline" disabled>
                  Disabled Control
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                <Input
                  label="Senior Full Name"
                  placeholder="e.g. Savitri Devi Sharma"
                  defaultValue="Savitri Devi Sharma"
                  required
                />
                <Input
                  label="Contact Phone"
                  placeholder="+91 98450 12345"
                  helperText="Primary WhatsApp alert line"
                  leftIcon={<Phone className="w-4 h-4 text-text-secondary" />}
                />
                <Select
                  label="Chapter Hub (Ekta Hub)"
                  options={[
                    { value: 'hubballi', label: 'Hubballi Central' },
                    { value: 'dharwad', label: 'Dharwad Urban' },
                    { value: 'belagavi', label: 'Belagavi North' },
                  ]}
                  defaultValue="hubballi"
                />

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Notification Channels</label>
                  <div className="flex items-center gap-4 pt-1">
                    <Switch
                      checked={switchVal}
                      onCheckedChange={setSwitchVal}
                      label="WhatsApp Alerts"
                    />
                    <Checkbox
                      checked={checkboxVal}
                      onCheckedChange={setCheckboxVal}
                      label="SMS Fallback"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Wellness Prompt Mode</label>
                  <RadioGroup
                    value={radioVal}
                    onValueChange={setRadioVal}
                    options={[
                      { value: 'phone', label: 'Automated Voice Call' },
                      { value: 'whatsapp', label: 'Interactive WhatsApp Prompt' },
                    ]}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <Button variant="outline" onClick={() => setIsConfirmOpen(true)}>
                    Trigger Confirm Dialog
                  </Button>
                </div>
              </div>
            </div>
          </Container>

          {/* Section 4: Status Indicators & Fiori Message Strips */}
          <Container
            header={
              <div>
                <h2 className="text-xl font-semibold text-text">4. Status Indicators and Message Strips</h2>
                <p className="text-sm text-text-secondary">AWS Cloudscape semantic status markers and SAP Fiori message notifications.</p>
              </div>
            }
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-text-secondary mb-2">
                  AWS Cloudscape Status Indicators (Icon + Text, 1.5 Stroke, 20px)
                </h4>
                <div className="flex flex-wrap items-center gap-6">
                  <StatusIndicator status="positive" label="Delivered / Active" />
                  <StatusIndicator status="critical" label="Needs Attention / Pending" />
                  <StatusIndicator status="negative" label="Unacknowledged / Critical" />
                  <StatusIndicator status="neutral" label="Queued / Scheduled" />
                  <StatusIndicator status="informative" label="Draft / In Review" />
                </div>
              </div>

              <div className="pt-3 border-t border-border space-y-2.5">
                <h4 className="text-xs font-semibold text-text-secondary mb-2">
                  SAP Fiori Message Strips (Single Accent Blue + Semantic Roles)
                </h4>
                <MessageStrip
                  type="informative"
                  title="Phase 2 ABHA Milestone Notice"
                  onClose={() => {}}
                >
                  Digital ABHA card generation is active in staging for Hubballi Central pilot cohort.
                </MessageStrip>
                <MessageStrip
                  type="critical"
                  title="Consent Verification Required"
                >
                  Next-of-kin SMS consent pending for 3 newly registered seniors in Dharwad.
                </MessageStrip>
                <MessageStrip
                  type="negative"
                  title="Cellular Fallback Triggered"
                >
                  SMS delivered to senior mobile after 90s WhatsApp delivery timeout.
                </MessageStrip>
                <MessageStrip
                  type="positive"
                  title="Audit Hash Chain Verified"
                >
                  All 1,248 member interaction records cryptographically verified with zero tamper detected.
                </MessageStrip>
              </div>
            </div>
          </Container>

          {/* Section 5: Data Visualization & Table Fallback */}
          <Container
            header={
              <div>
                <h2 className="text-xl font-semibold text-text">5. Data Visualization (Cloudscape Chart with Table Fallback)</h2>
                <p className="text-sm text-text-secondary">Horizontal-only 1px hairline grid, baseline axes, threshold bands, accessible table toggle.</p>
              </div>
            }
          >
            <CloudscapeChart
              title="7-Day Systolic Blood Pressure Trend"
              subtitle="Daily Morning Vitals vs Target Band"
              data={chartData}
              xDataKey="day"
              series={[
                { dataKey: 'bp', label: 'Systolic Reading (mmHg)', color: 'var(--chart-1)' }
              ]}
              bands={[
                { y1: 110, y2: 130, label: 'Normal Band (110-130)', color: 'var(--positive-tint)' },
                { y1: 130, y2: 140, label: 'Prehypertension (130-140)', color: 'var(--critical-tint)' },
              ]}
              definition="Clinical readings logged via senior home IoT monitor and WhatsApp self-report."
            />
          </Container>

          {/* Section 6: Data Table with FilterBar */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-text">6. Cloudscape Data Table & FilterBar</h3>
            <FilterBar
              searchPlaceholder="Search seniors by name or ID..."
              filters={[
                {
                  id: 'chapter',
                  label: 'Chapter Hub',
                  options: [
                    { label: 'All Chapters', value: 'ALL' },
                    { label: 'Hubballi Central', value: 'hubballi' },
                    { label: 'Dharwad Urban', value: 'dharwad' },
                  ],
                  value: 'ALL',
                  onChange: () => {},
                },
              ]}
              searchQuery=""
              onSearchChange={() => {}}
            />

            <DataTable
              columns={tableColumns}
              data={sampleTableData}
              keyExtractor={(item) => item.id}
              selectable
              selectedIds={tableSelected}
              onSelectChange={setTableSelected}
            />
          </div>

          {/* Section 7: Key-Value List */}
          <Container
            header={
              <div>
                <h2 className="text-xl font-semibold text-text">7. AWS Cloudscape Key-Value List</h2>
                <p className="text-sm text-text-secondary">Two-column layout with 12px secondary labels and 14px bold values.</p>
              </div>
            }
          >
            <KeyValueList
              items={[
                { label: 'Primary Coordinator', value: 'Sunita Patil (CM-PUN-01)' },
                { label: 'Assigned Ekta Hub', value: 'Hubballi Central Chapter' },
                { label: 'Assisted Onboarding Date', value: '14 Oct 2026' },
                { label: 'DPDP Consent Status', value: 'Explicit Opt-In Verified' },
                { label: 'Cellular Fallback Number', value: '+91 98220 99887' },
                { label: 'Tamper-Evident Hash', value: '0x8f3c...b4a1' },
              ]}
            />
          </Container>

          {/* Confirm Dialog Preview */}
          <ConfirmDialog
            open={isConfirmOpen}
            onOpenChange={setIsConfirmOpen}
            title="De-escalate Emergency SOS Case"
            description="Are you certain you want to resolve SOS Case #SOS-2026-0814? This logs responder verification to the permanent audit registry."
            confirmLabel="Confirm De-escalation"
            isDestructive
            requireMatchText="RESOLVE"
            onConfirm={() => setIsConfirmOpen(false)}
          />
        </div>
      ) : (
        /* Floorplan Skeletons */
        <div className="space-y-6">
          <Container
            header={
              <div>
                <h2 className="text-xl font-semibold text-text">Floorplan 1: Fiori List Report</h2>
                <p className="text-sm text-text-secondary">Canonical pattern for Senior Directory, Health Logs, Audit Registry, and Admin Tables.</p>
              </div>
            }
          >
            <div className="border border-border rounded-container p-4 bg-page space-y-3">
              <div className="h-10 bg-surface border border-border rounded-control px-3 flex items-center justify-between text-xs text-text-secondary">
                <span>Dynamic Page Header (Title + Breadcrumbs + Primary Actions)</span>
                <div className="flex gap-2">
                  <span className="h-6 w-16 bg-bg-subtle border border-border rounded-control" />
                  <span className="h-6 w-20 bg-accent rounded-control text-white text-center leading-6">Action</span>
                </div>
              </div>
              <div className="h-10 bg-surface border border-border rounded-control px-3 flex items-center text-xs text-text-secondary">
                <span>FilterBar (Search Input + Multi-Filter Dropdowns + Counter Badge)</span>
              </div>
              <div className="h-40 bg-surface border border-border rounded-control p-4 flex flex-col justify-between text-xs text-text-secondary">
                <div className="flex justify-between border-b border-border pb-2 font-semibold text-text">
                  <span>Column Header A</span>
                  <span>Column Header B</span>
                  <span>Status Indicator</span>
                  <span>Tabular Numerals</span>
                </div>
                <div className="text-center text-text-secondary py-6">
                  Interactive rows with 48px target height, selection checkboxes, and click-to-detail navigation.
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-xs">
                  <span>Showing 1–10 of 1,248 seniors</span>
                  <span>Pagination: 1 2 3 ... 125</span>
                </div>
              </div>
            </div>
          </Container>

          <Container
            header={
              <div>
                <h2 className="text-xl font-semibold text-text">Floorplan 2: AWS Cloudscape Split Panel</h2>
                <p className="text-sm text-text-secondary">Canonical pattern for Live SOS Emergency Board and Health Flags triage queue.</p>
              </div>
            }
          >
            <div className="border border-border rounded-container p-4 bg-page grid grid-cols-12 gap-4 h-72">
              <div className="col-span-7 bg-surface border border-border rounded-control p-4 flex flex-col justify-between text-xs text-text-secondary">
                <div>
                  <div className="font-semibold text-text text-sm mb-1">Triage Master Queue (7 Columns)</div>
                  <p>Interactive table of incoming events sorted by severity and elapsed time SLA.</p>
                </div>
                <div className="p-3 bg-bg-subtle rounded-control border border-border">
                  Row selected: SOS-2026-0814 · Kamala Devi · Elapsed: 1m 24s
                </div>
              </div>

              <div className="col-span-5 bg-surface border border-border rounded-control p-4 flex flex-col justify-between text-xs text-text-secondary">
                <div>
                  <div className="font-semibold text-text text-sm mb-1">Sticky Detail Panel (5 Columns)</div>
                  <p>Zero context switching: inspect NOK phone, vitals history, and dispatch care coordinator immediately.</p>
                </div>
                <div className="space-y-2">
                  <Button variant="primary" size="sm" className="w-full">
                    Acknowledge & Assign Responder
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Incident Log
                  </Button>
                </div>
              </div>
            </div>
          </Container>

          <Container
            header={
              <div>
                <h2 className="text-xl font-semibold text-text">Floorplan 3: Fiori Object Page with 8 Tabs</h2>
                <p className="text-sm text-text-secondary">Canonical pattern for Senior Citizen Profile and SOS Case Inspection.</p>
              </div>
            }
          >
            <div className="border border-border rounded-container p-4 bg-page space-y-3">
              <div className="bg-surface border border-border rounded-control p-4 flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-tint text-accent flex items-center justify-center font-semibold text-sm">
                    SD
                  </div>
                  <div>
                    <div className="font-semibold text-text text-sm">Savitri Devi Sharma (76 yrs)</div>
                    <div>Hubballi Central · ID: SEN-HUB-0042 · Status: Active</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit Record</Button>
                  <Button variant="primary" size="sm">Print Membership Card</Button>
                </div>
              </div>

              <div className="h-9 bg-surface border-b border-border flex items-center gap-6 px-4 text-xs font-semibold text-text">
                <span className="border-b-2 border-accent text-accent py-2">Clinical Vitals</span>
                <span className="text-text-secondary py-2">Medication Schedules</span>
                <span className="text-text-secondary py-2">Attendance & Activities</span>
                <span className="text-text-secondary py-2">Emergency Contacts</span>
                <span className="text-text-secondary py-2">Audit History</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-surface border border-border rounded-control p-4 text-xs text-text-secondary h-36 flex items-center justify-center">
                  Active Tab Body (Trend Line Charts with Threshold Bands + Filterable Reading Table)
                </div>
                <div className="col-span-1 bg-surface border border-border rounded-control p-4 text-xs text-text-secondary h-36 flex flex-col justify-between">
                  <div className="font-semibold text-text">Next-of-Kin Contacts</div>
                  <div>Rajesh Sharma (Son): +91 98220 99887</div>
                  <div className="text-xs text-positive font-semibold">Consent Verified (SMS OTP)</div>
                </div>
              </div>
            </div>
          </Container>

          <Container
            header={
              <div>
                <h2 className="text-xl font-semibold text-text">Floorplan 4: Cloudscape Multi-Step Wizard</h2>
                <p className="text-sm text-text-secondary">Canonical pattern for Assisted Senior Citizen Registration.</p>
              </div>
            }
          >
            <div className="border border-border rounded-container p-4 bg-page grid grid-cols-12 gap-4 h-64">
              <div className="col-span-3 bg-surface border border-border rounded-control p-4 text-xs text-text-secondary space-y-3">
                <div className="font-semibold text-text text-xs mb-2">Registration Rail</div>
                <div className="text-positive font-semibold">1. Demographics</div>
                <div className="text-accent font-semibold border-l-2 border-accent pl-2">2. Emergency NOK</div>
                <div className="text-text-secondary">3. Health Profile</div>
                <div className="text-text-secondary">4. DPDP Consent</div>
                <div className="text-text-secondary">5. Review & Issue ID</div>
              </div>
              <div className="col-span-9 bg-surface border border-border rounded-control p-4 flex flex-col justify-between text-xs text-text-secondary">
                <div>
                  <div className="font-semibold text-text text-sm mb-1">Step 2: Emergency Next-of-Kin Contacts</div>
                  <p>Collect at least two emergency telephone numbers with verified family relationship.</p>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <Button variant="outline" size="sm">Previous Step</Button>
                  <Button variant="primary" size="sm">Save & Continue</Button>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
};
