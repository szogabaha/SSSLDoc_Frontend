

    export interface RegisteredByMe {
        ticketId: string;
        createdAt: number;
        createdBy: string;
        ticketType: string;
        assignedTo?: any;
        isActive: boolean;
        unansweredMessages: any[];
        unreviewedMessages: any[];
    }

    export interface RegisteredByMeRequest {
        registeredByMe: RegisteredByMe[];
        assignedToMe: any[];
    }



