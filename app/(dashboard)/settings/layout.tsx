'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Bell, Lock, Building, Users2, FileCheck, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

const settingsNav = [
  {
    name: 'Profile',
    href: '/settings/profile',
    icon: User,
  },
  {
    name: 'Notifications',
    href: '/settings/notifications',
    icon: Bell,
  },
  {
    name: 'Security',
    href: '/settings/security',
    icon: Lock,
  },
  {
    name: 'Company',
    href: '/settings/company',
    icon: Building,
  },
  {
    name: 'ADMIN',
    items: [
      {
        name: 'Team Members',
        href: '/settings/team-members',
        icon: Users2,
      },
      {
        name: 'Agency Access',
        href: '/settings/agency-access',
        icon: FileCheck,
      },
      {
        name: 'Activity Monitor',
        href: '/settings/activity',
        icon: Activity,
      },
    ],
  },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  return (
    <div className="flex h-full">
      <aside className="w-64 border-r bg-background p-4">
        <nav className="space-y-1">
          {settingsNav.map((item) => (
            <div key={item.name}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.name}
                  </div>
                  {item.items?.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ml-4',
                        pathname === subItem.href
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <subItem.icon className="mr-3 h-5 w-5" />
                      {subItem.name}
                    </Link>
                  ))}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  )
}
