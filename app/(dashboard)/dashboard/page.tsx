import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: clients, count: clientsCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5)
  
  const { data: deals, count: dealsCount } = await supabase
    .from('deals')
    .select('id', { count: 'exact', head: true })
  
  const { data: leads, count: leadsCount } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
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
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Deals in pipeline</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsCount || 0}</div>
            <p className="text-xs text-muted-foreground">New leads this month</p>
          </CardContent>
        </Card>
      </div>

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
    </div>
  )
}
