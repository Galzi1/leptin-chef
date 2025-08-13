import { ReactNode } from 'react'
import TopBar from './TopBar'
import NavigationDrawer from './NavigationDrawer'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-surface-1">
      <TopBar />
      <div className="flex">
        <NavigationDrawer />
        <main className="flex-1 p-md">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout

