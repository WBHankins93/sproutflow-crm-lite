'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLeadAction(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const email = formData.get('email') as string | null
  const phone = formData.get('phone') as string | null
  const source = formData.get('source') as string | null
  const status = formData.get('status') as string || 'new'

  if (!name || name.trim() === '') {
    return { error: 'Name is required' }
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      source: source?.trim() || null,
      status: status,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/leads')
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function updateLeadAction(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const email = formData.get('email') as string | null
  const phone = formData.get('phone') as string | null
  const source = formData.get('source') as string | null
  const status = formData.get('status') as string || 'new'

  if (!name || name.trim() === '') {
    return { error: 'Name is required' }
  }

  const { data, error } = await supabase
    .from('leads')
    .update({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      source: source?.trim() || null,
      status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/leads')
  revalidatePath(`/leads/${id}`)
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function deleteLeadAction(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/leads')
  revalidatePath('/dashboard')
  return { success: true }
}
