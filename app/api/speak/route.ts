import { NextResponse } from 'next/server';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) return NextResponse.json({ error: "No text provided" }, { status: 400 });

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
      return NextResponse.json({ error: "Speech Keys Missing" }, { status: 500 });
    }

    // Configure Azure Speech
    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechSynthesisVoiceName = "en-IN-NeerjaNeural"; // Indian English Voice

    // Create the synthesizer
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    // Convert text to audio stream
    const audioData = await new Promise<ArrayBuffer>((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            resolve(result.audioData);
          } else {
            reject(new Error("Speech synthesis failed: " + result.errorDetails));
          }
          synthesizer.close();
        },
        (error) => {
          synthesizer.close();
          reject(error);
        }
      );
    });

    // Return the audio file
    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
      },
    });

  } catch (error: any) {
    console.error("Speech Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}