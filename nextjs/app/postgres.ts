import { UUID } from "crypto";
import postgres from "postgres";

export type User = {
    google_user_id: string,
    email: string,
    name: string,
    created_at: Date,
    updated_at: Date,
}

export type Oauth_Tokens = {
    google_user_id: string,
    refresh_token: Uint8Array,
    access_token?: string,
    expires_at?: Date,
    revoked: boolean,
    last_used_at?: Date,
    created_at: Date,
    updated_at: Date,
}

export type Flex_Tasks = {
    task_id: UUID,
    google_user_id: string,
    name: string,
    minutes: number,
    done: boolean,
    created_at: Date,
    updated_at: Date,
    assigned_time?: Date,
}

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
} = process.env;

if (!POSTGRES_PASSWORD || !POSTGRES_HOST) {
    throw new Error('Postgres password not set in .env and DATABASE_URL missing');
}

declare global {
    // cached client to avoid creating new connections on hot reload (Next.js)
    var __pgSql: postgres.Sql | undefined;
}

// reuse cached client between module reloads
const sql: postgres.Sql = globalThis.__pgSql ?? postgres({
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT) ?? 5432,
    username: "postgres",
    password: POSTGRES_PASSWORD,
    db: "postgres",
    // ssl: true,
});
if (!globalThis.__pgSql) globalThis.__pgSql = sql;

export default sql;