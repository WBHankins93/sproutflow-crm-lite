import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

type TeamUser = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: string | null
}

type TeamMember = {
  id: string
  role: string
  joined_at: string
  users: TeamUser | null
}

function getInitials(name?: string | null, email?: string | null) {
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

export default async function SettingsPage() {
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
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
              {(teamMembers as TeamMember[]).map((member) => {
                const user = member.users
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
