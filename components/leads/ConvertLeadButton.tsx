'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRightLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { convertLeadToClientAction } from '@/app/(dashboard)/leads/actions'

export function ConvertLeadButton({
  leadId,
  disabled,
}: {
  leadId: string
  disabled?: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConvert() {
    setLoading(true)
    setError(null)

    const result = await convertLeadToClientAction(leadId)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push(`/clients/${result.clientId}`)
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleConvert} disabled={disabled || loading}>
        <ArrowRightLeft className="mr-2 h-4 w-4" />
        {loading ? 'Converting...' : 'Convert to Client'}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
