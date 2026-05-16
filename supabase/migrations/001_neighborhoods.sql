-- ============================================================
-- SPRINT 1 — Bairros
-- Execute no Supabase SQL Editor (ordem importa)
-- ============================================================

-- 1. Tabela de bairros
create table if not exists public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  position int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists neighborhoods_active_idx
  on public.neighborhoods(is_active, position);

-- RLS
alter table public.neighborhoods enable row level security;

create policy "neighborhoods_public_select"
  on public.neighborhoods for select
  using (is_active = true);

create policy "neighborhoods_service_all"
  on public.neighborhoods for all
  using (auth.role() = 'service_role');

-- 2. Seed — bairros de Maracanaú/CE
-- Fonte: confirmar em https://www.maracanau.ce.gov.br/bairros/
insert into public.neighborhoods (name, slug, position) values
  ('Acaracuzinho',              'acaracuzinho',              1),
  ('Alto Alegre',               'alto-alegre',               2),
  ('Alto da Mangueira',         'alto-da-mangueira',         3),
  ('Antônio Justa',             'antonio-justa',             4),
  ('Boa Esperança',             'boa-esperanca',             5),
  ('Boa Vista',                 'boa-vista',                 6),
  ('Cágado',                    'cagado',                    7),
  ('Centro',                    'centro',                    8),
  ('Cidade Nova',               'cidade-nova',               9),
  ('Coqueiral',                 'coqueiral',                 10),
  ('Distrito Industrial I',     'distrito-industrial-i',     11),
  ('Furna da Onça',             'furna-da-onca',             12),
  ('Horto',                     'horto',                     13),
  ('Industrial',                'industrial',                14),
  ('Jaçanaú',                   'jacanau',                   15),
  ('Jardim Bandeirantes',       'jardim-bandeirantes',       16),
  ('Jari',                      'jari',                      17),
  ('Jenipapeiro',               'jenipapeiro',               18),
  ('Jereissati',                'jereissati',                19),
  ('Luzardo Viana',             'luzardo-viana',             20),
  ('Menino Jesus de Praga',     'menino-jesus-de-praga',     21),
  ('Mucunã',                    'mucuna',                    22),
  ('Novo Jenipapeiro',          'novo-jenipapeiro',          23),
  ('Olho d''Água',              'olho-dagua',                24),
  ('Pajuçara',                  'pajucara',                  25),
  ('Parque Santa Maria',        'parque-santa-maria',        26),
  ('Piratininga',               'piratininga',               27),
  ('Santo Sátiro',              'santo-satiro',              28),
  ('Timbó',                     'timbo',                     29)
on conflict (slug) do nothing;

-- 3. Coluna neighborhood_id em businesses
alter table public.businesses
  add column if not exists neighborhood_id uuid
    references public.neighborhoods(id)
    on delete set null;

create index if not exists businesses_neighborhood_idx
  on public.businesses(neighborhood_id);
