import type { PoolConnection } from "mariadb/*"
import { respond } from "../utils/network"

export async function getProdutos(execute: PoolConnection['execute']) {

    const result = await execute(await Bun.file('./src/db/query/getProdutcts.sql').text())
    return respond(result)
}