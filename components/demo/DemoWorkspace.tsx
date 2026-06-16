'use client'

import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowRightLeft,
  CalendarClock,
  CheckCircle2,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Sparkles,
  Sprout,
  Users,
  Users2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { DemoTour, type TourStep } from './DemoTour'

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  followUp: string
  notes: string[]
}

type Client = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: 'active' | 'inactive' | 'prospect'
  followUp: string
  notes: string[]
}

const initialLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Maya Brooks',
    email: 'maya@example.com',
    phone: '(312) 555-0184',
    source: 'Website',
    status: 'qualified',
    followUp: 'Today',
    notes: ['Asked for a simple way to track referrals and follow-ups.'],
  },
  {
    id: 'lead-2',
    name: 'Jordan Ellis',
    email: 'jordan@example.com',
    phone: '(512) 555-0149',
    source: 'Referral',
    status: 'contacted',
    followUp: 'Tomorrow',
    notes: ['Prefers email. Send onboarding checklist after call.'],
  },
  {
    id: 'lead-3',
    name: 'Priya Shah',
    email: 'priya@example.com',
    phone: '(404) 555-0168',
    source: 'Local event',
    status: 'new',
    followUp: 'Friday',
    notes: [],
  },
]

const initialClients: Client[] = [
  {
    id: 'client-1',
    name: 'Avery Stone',
    email: 'avery@example.com',
    phone: '(214) 555-0192',
    company: 'Stone Family Office',
    status: 'active',
    followUp: 'Today',
    notes: ['Renewal review scheduled for next week.'],
  },
  {
    id: 'client-2',
    name: 'Nolan Reed',
    email: 'nolan@example.com',
    phone: '(303) 555-0127',
    company: 'Reed Consulting',
    status: 'prospect',
    followUp: 'Monday',
    notes: ['Needs a lightweight CRM for two producers.'],
  },
]

const navItems: {
  view: 'dashboard' | 'leads' | 'clients'
  icon: LucideIcon
  label: string
}[] = [
  { view: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { view: 'leads', icon: Users, label: 'Leads' },
  { view: 'clients', icon: Users2, label: 'Clients' },
]

const statusStyles: Record<string, string> = {
  new: 'border-sky-200 bg-sky-50 text-sky-700',
  contacted: 'border-amber-200 bg-amber-50 text-amber-700',
  qualified: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  converted: 'border-violet-200 bg-violet-50 text-violet-700',
  lost: 'border-zinc-200 bg-zinc-50 text-zinc-700',
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  inactive: 'border-zinc-200 bg-zinc-50 text-zinc-700',
  prospect: 'border-amber-200 bg-amber-50 text-amber-700',
}

export function DemoWorkspace() {
  const [activeView, setActiveView] = useState<'dashboard' | 'leads' | 'clients'>('dashboard')
  const [leads, setLeads] = useState(initialLeads)
  const [clients, setClients] = useState(initialClients)
  const [selectedLeadId, setSelectedLeadId] = useState(initialLeads[0].id)
  const [selectedClientId, setSelectedClientId] = useState(initialClients[0].id)
  const [noteDraft, setNoteDraft] = useState('')
  const [tourOpen, setTourOpen] = useState(false)

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || leads[0]
  const selectedClient = clients.find((client) => client.id === selectedClientId) || clients[0]
  const followUpCount = [...leads, ...clients].filter((record) => record.followUp === 'Today').length

  const recentActivity = useMemo(() => {
    const clientActivity = clients.map((client) => ({
      id: client.id,
      label: client.name,
      detail: `${client.company} - ${client.status}`,
    }))
    const leadActivity = leads.map((lead) => ({
      id: lead.id,
      label: lead.name,
      detail: `${lead.source} - ${lead.status}`,
    }))
    return [...leadActivity, ...clientActivity].slice(0, 5)
  }, [clients, leads])

  function addNote() {
    const trimmed = noteDraft.trim()
    if (!trimmed) return

    if (activeView === 'clients') {
      setClients((current) =>
        current.map((client) =>
          client.id === selectedClient.id
            ? { ...client, notes: [trimmed, ...client.notes] }
            : client
        )
      )
    } else {
      setLeads((current) =>
        current.map((lead) =>
          lead.id === selectedLead.id
            ? { ...lead, notes: [trimmed, ...lead.notes] }
            : lead
        )
      )
    }
    setNoteDraft('')
  }

  function convertSelectedLead() {
    if (!selectedLead || selectedLead.status === 'converted') return

    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: selectedLead.name,
      email: selectedLead.email,
      phone: selectedLead.phone,
      company: selectedLead.source,
      status: 'active',
      followUp: selectedLead.followUp,
      notes: ['Converted from lead in the demo workspace.', ...selectedLead.notes],
    }

    setClients((current) => [newClient, ...current])
    setLeads((current) =>
      current.map((lead) =>
        lead.id === selectedLead.id ? { ...lead, status: 'converted' } : lead
      )
    )
    setSelectedClientId(newClient.id)
    setActiveView('clients')
  }

  const tourSteps: TourStep[] = [
    {
      key: 'followups',
      title: '1 · Review follow-ups',
      body: 'The dashboard surfaces who needs attention today so nothing slips.',
      anchor: 'followups',
      onEnter: () => setActiveView('dashboard'),
    },
    {
      key: 'open-lead',
      title: '2 · Open a lead',
      body: 'Browse your pipeline and open a lead to see its full detail panel.',
      anchor: 'records',
      placement: 'bottom-right',
      onEnter: () => {
        setActiveView('leads')
        setSelectedLeadId(initialLeads[0].id)
      },
    },
    {
      key: 'add-note',
      title: '3 · Add a note',
      body: 'Capture context as you go — notes save instantly against the record.',
      anchor: 'notes',
      placement: 'bottom-left',
      onEnter: () => {
        setActiveView('leads')
        setSelectedLeadId(initialLeads[0].id)
      },
    },
    {
      key: 'convert',
      title: '4 · Convert to client',
      body: 'When a lead is ready, convert it into a client in one click.',
      anchor: 'convert',
      placement: 'bottom-left',
      onEnter: () => {
        setActiveView('leads')
        setSelectedLeadId(initialLeads[0].id)
      },
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 border-r bg-sidebar text-sidebar-foreground md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <Sprout className="h-6 w-6" />
          <div>
            <p className="font-display text-lg font-semibold">Sproutflow</p>
            <p className="text-xs text-sidebar-foreground/70">CRM Lite Demo</p>
          </div>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map(({ view, icon: Icon, label }) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={cn(
                'flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                activeView === view
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b bg-[var(--header)] px-4 py-3 md:px-6">
          <div>
            <h1 className="text-xl font-semibold">Demo Workspace</h1>
            <p className="text-sm text-muted-foreground">Seeded walkthrough data. No login required.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setTourOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Take the tour
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="https://github.com/WBHankins93/sproutflow-crm-lite">GitHub</Link>
            </Button>
          </div>
        </header>

        <div className="space-y-6 p-4 md:p-6">
          <section className="grid gap-4 md:grid-cols-3">
            <MetricCard title="Clients" value={clients.length} detail="Active relationship records" />
            <MetricCard title="Leads" value={leads.length} detail="Pipeline contacts" />
            <MetricCard title="Follow-ups" value={followUpCount} detail="Due today" anchor="followups" />
          </section>

          {activeView === 'dashboard' && (
            <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Follow Up Next</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[...leads, ...clients]
                    .filter((record) => record.followUp === 'Today')
                    .map((record) => (
                      <div key={record.id} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <p className="font-medium">{record.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {'source' in record ? record.source : record.company}
                          </p>
                        </div>
                        <Badge variant="outline" className="gap-1">
                          <CalendarClock className="h-3.5 w-3.5" />
                          Today
                        </Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 rounded-md border p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          )}

          {activeView === 'leads' && (
            <RecordWorkspace
              records={leads}
              selectedId={selectedLead.id}
              onSelect={setSelectedLeadId}
              detail={
                <LeadDetail
                  lead={selectedLead}
                  noteDraft={noteDraft}
                  setNoteDraft={setNoteDraft}
                  addNote={addNote}
                  convertLead={convertSelectedLead}
                />
              }
            />
          )}

          {activeView === 'clients' && (
            <RecordWorkspace
              records={clients}
              selectedId={selectedClient.id}
              onSelect={setSelectedClientId}
              detail={
                <ClientDetail
                  client={selectedClient}
                  noteDraft={noteDraft}
                  setNoteDraft={setNoteDraft}
                  addNote={addNote}
                />
              }
            />
          )}
        </div>
      </main>

      <DemoTour steps={tourSteps} open={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  )
}

function MetricCard({
  title,
  value,
  detail,
  anchor,
}: {
  title: string
  value: number
  detail: string
  anchor?: string
}) {
  return (
    <Card data-tour={anchor}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function RecordWorkspace<T extends Lead | Client>({
  records,
  selectedId,
  onSelect,
  detail,
}: {
  records: T[]
  selectedId: string
  onSelect: (id: string) => void
  detail: ReactNode
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card data-tour="records">
        <CardHeader>
          <CardTitle>Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {records.map((record) => (
            <button
              key={record.id}
              onClick={() => onSelect(record.id)}
              className={cn(
                'w-full rounded-md border p-3 text-left transition-colors hover:bg-accent',
                selectedId === record.id && 'border-primary bg-accent'
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{record.name}</p>
                <Badge variant="outline" className={statusStyles[record.status]}>
                  {record.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {'source' in record ? record.source : record.company}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>
      {detail}
    </section>
  )
}

function LeadDetail({
  lead,
  noteDraft,
  setNoteDraft,
  addNote,
  convertLead,
}: {
  lead: Lead
  noteDraft: string
  setNoteDraft: (value: string) => void
  addNote: () => void
  convertLead: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{lead.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{lead.email} - {lead.phone}</p>
          </div>
          <Button data-tour="convert" onClick={convertLead} disabled={lead.status === 'converted'}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Convert
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <RecordFacts items={[['Source', lead.source], ['Status', lead.status], ['Follow-up', lead.followUp]]} />
        <NotesComposer notes={lead.notes} noteDraft={noteDraft} setNoteDraft={setNoteDraft} addNote={addNote} />
      </CardContent>
    </Card>
  )
}

function ClientDetail({
  client,
  noteDraft,
  setNoteDraft,
  addNote,
}: {
  client: Client
  noteDraft: string
  setNoteDraft: (value: string) => void
  addNote: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{client.email} - {client.phone}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <RecordFacts items={[['Company', client.company], ['Status', client.status], ['Follow-up', client.followUp]]} />
        <NotesComposer notes={client.notes} noteDraft={noteDraft} setNoteDraft={setNoteDraft} addNote={addNote} />
      </CardContent>
    </Card>
  )
}

function RecordFacts({ items }: { items: [string, string][] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 font-medium capitalize">{value}</p>
        </div>
      ))}
    </div>
  )
}

function NotesComposer({
  notes,
  noteDraft,
  setNoteDraft,
  addNote,
}: {
  notes: string[]
  noteDraft: string
  setNoteDraft: (value: string) => void
  addNote: () => void
}) {
  return (
    <div className="space-y-3" data-tour="notes">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-medium">Notes</h2>
      </div>
      <Textarea
        value={noteDraft}
        onChange={(event) => setNoteDraft(event.target.value)}
        placeholder="Add a demo note..."
      />
      <Button onClick={addNote} disabled={!noteDraft.trim()}>
        <Plus className="mr-2 h-4 w-4" />
        Add Note
      </Button>
      <div className="space-y-2">
        {notes.length > 0 ? notes.map((note, index) => (
          <div key={`${note}-${index}`} className="rounded-md border p-3 text-sm">
            {note}
          </div>
        )) : (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        )}
      </div>
    </div>
  )
}
