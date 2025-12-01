-- The WHERE clause appears after the GROUP BY clause, which is invalid SQL syntax.
-- The correct order is: FROM ... [JOIN ...] WHERE ... GROUP BY ...
select p.id,
    p.gtin,
    p.nome,
    u.descricao as unidade,
    g.nome as grupo,
    sum_e.quantidadeCompra,
    sum_e.valorCompra,
    (sum_e.valorCompra / sum_e.quantidadeCompra) as valorCompramedio,
    sum_v.quantidadeVenda,
    sum_v.valorVenda,
    (sum_v.valorVenda / sum_v.quantidadeVenda) as valorVendamedio,
    (sum_v.valorVenda - sum_e.valorCompra) as valorLucro,
    ((sum_v.valorVenda - sum_e.valorCompra) / sum_v.valorVenda) * 100 as percentualLucro
from `database`.produotos p
    left join (
        select e.product_id,
            sum(e.quantity) as quantidadeCompra,
            sum(e.price * e.quantity) as valorCompra
        from `store_db`.events e
        where e.event_date between ? and ?
        group by e.product_id
    ) as sum_e on sum_e.product_id = p.id
    left join (
        select vd.codigoInternoProduto as product_id,
            sum(vd.quantidade) as quantidadeVenda,
            sum(vd.valorTotal) as valorVenda
        from `database`.vendacabecalho vc
            join `database`.vendadetalhe vd on vd.ID_VENDA_CABECALHO = vc.id
        where vc.dataHoraVenda between ? and ?
        group by vd.codigoInternoProduto
    ) as sum_v on sum_v.product_id = p.id
    left join `database`.grupos g on g.id = p.idGrupo
    left join `database`.unidademedida u on u.id = p.idUnidade;