'use server'

import { createClient } from '@/lib/supabase/server'
import { leadSchema, parseFormData } from '@/lib/crm/validation'
import { revalidatePath } from 'next/cache'

export async function createLeadAction(formData: FormData) {
  const supabase = await createClient()

  const parsed = parseFormData(leadSchema, formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid lead details' }
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      source: parsed.data.source,
      status: parsed.data.status,
      follow_up_date: parsed.data.follow_up_date,
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

  const parsed = parseFormData(leadSchema, formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid lead details' }
  }

  const { data, error } = await supabase
    .from('leads')
    .update({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      source: parsed.data.source,
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

export async function convertLeadToClientAction(id: string) {
  const supabase = await createClient()

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (leadError || !lead) {
    return { error: leadError?.message || 'Lead not found' }
  }

  if (lead.status === 'converted') {
    return { error: 'Lead has already been converted' }
  }

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.source,
      status: 'active',
      follow_up_date: lead.follow_up_date,
      assigned_to: lead.assigned_to,
    })
    .select()
    .single()

  if (clientError) {
    return { error: clientError.message }
  }

  const { error: updateError } = await supabase
    .from('leads')
    .update({
      status: 'converted',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/leads')
  revalidatePath(`/leads/${id}`)
  revalidatePath('/clients')
  revalidatePath('/dashboard')
  return { success: true, clientId: client.id }
}
