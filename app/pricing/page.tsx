"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function PricingPage() {
    const [units, setUnits] = useState<number>(50);
    const [monthlyCost, setMonthlyCost] = useState<number>(0);

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

    useEffect(() => {
        setMonthlyCost(calculateCost(units || 0));
    }, [units]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
            <MarketingNavbar />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-gray-600">
                            Pay only for what you use. The more you grow, the less you pay per unit.
                        </p>
                    </div>

                    {/* Pricing Tiers Table */}
                    <Card className="mb-12 border-none shadow-md">
                        <CardHeader className="bg-white border-b">
                            <CardTitle>Volume-Based Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr className="border-b">
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Units Managed</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Price Per Unit</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Example Monthly Cost</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Time Saved</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {[
                                            { range: '1-100 units', price: '$3.00/unit', example: '50 units = $150/mo', time: '5 hours' },
                                            { range: '101-300 units', price: '$2.50/unit', example: '200 units = $500/mo', time: '20 hours' },
                                            { range: '301-500 units', price: '$2.00/unit', example: '400 units = $800/mo', time: '40 hours' },
                                            { range: '501+ units', price: '$1.50/unit', example: '600 units = $900/mo', time: '60 hours' },
                                        ].map((tier, i) => (
                                            <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                                <td className="py-4 px-6 font-medium">{tier.range}</td>
                                                <td className="py-4 px-6 text-blue-600 font-semibold">{tier.price}</td>
                                                <td className="py-4 px-6">{tier.example}</td>
                                                <td className="py-4 px-6 text-green-600">{tier.time}/month</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interactive Calculator */}
                    <Card className="mb-12 bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-900">Calculate Your Cost</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-blue-900">
                                        How many units do you manage?
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="Enter number of units"
                                            value={units}
                                            onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
                                            className="w-full max-w-xs h-12 text-lg bg-white border-blue-200 focus:ring-blue-500"
                                        />
                                        <div className="text-sm text-blue-700 font-medium">units</div>
                                    </div>
                                </div>
                                <div className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm">
                                    <div className="text-sm text-gray-500 font-medium mb-1">YEARLY ESTIMATED MONTHLY COST</div>
                                    <div className="text-4xl font-bold text-blue-600">
                                        ${monthlyCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Based on volume pricing. Lower per-unit cost as you scale.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What's Included */}
                    <Card className="mb-12 border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Everything Included</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    'Unlimited monthly reports',
                                    '3 professional PDF templates',
                                    'Automated email delivery',
                                    'CSV data upload (AppFolio & Buildium)',
                                    'Secure cloud storage',
                                    'Historical report access',
                                    'Customer support via email',
                                    'No setup fees',
                                    'No long-term contracts',
                                    'Cancel anytime',
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <Check className="text-green-600 mt-1 flex-shrink-0" size={20} />
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* FAQ */}
                    <Card className="mb-12 border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[
                                    {
                                        q: 'How does billing work?',
                                        a: 'Billing is monthly based on the number of units you manage. We automatically calculate your price using our volume discount tiers.',
                                    },
                                    {
                                        q: 'Can I change my plan?',
                                        a: 'Your plan adjusts automatically based on your unit count. As you add or remove properties, your billing updates accordingly.',
                                    },
                                    {
                                        q: 'What if I add more properties?',
                                        a: 'Simply add the new properties in your dashboard. Your next invoice will reflect the updated unit count with appropriate volume discounts.',
                                    },
                                    {
                                        q: 'Is there a contract?',
                                        a: 'No. PropAuto is month-to-month. Cancel anytime with no penalties or fees.',
                                    },
                                    {
                                        q: 'What payment methods do you accept?',
                                        a: 'We accept all major credit cards via Paddle, our payment processor. Paddle handles billing securely.',
                                    },
                                    {
                                        q: 'Can I cancel anytime?',
                                        a: 'Yes. Cancel anytime through the billing portal. You\'ll retain access until the end of your billing period.',
                                    },
                                ].map((faq, i) => (
                                    <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                                        <h3 className="font-semibold mb-2 text-slate-800">{faq.q}</h3>
                                        <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA */}
                    <div className="text-center">
                        <Link href="/auth/signup">
                            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                                Start Your Free 14-Day Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <p className="mt-4 text-sm text-gray-600">
                            No credit card required • Full access • Cancel anytime
                        </p>
                    </div>
                </div>
            </div>

            <MarketingFooter />
        </div>
    )
}
