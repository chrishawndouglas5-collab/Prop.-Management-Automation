
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, CheckCircle, FileText, Mail } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 font-sans">
      {/* Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <BarChart3 className="h-6 w-6 text-brand-500" />
          <span className="font-bold text-lg tracking-tight">PropAuto</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-brand-400 transition-colors flex items-center" href="/auth/login">
            Log In
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="bg-brand-600 hover:bg-brand-500 text-white border-none">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 flex flex-col items-center text-center px-4 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] -z-10" />

          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-brand-300">
              <span className="flex h-2 w-2 rounded-full bg-brand-400 mr-2 animate-pulse"></span>
              Now Available in Beta
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
              Automate Your Property Management Reports
            </h1>
            <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stop manually creating monthly reports. Upload your AppFolio or Buildium CSVs and generate professional PDF reports + emails for your owners in seconds.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="h-12 px-8 bg-brand-600 hover:bg-brand-500 text-white w-full sm:w-auto">
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="h-12 px-8 border-white/10 hover:bg-white/5 w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-900/50 border-y border-white/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white/5 border-white/10 text-zinc-100">
                <CardHeader>
                  <FileText className="h-10 w-10 text-brand-400 mb-2" />
                  <CardTitle>CSV to PDF</CardTitle>
                </CardHeader>
                <CardContent>
                  Upload your raw data exports and instantly transform them into beautiful, branded PDF reports for each property owner.
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 text-zinc-100">
                <CardHeader>
                  <Mail className="h-10 w-10 text-brand-400 mb-2" />
                  <CardTitle>Automated Emailing</CardTitle>
                </CardHeader>
                <CardContent>
                  Send reports directly to owners with one click. We handle the email delivery via simple, reliable templates.
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 text-zinc-100">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-brand-400 mb-2" />
                  <CardTitle>History & Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  Keep track of every report sent. View open rates and historical data to ensure your owners are always informed.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Focus on Management, Not Paperwork</h2>
                <p className="text-zinc-400 text-lg">
                  Property managers spend countless hours formatting spreadsheets and drafting emails. PropAuto gives you that time back.
                </p>
                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle className="h-5 w-5 text-brand-500" />
                    <span>Eliminate manual formatting errors</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle className="h-5 w-5 text-brand-500" />
                    <span>Look more professional to your clients</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle className="h-5 w-5 text-brand-500" />
                    <span>Scale your portfolio without scaling admin time</span>
                  </li>
                </ul>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative rounded-xl border border-white/10 bg-zinc-900/90 aspect-video flex items-center justify-center p-8">
                  <span className="text-zinc-500 font-mono">Dashboard Preview Placeholder</span>
                  {/* Ideally replace with an actual screenshot image later */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-white/10 bg-zinc-950">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">© 2026 Abas Solutions. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-zinc-400 hover:text-white" href="/terms">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-zinc-400 hover:text-white" href="/privacy">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
