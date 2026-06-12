'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { createNoteAction } from '@/app/(dashboard)/notes/actions'

type Note = {
  id: string
  body: string
  created_at: string
}

type NotesPanelProps = {
  parent: {
    type: 'lead' | 'client'
    id: string
  }
  notes: Note[]
}

export function NotesPanel({ parent, notes }: NotesPanelProps) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createNoteAction(parent, formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setBody('')
    setLoading(false)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Notes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a quick note..."
            disabled={loading}
            required
          />
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading || body.trim().length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            {loading ? 'Adding...' : 'Add Note'}
          </Button>
        </form>

        {notes.length > 0 ? (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="rounded-md border p-3">
                <p className="whitespace-pre-wrap text-sm">{note.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(note.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
