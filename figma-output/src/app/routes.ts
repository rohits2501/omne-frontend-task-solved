import { createBrowserRouter } from 'react-router'
import { CreateUpdate } from './components/CreateUpdate'
import { Layout } from './components/Layout'
import { MyUpdates } from './components/MyUpdates'
import { Settings } from './components/Settings'
import { StatusFeed } from './components/StatusFeed'
import { TeamOverview } from './components/TeamOverview'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: StatusFeed },
      { path: 'create', Component: CreateUpdate },
      { path: 'my-updates', Component: MyUpdates },
      { path: 'team', Component: TeamOverview },
      { path: 'settings', Component: Settings },
    ],
  },
])
