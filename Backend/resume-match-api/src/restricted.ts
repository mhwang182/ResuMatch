import { Hono } from "hono";

const restricted = new Hono();

restricted.get("/", async (c) => {


    const { exp } = c.get('jwtPayload')

    const expDate = new Date(exp);

    expDate.getTime()

    const now = new Date(Date.now())

    return c.json({ hello: "world" });
})

export default restricted