export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic CORS — allow your deployed frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { problem, code } = req.body;

  if (!problem || !code) {
    return res.status(400).json({ error: 'Missing problem or code' });
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const prompt = `You are a strict C++ code evaluator for a coding practice platform.
Evaluate the submitted solution for correctness and logic quality.
Respond ONLY with a valid JSON object. No markdown, no extra text, no code fences.
Format exactly: {"pass": true/false, "logic_score": 0-100, "feedback": "one concise sentence"}
Scoring rubric: 90-100 = optimal solution, 70-89 = correct but suboptimal, 40-69 = partially correct or flawed logic, 0-39 = incorrect or does not solve the problem.

Problem:
${problem}

Submitted code:
${code}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 256,
          }
        })
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}));
      return res.status(502).json({ error: err?.error?.message || `Gemini error ${geminiRes.status}` });
    }

    const data = await geminiRes.json();
    const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = raw.replace(/```json|```/g, '').trim();

    // Validate it's real JSON before sending back
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: `Evaluation failed: ${err.message}` });
  }
}
