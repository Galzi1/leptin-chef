import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ConversationsPage from './pages/ConversationsPage'
import SavedRecipesPage from './pages/SavedRecipesPage'
import InventoryPage from './pages/InventoryPage'
import UserPage from './pages/UserPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/conversations" element={<ConversationsPage />} />
        <Route path="/saved-recipes" element={<SavedRecipesPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </Layout>
  )
}

export default App

