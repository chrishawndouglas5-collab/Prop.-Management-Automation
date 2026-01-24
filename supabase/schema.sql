-- Users table (handled by Supabase Auth)
-- You'll reference auth.users

-- Customers table
create table customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  company_name text not null,
  contact_name text,
  contact_email text,
  unit_count integer not null default 0,
  price_per_unit numeric(10,2) default 3.00,
  billing_type text check (billing_type in ('monthly', 'annual')),
  paddle_customer_id text,
  paddle_subscription_id text,
  status text check (status in ('active', 'past_due', 'canceled', 'trialing')) default 'trialing',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Properties table
create table properties (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers not null,
  property_name text not null,
  address text,
  unit_count integer not null,
  created_at timestamp with time zone default now()
);

-- Reports table
create table reports (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers not null,
  property_id uuid references properties,
  report_month integer check (report_month between 1 and 12),
  report_year integer,
  pdf_url text,
  storage_path text,
  generated_at timestamp with time zone,
  sent_at timestamp with time zone,
  status text check (status in ('pending', 'generated', 'sent', 'failed')) default 'pending',
  created_at timestamp with time zone default now()
);

-- Report Templates table
create table report_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  template_type text check (template_type in ('basic', 'detailed', 'executive')),
  is_default boolean default false,
  created_at timestamp with time zone default now()
);

-- Property Data table (stores uploaded CSV data)
create table property_data (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers not null,
  property_id uuid references properties,
  transaction_date date,
  category text,
  description text,
  amount numeric(10,2),
  transaction_type text check (transaction_type in ('income', 'expense')),
  upload_batch_id uuid,
  created_at timestamp with time zone default now()
);

-- Support Tickets table
create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number serial,
  customer_id uuid references customers,
  status text check (status in ('new', 'in_progress', 'waiting', 'resolved', 'closed')) default 'new',
  priority text check (priority in ('critical', 'high', 'normal', 'low')) default 'normal',
  category text,
  issue_description text,
  resolution text,
  opened_at timestamp with time zone default now(),
  closed_at timestamp with time zone,
  assigned_to text
);

-- Churn table
create table churn_records (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers not null,
  churn_date timestamp with time zone default now(),
  months_active integer,
  mrr_lost numeric(10,2),
  primary_reason text,
  secondary_reason text,
  exit_interview_notes text,
  preventable boolean,
  win_back_opportunity text
);

-- Automation Health Log
create table automation_logs (
  id uuid primary key default gen_random_uuid(),
  log_date timestamp with time zone default now(),
  automation_type text,
  status text check (status in ('success', 'partial', 'failed')),
  records_processed integer,
  records_failed integer,
  error_message text,
  execution_time_ms integer
);

-- Row Level Security (RLS)
alter table customers enable row level security;
alter table properties enable row level security;
alter table reports enable row level security;
alter table property_data enable row level security;
alter table support_tickets enable row level security;

-- Policies (customers can only see their own data)
create policy "Customers can view own data"
  on customers for select
  using (auth.uid() = user_id);

create policy "Customers can view own properties"
  on properties for select
  using (customer_id in (select id from customers where user_id = auth.uid()));

create policy "Customers can insert own properties"
  on properties for insert
  with check (customer_id in (select id from customers where user_id = auth.uid()));

create policy "Customers can update own properties"
  on properties for update
  using (customer_id in (select id from customers where user_id = auth.uid()));

create policy "Customers can delete own properties"
  on properties for delete
  using (customer_id in (select id from customers where user_id = auth.uid()));

create policy "Customers can view own reports"
  on reports for select
  using (customer_id in (select id from customers where user_id = auth.uid()));

-- Storage Bucket Policy
-- (Run this in SQL editor if bucket creation via SQL is supported, otherwise do manual)
-- insert into storage.buckets (id, name, public) values ('reports', 'reports', true);
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'reports' ); 
