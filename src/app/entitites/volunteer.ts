import { HelpRequest } from "./help-request";

export interface Volunteer {
    userId: string;
    availability: boolean;
    location: {
        type: string;
        coordinates: number[];
    };
    createdAt: Date;
    requests: HelpRequest[];
}