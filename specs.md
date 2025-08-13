* General details:  
  * App name: Leptin Chef  
  * App icon: A combination of a chef’s hat and a green young plant growing from a layer of soil  
  * Design style: Material Design ([https://m2.material.io](https://m2.material.io))  
  * Color scheme: Based on the primary color of \#00E676 (A400 in Material Design). The rest of the colors should match this primary color according to Material Design principles ([https://m2.material.io/design/color/the-color-system.html\#tools-for-picking-colors](https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors))
* Technical specifications:
  * Tech stack:
    * Frontend: Vite + React + TypeScript + Tailwind CSS + React Router + Zustand + React Query
    * Backend: Node.js + TypeScript + Next.js API routes + Zod validation
    * Testing: Vitest (unit & integration tests) + TDD/BDD methodology
    * Build tool: Vite for fast development and optimized production builds
  * Cross-platform deployment:
    * Primary target: Web application (responsive design)
    * Secondary target: Android application using the same codebase
    * No code duplication between web and mobile versions
    * Responsive design must work seamlessly on mobile devices
  * Development methodology:
    * Test-Driven Development (TDD) approach using Vitest
    * Behavior-Driven Development (BDD) for user stories and acceptance criteria
    * All features must be developed with tests written first
    * Continuous integration with automated testing
* Layout:  
  * Top bar ([https://m2.material.io/components/app-bars-top](https://m2.material.io/components/app-bars-top)):  
    * Navigation icon (“hamburger” icon)  
    * Page title: Contextual according to the page  
  * Navigation menu (opens from the Top bar, [https://m2.material.io/components/navigation-drawer](https://m2.material.io/components/navigation-drawer)):  
    * Header:  
      * Avatar icon (either the user’s profile picture or the first letter of the user's name in white, with a background of \#00E676)  
    * Pages (will be specified in details later):  
      * Home  
      * Conversations  
      * Saved Recipes  
      * My Inventory  
  * User page (opens by clicking the Avatar icon):  
    * Profile (can change the user name (the one the AI will refer, not to be confused with the username/email) and the profile picture)  
    * My plan  
    * Preferences  
      * Measurement style (metric/US)  
      * Data control  
        * Export data  
        * Erase data  
    * About (with a short explanation about the application and its developer)  
  * Pages details:  
    * Home  
      * Chat button (opens the Chat page)  
      * Top 5 recipes by usage (list)  
      * 5 Most recently added recipes  
    * Conversations  
      * Search box (filters the user’s chats accordingly)  
      * List of chats ordered by most recent activity (two-line list, the first line is a short and concise summary of the chat, and the second line is the date and time of the most recent activity. See: [https://m2.material.io/components/lists](https://m2.material.io/components/lists))  
    * Chat (opened from the Home or Conversations pages)  
      * Similar to modern chatting UI, such as ChatGPT or Telegram. The user will communicate with   
    * Saved Recipes  
      * Search box (filters the user’s recipes accordingly)  
      * List of recipes (the recipes’ titles). Can be sorted by date added and last opened. See: [https://m2.material.io/components/lists](https://m2.material.io/components/lists)  
    * Recipe (opened from the Home or Saved Recipes pages)  
      * Title  
      * Picture (optional)  
      * Ingredients (list [https://m2.material.io/components/lists](https://m2.material.io/components/lists))  
      * Method  
    * My Inventory  
      * Edit button (allows adding editing and deleting items from the inventory)  
      * List ([https://m2.material.io/components/lists](https://m2.material.io/components/lists))  
      * Includes a uniqueness check