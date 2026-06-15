import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { AddLeadDialog } from '@/components/leads/AddLeadDialog'
import { LeadsList } from '@/components/leads/LeadsList'

export default async function LeadsPage() {
  const supabase = await createClient()
  
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">Manage your leads</p>
        </div>
        <AddLeadDialog />
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading leads: {error.message}</p>
          </CardContent>
        </Card>
      ) : (
        <LeadsList leads={leads || []} />
      )}
    </div>
  )
}
