import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClientsList } from './ClientsList'

type Client = Parameters<typeof ClientsList>[0]['clients'][number]

function makeClient(overrides: Partial<Client> = {}): Client {
  return {
    id: crypto.randomUUID(),
    name: 'Avery Stone',
    email: 'avery@example.com',
    phone: '(214) 555-0192',
    company: 'Stone Family Office',
    status: 'active',
    follow_up_date: null,
    created_at: '2026-06-01T00:00:00.000Z',
    updated_at: '2026-06-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('ClientsList', () => {
  it('shows an empty state when there are no clients', () => {
    render(<ClientsList clients={[]} />)
    expect(
      screen.getByText('No clients found. Add your first client to get started.')
    ).toBeInTheDocument()
  })

  it('renders a card for each client', () => {
    render(
      <ClientsList
        clients={[
          makeClient({ name: 'Avery Stone' }),
          makeClient({ name: 'Nolan Reed', company: 'Reed Consulting' }),
        ]}
      />
    )
    expect(screen.getByText('Avery Stone')).toBeInTheDocument()
    expect(screen.getByText('Nolan Reed')).toBeInTheDocument()
  })

  it('filters clients by the search query', async () => {
    const user = userEvent.setup()
    render(
      <ClientsList
        clients={[
          makeClient({ name: 'Avery Stone' }),
          makeClient({ name: 'Nolan Reed', email: 'nolan@example.com', company: 'Reed Consulting' }),
        ]}
      />
    )

    await user.type(screen.getByPlaceholderText(/search clients/i), 'nolan')

    expect(screen.getByText('Nolan Reed')).toBeInTheDocument()
    expect(screen.queryByText('Avery Stone')).not.toBeInTheDocument()
  })

  it('shows a no-match message when the search has no results', async () => {
    const user = userEvent.setup()
    render(<ClientsList clients={[makeClient({ name: 'Avery Stone' })]} />)

    await user.type(screen.getByPlaceholderText(/search clients/i), 'zzzzz')

    expect(screen.getByText('No clients match your search.')).toBeInTheDocument()
  })
})
