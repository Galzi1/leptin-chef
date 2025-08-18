import React, { useState } from 'react'
import {
  MaterialButton,
  MaterialCard,
  MaterialInput,
  MaterialListItem,
  MaterialTopBar,
  MaterialNavigationDrawer
} from './index'

export const DesignSystemDemo: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-surface-1">
      <MaterialTopBar 
        title="Design System Demo" 
        onMenuClick={() => setDrawerOpen(true)}
      />
      
      <MaterialNavigationDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
      >
        <div className="p-md space-material-md">
          <h2 className="text-headline-medium">Navigation</h2>
          <MaterialListItem onClick={() => console.log('Home clicked')}>
            Home
          </MaterialListItem>
          <MaterialListItem onClick={() => console.log('About clicked')}>
            About
          </MaterialListItem>
          <MaterialListItem onClick={() => console.log('Contact clicked')}>
            Contact
          </MaterialListItem>
        </div>
      </MaterialNavigationDrawer>

      <div className="container-responsive py-lg space-material-xl">
        {/* Typography Section */}
        <section className="space-material-lg">
          <h1 className="text-display-large text-primary-A400">Display Large</h1>
          <h2 className="text-display-medium">Display Medium</h2>
          <h3 className="text-display-small">Display Small</h3>
          <h4 className="text-headline-large">Headline Large</h4>
          <h5 className="text-headline-medium">Headline Medium</h5>
          <h6 className="text-headline-small">Headline Small</h6>
          <p className="text-body-large">Body Large - This is a larger body text for better readability on larger screens.</p>
          <p className="text-body-medium">Body Medium - This is the standard body text size used throughout the application.</p>
          <p className="text-body-small">Body Small - This is smaller body text for secondary information.</p>
        </section>

        {/* Buttons Section */}
        <section className="space-material-lg">
          <h2 className="text-headline-medium">Buttons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            <MaterialCard>
              <h3 className="text-title-medium mb-md">Button Variants</h3>
              <div className="space-material-sm">
                <MaterialButton>Primary Button</MaterialButton>
                <MaterialButton variant="outlined">Outlined Button</MaterialButton>
                <MaterialButton variant="text">Text Button</MaterialButton>
              </div>
            </MaterialCard>

            <MaterialCard>
              <h3 className="text-title-medium mb-md">Button Sizes</h3>
              <div className="space-material-sm">
                <MaterialButton size="small">Small</MaterialButton>
                <MaterialButton size="medium">Medium</MaterialButton>
                <MaterialButton size="large">Large</MaterialButton>
              </div>
            </MaterialCard>

            <MaterialCard>
              <h3 className="text-title-medium mb-md">Button States</h3>
              <div className="space-material-sm">
                <MaterialButton>Normal</MaterialButton>
                <MaterialButton disabled>Disabled</MaterialButton>
              </div>
            </MaterialCard>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-material-lg">
          <h2 className="text-headline-medium">Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            <MaterialCard elevation="low">
              <h3 className="text-title-medium">Low Elevation</h3>
              <p className="text-body-medium">This card has low elevation for subtle depth.</p>
            </MaterialCard>

            <MaterialCard elevation="medium">
              <h3 className="text-title-medium">Medium Elevation</h3>
              <p className="text-body-medium">This card has medium elevation for moderate depth.</p>
            </MaterialCard>

            <MaterialCard elevation="high">
              <h3 className="text-title-medium">High Elevation</h3>
              <p className="text-body-medium">This card has high elevation for prominent depth.</p>
            </MaterialCard>
          </div>
        </section>

        {/* Form Section */}
        <section className="space-material-lg">
          <h2 className="text-headline-medium">Form Inputs</h2>
          <MaterialCard padding="large">
            <div className="space-material-md">
              <MaterialInput
                label="Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
              
              <MaterialInput
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                helperText="We'll never share your email"
                required
              />
              
              <MaterialInput
                label="Message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                error="Message is required"
              />
              
              <MaterialButton size="large">
                Submit Form
              </MaterialButton>
            </div>
          </MaterialCard>
        </section>

        {/* List Section */}
        <section className="space-material-lg">
          <h2 className="text-headline-medium">List Items</h2>
          <MaterialCard>
            <div className="space-material-xs">
              <MaterialListItem onClick={() => console.log('Item 1 clicked')}>
                <span className="text-body-medium">Clickable List Item 1</span>
              </MaterialListItem>
              <MaterialListItem selected>
                <span className="text-body-medium">Selected List Item</span>
              </MaterialListItem>
              <MaterialListItem dense>
                <span className="text-body-small">Dense List Item</span>
              </MaterialListItem>
              <MaterialListItem disabled>
                <span className="text-body-medium">Disabled List Item</span>
              </MaterialListItem>
            </div>
          </MaterialCard>
        </section>

        {/* Responsive Utilities Section */}
        <section className="space-material-lg">
          <h2 className="text-headline-medium">Responsive Utilities</h2>
          <div className="grid grid-cols-1 gap-md">
            <MaterialCard>
              <div className="space-material-sm">
                <div className="mobile-only bg-primary-100 p-sm rounded">
                  <p className="text-body-medium">This content is only visible on mobile devices</p>
                </div>
                <div className="tablet-only bg-primary-200 p-sm rounded">
                  <p className="text-body-medium">This content is only visible on tablet devices</p>
                </div>
                <div className="desktop-only bg-primary-300 p-sm rounded">
                  <p className="text-body-medium">This content is only visible on desktop devices</p>
                </div>
              </div>
            </MaterialCard>
          </div>
        </section>

        {/* Spacing Utilities Section */}
        <section className="space-material-lg">
          <h2 className="text-headline-medium">Spacing Utilities</h2>
          <div className="grid grid-cols-1 gap-md">
            <MaterialCard>
              <div className="space-material-xs">
                <div className="bg-primary-100 p-xs rounded">Extra Small Spacing</div>
                <div className="bg-primary-200 p-xs rounded">Extra Small Spacing</div>
              </div>
            </MaterialCard>
            
            <MaterialCard>
              <div className="space-material-sm">
                <div className="bg-primary-100 p-xs rounded">Small Spacing</div>
                <div className="bg-primary-200 p-xs rounded">Small Spacing</div>
              </div>
            </MaterialCard>
            
            <MaterialCard>
              <div className="space-material-md">
                <div className="bg-primary-100 p-xs rounded">Medium Spacing</div>
                <div className="bg-primary-200 p-xs rounded">Medium Spacing</div>
              </div>
            </MaterialCard>
          </div>
        </section>
      </div>
    </div>
  )
}
