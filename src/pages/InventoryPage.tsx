const InventoryPage = () => {
  return (
    <div className="container-responsive spacing-responsive">
      <div className="material-card">
        <div className="flex justify-between items-center mb-lg">
          <h1 className="text-2xl font-semibold text-on-surface-1">
            My Inventory
          </h1>
          <button className="material-button-outlined">
            <span className="material-icons mr-sm">edit</span>
            Edit
          </button>
        </div>

        {/* Inventory List */}
        <div className="space-y-sm">
          <p className="text-on-surface-3 italic text-center py-lg">
            No inventory items yet. Add your first ingredient!
          </p>
        </div>
      </div>
    </div>
  )
}

export default InventoryPage

