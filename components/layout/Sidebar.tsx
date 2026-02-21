'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  MessageSquare,
  MessageCircle,
  FileText,
  BarChart3,
  Building2,
  Settings,
  User,
  Bell,
  Lock,
  Building,
  Users2,
  FileCheck,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'SALES',
    items: [
      {
        name: 'Deals Pipeline',
        href: '/deals',
        icon: TrendingUp,
      },
      {
        name: 'My Schedule',
        href: '/schedule',
        icon: LayoutDashboard,
      },
      {
        name: 'Leads',
        href: '/leads',
        icon: Users,
      },
    ],
  },
  {
    name: 'CLIENTS',
    items: [
      {
        name: 'All Clients',
        href: '/clients',
        icon: Users2,
      },
      {
        name: 'Policies & Renewals',
        href: '/policies',
        icon: FileCheck,
      },
      {
        name: 'Commissions',
        href: '/commissions',
        icon: Building2,
      },
    ],
  },
  {
    name: 'COMMUNICATION',
    items: [
      {
        name: 'Messages',
        href: '/messages',
        icon: MessageSquare,
      },
      {
        name: 'Team Chat',
        href: '/team-chat',
        icon: MessageCircle,
      },
    ],
  },
  {
    name: 'RESOURCES',
    items: [
      {
        name: 'Documents',
        href: '/documents',
        icon: FileText,
      },
      {
        name: 'Reports',
        href: '/reports',
        icon: BarChart3,
      },
    ],
  },
  {
    name: 'ADMIN',
    items: [
      {
        name: 'Carrier Access',
        href: '/carrier-access',
        icon: Building,
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    pathname === item.href
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                    {item.name}
                  </div>
                  {item.items?.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ml-4',
                        pathname === subItem.href
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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
      </div>
    </div>
  )
}
