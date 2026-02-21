import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Deals</h2>
        <p className="text-muted-foreground">View your deals and pipeline</p>
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading deals: {error.message}</p>
          </CardContent>
        </Card>
      ) : deals && deals.length > 0 ? (
        <div className="space-y-4">
          {deals.map((deal) => (
            <Card key={deal.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{deal.title}</CardTitle>
                  <Badge variant="outline">{deal.stage}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {deal.clients && (
                    <div>
                      <p className="text-sm font-medium">Client</p>
                      <p className="text-sm text-muted-foreground">
                        {(deal.clients as any).name}
                      </p>
                    </div>
                  )}
                  {deal.value && (
                    <div>
                      <p className="text-sm font-medium">Value</p>
                      <p className="text-sm text-muted-foreground">
                        ${new Intl.NumberFormat().format(deal.value)}
                      </p>
                    </div>
                  )}
                  {deal.probability !== null && (
                    <div>
                      <p className="text-sm font-medium">Probability</p>
                      <p className="text-sm text-muted-foreground">{deal.probability}%</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No deals found. Deals will appear here when added.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
