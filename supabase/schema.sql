-- Execute este arquivo no SQL Editor do Supabase.
create extension if not exists pgcrypto;

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('corrente','poupanca','dinheiro','investimento','outra')),
  institution text,
  balance numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income','expense')),
  parent_id uuid references public.categories(id) on delete set null,
  color text,
  created_at timestamptz not null default now()
);
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  limit_amount numeric(14,2) not null default 0,
  closing_day int not null check (closing_day between 1 and 31),
  due_day int not null check (due_day between 1 and 31),
  account_id uuid references public.accounts(id) on delete set null,
  created_at timestamptz not null default now()
);
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null default current_date,
  description text not null,
  type text not null check (type in ('income','expense')),
  amount numeric(14,2) not null check (amount >= 0),
  account_id uuid references public.accounts(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  card_id uuid references public.cards(id) on delete set null,
  person text,
  notes text,
  recurrence text default 'once' check (recurrence in ('once','fixed','monthly','yearly','installment')),
  recurrence_group uuid,
  installment_current int,
  installment_total int,
  status text not null default 'paid' check (status in ('paid','pending')),
  created_at timestamptz not null default now()
);
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  month text not null,
  category_id uuid not null references public.categories(id) on delete cascade,
  planned numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, month, category_id)
);
create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  description text not null,
  type text not null check (type in ('payable','receivable')),
  amount numeric(14,2) not null,
  due_date date not null,
  status text not null default 'pending' check (status in ('paid','pending','overdue')),
  category_id uuid references public.categories(id) on delete set null,
  account_id uuid references public.accounts(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  current_value numeric(14,2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);
create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  original_amount numeric(14,2) not null default 0,
  outstanding_amount numeric(14,2) not null default 0,
  monthly_payment numeric(14,2),
  due_day int,
  notes text,
  created_at timestamptz not null default now()
);
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric(14,2) not null,
  current_amount numeric(14,2) not null default 0,
  target_date date,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_user_date on public.transactions(user_id,date desc);
create index if not exists idx_bills_user_due on public.bills(user_id,due_date);

-- RLS: cada usuário enxerga e altera apenas os próprios dados.
do $$
declare t text;
begin
  foreach t in array array['accounts','categories','cards','transactions','budgets','bills','assets','debts','goals'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "own_rows" on public.%I', t);
    execute format('create policy "own_rows" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;
end $$;

-- Categorias iniciais para um usuário recém cadastrado (rode manualmente após o primeiro login, se quiser).
-- O app também consegue criar categorias pela interface.
