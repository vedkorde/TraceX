export interface SupplyChainEvent {
    eventId: string;
    productId: string;
    eventType: string;
    from: string;
    to: string;
    location: string;
    timestamp: string;
    actor: string;
}