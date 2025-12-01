import type { PoolConnection } from "mariadb/*"
import { respond } from "../utils/network"

export async function getSaldo(url: URL, execute: PoolConnection['execute']) {
    let response = []

    const initialDate = url.searchParams.get('initial-date')
    const finalDate = url.searchParams.get('final-date')

    const result = await execute(await Bun.file('./src/db/query/getSaldo.sql').text(), [initialDate, finalDate, initialDate, finalDate])
    response.push(result.length > 0 ? 'Busca do saldo com sucesso' : 'Falha ao buscar saldo')

    return respond(result)
}