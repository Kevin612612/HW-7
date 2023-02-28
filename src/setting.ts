import express, {Request, Response} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// @ts-ignore
import device from 'express-device'
import {authRouter}     from "./routes/auth-router";
import {usersRouter}    from "./routes/users-router";
import {blogsRouter}    from "./routes/blogs-router";
import {postsRouter}    from "./routes/posts-router";
import {commentsRouter} from "./routes/comments-router";
import {emailRouter}    from "./routes/email-router";
import {deviceRouter}   from "./routes/security_devices-router";
import {testingRouter}  from "./routes/testing-router";
import {trainRouter}    from "./routes/train-router";


export const app = express()

const corsMiddleware = cors()
app.use(corsMiddleware)

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

app.use(cookieParser())

app.use(device.capture())

//HOME PAGE
app.get('/', (req: Request, res: Response) => {
    res.send(`<form>
  <label for="input">Enter your text:</label>
  <input type="text" id="input" name="input">
  <input type="submit" value="Submit">
</form>`)
})

//ROUTES
app.use('/auth', authRouter)
app.use('/security', deviceRouter)
app.use('/users', usersRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)
app.use('/email', emailRouter)

app.use('/testing', testingRouter)

app.use('/train', trainRouter)

