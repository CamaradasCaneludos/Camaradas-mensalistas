-- Notas no estilo carta do FIFA, escala de 0 a 10.
-- `atributos` guarda os 6 valores na ordem da carta. Jogador de linha:
-- RIT, FIN, PAS, DRI, DEF, FIS. Goleiro: ELA, MAN, CHU, REF, VEL, POS.
-- A nota geral (coluna nota, 1 a 10) é a média deles. Para quem vai pouco,
-- atributos fica vazio e a nota geral é dada direto.

alter table jogadores
  add column atributos numeric[] check (
    atributos is null
    or (cardinality(atributos) = 6 and 0 <= all (atributos) and 10 >= all (atributos))
  ),
  add column foto_url text;
