import { Hono } from "hono";
import { Env } from ".";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { jobs, matchKeywords, resumeMatches } from "./db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";


const jobsApi = new Hono<{ Bindings: Env }>();

const deleteMatchByJobId = async (jobId: number, db: DrizzleD1Database) => {
    const res = (await db.select()
        .from(resumeMatches)
        .where(eq(resumeMatches.jobId, jobId))
        .innerJoin(matchKeywords, eq(matchKeywords.resumeMatchId, resumeMatches.id)))[0];

    await db.delete(matchKeywords).where(eq(matchKeywords.id, res.match_keywords.id));
    await db.delete(resumeMatches).where(eq(resumeMatches.id, res.resume_matches.id));
}

jobsApi.post('/create', async (c) => {

    const userId = (await c.get('userId' as never)) as string;

    const { role, company, description, location } = await c.req.json();

    const db = drizzle(c.env.DB);

    const values = {
        userId,
        role,
        company,
        jobDescription: description,
        location
    };

    const createdJob = (await db.insert(jobs).values(values).returning())[0];

    return c.json(createdJob);
})

jobsApi.get('/listWithMatches', async (c) => {
    const userId = (await c.get('userId' as never)) as string;

    const db = drizzle(c.env.DB);

    const jobsList = await db.select().from(jobs).where(eq(jobs.userId, userId)).leftJoin(resumeMatches, (eq(resumeMatches.jobId, jobs.id)));
    const resultList = jobsList.map(result => { return { ...result.jobs, resumeMatch: result.resume_matches } });

    return c.json(resultList)
})

jobsApi.get('/bulk', async (c) => {

    const userId = (await c.get('userId' as never)) as string;

    const db = drizzle(c.env.DB);

    const jobsList = await db.select().from(jobs).where(eq(jobs.userId, userId));

    return c.json(jobsList);
})

jobsApi.get('/:id', async (c) => {

    const userId = (await c.get('userId' as never)) as string;

    const jobId = parseInt(c.req.param('id'));

    const db = drizzle(c.env.DB);

    const job = (await db.select().from(jobs).where(eq(jobs.id, jobId)))[0];

    if (!job) {
        throw new HTTPException(404, { message: 'Not Found' });
    }

    if (job.userId != userId) {
        throw new HTTPException(401, { message: 'Unauthorized' });
    }

    return c.json(job);
})

jobsApi.delete('/:id', async (c) => {

    const jobId: number = parseInt(c.req.param('id'));
    const userId = (await c.get('userId' as never)) as string;

    const db = drizzle(c.env.DB);

    const job = (await db.selectDistinct().from(jobs).where(eq(jobs.id, jobId)))[0];

    if (!job) {
        throw new HTTPException(404, { message: "Not Found" });
    }

    if (job.userId != userId) {
        throw new HTTPException(401, { message: "Unauthorized" });
    }

    //delete corresponding resume match before delete
    await deleteMatchByJobId(jobId, db);

    const deletedJob = await db.delete(jobs).where(eq(jobs.id, jobId)).returning();

    return c.json({ deletedJobId: deletedJob[0].id });
})

jobsApi.put("/:id", async (c) => {
    const jobId: number = parseInt(c.req.param('id'));
    const userId = (await c.get('userId' as never)) as string;

    const { role, company, description, location } = await c.req.json();

    const db = drizzle(c.env.DB);

    const job = (await db.selectDistinct().from(jobs).where(eq(jobs.id, jobId)))[0];

    if (!job) {
        throw new HTTPException(404, { message: "Not Found" });
    }

    if (job.userId != userId) {
        throw new HTTPException(401, { message: "Unauthorized" });
    }

    const values = {
        role,
        company,
        jobDescription: description,
        location
    };

    const updatedJob = await db.update(jobs).set(values).where(eq(jobs.id, jobId)).returning();

    return c.json(updatedJob);
})

export default jobsApi