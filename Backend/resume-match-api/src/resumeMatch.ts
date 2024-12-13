import { Hono } from "hono";
import { Env } from ".";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { jobs, resumeMatches, resumes, matchKeywords } from "./db/schema";
import { default as keywordExtractor } from "keyword-extractor";
import * as lzString from 'lz-string';

const resumeMatchApi = new Hono<{ Bindings: Env }>();

// resumeMatchApi.post('/create', async (c) => {

//     const userId = (await c.get('userId' as never)) as string;

//     const { jobId } = await c.req.json();

//     const db = drizzle(c.env.DB);

//     const values = {
//         jobId
//     }

//     const createdMatch = await db.insert(resumeMatches).values(values).returning();

//     return c.json(createdMatch);
// })


const getResumeKeywords = async (resumeId: number, db: DrizzleD1Database) => {
    const resume = (await db.select().from(resumes).where(eq(resumes.id, resumeId)))[0];

    const resumeContent = lzString.decompressFromUTF16(resume.content);

    const resumeKeywords = new Set(keywordExtractor.extract(
        resumeContent,
        {
            language: 'english',
            remove_duplicates: true,
            remove_digits: true,
            return_changed_case: true,
        }
    ));

    return resumeKeywords;
}

const getJobKeywords = async (jobId: number, db: DrizzleD1Database) => {
    const job = (await db.select().from(jobs).where(eq(jobs.id, jobId)))[0];

    const jobDescription = lzString.decompressFromUTF16(job.jobDescription);

    const keywords = new Set(keywordExtractor.extract(
        jobDescription,
        {
            language: 'english',
            remove_duplicates: true,
            remove_digits: true,
            return_changed_case: true,
        }
    ));

    return keywords;
}

const findAndCreateMatch = async (resumeIds: number[], jobId: number, db: DrizzleD1Database) => {
    const jobKeywords = await getJobKeywords(jobId, db);
    let match = resumeIds[0];
    let matchKeywordsSet = new Set();


    for (const resumeId of resumeIds) {
        const resumeKeywords = await getResumeKeywords(resumeId, db);
        const intersection = jobKeywords.intersection(resumeKeywords);

        if (intersection.size > matchKeywordsSet.size) {
            matchKeywordsSet = intersection;
            match = resumeId;
        }
    }

    const createdMatch = (await db.insert(resumeMatches).values({ jobId }).returning())[0];

    await db.insert(matchKeywords).values({ keywords: JSON.stringify(Array.from(matchKeywordsSet)), resumeMatchId: createdMatch.id });

    return { matchResumeId: match, createdMatch };
}

const deleteMatch = async (matchId: number, db: DrizzleD1Database) => {
    await db.delete(matchKeywords).where(eq(matchKeywords.resumeMatchId, matchId))
    return (await db.delete(resumeMatches).where(eq(resumeMatches.id, matchId)).returning())[0];
}

resumeMatchApi.get('/listByJobId/:jobId', async (c) => {

    const jobId: number = parseInt(c.req.param('jobId'));

    const db = drizzle(c.env.DB);

    return c.json(await db.select().from(resumeMatches).where(eq(resumeMatches.jobId, jobId)));
})

resumeMatchApi.post('/findMatch', async (c) => {

    const { jobId, resumeIds } = await c.req.json();

    const db = drizzle(c.env.DB);

    const existingMatches = await db.select().from(resumeMatches).where(eq(resumeMatches.jobId, jobId));

    if (existingMatches.length) {
        await deleteMatch(existingMatches[0].id, db);
    }

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(null);
        }, 1000);
    })

    const { matchResumeId, createdMatch } = await findAndCreateMatch(resumeIds, jobId, db);

    return c.json((await db.update(resumeMatches).set({ resumeId: matchResumeId, status: "COMPLETE" }).where(eq(resumeMatches.id, createdMatch.id)).returning())[0]);

})

resumeMatchApi.get('/listByResumeId/:resumeId', async (c) => {

    const resumeId: number = parseInt(c.req.param('resumeId'));

    const db = drizzle(c.env.DB);

    const matches = await db.select().from(resumeMatches).where(eq(resumeMatches.resumeId, resumeId));

    return c.json(matches);
})

resumeMatchApi.get('/getKeywords/:matchId', async (c) => {

    const matchId: number = parseInt(c.req.param('matchId'));

    const db = drizzle(c.env.DB);

    const keywords = (await db.select().from(matchKeywords).where(eq(matchKeywords.resumeMatchId, matchId)))[0];

    return c.json(keywords.keywords);
})

resumeMatchApi.delete('/:id', async (c) => {

    const matchId: number = parseInt(c.req.param('id'));

    const db = drizzle(c.env.DB);

    const deletedMatch = await deleteMatch(matchId, db);

    return c.json(deletedMatch);
})

export default resumeMatchApi