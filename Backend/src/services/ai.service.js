const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

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
`;

    const response = await ai.models.generateContent({
       model: "gemini-flash-latest",
        contents: prompt,

        config: {
            responseMimeType: "application/json"
        }
    });

    const text =
        response.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("RAW GEMINI RESPONSE:");
    console.log(text);

    const parsedData = JSON.parse(text);

    return parsedData;
}

async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch();

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

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: prompt,

        config: {
            responseMimeType: "application/json"
        }
    });

    const text =
        response.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("RESUME RESPONSE:");
    console.log(text);

    const jsonContent = JSON.parse(text);

    const pdfBuffer = await generatePdfFromHtml(
        jsonContent.html
    );

    return pdfBuffer;
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
};