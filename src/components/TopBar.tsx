import { useLocation } from 'react-router-dom'
import { useNavigationStore } from '@/stores/navigationStore'

const TopBar = () => {
  const location = useLocation()
  const { toggleDrawer } = useNavigationStore()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home'
      case '/conversations':
        return 'Conversations'
      case '/saved-recipes':
        return 'Saved Recipes'
      case '/inventory':
        return 'My Inventory'
      case '/user':
        return 'User Profile'
      default:
        return 'Leptin Chef'
    }
  }

  return (
    <header className="material-top-bar">
      <div className="flex items-center space-x-md">
        <button
          onClick={toggleDrawer}
          className="p-sm rounded-md hover:bg-surface-2 transition-colors duration-200"
          aria-label="Toggle navigation menu"
        >
          <span className="material-icons text-on-surface-1">menu</span>
        </button>
        <h1 className="text-xl font-medium text-on-surface-1">
          {getPageTitle()}
        </h1>
      </div>
    </header>
  )
}

export default TopBar

