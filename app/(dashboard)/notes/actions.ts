'use server'

import { noteSchema, parseFormData } from '@/lib/crm/validation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type NoteParent = {
  type: 'lead' | 'client'
  id: string
}

export async function createNoteAction(parent: NoteParent, formData: FormData) {
  const supabase = await createClient()

  const parsed = parseFormData(noteSchema, formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid note' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('notes')
    .insert({
      body: parsed.data.body,
      lead_id: parent.type === 'lead' ? parent.id : null,
      client_id: parent.type === 'client' ? parent.id : null,
      created_by: user?.id ?? null,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(parent.type === 'lead' ? `/leads/${parent.id}` : `/clients/${parent.id}`)
  revalidatePath('/dashboard')
  return { success: true }
}
