export interface Ticket {
    ticketId: string;
    createdAt: number;
    createdBy: string;
    ticketType: string;
    assignedTo: string;
    isActive: boolean;
    unansweredMessages: string[];
    unreviewedMessages: string[];
    }

export interface GetAllTicketsResponse {
    tickets: Ticket[];
}