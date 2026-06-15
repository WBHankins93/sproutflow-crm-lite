import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getInitials } from '@/lib/utils'

type TeamUser = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: string | null
}

type TeamMember = {
  id: string
  user_id: string
  role: string
  joined_at: string
  user: TeamUser | null
}

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: teamMemberRows, error } = await supabase
    .from('team_members')
    .select('id, user_id, role, joined_at')
    .order('joined_at', { ascending: false })

  const userIds = teamMemberRows?.map((member) => member.user_id) || []
  const { data: users } = userIds.length > 0
    ? await supabase
      .from('users')
      .select('id, email, full_name, avatar_url, role')
      .in('id', userIds)
    : { data: [] }

  const usersById = new Map((users || []).map((user) => [user.id, user]))
  const teamMembers: TeamMember[] = (teamMemberRows || []).map((member) => ({
    ...member,
    user: usersById.get(member.user_id) || null,
  }))
  const memberCount = teamMembers?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account and team settings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users2 className="h-5 w-5" />
            <CardTitle>Team Members</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-destructive">Error loading team members: {error.message}</p>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                {memberCount} {memberCount === 1 ? 'member' : 'members'} in your team
              </p>
              {teamMembers.map((member) => {
                const user = member.user
                if (!user) return null
                
                return (
                  <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
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
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(member.joined_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No team members found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
