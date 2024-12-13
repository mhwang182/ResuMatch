import { Hono } from 'hono'
import { cors } from 'hono/cors';
import user from './user'
import resume from './resume';
import { jwtMiddleware, userIdMiddleware } from './middleware';
import jobs from './jobs';
import resumeMatch from './resumeMatch';



export type Env = {
  DB: D1Database,
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors())

// app.use(contextStorage())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.use('/resume/*', jwtMiddleware)
app.use('/resume/*', userIdMiddleware)
app.route('/resume', resume);

app.use('/job/*', jwtMiddleware)
app.use('job/*', userIdMiddleware)
app.route('/job', jobs);

app.use('/resume-match/*', jwtMiddleware)
app.use('resume-match/*', userIdMiddleware)
app.route('/resume-match', resumeMatch);

app.use('/user/getInfo', jwtMiddleware);
app.use('/user/getInfo', userIdMiddleware);
app.use('/user/updateRefreshVersion', jwtMiddleware);
app.use('/user/updateRefreshVersion', userIdMiddleware);

app.route('/user', user)

//iMSyqI5pL1GEqwBb supabase db password

export default app
