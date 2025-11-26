import type {  PoolConnection } from "mariadb/*";

export async function setupDB(conn: PoolConnection) {
    const { query } = conn

    const databaseExists = await query("SHOW DATABASES WHERE `Database` IN ('store_db')")
    
    if (databaseExists.length > 0) {      
        const configuration = await query("select version from store_db.configuration")
        if (configuration.length > 0 && configuration[0].version !== Bun.env.VERSION) {            
            await query(`update store_db.configuration set version = '${Bun.env.VERSION}' where id = 1`)
            return
        }
        return
    }
}