# Alpha Store - Project TODO

## Database & Schema
- [x] Create bots table with fields: id, name, description, type, price, purchaseLink, adminId, createdAt, updatedAt
- [x] Create user-bot relationship table for tracking bot ownership
- [x] Add Discord profile fields to users table (discordId, discordUsername, discordAvatar)
- [x] Run database migrations with `pnpm db:push`

## Discord OAuth & Authentication
- [x] Configure Discord OAuth with Manus auth system
- [x] Create user linking between Discord and website accounts
- [x] Add Discord profile data to user record on first login
- [x] Implement protected procedures for authenticated users
- [x] Create logout functionality

## Bot Marketplace
- [x] Build bots listing page with bot cards showing: name, description, type, price, purchase button
- [x] Create bot detail view with full information
- [ ] Implement search/filter functionality for bots
- [x] Add responsive grid layout for bot display
- [x] Create "Buy Now" button with purchase flow

## Admin Dashboard
- [x] Build admin-only dashboard layout with sidebar navigation
- [x] Create "Add Bot" form with fields: name, description, type, price, purchase link
- [x] Implement "Edit Bot" functionality
- [x] Implement "Delete Bot" functionality
- [x] Add bot management table with actions
- [x] Restrict admin access to owner only (role-based)

## Payment Integration (Paylink.sa)
- [x] Add Paylink.sa integration code as placeholder/skeleton
- [x] Create payment procedure in tRPC router
- [ ] Implement redirect to Paylink.sa payment gateway
- [ ] Add payment verification webhook handler (ready for later)
- [x] Keep payment code inactive until merchant account is provided

## Design & UI
- [x] Implement Blueprint/technical aesthetic with white grid background
- [x] Add geometric diagrams and algebraic formula elements
- [x] Use bold black sans-serif for headlines
- [x] Use monospaced technical labels for details
- [x] Add pastel cyan and soft pink wireframe shapes
- [x] Integrate Alpha logo in header and landing page
- [x] Create consistent color palette and typography system
- [x] Ensure responsive design for mobile/tablet/desktop

## Testing
- [ ] Write vitest tests for Discord OAuth flow
- [x] Write vitest tests for bot CRUD operations
- [x] Write vitest tests for admin-only access control
- [ ] Write vitest tests for user linking functionality

## Deployment & Delivery
- [ ] Verify all features work end-to-end
- [ ] Test Discord login flow
- [ ] Test bot listing and purchase flow
- [ ] Test admin dashboard functionality
- [ ] Create checkpoint for deployment
- [ ] Provide deployment instructions and URLs to user


## Discord OAuth Integration (Custom)
- [x] Get Discord Client ID and Client Secret from user
- [x] Implement custom Discord OAuth flow (not Manus)
- [x] Create Discord login endpoint
- [x] Create Discord callback handler
- [x] Store Discord user data in database
- [x] Create login page with Discord button
- [x] Update authentication system to use Discord tokens
- [x] Test Discord login flow end-to-end


## Remove Manus OAuth - Complete Refactor
- [x] Remove Manus OAuth from context.ts
- [x] Update useAuth hook to use Discord tokens only
- [x] Remove Manus OAuth routes and references
- [x] Update all pages to use Discord auth
- [x] Update tRPC procedures to use Discord user context
- [x] Remove getLoginUrl and replace with Discord login
- [x] Test all authentication flows


## New Features - Phase 2
- [x] Add Discord profile picture to header (top right)
- [x] Create profile dropdown menu with logout option
- [x] Build Settings page with language toggle (AR/EN)
- [x] Add dark/light theme toggle in settings
- [ ] Remove background from Alpha logo (make transparent)
- [x] Enhance admin system - only owner can manage admins
- [x] Add admin management UI in settings
- [ ] Promote user 6uvu to admin
- [x] Create animated background (black + dark blue gradient)
- [x] Implement dark/light mode context and styling
- [x] Add theme persistence to localStorage


## Bug Fixes & Improvements
- [x] Apply theme/language changes globally to entire website
- [x] Add Discord logo and username in header
- [x] Improve animated background (more smooth and comfortable)
- [x] Remove statistics/analytics section from pages


## Phase 3: Bot Management & User Dashboard (NEW)
- [ ] Add `user_bots` table to track bot ownership
- [ ] Add `bot_tokens` table for encrypted bot tokens
- [ ] Add `status` field to bots table (running/stopped)
- [ ] Add `purchaseDate` field to user_bots table
- [ ] Create admin bot management page (/admin/bots-management)
- [ ] Add bot token input field with encryption
- [ ] Add dropdown to link bot with marketplace bot
- [ ] Create user dashboard page (/dashboard)
- [ ] Add statistics section (total bots, active bots)
- [ ] Display owned bots list with status indicators
- [ ] Add Start/Stop buttons for bot control
- [ ] Implement Discord API integration for bot control
- [ ] Add bot control endpoints (start/stop)
- [ ] Test bot start/stop functionality
