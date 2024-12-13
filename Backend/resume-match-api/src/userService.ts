import { v4 as uuidv4 } from 'uuid';
import { createTokens } from "./authHelpers";
import { HTTPException } from "hono/http-exception";
import passwordHash from "password-hash";
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { users } from "./db/schema";
import { INewUserDetails } from './user';

const loginUser = async (jwtSecret: string, db: DrizzleD1Database, email: string, password: string) => {

    let result = null;

    try {
        const results = await db.select().from(users).where(eq(users.email, email));

        result = results && results.length > 0 ? results[0] : null;

    } catch {
        throw new HTTPException(500, { message: "Unable to perform query" });
    }

    if (!result) {
        throw new HTTPException(404, { message: "User not found" });
    }

    if (!passwordHash.verify(password, result.password as string)) {
        throw new HTTPException(401, { message: "Invalid Credentials" });
    }

    //first refresh token to expire will invalidate all others

    const userId = result.id as string;

    const refreshVersion = result.refreshVersion as number;

    return await createTokens(userId, jwtSecret, refreshVersion);
}

const createUser = async (jwtSecret: string, db: DrizzleD1Database, details: INewUserDetails) => {

    const { username, email, password } = details;

    //TODO: implement more robust validation

    try {
        const id = uuidv4();
        const hashedPassword = passwordHash.generate(password);
        const refreshVersion = 0;

        await db.insert(users).values({ id, username, email, password: hashedPassword });

        return await createTokens(id, jwtSecret, refreshVersion);
    } catch {
        throw new HTTPException(400, { message: "Unable to create user" })
    }
}

export default { loginUser, createUser }