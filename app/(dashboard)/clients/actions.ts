'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const email = formData.get('email') as string | null
  const phone = formData.get('phone') as string | null
  const company = formData.get('company') as string | null
  const status = formData.get('status') as string || 'active'

  if (!name || name.trim() === '') {
    return { error: 'Name is required' }
  }

  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      status: status,
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
  
  const name = formData.get('name') as string
  const email = formData.get('email') as string | null
  const phone = formData.get('phone') as string | null
  const company = formData.get('company') as string | null
  const status = formData.get('status') as string || 'active'

  if (!name || name.trim() === '') {
    return { error: 'Name is required' }
  }

  const { data, error } = await supabase
    .from('clients')
    .update({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      status: status,
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
