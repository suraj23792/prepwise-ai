const rateLimit = require("express-rate-limit")
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "https://prepwise-ai.vercel.app"],
    credentials: true
}))

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // हर IP को 15 मिनट में max 100 requests
    message: {
        message: "Too many requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
})
app.use(limiter)
/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

// using all the routes here
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)


module.exports = app