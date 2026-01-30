import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export function MarketingNavbar() {
    return (
        <nav className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    PropAuto
                </Link>
                <div className="flex items-center gap-2 md:gap-6">
                    <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
                        Pricing
                    </Link>
                    <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
                        Features
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
                        Contact
                    </Link>
                    <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">
                        Login
                    </Link>
                    <Link href="/auth/signup">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">Start Free Trial</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
