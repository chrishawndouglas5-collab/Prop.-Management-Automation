import Link from "next/link";

export function MarketingFooter() {
    return (
        <footer className="border-t bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-semibold mb-3">Product</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="/pricing" className="hover:text-gray-900">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/features" className="hover:text-gray-900">
                                    Features
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="/contact" className="hover:text-gray-900">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="/terms" className="hover:text-gray-900">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-gray-900">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund-policy" className="hover:text-gray-900">
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Contact</h3>
                        <p className="text-sm text-gray-600">
                            Abas Solutions
                            <br />
                            Email: support@abassolutions.net
                        </p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} PropAuto by Abas Solutions. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
