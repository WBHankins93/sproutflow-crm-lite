import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)
  
  const { data: clients, count: clientsCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5)
  
  const { data: leads, count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact' })
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
    .neq('status', 'converted')
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Active clients in your CRM</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Leads in your pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Follow-up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{followUps.length}</div>
            <p className="text-xs text-muted-foreground">Due today or earlier</p>
          </CardContent>
        </Card>
      </div>

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
