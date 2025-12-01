select p.id,
    p.nome,
    gtin,
    p.valorCompra,
    p.valorVenda,
    g.nome as grupo,
    s.nome as subgrupo,
    u.descricao as unidade
from `database`.produotos p
join `database`.grupos g on p.idGrupo = g.id
join `database`.subgrupos s on p.idSubGrupo = s.id
join `database`.unidademedida u on p.idUnidade = u.id