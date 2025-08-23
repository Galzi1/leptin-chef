import { Link } from 'react-router-dom'
import { useNavigationStore } from '@/stores/navigationStore'
import UserAvatar from './UserAvatar'

const NavigationDrawer = () => {
  const { isDrawerOpen, closeDrawer } = useNavigationStore()

  const navigationItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/conversations', label: 'Conversations', icon: 'chat' },
    { path: '/saved-recipes', label: 'Saved Recipes', icon: 'bookmark' },
    { path: '/inventory', label: 'My Inventory', icon: 'inventory' },
  ]

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeDrawer}
        />
      )}
      
      {/* Drawer */}
      <nav
        className={`fixed top-0 left-0 h-full z-50 material-navigation-drawer 
                   transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header with Avatar */}
          <div className="p-md border-b border-surface-3">
            <div className="flex items-center space-x-md">
              <UserAvatar />
              <div>
                <h2 className="font-medium text-on-surface-1">Leptin Chef</h2>
                <p className="text-sm text-on-surface-4">AI Cooking Assistant</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-md">
            <ul className="space-y-sm">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeDrawer}
                    className="material-list-item rounded-md"
                  >
                    <span className="material-icons text-on-surface-3 mr-md">
                      {item.icon}
                    </span>
                    <span className="text-on-surface-1">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="p-md border-t border-surface-3">
            <Link
              to="/user"
              onClick={closeDrawer}
              className="material-list-item rounded-md"
            >
              <span className="material-icons text-on-surface-3 mr-md">
                person
              </span>
              <span className="text-on-surface-1">User Settings</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavigationDrawer

