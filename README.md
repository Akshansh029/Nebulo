# Nebulo: GitHub Codebase Analyzer

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Clerk.js](https://img.shields.io/badge/Clerk.js-000000?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![tRPC](https://img.shields.io/badge/tRPC-000000?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-000000?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

Nebulo is a web application designed to analyze GitHub codebases. It provides repository analysis, AI-powered question answering, and automated README generation. Users can purchase credits to unlock advanced features.

![image](https://github.com/user-attachments/assets/0974643c-f6d2-4f94-83c7-49f720e96424)

## 🧪 Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Authentication**: Clerk.js
- **Backend**: tRPC, Prisma ORM, PostgreSQL (NeonDB)
- **AI Integration**: Google Gemini API
- **Payments**: Razorpay API
- **Others**: Vector database for embeddings, GitHub API


## 🚀 Features

- Landing page with hero section, navigation, and feature highlights
- Collapsible sidebar for navigation and project selection
- AI-powered question answering about codebases
- Automated README generation from the codebase
- Billing page for purchasing credits
- Project creation and GitHub repo syncing
- Responsive UI with protected routes and loading indicators

## 📸 Screenshots

- Dashboard page

![image](https://github.com/user-attachments/assets/9faccc3e-3cc9-4604-9fc4-13712381b5c7)

- QnA page

![image](https://github.com/user-attachments/assets/62ae3d6e-77e4-4831-aff8-7cddfe988657)

- Readme generator

![image](https://github.com/user-attachments/assets/f4d3bfd0-1b7f-4d2b-a972-d29fcc53a7de)

- Billing section

![image](https://github.com/user-attachments/assets/f3e35059-2b3a-408b-9704-912769641a81)

- Create project page

![image](https://github.com/user-attachments/assets/b2542fcf-9bba-44e8-b209-473240692e60)

## 📦 Usage Instructions

1. **Sign up and log in** with Clerk authentication.
2. **Create a project** by entering your GitHub repository URL.
3. **Analyze your codebase**, ask AI questions, and generate README in the QA/README section.
4. **Use the Billing page** to purchase credits if needed.
5. **Navigate easily** between projects using the collapsible sidebar.


## 📁 Project Structure

```text
  nebulo/
  ├── prisma/
  │   └── schema.prisma             # Prisma schema definition
  ├── public/                       # Public assets
  ├── src/
  │   ├── app/
  │   │   ├── (protected)/
  │   │   │   ├── api/
  │   │   │   │   ├── razorpay/
  │   │   │   │   │   └── route.ts   # Razorpay API route
  │   │   │   ├── billing/           # Billing page
  │   │   │   ├── create/            # Project creation page
  │   │   │   ├── dashboard/         # Project dashboard
  │   │   │   ├── join/              # Join project page
  │   │   │   ├── qa/                # AI Q&A page
  │   │   │   └── readme/            # Automated README generation
  │   │   ├── AppSidebar.tsx         # Sidebar component
  │   │   ├── layout.tsx             # Protected layout
  │   │   └── loading.tsx            # Loading spinner
  │   ├── _components/               # Reusable components
  │   ├── api/
  │   │   ├── trpc/                  # tRPC API routes
  │   │   └── webhooks/
  │   │       └── razorpay/
  │   │           └── route.ts       # Razorpay webhook handler
  │   ├── sign-in/                   # Sign-in page
  │   ├── sign-up/                   # Sign-up page
  │   ├── sync-user/                 # Sync GitHub user data
  │   ├── layout.tsx                 # Root layout
  │   └── page.tsx                   # Landing page
  ├── components/                    # UI components
  ├── hooks/
  │   ├── use-mobile.ts              # Mobile detection hook
  │   ├── use-project.ts             # Project context hook
  │   └── use-refetch.ts             # Custom refetch logic
  ├── lib/
  │   ├── gemini.ts                  # Google Gemini integration
  │   ├── github-loader.ts           # GitHub repo loader
  │   ├── github.ts                  # GitHub API helpers
  │   └── utils.ts                   # Utility functions
  ├── server/
  │   ├── api/                       # Server-side API
  │   └── db.ts                      # Prisma client setup
  ├── styles/                        # Global styles
  ├── trpc/                          # tRPC server setup
  ├── env.js                         # Environment validation
  ├── middleware.ts                  # Next.js middleware
  ├── .gitignore
  ├── README.md
  ├── bun.lock
  ├── components.json
  ├── eslint.config.js
  ├── next.config.js
  ├── package.json
  ├── package-lock.json
  ├── postcss.config.js
  ├── prettier.config.js
  ├── start-database.sh
  └── tsconfig.json
```

## Environment Variables

| Variable Name         | Description                                                              |
|-----------------------|--------------------------------------------------------------------------|
| DATABASE_URL          | URL for the database connection.                                         |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  | Clerk publishable Key.                                      |
| CLERK_SECRET_KEY      | Clerk auth secret key                                                    |
| NEXT_PUBLIC_CLERK_SIGN_IN_URL      | URL for Clerk sign-in page                                  |
| NEXT_PUBLIC_CLERK_SIGN_UP_URL      | URL for Clerk sign-in page                                  |
| NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL      | Fallback URL for sign-in                  |
| NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL      | Fallback URL for sign-up                  |
| NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL      | URL for forced redirect after sign-up        |
| NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL      | URL for forced redirect after sign-in        |
| GITHUB_TOKEN          | Personal GitHub token for GitHub API Usage                               |
| GEMINI_API_KEY        | Google Gemini API Key for LLM access.                                    |
| RAZORPAY_KEY_ID       | Razorpay Key ID for payment processing.                                  |
| RAZORPAY_KEY_SECRET   | Razorpay Key Secret for payment processing.                              |
| NEXT_PUBLIC_RAZORPAY_KEY_ID       | Razorpay Key ID for payment processing.                      |
| APP_URL              | The URL of the deployed application                                       |
| RAZORPAY_WEBHOOK_SECRET   | Secret for webhook integration of Razorpay                           |
