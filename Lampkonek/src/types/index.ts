export interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    avatar_url?: string;
    phone?: string;
    birth_date?: string;
    cluster?: string;
    created_at?: string;
}

export interface User {
    id: string;
    email?: string;
    user_metadata: {
        [key: string]: any;
    };
}
