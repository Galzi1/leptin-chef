import { useUserStore } from '@/stores/userStore'

const UserPage = () => {
  const { user } = useUserStore()

  return (
    <div className="container-responsive spacing-responsive">
      <div className="material-card">
        <h1 className="text-2xl font-semibold text-on-surface-1 mb-lg">
          User Profile
        </h1>
        
        <div className="space-y-lg">
          {/* Profile Section */}
          <div>
            <h2 className="text-xl font-medium text-on-surface-1 mb-md">
              Profile
            </h2>
            <div className="space-y-md">
              <div>
                <label className="block text-sm font-medium text-on-surface-2 mb-sm">
                  Display Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || ''}
                  className="material-input"
                  placeholder="Enter your display name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-2 mb-sm">
                  Profile Picture
                </label>
                <button className="material-button-outlined">
                  <span className="material-icons mr-sm">photo_camera</span>
                  Upload Photo
                </button>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div>
            <h2 className="text-xl font-medium text-on-surface-1 mb-md">
              Preferences
            </h2>
            <div className="space-y-md">
              <div>
                <label className="block text-sm font-medium text-on-surface-2 mb-sm">
                  Measurement Style
                </label>
                <select className="material-input">
                  <option value="metric">Metric</option>
                  <option value="us">US</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Control Section */}
          <div>
            <h2 className="text-xl font-medium text-on-surface-1 mb-md">
              Data Control
            </h2>
            <div className="space-y-sm">
              <button className="material-button-outlined w-full">
                <span className="material-icons mr-sm">download</span>
                Export Data
              </button>
              <button className="material-button-outlined w-full text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                <span className="material-icons mr-sm">delete_forever</span>
                Erase All Data
              </button>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h2 className="text-xl font-medium text-on-surface-1 mb-md">
              About
            </h2>
            <div className="text-on-surface-3 space-y-sm">
              <p>
                Leptin Chef is an AI-powered cooking assistant that helps you create
                delicious meals with the ingredients you have available.
              </p>
              <p>
                Version: 1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPage

