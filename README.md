
  # Doc Gift

  Doc Gift is a Vite + React demo app for a credit-based gift exchange platform. It simulates three roles:

  - Doctors browse products, manage a cart, and place orders using credits.
  - Sales representatives manage doctors, request credits, and submit new doctor requests.
  - Admin users manage products, review requests, and oversee the system.

  The app is front-end only and uses mocked in-memory data for users, products, orders, and approvals.

  ## Features

  - Role-based login for doctor, sales, and admin users
  - Doctor dashboard with credit summary, recent orders, and quick actions
  - Product catalog with search, category filtering, and cart support
  - Cart and checkout flow with delivery address confirmation
  - Sales dashboard for doctor management and credit requests
  - Admin dashboard for product management and request approvals
  - Responsive layout with shared dashboard navigation

  ## Tech Stack

  - React 18
  - TypeScript
  - Vite
  - React Router
  - Tailwind CSS
  - Radix UI components
  - Lucide icons

  ## Project Structure

  - `src/main.tsx` app entry point
  - `src/app/App.tsx` app shell and router provider
  - `src/app/routes.tsx` route definitions
  - `src/app/context/AppContext.tsx` shared in-memory app state and actions
  - `src/app/pages/doctor/` doctor views
  - `src/app/pages/sales/` sales views
  - `src/app/pages/admin/` admin views
  - `src/app/components/` shared UI and layout components

  ## Getting Started

  Install dependencies:

  ```bash
  npm install
  ```

  Start the development server:

  ```bash
  npm run dev
  ```

  Build for production:

  ```bash
  npm run build
  ```

  ## How It Works

  - Login checks the entered identifier against the seeded mock users in `AppContext.tsx`.
  - Doctors authenticate with a company ID format like `DOC-XXXXX`.
  - Sales reps and admins authenticate with email and password.
  - All actions update client-side React state only; nothing is persisted to a backend.

  ## Demo Data

  The app includes seeded doctors, sales reps, an admin account, products, orders, and requests for local testing.
  If you plan to turn this into a real app, replace the mocked credentials and in-memory state with a backend and secure authentication.

  ## Notes

  - The project is designed as a UI/demo bundle.
  - Some account data is hardcoded for local development and should not be used in production.
  - Add environment-based secrets before deploying any real system.
  