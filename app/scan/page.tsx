"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Scan, FileText, AlertTriangle, CheckCircle, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
    const [status, setStatus] = useState("idle"); // idle, scanning, done, error
    const [result, setResult] = useState("");
    const [preview, setPreview] = useState<string | null>(null);

    async function handleUpload(e: any) {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview immediately
        setPreview(URL.createObjectURL(file));
        setStatus("scanning");
        setResult("");

        const formData = new FormData();
        formData.append("image", file);

        try {
            // Call our API (The one you just built)
            const res = await fetch('/api/analyze', { method: 'POST', body: formData });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setResult(data.text);
            setStatus("done");
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    }

    async function playAudio(textToSpeak: string) {
        try {
            const res = await fetch('/api/speak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToSpeak }),
            });

            const blob = await res.blob();
            const audio = new Audio(URL.createObjectURL(blob));
            audio.play();
        } catch (err) {
            console.error("Audio Failed", err);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center">
            {/* Header */}
            <div className="max-w-2xl w-full text-center mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                    Drishti AI
                </h1>
                <p className="text-slate-400">Rural Fraud Detection Agent</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">

                {/* Left Side: Scanner */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Scan className="w-5 h-5 text-blue-400" />
                            Upload Document
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-lg m-4 hover:bg-slate-800/50 transition-colors relative">

                        {preview ? (
                            <img src={preview} alt="Preview" className="h-full object-contain" />
                        ) : (
                            <div className="text-center">
                                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                <p className="text-sm text-slate-400">Click to upload or drag image</p>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </CardContent>
                </Card>

                {/* Right Side: Results */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <FileText className="w-5 h-5 text-green-400" />
                            Analysis Result
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 overflow-y-auto font-mono text-sm bg-black/40 p-4 rounded-md">

                        {status === "idle" && (
                            <p className="text-slate-600">Waiting for scan...</p>
                        )}

                        {status === "scanning" && (
                            <div className="flex flex-col items-center justify-center h-full text-blue-400 animate-pulse">
                                <Scan className="w-10 h-10 mb-2 animate-spin" />
                                Scanning with Azure Vision...
                            </div>
                        )}

                        {status === "done" && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="font-bold">Text Extracted Successfully</span>
                                </div>
                                <Button
                                    onClick={() => playAudio(result)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white w-full"
                                >
                                    <Volume2 className="mr-2 h-4 w-4" /> Listen to Analysis
                                </Button>
                                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed border-l-2 border-green-500/30 pl-4">
                                    {result}
                                </p>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertTriangle className="w-5 h-5" />
                                <span>Failed to analyze image. Check your keys.</span>
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}