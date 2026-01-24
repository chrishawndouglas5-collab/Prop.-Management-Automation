import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import { Mail, MessageCircle, FileText } from 'lucide-react'

export default function HelpPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-10">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    How can we help?
                </h1>
                <p className="text-xl text-muted-foreground">
                    Find answers to common questions or reach out to our team.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-white/10 bg-card/30 glass flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-brand-DEFAULT/10 flex items-center justify-center text-brand-DEFAULT">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">Documentation</h3>
                        <p className="text-sm text-muted-foreground">Detailed guides on using the platform.</p>
                    </div>
                    <Button variant="outline" className="w-full">View Docs</Button>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-card/30 glass flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-accent-teal/10 flex items-center justify-center text-accent-teal">
                        <MessageCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">Live Chat</h3>
                        <p className="text-sm text-muted-foreground">Chat with our support team.</p>
                    </div>
                    <Button variant="outline" className="w-full">Start Chat</Button>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-card/30 glass flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">Email Support</h3>
                        <p className="text-sm text-muted-foreground">Get help via email.</p>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                        <a href="mailto:support@propauto.com">Send Email</a>
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-white/10">
                        <AccordionTrigger>How do I upload my property data?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Go to the <strong>Upload</strong> page in your dashboard. You can drag and drop CSV files exported directly from AppFolio or Buildium. We automatically map columns to our system.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-white/10">
                        <AccordionTrigger>When are monthly reports generated?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Reports are automatically generated on the <strong>1st of every month</strong> for the previous month's data. You can also trigger them manually from the <strong>Reports</strong> page at any time.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-white/10">
                        <AccordionTrigger>Can I edit a report after it's generated?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Currently, PDF reports are immutable once generated. If you notice an error in the data, please fix the source data via a new upload and regenerate the report manually.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="border-white/10">
                        <AccordionTrigger>How do I add a new property?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            You can add properties manually via the <strong>Properties</strong> page, or they will be automatically created when you upload a CSV that contains transactions for a new property name.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}
