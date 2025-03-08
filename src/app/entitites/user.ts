export interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    userId?: string | null;
    role: string;
    bio?: string;
    address?: string;
    phone?: string;
    notifications: Record<string, boolean>;
}