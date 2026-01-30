export default function RefundPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>

            <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-gray-400 mb-8">
                    <strong>Last Updated:</strong> January 26, 2025
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">Payment Processing</h2>
                    <p className="mb-4">
                        All payments for PropAuto are processed by Paddle.com Market Limited ("Paddle"),
                        our authorized reseller and Merchant of Record. PropAuto is operated by
                        Chrishawn Abas doing business as Abas Solutions.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">Refund Policy</h2>
                    <p className="mb-4">
                        Refunds are provided at the sole discretion of Paddle and on a case-by-case
                        basis and may be refused. Paddle will refuse a refund request if we find
                        evidence of fraud, refund abuse, or other manipulative behaviour that
                        entitles Paddle to counterclaim the refund.
                    </p>
                    <p className="mb-4">
                        This does not affect your rights as a Consumer in relation to Products
                        which are not as described, faulty or not fit for purpose.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">How to Request a Refund</h2>
                    <p className="mb-4">
                        To request a refund, please contact Paddle support:
                    </p>
                    <p className="mb-4">
                        Email: <a href="mailto:support@paddle.com" className="text-brand-DEFAULT hover:underline">support@paddle.com</a><br />
                        Website: <a href="https://paddle.com/support" target="_blank" rel="noopener noreferrer" className="text-brand-DEFAULT hover:underline">paddle.com/support</a>
                    </p>
                    <p className="mb-4">
                        You may also contact us and we will forward your request to Paddle:
                    </p>
                    <p className="mb-4">
                        Abas Solutions<br />
                        Email: <a href="mailto:support@abassolutions.net" className="text-brand-DEFAULT hover:underline">support@abassolutions.net</a>
                    </p>
                </section>
            </div>
        </div>
    )
}
