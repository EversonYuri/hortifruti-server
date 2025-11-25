export function respond(res: any, status: number = 200) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
    };
    
    return new Response(JSON.stringify(res), {
        headers: corsHeaders,
        status,
    });
}