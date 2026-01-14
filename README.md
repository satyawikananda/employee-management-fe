# Employee Management System

A web application for managing employees built with [Next.js](https://nextjs.org), designed to be fast, responsive, and easy to use.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) & [Shadcn UI](https://ui.shadcn.com)
- **State Management & Data Fetching:** [React Query (TanStack Query)](https://tanstack.com/query/latest)
- **Authentication:** [NextAuth.js](https://next-auth.js.org)
- **Form Handling:** [React Hook Form](https://react-hook-form.com) & [Zod](https://zod.dev)
- **Testing:** [Vitest](https://vitest.dev) & [React Testing Library](https://testing-library.com)

## 📋 Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org) (v18.17.0 or later)
- [npm](https://www.npmjs.com/) (or yarn/pnpm/bun)

## 🛠️ Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd employee_management_fe
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup:**

    Create a `.env` file in the root directory of the project. You can copy the structure below or check for an `.env.example` file if available.

    ```bash
    touch .env
    ```

    Add the following environment variables to `.env`:

    ```env
    # API Configuration
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 # Replace with your actual API base URL

    # NextAuth Configuration
    NEXTAUTH_SECRET=your_nextauth_secret_key # Generate a secure random string
    NEXTAUTH_URL=http://localhost:3000 # The URL of your frontend application
    ```

## 🏃‍♂️ Running the Application

### Development Mode

To start the development server with hot-reloading:

````bash
npm run dev
# or
pnpm dev

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### Production Build

To build the application for production:

```bash
npm run build
# or
pnpm build
````

To start the production server:

```bash
npm run start
# or
pnpm start
```

## 📜 Available Scripts

- `pnpm run dev`: Starts the development server.
- `pnpm run build`: Builds the application for production.
- `pnpm run start`: Starts the production server.
- `pnpm run lint`: Runs ESLint to catch code quality issues.
- `pnpm run test`: Runs unit tests using Vitest.
- `pnpm run add-ui`: Helper script to add Shadcn UI components (uses `pnpx shadow-cl@latest add`).
