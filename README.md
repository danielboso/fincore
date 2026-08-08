<!-- fincore banner/logo placeholder -->
<div align="center">
  <h1>💰 Fincore</h1>
  <p><b>Your Personal Financial Command Center for Casa OS</b></p>

  <p>
    <a href="https://github.com/danielboso/fincore/issues">
      <img src="https://img.shields.io/github/issues/danielboso/fincore?style=flat-square&color=blue" alt="Issues" />
    </a>
    <a href="https://github.com/danielboso/fincore/network/members">
      <img src="https://img.shields.io/github/forks/danielboso/fincore?style=flat-square&color=blue" alt="Forks" />
    </a>
    <a href="https://github.com/danielboso/fincore/stargazers">
      <img src="https://img.shields.io/github/stars/danielboso/fincore?style=flat-square&color=blue" alt="Stars" />
    </a>
    <a href="./LICENSE">
      <img src="https://img.shields.io/github/license/danielboso/fincore?style=flat-square&color=blue" alt="License" />
    </a>
  </p>
</div>

---

## 📖 About The Project

**Fincore** is an open-source, beautifully designed personal financial management tool built with self-hosting in mind. Specifically tailored for seamless integration with **Casa OS**, it allows you to take full control of your financial data without relying on third-party cloud services.

### 🎯 The Mission
To provide a fast, privacy-first, and highly visual way to track income, expenses, and budgets—all living safely on your own personal server.

## ✨ Key Features (Planned)

*   **📊 Interactive Dashboard**: Visual insights into your cash flow, net worth, and spending habits.
*   **💸 Expense & Income Tracking**: Easily categorize and log your daily transactions.
*   **🎯 Smart Budgeting**: Set limits on categories and receive alerts as you approach them.
*   **🏠 Casa OS First**: Designed to be a 1-click install on Casa OS.
*   **🔒 Privacy Focused**: 100% self-hosted. Your financial data never leaves your home network.
*   **📱 Responsive UI**: Looks great on desktop, tablet, and mobile.

## 🏗️ Architecture & Tech Stack

Fincore is structured as a modern monorepo using **pnpm workspaces**. The frontend is a high-performance Single Page Application (SPA) strictly adhering to a feature-sliced architectural blueprint.

### 💻 Frontend Stack

*   **Core**: React 19, TypeScript, Vite
*   **Routing**: TanStack Router (File-based routing)
*   **State Management**: TanStack Query (Server State), Zustand (Client State)
*   **Forms & Validation**: TanStack Form, Valibot
*   **Data Grids**: TanStack Table, TanStack Virtual
*   **Styling & UI**: Tailwind CSS v4, Radix UI, Motion, class-variance-authority (CVA)
*   **Testing**: Vitest, MSW (Mock Service Worker), Testing Library

### 🧱 Frontend Architecture Layers

The frontend application (`apps/frontend/src`) enforces strict dependency boundaries across the following layers:

*   `core/`: Technical foundation (API clients, query configurations, global stores, auth, i18n).
*   `ui/`: Pure design system and reusable primitives (dumb components, no business logic).
*   `pattern/`: Shared mid-level components built on top of `ui/` and `core/` (e.g., form infrastructure, complex data grids).
*   `layouts/`: Pure structural layouts composing the application's visual shell.
*   `features/`: Self-contained business modules grouping their own components, hooks, schemas, and utilities.
*   `routes/`: Thin route definitions handling guards, data prefetching, and layout/feature composition.
*   `mocks/`: MSW handlers and setup for reliable development and testing.

### ⚙️ Backend & Deployment
*(Details pending backend implementation)*
*   **Database**: SQLite / PostgreSQL (Planned)
*   **Deployment**: Docker / Docker Compose (Optimized for Casa OS)

## 🚀 Getting Started

### 🐳 Manual Docker Compose Deployment

If you want to run Fincore on a standard Docker server using Docker Compose:

1. Create a `docker-compose.yml` file with the following configuration:
   ```yaml
   version: '3.8'
   services:
     app:
       image: ghcr.io/danielboso/fincore:latest
       container_name: fincore-app
       restart: unless-stopped
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=postgres://fincore_user:fincore_pass@db:5432/fincore_db
         - PORT=3000
       depends_on:
         - db
     db:
       image: postgres:18-alpine
       container_name: fincore-db
       restart: unless-stopped
       environment:
         POSTGRES_USER: fincore_user
         POSTGRES_PASSWORD: fincore_pass
         POSTGRES_DB: fincore_db
       volumes:
         - postgres_data:/var/lib/postgresql/data
   volumes:
     postgres_data:
   ```
2. Run the deployment command:
   ```bash
   docker compose up -d
   ```
3. Fincore will be available at `http://localhost:3000`. Database migrations will automatically run on startup.

### Local Development Setup

To run Fincore on your local machine for development:

1. Clone the repo:
   ```bash
   git clone https://github.com/danielboso/fincore.git
   cd fincore
   ```
2. Install dependencies:
   ```bash
   npm install # or yarn/pnpm
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---
<div align="center">
  Built with ❤️ for the self-hosting community.
</div>