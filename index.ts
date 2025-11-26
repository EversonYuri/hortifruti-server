import { openConnection } from "./src/db/conn";
import { setupDB } from "./src/db/setupDB";
import { respond } from "./src/utils/network";
import type { Event } from "./types";

console.log("Hello via Bun!");
const conn = await openConnection('100.127.95.226', 'renato')
const { execute, release, query } = conn

await setupDB(conn)

const server = Bun.serve({
    port: 3000,
    hostname: '0.0.0.0',
    async fetch(request) {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') return respond(null, 204)

        const url = new URL(request.url)

        switch (url.pathname) {
            case '/get-events': {
                const initialDate = url.searchParams.get('initial-date')
                const finalDate = url.searchParams.get('final-date')
                const offset = url.searchParams.get('offset')
                const limit = url.searchParams.get('limit')

                const customEvents = await query("select p.product_id, Sum(p.quantity) as quantity, Sum(p.price) as total_price, p.event_date, p.event_type from `store_db`.events p group by p.product_id")

                const heraEvents = await execute(await Bun.file('./src/db/query/getProduct.sql').text(), [initialDate, finalDate, limit, offset])
                
                return respond({venda: heraEvents, compra: customEvents})
            }
            case '/get-single-events': {
                const initialDate = url.searchParams.get('initial-date')
                const finalDate = url.searchParams.get('final-date')
                const offset = url.searchParams.get('offset')
                const limit = url.searchParams.get('limit')

                console.log(initialDate, finalDate, offset, limit)
                return respond(await execute(await Bun.file('./src/db/query/getSingleEvents.sql').text(), [initialDate, finalDate]))
            }
            case '/create-event': {
                const eventos = await request.json() as Event[]

                let response = []

                for (const evento of eventos) {
                    const result = await execute(`INSERT INTO store_db.events (event_type, product_id, quantity, price, event_date) VALUES (?, ?, ?, ?, ?)`, [evento.event_type, evento.product_id, evento.quantity, evento.price, evento.event_date])
                    response.push(result.affectedRows > 0 ? 'Evento criado com sucesso' : 'Falha ao criar evento')
                }

                return respond({ message: response })
            }
            case '/get-products': {
                return respond(await query("select id, nome, gtin, valorCompra, valorVenda from `database`.produotos"))
            }
            default:
                return respond("Not Found", 404)
        }
    },
    development: true,
});

console.log(`Server is running on ${server.url}`);