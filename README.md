# 🚀 AI-Powered Interview Preparation Platform

An AI-powered full-stack web application that helps students and job seekers prepare for interviews by analyzing resumes and job descriptions. The platform generates personalized interview reports, identifies skill gaps, suggests resume improvements, and creates customized technical and behavioral interview questions using **Google Gemini AI**.

---

## ✨ Features

- 📄 Upload resumes in PDF format
- 🤖 AI-powered resume analysis using Gemini AI
- 🎯 Job description based interview preparation
- 📊 Skill gap analysis
- 📝 Resume improvement suggestions
- 💡 Personalized technical interview questions
- 🗣️ Behavioral interview question generation
- 🔐 Secure JWT Authentication
- 👤 User-specific dashboard and report history
- 📁 Secure file upload using Multer
- ⚡ RESTful API architecture
- 💾 Persistent storage using MongoDB

---

## 🏗️ Architecture

```
                 +----------------------+
                 |      React Client    |
                 +----------+-----------+
                            |
                        REST APIs
                            |
                 +----------v-----------+
                 |   Express.js Server  |
                 +----------+-----------+
                            |
          +-----------------+----------------+
          |                                  |
   MongoDB Database                 Gemini AI API
          |                                  |
     User Reports                  AI Generated Reports
```

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- JavaScript
- Axios

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB

### Authentication
- JWT (JSON Web Tokens)

### AI
- Google Gemini API

### Other Tools
- Multer
- Git
- GitHub
- Postman

---

## 📂 Project Structure

```
AI-Interview-Preparation-Platform
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── package.json
│
├── screenshots/
│
├── README.md
├── .gitignore
└── .env.example
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-Interview-Preparation-Platform.git
```

```bash
cd AI-Interview-Preparation-Platform
```

---

### Backend

```bash
cd server
npm install
npm run dev
```

---

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```


## 📌 Future Improvements

- AI Chat with generated interview reports
- Company-wise interview preparation
- Mock interview simulator
- Interview progress tracking
- Resume scoring system
- Email notifications
- Dark mode
- Docker deployment

---

## 📖 What I Learned

- Building scalable REST APIs
- JWT Authentication & Authorization
- MongoDB schema design
- Secure file upload using Multer
- Prompt engineering with Gemini AI
- Full-stack MERN application development
- Integrating Generative AI into real-world applications

---

## 👨‍💻 Author

**Jagadampelli Rushendra**

- GitHub: https://github.com/RushendraJ
- LinkedIn: https://linkedin.com/in/rushendra-j/

---

## ⭐ If you found this project useful, consider giving it a star!
