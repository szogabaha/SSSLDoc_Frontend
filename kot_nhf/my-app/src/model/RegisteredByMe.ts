//There are quite a lot of "any" values here. This is due to the autogeneration of the interface. This worked fine so we ended up sticking with it. 
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
    assignedToMe: RegisteredByMe[];
}

//This enum could be so great to use if we had a service for it from the backend. Right now we're putting it's values together by messing with multiple with response values
export enum Status {
    All = "All",
    New = "New",
    Assigned = "Assigned",
    Feedback = "Feedback",
    Closed = "Closed"
}



