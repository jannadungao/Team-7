import { UUID } from "crypto";

export interface User {
    username: string;
    user_id: UUID;
    email: string;
}

export interface FlexibleTask {
    user_id: UUID;
    task_id: UUID;
    name: string;
    amt_mins: number;
}