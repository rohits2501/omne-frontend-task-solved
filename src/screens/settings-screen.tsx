import { Bell, Globe, Lock, type LucideIcon, User } from 'lucide-react'
import { PageHeader } from '../components/layout/page-header'
import { Card } from '../components/ui/card'

interface SettingItem {
  icon: LucideIcon
  title: string
  description: string
}

const SETTINGS: SettingItem[] = [
  {
    icon: User,
    title: 'Profile Settings',
    description: 'Update your personal information',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Configure notification preferences',
  },
  {
    icon: Lock,
    title: 'Privacy',
    description: 'Manage privacy and security settings',
  },
  {
    icon: Globe,
    title: 'Language & Region',
    description: 'Set your language and timezone',
  },
]

export function SettingsScreen() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Settings" description="Manage your account and preferences" />

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-3">
          {SETTINGS.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="px-5 py-4">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-raised text-foreground-muted">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-medium text-foreground">{title}</h3>
                  <p className="text-sm text-foreground-muted">{description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
