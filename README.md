# ⬡ Agency ERP — Next.js + Supabase

A full-featured Social Media Marketing ERP built with **Next.js 14**, **Tailwind CSS**, and **Supabase**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Supabase
Open `.env.local` and paste your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```
> Find these at: **supabase.com → Your Project → Project Settings → API**

### 3. Set up database tables
Go to your Supabase project → **SQL Editor** → paste and run the SQL below.

### 4. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Supabase Database Schema

Run this SQL in your Supabase **SQL Editor**:

```sql
-- CLIENTS
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  client_code text,
  name text not null,
  industry text,
  brand_tone text,
  contact_name text,
  contact_email text,
  contact_phone text
);

-- EMPLOYEES
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  emp_id text,
  name text not null,
  role text,
  department text,
  email text
);

-- DELIVERABLES
create table if not exists deliverables (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  client_id uuid references clients(id) on delete cascade,
  activity_code text not null,
  activity_type text default 'AT001', -- AT001=Post, AT002=Reel, AT004=YTShort, AT005=YTLong
  date date,
  platform text,
  notes text
);

-- DAILY TRACKER
create table if not exists daily_tracker (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  deliverable_id uuid references deliverables(id) on delete cascade,
  content_status text,
  creative_status text,
  client_status text,
  posting_status text,
  notes text
);

-- JOB TRACKER
create table if not exists job_tracker (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  deliverable_id uuid references deliverables(id) on delete cascade,
  assigned_to uuid references employees(id) on delete set null,
  task_type text,
  is_correction boolean default false,
  status text default 'Pending',
  notes text
);

-- CONTENT DETAILS
create table if not exists content_details (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  deliverable_id uuid references deliverables(id) on delete cascade,
  title text,
  copy text,
  description text,
  thumbnail_content text,
  reference text,
  rough_cut text,
  final_output text,
  thumbnail text,
  content_approval_status text default 'Content Not Written'
);

-- Enable Row Level Security (basic - allow authenticated users full access)
alter table clients enable row level security;
alter table employees enable row level security;
alter table deliverables enable row level security;
alter table daily_tracker enable row level security;
alter table job_tracker enable row level security;
alter table content_details enable row level security;

-- RLS Policies (authenticated users can do everything)
create policy "Allow authenticated" on clients for all using (auth.role() = 'authenticated');
create policy "Allow authenticated" on employees for all using (auth.role() = 'authenticated');
create policy "Allow authenticated" on deliverables for all using (auth.role() = 'authenticated');
create policy "Allow authenticated" on daily_tracker for all using (auth.role() = 'authenticated');
create policy "Allow authenticated" on job_tracker for all using (auth.role() = 'authenticated');
create policy "Allow authenticated" on content_details for all using (auth.role() = 'authenticated');
```

---

## 👤 Creating Your First User

In Supabase → **Authentication → Users → Invite User** (or Add User)
— enter your email and password.

Then log in at `http://localhost:3000`.

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🗂️ Project Structure

```
agency-erp/
├── app/
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Main app (auth + routing)
├── components/
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── Calendar.js
│   │   ├── Clients.js
│   │   ├── ClientDetail.js
│   │   ├── Deliverables.js
│   │   ├── Jobs.js
│   │   └── Employees.js
│   ├── Modal.js
│   ├── Sidebar.js
│   ├── Toast.js
│   └── UI.js
├── lib/
│   ├── supabase.js        # Supabase client
│   └── utils.js           # Helpers & constants
├── .env.local             # ← Put your credentials here
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## ✨ Features

- **Dashboard** — KPI stats, donut chart, pipeline bars, client load chart
- **Content Calendar** — Daily tracker, deliverables split, job work, client content tabs
- **Clients** — Card grid with client detail drill-down
- **Client Detail** — Overview, deliverables tracker with inline status dropdowns, content details
- **Deliverables** — Full CRUD with inline status updates
- **Job Tracker** — Task assignment, correction tracking
- **Employees** — Team card grid with CRUD
- Supabase Auth (email/password)
- Toast notifications
- Modal forms throughout
