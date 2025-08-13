const SavedRecipesPage = () => {
  return (
    <div className="container-responsive spacing-responsive">
      <div className="material-card">
        <h1 className="text-2xl font-semibold text-on-surface-1 mb-lg">
          Saved Recipes
        </h1>
        
        {/* Search Box */}
        <div className="mb-lg">
          <div className="relative">
            <span className="material-icons absolute left-sm top-1/2 transform -translate-y-1/2 text-on-surface-3">
              search
            </span>
            <input
              type="text"
              placeholder="Search recipes..."
              className="material-input pl-xl"
            />
          </div>
        </div>

        {/* Recipes List */}
        <div className="space-y-sm">
          <p className="text-on-surface-3 italic text-center py-lg">
            No saved recipes yet. Start chatting to create your first recipe!
          </p>
        </div>
      </div>
    </div>
  )
}

export default SavedRecipesPage

