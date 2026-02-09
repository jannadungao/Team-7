import { UUID } from "crypto";

export interface User {
    username: string; // UUID
    user_id: string; // UUID
    email: string; // chars@[sub.]example.tld
}

export interface FlexibleTask {
    user_id: string; //UUID
    task_id: string; // UUID
    name: string;
    amt_mins: number; // INT
}