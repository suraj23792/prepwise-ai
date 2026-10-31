const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY
});

const PRIMARY_MODEL = "gemini-flash-latest";
const FALLBACK_MODELS = ["gemini-flash-lite-latest", "gemini-3-flash-preview"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Gemini 503/429 aaye to retry karta hai, phir dusre model par jata hai
async function generateWithRetry(params) {
    const models = [PRIMARY_MODEL, ...FALLBACK_MODELS];
    let lastError;

    for (const model of models) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                return await ai.models.generateContent({ ...params, model });
            } catch (error) {
                lastError = error;
                const status = error.status;
                console.error(`Gemini call failed (model: ${model}, attempt: ${attempt}, status: ${status})`);

                if (status === 404) break; // model available nahi -> agla model
                if (status !== 503 && status !== 429 && status !== 500) throw error;
                await sleep(1500 * attempt);
            }
        }
    }
    throw lastError;
}

// Gemini response se JSON nikalta hai
function extractJson(response) {
    const text =
        response.candidates?.[0]?.content?.parts?.[0]?.text || response.text;

    if (!text) throw new Error("Empty response from Gemini");

    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
}

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Generate a COMPLETE interview report in STRICT JSON format.

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "matchScore": 85,
  "title": "Node.js Developer",

  "technicalQuestions": [
    {
      "question": "Explain Node.js event loop",
      "intention": "Check async programming knowledge",
      "answer": "Explain call stack, event loop, callback queue and provide examples"
    }
  ],

  "behavioralQuestions": [
    {
      "question": "Tell me about a challenge",
      "intention": "Evaluate problem solving",
      "answer": "Use STAR method"
    }
  ],

  "skillGaps": [
    {
      "skill": "MongoDB",
      "severity": "medium"
    }
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "Node.js Fundamentals",
      "tasks": [
        "Revise event loop",
        "Practice async-await"
      ]
    }
  ]
}

IMPORTANT:
- Return ONLY JSON
- Do NOT return markdown
- Do NOT add explanation text
- technicalQuestions MUST be array of objects
- behavioralQuestions MUST be array of objects
- skillGaps MUST be array of objects
- preparationPlan MUST be array of objects

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`

    try {
        const response = await generateWithRetry({
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        return extractJson(response);
    } catch (error) {
        console.error("gemini api request failed:", error);
        throw new Error("failed to generate interview report");
    }
}

async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
        waitUntil: "networkidle0"
    });

    const pdfBuffer = await page.pdf({
        format: "A4",

        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();

    return pdfBuffer;
}

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Generate a professional ATS-friendly resume in HTML format.

Return ONLY valid JSON in this exact format:

{
  "html": "<html>...</html>"
}

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Requirements:
- Professional design
- ATS friendly
- 1-2 pages
- Tailored for job description
- Proper HTML structure
- No markdown
- No explanation text
`;

    const response = await generateWithRetry({
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    const jsonContent = extractJson(response);

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
};