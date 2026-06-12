'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Link from 'next/link'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  status: string
  follow_up_date: string | null
  created_at: string
  updated_at: string
}

interface ClientsListProps {
  clients: Client[]
}

export function ClientsList({ clients }: ClientsListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      client.name.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.company?.toLowerCase().includes(query) ||
      client.phone?.toLowerCase().includes(query)
    )
  })

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No clients found. Add your first client to get started.
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
          placeholder="Search clients by name, email, company, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No clients match your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{client.name}</span>
                  <Badge variant="outline">{client.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {client.email && (
                    <p className="text-muted-foreground">Email: {client.email}</p>
                  )}
                  {client.phone && (
                    <p className="text-muted-foreground">Phone: {client.phone}</p>
                  )}
                  {client.company && (
                    <p className="text-muted-foreground">Company: {client.company}</p>
                  )}
                  {client.follow_up_date && (
                    <p className="text-muted-foreground">
                      Follow-up: {new Date(`${client.follow_up_date}T00:00:00`).toLocaleDateString()}
                    </p>
                  )}
                  <Link
                    href={`/clients/${client.id}`}
                    className="text-primary hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
