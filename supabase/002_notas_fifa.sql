-- Notas no estilo carta do FIFA (1 a 99).
-- Com os 6 atributos preenchidos, a nota geral é a média deles; para quem vai
-- pouco, os atributos ficam vazios e a nota geral é dada direto.

alter table jogadores drop constraint jogadores_nota_check;
update jogadores set nota = least(99, round(nota * 10)); -- escala antiga 1–10
alter table jogadores add constraint jogadores_nota_check check (nota between 1 and 99);

alter table jogadores
  add column ritmo int check (ritmo between 1 and 99),
  add column finalizacao int check (finalizacao between 1 and 99),
  add column passe int check (passe between 1 and 99),
  add column drible int check (drible between 1 and 99),
  add column defesa int check (defesa between 1 and 99),
  add column fisico int check (fisico between 1 and 99),
  add column foto_url text;

-- ou todos os atributos, ou nenhum
alter table jogadores add constraint jogadores_atributos_check check (
  num_nulls(ritmo, finalizacao, passe, drible, defesa, fisico) in (0, 6)
);
