-- Camaradas Caneludos — schema completo + dados iniciais.
-- Rode uma vez no SQL Editor do projeto Supabase.
-- Leitura pública em tudo, menos jogadores (sorteador); escrita só para usuários logados.

create table config (
  id int primary key default 1 check (id = 1), -- linha única
  local text not null,
  horario text not null,
  valor numeric not null,
  vagas int not null,
  pix_chave text not null,
  pix_banco text not null,
  pix_titular text not null,
  pix_prazo text not null,
  pix_qr_url text
);

-- listas de texto de cada página
create table textos (
  id bigint generated always as identity primary key,
  secao text not null check (secao in ('regra', 'observacao', 'jogo', 'pagamento')),
  texto text not null
);

create table mensalistas (
  id bigint generated always as identity primary key,
  nome text not null,
  em_dia boolean not null default false
);

create table vergonha (
  id bigint generated always as identity primary key,
  nome text not null,
  faltas numeric not null default 0 check (faltas >= 0),
  foto_url text
);

create table jogadores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  nota numeric not null check (nota between 1 and 10),
  goleiro boolean not null default false
);

alter table config enable row level security;
alter table textos enable row level security;
alter table mensalistas enable row level security;
alter table vergonha enable row level security;
alter table jogadores enable row level security;

create policy "leitura publica" on config for select using (true);
create policy "leitura publica" on textos for select using (true);
create policy "leitura publica" on mensalistas for select using (true);
create policy "leitura publica" on vergonha for select using (true);

create policy "logado edita" on config for all to authenticated using (true) with check (true);
create policy "logado edita" on textos for all to authenticated using (true) with check (true);
create policy "logado edita" on mensalistas for all to authenticated using (true) with check (true);
create policy "logado edita" on vergonha for all to authenticated using (true) with check (true);
create policy "logado edita" on jogadores for all to authenticated using (true) with check (true);

-- fotos (mural, QR code): leitura pública pela URL, upload só logado
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true);

create policy "logado envia fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos');
create policy "logado troca fotos" on storage.objects for update to authenticated
  using (bucket_id = 'fotos');
create policy "logado apaga fotos" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos');

/* ── dados atuais do site ── */

insert into config (local, horario, valor, vagas, pix_chave, pix_banco, pix_titular, pix_prazo, pix_qr_url) values (
  'Campo do América', 'Domingo às 08h', 25, 16,
  '173.031.376-02', 'Banco Inter', 'Lucas Pessoa',
  'Até um dia antes do primeiro futebol do mês',
  '/Camaradas-mensalistas/pix-qrcode.jpg'
);

insert into textos (secao, texto) values
  ('regra', 'Máximo de 16 mensalistas fixos'),
  ('regra', 'Sempre haverá 2 vagas abertas para jogadores avulsos'),
  ('regra', 'Enquete de comparecimento liberada de segunda-feira até sábado às 11h'),
  ('regra', 'Caso haja mensalistas ausentes até sábado às 11h, as vagas restantes serão liberadas para avulsos no grupo geral'),
  ('regra', 'Valor do avulso: R$10,00'),
  ('regra', 'Mensalista que não pagar ou quiser sair em algum mês será removido do grupo e a vaga será aberta para o grupo geral'),
  ('jogo', 'Chegar com antecedência'),
  ('jogo', 'Respeitar horário e organização'),
  ('pagamento', 'Não existe pagamento por cartão'),
  ('pagamento', 'Apenas PIX'),
  ('observacao', 'Todo dinheiro extra arrecadado será utilizado para compra de bola, colete, bombinha, luva de goleiro e etc'),
  ('observacao', 'Controle de pagamento feito pelo Lucas Pessoa'),
  ('observacao', 'O comprovante geral do mensal será sempre enviado'),
  ('observacao', 'Mensalistas não precisam enviar comprovante, apenas marcar presença na enquete de controle (realizada na última semana de cada mês)');

insert into mensalistas (nome, em_dia) values
  ('Diego Padilha (DiNego)', false),
  ('Lucas Pessoa', true),
  ('Antônio Carvalho', true),
  ('João Malbec', true),
  ('Igor Cardoso', false),
  ('Matheus Leite', false),
  ('Mauthos Sepini', false),
  ('Leonardo Augusto', false),
  ('Márcio Júnior', false),
  ('Erick Pessoa', false),
  ('Lucas Souza', false),
  ('Lucas Alberto', false),
  ('Marcelo Mascarin', false),
  ('Alisson Vieira', false),
  ('Vinicius Lopes (Vinico)', false),
  ('Pedro (Gnose)', true);

insert into vergonha (nome, faltas, foto_url) values
  ('Alisson Vieira', 2.5, '/Camaradas-mensalistas/alisson.png'),
  ('Marcelo Mascarin', 1, '/Camaradas-mensalistas/Marcelo.png'),
  ('Diego Padilha (Dinego)', 1, '/Camaradas-mensalistas/Dinego.png'),
  ('Gabriel Junior (Cael)', 1, '/Camaradas-mensalistas/Cael.png');
