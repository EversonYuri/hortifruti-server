import { openConnection } from "./src/db/conn";
import { respond } from "./src/utils/network";

console.log("Hello via Bun!");
const { execute, release } = await openConnection('100.127.95.226', 'renato')

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

                console.log(initialDate, finalDate, offset, limit)
                return respond(await execute(await Bun.file('./src/db/query/getProduct.sql').text(), [initialDate, finalDate, limit, offset]))
            }
            case '/get-single-events': {
                const initialDate = url.searchParams.get('initial-date')
                const finalDate = url.searchParams.get('final-date')
                const offset = url.searchParams.get('offset')
                const limit = url.searchParams.get('limit')

                console.log(initialDate, finalDate, offset, limit)
                return respond(await execute(await Bun.file('./src/db/query/getSingleEvents.sql').text(), [initialDate, finalDate]))
            }
            default:
                return respond("Not Found", 404)
        }
    },
    development: true,
});

console.log(`Server is running on ${server.url}`);