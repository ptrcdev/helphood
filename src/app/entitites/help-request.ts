export interface HelpRequest {
    _id: string;
    title: string;
    description: string;
    status: string;
    createdAt: Date;
    location: {
        type: string;
        coordinates: number[];
    };
    urgency: string;
    author: string;
}