import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function DealsPage() {
  const supabase = await createClient()
  
  const { data: deals, error } = await supabase
    .from('deals')
    .select(`
      *,
      clients (
        name
      )
    `)
    .order('created_at', { ascending: false })

  const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost']
  
  const dealsByStage = stages.map(stage => ({
    stage,
    deals: deals?.filter(deal => deal.stage === stage) || []
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Deals Pipeline</h2>
          <p className="text-muted-foreground">Track and manage your sales pipeline</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading deals: {error.message}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {dealsByStage.map(({ stage, deals }) => (
            <div key={stage} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold capitalize">{stage.replace('-', ' ')}</h3>
                <Badge variant="secondary">{deals.length}</Badge>
              </div>
              <div className="space-y-2">
                {deals.map((deal) => (
                  <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{deal.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      {deal.clients && (
                        <p className="text-xs text-muted-foreground">
                          {(deal.clients as any).name}
                        </p>
                      )}
                      {deal.value && (
                        <p className="text-sm font-semibold">
                          ${new Intl.NumberFormat().format(deal.value)}
                        </p>
                      )}
                      {deal.probability !== null && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
