import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-zinc-950 py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12 text-sm">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white mb-2">PropAuto</h3>
                        <p className="text-zinc-400 max-w-xs">
                            Automated property management reporting built for modern property managers.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Product</h3>
                        <ul className="space-y-2 text-zinc-400">
                            <li>
                                <Link href="/pricing" className="hover:text-brand-400 transition-colors">Pricing</Link>
                            </li>
                            <li>
                                <Link href="/auth/signup" className="hover:text-brand-400 transition-colors">Sign Up</Link>
                            </li>
                            <li>
                                <Link href="/auth/login" className="hover:text-brand-400 transition-colors">Log In</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Legal</h3>
                        <ul className="space-y-2 text-zinc-400">
                            <li>
                                <Link href="/terms" className="hover:text-brand-400 transition-colors">Terms & Conditions</Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/refund-policy" className="hover:text-brand-400 transition-colors">Refund Policy</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Contact</h3>
                        <div className="space-y-2 text-zinc-400">
                            <p>Abas Solutions</p>
                            <p>Email: <a href="mailto:support@abassolutions.net" className="hover:text-brand-400 transition-colors">support@abassolutions.net</a></p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                    <p>© {new Date().getFullYear()} Abas Solutions. All rights reserved.</p>
                    <p>Made for Property Managers.</p>
                </div>
            </div>
        </footer>
    );
}
