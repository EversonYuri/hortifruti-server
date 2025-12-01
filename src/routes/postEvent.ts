import type { PoolConnection } from "mariadb/*"
import { respond } from "../utils/network"
import type { Event } from "../../types"

export async function postEvent(request: Request, execute: PoolConnection['execute']) {
    const eventos: Event[] = await request.json() as Event[]

    let response = []

    for (const evento of eventos) {
        const result = await execute(`INSERT INTO store_db.events (event_type, product_id, quantity, price, event_date) VALUES (?, ?, ?, ?, ?)`, [evento.event_type, evento.product_id, evento.quantity, evento.price, evento.event_date])
        response.push(result.affectedRows > 0 ? 'Evento criado com sucesso' : 'Falha ao criar evento')
    }

    return respond({ message: response })
}