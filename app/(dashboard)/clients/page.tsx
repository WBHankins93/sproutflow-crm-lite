import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { AddClientDialog } from '@/components/clients/AddClientDialog'
import { ClientsList } from '@/components/clients/ClientsList'

export default async function ClientsPage() {
  const supabase = await createClient()
  
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <AddClientDialog />
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading clients: {error.message}</p>
          </CardContent>
        </Card>
      ) : (
        <ClientsList clients={clients || []} />
      )}
    </div>
  )
}
