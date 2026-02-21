import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

function getInitials(name?: string, email?: string) {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  if (email) {
    return email[0].toUpperCase()
  }
  return 'U'
}

export default async function TeamMembersPage() {
  const supabase = await createClient()
  
  const { data: teamMembers, error } = await supabase
    .from('team_members')
    .select(`
      *,
      users (
        id,
        email,
        full_name,
        avatar_url,
        role
      )
    `)
    .order('joined_at', { ascending: false })

  const memberCount = teamMembers?.length || 0

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Users2 className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Team Members</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {memberCount} {memberCount === 1 ? 'member' : 'members'} in your agency
        </p>
      </div>

        {error ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive">Error loading team members: {error.message}</p>
            </CardContent>
          </Card>
        ) : teamMembers && teamMembers.length > 0 ? (
          <div className="space-y-2">
            {teamMembers.map((member) => {
              const user = member.users as any
              if (!user) return null
              
              return (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url || ''} alt={user.full_name || ''} />
                      <AvatarFallback>
                        {getInitials(user.full_name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.full_name || user.email}</p>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {user.role || member.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(member.joined_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No team members found.</p>
            </CardContent>
          </Card>
        )}
    </div>
  )
}
