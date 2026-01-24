"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";

export default function PricingPage() {
    const [units, setUnits] = useState<number>(50);

    const calculateCost = (quantity: number) => {
        let cost = 0;
        let remaining = quantity;

        // Tier 1: 1-100 units at $3.00
        if (remaining > 0) {
            const count = Math.min(remaining, 100);
            cost += count * 3.00;
            remaining -= count;
        }

        // Tier 2: 101-300 units at $2.50
        if (remaining > 0) {
            const count = Math.min(remaining, 200);
            cost += count * 2.50;
            remaining -= count;
        }

        // Tier 3: 301-500 units at $2.00
        if (remaining > 0) {
            const count = Math.min(remaining, 200);
            cost += count * 2.00;
            remaining -= count;
        }

        // Tier 4: 501+ units at $1.50
        if (remaining > 0) {
            cost += remaining * 1.50;
        }

        return cost;
    };

    const monthlyCost = calculateCost(units || 0);

    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 font-sans">
            <header className="px-6 h-16 flex items-center justify-between border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
                <Link className="flex items-center justify-center gap-2" href="/">
                    <span className="font-bold text-lg tracking-tight">PropAuto</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                    <Link className="text-sm font-medium hover:text-brand-400 transition-colors" href="/pricing">Pricing</Link>
                    <Link className="text-sm font-medium hover:text-brand-400 transition-colors" href="/auth/login">Log In</Link>
                    <Link href="/auth/signup">
                        <Button size="sm" className="bg-brand-600 hover:bg-brand-500 text-white border-none">Get Started</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1 py-12 md:py-24">
                <div className="container px-4 md:px-6 mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Automated property owner reports that scale with your business.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
                        {/* Calculator Card */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-2xl text-white">Estimate Your Cost</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">
                                        How many units do you manage?
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={units}
                                        onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
                                        className="bg-zinc-950 border-zinc-800 text-white h-12 text-lg"
                                    />
                                </div>

                                <div className="p-6 bg-brand-900/10 rounded-xl border border-brand-500/20 text-center">
                                    <div className="text-sm text-brand-300 font-medium mb-1">YOUR ESTIMATED MONTHLY COST</div>
                                    <div className="text-5xl font-bold text-white mb-2">
                                        ${monthlyCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="text-sm text-zinc-500">
                                        Auto-adjusts based on volume
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-zinc-800">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="text-zinc-400">1-100 units</div>
                                        <div className="text-right text-white font-medium">$3.00 / unit</div>
                                        <div className="text-zinc-400">101-300 units</div>
                                        <div className="text-right text-white font-medium">$2.50 / unit</div>
                                        <div className="text-zinc-400">301-500 units</div>
                                        <div className="text-right text-white font-medium">$2.00 / unit</div>
                                        <div className="text-zinc-400">501+ units</div>
                                        <div className="text-right text-white font-medium">$1.50 / unit</div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href="/auth/signup" className="w-full">
                                    <Button size="lg" className="w-full bg-brand-600 hover:bg-brand-500 text-white">
                                        Start Free Trial
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                    <p className="text-xs text-center text-zinc-500 mt-3">
                                        14-day free trial. No credit card required.
                                    </p>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Features List */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white">Everything included:</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Unlimited monthly reports",
                                        "3 professional PDF templates",
                                        "Automated email delivery",
                                        "CSV data upload (AppFolio & Buildium)",
                                        "Secure cloud storage",
                                        "Priority email support",
                                        "No setup fees or contracts"
                                    ].map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-zinc-300">
                                            <Check className="h-5 w-5 text-brand-500 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-zinc-800">
                                <h3 className="text-xl font-bold text-white">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    {[
                                        { q: "How does billing work?", a: "We bill monthly based on the number of units you manage." },
                                        { q: "Can I cancel anytime?", a: "Yes, there are no long-term contracts. You can cancel directly from your dashboard." },
                                        { q: "What payment methods do you accept?", a: "We accept all major credit cards and PayPal via our secure payment processor, Paddle." }
                                    ].map((faq, i) => (
                                        <div key={i} className="space-y-1">
                                            <h4 className="font-medium text-white">{faq.q}</h4>
                                            <p className="text-sm text-zinc-400">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer will be injected by layout or we can add a simplified one here */}
        </div>
    );
}
