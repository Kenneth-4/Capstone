# Lampkonek - Membership & Attendance Management System

Lampkonek is a comprehensive web application designed for managing members, tracking attendance, and organizing ministries. It provides a robust dashboard for administrators to oversee operations, manage user roles, and generate reports.

## 🚀 Tech Stack

- **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Backend/Database:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Deployment:** [Vercel](https://vercel.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

---

## 🛠️ Local Setup Instructions

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.
- A [Supabase](https://supabase.com/) account.

### 2. Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd Lampkonek

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🏗️ Supabase Setup

This project relies on Supabase for Authentication and Data storage. You need to set up the database schema using the provided SQL scripts.

### 1. Database Schema
Go to your Supabase Project -> **SQL Editor** and execute the scripts found in the `/querys` folder in the following suggested order:

1. `supabase_setup.sql`: Core profiles table and triggers.
2. `supabase_roles_setup.sql`: Define user roles.
3. `supabase_clusters_setup.sql`: Set up cluster management.
4. `supabase_ministries_setup.sql`: Set up ministry management.
5. `create_reservations_table.sql`: Reservation system.
6. `supabase_attendance_setup.sql`: Attendance tracking logic.
7. `supabase_settings_setup.sql`: App settings and announcements.

### 2. Promote to Administrator
After creating your account via the app, you need to manually promote your user to an Administrator:
- Run `set_administrator.sql` in the SQL Editor.
- **Important:** Edit the file to replace `'your-email@example.com'` with your actual email address before running.

### 3. Authentication
- Enable **Email/Password** provider in Supabase Auth settings.
- Ensure the `handle_new_user` trigger (in `supabase_setup.sql`) is active to automatically create profiles on signup.

---

## 🌐 Vercel Deployment

Deploying the Vite application to Vercel is straightforward.

### 1. Connect Repository
- Push your code to GitHub/GitLab/Bitbucket.
- Import the project into your [Vercel Dashboard](https://vercel.com/new).

### 2. Configure Project
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3. Add Environment Variables
Add the following keys in the Vercel project settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 4. Deploy
Once configured, Vercel will build and deploy your application. The `vercel.json` file in the root handles the SPA routing to ensure all paths lead to `index.html`.

---

## 📂 Project Structure

- `src/pages`: Contains all page components (Auth, Dashboard, Members, etc.).
- `src/components`: Reusable UI components and Modals.
- `src/lib/supabase.ts`: Supabase client initialization.
- `src/context`: Auth state management.
- `querys/`: SQL migration and setup scripts.
- `public/`: Static assets.

## 📝 Key Features

- **User Authentication:** Secure login and signup with metadata-linked profiles.
- **Role-Based Access:** Manage permissions via distinct roles (Admin, Ministry Leader, Volunteer, Member).
- **Member Management:** Add, edit, and track member details across clusters.
- **Attendance Tracking:** Real-time attendance checklists and comprehensive reporting.
- **Cluster & Ministry Organization:** Group members into clusters or ministries for better organization.
- **Reservation System:** Manage event or space reservations with status tracking.
- **Data Analytics:** Interactive charts for growth and attendance metrics using Recharts.
