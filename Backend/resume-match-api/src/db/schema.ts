import { sql } from "drizzle-orm";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const users = table(
    "users",
    {
        id: t.text().primaryKey().notNull(),
        username: t.text().notNull(),
        email: t.text().notNull(),
        password: t.text().notNull(),
        refreshVersion: t.int("refresh_version").default(0),
        createdAt: t.text("created_at").notNull().default(sql`(current_timestamp)`)
    },
    (table) => {
        return {
            emailIndex: t.uniqueIndex("email_idx").on(table.email),
            usernameIndex: t.uniqueIndex("username_idx").on(table.username)
        };
    }
);

export const resumes = table(
    "resumes",
    {
        id: t.int().primaryKey({ autoIncrement: true }).notNull(),
        userId: t.text("user_id").references(() => users.id).notNull(),
        name: t.text().notNull(),
        role: t.text().notNull(),
        description: t.text().notNull(),
        //TODO: link to file
        content: t.text().notNull().default(""),
        createdAt: t.text("created_at").notNull().default(sql`(current_timestamp)`)
    }
)

export const jobs = table(
    "jobs",
    {
        id: t.int().primaryKey({ autoIncrement: true }).notNull(),
        userId: t.text("user_id").references(() => users.id).notNull(),
        role: t.text().notNull(),
        company: t.text().notNull(),
        jobDescription: t.text("job_description").notNull(),
        location: t.text(),
        createdAt: t.text("created_at").notNull().default(sql`(current_timestamp)`)
    }
)

export const resumeMatches = table(
    "resume_matches",
    {
        id: t.int().primaryKey({ autoIncrement: true }).notNull(),
        jobId: t.int("job_id").references(() => jobs.id).notNull(),
        status: t.text().default("PENDING"),
        resumeId: t.int("resume_id").references(() => resumes.id),
        resumeName: t.text("resume_name")
    }
)

export const matchKeywords = table(
    "match_keywords",
    {
        id: t.int().primaryKey({ autoIncrement: true }).notNull(),
        resumeMatchId: t.int("resume_match_id").references(() => resumeMatches.id),
        keywords: t.text().notNull(),
    }
)