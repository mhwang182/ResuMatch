import { Context } from "hono";
import { decode, jwt } from "hono/jwt";
import { Env } from ".";

export const userIdMiddleware = async (c: Context<{ Bindings: Env }>, next: () => any) => {
    const bearerToken = (await c.req.header())['authorization'];
    const token = bearerToken.split(' ')[1];

    const { payload } = decode(token);

    c.set('userId' as never, payload.userId);
    await next();
}

export const jwtMiddleware = (c: Context<{ Bindings: Env }>, next: () => any) => {
    const jwtMiddleware = jwt({
        secret: c.env.JWT_SECRET,
    })
    return jwtMiddleware(c, next)
}

