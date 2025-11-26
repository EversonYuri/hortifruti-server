export interface Event {
    event_type: 'compra' | 'venda' | 'outro'
    product_id: string
    quantity: number
    price: number
    event_date: string
}