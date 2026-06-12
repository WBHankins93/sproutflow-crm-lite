'use server'

import { createClient } from '@/lib/supabase/server'
import { clientSchema, parseFormData } from '@/lib/crm/validation'
import { revalidatePath } from 'next/cache'

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()

  const parsed = parseFormData(clientSchema, formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid client details' }
  }

  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      status: parsed.data.status,
      follow_up_date: parsed.data.follow_up_date,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/clients')
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient()

  const parsed = parseFormData(clientSchema, formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid client details' }
  }

  const { data, error } = await supabase
    .from('clients')
    .update({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      status: parsed.data.status,
      follow_up_date: parsed.data.follow_up_date,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/clients')
  revalidatePath('/dashboard')
  return { success: true }
}
