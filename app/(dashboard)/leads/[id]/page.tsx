import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditLeadDialog } from '@/components/leads/EditLeadDialog'
import { DeleteLeadDialog } from '@/components/leads/DeleteLeadDialog'
import { ConvertLeadButton } from '@/components/leads/ConvertLeadButton'
import { NotesPanel } from '@/components/notes/NotesPanel'
import { Mail, Phone, Calendar, Tag } from 'lucide-react'

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !lead) {
    notFound()
  }

  const { data: notes } = await supabase
    .from('notes')
    .select('id, body, created_at')
    .eq('lead_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{lead.name}</h2>
          <p className="text-muted-foreground">Lead details and information</p>
        </div>
        <div className="flex gap-2">
          <ConvertLeadButton leadId={lead.id} disabled={lead.status === 'converted'} />
          <EditLeadDialog lead={lead} />
          <DeleteLeadDialog leadId={lead.id} leadName={lead.name} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lead.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                </div>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{lead.phone}</p>
                </div>
              </div>
            )}
            {lead.source && (
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Source</p>
                  <p className="text-sm text-muted-foreground">{lead.source}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Status</p>
              <Badge variant="outline">{lead.status}</Badge>
            </div>
            {lead.follow_up_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Next Follow-up</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(`${lead.follow_up_date}T00:00:00`).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(lead.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            {lead.updated_at && lead.updated_at !== lead.created_at && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(lead.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <NotesPanel
        parent={{ type: 'lead', id: lead.id }}
        notes={notes || []}
      />
    </div>
  )
}
