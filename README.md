# 👁️ Drishti AI

**Universal Accessibility & Fraud Detection for Rural India**

Drishti AI is a "Super-App" designed to empower visually impaired and low-literacy users in rural India. It uses advanced Computer Vision and Generative AI to "read" physical documents, detect financial scams, and explain complex medical labels in simple language.

![Drishti AI Demo](public/demo-screenshot.png) 
*(Add a screenshot of your app here)*

## 🚀 Features

* **🔍 AI Document Scanning:** Instantly extracts text from images using **Azure AI Vision**.
* **🧠 Intelligent Analysis:** Detects scams (lottery/phishing) vs. essential documents (medicine/government) using a **Hybrid AI Engine** (Google Gemini + Local Fail-Safe).
* **🔊 Voice Guidance:** Reads the analysis aloud using **Azure AI Speech** for accessibility.
* **🛡️ Fail-Safe Protection:** Includes a local fallback system to identify critical medical warnings even if cloud AI is blocked.
* **🇮🇳 Rural-First Design:** Optimized for low-bandwidth scenarios with simple, high-contrast UI.

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Shadcn UI
* **Cloud Services (The "Eyes" & "Voice"):**
    * **Azure AI Vision (v3.2):** High-precision Optical Character Recognition (OCR).
    * **Azure AI Speech:** Neural Text-to-Speech (TTS) for Indian English accents.
* **LLM Engine (The "Brain"):**
    * **Google Gemini 1.5 Pro:** For semantic understanding and summarization.

## ⚙️ Architecture

Drishti AI uses a **Hybrid Cloud Architecture**:
1.  **Input:** User uploads an image via the Next.js frontend.
2.  **Processing:** The image is sent to **Azure Computer Vision** (Korea Central Region) to extract raw text lines.
3.  **Analysis:** The text is passed to **Google Gemini** with a custom prompt engineer to generate a "Verdict" (SAFE/SCAM/MEDICINE).
4.  **Fail-Safe:** If the LLM refuses to answer (due to safety filters on medical terms), a local Node.js logic layer intervenes to identify critical keywords (e.g., "Iclusig", "Lottery").
5.  **Output:** The final verdict is displayed visually and converted to audio using **Azure Speech**.

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/drishti-ai.git](https://github.com/your-username/drishti-ai.git)
    cd drishti-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your keys:
    ```env
    # Azure Computer Vision
    AZURE_VISION_KEY=your_vision_key
    AZURE_VISION_ENDPOINT=[https://your-region.api.cognitive.microsoft.com/](https://your-region.api.cognitive.microsoft.com/)

    # Azure Speech Service
    AZURE_SPEECH_KEY=your_speech_key
    AZURE_SPEECH_REGION=koreacentral

    # Google Gemini
    GOOGLE_GEMINI_KEY=your_gemini_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏆 Use Case

Built for the **Microsoft Imagine Cup 2026** (Lifestyle / Accessibility Category).

> "For the 300 million Indians who cannot read complex English, Drishti AI acts as a digital shield against financial fraud and accidental medical misuse."

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
