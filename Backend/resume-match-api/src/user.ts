import { Hono } from "hono";
import { Env } from ".";
import { validateAndRefreshAccessToken } from "./authHelpers";
import { drizzle } from 'drizzle-orm/d1';
import { eq, sql } from 'drizzle-orm';
import userService from "./userService";
import { users } from "./db/schema";

const user = new Hono<{ Bindings: Env }>()

export interface INewUserDetails {
    username: string,
    email: string,
    password: string
}

user.get("/getInfo", async (c) => {

    const userId = (await c.get('userId' as never)) as string;

    const db = drizzle(c.env.DB);

    const userDetails = (await db.select({ username: users.username, email: users.email, createdAt: users.createdAt }).from(users).where(eq(users.id, userId)))[0];

    return c.json(userDetails);
})

user.post("/login", async (c) => {

    //TODO: validate
    const { email, password } = await c.req.json();

    const db = drizzle(c.env.DB);
    const jwtSecret = c.env.JWT_SECRET;

    const { accessToken, refreshToken } = await userService.loginUser(jwtSecret, db, email, password);

    return c.json({ accessToken, refreshToken });
})

user.post("/create", async (c) => {

    const db = drizzle(c.env.DB);
    const jwtSecret = c.env.JWT_SECRET;

    //TODO: validate
    const newUserDetails = await c.req.json();

    const { accessToken, refreshToken } = await userService.createUser(jwtSecret, db, newUserDetails);

    return c.json({ accessToken, refreshToken });
})

user.post("/updateRefreshVersion", async (c) => {

    const userId = (await c.get('userId' as never)) as string;

    const db = drizzle(c.env.DB);

    await db.update(users).set({ refreshVersion: sql`${users.refreshVersion} + 1` }).where(eq(users.id, userId));

    return c.json({});
})

user.post("/validateTokens", async (c) => {

    const db = drizzle(c.env.DB);
    const jwtSecret = c.env.JWT_SECRET;

    const { accessToken, refreshToken } = await c.req.json();

    const response = await validateAndRefreshAccessToken(jwtSecret, accessToken, refreshToken, db);

    return c.json(response);
})

export default user
