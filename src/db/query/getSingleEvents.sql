select
	v2.descricaoPDV,
	v2.gtin,
	v2.quantidade,
	v2.valorUnitario,
	v2.valorTotal,
	u.descricao as unidade,
    v.dataHoraVenda,
	g.nome as grupo,
    "venda" as tipoDeEvento
from
	`database`.vendacabecalho v
	left join `database`.vendadetalhe v2 on v2.ID_VENDA_CABECALHO = v.id
    join `database`.produotos p on p.id = v2.codigoInternoProduto
	join `database`.grupos g on g.id = p.idGrupo
	join `database`.unidademedida u on u.id = p.idUnidade
where
	v.dataHoraVenda between ? and ?
    and v2.cancelado <> "S"