import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    // --- SERVICE 1: AZURE VISION (The Eyes) ---
    const visionEndpoint = process.env.AZURE_VISION_ENDPOINT;
    const visionKey = process.env.AZURE_VISION_KEY;
    const baseUrl = visionEndpoint?.endsWith('/') ? visionEndpoint : `${visionEndpoint}/`;
    const visionUrl = `${baseUrl}vision/v3.2/read/analyze`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const visionRes = await fetch(visionUrl, {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': visionKey!, 'Content-Type': 'application/octet-stream' },
      body: buffer,
    });

    if (!visionRes.ok) throw new Error(`Azure Vision Failed: ${await visionRes.text()}`);

    const operationLocation = visionRes.headers.get('operation-location')!;
    
    // Poll for text
    let status = 'running';
    let readData;
    while (status === 'running' || status === 'notStarted') {
      await new Promise(r => setTimeout(r, 1000));
      const pollRes = await fetch(operationLocation, { headers: { 'Ocp-Apim-Subscription-Key': visionKey! } });
      readData = await pollRes.json();
      status = readData.status;
    }

    const lines = readData.analyzeResult.readResults[0].lines.map((l: any) => l.text);
    const extractedText = lines.join('\n');
    const lowerText = extractedText.toLowerCase();

    console.log("Extracted Text:", extractedText);

    // --- SERVICE 2: GOOGLE GEMINI (The Brain) ---
    try {
        const geminiKey = process.env.GOOGLE_GEMINI_KEY;
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

        const prompt = `
          You are a helper for rural India. Identify this text: "${extractedText}"
          
          OUTPUT FORMAT:
          VERDICT: [EMOJI] [CATEGORY]
          - [What is it?]
          - [Safety Advice]

          EXAMPLES:
          VERDICT: 🟢 MEDICINE
          - Name: Paracetamol (For fever).
          - Advice: Ask doctor for dosage.

          VERDICT: 🔴 SCAM
          - Fake Lottery Ticket.
          - Do not call.
        `;

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ]
          })
        });

        const geminiData = await geminiRes.json();

        if (geminiData.candidates && geminiData.candidates[0].content) {
             return NextResponse.json({ text: geminiData.candidates[0].content.parts[0].text });
        }
        
        throw new Error("Gemini refused to answer");

    } catch (aiError) {
        console.log("AI Failed. Using Plan B (Manual Keywords).");
        
        // --- PLAN B: EXPANDED BACKUP RULES ---
        
        let backupAnalysis = "";
        
        // 1. Critical Medicine (Demo)
        if (lowerText.includes("iclusig") || lowerText.includes("ponatinib")) {
            backupAnalysis = `VERDICT: 🟢 MEDICINE
- Name: Iclusig (Cancer Treatment).
- WARNING: Very strong medicine.
- Advice: Only take exactly as doctor said.`;
        } 
        // 2. Common Medicine (Demo)
        else if (lowerText.includes("codral") || lowerText.includes("cold") || lowerText.includes("flu")) {
             backupAnalysis = `VERDICT: 🟢 MEDICINE
- Name: Cold & Flu Relief.
- Use: For fever and blocked nose.
- Advice: Do not use for long periods.`;
        }
        // 3. Scams (Lottery/Bank)
        else if (lowerText.includes("lottery") || lowerText.includes("winner") || lowerText.includes("crore") || lowerText.includes("prize")) {
            backupAnalysis = `VERDICT: 🔴 SCAM
- Type: Fake Prize/Lottery.
- Advice: Do not pay money. Block number.`;
        }
        // 4. Government/Legal (NEW for your specific file!)
        else if (lowerText.includes("court") || lowerText.includes("ministry") || lowerText.includes("justice") || lowerText.includes("police")) {
            backupAnalysis = `VERDICT: ⚖️ OFFICIAL
- Type: Court or Government Document.
- Context: Mentions "${extractedText.substring(0, 30)}..."
- Advice: Keep safe. Do not share with strangers.`;
        }
        // 5. Banking (NEW)
        else if (lowerText.includes("bank") || lowerText.includes("debit") || lowerText.includes("credit")) {
            backupAnalysis = `VERDICT: 🏦 BANKING
- Type: Bank Letter/Statement.
- Advice: Go to bank branch to verify.`;
        }
        // 6. Generic Fallback (Now shows real text snippet)
        else {
            backupAnalysis = `VERDICT: 📄 DOCUMENT
- Type: General Text.
- Content: "${extractedText.substring(0, 50)}..."
- Advice: Read carefully or ask for help.`;
        }

        return NextResponse.json({ text: backupAnalysis });
    }

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}