require("dotenv").config()
const dns = require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"])

const request = require("supertest")
const mongoose = require("mongoose")
const app = require("../src/app")
const userModel = require("../src/models/user.model")

// टेस्ट शुरू होने से पहले डेटाबेस से कनेक्ट करेंगे
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
    await userModel.deleteMany({ email: "testuser@example.com" })
}, 15000)

// सारे टेस्ट खत्म होने के बाद डेटाबेस कनेक्शन बंद कर देंगे
afterAll(async () => {
    await userModel.deleteMany({ email: "testuser@example.com" })
    await mongoose.connection.close()
}, 15000)

describe("POST /api/auth/register", () => {

    test("should fail if username, email or password is missing", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({ email: "testuser@example.com" })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("please provide username,email and password")
    })

    test("should register a new user successfully", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser123",
                email: "testuser@example.com",
                password: "TestPassword123"
            })

        expect(response.status).toBe(201)
        expect(response.body.message).toBe("User registered Successfully")
        expect(response.body.user.email).toBe("testuser@example.com")
    })

    test("should fail if account already exists with same email", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "anotherusername",
                email: "testuser@example.com",
                password: "TestPassword123"
            })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Account already exists with this username or email")
    })

})