
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { sign, verify, decode } from 'hono/jwt';
import { users } from './db/schema';
import { eq, sql } from 'drizzle-orm';

/*
Auth implementation:
    JWT:
        - access token: short lived (ex 5 mins, 1hr, etc)
        - refresh token (30 days)
        - when access token expires, verify refresh token and give user new access token


        
        - refreshToken = {
            {userId, refreshTokenVersion: version (value from db)},
            secret,
            {expires: 30 days}
        }

        - accessToken = {
            {userId},
            secret,
            {expires: 1hr}
        }

    Session:
        - decided not to use sessions because every api call would trigger a db query
        - could be implemented with redis instead of db table. added complexity

*/

const createAccessToken = async (userId: string, jwtSecret: string): Promise<string> => {

    const payload = {
        userId,
        exp: Math.floor(Date.now() / 1000) + 60 * 5 // 2 minutes
    };

    return await sign(payload, jwtSecret);
}

const createRefreshToken = async (userId: string, jwtSecret: string, version: number): Promise<string> => {

    const payload = {
        userId,
        version,
        exp: Math.floor(Date.now() / 1000) + 60 * 43200 //30 days
    }

    return await sign(payload, jwtSecret);
}

const createTokens = async (userId: string, jwtSecret: string, refreshVersion: number): Promise<{ accessToken: string; refreshToken: string; }> => {

    const accessToken = await createAccessToken(userId, jwtSecret);
    const refreshToken = await createRefreshToken(userId, jwtSecret, refreshVersion);

    return { accessToken, refreshToken }
}

const incrementRefreshVersionFromToken = async (token: string, db: DrizzleD1Database) => {

    try {
        const decodedRefreshToken = decode(token);
        const userId = decodedRefreshToken.payload.userId as string;

        //increment refreshVersion using userId
        await db.update(users).set({ refreshVersion: sql`${users.refreshVersion} + 1` }).where(eq(users.id, userId));

    } catch (error) {
        throw error;
    }
}

const validateAndRefreshAccessToken = async (jwtSecret: string, accessToken: string, refreshToken: string, db: DrizzleD1Database): Promise<{ valid: boolean, accessToken?: string; }> => {

    try {
        await verify(accessToken, jwtSecret);
        return { valid: true };
    } catch {

        try {
            const refreshTokenStatus = await verify(refreshToken, jwtSecret);

            //also check if versions match
            const userId = refreshTokenStatus.userId as string;

            //TODO: handle when user doesnt exist
            const currentRefreshVersion = (await db.select({ refreshVersion: users.refreshVersion }).from(users).where(eq(users.id, userId)))[0];

            if (refreshTokenStatus.version != currentRefreshVersion.refreshVersion) {
                return { valid: false }
            }

            const newAccessToken = await createAccessToken(userId, jwtSecret);

            return { valid: true, accessToken: newAccessToken };

        } catch {
            incrementRefreshVersionFromToken(refreshToken, db);
            return { valid: false };
        }
    }
}


export {
    createAccessToken,
    createRefreshToken,
    createTokens,
    validateAndRefreshAccessToken
};