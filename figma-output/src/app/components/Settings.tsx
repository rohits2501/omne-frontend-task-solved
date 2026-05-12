import { Bell, Globe, Lock, User } from 'lucide-react'

export function Settings() {
  return (
    <div className="h-full overflow-auto bg-neutral-50">
      <div className="px-8 py-6">
        <div className="mb-8">
          <h2 className="text-neutral-900 mb-2">Settings</h2>
          <p className="text-neutral-600">Manage your account and preferences</p>
        </div>

        <div className="max-w-2xl space-y-4">
          {[
            {
              icon: User,
              label: 'Profile Settings',
              description: 'Update your personal information',
            },
            {
              icon: Bell,
              label: 'Notifications',
              description: 'Configure notification preferences',
            },
            { icon: Lock, label: 'Privacy', description: 'Manage privacy and security settings' },
            {
              icon: Globe,
              label: 'Language & Region',
              description: 'Set your language and timezone',
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-neutral-100 rounded-lg">
                    <Icon className="w-6 h-6 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="text-neutral-900 mb-1">{item.label}</h3>
                    <p className="text-neutral-600 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
