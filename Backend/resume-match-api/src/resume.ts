import { Hono } from "hono";
import { Env } from ".";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { matchKeywords, resumeMatches, resumes } from "./db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const resume = new Hono<{ Bindings: Env }>();

const deleteMatchByResumeId = async (resumeId: number, db: DrizzleD1Database) => {
    const res = (await db.select()
        .from(resumeMatches)
        .where(eq(resumeMatches.resumeId, resumeId))
        .innerJoin(matchKeywords, eq(matchKeywords.resumeMatchId, resumeMatches.id)))[0];

    await db.delete(matchKeywords).where(eq(matchKeywords.id, res.match_keywords.id));
    await db.delete(resumeMatches).where(eq(resumeMatches.id, res.resume_matches.id));
}

resume.post("/create", async (c) => {
    const userId = (await c.get('userId' as never)) as string;
    const { name, role, description, content } = await c.req.json();

    const db = drizzle(c.env.DB);

    const createdResume = (await db.insert(resumes).values({ userId, name, role, description, content }).returning())[0];

    return c.json(createdResume);
})


resume.get("/list", async (c) => {
    const userId = (await c.get('userId' as never)) as string;

    const db = drizzle(c.env.DB);

    const resumeList = await db.select().from(resumes).where(eq(resumes.userId, userId));

    return c.json({ resumes: resumeList });
})

resume.get("/:id", async (c) => {
    const resumeId: number = parseInt(c.req.param('id'));
    const userId = (await c.get('userId' as never)) as string;

    const db = drizzle(c.env.DB);

    const resume = (await db.selectDistinct().from(resumes).where(eq(resumes.id, resumeId)))[0];

    if (!resume) {
        throw new HTTPException(404, { message: 'Not Found' });
    }

    if (resume.userId != userId) {
        throw new HTTPException(401, { message: 'Unauthorized' });
    }

    return c.json(resume);
})

resume.delete("/:id", async (c) => {
    const resumeId: number = parseInt(c.req.param('id'));
    const userId = (await c.get('userId' as never)) as string;

    const db = drizzle(c.env.DB);

    const resume = (await db.selectDistinct().from(resumes).where(eq(resumes.id, resumeId)))[0];

    if (!resume) {
        throw new HTTPException(404, { message: "Not Found" });
    }

    if (resume.userId != userId) {
        throw new HTTPException(401, { message: "Unauthorized" });
    }

    //delete resume matches that reference the resumeId

    await deleteMatchByResumeId(resumeId, db);

    const deletedResume = await db.delete(resumes).where(eq(resumes.id, resumeId)).returning();

    return c.json({ deletedResumeId: deletedResume[0].id });

})

resume.put("/:id", async (c) => {
    const resumeId: number = parseInt(c.req.param('id'));
    const userId = (await c.get('userId' as never)) as string;

    const { name, role, description, content } = await c.req.json();

    const db = drizzle(c.env.DB);

    const resume = (await db.selectDistinct().from(resumes).where(eq(resumes.id, resumeId)))[0];

    if (!resume) {
        throw new HTTPException(404, { message: "Not Found" });
    }

    if (resume.userId != userId) {
        throw new HTTPException(401, { message: "Unauthorized" });
    }

    const updatedResume = await db.update(resumes).set({ name, role, description, content }).where(eq(resumes.id, resumeId)).returning();
    return c.json(updatedResume);
})

export default resume