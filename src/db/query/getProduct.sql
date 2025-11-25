select p.nome,
	p.gtin,
	g.nome as grupo,
	s.nome as subgrupo,
	v2.codigoInternoProduto,
	u.descricao as unidade,
	sum(v2.valorTotal) as total_valorTotal,
	sum(v2.valorCusto) as total_valorCusto,
	sum(v2.valorLucro) as total_valorLucro,
	(sum(v2.valorLucro) / sum(v2.valorCusto)) * 100 as total_magemLucro,
	sum(v2.quantidadeItens) as total_quantidadeItens
from `database`.vendacabecalho v
	left join `database`.vendadetalhe v2 on v2.ID_VENDA_CABECALHO = v.id
	and v2.cancelado <> 'S'
	join `database`.produotos p on p.id = v2.codigoInternoProduto
	join `database`.grupos g on g.id = p.idGrupo
	join `database`.subgrupos s on s.id = p.idSubGrupo
	join `database`.unidademedida u on u.id = p.idUnidade
where dataHoraVenda between ? and ?
group by v2.codigoInternoProduto
limit ? offset ?