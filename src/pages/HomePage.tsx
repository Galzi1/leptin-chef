import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="container-responsive spacing-responsive">
      <div className="text-center py-xl">
        <h1 className="text-3xl font-bold text-on-surface-1 mb-md">
          Welcome to Leptin Chef
        </h1>
        <p className="text-lg text-on-surface-3 mb-xl">
          Your AI-powered cooking assistant
        </p>
        
        <Link
          to="/conversations"
          className="material-button text-lg px-xl py-lg inline-flex items-center"
        >
          <span className="material-icons mr-sm">chat</span>
          Start Cooking Chat
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-lg">
        {/* Top 5 Recipes by Usage */}
        <div className="material-card">
          <h2 className="text-xl font-semibold text-on-surface-1 mb-md">
            Top Recipes by Usage
          </h2>
          <div className="space-y-sm">
            <p className="text-on-surface-3 italic">
              No recipes yet. Start chatting to create your first recipe!
            </p>
          </div>
        </div>

        {/* 5 Most Recently Added Recipes */}
        <div className="material-card">
          <h2 className="text-xl font-semibold text-on-surface-1 mb-md">
            Recently Added Recipes
          </h2>
          <div className="space-y-sm">
            <p className="text-on-surface-3 italic">
              No recipes yet. Start chatting to create your first recipe!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

