'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { EditLeadDialog } from './EditLeadDialog'
import { DeleteLeadDialog } from './DeleteLeadDialog'

interface Lead {
  id: string
  name: string
  email: string | null
  phone: string | null
  source: string | null
  status: string
  follow_up_date: string | null
  created_at: string
  updated_at: string
}

interface LeadsListProps {
  leads: Lead[]
}

export function LeadsList({ leads }: LeadsListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.source?.toLowerCase().includes(query) ||
      lead.phone?.toLowerCase().includes(query)
    )
  })

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No leads found. Add your first lead to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search leads by name, email, source, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No leads match your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLeads.map((lead) => (
            <Card key={lead.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{lead.name}</span>
                  <Badge variant="outline">{lead.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {lead.email && (
                    <p className="text-muted-foreground">Email: {lead.email}</p>
                  )}
                  {lead.phone && (
                    <p className="text-muted-foreground">Phone: {lead.phone}</p>
                  )}
                  {lead.source && (
                    <p className="text-muted-foreground">Source: {lead.source}</p>
                  )}
                  {lead.follow_up_date && (
                    <p className="text-muted-foreground">
                      Follow-up: {new Date(`${lead.follow_up_date}T00:00:00`).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="text-primary hover:underline"
                    >
                      View Details →
                    </Link>
                    <EditLeadDialog lead={lead} />
                    <DeleteLeadDialog leadId={lead.id} leadName={lead.name} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
