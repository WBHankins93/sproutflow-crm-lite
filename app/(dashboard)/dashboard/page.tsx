import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { CalendarClock, Sprout, UserPlus, Users2, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)
  
  const { data: clients, count: clientsCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5)

  // Open leads exclude converted/lost so the metric reflects the live pipeline.
  const { count: openLeadsCount } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .not('status', 'in', '(converted,lost)')

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .not('status', 'in', '(converted,lost)')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: followUpClients } = await supabase
    .from('clients')
    .select('id, name, follow_up_date')
    .not('follow_up_date', 'is', null)
    .lte('follow_up_date', today)
    .order('follow_up_date', { ascending: true })
    .limit(5)

  const { data: followUpLeads } = await supabase
    .from('leads')
    .select('id, name, follow_up_date')
    .not('follow_up_date', 'is', null)
    .not('status', 'in', '(converted,lost)')
    .lte('follow_up_date', today)
    .order('follow_up_date', { ascending: true })
    .limit(5)

  const followUps = [
    ...(followUpClients || []).map((client) => ({
      id: client.id,
      name: client.name,
      follow_up_date: client.follow_up_date,
      href: `/clients/${client.id}`,
      type: 'Client',
    })),
    ...(followUpLeads || []).map((lead) => ({
      id: lead.id,
      name: lead.name,
      follow_up_date: lead.follow_up_date,
      href: `/leads/${lead.id}`,
      type: 'Lead',
    })),
  ].sort((a, b) => (a.follow_up_date || '').localeCompare(b.follow_up_date || ''))

  const isEmpty = !clientsCount && !openLeadsCount

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Here&apos;s what&apos;s growing today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Clients"
          value={clientsCount || 0}
          detail="Active clients in your CRM"
          icon={Users2}
        />
        <MetricCard
          title="Open Leads"
          value={openLeadsCount || 0}
          detail="Active leads in your pipeline"
          icon={UserPlus}
        />
        <MetricCard
          title="Needs Follow-up"
          value={followUps.length}
          detail="Due today or earlier"
          icon={CalendarClock}
          emphasize={followUps.length > 0}
        />
      </div>

      {isEmpty && (
        <Card className="animate-rise-in border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sprout className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">Plant your first record</p>
              <p className="text-sm text-muted-foreground">
                Add a lead or client to start tracking follow-ups.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/leads"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Add a lead
              </Link>
              <Link
                href="/clients"
                className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Add a client
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {followUps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Follow Up Next</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {followUps.slice(0, 5).map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                  </div>
                  <Badge variant="outline">
                    {new Date(`${item.follow_up_date}T00:00:00`).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {clients && clients.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Clients</CardTitle>
                <Link
                  href="/clients"
                  className="text-sm text-primary hover:underline"
                >
                  View all →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clients.map((client) => (
                  <Link
                    key={client.id}
                    href={`/clients/${client.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{client.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {client.company && (
                          <p className="text-sm text-muted-foreground">
                            {client.company}
                          </p>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {client.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {leads && leads.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Leads</CardTitle>
                <Link
                  href="/leads"
                  className="text-sm text-primary hover:underline"
                >
                  View all →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{lead.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {lead.source && (
                          <p className="text-sm text-muted-foreground">
                            {lead.source}
                          </p>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {lead.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  emphasize = false,
}: {
  title: string
  value: number
  detail: string
  icon: LucideIcon
  emphasize?: boolean
}) {
  return (
    <Card className="animate-rise-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span
          className={
            emphasize
              ? 'flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground'
              : 'flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'
          }
        >
          <Icon className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}
