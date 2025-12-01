import { openConnection } from "./src/db/conn";
import { setupDB } from "./src/db/setupDB";
import { getProdutos } from "./src/routes/getProdutos";
import { getSaldo } from "./src/routes/getSaldo";
import { postEvent } from "./src/routes/postEvent";
import { respond } from "./src/utils/network";

console.log("Hello via Bun!");
const conn = await openConnection('100.127.95.226', 'renato')
const { execute, release, query } = conn

await setupDB(conn)

const server = Bun.serve({
    port: 3000,
    hostname: '0.0.0.0',
    async fetch(request) {
        if (request.method === 'OPTIONS') return respond(null, 204)

        const url = new URL(request.url)

        switch (url.pathname) {
            case '/get-events': {
                const initialDate = url.searchParams.get('initial-date')
                const finalDate = url.searchParams.get('final-date')
                const offset = url.searchParams.get('offset')
                const limit = url.searchParams.get('limit')

                const customEvents = await query("select p.product_id, Sum(p.quantity) as quantity, Sum(p.price) as total_price, p.event_date, p.event_type from `store_db`.events p group by p.product_id")

                const heraEvents = await execute(await Bun.file('./src/db/query/getSaleEvents.sql').text(), [initialDate, finalDate, limit, offset])

                return respond({ venda: heraEvents, compra: customEvents })
            }
            case '/get-single-events': {
                const initialDate = url.searchParams.get('initial-date')
                const finalDate = url.searchParams.get('final-date')
                const offset = url.searchParams.get('offset')
                const limit = url.searchParams.get('limit')

                console.log(initialDate, finalDate, offset, limit)
                return respond(await execute(await Bun.file('./src/db/query/getSingularEvents.sql').text(), [initialDate, finalDate]))
            }

            case '/get-saldo': return getSaldo(url, execute)

            case '/create-event': return postEvent(request, execute)

            case '/get-products': return getProdutos(execute)

            default:
                return respond("Not Found", 404)
        }
    },
    development: true,
});

console.log(`Server is running on ${server.url}`);