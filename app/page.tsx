import Link from 'next/link';
import { ShieldCheck, Scan, Globe, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Drishti AI
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-slate-400 hover:text-white transition">Login</Link>
          <Link href="/scan">
            <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
              Launch App
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-6 p-3 bg-blue-500/10 rounded-full text-blue-400 border border-blue-500/20 text-sm font-medium animate-fade-in">
          Powered by Azure AI & Gemini
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Fraud Detection for <br />
          <span className="text-blue-500">Rural India</span>
        </h1>
        
        <p className="text-slate-400 max-w-2xl text-lg mb-10">
          Instant document scanning to detect lottery scams, fake bank notices, and phishing attempts using advanced AI.
        </p>

        <div className="flex gap-4">
          <Link href="/scan">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 text-lg">
              <Scan className="mr-2 h-5 w-5" /> Start Scanning
            </Button>
          </Link>
          <Button variant="secondary" size="lg" className="h-12 text-lg bg-slate-800 text-white hover:bg-slate-700">
            How it Works
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl w-full text-left">
          <FeatureCard 
            icon={<ShieldCheck className="h-8 w-8 text-green-400" />}
            title="99% Accuracy"
            desc="Detects fake lottery tickets and banking scams instantly."
          />
          <FeatureCard 
            icon={<Globe className="h-8 w-8 text-purple-400" />}
            title="Multi-Language"
            desc="Reads English, Hindi, and regional text from images."
          />
          <FeatureCard 
            icon={<Lock className="h-8 w-8 text-orange-400" />}
            title="Secure & Private"
            desc="Your data is analyzed securely and never shared."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 text-sm">
        © 2025 Drishti AI. Built for Microsoft Imagine Cup.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-slate-100">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}
