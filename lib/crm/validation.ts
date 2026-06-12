import { z } from 'zod'

const optionalText = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable()
  .optional()

const optionalEmail = z
  .string()
  .trim()
  .refine((value) => value === '' || z.email().safeParse(value).success, {
    message: 'Enter a valid email address',
  })
  .transform((value) => value || null)
  .nullable()
  .optional()

const optionalDate = z
  .string()
  .trim()
  .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'Enter a valid follow-up date',
  })
  .transform((value) => value || null)
  .nullable()
  .optional()

export const leadStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost'] as const
export const clientStatuses = ['active', 'inactive', 'prospect'] as const

export const leadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: optionalEmail,
  phone: optionalText,
  source: optionalText,
  status: z.enum(leadStatuses).default('new'),
  follow_up_date: optionalDate,
})

export const clientSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: optionalEmail,
  phone: optionalText,
  company: optionalText,
  status: z.enum(clientStatuses).default('active'),
  follow_up_date: optionalDate,
})

export const noteSchema = z.object({
  body: z.string().trim().min(1, 'Note is required'),
})

export function parseFormData<T extends z.ZodType>(schema: T, formData: FormData) {
  return schema.safeParse(Object.fromEntries(formData.entries()))
}
