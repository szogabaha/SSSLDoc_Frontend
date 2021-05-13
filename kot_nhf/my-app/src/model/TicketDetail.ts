export interface Message {
    messageId: string;
    createdBy: string;
    createdAt: number;
    status: string;
    text: string;
    reviewedBy: string;
    reviewedAt: number;
}

export interface TicketDetail {
    ticketId: string;
    createdBy: string;
    createdAt: number;
    ticketType: string;
    description: string;
    assignedTo: string;
    messages: Message[];
}